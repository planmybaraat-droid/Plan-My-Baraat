-- Fix RLS on quotation child tables (crm_quotation_items, crm_quotation_revisions,
-- crm_quotation_activity) so they follow the same "parent ownership" model already
-- used correctly by agreements, vendor agreements and invoices.
--
-- Root cause: crm_sync_quotation_children() (SECURITY INVOKER) repopulates these
-- three tables on every INSERT/UPDATE of crm_quotations, stamping created_by from
-- the QUOTATION's created_by. But the existing policies checked
-- `auth.uid() = created_by` on the CHILD row itself -- so the moment anyone other
-- than the quotation's original creator (an assignee, or an admin finalising
-- someone else's draft) saved the quotation, the trigger's own insert into these
-- child tables was rejected with "new row violates row-level security policy",
-- even though the parent crm_quotations update had already succeeded. Confirmed
-- against live data: the only super_admin account did not create quotations
-- PMB-QTN-2026-0001 / -0003, so any admin save/finalize on those hit this bug.
--
-- Fix: check permission against the PARENT crm_quotations row (owner, assignee,
-- or admin) instead of the child row's own created_by -- exactly mirroring
-- "Agreement services ... by admin, owner or assignee" on crm_agreement_services
-- and the equivalent policies on crm_invoice_items / crm_invoice_payments /
-- crm_vendor_agreement_services (verified via a schema sweep: no other table has
-- this narrow-child-policy-vs-parent-trigger mismatch).
--
-- Applied live to project pldkbuwpdqbfrmkxlcqm via Supabase MCP on 2026-08-27;
-- this file mirrors that change for local history / future environments.

-- crm_quotation_items ---------------------------------------------------------
DROP POLICY IF EXISTS "Quotation item owners can read" ON public.crm_quotation_items;
DROP POLICY IF EXISTS "Quotation item owners can insert" ON public.crm_quotation_items;
DROP POLICY IF EXISTS "Quotation item owners can update" ON public.crm_quotation_items;
DROP POLICY IF EXISTS "Quotation item owners can delete" ON public.crm_quotation_items;

CREATE POLICY "Quotation items visible to admin, owner or assignee" ON public.crm_quotation_items
FOR SELECT TO authenticated USING (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_items.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
);

CREATE POLICY "Quotation items insertable by admin, owner or assignee" ON public.crm_quotation_items
FOR INSERT TO authenticated WITH CHECK (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_items.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
);

CREATE POLICY "Quotation items editable by admin, owner or assignee" ON public.crm_quotation_items
FOR UPDATE TO authenticated USING (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_items.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
) WITH CHECK (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_items.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
);

CREATE POLICY "Quotation items deletable by admin, owner or assignee" ON public.crm_quotation_items
FOR DELETE TO authenticated USING (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_items.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
);

-- crm_quotation_revisions -------------------------------------------------------
DROP POLICY IF EXISTS "Quotation revision owners can read" ON public.crm_quotation_revisions;
DROP POLICY IF EXISTS "Quotation revision owners can insert" ON public.crm_quotation_revisions;
DROP POLICY IF EXISTS "Quotation revision owners can update" ON public.crm_quotation_revisions;
DROP POLICY IF EXISTS "Quotation revision owners can delete" ON public.crm_quotation_revisions;

CREATE POLICY "Quotation revisions visible to admin, owner or assignee" ON public.crm_quotation_revisions
FOR SELECT TO authenticated USING (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_revisions.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
);

CREATE POLICY "Quotation revisions insertable by admin, owner or assignee" ON public.crm_quotation_revisions
FOR INSERT TO authenticated WITH CHECK (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_revisions.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
);

CREATE POLICY "Quotation revisions editable by admin, owner or assignee" ON public.crm_quotation_revisions
FOR UPDATE TO authenticated USING (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_revisions.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
) WITH CHECK (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_revisions.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
);

CREATE POLICY "Quotation revisions deletable by admin, owner or assignee" ON public.crm_quotation_revisions
FOR DELETE TO authenticated USING (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_revisions.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
);

-- crm_quotation_activity ---------------------------------------------------------
DROP POLICY IF EXISTS "Quotation activity owners can read" ON public.crm_quotation_activity;
DROP POLICY IF EXISTS "Quotation activity owners can insert" ON public.crm_quotation_activity;
DROP POLICY IF EXISTS "Quotation activity owners can update" ON public.crm_quotation_activity;
DROP POLICY IF EXISTS "Quotation activity owners can delete" ON public.crm_quotation_activity;

CREATE POLICY "Quotation activity visible to admin, owner or assignee" ON public.crm_quotation_activity
FOR SELECT TO authenticated USING (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_activity.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
);

CREATE POLICY "Quotation activity insertable by admin, owner or assignee" ON public.crm_quotation_activity
FOR INSERT TO authenticated WITH CHECK (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_activity.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
);

CREATE POLICY "Quotation activity editable by admin, owner or assignee" ON public.crm_quotation_activity
FOR UPDATE TO authenticated USING (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_activity.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
) WITH CHECK (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_activity.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
);

CREATE POLICY "Quotation activity deletable by admin, owner or assignee" ON public.crm_quotation_activity
FOR DELETE TO authenticated USING (
  public.is_crm_admin() OR EXISTS (
    SELECT 1 FROM public.crm_quotations q
    WHERE q.id = crm_quotation_activity.quotation_id
      AND (q.created_by = auth.uid() OR q.assigned_to = auth.uid())
  )
);
