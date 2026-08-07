'use client';

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import CrmHeader from '../../crm/components/CrmHeader';
import { useSidebar } from '../../crm/sidebar-context';
import { getQuotations } from '../../crm/quotations/quotation-data';
import type { QuotationRecord } from '../../crm/lib/types';

const STATUS_STYLE: Record<string, string> = { Draft: 'bg-gray-100 text-gray-600', Sent: 'bg-blue-50 text-blue-700', Negotiation: 'bg-purple-50 text-purple-700', Accepted: 'bg-emerald-50 text-emerald-700', Rejected: 'bg-red-50 text-red-700', Expired: 'bg-gray-100 text-gray-500', Converted: 'bg-amber-50 text-amber-700' };

export default function MyQuotationsPage() {
  const { open } = useSidebar();
  const [rows, setRows] = useState<QuotationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getQuotations().then(setRows).finally(() => setLoading(false)); }, []);

  return (
    <>
      <CrmHeader title="My Quotations" subtitle={`${rows.length} quotations`} onMenuClick={open} notificationsHref="/workspace/notifications" />
      <div className="p-4 sm:p-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex h-60 items-center justify-center"><span className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" /></div>
          ) : !rows.length ? (
            <div className="px-6 py-20 text-center"><FileText className="mx-auto text-red-600" size={28} /><p className="mt-4 font-black">No quotations yet</p><p className="mt-1 text-sm text-gray-400">Quotations assigned to you, or that you create, will appear here — and your admin sees them instantly too.</p></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rows.map((q) => (
                <div key={q.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">{q.client_name} <span className="font-mono text-xs font-normal text-gray-400">· {q.quotation_number}</span></p>
                    <p className="mt-1 text-xs text-gray-400">₹{Number(q.total_amount).toLocaleString('en-IN')} · Valid until {q.valid_until ? new Date(q.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${STATUS_STYLE[q.status] || 'bg-gray-100 text-gray-600'}`}>{q.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
