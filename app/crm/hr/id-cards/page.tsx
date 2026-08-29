'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, Loader2, Plus, RefreshCw, Search, Trash2, UserRound } from 'lucide-react';
import CrmHeader from '../../components/CrmHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useSidebar } from '../../sidebar-context';
import { useCrmProfile } from '../../lib/useCrmProfile';
import type { IdCardRecord, StaffRecord } from '../../lib/types';
import { deleteIdCard, getStaff, listIdCards } from './id-card-data';
import { formatAgreementDate, STATUS_STYLES } from './id-card-config';
import IdCardEditorModal from './components/IdCardEditorModal';
import BulkGenerateModal from './components/BulkGenerateModal';

function mergeCardsWithLiveStaff(cardList: IdCardRecord[], staffList: StaffRecord[]) {
  const staffById = new Map(staffList.map(staff => [staff.id, staff]));
  return cardList.map(card => ({ ...card, employee: staffById.get(card.employee_id) || card.employee }));
}

export default function IdCardsPage() {
  const { open } = useSidebar();
  const { profile } = useCrmProfile();

  const [cards, setCards] = useState<IdCardRecord[]>([]);
  const [staffCount, setStaffCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IdCardRecord | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [cardList, staffList] = await Promise.all([listIdCards(), getStaff()]);
      setCards(mergeCardsWithLiveStaff(cardList, staffList));
      setStaffCount(staffList.length);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load ID cards.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const departments = useMemo(() => Array.from(new Set(cards.map(c => c.employee?.department).filter(Boolean))) as string[], [cards]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cards.filter(c => {
      if (department && c.employee?.department !== department) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      if (!q) return true;
      return (
        c.employee?.full_name.toLowerCase().includes(q) ||
        c.employee?.employee_code.toLowerCase().includes(q) ||
        c.card_number.toLowerCase().includes(q)
      );
    });
  }, [cards, search, department, statusFilter]);

  const toggleSelected = (employeeId: string) => setSelected(current => {
    const next = new Set(current);
    if (next.has(employeeId)) next.delete(employeeId); else next.add(employeeId);
    return next;
  });

  const selectAllFiltered = () => setSelected(new Set(filtered.map(c => c.employee_id)));
  const clearSelection = () => setSelected(new Set());


  const selectedCards = cards.filter(c => selected.has(c.employee_id));

  const removeCard = async () => {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    try {
      await deleteIdCard(deleteTarget.employee_id, profile?.name || 'CRM User');
      setDeleteTarget(null);
      setSelected(current => {
        const next = new Set(current);
        next.delete(deleteTarget.employee_id);
        return next;
      });
      await load();
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <>
      <CrmHeader
        title="ID Cards"
        subtitle="Create, manage and generate employee ID cards"
        onMenuClick={open}
        actions={<Link href="/crm/hr" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15} /> <span className="hidden sm:inline">HR</span></Link>}
      />

      <div className="space-y-5 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name, employee ID, card number…"
                className="w-64 max-w-full rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-3 text-xs font-semibold text-gray-700 outline-none focus:border-red-400"
              />
            </div>
            <select value={department} onChange={e => setDepartment(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 outline-none focus:border-red-400">
              <option value="">All departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 outline-none focus:border-red-400">
              <option value="">All statuses</option>
              {['Draft', 'Generated', 'Active', 'Expired', 'Revoked'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-2">

            <button
              onClick={() => setBulkOpen(true)}
              disabled={!selected.size}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-600 hover:border-gray-300 disabled:opacity-40"
            >
              <RefreshCw size={14} /> A4 print sheet ({selected.size})
            </button>
            <button onClick={() => setEditingEmployeeId('__new__')} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white">
              <Plus size={15} /> <span className="hidden sm:inline">Create ID Card</span>
            </button>
          </div>
        </div>

        {loadError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{loadError}</div>
        )}

        {loading ? (
          <div className="flex h-56 items-center justify-center"><Loader2 size={26} className="animate-spin text-red-600" /></div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-400 shadow-sm">
            {cards.length === 0 ? `No ID cards yet — ${staffCount} staff available to issue one for.` : 'No cards match your filters.'}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b bg-gray-50/80 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <tr>
                    <th className="px-4 py-3.5">
                      <input type="checkbox" className="h-3.5 w-3.5 accent-red-600" checked={selected.size > 0 && selected.size === filtered.length} onChange={e => (e.target.checked ? selectAllFiltered() : clearSelection())} />
                    </th>
                    <th className="px-4 py-3.5">Employee</th>
                    <th className="px-4 py-3.5">Employee ID</th>
                    <th className="px-4 py-3.5">Department</th>
                    <th className="px-4 py-3.5">Designation</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Last generated</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(card => (
                    <tr key={card.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input type="checkbox" className="h-3.5 w-3.5 accent-red-600" checked={selected.has(card.employee_id)} onChange={() => toggleSelected(card.employee_id)} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                            {card.front_snapshot?.photo_url || card.employee?.photo_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={card.front_snapshot?.photo_url || card.employee?.photo_url || ''} alt={card.employee?.full_name || 'Staff member'} className="h-full w-full object-cover" loading="lazy" />
                            ) : <UserRound size={14} className="text-gray-300" />}
                          </span>
                          <span className="font-bold text-gray-900">{card.employee?.full_name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-bold text-gray-700">{card.employee?.employee_code}</td>
                      <td className="px-4 py-3 text-gray-600">{card.employee?.department}</td>
                      <td className="px-4 py-3 text-gray-600">{card.employee?.job_title || card.employee?.designation}</td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${STATUS_STYLES[card.status]}`}>{card.status}</span></td>
                      <td className="px-4 py-3 text-gray-500">{card.generated_at ? formatAgreementDate(card.generated_at.slice(0, 10)) : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => setEditingEmployeeId(card.employee_id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-900" title="Preview / Edit"><Eye size={14} /></button>
                          <button onClick={() => setDeleteTarget(card)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {editingEmployeeId && (
        <IdCardEditorModal
          employeeId={editingEmployeeId === '__new__' ? null : editingEmployeeId}
          onClose={() => setEditingEmployeeId(null)}
          onSaved={() => { setEditingEmployeeId(null); load(); }}
        />
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete ID card"
        message={`Delete the ID card for ${deleteTarget?.employee?.full_name || 'this employee'}? This removes every generated version and its stored PDFs — this cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteBusy}
        onConfirm={removeCard}
        onCancel={() => setDeleteTarget(null)}
      />
      {bulkOpen && (
        <BulkGenerateModal
          cards={selectedCards}
          onClose={() => setBulkOpen(false)}
          onDone={() => { setBulkOpen(false); clearSelection(); load(); }}
        />
      )}
    </>
  );
}
