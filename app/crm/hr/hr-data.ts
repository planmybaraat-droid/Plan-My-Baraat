import { CRM_CONFIGURATION_ERROR, crmSupabase, isCrmSupabaseConfigured } from '../lib/supabase-crm';
import type {
  EmployeeDocumentRecord, EmployeeDocumentStatus, EmployeeLetterFormData, EmployeeLetterRecord,
  HrAuditLogEntry, LetterTemplate, LetterType, PayrollFormData, PayrollRecord, PayslipRecord,
  SalaryHistoryEntry, SalaryRecord, StaffRecord,
} from '../lib/types';
import { INTERN_AGREEMENT_TEMPLATE } from './templates/intern-agreement';
import { APPOINTMENT_LETTER_TEMPLATE } from './templates/appointment-letter';

const storage = async <T>(remote: () => Promise<T>, _local: () => T | Promise<T>): Promise<T> =>
  isCrmSupabaseConfigured ? remote() : Promise.reject(new Error(CRM_CONFIGURATION_ERROR));

export async function getPrivateCrmFileUrl(pathOrUrl: string | null | undefined): Promise<string | null> {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const { data, error } = await crmSupabase.storage.from('crm-files').createSignedUrl(pathOrUrl, 3600);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

function readLocal<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(key) || '[]') as T[]; } catch { return []; }
}
function writeLocal<T>(key: string, rows: T[]) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(rows));
}

// ─── Letter templates (read-only reference data, seeded in Supabase) ───────

function normalizeTemplate(row: Record<string, unknown>): LetterTemplate {
  return {
    id: String(row.id),
    letter_type: row.letter_type as LetterType,
    label: String(row.label),
    description: String(row.description),
    icon: String(row.icon),
    category: row.category as LetterTemplate['category'],
    body_template: String(row.body_template),
    extra_fields: (row.extra_fields as LetterTemplate['extra_fields']) || [],
    requires_status: (row.requires_status as LetterTemplate['requires_status']) || null,
    is_active: Boolean(row.is_active),
  };
}

// ─── Offline/demo seed templates (used when Supabase is not configured) ────
// Mirrors what the crm_letter_templates table seeds in production.
const SEED_LETTER_TEMPLATES: LetterTemplate[] = [
  INTERN_AGREEMENT_TEMPLATE,
  APPOINTMENT_LETTER_TEMPLATE,
  {
    id: 'tpl-offer', letter_type: 'offer_letter', label: 'Offer Letter', icon: 'Send',
    description: 'Formal job offer with CTC, designation and joining date.',
    category: 'Onboarding',
    body_template: `Dear {{employee_name}},

We are delighted to offer you the position of **{{designation}}** in the **{{department}}** department at **PlanMyBaraat**.

**Designation:** {{designation}}
**Department:** {{department}}
**Annual CTC:** ₹{{annual_ctc}}
**Joining Date:** {{joining_date}}
**Reporting Location:** Vadodara, Gujarat

This offer is contingent upon the successful completion of background verification. Kindly sign and return a copy of this letter as your acceptance.

We look forward to welcoming you to the team.

Warm regards,
PlanMyBaraat — HR Department`,
    extra_fields: [
      { key: 'annual_ctc', label: 'Annual CTC (₹)', type: 'number' },
    ],
    requires_status: null, is_active: true,
  },
  {
    id: 'tpl-joining', letter_type: 'joining_letter', label: 'Joining Letter', icon: 'LogIn',
    description: 'Confirms the employee has officially joined the organisation.',
    category: 'Onboarding',
    body_template: `Dear {{employee_name}},

We are pleased to confirm that you have officially joined **PlanMyBaraat** as **{{designation}}** in the **{{department}}** department with effect from **{{joining_date}}**.

Your Employee Code is **{{employee_code}}**.

We wish you a successful and rewarding career with us.

Warm regards,
PlanMyBaraat — HR Department`,
    extra_fields: [
      { key: 'employee_code', label: 'Employee Code', type: 'text' },
    ],
    requires_status: null, is_active: true,
  },
  {
    id: 'tpl-internship', letter_type: 'internship_letter', label: 'Internship Offer Letter', icon: 'GraduationCap',
    description: 'Internship appointment letter with stipend and duration.',
    category: 'Onboarding',
    body_template: `Dear {{employee_name}},

We are pleased to offer you an internship with **PlanMyBaraat** as **{{designation}}** in the **{{department}}** department.

**Duration:** {{duration}}
**Stipend:** ₹{{stipend}} per month
**Start Date:** {{joining_date}}

This is a learning engagement. We hope this experience will be valuable to your career development.

Warm regards,
PlanMyBaraat — HR Department`,
    extra_fields: [
      { key: 'duration', label: 'Duration (e.g. 3 months)', type: 'text' },
      { key: 'stipend', label: 'Monthly Stipend (₹)', type: 'number' },
    ],
    requires_status: 'Intern', is_active: true,
  },
  {
    id: 'tpl-experience', letter_type: 'experience_letter', label: 'Experience Letter', icon: 'Award',
    description: 'Issued to departing employees confirming their tenure and role.',
    category: 'Exit',
    body_template: `To Whom It May Concern,

This is to certify that **{{employee_name}}** was employed with **PlanMyBaraat** as **{{designation}}** in the **{{department}}** department from **{{joining_date}}** to **{{last_working_date}}**.

During their tenure, they displayed professionalism, dedication and competence. We wish them success in their future endeavours.

Warm regards,
PlanMyBaraat — HR Department`,
    extra_fields: [
      { key: 'last_working_date', label: 'Last Working Date', type: 'date' },
    ],
    requires_status: 'Ex-Employee', is_active: true,
  },
  {
    id: 'tpl-relieving', letter_type: 'relieving_letter', label: 'Relieving Letter', icon: 'LogOut',
    description: 'Formally relieves the employee from duties on their last working day.',
    category: 'Exit',
    body_template: `Dear {{employee_name}},

This letter is to confirm that you have been formally relieved from your duties as **{{designation}}** in the **{{department}}** department at **PlanMyBaraat**, effective **{{last_working_date}}**.

We wish you the very best in your future endeavours.

Warm regards,
PlanMyBaraat — HR Department`,
    extra_fields: [
      { key: 'last_working_date', label: 'Last Working Date', type: 'date' },
    ],
    requires_status: 'Ex-Employee', is_active: true,
  },
  {
    id: 'tpl-increment', letter_type: 'salary_increment_letter', label: 'Salary Increment Letter', icon: 'TrendingUp',
    description: 'Notifies an employee of a salary revision and its effective date.',
    category: 'Compensation',
    body_template: `Dear {{employee_name}},

We are pleased to inform you that, in recognition of your contributions to **PlanMyBaraat**, your salary has been revised as follows:

**Previous Annual CTC:** ₹{{previous_ctc}}
**Revised Annual CTC:** ₹{{revised_ctc}}
**Effective Date:** {{effective_date}}

Your revised salary will be credited starting from the {{effective_date}} payroll cycle.

Congratulations, and we look forward to your continued contributions.

Warm regards,
PlanMyBaraat — HR Department`,
    extra_fields: [
      { key: 'previous_ctc', label: 'Previous Annual CTC (₹)', type: 'number' },
      { key: 'revised_ctc', label: 'Revised Annual CTC (₹)', type: 'number' },
      { key: 'effective_date', label: 'Effective Date', type: 'date' },
    ],
    requires_status: null, is_active: true,
  },
  {
    id: 'tpl-noc', letter_type: 'noc', label: 'No Objection Certificate (NOC)', icon: 'ShieldCheck',
    description: 'Certifies that the organisation has no objection to a specific request.',
    category: 'Compliance',
    body_template: `To Whom It May Concern,

This is to certify that **{{employee_name}}**, currently employed with **PlanMyBaraat** as **{{designation}}** in the **{{department}}** department, has sought permission for **{{purpose}}**.

PlanMyBaraat has no objection to the above-mentioned purpose. This certificate is issued in good faith and for {{purpose}} only.

Warm regards,
PlanMyBaraat — HR Department`,
    extra_fields: [
      { key: 'purpose', label: 'Purpose of NOC', type: 'textarea' },
    ],
    requires_status: null, is_active: true,
  },
  {
    id: 'tpl-warning', letter_type: 'warning_letter', label: 'Warning Letter', icon: 'AlertTriangle',
    description: 'Official written warning for policy violation or misconduct.',
    category: 'Compliance',
    body_template: `Dear {{employee_name}},

This letter serves as a formal written warning regarding **{{reason}}**.

On {{incident_date}}, it was brought to our notice that you were involved in the above-mentioned incident, which is in violation of company policy.

You are hereby advised to immediately correct this behaviour. Any recurrence may lead to further disciplinary action, including termination.

Kindly acknowledge receipt of this letter by signing below.

Warm regards,
PlanMyBaraat — HR Department`,
    extra_fields: [
      { key: 'reason', label: 'Reason for Warning', type: 'textarea' },
      { key: 'incident_date', label: 'Incident Date', type: 'date' },
    ],
    requires_status: null, is_active: true,
  },
  {
    id: 'tpl-termination', letter_type: 'termination_letter', label: 'Termination Letter', icon: 'Ban',
    description: 'Terminates employment effective immediately or on a specified date.',
    category: 'Exit',
    body_template: `Dear {{employee_name}},

We regret to inform you that your employment with **PlanMyBaraat** as **{{designation}}** is terminated with effect from **{{termination_date}}**.

The reason for this decision is: **{{reason}}**

Please return all company property, access cards and credentials by the termination date. Your full and final settlement will be processed within 30 days.

Warm regards,
PlanMyBaraat — HR Department`,
    extra_fields: [
      { key: 'termination_date', label: 'Termination Date', type: 'date' },
      { key: 'reason', label: 'Reason for Termination', type: 'textarea' },
    ],
    requires_status: 'Terminated', is_active: true,
  },
  {
    id: 'tpl-promotion', letter_type: 'promotion_letter', label: 'Promotion Letter', icon: 'ArrowUpCircle',
    description: 'Congratulates an employee on a promotion with new designation and CTC.',
    category: 'Compensation',
    body_template: `Dear {{employee_name}},

We are pleased to inform you that you have been promoted to the position of **{{new_designation}}** in the **{{department}}** department, effective **{{effective_date}}**.

**New Annual CTC:** ₹{{new_ctc}}

This promotion recognises your hard work, dedication and the value you bring to PlanMyBaraat. Congratulations!

Warm regards,
PlanMyBaraat — HR Department`,
    extra_fields: [
      { key: 'new_designation', label: 'New Designation', type: 'text' },
      { key: 'new_ctc', label: 'New Annual CTC (₹)', type: 'number' },
      { key: 'effective_date', label: 'Effective Date', type: 'date' },
    ],
    requires_status: null, is_active: true,
  },
  {
    id: 'tpl-resignation-acceptance', letter_type: 'resignation_acceptance_letter', label: 'Resignation Acceptance', icon: 'CheckCircle2',
    description: 'Acknowledges and accepts an employee\'s resignation.',
    category: 'Exit',
    body_template: `Dear {{employee_name}},

We acknowledge receipt of your resignation letter dated **{{resignation_date}}**, from the position of **{{designation}}** in the **{{department}}** department.

Your resignation is accepted, and your last working day will be **{{last_working_date}}**.

We thank you for your contributions to PlanMyBaraat and wish you the very best in your future endeavours.

Warm regards,
PlanMyBaraat — HR Department`,
    extra_fields: [
      { key: 'resignation_date', label: 'Resignation Date', type: 'date' },
      { key: 'last_working_date', label: 'Last Working Date', type: 'date' },
    ],
    requires_status: 'Notice Period', is_active: true,
  },
];

export async function getLetterTemplates(): Promise<LetterTemplate[]> {
  return storage(
    async () => {
      const { data, error } = await crmSupabase.from('crm_letter_templates').select('*').eq('is_active', true).order('category');
      if (error) throw new Error(error.message);
      const templates = (data || []).map(normalizeTemplate);
      if (!templates.some(template => template.letter_type === INTERN_AGREEMENT_TEMPLATE.letter_type)) {
        templates.push(INTERN_AGREEMENT_TEMPLATE);
      }
      if (!templates.some(template => template.letter_type === APPOINTMENT_LETTER_TEMPLATE.letter_type)) {
        templates.push(APPOINTMENT_LETTER_TEMPLATE);
      }
      return templates;
    },
    () => SEED_LETTER_TEMPLATES,
  );
}

export async function getLetterTemplate(letterType: LetterType): Promise<LetterTemplate | null> {
  return storage(
    async () => {
      const { data, error } = await crmSupabase.from('crm_letter_templates').select('*').eq('letter_type', letterType).maybeSingle();
      if (error) throw new Error(error.message);
      return data ? normalizeTemplate(data) : SEED_LETTER_TEMPLATES.find(t => t.letter_type === letterType) ?? null;
    },
    () => SEED_LETTER_TEMPLATES.find(t => t.letter_type === letterType) ?? null,
  );
}

// ─── Employee letters ────────────────────────────────────────────────────────

const LETTERS_KEY = 'crm_hr_letters_v1';

function normalizeLetter(row: Record<string, unknown>): EmployeeLetterRecord {
  return {
    id: String(row.id),
    letter_number: String(row.letter_number),
    employee_id: String(row.employee_id),
    letter_type: row.letter_type as LetterType,
    extra_fields: (row.extra_fields as Record<string, string | number>) || {},
    rendered_text: String(row.rendered_text || ''),
    status: (row.status as EmployeeLetterRecord['status']) || 'Generated',
    file_url: row.file_url ? String(row.file_url) : null,
    generated_by_name: String(row.generated_by_name || ''),
    verification_code: String(row.verification_code || ''),
    generated_by: row.generated_by ? String(row.generated_by) : null,
    created_at: String(row.created_at || ''),
    updated_at: String(row.updated_at || ''),
    employee: row.employee ? normalizeStaffRow(row.employee as Record<string, unknown>) : undefined,
  };
}

// Small local mirror of staff-data.ts's normalizeStaff, only used when a
// letter/payroll query joins crm_staff — keeps this file self-contained.
function normalizeStaffRow(row: Record<string, unknown>): StaffRecord {
  return {
    id: String(row.id), employee_code: String(row.employee_code || ''), full_name: String(row.full_name || ''),
    mobile: String(row.mobile || ''), email: String(row.email || ''), job_title: String(row.job_title || ''),
    department: String(row.department || ''), employment_type: row.employment_type as StaffRecord['employment_type'],
    joining_date: String(row.joining_date || ''), date_of_birth: String(row.date_of_birth || ''),
    status: row.status as StaffRecord['status'], work_location: String(row.work_location || ''),
    shift_start: String(row.shift_start || '').slice(0, 5), shift_end: String(row.shift_end || '').slice(0, 5),
    address: String(row.address || ''), emergency_contact_name: String(row.emergency_contact_name || ''),
    emergency_contact_mobile: String(row.emergency_contact_mobile || ''), notes: String(row.notes || ''),
    crm_id: String(row.crm_id || ''), role: (row.role as StaffRecord['role']) || 'staff',
    user_id: row.user_id ? String(row.user_id) : null, created_at: String(row.created_at || ''), updated_at: String(row.updated_at || ''),
    photo_url: row.photo_url ? String(row.photo_url) : null, designation: row.designation ? String(row.designation) : null,
    reporting_manager_id: row.reporting_manager_id ? String(row.reporting_manager_id) : null,
    hr_lifecycle_status: (row.hr_lifecycle_status as StaffRecord['hr_lifecycle_status']) || 'Active',
    current_salary: Number(row.current_salary || 0),
  };
}

export async function getNextLetterNumber(): Promise<string> {
  return storage(
    async () => {
      const { data, error } = await crmSupabase.rpc('crm_next_letter_number');
      if (error) throw new Error(error.message);
      return data as string;
    },
    () => {
      const year = new Date().getFullYear();
      const letters = readLocal<EmployeeLetterRecord>(LETTERS_KEY);
      const max = letters.map(l => Number(l.letter_number.split('-').pop()) || 0).reduce((a, b) => Math.max(a, b), 0);
      return `PMB-HRL-${year}-${String(max + 1).padStart(4, '0')}`;
    },
  );
}

export async function getEmployeeLetters(employeeId?: string): Promise<EmployeeLetterRecord[]> {
  return storage(async () => {
    let query = crmSupabase.from('crm_employee_letters').select('*, employee:crm_staff(*)').order('created_at', { ascending: false });
    if (employeeId) query = query.eq('employee_id', employeeId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return Promise.all((data || []).map(async row => {
      const letter = normalizeLetter(row);
      return { ...letter, file_url: await getPrivateCrmFileUrl(letter.file_url) };
    }));
  }, () => {
    const rows = readLocal<EmployeeLetterRecord>(LETTERS_KEY);
    return employeeId ? rows.filter(row => row.employee_id === employeeId) : rows;
  });
}

export async function getEmployeeLetterById(id: string): Promise<EmployeeLetterRecord | null> {
  return storage(async () => {
    const { data, error } = await crmSupabase.from('crm_employee_letters').select('*, employee:crm_staff(*)').eq('id', id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const letter = normalizeLetter(data);
    return { ...letter, file_url: await getPrivateCrmFileUrl(letter.file_url) };
  }, () => readLocal<EmployeeLetterRecord>(LETTERS_KEY).find(row => row.id === id) ?? null);
}

// Retries on a unique-constraint collision the same way agreements/quotations
// do, since the letter number is allocated up front, not by a DB default.
export async function createEmployeeLetter(payload: EmployeeLetterFormData, generatedByName: string): Promise<EmployeeLetterRecord> {
  return storage(async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const letterNumber = await getNextLetterNumber();
      const { data, error } = await crmSupabase.from('crm_employee_letters').insert({
        letter_number: letterNumber,
        employee_id: payload.employee_id,
        letter_type: payload.letter_type,
        extra_fields: payload.extra_fields,
        rendered_text: payload.rendered_text,
        status: payload.status,
        generated_by_name: generatedByName,
      }).select('*, employee:crm_staff(*)').single();
      if (!error) return normalizeLetter(data);
      if (error.code !== '23505') throw new Error(error.message);
    }
    throw new Error('Unable to allocate a unique letter number. Please try again.');
  }, () => {
    const now = new Date().toISOString();
    const record: EmployeeLetterRecord = {
      ...payload,
      id: `letter-${Date.now()}`,
      letter_number: `PMB-HRL-${new Date().getFullYear()}-${String(readLocal<EmployeeLetterRecord>(LETTERS_KEY).length + 1).padStart(4, '0')}`,
      verification_code: crypto.randomUUID().replace(/-/g, '').slice(0, 16),
      generated_by: null,
      generated_by_name: generatedByName,
      created_at: now,
      updated_at: now,
    };
    writeLocal(LETTERS_KEY, [record, ...readLocal<EmployeeLetterRecord>(LETTERS_KEY)]);
    return record;
  });
}

export async function updateEmployeeLetter(id: string, fields: { extra_fields: Record<string, string | number>; rendered_text: string }): Promise<EmployeeLetterRecord> {
  return storage(async () => {
    const { data, error } = await crmSupabase.from('crm_employee_letters').update({
      extra_fields: fields.extra_fields, rendered_text: fields.rendered_text, updated_at: new Date().toISOString(),
    }).eq('id', id).select('*, employee:crm_staff(*)').single();
    if (error) throw new Error(error.message);
    return normalizeLetter(data);
  }, () => {
    const rows = readLocal<EmployeeLetterRecord>(LETTERS_KEY);
    const index = rows.findIndex(row => row.id === id);
    if (index < 0) throw new Error('Letter not found.');
    rows[index] = { ...rows[index], extra_fields: fields.extra_fields, rendered_text: fields.rendered_text, updated_at: new Date().toISOString() };
    writeLocal(LETTERS_KEY, rows);
    return rows[index];
  });
}

export async function updateEmployeeLetterFile(id: string, fileUrl: string): Promise<void> {
  await storage(async () => {
    const { error } = await crmSupabase.from('crm_employee_letters').update({ file_url: fileUrl, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw new Error(error.message);
  }, () => {
    const rows = readLocal<EmployeeLetterRecord>(LETTERS_KEY);
    const index = rows.findIndex(row => row.id === id);
    if (index >= 0) { rows[index] = { ...rows[index], file_url: fileUrl }; writeLocal(LETTERS_KEY, rows); }
  });
}

export async function setEmployeeLetterStatus(id: string, status: EmployeeLetterRecord['status']): Promise<void> {
  await storage(async () => {
    const { error } = await crmSupabase.from('crm_employee_letters').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw new Error(error.message);
  }, () => {
    const rows = readLocal<EmployeeLetterRecord>(LETTERS_KEY);
    const index = rows.findIndex(row => row.id === id);
    if (index >= 0) { rows[index] = { ...rows[index], status }; writeLocal(LETTERS_KEY, rows); }
  });
}

export async function deleteEmployeeLetter(id: string): Promise<void> {
  await storage(async () => {
    const { error } = await crmSupabase.from('crm_employee_letters').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }, () => writeLocal(LETTERS_KEY, readLocal<EmployeeLetterRecord>(LETTERS_KEY).filter(row => row.id !== id)));
}

// ─── KYC & employee documents ────────────────────────────────────────────────

const DOCS_KEY = 'crm_hr_documents_v1';

function normalizeDocument(row: Record<string, unknown>): EmployeeDocumentRecord {
  return {
    id: String(row.id), employee_id: String(row.employee_id), category: String(row.category),
    file_name: String(row.file_name), file_url: String(row.file_url), file_type: row.file_type ? String(row.file_type) : null,
    file_size: row.file_size ? Number(row.file_size) : null, status: (row.status as EmployeeDocumentStatus) || 'Pending',
    verified_by: row.verified_by ? String(row.verified_by) : null, verified_by_name: row.verified_by_name ? String(row.verified_by_name) : null,
    verified_at: row.verified_at ? String(row.verified_at) : null, remarks: String(row.remarks || ''),
    created_at: String(row.created_at || ''), updated_at: String(row.updated_at || ''),
  };
}

export async function getEmployeeDocuments(employeeId: string): Promise<EmployeeDocumentRecord[]> {
  return storage(async () => {
    const { data, error } = await crmSupabase.from('crm_employee_documents').select('*').eq('employee_id', employeeId).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return Promise.all((data || []).map(async row => {
      const document = normalizeDocument(row);
      return { ...document, file_url: (await getPrivateCrmFileUrl(document.file_url)) || document.file_url };
    }));
  }, () => readLocal<EmployeeDocumentRecord>(DOCS_KEY).filter(row => row.employee_id === employeeId));
}

export async function uploadEmployeeDocument(employeeId: string, category: string, file: File): Promise<EmployeeDocumentRecord> {
  return storage(async () => {
    const path = `employee-documents/${employeeId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await crmSupabase.storage.from('crm-files').upload(path, file, { upsert: false });
    if (uploadError) throw new Error(uploadError.message);
    const { data, error } = await crmSupabase.from('crm_employee_documents').insert({
      employee_id: employeeId, category, file_name: file.name, file_url: path,
      file_type: file.type || null, file_size: file.size,
    }).select().single();
    if (error) throw new Error(error.message);
    const document = normalizeDocument(data);
    return { ...document, file_url: (await getPrivateCrmFileUrl(path)) || path };
  }, () => {
    const now = new Date().toISOString();
    const record: EmployeeDocumentRecord = {
      id: `doc-${Date.now()}`, employee_id: employeeId, category, file_name: file.name,
      file_url: 'https://images.unsplash.com/photo-1568219656418-15c329312bf1?w=500&q=80',
      file_type: file.type || null, file_size: file.size, status: 'Pending',
      verified_by: null, verified_by_name: null, verified_at: null, remarks: '', created_at: now, updated_at: now,
    };
    writeLocal(DOCS_KEY, [record, ...readLocal<EmployeeDocumentRecord>(DOCS_KEY)]);
    return record;
  });
}

export async function verifyEmployeeDocument(id: string, status: EmployeeDocumentStatus, remarks: string, verifierName: string): Promise<EmployeeDocumentRecord> {
  return storage(async () => {
    const { data, error } = await crmSupabase.from('crm_employee_documents').update({
      status, remarks, verified_by_name: verifierName, verified_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return normalizeDocument(data);
  }, () => {
    const rows = readLocal<EmployeeDocumentRecord>(DOCS_KEY);
    const index = rows.findIndex(row => row.id === id);
    if (index < 0) throw new Error('Document not found.');
    rows[index] = { ...rows[index], status, remarks, verified_by_name: verifierName, verified_at: new Date().toISOString() };
    writeLocal(DOCS_KEY, rows);
    return rows[index];
  });
}

export async function deleteEmployeeDocument(id: string, _fileUrl: string): Promise<void> {
  await storage(async () => {
    try {
      const { data } = await crmSupabase.from('crm_employee_documents').select('file_url').eq('id', id).maybeSingle();
      if (data?.file_url && !/^https?:\/\//i.test(data.file_url)) await crmSupabase.storage.from('crm-files').remove([data.file_url]);
    } catch { /* best-effort storage cleanup */ }
    const { error } = await crmSupabase.from('crm_employee_documents').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }, () => writeLocal(DOCS_KEY, readLocal<EmployeeDocumentRecord>(DOCS_KEY).filter(row => row.id !== id)));
}

// ─── Employee photo (public profile image; documents remain private) ───────

export async function updateEmployeeHrFields(employeeId: string, fields: { designation?: string; reporting_manager_id?: string | null }): Promise<void> {
  const { error } = await crmSupabase.from('crm_staff').update({ ...fields, updated_at: new Date().toISOString() }).eq('id', employeeId);
  if (error) throw new Error(error.message);
}

export async function uploadEmployeePhoto(employeeId: string, file: File): Promise<string> {
  const path = `employee-photos/${employeeId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await crmSupabase.storage.from('profile-photos').upload(path, file, { upsert: false });
  if (uploadError) throw new Error(uploadError.message);
  const { data: { publicUrl } } = crmSupabase.storage.from('profile-photos').getPublicUrl(path);
  const { error } = await crmSupabase.from('crm_staff').update({ photo_url: publicUrl }).eq('id', employeeId);
  if (error) throw new Error(error.message);
  return publicUrl;
}

// ─── Salary records & history ────────────────────────────────────────────────

function normalizeSalary(row: Record<string, unknown>): SalaryRecord {
  return {
    id: String(row.id), employee_id: String(row.employee_id),
    basic_salary: Number(row.basic_salary || 0), hra: Number(row.hra || 0), special_allowance: Number(row.special_allowance || 0),
    travel_allowance: Number(row.travel_allowance || 0), bonus: Number(row.bonus || 0), incentive: Number(row.incentive || 0),
    pf: Number(row.pf || 0), esic: Number(row.esic || 0), professional_tax: Number(row.professional_tax || 0),
    other_deduction: Number(row.other_deduction || 0), gross_salary: Number(row.gross_salary || 0), net_salary: Number(row.net_salary || 0),
    effective_date: String(row.effective_date || ''), status: (row.status as SalaryRecord['status']) || 'Active',
    created_at: String(row.created_at || ''), updated_at: String(row.updated_at || ''),
  };
}

export async function getSalaryRecord(employeeId: string): Promise<SalaryRecord | null> {
  const { data, error } = await crmSupabase.from('crm_salary_records').select('*').eq('employee_id', employeeId).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeSalary(data) : null;
}

export async function upsertSalaryRecord(employeeId: string, fields: Omit<SalaryRecord, 'id' | 'employee_id' | 'created_at' | 'updated_at'>): Promise<SalaryRecord> {
  const { data, error } = await crmSupabase.from('crm_salary_records').upsert({
    employee_id: employeeId, ...fields, updated_at: new Date().toISOString(),
  }, { onConflict: 'employee_id' }).select().single();
  if (error) throw new Error(error.message);
  const { error: staffError } = await crmSupabase.from('crm_staff').update({
    current_salary: Math.round(fields.gross_salary * 12 * 100) / 100,
  }).eq('id', employeeId);
  void staffError; // best-effort mirror; salary_records remains the source of truth
  return normalizeSalary(data);
}

export async function getAllSalaryRecords(): Promise<SalaryRecord[]> {
  const { data, error } = await crmSupabase.from('crm_salary_records').select('*');
  if (error) throw new Error(error.message);
  return (data || []).map(normalizeSalary);
}

function normalizeSalaryHistory(row: Record<string, unknown>): SalaryHistoryEntry {
  return {
    id: String(row.id), employee_id: String(row.employee_id), event_type: row.event_type as SalaryHistoryEntry['event_type'],
    previous_salary: Number(row.previous_salary || 0), new_salary: Number(row.new_salary || 0),
    effective_date: String(row.effective_date || ''), reason: row.reason ? String(row.reason) : null,
    source_letter_id: row.source_letter_id ? String(row.source_letter_id) : null, created_at: String(row.created_at || ''),
  };
}

export async function getSalaryHistory(employeeId: string): Promise<SalaryHistoryEntry[]> {
  const { data, error } = await crmSupabase.from('crm_salary_history').select('*').eq('employee_id', employeeId).order('effective_date', { ascending: true });
  if (error) throw new Error(error.message);
  return (data || []).map(normalizeSalaryHistory);
}

// ─── Payroll & payslips ───────────────────────────────────────────────────────

function normalizePayroll(row: Record<string, unknown>): PayrollRecord {
  return {
    id: String(row.id), employee_id: String(row.employee_id), month: Number(row.month), year: Number(row.year),
    basic_salary: Number(row.basic_salary || 0), hra: Number(row.hra || 0), special_allowance: Number(row.special_allowance || 0),
    travel_allowance: Number(row.travel_allowance || 0), bonus: Number(row.bonus || 0), incentive: Number(row.incentive || 0),
    gross_salary: Number(row.gross_salary || 0), pf: Number(row.pf || 0), esic: Number(row.esic || 0),
    professional_tax: Number(row.professional_tax || 0), other_deduction: Number(row.other_deduction || 0), net_salary: Number(row.net_salary || 0),
    status: (row.status as PayrollRecord['status']) || 'Pending', paid_on: row.paid_on ? String(row.paid_on) : null,
    payment_reference: row.payment_reference ? String(row.payment_reference) : null, created_by: row.created_by ? String(row.created_by) : null,
    created_at: String(row.created_at || ''), updated_at: String(row.updated_at || ''),
    employee: row.employee ? normalizeStaffRow(row.employee as Record<string, unknown>) : undefined,
    payslip: row.payslip ? normalizePayslip(Array.isArray(row.payslip) ? row.payslip[0] : row.payslip as Record<string, unknown>) : null,
  };
}

function normalizePayslip(row: Record<string, unknown>): PayslipRecord {
  return {
    id: String(row.id), payroll_id: String(row.payroll_id), payslip_number: String(row.payslip_number),
    file_url: row.file_url ? String(row.file_url) : null, verification_code: String(row.verification_code || ''),
    generated_at: String(row.generated_at || ''), created_at: String(row.created_at || ''),
  };
}

async function withSignedPayslip(record: PayrollRecord): Promise<PayrollRecord> {
  if (!record.payslip?.file_url) return record;
  return { ...record, payslip: { ...record.payslip, file_url: await getPrivateCrmFileUrl(record.payslip.file_url) } };
}

export async function getPayroll(filters: { employeeId?: string; month?: number; year?: number } = {}): Promise<PayrollRecord[]> {
  let query = crmSupabase.from('crm_payroll').select('*, employee:crm_staff(*), payslip:crm_payslips(*)').order('year', { ascending: false }).order('month', { ascending: false });
  if (filters.employeeId) query = query.eq('employee_id', filters.employeeId);
  if (filters.month) query = query.eq('month', filters.month);
  if (filters.year) query = query.eq('year', filters.year);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return Promise.all((data || []).map(row => withSignedPayslip(normalizePayroll(row))));
}

export async function upsertPayroll(payload: PayrollFormData): Promise<PayrollRecord> {
  const { data, error } = await crmSupabase.from('crm_payroll').upsert({
    employee_id: payload.employee_id, month: payload.month, year: payload.year,
    basic_salary: payload.basic_salary, hra: payload.hra, special_allowance: payload.special_allowance,
    travel_allowance: payload.travel_allowance, bonus: payload.bonus, incentive: payload.incentive,
    gross_salary: payload.gross_salary, pf: payload.pf, esic: payload.esic, professional_tax: payload.professional_tax,
    other_deduction: payload.other_deduction, net_salary: payload.net_salary, status: payload.status,
    paid_on: payload.paid_on || null, payment_reference: payload.payment_reference || null, updated_at: new Date().toISOString(),
  }, { onConflict: 'employee_id,month,year' }).select('*, employee:crm_staff(*), payslip:crm_payslips(*)').single();
  if (error) throw new Error(error.message);
  return withSignedPayslip(normalizePayroll(data));
}

export async function updatePayrollStatus(id: string, status: PayrollRecord['status'], paidOn?: string, paymentReference?: string): Promise<PayrollRecord> {
  const { data, error } = await crmSupabase.from('crm_payroll').update({
    status, paid_on: status === 'Paid' ? (paidOn || new Date().toISOString().slice(0, 10)) : null,
    payment_reference: paymentReference || null, updated_at: new Date().toISOString(),
  }).eq('id', id).select('*, employee:crm_staff(*), payslip:crm_payslips(*)').single();
  if (error) throw new Error(error.message);
  return withSignedPayslip(normalizePayroll(data));
}

export async function getNextPayslipNumber(): Promise<string> {
  const { data, error } = await crmSupabase.rpc('crm_next_payslip_number');
  if (error) throw new Error(error.message);
  return data as string;
}

export async function generatePayslip(payrollId: string): Promise<PayslipRecord> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const payslipNumber = await getNextPayslipNumber();
    const { data, error } = await crmSupabase.from('crm_payslips').insert({ payroll_id: payrollId, payslip_number: payslipNumber }).select().single();
    if (!error) return normalizePayslip(data);
    if (error.code !== '23505') throw new Error(error.message);
  }
  throw new Error('Unable to allocate a unique payslip number. Please try again.');
}

export async function updatePayslipFile(id: string, fileUrl: string): Promise<void> {
  const { error } = await crmSupabase.from('crm_payslips').update({ file_url: fileUrl }).eq('id', id);
  if (error) throw new Error(error.message);
}

// ─── HR audit log ─────────────────────────────────────────────────────────────

export async function getHrAuditLogs(employeeId: string): Promise<HrAuditLogEntry[]> {
  const { data, error } = await crmSupabase.from('crm_hr_audit_logs').select('*').eq('employee_id', employeeId).order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(row => ({
    id: String(row.id), employee_id: row.employee_id ? String(row.employee_id) : null, action: String(row.action),
    detail: row.detail ? String(row.detail) : null, actor: row.actor ? String(row.actor) : null,
    actor_name: row.actor_name ? String(row.actor_name) : null, created_at: String(row.created_at || ''),
  }));
}
