'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import CrmSidebar from './components/CrmSidebar';
import BrandedLoader from './components/BrandedLoader';
import { SidebarContext } from './sidebar-context';
import { crmSupabase, isCrmSupabaseConfigured } from './lib/supabase-crm';
import TeamChat from './components/TeamChat';

// Routes that render on their own, without the sidebar shell or an auth gate.
// Server-side enforcement of the same list lives in middleware.ts — this is
// just so the client doesn't flash a loading/sidebar state on these pages.
const PUBLIC_CRM_ROUTES = ['/crm/login', '/crm/forgot-password', '/crm/reset-password', '/crm/session-expired', '/crm/unauthorized'];

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);

  const isPublicRoute = PUBLIC_CRM_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      if (isPublicRoute) {
        setCheckedAuth(true);
        return;
      }

      if (!isCrmSupabaseConfigured) {
        router.replace('/crm/login?error=configuration');
        return;
      }

      const { data: { session } } = await crmSupabase.auth.getSession();

      if (!active) return;

      if (!session) {
        localStorage.removeItem('crm_session');
        // If we previously had a local marker, the session genuinely expired
        // rather than the user simply never logging in.
        const hadSession = localStorage.getItem('crm_had_session') === 'true';
        localStorage.removeItem('crm_had_session');
        router.push(hadSession ? `/crm/session-expired?redirect=${encodeURIComponent(pathname)}` : '/crm/login');
        return;
      }

      // Honor "keep me signed in" — if the user opted out and this is a fresh
      // browser session (sessionStorage cleared on close), sign out quietly.
      const remembered = localStorage.getItem('crm_remember');
      const stillActiveTab = sessionStorage.getItem('crm_active_session') === '1';
      if (remembered === 'false' && !stillActiveTab) {
        await crmSupabase.auth.signOut();
        localStorage.removeItem('crm_session');
        localStorage.removeItem('crm_user');
        localStorage.removeItem('crm_remember');
        router.push('/crm/login');
        return;
      }
      sessionStorage.setItem('crm_active_session', '1');

      localStorage.setItem('crm_session', 'true');
      localStorage.setItem('crm_had_session', 'true');
      setCheckedAuth(true);
    }

    checkAuth();
    return () => {
      active = false;
    };
  }, [pathname, router, isPublicRoute]);

  // Keep local state in sync with real auth events (token refresh, sign-out
  // from another tab, expired refresh token, etc).
  useEffect(() => {
    const { data: subscription } = crmSupabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && !isPublicRoute) {
        localStorage.removeItem('crm_session');
        sessionStorage.removeItem('crm_active_session');
        router.push('/crm/login');
      }
    });
    return () => subscription.subscription.unsubscribe();
  }, [router, isPublicRoute]);

  if (isPublicRoute) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  if (!checkedAuth) {
    return <BrandedLoader label="Loading your dashboard" />;
  }

  return (
    <SidebarContext.Provider value={{ open: () => setSidebarOpen(true) }}>
      <div className="crm-app-shell flex h-screen bg-gray-50 overflow-hidden">
        <CrmSidebar
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="crm-workspace flex-1 flex flex-col min-w-0 overflow-hidden pb-16 lg:pb-0">
          <main className="crm-main flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
        <TeamChat />
      </div>
    </SidebarContext.Provider>
  );
}
