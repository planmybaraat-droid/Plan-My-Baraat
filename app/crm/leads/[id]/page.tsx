'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Pencil, Trash2, Phone, Mail, MapPin,
  Calendar, Clock, FileText, Package, Loader2
} from 'lucide-react';
import CrmHeader from '../../components/CrmHeader';
import StatusBadge from '../../components/StatusBadge';
import NotesTimeline from '../../components/NotesTimeline';
import FileUploader, { FileItem } from '../../components/FileUploader';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useSidebar } from '../../sidebar-context';
import { getLeadById, deleteLead, getNotes, getUploadedFiles, deleteUploadedFile } from '../../lib/supabase-crm';
import type { CustomerLead, Note, UploadedFile } from '../../lib/types';

export default function LeadDetailPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<CustomerLead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [l, n, f] = await Promise.all([
          getLeadById(id),
          getNotes('lead', id),
          getUploadedFiles('lead', id),
        ]);
        setLead(l); setNotes(n); setFiles(f);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLead(id);
      router.push('/crm/leads');
    } finally {
      setDeleting(false);
    }
  };

  const handleFileDelete = async (file: UploadedFile) => {
    await deleteUploadedFile(file.id, file.file_url);
    setFiles(f => f.filter(x => x.id !== file.id));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 size={32} className="animate-spin text-red-500" /></div>;
  }
  if (!lead) {
    return <div className="flex flex-col items-center justify-center h-screen gap-4"><p className="text-gray-500">Lead not found</p><Link href="/crm/leads" className="text-red-600 hover:underline text-sm">Back to Leads</Link></div>;
  }

  const city = lead.city as { name?: string } | null;

  return (
    <>
      <CrmHeader
        title={lead.customer_name}
        subtitle={city?.name ?? 'Customer Lead'}
        onMenuClick={open}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/crm/leads" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mr-2">
              <ArrowLeft size={16} /> Back
            </Link>
            <Link href={`/crm/leads/${id}/edit`} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Pencil size={15} /> Edit
            </Link>
            <button onClick={() => setShowDelete(true)} className="flex items-center gap-2 px-3 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        }
      />

      <div className="p-4 sm:p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 text-2xl font-bold">{lead.customer_name[0]}</span>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg leading-tight">{lead.customer_name}</h2>
                  <StatusBadge status={lead.status} />
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone size={15} className="text-gray-400 flex-shrink-0" />
                  <a href={`tel:${lead.mobile}`} className="hover:text-red-600 transition-colors">{lead.mobile}</a>
                </div>
                {lead.email && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail size={15} className="text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${lead.email}`} className="hover:text-red-600 transition-colors truncate">{lead.email}</a>
                  </div>
                )}
                {city?.name && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin size={15} className="text-gray-400 flex-shrink-0" />
                    <span>{city.name}</span>
                  </div>
                )}
                {lead.event_date && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar size={15} className="text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-red-600">
                      {new Date(lead.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
                {lead.package_discussed && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Package size={15} className="text-gray-400 flex-shrink-0" />
                    <span>{lead.package_discussed}</span>
                  </div>
                )}
              </div>

              {lead.requirement && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Requirement</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{lead.requirement}</p>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-400">
                <div className="flex items-center gap-2"><Calendar size={12} /><span>Created {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                <div className="flex items-center gap-2"><Clock size={12} /><span>Updated {new Date(lead.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
              </div>
            </div>

            {lead.remarks && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><FileText size={12} /> Remarks</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{lead.remarks}</p>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Documents & Files</h3>
              <FileUploader entityType="lead" entityId={id} onUploadComplete={f => setFiles(prev => [f, ...prev])} />
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map(f => <FileItem key={f.id} file={f} onDelete={handleFileDelete} />)}
                </div>
              )}
            </div>
          </div>

          {/* Right: Notes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Notes & Activity</h3>
              <NotesTimeline notes={notes} entityType="lead" entityId={id} onNotesChange={setNotes} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Delete Lead"
        message={`Delete lead for "${lead.customer_name}"? All notes and files will be removed.`}
        confirmLabel="Delete Lead"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </>
  );
}
