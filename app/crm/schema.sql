-- ─── CRM SQL SCHEMA ─────────────────────────────────────────────────────────

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Identity must exist before any CRM RLS policy calls is_crm_admin().
CREATE TABLE IF NOT EXISTS crm_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    email VARCHAR(255),
    role VARCHAR(30) NOT NULL DEFAULT 'staff'
      CHECK (role IN ('admin', 'super_admin', 'staff', 'sales', 'manager', 'vendor', 'accountant')),
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE OR REPLACE FUNCTION is_crm_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM crm_users
    WHERE id = auth.uid() AND is_active = true AND role IN ('admin', 'super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION crm_handle_new_auth_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO crm_users (id, full_name, email, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(COALESCE(NEW.email, ''), '@', 1)), NEW.email, 'staff')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_auth_user_created ON auth.users;
CREATE TRIGGER crm_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION crm_handle_new_auth_user();

-- 1. Cities Table
CREATE TABLE IF NOT EXISTS crm_cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    state VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS crm_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Vendor Packages Table
CREATE TABLE IF NOT EXISTS crm_vendor_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC,
    features TEXT,
    type VARCHAR(20) DEFAULT 'customer' CHECK (type IN ('vendor', 'customer')),
    items JSONB,
    vendor_cost NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Backfill columns for existing installs (safe to re-run)
ALTER TABLE crm_vendor_packages ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'customer';
ALTER TABLE crm_vendor_packages ADD COLUMN IF NOT EXISTS items JSONB;
ALTER TABLE crm_vendor_packages ADD COLUMN IF NOT EXISTS vendor_cost NUMERIC;

-- 4. Vendors Table
CREATE TABLE IF NOT EXISTS crm_vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    city_id UUID REFERENCES crm_cities(id) ON DELETE SET NULL,
    category_id UUID REFERENCES crm_categories(id) ON DELETE SET NULL,
    package_id UUID REFERENCES crm_vendor_packages(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Interested', 'Converted', 'Lost')),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Customer Leads Table
CREATE TABLE IF NOT EXISTS crm_customer_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    city_id UUID REFERENCES crm_cities(id) ON DELETE SET NULL,
    requirement TEXT,
    event_date DATE,
    package_discussed VARCHAR(255),
    status VARCHAR(50) DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Interested', 'Converted', 'Lost')),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Notes Table
CREATE TABLE IF NOT EXISTS crm_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('vendor', 'lead')),
    entity_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_by VARCHAR(255) DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Uploaded Files Table
CREATE TABLE IF NOT EXISTS crm_uploaded_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('vendor', 'lead')),
    entity_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Baraat Package Enquiries Table (separate module from Customer Leads)
CREATE TABLE IF NOT EXISTS crm_baraat_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    event_date DATE,
    mobile VARCHAR(50) NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Interested', 'Converted', 'Lost')),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Baraat Management Contracts
CREATE TABLE IF NOT EXISTS crm_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_number VARCHAR(40) NOT NULL UNIQUE,
    client_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    event_date DATE,
    package_name VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Draft'
      CHECK (status IN ('Draft', 'Sent', 'Signed', 'Completed', 'Cancelled')),
    version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
    final_amount NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (final_amount >= 0),
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by UUID DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS crm_agreements_client_search_idx ON crm_agreements (lower(client_name));
CREATE INDEX IF NOT EXISTS crm_agreements_event_date_idx ON crm_agreements (event_date);
CREATE INDEX IF NOT EXISTS crm_agreements_status_idx ON crm_agreements (status);
CREATE INDEX IF NOT EXISTS crm_agreements_created_by_idx ON crm_agreements (created_by);
ALTER TABLE crm_agreements ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES crm_users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS crm_agreements_assigned_to_idx ON crm_agreements (assigned_to);

-- Generates the next human-readable number within the caller's visible records.
-- The transaction lock prevents two admins from receiving the same sequence.
CREATE OR REPLACE FUNCTION crm_next_agreement_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  current_year TEXT := to_char(current_date, 'YYYY');
  next_sequence INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('crm_agreement_number_' || current_year));
  SELECT COALESCE(MAX((regexp_match(agreement_number, '([0-9]+)$'))[1]::INTEGER), 0) + 1
    INTO next_sequence
    FROM crm_agreements
   WHERE agreement_number LIKE 'PMB-CSA-' || current_year || '-%';
  RETURN 'PMB-CSA-' || current_year || '-' || lpad(next_sequence::TEXT, 4, '0');
END;
$$;

-- ─── ROW LEVEL SECURITY (RLS) POLICIES ──────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE crm_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_vendor_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_customer_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_baraat_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_agreements ENABLE ROW LEVEL SECURITY;

-- Allow anonymous or authenticated access for easy testing (as requested, prepare structure)
DROP POLICY IF EXISTS "Allow all access for cities" ON crm_cities;
CREATE POLICY "Allow all access for cities" ON crm_cities FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access for categories" ON crm_categories;
CREATE POLICY "Allow all access for categories" ON crm_categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access for packages" ON crm_vendor_packages;
CREATE POLICY "Allow all access for packages" ON crm_vendor_packages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access for vendors" ON crm_vendors;
CREATE POLICY "Allow all access for vendors" ON crm_vendors FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access for leads" ON crm_customer_leads;
CREATE POLICY "Allow all access for leads" ON crm_customer_leads FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access for notes" ON crm_notes;
CREATE POLICY "Allow all access for notes" ON crm_notes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access for files" ON crm_uploaded_files;
CREATE POLICY "Allow all access for files" ON crm_uploaded_files FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access for baraat enquiries" ON crm_baraat_enquiries;
CREATE POLICY "Allow all access for baraat enquiries" ON crm_baraat_enquiries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Agreement owners can read" ON crm_agreements;
CREATE POLICY "Agreement owners can read" ON crm_agreements
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = created_by);

DROP POLICY IF EXISTS "Agreement owners can insert" ON crm_agreements;
CREATE POLICY "Agreement owners can insert" ON crm_agreements
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = created_by);

DROP POLICY IF EXISTS "Agreement owners can update" ON crm_agreements;
CREATE POLICY "Agreement owners can update" ON crm_agreements
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = created_by)
  WITH CHECK ((SELECT auth.uid()) = created_by);

DROP POLICY IF EXISTS "Agreement owners can delete" ON crm_agreements;
CREATE POLICY "Agreement owners can delete" ON crm_agreements
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = created_by);

GRANT SELECT, INSERT, UPDATE, DELETE ON crm_agreements TO authenticated;
REVOKE ALL ON crm_agreements FROM anon;
GRANT EXECUTE ON FUNCTION crm_next_agreement_number() TO authenticated;
REVOKE EXECUTE ON FUNCTION crm_next_agreement_number() FROM anon;

-- Extend the shared CRM attachment store to agreement records.
ALTER TABLE crm_uploaded_files DROP CONSTRAINT IF EXISTS crm_uploaded_files_entity_type_check;
ALTER TABLE crm_uploaded_files ADD CONSTRAINT crm_uploaded_files_entity_type_check
  CHECK (entity_type IN ('vendor', 'lead', 'agreement'));

-- ─── STORAGE BUCKET CREATION ────────────────────────────────────────────────
-- (Note: Run this inside Supabase SQL editor to create the crm-files bucket)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('crm-files', 'crm-files', true) ON CONFLICT (id) DO NOTHING;
-- CREATE POLICY "Allow public storage upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'crm-files');
-- CREATE POLICY "Allow public storage select" ON storage.objects FOR SELECT USING (bucket_id = 'crm-files');
-- CREATE POLICY "Allow public storage delete" ON storage.objects FOR DELETE USING (bucket_id = 'crm-files');

-- ─── DEMO SEED DATA ─────────────────────────────────────────────────────────

-- Seed Cities
INSERT INTO crm_cities (id, name, state) VALUES
('a3b7d1e2-0000-0000-0000-000000000001', 'Mumbai', 'Maharashtra'),
('a3b7d1e2-0000-0000-0000-000000000002', 'Delhi', 'Delhi'),
('a3b7d1e2-0000-0000-0000-000000000003', 'Jaipur', 'Rajasthan'),
('a3b7d1e2-0000-0000-0000-000000000004', 'Goa', 'Goa')
ON CONFLICT (id) DO NOTHING;

-- Seed Categories
INSERT INTO crm_categories (id, name, description) VALUES
('b4c8e2f3-0000-0000-0000-000000000001', 'Band & Ghodi', 'Traditional brass bands, bagpipers, and wedding carriages/horses.'),
('b4c8e2f3-0000-0000-0000-000000000002', 'Dhol Players', 'Energetic Punjabi Dhol and Nashik Dhol groups.'),
('b4c8e2f3-0000-0000-0000-000000000003', 'Safa & Pagri', 'Turban tying artists and fancy wedding turbans.'),
('b4c8e2f3-0000-0000-0000-000000000004', 'Vintage Cars', 'Classic and luxury wedding cars for the groom and family.')
ON CONFLICT (id) DO NOTHING;

-- Seed Packages
INSERT INTO crm_vendor_packages (id, name, description, price, features) VALUES
('c5d9f3a4-0000-0000-0000-000000000001', 'Silver Package', 'Basic listing, 5 photos upload, lead notifications.', 15000, 'Basic listing, 5 photos upload, lead notifications'),
('c5d9f3a4-0000-0000-0000-000000000002', 'Gold Package', 'Featured listing, 15 photos, verified badge, direct lead access.', 35000, 'Featured listing, 15 photos, verified badge, direct lead access'),
('c5d9f3a4-0000-0000-0000-000000000003', 'Diamond Package', 'Premium top-tier placement, video upload, custom route simulation integration, dedicated account support.', 75000, 'Premium placement, video upload, route simulation, dedicated account support')
ON CONFLICT (id) DO NOTHING;

-- Seed Vendors
INSERT INTO crm_vendors (id, company_name, contact_person, mobile, email, city_id, category_id, package_id, status, remarks) VALUES
(
    'd6e0a4b5-0000-0000-0000-000000000001',
    'Jeet Ghodi & Brass Band',
    'Jeetendra Singh',
    '+91 9811223344',
    'jeetghodi@example.com',
    'a3b7d1e2-0000-0000-0000-000000000002', -- Delhi
    'b4c8e2f3-0000-0000-0000-000000000001', -- Band & Ghodi
    'c5d9f3a4-0000-0000-0000-000000000002', -- Gold
    'Converted',
    'Highly professional. Has a white mare and 11-member band team. Verified deposit received.'
),
(
    'd6e0a4b5-0000-0000-0000-000000000002',
    'Royal Safa Bandhni',
    'Tejabhai Patel',
    '+91 9822334455',
    'tejasafa@example.com',
    'a3b7d1e2-0000-0000-0000-000000000003', -- Jaipur
    'b4c8e2f3-0000-0000-0000-000000000003', -- Safa & Pagri
    'c5d9f3a4-0000-0000-0000-000000000003', -- Diamond
    'Interested',
    'Interested in premium diamond package. Needs custom safe selector tool training.'
),
(
    'd6e0a4b5-0000-0000-0000-000000000003',
    'Goa Dhol & Events',
    'Francis D''Souza',
    '+91 9833445566',
    'goadhol@example.com',
    'a3b7d1e2-0000-0000-0000-000000000004', -- Goa
    'b4c8e2f3-0000-0000-0000-000000000002', -- Dhol Players
    'c5d9f3a4-0000-0000-0000-000000000001', -- Silver
    'Contacted',
    'Sent initial presentation. Awaiting callback.'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Customer Leads
INSERT INTO crm_customer_leads (id, customer_name, mobile, email, city_id, requirement, event_date, package_discussed, status, remarks) VALUES
(
    'e7f1b5c6-0000-0000-0000-000000000001',
    'Amit Sharma',
    '+91 9911223344',
    'amit.sharma@example.com',
    'a3b7d1e2-0000-0000-0000-000000000002', -- Delhi
    'Wants vintage wedding car (Rolls Royce or similar) and premium Rajasthani Dhol team for Baraat entry.',
    '2026-11-20',
    'Vintage Gold Package',
    'Converted',
    'Deposit of ₹10,000 received. Booked rolls royce and dhol team.'
),
(
    'e7f1b5c6-0000-0000-0000-000000000002',
    'Rohan Mehta',
    '+91 9922334455',
    'rohan.mehta@example.com',
    'a3b7d1e2-0000-0000-0000-000000000001', -- Mumbai
    'Wants Ghodi with premium royal look, bagpipers band, and 200 safas/turbans for guest family.',
    '2026-12-15',
    'Custom Diamond package',
    'Interested',
    'Very interested. Negotiating rates for safa tying artists.'
)
ON CONFLICT (id) DO NOTHING;

-- Seed some notes
INSERT INTO crm_notes (entity_type, entity_id, content, created_by) VALUES
('vendor', 'd6e0a4b5-0000-0000-0000-000000000001', 'Called client. Discussed rates and details.', 'Tejabhai'),
('vendor', 'd6e0a4b5-0000-0000-0000-000000000001', 'Sent payment link for token amount.', 'Admin'),
('lead', 'e7f1b5c6-0000-0000-0000-000000000002', 'Shared quotes for Mumbai based vendors.', 'Tejabhai');

-- 10. Client invoices, advance vouchers and payment receipts
CREATE TABLE IF NOT EXISTS crm_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(32) NOT NULL UNIQUE,
    agreement_id UUID REFERENCES crm_agreements(id) ON DELETE SET NULL,
    agreement_number VARCHAR(40),
    document_type VARCHAR(30) NOT NULL
      CHECK (document_type IN ('Proforma Invoice', 'Advance Receipt Voucher', 'Tax Invoice')),
    status VARCHAR(20) NOT NULL DEFAULT 'Draft'
      CHECK (status IN ('Draft', 'Issued', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled')),
    issue_date DATE NOT NULL,
    due_date DATE,
    client_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(50),
    total_amount NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    amount_paid NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
    balance_due NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (balance_due >= 0),
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by UUID NOT NULL DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS crm_invoices_client_search_idx ON crm_invoices (lower(client_name));
CREATE INDEX IF NOT EXISTS crm_invoices_issue_date_idx ON crm_invoices (issue_date);
CREATE INDEX IF NOT EXISTS crm_invoices_due_date_idx ON crm_invoices (due_date);
CREATE INDEX IF NOT EXISTS crm_invoices_status_idx ON crm_invoices (status);
CREATE INDEX IF NOT EXISTS crm_invoices_agreement_id_idx ON crm_invoices (agreement_id);
CREATE INDEX IF NOT EXISTS crm_invoices_created_by_idx ON crm_invoices (created_by);

CREATE OR REPLACE FUNCTION crm_next_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  financial_year TEXT;
  next_sequence INTEGER;
BEGIN
  financial_year := CASE
    WHEN EXTRACT(MONTH FROM current_date) >= 4
      THEN to_char(current_date, 'YY') || '-' || to_char(current_date + INTERVAL '1 year', 'YY')
    ELSE to_char(current_date - INTERVAL '1 year', 'YY') || '-' || to_char(current_date, 'YY')
  END;
  PERFORM pg_advisory_xact_lock(hashtext('crm_invoice_number_' || financial_year));
  SELECT COALESCE(MAX((regexp_match(invoice_number, '([0-9]+)$'))[1]::INTEGER), 0) + 1
    INTO next_sequence
    FROM crm_invoices
   WHERE invoice_number LIKE 'PMB/' || financial_year || '/%'
     AND created_by = (SELECT auth.uid());
  RETURN 'PMB/' || financial_year || '/' || lpad(next_sequence::TEXT, 4, '0');
END;
$$;

ALTER TABLE crm_invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Invoice owners can read" ON crm_invoices;
CREATE POLICY "Invoice owners can read" ON crm_invoices
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = created_by);

DROP POLICY IF EXISTS "Invoice owners can insert" ON crm_invoices;
CREATE POLICY "Invoice owners can insert" ON crm_invoices
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = created_by);

DROP POLICY IF EXISTS "Invoice owners can update" ON crm_invoices;
CREATE POLICY "Invoice owners can update" ON crm_invoices
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = created_by)
  WITH CHECK ((SELECT auth.uid()) = created_by);

DROP POLICY IF EXISTS "Invoice owners can delete" ON crm_invoices;
CREATE POLICY "Invoice owners can delete" ON crm_invoices
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = created_by);

GRANT SELECT, INSERT, UPDATE, DELETE ON crm_invoices TO authenticated;
REVOKE ALL ON crm_invoices FROM anon;
GRANT EXECUTE ON FUNCTION crm_next_invoice_number() TO authenticated;
REVOKE EXECUTE ON FUNCTION crm_next_invoice_number() FROM anon;

-- 11. Relational document details. The JSON payload remains the immutable PDF
-- snapshot; these child tables make services, line items and payments queryable.
CREATE TABLE IF NOT EXISTS crm_agreement_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id UUID NOT NULL REFERENCES crm_agreements(id) ON DELETE CASCADE,
    source_id TEXT NOT NULL,
    name TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    quantity NUMERIC(12,2) NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    selected_option TEXT,
    customization TEXT,
    client_remark TEXT,
    internal_note TEXT,
    special_instructions TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_by UUID NOT NULL DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (agreement_id, source_id)
);

CREATE TABLE IF NOT EXISTS crm_invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES crm_invoices(id) ON DELETE CASCADE,
    source_id TEXT NOT NULL,
    description TEXT NOT NULL,
    sac_code VARCHAR(20),
    quantity NUMERIC(12,3) NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    rate NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (rate >= 0),
    taxable_amount NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (taxable_amount >= 0),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_by UUID NOT NULL DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (invoice_id, source_id)
);

CREATE TABLE IF NOT EXISTS crm_invoice_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES crm_invoices(id) ON DELETE CASCADE,
    source_id TEXT NOT NULL,
    receipt_number VARCHAR(32) NOT NULL,
    payment_date DATE NOT NULL,
    amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    payment_mode VARCHAR(50) NOT NULL,
    transaction_reference TEXT,
    notes TEXT,
    recorded_by TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    created_by UUID NOT NULL DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (invoice_id, source_id),
    UNIQUE (created_by, receipt_number)
);

CREATE INDEX IF NOT EXISTS crm_agreement_services_agreement_idx ON crm_agreement_services (agreement_id, sort_order);
CREATE INDEX IF NOT EXISTS crm_invoice_items_invoice_idx ON crm_invoice_items (invoice_id, sort_order);
CREATE INDEX IF NOT EXISTS crm_invoice_payments_invoice_idx ON crm_invoice_payments (invoice_id, payment_date);

CREATE OR REPLACE FUNCTION crm_sync_agreement_services()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  DELETE FROM crm_agreement_services WHERE agreement_id = NEW.id;
  INSERT INTO crm_agreement_services (
    agreement_id, source_id, name, enabled, quantity, selected_option,
    customization, client_remark, internal_note, special_instructions, sort_order, created_by
  )
  SELECT NEW.id,
    COALESCE(NULLIF(service.value->>'id', ''), 'service-' || service.ordinality::TEXT),
    COALESCE(service.value->>'name', 'Service'),
    COALESCE((service.value->>'enabled')::BOOLEAN, TRUE),
    GREATEST(COALESCE((service.value->>'quantity')::NUMERIC, 0), 0),
    NULLIF(btrim(service.value->>'option'), ''),
    NULLIF(btrim(service.value->>'customization'), ''),
    NULLIF(btrim(service.value->>'client_remark'), ''),
    NULLIF(btrim(service.value->>'internal_note'), ''),
    NULLIF(btrim(service.value->>'special_instructions'), ''),
    service.ordinality::INTEGER, NEW.created_by
  FROM jsonb_array_elements(COALESCE(NEW.payload->'services', '[]'::JSONB))
       WITH ORDINALITY AS service(value, ordinality);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_agreements_sync_services ON crm_agreements;
CREATE TRIGGER crm_agreements_sync_services
AFTER INSERT OR UPDATE OF payload ON crm_agreements
FOR EACH ROW EXECUTE FUNCTION crm_sync_agreement_services();

CREATE OR REPLACE FUNCTION crm_sync_invoice_children()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  DELETE FROM crm_invoice_items WHERE invoice_id = NEW.id;
  INSERT INTO crm_invoice_items (
    invoice_id, source_id, description, sac_code, quantity, rate, taxable_amount, sort_order, created_by
  )
  SELECT NEW.id,
    COALESCE(NULLIF(item.value->>'id', ''), 'item-' || item.ordinality::TEXT),
    COALESCE(item.value->>'description', 'Service'), NULLIF(btrim(item.value->>'sac_code'), ''),
    GREATEST(COALESCE((item.value->>'quantity')::NUMERIC, 0), 0),
    GREATEST(COALESCE((item.value->>'rate')::NUMERIC, 0), 0),
    GREATEST(COALESCE((item.value->>'taxable_amount')::NUMERIC, 0), 0),
    item.ordinality::INTEGER, NEW.created_by
  FROM jsonb_array_elements(COALESCE(NEW.payload->'line_items', '[]'::JSONB))
       WITH ORDINALITY AS item(value, ordinality);

  DELETE FROM crm_invoice_payments WHERE invoice_id = NEW.id;
  INSERT INTO crm_invoice_payments (
    invoice_id, source_id, receipt_number, payment_date, amount, payment_mode,
    transaction_reference, notes, recorded_by, recorded_at, created_by
  )
  SELECT NEW.id,
    COALESCE(NULLIF(payment.value->>'id', ''), 'payment-' || payment.ordinality::TEXT),
    COALESCE(payment.value->>'receipt_number', ''), (payment.value->>'payment_date')::DATE,
    (payment.value->>'amount')::NUMERIC, COALESCE(payment.value->>'payment_mode', 'Other'),
    NULLIF(btrim(payment.value->>'transaction_reference'), ''),
    NULLIF(btrim(payment.value->>'notes'), ''), NULLIF(btrim(payment.value->>'recorded_by'), ''),
    COALESCE((payment.value->>'created_at')::TIMESTAMPTZ, timezone('utc'::text, now())), NEW.created_by
  FROM jsonb_array_elements(COALESCE(NEW.payload->'payments', '[]'::JSONB))
       WITH ORDINALITY AS payment(value, ordinality);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_invoices_sync_children ON crm_invoices;
CREATE TRIGGER crm_invoices_sync_children
AFTER INSERT OR UPDATE OF payload ON crm_invoices
FOR EACH ROW EXECUTE FUNCTION crm_sync_invoice_children();

ALTER TABLE crm_agreement_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_invoice_payments ENABLE ROW LEVEL SECURITY;

-- These child tables are populated by SECURITY INVOKER sync triggers that
-- write rows with the PARENT record's created_by (e.g. the agreement's
-- original creator), not necessarily the current editor. So their RLS must
-- authorize based on the parent's actual access rules (admin, owner, or —
-- for agreements — the assignee), matching crm_agreements/crm_invoices
-- themselves, rather than requiring the child row's own created_by to
-- equal the current user (which breaks the moment an admin or assignee
-- who isn't the original creator edits and re-saves the record).
CREATE POLICY "Agreement services visible to admin, owner or assignee" ON crm_agreement_services FOR SELECT TO authenticated USING (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_agreements a WHERE a.id = crm_agreement_services.agreement_id AND (a.created_by = auth.uid() OR a.assigned_to = auth.uid()))
);
CREATE POLICY "Agreement services insertable by admin, owner or assignee" ON crm_agreement_services FOR INSERT TO authenticated WITH CHECK (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_agreements a WHERE a.id = crm_agreement_services.agreement_id AND (a.created_by = auth.uid() OR a.assigned_to = auth.uid()))
);
CREATE POLICY "Agreement services editable by admin, owner or assignee" ON crm_agreement_services FOR UPDATE TO authenticated USING (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_agreements a WHERE a.id = crm_agreement_services.agreement_id AND (a.created_by = auth.uid() OR a.assigned_to = auth.uid()))
) WITH CHECK (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_agreements a WHERE a.id = crm_agreement_services.agreement_id AND (a.created_by = auth.uid() OR a.assigned_to = auth.uid()))
);
CREATE POLICY "Agreement services deletable by admin, owner or assignee" ON crm_agreement_services FOR DELETE TO authenticated USING (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_agreements a WHERE a.id = crm_agreement_services.agreement_id AND (a.created_by = auth.uid() OR a.assigned_to = auth.uid()))
);
CREATE POLICY "Invoice items visible to admin or owner" ON crm_invoice_items FOR SELECT TO authenticated USING (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_invoices i WHERE i.id = crm_invoice_items.invoice_id AND i.created_by = auth.uid())
);
CREATE POLICY "Invoice items insertable by admin or owner" ON crm_invoice_items FOR INSERT TO authenticated WITH CHECK (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_invoices i WHERE i.id = crm_invoice_items.invoice_id AND i.created_by = auth.uid())
);
CREATE POLICY "Invoice items editable by admin or owner" ON crm_invoice_items FOR UPDATE TO authenticated USING (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_invoices i WHERE i.id = crm_invoice_items.invoice_id AND i.created_by = auth.uid())
) WITH CHECK (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_invoices i WHERE i.id = crm_invoice_items.invoice_id AND i.created_by = auth.uid())
);
CREATE POLICY "Invoice items deletable by admin or owner" ON crm_invoice_items FOR DELETE TO authenticated USING (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_invoices i WHERE i.id = crm_invoice_items.invoice_id AND i.created_by = auth.uid())
);
CREATE POLICY "Invoice payments visible to admin or owner" ON crm_invoice_payments FOR SELECT TO authenticated USING (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_invoices i WHERE i.id = crm_invoice_payments.invoice_id AND i.created_by = auth.uid())
);
CREATE POLICY "Invoice payments insertable by admin or owner" ON crm_invoice_payments FOR INSERT TO authenticated WITH CHECK (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_invoices i WHERE i.id = crm_invoice_payments.invoice_id AND i.created_by = auth.uid())
);
CREATE POLICY "Invoice payments editable by admin or owner" ON crm_invoice_payments FOR UPDATE TO authenticated USING (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_invoices i WHERE i.id = crm_invoice_payments.invoice_id AND i.created_by = auth.uid())
) WITH CHECK (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_invoices i WHERE i.id = crm_invoice_payments.invoice_id AND i.created_by = auth.uid())
);
CREATE POLICY "Invoice payments deletable by admin or owner" ON crm_invoice_payments FOR DELETE TO authenticated USING (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_invoices i WHERE i.id = crm_invoice_payments.invoice_id AND i.created_by = auth.uid())
);

GRANT SELECT, INSERT, UPDATE, DELETE ON crm_agreement_services, crm_invoice_items, crm_invoice_payments TO authenticated;
REVOKE ALL ON crm_agreement_services, crm_invoice_items, crm_invoice_payments FROM anon;
REVOKE EXECUTE ON FUNCTION crm_sync_agreement_services(), crm_sync_invoice_children() FROM PUBLIC, anon, authenticated;

-- 12. Vendor Agreements — same architecture as crm_agreements (immutable JSON
-- payload snapshot + indexed columns for list filtering + a queryable child
-- services table kept in sync by trigger). RLS is admin/owner/assignee from
-- day one, matching the corrected (post-patch) shape of crm_agreements.
CREATE TABLE IF NOT EXISTS crm_vendor_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_agreement_number VARCHAR(40) NOT NULL UNIQUE,
    vendor_name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    mobile VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    service_category VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'Draft'
      CHECK (status IN ('Draft', 'Sent', 'Signed', 'Active', 'Expired', 'Terminated', 'Cancelled')),
    version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
    agreement_end_date DATE,
    blacklist_status VARCHAR(20) NOT NULL DEFAULT 'Active'
      CHECK (blacklist_status IN ('Active', 'Suspended', 'Blacklisted')),
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by UUID DEFAULT auth.uid(),
    assigned_to UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS crm_vendor_agreements_vendor_search_idx ON crm_vendor_agreements (lower(vendor_name));
CREATE INDEX IF NOT EXISTS crm_vendor_agreements_status_idx ON crm_vendor_agreements (status);
CREATE INDEX IF NOT EXISTS crm_vendor_agreements_end_date_idx ON crm_vendor_agreements (agreement_end_date);
CREATE INDEX IF NOT EXISTS crm_vendor_agreements_created_by_idx ON crm_vendor_agreements (created_by);
CREATE INDEX IF NOT EXISTS crm_vendor_agreements_assigned_to_idx ON crm_vendor_agreements (assigned_to);

CREATE TABLE IF NOT EXISTS crm_vendor_agreement_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_agreement_id UUID NOT NULL REFERENCES crm_vendor_agreements(id) ON DELETE CASCADE,
    source_id TEXT NOT NULL,
    name TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    selected_option TEXT,
    base_price NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (base_price >= 0),
    extra_hour_charge NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (extra_hour_charge >= 0),
    travel_charge NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (travel_charge >= 0),
    capacity TEXT,
    tax_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (tax_percent >= 0),
    advance_required NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (advance_required >= 0),
    service_area TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_by UUID NOT NULL DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (vendor_agreement_id, source_id)
);

CREATE INDEX IF NOT EXISTS crm_vendor_agreement_services_va_idx ON crm_vendor_agreement_services (vendor_agreement_id, sort_order);

CREATE OR REPLACE FUNCTION crm_next_vendor_agreement_number()
RETURNS TEXT LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE
  current_year TEXT := to_char(current_date, 'YYYY');
  next_sequence INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('crm_vendor_agreement_number_' || current_year));
  SELECT COALESCE(MAX((regexp_match(vendor_agreement_number, '([0-9]+)$'))[1]::INTEGER), 0) + 1
    INTO next_sequence FROM crm_vendor_agreements
   WHERE vendor_agreement_number LIKE 'PMB-VA-' || current_year || '-%';
  RETURN 'PMB-VA-' || current_year || '-' || lpad(next_sequence::TEXT, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION crm_sync_vendor_agreement_services()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  DELETE FROM crm_vendor_agreement_services WHERE vendor_agreement_id = NEW.id;
  INSERT INTO crm_vendor_agreement_services (
    vendor_agreement_id, source_id, name, enabled, selected_option,
    base_price, extra_hour_charge, travel_charge, capacity, tax_percent, advance_required, service_area,
    sort_order, created_by
  )
  SELECT NEW.id,
    COALESCE(NULLIF(service.value->>'id', ''), 'service-' || service.ordinality::TEXT),
    COALESCE(service.value->>'name', 'Service'),
    COALESCE((service.value->>'enabled')::BOOLEAN, TRUE),
    NULLIF(btrim(service.value->>'option'), ''),
    GREATEST(COALESCE((service.value->>'base_price')::NUMERIC, 0), 0),
    GREATEST(COALESCE((service.value->>'extra_hour_charge')::NUMERIC, 0), 0),
    GREATEST(COALESCE((service.value->>'travel_charge')::NUMERIC, 0), 0),
    NULLIF(btrim(service.value->>'capacity'), ''),
    GREATEST(COALESCE((service.value->>'tax_percent')::NUMERIC, 0), 0),
    GREATEST(COALESCE((service.value->>'advance_required')::NUMERIC, 0), 0),
    NULLIF(btrim(service.value->>'service_area'), ''),
    service.ordinality::INTEGER, NEW.created_by
  FROM jsonb_array_elements(COALESCE(NEW.payload->'services', '[]'::JSONB))
       WITH ORDINALITY AS service(value, ordinality);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_vendor_agreements_sync_services ON crm_vendor_agreements;
CREATE TRIGGER crm_vendor_agreements_sync_services
AFTER INSERT OR UPDATE OF payload ON crm_vendor_agreements
FOR EACH ROW EXECUTE FUNCTION crm_sync_vendor_agreement_services();

ALTER TABLE crm_vendor_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_vendor_agreement_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendor agreements visible to admin, owner or assignee" ON crm_vendor_agreements
  FOR SELECT TO authenticated
  USING (is_crm_admin() OR (SELECT auth.uid()) = created_by OR (SELECT auth.uid()) = assigned_to);
CREATE POLICY "Vendor agreements insertable by authenticated" ON crm_vendor_agreements
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = created_by);
CREATE POLICY "Vendor agreements editable by admin, owner or assignee" ON crm_vendor_agreements
  FOR UPDATE TO authenticated
  USING (is_crm_admin() OR (SELECT auth.uid()) = created_by OR (SELECT auth.uid()) = assigned_to)
  WITH CHECK (is_crm_admin() OR (SELECT auth.uid()) = created_by OR (SELECT auth.uid()) = assigned_to);
CREATE POLICY "Vendor agreements deletable by admin or owner" ON crm_vendor_agreements
  FOR DELETE TO authenticated
  USING (is_crm_admin() OR (SELECT auth.uid()) = created_by);

CREATE POLICY "Vendor agreement services visible to admin, owner or assignee" ON crm_vendor_agreement_services FOR SELECT TO authenticated USING (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_vendor_agreements a WHERE a.id = crm_vendor_agreement_services.vendor_agreement_id AND (a.created_by = auth.uid() OR a.assigned_to = auth.uid()))
);
CREATE POLICY "Vendor agreement services insertable by admin, owner or assignee" ON crm_vendor_agreement_services FOR INSERT TO authenticated WITH CHECK (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_vendor_agreements a WHERE a.id = crm_vendor_agreement_services.vendor_agreement_id AND (a.created_by = auth.uid() OR a.assigned_to = auth.uid()))
);
CREATE POLICY "Vendor agreement services editable by admin, owner or assignee" ON crm_vendor_agreement_services FOR UPDATE TO authenticated USING (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_vendor_agreements a WHERE a.id = crm_vendor_agreement_services.vendor_agreement_id AND (a.created_by = auth.uid() OR a.assigned_to = auth.uid()))
) WITH CHECK (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_vendor_agreements a WHERE a.id = crm_vendor_agreement_services.vendor_agreement_id AND (a.created_by = auth.uid() OR a.assigned_to = auth.uid()))
);
CREATE POLICY "Vendor agreement services deletable by admin, owner or assignee" ON crm_vendor_agreement_services FOR DELETE TO authenticated USING (
  is_crm_admin() OR EXISTS (SELECT 1 FROM crm_vendor_agreements a WHERE a.id = crm_vendor_agreement_services.vendor_agreement_id AND (a.created_by = auth.uid() OR a.assigned_to = auth.uid()))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON crm_vendor_agreements, crm_vendor_agreement_services TO authenticated;
REVOKE ALL ON crm_vendor_agreements, crm_vendor_agreement_services FROM anon;
GRANT EXECUTE ON FUNCTION crm_next_vendor_agreement_number() TO authenticated;
REVOKE EXECUTE ON FUNCTION crm_next_vendor_agreement_number() FROM anon;

ALTER TABLE crm_uploaded_files DROP CONSTRAINT IF EXISTS crm_uploaded_files_entity_type_check;
ALTER TABLE crm_uploaded_files ADD CONSTRAINT crm_uploaded_files_entity_type_check
  CHECK (entity_type IN ('vendor', 'lead', 'agreement', 'vendor_agreement'));
