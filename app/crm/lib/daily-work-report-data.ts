import { crmSupabase } from './supabase-crm';

export type DailyActivityStatus = 'DONE' | 'PENDING';
export type DailyReportStatus = 'DRAFT' | 'SUBMITTED' | 'REVIEWED';

export interface DailyWorkReportItem {
  id: string;
  report_id: string;
  activity_title: string;
  description: string;
  activity_status: DailyActivityStatus;
  related_task_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
export interface DailyWorkReport {
  id: string;
  user_id: string;
  report_date: string;
  report_status: DailyReportStatus;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
  items: DailyWorkReportItem[];
}

export interface DailyReportStaff {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
}

export function indiaDate(offsetDays = 0) {
  const now = new Date();
  now.setUTCDate(now.getUTCDate() + offsetDays);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const part = (type: string) => parts.find((entry) => entry.type === type)?.value || '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function isStaffEditableDate(date: string) {
  return date === indiaDate() || date === shiftDate(indiaDate(), -1);
}

function normalizeReport(row: Record<string, unknown> | null): DailyWorkReport | null {
  if (!row) return null;
  const rawItems = (row.crm_daily_work_report_items || []) as DailyWorkReportItem[];
  return {
    ...(row as unknown as Omit<DailyWorkReport, 'items'>),
    items: rawItems.filter((item) => !item.deleted_at).sort((a, b) => a.created_at.localeCompare(b.created_at)),
  };
}

const REPORT_SELECT = '*, crm_daily_work_report_items(*)';

export async function getMyDailyReport(reportDate: string) {
  const { data: { user } } = await crmSupabase.auth.getUser();
  if (!user) throw new Error('Please sign in again.');
  const { data, error } = await crmSupabase.from('crm_daily_work_reports').select(REPORT_SELECT)
    .eq('user_id', user.id).eq('report_date', reportDate).maybeSingle();
  if (error) throw new Error(error.message);
  return normalizeReport(data as Record<string, unknown> | null);
}

export async function getMyDailyReportHistory(limit = 60) {
  const { data: { user } } = await crmSupabase.auth.getUser();
  if (!user) throw new Error('Please sign in again.');
  const { data, error } = await crmSupabase.from('crm_daily_work_reports').select(REPORT_SELECT)
    .eq('user_id', user.id).order('report_date', { ascending: false }).limit(limit);
  if (error) throw new Error(error.message);
  return (data || []).map((row) => normalizeReport(row as Record<string, unknown>)!).filter(Boolean);
}

export async function getMyDailyReportHistoryPage(page = 1, pageSize = 10) {
  const { data: { user } } = await crmSupabase.auth.getUser();
  if (!user) throw new Error('Please sign in again.');
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(50, Math.max(10, pageSize));
  const from = (safePage - 1) * safePageSize;
  const { data, error, count } = await crmSupabase.from('crm_daily_work_reports')
    .select(REPORT_SELECT, { count: 'exact' })
    .eq('user_id', user.id)
    .order('report_date', { ascending: false })
    .range(from, from + safePageSize - 1);
  if (error) throw new Error(error.message);
  return {
    rows: (data || []).map((row) => normalizeReport(row as Record<string, unknown>)!).filter(Boolean),
    total: count || 0,
  };
}

async function ensureMyDailyReport(reportDate: string) {
  const existing = await getMyDailyReport(reportDate);
  if (existing) return existing;
  const { data: { user } } = await crmSupabase.auth.getUser();
  if (!user) throw new Error('Please sign in again.');
  const { data, error } = await crmSupabase.from('crm_daily_work_reports')
    .insert({ user_id: user.id, report_date: reportDate, report_status: 'DRAFT' }).select(REPORT_SELECT).single();
  if (error) {
    if (error.code === '23505') return (await getMyDailyReport(reportDate))!;
    throw new Error(error.message);
  }
  return normalizeReport(data as Record<string, unknown>)!;
}

export async function saveDailyActivity(input: {
  reportDate: string; id?: string; title: string; description: string;
  status: DailyActivityStatus; relatedTaskId?: string | null;
}) {
  const report = await ensureMyDailyReport(input.reportDate);
  const payload = {
    activity_title: input.title.trim(), description: input.description.trim(),
    activity_status: input.status, related_task_id: input.relatedTaskId || null,
  };
  const query = input.id
    ? crmSupabase.from('crm_daily_work_report_items').update(payload).eq('id', input.id).eq('report_id', report.id)
    : crmSupabase.from('crm_daily_work_report_items').insert({ ...payload, report_id: report.id });
  const { error } = await query;
  if (error) throw new Error(error.message);
}

export async function removeDailyActivity(reportId: string, itemId: string) {
  const { error } = await crmSupabase.from('crm_daily_work_report_items')
    .update({ deleted_at: new Date().toISOString() }).eq('id', itemId).eq('report_id', reportId);
  if (error) throw new Error(error.message);
}

export async function submitMyDailyReport(reportDate: string) {
  const report = await ensureMyDailyReport(reportDate);
  if (!report.items.length) throw new Error('Add at least one activity before submitting.');
  const { error } = await crmSupabase.from('crm_daily_work_reports')
    .update({ report_status: 'SUBMITTED', submitted_at: new Date().toISOString() }).eq('id', report.id);
  if (error) throw new Error(error.message);
}

export async function getMyRelatedTasks() {
  const { data, error } = await crmSupabase.from('crm_tasks').select('id,title,status')
    .not('status', 'in', '(Rejected)').order('updated_at', { ascending: false }).limit(100);
  if (error) throw new Error(error.message);
  return (data || []) as { id: string; title: string; status: string }[];
}

export async function getDailyReportStaff() {
  const { data, error } = await crmSupabase.from('crm_users').select('id,full_name,email,role')
    .in('role', ['staff', 'sales', 'accountant']).eq('is_active', true).order('full_name');
  if (error) throw new Error(error.message);
  return (data || []) as DailyReportStaff[];
}

export async function getAdminDailyReports(reportDate: string) {
  const { data, error } = await crmSupabase.from('crm_daily_work_reports').select(REPORT_SELECT)
    .eq('report_date', reportDate).order('created_at');
  if (error) throw new Error(error.message);
  return (data || []).map((row) => normalizeReport(row as Record<string, unknown>)!).filter(Boolean);
}
