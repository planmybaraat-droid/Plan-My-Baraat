import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { publicSupabaseKey, publicSupabaseUrl } from './lib/deployment-config';
import { WORKSPACE_MODULES, resolveModuleAccess } from './lib/modulePermissions';
import { CRM_SECTIONS, resolveSectionAccess } from './lib/crmSectionPermissions';

// Routes that must remain reachable without an active session, per portal.
const PUBLIC_PATHS: Record<'crm' | 'workspace', string[]> = {
  crm: ['/crm/login', '/crm/forgot-password', '/crm/reset-password', '/crm/session-expired', '/crm/unauthorized'],
  workspace: ['/workspace/login', '/workspace/session-expired'],
};

const supabaseUrl = publicSupabaseUrl;
const supabaseAnonKey = publicSupabaseKey;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // The legacy /admin panel predates the /crm system and has no auth checks
  // of its own — route it through the same admin-only gate as /crm rather
  // than leaving it reachable by anyone who knows the URL.
  const isLegacyAdminPanel = pathname.startsWith('/admin');
  const portal: 'crm' | 'workspace' = pathname.startsWith('/workspace') ? 'workspace' : 'crm';
  const loginPath = `/${portal}/login`;
  const homePath = `/${portal}`;
  const isPublicPath = !isLegacyAdminPanel && PUBLIC_PATHS[portal].some((path) => pathname === path || pathname.startsWith(`${path}/`));

  let response = NextResponse.next({ request: { headers: request.headers } });

  // Fail closed when authentication cannot be verified. Public recovery/login
  // pages stay reachable, but a browser marker must never unlock CRM data.
  if (!supabaseUrl || !supabaseAnonKey) {
    if (isPublicPath) return response;
    const redirectUrl = new URL(loginPath, request.url);
    redirectUrl.searchParams.set('error', 'configuration');
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Parameters<typeof response.cookies.set>[2] }>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: request.headers } });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() re-validates the token against Supabase Auth (unlike getSession,
  // which only reads the local cookie), so this can't be spoofed client-side.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicPath) {
    const redirectUrl = new URL(isLegacyAdminPanel ? '/crm/login' : loginPath, request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && (pathname === loginPath || pathname === '/crm/forgot-password')) {
    return NextResponse.redirect(new URL(homePath, request.url));
  }

  // Keep the Admin CRM restricted to Admin/Super Admin and the Manager
  // tier: any other signed-in role (Staff/Sales/Accountant) gets sent to
  // their own workspace instead of the admin nav, rather than just hiding
  // menu items client-side.
  if (user && (portal === 'crm' || isLegacyAdminPanel) && !isPublicPath) {
    const { data: profile, error: profileError } = await supabase.from('crm_users').select('role,is_active,crm_section_access').eq('id', user.id).maybeSingle();
    if (profileError || !profile || profile.is_active === false) {
      return NextResponse.redirect(new URL('/crm/unauthorized', request.url));
    }
    if (!['admin', 'super_admin', 'manager'].includes(profile.role) || (isLegacyAdminPanel && profile.role === 'manager')) {
      return NextResponse.redirect(new URL(isLegacyAdminPanel ? '/crm/unauthorized' : '/workspace', request.url));
    }

    // Server-side section gate for Manager accounts: a Manager can't reach
    // a hidden CRM section by typing its URL directly even if it's hidden
    // from their sidebar. Dashboard, Notifications, and Settings stay open
    // to every Manager regardless of crm_section_access.
    if (profile.role === 'manager') {
      const deniedSection = CRM_SECTIONS.find(
        (section) => pathname === section.path || pathname.startsWith(`${section.path}/`),
      );
      if (deniedSection && !resolveSectionAccess(profile.role, profile.crm_section_access, deniedSection.key)) {
        const redirectUrl = new URL('/crm', request.url);
        redirectUrl.searchParams.set('access_denied', deniedSection.key);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  if (user && portal === 'workspace' && !isPublicPath) {
    const { data: profile, error: profileError } = await supabase
      .from('crm_users')
      .select('role,is_active,module_access')
      .eq('id', user.id)
      .maybeSingle();
    if (profileError || !profile || profile.is_active === false) {
      return NextResponse.redirect(new URL('/crm/unauthorized', request.url));
    }
    if (['admin', 'super_admin', 'manager'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/crm', request.url));
    }
    if (!['staff', 'sales', 'accountant'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/crm/unauthorized', request.url));
    }

    // Server-side module gate: a Staff account can't reach a module by typing
    // its URL directly even if it's hidden from their sidebar. Only routes
    // that map to a permissioned module are checked here — Dashboard,
    // Notifications, Profile, Settings and Login stay open to every staff
    // account regardless of their module_access map.
    const deniedModule = WORKSPACE_MODULES.find(
      (module) => pathname === module.path || pathname.startsWith(`${module.path}/`),
    );
    if (deniedModule && !resolveModuleAccess(profile.role, profile.module_access, deniedModule.key)) {
      const redirectUrl = new URL('/workspace', request.url);
      redirectUrl.searchParams.set('access_denied', deniedModule.key);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/crm/:path*', '/workspace/:path*', '/admin/:path*'],
};
