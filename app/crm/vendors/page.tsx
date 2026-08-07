'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Filter, Eye, Pencil, Trash2, Loader2, X } from 'lucide-react';
import CrmHeader from '../components/CrmHeader';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { useSidebar } from '../sidebar-context';
import { getVendors, deleteVendor, getCities, getCategories } from '../lib/supabase-crm';
import type { Vendor, City, Category, VendorFilters, CrmStatus } from '../lib/types';

const STATUSES: CrmStatus[] = ['New', 'Contacted', 'Interested', 'Converted', 'Lost'];

export default function VendorsPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Vendor | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState<VendorFilters>({ search: '', city_id: '', category_id: '', status: '' });
  const [showFilters, setShowFilters] = useState(false);

  const loadVendors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVendors(filters);
      setVendors(data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    async function init() {
      const [c, cat] = await Promise.all([getCities(), getCategories()]);
      setCities(c); setCategories(cat);
    }
    init();
  }, []);

  useEffect(() => { loadVendors(); }, [loadVendors]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteVendor(deleteTarget.id);
      setVendors(v => v.filter(x => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => setFilters({ search: '', city_id: '', category_id: '', status: '' });
  const activeFilters = [filters.city_id, filters.category_id, filters.status].filter(Boolean).length;

  return (
    <>
      <CrmHeader
        title="Vendors"
        subtitle={`${vendors.length} vendor${vendors.length !== 1 ? 's' : ''} found`}
        onMenuClick={open}
        actions={
          <Link
            href="/crm/vendors/new"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Add Vendor</span>
          </Link>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Search + Filter bar */}
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              type="text"
              placeholder="Search vendors..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm border rounded-lg font-medium transition-colors relative
              ${showFilters ? 'border-red-400 text-red-600 bg-red-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <Filter size={16} /> Filters
            {activeFilters > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>
          {activeFilters > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2.5 text-xs text-gray-500 hover:text-red-600 transition-colors">
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">City</label>
              <select value={filters.city_id} onChange={e => setFilters(f => ({ ...f, city_id: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30">
                <option value="">All Cities</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
              <select value={filters.category_id} onChange={e => setFilters(f => ({ ...f, category_id: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
              <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30">
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 size={28} className="animate-spin text-red-500" />
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🏢</p>
              <p className="font-medium text-gray-600">No vendors found</p>
              <p className="text-sm mt-1">Try adjusting your filters or add a new vendor</p>
              <Link href="/crm/vendors/new" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                <Plus size={16} /> Add Vendor
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">City</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3.5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {vendors.map(v => (
                      <tr key={v.id} className="hover:bg-gray-50/70 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-red-700 text-xs font-bold">{v.company_name[0]}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{v.company_name}</p>
                              <p className="text-xs text-gray-400">{v.mobile}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">{v.contact_person}</td>
                        <td className="px-4 py-4 text-gray-600">{(v.city as { name?: string } | null)?.name ?? '—'}</td>
                        <td className="px-4 py-4 text-gray-600">{(v.category as { name?: string } | null)?.name ?? '—'}</td>
                        <td className="px-4 py-4"><StatusBadge status={v.status} /></td>
                        <td className="px-4 py-4 text-gray-400 text-xs">
                          {new Date(v.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => router.push(`/crm/vendors/${v.id}`)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                              <Eye size={15} />
                            </button>
                            <button onClick={() => router.push(`/crm/vendors/${v.id}/edit`)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => setDeleteTarget(v)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {vendors.map(v => (
                  <div key={v.id} className="p-4" onClick={() => router.push(`/crm/vendors/${v.id}`)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-red-700 text-sm font-bold">{v.company_name[0]}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{v.company_name}</p>
                          <p className="text-xs text-gray-400">{v.contact_person} · {v.mobile}</p>
                        </div>
                      </div>
                      <StatusBadge status={v.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-4 mt-2 pl-13 text-xs text-gray-400">
                      <span>{(v.city as { name?: string } | null)?.name ?? '—'}</span>
                      <span>·</span>
                      <span>{(v.category as { name?: string } | null)?.name ?? '—'}</span>
                    </div>
                    <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                      <button onClick={() => router.push(`/crm/vendors/${v.id}/edit`)} className="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Edit</button>
                      <button onClick={() => setDeleteTarget(v)} className="flex-1 py-1.5 text-xs border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Vendor"
        message={`Are you sure you want to delete "${deleteTarget?.company_name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
