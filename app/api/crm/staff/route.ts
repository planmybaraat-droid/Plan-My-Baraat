import { NextRequest, NextResponse } from 'next/server';
import { requireCrmAdmin } from '@/app/crm/lib/apiAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/app/crm/lib/supabase-admin';
import type { StaffFormData } from '@/app/crm/lib/types';
import { MODULE_KEYS, defaultModuleAccess } from '@/lib/modulePermissions';
import { CRM_SECTION_KEYS, defaultSectionAccess } from '@/lib/crmSectionPermissions';

const STAFF_ROLES = new Set(['admin', 'super_admin', 'staff', 'sales', 'manager', 'vendor', 'accountant']);
const STAFF_STATUSES = new Set(['Active', 'On Leave', 'Inactive']);
const EMPLOYMENT_TYPES = new Set(['Full Time', 'Part Time', 'Contract', 'Intern']);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readObject(req: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const value: unknown = await req.json();
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function validateStaffBody(body: Record<string, unknown>, requirePassword: boolean): string | null {
  const required = ['employee_code', 'full_name', 'mobile', 'job_title', 'department', 'joining_date', 'shift_start', 'shift_end'];
  for (const field of required) {
    if (typeof body[field] !== 'string' || !body[field]?.toString().trim()) return `${field.replaceAll('_', ' ')} is required.`;
  }
  if (typeof body.email !== 'string' || !EMAIL_PATTERN.test(body.email.trim())) return 'A valid email address is required.';
  if (typeof body.role !== 'string' || !STAFF_ROLES.has(body.role)) return 'Invalid CRM role.';
  if (typeof body.status !== 'string' || !STAFF_STATUSES.has(body.status)) return 'Invalid staff status.';
  if (typeof body.employment_type !== 'string' || !EMPLOYMENT_TYPES.has(body.employment_type)) return 'Invalid employment type.';
  if (requirePassword && (typeof body.password !== 'string' || body.password.length < 8)) return 'Password must be at least 8 characters.';
  return null;
}

function staffColumns(data: StaffFormData) {
  return {
    employee_code: data.employee_code,
    full_name: data.full_name,
    mobile: data.mobile,
    email: data.email || null,
    job_title: data.job_title,
    department: data.department,
    employment_type: data.employment_type,
    joining_date: data.joining_date,
    date_of_birth: data.date_of_birth || null,
    blood_group: data.blood_group || null,
    status: data.status,
    work_location: data.work_location || null,
    shift_start: data.shift_start,
    shift_end: data.shift_end,
    address: data.address || null,
    emergency_contact_name: data.emergency_contact_name || null,
    emergency_contact_mobile: data.emergency_contact_mobile || null,
    notes: data.notes || null,
    crm_id: data.crm_id || null,
  };
}

// Create a staff member: auth account + crm_users role row + crm_staff profile.
export async function POST(req: NextRequest) {
  const gate = await requireCrmAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not set on the server.' }, { status: 500 });
  }

  const rawBody = await readObject(req);
  if (!rawBody) return NextResponse.json({ error: 'A valid JSON object is required.' }, { status: 400 });
  const validationError = validateStaffBody(rawBody, true);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
  const body = rawBody as unknown as StaffFormData;

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true,
    user_metadata: { name: body.full_name },
  });
  if (createError || !created.user) {
    return NextResponse.json({ error: createError?.message || 'Could not create the login.' }, { status: 400 });
  }
  const userId = created.user.id;

  // The DB trigger auto-inserts a default crm_users row on auth.users insert;
  // update it with the real name/role chosen in this form.
  // New staff accounts start with every module disabled — an Admin must
  // explicitly grant access via Staff Management -> Manage Access. Admin and
  // Super Admin roles bypass the module map entirely, so it's left empty for
  // them (not meaningful either way).
  const isAdminRole = body.role === 'admin' || body.role === 'super_admin';
  const { error: roleError } = await supabaseAdmin
    .from('crm_users')
    .update({
      full_name: body.full_name,
      role: body.role,
      module_access: isAdminRole ? {} : defaultModuleAccess(),
      // Manager accounts start with every CRM section hidden too — Admin
      // grants sections individually via Staff Management -> Manage Access.
      crm_section_access: isAdminRole ? {} : defaultSectionAccess(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
  if (roleError) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: roleError.message }, { status: 400 });
  }

  const { data: staffRow, error: staffError } = await supabaseAdmin
    .from('crm_staff')
    .insert({ ...staffColumns(body), user_id: userId, created_by: gate.user.id })
    .select()
    .single();
  if (staffError) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: staffError.message }, { status: 400 });
  }

  return NextResponse.json({ staff: staffRow });
}

// Update an existing staff member's profile fields (and role, if changed).
// Routed through the service-role client so this always works regardless of
// which admin originally created the row (crm_staff's own RLS is creator-only).
export async function PUT(req: NextRequest) {
  const gate = await requireCrmAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not set on the server.' }, { status: 500 });
  }

  const rawBody = await readObject(req);
  if (!rawBody) return NextResponse.json({ error: 'A valid JSON object is required.' }, { status: 400 });
  const staffId = rawBody.staff_id;
  if (typeof staffId !== 'string' || !UUID_PATTERN.test(staffId)) return NextResponse.json({ error: 'A valid staff ID is required.' }, { status: 400 });
  const validationError = validateStaffBody(rawBody, false);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
  const { staff_id: _staffId, ...staffBody } = rawBody;
  const body = staffBody as unknown as StaffFormData;

  const { data: row, error } = await supabaseAdmin
    .from('crm_staff')
    .update({ ...staffColumns(body), updated_at: new Date().toISOString() })
    .eq('id', staffId)
    .select('*, user_id')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (row.user_id && body.role) {
    const { error: roleError } = await supabaseAdmin
      .from('crm_users')
      .update({ full_name: body.full_name, role: body.role, updated_at: new Date().toISOString() })
      .eq('id', row.user_id);
    if (roleError) return NextResponse.json({ error: roleError.message }, { status: 400 });
  }

  return NextResponse.json({ staff: row });
}

// Reset password / activate / deactivate / look up last login.
export async function PATCH(req: NextRequest) {
  const gate = await requireCrmAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not set on the server.' }, { status: 500 });
  }

  const body = await readObject(req);
  if (!body) return NextResponse.json({ error: 'A valid JSON object is required.' }, { status: 400 });
  const { staff_id: staffId, action, new_password: newPassword, module_access: moduleAccessInput, crm_section_access: sectionAccessInput } = body;
  if (typeof staffId !== 'string' || !UUID_PATTERN.test(staffId)) return NextResponse.json({ error: 'A valid staff ID is required.' }, { status: 400 });
  if (typeof action !== 'string') return NextResponse.json({ error: 'A valid action is required.' }, { status: 400 });
  const { data: staff, error: staffLookupError } = await supabaseAdmin.from('crm_staff').select('user_id').eq('id', staffId).single();
  if (staffLookupError) return NextResponse.json({ error: staffLookupError.message }, { status: 404 });
  if (!staff?.user_id) {
    return NextResponse.json({ error: 'This staff member has no linked login yet.' }, { status: 400 });
  }

  if (action === 'update_permissions') {
    if (!moduleAccessInput || typeof moduleAccessInput !== 'object' || Array.isArray(moduleAccessInput)) {
      return NextResponse.json({ error: 'A valid module_access object is required.' }, { status: 400 });
    }
    const clean: Record<string, boolean> = {};
    for (const key of MODULE_KEYS) {
      clean[key] = (moduleAccessInput as Record<string, unknown>)[key] === true;
    }
    const { data: targetProfile, error: targetLookupError } = await supabaseAdmin
      .from('crm_users').select('role').eq('id', staff.user_id).maybeSingle();
    if (targetLookupError) return NextResponse.json({ error: targetLookupError.message }, { status: 400 });
    if (targetProfile && ['admin', 'super_admin'].includes(targetProfile.role)) {
      return NextResponse.json({ error: 'Admins already have full access and cannot be restricted here.' }, { status: 400 });
    }
    const { error: updateError } = await supabaseAdmin
      .from('crm_users')
      .update({ module_access: clean, permissions_updated_at: new Date().toISOString(), permissions_updated_by: gate.user.id })
      .eq('id', staff.user_id);
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });
    return NextResponse.json({ ok: true, module_access: clean });
  }

  // Grants/revokes which restricted CRM sidebar sections a Manager account
  // can see (Staff/Tasks/Attendance/HR Overview/Letters/KYC/Salary &
  // Payroll/Event Calendar). Admin-only, same as update_permissions above —
  // a Manager can never touch this route themselves to escalate their own
  // access, since this whole route requires requireCrmAdmin.
  if (action === 'update_section_access') {
    if (!sectionAccessInput || typeof sectionAccessInput !== 'object' || Array.isArray(sectionAccessInput)) {
      return NextResponse.json({ error: 'A valid crm_section_access object is required.' }, { status: 400 });
    }
    const cleanSections: Record<string, boolean> = {};
    for (const key of CRM_SECTION_KEYS) {
      cleanSections[key] = (sectionAccessInput as Record<string, unknown>)[key] === true;
    }
    const { data: targetProfile, error: targetLookupError } = await supabaseAdmin
      .from('crm_users').select('role').eq('id', staff.user_id).maybeSingle();
    if (targetLookupError) return NextResponse.json({ error: targetLookupError.message }, { status: 400 });
    if (!targetProfile || targetProfile.role !== 'manager') {
      return NextResponse.json({ error: 'CRM section access can only be set for Manager accounts.' }, { status: 400 });
    }
    const { error: updateSectionError } = await supabaseAdmin
      .from('crm_users')
      .update({ crm_section_access: cleanSections, permissions_updated_at: new Date().toISOString(), permissions_updated_by: gate.user.id })
      .eq('id', staff.user_id);
    if (updateSectionError) return NextResponse.json({ error: updateSectionError.message }, { status: 400 });
    return NextResponse.json({ ok: true, crm_section_access: cleanSections });
  }

  if (action === 'reset_password') {
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
    }
    const { error } = await supabaseAdmin.auth.admin.updateUserById(staff.user_id, { password: newPassword });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (action === 'activate' || action === 'deactivate') {
    const isActivating = action === 'activate';
    const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(staff.user_id, {
      ban_duration: isActivating ? 'none' : '876000h', // ~100 years == effectively disabled
    });
    if (banError) return NextResponse.json({ error: banError.message }, { status: 400 });

    const { error: profileError } = await supabaseAdmin.from('crm_users').update({ is_active: isActivating }).eq('id', staff.user_id);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });
    const { data: row, error } = await supabaseAdmin
      .from('crm_staff')
      .update({ status: isActivating ? 'Active' : 'Inactive', updated_at: new Date().toISOString() })
      .eq('id', staffId)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ staff: row });
  }

  if (action === 'last_login') {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(staff.user_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ last_sign_in_at: data.user?.last_sign_in_at || null });
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
}

// Delete a staff member and their login entirely.
export async function DELETE(req: NextRequest) {
  const gate = await requireCrmAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not set on the server.' }, { status: 500 });
  }

  const body = await readObject(req);
  const staffId = body?.staff_id;
  if (typeof staffId !== 'string' || !UUID_PATTERN.test(staffId)) return NextResponse.json({ error: 'A valid staff ID is required.' }, { status: 400 });
  const { data: staff, error: lookupError } = await supabaseAdmin.from('crm_staff').select('user_id').eq('id', staffId).single();
  if (lookupError) return NextResponse.json({ error: lookupError.message }, { status: 404 });

  const { error } = await supabaseAdmin.from('crm_staff').delete().eq('id', staffId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (staff?.user_id) {
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(staff.user_id); // cascades to crm_users
    if (authDeleteError) return NextResponse.json({ error: authDeleteError.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
