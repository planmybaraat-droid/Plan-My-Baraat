'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, MessageCircle, Phone, Trash2 } from 'lucide-react';

import ConfirmDialog from '../../components/ConfirmDialog';
import CrmHeader from '../../components/CrmHeader';
import StatusBadge from '../../components/StatusBadge';
import { useSidebar } from '../../sidebar-context';
import {
  deleteBaraatEnquiry,
  getBaraatEnquiryById,
  updateBaraatEnquiryStatus,
} from '../../lib/supabase-crm';
import type { BaraatEnquiry, CrmStatus } from '../../lib/types';

const STATUSES: CrmStatus[] = ['New', 'Contacted', 'Interested', 'Converted', 'Lost'];

export default function BaraatLeadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { open } = useSidebar();
  const [lead, setLead] = useState<BaraatEnquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getBaraatEnquiryById(params.id);
        setLead(data);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [params.id]);

  const handleStatusChange = async (status: CrmStatus) => {
    if (!lead) return;
    setLead({ ...lead, status });
    await updateBaraatEnquiryStatus(lead.id, status);
  };

  const handleDelete = async () => {
    if (!lead) return;
    setDeleting(true);
    try {
      await deleteBaraatEnquiry(lead.id);
      router.push('/crm/baraat-leads');
    } finally {
      setDeleting(false);
    }
  };

  const whatsappUrl = lead ? `https://wa.me/91${lead.mobile.replace(/\D/g, '')}` : '#';

  return (
    <>
      <CrmHeader
        title={lead?.customer_name || 'Baraat Lead'}
        subtitle={lead?.package_name || 'Package enquiry details'}
        onMenuClick={open}
      />

      <div className="p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Link
            href="/crm/baraat-leads"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back to enquiries
          </Link>
          {lead ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <MessageCircle size={16} />
              Open WhatsApp
            </a>
          ) : null}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500">Loading lead details...</div>
        ) : !lead ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500">Lead not found.</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Lead Profile</p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-900">{lead.customer_name}</h2>
                </div>
                <StatusBadge status={lead.status} />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Phone</p>
                  <div className="mt-2 flex items-center gap-2 text-gray-800">
                    <Phone size={16} />
                    <span>{lead.mobile}</span>
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Wedding Date</p>
                  <div className="mt-2 flex items-center gap-2 text-gray-800">
                    <CalendarDays size={16} />
                    <span>
                      {lead.event_date
                        ? new Date(lead.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'Not shared'}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Package Interested</p>
                  <p className="mt-2 text-gray-800">{lead.package_name}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Lead Details</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                    {lead.remarks || 'No extra details were submitted.'}
                  </p>
                </div>
              </div>
            </section>

            <aside className="space-y-4">
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Lead Status</p>
                <select
                  value={lead.status}
                  onChange={(e) => void handleStatusChange(e.target.value as CrmStatus)}
                  className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <p className="mt-3 text-xs text-gray-500">
                  Move this lead through the CRM pipeline as your team contacts and qualifies them.
                </p>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Tracking Info</p>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p>Created: {new Date(lead.created_at).toLocaleString('en-IN')}</p>
                  <p>Updated: {new Date(lead.updated_at).toLocaleString('en-IN')}</p>
                </div>
              </section>

              <section className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">Danger Zone</p>
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                >
                  <Trash2 size={16} />
                  Delete lead
                </button>
              </section>
            </aside>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Package Lead"
        message={`Delete enquiry from "${lead?.customer_name}"? This cannot be undone.`}
        confirmLabel="Delete Lead"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleting}
      />
    </>
  );
}
