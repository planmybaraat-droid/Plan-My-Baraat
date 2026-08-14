'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, ExternalLink, FileText, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import CrmHeader from '../../../crm/components/CrmHeader';
import { useSidebar } from '../../../crm/sidebar-context';
import LetterDocument from '../../../crm/hr/letters/components/LetterDocument';
import { buildLetterPdf } from '../../../crm/hr/letters/pdf-export';
import type { EmployeeLetterRecord, LetterTemplate } from '../../../crm/lib/types';
import { getMyLetter } from '../../lib/my-letters-data';

export default function MyLetterPreviewPage() {
  const { open } = useSidebar();
  const params = useParams<{ id: string }>();
  const [letter, setLetter] = useState<EmployeeLetterRecord | null>(null);
  const [template, setTemplate] = useState<LetterTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMyLetter(params.id).then((result) => {
      if (!result) { setError('This letter was not found or does not belong to your staff profile.'); return; }
      setLetter(result.letter); setTemplate(result.template);
    }).catch((cause) => setError(cause instanceof Error ? cause.message : 'Could not load this letter.')).finally(() => setLoading(false));
  }, [params.id]);

  const download = async () => {
    if (!letter || !template || !documentRef.current) return;
    setBusy(true); setError('');
    try {
      const pdf = await buildLetterPdf(documentRef.current, { title: `${letter.letter_number} - ${letter.employee?.full_name}`, subject: template.label });
      pdf.save(`${letter.letter_number}-${(letter.employee?.full_name || 'employee').replace(/[^a-z0-9]+/gi, '-')}.pdf`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not download this letter.');
    } finally { setBusy(false); }
  };

  return (
    <>
      <CrmHeader title={template?.label || 'My Letter'} subtitle={letter?.letter_number} onMenuClick={open} notificationsHref="/workspace/notifications" actions={<Link href="/workspace/my-letters" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15} /><span className="hidden sm:inline">My Letters</span></Link>} />
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex h-72 items-center justify-center"><Loader2 size={28} className="animate-spin text-red-600" /></div>
        ) : error && (!letter || !template) ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm"><FileText size={28} className="mx-auto text-red-600" /><p role="alert" className="mt-4 text-sm font-bold text-gray-900">{error}</p><Link href="/workspace/my-letters" className="mt-4 inline-block text-sm font-bold text-red-600">Return to My Letters</Link></div>
        ) : letter && template ? (
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="min-w-0"><p className="truncate text-sm font-black text-gray-950">{template.label}</p><p className="mt-1 text-xs text-gray-400">{letter.letter_number} · Issued {new Date(letter.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={download} disabled={busy} className="agreement-action-button bg-gray-950 text-white disabled:opacity-50"><Download size={15} />{busy ? 'Preparing...' : 'Download PDF'}</button>
                {letter.file_url && <a href={letter.file_url} target="_blank" rel="noopener noreferrer" className="agreement-action-button"><ExternalLink size={15} />Open saved PDF</a>}
              </div>
            </div>
            {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
            <div className="agreement-preview-shell"><div className="agreement-preview-scroll"><LetterDocument ref={documentRef} letter={letter} template={template} /></div></div>
          </div>
        ) : null}
      </div>
    </>
  );
}
