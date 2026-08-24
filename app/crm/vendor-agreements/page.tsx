'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Ban, BadgeCheck, Copy, Eye, FileCheck2,
  Filter, MoreHorizontal, Pencil, Plus, Search, ShieldAlert, Star, Trash2, TrendingUp, X,
} from 'lucide-react';
import CrmHeader from '../components/CrmHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useSidebar } from '../sidebar-context';
import { deleteVendorAgreement, duplicateVendorAgreement, getVendorAgreements } from '../lib/supabase-crm';
import type { VendorAgreementFilters, VendorAgreementRecord, VendorAgreementStatus } from '../lib/types';
import {
  VENDOR_AGREEMENT_STATUSES, VENDOR_BLACKLIST_STATUSES, VENDOR_VERIFICATION_STATUSES,
  calculateVendorAgreementAmounts, currency, formatAgreementDate, isVendorAgreementExpiringSoon,
} from './vendor-agreement-config';
import TopPagination from '../../workspace/components/TopPagination';

const STATUS_STYLES: Record<VendorAgreementStatus, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Sent: 'bg-blue-50 text-blue-700',
  Signed: 'bg-violet-50 text-violet-700',
  Active: 'bg-emerald-50 text-emerald-700',
  Expired: 'bg-orange-50 text-orange-700',
  Terminated: 'bg-red-50 text-red-700',
  Cancelled: 'bg-red-50 text-red-700',
};

export default function VendorAgreementsPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const [agreements, setAgreements] = useState<VendorAgreementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<VendorAgreementRecord | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<VendorAgreementFilters>({ search: '', status: '', verification_status: '', blacklist_status: '', service_category: '' });

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
      setAgreements(await getVendorAgreements(filters));
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
    active: agreements.filter(item => item.status === 'Active').length,
    preferred: agreements.filter(item => item.preferred_vendor).length,
    flagged: agreements.filter(item => item.blacklist_status !== 'Active').length,
  }), [agreements]);
  const visible = agreements.slice((page - 1) * pageSize, page * pageSize);
  const activeFilters = [filters.status, filters.verification_status, filters.blacklist_status, filters.service_category].filter(Boolean).length;

  const clearFilters = () => setFilters({ search: '', status: '', verification_status: '', blacklist_status: '', service_category: '' });

  const duplicate = async (agreement: VendorAgreementRecord) => {
    const copy = await duplicateVendorAgreement(agreement.id);
    router.push(`/crm/vendor-agreements/${copy.id}/edit`);
  };

  const remove = async () => {
    if (!deleteTarget) return;
    await deleteVendorAgreement(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  return (
    <>
      <CrmHeader
        title="Vendor Agreements"
        subtitle="Onboard, contract and manage service vendors"
        onMenuClick={open}
        actions={<Link href="/crm/vendor-agreements/new" className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-700"><Plus size={15} /> <span className="hidden sm:inline">Create vendor agreement</span></Link>}
      />

      <div className="space-y-5 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Total vendor agreements', value: stats.total.toString(), icon: FileCheck2, tone: 'bg-gray-950 text-white' },
            { label: 'Active', value: stats.active.toString(), icon: TrendingUp, tone: 'bg-white text-gray-950' },
            { label: 'Preferred vendors', value: stats.preferred.toString(), icon: Star, tone: 'bg-white text-gray-950' },
            { label: 'Suspended / blacklisted', value: stats.flagged.toString(), icon: ShieldAlert, tone: 'bg-red-600 text-white' },
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
            <input value={filters.search} onChange={e => setFilters(current => ({ ...current, search: e.target.value }))} placeholder="Search number, vendor or mobile..."
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
            <label className="agreement-field"><span>Status</span><select value={filters.status} onChange={e => setFilters(current => ({ ...current, status: e.target.value }))}><option value="">All statuses</option>{VENDOR_AGREEMENT_STATUSES.map(item => <option key={item}>{item}</option>)}</select></label>
            <label className="agreement-field"><span>Verification</span><select value={filters.verification_status} onChange={e => setFilters(current => ({ ...current, verification_status: e.target.value }))}><option value="">All</option>{VENDOR_VERIFICATION_STATUSES.map(item => <option key={item}>{item}</option>)}</select></label>
            <label className="agreement-field"><span>Standing</span><select value={filters.blacklist_status} onChange={e => setFilters(current => ({ ...current, blacklist_status: e.target.value }))}><option value="">All</option>{VENDOR_BLACKLIST_STATUSES.map(item => <option key={item}>{item}</option>)}</select></label>
            <label className="agreement-field"><span>Service category</span><input value={filters.service_category} onChange={e => setFilters(current => ({ ...current, service_category: e.target.value }))} placeholder="e.g. Decor" /></label>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex h-60 items-center justify-center"><div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" /></div>
          ) : agreements.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600"><FileCheck2 size={25} /></div>
              <p className="mt-4 font-extrabold text-gray-950">No vendor agreements found</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-gray-400">Onboard your first vendor or adjust the active filters.</p>
              <Link href="/crm/vendor-agreements/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white"><Plus size={15} /> Create vendor agreement</Link>
            </div>
          ) : (
            <>
              <TopPagination page={page} pageSize={pageSize} total={agreements.length} label="vendor agreements" onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100 bg-gray-50/80">
                    {['Vendor Agreement', 'Vendor', 'Category', 'Validity', 'Value', 'Status', ''].map(label => <th key={label} className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 first:pl-5">{label}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {visible.map(item => {
                      const amounts = calculateVendorAgreementAmounts(item);
                      const expiringSoon = isVendorAgreementExpiringSoon(item.agreement_end_date);
                      return (
                      <tr key={item.id} className="group hover:bg-gray-50/70">
                        <td className="px-5 py-4"><button onClick={() => router.push(`/crm/vendor-agreements/${item.id}`)} className="text-left"><p className="font-mono text-xs font-black text-gray-950">{item.vendor_agreement_number}</p><p className="mt-1 text-[10px] font-semibold text-gray-400">Version {item.version}</p></button></td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5"><p className="font-bold text-gray-900">{item.vendor_name}</p>
                            {item.preferred_vendor && <Star size={12} className="text-amber-500" />}
                            {item.verification_status === 'Verified' && <BadgeCheck size={12} className="text-blue-500" />}
                            {item.blacklist_status !== 'Active' && <Ban size={12} className="text-red-500" />}
                          </div>
                          <p className="mt-0.5 text-xs text-gray-400">{item.mobile}</p>
                        </td>
                        <td className="px-4 py-4 text-xs font-semibold text-gray-600">{item.service_category || '—'}</td>
                        <td className="px-4 py-4">
                          <p className={`font-semibold ${expiringSoon ? 'text-amber-600' : 'text-gray-700'}`}>{formatAgreementDate(item.agreement_end_date) || '—'}</p>
                          {expiringSoon && <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-600">Expiring soon</p>}
                        </td>
                        <td className="px-4 py-4 font-extrabold text-gray-950">{currency(amounts.estimatedValue)}</td>
                        <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${STATUS_STYLES[item.status]}`}>{item.status}</span></td>
                        <td className="px-4 py-4">
                          <button onClick={event => openMenu(item.id, event)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"><MoreHorizontal size={16} /></button>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="divide-y divide-gray-100 md:hidden">
                {visible.map(item => (
                  <button key={item.id} onClick={() => router.push(`/crm/vendor-agreements/${item.id}`)} className="block w-full p-4 text-left hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[11px] font-black text-red-600">{item.vendor_agreement_number}</p><p className="mt-1 font-extrabold text-gray-950">{item.vendor_name}</p></div><span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${STATUS_STYLES[item.status]}`}>{item.status}</span></div>
                    <div className="mt-3 flex items-center justify-between text-xs"><span className="text-gray-500">{item.service_category || 'General'} · {formatAgreementDate(item.agreement_end_date)}</span><span className="font-black text-gray-950">{currency(calculateVendorAgreementAmounts(item).estimatedValue)}</span></div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog open={!!deleteTarget} title="Delete Vendor Agreement" message={`Delete ${deleteTarget?.vendor_agreement_number}? This removes the agreement and its local history.`} confirmLabel="Delete vendor agreement" onConfirm={remove} onCancel={() => setDeleteTarget(null)} />

      {menuTarget && menuPos && typeof document !== 'undefined' && createPortal(
        <div ref={menuRef} style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }} className="z-[70] w-44 rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xl">
          <Link href={`/crm/vendor-agreements/${menuTarget.id}`} onClick={() => setMenuId(null)} className="agreement-menu-item"><Eye size={14} /> Preview</Link>
          <Link href={`/crm/vendor-agreements/${menuTarget.id}/edit`} onClick={() => setMenuId(null)} className="agreement-menu-item"><Pencil size={14} /> Edit / revise</Link>
          <button onClick={() => { setMenuId(null); duplicate(menuTarget); }} className="agreement-menu-item w-full"><Copy size={14} /> Duplicate</button>
          <button onClick={() => { setMenuId(null); setDeleteTarget(menuTarget); }} className="agreement-menu-item w-full text-red-600"><Trash2 size={14} /> Delete</button>
        </div>,
        document.body
      )}
    </>
  );
}
