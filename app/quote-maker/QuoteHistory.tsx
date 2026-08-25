'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, FileText, IndianRupee, Loader2, Phone, Plus, RefreshCw, Search } from 'lucide-react';
import type { QuoteMakerQuote } from './quote-types';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value) || 0);

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

interface QuoteHistoryProps {
  onCreateNew: () => void;
  refreshKey: number;
}

export default function QuoteHistory({ onCreateNew, refreshKey }: QuoteHistoryProps) {
  const [quotes, setQuotes] = useState<QuoteMakerQuote[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (search) params.set('search', search);
      const response = await fetch(`/quote-maker/api/quotes?${params.toString()}`, { cache: 'no-store' });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Unable to load saved quotes.');
      setQuotes(body.quotes || []);
      setTotal(body.total || 0);
    } catch (cause) {
      setQuotes([]);
      setTotal(0);
      setError(cause instanceof Error ? cause.message : 'Unable to load saved quotes.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load, refreshKey]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const range = useMemo(() => {
    if (!total) return 'No saved quotes';
    const start = (page - 1) * pageSize + 1;
    return `Showing ${start}–${Math.min(total, start + quotes.length - 1)} of ${total}`;
  }, [page, quotes.length, total]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-600">Quote records</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">All saved quotes</h2>
            <p className="mt-1 text-xs text-gray-400">Customer, service and pricing details are stored securely. PDFs are not stored.</p>
          </div>
          <button onClick={onCreateNew} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700">
            <Plus size={15} /> Create new quote
          </button>
        </div>

        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <form onSubmit={submitSearch} className="flex min-w-0 flex-1 gap-2">
            <label className="relative min-w-0 flex-1">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search name, number or quote ID" className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-xs font-semibold text-gray-700 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50" />
            </label>
            <button type="submit" className="rounded-xl border border-gray-200 px-4 text-xs font-bold text-gray-700 hover:border-red-200 hover:text-red-600">Search</button>
          </form>
          <button onClick={load} disabled={loading} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 text-xs font-bold text-gray-500 hover:text-red-600 disabled:opacity-50">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </section>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}

      {loading ? (
        <div className="flex min-h-56 items-center justify-center rounded-2xl border border-gray-200 bg-white"><Loader2 size={24} className="animate-spin text-red-600" /></div>
      ) : !quotes.length ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <FileText size={30} className="mx-auto text-gray-300" />
          <h3 className="mt-3 text-sm font-black text-gray-800">No saved quotes found</h3>
          <p className="mt-1 text-xs text-gray-400">Create and save a quote to see it here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => {
            const expanded = expandedId === quote.id;
            return (
              <article key={quote.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <button onClick={() => setExpandedId(expanded ? null : quote.id)} className="grid w-full gap-4 p-4 text-left transition-colors hover:bg-gray-50 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,0.8fr)_auto] sm:items-center sm:p-5">
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2"><b className="truncate text-sm text-gray-950">{quote.client_name}</b><small className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-black text-red-700">{quote.quote_number}</small></span>
                    <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-gray-500"><span className="flex items-center gap-1"><Phone size={11} /> {quote.client_number}</span><span className="flex items-center gap-1"><CalendarDays size={11} /> Event: {formatDate(quote.event_date)}</span></span>
                  </span>
                  <span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">{quote.selected_services.length} services</span><span className="mt-1 block truncate text-xs text-gray-600">{quote.selected_services.map((service) => service.name).join(', ')}</span></span>
                  <span className="flex items-center justify-between gap-5 sm:block sm:text-right"><span><small className="block text-[9px] font-bold uppercase tracking-wider text-gray-400">Grand total</small><b className="mt-1 block text-base text-emerald-700">{formatCurrency(quote.grand_total)}</b></span><ChevronRight size={17} className={`text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} /></span>
                </button>

                {expanded ? (
                  <div className="border-t border-gray-100 bg-[#fcfbf9] p-4 sm:p-5">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Selected services</p>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {quote.selected_services.map((service) => (
                            <div key={service.name} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5"><p className="text-xs font-bold text-gray-800">{service.name}</p><p className="mt-0.5 text-[10px] text-gray-400">{service.category}{service.quantity_or_note ? ` · ${service.quantity_or_note}` : ''}</p></div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400"><IndianRupee size={11} /> Pricing</p>
                        <dl className="mt-3 space-y-2 text-xs"><div className="flex justify-between"><dt className="text-gray-500">Final price</dt><dd className="font-bold text-gray-800">{formatCurrency(quote.final_price)}</dd></div><div className="flex justify-between"><dt className="text-gray-500">Transport</dt><dd className="font-bold text-gray-800">{formatCurrency(quote.transport_cost)}</dd></div><div className="flex justify-between"><dt className="text-gray-500">Discount</dt><dd className="font-bold text-red-600">− {formatCurrency(quote.discount)}</dd></div><div className="flex justify-between border-t border-gray-100 pt-2"><dt className="font-black text-gray-800">Grand total</dt><dd className="font-black text-emerald-700">{formatCurrency(quote.grand_total)}</dd></div></dl>
                        <p className="mt-4 border-t border-gray-100 pt-3 text-[10px] text-gray-400">Saved {formatDateTime(quote.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <span>{range}</span>
        <div className="flex items-center justify-between gap-2 sm:justify-end"><button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1 || loading} className="inline-flex h-9 items-center gap-1 rounded-xl border border-gray-200 px-3 font-bold disabled:opacity-40"><ChevronLeft size={14} /> Previous</button><span className="min-w-20 text-center font-bold text-gray-700">Page {page} of {pageCount}</span><button onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page >= pageCount || loading} className="inline-flex h-9 items-center gap-1 rounded-xl border border-gray-200 px-3 font-bold disabled:opacity-40">Next <ChevronRight size={14} /></button></div>
      </div>
    </main>
  );
}
