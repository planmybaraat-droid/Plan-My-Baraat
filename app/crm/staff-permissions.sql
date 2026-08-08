-- ============================================================================
-- Staff Module Access & Centralized Data Permissions
-- ============================================================================
-- Adds an admin-controlled, per-staff module access map on crm_users, plus a
-- helper function usable from RLS policies so that "can this user use module
-- X" is enforced at the database layer too (not just hidden in the sidebar).
--
-- Design notes:
--  * module_access is a JSONB object like {"invoices": true, "agreements": false}.
--    A missing key means "not configured" and defaults to false everywhere
--    (admins always bypass this -- see crm_user_has_module_access below).
--  * Nothing here changes who can SEE an existing agreement/invoice/quotation
--    row (that is already governed by the "admin OR created_by OR
--    assigned_to" policies added previously). This only gates the ability to
--    CREATE new Agreements/Invoices, which today only Admins can reach via
--    the UI anyway (Staff had no create screens for these), so tightening
--    the INSERT policy here does not remove any capability real staff
--    accounts are currently using.
-- ============================================================================

ALTER TABLE crm_users ADD COLUMN IF NOT EXISTS module_access JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE crm_users ADD COLUMN IF NOT EXISTS permissions_updated_at TIMESTAMPTZ;
ALTER TABLE crm_users ADD COLUMN IF NOT EXISTS permissions_updated_by UUID REFERENCES crm_users(id) ON DELETE SET NULL;

-- Returns true if the signed-in user may use the given module key. Admins
-- and super admins always return true. Everyone else needs an explicit
-- `true` entry for that module in their module_access map.
CREATE OR REPLACE FUNCTION crm_user_has_module_access(p_module TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT is_crm_admin() OR COALESCE(
    (SELECT (module_access ->> p_module)::boolean FROM crm_users WHERE id = auth.uid()),
    false
  );
$$;

GRANT EXECUTE ON FUNCTION crm_user_has_module_access(TEXT) TO authenticated;
REVOKE EXECUTE ON FUNCTION crm_user_has_module_access(TEXT) FROM anon, PUBLIC;

-- -- Agreements: creation now requires the "agreements" module --------------
DROP POLICY IF EXISTS "Agreements insertable by any authenticated CRM user" ON crm_agreements;
DROP POLICY IF EXISTS "Agreement owners can insert" ON crm_agreements;
CREATE POLICY "Agreements insertable with module access" ON crm_agreements
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() AND crm_user_has_module_access('agreements'));

-- -- Invoices: creation now requires the "invoices" module -------------------
DROP POLICY IF EXISTS "Invoice owners can insert" ON crm_invoices;
CREATE POLICY "Invoices insertable with module access" ON crm_invoices
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() AND crm_user_has_module_access('invoices'));

-- Nothing else changes: SELECT/UPDATE/DELETE policies on these tables are
-- untouched, so existing admin + assignee visibility keeps working exactly
-- as it does today, and this migration is safe to re-run.
