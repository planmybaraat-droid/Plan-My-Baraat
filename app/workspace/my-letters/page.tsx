'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, FileText, Search } from 'lucide-react';
import CrmHeader from '../../crm/components/CrmHeader';
import { useSidebar } from '../../crm/sidebar-context';
import type { EmployeeLetterRecord } from '../../crm/lib/types';
import { getMyLetters } from '../lib/my-letters-data';

const STATUS_STYLE: Record<string, string> = {
  Generated: 'bg-emerald-50 text-emerald-700', Sent: 'bg-blue-50 text-blue-700', Archived: 'bg-gray-100 text-gray-600',
};

function letterLabel(type: string) {
  return type.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export default function MyLettersPage() {
  const { open } = useSidebar();
  const [letters, setLetters] = useState<EmployeeLetterRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyLetters().then(setLetters).catch((cause) => setError(cause instanceof Error ? cause.message : 'Could not load your letters.')).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return letters;
    return letters.filter((letter) => `${letter.letter_number} ${letterLabel(letter.letter_type)} ${letter.status}`.toLowerCase().includes(term));
  }, [letters, search]);

  return (
    <>
      <CrmHeader title="My Letters" subtitle={`${letters.length} letter${letters.length === 1 ? '' : 's'} issued to you`} onMenuClick={open} notificationsHref="/workspace/notifications" />
      <div className="space-y-4 p-4 sm:p-6">
        <div className="relative max-w-xl">
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by letter type or reference number" className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-50" />
        </div>

        {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex h-64 items-center justify-center"><span className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" /></div>
          ) : !filtered.length ? (
            <div className="px-5 py-20 text-center"><FileText className="mx-auto text-red-600" size={30} /><p className="mt-4 font-black text-gray-950">{search ? 'No matching letters' : 'No letters issued yet'}</p><p className="mx-auto mt-1 max-w-md text-sm text-gray-400">{search ? 'Try a different reference number or letter type.' : 'Letters generated for your staff profile will appear here.'}</p></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((letter) => (
                <Link key={letter.id} href={`/workspace/my-letters/${letter.id}`} className="group flex items-center gap-3 px-4 py-4 transition hover:bg-gray-50 sm:px-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><FileText size={18} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-black text-gray-950 group-hover:text-red-600">{letterLabel(letter.letter_type)}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400"><span className="font-mono">{letter.letter_number}</span><span className="hidden sm:inline">·</span><span className="inline-flex items-center gap-1"><CalendarDays size={12} />{new Date(letter.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></span>
                  </span>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${STATUS_STYLE[letter.status] || 'bg-gray-100 text-gray-600'}`}>{letter.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
