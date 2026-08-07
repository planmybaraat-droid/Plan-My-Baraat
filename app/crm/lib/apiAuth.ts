import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import { publicSupabaseKey, publicSupabaseUrl } from '../../../lib/deployment-config';

const supabaseUrl = publicSupabaseUrl;
const supabaseAnonKey = publicSupabaseKey;

/**
 * Confirms the incoming request belongs to a signed-in CRM admin before an
 * API route is allowed to use the service-role client. Every privileged
 * route (staff creation, password resets, etc.) must call this first.
 *
 * Reads cookies straight off the incoming `NextRequest` (when passed) rather
 * than relying solely on `next/headers`'s `cookies()` — some deployments
 * have shown that indirection occasionally missing the auth cookie on route
 * handlers, which surfaced as a false "Not signed in." even for an actively
 * signed-in admin. Reading from `req.cookies` directly is the more reliable
 * of the two, so it's used first with `next/headers` only as a fallback.
 */
export async function requireCrmAdmin(req?: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { ok: false as const, status: 503, message: 'Supabase is not configured on the server.' };
  }

  const cookieStore = cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => (req ? req.cookies.getAll() : cookieStore.getAll()),
      setAll: () => {}, // route handlers don't need to persist refreshed cookies here
    },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { ok: false as const, status: 401, message: 'Not signed in.' };
  }

  const { data: profile, error: profileError } = await supabase
    .from('crm_users')
    .select('role,is_active')
    .eq('id', user.id)
    .maybeSingle();
  if (profileError) {
    return { ok: false as const, status: 503, message: 'CRM access could not be verified.' };
  }
  if (!profile || profile.is_active === false || !['admin', 'super_admin'].includes(profile.role)) {
    return { ok: false as const, status: 403, message: 'Only active admins can do this.' };
  }

  return { ok: true as const, user };
}

const CHAT_ROLES = ['admin', 'super_admin', 'staff', 'sales', 'manager', 'accountant'];

/**
 * Auth gate shared by CRM-only collaboration endpoints. Unlike the admin
 * gate above, this deliberately accepts every active internal CRM role so a
 * newly-created staff account is immediately available in Team Chat.
 */
export async function requireCrmMember(req?: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { ok: false as const, status: 503, message: 'Supabase is not configured on the server.' };
  }

  const cookieStore = cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => (req ? req.cookies.getAll() : cookieStore.getAll()),
      setAll: () => {},
    },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { ok: false as const, status: 401, message: 'Not signed in.' };
  }

  const { data: profile, error: profileError } = await supabase
    .from('crm_users')
    .select('id,full_name,email,role,is_active,avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    return { ok: false as const, status: 503, message: 'CRM access could not be verified.' };
  }
  if (!profile || profile.is_active === false || !CHAT_ROLES.includes(profile.role)) {
    return { ok: false as const, status: 403, message: 'Your CRM chat access is inactive.' };
  }

  return { ok: true as const, user, profile };
}
