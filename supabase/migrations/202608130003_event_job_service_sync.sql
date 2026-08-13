-- Keep Event Job vendor coordination exactly aligned with agreement services.

CREATE OR REPLACE FUNCTION public.crm_sync_event_job_services(p_agreement UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE jid UUID;
BEGIN
  SELECT id INTO jid FROM public.crm_event_jobs WHERE agreement_id=p_agreement;
  IF jid IS NULL THEN RETURN; END IF;

  -- Event Job services are sourced from the agreement. Rows whose agreement
  -- service was deleted have their foreign key set to NULL, so remove those
  -- stale rows before rebuilding the current list.
  DELETE FROM public.crm_event_job_services
  WHERE job_id=jid AND source_service_id IS NULL;

  INSERT INTO public.crm_event_job_services(job_id,source_service_id,service_name)
  SELECT jid,s.id,s.name
  FROM public.crm_agreement_services s
  WHERE s.agreement_id=p_agreement AND s.enabled=true
  ON CONFLICT (job_id,source_service_id) WHERE source_service_id IS NOT NULL
  DO UPDATE SET service_name=EXCLUDED.service_name,updated_at=now();

  DELETE FROM public.crm_event_job_services e
  WHERE e.job_id=jid
    AND NOT EXISTS(
      SELECT 1 FROM public.crm_agreement_services s
      WHERE s.id=e.source_service_id
        AND s.agreement_id=p_agreement
        AND s.enabled=true
    );
END; $$;

CREATE OR REPLACE FUNCTION public.crm_event_job_agreement_service_row_sync()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  PERFORM public.crm_sync_event_job_services(COALESCE(NEW.agreement_id,OLD.agreement_id));
  RETURN COALESCE(NEW,OLD);
END; $$;

DROP TRIGGER IF EXISTS crm_event_job_agreement_service_row_sync ON public.crm_agreement_services;
CREATE TRIGGER crm_event_job_agreement_service_row_sync
AFTER INSERT OR UPDATE OF name,enabled OR DELETE ON public.crm_agreement_services
FOR EACH ROW EXECUTE FUNCTION public.crm_event_job_agreement_service_row_sync();

-- Staff assigned to Vendor Blocking can coordinate services; administrators
-- retain full access through crm_event_jobs_is_admin().
DROP POLICY IF EXISTS "Event services editable by stage owner" ON public.crm_event_job_services;
CREATE POLICY "Event services editable by stage owner"
ON public.crm_event_job_services FOR ALL TO authenticated
USING(
  public.crm_event_jobs_is_admin()
  OR EXISTS(
    SELECT 1 FROM public.crm_event_job_stages s
    WHERE s.job_id=crm_event_job_services.job_id
      AND s.stage_key='vendor_blocking'
      AND s.assigned_to=auth.uid()
  )
)
WITH CHECK(
  public.crm_event_jobs_is_admin()
  OR EXISTS(
    SELECT 1 FROM public.crm_event_job_stages s
    WHERE s.job_id=crm_event_job_services.job_id
      AND s.stage_key='vendor_blocking'
      AND s.assigned_to=auth.uid()
  )
);

DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT agreement_id FROM public.crm_event_jobs LOOP
    PERFORM public.crm_sync_event_job_services(r.agreement_id);
  END LOOP;
END $$;
