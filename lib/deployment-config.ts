/**
 * Public, project-scoped deployment defaults.
 *
 * Supabase publishable keys are intentionally safe for browser applications;
 * database access is still enforced by Auth and Row Level Security. Elevated
 * server access must continue to use SUPABASE_SERVICE_ROLE_KEY from the host's
 * encrypted environment settings and must never be added here.
 */
export const PRODUCTION_SITE_URL = 'https://planmybaraat.com';
export const DEFAULT_SUPABASE_URL = 'https://pldkbuwpdqbfrmkxlcqm.supabase.co';
export const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_wZ2pdO4IjohC3NAZ3aktUw_g5EIus3f';

export const publicSupabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;

export const publicSupabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY;

export function getSiteUrl() {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    (typeof window !== 'undefined' ? window.location.origin : PRODUCTION_SITE_URL);
  const withProtocol = configured.startsWith('http') ? configured : `https://${configured}`;
  return withProtocol.replace(/\/$/, '');
}
