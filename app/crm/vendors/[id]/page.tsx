'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Pencil, Trash2, Phone, Mail, MapPin, Tag,
  Package, Calendar, Clock, FileText, Loader2
} from 'lucide-react';
import CrmHeader from '../../components/CrmHeader';
import StatusBadge from '../../components/StatusBadge';
import NotesTimeline from '../../components/NotesTimeline';
import FileUploader, { FileItem } from '../../components/FileUploader';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useSidebar } from '../../sidebar-context';
import {
  getVendorById, deleteVendor, getNotes, getUploadedFiles, deleteUploadedFile
} from '../../lib/supabase-crm';
import type { Vendor, Note, UploadedFile } from '../../lib/types';

export default function VendorDetailPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [v, n, f] = await Promise.all([
          getVendorById(id),
          getNotes('vendor', id),
          getUploadedFiles('vendor', id),
        ]);
        setVendor(v);
        setNotes(n);
        setFiles(f);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteVendor(id);
      router.push('/crm/vendors');
    } finally {
      setDeleting(false);
    }
  };

  const handleFileDelete = async (file: UploadedFile) => {
    await deleteUploadedFile(file.id, file.file_url);
    setFiles(f => f.filter(x => x.id !== file.id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 size={32} className="animate-spin text-red-500" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-gray-500">Vendor not found</p>
        <Link href="/crm/vendors" className="text-red-600 hover:underline text-sm">Back to Vendors</Link>
      </div>
    );
  }

  const city = vendor.city as { name?: string } | null;
  const category = vendor.category as { name?: string } | null;
  const vendorPackage = vendor.vendor_package as { name?: string; price?: number } | null;

  return (
    <>
      <CrmHeader
        title={vendor.company_name}
        subtitle={vendor.contact_person}
        onMenuClick={open}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/crm/vendors" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mr-2">
              <ArrowLeft size={16} /> Back
            </Link>
            <Link
              href={`/crm/vendors/${id}/edit`}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Pencil size={15} /> Edit
            </Link>
            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-2 px-3 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        }
      />

      <div className="p-4 sm:p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Details */}
          <div className="lg:col-span-1 space-y-4">
            {/* Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                  <span className="text-red-700 text-2xl font-bold">{vendor.company_name[0]}</span>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg leading-tight">{vendor.company_name}</h2>
                  <StatusBadge status={vendor.status} />
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone size={15} className="text-gray-400 flex-shrink-0" />
                  <a href={`tel:${vendor.mobile}`} className="hover:text-red-600 transition-colors">{vendor.mobile}</a>
                </div>
                {vendor.email && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail size={15} className="text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${vendor.email}`} className="hover:text-red-600 transition-colors truncate">{vendor.email}</a>
                  </div>
                )}
                {city?.name && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin size={15} className="text-gray-400 flex-shrink-0" />
                    <span>{city.name}</span>
                  </div>
                )}
                {category?.name && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Tag size={15} className="text-gray-400 flex-shrink-0" />
                    <span>{category.name}</span>
                  </div>
                )}
                {vendorPackage?.name && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Package size={15} className="text-gray-400 flex-shrink-0" />
                    <span>{vendorPackage.name}{vendorPackage.price ? ` — ₹${vendorPackage.price.toLocaleString()}` : ''}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={12} />
                  <span>Created {new Date(vendor.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} />
                  <span>Updated {new Date(vendor.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Remarks */}
            {vendor.remarks && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText size={12} /> Remarks
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">{vendor.remarks}</p>
              </div>
            )}

            {/* Files */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Documents & Files</h3>
              <FileUploader
                entityType="vendor"
                entityId={id}
                onUploadComplete={f => setFiles(prev => [f, ...prev])}
              />
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map(f => (
                    <FileItem key={f.id} file={f} onDelete={handleFileDelete} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Notes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Notes & Activity</h3>
              <NotesTimeline
                notes={notes}
                entityType="vendor"
                entityId={id}
                onNotesChange={setNotes}
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Delete Vendor"
        message={`Are you sure you want to delete "${vendor.company_name}"? All notes and files will be removed.`}
        confirmLabel="Delete Vendor"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </>
  );
}
