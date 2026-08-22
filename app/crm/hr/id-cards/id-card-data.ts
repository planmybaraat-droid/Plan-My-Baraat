import { crmSupabase } from '../../lib/supabase-crm';
import type { IdCardBackSnapshot, IdCardFrontSnapshot, IdCardRecord, IdCardSettings, IdCardStatus, StaffRecord } from '../../lib/types';
import { getPrivateCrmFileUrl, logHrAudit } from '../hr-data';
import { addYears, buildBackSnapshot, DEFAULT_ID_CARD_SETTINGS, nextCardNumber } from './id-card-config';

export { getStaff } from '../../staff/staff-data';

function buildLiveFrontSnapshot(staff: StaffRecord): IdCardFrontSnapshot {
  return {
    employee_code: staff.employee_code,
    full_name: staff.full_name,
    designation: staff.job_title || staff.designation || '',
    department: staff.department,
    photo_url: staff.photo_url || null,
    joining_date: staff.joining_date,
  };
}
function normalizeCard(row: Record<string, unknown>): IdCardRecord {
  return {
    id: String(row.id),
    employee_id: String(row.employee_id),
    card_number: String(row.card_number || ''),
    version: Number(row.version || 1),
    status: (row.status as IdCardStatus) || 'Draft',
    front_snapshot: (row.front_snapshot as IdCardFrontSnapshot) || ({} as IdCardFrontSnapshot),
    back_snapshot: (row.back_snapshot as IdCardBackSnapshot) || ({} as IdCardBackSnapshot),
    verification_code: String(row.verification_code || ''),
    pdf_path: row.pdf_path ? String(row.pdf_path) : null,
    issued_date: row.issued_date ? String(row.issued_date) : null,
    expires_on: row.expires_on ? String(row.expires_on) : null,
    generated_at: row.generated_at ? String(row.generated_at) : null,
    generated_by: row.generated_by ? String(row.generated_by) : null,
    created_at: String(row.created_at || ''),
    updated_at: String(row.updated_at || ''),
  };
}

function normalizeSettings(row: Record<string, unknown>): IdCardSettings {
  return {
    card_width_mm: Number(row.card_width_mm ?? DEFAULT_ID_CARD_SETTINGS.card_width_mm),
    card_height_mm: Number(row.card_height_mm ?? DEFAULT_ID_CARD_SETTINGS.card_height_mm),
    bleed_mm: Number(row.bleed_mm ?? DEFAULT_ID_CARD_SETTINGS.bleed_mm),
    safe_margin_mm: Number(row.safe_margin_mm ?? DEFAULT_ID_CARD_SETTINGS.safe_margin_mm),
    sheet_width_mm: Number(row.sheet_width_mm ?? DEFAULT_ID_CARD_SETTINGS.sheet_width_mm),
    sheet_height_mm: Number(row.sheet_height_mm ?? DEFAULT_ID_CARD_SETTINGS.sheet_height_mm),
    sheet_margin_mm: Number(row.sheet_margin_mm ?? DEFAULT_ID_CARD_SETTINGS.sheet_margin_mm),
    horizontal_gap_mm: Number(row.horizontal_gap_mm ?? DEFAULT_ID_CARD_SETTINGS.horizontal_gap_mm),
    vertical_gap_mm: Number(row.vertical_gap_mm ?? DEFAULT_ID_CARD_SETTINGS.vertical_gap_mm),
    duplex_mode: (row.duplex_mode as IdCardSettings['duplex_mode']) || 'long_edge',
    validity_years: Number(row.validity_years ?? DEFAULT_ID_CARD_SETTINGS.validity_years),
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

// ─── Listing ────────────────────────────────────────────────────────────────

export async function listIdCards(): Promise<IdCardRecord[]> {
  const { data, error } = await crmSupabase
    .from('crm_id_cards')
    .select('*, employee:crm_staff(*)')
    .order('employee_id')
    .order('version', { ascending: false });
  if (error) throw new Error(error.message);
  // Keep only the latest version per employee for the dashboard list — full
  // history stays queryable via getCardVersions() for the version timeline.
  const latestByEmployee = new Map<string, Record<string, unknown>>();
  for (const row of data || []) {
    const key = String(row.employee_id);
    if (!latestByEmployee.has(key)) latestByEmployee.set(key, row);
  }
  return Array.from(latestByEmployee.values()).map(row => {
    const card = normalizeCard(row);
    const employeeRow = (row as Record<string, unknown>).employee as Record<string, unknown> | null;
    return { ...card, employee: employeeRow ? normalizeStaffLite(employeeRow) : undefined };
  });
}

function normalizeStaffLite(row: Record<string, unknown>): StaffRecord {
  // Reuses only the fields the ID Cards UI needs — the full normalizer lives
  // in staff-data.ts and is used wherever the Staff module itself renders.
  return {
    id: String(row.id), employee_code: String(row.employee_code || ''), full_name: String(row.full_name || ''),
    mobile: String(row.mobile || ''), email: String(row.email || ''), job_title: String(row.job_title || ''),
    department: String(row.department || ''), employment_type: (row.employment_type as StaffRecord['employment_type']) || 'Full Time',
    joining_date: String(row.joining_date || ''), date_of_birth: String(row.date_of_birth || ''),
    status: (row.status as StaffRecord['status']) || 'Active', work_location: String(row.work_location || ''),
    shift_start: String(row.shift_start || ''), shift_end: String(row.shift_end || ''), address: String(row.address || ''),
    emergency_contact_name: String(row.emergency_contact_name || ''), emergency_contact_mobile: String(row.emergency_contact_mobile || ''),
    notes: String(row.notes || ''), crm_id: String(row.crm_id || ''), role: (row.role as StaffRecord['role']) || 'staff',
    user_id: row.user_id ? String(row.user_id) : null, created_at: String(row.created_at || ''), updated_at: String(row.updated_at || ''),
    photo_url: row.photo_url ? String(row.photo_url) : null, designation: row.designation ? String(row.designation) : null,
    reporting_manager_id: row.reporting_manager_id ? String(row.reporting_manager_id) : null,
    hr_lifecycle_status: (row.hr_lifecycle_status as StaffRecord['hr_lifecycle_status']) || 'Active',
    current_salary: Number(row.current_salary || 0),
  };
}

export async function getCardVersions(employeeId: string): Promise<IdCardRecord[]> {
  const { data, error } = await crmSupabase.from('crm_id_cards').select('*').eq('employee_id', employeeId).order('version', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(normalizeCard);
}

export async function getIdCard(id: string): Promise<IdCardRecord | null> {
  const { data, error } = await crmSupabase.from('crm_id_cards').select('*, employee:crm_staff(*)').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const card = normalizeCard(data);
  const employeeRow = (data as Record<string, unknown>).employee as Record<string, unknown> | null;
  return { ...card, employee: employeeRow ? normalizeStaffLite(employeeRow) : undefined };
}

// Signed URL for a stored card PDF — crm-files is a private bucket, same
// pattern as every other HR document (letters/payslips).
export async function resolveCardFileUrl(card: IdCardRecord): Promise<string | null> {
  if (!card.pdf_path) return null;
  return getPrivateCrmFileUrl(card.pdf_path);
}

// ─── Create / regenerate ────────────────────────────────────────────────────

// A "draft" is just version N+1 for that employee with status Draft — created
// the moment an admin opens the editor for an employee who doesn't have one
// yet, so the live preview always has a real DB-backed row to work with.
export async function getOrCreateDraft(staff: StaffRecord): Promise<IdCardRecord> {
  const refreshDraft = async (draft: IdCardRecord) => {
    const frontSnapshot = buildLiveFrontSnapshot(staff);
    const backSnapshot = buildBackSnapshot(staff);
    const { data, error } = await crmSupabase.from('crm_id_cards').update({
      front_snapshot: frontSnapshot,
      back_snapshot: { ...backSnapshot, blood_group: draft.back_snapshot?.blood_group || '' },
      updated_at: new Date().toISOString(),
    }).eq('id', draft.id).select().single();
    if (error) throw new Error(error.message);
    return { ...normalizeCard(data), employee: staff };
  };

  const versions = await getCardVersions(staff.id);
  const existingDraft = versions.find(version => version.status === 'Draft');
  if (existingDraft) return refreshDraft(existingDraft);

  const { count } = await crmSupabase.from('crm_id_cards').select('id', { count: 'exact', head: true });
  const latestVersion = versions.reduce((max, version) => Math.max(max, Number(version.version || 0)), 0);
  const insertDraft = async (version: number) => crmSupabase.from('crm_id_cards').insert({
    employee_id: staff.id,
    card_number: versions.length ? versions[0].card_number : nextCardNumber(count || 0),
    version,
    status: 'Draft',
    front_snapshot: buildLiveFrontSnapshot(staff),
    back_snapshot: buildBackSnapshot(staff),
  }).select().single();

  let result = await insertDraft(latestVersion + 1);
  if (result.error && result.error.message.toLowerCase().includes('duplicate key')) {
    const freshVersions = await getCardVersions(staff.id);
    const freshDraft = freshVersions.find(version => version.status === 'Draft');
    if (freshDraft) return refreshDraft(freshDraft);
    const freshLatestVersion = freshVersions.reduce((max, version) => Math.max(max, Number(version.version || 0)), 0);
    result = await insertDraft(freshLatestVersion + 1);
  }

  if (result.error) throw new Error(result.error.message);
  return { ...normalizeCard(result.data), employee: staff };
}

// Renders happen client-side (html2canvas + jsPDF, same library the project
// already uses for Letters/Payslips) — this just persists the result: upload
// the PDF to Storage, stamp the row Generated, and log it to the shared HR
// audit trail.
export async function finalizeGeneratedCard(
  card: IdCardRecord,
  staff: StaffRecord,
  pdfBlob: Blob,
  settings: IdCardSettings,
  actorName: string,
): Promise<IdCardRecord> {
  const path = `id-cards/${staff.id}/${card.card_number}-v${card.version}.pdf`;
  const { error: uploadError } = await crmSupabase.storage.from('crm-files').upload(path, pdfBlob, { upsert: true, contentType: 'application/pdf' });
  if (uploadError) throw new Error(uploadError.message);

  const issuedDate = new Date().toISOString().slice(0, 10);
  const expiresOn = addYears(issuedDate, settings.validity_years);
  const { data, error } = await crmSupabase.from('crm_id_cards').update({
    status: 'Generated',
    front_snapshot: buildLiveFrontSnapshot(staff),
    back_snapshot: { ...buildBackSnapshot(staff), blood_group: card.back_snapshot?.blood_group || '' },
    pdf_path: path,
    issued_date: issuedDate,
    expires_on: expiresOn,
    generated_at: new Date().toISOString(),
    generated_by: (await crmSupabase.auth.getUser()).data.user?.id || null,
  }).eq('id', card.id).select().single();
  if (error) throw new Error(error.message);

  await logHrAudit(staff.id, 'ID Card Generated', `${card.card_number} · v${card.version} generated by ${actorName}`, actorName);
  return { ...normalizeCard(data), employee: staff };
}

// Regenerating never overwrites an issued card — it creates a fresh Draft
// version (v2, v3, ...) seeded from the employee's current profile, keeping
// every previously generated version intact for audit/history.
export async function regenerateCard(staff: StaffRecord): Promise<IdCardRecord> {
  const versions = await getCardVersions(staff.id);
  const latest = versions[0];
  const nextVersion = latest ? latest.version + 1 : 1;
  const { data, error } = await crmSupabase.from('crm_id_cards').insert({
    employee_id: staff.id,
    card_number: latest ? latest.card_number : nextCardNumber(versions.length),
    version: nextVersion,
    status: 'Draft',
    front_snapshot: buildLiveFrontSnapshot(staff),
    back_snapshot: buildBackSnapshot(staff),
  }).select().single();
  if (error) throw new Error(error.message);
  return { ...normalizeCard(data), employee: staff };
}

export async function setCardStatus(cardId: string, status: IdCardStatus): Promise<void> {
  const { error } = await crmSupabase.from('crm_id_cards').update({ status }).eq('id', cardId);
  if (error) throw new Error(error.message);
}

// Deletes every stored version of this employee's ID card (the dashboard
// only ever shows the latest version per employee, so "delete" here means
// removing the whole card record for that employee, not just one version).
// Also removes any generated PDFs from Storage so no orphaned files are left
// behind, then logs the removal to the shared HR audit trail. RLS already
// restricts this to CRM admins or a Manager explicitly granted the
// 'idCards' section — same policy that gates create/edit/generate.
export async function deleteIdCard(employeeId: string, actorName: string): Promise<void> {
  const versions = await getCardVersions(employeeId);
  const pdfPaths = versions.map(v => v.pdf_path).filter((p): p is string => Boolean(p));
  if (pdfPaths.length) {
    // Best-effort cleanup — a storage removal failure should never block the
    // record delete the admin actually asked for.
    await crmSupabase.storage.from('crm-files').remove(pdfPaths).catch(() => undefined);
  }

  const { error } = await crmSupabase.from('crm_id_cards').delete().eq('employee_id', employeeId);
  if (error) throw new Error(error.message);

  const label = versions[0]?.card_number ? `${versions[0].card_number} (${versions.length} version${versions.length === 1 ? '' : 's'})` : 'ID card';
  await logHrAudit(employeeId, 'ID Card Deleted', `${label} deleted by ${actorName}`, actorName);
}

// ID-card-specific photo override — stored separately from the staff
// profile photo (profile_photos bucket, its own path prefix) so replacing a
// photo just for the card never touches crm_staff.photo_url unless the admin
// explicitly opts in via updateStaffPhotoToo().
export async function uploadIdCardPhoto(employeeId: string, file: File): Promise<string> {
  const path = `id-card-photos/${employeeId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await crmSupabase.storage.from('profile-photos').upload(path, file, { upsert: false });
  if (uploadError) throw new Error(uploadError.message);
  const { data } = crmSupabase.storage.from('profile-photos').getPublicUrl(path);
  return data.publicUrl;
}

export async function updateStaffPhotoToo(employeeId: string, photoUrl: string): Promise<void> {
  const { error } = await crmSupabase.from('crm_staff').update({ photo_url: photoUrl }).eq('id', employeeId);
  if (error) throw new Error(error.message);
}

// ─── Settings ───────────────────────────────────────────────────────────────

const SETTINGS_ROW_ID = '00000000-0000-0000-0000-000000000001';

export async function getIdCardSettings(): Promise<IdCardSettings> {
  const { data, error } = await crmSupabase.from('crm_id_card_settings').select('*').eq('id', SETTINGS_ROW_ID).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeSettings(data) : DEFAULT_ID_CARD_SETTINGS;
}

export async function updateIdCardSettings(settings: IdCardSettings): Promise<IdCardSettings> {
  const { data, error } = await crmSupabase.from('crm_id_card_settings').update({
    card_width_mm: settings.card_width_mm,
    card_height_mm: settings.card_height_mm,
    bleed_mm: settings.bleed_mm,
    safe_margin_mm: settings.safe_margin_mm,
    sheet_width_mm: settings.sheet_width_mm,
    sheet_height_mm: settings.sheet_height_mm,
    sheet_margin_mm: settings.sheet_margin_mm,
    horizontal_gap_mm: settings.horizontal_gap_mm,
    vertical_gap_mm: settings.vertical_gap_mm,
    duplex_mode: settings.duplex_mode,
    validity_years: settings.validity_years,
    updated_at: new Date().toISOString(),
    updated_by: (await crmSupabase.auth.getUser()).data.user?.id || null,
  }).eq('id', SETTINGS_ROW_ID).select().single();
  if (error) throw new Error(error.message);
  return normalizeSettings(data);
}
