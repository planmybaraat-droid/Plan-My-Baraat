-- ============================================================================
-- Add the "vendorAgreements" module to Staff Access Management
-- ============================================================================
-- Same pattern as the existing Agreements/Invoices module gate: Staff can
-- only INSERT a new vendor agreement once an Admin has explicitly turned the
-- "Vendor Agreements" toggle on for them in Manage Access. Nothing else about
-- who can see/edit/delete existing vendor agreements changes.

DROP POLICY IF EXISTS "Vendor agreements insertable by authenticated" ON crm_vendor_agreements;
CREATE POLICY "Vendor agreements insertable with module access" ON crm_vendor_agreements
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() AND crm_user_has_module_access('vendorAgreements'));
