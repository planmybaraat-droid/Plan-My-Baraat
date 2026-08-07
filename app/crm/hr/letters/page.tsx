'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Archive, Download, Eye, Loader2, Pencil, Trash2 } from 'lucide-react';
import CrmHeader from '../../components/CrmHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useSidebar } from '../../sidebar-context';
import type { EmployeeLetterRecord, LetterTemplate } from '../../lib/types';
import { deleteEmployeeLetter, getEmployeeLetters, getLetterTemplates, setEmployeeLetterStatus } from '../hr-data';
import { formatAgreementDate, letterIcon } from '../hr-config';

const CATEGORY_ORDER = ['Onboarding', 'Compensation', 'Compliance', 'Exit'];

const STATUS_STYLES: Record<string, string> = {
  Generated: 'bg-emerald-50 text-emerald-700',
  Sent: 'bg-blue-50 text-blue-700',
  Archived: 'bg-gray-100 text-gray-500',
};

export default function LettersHomePage() {
  const { open } = useSidebar();
  const [templates, setTemplates] = useState<LetterTemplate[]>([]);
  const [letters, setLetters] = useState<EmployeeLetterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<EmployeeLetterRecord | null>(null);
  const [busy, setBusy] = useState('');

  const load = async () => {
    const [templateList, letterList] = await Promise.all([getLetterTemplates(), getEmployeeLetters()]);
    setTemplates(templateList);
    setLetters(letterList);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, LetterTemplate[]>();
    templates.forEach(template => {
      if (!map.has(template.category)) map.set(template.category, []);
      map.get(template.category)!.push(template);
    });
    return CATEGORY_ORDER.filter(cat => map.has(cat)).map(category => ({ category, items: map.get(category)! }));
  }, [templates]);

  const templateLabel = (type: string) => templates.find(t => t.letter_type === type)?.label || type;

  const lettersByType = useMemo(() => {
    const map = new Map<string, EmployeeLetterRecord[]>();
    letters.forEach(letter => {
      if (!map.has(letter.letter_type)) map.set(letter.letter_type, []);
      map.get(letter.letter_type)!.push(letter);
    });
    // order groups the same way as the "generate" gallery: category order, then template order within it.
    const orderedTypes = grouped.flatMap(g => g.items.map(item => item.letter_type));
    return orderedTypes
      .filter(type => map.has(type))
      .map(type => ({ type, label: templateLabel(type), items: map.get(type)! }));
  }, [letters, grouped]); // eslint-disable-line react-hooks/exhaustive-deps

  const archive = async (letter: EmployeeLetterRecord) => {
    setBusy(letter.id);
    await setEmployeeLetterStatus(letter.id, letter.status === 'Archived' ? 'Generated' : 'Archived');
    await load();
    setBusy('');
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setBusy(deleteTarget.id);
    await deleteEmployeeLetter(deleteTarget.id);
    setDeleteTarget(null);
    await load();
    setBusy('');
  };

  return (
    <>
      <CrmHeader
        title="Letters"
        subtitle="Generate and manage employee letters"
        onMenuClick={open}
        actions={<Link href="/crm/hr" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15} /> <span className="hidden sm:inline">HR</span></Link>}
      />

      <div className="space-y-8 p-4 sm:p-6">
        {loading ? (
          <div className="flex h-56 items-center justify-center"><Loader2 size={26} className="animate-spin text-red-600" /></div>
        ) : (
          <>
            {grouped.map(({ category, items }) => (
              <div key={category}>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-red-600">{category}</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map(template => {
                    const Icon = letterIcon(template.icon);
                    return (
                      <Link key={template.letter_type} href={`/crm/hr/letters/new?type=${template.letter_type}`} className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><Icon size={19} /></span>
                          <span className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-red-600">→</span>
                        </div>
                        <p className="mt-4 text-sm font-black text-gray-950">{template.label}</p>
                        <p className="mt-1 text-xs leading-5 text-gray-500">{template.description}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-red-600">Generated letters — by type</p>
              {letters.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-400 shadow-sm">No letters generated yet.</div>
              ) : (
                <div className="space-y-6">
                  {lettersByType.map(({ type, label, items }) => (
                    <div key={type} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-4 py-3">
                        <p className="text-xs font-black text-gray-900">{label}</p>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gray-400 ring-1 ring-gray-200">{items.length}</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                          <thead className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                            <tr><th className="px-4 py-2.5">Letter</th><th className="px-4 py-2.5">Employee</th><th className="px-4 py-2.5">Date</th><th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5 text-right">Actions</th></tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {items.map(letter => (
                              <tr key={letter.id}>
                                <td className="px-4 py-3 font-mono text-xs font-bold text-gray-900">{letter.letter_number}</td>
                                <td className="px-4 py-3 font-semibold text-gray-800">{letter.employee?.full_name || '—'}</td>
                                <td className="px-4 py-3 text-gray-500">{formatAgreementDate(letter.created_at.slice(0, 10))}</td>
                                <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${STATUS_STYLES[letter.status] || 'bg-gray-100 text-gray-500'}`}>{letter.status}</span></td>
                                <td className="px-4 py-3">
                                  <div className="flex justify-end gap-1.5">
                                    <Link href={`/crm/hr/letters/${letter.id}`} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-900" title="Preview"><Eye size={14} /></Link>
                                    <Link href={`/crm/hr/letters/${letter.id}/edit`} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-900" title="Edit"><Pencil size={14} /></Link>
                                    {letter.file_url && <a href={letter.file_url} download className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-900" title="Download"><Download size={14} /></a>}
                                    <button onClick={() => archive(letter)} disabled={busy === letter.id} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-900" title={letter.status === 'Archived' ? 'Unarchive' : 'Archive'}><Archive size={14} /></button>
                                    <button onClick={() => setDeleteTarget(letter)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete letter"
        message={`Delete ${deleteTarget?.letter_number}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
