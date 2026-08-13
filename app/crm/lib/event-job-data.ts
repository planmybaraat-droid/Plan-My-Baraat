import { crmSupabase } from './supabase-crm';

export type EventJobStatus = 'In Progress' | 'Blocked' | 'Needs Rework' | 'Completed' | 'Cancelled';
export type EventStageStatus = 'Waiting' | 'Assigned' | 'In Progress' | 'Completed' | 'Blocked' | 'Needs Rework' | 'Cancelled';

export interface EventJob {
  id: string; job_number: string; agreement_id: string; invoice_id: string | null;
  client_name: string; event_name: string; event_date: string; venue: string | null;
  city: string | null; package_name: string | null; booking_snapshot: Record<string, unknown>;
  status: EventJobStatus; current_stage_key: string; created_by: string | null;
  completed_at: string | null; created_at: string; updated_at: string;
  assigned_staff_ids?: string[]; vendor_ids?: string[]; team_names?: string[];
}
export interface EventJobStage {
  id: string; job_id: string; stage_key: string; stage_name: string; sort_order: number;
  status: EventStageStatus; assigned_to: string | null; due_at: string | null;
  started_at: string | null; completed_at: string | null; completed_by: string | null;
  last_updated_by: string | null; data: Record<string, unknown>; rework_count: number;
  assignee?: { id: string; full_name: string | null } | null;
  completer?: { id: string; full_name: string | null } | null;
}
export interface EventJobService { id: string; job_id: string; service_name: string; vendor_id: string | null; vendor_name: string | null; vendor_contact: string | null; confirmation_status: string; booking_status: 'Not Started'|'Contacted'|'Blocked'|'Booked'|'Not Required'|'Issue'; assigned_to: string | null; confirmation_date: string | null; notes: string | null }
export interface EventJobTeamMember { id: string; job_id: string; staff_user_id: string; assignment_role: string; team_name: string | null; reporting_time: string | null; notes: string | null; staff?: { id: string; full_name: string | null } | null }
export interface EventJobMaterial { id: string; job_id: string; item_name: string; issued_quantity: number; returned_quantity: number; missing_quantity: number; damaged_quantity: number; exception_reason: string | null; exception_resolved: boolean; responsible_staff_id: string | null; notes: string | null }
export interface EventJobActivity { id: string; job_id: string; stage_key: string | null; action: string; detail: string | null; actor_id: string | null; actor_name: string | null; created_at: string }
export interface EventJobBundle { job: EventJob; stages: EventJobStage[]; services: EventJobService[]; team: EventJobTeamMember[]; materials: EventJobMaterial[]; activity: EventJobActivity[] }

function friendlyError(error: { message?: string } | null, fallback: string) {
  if (!error) return fallback;
  const message = error.message || fallback;
  if (message.includes('schema cache') || message.includes('does not exist')) return 'Event Jobs database setup is pending. Apply the latest Supabase migration, then reload.';
  if (message.includes('row-level security') || message.includes('permission')) return 'You do not have permission to perform this Event Job action.';
  return message.replace(/^.*?exception:\s*/i, '');
}

export async function getEventJobs() {
  const { data, error } = await crmSupabase.from('crm_event_jobs').select('*').order('event_date');
  if (error) throw new Error(friendlyError(error, 'Unable to load Event Jobs.'));
  const jobs = (data || []) as EventJob[];
  if (!jobs.length) return jobs;
  const ids = jobs.map((job) => job.id);
  const [stageRows, serviceRows, teamRows] = await Promise.all([
    crmSupabase.from('crm_event_job_stages').select('job_id,assigned_to').in('job_id', ids).not('assigned_to', 'is', null),
    crmSupabase.from('crm_event_job_services').select('job_id,vendor_id').in('job_id', ids).not('vendor_id', 'is', null),
    crmSupabase.from('crm_event_job_team').select('job_id,staff_user_id,team_name').in('job_id', ids),
  ]);
  const relationError = stageRows.error || serviceRows.error || teamRows.error;
  if (relationError) throw new Error(friendlyError(relationError, 'Unable to load Event Job assignments.'));
  return jobs.map((job) => ({
    ...job,
    assigned_staff_ids: Array.from(new Set([
      ...(stageRows.data || []).filter((row) => row.job_id === job.id).map((row) => row.assigned_to as string),
      ...(teamRows.data || []).filter((row) => row.job_id === job.id).map((row) => row.staff_user_id),
    ])),
    vendor_ids: Array.from(new Set((serviceRows.data || []).filter((row) => row.job_id === job.id).map((row) => row.vendor_id as string))),
    team_names: Array.from(new Set((teamRows.data || []).filter((row) => row.job_id === job.id).map((row) => row.team_name).filter(Boolean) as string[])),
  }));
}

export async function getEventJob(id: string): Promise<EventJobBundle> {
  const [job, stages, services, team, materials, activity] = await Promise.all([
    crmSupabase.from('crm_event_jobs').select('*').eq('id', id).single(),
    crmSupabase.from('crm_event_job_stages').select('*,assignee:crm_users!crm_event_job_stages_assigned_to_fkey(id,full_name),completer:crm_users!crm_event_job_stages_completed_by_fkey(id,full_name)').eq('job_id', id).order('sort_order'),
    crmSupabase.from('crm_event_job_services').select('*').eq('job_id', id).order('created_at'),
    crmSupabase.from('crm_event_job_team').select('*,staff:crm_users!crm_event_job_team_staff_user_id_fkey(id,full_name)').eq('job_id', id).order('created_at'),
    crmSupabase.from('crm_event_job_materials').select('*').eq('job_id', id).order('created_at'),
    crmSupabase.from('crm_event_job_activity').select('*').eq('job_id', id).order('created_at', { ascending: false }),
  ]);
  const error = job.error || stages.error || services.error || team.error || materials.error || activity.error;
  if (error) throw new Error(friendlyError(error, 'Unable to load the Event Job tracker.'));
  return { job: job.data as EventJob, stages: (stages.data || []) as EventJobStage[], services: (services.data || []) as EventJobService[], team: (team.data || []) as EventJobTeamMember[], materials: (materials.data || []) as EventJobMaterial[], activity: (activity.data || []) as EventJobActivity[] };
}

export async function assignStage(stageId: string, assigneeId: string | null, dueAt: string | null) {
  const { error } = await crmSupabase.rpc('crm_assign_event_job_stage', { p_stage: stageId, p_assignee: assigneeId || null, p_due_at: dueAt || null });
  if (error) throw new Error(friendlyError(error, 'Unable to assign the workflow stage.'));
}

export async function updateStage(stageId: string, action: 'start' | 'save' | 'complete' | 'qc_fail' | 'reopen', data: Record<string, unknown>, reworkStage?: string, reason?: string) {
  const { error } = await crmSupabase.rpc('crm_update_event_job_stage', { p_stage: stageId, p_action: action, p_data: data, p_rework_stage: reworkStage || null, p_reason: reason || null });
  if (error) throw new Error(friendlyError(error, 'Unable to update the workflow stage.'));
}

export async function updateService(id: string, input: Partial<EventJobService>) {
  const { error } = await crmSupabase.from('crm_event_job_services').update({ ...input, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(friendlyError(error, 'Unable to update the service confirmation.'));
}
export async function addTeamMember(jobId: string, staffUserId: string, assignmentRole: string, reportingTime?: string) {
  const { error } = await crmSupabase.from('crm_event_job_team').insert({ job_id: jobId, staff_user_id: staffUserId, assignment_role: assignmentRole, reporting_time: reportingTime || null });
  if (error) throw new Error(friendlyError(error, 'Unable to assign the team member.'));
}
export async function removeTeamMember(id: string) {
  const { error } = await crmSupabase.from('crm_event_job_team').delete().eq('id', id);
  if (error) throw new Error(friendlyError(error, 'Unable to remove the team member.'));
}
export async function saveMaterial(jobId: string, input: Omit<EventJobMaterial, 'id' | 'job_id'> & { id?: string }) {
  const payload = { ...input, job_id: jobId, updated_at: new Date().toISOString() };
  const result = input.id ? await crmSupabase.from('crm_event_job_materials').update(payload).eq('id', input.id) : await crmSupabase.from('crm_event_job_materials').insert(payload);
  if (result.error) throw new Error(friendlyError(result.error, 'Unable to save material reconciliation.'));
}

export async function getActiveUsers() {
  const { data, error } = await crmSupabase.from('crm_users').select('id,full_name,email,role').eq('is_active', true).in('role', ['admin','super_admin','manager','staff','sales','accountant']).order('full_name');
  if (error) throw new Error(friendlyError(error, 'Unable to load staff.'));
  return data || [];
}

export async function getActiveVendors() {
  const { data, error } = await crmSupabase.from('crm_vendors').select('id,company_name,contact_person,mobile').neq('status', 'Inactive').order('company_name');
  if (error) throw new Error(friendlyError(error, 'Unable to load vendors.'));
  return data || [];
}
