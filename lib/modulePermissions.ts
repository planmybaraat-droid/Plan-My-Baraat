// Shared source of truth for the Staff Workspace's module permission system.
// Used by: middleware.ts (route guard), WorkspaceSidebar (dynamic nav), the
// Manage Access UI in Staff Management, and the individual workspace pages
// (client-side gate so a denied user sees a message instead of a blank page
// while the middleware redirect is in flight).
//
// Every module here defaults to OFF for every non-admin account. Admins and
// super admins always have access to everything and never consult this map.

export type ModuleKey =
  | 'tasks'
  | 'attendance'
  | 'leave'
  | 'leads'
  | 'quotations'
  | 'agreements'
  | 'vendorAgreements'
  | 'invoices'
  | 'packages'
  | 'calendar'
  | 'eventJobs';

export interface ModuleDef {
  key: ModuleKey;
  label: string;
  description: string;
  path: string;
  canCreate?: boolean;
}

export const WORKSPACE_MODULES: ModuleDef[] = [
  { key: 'tasks', label: 'My Tasks', description: 'Tasks assigned to this staff member', path: '/workspace/tasks' },
  { key: 'attendance', label: 'My Attendance', description: 'Punch in/out and attendance history', path: '/workspace/attendance' },
  { key: 'leave', label: 'Leave Management', description: 'Request leave and track approval status', path: '/workspace/leave' },
  { key: 'leads', label: 'My Leads', description: 'Customer leads assigned to this staff member', path: '/workspace/leads' },
  { key: 'quotations', label: 'My Quotations', description: 'View quotations for assigned clients', path: '/workspace/quotations' },
  { key: 'agreements', label: 'My Agreements', description: 'View and create client agreements', path: '/workspace/agreements', canCreate: true },
  { key: 'vendorAgreements', label: 'Vendor Agreements', description: 'View and create vendor agreements', path: '/workspace/vendor-agreements', canCreate: true },
  { key: 'invoices', label: 'My Invoices', description: 'View and create invoices & payment receipts', path: '/workspace/invoices', canCreate: true },
  { key: 'packages', label: 'Packages', description: 'View the baraat package catalogue', path: '/workspace/packages' },
  { key: 'calendar', label: 'Event Calendar', description: 'View confirmed events on the shared calendar', path: '/workspace/event-calendar' },
  { key: 'eventJobs', label: 'My Event Jobs', description: 'View assigned event workflows and complete operational stages', path: '/workspace/event-jobs' },
];

export const MODULE_KEYS: ModuleKey[] = WORKSPACE_MODULES.map((m) => m.key);

export const ADMIN_ROLES = ['admin', 'super_admin'];

export type ModuleAccessMap = Partial<Record<ModuleKey, boolean>>;

/** True if this role bypasses the module map entirely (sees/does everything). */
export function isAdminRole(role: string | null | undefined): boolean {
  return !!role && ADMIN_ROLES.includes(role);
}

/**
 * Resolves whether a signed-in user may access a given module. Admins always
 * pass. Everyone else needs an explicit `true` for that key — a missing key
 * (never configured by an admin yet) resolves to false, matching the "new
 * staff start with nothing enabled" rule and the corresponding database RLS
 * checks (see app/crm/staff-permissions.sql) so the two layers never disagree.
 */
export function resolveModuleAccess(
  role: string | null | undefined,
  moduleAccess: ModuleAccessMap | null | undefined,
  key: ModuleKey,
): boolean {
  if (isAdminRole(role)) return true;
  return moduleAccess?.[key] === true;
}

/** Returns the full set of modules a user can access, for building a sidebar. */
export function accessibleModules(
  role: string | null | undefined,
  moduleAccess: ModuleAccessMap | null | undefined,
): ModuleDef[] {
  if (isAdminRole(role)) return WORKSPACE_MODULES;
  return WORKSPACE_MODULES.filter((m) => moduleAccess?.[m.key] === true);
}

/** Default map used when creating a brand-new staff account: everything off. */
export function defaultModuleAccess(): Required<ModuleAccessMap> {
  return MODULE_KEYS.reduce((acc, key) => ({ ...acc, [key]: false }), {} as Required<ModuleAccessMap>);
}

