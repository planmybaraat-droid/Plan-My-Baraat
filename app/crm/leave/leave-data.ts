import { crmSupabase } from '../lib/supabase-crm';
import type { LeaveRequest, LeaveStatus, LeaveType } from '../lib/types';

const requestSelect = '*,staff:crm_staff(*)';

export async function getLeaveRequests(filters: { status?: string; type?: string; search?: string } = {}) {
  let query = crmSupabase.from('crm_leave_requests').select(requestSelect).order('created_at', { ascending: false });
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.type) query = query.eq('leave_type', filters.type);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  let rows = (data || []) as unknown as LeaveRequest[];
  if (filters.search) {
    const term = filters.search.toLowerCase();
    rows = rows.filter((row) => row.request_number.toLowerCase().includes(term) || row.staff?.full_name.toLowerCase().includes(term) || row.staff?.employee_code.toLowerCase().includes(term));
  }
  return rows;
}

export interface SubmitLeaveInput { leaveType: LeaveType; fromDate: string; toDate: string; reason: string; file?: File | null }

export async function submitLeave(input: SubmitLeaveInput) {
  const { data, error } = await crmSupabase.rpc('crm_submit_leave', {
    p_leave_type: input.leaveType, p_from_date: input.fromDate, p_to_date: input.toDate, p_reason: input.reason,
  });
  if (error) throw new Error(error.message);
  return data as LeaveRequest;
}

export function leaveWhatsAppUrl(input: SubmitLeaveInput, requestNumber?: string) {
  const days = Math.round((Date.parse(`${input.toDate}T00:00:00`) - Date.parse(`${input.fromDate}T00:00:00`)) / 86400000) + 1;
  const lines = [
    'PlanMyBaraat Leave Request',
    requestNumber ? `Request: ${requestNumber}` : '',
    `Type: ${input.leaveType}`,
    `Dates: ${input.fromDate} to ${input.toDate} (${days} day${days === 1 ? '' : 's'})`,
    `Reason: ${input.reason.trim()}`,
    input.file ? `Supporting file selected: ${input.file.name}` : 'Supporting file: None',
    input.file ? 'Please attach the selected file to this WhatsApp chat before sending.' : '',
  ].filter(Boolean);
  return `https://wa.me/918830612287?text=${encodeURIComponent(lines.join('\n'))}`;
}

export async function cancelLeave(id: string) {
  const { data, error } = await crmSupabase.rpc('crm_cancel_leave', { p_request_id: id });
  if (error) throw new Error(error.message);
  return data as LeaveRequest;
}

export async function reviewLeave(id: string, decision: Extract<LeaveStatus, 'Approved' | 'Rejected'>, reason?: string) {
  const { data, error } = await crmSupabase.rpc('crm_review_leave', { p_request_id: id, p_decision: decision, p_rejection_reason: reason || null });
  if (error) throw new Error(error.message);
  return data as LeaveRequest;
}

export async function openLeaveAttachment(path: string) {
  const { data, error } = await crmSupabase.storage.from('crm-files').createSignedUrl(path, 300);
  if (error) throw new Error(error.message);
  window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
}
