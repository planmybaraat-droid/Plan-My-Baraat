'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Archive, ArrowLeft, Download, ExternalLink, Loader2, Pencil, Printer, Trash2 } from 'lucide-react';
import CrmHeader from '../../../components/CrmHeader';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useSidebar } from '../../../sidebar-context';
import { deleteEmployeeLetter, getEmployeeLetterById, getLetterTemplate, getPrivateCrmFileUrl, setEmployeeLetterStatus, updateEmployeeLetterFile } from '../../hr-data';
import type { EmployeeLetterRecord, LetterTemplate } from '../../../lib/types';
import LetterDocument from '../components/LetterDocument';

const STATUS_STYLES: Record<string, string> = {
  Generated: 'bg-emerald-50 text-emerald-700',
  Sent: 'bg-blue-50 text-blue-700',
  Archived: 'bg-gray-100 text-gray-500',
};

export default function LetterPreviewPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [letter, setLetter] = useState<EmployeeLetterRecord | null>(null);
  const [template, setTemplate] = useState<LetterTemplate | null>(null);
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const result = await getEmployeeLetterById(params.id);
    if (!result) { setMissing(true); return; }
    setLetter(result);
    const templateResult = await getLetterTemplate(result.letter_type);
    setTemplate(templateResult);
    setMissing(!templateResult);
  };

  useEffect(() => { load(); }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const downloadPdf = async () => {
    if (!letter || !documentRef.current) return;
    setBusy(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      const pages = Array.from(documentRef.current.querySelectorAll<HTMLElement>('[data-pdf-page]'));
      if (!pages.length) return;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      for (let index = 0; index < pages.length; index += 1) {
        const canvas = await html2canvas(pages[index], { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false, windowWidth: 794 });
        if (index > 0) pdf.addPage('a4', 'portrait');
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.94), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }
      pdf.setProperties({ title: `${letter.letter_number} - ${letter.employee?.full_name}`, subject: template?.label, author: 'PlanMyBaraat', creator: 'PlanMyBaraat CRM' });
      pdf.save(`${letter.letter_number}-${(letter.employee?.full_name || 'employee').replace(/[^a-z0-9]+/gi, '-')}.pdf`);
      const blob = pdf.output('blob');
      const { crmSupabase } = await import('../../../lib/supabase-crm');
      const path = `employee-letters/${letter.employee_id}/${letter.letter_number}.pdf`;
      const { error: uploadError } = await crmSupabase.storage.from('crm-files').upload(path, blob, { upsert: true, contentType: 'application/pdf' });
      if (!uploadError) {
        await updateEmployeeLetterFile(letter.id, path);
        const signedUrl = await getPrivateCrmFileUrl(path);
        setLetter(current => current ? { ...current, file_url: signedUrl } : current);
      }
    } finally {
      setBusy(false);
    }
  };

  const toggleArchive = async () => {
    if (!letter) return;
    setBusy(true);
    await setEmployeeLetterStatus(letter.id, letter.status === 'Archived' ? 'Generated' : 'Archived');
    await load();
    setBusy(false);
  };

  const remove = async () => {
    if (!letter) return;
    setBusy(true);
    await deleteEmployeeLetter(letter.id);
    router.push('/crm/hr/letters');
  };

  return (
    <>
      <CrmHeader
        title={template ? template.label : 'Letter'}
        subtitle={letter?.letter_number}
        onMenuClick={open}
        actions={<Link href="/crm/hr/letters" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15} /> <span className="hidden sm:inline">Letters</span></Link>}
      />

      <div className="p-4 sm:p-6">
        {template && letter ? (
          <div className="mx-auto max-w-6xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-black text-gray-950">{letter.employee?.full_name} <span className={`ml-2 rounded-full px-2 py-1 text-[10px] font-black uppercase ${STATUS_STYLES[letter.status] || 'bg-gray-100 text-gray-500'}`}>{letter.status}</span></p>
                  <p className="text-xs text-gray-400">{letter.letter_number} · Generated {new Date(letter.created_at).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/crm/hr/letters/${letter.id}/edit`} className="agreement-action-button"><Pencil size={15} /> Edit</Link>
                <button type="button" onClick={downloadPdf} disabled={busy} className="agreement-action-button bg-gray-950 text-white"><Download size={15} /> {busy ? 'Working...' : 'Download PDF'}</button>
                <button type="button" onClick={() => window.print()} className="agreement-action-button"><Printer size={15} /> Print</button>
                {letter.file_url && <a href={letter.file_url} target="_blank" rel="noopener noreferrer" className="agreement-action-button"><ExternalLink size={15} /> Saved PDF</a>}
                <button type="button" onClick={toggleArchive} disabled={busy} className="agreement-action-button">{letter.status === 'Archived' ? <><Archive size={15} /> Unarchive</> : <><Archive size={15} /> Archive</>}</button>
                <button type="button" onClick={() => setConfirmDelete(true)} className="agreement-action-button text-red-600 hover:bg-red-50"><Trash2 size={15} /> Delete</button>
              </div>
            </div>

            <div className="agreement-preview-shell">
              <div className="agreement-preview-scroll">
                <LetterDocument ref={documentRef} letter={letter} template={template} />
              </div>
            </div>
          </div>
        ) : missing ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center"><p className="font-bold text-gray-900">Letter not found</p><Link href="/crm/hr/letters" className="mt-3 inline-block text-sm font-semibold text-red-600">Return to Letters</Link></div>
        ) : <div className="flex h-72 items-center justify-center"><Loader2 size={28} className="animate-spin text-red-600" /></div>}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete letter"
        message={`Delete ${letter?.letter_number}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
