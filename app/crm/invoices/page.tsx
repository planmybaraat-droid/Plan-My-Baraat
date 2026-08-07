'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Banknote, CalendarClock, ChevronRight, CircleDollarSign, FileText, Filter, Plus, ReceiptText, Search, Trash2, X } from 'lucide-react';
import CrmHeader from '../components/CrmHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useSidebar } from '../sidebar-context';
import type { InvoiceFilters, InvoiceRecord, InvoiceStatus } from '../lib/types';
import { deleteInvoice, getInvoices } from './invoice-data';
import { currency, effectiveInvoiceStatus, formatInvoiceDate, INVOICE_DOCUMENT_TYPES, INVOICE_STATUSES } from './invoice-config';

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Issued: 'bg-blue-50 text-blue-700',
  'Partially Paid': 'bg-amber-50 text-amber-700',
  Paid: 'bg-emerald-50 text-emerald-700',
  Overdue: 'bg-red-50 text-red-700',
  Cancelled: 'bg-gray-100 text-gray-500',
};

export default function InvoicesPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const [records, setRecords] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<InvoiceRecord | null>(null);
  const [filters, setFilters] = useState<InvoiceFilters>({ search: '', status: '', document_type: '', issue_date_from: '', issue_date_to: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try { setRecords(await getInvoices(filters)); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => {
    const timeout = window.setTimeout(load, 200);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const stats = useMemo(() => ({
    invoiced: records.filter(item => item.status !== 'Cancelled').reduce((sum, item) => sum + item.total_amount, 0),
    collected: records.filter(item => item.status !== 'Cancelled').reduce((sum, item) => sum + item.amount_paid, 0),
    outstanding: records.filter(item => item.status !== 'Cancelled').reduce((sum, item) => sum + item.balance_due, 0),
    overdue: records.filter(item => effectiveInvoiceStatus(item) === 'Overdue').reduce((sum, item) => sum + item.balance_due, 0),
  }), [records]);

  const remove = async () => {
    if (!deleteTarget) return;
    await deleteInvoice(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  return (
    <>
      <CrmHeader title="Invoices & Payments" subtitle="Issue branded documents, collect payments and track every balance" onMenuClick={open}
        actions={<Link href="/crm/invoices/new" className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-700"><Plus size={15} /><span className="hidden sm:inline">Create invoice</span></Link>} />

      <div className="space-y-5 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[
            { label: 'Total invoiced', value: stats.invoiced, icon: FileText, tone: 'bg-gray-950 text-white' },
            { label: 'Collected', value: stats.collected, icon: Banknote, tone: 'bg-white text-gray-950' },
            { label: 'Outstanding', value: stats.outstanding, icon: CircleDollarSign, tone: 'bg-red-600 text-white' },
            { label: 'Overdue', value: stats.overdue, icon: CalendarClock, tone: 'bg-white text-gray-950' },
          ].map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className={`rounded-2xl border border-gray-200 p-4 shadow-sm sm:p-5 ${tone}`}>
              <div className="flex items-center justify-between gap-2"><p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{label}</p><Icon size={16} className="opacity-60" /></div>
              <p className="mt-4 truncate text-xl font-black tracking-tight sm:text-2xl">{currency(value)}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={filters.search} onChange={e => setFilters(current => ({ ...current, search: e.target.value }))} placeholder="Search invoice, agreement or client..." className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-50" />
          </div>
          <button onClick={() => setShowFilters(value => !value)} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold ${showFilters ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-600'}`}><Filter size={15} /> Filters</button>
          {(filters.status || filters.document_type || filters.issue_date_from || filters.issue_date_to) && <button onClick={() => setFilters({ search: '', status: '', document_type: '', issue_date_from: '', issue_date_to: '' })} className="inline-flex items-center gap-1 px-2 text-xs font-bold text-gray-400"><X size={14} /> Clear</button>}
        </div>

        {showFilters && <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <label className="agreement-field"><span>Status</span><select value={filters.status} onChange={e => setFilters(current => ({ ...current, status: e.target.value }))}><option value="">All statuses</option>{INVOICE_STATUSES.map(item => <option key={item}>{item}</option>)}</select></label>
          <label className="agreement-field"><span>Document</span><select value={filters.document_type} onChange={e => setFilters(current => ({ ...current, document_type: e.target.value }))}><option value="">All documents</option>{INVOICE_DOCUMENT_TYPES.map(item => <option key={item}>{item}</option>)}</select></label>
          <label className="agreement-field"><span>Issued from</span><input type="date" value={filters.issue_date_from} onChange={e => setFilters(current => ({ ...current, issue_date_from: e.target.value }))} /></label>
          <label className="agreement-field"><span>Issued to</span><input type="date" value={filters.issue_date_to} onChange={e => setFilters(current => ({ ...current, issue_date_to: e.target.value }))} /></label>
        </div>}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? <div className="flex h-64 items-center justify-center"><div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" /></div> : records.length === 0 ? (
            <div className="px-6 py-20 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600"><ReceiptText size={26} /></div><p className="mt-4 font-extrabold text-gray-950">No invoices yet</p><p className="mx-auto mt-1 max-w-md text-sm text-gray-400">Create an invoice from a confirmed agreement. Client, package, GST and payment data will be copied automatically.</p><Link href="/crm/invoices/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white"><Plus size={15} /> Create first invoice</Link></div>
          ) : <>
            <div className="hidden overflow-x-auto md:block"><table className="w-full text-sm"><thead><tr className="border-b border-gray-100 bg-gray-50/80">{['Invoice', 'Client', 'Document', 'Issued / due', 'Total', 'Balance', 'Status', ''].map(label => <th key={label} className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 first:pl-5">{label}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{records.map(item => { const status = effectiveInvoiceStatus(item); return <tr key={item.id} className="hover:bg-gray-50/70">
              <td className="px-5 py-4"><button onClick={() => router.push(`/crm/invoices/${item.id}`)} className="text-left"><p className="font-mono text-xs font-black text-gray-950">{item.invoice_number}</p><p className="mt-1 text-[10px] font-semibold text-gray-400">{item.agreement_number || 'Direct invoice'}</p></button></td>
              <td className="px-4 py-4"><p className="font-bold text-gray-900">{item.client_name}</p><p className="mt-0.5 text-xs text-gray-400">{item.mobile}</p></td><td className="px-4 py-4 text-xs font-semibold text-gray-600">{item.document_type}</td>
              <td className="px-4 py-4"><p className="font-semibold text-gray-700">{formatInvoiceDate(item.issue_date)}</p><p className="mt-0.5 text-xs text-gray-400">Due {formatInvoiceDate(item.due_date) || '—'}</p></td>
              <td className="px-4 py-4 font-extrabold text-gray-950">{currency(item.total_amount)}</td><td className="px-4 py-4 font-extrabold text-red-600">{currency(item.balance_due)}</td><td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${STATUS_STYLES[status]}`}>{status}</span></td>
              <td className="px-4 py-4"><div className="flex items-center gap-1"><button onClick={() => router.push(`/crm/invoices/${item.id}`)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-950"><ChevronRight size={16} /></button><button onClick={() => setDeleteTarget(item)} className="rounded-lg p-2 text-gray-300 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button></div></td>
            </tr>; })}</tbody></table></div>
            <div className="divide-y divide-gray-100 md:hidden">{records.map(item => { const status = effectiveInvoiceStatus(item); return <button key={item.id} onClick={() => router.push(`/crm/invoices/${item.id}`)} className="block w-full p-4 text-left hover:bg-gray-50"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[11px] font-black text-red-600">{item.invoice_number}</p><p className="mt-1 font-extrabold text-gray-950">{item.client_name}</p><p className="mt-1 text-[11px] text-gray-400">{item.document_type}</p></div><span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${STATUS_STYLES[status]}`}>{status}</span></div><div className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><span className="text-gray-400">Total</span><p className="mt-1 font-black text-gray-950">{currency(item.total_amount)}</p></div><div><span className="text-gray-400">Balance</span><p className="mt-1 font-black text-red-600">{currency(item.balance_due)}</p></div></div></button>; })}</div>
          </>}
        </div>
      </div>
      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete invoice" message={`Delete ${deleteTarget?.invoice_number}? Issued accounting documents should normally be cancelled rather than deleted.`} confirmLabel="Delete invoice" onConfirm={remove} onCancel={() => setDeleteTarget(null)} />
    </>
  );
}