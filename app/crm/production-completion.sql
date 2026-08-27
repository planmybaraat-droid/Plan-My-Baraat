-- PlanMyBaraat CRM production completion migration.
-- Run app/crm/schema.sql first, then this file. This migration is idempotent
-- for tables/functions and intentionally contains no fake business records.

ALTER TABLE crm_users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE crm_users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE crm_users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE crm_users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE crm_agreements ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES crm_users(id) ON DELETE SET NULL;
ALTER TABLE crm_agreements ADD COLUMN IF NOT EXISTS verification_code VARCHAR(40) DEFAULT replace(uuid_generate_v4()::text,'-','');
ALTER TABLE crm_vendor_agreements ADD COLUMN IF NOT EXISTS verification_code VARCHAR(40) DEFAULT replace(uuid_generate_v4()::text,'-','');
ALTER TABLE crm_invoices ADD COLUMN IF NOT EXISTS verification_code VARCHAR(40) DEFAULT replace(uuid_generate_v4()::text,'-','');
CREATE UNIQUE INDEX IF NOT EXISTS crm_agreements_verification_idx ON crm_agreements(verification_code);
CREATE UNIQUE INDEX IF NOT EXISTS crm_vendor_agreements_verification_idx ON crm_vendor_agreements(verification_code);
CREATE UNIQUE INDEX IF NOT EXISTS crm_invoices_verification_idx ON crm_invoices(verification_code);

ALTER TABLE crm_customer_leads ADD COLUMN IF NOT EXISTS created_by UUID DEFAULT auth.uid();
ALTER TABLE crm_customer_leads ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES crm_users(id) ON DELETE SET NULL;
ALTER TABLE crm_baraat_enquiries ADD COLUMN IF NOT EXISTS created_by UUID DEFAULT auth.uid();
ALTER TABLE crm_baraat_enquiries ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES crm_users(id) ON DELETE SET NULL;
ALTER TABLE crm_vendors ADD COLUMN IF NOT EXISTS created_by UUID DEFAULT auth.uid();
ALTER TABLE crm_invoices ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES crm_users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS crm_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID UNIQUE REFERENCES crm_users(id) ON DELETE CASCADE,
  employee_code VARCHAR(50) NOT NULL UNIQUE, crm_id VARCHAR(100) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL, mobile VARCHAR(50) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE,
  job_title VARCHAR(255) NOT NULL, designation VARCHAR(255), department VARCHAR(120) NOT NULL,
  employment_type VARCHAR(30) NOT NULL CHECK (employment_type IN ('Full Time','Part Time','Contract','Intern')),
  joining_date DATE NOT NULL, date_of_birth DATE, blood_group VARCHAR(3),
  status VARCHAR(30) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active','On Leave','Inactive')),
  hr_lifecycle_status VARCHAR(30) NOT NULL DEFAULT 'Active' CHECK (hr_lifecycle_status IN ('Active','Intern','Notice Period','Terminated','Ex-Employee')),
  work_location VARCHAR(255), shift_start TIME NOT NULL DEFAULT '10:00', shift_end TIME NOT NULL DEFAULT '19:00',
  address TEXT, emergency_contact_name VARCHAR(255), emergency_contact_mobile VARCHAR(50), notes TEXT, photo_url TEXT,
  reporting_manager_id UUID REFERENCES crm_staff(id) ON DELETE SET NULL,
  current_salary NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (current_salary >= 0),
  created_by UUID REFERENCES crm_users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crm_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), created_by UUID NOT NULL DEFAULT auth.uid(),
  staff_id UUID NOT NULL REFERENCES crm_staff(id) ON DELETE CASCADE, attendance_date DATE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Present' CHECK (status IN ('Present','Absent','Half Day','On Leave','Weekly Off','Holiday')),
  check_in TIME, check_out TIME, break_minutes INTEGER NOT NULL DEFAULT 0 CHECK (break_minutes >= 0),
  overtime_minutes INTEGER NOT NULL DEFAULT 0 CHECK (overtime_minutes >= 0), note TEXT,
  punch_in_selfie_url TEXT, punch_out_selfie_url TEXT, punch_in_device TEXT, punch_out_device TEXT,
  punch_in_browser TEXT, punch_out_browser TEXT, punch_in_ip INET, punch_out_ip INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (created_by, staff_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS crm_quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), quotation_number VARCHAR(40) NOT NULL UNIQUE,
  client_name VARCHAR(255) NOT NULL, mobile VARCHAR(50) NOT NULL, email VARCHAR(255), event_date DATE, valid_until DATE NOT NULL,
  package_name VARCHAR(100), pricing_mode VARCHAR(30) NOT NULL CHECK (pricing_mode IN ('Package Pricing','Detailed Pricing')),
  status VARCHAR(30) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Sent','Negotiation','Accepted','Rejected','Expired','Converted')),
  version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0), subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
  discount NUMERIC(14,2) NOT NULL DEFAULT 0, gst_percent NUMERIC(6,2) NOT NULL DEFAULT 0, total_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  converted_agreement_id UUID REFERENCES crm_agreements(id) ON DELETE SET NULL,
  verification_code VARCHAR(40) NOT NULL DEFAULT replace(uuid_generate_v4()::text, '-', '') UNIQUE,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb, created_by UUID NOT NULL DEFAULT auth.uid(),
  assigned_to UUID REFERENCES crm_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crm_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), recipient_id UUID NOT NULL REFERENCES crm_users(id) ON DELETE CASCADE,
  type VARCHAR(80) NOT NULL, title VARCHAR(255) NOT NULL, body TEXT, link TEXT, is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crm_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), title VARCHAR(255) NOT NULL, description TEXT,
  priority VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High','Urgent')), due_date TIMESTAMPTZ,
  assigned_by UUID REFERENCES crm_users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  status VARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Accepted','In Progress','On Hold','Completed','Rejected','Needs Revision')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100), completion_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_task_assignees (
  task_id UUID NOT NULL REFERENCES crm_tasks(id) ON DELETE CASCADE,
  staff_user_id UUID NOT NULL REFERENCES crm_users(id) ON DELETE CASCADE, created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(task_id,staff_user_id)
);
CREATE TABLE IF NOT EXISTS crm_task_checklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), task_id UUID NOT NULL REFERENCES crm_tasks(id) ON DELETE CASCADE,
  label TEXT NOT NULL, is_done BOOLEAN NOT NULL DEFAULT false, sort_order INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), task_id UUID NOT NULL REFERENCES crm_tasks(id) ON DELETE CASCADE,
  author_id UUID REFERENCES crm_users(id) ON DELETE SET NULL, comment TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_task_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), task_id UUID NOT NULL REFERENCES crm_tasks(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL, file_url TEXT NOT NULL, file_type TEXT, uploaded_by UUID REFERENCES crm_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crm_letter_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), letter_type VARCHAR(80) NOT NULL UNIQUE,
  label VARCHAR(255) NOT NULL, description TEXT, icon VARCHAR(80),
  category VARCHAR(30) NOT NULL CHECK (category IN ('Onboarding','Compensation','Compliance','Exit')),
  body_template TEXT NOT NULL, extra_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  requires_status VARCHAR(30), is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_employee_letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), letter_number VARCHAR(50) NOT NULL UNIQUE,
  employee_id UUID NOT NULL REFERENCES crm_staff(id) ON DELETE CASCADE, letter_type VARCHAR(80) NOT NULL,
  extra_fields JSONB NOT NULL DEFAULT '{}'::jsonb, rendered_text TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Generated' CHECK (status IN ('Generated','Sent','Archived')), file_url TEXT,
  verification_code VARCHAR(40) NOT NULL DEFAULT replace(uuid_generate_v4()::text, '-', '') UNIQUE,
  generated_by UUID REFERENCES crm_users(id) ON DELETE SET NULL DEFAULT auth.uid(), generated_by_name VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_employee_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), employee_id UUID NOT NULL REFERENCES crm_staff(id) ON DELETE CASCADE,
  category VARCHAR(120) NOT NULL, file_name TEXT NOT NULL, file_url TEXT NOT NULL, file_type TEXT, file_size BIGINT,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Verified','Rejected')),
  verified_by UUID REFERENCES crm_users(id) ON DELETE SET NULL, verified_by_name VARCHAR(255), verified_at TIMESTAMPTZ, remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_salary_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), employee_id UUID NOT NULL UNIQUE REFERENCES crm_staff(id) ON DELETE CASCADE,
  basic_salary NUMERIC(14,2) NOT NULL DEFAULT 0, hra NUMERIC(14,2) NOT NULL DEFAULT 0,
  special_allowance NUMERIC(14,2) NOT NULL DEFAULT 0, travel_allowance NUMERIC(14,2) NOT NULL DEFAULT 0,
  bonus NUMERIC(14,2) NOT NULL DEFAULT 0, incentive NUMERIC(14,2) NOT NULL DEFAULT 0,
  pf NUMERIC(14,2) NOT NULL DEFAULT 0, esic NUMERIC(14,2) NOT NULL DEFAULT 0,
  professional_tax NUMERIC(14,2) NOT NULL DEFAULT 0, other_deduction NUMERIC(14,2) NOT NULL DEFAULT 0,
  gross_salary NUMERIC(14,2) NOT NULL DEFAULT 0, net_salary NUMERIC(14,2) NOT NULL DEFAULT 0,
  effective_date DATE NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active','Held','Stopped')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_salary_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), employee_id UUID NOT NULL REFERENCES crm_staff(id) ON DELETE CASCADE,
  event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('Offer','Increment','Promotion','Revision','Transfer','Confirmation')),
  previous_salary NUMERIC(14,2) NOT NULL DEFAULT 0, new_salary NUMERIC(14,2) NOT NULL DEFAULT 0,
  effective_date DATE NOT NULL, reason TEXT, source_letter_id UUID REFERENCES crm_employee_letters(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_payroll (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), employee_id UUID NOT NULL REFERENCES crm_staff(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12), year INTEGER NOT NULL CHECK (year BETWEEN 2000 AND 2200),
  basic_salary NUMERIC(14,2) NOT NULL DEFAULT 0, hra NUMERIC(14,2) NOT NULL DEFAULT 0,
  special_allowance NUMERIC(14,2) NOT NULL DEFAULT 0, travel_allowance NUMERIC(14,2) NOT NULL DEFAULT 0,
  bonus NUMERIC(14,2) NOT NULL DEFAULT 0, incentive NUMERIC(14,2) NOT NULL DEFAULT 0,
  gross_salary NUMERIC(14,2) NOT NULL DEFAULT 0, pf NUMERIC(14,2) NOT NULL DEFAULT 0,
  esic NUMERIC(14,2) NOT NULL DEFAULT 0, professional_tax NUMERIC(14,2) NOT NULL DEFAULT 0,
  other_deduction NUMERIC(14,2) NOT NULL DEFAULT 0, net_salary NUMERIC(14,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Paid','Pending','Hold','Processing')),
  paid_on DATE, payment_reference TEXT, created_by UUID REFERENCES crm_users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(employee_id,month,year)
);
CREATE TABLE IF NOT EXISTS crm_payslips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), payroll_id UUID NOT NULL UNIQUE REFERENCES crm_payroll(id) ON DELETE CASCADE,
  payslip_number VARCHAR(50) NOT NULL UNIQUE, file_url TEXT,
  verification_code VARCHAR(40) NOT NULL DEFAULT replace(uuid_generate_v4()::text, '-', '') UNIQUE,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(), created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_hr_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), employee_id UUID REFERENCES crm_staff(id) ON DELETE SET NULL,
  action VARCHAR(120) NOT NULL, detail TEXT, actor UUID REFERENCES crm_users(id) ON DELETE SET NULL DEFAULT auth.uid(), actor_name VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS crm_notifications_recipient_idx ON crm_notifications(recipient_id,is_read,created_at DESC);
CREATE INDEX IF NOT EXISTS crm_task_assignees_user_idx ON crm_task_assignees(staff_user_id);
CREATE INDEX IF NOT EXISTS crm_attendance_staff_date_idx ON crm_attendance(staff_id,attendance_date DESC);
CREATE INDEX IF NOT EXISTS crm_quotations_assignee_idx ON crm_quotations(assigned_to);

CREATE OR REPLACE FUNCTION crm_next_quotation_number() RETURNS TEXT LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE y TEXT:=to_char(current_date,'YYYY'); n INTEGER;
BEGIN PERFORM pg_advisory_xact_lock(hashtext('crm-quotation-'||y));
SELECT COALESCE(MAX(NULLIF(regexp_replace(quotation_number,'^.*-',''),'')::INTEGER),0)+1 INTO n FROM crm_quotations WHERE quotation_number LIKE 'PMB-QTN-'||y||'-%';
RETURN 'PMB-QTN-'||y||'-'||lpad(n::TEXT,4,'0'); END; $$;
CREATE OR REPLACE FUNCTION crm_next_letter_number() RETURNS TEXT LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE y TEXT:=to_char(current_date,'YYYY'); n INTEGER;
BEGIN PERFORM pg_advisory_xact_lock(hashtext('crm-letter-'||y));
SELECT COALESCE(MAX(NULLIF(regexp_replace(letter_number,'^.*-',''),'')::INTEGER),0)+1 INTO n FROM crm_employee_letters WHERE letter_number LIKE 'PMB-HRL-'||y||'-%';
RETURN 'PMB-HRL-'||y||'-'||lpad(n::TEXT,4,'0'); END; $$;
CREATE OR REPLACE FUNCTION crm_next_payslip_number() RETURNS TEXT LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE y TEXT:=to_char(current_date,'YYYY'); n INTEGER;
BEGIN PERFORM pg_advisory_xact_lock(hashtext('crm-payslip-'||y));
SELECT COALESCE(MAX(NULLIF(regexp_replace(payslip_number,'^.*-',''),'')::INTEGER),0)+1 INTO n FROM crm_payslips WHERE payslip_number LIKE 'PMB-PS-'||y||'-%';
RETURN 'PMB-PS-'||y||'-'||lpad(n::TEXT,4,'0'); END; $$;

CREATE OR REPLACE FUNCTION resolve_crm_login(crm_id_input TEXT) RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
SELECT u.email FROM crm_staff s JOIN crm_users u ON u.id=s.user_id
WHERE u.is_active=true AND (lower(s.crm_id)=lower(btrim(crm_id_input)) OR lower(u.email)=lower(btrim(crm_id_input))) LIMIT 1; $$;

CREATE OR REPLACE FUNCTION punch_in(p_selfie_url TEXT,p_device TEXT,p_browser TEXT,p_ip TEXT DEFAULT NULL)
RETURNS crm_attendance LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE s crm_staff; r crm_attendance;
BEGIN SELECT * INTO s FROM crm_staff WHERE user_id=auth.uid() AND status='Active';
IF s.id IS NULL THEN RAISE EXCEPTION 'No active staff profile.'; END IF;
INSERT INTO crm_attendance(created_by,staff_id,attendance_date,status,check_in,punch_in_selfie_url,punch_in_device,punch_in_browser,punch_in_ip)
VALUES(auth.uid(),s.id,current_date,'Present',localtime,p_selfie_url,p_device,p_browser,NULLIF(p_ip,'')::INET)
ON CONFLICT(created_by,staff_id,attendance_date) DO UPDATE SET check_in=COALESCE(crm_attendance.check_in,excluded.check_in),punch_in_selfie_url=excluded.punch_in_selfie_url,punch_in_device=excluded.punch_in_device,punch_in_browser=excluded.punch_in_browser,punch_in_ip=excluded.punch_in_ip,updated_at=now()
RETURNING * INTO r; RETURN r; END; $$;
CREATE OR REPLACE FUNCTION punch_out(p_selfie_url TEXT,p_device TEXT,p_browser TEXT,p_ip TEXT DEFAULT NULL)
RETURNS crm_attendance LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE s crm_staff; r crm_attendance;
BEGIN SELECT * INTO s FROM crm_staff WHERE user_id=auth.uid() AND status='Active';
IF s.id IS NULL THEN RAISE EXCEPTION 'No active staff profile.'; END IF;
UPDATE crm_attendance SET check_out=localtime,punch_out_selfie_url=p_selfie_url,punch_out_device=p_device,punch_out_browser=p_browser,punch_out_ip=NULLIF(p_ip,'')::INET,updated_at=now()
WHERE staff_id=s.id AND attendance_date=current_date RETURNING * INTO r;
IF r.id IS NULL THEN RAISE EXCEPTION 'Punch in first.'; END IF; RETURN r; END; $$;

CREATE OR REPLACE FUNCTION crm_verify_document(p_code TEXT) RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
DECLARE result JSONB;
BEGIN
  SELECT jsonb_build_object('found',true,'audience','client','doc_type','Agreement','document_number',agreement_number,
    'party_label','Client','party_name',client_name,'event_date',event_date,'package_name',package_name,'status',status,
    'amount',final_amount,'version',version,'issued_date',created_at::DATE)
  INTO result FROM crm_agreements WHERE verification_code=p_code LIMIT 1; IF result IS NOT NULL THEN RETURN result; END IF;
  SELECT jsonb_build_object('found',true,'audience','vendor','doc_type','Vendor Agreement','document_number',vendor_agreement_number,
    'party_label','Vendor','party_name',vendor_name,'vendor_name',vendor_name,'service_category',service_category,'status',status,
    'agreement_end_date',agreement_end_date,'blacklist_status',blacklist_status,'version',version,'issued_date',created_at::DATE)
  INTO result FROM crm_vendor_agreements WHERE verification_code=p_code LIMIT 1; IF result IS NOT NULL THEN RETURN result; END IF;
  SELECT jsonb_build_object('found',true,'audience','client','doc_type',document_type,'document_number',invoice_number,
    'party_label','Client','party_name',client_name,'status',status,'amount',total_amount,'amount_paid',amount_paid,
    'balance_due',balance_due,'agreement_number',agreement_number,'issued_date',issue_date)
  INTO result FROM crm_invoices WHERE verification_code=p_code LIMIT 1; IF result IS NOT NULL THEN RETURN result; END IF;
  SELECT jsonb_build_object('found',true,'audience','client','doc_type','Quotation','document_number',quotation_number,
    'party_label','Client','party_name',client_name,'event_date',event_date,'package_name',package_name,'status',status,
    'amount',total_amount,'valid_until',valid_until,'version',version,'issued_date',created_at::DATE)
  INTO result FROM crm_quotations WHERE verification_code=p_code LIMIT 1; IF result IS NOT NULL THEN RETURN result; END IF;
  SELECT jsonb_build_object('found',true,'audience','employee','doc_type',replace(letter_type,'_',' '),'document_number',letter_number,
    'party_label','Employee','party_name',s.full_name,'status',l.status,'issued_date',l.created_at::DATE)
  INTO result FROM crm_employee_letters l JOIN crm_staff s ON s.id=l.employee_id WHERE l.verification_code=p_code LIMIT 1;
  IF result IS NOT NULL THEN RETURN result; END IF;
  SELECT jsonb_build_object('found',true,'audience','employee','doc_type','Payslip','document_number',p.payslip_number,
    'party_label','Employee','party_name',s.full_name,'status',r.status,'amount',r.net_salary,'month',r.month,'year',r.year,'issued_date',p.generated_at::DATE)
  INTO result FROM crm_payslips p JOIN crm_payroll r ON r.id=p.payroll_id JOIN crm_staff s ON s.id=r.employee_id
  WHERE p.verification_code=p_code LIMIT 1; IF result IS NOT NULL THEN RETURN result; END IF;
  RETURN jsonb_build_object('found',false);
END; $$;

-- Purge only the exact legacy demo UUIDs formerly bundled by schema.sql.
DELETE FROM crm_notes WHERE entity_id IN ('d6e0a4b5-0000-0000-0000-000000000001','e7f1b5c6-0000-0000-0000-000000000002');
DELETE FROM crm_customer_leads WHERE id IN ('e7f1b5c6-0000-0000-0000-000000000001','e7f1b5c6-0000-0000-0000-000000000002');
DELETE FROM crm_vendors WHERE id IN ('d6e0a4b5-0000-0000-0000-000000000001','d6e0a4b5-0000-0000-0000-000000000002','d6e0a4b5-0000-0000-0000-000000000003');
DELETE FROM crm_vendor_packages WHERE id IN ('c5d9f3a4-0000-0000-0000-000000000001','c5d9f3a4-0000-0000-0000-000000000002','c5d9f3a4-0000-0000-0000-000000000003');
DELETE FROM crm_categories WHERE id::TEXT LIKE 'b4c8e2f3-0000-0000-0000-00000000000_';
DELETE FROM crm_cities WHERE id::TEXT LIKE 'a3b7d1e2-0000-0000-0000-00000000000_';

DROP POLICY IF EXISTS "Allow all access for cities" ON crm_cities;
DROP POLICY IF EXISTS "Allow all access for categories" ON crm_categories;
DROP POLICY IF EXISTS "Allow all access for packages" ON crm_vendor_packages;
DROP POLICY IF EXISTS "Allow all access for vendors" ON crm_vendors;
DROP POLICY IF EXISTS "Allow all access for leads" ON crm_customer_leads;
DROP POLICY IF EXISTS "Allow all access for notes" ON crm_notes;
DROP POLICY IF EXISTS "Allow all access for files" ON crm_uploaded_files;
DROP POLICY IF EXISTS "Allow all access for baraat enquiries" ON crm_baraat_enquiries;

DO $$ DECLARE t TEXT; BEGIN
FOREACH t IN ARRAY ARRAY['crm_users','crm_staff','crm_attendance','crm_quotations','crm_notifications','crm_tasks','crm_task_assignees','crm_task_checklist','crm_task_comments','crm_task_attachments','crm_letter_templates','crm_employee_letters','crm_employee_documents','crm_salary_records','crm_salary_history','crm_payroll','crm_payslips','crm_hr_audit_logs']
LOOP EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY',t); EXECUTE format('REVOKE ALL ON %I FROM anon',t); EXECUTE format('GRANT SELECT,INSERT,UPDATE,DELETE ON %I TO authenticated',t); END LOOP;
END $$;

DROP POLICY IF EXISTS "CRM users read own or admin" ON crm_users;
DROP POLICY IF EXISTS "CRM users update own" ON crm_users;
DROP POLICY IF EXISTS "CRM users managed by admin" ON crm_users;
CREATE POLICY "CRM users read own or admin" ON crm_users FOR SELECT TO authenticated USING(id=auth.uid() OR is_crm_admin());
CREATE POLICY "CRM users update own" ON crm_users FOR UPDATE TO authenticated USING(id=auth.uid()) WITH CHECK(id=auth.uid());
CREATE POLICY "CRM users managed by admin" ON crm_users FOR ALL TO authenticated USING(is_crm_admin()) WITH CHECK(is_crm_admin());
REVOKE UPDATE ON crm_users FROM authenticated;
GRANT UPDATE(full_name,phone,avatar_url) ON crm_users TO authenticated;

DROP POLICY IF EXISTS "Staff visible to self or admin" ON crm_staff;
DROP POLICY IF EXISTS "Staff managed by admin" ON crm_staff;
CREATE POLICY "Staff visible to self or admin" ON crm_staff FOR SELECT TO authenticated USING(user_id=auth.uid() OR is_crm_admin());
CREATE POLICY "Staff managed by admin" ON crm_staff FOR ALL TO authenticated USING(is_crm_admin()) WITH CHECK(is_crm_admin());
DROP POLICY IF EXISTS "Attendance visible to self or admin" ON crm_attendance;
DROP POLICY IF EXISTS "Attendance managed by admin" ON crm_attendance;
CREATE POLICY "Attendance visible to self or admin" ON crm_attendance FOR SELECT TO authenticated USING(created_by=auth.uid() OR is_crm_admin());
CREATE POLICY "Attendance managed by admin" ON crm_attendance FOR ALL TO authenticated USING(is_crm_admin()) WITH CHECK(is_crm_admin());

DROP POLICY IF EXISTS "Notifications visible to recipient" ON crm_notifications;
DROP POLICY IF EXISTS "Notifications editable by recipient" ON crm_notifications;
DROP POLICY IF EXISTS "Notifications managed by admin" ON crm_notifications;
CREATE POLICY "Notifications visible to recipient" ON crm_notifications FOR SELECT TO authenticated USING(recipient_id=auth.uid() OR is_crm_admin());
CREATE POLICY "Notifications editable by recipient" ON crm_notifications FOR UPDATE TO authenticated USING(recipient_id=auth.uid()) WITH CHECK(recipient_id=auth.uid());
CREATE POLICY "Notifications managed by admin" ON crm_notifications FOR ALL TO authenticated USING(is_crm_admin()) WITH CHECK(is_crm_admin());

CREATE OR REPLACE FUNCTION can_access_crm_task(p_task UUID) RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
SELECT is_crm_admin() OR EXISTS(SELECT 1 FROM crm_tasks t WHERE t.id=p_task AND t.assigned_by=auth.uid())
OR EXISTS(SELECT 1 FROM crm_task_assignees a WHERE a.task_id=p_task AND a.staff_user_id=auth.uid()); $$;
DROP POLICY IF EXISTS "Tasks visible to participants" ON crm_tasks;
DROP POLICY IF EXISTS "Tasks updated by participants" ON crm_tasks;
DROP POLICY IF EXISTS "Tasks created by authenticated" ON crm_tasks;
DROP POLICY IF EXISTS "Tasks deleted by admin" ON crm_tasks;
CREATE POLICY "Tasks visible to participants" ON crm_tasks FOR SELECT TO authenticated USING(can_access_crm_task(id));
CREATE POLICY "Tasks updated by participants" ON crm_tasks FOR UPDATE TO authenticated USING(can_access_crm_task(id)) WITH CHECK(can_access_crm_task(id));
CREATE POLICY "Tasks created by authenticated" ON crm_tasks FOR INSERT TO authenticated WITH CHECK(assigned_by=auth.uid() OR is_crm_admin());
CREATE POLICY "Tasks deleted by admin" ON crm_tasks FOR DELETE TO authenticated USING(is_crm_admin());

DO $$ DECLARE t TEXT; BEGIN
FOREACH t IN ARRAY ARRAY['crm_task_assignees','crm_task_checklist','crm_task_comments','crm_task_attachments'] LOOP
EXECUTE format('DROP POLICY IF EXISTS "Task participants access" ON %I',t);
EXECUTE format('CREATE POLICY "Task participants access" ON %I FOR ALL TO authenticated USING (can_access_crm_task(task_id)) WITH CHECK (can_access_crm_task(task_id))',t);
END LOOP; END $$;

DO $$ DECLARE t TEXT; BEGIN
FOREACH t IN ARRAY ARRAY['crm_cities','crm_categories','crm_vendor_packages','crm_vendors','crm_baraat_enquiries','crm_uploaded_files','crm_letter_templates','crm_employee_letters','crm_employee_documents','crm_salary_records','crm_salary_history','crm_payroll','crm_payslips','crm_hr_audit_logs'] LOOP
EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY',t); EXECUTE format('REVOKE ALL ON %I FROM anon',t);
EXECUTE format('DROP POLICY IF EXISTS "Admin manages CRM data" ON %I',t);
EXECUTE format('CREATE POLICY "Admin manages CRM data" ON %I FOR ALL TO authenticated USING(is_crm_admin()) WITH CHECK(is_crm_admin())',t);
END LOOP; END $$;

DROP POLICY IF EXISTS "Staff see assigned leads" ON crm_customer_leads;
DROP POLICY IF EXISTS "Admin manages leads" ON crm_customer_leads;
CREATE POLICY "Staff see assigned leads" ON crm_customer_leads FOR SELECT TO authenticated USING(is_crm_admin() OR created_by=auth.uid() OR assigned_to=auth.uid());
CREATE POLICY "Admin manages leads" ON crm_customer_leads FOR ALL TO authenticated USING(is_crm_admin()) WITH CHECK(is_crm_admin());

DROP POLICY IF EXISTS "Quotations visible to owner or assignee" ON crm_quotations;
DROP POLICY IF EXISTS "Quotations created by authenticated" ON crm_quotations;
DROP POLICY IF EXISTS "Quotations editable by owner or assignee" ON crm_quotations;
DROP POLICY IF EXISTS "Quotations deleted by admin or owner" ON crm_quotations;
CREATE POLICY "Quotations visible to owner or assignee" ON crm_quotations FOR SELECT TO authenticated USING(is_crm_admin() OR created_by=auth.uid() OR assigned_to=auth.uid());
CREATE POLICY "Quotations created by authenticated" ON crm_quotations FOR INSERT TO authenticated WITH CHECK(created_by=auth.uid() OR is_crm_admin());
CREATE POLICY "Quotations editable by owner or assignee" ON crm_quotations FOR UPDATE TO authenticated USING(is_crm_admin() OR created_by=auth.uid() OR assigned_to=auth.uid()) WITH CHECK(is_crm_admin() OR created_by=auth.uid() OR assigned_to=auth.uid());
CREATE POLICY "Quotations deleted by admin or owner" ON crm_quotations FOR DELETE TO authenticated USING(is_crm_admin() OR created_by=auth.uid());

DROP POLICY IF EXISTS "Agreement owners can read" ON crm_agreements;
DROP POLICY IF EXISTS "Agreement owners can insert" ON crm_agreements;
DROP POLICY IF EXISTS "Agreement owners can update" ON crm_agreements;
DROP POLICY IF EXISTS "Agreement owners can delete" ON crm_agreements;
CREATE POLICY "Agreement owners can read" ON crm_agreements FOR SELECT TO authenticated USING(is_crm_admin() OR created_by=auth.uid() OR assigned_to=auth.uid());
CREATE POLICY "Agreement owners can insert" ON crm_agreements FOR INSERT TO authenticated WITH CHECK(is_crm_admin() OR created_by=auth.uid());
CREATE POLICY "Agreement owners can update" ON crm_agreements FOR UPDATE TO authenticated USING(is_crm_admin() OR created_by=auth.uid() OR assigned_to=auth.uid()) WITH CHECK(is_crm_admin() OR created_by=auth.uid() OR assigned_to=auth.uid());
CREATE POLICY "Agreement owners can delete" ON crm_agreements FOR DELETE TO authenticated USING(is_crm_admin() OR created_by=auth.uid());

DROP POLICY IF EXISTS "Invoice owners can read" ON crm_invoices;
DROP POLICY IF EXISTS "Invoice owners can insert" ON crm_invoices;
DROP POLICY IF EXISTS "Invoice owners can update" ON crm_invoices;
DROP POLICY IF EXISTS "Invoice owners can delete" ON crm_invoices;
CREATE POLICY "Invoice owners can read" ON crm_invoices FOR SELECT TO authenticated USING(is_crm_admin() OR created_by=auth.uid() OR assigned_to=auth.uid());
CREATE POLICY "Invoice owners can insert" ON crm_invoices FOR INSERT TO authenticated WITH CHECK(is_crm_admin() OR created_by=auth.uid());
CREATE POLICY "Invoice owners can update" ON crm_invoices FOR UPDATE TO authenticated USING(is_crm_admin() OR created_by=auth.uid() OR assigned_to=auth.uid()) WITH CHECK(is_crm_admin() OR created_by=auth.uid() OR assigned_to=auth.uid());
CREATE POLICY "Invoice owners can delete" ON crm_invoices FOR DELETE TO authenticated USING(is_crm_admin() OR created_by=auth.uid());

ALTER TABLE crm_notes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON crm_notes,crm_customer_leads FROM anon;
DROP POLICY IF EXISTS "Notes visible to related users" ON crm_notes;
DROP POLICY IF EXISTS "Notes insertable by related users" ON crm_notes;
DROP POLICY IF EXISTS "Notes managed by admin" ON crm_notes;
CREATE POLICY "Notes visible to related users" ON crm_notes FOR SELECT TO authenticated USING(is_crm_admin() OR (entity_type='lead' AND EXISTS(SELECT 1 FROM crm_customer_leads l WHERE l.id=entity_id AND (l.created_by=auth.uid() OR l.assigned_to=auth.uid()))));
CREATE POLICY "Notes insertable by related users" ON crm_notes FOR INSERT TO authenticated WITH CHECK(is_crm_admin() OR (entity_type='lead' AND EXISTS(SELECT 1 FROM crm_customer_leads l WHERE l.id=entity_id AND (l.created_by=auth.uid() OR l.assigned_to=auth.uid()))));
CREATE POLICY "Notes managed by admin" ON crm_notes FOR ALL TO authenticated USING(is_crm_admin()) WITH CHECK(is_crm_admin());

GRANT EXECUTE ON FUNCTION resolve_crm_login(TEXT) TO anon,authenticated;
GRANT EXECUTE ON FUNCTION crm_verify_document(TEXT) TO anon,authenticated;
GRANT EXECUTE ON FUNCTION punch_in(TEXT,TEXT,TEXT,TEXT),punch_out(TEXT,TEXT,TEXT,TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION crm_next_quotation_number(),crm_next_letter_number(),crm_next_payslip_number() TO authenticated;
REVOKE EXECUTE ON FUNCTION is_crm_admin(),crm_handle_new_auth_user(),can_access_crm_task(UUID) FROM PUBLIC,anon;

INSERT INTO storage.buckets(id,name,public) VALUES
('crm-files','crm-files',false),('profile-photos','profile-photos',false),('attendance-selfies','attendance-selfies',false),('task-attachments','task-attachments',false)
ON CONFLICT(id) DO UPDATE SET public=false;
UPDATE storage.buckets SET public=true WHERE id='profile-photos';
DROP POLICY IF EXISTS "CRM authenticated storage read" ON storage.objects;
DROP POLICY IF EXISTS "CRM authenticated storage insert" ON storage.objects;
DROP POLICY IF EXISTS "CRM authenticated storage update" ON storage.objects;
DROP POLICY IF EXISTS "CRM authenticated storage delete" ON storage.objects;
CREATE POLICY "CRM authenticated storage read" ON storage.objects FOR SELECT TO authenticated USING(bucket_id IN ('crm-files','profile-photos','attendance-selfies','task-attachments'));
CREATE POLICY "CRM authenticated storage insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK(bucket_id IN ('crm-files','profile-photos','attendance-selfies','task-attachments') AND owner=auth.uid());
CREATE POLICY "CRM authenticated storage update" ON storage.objects FOR UPDATE TO authenticated USING(bucket_id IN ('crm-files','profile-photos','attendance-selfies','task-attachments') AND (owner=auth.uid() OR is_crm_admin())) WITH CHECK(bucket_id IN ('crm-files','profile-photos','attendance-selfies','task-attachments') AND (owner=auth.uid() OR is_crm_admin()));
CREATE POLICY "CRM authenticated storage delete" ON storage.objects FOR DELETE TO authenticated USING(bucket_id IN ('crm-files','profile-photos','attendance-selfies','task-attachments') AND (owner=auth.uid() OR is_crm_admin()));
