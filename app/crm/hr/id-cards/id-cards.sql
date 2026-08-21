-- ID Cards module — additive migration, mirrors the conventions already used
-- by crm_staff / crm_employee_letters / crm_payslips (schema.sql,
-- production-completion.sql, manager-permissions.sql, staff-permissions.sql).
-- Safe to re-run: every statement is IF NOT EXISTS / CREATE OR REPLACE / DROP+CREATE.
-- Applied live to the PlanMyBaraat Supabase project (pldkbuwpdqbfrmkxlcqm) via
-- the Supabase MCP `apply_migration` tool; kept here too so it lives in the
-- repo/migrations history the same way every other schema change does.

CREATE TABLE IF NOT EXISTS crm_id_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES crm_staff(id) ON DELETE CASCADE,
  card_number VARCHAR(50) NOT NULL,
  version INT NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Generated','Active','Expired','Revoked')),
  -- Snapshot of the fields that were actually printed on this version — so a
  -- later edit to the staff record never silently rewrites an already-issued
  -- card. Regenerating creates a NEW version row with a fresh snapshot.
  front_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  back_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  verification_code TEXT NOT NULL DEFAULT replace(uuid_generate_v4()::text, '-', ''),
  pdf_path TEXT,
  issued_date DATE,
  expires_on DATE,
  generated_at TIMESTAMPTZ,
  generated_by UUID REFERENCES crm_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (verification_code),
  UNIQUE (employee_id, version)
);
CREATE INDEX IF NOT EXISTS idx_crm_id_cards_employee ON crm_id_cards(employee_id);
CREATE INDEX IF NOT EXISTS idx_crm_id_cards_status ON crm_id_cards(status);

-- Single configurable-settings row (admin-tunable print spec). No generic
-- singleton-settings table exists elsewhere in this project to copy, so this
-- follows the same "fixed-uuid row, admin-only writes" shape used for every
-- other admin-managed table (is_crm_admin()-gated RLS).
CREATE TABLE IF NOT EXISTS crm_id_card_settings (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  -- Portrait by default (worn vertically on a lanyard) — same physical CR80
  -- card stock, just rotated: width is CR80's short edge, height its long edge.
  card_width_mm NUMERIC(6,2) NOT NULL DEFAULT 53.98,
  card_height_mm NUMERIC(6,2) NOT NULL DEFAULT 85.60,
  bleed_mm NUMERIC(5,2) NOT NULL DEFAULT 2,
  -- 4.5mm — comfortably bigger than the card's own ~3.18mm die-cut corner
  -- radius, so content near a corner (the QR box especially) never visually
  -- collides with the printed card's rounded edge.
  safe_margin_mm NUMERIC(5,2) NOT NULL DEFAULT 4.5,
  sheet_width_mm NUMERIC(6,2) NOT NULL DEFAULT 210,
  sheet_height_mm NUMERIC(6,2) NOT NULL DEFAULT 297,
  sheet_margin_mm NUMERIC(5,2) NOT NULL DEFAULT 10,
  horizontal_gap_mm NUMERIC(5,2) NOT NULL DEFAULT 4,
  vertical_gap_mm NUMERIC(5,2) NOT NULL DEFAULT 4,
  duplex_mode VARCHAR(20) NOT NULL DEFAULT 'long_edge' CHECK (duplex_mode IN ('long_edge','short_edge')),
  validity_years NUMERIC(4,1) NOT NULL DEFAULT 2,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES crm_users(id) ON DELETE SET NULL
);
INSERT INTO crm_id_card_settings (id) VALUES ('00000000-0000-0000-0000-000000000001') ON CONFLICT (id) DO NOTHING;

ALTER TABLE crm_id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_id_card_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON crm_id_cards FROM anon;
REVOKE ALL ON crm_id_card_settings FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON crm_id_cards TO authenticated;
GRANT SELECT, UPDATE ON crm_id_card_settings TO authenticated;

-- Admin-portal only, by design: no self-service visibility for the employee
-- whose card it is (unlike crm_staff's own "visible to self or admin" rule).
-- The module has no Staff Workspace page at all, and this keeps it that way
-- at the database layer too — only CRM admins/super-admins or a Manager
-- explicitly granted the 'idCards' section toggle can read these rows.
DROP POLICY IF EXISTS "Id cards visible to self, admin or manager" ON crm_id_cards;
DROP POLICY IF EXISTS "Id cards visible to admin or manager" ON crm_id_cards;
CREATE POLICY "Id cards visible to admin or manager" ON crm_id_cards FOR SELECT TO authenticated
USING (is_crm_admin() OR crm_manager_has_section('idCards'));

DROP POLICY IF EXISTS "Id cards managed by admin or manager" ON crm_id_cards;
CREATE POLICY "Id cards managed by admin or manager" ON crm_id_cards FOR ALL TO authenticated
USING (is_crm_admin() OR crm_manager_has_section('idCards'))
WITH CHECK (is_crm_admin() OR crm_manager_has_section('idCards'));

DROP POLICY IF EXISTS "Id card settings readable by authenticated" ON crm_id_card_settings;
CREATE POLICY "Id card settings readable by authenticated" ON crm_id_card_settings FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Id card settings managed by admin" ON crm_id_card_settings;
CREATE POLICY "Id card settings managed by admin" ON crm_id_card_settings FOR ALL TO authenticated USING (is_crm_admin()) WITH CHECK (is_crm_admin());

-- Extend the existing public verification RPC (already generalized for a
-- 'employee' audience via Letters/Payslips) with one more branch for ID
-- cards. CREATE OR REPLACE with the exact live function body plus one new
-- lookup at the end (before the final "not found") — every existing branch
-- is reproduced unchanged, so no other document type's verification behavior
-- is touched.
CREATE OR REPLACE FUNCTION public.crm_verify_document(p_code text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_row record;
begin
  if p_code is null or length(trim(p_code)) = 0 then
    return jsonb_build_object('found', false);
  end if;

  select agreement_number as document_number, client_name as party_name, event_date,
         package_name, status, final_amount as amount, version, created_at
    into v_row
    from crm_agreements where verification_code = p_code;
  if found then
    insert into crm_document_verifications (verification_code, doc_type, document_number)
      values (p_code, 'Client Agreement', v_row.document_number);
    return jsonb_build_object(
      'found', true, 'audience', 'client', 'doc_type', 'Client Agreement',
      'document_number', v_row.document_number, 'party_label', 'Client', 'party_name', v_row.party_name,
      'event_date', v_row.event_date, 'package_name', v_row.package_name, 'status', v_row.status,
      'amount', v_row.amount, 'version', v_row.version, 'issued_date', v_row.created_at
    );
  end if;

  select quotation_number as document_number, client_name as party_name, event_date, package_name,
         status, total_amount as amount, valid_until, version, created_at
    into v_row
    from crm_quotations where verification_code = p_code;
  if found then
    insert into crm_document_verifications (verification_code, doc_type, document_number)
      values (p_code, 'Client Quotation', v_row.document_number);
    return jsonb_build_object(
      'found', true, 'audience', 'client', 'doc_type', 'Client Quotation',
      'document_number', v_row.document_number, 'party_label', 'Client', 'party_name', v_row.party_name,
      'event_date', v_row.event_date, 'package_name', v_row.package_name, 'status', v_row.status,
      'amount', v_row.amount, 'valid_until', v_row.valid_until, 'version', v_row.version, 'issued_date', v_row.created_at
    );
  end if;

  select invoice_number as document_number, client_name as party_name, document_type, status,
         total_amount as amount, amount_paid, balance_due, issue_date, agreement_number, created_at
    into v_row
    from crm_invoices where verification_code = p_code;
  if found then
    insert into crm_document_verifications (verification_code, doc_type, document_number)
      values (p_code, v_row.document_type, v_row.document_number);
    return jsonb_build_object(
      'found', true, 'audience', 'client', 'doc_type', v_row.document_type,
      'document_number', v_row.document_number, 'party_label', 'Client', 'party_name', v_row.party_name,
      'status', v_row.status, 'amount', v_row.amount, 'amount_paid', v_row.amount_paid,
      'balance_due', v_row.balance_due, 'issue_date', v_row.issue_date, 'agreement_number', v_row.agreement_number,
      'issued_date', v_row.created_at
    );
  end if;

  select vendor_agreement_number as document_number, coalesce(business_name, vendor_name) as party_name,
         vendor_name, service_category, status, agreement_end_date, blacklist_status, version, created_at
    into v_row
    from crm_vendor_agreements where verification_code = p_code;
  if found then
    insert into crm_document_verifications (verification_code, doc_type, document_number)
      values (p_code, 'Vendor Agreement', v_row.document_number);
    return jsonb_build_object(
      'found', true, 'audience', 'vendor', 'doc_type', 'Vendor Agreement',
      'document_number', v_row.document_number, 'party_label', 'Vendor', 'party_name', v_row.party_name,
      'vendor_name', v_row.vendor_name, 'service_category', v_row.service_category, 'status', v_row.status,
      'agreement_end_date', v_row.agreement_end_date, 'blacklist_status', v_row.blacklist_status,
      'version', v_row.version, 'issued_date', v_row.created_at
    );
  end if;

  select l.letter_number as document_number, s.full_name as party_name, t.label as letter_label,
         l.status, l.created_at
    into v_row
    from crm_employee_letters l
    join crm_staff s on s.id = l.employee_id
    join crm_letter_templates t on t.letter_type = l.letter_type
    where l.verification_code = p_code;
  if found then
    insert into crm_document_verifications (verification_code, doc_type, document_number)
      values (p_code, 'Employee Letter', v_row.document_number);
    return jsonb_build_object(
      'found', true, 'audience', 'employee', 'doc_type', v_row.letter_label,
      'document_number', v_row.document_number, 'party_label', 'Employee', 'party_name', v_row.party_name,
      'status', v_row.status, 'issued_date', v_row.created_at
    );
  end if;

  select p.payslip_number as document_number, s.full_name as party_name, pr.month, pr.year,
         pr.net_salary as amount, pr.status, p.generated_at as created_at
    into v_row
    from crm_payslips p
    join crm_payroll pr on pr.id = p.payroll_id
    join crm_staff s on s.id = pr.employee_id
    where p.verification_code = p_code;
  if found then
    insert into crm_document_verifications (verification_code, doc_type, document_number)
      values (p_code, 'Payslip', v_row.document_number);
    return jsonb_build_object(
      'found', true, 'audience', 'employee', 'doc_type', 'Payslip',
      'document_number', v_row.document_number, 'party_label', 'Employee', 'party_name', v_row.party_name,
      'status', v_row.status, 'amount', v_row.amount, 'month', v_row.month, 'year', v_row.year,
      'issued_date', v_row.created_at
    );
  end if;

  -- NEW: ID Card branch. Only non-sensitive fields are ever selected here —
  -- no photo, no phone/address/emergency-contact — matching the "public,
  -- unauthenticated page" design already established for every other branch.
  select c.card_number as document_number, s.full_name as party_name,
         coalesce(s.designation, s.job_title) as designation, s.department,
         c.status, c.version, c.issued_date as created_at
    into v_row
    from crm_id_cards c
    join crm_staff s on s.id = c.employee_id
    where c.verification_code = p_code;
  if found then
    insert into crm_document_verifications (verification_code, doc_type, document_number)
      values (p_code, 'ID Card', v_row.document_number);
    return jsonb_build_object(
      'found', true, 'audience', 'employee', 'doc_type', 'ID Card',
      'document_number', v_row.document_number, 'party_label', 'Employee', 'party_name', v_row.party_name,
      'status', v_row.status, 'version', v_row.version, 'issued_date', v_row.created_at,
      'designation', v_row.designation, 'department', v_row.department
    );
  end if;

  return jsonb_build_object('found', false);
end;
$function$;

-- Switch the existing settings row over to portrait (only if it's still at
-- the old landscape default — never clobbers a real admin customization).
UPDATE crm_id_card_settings SET card_width_mm = 53.98, card_height_mm = 85.60, updated_at = now()
  WHERE id = '00000000-0000-0000-0000-000000000001' AND card_width_mm = 85.60 AND card_height_mm = 53.98;

-- The existing "Profile photo upload/update to own folder" policies on
-- storage.objects only let a user write into a path whose first folder
-- segment is their OWN auth.uid() — fine for self-service uploads, but it
-- silently blocked an HR admin/manager from uploading or replacing ANOTHER
-- employee's photo (both the existing Staff module's photo upload, which
-- writes to employee-photos/<employeeId>/…, and this module's photo upload,
-- which writes to id-card-photos/<employeeId>/…), surfacing as "new row
-- violates row-level security policy". This is an additive admin/manager
-- bypass; the original own-folder self-service policies are untouched.
DROP POLICY IF EXISTS "Profile photo managed by admin or HR manager" ON storage.objects;
CREATE POLICY "Profile photo managed by admin or HR manager" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos'
  AND (is_crm_admin() OR crm_manager_has_section('idCards') OR crm_manager_has_section('staff'))
);

DROP POLICY IF EXISTS "Profile photo updated by admin or HR manager" ON storage.objects;
CREATE POLICY "Profile photo updated by admin or HR manager" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND (is_crm_admin() OR crm_manager_has_section('idCards') OR crm_manager_has_section('staff'))
)
WITH CHECK (
  bucket_id = 'profile-photos'
  AND (is_crm_admin() OR crm_manager_has_section('idCards') OR crm_manager_has_section('staff'))
);

-- Widen the existing settings row's safe margin to clear the card's own
-- rounded corner (only if it's still at the old 3mm default — never
-- clobbers a real admin customization).
UPDATE crm_id_card_settings SET safe_margin_mm = 4.5, updated_at = now()
  WHERE id = '00000000-0000-0000-0000-000000000001' AND safe_margin_mm = 3;
