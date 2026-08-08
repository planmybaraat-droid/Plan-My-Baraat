-- Adds a second, restricted "Manager" tier that logs into the CRM itself
-- (not the Staff Workspace) but only sees an Admin-toggled subset of
-- sections. Mirrors the existing Staff Workspace module_access system:
-- default-off, Admin/Super Admin only can grant it, and it's enforced at
-- the database level (RLS) so a Manager can't reach hidden data even by
-- calling the API/table directly.

ALTER TABLE crm_users ADD COLUMN IF NOT EXISTS crm_section_access JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE OR REPLACE FUNCTION crm_manager_has_section(p_section TEXT)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM crm_users
    WHERE id = auth.uid()
      AND role = 'manager'
      AND COALESCE((crm_section_access ->> p_section)::boolean, false)
  );
$$;

-- Staff: Manager can view + edit staff profiles (job title, shift, photo,
-- etc.) but cannot create/delete logins — that stays a service-role-only,
-- Admin-gated operation via the existing /api/crm/staff route.
DROP POLICY IF EXISTS "Staff visible to manager" ON crm_staff;
DROP POLICY IF EXISTS "Staff editable by manager" ON crm_staff;
CREATE POLICY "Staff visible to manager" ON crm_staff FOR SELECT TO authenticated USING (crm_manager_has_section('staff'));
CREATE POLICY "Staff editable by manager" ON crm_staff FOR UPDATE TO authenticated USING (crm_manager_has_section('staff')) WITH CHECK (crm_manager_has_section('staff'));

-- crm_users: Manager needs to see everyone's name/role (for the Staff list,
-- task-assignee picker, etc.) but never gets write access here — role and
-- permission changes remain exclusively behind the Admin-gated API route.
DROP POLICY IF EXISTS "Users visible to manager" ON crm_users;
CREATE POLICY "Users visible to manager" ON crm_users FOR SELECT TO authenticated USING (crm_manager_has_section('staff'));

-- Attendance: full manage access when granted.
DROP POLICY IF EXISTS "Attendance managed by manager" ON crm_attendance;
CREATE POLICY "Attendance managed by manager" ON crm_attendance FOR ALL TO authenticated USING (crm_manager_has_section('attendance')) WITH CHECK (crm_manager_has_section('attendance'));

-- Tasks: extend the existing participant-check function so a Manager with
-- the "tasks" section granted sees and manages every task company-wide,
-- exactly like Admin — this one function change also covers the task
-- child tables (assignees/checklist/comments/attachments) since they all
-- reuse can_access_crm_task().
CREATE OR REPLACE FUNCTION can_access_crm_task(p_task UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT is_crm_admin()
    OR crm_manager_has_section('tasks')
    OR EXISTS(SELECT 1 FROM crm_tasks t WHERE t.id = p_task AND t.assigned_by = auth.uid())
    OR EXISTS(SELECT 1 FROM crm_task_assignees a WHERE a.task_id = p_task AND a.staff_user_id = auth.uid());
$$;

-- HR: Letters, KYC documents, Salary & Payroll — each gated to its own
-- toggle so Admin can grant them independently.
DROP POLICY IF EXISTS "Letters managed by manager" ON crm_employee_letters;
CREATE POLICY "Letters managed by manager" ON crm_employee_letters FOR ALL TO authenticated USING (crm_manager_has_section('letters')) WITH CHECK (crm_manager_has_section('letters'));

DROP POLICY IF EXISTS "Letter templates visible to manager" ON crm_letter_templates;
CREATE POLICY "Letter templates visible to manager" ON crm_letter_templates FOR ALL TO authenticated USING (crm_manager_has_section('letters')) WITH CHECK (crm_manager_has_section('letters'));

DROP POLICY IF EXISTS "Documents managed by manager" ON crm_employee_documents;
CREATE POLICY "Documents managed by manager" ON crm_employee_documents FOR ALL TO authenticated USING (crm_manager_has_section('kyc')) WITH CHECK (crm_manager_has_section('kyc'));

DROP POLICY IF EXISTS "Salary records managed by manager" ON crm_salary_records;
CREATE POLICY "Salary records managed by manager" ON crm_salary_records FOR ALL TO authenticated USING (crm_manager_has_section('salaryPayroll')) WITH CHECK (crm_manager_has_section('salaryPayroll'));

DROP POLICY IF EXISTS "Salary history managed by manager" ON crm_salary_history;
CREATE POLICY "Salary history managed by manager" ON crm_salary_history FOR ALL TO authenticated USING (crm_manager_has_section('salaryPayroll')) WITH CHECK (crm_manager_has_section('salaryPayroll'));

DROP POLICY IF EXISTS "Payroll managed by manager" ON crm_payroll;
CREATE POLICY "Payroll managed by manager" ON crm_payroll FOR ALL TO authenticated USING (crm_manager_has_section('salaryPayroll')) WITH CHECK (crm_manager_has_section('salaryPayroll'));

DROP POLICY IF EXISTS "Payslips managed by manager" ON crm_payslips;
CREATE POLICY "Payslips managed by manager" ON crm_payslips FOR ALL TO authenticated USING (crm_manager_has_section('salaryPayroll')) WITH CHECK (crm_manager_has_section('salaryPayroll'));

-- HR audit log: read-only visibility for a Manager with hrOverview granted
-- (it's a system-written trail, not something they should edit).
DROP POLICY IF EXISTS "Audit log visible to manager" ON crm_hr_audit_logs;
CREATE POLICY "Audit log visible to manager" ON crm_hr_audit_logs FOR SELECT TO authenticated USING (crm_manager_has_section('hrOverview'));

-- Notifications: everyone (including Manager) already sees their own via
-- the existing recipient-based policy — no change needed there.
