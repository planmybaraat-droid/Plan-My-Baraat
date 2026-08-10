-- Centralized staff leave workflow for PlanMyBaraat CRM.
-- Safe to run more than once after schema.sql and production-completion.sql.

CREATE SEQUENCE IF NOT EXISTS crm_leave_request_seq START 1;

CREATE OR REPLACE FUNCTION crm_next_leave_request_number()
RETURNS TEXT LANGUAGE sql VOLATILE SET search_path=public AS $$
  SELECT 'LR-' || to_char(current_date, 'YYYY') || '-' || lpad(nextval('crm_leave_request_seq')::text, 5, '0');
$$;

CREATE TABLE IF NOT EXISTS crm_leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_number VARCHAR(30) NOT NULL UNIQUE DEFAULT crm_next_leave_request_number(),
  staff_id UUID NOT NULL REFERENCES crm_staff(id) ON DELETE CASCADE,
  leave_type VARCHAR(30) NOT NULL CHECK (leave_type IN ('Casual Leave','Sick Leave','Paid Leave','Unpaid Leave','Other')),
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  number_of_days INTEGER NOT NULL CHECK (number_of_days > 0),
  reason TEXT NOT NULL CHECK (length(trim(reason)) > 0),
  attachment_path TEXT,
  attachment_name TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Rejected','Cancelled')),
  created_by UUID NOT NULL REFERENCES crm_users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  reviewed_by UUID REFERENCES crm_users(id) ON DELETE SET NULL,
  reviewed_by_name VARCHAR(255),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (from_date <= to_date),
  CHECK (number_of_days = (to_date - from_date + 1)),
  CHECK (status <> 'Rejected' OR length(trim(coalesce(rejection_reason,''))) > 0)
);

CREATE INDEX IF NOT EXISTS crm_leave_requests_staff_idx ON crm_leave_requests(staff_id, created_at DESC);
CREATE INDEX IF NOT EXISTS crm_leave_requests_status_idx ON crm_leave_requests(status, created_at DESC);

-- Make the newly introduced module visible to existing staff accounts. Admins
-- can still turn it off per person from Manage Access after this one-time
-- backfill; explicit existing leave values are never overwritten.
UPDATE crm_users
SET module_access = jsonb_set(coalesce(module_access, '{}'::jsonb), '{leave}', 'true'::jsonb, true)
WHERE role IN ('staff','sales','accountant') AND NOT (coalesce(module_access, '{}'::jsonb) ? 'leave');

ALTER TABLE crm_leave_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Leave visible to owner or admin" ON crm_leave_requests;
CREATE POLICY "Leave visible to owner or admin" ON crm_leave_requests FOR SELECT TO authenticated
USING (is_crm_admin() OR EXISTS (
  SELECT 1 FROM crm_staff s WHERE s.id=staff_id AND s.user_id=auth.uid()
));

-- Mutations are RPC-only so a staff browser can never forge approval fields.
REVOKE INSERT, UPDATE, DELETE ON crm_leave_requests FROM authenticated;
GRANT SELECT ON crm_leave_requests TO authenticated;

DROP FUNCTION IF EXISTS crm_submit_leave(TEXT,DATE,DATE,TEXT,TEXT,TEXT);
CREATE OR REPLACE FUNCTION crm_submit_leave(
  p_leave_type TEXT, p_from_date DATE, p_to_date DATE, p_reason TEXT
) RETURNS crm_leave_requests
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_staff crm_staff; v_row crm_leave_requests;
BEGIN
  IF p_leave_type NOT IN ('Casual Leave','Sick Leave','Paid Leave','Unpaid Leave','Other') THEN
    RAISE EXCEPTION 'Select a valid leave type.';
  END IF;
  IF p_from_date IS NULL OR p_to_date IS NULL OR p_from_date > p_to_date THEN
    RAISE EXCEPTION 'Select a valid leave date range.';
  END IF;
  IF length(trim(coalesce(p_reason,''))) = 0 THEN RAISE EXCEPTION 'Reason is required.'; END IF;

  SELECT * INTO v_staff FROM crm_staff WHERE user_id=auth.uid() AND status <> 'Inactive' LIMIT 1;
  IF v_staff.id IS NULL THEN RAISE EXCEPTION 'No active staff profile is linked to this account.'; END IF;

  IF EXISTS (SELECT 1 FROM crm_leave_requests r WHERE r.staff_id=v_staff.id
    AND r.status IN ('Pending','Approved') AND daterange(r.from_date,r.to_date,'[]') && daterange(p_from_date,p_to_date,'[]')) THEN
    RAISE EXCEPTION 'This request overlaps an existing pending or approved leave.';
  END IF;

  INSERT INTO crm_leave_requests(staff_id,leave_type,from_date,to_date,number_of_days,reason,created_by)
  VALUES(v_staff.id,p_leave_type,p_from_date,p_to_date,p_to_date-p_from_date+1,trim(p_reason),auth.uid())
  RETURNING * INTO v_row;

  INSERT INTO crm_notifications(recipient_id,type,title,body,link)
  SELECT u.id,'leave_request','New leave request',v_staff.full_name || ' requested ' || v_row.number_of_days || ' day(s) of ' || v_row.leave_type || '.','/crm/leave'
  FROM crm_users u WHERE u.role IN ('admin','super_admin') AND u.is_active=true;
  RETURN v_row;
END; $$;

CREATE OR REPLACE FUNCTION crm_cancel_leave(p_request_id UUID)
RETURNS crm_leave_requests LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_row crm_leave_requests;
BEGIN
  UPDATE crm_leave_requests r SET status='Cancelled',updated_at=now()
  WHERE r.id=p_request_id AND r.status='Pending' AND EXISTS(
    SELECT 1 FROM crm_staff s WHERE s.id=r.staff_id AND s.user_id=auth.uid()
  ) RETURNING * INTO v_row;
  IF v_row.id IS NULL THEN RAISE EXCEPTION 'Only your own pending request can be cancelled.'; END IF;
  RETURN v_row;
END; $$;

CREATE OR REPLACE FUNCTION crm_review_leave(p_request_id UUID,p_decision TEXT,p_rejection_reason TEXT DEFAULT NULL)
RETURNS crm_leave_requests LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_row crm_leave_requests; v_staff crm_staff; v_reviewer TEXT; v_day DATE;
BEGIN
  IF NOT is_crm_admin() THEN RAISE EXCEPTION 'Only an administrator can review leave requests.'; END IF;
  IF p_decision NOT IN ('Approved','Rejected') THEN RAISE EXCEPTION 'Decision must be Approved or Rejected.'; END IF;
  IF p_decision='Rejected' AND length(trim(coalesce(p_rejection_reason,'')))=0 THEN RAISE EXCEPTION 'A rejection reason is required.'; END IF;
  SELECT full_name INTO v_reviewer FROM crm_users WHERE id=auth.uid();
  UPDATE crm_leave_requests SET status=p_decision,reviewed_by=auth.uid(),reviewed_by_name=v_reviewer,
    reviewed_at=now(),rejection_reason=CASE WHEN p_decision='Rejected' THEN trim(p_rejection_reason) ELSE NULL END,updated_at=now()
  WHERE id=p_request_id AND status='Pending' RETURNING * INTO v_row;
  IF v_row.id IS NULL THEN RAISE EXCEPTION 'This leave request is no longer pending.'; END IF;
  SELECT * INTO v_staff FROM crm_staff WHERE id=v_row.staff_id;

  IF p_decision='Approved' THEN
    FOR v_day IN SELECT generate_series(v_row.from_date,v_row.to_date,'1 day'::interval)::date LOOP
      DELETE FROM crm_attendance WHERE staff_id=v_row.staff_id AND attendance_date=v_day;
      INSERT INTO crm_attendance(created_by,staff_id,attendance_date,status,check_in,check_out,break_minutes,overtime_minutes,note)
      VALUES(v_staff.user_id,v_row.staff_id,v_day,'On Leave',NULL,NULL,0,0,'Approved leave ' || v_row.request_number);
    END LOOP;
  END IF;

  IF v_staff.user_id IS NOT NULL THEN
    INSERT INTO crm_notifications(recipient_id,type,title,body,link)
    VALUES(v_staff.user_id,'leave_' || lower(p_decision),
      'Leave request ' || lower(p_decision),
      v_row.request_number || ' (' || to_char(v_row.from_date,'DD Mon YYYY') || ' - ' || to_char(v_row.to_date,'DD Mon YYYY') || ') was ' || lower(p_decision) ||
        CASE WHEN p_decision='Rejected' THEN '. Reason: ' || v_row.rejection_reason ELSE '.' END,
      '/workspace/leave');
  END IF;
  RETURN v_row;
END; $$;

REVOKE ALL ON FUNCTION crm_submit_leave(TEXT,DATE,DATE,TEXT),crm_cancel_leave(UUID),crm_review_leave(UUID,TEXT,TEXT) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION crm_submit_leave(TEXT,DATE,DATE,TEXT),crm_cancel_leave(UUID),crm_review_leave(UUID,TEXT,TEXT) TO authenticated;
