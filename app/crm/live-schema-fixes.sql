-- Targeted live migration discovered by the production Supabase audit.
-- Run this once in the Supabase SQL Editor for project pldkbuwpdqbfrmkxlcqm.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.crm_baraat_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  event_date DATE,
  mobile VARCHAR(50) NOT NULL,
  package_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'New'
    CHECK (status IN ('New', 'Contacted', 'Interested', 'Converted', 'Lost')),
  remarks TEXT,
  created_by UUID DEFAULT auth.uid() REFERENCES public.crm_users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES public.crm_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS crm_baraat_enquiries_status_idx
  ON public.crm_baraat_enquiries(status);
CREATE INDEX IF NOT EXISTS crm_baraat_enquiries_created_at_idx
  ON public.crm_baraat_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS crm_baraat_enquiries_assigned_to_idx
  ON public.crm_baraat_enquiries(assigned_to);

ALTER TABLE public.crm_baraat_enquiries ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.crm_baraat_enquiries FROM anon;
GRANT INSERT (customer_name, event_date, mobile, package_name, status, remarks)
  ON public.crm_baraat_enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.crm_baraat_enquiries TO authenticated;

DROP POLICY IF EXISTS "Website visitors submit enquiries" ON public.crm_baraat_enquiries;
CREATE POLICY "Website visitors submit enquiries"
  ON public.crm_baraat_enquiries
  FOR INSERT TO anon
  WITH CHECK (
    status = 'New'
    AND created_by IS NULL
    AND assigned_to IS NULL
    AND length(btrim(customer_name)) BETWEEN 2 AND 255
    AND length(btrim(mobile)) BETWEEN 7 AND 50
    AND length(btrim(package_name)) BETWEEN 1 AND 255
  );

DROP POLICY IF EXISTS "Admin manages Baraat enquiries" ON public.crm_baraat_enquiries;
CREATE POLICY "Admin manages Baraat enquiries"
  ON public.crm_baraat_enquiries
  FOR ALL TO authenticated
  USING (public.is_crm_admin())
  WITH CHECK (public.is_crm_admin());

-- Complete three schema additions that were absent from the live project.
CREATE UNIQUE INDEX IF NOT EXISTS crm_staff_user_id_unique_idx
  ON public.crm_staff(user_id) WHERE user_id IS NOT NULL;
ALTER TABLE public.crm_vendors ADD COLUMN IF NOT EXISTS created_by UUID DEFAULT auth.uid();
ALTER TABLE public.crm_invoices ADD COLUMN IF NOT EXISTS assigned_to UUID
  REFERENCES public.crm_users(id) ON DELETE SET NULL;
