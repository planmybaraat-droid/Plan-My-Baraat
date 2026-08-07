'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Filter, Eye, Pencil, Trash2, Loader2, X, Calendar } from 'lucide-react';
import CrmHeader from '../components/CrmHeader';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { useSidebar } from '../sidebar-context';
import { getLeads, updateLead, deleteLead, getCities, crmSupabase } from '../lib/supabase-crm';
import type { CustomerLead, City, LeadFilters, CrmStatus } from '../lib/types';

const STATUSES: CrmStatus[] = ['New', 'Contacted', 'Interested', 'Converted', 'Lost'];

export default function LeadsPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const [leads, setLeads] = useState<CustomerLead[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [staffOptions, setStaffOptions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<CustomerLead | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState<LeadFilters>({ search: '', city_id: '', status: '', event_date_from: '', event_date_to: '' });
  const [showFilters, setShowFilters] = useState(false);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeads(filters);
      setLeads(data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { getCities().then(setCities).catch(console.error); }, []);
  useEffect(() => { loadLeads(); }, [loadLeads]);
  useEffect(() => { crmSupabase.from('crm_users').select('id, full_name').then(({ data }) => setStaffOptions((data || []).map(r => ({ id: r.id, name: r.full_name || 'Staff' })))); }, []);

  const assign = async (lead: CustomerLead, staffId: string) => {
    const updated = await updateLead(lead.id, { assigned_to: staffId || null });
    setLeads(current => current.map(l => (l.id === lead.id ? { ...l, assigned_to: updated.assigned_to } : l)));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteLead(deleteTarget.id);
      setLeads(l => l.filter(x => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => setFilters({ search: '', city_id: '', status: '', event_date_from: '', event_date_to: '' });
  const activeFilters = [filters.city_id, filters.status, filters.event_date_from, filters.event_date_to].filter(Boolean).length;

  return (
    <>
      <CrmHeader
        title="Customer Leads"
        subtitle={`${leads.length} lead${leads.length !== 1 ? 's' : ''} found`}
        onMenuClick={open}
        actions={
          <Link
            href="/crm/leads/new"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Add Lead</span>
          </Link>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Search + Filter */}
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              type="text"
              placeholder="Search leads..."
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

        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">City</label>
              <select value={filters.city_id} onChange={e => setFilters(f => ({ ...f, city_id: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30">
                <option value="">All Cities</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Event From</label>
              <input type="date" value={filters.event_date_from} onChange={e => setFilters(f => ({ ...f, event_date_from: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Event To</label>
              <input type="date" value={filters.event_date_to} onChange={e => setFilters(f => ({ ...f, event_date_to: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30" />
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 size={28} className="animate-spin text-red-500" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-medium text-gray-600">No leads found</p>
              <p className="text-sm mt-1">Try adjusting filters or add a new lead</p>
              <Link href="/crm/leads/new" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                <Plus size={16} /> Add Lead
              </Link>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">City</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Date</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Requirement</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned to</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3.5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {leads.map(l => (
                      <tr key={l.id} className="hover:bg-gray-50/70 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-700 text-xs font-bold">{l.customer_name[0]}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{l.customer_name}</p>
                              <p className="text-xs text-gray-400">{l.mobile}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">{(l.city as { name?: string } | null)?.name ?? '—'}</td>
                        <td className="px-4 py-4">
                          {l.event_date ? (
                            <span className="flex items-center gap-1.5 text-gray-600">
                              <Calendar size={13} className="text-red-400" />
                              {new Date(l.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-4 text-gray-500 max-w-[180px]">
                          <span className="truncate block">{l.requirement ?? '—'}</span>
                        </td>
                        <td className="px-4 py-4"><StatusBadge status={l.status} /></td>
                        <td className="px-4 py-4">
                          <select value={l.assigned_to || ''} onChange={e => assign(l, e.target.value)} className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs">
                            <option value="">Unassigned</option>
                            {staffOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-4 text-gray-400 text-xs">
                          {new Date(l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => router.push(`/crm/leads/${l.id}`)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Eye size={15} /></button>
                            <button onClick={() => router.push(`/crm/leads/${l.id}/edit`)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"><Pencil size={15} /></button>
                            <button onClick={() => setDeleteTarget(l)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-gray-100">
                {leads.map(l => (
                  <div key={l.id} className="p-4" onClick={() => router.push(`/crm/leads/${l.id}`)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-700 text-sm font-bold">{l.customer_name[0]}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{l.customer_name}</p>
                          <p className="text-xs text-gray-400">{l.mobile}</p>
                        </div>
                      </div>
                      <StatusBadge status={l.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{(l.city as { name?: string } | null)?.name ?? '—'}</span>
                      {l.event_date && <><span>·</span><span className="flex items-center gap-1"><Calendar size={11} />{new Date(l.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></>}
                    </div>
                    <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                      <button onClick={() => router.push(`/crm/leads/${l.id}/edit`)} className="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Edit</button>
                      <button onClick={() => setDeleteTarget(l)} className="flex-1 py-1.5 text-xs border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors">Delete</button>
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
        title="Delete Lead"
        message={`Delete lead for "${deleteTarget?.customer_name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
