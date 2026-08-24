'use client';

import { useState } from 'react';
import { Download, Loader2, ShieldAlert, X } from 'lucide-react';
import type { IdCardRecord } from '../../../lib/types';
import { finalizeGeneratedCard, getIdCardSettings } from '../id-card-data';
import { buildBulkCardsPdf, type CardFaceMode } from '../id-card-pdf-export';

interface BulkGenerateModalProps {
  cards: IdCardRecord[]; // selected rows, each with .employee attached
  onClose: () => void;
  onDone: () => void;
}

export default function BulkGenerateModal({ cards, onClose, onDone }: BulkGenerateModalProps) {
  const faces: CardFaceMode = 'both';
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: cards.length });
  const [error, setError] = useState('');

  const eligible = cards.filter(c => c.employee);
  const skipped = cards.length - eligible.length;

  const run = async () => {
    setBusy(true);
    setError('');
    try {
      const settings = await getIdCardSettings();
      const items = eligible.map(c => ({
        card: c,
        staff: c.employee!,
        photoUrl: c.front_snapshot?.photo_url || c.employee!.photo_url || null,
      }));
      const { combinedPdf, perEmployeePdfBlob } = await buildBulkCardsPdf(items, settings, {
        mode: 'sheet', faces, onProgress: (done, total) => setProgress({ done, total }),
      });

      const stamp = new Date().toISOString().slice(0, 10);
      combinedPdf.save(`ID_Cards_${stamp}.pdf`);

      // Persist each employee's own record so their row shows Generated /
      // has a downloadable PDF afterwards too — built from the same
      // captured images, no second render pass.
      for (const item of items) {
        const blob = perEmployeePdfBlob.get(item.staff.id);
        if (!blob) continue;
        await finalizeGeneratedCard(item.card, item.staff, blob, settings, item.staff.full_name, item.photoUrl);
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk generation failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-gray-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-red-600">Bulk</p>
            <h2 className="text-xl font-black text-gray-950">Generate {eligible.length} ID card{eligible.length === 1 ? '' : 's'}</h2>
          </div>
          <button onClick={onClose} disabled={busy} className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40"><X size={18} /></button>
        </div>

        <div className="space-y-5 p-5 sm:p-7">
          {skipped > 0 && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-700">
              <ShieldAlert size={15} className="mt-0.5 shrink-0" /> {skipped} selected row{skipped === 1 ? '' : 's'} had no employee attached and will be skipped.
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">A4 print sheet</p>
            <p className="mt-1 text-sm font-semibold text-gray-700">
              Selected ID cards will be arranged together on standard A4 pages using one fixed universal card size.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Front and back pages are generated in the same PDF for print alignment. No separate card-size PDF option is shown here.
            </p>
          </div>

          {busy && (
            <div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full bg-red-600 transition-all" style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }} />
              </div>
              <p className="mt-1.5 text-[11px] font-semibold text-gray-400">Rendering {progress.done} of {progress.total}…</p>
            </div>
          )}

          {error && <p className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-7">
          <button onClick={onClose} disabled={busy} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold disabled:opacity-50">Cancel</button>
          <button onClick={run} disabled={busy || eligible.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} {busy ? 'Generating…' : 'Generate A4 PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
