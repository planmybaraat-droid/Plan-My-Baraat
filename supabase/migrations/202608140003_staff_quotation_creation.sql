-- Staff quotation creation with one shared, concurrency-safe sequence.

CREATE TABLE IF NOT EXISTS public.crm_document_sequences (
  document_type TEXT NOT NULL,
  sequence_year INTEGER NOT NULL,
  last_value INTEGER NOT NULL DEFAULT 0 CHECK(last_value>=0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(document_type,sequence_year)
);

INSERT INTO public.crm_document_sequences(document_type,sequence_year,last_value)
SELECT 'quotation',to_char(current_date,'YYYY')::integer,
  COALESCE(MAX((regexp_match(quotation_number,'([0-9]+)$'))[1]::integer),0)
FROM public.crm_quotations
ON CONFLICT(document_type,sequence_year) DO UPDATE
SET last_value=GREATEST(public.crm_document_sequences.last_value,EXCLUDED.last_value),updated_at=now();

CREATE OR REPLACE FUNCTION public.crm_next_quotation_number()
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_year TEXT:=to_char(current_date,'YYYY'); v_next INTEGER;
BEGIN
  IF NOT (public.is_crm_admin() OR public.crm_user_has_module_access('quotations')) THEN
    RAISE EXCEPTION 'Quotation access is required.';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext('crm_quotation_number_'||v_year));
  SELECT GREATEST(
    COALESCE((SELECT last_value FROM public.crm_document_sequences WHERE document_type='quotation' AND sequence_year=v_year::integer),0),
    COALESCE((SELECT MAX((regexp_match(quotation_number,'([0-9]+)$'))[1]::integer) FROM public.crm_quotations WHERE quotation_number LIKE 'PMB-QTN-'||v_year||'-%'),0)
  )+1 INTO v_next;
  RETURN 'PMB-QTN-'||v_year||'-'||lpad(v_next::text,4,'0');
END; $$;

CREATE OR REPLACE FUNCTION public.crm_create_quotation(p_payload JSONB)
RETURNS public.crm_quotations LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_number TEXT; v_year TEXT:=to_char(current_date,'YYYY'); v_next INTEGER; v_payload JSONB; v_row public.crm_quotations;
BEGIN
  IF NOT (public.is_crm_admin() OR public.crm_user_has_module_access('quotations')) THEN
    RAISE EXCEPTION 'Quotation creation access is required.';
  END IF;
  IF COALESCE(length(btrim(p_payload->>'client_name')),0)=0 THEN RAISE EXCEPTION 'Client name is required.'; END IF;
  IF COALESCE(length(btrim(p_payload->>'mobile')),0)=0 THEN RAISE EXCEPTION 'Mobile number is required.'; END IF;
  IF NULLIF(p_payload->>'valid_until','') IS NULL THEN RAISE EXCEPTION 'Quotation validity date is required.'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('crm_quotation_number_'||v_year));
  SELECT GREATEST(
    COALESCE((SELECT last_value FROM public.crm_document_sequences WHERE document_type='quotation' AND sequence_year=v_year::integer),0),
    COALESCE((SELECT MAX((regexp_match(quotation_number,'([0-9]+)$'))[1]::integer) FROM public.crm_quotations WHERE quotation_number LIKE 'PMB-QTN-'||v_year||'-%'),0)
  )+1 INTO v_next;
  INSERT INTO public.crm_document_sequences(document_type,sequence_year,last_value,updated_at)
  VALUES('quotation',v_year::integer,v_next,now())
  ON CONFLICT(document_type,sequence_year) DO UPDATE SET last_value=EXCLUDED.last_value,updated_at=now();
  v_number:='PMB-QTN-'||v_year||'-'||lpad(v_next::text,4,'0');
  v_payload:=jsonb_set(p_payload,'{quotation_number}',to_jsonb(v_number),true);
  IF jsonb_array_length(COALESCE(v_payload->'activity','[]'::jsonb))>0 THEN
    v_payload:=jsonb_set(v_payload,'{activity,0,detail}',to_jsonb(v_number||' created as draft.'),true);
  END IF;
  INSERT INTO public.crm_quotations(
    quotation_number,client_name,mobile,email,event_date,valid_until,package_name,pricing_mode,status,version,
    subtotal,discount,gst_percent,total_amount,converted_agreement_id,payload,created_by,assigned_to
  ) VALUES (
    v_number,btrim(v_payload->>'client_name'),btrim(v_payload->>'mobile'),NULLIF(btrim(v_payload->>'email'),''),
    NULLIF(v_payload->>'event_date','')::date,(v_payload->>'valid_until')::date,NULLIF(v_payload->>'package_name',''),
    v_payload->>'pricing_mode','Draft',1,COALESCE((v_payload->>'subtotal')::numeric,0),COALESCE((v_payload->>'discount')::numeric,0),
    COALESCE((v_payload->>'gst_percent')::numeric,0),COALESCE((v_payload->>'total_amount')::numeric,0),
    NULLIF(v_payload->>'converted_agreement_id','')::uuid,v_payload,auth.uid(),auth.uid()
  ) RETURNING * INTO v_row;
  RETURN v_row;
END; $$;

DROP POLICY IF EXISTS "Quotations visible to owner or assignee" ON public.crm_quotations;
DROP POLICY IF EXISTS "Quotations created by authenticated" ON public.crm_quotations;
DROP POLICY IF EXISTS "Quotations editable by owner or assignee" ON public.crm_quotations;
DROP POLICY IF EXISTS "Quotations deleted by admin or owner" ON public.crm_quotations;
DROP POLICY IF EXISTS "Quotations visible to authorized owner or assignee" ON public.crm_quotations;
DROP POLICY IF EXISTS "Quotations created by authorized users" ON public.crm_quotations;
DROP POLICY IF EXISTS "Quotations editable by authorized owner or assignee" ON public.crm_quotations;
DROP POLICY IF EXISTS "Quotations deleted by admin or authorized owner" ON public.crm_quotations;
CREATE POLICY "Quotations visible to authorized owner or assignee" ON public.crm_quotations FOR SELECT TO authenticated USING (
  public.is_crm_admin() OR (public.crm_user_has_module_access('quotations') AND (created_by=auth.uid() OR assigned_to=auth.uid()))
);
CREATE POLICY "Quotations created by authorized users" ON public.crm_quotations FOR INSERT TO authenticated WITH CHECK (
  public.is_crm_admin() OR (public.crm_user_has_module_access('quotations') AND created_by=auth.uid())
);
CREATE POLICY "Quotations editable by authorized owner or assignee" ON public.crm_quotations FOR UPDATE TO authenticated USING (
  public.is_crm_admin() OR (public.crm_user_has_module_access('quotations') AND (created_by=auth.uid() OR assigned_to=auth.uid()))
) WITH CHECK (
  public.is_crm_admin() OR (public.crm_user_has_module_access('quotations') AND (created_by=auth.uid() OR assigned_to=auth.uid()))
);
CREATE POLICY "Quotations deleted by admin or authorized owner" ON public.crm_quotations FOR DELETE TO authenticated USING (
  public.is_crm_admin() OR (public.crm_user_has_module_access('quotations') AND created_by=auth.uid())
);

REVOKE ALL ON FUNCTION public.crm_create_quotation(JSONB),public.crm_next_quotation_number() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.crm_create_quotation(JSONB),public.crm_next_quotation_number() TO authenticated;
ALTER TABLE public.crm_document_sequences ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.crm_document_sequences FROM anon,authenticated;
