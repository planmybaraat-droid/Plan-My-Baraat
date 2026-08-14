-- Attendance break management
-- Extends the existing attendance workflow without changing business-date,
-- lock, authentication, or module-access rules.

CREATE TABLE IF NOT EXISTS public.crm_attendance_breaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id UUID NOT NULL REFERENCES public.crm_attendance(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES public.crm_staff(id) ON DELETE CASCADE,
  break_start_at TIMESTAMPTZ NOT NULL,
  break_end_at TIMESTAMPTZ,
  duration_minutes INTEGER NOT NULL DEFAULT 0 CHECK (duration_minutes >= 0),
  created_by UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT crm_attendance_break_time_order CHECK (break_end_at IS NULL OR break_end_at >= break_start_at)
);

CREATE INDEX IF NOT EXISTS crm_attendance_breaks_attendance_idx
  ON public.crm_attendance_breaks(attendance_id, break_start_at);
CREATE INDEX IF NOT EXISTS crm_attendance_breaks_staff_idx
  ON public.crm_attendance_breaks(staff_id, break_start_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS crm_attendance_breaks_one_active_idx
  ON public.crm_attendance_breaks(attendance_id) WHERE break_end_at IS NULL;

CREATE TABLE IF NOT EXISTS public.crm_attendance_break_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id UUID NOT NULL REFERENCES public.crm_attendance(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES public.crm_staff(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  old_values JSONB,
  new_values JSONB,
  reason TEXT NOT NULL,
  changed_by UUID NOT NULL REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS crm_attendance_break_audit_record_idx
  ON public.crm_attendance_break_audit(attendance_id, changed_at DESC);

CREATE OR REPLACE FUNCTION public.crm_sync_attendance_break_minutes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_attendance_id UUID;
BEGIN
  v_attendance_id := COALESCE(NEW.attendance_id, OLD.attendance_id);
  UPDATE public.crm_attendance
  SET break_minutes = COALESCE((
        SELECT SUM(b.duration_minutes)
        FROM public.crm_attendance_breaks b
        WHERE b.attendance_id=v_attendance_id AND b.break_end_at IS NOT NULL
      ),0),
      updated_at=now()
  WHERE id=v_attendance_id;
  RETURN COALESCE(NEW,OLD);
END; $$;

DROP TRIGGER IF EXISTS crm_attendance_breaks_sync_minutes ON public.crm_attendance_breaks;
CREATE TRIGGER crm_attendance_breaks_sync_minutes
AFTER INSERT OR UPDATE OR DELETE ON public.crm_attendance_breaks
FOR EACH ROW EXECUTE FUNCTION public.crm_sync_attendance_break_minutes();

CREATE OR REPLACE FUNCTION public.crm_get_my_attendance_state()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  v_staff public.crm_staff;
  v_row public.crm_attendance;
  v_date DATE;
  v_breaks JSONB := '[]'::jsonb;
  v_active public.crm_attendance_breaks;
  v_total INTEGER := 0;
  v_shift INTEGER := 0;
BEGIN
  SELECT * INTO v_staff FROM public.crm_staff WHERE user_id=auth.uid() AND status='Active' LIMIT 1;
  IF v_staff.id IS NULL THEN RETURN jsonb_build_object('record',NULL,'breaks',v_breaks,'state','not_punched_in'); END IF;
  v_date := public.crm_attendance_business_date(now());
  SELECT * INTO v_row FROM public.crm_attendance
  WHERE staff_id=v_staff.id AND check_in IS NOT NULL AND check_out IS NULL
    AND NOT public.crm_attendance_is_locked(attendance_date)
  ORDER BY attendance_date DESC,created_at DESC LIMIT 1;
  IF v_row.id IS NULL THEN
    SELECT * INTO v_row FROM public.crm_attendance WHERE staff_id=v_staff.id AND attendance_date=v_date
    ORDER BY created_at DESC LIMIT 1;
  END IF;
  IF v_row.id IS NULL THEN RETURN jsonb_build_object('record',NULL,'breaks',v_breaks,'state','not_punched_in'); END IF;

  SELECT COALESCE(jsonb_agg(to_jsonb(b) ORDER BY b.break_start_at),'[]'::jsonb),
         COALESCE(SUM(CASE WHEN b.break_end_at IS NULL THEN GREATEST(0,FLOOR(EXTRACT(EPOCH FROM (now()-b.break_start_at))/60)::integer) ELSE b.duration_minutes END),0)
    INTO v_breaks,v_total
  FROM public.crm_attendance_breaks b WHERE b.attendance_id=v_row.id;
  SELECT * INTO v_active FROM public.crm_attendance_breaks
    WHERE attendance_id=v_row.id AND break_end_at IS NULL LIMIT 1;
  IF v_row.punch_in_at IS NOT NULL THEN
    v_shift := GREATEST(0,FLOOR(EXTRACT(EPOCH FROM (COALESCE(v_row.punch_out_at,now())-v_row.punch_in_at))/60)::integer);
  END IF;
  RETURN jsonb_build_object(
    'record',to_jsonb(v_row),'breaks',v_breaks,'active_break',CASE WHEN v_active.id IS NULL THEN NULL ELSE to_jsonb(v_active) END,
    'state',CASE WHEN v_row.check_in IS NULL THEN 'not_punched_in' WHEN v_row.check_out IS NOT NULL THEN 'completed' WHEN v_active.id IS NOT NULL THEN 'on_break' ELSE 'working' END,
    'total_break_minutes',v_total,'shift_minutes',v_shift,'net_working_minutes',GREATEST(0,v_shift-v_total),
    'is_locked',public.crm_attendance_is_locked(v_row.attendance_date),'lock_at',public.crm_attendance_lock_at(v_row.attendance_date)
  );
END; $$;

CREATE OR REPLACE FUNCTION public.crm_start_attendance_break()
RETURNS public.crm_attendance_breaks LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_staff public.crm_staff; v_attendance public.crm_attendance; v_break public.crm_attendance_breaks; v_now TIMESTAMPTZ:=now();
BEGIN
  SELECT * INTO v_staff FROM public.crm_staff WHERE user_id=auth.uid() AND status='Active' LIMIT 1;
  IF v_staff.id IS NULL THEN RAISE EXCEPTION 'No active staff profile is linked to this account.'; END IF;
  SELECT * INTO v_attendance FROM public.crm_attendance
    WHERE staff_id=v_staff.id AND check_in IS NOT NULL AND check_out IS NULL
      AND NOT public.crm_attendance_is_locked(attendance_date,v_now)
    ORDER BY attendance_date DESC,created_at DESC LIMIT 1 FOR UPDATE;
  IF v_attendance.id IS NULL THEN RAISE EXCEPTION 'Punch in before starting a break.'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('attendance-break-'||v_attendance.id::text));
  IF EXISTS(SELECT 1 FROM public.crm_attendance_breaks WHERE attendance_id=v_attendance.id AND break_end_at IS NULL) THEN
    RAISE EXCEPTION 'A break is already active.';
  END IF;
  INSERT INTO public.crm_attendance_breaks(attendance_id,staff_id,break_start_at,created_by)
  VALUES(v_attendance.id,v_staff.id,v_now,auth.uid()) RETURNING * INTO v_break;
  RETURN v_break;
END; $$;

CREATE OR REPLACE FUNCTION public.crm_end_attendance_break()
RETURNS public.crm_attendance_breaks LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_staff public.crm_staff; v_attendance public.crm_attendance; v_break public.crm_attendance_breaks; v_now TIMESTAMPTZ:=now();
BEGIN
  SELECT * INTO v_staff FROM public.crm_staff WHERE user_id=auth.uid() AND status='Active' LIMIT 1;
  IF v_staff.id IS NULL THEN RAISE EXCEPTION 'No active staff profile is linked to this account.'; END IF;
  SELECT * INTO v_attendance FROM public.crm_attendance
    WHERE staff_id=v_staff.id AND check_in IS NOT NULL AND check_out IS NULL
      AND NOT public.crm_attendance_is_locked(attendance_date,v_now)
    ORDER BY attendance_date DESC,created_at DESC LIMIT 1 FOR UPDATE;
  IF v_attendance.id IS NULL THEN RAISE EXCEPTION 'No open attendance record was found.'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('attendance-break-'||v_attendance.id::text));
  SELECT * INTO v_break FROM public.crm_attendance_breaks
    WHERE attendance_id=v_attendance.id AND break_end_at IS NULL
    ORDER BY break_start_at DESC LIMIT 1 FOR UPDATE;
  IF v_break.id IS NULL THEN RAISE EXCEPTION 'There is no active break to end.'; END IF;
  UPDATE public.crm_attendance_breaks SET break_end_at=v_now,
    duration_minutes=GREATEST(0,FLOOR(EXTRACT(EPOCH FROM (v_now-break_start_at))/60)::integer),updated_at=v_now
  WHERE id=v_break.id AND break_end_at IS NULL RETURNING * INTO v_break;
  IF v_break.id IS NULL THEN RAISE EXCEPTION 'This break has already ended.'; END IF;
  RETURN v_break;
END; $$;

-- Preserve the current punch-out implementation and add one strict protection:
-- an attendance day cannot be completed while a break is active.
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
  PERFORM pg_advisory_xact_lock(hashtext('attendance-break-'||r.id::text));
  IF EXISTS(SELECT 1 FROM public.crm_attendance_breaks WHERE attendance_id=r.id AND break_end_at IS NULL) THEN
    RAISE EXCEPTION 'End your active break before punching out.';
  END IF;
  v_local_time:=(v_now AT TIME ZONE v_tz)::time;
  UPDATE public.crm_attendance SET check_out=v_local_time,punch_out_at=v_now,punch_out_selfie_url=p_selfie_url,
    punch_out_device=p_device,punch_out_browser=p_browser,punch_out_ip=NULLIF(p_ip,'')::INET,updated_at=v_now WHERE id=r.id RETURNING * INTO r;
  RETURN r;
END; $$;

CREATE OR REPLACE FUNCTION public.crm_admin_save_attendance_breaks(p_attendance_id UUID,p_breaks JSONB,p_reason TEXT DEFAULT NULL)
RETURNS SETOF public.crm_attendance_breaks LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_attendance public.crm_attendance; v_item JSONB; v_start TIMESTAMPTZ; v_end TIMESTAMPTZ; v_old JSONB; v_new JSONB;
  v_user UUID:=auth.uid(); v_is_admin BOOLEAN:=public.is_crm_admin(); v_can_manage BOOLEAN;
BEGIN
  SELECT v_is_admin OR EXISTS(SELECT 1 FROM public.crm_users u WHERE u.id=v_user AND u.is_active=true AND u.role='manager'
    AND COALESCE((u.crm_section_access->>'attendance')::boolean,false)) INTO v_can_manage;
  IF NOT v_can_manage THEN RAISE EXCEPTION 'Attendance management access required.'; END IF;
  SELECT * INTO v_attendance FROM public.crm_attendance WHERE id=p_attendance_id FOR UPDATE;
  IF v_attendance.id IS NULL THEN RAISE EXCEPTION 'Attendance record not found.'; END IF;
  IF public.crm_attendance_is_locked(v_attendance.attendance_date) AND NOT v_is_admin THEN RAISE EXCEPTION 'Only an Admin can correct locked attendance.'; END IF;
  IF COALESCE(length(btrim(p_reason)),0)<3 THEN RAISE EXCEPTION 'A correction reason is required for break changes.'; END IF;
  v_old:=COALESCE((SELECT jsonb_agg(to_jsonb(b) ORDER BY b.break_start_at) FROM public.crm_attendance_breaks b WHERE b.attendance_id=p_attendance_id),'[]'::jsonb);
  PERFORM pg_advisory_xact_lock(hashtext('attendance-break-'||p_attendance_id::text));
  DELETE FROM public.crm_attendance_breaks WHERE attendance_id=p_attendance_id;
  FOR v_item IN SELECT * FROM jsonb_array_elements(COALESCE(p_breaks,'[]'::jsonb)) LOOP
    v_start:=NULLIF(v_item->>'break_start_at','')::timestamptz; v_end:=NULLIF(v_item->>'break_end_at','')::timestamptz;
    IF v_start IS NULL OR v_end IS NULL OR v_end<v_start THEN RAISE EXCEPTION 'Every corrected break requires a valid start and end time.'; END IF;
    IF v_attendance.punch_in_at IS NOT NULL AND v_start<v_attendance.punch_in_at THEN RAISE EXCEPTION 'A break cannot start before punch in.'; END IF;
    IF v_attendance.punch_out_at IS NOT NULL AND v_end>v_attendance.punch_out_at THEN RAISE EXCEPTION 'A break cannot end after punch out.'; END IF;
    IF EXISTS(SELECT 1 FROM public.crm_attendance_breaks b WHERE b.attendance_id=p_attendance_id AND tstzrange(b.break_start_at,b.break_end_at,'[)') && tstzrange(v_start,v_end,'[)')) THEN
      RAISE EXCEPTION 'Corrected breaks cannot overlap.';
    END IF;
    INSERT INTO public.crm_attendance_breaks(attendance_id,staff_id,break_start_at,break_end_at,duration_minutes,created_by)
    VALUES(p_attendance_id,v_attendance.staff_id,v_start,v_end,GREATEST(0,FLOOR(EXTRACT(EPOCH FROM (v_end-v_start))/60)::integer),v_user);
  END LOOP;
  v_new:=COALESCE((SELECT jsonb_agg(to_jsonb(b) ORDER BY b.break_start_at) FROM public.crm_attendance_breaks b WHERE b.attendance_id=p_attendance_id),'[]'::jsonb);
  INSERT INTO public.crm_attendance_break_audit(attendance_id,staff_id,attendance_date,old_values,new_values,reason,changed_by)
  VALUES(v_attendance.id,v_attendance.staff_id,v_attendance.attendance_date,v_old,v_new,btrim(p_reason),v_user);
  RETURN QUERY SELECT * FROM public.crm_attendance_breaks WHERE attendance_id=p_attendance_id ORDER BY break_start_at;
END; $$;

ALTER TABLE public.crm_attendance_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_attendance_break_audit ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Attendance breaks visible to self or attendance managers" ON public.crm_attendance_breaks;
CREATE POLICY "Attendance breaks visible to self or attendance managers" ON public.crm_attendance_breaks FOR SELECT TO authenticated USING (
  public.is_crm_admin() OR public.crm_manager_has_section('attendance')
  OR EXISTS(SELECT 1 FROM public.crm_staff s WHERE s.id=staff_id AND s.user_id=auth.uid())
);
DROP POLICY IF EXISTS "Attendance break audit visible to attendance managers" ON public.crm_attendance_break_audit;
CREATE POLICY "Attendance break audit visible to attendance managers" ON public.crm_attendance_break_audit FOR SELECT TO authenticated USING (
  public.is_crm_admin() OR public.crm_manager_has_section('attendance')
);

REVOKE ALL ON public.crm_attendance_breaks,public.crm_attendance_break_audit FROM anon;
REVOKE INSERT,UPDATE,DELETE ON public.crm_attendance_breaks,public.crm_attendance_break_audit FROM authenticated;
GRANT SELECT ON public.crm_attendance_breaks,public.crm_attendance_break_audit TO authenticated;
REVOKE ALL ON FUNCTION public.crm_start_attendance_break(),public.crm_end_attendance_break(),public.crm_admin_save_attendance_breaks(UUID,JSONB,TEXT) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.crm_start_attendance_break(),public.crm_end_attendance_break(),public.crm_admin_save_attendance_breaks(UUID,JSONB,TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_get_my_attendance_state(),public.punch_out(TEXT,TEXT,TEXT,TEXT) TO authenticated;
