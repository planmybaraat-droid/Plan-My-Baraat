-- Attendance business-day locking, night shifts, reminders and audited correction.
-- Existing attendance records and UI concepts are preserved.

CREATE TABLE IF NOT EXISTS public.crm_attendance_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business_timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  lock_time TIME NOT NULL DEFAULT '05:00',
  punch_in_reminder_minutes INTEGER NOT NULL DEFAULT 15 CHECK (punch_in_reminder_minutes BETWEEN 0 AND 240),
  punch_out_reminder_minutes INTEGER NOT NULL DEFAULT 15 CHECK (punch_out_reminder_minutes BETWEEN 0 AND 240),
  final_reminder_minutes INTEGER NOT NULL DEFAULT 30 CHECK (final_reminder_minutes BETWEEN 5 AND 180),
  daily_report_reminder_time TIME NOT NULL DEFAULT '21:00',
  working_days SMALLINT[] NOT NULL DEFAULT ARRAY[1,2,3,4,5,6]::SMALLINT[],
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.crm_users(id) ON DELETE SET NULL
);
INSERT INTO public.crm_attendance_settings(id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.crm_attendance ADD COLUMN IF NOT EXISTS punch_in_at TIMESTAMPTZ;
ALTER TABLE public.crm_attendance ADD COLUMN IF NOT EXISTS punch_out_at TIMESTAMPTZ;
ALTER TABLE public.crm_notifications ADD COLUMN IF NOT EXISTS dedupe_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS crm_notifications_recipient_dedupe_idx
ON public.crm_notifications(recipient_id, dedupe_key) WHERE dedupe_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS crm_attendance_staff_business_date_unique_idx
ON public.crm_attendance(staff_id, attendance_date);

CREATE TABLE IF NOT EXISTS public.crm_attendance_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attendance_id UUID NOT NULL REFERENCES public.crm_attendance(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES public.crm_staff(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  old_values JSONB,
  new_values JSONB NOT NULL,
  reason TEXT NOT NULL CHECK (length(btrim(reason)) >= 3),
  changed_by UUID NOT NULL REFERENCES public.crm_users(id) ON DELETE RESTRICT DEFAULT auth.uid(),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS crm_attendance_audit_record_idx ON public.crm_attendance_audit(attendance_id, changed_at DESC);

-- Backfill real timestamps without changing any existing clock values.
UPDATE public.crm_attendance
SET punch_in_at = ((attendance_date::timestamp + check_in) AT TIME ZONE 'Asia/Kolkata')
WHERE punch_in_at IS NULL AND check_in IS NOT NULL;

UPDATE public.crm_attendance
SET punch_out_at = (((attendance_date + CASE WHEN check_in IS NOT NULL AND check_out < check_in THEN 1 ELSE 0 END)::timestamp + check_out) AT TIME ZONE 'Asia/Kolkata')
WHERE punch_out_at IS NULL AND check_out IS NOT NULL;

CREATE OR REPLACE FUNCTION public.crm_attendance_lock_at(p_attendance_date DATE)
RETURNS TIMESTAMPTZ LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT (((p_attendance_date + 1)::timestamp + s.lock_time) AT TIME ZONE s.business_timezone)
  FROM public.crm_attendance_settings s WHERE s.id = 1;
$$;

CREATE OR REPLACE FUNCTION public.crm_attendance_is_locked(p_attendance_date DATE, p_now TIMESTAMPTZ DEFAULT now())
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT p_now >= public.crm_attendance_lock_at(p_attendance_date);
$$;

CREATE OR REPLACE FUNCTION public.crm_attendance_business_date(p_now TIMESTAMPTZ DEFAULT now())
RETURNS DATE LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT CASE WHEN (p_now AT TIME ZONE s.business_timezone)::time < s.lock_time
    THEN (p_now AT TIME ZONE s.business_timezone)::date - 1
    ELSE (p_now AT TIME ZONE s.business_timezone)::date END
  FROM public.crm_attendance_settings s WHERE s.id = 1;
$$;

CREATE OR REPLACE FUNCTION public.crm_get_my_attendance_state()
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
DECLARE v_staff public.crm_staff; v_row public.crm_attendance; v_date DATE; v_settings public.crm_attendance_settings;
BEGIN
  SELECT * INTO v_staff FROM public.crm_staff WHERE user_id=auth.uid() AND status='Active' LIMIT 1;
  IF v_staff.id IS NULL THEN RAISE EXCEPTION 'No active staff profile.'; END IF;
  SELECT * INTO v_settings FROM public.crm_attendance_settings WHERE id=1;
  v_date := public.crm_attendance_business_date(now());
  SELECT * INTO v_row FROM public.crm_attendance
  WHERE staff_id=v_staff.id AND check_in IS NOT NULL AND check_out IS NULL
    AND NOT public.crm_attendance_is_locked(attendance_date)
  ORDER BY attendance_date DESC, created_at DESC LIMIT 1;
  IF v_row.id IS NULL THEN
    SELECT * INTO v_row FROM public.crm_attendance WHERE staff_id=v_staff.id AND attendance_date=v_date
    ORDER BY created_at DESC LIMIT 1;
  END IF;
  RETURN jsonb_build_object(
    'business_date',v_date,'lock_time',v_settings.lock_time,'business_timezone',v_settings.business_timezone,
    'record',CASE WHEN v_row.id IS NULL THEN NULL ELSE to_jsonb(v_row) || jsonb_build_object(
      'is_locked',public.crm_attendance_is_locked(v_row.attendance_date),'lock_at',public.crm_attendance_lock_at(v_row.attendance_date)
    ) END
  );
END; $$;

CREATE OR REPLACE FUNCTION public.punch_in(p_selfie_url TEXT,p_device TEXT DEFAULT NULL,p_browser TEXT DEFAULT NULL,p_ip TEXT DEFAULT NULL)
RETURNS public.crm_attendance LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE s public.crm_staff; r public.crm_attendance; v_date DATE; v_now TIMESTAMPTZ:=now(); v_local_time TIME; v_tz TEXT;
BEGIN
  SELECT * INTO s FROM public.crm_staff WHERE user_id=auth.uid() AND status='Active' LIMIT 1;
  IF s.id IS NULL THEN RAISE EXCEPTION 'No active staff profile.'; END IF;
  SELECT business_timezone INTO v_tz FROM public.crm_attendance_settings WHERE id=1;
  v_date:=public.crm_attendance_business_date(v_now); v_local_time:=(v_now AT TIME ZONE v_tz)::time;
  PERFORM pg_advisory_xact_lock(hashtext('attendance-'||s.id::text||'-'||v_date::text));
  IF public.crm_attendance_is_locked(v_date,v_now) THEN RAISE EXCEPTION 'Attendance for % is locked.',v_date; END IF;
  IF EXISTS(SELECT 1 FROM public.crm_leave_requests l WHERE l.staff_id=s.id AND l.status='Approved' AND v_date BETWEEN l.from_date AND l.to_date) THEN
    RAISE EXCEPTION 'You have approved leave for this attendance date.';
  END IF;
  SELECT * INTO r FROM public.crm_attendance WHERE staff_id=s.id AND attendance_date=v_date ORDER BY created_at DESC LIMIT 1;
  IF r.id IS NOT NULL AND r.check_in IS NOT NULL THEN
    IF r.check_out IS NULL THEN RAISE EXCEPTION 'Attendance is already punched in.';
    ELSE RAISE EXCEPTION 'Attendance is already completed for this business date.'; END IF;
  END IF;
  IF r.id IS NULL THEN
    INSERT INTO public.crm_attendance(created_by,staff_id,attendance_date,status,check_in,punch_in_at,punch_in_selfie_url,punch_in_device,punch_in_browser,punch_in_ip)
    VALUES(auth.uid(),s.id,v_date,'Present',v_local_time,v_now,p_selfie_url,p_device,p_browser,NULLIF(p_ip,'')::INET) RETURNING * INTO r;
  ELSE
    IF r.status IN ('On Leave','Weekly Off','Holiday') THEN RAISE EXCEPTION 'Attendance is not required for this business date.'; END IF;
    UPDATE public.crm_attendance SET status='Present',check_in=v_local_time,punch_in_at=v_now,punch_in_selfie_url=p_selfie_url,
      punch_in_device=p_device,punch_in_browser=p_browser,punch_in_ip=NULLIF(p_ip,'')::INET,updated_at=v_now WHERE id=r.id RETURNING * INTO r;
  END IF;
  RETURN r;
END; $$;

CREATE OR REPLACE FUNCTION public.punch_out(p_selfie_url TEXT,p_device TEXT DEFAULT NULL,p_browser TEXT DEFAULT NULL,p_ip TEXT DEFAULT NULL)
RETURNS public.crm_attendance LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE s public.crm_staff; r public.crm_attendance; v_now TIMESTAMPTZ:=now(); v_local_time TIME; v_tz TEXT;
BEGIN
  SELECT * INTO s FROM public.crm_staff WHERE user_id=auth.uid() AND status='Active' LIMIT 1;
  IF s.id IS NULL THEN RAISE EXCEPTION 'No active staff profile.'; END IF;
  SELECT business_timezone INTO v_tz FROM public.crm_attendance_settings WHERE id=1;
  SELECT * INTO r FROM public.crm_attendance WHERE staff_id=s.id AND check_in IS NOT NULL AND check_out IS NULL
    AND NOT public.crm_attendance_is_locked(attendance_date,v_now) ORDER BY attendance_date DESC,created_at DESC LIMIT 1 FOR UPDATE;
  IF r.id IS NULL THEN RAISE EXCEPTION 'No open attendance record was found. It may already be locked.'; END IF;
  v_local_time:=(v_now AT TIME ZONE v_tz)::time;
  UPDATE public.crm_attendance SET check_out=v_local_time,punch_out_at=v_now,punch_out_selfie_url=p_selfie_url,
    punch_out_device=p_device,punch_out_browser=p_browser,punch_out_ip=NULLIF(p_ip,'')::INET,updated_at=v_now WHERE id=r.id RETURNING * INTO r;
  RETURN r;
END; $$;

CREATE OR REPLACE FUNCTION public.crm_admin_save_attendance(p_rows JSONB,p_reason TEXT DEFAULT NULL)
RETURNS SETOF public.crm_attendance LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE item JSONB; existing public.crm_attendance; saved public.crm_attendance; v_user UUID:=auth.uid(); v_locked BOOLEAN; v_old JSONB; v_new JSONB; v_is_admin BOOLEAN:=public.is_crm_admin(); v_can_manage BOOLEAN;
BEGIN
  SELECT v_is_admin OR EXISTS(SELECT 1 FROM public.crm_users u WHERE u.id=v_user AND u.is_active=true AND u.role='manager' AND COALESCE((u.crm_section_access->>'attendance')::boolean,false)) INTO v_can_manage;
  IF NOT v_can_manage THEN RAISE EXCEPTION 'Attendance management access required.'; END IF;
  FOR item IN SELECT * FROM jsonb_array_elements(p_rows) LOOP
    SELECT * INTO existing FROM public.crm_attendance WHERE staff_id=(item->>'staff_id')::uuid AND attendance_date=(item->>'attendance_date')::date ORDER BY created_at DESC LIMIT 1 FOR UPDATE;
    v_locked:=public.crm_attendance_is_locked((item->>'attendance_date')::date);
    IF v_locked AND NOT v_is_admin THEN RAISE EXCEPTION 'Only an Admin can correct locked attendance.'; END IF;
    v_old:=CASE WHEN existing.id IS NULL THEN NULL ELSE to_jsonb(existing) END;
    IF v_locked AND COALESCE(length(btrim(p_reason)),0)<3 THEN RAISE EXCEPTION 'A correction reason is required for locked attendance.'; END IF;
    IF existing.id IS NULL THEN
      INSERT INTO public.crm_attendance(created_by,staff_id,attendance_date,status,check_in,check_out,break_minutes,overtime_minutes,note,punch_in_at,punch_out_at)
      VALUES(v_user,(item->>'staff_id')::uuid,(item->>'attendance_date')::date,item->>'status',NULLIF(item->>'check_in','')::time,NULLIF(item->>'check_out','')::time,
        COALESCE((item->>'break_minutes')::integer,0),COALESCE((item->>'overtime_minutes')::integer,0),NULLIF(item->>'note',''),
        CASE WHEN NULLIF(item->>'check_in','') IS NULL THEN NULL ELSE ((((item->>'attendance_date')::date)::timestamp+NULLIF(item->>'check_in','')::time) AT TIME ZONE (SELECT business_timezone FROM public.crm_attendance_settings WHERE id=1)) END,
        CASE WHEN NULLIF(item->>'check_out','') IS NULL THEN NULL ELSE ((((item->>'attendance_date')::date + CASE WHEN NULLIF(item->>'check_in','') IS NOT NULL AND NULLIF(item->>'check_out','')::time < NULLIF(item->>'check_in','')::time THEN 1 ELSE 0 END)::timestamp+NULLIF(item->>'check_out','')::time) AT TIME ZONE (SELECT business_timezone FROM public.crm_attendance_settings WHERE id=1)) END)
      RETURNING * INTO saved;
    ELSE
      UPDATE public.crm_attendance SET status=item->>'status',check_in=NULLIF(item->>'check_in','')::time,check_out=NULLIF(item->>'check_out','')::time,
        punch_in_at=CASE WHEN NULLIF(item->>'check_in','') IS NULL THEN NULL ELSE ((((item->>'attendance_date')::date)::timestamp+NULLIF(item->>'check_in','')::time) AT TIME ZONE (SELECT business_timezone FROM public.crm_attendance_settings WHERE id=1)) END,
        punch_out_at=CASE WHEN NULLIF(item->>'check_out','') IS NULL THEN NULL ELSE ((((item->>'attendance_date')::date + CASE WHEN NULLIF(item->>'check_in','') IS NOT NULL AND NULLIF(item->>'check_out','')::time < NULLIF(item->>'check_in','')::time THEN 1 ELSE 0 END)::timestamp+NULLIF(item->>'check_out','')::time) AT TIME ZONE (SELECT business_timezone FROM public.crm_attendance_settings WHERE id=1)) END,
        break_minutes=COALESCE((item->>'break_minutes')::integer,0),overtime_minutes=COALESCE((item->>'overtime_minutes')::integer,0),note=NULLIF(item->>'note',''),updated_at=now()
      WHERE id=existing.id RETURNING * INTO saved;
    END IF;
    v_new:=to_jsonb(saved);
    IF v_locked AND v_old IS DISTINCT FROM v_new THEN
      INSERT INTO public.crm_attendance_audit(attendance_id,staff_id,attendance_date,old_values,new_values,reason,changed_by)
      VALUES(saved.id,saved.staff_id,saved.attendance_date,v_old,v_new,btrim(p_reason),v_user);
    END IF;
    RETURN NEXT saved;
  END LOOP;
END; $$;

CREATE OR REPLACE FUNCTION public.crm_generate_smart_reminders(p_now TIMESTAMPTZ DEFAULT now())
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE s public.crm_attendance_settings; v_local TIMESTAMP; v_date DATE; inserted_count INTEGER:=0; affected INTEGER;
BEGIN
  SELECT * INTO s FROM public.crm_attendance_settings WHERE id=1;
  v_local:=p_now AT TIME ZONE s.business_timezone; v_date:=v_local::date;
  -- Missing punch-in, after each staff member's expected start, working days only.
  INSERT INTO public.crm_notifications(recipient_id,type,title,body,link,dedupe_key)
  SELECT st.user_id,'attendance_reminder','Attendance reminder','Your attendance has not been marked for today.','/workspace','attendance-in-'||v_date
  FROM public.crm_staff st WHERE st.status='Active' AND st.user_id IS NOT NULL
    AND extract(isodow FROM v_date)::smallint=ANY(s.working_days)
    AND v_local::time >= st.shift_start + make_interval(mins=>s.punch_in_reminder_minutes)
    AND NOT EXISTS(SELECT 1 FROM public.crm_attendance a WHERE a.staff_id=st.id AND a.attendance_date=v_date AND (a.check_in IS NOT NULL OR a.status IN ('On Leave','Weekly Off','Holiday')))
    AND NOT EXISTS(SELECT 1 FROM public.crm_leave_requests l WHERE l.staff_id=st.id AND l.status='Approved' AND v_date BETWEEN l.from_date AND l.to_date)
  ON CONFLICT (recipient_id,dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
  GET DIAGNOSTICS affected=ROW_COUNT; inserted_count:=inserted_count+affected;
  -- Open attendance after scheduled shift end.
  INSERT INTO public.crm_notifications(recipient_id,type,title,body,link,dedupe_key)
  SELECT st.user_id,'attendance_punch_out_reminder','Attendance is still open','Please remember to punch out before the attendance lock time.','/workspace','attendance-out-'||a.attendance_date
  FROM public.crm_attendance a JOIN public.crm_staff st ON st.id=a.staff_id
  WHERE a.check_in IS NOT NULL AND a.check_out IS NULL AND NOT public.crm_attendance_is_locked(a.attendance_date,p_now)
    AND p_now >= (((a.attendance_date + CASE WHEN st.shift_end<=st.shift_start THEN 1 ELSE 0 END)::timestamp + st.shift_end + make_interval(mins=>s.punch_out_reminder_minutes)) AT TIME ZONE s.business_timezone)
  ON CONFLICT (recipient_id,dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
  GET DIAGNOSTICS affected=ROW_COUNT; inserted_count:=inserted_count+affected;
  -- One final warning shortly before lock.
  INSERT INTO public.crm_notifications(recipient_id,type,title,body,link,dedupe_key)
  SELECT st.user_id,'attendance_lock_reminder','Attendance lock reminder','Your attendance for '||to_char(a.attendance_date,'DD Mon')||' is incomplete. Please punch out before '||to_char(s.lock_time,'HH12:MI AM')||'.','/workspace','attendance-final-'||a.attendance_date
  FROM public.crm_attendance a JOIN public.crm_staff st ON st.id=a.staff_id
  WHERE a.check_in IS NOT NULL AND a.check_out IS NULL AND p_now < public.crm_attendance_lock_at(a.attendance_date)
    AND p_now >= public.crm_attendance_lock_at(a.attendance_date)-make_interval(mins=>s.final_reminder_minutes)
  ON CONFLICT (recipient_id,dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
  GET DIAGNOSTICS affected=ROW_COUNT; inserted_count:=inserted_count+affected;
  -- Existing Daily Work Report reminder; calendar-day rules remain unchanged.
  INSERT INTO public.crm_notifications(recipient_id,type,title,body,link,dedupe_key)
  SELECT st.user_id,'daily_work_report_reminder','Daily work report pending','Your daily work report for today has not been submitted.','/workspace/daily-work-report','daily-report-'||v_date
  FROM public.crm_staff st WHERE st.status='Active' AND st.user_id IS NOT NULL AND v_local::time>=s.daily_report_reminder_time
    AND extract(isodow FROM v_date)::smallint=ANY(s.working_days)
    AND NOT EXISTS(SELECT 1 FROM public.crm_daily_work_reports r WHERE r.user_id=st.user_id AND r.report_date=v_date AND r.report_status IN ('SUBMITTED','REVIEWED'))
    AND NOT EXISTS(SELECT 1 FROM public.crm_leave_requests l WHERE l.staff_id=st.id AND l.status='Approved' AND v_date BETWEEN l.from_date AND l.to_date)
  ON CONFLICT (recipient_id,dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
  GET DIAGNOSTICS affected=ROW_COUNT; RETURN inserted_count+affected;
END; $$;

ALTER TABLE public.crm_attendance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_attendance_audit ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Attendance settings visible to authenticated" ON public.crm_attendance_settings;
CREATE POLICY "Attendance settings visible to authenticated" ON public.crm_attendance_settings FOR SELECT TO authenticated USING(true);
DROP POLICY IF EXISTS "Attendance settings managed by admin" ON public.crm_attendance_settings;
CREATE POLICY "Attendance settings managed by admin" ON public.crm_attendance_settings FOR UPDATE TO authenticated USING(is_crm_admin()) WITH CHECK(is_crm_admin());
DROP POLICY IF EXISTS "Attendance audit visible to admin" ON public.crm_attendance_audit;
CREATE POLICY "Attendance audit visible to admin" ON public.crm_attendance_audit FOR SELECT TO authenticated USING(is_crm_admin());

REVOKE INSERT,UPDATE,DELETE ON public.crm_attendance FROM authenticated;
GRANT SELECT ON public.crm_attendance TO authenticated;
GRANT SELECT ON public.crm_attendance_settings TO authenticated;
GRANT UPDATE(lock_time,punch_in_reminder_minutes,punch_out_reminder_minutes,final_reminder_minutes,daily_report_reminder_time,working_days,updated_at,updated_by) ON public.crm_attendance_settings TO authenticated;
GRANT SELECT ON public.crm_attendance_audit TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_attendance_lock_at(DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_attendance_is_locked(DATE,TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_attendance_business_date(TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_get_my_attendance_state() TO authenticated;
GRANT EXECUTE ON FUNCTION public.punch_in(TEXT,TEXT,TEXT,TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.punch_out(TEXT,TEXT,TEXT,TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_admin_save_attendance(JSONB,TEXT) TO authenticated;

-- Supabase Cron runs this independently of browser sessions. If pg_cron is
-- unavailable, the migration remains valid and the function can be scheduled
-- from the existing hosting scheduler without changing application logic.
DO $schedule$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  PERFORM cron.unschedule(jobid) FROM cron.job WHERE jobname='crm-smart-attendance-reminders';
  PERFORM cron.schedule('crm-smart-attendance-reminders','*/5 * * * *','SELECT public.crm_generate_smart_reminders();');
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_cron scheduling skipped: %',SQLERRM;
END $schedule$;
