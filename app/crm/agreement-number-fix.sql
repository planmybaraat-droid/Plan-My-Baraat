-- ============================================================================
-- Fix: "Unable to allocate a unique agreement number" for Staff accounts
-- ============================================================================
-- Root cause: crm_next_agreement_number(), crm_next_invoice_number(),
-- crm_next_quotation_number() and crm_next_vendor_agreement_number() were all
-- defined as SECURITY INVOKER (the default). That means when a Staff account
-- calls one of these to get "the next number", the internal SELECT MAX(...)
-- runs under THEIR row-level security — and Agreements/Invoices/Quotations
-- SELECT policies only let a non-admin see rows they created or are assigned
-- to. A brand-new staff member with zero visible agreements therefore always
-- computes "next sequence = 1" and gets back a number the Admin (or another
-- staff member) already used company-wide, which then fails the real global
-- UNIQUE constraint on insert.
--
-- Fix: mark these functions SECURITY DEFINER (matching the pattern already
-- used correctly by crm_next_letter_number/crm_next_payslip_number) so the
-- sequence lookup always sees the true company-wide count regardless of who
-- is asking. This only changes what the function can *read* internally to
-- compute a number — it does not change, bypass, or expose any row data to
-- the caller, and the actual agreement/invoice/quotation INSERT that follows
-- is still fully governed by the normal RLS/module-permission checks.
-- ============================================================================

CREATE OR REPLACE FUNCTION crm_next_agreement_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  current_year text := to_char(current_date, 'YYYY');
  next_sequence integer;
begin
  perform pg_advisory_xact_lock(hashtext('crm_agreement_number_' || current_year));
  select coalesce(max((regexp_match(agreement_number, '([0-9]+)$'))[1]::integer), 0) + 1
    into next_sequence
    from public.crm_agreements
   where agreement_number like 'PMB-CSA-' || current_year || '-%';
  return 'PMB-CSA-' || current_year || '-' || lpad(next_sequence::text, 4, '0');
end;
$$;

CREATE OR REPLACE FUNCTION crm_next_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  financial_year text;
  next_sequence integer;
begin
  financial_year := case
    when extract(month from current_date) >= 4
      then to_char(current_date, 'YY') || '-' || to_char(current_date + interval '1 year', 'YY')
    else to_char(current_date - interval '1 year', 'YY') || '-' || to_char(current_date, 'YY')
  end;
  perform pg_advisory_xact_lock(hashtext('crm_invoice_number_' || financial_year));
  select coalesce(max((regexp_match(invoice_number, '([0-9]+)$'))[1]::integer), 0) + 1
    into next_sequence
    from public.crm_invoices
   where invoice_number like 'PMB/' || financial_year || '/%';
  return 'PMB/' || financial_year || '/' || lpad(next_sequence::text, 4, '0');
end;
$$;

CREATE OR REPLACE FUNCTION crm_next_quotation_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  current_year text := to_char(current_date, 'YYYY');
  next_sequence integer;
begin
  perform pg_advisory_xact_lock(hashtext('crm_quotation_number_' || current_year));
  select coalesce(max((regexp_match(quotation_number, '([0-9]+)$'))[1]::integer), 0) + 1
    into next_sequence
    from public.crm_quotations
   where quotation_number like 'PMB-QTN-' || current_year || '-%';
  return 'PMB-QTN-' || current_year || '-' || lpad(next_sequence::text, 4, '0');
end;
$$;

CREATE OR REPLACE FUNCTION crm_next_vendor_agreement_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_year TEXT := to_char(current_date, 'YYYY');
  next_sequence INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('crm_vendor_agreement_number_' || current_year));
  SELECT COALESCE(MAX((regexp_match(vendor_agreement_number, '([0-9]+)$'))[1]::INTEGER), 0) + 1
    INTO next_sequence
    FROM crm_vendor_agreements
   WHERE vendor_agreement_number LIKE 'PMB-VA-' || current_year || '-%';
  RETURN 'PMB-VA-' || current_year || '-' || lpad(next_sequence::TEXT, 4, '0');
END;
$$;

GRANT EXECUTE ON FUNCTION crm_next_agreement_number() TO authenticated;
GRANT EXECUTE ON FUNCTION crm_next_invoice_number() TO authenticated;
GRANT EXECUTE ON FUNCTION crm_next_quotation_number() TO authenticated;
GRANT EXECUTE ON FUNCTION crm_next_vendor_agreement_number() TO authenticated;
REVOKE EXECUTE ON FUNCTION crm_next_agreement_number() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION crm_next_invoice_number() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION crm_next_quotation_number() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION crm_next_vendor_agreement_number() FROM anon, PUBLIC;
