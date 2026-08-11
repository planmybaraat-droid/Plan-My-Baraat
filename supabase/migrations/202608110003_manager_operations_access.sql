-- Operational Manager access: Leave Management, Daily Work Reports and
-- attendance audit visibility. Owner-only functions (users, credentials,
-- access grants, billing and configuration) remain Admin/Super Admin only.

UPDATE public.crm_users
SET crm_section_access = jsonb_set(
  jsonb_set(COALESCE(crm_section_access, '{}'::jsonb), '{leaveManagement}', 'true'::jsonb, true),
  '{dailyWorkReports}', 'true'::jsonb, true
), updated_at = now()
WHERE role = 'manager' AND is_active = true;

DROP POLICY IF EXISTS "Leave visible to owner or admin" ON public.crm_leave_requests;
CREATE POLICY "Leave visible to owner or operations manager"
ON public.crm_leave_requests FOR SELECT TO authenticated
USING (
  public.is_crm_admin()
  OR public.crm_manager_has_section('leaveManagement')
  OR EXISTS (SELECT 1 FROM public.crm_staff s WHERE s.id=staff_id AND s.user_id=auth.uid())
);

DROP POLICY IF EXISTS "Operational staff visible to manager" ON public.crm_staff;
CREATE POLICY "Operational staff visible to manager"
ON public.crm_staff FOR SELECT TO authenticated
USING (
  public.crm_manager_has_section('leaveManagement')
  OR public.crm_manager_has_section('dailyWorkReports')
  OR public.crm_manager_has_section('attendance')
);

DROP POLICY IF EXISTS "Operational users visible to manager" ON public.crm_users;
CREATE POLICY "Operational users visible to manager"
ON public.crm_users FOR SELECT TO authenticated
USING (public.crm_manager_has_section('dailyWorkReports'));

CREATE OR REPLACE FUNCTION public.crm_review_leave(
  p_request_id UUID,p_decision TEXT,p_rejection_reason TEXT DEFAULT NULL
) RETURNS public.crm_leave_requests
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_row public.crm_leave_requests; v_staff public.crm_staff; v_reviewer TEXT; v_day DATE;
BEGIN
  IF NOT (public.is_crm_admin() OR public.crm_manager_has_section('leaveManagement')) THEN
    RAISE EXCEPTION 'Leave Management access is required to review requests.';
  END IF;
  IF p_decision NOT IN ('Approved','Rejected') THEN RAISE EXCEPTION 'Decision must be Approved or Rejected.'; END IF;
  IF p_decision='Rejected' AND length(trim(coalesce(p_rejection_reason,'')))=0 THEN RAISE EXCEPTION 'A rejection reason is required.'; END IF;
  SELECT full_name INTO v_reviewer FROM public.crm_users WHERE id=auth.uid();
  UPDATE public.crm_leave_requests SET status=p_decision,reviewed_by=auth.uid(),reviewed_by_name=v_reviewer,
    reviewed_at=now(),rejection_reason=CASE WHEN p_decision='Rejected' THEN trim(p_rejection_reason) ELSE NULL END,updated_at=now()
  WHERE id=p_request_id AND status='Pending' RETURNING * INTO v_row;
  IF v_row.id IS NULL THEN RAISE EXCEPTION 'This leave request is no longer pending.'; END IF;
  SELECT * INTO v_staff FROM public.crm_staff WHERE id=v_row.staff_id;

  IF p_decision='Approved' THEN
    FOR v_day IN SELECT generate_series(v_row.from_date,v_row.to_date,'1 day'::interval)::date LOOP
      DELETE FROM public.crm_attendance WHERE staff_id=v_row.staff_id AND attendance_date=v_day;
      INSERT INTO public.crm_attendance(created_by,staff_id,attendance_date,status,check_in,check_out,break_minutes,overtime_minutes,note)
      VALUES(v_staff.user_id,v_row.staff_id,v_day,'On Leave',NULL,NULL,0,0,'Approved leave ' || v_row.request_number);
    END LOOP;
  END IF;

  IF v_staff.user_id IS NOT NULL THEN
    INSERT INTO public.crm_notifications(recipient_id,type,title,body,link)
    VALUES(v_staff.user_id,'leave_' || lower(p_decision),'Leave request ' || lower(p_decision),
      v_row.request_number || ' (' || to_char(v_row.from_date,'DD Mon YYYY') || ' - ' || to_char(v_row.to_date,'DD Mon YYYY') || ') was ' || lower(p_decision) ||
      CASE WHEN p_decision='Rejected' THEN '. Reason: ' || v_row.rejection_reason ELSE '.' END,'/workspace/leave');
  END IF;
  RETURN v_row;
END; $$;

DROP POLICY IF EXISTS "Daily reports visible to owner or admin" ON public.crm_daily_work_reports;
CREATE POLICY "Daily reports visible to owner or operations manager"
ON public.crm_daily_work_reports FOR SELECT TO authenticated
USING (user_id=auth.uid() OR public.is_crm_admin() OR public.crm_manager_has_section('dailyWorkReports'));

DROP POLICY IF EXISTS "Daily report items visible to report reader" ON public.crm_daily_work_report_items;
CREATE POLICY "Daily report items visible to report reader"
ON public.crm_daily_work_report_items FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.crm_daily_work_reports r
  WHERE r.id=report_id AND (r.user_id=auth.uid() OR public.is_crm_admin() OR public.crm_manager_has_section('dailyWorkReports'))
));

DROP POLICY IF EXISTS "Attendance audit visible to admin" ON public.crm_attendance_audit;
CREATE POLICY "Attendance audit visible to attendance managers"
ON public.crm_attendance_audit FOR SELECT TO authenticated
USING (public.is_crm_admin() OR public.crm_manager_has_section('attendance'));

-- New leave requests notify both owners and managers authorized to review.
CREATE OR REPLACE FUNCTION public.crm_submit_leave(
  p_leave_type TEXT, p_from_date DATE, p_to_date DATE, p_reason TEXT
) RETURNS public.crm_leave_requests
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_staff public.crm_staff; v_row public.crm_leave_requests;
BEGIN
  IF p_leave_type NOT IN ('Casual Leave','Sick Leave','Paid Leave','Unpaid Leave','Other') THEN RAISE EXCEPTION 'Select a valid leave type.'; END IF;
  IF p_from_date IS NULL OR p_to_date IS NULL OR p_from_date > p_to_date THEN RAISE EXCEPTION 'Select a valid leave date range.'; END IF;
  IF length(trim(coalesce(p_reason,'')))=0 THEN RAISE EXCEPTION 'Reason is required.'; END IF;
  SELECT * INTO v_staff FROM public.crm_staff WHERE user_id=auth.uid() AND status<>'Inactive' LIMIT 1;
  IF v_staff.id IS NULL THEN RAISE EXCEPTION 'No active staff profile is linked to this account.'; END IF;
  IF EXISTS (SELECT 1 FROM public.crm_leave_requests r WHERE r.staff_id=v_staff.id AND r.status IN ('Pending','Approved')
    AND daterange(r.from_date,r.to_date,'[]') && daterange(p_from_date,p_to_date,'[]')) THEN
    RAISE EXCEPTION 'This request overlaps an existing pending or approved leave.';
  END IF;
  INSERT INTO public.crm_leave_requests(staff_id,leave_type,from_date,to_date,number_of_days,reason,created_by)
  VALUES(v_staff.id,p_leave_type,p_from_date,p_to_date,p_to_date-p_from_date+1,trim(p_reason),auth.uid()) RETURNING * INTO v_row;
  INSERT INTO public.crm_notifications(recipient_id,type,title,body,link)
  SELECT u.id,'leave_request','New leave request',v_staff.full_name || ' requested ' || v_row.number_of_days || ' day(s) of ' || v_row.leave_type || '.','/crm/leave'
  FROM public.crm_users u WHERE u.is_active=true AND (
    u.role IN ('admin','super_admin') OR (u.role='manager' AND COALESCE((u.crm_section_access->>'leaveManagement')::boolean,false))
  );
  RETURN v_row;
END; $$;

REVOKE ALL ON FUNCTION public.crm_submit_leave(TEXT,DATE,DATE,TEXT),public.crm_review_leave(UUID,TEXT,TEXT) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.crm_submit_leave(TEXT,DATE,DATE,TEXT),public.crm_review_leave(UUID,TEXT,TEXT) TO authenticated;
