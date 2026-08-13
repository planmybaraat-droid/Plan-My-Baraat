-- Event Job stages belong exclusively to the Event Jobs workflow.
-- Remove legacy mirrored task rows and prevent workflow RPCs from creating
-- new rows in the general Tasks module.

DELETE FROM public.crm_tasks
WHERE event_job_id IS NOT NULL OR event_job_stage_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.crm_keep_event_jobs_out_of_tasks()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path=public
AS $$
BEGIN
  IF NEW.event_job_id IS NOT NULL OR NEW.event_job_stage_id IS NOT NULL THEN
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_keep_event_jobs_out_of_tasks ON public.crm_tasks;
CREATE TRIGGER crm_keep_event_jobs_out_of_tasks
BEFORE INSERT OR UPDATE ON public.crm_tasks
FOR EACH ROW
EXECUTE FUNCTION public.crm_keep_event_jobs_out_of_tasks();
