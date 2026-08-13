import { crmSupabase } from './supabase-crm';

export type TaskStatus = 'Pending' | 'Accepted' | 'In Progress' | 'On Hold' | 'Completed' | 'Rejected' | 'Needs Revision';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface TaskRecord {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  due_date: string | null;
  assigned_by: string | null;
  status: TaskStatus;
  progress: number;
  completion_notes: string | null;
  review_reason: string | null;
  created_at: string;
  updated_at: string;
  assignees?: { staff_user_id: string; name: string }[];
}

export interface ChecklistItem { id: string; task_id: string; label: string; is_done: boolean; sort_order: number }
export interface TaskComment { id: string; task_id: string; author_id: string | null; comment: string; created_at: string; author_name?: string }
export interface TaskAttachment { id: string; task_id: string; file_name: string; file_url: string; file_type: string | null; uploaded_by: string | null; created_at: string }

export async function getTasks() {
  const { data: taskRows, error: taskError } = await crmSupabase
    .from('crm_tasks')
    .select('*')
    .is('event_job_id', null)
    .is('event_job_stage_id', null)
    .order('due_date', { ascending: true, nullsFirst: false });
  if (taskError) throw new Error(taskError.message);

  const tasks = (taskRows || []) as TaskRecord[];
  if (!tasks.length) return tasks;

  const taskIds = tasks.map((task) => task.id);
  const { data: assignmentRows, error: assignmentError } = await crmSupabase
    .from('crm_task_assignees')
    .select('task_id,staff_user_id')
    .in('task_id', taskIds);
  if (assignmentError) throw new Error(assignmentError.message);

  const staffIds = Array.from(new Set((assignmentRows || []).map((row) => row.staff_user_id)));
  const staffNames = new Map<string, string>();
  if (staffIds.length) {
    const { data: staffRows, error: staffError } = await crmSupabase
      .from('crm_users')
      .select('id,full_name')
      .in('id', staffIds);
    if (staffError) throw new Error(staffError.message);
    for (const staff of staffRows || []) staffNames.set(staff.id, staff.full_name || 'Staff');
  }

  return tasks.map((row) => ({
    ...row,
    assignees: (assignmentRows || []).filter((assignment) => assignment.task_id === row.id).map((assignment) => ({
      staff_user_id: assignment.staff_user_id,
      name: staffNames.get(assignment.staff_user_id) || 'Staff',
    })),
  }));
}

export async function getTask(id: string) {
  const { data, error } = await crmSupabase.from('crm_tasks').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data as TaskRecord;
}

export async function createTask(input: { title: string; description: string; priority: TaskPriority; due_date: string | null; assignees: string[] }) {
  const { data: { user } } = await crmSupabase.auth.getUser();
  const { data: task, error } = await crmSupabase.from('crm_tasks').insert({
    title: input.title, description: input.description || null, priority: input.priority, due_date: input.due_date || null, assigned_by: user?.id,
  }).select().single();
  if (error) throw new Error(error.message);
  if (input.assignees.length) {
    const { error: assignError } = await crmSupabase.from('crm_task_assignees').insert(input.assignees.map((staff_user_id) => ({ task_id: task.id, staff_user_id })));
    if (assignError) throw new Error(assignError.message);
  }
  return task as TaskRecord;
}

export async function updateTaskStatus(id: string, status: TaskStatus, extra: Partial<Pick<TaskRecord, 'progress' | 'completion_notes' | 'review_reason'>> = {}) {
  const { data, error } = await crmSupabase.from('crm_tasks').update({ status, ...extra, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data as TaskRecord;
}

export async function updateTaskProgress(id: string, progress: number) {
  const { data, error } = await crmSupabase.from('crm_tasks').update({ progress, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data as TaskRecord;
}

export async function getChecklist(taskId: string) {
  const { data, error } = await crmSupabase.from('crm_task_checklist').select('*').eq('task_id', taskId).order('sort_order');
  if (error) throw new Error(error.message);
  return (data || []) as ChecklistItem[];
}
export async function addChecklistItem(taskId: string, label: string, sortOrder: number) {
  const { data, error } = await crmSupabase.from('crm_task_checklist').insert({ task_id: taskId, label, sort_order: sortOrder }).select().single();
  if (error) throw new Error(error.message);
  return data as ChecklistItem;
}
export async function toggleChecklistItem(id: string, is_done: boolean) {
  const { error } = await crmSupabase.from('crm_task_checklist').update({ is_done }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function getComments(taskId: string) {
  const { data, error } = await crmSupabase.from('crm_task_comments').select('*').eq('task_id', taskId).order('created_at');
  if (error) throw new Error(error.message);
  return (data || []) as TaskComment[];
}
export async function addComment(taskId: string, comment: string) {
  const { data: { user } } = await crmSupabase.auth.getUser();
  const { data, error } = await crmSupabase.from('crm_task_comments').insert({ task_id: taskId, author_id: user?.id, comment }).select().single();
  if (error) throw new Error(error.message);
  return data as TaskComment;
}

export async function getAttachments(taskId: string) {
  const { data, error } = await crmSupabase.from('crm_task_attachments').select('*').eq('task_id', taskId).order('created_at');
  if (error) throw new Error(error.message);
  return (data || []) as TaskAttachment[];
}
export async function uploadAttachment(taskId: string, file: File) {
  const { data: { user } } = await crmSupabase.auth.getUser();
  const path = `${taskId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await crmSupabase.storage.from('task-attachments').upload(path, file);
  if (uploadError) throw new Error(uploadError.message);
  const { data, error } = await crmSupabase.from('crm_task_attachments').insert({
    task_id: taskId, file_name: file.name, file_url: path, file_type: file.type, uploaded_by: user?.id,
  }).select().single();
  if (error) throw new Error(error.message);
  return data as TaskAttachment;
}
export async function getAttachmentUrl(path: string) {
  const { data, error } = await crmSupabase.storage.from('task-attachments').createSignedUrl(path, 3600);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}
