'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { Search, Filter, Trash2, Loader2, X, MessageSquare, ChevronRight } from 'lucide-react';
import CrmHeader from '../components/CrmHeader';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { useSidebar } from '../sidebar-context';
import { getBaraatEnquiries, deleteBaraatEnquiry, updateBaraatEnquiryStatus } from '../lib/supabase-crm';
import type { BaraatEnquiry, BaraatEnquiryFilters, CrmStatus } from '../lib/types';

const STATUSES: CrmStatus[] = ['New', 'Contacted', 'Interested', 'Converted', 'Lost'];

export default function BaraatLeadsPage() {
  const { open } = useSidebar();
  const [enquiries, setEnquiries] = useState<BaraatEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<BaraatEnquiry | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState<BaraatEnquiryFilters>({ search: '', status: '' });
  const [showFilters, setShowFilters] = useState(false);

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getBaraatEnquiries(filters);
      setEnquiries(data);
    } catch (loadError) {
      setEnquiries([]);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load Baraat enquiries.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadEnquiries(); }, [loadEnquiries]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBaraatEnquiry(deleteTarget.id);
      setEnquiries(e => e.filter(x => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete this enquiry.');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (id: string, status: CrmStatus) => {
    const previousStatus = enquiries.find(enquiry => enquiry.id === id)?.status;
    setEnquiries(e => e.map(x => x.id === id ? { ...x, status } : x));
    try {
      await updateBaraatEnquiryStatus(id, status);
    } catch (statusError) {
      if (previousStatus) {
        setEnquiries(e => e.map(x => x.id === id ? { ...x, status: previousStatus } : x));
      }
      setError(statusError instanceof Error ? statusError.message : 'Unable to update this enquiry.');
    }
  };

  const clearFilters = () => setFilters({ search: '', status: '' });
  const activeFilters = [filters.status].filter(Boolean).length;

  return (
    <>
      <CrmHeader
        title="Baraat Enquiries"
        subtitle={`${enquiries.length} enquir${enquiries.length !== 1 ? 'ies' : 'y'} found`}
        onMenuClick={open}
      />

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              type="text"
              placeholder="Search enquiries..."
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
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
              <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30">
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 size={28} className="animate-spin text-red-500" />
            </div>
          ) : error ? (
            <div className="px-5 py-12 text-center">
              <MessageSquare size={36} className="mx-auto mb-3 text-red-300" />
              <p className="font-semibold text-gray-900">Baraat enquiries are unavailable</p>
              <p className="mx-auto mt-1 max-w-xl text-sm leading-6 text-gray-500">{error}</p>
              <button onClick={loadEnquiries} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                Try again
              </button>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <MessageSquare size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-600">No baraat package enquiries yet</p>
              <p className="text-sm mt-1">Submissions from the homepage package cards will appear here.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Date</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Package</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead Details</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Received</th>
                      <th className="px-4 py-3.5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {enquiries.map(e => (
                      <tr key={e.id} className="hover:bg-gray-50/70 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-amber-700 text-xs font-bold">{e.customer_name?.[0] ?? '?'}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{e.customer_name}</p>
                              <p className="text-xs text-gray-400">{e.mobile}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {e.event_date ? new Date(e.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                        </td>
                        <td className="px-4 py-4 text-gray-600 font-medium">{e.package_name}</td>
                        <td className="px-4 py-4 text-xs text-gray-500 max-w-[280px]">
                          <p className="line-clamp-3 whitespace-pre-line">{e.remarks || 'No extra details'}</p>
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={e.status}
                            onChange={ev => handleStatusChange(e.id, ev.target.value as CrmStatus)}
                            className="text-xs border-none bg-transparent focus:outline-none cursor-pointer"
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <StatusBadge status={e.status} />
                        </td>
                        <td className="px-4 py-4 text-gray-400 text-xs">
                          {new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/crm/baraat-leads/${e.id}`}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="View details"
                            >
                              <ChevronRight size={15} />
                            </Link>
                            <button onClick={() => setDeleteTarget(e)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-gray-100">
                {enquiries.map(e => (
                  <div key={e.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-amber-700 text-sm font-bold">{e.customer_name?.[0] ?? '?'}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{e.customer_name}</p>
                          <p className="text-xs text-gray-400">{e.mobile}</p>
                        </div>
                      </div>
                      <StatusBadge status={e.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{e.event_date ? new Date(e.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}</span>
                      <span>·</span>
                      <span>{e.package_name}</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-gray-500 whitespace-pre-line">{e.remarks || 'No extra details'}</p>
                    <div className="flex gap-2 mt-3">
                      <Link href={`/crm/baraat-leads/${e.id}`} className="flex-1 py-1.5 text-center text-xs border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">View</Link>
                      <button onClick={() => setDeleteTarget(e)} className="flex-1 py-1.5 text-xs border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors">Delete</button>
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
        title="Delete Enquiry"
        message={`Delete enquiry from "${deleteTarget?.customer_name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
