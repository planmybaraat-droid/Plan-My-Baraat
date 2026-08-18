'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Handshake, Plus } from 'lucide-react';
import CrmHeader from '../../crm/components/CrmHeader';
import { useSidebar } from '../../crm/sidebar-context';
import { useCrmProfile } from '../../crm/lib/useCrmProfile';
import { getVendorAgreements } from '../../crm/lib/supabase-crm';
import { calculateVendorAgreementAmounts } from '../../crm/vendor-agreements/vendor-agreement-config';
import { currency, formatAgreementDate } from '../../crm/agreements/agreement-config';
import type { VendorAgreementRecord } from '../../crm/lib/types';
import { resolveModuleAccess } from '../../../lib/modulePermissions';

const STATUS_STYLE: Record<string, string> = { Draft: 'bg-gray-100 text-gray-600', Sent: 'bg-blue-50 text-blue-700', Signed: 'bg-emerald-50 text-emerald-700', Active: 'bg-emerald-50 text-emerald-700', Completed: 'bg-amber-50 text-amber-700', Cancelled: 'bg-red-50 text-red-700', Expired: 'bg-gray-100 text-gray-500' };

export default function MyVendorAgreementsPage() {
  const { open } = useSidebar();
  const { profile } = useCrmProfile();
  const [rows, setRows] = useState<VendorAgreementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const canCreate = resolveModuleAccess(profile?.role, profile?.moduleAccess, 'vendorAgreements');

  useEffect(() => { getVendorAgreements().then(setRows).finally(() => setLoading(false)); }, []);

  return (
    <>
      <CrmHeader
        title="My Vendor Agreements"
        subtitle={`${rows.length} vendor agreements`}
        onMenuClick={open}
        notificationsHref="/workspace/notifications"
        actions={canCreate ? (
          <Link href="/workspace/vendor-agreements/new" className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white">
            <Plus size={15} /> <span className="hidden sm:inline">New Vendor Agreement</span>
          </Link>
        ) : undefined}
      />
      <div className="p-4 sm:p-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex h-60 items-center justify-center"><span className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" /></div>
          ) : !rows.length ? (
            <div className="px-6 py-20 text-center">
              <Handshake className="mx-auto text-red-600" size={28} />
              <p className="mt-4 font-black">No vendor agreements yet</p>
              <p className="mt-1 text-sm text-gray-400">Vendor agreements you create, or that are assigned to you, will appear here — and your admin sees them instantly too.</p>
              {canCreate && <Link href="/workspace/vendor-agreements/new" className="mt-5 inline-block rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white">Create your first vendor agreement</Link>}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rows.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6">
                  <div className="min-w-0 sm:flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">{item.vendor_name} <span className="font-mono text-xs font-normal text-gray-400">· {item.vendor_agreement_number}</span></p>
                    <p className="mt-1 text-xs text-gray-400">{item.service_category || 'General'} · {currency(calculateVendorAgreementAmounts(item).estimatedValue)} · Ends {formatAgreementDate(item.agreement_end_date)}</p>
                  </div>
                  <div className="flex items-center gap-2"><span className={`w-fit rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${STATUS_STYLE[item.status] || 'bg-gray-100 text-gray-600'}`}>{item.status}</span><Link href={`/workspace/vendor-agreements/${item.id}/edit`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-[10px] font-bold text-gray-700 hover:border-red-200 hover:text-red-600">Edit</Link></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
