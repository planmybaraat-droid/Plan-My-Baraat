import { crmSupabase } from '../../crm/lib/supabase-crm';
import type { EmployeeLetterRecord, LetterTemplate, LetterType, StaffRecord } from '../../crm/lib/types';

function normalizeStaff(row: Record<string, unknown>): StaffRecord {
  return {
    id: String(row.id), employee_code: String(row.employee_code || row.crm_id || ''), full_name: String(row.full_name || ''), mobile: String(row.mobile || ''),
    email: String(row.email || ''), job_title: String(row.job_title || ''), department: String(row.department || ''),
    employment_type: row.employment_type as StaffRecord['employment_type'], joining_date: String(row.joining_date || ''),
    date_of_birth: String(row.date_of_birth || ''), status: row.status as StaffRecord['status'],
    work_location: String(row.work_location || ''), shift_start: String(row.shift_start || '').slice(0, 5),
    shift_end: String(row.shift_end || '').slice(0, 5), address: String(row.address || ''),
    emergency_contact_name: String(row.emergency_contact_name || ''), emergency_contact_mobile: String(row.emergency_contact_mobile || ''),
    notes: String(row.notes || ''), crm_id: String(row.crm_id || ''), role: (row.role as StaffRecord['role']) || 'staff',
    user_id: row.user_id ? String(row.user_id) : null, created_at: String(row.created_at || ''),
    updated_at: String(row.updated_at || ''), photo_url: row.photo_url ? String(row.photo_url) : null,
    designation: row.designation ? String(row.designation) : null,
    reporting_manager_id: row.reporting_manager_id ? String(row.reporting_manager_id) : null,
    hr_lifecycle_status: (row.hr_lifecycle_status as StaffRecord['hr_lifecycle_status']) || 'Active',
    current_salary: Number(row.current_salary || 0),
  };
}

function normalizeLetter(row: Record<string, unknown>, employee: StaffRecord): EmployeeLetterRecord {
  const extraFields = (row.extra_fields as Record<string, string | number>) || {};
  const canonicalType = extraFields.__canonical_letter_type;
  return {
    id: String(row.id), letter_number: String(row.letter_number), employee_id: String(row.employee_id),
    letter_type: (typeof canonicalType === 'string' ? canonicalType : row.letter_type) as LetterType,
    extra_fields: extraFields,
    rendered_text: String(row.rendered_text || ''), status: row.status as EmployeeLetterRecord['status'],
    file_url: row.file_url ? String(row.file_url) : null, verification_code: String(row.verification_code || ''),
    generated_by: row.generated_by ? String(row.generated_by) : null,
    generated_by_name: String(row.generated_by_name || ''), created_at: String(row.created_at || ''),
    updated_at: String(row.updated_at || ''), employee,
  };
}

function normalizeTemplate(row: Record<string, unknown>): LetterTemplate {
  return {
    id: String(row.id), letter_type: row.letter_type as LetterType, label: String(row.label || 'Letter'),
    description: String(row.description || ''), icon: String(row.icon || 'FileText'),
    category: row.category as LetterTemplate['category'], body_template: String(row.body_template || ''),
    extra_fields: (row.extra_fields as LetterTemplate['extra_fields']) || [],
    requires_status: (row.requires_status as LetterTemplate['requires_status']) || null,
    is_active: Boolean(row.is_active),
  };
}

async function getOwnStaff(): Promise<StaffRecord> {
  const { data: { user }, error: userError } = await crmSupabase.auth.getUser();
  if (userError || !user) throw new Error('Your staff session has expired. Please sign in again.');
  const { data, error } = await crmSupabase.from('crm_staff').select('*').eq('user_id', user.id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('No staff profile is linked to this account.');
  return normalizeStaff(data as Record<string, unknown>);
}

async function signLetterFile(pathOrUrl: string | null | undefined) {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const { data, error } = await crmSupabase.storage.from('crm-files').createSignedUrl(pathOrUrl, 3600);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function getMyLetters(): Promise<EmployeeLetterRecord[]> {
  const employee = await getOwnStaff();
  const { data, error } = await crmSupabase
    .from('crm_employee_letters')
    .select('*')
    .eq('employee_id', employee.id)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return Promise.all((data || []).map(async (row) => {
    const letter = normalizeLetter(row as Record<string, unknown>, employee);
    return { ...letter, file_url: await signLetterFile(letter.file_url) };
  }));
}

export async function getMyLetter(id: string): Promise<{ letter: EmployeeLetterRecord; template: LetterTemplate } | null> {
  const employee = await getOwnStaff();
  const { data: row, error } = await crmSupabase
    .from('crm_employee_letters')
    .select('*')
    .eq('id', id)
    .eq('employee_id', employee.id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!row) return null;
  const letter = normalizeLetter(row as Record<string, unknown>, employee);
  const { data: templateRow, error: templateError } = await crmSupabase
    .from('crm_letter_templates')
    .select('*')
    .eq('letter_type', letter.letter_type)
    .maybeSingle();
  if (templateError) throw new Error(templateError.message);
  if (!templateRow) throw new Error('The letter template is unavailable.');
  return {
    letter: { ...letter, file_url: await signLetterFile(letter.file_url) },
    template: normalizeTemplate(templateRow as Record<string, unknown>),
  };
}
