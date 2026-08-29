'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Check, Download, Files, IndianRupee, Loader2, LogOut, Phone, RotateCcw, Save, User } from 'lucide-react';
import { MASTER_SERVICES } from '@/lib/businessCatalog';
import { amountInWordsINR } from '@/app/crm/lib/number-to-words';
import { downloadQuoteMakerPdf } from './quote-pdf-export';
import QuoteHistory from './QuoteHistory';
import type { QuoteMakerQuote, QuoteMakerQuotePayload } from './quote-types';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);

// Grouped straight from the same catalog Client Agreement step 3 (Included
// services) uses, in the same order — nothing here is a separate list that
// could drift from what the CRM actually offers.
const SERVICE_GROUPS = Array.from(
  MASTER_SERVICES.reduce((groups, service) => {
    const list = groups.get(service.category) ?? [];
    list.push(service.name);
    groups.set(service.category, list);
    return groups;
  }, new Map<string, string[]>())
);

const today = () => new Date().toISOString().slice(0, 10);

// Simplified Quote Maker summary of the CRM's full Client Agreement terms
// (app/crm/agreements/components/AgreementDocument.tsx) -- printed on every
// quote so a client sees the key commercial/safety points before the full
// Agreement is signed. Verbatim text as approved; do not paraphrase.
const QUOTE_MAKER_TERMS: { title: string; body: string }[] = [
  {
    title: 'Scope & Changes',
    body: 'All event details, services, quantities and prices are considered approved upon confirmation. Any additional service, quantity change, route change or timing extension may be subject to availability and additional charges.',
  },
  {
    title: 'Payments & Cancellation',
    body: 'Advance payments reserve the event date and initiate planning. Cancellation or rescheduling may involve charges for work completed, reserved capacity and non-refundable vendor commitments. All pending payments must be completed as per the agreed schedule.',
  },
  {
    title: 'Permissions & Safety',
    body: 'The Client is responsible for required venue, procession, traffic and other permissions unless otherwise agreed in writing. PlanMyBaraat may modify or stop any activity that is unsafe, unlawful or against venue/authority regulations.',
  },
  {
    title: 'Guest & Equipment Responsibility',
    body: "The Client is responsible for ensuring proper behaviour of guests and for any damage, loss or vandalism caused to PlanMyBaraat's equipment, vehicles or assets by guests or Client-appointed persons. Unsafe behaviour may result in immediate suspension of services.",
  },
  {
    title: 'Special Effects & Overtime',
    body: 'Fireworks, pyrotechnics, CO\u2082, confetti and other special effects involve inherent risks and must be used according to operator safety instructions. Any additional on-site service or extension beyond the agreed timing will be charged separately. Overtime is \u20b920,000 per hour (or part thereof), subject to availability.',
  },
  {
    title: 'Liability & Disputes',
    body: 'PlanMyBaraat will take reasonable care in delivering the agreed services but shall not be responsible for events beyond reasonable control or third-party equipment failures, except where caused by its negligence. Any dispute will first be resolved through discussion and, if required, arbitration under Indian law, with Vadodara, Gujarat as the jurisdiction.',
  },
];


// Default "valid until" for a brand-new quote: 15 days out. The field
// stays fully editable -- this is only a starting point, not a rule.
const defaultValidUntil = () => {
  const date = new Date();
  date.setDate(date.getDate() + 15);
  return date.toISOString().slice(0, 10);
};

export default function QuoteMakerApp() {
  const router = useRouter();
  const [view, setView] = useState<'create' | 'history'>('create');
  const [clientName, setClientName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [validUntil, setValidUntil] = useState(defaultValidUntil);
  const [clientNumber, setClientNumber] = useState('');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [finalPrice, setFinalPrice] = useState('');
  const [transportCost, setTransportCost] = useState('');
  const [discount, setDiscount] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedQuote, setSavedQuote] = useState<QuoteMakerQuote | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const printAreaRef = useRef<HTMLDivElement>(null);

  const selectedServices = useMemo(() => Object.keys(checked).filter(name => checked[name]), [checked]);

  const toggle = (name: string) => setChecked(current => ({ ...current, [name]: !current[name] }));

  const setQuantity = (name: string, value: string) => setQuantities(current => ({ ...current, [name]: value }));

  const grandTotal = useMemo(
    () => (Number(finalPrice) || 0) + (Number(transportCost) || 0) - (Number(discount) || 0),
    [finalPrice, transportCost, discount]
  );

  const clearQuote = () => {
    setClientName('');
    setEventDate('');
    setValidUntil(defaultValidUntil());
    setClientNumber('');
    setChecked({});
    setQuantities({});
    setFinalPrice('');
    setTransportCost('');
    setDiscount('');
    setSaveError('');
    setSavedQuote(null);
  };

  const reset = () => {
    if (!window.confirm('Clear this quote and start a fresh one?')) return;
    clearQuote();
  };

  const quotePayload = (): QuoteMakerQuotePayload => ({
    id: savedQuote?.id,
    client_name: clientName,
    event_date: eventDate,
    valid_until: validUntil,
    client_number: clientNumber,
    selected_services: selectedServices.map((name) => ({
      name,
      category: MASTER_SERVICES.find((service) => service.name === name)?.category || 'Other',
      quantity_or_note: quantities[name]?.trim() || '',
    })),
    final_price: Number(finalPrice) || 0,
    transport_cost: Number(transportCost) || 0,
    discount: Number(discount) || 0,
  });

  const saveQuote = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const response = await fetch('/quote-maker/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotePayload()),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Unable to save this quote.');
      setSavedQuote(body.quote);
      setHistoryRefreshKey((current) => current + 1);
      return body.quote as QuoteMakerQuote;
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Unable to save this quote.');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Populates the create-form state from a previously saved quote — used by
  // the "..." menu on the saved-quotes list (Edit / revise, Duplicate,
  // Download). preserveId keeps the record's own id so a subsequent save
  // updates that same quote (Edit, Download); omitting it clears the id so
  // the next save creates a brand-new quote instead (Duplicate).
  const loadQuoteIntoForm = (quote: QuoteMakerQuote, preserveId: boolean) => {
    setClientName(quote.client_name);
    setEventDate(quote.event_date);
    setValidUntil(quote.valid_until);
    setClientNumber(quote.client_number);
    const nextChecked: Record<string, boolean> = {};
    const nextQuantities: Record<string, string> = {};
    quote.selected_services.forEach((service) => {
      nextChecked[service.name] = true;
      if (service.quantity_or_note) nextQuantities[service.name] = service.quantity_or_note;
    });
    setChecked(nextChecked);
    setQuantities(nextQuantities);
    setFinalPrice(String(quote.final_price ?? ''));
    setTransportCost(String(quote.transport_cost ?? ''));
    setDiscount(String(quote.discount ?? ''));
    setSaveError('');
    setSavedQuote(preserveId ? quote : null);
  };

  const editQuote = (quote: QuoteMakerQuote) => {
    loadQuoteIntoForm(quote, true);
    setView('create');
  };

  const duplicateQuote = (quote: QuoteMakerQuote) => {
    loadQuoteIntoForm(quote, false);
    setView('create');
  };

  // Download re-prints an already-saved quote straight from its stored
  // data, without going through saveQuote() first (unlike the "Save &
  // Print" button) — no re-save, no risk of silently editing the record
  // just to look at it.
  const downloadQuote = (quote: QuoteMakerQuote) => {
    loadQuoteIntoForm(quote, true);
    setView('create');
    window.setTimeout(() => runDownload(quote), 50);
  };

  const buildQuoteFilename = (quote: QuoteMakerQuote) => `Quote-${quote.quote_number}.pdf`;

  // Builds the PDF straight from the print area and saves it to disk --
  // no OS/browser print dialog. Shared by "Save & Download PDF" and the
  // saved-quotes list's "Download" action below.
  const runDownload = async (quote: QuoteMakerQuote | null) => {
    if (!quote || !printAreaRef.current) return;
    setDownloading(true);
    setDownloadError('');
    try {
      await downloadQuoteMakerPdf(printAreaRef.current, buildQuoteFilename(quote));
    } catch (cause) {
      setDownloadError(cause instanceof Error ? cause.message : 'Unable to download this quote.');
    } finally {
      setDownloading(false);
    }
  };

  const print = async () => {
    const quote = await saveQuote();
    if (quote) window.setTimeout(() => runDownload(quote), 50);
  };

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/quote-maker/logout', { method: 'POST' });
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  const niceDate = eventDate
    ? new Date(`${eventDate}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

  const niceValidUntil = validUntil
    ? new Date(`${validUntil}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

  return (
    <>
    <div className="min-h-screen bg-[#fcfbf9] pb-16 print:hidden">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="PlanMyBaraat" className="h-8 w-auto object-contain" />
            <div>
              <h1 className="text-sm font-black text-gray-950">Quote Maker</h1>
              <p className="text-[11px] text-gray-400">Create, save and review customer quotes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView(view === 'create' ? 'history' : 'create')} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold ${view === 'history' ? 'border-red-200 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600'}`}>
              <Files size={14} /> <span className="hidden sm:inline">{view === 'create' ? 'All quotes' : 'Create quote'}</span>
            </button>
            <button
              onClick={logout}
              disabled={loggingOut}
              aria-label="Sign out"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:border-red-200 hover:text-red-600 disabled:opacity-50"
            >
              <LogOut size={14} /> <span className="hidden sm:inline">{loggingOut ? 'Signing out…' : 'Sign out'}</span>
            </button>
          </div>
        </div>
      </header>

      {view === 'create' ? (
      <main className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Client details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="agreement-field"><span>Client name</span>
              <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Full name" />
            </label>
            <label className="agreement-field"><span>Event date</span>
              <input type="date" min={today()} value={eventDate} onChange={e => setEventDate(e.target.value)} />
            </label>
            <label className="agreement-field"><span>Quote valid until</span>
              <input type="date" min={today()} value={validUntil} onChange={e => setValidUntil(e.target.value)} />
            </label>
            <label className="agreement-field"><span>Client number</span>
              <input value={clientNumber} onChange={e => setClientNumber(e.target.value)} placeholder="10-digit mobile" />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Services discussed</h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-700">
              {selectedServices.length} selected
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">Tick what the client wants as you talk — the small box is for a quantity or a quick note, if it matters.</p>
          <div className="mt-5 space-y-5">
            {SERVICE_GROUPS.map(([category, names]) => (
              <div key={category}>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-red-600">{category}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {names.map(name => (
                    <label
                      key={name}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors ${
                        checked[name] ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!checked[name]}
                        onChange={() => toggle(name)}
                        className="h-3.5 w-3.5 shrink-0 accent-red-600"
                      />
                      <span className="flex-1 truncate">{name}</span>
                      <input
                        type="text"
                        maxLength={20}
                        value={quantities[name] ?? ''}
                        onChange={e => setQuantity(name, e.target.value)}
                        onClick={e => e.stopPropagation()}
                        placeholder="Qty / note"
                        aria-label={`Quantity or note for ${name}`}
                        className={`h-6 w-16 shrink-0 rounded-md border px-1 text-center text-[10px] font-bold outline-none transition-colors ${
                          checked[name]
                            ? 'border-red-300 bg-white text-red-700 placeholder:text-red-300'
                            : 'border-gray-200 bg-gray-50 text-gray-400 placeholder:text-gray-300'
                        }`}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Pricing</h2>
          <p className="mt-1 text-xs text-gray-400">Fill in as you agree on numbers with the client.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="agreement-field"><span>Final price</span>
              <input type="number" inputMode="decimal" min={0} value={finalPrice} onChange={e => setFinalPrice(e.target.value)} placeholder="0" />
            </label>
            <label className="agreement-field"><span>Transport cost</span>
              <input type="number" inputMode="decimal" min={0} value={transportCost} onChange={e => setTransportCost(e.target.value)} placeholder="0" />
            </label>
            <label className="agreement-field"><span>Discount</span>
              <input type="number" inputMode="decimal" min={0} value={discount} onChange={e => setDiscount(e.target.value)} placeholder="0" />
            </label>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
            <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-emerald-700">
              <IndianRupee size={13} /> Grand total
            </span>
            <span className="text-lg font-black text-emerald-800">{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        {saveError ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">{saveError}</div> : null}
        {downloadError ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">{downloadError}</div> : null}
        {savedQuote ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">Saved successfully as <b>{savedQuote.quote_number}</b>. Further saves update this same quote.</div> : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:border-red-200 hover:text-red-600">
            <RotateCcw size={14} /> Start new quote
          </button>
          <button onClick={saveQuote} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {savedQuote ? 'Update quote' : 'Save quote'}
          </button>
          <button onClick={print} disabled={saving || downloading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50">
            {saving || downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} {downloading ? 'Preparing PDF…' : 'Save & Download PDF'}
          </button>
        </div>
      </main>
      ) : <QuoteHistory
          onCreateNew={() => { clearQuote(); setView('create'); }}
          onEdit={editQuote}
          onDuplicate={duplicateQuote}
          onDownload={downloadQuote}
          refreshKey={historyRefreshKey}
        />}
    </div>

      {/* Print-only summary — hidden on screen, shown only by @media print
          in globals.css (#quote-maker-print-area). Always rendered from
          current state so Print/Save-as-PDF is instant, no timing tricks.
          Kept as a top-level sibling of the print:hidden screen wrapper
          above (not nested inside it) — if it were nested, a display:none
          ancestor during print would hide it too, no matter what display
          value the print area itself declares. */}
      <div id="quote-maker-print-area" ref={printAreaRef} className="p-0 font-serif text-[#1c1917]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" className="quote-maker-watermark-logo" />
        <div className="mb-6 flex items-center justify-between border-b-[3px] border-[#7C1C2B] pb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="PlanMyBaraat" className="h-10 w-auto object-contain" />
          <div className="text-right text-[11px] text-stone-500">
            Quote generated {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        <h1 className="mb-1 text-2xl font-bold text-[#7C1C2B]">Baraat Requirement Sheet</h1>
        <div className="mb-5 text-[10px] uppercase tracking-widest font-bold text-[#B8860B]">Discussed on call</div>

        <table className="mb-6 w-full border-collapse">
          <tbody>
            <tr>
              <td className="w-1/3 border-b border-stone-100 py-2 text-[10px] font-bold uppercase tracking-wide text-stone-500"><User size={11} className="mr-1 inline-block align-middle" />Client name</td>
              <td className="border-b border-stone-100 py-2 text-sm font-semibold">{clientName || '—'}</td>
            </tr>
            <tr>
              <td className="border-b border-stone-100 py-2 text-[10px] font-bold uppercase tracking-wide text-stone-500"><CalendarDays size={11} className="mr-1 inline-block align-middle" />Event date</td>
              <td className="border-b border-stone-100 py-2 text-sm font-semibold">{niceDate || '—'}</td>
            </tr>
            <tr>
              <td className="border-b border-stone-100 py-2 text-[10px] font-bold uppercase tracking-wide text-stone-500"><CalendarDays size={11} className="mr-1 inline-block align-middle" />Quote valid until</td>
              <td className="border-b border-stone-100 py-2 text-sm font-semibold">{niceValidUntil || '—'}</td>
            </tr>
            <tr>
              <td className="py-2 text-[10px] font-bold uppercase tracking-wide text-stone-500"><Phone size={11} className="mr-1 inline-block align-middle" />Client number</td>
              <td className="py-2 text-sm font-semibold">{clientNumber || '—'}</td>
            </tr>
          </tbody>
        </table>

        <p className="mb-3 text-[10px] uppercase tracking-wide text-stone-500">Services the client wants</p>
        {selectedServices.length === 0 ? (
          <p className="text-sm text-stone-400">No services selected yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <tbody>
              {selectedServices.map(name => (
                <tr key={name}>
                  <td className="border-b border-stone-100 py-2 text-sm">
                    <Check size={13} className="mr-2 inline-block align-middle text-[#7C1C2B]" />
                    {name}
                    {quantities[name]?.trim() ? (
                      <span className="ml-2 text-xs font-semibold text-stone-500">
                        {/^[0-9]+$/.test(quantities[name].trim()) ? <>&times; {quantities[name].trim()}</> : <>&mdash; {quantities[name].trim()}</>}
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className="mb-3 mt-6 text-[10px] uppercase tracking-wide text-stone-500">Pricing</p>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border-b border-stone-100 py-2 text-sm text-stone-600">Final price</td>
              <td className="border-b border-stone-100 py-2 text-right text-sm font-semibold">{formatCurrency(Number(finalPrice) || 0)}</td>
            </tr>
            <tr>
              <td className="border-b border-stone-100 py-2 text-sm text-stone-600">Transport cost</td>
              <td className="border-b border-stone-100 py-2 text-right text-sm font-semibold">{formatCurrency(Number(transportCost) || 0)}</td>
            </tr>
            <tr>
              <td className="border-b border-stone-100 py-2 text-sm text-stone-600">Discount</td>
              <td className="border-b border-stone-100 py-2 text-right text-sm font-semibold">- {formatCurrency(Number(discount) || 0)}</td>
            </tr>
            <tr>
              <td className="pt-3 text-sm font-bold uppercase tracking-wide text-[#7C1C2B]">Grand total</td>
              <td className="pt-3 text-right text-base font-black text-[#7C1C2B]">{formatCurrency(grandTotal)}</td>
            </tr>
            <tr>
              <td colSpan={2} className="pt-1 text-right text-[9px] italic text-stone-500">{amountInWordsINR(grandTotal)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mb-3 mt-8 text-[10px] uppercase tracking-wide text-stone-500">Terms &amp; conditions</p>
        <ol className="quote-maker-terms">
          {QUOTE_MAKER_TERMS.map((term, index) => (
            <li key={term.title}>
              <span className="quote-maker-term-num">{index + 1}.</span>
              <span className="quote-maker-term-body"><strong>{term.title}:</strong> {term.body}</span>
            </li>
          ))}
        </ol>
        <p className="quote-maker-terms-note">
          Note: These terms are a simplified summary. The complete Terms &amp; Conditions form an integral part of the Agreement.
        </p>

        <div className="mt-10 text-center text-[10px] uppercase tracking-widest text-stone-400">
          PlanMyBaraat &middot; Premium Procession Network
        </div>
      </div>
    </>
  );
}
