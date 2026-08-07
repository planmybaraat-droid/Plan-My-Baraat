'use client';

import Link from 'next/link';
import { UserCircle, Bell, ChevronRight } from 'lucide-react';
import CrmHeader from '../../crm/components/CrmHeader';
import { useSidebar } from '../../crm/sidebar-context';

export default function WorkspaceSettingsPage() {
  const { open } = useSidebar();
  return (
    <>
      <CrmHeader title="Settings" subtitle="Manage your workspace preferences" onMenuClick={open} notificationsHref="/workspace/notifications" />
      <div className="mx-auto max-w-2xl p-4 sm:p-6">
        <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <Link href="/workspace/profile" className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
            <span className="flex items-center gap-3 text-sm font-semibold text-gray-800"><UserCircle size={18} className="text-red-600" /> Profile &amp; password</span>
            <ChevronRight size={16} className="text-gray-300" />
          </Link>
          <Link href="/workspace/notifications" className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
            <span className="flex items-center gap-3 text-sm font-semibold text-gray-800"><Bell size={18} className="text-red-600" /> Notifications</span>
            <ChevronRight size={16} className="text-gray-300" />
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">Role, permissions and CRM ID are managed by your admin. Contact them if anything needs to change.</p>
      </div>
    </>
  );
}
