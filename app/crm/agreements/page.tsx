'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CalendarDays, CircleDollarSign, Copy, Eye, FileCheck2,
  Filter, MoreHorizontal, Pencil, Plus, Search, Send, Trash2, X,
} from 'lucide-react';
import CrmHeader from '../components/CrmHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useSidebar } from '../sidebar-context';
import { deleteAgreement, duplicateAgreement, getAgreements } from '../lib/supabase-crm';
import type { AgreementFilters, AgreementRecord, AgreementStatus } from '../lib/types';
import { AGREEMENT_PACKAGES, AGREEMENT_STATUSES, currency, formatAgreementDate } from './agreement-config';
import TopPagination from '../../workspace/components/TopPagination';

const STATUS_STYLES: Record<AgreementStatus, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Sent: 'bg-blue-50 text-blue-700',
  Signed: 'bg-violet-50 text-violet-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-red-50 text-red-700',
};

export default function AgreementsPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const [agreements, setAgreements] = useState<AgreementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<AgreementRecord | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<AgreementFilters>({ search: '', status: '', package_name: '', event_date_from: '', event_date_to: '' });

  // The row menu renders in a portal at document.body, positioned with
  // `fixed` coordinates computed from the trigger button — this lets it
  // float above every card/table (no more getting clipped by the list
  // card's rounded-corner container) and always land on top regardless of
  // scroll position.
  const openMenu = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (menuId === id) { setMenuId(null); return; }
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 176;
    const menuHeight = 190;
    let top = rect.bottom + 6;
    let left = rect.right - menuWidth;
    if (top + menuHeight > window.innerHeight - 12) top = rect.top - menuHeight - 6;
    if (left < 12) left = 12;
    if (left + menuWidth > window.innerWidth - 12) left = window.innerWidth - menuWidth - 12;
    setMenuPos({ top, left });
    setMenuId(id);
  };

  // Clicking anywhere outside the open menu (or scrolling/resizing, which
  // would leave it floating over the wrong row) closes it.
  useEffect(() => {
    if (!menuId) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuId(null);
    };
    const closeOnScrollOrResize = () => setMenuId(null);
    document.addEventListener('mousedown', closeOnOutsideClick);
    window.addEventListener('scroll', closeOnScrollOrResize, true);
    window.addEventListener('resize', closeOnScrollOrResize);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      window.removeEventListener('scroll', closeOnScrollOrResize, true);
      window.removeEventListener('resize', closeOnScrollOrResize);
    };
  }, [menuId]);

  const menuTarget = agreements.find(item => item.id === menuId) || null;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAgreements(await getAgreements(filters));
      setPage(1);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = window.setTimeout(load, 250);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const stats = useMemo(() => ({
    total: agreements.length,
    awaiting: agreements.filter(item => item.status === 'Sent').length,
    signed: agreements.filter(item => item.status === 'Signed' || item.status === 'Completed').length,
    value: agreements.filter(item => item.status !== 'Cancelled').reduce((sum, item) => sum + item.final_amount, 0),
  }), [agreements]);
  const visible = agreements.slice((page - 1) * pageSize, page * pageSize);
  const activeFilters = [filters.status, filters.package_name, filters.event_date_from, filters.event_date_to].filter(Boolean).length;

  const clearFilters = () => setFilters({ search: '', status: '', package_name: '', event_date_from: '', event_date_to: '' });

  const duplicate = async (agreement: AgreementRecord) => {
    const copy = await duplicateAgreement(agreement.id);
    router.push(`/crm/agreements/${copy.id}/edit`);
  };

  const remove = async () => {
    if (!deleteTarget) return;
    await deleteAgreement(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  return (
    <>
      <CrmHeader
        title="Baraat Management Contracts"
        subtitle="Create, issue and manage signature-ready agreements"
        onMenuClick={open}
        actions={<Link href="/crm/agreements/new" className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-700"><Plus size={15} /> <span className="hidden sm:inline">Create agreement</span></Link>}
      />

      <div className="space-y-5 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Total agreements', value: stats.total.toString(), icon: FileCheck2, tone: 'bg-gray-950 text-white' },
            { label: 'Awaiting signature', value: stats.awaiting.toString(), icon: Send, tone: 'bg-white text-gray-950' },
            { label: 'Signed / completed', value: stats.signed.toString(), icon: CalendarDays, tone: 'bg-white text-gray-950' },
            { label: 'Active value', value: currency(stats.value), icon: CircleDollarSign, tone: 'bg-red-600 text-white' },
          ].map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className={`rounded-2xl border border-gray-200 p-4 shadow-sm sm:p-5 ${tone}`}>
              <div className="flex items-center justify-between gap-2"><p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{label}</p><Icon size={16} className="opacity-60" /></div>
              <p className="mt-4 truncate text-xl font-black tracking-tight sm:text-2xl">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={filters.search} onChange={e => setFilters(current => ({ ...current, search: e.target.value }))} placeholder="Search number, client, mobile or venue..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-50" />
          </div>
          <button type="button" onClick={() => setShowFilters(current => !current)} className={`relative inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold ${showFilters ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-600'}`}>
            <Filter size={15} /> Filters
            {activeFilters > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] text-white">{activeFilters}</span>}
          </button>
          {activeFilters > 0 && <button onClick={clearFilters} className="inline-flex items-center gap-1 px-2 text-xs font-bold text-gray-400 hover:text-red-600"><X size={14} /> Clear</button>}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            <label className="agreement-field"><span>Status</span><select value={filters.status} onChange={e => setFilters(current => ({ ...current, status: e.target.value }))}><option value="">All statuses</option>{AGREEMENT_STATUSES.map(item => <option key={item}>{item}</option>)}</select></label>
            <label className="agreement-field"><span>Package</span><select value={filters.package_name} onChange={e => setFilters(current => ({ ...current, package_name: e.target.value }))}><option value="">All packages</option>{AGREEMENT_PACKAGES.map(item => <option key={item}>{item}</option>)}</select></label>
            <label className="agreement-field"><span>Event from</span><input type="date" value={filters.event_date_from} onChange={e => setFilters(current => ({ ...current, event_date_from: e.target.value }))} /></label>
            <label className="agreement-field"><span>Event to</span><input type="date" value={filters.event_date_to} onChange={e => setFilters(current => ({ ...current, event_date_to: e.target.value }))} /></label>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex h-60 items-center justify-center"><div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" /></div>
          ) : agreements.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600"><FileCheck2 size={25} /></div>
              <p className="mt-4 font-extrabold text-gray-950">No agreements found</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-gray-400">Create your first client agreement or adjust the active filters.</p>
              <Link href="/crm/agreements/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white"><Plus size={15} /> Create agreement</Link>
            </div>
          ) : (
            <>
              <TopPagination page={page} pageSize={pageSize} total={agreements.length} label="agreements" onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100 bg-gray-50/80">
                    {['Agreement', 'Client', 'Event', 'Package', 'Value', 'Status', ''].map(label => <th key={label} className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 first:pl-5">{label}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {visible.map(item => (
                      <tr key={item.id} className="group hover:bg-gray-50/70">
                        <td className="px-5 py-4"><button onClick={() => router.push(`/crm/agreements/${item.id}`)} className="text-left"><p className="font-mono text-xs font-black text-gray-950">{item.agreement_number}</p><p className="mt-1 text-[10px] font-semibold text-gray-400">Version {item.version}</p></button></td>
                        <td className="px-4 py-4"><p className="font-bold text-gray-900">{item.client_name}</p><p className="mt-0.5 text-xs text-gray-400">{item.mobile}</p></td>
                        <td className="px-4 py-4"><p className="font-semibold text-gray-700">{formatAgreementDate(item.event_date) || '—'}</p><p className="mt-0.5 max-w-[160px] truncate text-xs text-gray-400">{item.venue || 'Venue pending'}</p></td>
                        <td className="px-4 py-4 text-xs font-semibold text-gray-600">{item.package_name}</td>
                        <td className="px-4 py-4 font-extrabold text-gray-950">{currency(item.final_amount)}</td>
                        <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${STATUS_STYLES[item.status]}`}>{item.status}</span></td>
                        <td className="px-4 py-4">
                          <button onClick={event => openMenu(item.id, event)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"><MoreHorizontal size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="divide-y divide-gray-100 md:hidden">
                {visible.map(item => (
                  <button key={item.id} onClick={() => router.push(`/crm/agreements/${item.id}`)} className="block w-full p-4 text-left hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[11px] font-black text-red-600">{item.agreement_number}</p><p className="mt-1 font-extrabold text-gray-950">{item.client_name}</p></div><span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${STATUS_STYLES[item.status]}`}>{item.status}</span></div>
                    <div className="mt-3 flex items-center justify-between text-xs"><span className="text-gray-500">{formatAgreementDate(item.event_date)} · {item.package_name}</span><span className="font-black text-gray-950">{currency(item.final_amount)}</span></div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog open={!!deleteTarget} title="Delete Agreement" message={`Delete ${deleteTarget?.agreement_number}? This removes the agreement and its local history.`} confirmLabel="Delete agreement" onConfirm={remove} onCancel={() => setDeleteTarget(null)} />

      {menuTarget && menuPos && typeof document !== 'undefined' && createPortal(
        <div ref={menuRef} style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }} className="z-[70] w-44 rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xl">
          <Link href={`/crm/agreements/${menuTarget.id}`} onClick={() => setMenuId(null)} className="agreement-menu-item"><Eye size={14} /> Preview</Link>
          <Link href={`/crm/agreements/${menuTarget.id}/edit`} onClick={() => setMenuId(null)} className="agreement-menu-item"><Pencil size={14} /> Edit / revise</Link>
          <button onClick={() => { setMenuId(null); duplicate(menuTarget); }} className="agreement-menu-item w-full"><Copy size={14} /> Duplicate</button>
          <button onClick={() => { setMenuId(null); setDeleteTarget(menuTarget); }} className="agreement-menu-item w-full text-red-600"><Trash2 size={14} /> Delete</button>
        </div>,
        document.body
      )}
    </>
  );
}
