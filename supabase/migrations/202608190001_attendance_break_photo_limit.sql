-- Attendance breaks: require a selfie on start/end (same as punch in/out)
-- and hard-cap every staff member to 2 breaks per attendance day.
-- Purely additive: new nullable columns + replaced function bodies only.
-- Punch in/out, locking, admin correction tool, and RLS are unchanged.

ALTER TABLE public.crm_attendance_breaks
  ADD COLUMN IF NOT EXISTS break_start_selfie_url TEXT,
  ADD COLUMN IF NOT EXISTS break_end_selfie_url TEXT;

-- The old zero-argument versions are replaced by selfie-aware versions below;
-- drop them so there's no ambiguous overload left behind.
DROP FUNCTION IF EXISTS public.crm_start_attendance_break();
DROP FUNCTION IF EXISTS public.crm_end_attendance_break();

CREATE OR REPLACE FUNCTION public.crm_start_attendance_break(
  p_selfie_url TEXT DEFAULT NULL,
  p_device TEXT DEFAULT NULL,
  p_browser TEXT DEFAULT NULL
)
RETURNS public.crm_attendance_breaks LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_staff public.crm_staff; v_attendance public.crm_attendance; v_break public.crm_attendance_breaks;
  v_now TIMESTAMPTZ:=now(); v_break_count INTEGER;
BEGIN
  SELECT * INTO v_staff FROM public.crm_staff WHERE user_id=auth.uid() AND status='Active' LIMIT 1;
  IF v_staff.id IS NULL THEN RAISE EXCEPTION 'No active staff profile is linked to this account.'; END IF;
  SELECT * INTO v_attendance FROM public.crm_attendance
    WHERE staff_id=v_staff.id AND check_in IS NOT NULL AND check_out IS NULL
      AND NOT public.crm_attendance_is_locked(attendance_date,v_now)
    ORDER BY attendance_date DESC,created_at DESC LIMIT 1 FOR UPDATE;
  IF v_attendance.id IS NULL THEN RAISE EXCEPTION 'Punch in before starting a break.'; END IF;
  IF COALESCE(length(btrim(p_selfie_url)),0)=0 THEN RAISE EXCEPTION 'A selfie is required to start a break.'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('attendance-break-'||v_attendance.id::text));
  IF EXISTS(SELECT 1 FROM public.crm_attendance_breaks WHERE attendance_id=v_attendance.id AND break_end_at IS NULL) THEN
    RAISE EXCEPTION 'A break is already active.';
  END IF;
  SELECT COUNT(*) INTO v_break_count FROM public.crm_attendance_breaks WHERE attendance_id=v_attendance.id;
  IF v_break_count>=2 THEN RAISE EXCEPTION 'Only 2 breaks are allowed per day.'; END IF;
  INSERT INTO public.crm_attendance_breaks(attendance_id,staff_id,break_start_at,break_start_selfie_url,created_by)
  VALUES(v_attendance.id,v_staff.id,v_now,p_selfie_url,auth.uid()) RETURNING * INTO v_break;
  RETURN v_break;
END; $$;

CREATE OR REPLACE FUNCTION public.crm_end_attendance_break(
  p_selfie_url TEXT DEFAULT NULL,
  p_device TEXT DEFAULT NULL,
  p_browser TEXT DEFAULT NULL
)
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
  IF COALESCE(length(btrim(p_selfie_url)),0)=0 THEN RAISE EXCEPTION 'A selfie is required to end a break.'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('attendance-break-'||v_attendance.id::text));
  SELECT * INTO v_break FROM public.crm_attendance_breaks
    WHERE attendance_id=v_attendance.id AND break_end_at IS NULL
    ORDER BY break_start_at DESC LIMIT 1 FOR UPDATE;
  IF v_break.id IS NULL THEN RAISE EXCEPTION 'There is no active break to end.'; END IF;
  UPDATE public.crm_attendance_breaks SET break_end_at=v_now,
    duration_minutes=GREATEST(0,FLOOR(EXTRACT(EPOCH FROM (v_now-break_start_at))/60)::integer),
    break_end_selfie_url=p_selfie_url,updated_at=v_now
  WHERE id=v_break.id AND break_end_at IS NULL RETURNING * INTO v_break;
  IF v_break.id IS NULL THEN RAISE EXCEPTION 'This break has already ended.'; END IF;
  RETURN v_break;
END; $$;

REVOKE ALL ON FUNCTION public.crm_start_attendance_break(TEXT,TEXT,TEXT),public.crm_end_attendance_break(TEXT,TEXT,TEXT) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.crm_start_attendance_break(TEXT,TEXT,TEXT),public.crm_end_attendance_break(TEXT,TEXT,TEXT) TO authenticated;
