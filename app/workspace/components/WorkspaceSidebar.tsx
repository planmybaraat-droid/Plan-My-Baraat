'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, ListChecks, CalendarCheck2, UserSearch, FileText, ScrollText, Bell, UserCircle, Settings, X, ChevronRight, LogOut,
  ReceiptText, Package, CalendarDays, Lock, Handshake,
} from 'lucide-react';
import { crmSupabase } from '../../crm/lib/supabase-crm';
import { useCrmProfile, initialsFrom } from '../../crm/lib/useCrmProfile';
import { getMyStaffProfile } from '../lib/attendance-data';
import { resolveModuleAccess, type ModuleKey } from '../../../lib/modulePermissions';

const MODULE_ICONS: Record<ModuleKey, typeof LayoutDashboard> = {
  tasks: ListChecks,
  attendance: CalendarCheck2,
  leads: UserSearch,
  quotations: FileText,
  agreements: ScrollText,
  vendorAgreements: Handshake,
  invoices: ReceiptText,
  packages: Package,
  calendar: CalendarDays,
};

const MODULE_NAV: { key: ModuleKey; href: string; label: string }[] = [
  { key: 'tasks', href: '/workspace/tasks', label: 'My Tasks' },
  { key: 'attendance', href: '/workspace/attendance', label: 'My Attendance' },
  { key: 'leads', href: '/workspace/leads', label: 'My Leads' },
  { key: 'quotations', href: '/workspace/quotations', label: 'My Quotations' },
  { key: 'agreements', href: '/workspace/agreements', label: 'My Agreements' },
  { key: 'vendorAgreements', href: '/workspace/vendor-agreements', label: 'Vendor Agreements' },
  { key: 'invoices', href: '/workspace/invoices', label: 'My Invoices' },
  { key: 'packages', href: '/workspace/packages', label: 'Packages' },
  { key: 'calendar', href: '/workspace/event-calendar', label: 'Event Calendar' },
];

const UTILITY_NAV = [
  { href: '/workspace/notifications', label: 'Notifications', icon: Bell },
  { href: '/workspace/profile', label: 'Profile', icon: UserCircle },
  { href: '/workspace/settings', label: 'Settings', icon: Settings },
];

interface WorkspaceSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function WorkspaceSidebar({ mobileOpen, onClose }: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useCrmProfile();
  const [staffPost, setStaffPost] = useState<{ full_name: string; job_title: string } | null>(null);

  // The Staff Workspace should show the person's real name and post (job
  // title) from their HR profile — not the generic system role label used
  // in the Admin CRM (e.g. "Super Admin"/"Staff").
  useEffect(() => {
    let active = true;
    getMyStaffProfile().then((staff) => {
      if (active && staff) setStaffPost({ full_name: staff.full_name, job_title: staff.job_title });
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const displayName = staffPost?.full_name || profile?.name;
  const displayPost = staffPost?.job_title || profile?.roleLabel;

  const handleLogout = async () => {
    try { await crmSupabase.auth.signOut({ scope: 'local' }); } catch {}
    localStorage.removeItem('workspace_session');
    sessionStorage.removeItem('workspace_active_session');
    router.push('/workspace/login');
  };

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  const grantedModules = MODULE_NAV.filter((item) => resolveModuleAccess(profile?.role, profile?.moduleAccess, item.key));
  const navItems: { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
    { href: '/workspace', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ...grantedModules.map((item) => ({ href: item.href, label: item.label, icon: MODULE_ICONS[item.key] })),
    ...UTILITY_NAV,
  ];

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={`
          crm-sidebar fixed left-0 top-0 z-50 flex h-full w-[17rem] shrink-0 flex-col overflow-hidden border-r border-white/[0.06] bg-[#090a0d]
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto lg:h-screen
        `}
      >
        <div className="relative flex min-h-[88px] items-center justify-between border-b border-white/[0.07] bg-gradient-to-b from-white/[0.035] to-transparent px-3.5">
          <Link href="/workspace" className="block min-w-0" onClick={onClose} aria-label="PlanMyBaraat staff workspace">
            <span className="crm-brand-crop block" aria-hidden="true">
              <Image src="/crm-logo-dark.png" alt="" width={1536} height={1024} className="crm-brand-image" priority />
            </span>
            <span className="ml-1 mt-[-3px] flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.24em] text-gray-500">
              <i className="h-px w-5 bg-red-600" /> Staff Workspace
            </span>
          </Link>
          <button onClick={onClose} className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-500 hover:bg-white/5 hover:text-white lg:hidden" aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <nav className="crm-sidebar-nav flex-1 overflow-y-auto px-3 py-3">
          {profile && grantedModules.length === 0 && (
            <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 text-[11px] leading-snug text-gray-400">
              <Lock size={14} className="mt-0.5 shrink-0 text-gray-500" />
              <span>No modules enabled yet. Ask your Admin to grant access under Staff Management &rarr; Manage Access.</span>
            </div>
          )}
          <div className="space-y-0.5">
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link key={href} href={href} onClick={onClose} className={`group relative flex h-9 items-center gap-3 rounded-xl px-3 text-[12px] font-semibold transition-all ${active ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_8px_24px_-12px_rgba(227,11,29,.95)]' : 'text-gray-400 hover:bg-white/[0.055] hover:text-gray-100'}`}>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${active ? 'bg-white/14 text-white' : 'bg-white/[0.035] text-gray-500 group-hover:text-gray-300'}`}><Icon size={14.5} strokeWidth={active ? 2.4 : 1.9} /></span>
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {active && <ChevronRight size={12} className="text-red-100" />}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/[0.07] bg-black/20 p-3">
          <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.035] p-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-950/40">
                <span className="text-[10px] font-black text-white">{displayName ? initialsFrom(displayName) : '…'}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">{displayName || 'Loading…'}</p>
                <p className="mt-0.5 truncate text-[9px] font-medium text-gray-500">{displayPost || ''}</p>
              </div>
            </div>
            <button onClick={handleLogout} title="Log Out" aria-label="Log out" className="shrink-0 rounded-xl border border-white/[0.06] p-2 text-gray-500 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"><LogOut size={14} /></button>
          </div>
        </div>
      </aside>

      <nav className="crm-mobile-tabs lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 safe-area-pb">
        <div className="flex">
          {[navItems[0], ...navItems.slice(1, 3), navItems[navItems.length - 1]].map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`flex-1 flex flex-col items-center justify-center pt-2.5 pb-2 gap-1 transition-colors ${active ? 'text-red-600' : 'text-gray-400'}`}>
                <div className={`relative flex items-center justify-center w-10 h-6 rounded-full transition-all ${active ? 'bg-red-50' : ''}`}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  {active && <span className="absolute -bottom-1.5 w-1 h-1 bg-red-600 rounded-full" />}
                </div>
                <span className={`text-[10px] font-semibold ${active ? 'text-red-600' : 'text-gray-400'}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
