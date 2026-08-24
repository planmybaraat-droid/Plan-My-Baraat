'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Activity, ArrowLeft, Ban, BadgeCheck, Check, Clock3, Copy, Download, ExternalLink,
  FileClock, FileText, Loader2, Mail, MessageCircle, Paperclip, Pencil, Printer, Star,
} from 'lucide-react';
import CrmHeader from '../../components/CrmHeader';
import FileUploader, { FileItem } from '../../components/FileUploader';
import { useSidebar } from '../../sidebar-context';
import {
  appendVendorAgreementActivity, deleteUploadedFile, duplicateVendorAgreement,
  getUploadedFiles, getVendorAgreementById, updateVendorAgreement,
} from '../../lib/supabase-crm';
import { downloadCrmPdf } from '../../lib/pdf-export';
import type { UploadedFile, VendorAgreementRecord, VendorAgreementStatus, VendorDocumentFile } from '../../lib/types';
import VendorAgreementDocument from '../components/VendorAgreementDocument';
import {
  VENDOR_AGREEMENT_STATUSES, VENDOR_DOCUMENT_CATEGORIES,
  calculateVendorAgreementAmounts, currency, formatAgreementDate,
} from '../vendor-agreement-config';

type DetailTab = 'preview' | 'activity' | 'versions' | 'documents';

const STATUS_STYLES: Record<VendorAgreementStatus, string> = {
  Draft: 'border-gray-200 bg-gray-50 text-gray-700',
  Sent: 'border-blue-200 bg-blue-50 text-blue-700',
  Signed: 'border-violet-200 bg-violet-50 text-violet-700',
  Active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Expired: 'border-orange-200 bg-orange-50 text-orange-700',
  Terminated: 'border-red-200 bg-red-50 text-red-700',
  Cancelled: 'border-red-200 bg-red-50 text-red-700',
};

export default function VendorAgreementDetailPage() {
  const { open } = useSidebar();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const documentRef = useRef<HTMLDivElement>(null);
  const [agreement, setAgreement] = useState<VendorAgreementRecord | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [tab, setTab] = useState<DetailTab>('preview');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [docCategory, setDocCategory] = useState<string>(VENDOR_DOCUMENT_CATEGORIES[0]);

  const load = async () => {
    const [record, uploaded] = await Promise.all([
      getVendorAgreementById(params.id),
      getUploadedFiles('vendor_agreement', params.id),
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
      await downloadCrmPdf(documentRef.current, `${agreement.vendor_agreement_number}-${agreement.vendor_name.replace(/[^a-z0-9]+/gi, '-')}.pdf`, { properties: { title: `${agreement.vendor_agreement_number} - ${agreement.vendor_name}`, subject: 'PlanMyBaraat Vendor Service Agreement' } });
      if (track) await appendVendorAgreementActivity(agreement.id, {
        type: 'downloaded', title: 'PDF downloaded', detail: `Version ${agreement.version} exported as PDF.`, actor: 'CRM Admin',
      });
      notify('Vendor agreement PDF downloaded.');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'PDF export failed.');
    } finally {
      setBusy('');
    }
  };

  const printPdf = async () => {
    if (!agreement) return;
    await appendVendorAgreementActivity(agreement.id, {
      type: 'printed', title: 'Vendor agreement printed', detail: `Version ${agreement.version} opened for printing.`, actor: 'CRM Admin',
    });
    window.print();
  };

  const changeStatus = async (status: VendorAgreementStatus) => {
    if (!agreement || status === agreement.status) return;
    setBusy('status');
    try {
      const updated = await updateVendorAgreement(agreement.id, { ...agreement, status }, `Status changed from ${agreement.status} to ${status}`);
      setAgreement(updated);
      notify(`Vendor agreement marked ${status}.`);
    } finally {
      setBusy('');
    }
  };

  const duplicate = async () => {
    if (!agreement) return;
    setBusy('duplicate');
    try {
      const copy = await duplicateVendorAgreement(agreement.id);
      router.push(`/crm/vendor-agreements/${copy.id}/edit`);
    } finally {
      setBusy('');
    }
  };

  const emailAgreement = async () => {
    if (!agreement) return;
    await downloadPdf(false);
    await appendVendorAgreementActivity(agreement.id, {
      type: 'sent', title: 'Email prepared', detail: `Email draft opened for ${agreement.email || agreement.vendor_name}.`, actor: 'CRM Admin',
    });
    const subject = encodeURIComponent(`${agreement.vendor_agreement_number} | PlanMyBaraat Vendor Service Agreement`);
    const body = encodeURIComponent(`Dear ${agreement.vendor_name},\n\nPlease find your PlanMyBaraat Vendor Service Agreement (${agreement.vendor_agreement_number}) attached. Kindly review and sign the agreement.\n\nWarm regards,\nPlanMyBaraat`);
    window.location.href = `mailto:${agreement.email}?subject=${subject}&body=${body}`;
  };

  const whatsappAgreement = async () => {
    if (!agreement) return;
    const phone = agreement.mobile.replace(/\D/g, '');
    const message = encodeURIComponent(`Hello ${agreement.vendor_name}, your PlanMyBaraat Vendor Service Agreement ${agreement.vendor_agreement_number} is ready. Please review the PDF shared by our team.`);
    await appendVendorAgreementActivity(agreement.id, {
      type: 'sent', title: 'WhatsApp share opened', detail: `Vendor agreement share prepared for ${agreement.mobile}.`, actor: 'CRM Admin',
    });
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const addDocument = async (file: UploadedFile) => {
    if (!agreement) return;
    setFiles(current => [file, ...current]);
    const doc: VendorDocumentFile = {
      id: file.id,
      category: docCategory,
      file_name: file.file_name,
      file_url: file.file_url,
      file_type: file.file_type,
      file_size: file.file_size,
      uploaded_at: file.created_at,
    };
    const updated = await updateVendorAgreement(agreement.id, { ...agreement, documents: [doc, ...agreement.documents] }, `${docCategory} document uploaded`);
    setAgreement(updated);
    await appendVendorAgreementActivity(agreement.id, { type: 'document', title: 'Document uploaded', detail: `${docCategory}: ${file.file_name}`, actor: 'CRM Admin' });
  };

  const removeDocument = async (target: UploadedFile) => {
    if (!agreement) return;
    await deleteUploadedFile(target.id, target.file_url);
    setFiles(current => current.filter(item => item.id !== target.id));
    const updated = await updateVendorAgreement(agreement.id, { ...agreement, documents: agreement.documents.filter(doc => doc.id !== target.id) }, 'Document removed');
    setAgreement(updated);
  };

  if (!agreement) {
    return (
      <>
        <CrmHeader title="Vendor Agreement" subtitle="Loading vendor agreement" onMenuClick={open} />
        <div className="flex h-96 items-center justify-center"><Loader2 size={30} className="animate-spin text-red-600" /></div>
      </>
    );
  }

  const amounts = calculateVendorAgreementAmounts(agreement);
  const tabs: { id: DetailTab; label: string; icon: typeof FileText; count?: number }[] = [
    { id: 'preview', label: 'PDF Preview', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Activity, count: agreement.activity.length },
    { id: 'versions', label: 'Versions', icon: FileClock, count: agreement.revisions.length + 1 },
    { id: 'documents', label: 'Documents', icon: Paperclip, count: files.length },
  ];

  return (
    <>
      <CrmHeader
        title={agreement.vendor_agreement_number}
        subtitle={`${agreement.vendor_name} · Version ${agreement.version}`}
        onMenuClick={open}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/crm/vendor-agreements" className="hidden items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-900 xl:inline-flex"><ArrowLeft size={14} /> Vendor Agreements</Link>
            <Link href={`/crm/vendor-agreements/${agreement.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"><Pencil size={14} /> <span className="hidden sm:inline">Edit</span></Link>
          </div>
        }
      />

      <div className="space-y-5 p-4 sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto]">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight text-gray-950">{agreement.vendor_name}</h2>
                  <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${STATUS_STYLES[agreement.status]}`}>{agreement.status}</span>
                  {agreement.preferred_vendor && <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-amber-700"><Star size={10} /> Preferred</span>}
                  {agreement.verification_status === 'Verified' && <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-blue-700"><BadgeCheck size={10} /> Verified</span>}
                  {agreement.blacklist_status !== 'Active' && <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-red-700"><Ban size={10} /> {agreement.blacklist_status}</span>}
                </div>
                <p className="mt-1 text-sm font-medium text-gray-400">{agreement.service_category || 'General'} · {formatAgreementDate(agreement.agreement_start_date)} – {formatAgreementDate(agreement.agreement_end_date)}</p>
              </div>
              <div className="text-left sm:text-right"><p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Estimated value</p><p className="mt-1 text-xl font-black text-red-600">{currency(amounts.estimatedValue)}</p></div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
              <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</span>
              {VENDOR_AGREEMENT_STATUSES.map(status => (
                <button key={status} disabled={busy === 'status'} onClick={() => changeStatus(status)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition ${agreement.status === status ? STATUS_STYLES[status] : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-700'}`}>
                  {agreement.status === status && <Check size={11} />}{status}
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 sm:grid-cols-4">
              <div><p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Performance</p><p className="mt-1 text-sm font-black text-gray-900">{agreement.performance_score}/100</p></div>
              <div><p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Reliability</p><p className="mt-1 text-sm font-black text-gray-900">{agreement.reliability_rating}/5</p></div>
              <div><p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Completed events</p><p className="mt-1 text-sm font-black text-gray-900">{agreement.completed_events}</p></div>
              <div><p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">On-time</p><p className="mt-1 text-sm font-black text-gray-900">{agreement.on_time_percent}%</p></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 xl:grid-cols-3">
            <button onClick={() => downloadPdf()} disabled={busy === 'download'} className="agreement-action-button bg-gray-950 text-white"><Download size={17} />{busy === 'download' ? 'Exporting' : 'Download'}</button>
            <button onClick={printPdf} className="agreement-action-button"><Printer size={17} />Print</button>
            <button onClick={emailAgreement} className="agreement-action-button"><Mail size={17} />Email</button>
            <button onClick={whatsappAgreement} className="agreement-action-button"><MessageCircle size={17} />WhatsApp</button>
            <button onClick={duplicate} disabled={busy === 'duplicate'} className="agreement-action-button"><Copy size={17} />Duplicate</button>
            <Link href={`/crm/vendor-agreements/${agreement.id}/edit`} className="agreement-action-button"><Pencil size={17} />Revise</Link>
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
              <div><p>Live vendor agreement preview</p><span>Empty fields and internal notes are hidden automatically.</span></div>
              <button onClick={() => downloadPdf()} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-[10px] font-bold text-white"><Download size={13} /> Export PDF</button>
            </div>
            <div className="agreement-preview-scroll">
              <VendorAgreementDocument agreement={agreement} ref={documentRef} />
            </div>
          </div>
        )}

        {tab === 'activity' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <h3 className="text-base font-black text-gray-950">Activity timeline</h3>
            <p className="mt-1 text-xs text-gray-400">A chronological audit of actions taken on this vendor agreement.</p>
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

        {tab === 'documents' && (
          <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-black text-gray-950">Add document</h3><p className="mb-4 mt-1 text-xs leading-5 text-gray-400">Aadhaar, PAN, GST certificate, cancelled cheque, registration certificate, portfolio, insurance, rate card or other supporting document.</p>
              <label className="agreement-field mb-3"><span>Document category</span>
                <select value={docCategory} onChange={e => setDocCategory(e.target.value)}>
                  {VENDOR_DOCUMENT_CATEGORIES.map(category => <option key={category}>{category}</option>)}
                </select>
              </label>
              <FileUploader entityType="vendor_agreement" entityId={agreement.id} onUploadComplete={addDocument} />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-gray-950">Vendor documents</h3><p className="mt-1 text-xs text-gray-400">{files.length} file{files.length !== 1 ? 's' : ''}</p></div><ExternalLink size={16} className="text-gray-300" /></div>
              <div className="mt-4 space-y-2">
                {files.length ? files.map(file => {
                  const category = agreement.documents.find(doc => doc.id === file.id)?.category;
                  return (
                    <div key={file.id}>
                      {category && <p className="mb-1 text-[9px] font-black uppercase tracking-wider text-red-600">{category}</p>}
                      <FileItem file={file} onDelete={removeDocument} />
                    </div>
                  );
                }) : <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-xs text-gray-400">No documents uploaded yet.</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
