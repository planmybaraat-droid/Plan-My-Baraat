'use client';

import { useEffect, useState } from 'react';
import { crmSupabase } from './supabase-crm';

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  super_admin: 'Super Admin',
  staff: 'Staff',
  sales: 'Sales',
  manager: 'Manager',
  vendor: 'Vendor',
  accountant: 'Accountant',
};

export interface CrmProfile {
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  moduleAccess: Record<string, boolean>;
  sectionAccess: Record<string, boolean>;
}

export function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Loads the signed-in CRM user's display name/role from `crm_users` (the
 * authentication/role table), keyed off the real Supabase Auth session —
 * never hardcoded, so it always reflects whoever is actually logged in.
 */
export function useCrmProfile() {
  const [profile, setProfile] = useState<CrmProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data: { user } } = await crmSupabase.auth.getUser();
      if (!user || !active) {
        setLoading(false);
        return;
      }

      const { data: row } = await crmSupabase
        .from('crm_users')
        .select('full_name, role, email, module_access, crm_section_access')
        .eq('id', user.id)
        .maybeSingle();

      if (!active) return;

      const email = row?.email || user.email || '';
      const name = row?.full_name || email || 'CRM User';
      const role = row?.role || 'staff';
      const moduleAccess = (row?.module_access || {}) as Record<string, boolean>;
      const sectionAccess = (row?.crm_section_access || {}) as Record<string, boolean>;

      setProfile({ name, email, role, roleLabel: ROLE_LABELS[role] || role, moduleAccess, sectionAccess });
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { profile, loading };
}
