'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FilePenLine, Loader2, Printer, RotateCcw, ShieldCheck } from 'lucide-react';
import CrmHeader from '../../components/CrmHeader';
import { useSidebar } from '../../sidebar-context';
import LetterheadDocument, { type LetterheadValues } from './LetterheadDocument';
import { buildLetterheadPdf, printLetterheadPdf, saveLetterheadPdf } from './letterhead-pdf-export';

interface LetterheadEditorProps {
  portal: 'crm' | 'workspace';
}

const today = () => new Date().toISOString().slice(0, 10);

const INITIAL_VALUES: LetterheadValues = {
  mode: 'blank',
  title: 'Official Communication',
  reference: '',
  date: today(),
  recipient: '',
  subject: '',
  content: '',
};

export default function LetterheadEditor({ portal }: LetterheadEditorProps) {
  const { open } = useSidebar();
  const documentRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<LetterheadValues>(INITIAL_VALUES);
  const [busy, setBusy] = useState<'download' | 'print' | ''>('');
  const [error, setError] = useState('');
  const workspace = portal === 'workspace';

  const setField = <K extends keyof LetterheadValues>(key: K, value: LetterheadValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const filename = `PlanMyBaraat-Letterhead-${values.date || today()}.pdf`;
  const pdfTitle = values.mode === 'blank' ? 'PlanMyBaraat Blank Letterhead' : (values.title.trim() || 'PlanMyBaraat Letterhead');

  const download = async () => {
    if (!documentRef.current) return;
    setBusy('download');
    setError('');
    try {
      const pdf = await buildLetterheadPdf(documentRef.current, pdfTitle);
      saveLetterheadPdf(pdf, filename);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The letterhead PDF could not be generated.');
    } finally {
      setBusy('');
    }
  };

  const print = async () => {
    if (!documentRef.current) return;
    setBusy('print');
    setError('');
    try {
      await printLetterheadPdf(documentRef.current, pdfTitle);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The letterhead could not be prepared for printing.');
    } finally {
      setBusy('');
    }
  };

  return (
    <>
      <CrmHeader
        title="Letterhead"
        subtitle="Create blank or custom official A4 letterheads"
        onMenuClick={open}
        notificationsHref={workspace ? '/workspace/notifications' : '/crm/notifications'}
        actions={!workspace ? <Link href="/crm/hr" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15} /><span className="hidden sm:inline">HR</span></Link> : undefined}
      />

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(300px,420px)_minmax(0,1fr)]">
        <section className="h-fit min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 xl:sticky xl:top-20">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><FilePenLine size={20} /></span>
            <div>
              <h2 className="text-base font-black text-gray-950">Letterhead setup</h2>
              <p className="mt-1 text-xs leading-5 text-gray-400">Use a clean blank letterhead or add custom content before downloading.</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
            {(['blank', 'custom'] as const).map((mode) => (
              <button key={mode} type="button" onClick={() => setField('mode', mode)} className={`rounded-lg px-3 py-2.5 text-xs font-black capitalize transition ${values.mode === mode ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>{mode} letterhead</button>
            ))}
          </div>

          {values.mode === 'custom' && (
            <div className="mt-5 space-y-4">
              <label className="block"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Document title</span><input value={values.title} onChange={(event) => setField('title', event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50" /></label>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <label className="block"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Reference</span><input value={values.reference} onChange={(event) => setField('reference', event.target.value)} placeholder="PMB/LH/2026/001" className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50" /></label>
                <label className="block"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Date</span><input type="date" value={values.date} onChange={(event) => setField('date', event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50" /></label>
              </div>
              <label className="block"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Recipient</span><textarea value={values.recipient} onChange={(event) => setField('recipient', event.target.value)} rows={3} placeholder={'Name\nCompany / Department\nAddress'} className="mt-1.5 w-full resize-y rounded-xl border border-gray-200 px-3.5 py-3 text-sm leading-6 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50" /></label>
              <label className="block"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Subject</span><input value={values.subject} onChange={(event) => setField('subject', event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50" /></label>
              <label className="block"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Content</span><textarea value={values.content} onChange={(event) => setField('content', event.target.value)} rows={8} placeholder="Write the official communication here. Leave one empty line between paragraphs." className="mt-1.5 w-full resize-y rounded-xl border border-gray-200 px-3.5 py-3 text-sm leading-6 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50" /></label>
            </div>
          )}

          <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-3 text-[11px] font-semibold leading-4 text-emerald-700"><ShieldCheck size={16} className="shrink-0" />No scanner, QR code or verification block is included.</div>
          {error && <div role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-semibold text-red-700">{error}</div>}

          <div className="mt-5 grid gap-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            <button type="button" onClick={() => setValues(INITIAL_VALUES)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 hover:bg-gray-50"><RotateCcw size={14} />Reset</button>
            <button type="button" onClick={print} disabled={!!busy} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 hover:border-gray-300 disabled:opacity-50">{busy === 'print' ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} />}Print</button>
            <button type="button" onClick={download} disabled={!!busy} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-3 text-xs font-bold text-white shadow-sm hover:bg-red-700 disabled:opacity-50">{busy === 'download' ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}Download PDF</button>
          </div>
        </section>

        <section className="min-w-0">
          <div className="agreement-preview-shell">
            <div className="agreement-preview-toolbar"><div><p>Live A4 preview</p><span>The downloaded PDF uses this exact layout and contains no scanner.</span></div><span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-red-600">{values.mode}</span></div>
            <div className="agreement-preview-scroll"><LetterheadDocument ref={documentRef} values={values} /></div>
          </div>
        </section>
      </div>
    </>
  );
}
