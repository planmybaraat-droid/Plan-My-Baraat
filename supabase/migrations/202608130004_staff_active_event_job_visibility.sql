-- Staff with Event Jobs module access need operational visibility and editing
-- across every active event. Assignment remains a responsibility label only.

CREATE OR REPLACE FUNCTION public.crm_can_view_event_job(p_job UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path=public
AS $$
  SELECT public.crm_event_jobs_is_admin()
    OR (
      public.crm_event_jobs_has_module()
      AND EXISTS(
        SELECT 1
        FROM public.crm_event_jobs j
        WHERE j.id=p_job
          AND (
            j.status NOT IN ('Completed','Cancelled')
            OR j.created_by=auth.uid()
            OR EXISTS(
              SELECT 1 FROM public.crm_event_job_stages s
              WHERE s.job_id=j.id AND s.assigned_to=auth.uid()
            )
            OR EXISTS(
              SELECT 1 FROM public.crm_event_job_team t
              WHERE t.job_id=j.id AND t.staff_user_id=auth.uid()
            )
          )
      )
    );
$$;

GRANT EXECUTE ON FUNCTION public.crm_can_view_event_job(UUID) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_can_view_event_job(UUID) FROM anon;

CREATE OR REPLACE FUNCTION public.crm_can_edit_event_stage(p_stage UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path=public
AS $$
  SELECT public.crm_event_jobs_is_admin()
    OR (
      public.crm_event_jobs_has_module()
      AND EXISTS(
        SELECT 1
        FROM public.crm_event_job_stages s
        JOIN public.crm_event_jobs j ON j.id=s.job_id
        WHERE s.id=p_stage
          AND j.status NOT IN ('Completed','Cancelled')
      )
    );
$$;

GRANT EXECUTE ON FUNCTION public.crm_can_edit_event_stage(UUID) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_can_edit_event_stage(UUID) FROM anon;

-- Vendor coordination is part of the shared workflow too. All staff with the
-- module can update vendor/service status for an active job.
DROP POLICY IF EXISTS "Event services editable by stage owner" ON public.crm_event_job_services;
CREATE POLICY "Event services editable by event operations"
ON public.crm_event_job_services FOR ALL TO authenticated
USING(
  public.crm_event_jobs_is_admin()
  OR (
    public.crm_event_jobs_has_module()
    AND EXISTS(
      SELECT 1 FROM public.crm_event_jobs j
      WHERE j.id=crm_event_job_services.job_id
        AND j.status NOT IN ('Completed','Cancelled')
    )
  )
)
WITH CHECK(
  public.crm_event_jobs_is_admin()
  OR (
    public.crm_event_jobs_has_module()
    AND EXISTS(
      SELECT 1 FROM public.crm_event_jobs j
      WHERE j.id=crm_event_job_services.job_id
        AND j.status NOT IN ('Completed','Cancelled')
    )
  )
);
