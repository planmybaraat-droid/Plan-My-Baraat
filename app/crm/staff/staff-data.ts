import { CRM_CONFIGURATION_ERROR, crmSupabase, isCrmSupabaseConfigured } from '../lib/supabase-crm';
import type { AttendanceRecord, StaffFilters, StaffFormData, StaffRecord } from '../lib/types';

const STAFF_KEY = 'crm_staff_records_v1';
const ATTENDANCE_KEY = 'crm_attendance_records_v1';

function readLocal<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(key) || '[]') as T[]; } catch { return []; }
}
function writeLocal<T>(key: string, rows: T[]) { if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(rows)); }
const storage = async <T>(remote: () => Promise<T>, _local: () => T | Promise<T>) => {
  if (!isCrmSupabaseConfigured) throw new Error(CRM_CONFIGURATION_ERROR);
  return remote();
};

function normalizeStaff(row: Record<string, unknown>): StaffRecord {
  return {
    id: String(row.id), employee_code: String(row.employee_code || ''), full_name: String(row.full_name || ''), mobile: String(row.mobile || ''), email: String(row.email || ''),
    job_title: String(row.job_title || ''), department: String(row.department || ''), employment_type: row.employment_type as StaffRecord['employment_type'], joining_date: String(row.joining_date || ''),
    date_of_birth: String(row.date_of_birth || ''), status: row.status as StaffRecord['status'], work_location: String(row.work_location || ''), shift_start: String(row.shift_start || '').slice(0, 5),
    shift_end: String(row.shift_end || '').slice(0, 5), address: String(row.address || ''), emergency_contact_name: String(row.emergency_contact_name || ''), emergency_contact_mobile: String(row.emergency_contact_mobile || ''), notes: String(row.notes || ''),
    crm_id: String(row.crm_id || ''), role: (row.role as StaffRecord['role']) || 'staff', user_id: row.user_id ? String(row.user_id) : null,
    created_at: String(row.created_at || ''), updated_at: String(row.updated_at || ''),
    // HR module fields — additive columns on crm_staff, optional everywhere else.
    photo_url: row.photo_url ? String(row.photo_url) : null,
    designation: row.designation ? String(row.designation) : null,
    reporting_manager_id: row.reporting_manager_id ? String(row.reporting_manager_id) : null,
    hr_lifecycle_status: (row.hr_lifecycle_status as StaffRecord['hr_lifecycle_status']) || 'Active',
    current_salary: Number(row.current_salary || 0),
  };
}

export function createBlankStaff(nextCode: string): StaffFormData {
  return { employee_code: nextCode, full_name: '', mobile: '', email: '', job_title: '', department: 'Operations', employment_type: 'Full Time', joining_date: new Date().toISOString().slice(0, 10), date_of_birth: '', status: 'Active', work_location: 'Vadodara', shift_start: '10:00', shift_end: '19:00', address: '', emergency_contact_name: '', emergency_contact_mobile: '', notes: '', crm_id: nextCode, role: 'staff', password: '' };
}

async function staffApi(method: string, body: object) {
  const res = await fetch('/api/crm/staff', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Request failed.');
  return json;
}

export const resetStaffPassword = (staff_id: string, new_password: string) => staffApi('PATCH', { staff_id, action: 'reset_password', new_password });
export const setStaffActive = (staff_id: string, activate: boolean) => staffApi('PATCH', { staff_id, action: activate ? 'activate' : 'deactivate' }).then(r => normalizeStaff(r.staff));
export const getStaffLastLogin = (staff_id: string) => staffApi('PATCH', { staff_id, action: 'last_login' }).then(r => r.last_sign_in_at as string | null);

// -- Module access (Staff Access Management) --------------------------------
// Reads go straight through the regular client: crm_users has a "read the
// team directory" policy that lets any signed-in CRM user read every row
// (needed for @mentions, assignee pickers, etc.), so this doesn't need the
// service-role route. Writing someone else's permissions does need it, since
// the row-level UPDATE policy on crm_users only lets people edit their own row.
export async function getUserModuleAccess(userId: string): Promise<{ role: string; module_access: Record<string, boolean> }> {
  const { data, error } = await crmSupabase.from('crm_users').select('role, module_access').eq('id', userId).maybeSingle();
  if (error) throw new Error(error.message);
  return { role: data?.role || 'staff', module_access: (data?.module_access as Record<string, boolean>) || {} };
}

// Bulk-load module_access for every crm_users row, keyed by user id — used to
// show an "N modules enabled" count per row in the Staff Management table
// without a per-row round trip.
export async function getAllModuleAccess(): Promise<Record<string, { role: string; module_access: Record<string, boolean> }>> {
  const { data, error } = await crmSupabase.from('crm_users').select('id, role, module_access');
  if (error) throw new Error(error.message);
  const map: Record<string, { role: string; module_access: Record<string, boolean> }> = {};
  for (const row of data || []) {
    map[String(row.id)] = { role: String(row.role || 'staff'), module_access: (row.module_access as Record<string, boolean>) || {} };
  }
  return map;
}

export async function updateStaffModuleAccess(staffId: string, moduleAccess: Record<string, boolean>) {
  return staffApi('PATCH', { staff_id: staffId, action: 'update_permissions', module_access: moduleAccess });
}

export async function getNextStaffCode() {
  const staff = await getStaff();
  const max = staff.map(item => Number(item.employee_code.match(/\d+$/)?.[0]) || 0).reduce((a, b) => Math.max(a, b), 0);
  return `PMB-${String(max + 1).padStart(3, '0')}`;
}

export async function getStaff(filters: Partial<StaffFilters> = {}) {
  return storage(async () => {
    let query = crmSupabase.from('crm_staff').select('*').order('full_name');
    if (filters.search) { const safe = filters.search.replace(/[(),]/g, ' '); query = query.or(`full_name.ilike.%${safe}%,employee_code.ilike.%${safe}%,mobile.ilike.%${safe}%,job_title.ilike.%${safe}%`); }
    if (filters.department) query = query.eq('department', filters.department);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.employment_type) query = query.eq('employment_type', filters.employment_type);
    const { data, error } = await query; if (error) throw new Error(error.message); return (data || []).map(row => normalizeStaff(row));
  }, () => readLocal<StaffRecord>(STAFF_KEY));
}

// Creating a staff member also creates their CRM login (auth account), which
// requires the service-role key — so this always goes through the API route
// when Supabase is configured, never a direct client insert.
export async function createStaff(data: StaffFormData) {
  return storage(async () => normalizeStaff((await staffApi('POST', data)).staff),
    () => { const now = new Date().toISOString(); const record: StaffRecord = { ...data, id: `staff-${Date.now()}`, user_id: null, created_at: now, updated_at: now }; writeLocal(STAFF_KEY, [...readLocal<StaffRecord>(STAFF_KEY), record]); return record; });
}

export async function updateStaff(id: string, data: StaffFormData) {
  return storage(async () => normalizeStaff((await staffApi('PUT', { staff_id: id, ...data })).staff),
    () => { const rows = readLocal<StaffRecord>(STAFF_KEY); const index = rows.findIndex(item => item.id === id); if (index < 0) throw new Error('Staff member not found.'); rows[index] = { ...rows[index], ...data, updated_at: new Date().toISOString() }; writeLocal(STAFF_KEY, rows); return rows[index]; });
}

export async function deleteStaff(id: string) {
  return storage(async () => { await staffApi('DELETE', { staff_id: id }); },
    () => { writeLocal(STAFF_KEY, readLocal<StaffRecord>(STAFF_KEY).filter(item => item.id !== id)); writeLocal(ATTENDANCE_KEY, readLocal<AttendanceRecord>(ATTENDANCE_KEY).filter(item => item.staff_id !== id)); });
}

function normalizeAttendance(row: Record<string, unknown>): AttendanceRecord {
  return { id: String(row.id || ''), staff_id: String(row.staff_id), attendance_date: String(row.attendance_date), status: row.status as AttendanceRecord['status'], check_in: String(row.check_in || '').slice(0, 5), check_out: String(row.check_out || '').slice(0, 5), break_minutes: Number(row.break_minutes || 0), overtime_minutes: Number(row.overtime_minutes || 0), note: String(row.note || ''), created_at: String(row.created_at || ''), updated_at: String(row.updated_at || ''), staff: row.staff ? normalizeStaff(row.staff as Record<string, unknown>) : undefined };
}

export async function getAttendance(from: string, to = from) {
  return storage(async () => { const { data, error } = await crmSupabase.from('crm_attendance').select('*,staff:crm_staff(*)').gte('attendance_date', from).lte('attendance_date', to).order('attendance_date', { ascending: false }); if (error) throw new Error(error.message); return (data || []).map(row => normalizeAttendance(row)); }, () => readLocal<AttendanceRecord>(ATTENDANCE_KEY).filter(item => item.attendance_date >= from && item.attendance_date <= to));
}

export async function saveAttendance(rows: AttendanceRecord[]) {
  return storage(async () => {
    const payload = rows.map(row => ({ staff_id: row.staff_id, attendance_date: row.attendance_date, status: row.status, check_in: row.check_in || null, check_out: row.check_out || null, break_minutes: row.break_minutes, overtime_minutes: row.overtime_minutes, note: row.note || null, updated_at: new Date().toISOString() }));
    const { data, error } = await crmSupabase.from('crm_attendance').upsert(payload, { onConflict: 'created_by,staff_id,attendance_date' }).select(); if (error) throw new Error(error.message); return (data || []).map(row => normalizeAttendance(row));
  }, () => { const stored = readLocal<AttendanceRecord>(ATTENDANCE_KEY); rows.forEach(row => { const index = stored.findIndex(item => item.staff_id === row.staff_id && item.attendance_date === row.attendance_date); const next = { ...row, id: index >= 0 ? stored[index].id : `attendance-${Date.now()}-${row.staff_id}`, updated_at: new Date().toISOString() }; if (index >= 0) stored[index] = next; else stored.push(next); }); writeLocal(ATTENDANCE_KEY, stored); return rows; });
}
