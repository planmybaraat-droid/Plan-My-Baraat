'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import WorkspaceSidebar from './components/WorkspaceSidebar';
import BrandedLoader from '../crm/components/BrandedLoader';
import { SidebarContext } from '../crm/sidebar-context';
import { crmSupabase, isCrmSupabaseConfigured } from '../crm/lib/supabase-crm';
import TeamChat from '../crm/components/TeamChat';

const PUBLIC_WORKSPACE_ROUTES = ['/workspace/login', '/workspace/session-expired'];

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);

  const isPublicRoute = PUBLIC_WORKSPACE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      if (isPublicRoute) { setCheckedAuth(true); return; }

      if (!isCrmSupabaseConfigured) {
        router.replace('/workspace/login?error=configuration');
        return;
      }

      const { data: { session } } = await crmSupabase.auth.getSession();
      if (!active) return;

      if (!session) {
        localStorage.removeItem('workspace_session');
        router.push('/workspace/login');
        return;
      }

      sessionStorage.setItem('workspace_active_session', '1');
      localStorage.setItem('workspace_session', 'true');
      setCheckedAuth(true);
    }

    checkAuth();
    return () => { active = false; };
  }, [pathname, router, isPublicRoute]);

  useEffect(() => {
    const { data: subscription } = crmSupabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && !isPublicRoute) {
        localStorage.removeItem('workspace_session');
        router.push('/workspace/login');
      }
    });
    return () => subscription.subscription.unsubscribe();
  }, [router, isPublicRoute]);

  if (isPublicRoute) return <div className="min-h-screen bg-gray-50">{children}</div>;
  if (!checkedAuth) return <BrandedLoader label="Loading your workspace" />;

  return (
    <SidebarContext.Provider value={{ open: () => setSidebarOpen(true) }}>
      <div className="crm-app-shell flex h-screen bg-gray-50 overflow-hidden">
        <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="crm-workspace flex-1 flex flex-col min-w-0 overflow-hidden pb-36 lg:pb-0">
          <main className="crm-main flex-1 overflow-y-auto">{children}</main>
        </div>
        <TeamChat />
      </div>
    </SidebarContext.Provider>
  );
}
