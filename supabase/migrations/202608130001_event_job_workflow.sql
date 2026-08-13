-- Event Job / Work Order workflow. Additive and backward-compatible.
-- Existing agreements, invoices, tasks, staff and notifications remain the
-- source systems; this migration connects them without duplicating identities.

CREATE TABLE IF NOT EXISTS public.crm_event_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number TEXT NOT NULL UNIQUE,
  agreement_id UUID NOT NULL UNIQUE REFERENCES public.crm_agreements(id) ON DELETE RESTRICT,
  invoice_id UUID REFERENCES public.crm_invoices(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  venue TEXT,
  city TEXT,
  package_name TEXT,
  booking_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'In Progress' CHECK (status IN ('In Progress','Blocked','Needs Rework','Completed','Cancelled')),
  current_stage_key TEXT NOT NULL DEFAULT 'planning',
  created_by UUID REFERENCES public.crm_users(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_event_job_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.crm_event_jobs(id) ON DELETE CASCADE,
  stage_key TEXT NOT NULL,
  stage_name TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Waiting' CHECK (status IN ('Waiting','Assigned','In Progress','Completed','Blocked','Needs Rework','Cancelled')),
  assigned_to UUID REFERENCES public.crm_users(id) ON DELETE SET NULL,
  due_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES public.crm_users(id) ON DELETE SET NULL,
  last_updated_by UUID REFERENCES public.crm_users(id) ON DELETE SET NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  rework_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_id, stage_key), UNIQUE(job_id, sort_order)
);

CREATE TABLE IF NOT EXISTS public.crm_event_job_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.crm_event_jobs(id) ON DELETE CASCADE,
  source_service_id UUID REFERENCES public.crm_agreement_services(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  vendor_id UUID REFERENCES public.crm_vendors(id) ON DELETE SET NULL,
  vendor_name TEXT,
  vendor_contact TEXT,
  confirmation_status TEXT NOT NULL DEFAULT 'Pending' CHECK (confirmation_status IN ('Pending','Contacted','Confirmed','Rejected','Needs Rework')),
  assigned_to UUID REFERENCES public.crm_users(id) ON DELETE SET NULL,
  confirmation_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_event_job_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.crm_event_jobs(id) ON DELETE CASCADE,
  staff_user_id UUID NOT NULL REFERENCES public.crm_users(id) ON DELETE CASCADE,
  assignment_role TEXT NOT NULL,
  team_name TEXT,
  reporting_time TIMESTAMPTZ,
  notes TEXT,
  created_by UUID REFERENCES public.crm_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_id, staff_user_id, assignment_role)
);

CREATE TABLE IF NOT EXISTS public.crm_event_job_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.crm_event_jobs(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  issued_quantity NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (issued_quantity >= 0),
  returned_quantity NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (returned_quantity >= 0),
  missing_quantity NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (missing_quantity >= 0),
  damaged_quantity NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (damaged_quantity >= 0),
  exception_reason TEXT,
  exception_resolved BOOLEAN NOT NULL DEFAULT false,
  responsible_staff_id UUID REFERENCES public.crm_users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_event_job_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.crm_event_jobs(id) ON DELETE CASCADE,
  stage_key TEXT,
  action TEXT NOT NULL,
  detail TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  actor_id UUID REFERENCES public.crm_users(id) ON DELETE SET NULL,
  actor_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_tasks ADD COLUMN IF NOT EXISTS event_job_id UUID REFERENCES public.crm_event_jobs(id) ON DELETE CASCADE;
ALTER TABLE public.crm_tasks ADD COLUMN IF NOT EXISTS event_job_stage_id UUID REFERENCES public.crm_event_job_stages(id) ON DELETE CASCADE;
ALTER TABLE public.crm_tasks ADD COLUMN IF NOT EXISTS workflow_stage_key TEXT;
ALTER TABLE public.crm_tasks ADD COLUMN IF NOT EXISTS rework_reason TEXT;

CREATE INDEX IF NOT EXISTS crm_event_jobs_event_date_idx ON public.crm_event_jobs(event_date);
CREATE INDEX IF NOT EXISTS crm_event_jobs_status_stage_idx ON public.crm_event_jobs(status,current_stage_key);
CREATE INDEX IF NOT EXISTS crm_event_job_stages_assigned_idx ON public.crm_event_job_stages(assigned_to,status,due_at);
CREATE INDEX IF NOT EXISTS crm_event_job_services_job_idx ON public.crm_event_job_services(job_id);
CREATE INDEX IF NOT EXISTS crm_event_job_team_job_idx ON public.crm_event_job_team(job_id);
CREATE INDEX IF NOT EXISTS crm_event_job_activity_job_idx ON public.crm_event_job_activity(job_id,created_at DESC);
CREATE INDEX IF NOT EXISTS crm_tasks_event_job_idx ON public.crm_tasks(event_job_id,event_job_stage_id);

CREATE OR REPLACE FUNCTION public.crm_event_jobs_is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT EXISTS(SELECT 1 FROM public.crm_users WHERE id=auth.uid() AND is_active=true AND role IN ('admin','super_admin'));
$$;

CREATE OR REPLACE FUNCTION public.crm_event_jobs_has_module()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT public.crm_event_jobs_is_admin() OR EXISTS(
    SELECT 1 FROM public.crm_users
    WHERE id=auth.uid() AND is_active=true
      AND ((role='manager' AND COALESCE((crm_section_access->>'eventJobs')::boolean,false))
        OR (role IN ('staff','sales','accountant') AND COALESCE((module_access->>'eventJobs')::boolean,false)))
  );
$$;

CREATE OR REPLACE FUNCTION public.crm_can_view_event_job(p_job UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT public.crm_event_jobs_is_admin() OR (public.crm_event_jobs_has_module() AND EXISTS(
    SELECT 1 FROM public.crm_event_jobs j
    WHERE j.id=p_job AND (j.created_by=auth.uid()
      OR EXISTS(SELECT 1 FROM public.crm_event_job_stages s WHERE s.job_id=j.id AND s.assigned_to=auth.uid())
      OR EXISTS(SELECT 1 FROM public.crm_event_job_team t WHERE t.job_id=j.id AND t.staff_user_id=auth.uid()))
  ));
$$;

CREATE OR REPLACE FUNCTION public.crm_can_edit_event_stage(p_stage UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT public.crm_event_jobs_is_admin() OR (public.crm_event_jobs_has_module() AND EXISTS(
    SELECT 1 FROM public.crm_event_job_stages s WHERE s.id=p_stage AND s.assigned_to=auth.uid()
  ));
$$;

CREATE OR REPLACE FUNCTION public.crm_next_event_job_number()
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE y TEXT:=to_char(current_date,'YYYY'); n INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('crm_event_job_number_'||y));
  SELECT COALESCE(MAX((regexp_match(job_number,'([0-9]+)$'))[1]::INTEGER),0)+1 INTO n
  FROM public.crm_event_jobs WHERE job_number LIKE 'JOB-'||y||'-%';
  RETURN 'JOB-'||y||'-'||lpad(n::text,4,'0');
END; $$;

CREATE OR REPLACE FUNCTION public.crm_create_event_job_for_agreement(p_agreement UUID)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE a public.crm_agreements%ROWTYPE; inv public.crm_invoices%ROWTYPE; jid UUID; sid UUID; assignee UUID;
BEGIN
  SELECT * INTO a FROM public.crm_agreements WHERE id=p_agreement;
  IF NOT FOUND OR a.status NOT IN ('Signed','Completed') OR a.event_date IS NULL THEN RETURN NULL; END IF;
  SELECT * INTO inv FROM public.crm_invoices WHERE agreement_id=a.id AND status<>'Cancelled' ORDER BY created_at DESC LIMIT 1;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT id INTO jid FROM public.crm_event_jobs WHERE agreement_id=a.id;
  IF jid IS NOT NULL THEN UPDATE public.crm_event_jobs SET invoice_id=inv.id,updated_at=now() WHERE id=jid; RETURN jid; END IF;
  assignee:=COALESCE(a.assigned_to,a.created_by);
  INSERT INTO public.crm_event_jobs(job_number,agreement_id,invoice_id,client_name,event_name,event_date,venue,city,package_name,booking_snapshot,created_by)
  VALUES(public.crm_next_event_job_number(),a.id,inv.id,a.client_name,
    COALESCE(NULLIF(trim(COALESCE(a.payload->>'groom_name','')||CASE WHEN COALESCE(a.payload->>'bride_name','')<>'' THEN ' & '||(a.payload->>'bride_name') ELSE '' END),''),a.client_name||' Event'),
    a.event_date,a.payload->>'venue',a.payload->>'city',a.package_name,a.payload,a.created_by) RETURNING id INTO jid;

  INSERT INTO public.crm_event_job_stages(job_id,stage_key,stage_name,sort_order,status,assigned_to,started_at,completed_at,completed_by,last_updated_by,data)
  VALUES
   (jid,'booking_confirmed','Booking Confirmed',0,'Completed',assignee,now(),now(),a.created_by,a.created_by,jsonb_build_object('agreement_number',a.agreement_number,'invoice_number',inv.invoice_number)),
   (jid,'planning','Planning',1,CASE WHEN assignee IS NULL THEN 'In Progress' ELSE 'Assigned' END,assignee,now(),NULL,NULL,a.created_by,'{}'),
   (jid,'vendor_confirmation','Service / Vendor Confirmation',2,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}'),
   (jid,'team_assignment','Team Assignment',3,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}'),
   (jid,'event_preparation','Event Preparation',4,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}'),
   (jid,'pre_event_qc','Pre-Event QC',5,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}'),
   (jid,'event_day','Event Day',6,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}'),
   (jid,'event_completion','Event Completion',7,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}'),
   (jid,'material_reconciliation','Material Reconciliation',8,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}'),
   (jid,'post_event_review','Post-Event Review',9,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}'),
   (jid,'job_completed','Job Completed',10,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}');

  INSERT INTO public.crm_event_job_services(job_id,source_service_id,service_name)
  SELECT jid,s.id,s.name FROM public.crm_agreement_services s WHERE s.agreement_id=a.id AND s.enabled=true;
  SELECT id INTO sid FROM public.crm_event_job_stages WHERE job_id=jid AND stage_key='planning';
  INSERT INTO public.crm_tasks(title,description,priority,due_date,assigned_by,event_job_id,event_job_stage_id,workflow_stage_key)
  VALUES((SELECT job_number FROM public.crm_event_jobs WHERE id=jid)||' · Planning','Verify client and event planning details','High',a.event_date-INTERVAL '7 days',a.created_by,jid,sid,'planning');
  IF assignee IS NOT NULL THEN
    INSERT INTO public.crm_task_assignees(task_id,staff_user_id) SELECT id,assignee FROM public.crm_tasks WHERE event_job_stage_id=sid ON CONFLICT DO NOTHING;
    INSERT INTO public.crm_notifications(recipient_id,type,title,body,link) VALUES(assignee,'event_job','New Event Job assigned','Planning is ready for '||(SELECT job_number FROM public.crm_event_jobs WHERE id=jid),'/workspace/event-jobs/'||jid);
  END IF;
  INSERT INTO public.crm_event_job_activity(job_id,action,detail,actor_id) VALUES(jid,'job_created','Event Job created automatically from confirmed booking',a.created_by);
  RETURN jid;
END; $$;

CREATE OR REPLACE FUNCTION public.crm_sync_event_job_trigger()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF TG_TABLE_NAME='crm_agreements' THEN PERFORM public.crm_create_event_job_for_agreement(NEW.id);
  ELSE IF NEW.agreement_id IS NOT NULL THEN PERFORM public.crm_create_event_job_for_agreement(NEW.agreement_id); END IF;
  END IF; RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS crm_agreement_event_job_sync ON public.crm_agreements;
CREATE TRIGGER crm_agreement_event_job_sync AFTER INSERT OR UPDATE OF status,event_date,payload ON public.crm_agreements FOR EACH ROW EXECUTE FUNCTION public.crm_sync_event_job_trigger();
DROP TRIGGER IF EXISTS crm_invoice_event_job_sync ON public.crm_invoices;
CREATE TRIGGER crm_invoice_event_job_sync AFTER INSERT OR UPDATE OF status,agreement_id ON public.crm_invoices FOR EACH ROW EXECUTE FUNCTION public.crm_sync_event_job_trigger();

CREATE OR REPLACE FUNCTION public.crm_assign_event_job_stage(p_stage UUID,p_assignee UUID,p_due_at TIMESTAMPTZ DEFAULT NULL)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE s public.crm_event_job_stages%ROWTYPE; t UUID;
BEGIN
  IF NOT public.crm_event_jobs_is_admin() THEN RAISE EXCEPTION 'Only an administrator can assign workflow stages.'; END IF;
  SELECT * INTO s FROM public.crm_event_job_stages WHERE id=p_stage;
  IF NOT FOUND THEN RAISE EXCEPTION 'Workflow stage not found.'; END IF;
  UPDATE public.crm_event_job_stages SET assigned_to=p_assignee,due_at=p_due_at,status=CASE WHEN status='Waiting' THEN 'Assigned' ELSE status END,last_updated_by=auth.uid(),updated_at=now() WHERE id=p_stage;
  SELECT id INTO t FROM public.crm_tasks WHERE event_job_stage_id=p_stage LIMIT 1;
  IF t IS NULL THEN INSERT INTO public.crm_tasks(title,description,priority,due_date,assigned_by,event_job_id,event_job_stage_id,workflow_stage_key)
    SELECT j.job_number||' · '||s.stage_name,'Event Job workflow stage','High',p_due_at,auth.uid(),j.id,s.id,s.stage_key FROM public.crm_event_jobs j WHERE j.id=s.job_id RETURNING id INTO t; END IF;
  UPDATE public.crm_tasks SET due_date=p_due_at,updated_at=now() WHERE id=t;
  DELETE FROM public.crm_task_assignees WHERE task_id=t;
  IF p_assignee IS NOT NULL THEN INSERT INTO public.crm_task_assignees(task_id,staff_user_id) VALUES(t,p_assignee);
    INSERT INTO public.crm_notifications(recipient_id,type,title,body,link) SELECT p_assignee,'event_job','Event Job stage assigned',s.stage_name||' is assigned to you.','/workspace/event-jobs/'||s.job_id; END IF;
  INSERT INTO public.crm_event_job_activity(job_id,stage_key,action,detail,actor_id) VALUES(s.job_id,s.stage_key,'stage_assigned','Stage assignment updated',auth.uid());
END; $$;

CREATE OR REPLACE FUNCTION public.crm_update_event_job_stage(p_stage UUID,p_action TEXT,p_data JSONB DEFAULT '{}'::jsonb,p_rework_stage TEXT DEFAULT NULL,p_reason TEXT DEFAULT NULL)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE s public.crm_event_job_stages%ROWTYPE; nxt public.crm_event_job_stages%ROWTYPE; missing TEXT; unresolved INTEGER; taskid UUID;
BEGIN
  SELECT * INTO s FROM public.crm_event_job_stages WHERE id=p_stage FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Workflow stage not found.'; END IF;
  IF NOT public.crm_can_edit_event_stage(p_stage) THEN RAISE EXCEPTION 'This stage is not assigned to you or you do not have Event Jobs access.'; END IF;
  IF p_action='start' THEN
    IF s.status NOT IN ('Assigned','In Progress') THEN RAISE EXCEPTION 'This stage is not ready to start.'; END IF;
    UPDATE public.crm_event_job_stages SET status='In Progress',started_at=COALESCE(started_at,now()),data=data||p_data,last_updated_by=auth.uid(),updated_at=now() WHERE id=p_stage;
  ELSIF p_action='save' THEN
    UPDATE public.crm_event_job_stages SET data=data||p_data,last_updated_by=auth.uid(),updated_at=now() WHERE id=p_stage;
  ELSIF p_action='qc_fail' THEN
    IF s.stage_key<>'pre_event_qc' OR p_rework_stage IS NULL OR COALESCE(trim(p_reason),'')='' THEN RAISE EXCEPTION 'QC failure requires a responsible stage and reason.'; END IF;
    UPDATE public.crm_event_job_stages SET status='Needs Rework',data=data||p_data||jsonb_build_object('failure_reason',p_reason,'rework_stage',p_rework_stage),last_updated_by=auth.uid(),updated_at=now() WHERE id=p_stage;
    UPDATE public.crm_event_job_stages SET status='Needs Rework',completed_at=NULL,completed_by=NULL,rework_count=rework_count+1,last_updated_by=auth.uid(),updated_at=now() WHERE job_id=s.job_id AND stage_key=p_rework_stage;
    UPDATE public.crm_tasks SET status='On Hold',rework_reason=p_reason,updated_at=now() WHERE event_job_stage_id=p_stage;
    UPDATE public.crm_tasks SET status='Needs Revision',progress=0,rework_reason=p_reason,updated_at=now()
      WHERE event_job_stage_id=(SELECT id FROM public.crm_event_job_stages WHERE job_id=s.job_id AND stage_key=p_rework_stage);
    UPDATE public.crm_event_jobs SET status='Needs Rework',current_stage_key=p_rework_stage,updated_at=now() WHERE id=s.job_id;
    INSERT INTO public.crm_notifications(recipient_id,type,title,body,link)
      SELECT assigned_to,'event_job','QC failed — rework required',p_reason,'/workspace/event-jobs/'||s.job_id
      FROM public.crm_event_job_stages WHERE job_id=s.job_id AND stage_key=p_rework_stage AND assigned_to IS NOT NULL;
    INSERT INTO public.crm_event_job_activity(job_id,stage_key,action,detail,metadata,actor_id) VALUES(s.job_id,s.stage_key,'qc_failed',p_reason,jsonb_build_object('rework_stage',p_rework_stage),auth.uid());
    RETURN;
  ELSIF p_action='reopen' THEN
    IF NOT public.crm_event_jobs_is_admin() OR COALESCE(trim(p_reason),'')='' THEN RAISE EXCEPTION 'Only an administrator can reopen a stage, and a reason is required.'; END IF;
    UPDATE public.crm_event_job_stages SET status=CASE WHEN assigned_to IS NULL THEN 'In Progress' ELSE 'Assigned' END,completed_at=NULL,completed_by=NULL,rework_count=rework_count+1,data=data||jsonb_build_object('reopen_reason',p_reason),last_updated_by=auth.uid(),updated_at=now() WHERE id=p_stage;
    UPDATE public.crm_event_job_stages SET status='Waiting',started_at=NULL WHERE job_id=s.job_id AND sort_order>s.sort_order;
    UPDATE public.crm_tasks SET status='Needs Revision',progress=0,rework_reason=p_reason,updated_at=now() WHERE event_job_stage_id=p_stage;
    UPDATE public.crm_tasks SET status='Pending',progress=0,updated_at=now() WHERE event_job_stage_id IN (SELECT id FROM public.crm_event_job_stages WHERE job_id=s.job_id AND sort_order>s.sort_order);
    UPDATE public.crm_event_jobs SET status='Needs Rework',current_stage_key=s.stage_key,completed_at=NULL,updated_at=now() WHERE id=s.job_id;
    INSERT INTO public.crm_event_job_activity(job_id,stage_key,action,detail,actor_id) VALUES(s.job_id,s.stage_key,'stage_reopened',p_reason,auth.uid());
    RETURN;
  ELSIF p_action='complete' THEN
    IF s.status NOT IN ('Assigned','In Progress','Needs Rework') THEN RAISE EXCEPTION 'This stage is not active.'; END IF;
    IF s.stage_key='planning' THEN
      SELECT string_agg(v,', ') INTO missing FROM (VALUES ('Client verified',p_data->>'client_verified'),('Event date verified',p_data->>'event_date_verified'),('Venue verified',p_data->>'venue_verified'),('Package/services verified',p_data->>'services_verified')) x(v,b) WHERE COALESCE(b,'false')<>'true';
    ELSIF s.stage_key='vendor_confirmation' THEN SELECT count(*)::text INTO missing FROM public.crm_event_job_services WHERE job_id=s.job_id AND confirmation_status<>'Confirmed'; IF missing='0' THEN missing=NULL; ELSE missing:=missing||' service(s) are not confirmed'; END IF;
    ELSIF s.stage_key='team_assignment' THEN SELECT CASE WHEN count(*)=0 THEN 'At least one event team member must be assigned' END INTO missing FROM public.crm_event_job_team WHERE job_id=s.job_id;
    ELSIF s.stage_key='event_preparation' THEN IF COALESCE((p_data->>'all_required_complete')::boolean,false)=false THEN missing:='Complete every required preparation item'; END IF;
    ELSIF s.stage_key='pre_event_qc' THEN IF COALESCE((p_data->>'qc_passed')::boolean,false)=false THEN missing:='Every required QC item must pass'; END IF;
    ELSIF s.stage_key='event_day' THEN IF COALESCE((p_data->>'service_completed')::boolean,false)=false THEN missing:='Complete the live Event Day checklist'; END IF;
    ELSIF s.stage_key='event_completion' THEN IF COALESCE((p_data->>'event_completed')::boolean,false)=false OR COALESCE((p_data->>'services_completed')::boolean,false)=false OR COALESCE((p_data->>'client_handover')::boolean,false)=false THEN missing:='Confirm event, services and client handover completion'; END IF;
    ELSIF s.stage_key='material_reconciliation' THEN SELECT count(*) INTO unresolved FROM public.crm_event_job_materials WHERE job_id=s.job_id AND (missing_quantity>0 OR damaged_quantity>0) AND (exception_resolved=false OR COALESCE(trim(exception_reason),'')=''); IF unresolved>0 THEN missing:=unresolved||' material exception(s) remain unresolved'; END IF;
    ELSIF s.stage_key='post_event_review' THEN IF COALESCE(trim(p_data->>'review_summary'),'')='' THEN missing:='A post-event review summary is required'; END IF;
    END IF;
    IF missing IS NOT NULL THEN RAISE EXCEPTION 'Cannot complete: %',missing; END IF;
    UPDATE public.crm_event_job_stages SET status='Completed',data=data||p_data,completed_at=now(),completed_by=auth.uid(),last_updated_by=auth.uid(),updated_at=now() WHERE id=p_stage;
    UPDATE public.crm_tasks SET status='Completed',progress=100,updated_at=now() WHERE event_job_stage_id=p_stage;
    IF EXISTS(SELECT 1 FROM public.crm_event_jobs WHERE id=s.job_id AND status='Needs Rework')
       AND s.stage_key<>'pre_event_qc'
       AND EXISTS(SELECT 1 FROM public.crm_event_job_stages WHERE job_id=s.job_id AND stage_key='pre_event_qc' AND status='Needs Rework') THEN
      SELECT * INTO nxt FROM public.crm_event_job_stages WHERE job_id=s.job_id AND stage_key='pre_event_qc';
    ELSE
      SELECT * INTO nxt FROM public.crm_event_job_stages WHERE job_id=s.job_id AND sort_order=s.sort_order+1;
    END IF;
    IF nxt.id IS NOT NULL THEN
      UPDATE public.crm_event_job_stages SET status=CASE WHEN assigned_to IS NULL THEN 'In Progress' ELSE 'Assigned' END,started_at=now(),updated_at=now() WHERE id=nxt.id;
      UPDATE public.crm_event_jobs SET current_stage_key=nxt.stage_key,status=CASE WHEN nxt.stage_key='job_completed' THEN 'Completed' ELSE 'In Progress' END,completed_at=CASE WHEN nxt.stage_key='job_completed' THEN now() END,updated_at=now() WHERE id=s.job_id;
      IF nxt.stage_key='job_completed' THEN UPDATE public.crm_event_job_stages SET status='Completed',completed_at=now(),completed_by=auth.uid() WHERE id=nxt.id;
      ELSE
        SELECT id INTO taskid FROM public.crm_tasks WHERE event_job_stage_id=nxt.id ORDER BY created_at LIMIT 1;
        IF taskid IS NULL THEN
          INSERT INTO public.crm_tasks(title,description,priority,due_date,assigned_by,event_job_id,event_job_stage_id,workflow_stage_key)
          SELECT j.job_number||' · '||nxt.stage_name,'Event Job workflow stage','High',nxt.due_at,auth.uid(),j.id,nxt.id,nxt.stage_key FROM public.crm_event_jobs j WHERE j.id=s.job_id RETURNING id INTO taskid;
        ELSE
          UPDATE public.crm_tasks SET status='Pending',progress=0,rework_reason=NULL,due_date=nxt.due_at,updated_at=now() WHERE id=taskid;
        END IF;
        DELETE FROM public.crm_task_assignees WHERE task_id=taskid;
        IF nxt.assigned_to IS NOT NULL THEN INSERT INTO public.crm_task_assignees(task_id,staff_user_id) VALUES(taskid,nxt.assigned_to); INSERT INTO public.crm_notifications(recipient_id,type,title,body,link) VALUES(nxt.assigned_to,'event_job','Workflow stage ready',nxt.stage_name||' is ready.','/workspace/event-jobs/'||s.job_id); END IF;
      END IF;
    END IF;
    INSERT INTO public.crm_event_job_activity(job_id,stage_key,action,detail,actor_id) VALUES(s.job_id,s.stage_key,'stage_completed',s.stage_name||' completed',auth.uid());
  ELSE RAISE EXCEPTION 'Unsupported workflow action.'; END IF;
END; $$;

ALTER TABLE public.crm_event_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_event_job_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_event_job_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_event_job_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_event_job_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_event_job_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Event jobs visible to authorized participants" ON public.crm_event_jobs;
DROP POLICY IF EXISTS "Event jobs managed by admin" ON public.crm_event_jobs;
DROP POLICY IF EXISTS "Event stages visible with job" ON public.crm_event_job_stages;
DROP POLICY IF EXISTS "Event stages edited by assignee" ON public.crm_event_job_stages;
DROP POLICY IF EXISTS "Event stages managed by admin" ON public.crm_event_job_stages;
DROP POLICY IF EXISTS "Event services visible with job" ON public.crm_event_job_services;
DROP POLICY IF EXISTS "Event services editable by stage owner" ON public.crm_event_job_services;
DROP POLICY IF EXISTS "Event team visible with job" ON public.crm_event_job_team;
DROP POLICY IF EXISTS "Event team editable by stage owner" ON public.crm_event_job_team;
DROP POLICY IF EXISTS "Event materials visible with job" ON public.crm_event_job_materials;
DROP POLICY IF EXISTS "Event materials editable by stage owner" ON public.crm_event_job_materials;
DROP POLICY IF EXISTS "Event activity visible with job" ON public.crm_event_job_activity;
DROP POLICY IF EXISTS "Event activity inserted by participants" ON public.crm_event_job_activity;
CREATE POLICY "Event jobs visible to authorized participants" ON public.crm_event_jobs FOR SELECT TO authenticated USING(public.crm_can_view_event_job(id));
CREATE POLICY "Event jobs managed by admin" ON public.crm_event_jobs FOR ALL TO authenticated USING(public.crm_event_jobs_is_admin()) WITH CHECK(public.crm_event_jobs_is_admin());
CREATE POLICY "Event stages visible with job" ON public.crm_event_job_stages FOR SELECT TO authenticated USING(public.crm_can_view_event_job(job_id));
CREATE POLICY "Event stages edited by assignee" ON public.crm_event_job_stages FOR UPDATE TO authenticated USING(public.crm_can_edit_event_stage(id)) WITH CHECK(public.crm_can_edit_event_stage(id));
CREATE POLICY "Event stages managed by admin" ON public.crm_event_job_stages FOR ALL TO authenticated USING(public.crm_event_jobs_is_admin()) WITH CHECK(public.crm_event_jobs_is_admin());
CREATE POLICY "Event services visible with job" ON public.crm_event_job_services FOR SELECT TO authenticated USING(public.crm_can_view_event_job(job_id));
CREATE POLICY "Event services editable by stage owner" ON public.crm_event_job_services FOR ALL TO authenticated USING(public.crm_event_jobs_is_admin() OR EXISTS(SELECT 1 FROM public.crm_event_job_stages s WHERE s.job_id=crm_event_job_services.job_id AND s.stage_key='vendor_confirmation' AND s.assigned_to=auth.uid())) WITH CHECK(public.crm_event_jobs_is_admin() OR EXISTS(SELECT 1 FROM public.crm_event_job_stages s WHERE s.job_id=crm_event_job_services.job_id AND s.stage_key='vendor_confirmation' AND s.assigned_to=auth.uid()));
CREATE POLICY "Event team visible with job" ON public.crm_event_job_team FOR SELECT TO authenticated USING(public.crm_can_view_event_job(job_id));
CREATE POLICY "Event team editable by stage owner" ON public.crm_event_job_team FOR ALL TO authenticated USING(public.crm_event_jobs_is_admin() OR EXISTS(SELECT 1 FROM public.crm_event_job_stages s WHERE s.job_id=crm_event_job_team.job_id AND s.stage_key='team_assignment' AND s.assigned_to=auth.uid())) WITH CHECK(public.crm_event_jobs_is_admin() OR EXISTS(SELECT 1 FROM public.crm_event_job_stages s WHERE s.job_id=crm_event_job_team.job_id AND s.stage_key='team_assignment' AND s.assigned_to=auth.uid()));
CREATE POLICY "Event materials visible with job" ON public.crm_event_job_materials FOR SELECT TO authenticated USING(public.crm_can_view_event_job(job_id));
CREATE POLICY "Event materials editable by stage owner" ON public.crm_event_job_materials FOR ALL TO authenticated USING(public.crm_event_jobs_is_admin() OR EXISTS(SELECT 1 FROM public.crm_event_job_stages s WHERE s.job_id=crm_event_job_materials.job_id AND s.stage_key='material_reconciliation' AND s.assigned_to=auth.uid())) WITH CHECK(public.crm_event_jobs_is_admin() OR EXISTS(SELECT 1 FROM public.crm_event_job_stages s WHERE s.job_id=crm_event_job_materials.job_id AND s.stage_key='material_reconciliation' AND s.assigned_to=auth.uid()));
CREATE POLICY "Event activity visible with job" ON public.crm_event_job_activity FOR SELECT TO authenticated USING(public.crm_can_view_event_job(job_id));
CREATE POLICY "Event activity inserted by participants" ON public.crm_event_job_activity FOR INSERT TO authenticated WITH CHECK(public.crm_can_view_event_job(job_id) AND actor_id=auth.uid());

GRANT SELECT,INSERT,UPDATE,DELETE ON public.crm_event_jobs,public.crm_event_job_stages,public.crm_event_job_services,public.crm_event_job_team,public.crm_event_job_materials,public.crm_event_job_activity TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_event_jobs_has_module(),public.crm_can_view_event_job(UUID),public.crm_can_edit_event_stage(UUID),public.crm_assign_event_job_stage(UUID,UUID,TIMESTAMPTZ),public.crm_update_event_job_stage(UUID,TEXT,JSONB,TEXT,TEXT),public.crm_create_event_job_for_agreement(UUID) TO authenticated;
REVOKE ALL ON public.crm_event_jobs,public.crm_event_job_stages,public.crm_event_job_services,public.crm_event_job_team,public.crm_event_job_materials,public.crm_event_job_activity FROM anon;

-- Backfill existing confirmed bookings; idempotent because agreement_id is unique.
DO $$ DECLARE r RECORD; BEGIN FOR r IN SELECT id FROM public.crm_agreements WHERE status IN ('Signed','Completed') LOOP PERFORM public.crm_create_event_job_for_agreement(r.id); END LOOP; END $$;
