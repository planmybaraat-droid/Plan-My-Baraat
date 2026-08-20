'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, ScrollText } from 'lucide-react';
import CrmHeader from '../../crm/components/CrmHeader';
import { useSidebar } from '../../crm/sidebar-context';
import { useCrmProfile } from '../../crm/lib/useCrmProfile';
import { getAgreements } from '../../crm/lib/supabase-crm';
import type { AgreementRecord } from '../../crm/lib/types';
import { resolveModuleAccess } from '../../../lib/modulePermissions';

const STATUS_STYLE: Record<string, string> = { Draft: 'bg-gray-100 text-gray-600', Sent: 'bg-blue-50 text-blue-700', Signed: 'bg-emerald-50 text-emerald-700', Completed: 'bg-amber-50 text-amber-700', Cancelled: 'bg-red-50 text-red-700' };

export default function MyAgreementsPage() {
  const { open } = useSidebar();
  const { profile } = useCrmProfile();
  const [rows, setRows] = useState<AgreementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const canCreate = resolveModuleAccess(profile?.role, profile?.moduleAccess, 'agreements');

  useEffect(() => { getAgreements().then(setRows).finally(() => setLoading(false)); }, []);

  return (
    <>
      <CrmHeader
        title="My Agreements"
        subtitle={`${rows.length} agreements`}
        onMenuClick={open}
        notificationsHref="/workspace/notifications"
        actions={canCreate ? (
          <Link href="/workspace/agreements/new" className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white">
            <Plus size={15} /> <span className="hidden sm:inline">New Agreement</span>
          </Link>
        ) : undefined}
      />
      <div className="p-4 sm:p-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex h-60 items-center justify-center"><span className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" /></div>
          ) : !rows.length ? (
            <div className="px-6 py-20 text-center"><ScrollText className="mx-auto text-red-600" size={28} /><p className="mt-4 font-black">No agreements yet</p><p className="mt-1 text-sm text-gray-400">Agreements assigned to you, or that you create, will appear here — and your admin sees them instantly too.</p>{canCreate && <Link href="/workspace/agreements/new" className="mt-5 inline-block rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white">Create your first agreement</Link>}</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rows.map((a) => (
                <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
                  <Link href={`/workspace/agreements/${a.id}`} className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900 hover:text-red-600">{a.client_name} <span className="font-mono text-xs font-normal text-gray-400">· {a.agreement_number}</span></p>
                    <p className="mt-1 text-xs text-gray-400">₹{Number(a.final_amount).toLocaleString('en-IN')} · Event {a.event_date ? new Date(a.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</p>
                  </Link>
                  <div className="flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${STATUS_STYLE[a.status] || 'bg-gray-100 text-gray-600'}`}>{a.status}</span><Link href={`/workspace/agreements/${a.id}`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-[10px] font-bold text-gray-700 hover:border-red-200 hover:text-red-600">View</Link><Link href={`/workspace/agreements/${a.id}/edit`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-[10px] font-bold text-gray-700 hover:border-red-200 hover:text-red-600">Edit</Link></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
