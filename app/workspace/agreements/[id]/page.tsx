'use client';

// Staff-facing agreement detail page — mirrors the admin CRM agreement
// detail page (app/crm/agreements/[id]/page.tsx) exactly in look, feel and
// feature set (Download, Print, Email, WhatsApp, Duplicate, Revise, quick
// Invoice creation, PDF Preview, Activity, Versions, Attachments) so staff
// who have agreement access get the same experience admins do. Route
// access is already gated by middleware.ts via the "agreements" module
// toggle in Manage Access, same as the rest of /workspace/agreements/* —
// no separate permission logic needed here.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Activity, ArrowLeft, Check, Clock3, Copy, Download, ExternalLink, FileClock,
  FileText, Loader2, Mail, MessageCircle, Paperclip, Pencil, Printer,
} from 'lucide-react';
import CrmHeader from '../../../crm/components/CrmHeader';
import FileUploader, { FileItem } from '../../../crm/components/FileUploader';
import { useSidebar } from '../../../crm/sidebar-context';
import {
  appendAgreementActivity, deleteUploadedFile, duplicateAgreement, getAgreementById,
  getUploadedFiles, updateAgreement,
} from '../../../crm/lib/supabase-crm';
import type { AgreementRecord, AgreementStatus, UploadedFile } from '../../../crm/lib/types';
import AgreementDocument from '../../../crm/agreements/components/AgreementDocument';
import { AGREEMENT_STATUSES, currency, formatAgreementDate } from '../../../crm/agreements/agreement-config';

type DetailTab = 'preview' | 'activity' | 'versions' | 'attachments';

const STATUS_STYLES: Record<AgreementStatus, string> = {
  Draft: 'border-gray-200 bg-gray-50 text-gray-700',
  Sent: 'border-blue-200 bg-blue-50 text-blue-700',
  Signed: 'border-violet-200 bg-violet-50 text-violet-700',
  Completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Cancelled: 'border-red-200 bg-red-50 text-red-700',
};

export default function WorkspaceAgreementDetailPage() {
  const { open } = useSidebar();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const documentRef = useRef<HTMLDivElement>(null);
  const [agreement, setAgreement] = useState<AgreementRecord | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [tab, setTab] = useState<DetailTab>('preview');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    const [record, uploaded] = await Promise.all([
      getAgreementById(params.id),
      getUploadedFiles('agreement', params.id),
    ]);
    setAgreement(record);
    setFiles(uploaded);
  };

  useEffect(() => { load(); }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3000);
  };

  const downloadPdf = async (track = true) => {
    if (!agreement || !documentRef.current) return;
    setBusy('download');
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      const pages = Array.from(documentRef.current.querySelectorAll<HTMLElement>('[data-pdf-page]'));
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      for (let index = 0; index < pages.length; index += 1) {
        const canvas = await html2canvas(pages[index], {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: 794,
        });
        if (index > 0) pdf.addPage('a4', 'portrait');
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.94), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }
      pdf.setProperties({
        title: `${agreement.agreement_number} - ${agreement.client_name}`,
        subject: 'PlanMyBaraat Baraat Management Contract',
        author: 'PlanMyBaraat',
        creator: 'PlanMyBaraat CRM',
      });
      pdf.save(`${agreement.agreement_number}-${agreement.client_name.replace(/[^a-z0-9]+/gi, '-')}.pdf`);
      if (track) await appendAgreementActivity(agreement.id, {
        type: 'downloaded', title: 'PDF downloaded', detail: `Version ${agreement.version} exported as PDF.`, actor: agreement.sales_executive || 'CRM Staff',
      });
      notify('Agreement PDF downloaded.');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'PDF export failed.');
    } finally {
      setBusy('');
    }
  };

  const printPdf = async () => {
    if (!agreement) return;
    await appendAgreementActivity(agreement.id, {
      type: 'printed', title: 'Agreement printed', detail: `Version ${agreement.version} opened for printing.`, actor: agreement.sales_executive || 'CRM Staff',
    });
    window.print();
  };

  const changeStatus = async (status: AgreementStatus) => {
    if (!agreement || status === agreement.status) return;
    setBusy('status');
    try {
      const updated = await updateAgreement(agreement.id, { ...agreement, status }, `Status changed from ${agreement.status} to ${status}`);
      setAgreement(updated);
      notify(`Agreement marked ${status}.`);
    } finally {
      setBusy('');
    }
  };

  const duplicate = async () => {
    if (!agreement) return;
    setBusy('duplicate');
    try {
      const copy = await duplicateAgreement(agreement.id);
      router.push(`/workspace/agreements/${copy.id}/edit`);
    } finally {
      setBusy('');
    }
  };

  const emailAgreement = async () => {
    if (!agreement) return;
    await downloadPdf(false);
    await appendAgreementActivity(agreement.id, {
      type: 'sent', title: 'Email prepared', detail: `Email draft opened for ${agreement.email || agreement.client_name}.`, actor: agreement.sales_executive || 'CRM Staff',
    });
    const subject = encodeURIComponent(`${agreement.agreement_number} | PlanMyBaraat Baraat Management Contract`);
    const body = encodeURIComponent(`Dear ${agreement.client_name},\n\nPlease find your PlanMyBaraat Baraat Management Contract (${agreement.agreement_number}) attached. Kindly review and sign the agreement.\n\nWarm regards,\nPlanMyBaraat`);
    window.location.href = `mailto:${agreement.email}?subject=${subject}&body=${body}`;
  };

  const whatsappAgreement = async () => {
    if (!agreement) return;
    const phone = agreement.mobile.replace(/\D/g, '');
    const message = encodeURIComponent(`Hello ${agreement.client_name}, your PlanMyBaraat Baraat Management Contract ${agreement.agreement_number} is ready. Please review the PDF shared by our team.`);
    await appendAgreementActivity(agreement.id, {
      type: 'sent', title: 'WhatsApp share opened', detail: `Agreement share prepared for ${agreement.mobile}.`, actor: agreement.sales_executive || 'CRM Staff',
    });
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  if (!agreement) {
    return (
      <>
        <CrmHeader title="Agreement" subtitle="Loading client agreement" onMenuClick={open} notificationsHref="/workspace/notifications" />
        <div className="flex h-96 items-center justify-center"><Loader2 size={30} className="animate-spin text-red-600" /></div>
      </>
    );
  }

  const tabs: { id: DetailTab; label: string; icon: typeof FileText; count?: number }[] = [
    { id: 'preview', label: 'PDF Preview', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Activity, count: agreement.activity.length },
    { id: 'versions', label: 'Versions', icon: FileClock, count: agreement.revisions.length + 1 },
    { id: 'attachments', label: 'Attachments', icon: Paperclip, count: files.length },
  ];

  return (
    <>
      <CrmHeader
        title={agreement.agreement_number}
        subtitle={`${agreement.client_name} · Version ${agreement.version}`}
        onMenuClick={open}
        notificationsHref="/workspace/notifications"
        actions={
          <div className="flex items-center gap-2">
            <Link href="/workspace/agreements" className="hidden items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-900 xl:inline-flex"><ArrowLeft size={14} /> Agreements</Link>
            <Link href={`/workspace/agreements/${agreement.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"><Pencil size={14} /> <span className="hidden sm:inline">Edit</span></Link>
          </div>
        }
      />

      <div className="space-y-5 p-4 sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto]">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight text-gray-950">{agreement.client_name}</h2>
                  <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${STATUS_STYLES[agreement.status]}`}>{agreement.status}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-gray-400">{agreement.package_name} · {formatAgreementDate(agreement.event_date)} · {agreement.venue}</p>
              </div>
              <div className="text-left sm:text-right"><p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Agreement value</p><p className="mt-1 text-xl font-black text-red-600">{currency(agreement.final_amount)}</p></div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
              <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</span>
              {AGREEMENT_STATUSES.map(status => (
                <button key={status} disabled={busy === 'status'} onClick={() => changeStatus(status)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition ${agreement.status === status ? STATUS_STYLES[status] : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-700'}`}>
                  {agreement.status === status && <Check size={11} />}{status}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-7 xl:grid-cols-4">
            <Link href={`/workspace/invoices/new?agreementId=${agreement.id}`} className="agreement-action-button bg-red-600 text-white"><FileText size={17} />Invoice</Link>
            <button onClick={() => downloadPdf()} disabled={busy === 'download'} className="agreement-action-button bg-gray-950 text-white"><Download size={17} />{busy === 'download' ? 'Exporting' : 'Download'}</button>
            <button onClick={printPdf} className="agreement-action-button"><Printer size={17} />Print</button>
            <button onClick={emailAgreement} className="agreement-action-button"><Mail size={17} />Email</button>
            <button onClick={whatsappAgreement} className="agreement-action-button"><MessageCircle size={17} />WhatsApp</button>
            <button onClick={duplicate} disabled={busy === 'duplicate'} className="agreement-action-button"><Copy size={17} />Duplicate</button>
            <Link href={`/workspace/agreements/${agreement.id}/edit`} className="agreement-action-button"><Pencil size={17} />Revise</Link>
          </div>
        </div>

        {notice && <div className="fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-xs font-bold text-white shadow-2xl"><Check size={14} className="text-emerald-400" />{notice}</div>}

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm">
          <div className="flex min-w-[560px]">
            {tabs.map(({ id, label, icon: Icon, count }) => (
              <button key={id} onClick={() => setTab(id)} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold ${tab === id ? 'bg-gray-950 text-white' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'}`}>
                <Icon size={14} />{label}{count !== undefined && <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${tab === id ? 'bg-white/15' : 'bg-gray-100'}`}>{count}</span>}
              </button>
            ))}
          </div>
        </div>

        {tab === 'preview' && (
          <div className="agreement-preview-shell">
            <div className="agreement-preview-toolbar">
              <div><p>Live agreement preview</p><span>Empty fields and internal notes are hidden automatically.</span></div>
              <button onClick={() => downloadPdf()} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-[10px] font-bold text-white"><Download size={13} /> Export PDF</button>
            </div>
            <div className="agreement-preview-scroll">
              <AgreementDocument agreement={agreement} ref={documentRef} />
            </div>
          </div>
        )}

        {tab === 'activity' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <h3 className="text-base font-black text-gray-950">Activity timeline</h3>
            <p className="mt-1 text-xs text-gray-400">A chronological audit of actions taken on this agreement.</p>
            <div className="mt-6 space-y-0">
              {agreement.activity.length ? agreement.activity.map((entry, index) => (
                <div key={entry.id} className="relative flex gap-4 pb-6">
                  {index < agreement.activity.length - 1 && <span className="absolute left-[15px] top-8 h-full w-px bg-gray-100" />}
                  <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400"><Clock3 size={13} /></span>
                  <div className="pt-0.5"><p className="text-sm font-bold text-gray-900">{entry.title}</p><p className="mt-1 text-xs leading-5 text-gray-500">{entry.detail}</p><p className="mt-1.5 text-[10px] font-semibold text-gray-400">{entry.actor} · {new Date(entry.created_at).toLocaleString('en-IN')}</p></div>
                </div>
              )) : <p className="py-10 text-center text-sm text-gray-400">No activity recorded yet.</p>}
            </div>
          </div>
        )}

        {tab === 'versions' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <h3 className="text-base font-black text-gray-950">Revision history</h3>
            <p className="mt-1 text-xs text-gray-400">Every save preserves the prior version for accountability.</p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4"><div><p className="text-sm font-bold text-emerald-950">Version {agreement.version} · Current</p><p className="mt-1 text-xs text-emerald-700">Last updated {new Date(agreement.updated_at).toLocaleString('en-IN')}</p></div><span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[9px] font-black uppercase text-white">Active</span></div>
              {agreement.revisions.map(revision => (
                <div key={`${revision.version}-${revision.created_at}`} className="flex items-center justify-between rounded-xl border border-gray-200 p-4"><div><p className="text-sm font-bold text-gray-900">Version {revision.version}</p><p className="mt-1 text-xs text-gray-500">{revision.summary}</p><p className="mt-1 text-[10px] text-gray-400">{revision.created_by} · {new Date(revision.created_at).toLocaleString('en-IN')}</p></div><FileClock size={18} className="text-gray-300" /></div>
              ))}
            </div>
          </div>
        )}

        {tab === 'attachments' && (
          <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-black text-gray-950">Add attachment</h3><p className="mb-4 mt-1 text-xs leading-5 text-gray-400">Upload identity documents, venue approvals, references or signed copies.</p>
              <FileUploader entityType="agreement" entityId={agreement.id} onUploadComplete={file => { setFiles(current => [file, ...current]); appendAgreementActivity(agreement.id, { type: 'attachment', title: 'Attachment added', detail: file.file_name, actor: agreement.sales_executive || 'CRM Staff' }); }} />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-gray-950">Agreement files</h3><p className="mt-1 text-xs text-gray-400">{files.length} file{files.length !== 1 ? 's' : ''}</p></div><ExternalLink size={16} className="text-gray-300" /></div>
              <div className="mt-4 space-y-2">
                {files.length ? files.map(file => <FileItem key={file.id} file={file} onDelete={async target => { await deleteUploadedFile(target.id, target.file_url); setFiles(current => current.filter(item => item.id !== target.id)); }} />) : <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-xs text-gray-400">No attachments uploaded yet.</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
