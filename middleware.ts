import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes that must remain reachable without an active session, per portal.
const PUBLIC_PATHS: Record<'crm' | 'workspace', string[]> = {
  crm: ['/crm/login', '/crm/forgot-password', '/crm/reset-password', '/crm/session-expired', '/crm/unauthorized'],
  workspace: ['/workspace/login', '/workspace/session-expired'],
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const portal: 'crm' | 'workspace' = pathname.startsWith('/workspace') ? 'workspace' : 'crm';
  const loginPath = `/${portal}/login`;
  const homePath = `/${portal}`;
  const isPublicPath = PUBLIC_PATHS[portal].some((path) => pathname === path || pathname.startsWith(`${path}/`));

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
    const redirectUrl = new URL(loginPath, request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && (pathname === loginPath || pathname === '/crm/forgot-password')) {
    return NextResponse.redirect(new URL(homePath, request.url));
  }

  // Keep the Admin CRM admin-only: a signed-in staff account (any role other
  // than admin/super_admin) gets sent to their own workspace instead of the
  // admin nav, rather than just hiding menu items client-side.
  if (user && portal === 'crm' && !isPublicPath) {
    const { data: profile, error: profileError } = await supabase.from('crm_users').select('role,is_active').eq('id', user.id).maybeSingle();
    if (profileError || !profile || profile.is_active === false) {
      return NextResponse.redirect(new URL('/crm/unauthorized', request.url));
    }
    if (!['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/workspace', request.url));
    }
  }

  if (user && portal === 'workspace' && !isPublicPath) {
    const { data: profile, error: profileError } = await supabase
      .from('crm_users')
      .select('role,is_active')
      .eq('id', user.id)
      .maybeSingle();
    if (profileError || !profile || profile.is_active === false) {
      return NextResponse.redirect(new URL('/crm/unauthorized', request.url));
    }
    if (['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/crm', request.url));
    }
    if (!['staff', 'sales', 'manager', 'accountant'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/crm/unauthorized', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/crm/:path*', '/workspace/:path*'],
};
