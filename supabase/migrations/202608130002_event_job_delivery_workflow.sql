-- Align Event Jobs with the operational delivery flow used by PlanMyBaraat.
-- This migration is additive/idempotent and preserves the existing job/activity history.

ALTER TABLE public.crm_event_job_services
  ADD COLUMN IF NOT EXISTS booking_status TEXT NOT NULL DEFAULT 'Not Started';

ALTER TABLE public.crm_event_job_services
  DROP CONSTRAINT IF EXISTS crm_event_job_services_booking_status_check;
ALTER TABLE public.crm_event_job_services
  ADD CONSTRAINT crm_event_job_services_booking_status_check
  CHECK (booking_status IN ('Not Started','Contacted','Blocked','Booked','Not Required','Issue'));

UPDATE public.crm_event_job_services
SET booking_status=CASE confirmation_status
  WHEN 'Confirmed' THEN 'Booked'
  WHEN 'Contacted' THEN 'Contacted'
  WHEN 'Rejected' THEN 'Issue'
  WHEN 'Needs Rework' THEN 'Issue'
  ELSE 'Not Started'
END
WHERE booking_status='Not Started';

CREATE UNIQUE INDEX IF NOT EXISTS crm_event_job_services_source_unique
  ON public.crm_event_job_services(job_id,source_service_id)
  WHERE source_service_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.crm_sync_event_job_services(p_agreement UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE jid UUID;
BEGIN
  SELECT id INTO jid FROM public.crm_event_jobs WHERE agreement_id=p_agreement;
  IF jid IS NULL THEN RETURN; END IF;

  INSERT INTO public.crm_event_job_services(job_id,source_service_id,service_name)
  SELECT jid,s.id,s.name
  FROM public.crm_agreement_services s
  WHERE s.agreement_id=p_agreement AND s.enabled=true
  ON CONFLICT (job_id,source_service_id) WHERE source_service_id IS NOT NULL
  DO UPDATE SET service_name=EXCLUDED.service_name,updated_at=now();

  DELETE FROM public.crm_event_job_services e
  WHERE e.job_id=jid AND e.source_service_id IS NOT NULL
    AND NOT EXISTS(
      SELECT 1 FROM public.crm_agreement_services s
      WHERE s.id=e.source_service_id AND s.agreement_id=p_agreement AND s.enabled=true
    );
END; $$;

CREATE OR REPLACE FUNCTION public.crm_event_job_service_sync_trigger()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  PERFORM public.crm_sync_event_job_services(NEW.id);
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS zz_crm_event_job_service_sync ON public.crm_agreements;
CREATE TRIGGER zz_crm_event_job_service_sync
AFTER INSERT OR UPDATE OF payload,status ON public.crm_agreements
FOR EACH ROW EXECUTE FUNCTION public.crm_event_job_service_sync_trigger();

-- Preserve useful data while mapping existing jobs to the requested nine-stage flow.
UPDATE public.crm_event_job_stages material
SET data=material.data || COALESCE(review.data,'{}'::jsonb),updated_at=now()
FROM public.crm_event_job_stages review
WHERE material.job_id=review.job_id
  AND material.stage_key='material_reconciliation'
  AND review.stage_key='post_event_review';

DELETE FROM public.crm_event_job_stages WHERE stage_key IN ('post_event_review','job_completed');

UPDATE public.crm_event_job_stages
SET data=data||jsonb_build_object(
  'feedback_summary',
  COALESCE(
    NULLIF(data->>'feedback_summary',''),
    NULLIF(data->>'review_summary',''),
    'Existing post-event review migrated to Feedback'
  )
)
WHERE stage_key='material_reconciliation' AND status='Completed';

UPDATE public.crm_event_job_stages SET stage_key='booking',stage_name='Booking',sort_order=0 WHERE stage_key='booking_confirmed';
UPDATE public.crm_event_job_stages SET stage_key='confirmation',stage_name='Confirmation',sort_order=1 WHERE stage_key='planning';
UPDATE public.crm_event_job_stages SET stage_key='vendor_blocking',stage_name='Vendor Blocking',sort_order=2 WHERE stage_key='vendor_confirmation';
UPDATE public.crm_event_job_stages SET stage_key='client_meeting',stage_name='Client Meeting',sort_order=3 WHERE stage_key='team_assignment';
UPDATE public.crm_event_job_stages SET stage_key='final_checklist',stage_name='Final Checklist',sort_order=4 WHERE stage_key='event_preparation';
UPDATE public.crm_event_job_stages SET stage_key='dispatch',stage_name='Dispatch',sort_order=5 WHERE stage_key='pre_event_qc';
UPDATE public.crm_event_job_stages SET stage_key='event_execution',stage_name='Event Execution',sort_order=6 WHERE stage_key='event_day';
UPDATE public.crm_event_job_stages SET stage_key='payment_closure',stage_name='Payment Closure',sort_order=7 WHERE stage_key='event_completion';
UPDATE public.crm_event_job_stages SET stage_key='feedback',stage_name='Feedback',sort_order=8 WHERE stage_key='material_reconciliation';

UPDATE public.crm_event_jobs SET current_stage_key=CASE current_stage_key
  WHEN 'booking_confirmed' THEN 'booking'
  WHEN 'planning' THEN 'confirmation'
  WHEN 'vendor_confirmation' THEN 'vendor_blocking'
  WHEN 'team_assignment' THEN 'client_meeting'
  WHEN 'event_preparation' THEN 'final_checklist'
  WHEN 'pre_event_qc' THEN 'dispatch'
  WHEN 'event_day' THEN 'event_execution'
  WHEN 'event_completion' THEN 'payment_closure'
  WHEN 'material_reconciliation' THEN 'feedback'
  WHEN 'post_event_review' THEN 'feedback'
  WHEN 'job_completed' THEN 'feedback'
  ELSE current_stage_key END,updated_at=now();

UPDATE public.crm_tasks SET workflow_stage_key=CASE workflow_stage_key
  WHEN 'planning' THEN 'confirmation'
  WHEN 'vendor_confirmation' THEN 'vendor_blocking'
  WHEN 'team_assignment' THEN 'client_meeting'
  WHEN 'event_preparation' THEN 'final_checklist'
  WHEN 'pre_event_qc' THEN 'dispatch'
  WHEN 'event_day' THEN 'event_execution'
  WHEN 'event_completion' THEN 'payment_closure'
  WHEN 'material_reconciliation' THEN 'feedback'
  ELSE workflow_stage_key END
WHERE event_job_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.crm_create_event_job_for_agreement(p_agreement UUID)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE a public.crm_agreements%ROWTYPE; inv public.crm_invoices%ROWTYPE; jid UUID; sid UUID; assignee UUID;
BEGIN
  SELECT * INTO a FROM public.crm_agreements WHERE id=p_agreement;
  IF NOT FOUND OR a.status NOT IN ('Signed','Completed') OR a.event_date IS NULL THEN RETURN NULL; END IF;
  SELECT * INTO inv FROM public.crm_invoices WHERE agreement_id=a.id AND status<>'Cancelled' ORDER BY created_at DESC LIMIT 1;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT id INTO jid FROM public.crm_event_jobs WHERE agreement_id=a.id;
  IF jid IS NOT NULL THEN
    UPDATE public.crm_event_jobs SET invoice_id=inv.id,booking_snapshot=a.payload,updated_at=now() WHERE id=jid;
    PERFORM public.crm_sync_event_job_services(a.id);
    RETURN jid;
  END IF;
  assignee:=COALESCE(a.assigned_to,a.created_by);
  INSERT INTO public.crm_event_jobs(job_number,agreement_id,invoice_id,client_name,event_name,event_date,venue,city,package_name,booking_snapshot,created_by)
  VALUES(public.crm_next_event_job_number(),a.id,inv.id,a.client_name,
    COALESCE(NULLIF(trim(COALESCE(a.payload->>'groom_name','')||CASE WHEN COALESCE(a.payload->>'bride_name','')<>'' THEN ' & '||(a.payload->>'bride_name') ELSE '' END),''),a.client_name||' Event'),
    a.event_date,a.payload->>'venue',a.payload->>'city',a.package_name,a.payload,a.created_by) RETURNING id INTO jid;

  INSERT INTO public.crm_event_job_stages(job_id,stage_key,stage_name,sort_order,status,assigned_to,started_at,completed_at,completed_by,last_updated_by,data)
  VALUES
   (jid,'booking','Booking',0,'Completed',assignee,now(),now(),a.created_by,a.created_by,jsonb_build_object('agreement_number',a.agreement_number,'invoice_number',inv.invoice_number)),
   (jid,'confirmation','Confirmation',1,CASE WHEN assignee IS NULL THEN 'In Progress' ELSE 'Assigned' END,assignee,now(),NULL,NULL,a.created_by,'{}'),
   (jid,'vendor_blocking','Vendor Blocking',2,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}'),
   (jid,'client_meeting','Client Meeting',3,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}'),
   (jid,'final_checklist','Final Checklist',4,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}'),
   (jid,'dispatch','Dispatch',5,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}'),
   (jid,'event_execution','Event Execution',6,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}'),
   (jid,'payment_closure','Payment Closure',7,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}'),
   (jid,'feedback','Feedback',8,'Waiting',NULL,NULL,NULL,NULL,NULL,'{}');

  PERFORM public.crm_sync_event_job_services(a.id);
  SELECT id INTO sid FROM public.crm_event_job_stages WHERE job_id=jid AND stage_key='confirmation';
  INSERT INTO public.crm_tasks(title,description,priority,due_date,assigned_by,event_job_id,event_job_stage_id,workflow_stage_key)
  VALUES((SELECT job_number FROM public.crm_event_jobs WHERE id=jid)||' · Confirmation','Confirm client, event and agreement details','High',a.event_date-INTERVAL '14 days',a.created_by,jid,sid,'confirmation');
  IF assignee IS NOT NULL THEN
    INSERT INTO public.crm_task_assignees(task_id,staff_user_id) SELECT id,assignee FROM public.crm_tasks WHERE event_job_stage_id=sid ON CONFLICT DO NOTHING;
    INSERT INTO public.crm_notifications(recipient_id,type,title,body,link) VALUES(assignee,'event_job','New Event Job assigned','Confirmation is ready for '||(SELECT job_number FROM public.crm_event_jobs WHERE id=jid),'/workspace/event-jobs/'||jid);
  END IF;
  INSERT INTO public.crm_event_job_activity(job_id,action,detail,actor_id) VALUES(jid,'job_created','Event Job created automatically from confirmed booking',a.created_by);
  RETURN jid;
END; $$;

CREATE OR REPLACE FUNCTION public.crm_update_event_job_stage(
  p_stage UUID,p_action TEXT,p_data JSONB DEFAULT '{}'::jsonb,
  p_rework_stage TEXT DEFAULT NULL,p_reason TEXT DEFAULT NULL
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  s public.crm_event_job_stages%ROWTYPE;
  nxt public.crm_event_job_stages%ROWTYPE;
  missing TEXT;
  unresolved INTEGER;
  taskid UUID;
  invoice_status TEXT;
BEGIN
  SELECT * INTO s FROM public.crm_event_job_stages WHERE id=p_stage FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Workflow stage not found.'; END IF;
  IF NOT public.crm_can_edit_event_stage(p_stage) THEN
    RAISE EXCEPTION 'This stage is not assigned to you or you do not have Event Jobs access.';
  END IF;

  IF p_action='start' THEN
    IF s.status NOT IN ('Assigned','In Progress') THEN RAISE EXCEPTION 'This stage is not ready to start.'; END IF;
    UPDATE public.crm_event_job_stages SET status='In Progress',started_at=COALESCE(started_at,now()),data=data||p_data,last_updated_by=auth.uid(),updated_at=now() WHERE id=p_stage;
  ELSIF p_action='save' THEN
    UPDATE public.crm_event_job_stages SET data=data||p_data,last_updated_by=auth.uid(),updated_at=now() WHERE id=p_stage;
  ELSIF p_action='qc_fail' THEN
    IF s.stage_key<>'dispatch' OR p_rework_stage IS NULL OR COALESCE(trim(p_reason),'')='' THEN
      RAISE EXCEPTION 'Dispatch correction requires a responsible stage and reason.';
    END IF;
    UPDATE public.crm_event_job_stages SET status='Needs Rework',data=data||p_data||jsonb_build_object('failure_reason',p_reason,'rework_stage',p_rework_stage),last_updated_by=auth.uid(),updated_at=now() WHERE id=p_stage;
    UPDATE public.crm_event_job_stages SET status='Needs Rework',completed_at=NULL,completed_by=NULL,rework_count=rework_count+1,last_updated_by=auth.uid(),updated_at=now() WHERE job_id=s.job_id AND stage_key=p_rework_stage;
    UPDATE public.crm_tasks SET status='On Hold',rework_reason=p_reason,updated_at=now() WHERE event_job_stage_id=p_stage;
    UPDATE public.crm_tasks SET status='Needs Revision',progress=0,rework_reason=p_reason,updated_at=now() WHERE event_job_stage_id=(SELECT id FROM public.crm_event_job_stages WHERE job_id=s.job_id AND stage_key=p_rework_stage);
    UPDATE public.crm_event_jobs SET status='Needs Rework',current_stage_key=p_rework_stage,updated_at=now() WHERE id=s.job_id;
    INSERT INTO public.crm_notifications(recipient_id,type,title,body,link)
      SELECT assigned_to,'event_job','Dispatch correction required',p_reason,'/workspace/event-jobs/'||s.job_id
      FROM public.crm_event_job_stages WHERE job_id=s.job_id AND stage_key=p_rework_stage AND assigned_to IS NOT NULL;
    INSERT INTO public.crm_event_job_activity(job_id,stage_key,action,detail,metadata,actor_id)
      VALUES(s.job_id,s.stage_key,'dispatch_returned',p_reason,jsonb_build_object('rework_stage',p_rework_stage),auth.uid());
    RETURN;
  ELSIF p_action='reopen' THEN
    IF NOT public.crm_event_jobs_is_admin() OR COALESCE(trim(p_reason),'')='' THEN
      RAISE EXCEPTION 'Only an administrator can reopen a stage, and a reason is required.';
    END IF;
    UPDATE public.crm_event_job_stages SET status=CASE WHEN assigned_to IS NULL THEN 'In Progress' ELSE 'Assigned' END,completed_at=NULL,completed_by=NULL,rework_count=rework_count+1,data=data||jsonb_build_object('reopen_reason',p_reason),last_updated_by=auth.uid(),updated_at=now() WHERE id=p_stage;
    UPDATE public.crm_event_job_stages SET status='Waiting',started_at=NULL,completed_at=NULL,completed_by=NULL WHERE job_id=s.job_id AND sort_order>s.sort_order;
    UPDATE public.crm_tasks SET status='Needs Revision',progress=0,rework_reason=p_reason,updated_at=now() WHERE event_job_stage_id=p_stage;
    UPDATE public.crm_tasks SET status='Pending',progress=0,updated_at=now() WHERE event_job_stage_id IN (SELECT id FROM public.crm_event_job_stages WHERE job_id=s.job_id AND sort_order>s.sort_order);
    UPDATE public.crm_event_jobs SET status='Needs Rework',current_stage_key=s.stage_key,completed_at=NULL,updated_at=now() WHERE id=s.job_id;
    INSERT INTO public.crm_event_job_activity(job_id,stage_key,action,detail,actor_id) VALUES(s.job_id,s.stage_key,'stage_reopened',p_reason,auth.uid());
    RETURN;
  ELSIF p_action='complete' THEN
    IF s.status NOT IN ('Assigned','In Progress','Needs Rework') THEN RAISE EXCEPTION 'This stage is not active.'; END IF;

    IF s.stage_key='confirmation' THEN
      SELECT string_agg(v,', ') INTO missing FROM (VALUES
        ('Client details confirmed',p_data->>'client_verified'),
        ('Event date/time confirmed',p_data->>'event_date_verified'),
        ('Venue and route confirmed',p_data->>'venue_verified'),
        ('Agreement services confirmed',p_data->>'services_verified')
      ) x(v,b) WHERE COALESCE(b,'false')<>'true';
    ELSIF s.stage_key='vendor_blocking' THEN
      PERFORM public.crm_sync_event_job_services((SELECT agreement_id FROM public.crm_event_jobs WHERE id=s.job_id));
      SELECT count(*) INTO unresolved FROM public.crm_event_job_services
      WHERE job_id=s.job_id AND booking_status NOT IN ('Booked','Not Required');
      IF unresolved>0 THEN missing:=unresolved||' agreement service(s) are not booked or marked not required'; END IF;
    ELSIF s.stage_key='client_meeting' THEN
      IF COALESCE((p_data->>'meeting_completed')::boolean,false)=false OR COALESCE(trim(p_data->>'meeting_notes'),'')='' THEN
        missing:='Record the completed client meeting and meeting notes';
      END IF;
    ELSIF s.stage_key='final_checklist' THEN
      IF COALESCE((p_data->>'all_required_complete')::boolean,false)=false THEN missing:='Complete every required final checklist item'; END IF;
    ELSIF s.stage_key='dispatch' THEN
      IF COALESCE((p_data->>'dispatch_released')::boolean,false)=false THEN missing:='Confirm dispatch release after final verification'; END IF;
    ELSIF s.stage_key='event_execution' THEN
      IF COALESCE((p_data->>'service_completed')::boolean,false)=false THEN missing:='Complete the live event execution checklist'; END IF;
    ELSIF s.stage_key='payment_closure' THEN
      SELECT i.status INTO invoice_status FROM public.crm_event_jobs j LEFT JOIN public.crm_invoices i ON i.id=j.invoice_id WHERE j.id=s.job_id;
      IF COALESCE(invoice_status,'')<>'Paid' THEN missing:='The connected invoice must be marked Paid before payment closure'; END IF;
    ELSIF s.stage_key='feedback' THEN
      IF COALESCE(trim(p_data->>'feedback_summary'),'')='' THEN missing:='Client feedback and a closing summary are required'; END IF;
    END IF;
    IF missing IS NOT NULL THEN RAISE EXCEPTION 'Cannot complete: %',missing; END IF;

    UPDATE public.crm_event_job_stages SET status='Completed',data=data||p_data,completed_at=now(),completed_by=auth.uid(),last_updated_by=auth.uid(),updated_at=now() WHERE id=p_stage;
    UPDATE public.crm_tasks SET status='Completed',progress=100,updated_at=now() WHERE event_job_stage_id=p_stage;

    IF s.stage_key='feedback' THEN
      UPDATE public.crm_event_jobs SET current_stage_key='feedback',status='Completed',completed_at=now(),updated_at=now() WHERE id=s.job_id;
    ELSE
      IF EXISTS(SELECT 1 FROM public.crm_event_jobs WHERE id=s.job_id AND status='Needs Rework')
        AND s.stage_key<>'dispatch'
        AND EXISTS(SELECT 1 FROM public.crm_event_job_stages WHERE job_id=s.job_id AND stage_key='dispatch' AND status='Needs Rework') THEN
        SELECT * INTO nxt FROM public.crm_event_job_stages WHERE job_id=s.job_id AND stage_key='dispatch';
      ELSE
        SELECT * INTO nxt FROM public.crm_event_job_stages WHERE job_id=s.job_id AND sort_order=s.sort_order+1;
      END IF;
      IF nxt.id IS NOT NULL THEN
        UPDATE public.crm_event_job_stages SET status=CASE WHEN assigned_to IS NULL THEN 'In Progress' ELSE 'Assigned' END,started_at=COALESCE(started_at,now()),updated_at=now() WHERE id=nxt.id;
        UPDATE public.crm_event_jobs SET current_stage_key=nxt.stage_key,status='In Progress',completed_at=NULL,updated_at=now() WHERE id=s.job_id;
        SELECT id INTO taskid FROM public.crm_tasks WHERE event_job_stage_id=nxt.id ORDER BY created_at LIMIT 1;
        IF taskid IS NULL THEN
          INSERT INTO public.crm_tasks(title,description,priority,due_date,assigned_by,event_job_id,event_job_stage_id,workflow_stage_key)
          SELECT j.job_number||' · '||nxt.stage_name,'Event Job workflow stage','High',nxt.due_at,auth.uid(),j.id,nxt.id,nxt.stage_key FROM public.crm_event_jobs j WHERE j.id=s.job_id RETURNING id INTO taskid;
        ELSE
          UPDATE public.crm_tasks SET status='Pending',progress=0,rework_reason=NULL,due_date=nxt.due_at,updated_at=now() WHERE id=taskid;
        END IF;
        DELETE FROM public.crm_task_assignees WHERE task_id=taskid;
        IF nxt.assigned_to IS NOT NULL THEN
          INSERT INTO public.crm_task_assignees(task_id,staff_user_id) VALUES(taskid,nxt.assigned_to);
          INSERT INTO public.crm_notifications(recipient_id,type,title,body,link) VALUES(nxt.assigned_to,'event_job','Workflow stage ready',nxt.stage_name||' is ready.','/workspace/event-jobs/'||s.job_id);
        END IF;
      END IF;
    END IF;
    INSERT INTO public.crm_event_job_activity(job_id,stage_key,action,detail,actor_id) VALUES(s.job_id,s.stage_key,'stage_completed',s.stage_name||' completed',auth.uid());
  ELSE
    RAISE EXCEPTION 'Unsupported workflow action.';
  END IF;
END; $$;

GRANT EXECUTE ON FUNCTION public.crm_sync_event_job_services(UUID) TO authenticated;

-- Access Management must work in deployments that intentionally expose only
-- the publishable Supabase key. The SECURITY DEFINER RPC still verifies that
-- the caller is an active Admin/Super Admin before changing another user.
CREATE OR REPLACE FUNCTION public.crm_update_staff_access(
  p_staff UUID,p_access JSONB,p_mode TEXT DEFAULT 'module'
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE target_user UUID; target_role TEXT;
BEGIN
  IF NOT EXISTS(
    SELECT 1 FROM public.crm_users
    WHERE id=auth.uid() AND is_active=true AND role IN ('admin','super_admin')
  ) THEN RAISE EXCEPTION 'Only an administrator can manage access.'; END IF;
  IF p_access IS NULL OR jsonb_typeof(p_access)<>'object' THEN RAISE EXCEPTION 'A valid access map is required.'; END IF;

  SELECT s.user_id,u.role INTO target_user,target_role
  FROM public.crm_staff s JOIN public.crm_users u ON u.id=s.user_id
  WHERE s.id=p_staff;
  IF target_user IS NULL THEN RAISE EXCEPTION 'This staff member has no linked login.'; END IF;

  IF p_mode='module' THEN
    IF target_role IN ('admin','super_admin') THEN RAISE EXCEPTION 'Administrators already have full access.'; END IF;
    UPDATE public.crm_users SET module_access=p_access,permissions_updated_at=now(),permissions_updated_by=auth.uid(),updated_at=now() WHERE id=target_user;
  ELSIF p_mode='section' THEN
    IF target_role<>'manager' THEN RAISE EXCEPTION 'CRM section access can only be set for Manager accounts.'; END IF;
    UPDATE public.crm_users SET crm_section_access=p_access,permissions_updated_at=now(),permissions_updated_by=auth.uid(),updated_at=now() WHERE id=target_user;
  ELSE RAISE EXCEPTION 'Unknown access mode.';
  END IF;
  RETURN p_access;
END; $$;
GRANT EXECUTE ON FUNCTION public.crm_update_staff_access(UUID,JSONB,TEXT) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_update_staff_access(UUID,JSONB,TEXT) FROM anon;

-- Ensure existing jobs contain every currently enabled agreement service.
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT agreement_id FROM public.crm_event_jobs LOOP
    PERFORM public.crm_sync_event_job_services(r.agreement_id);
  END LOOP;
END $$;
