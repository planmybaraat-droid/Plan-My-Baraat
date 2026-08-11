'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, UserSearch, MoreHorizontal,
  Building2, Tag, Package, Calculator, Settings, X, ChevronRight, LogOut, MessageSquare, ScrollText, ReceiptText, FileText, UserCog, CalendarCheck2, ListChecks, Bell, CalendarDays, Handshake,
  FileSignature, FolderCheck, Wallet, CalendarRange, ClipboardList,
} from 'lucide-react';
import { crmSupabase } from '../lib/supabase-crm';
import { useCrmProfile, initialsFrom } from '../lib/useCrmProfile';
import { useCrmNotifications } from '../lib/useCrmNotifications';
import { isCrmAdminRole, isCrmManagerRole, resolveSectionAccess, type CrmSectionKey } from '../../../lib/crmSectionPermissions';

const adminBottomTabs = [
  { href: '/crm',        label: 'Home',    icon: LayoutDashboard, exact: true },
  { href: '/crm/vendors', label: 'Vendors', icon: Users },
  { href: '/crm/leads',   label: 'Leads',   icon: UserSearch },
  { href: '/crm/more',    label: 'More',    icon: MoreHorizontal },
];

type SidebarItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  // Present only on items gated by the Manager section-toggle system.
  // Admin/Super Admin always see these; a Manager needs the matching
  // toggle granted in Staff Management -> Manage Access.
  sectionKey?: CrmSectionKey;
  // Present on items that stay Admin/Super Admin only regardless of any
  // Manager toggle (Leads, Quotations, Agreements, Invoices, config, etc.)
  adminOnly?: boolean;
};

const sidebarSections: { label: string; items: SidebarItem[] }[] = [
  { label: 'Overview', items: [
    { href: '/crm', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/crm/notifications', label: 'Notifications', icon: Bell },
    { href: '/crm/settings', label: 'Settings', icon: Settings },
  ] },
  { label: 'People & operations', items: [
    { href: '/crm/staff', label: 'Staff', icon: UserCog, sectionKey: 'staff' },
    { href: '/crm/tasks', label: 'Tasks', icon: ListChecks, sectionKey: 'tasks' },
    { href: '/crm/attendance', label: 'Attendance', icon: CalendarCheck2, sectionKey: 'attendance' },
    { href: '/crm/daily-work-reports', label: 'Daily Work Reports', icon: ClipboardList, sectionKey: 'dailyWorkReports' },
    { href: '/crm/leave', label: 'Leave Management', icon: CalendarRange, sectionKey: 'leaveManagement' },
    { href: '/crm/vendors', label: 'Vendors', icon: Users, adminOnly: true },
  ] },
  { label: 'HR management', items: [
    { href: '/crm/hr', label: 'HR Overview', icon: LayoutDashboard, exact: true, sectionKey: 'hrOverview' },
    { href: '/crm/hr/letters', label: 'Letters', icon: FileSignature, sectionKey: 'letters' },
    { href: '/crm/hr/kyc', label: 'KYC & Documents', icon: FolderCheck, sectionKey: 'kyc' },
    { href: '/crm/hr/payroll', label: 'Salary & Payroll', icon: Wallet, sectionKey: 'salaryPayroll' },
    { href: '/crm/event-calendar', label: 'Event Calendar', icon: CalendarDays, sectionKey: 'eventCalendar' },
  ] },
  { label: 'Sales & documents', items: [
    { href: '/crm/leads', label: 'Customer Leads', icon: UserSearch, adminOnly: true },
    { href: '/crm/baraat-leads', label: 'Baraat Enquiries', icon: MessageSquare, adminOnly: true },
    { href: '/crm/quotations', label: 'Client Quotations', icon: FileText, adminOnly: true },
    { href: '/crm/agreements', label: 'Client Agreements', icon: ScrollText, adminOnly: true },
    { href: '/crm/vendor-agreements', label: 'Vendor Agreements', icon: Handshake, adminOnly: true },
    { href: '/crm/invoices', label: 'Invoices & Payments', icon: ReceiptText, adminOnly: true },
  ] },
  { label: 'Configuration', items: [
    { href: '/crm/cities', label: 'Cities', icon: Building2, adminOnly: true },
    { href: '/crm/categories', label: 'Categories', icon: Tag, adminOnly: true },
    { href: '/crm/packages', label: 'Packages', icon: Package, adminOnly: true },
    { href: '/crm/package-maker', label: 'Package Maker', icon: Calculator, adminOnly: true },
  ] },
];

interface CrmSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function CrmSidebar({ mobileOpen, onClose }: CrmSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useCrmProfile();
  const { unreadCount } = useCrmNotifications();

  const handleLogout = async () => {
    try {
      // Local sign-out clears the SSR auth cookie immediately and does not
      // wait for a network-wide session revocation before leaving the page.
      await crmSupabase.auth.signOut({ scope: 'local' });
    } catch {}
    localStorage.removeItem('crm_session');
    localStorage.removeItem('crm_user');
    localStorage.removeItem('crm_remember');
    sessionStorage.removeItem('crm_active_session');
    router.push('/crm/login');
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    if (href === '/crm/vendors') return pathname.startsWith('/crm/vendors');
    if (href === '/crm/leads')   return pathname.startsWith('/crm/leads');
    return pathname.startsWith(href);
  };

  const role = profile?.role;
  const isManager = isCrmManagerRole(role);
  const canSeeItem = (item: SidebarItem) => {
    if (isCrmAdminRole(role)) return true;
    if (item.adminOnly) return false;
    if (item.sectionKey) return resolveSectionAccess(role, profile?.sectionAccess, item.sectionKey);
    return true; // utility items (Dashboard, Notifications, Settings)
  };
  const visibleSections = sidebarSections
    .map((section) => ({ ...section, items: section.items.filter(canSeeItem) }))
    .filter((section) => section.items.length > 0);

  const bottomTabs = isManager
    ? (() => {
        const managerItems = visibleSections.filter((s) => s.label !== 'Overview').flatMap((s) => s.items);
        return [
          { href: '/crm', label: 'Home', icon: LayoutDashboard, exact: true },
          ...managerItems.slice(0, 2),
          { href: '/crm/more', label: 'More', icon: MoreHorizontal },
        ];
      })()
    : adminBottomTabs;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar (desktop always, mobile drawer) */}
      <aside
        className={`
          crm-sidebar fixed left-0 top-0 z-50 flex h-full w-[17rem] shrink-0 flex-col overflow-hidden border-r border-white/[0.06] bg-[#090a0d]
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto lg:h-screen
        `}
      >
        <div className="relative flex min-h-[88px] items-center justify-between border-b border-white/[0.07] bg-gradient-to-b from-white/[0.035] to-transparent px-3.5">
          <Link href="/crm" className="block min-w-0" onClick={onClose} aria-label="PlanMyBaraat CRM dashboard">
            <span className="crm-brand-crop block" aria-hidden="true">
              <Image src="/crm-logo-dark.png" alt="" width={1536} height={1024} className="crm-brand-image" priority />
            </span>
            <span className="ml-1 mt-[-3px] flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.24em] text-gray-500">
              <i className="h-px w-5 bg-red-600" /> Management CRM
            </span>
          </Link>
          <button onClick={onClose} className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-500 hover:bg-white/5 hover:text-white lg:hidden" aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <nav className="crm-sidebar-nav flex-1 overflow-y-auto px-3 py-3">
          {visibleSections.map(section => <div key={section.label} className="mb-3 last:mb-1">
            <p className="px-3 pb-1.5 pt-1 text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">{section.label}</p>
            <div className="space-y-0.5">{section.items.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return <Link key={href} href={href} onClick={onClose} className={`group relative flex h-9 items-center gap-3 rounded-xl px-3 text-[12px] font-semibold transition-all ${active ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_8px_24px_-12px_rgba(227,11,29,.95)]' : 'text-gray-400 hover:bg-white/[0.055] hover:text-gray-100'}`}>
                <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${active ? 'bg-white/14 text-white' : 'bg-white/[0.035] text-gray-500 group-hover:text-gray-300'}`}><Icon size={14.5} strokeWidth={active ? 2.4 : 1.9} /></span>
                <span className="min-w-0 flex-1 truncate">{label}</span>
                {href === '/crm/notifications' && unreadCount > 0 && (
                  <span className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-black ${active ? 'bg-white/20 text-white' : 'bg-red-600 text-white'}`}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
                {active && <ChevronRight size={12} className="text-red-100" />}
              </Link>;
            })}</div>
          </div>)}
        </nav>

        <div className="border-t border-white/[0.07] bg-black/20 p-3">
          <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.035] p-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-950/40">
                <span className="text-[10px] font-black text-white">{profile ? initialsFrom(profile.name) : '…'}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">{profile?.name || 'Loading…'}</p>
                <p className="mt-0.5 truncate text-[9px] font-medium text-gray-500">{profile?.roleLabel || ''}</p>
              </div>
            </div>
            <button onClick={handleLogout} title="Log Out" aria-label="Log out" className="shrink-0 rounded-xl border border-white/[0.06] p-2 text-gray-500 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"><LogOut size={14} /></button>
          </div>
        </div>
      </aside>

      {/* Bottom Tab Bar (mobile only) */}
      <nav className="crm-mobile-tabs lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 safe-area-pb">
        <div className="flex">
          {bottomTabs.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center pt-2.5 pb-2 gap-1 transition-colors
                  ${active ? 'text-red-600' : 'text-gray-400'}
                `}
              >
                <div className={`relative flex items-center justify-center w-10 h-6 rounded-full transition-all
                  ${active ? 'bg-red-50' : ''}
                `}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  {active && <span className="absolute -bottom-1.5 w-1 h-1 bg-red-600 rounded-full" />}
                </div>
                <span className={`text-[10px] font-semibold ${active ? 'text-red-600' : 'text-gray-400'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
