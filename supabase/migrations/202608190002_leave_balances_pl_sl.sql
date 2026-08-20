-- Leave balance system for Paid Leave (PL) and Sick Leave (SL)
-- 12 PL + 12 SL per year, accrued +1/+1 at the start of each active month
-- (starting from the staff member's joining month). Submission is never
-- blocked by balance; balance is only ever adjusted at the moment an admin
-- approves a request (crm_review_leave), and can go negative if an admin
-- knowingly approves beyond what is left. Carry-forward is uncapped.

CREATE TABLE IF NOT EXISTS crm_leave_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES crm_staff(id) ON DELETE CASCADE,
  leave_type VARCHAR(30) NOT NULL CHECK (leave_type IN ('Paid Leave','Sick Leave')),
  balance_days NUMERIC(7,2) NOT NULL DEFAULT 0,
  last_accrued_month DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (staff_id, leave_type)
);

ALTER TABLE crm_leave_balances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leave balance visible to owner or admin" ON crm_leave_balances;
CREATE POLICY "Leave balance visible to owner or admin" ON crm_leave_balances
  FOR SELECT USING (
    is_crm_admin() OR EXISTS (SELECT 1 FROM crm_staff s WHERE s.id = staff_id AND s.user_id = auth.uid())
  );

-- No direct INSERT/UPDATE/DELETE grants for authenticated/anon — all
-- mutations happen through the SECURITY DEFINER functions below.
REVOKE ALL ON crm_leave_balances FROM PUBLIC, anon, authenticated;
GRANT SELECT ON crm_leave_balances TO authenticated;

-- Monthly accrual: credits +1 PL and +1 SL for every active/on-leave staff
-- member for every whole month elapsed since their joining month (or since
-- the last time this ran), up to and including the current month. Safe to
-- run multiple times in the same month (no double-credit) and safe to run
-- late/after downtime (it catches up all missed months in one pass).
CREATE OR REPLACE FUNCTION crm_accrue_monthly_leave()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_staff RECORD;
  v_type TEXT;
  v_current_month DATE := date_trunc('month', now())::date;
  v_join_month DATE;
  v_existing crm_leave_balances;
  v_months INT;
BEGIN
  FOR v_staff IN SELECT id, joining_date FROM crm_staff WHERE status <> 'Inactive' LOOP
    v_join_month := date_trunc('month', v_staff.joining_date)::date;
    IF v_join_month > v_current_month THEN
      CONTINUE; -- has not joined yet
    END IF;

    FOREACH v_type IN ARRAY ARRAY['Paid Leave','Sick Leave'] LOOP
      SELECT * INTO v_existing FROM crm_leave_balances WHERE staff_id = v_staff.id AND leave_type = v_type;

      IF v_existing.staff_id IS NULL THEN
        v_months := (EXTRACT(YEAR FROM v_current_month) - EXTRACT(YEAR FROM v_join_month)) * 12
                  + (EXTRACT(MONTH FROM v_current_month) - EXTRACT(MONTH FROM v_join_month)) + 1;
        INSERT INTO crm_leave_balances (staff_id, leave_type, balance_days, last_accrued_month)
        VALUES (v_staff.id, v_type, v_months, v_current_month);
      ELSIF v_existing.last_accrued_month IS NULL OR v_existing.last_accrued_month < v_current_month THEN
        v_months := (EXTRACT(YEAR FROM v_current_month) - EXTRACT(YEAR FROM COALESCE(v_existing.last_accrued_month, v_join_month))) * 12
                  + (EXTRACT(MONTH FROM v_current_month) - EXTRACT(MONTH FROM COALESCE(v_existing.last_accrued_month, v_join_month)));
        UPDATE crm_leave_balances
        SET balance_days = balance_days + v_months, last_accrued_month = v_current_month, updated_at = now()
        WHERE staff_id = v_staff.id AND leave_type = v_type;
      END IF;
    END LOOP;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION crm_accrue_monthly_leave() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION crm_accrue_monthly_leave() TO service_role;

-- Staff-facing: current authenticated staff member's own PL/SL balances.
CREATE OR REPLACE FUNCTION crm_get_my_leave_balances()
RETURNS TABLE(leave_type TEXT, balance_days NUMERIC) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_staff_id UUID;
BEGIN
  SELECT id INTO v_staff_id FROM crm_staff WHERE user_id = auth.uid() LIMIT 1;
  IF v_staff_id IS NULL THEN RETURN; END IF;
  RETURN QUERY SELECT b.leave_type::TEXT, b.balance_days::NUMERIC FROM crm_leave_balances b WHERE b.staff_id = v_staff_id;
END;
$$;

REVOKE ALL ON FUNCTION crm_get_my_leave_balances() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION crm_get_my_leave_balances() TO authenticated;

-- Admin (or the staff member themself) can look up any one staff member's
-- balances — used by the admin review modal for context while approving.
CREATE OR REPLACE FUNCTION crm_get_staff_leave_balance(p_staff_id UUID)
RETURNS TABLE(leave_type TEXT, balance_days NUMERIC) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT (is_crm_admin() OR EXISTS (SELECT 1 FROM crm_staff s WHERE s.id = p_staff_id AND s.user_id = auth.uid())) THEN
    RAISE EXCEPTION 'Not authorized to view this staff member''s leave balance.';
  END IF;
  RETURN QUERY SELECT b.leave_type::TEXT, b.balance_days::NUMERIC FROM crm_leave_balances b WHERE b.staff_id = p_staff_id;
END;
$$;

REVOKE ALL ON FUNCTION crm_get_staff_leave_balance(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION crm_get_staff_leave_balance(UUID) TO authenticated;

-- Extend crm_review_leave: on approval of a Paid Leave / Sick Leave request,
-- deduct the approved days from the staff member's balance. Submission was
-- never blocked by balance, so this is the only place balance changes for
-- an approval, and it is allowed to go negative if an admin approves beyond
-- what is left.
CREATE OR REPLACE FUNCTION crm_review_leave(p_request_id UUID, p_decision TEXT, p_rejection_reason TEXT DEFAULT NULL)
RETURNS crm_leave_requests LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
    IF v_row.leave_type IN ('Paid Leave','Sick Leave') THEN
      INSERT INTO crm_leave_balances (staff_id, leave_type, balance_days, last_accrued_month)
      VALUES (v_row.staff_id, v_row.leave_type, -v_row.number_of_days, date_trunc('month', now())::date)
      ON CONFLICT (staff_id, leave_type) DO UPDATE
        SET balance_days = crm_leave_balances.balance_days - v_row.number_of_days, updated_at = now();
    END IF;
  END IF;
  IF v_staff.user_id IS NOT NULL THEN
    INSERT INTO crm_notifications(recipient_id,type,title,body,link)
    VALUES(v_staff.user_id,'leave_' || lower(p_decision), 'Leave request ' || lower(p_decision),
      v_row.request_number || ' (' || to_char(v_row.from_date,'DD Mon YYYY') || ' - ' || to_char(v_row.to_date,'DD Mon YYYY') || ') was ' || lower(p_decision) ||
        CASE WHEN p_decision='Rejected' THEN '. Reason: ' || v_row.rejection_reason ELSE '.' END, '/workspace/leave');
  END IF;
  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION crm_review_leave(UUID,TEXT,TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION crm_review_leave(UUID,TEXT,TEXT) TO authenticated;

-- Backfill: credit every currently-active staff member's PL/SL balance for
-- every month elapsed since joining, right now, so balances are populated
-- immediately without waiting for the 1st-of-next-month cron.
SELECT public.crm_accrue_monthly_leave();
