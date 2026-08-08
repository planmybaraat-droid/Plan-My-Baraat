// Mirrors lib/modulePermissions.ts, but for the restricted "Manager" tier
// that logs into the CRM itself (not the Staff Workspace). A Manager sees
// only the sidebar sections an Admin has explicitly toggled on here; every
// other CRM section (Leads, Quotations, Agreements, Vendor Agreements,
// Invoices, Vendors, Cities/Categories/Packages config) stays Admin-only
// and isn't part of this toggle set at all.

export type CrmSectionKey =
  | 'staff'
  | 'tasks'
  | 'attendance'
  | 'hrOverview'
  | 'letters'
  | 'kyc'
  | 'salaryPayroll'
  | 'eventCalendar';

export interface CrmSectionDef {
  key: CrmSectionKey;
  label: string;
  description: string;
  path: string;
}

export const CRM_SECTIONS: CrmSectionDef[] = [
  { key: 'staff', label: 'Staff', description: 'View and edit staff profiles', path: '/crm/staff' },
  { key: 'tasks', label: 'Tasks', description: 'Assign and track tasks company-wide', path: '/crm/tasks' },
  { key: 'attendance', label: 'Attendance', description: 'View and manage attendance records', path: '/crm/attendance' },
  { key: 'hrOverview', label: 'HR Overview', description: 'View the HR summary dashboard', path: '/crm/hr' },
  { key: 'letters', label: 'Letters', description: 'Generate and manage employee letters', path: '/crm/hr/letters' },
  { key: 'kyc', label: 'KYC & Documents', description: 'Manage employee KYC documents', path: '/crm/hr/kyc' },
  { key: 'salaryPayroll', label: 'Salary & Payroll', description: 'Manage salary records and payroll', path: '/crm/hr/payroll' },
  { key: 'eventCalendar', label: 'Event Calendar', description: 'View the event calendar', path: '/crm/event-calendar' },
];

export const CRM_SECTION_KEYS: CrmSectionKey[] = CRM_SECTIONS.map((m) => m.key);

export const CRM_ADMIN_ROLES = ['admin', 'super_admin'];
export function isCrmAdminRole(role: string | null | undefined) {
  return !!role && CRM_ADMIN_ROLES.includes(role);
}
export function isCrmManagerRole(role: string | null | undefined) {
  return role === 'manager';
}

export function resolveSectionAccess(
  role: string | null | undefined,
  sectionAccess: Record<string, boolean> | null | undefined,
  key: CrmSectionKey,
): boolean {
  if (isCrmAdminRole(role)) return true;
  if (!isCrmManagerRole(role)) return false;
  return sectionAccess?.[key] === true;
}

export function accessibleSections(
  role: string | null | undefined,
  sectionAccess: Record<string, boolean> | null | undefined,
): CrmSectionDef[] {
  if (isCrmAdminRole(role)) return CRM_SECTIONS;
  if (!isCrmManagerRole(role)) return [];
  return CRM_SECTIONS.filter((m) => sectionAccess?.[m.key] === true);
}

export function defaultSectionAccess(): Record<CrmSectionKey, boolean> {
  return CRM_SECTION_KEYS.reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<CrmSectionKey, boolean>);
}
