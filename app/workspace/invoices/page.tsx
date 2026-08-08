'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, ReceiptText } from 'lucide-react';
import CrmHeader from '../../crm/components/CrmHeader';
import { useSidebar } from '../../crm/sidebar-context';
import { useCrmProfile } from '../../crm/lib/useCrmProfile';
import { getInvoices } from '../../crm/invoices/invoice-data';
import { currency, effectiveInvoiceStatus, formatInvoiceDate } from '../../crm/invoices/invoice-config';
import type { InvoiceRecord, InvoiceStatus } from '../../crm/lib/types';
import { resolveModuleAccess } from '../../../lib/modulePermissions';

const STATUS_STYLE: Record<InvoiceStatus, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Issued: 'bg-blue-50 text-blue-700',
  'Partially Paid': 'bg-amber-50 text-amber-700',
  Paid: 'bg-emerald-50 text-emerald-700',
  Overdue: 'bg-red-50 text-red-700',
  Cancelled: 'bg-gray-100 text-gray-500',
};

export default function MyInvoicesPage() {
  const { open } = useSidebar();
  const { profile } = useCrmProfile();
  const [rows, setRows] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const canCreate = resolveModuleAccess(profile?.role, profile?.moduleAccess, 'invoices');

  useEffect(() => { getInvoices().then(setRows).finally(() => setLoading(false)); }, []);

  return (
    <>
      <CrmHeader
        title="My Invoices"
        subtitle={`${rows.length} invoices`}
        onMenuClick={open}
        notificationsHref="/workspace/notifications"
        actions={canCreate ? (
          <Link href="/workspace/invoices/new" className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white">
            <Plus size={15} /> <span className="hidden sm:inline">New Invoice</span>
          </Link>
        ) : undefined}
      />
      <div className="p-4 sm:p-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex h-60 items-center justify-center"><span className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" /></div>
          ) : !rows.length ? (
            <div className="px-6 py-20 text-center">
              <ReceiptText className="mx-auto text-red-600" size={28} />
              <p className="mt-4 font-black">No invoices yet</p>
              <p className="mt-1 text-sm text-gray-400">Invoices you create, or that are assigned to you, will appear here — and your admin sees them instantly too.</p>
              {canCreate && <Link href="/workspace/invoices/new" className="mt-5 inline-block rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white">Create your first invoice</Link>}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rows.map((invoice) => {
                const status = effectiveInvoiceStatus(invoice);
                return (
                  <Link key={invoice.id} href={`/workspace/invoices/${invoice.id}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 hover:bg-gray-50 sm:px-6">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900">{invoice.client_name} <span className="font-mono text-xs font-normal text-gray-400">· {invoice.invoice_number}</span></p>
                      <p className="mt-1 text-xs text-gray-400">{currency(invoice.total_amount)} · Balance {currency(invoice.balance_due)} · Issued {formatInvoiceDate(invoice.issue_date)}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${STATUS_STYLE[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
