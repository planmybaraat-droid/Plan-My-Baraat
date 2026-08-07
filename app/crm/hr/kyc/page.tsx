'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Check, Download, Eye, FileText, Image as ImageIcon, Loader2,
  RefreshCw, Search, Trash2, Upload, X,
} from 'lucide-react';
import CrmHeader from '../../components/CrmHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useSidebar } from '../../sidebar-context';
import { getStaff } from '../../staff/staff-data';
import type { EmployeeDocumentRecord, EmployeeDocumentStatus, StaffRecord } from '../../lib/types';
import { deleteEmployeeDocument, getEmployeeDocuments, uploadEmployeeDocument, verifyEmployeeDocument } from '../hr-data';
import { KYC_DOCUMENT_GROUPS } from '../hr-config';

const STATUS_STYLES: Record<EmployeeDocumentStatus, string> = {
  Verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
};

function DocumentCard({ category, doc, onUpload, onDelete, onVerify }: {
  category: string;
  doc: EmployeeDocumentRecord | undefined;
  onUpload: (category: string, file: File) => void;
  onDelete: (doc: EmployeeDocumentRecord) => void;
  onVerify: (doc: EmployeeDocumentRecord, status: EmployeeDocumentStatus) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [remarksOpen, setRemarksOpen] = useState(false);
  const [remarks, setRemarks] = useState(doc?.remarks || '');
  const isImage = doc?.file_type?.startsWith('image/');

  return (
    <div className={`rounded-2xl border p-4 ${doc ? STATUS_STYLES[doc.status].split(' ').filter(c => c.startsWith('border')).join(' ') + ' bg-white' : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-gray-900">{category}</p>
        {doc ? <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase ${STATUS_STYLES[doc.status]}`}>{doc.status}</span> : <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[9px] font-black uppercase text-gray-500">Pending</span>}
      </div>

      {doc ? (
        <>
          <div className="mt-3 flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">{isImage ? <ImageIcon size={15} /> : <FileText size={15} />}</span>
            <div className="min-w-0"><p className="truncate text-[11px] font-semibold text-gray-700">{doc.file_name}</p><p className="text-[10px] text-gray-400">{new Date(doc.created_at).toLocaleDateString('en-IN')}</p></div>
          </div>
          {doc.verified_by_name && <p className="mt-2 text-[10px] text-gray-400">By {doc.verified_by_name}{doc.remarks ? ` · ${doc.remarks}` : ''}</p>}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold text-gray-600 hover:bg-gray-50"><Eye size={11} /> Preview</a>
            <a href={doc.file_url} download className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold text-gray-600 hover:bg-gray-50"><Download size={11} /> Download</a>
            <button onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold text-gray-600 hover:bg-gray-50"><RefreshCw size={11} /> Replace</button>
            <button onClick={() => onDelete(doc)} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-50"><Trash2 size={11} /> Delete</button>
          </div>
          {doc.status === 'Pending' && (
            <div className="mt-3 border-t border-gray-100 pt-3">
              {!remarksOpen ? (
                <div className="flex gap-1.5">
                  <button onClick={() => onVerify(doc, 'Verified')} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-700"><Check size={11} /> Verify</button>
                  <button onClick={() => setRemarksOpen(true)} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600 hover:bg-red-100"><X size={11} /> Reject</button>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <input value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Reason for rejection..." className="rounded-lg border border-gray-200 px-2 py-1 text-[10px]" />
                  <div className="flex gap-1.5">
                    <button onClick={() => { onVerify({ ...doc, remarks }, 'Rejected'); setRemarksOpen(false); }} className="rounded-lg bg-red-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-red-700">Confirm reject</button>
                    <button onClick={() => setRemarksOpen(false)} className="rounded-lg border border-gray-200 px-2.5 py-1 text-[10px] font-bold text-gray-600">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <button onClick={() => inputRef.current?.click()} className="mt-3 flex w-full flex-col items-center gap-1.5 rounded-xl border border-dashed border-gray-300 py-5 text-gray-400 hover:border-red-300 hover:bg-red-50/40 hover:text-red-600">
          <Upload size={16} /><span className="text-[10px] font-bold">Click or drag to upload</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) onUpload(category, file); e.target.value = ''; }} />
    </div>
  );
}

export default function KycDocumentsPage() {
  const { open } = useSidebar();
  const [employees, setEmployees] = useState<StaffRecord[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [documents, setDocuments] = useState<EmployeeDocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingCategory, setUploadingCategory] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<EmployeeDocumentRecord | null>(null);

  useEffect(() => {
    getStaff().then(list => { setEmployees(list); setLoading(false); });
  }, []);

  const selectedEmployee = employees.find(item => item.id === selectedId) || null;

  useEffect(() => {
    if (!selectedEmployee) { setDocuments([]); return; }
    getEmployeeDocuments(selectedEmployee.id).then(setDocuments);
  }, [selectedEmployee?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(item => item.full_name.toLowerCase().includes(q) || item.employee_code.toLowerCase().includes(q));
  }, [employees, search]);

  const latestByCategory = useMemo(() => {
    const map = new Map<string, EmployeeDocumentRecord>();
    documents.forEach(doc => { if (!map.has(doc.category)) map.set(doc.category, doc); });
    return map;
  }, [documents]);

  const handleUpload = async (category: string, file: File) => {
    if (!selectedEmployee) return;
    setUploadingCategory(category);
    try {
      await uploadEmployeeDocument(selectedEmployee.id, category, file);
      setDocuments(await getEmployeeDocuments(selectedEmployee.id));
    } finally {
      setUploadingCategory('');
    }
  };

  const handleVerify = async (doc: EmployeeDocumentRecord, status: EmployeeDocumentStatus) => {
    await verifyEmployeeDocument(doc.id, status, doc.remarks, 'CRM Admin');
    if (selectedEmployee) setDocuments(await getEmployeeDocuments(selectedEmployee.id));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteEmployeeDocument(deleteTarget.id, deleteTarget.file_url);
    setDeleteTarget(null);
    if (selectedEmployee) setDocuments(await getEmployeeDocuments(selectedEmployee.id));
  };

  const verifiedCount = documents.filter(doc => doc.status === 'Verified').length;

  return (
    <>
      <CrmHeader
        title="KYC & Documents"
        subtitle="Manage employee KYC and uploaded documents"
        onMenuClick={open}
        actions={<Link href="/crm/hr" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15} /> <span className="hidden sm:inline">HR</span></Link>}
      />

      <div className="grid grid-cols-1 gap-5 p-4 sm:p-6 lg:grid-cols-[300px_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative mb-3">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." className="w-full rounded-xl border border-gray-200 py-2 pl-8 pr-3 text-xs focus:border-gray-400 focus:outline-none" />
          </div>
          {loading ? (
            <div className="flex h-40 items-center justify-center"><Loader2 size={20} className="animate-spin text-red-600" /></div>
          ) : (
            <div className="max-h-[calc(100vh-16rem)] space-y-1 overflow-y-auto">
              {filteredEmployees.map(item => (
                <button key={item.id} onClick={() => setSelectedId(item.id)} className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left ${selectedId === item.id ? 'bg-gray-950 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg text-[11px] font-black ${selectedId === item.id ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {item.photo_url ? <img src={item.photo_url} alt={item.full_name} className="h-full w-full object-cover" /> : item.full_name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0"><p className="truncate text-xs font-bold">{item.full_name}</p><p className={`truncate text-[10px] ${selectedId === item.id ? 'text-white/60' : 'text-gray-400'}`}>{item.employee_code}</p></div>
                </button>
              ))}
            </div>
          )}
        </div>

        {!selectedEmployee ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-sm text-gray-400">Select an employee to manage their documents.</div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-sm font-black text-gray-500">
                  {selectedEmployee.photo_url ? <img src={selectedEmployee.photo_url} alt={selectedEmployee.full_name} className="h-full w-full object-cover" /> : selectedEmployee.full_name.slice(0, 1).toUpperCase()}
                </span>
                <div><p className="text-sm font-black text-gray-950">{selectedEmployee.full_name}</p><p className="text-xs text-gray-400">{selectedEmployee.employee_code} · {selectedEmployee.department}</p></div>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase text-emerald-700">{verifiedCount}/{KYC_DOCUMENT_GROUPS.flatMap(g => g.categories).length} verified</span>
            </div>

            {KYC_DOCUMENT_GROUPS.map(group => (
              <div key={group.label}>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-red-600">{group.label}</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.categories.map(category => (
                    <DocumentCard key={category} category={category} doc={latestByCategory.get(category)} onUpload={handleUpload} onDelete={setDeleteTarget} onVerify={handleVerify} />
                  ))}
                </div>
              </div>
            ))}
            {uploadingCategory && <p className="text-xs font-semibold text-red-600">Uploading {uploadingCategory}...</p>}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete document"
        message={`Delete ${deleteTarget?.file_name}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
