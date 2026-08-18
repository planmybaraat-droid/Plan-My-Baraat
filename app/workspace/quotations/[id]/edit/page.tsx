'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CircleAlert, Loader2 } from 'lucide-react';
import CrmHeader from '../../../../crm/components/CrmHeader';
import { useSidebar } from '../../../../crm/sidebar-context';
import type { QuotationFormData, QuotationRecord } from '../../../../crm/lib/types';
import QuotationForm from '../../../../crm/quotations/components/QuotationForm';
import { getQuotationById, updateQuotation } from '../../../../crm/quotations/quotation-data';
import { reconcileQuotationServices } from '../../../../crm/quotations/quotation-config';

export default function EditWorkspaceQuotationPage() {
  const { open } = useSidebar(); const params = useParams<{ id: string }>(); const router = useRouter();
  const [record, setRecord] = useState<QuotationRecord | null>(null); const [error, setError] = useState('');
  useEffect(() => { getQuotationById(params.id).then(value => setRecord(value ? { ...value, services: reconcileQuotationServices(value.services || []) } : null)).catch(cause => setError(cause instanceof Error ? cause.message : 'Unable to load quotation.')); }, [params.id]);
  const save = async (data: QuotationFormData) => { await updateQuotation(params.id, data); router.push('/workspace/quotations'); };
  return <><CrmHeader title="Edit Quotation" subtitle={record?.quotation_number || 'Loading quotation'} onMenuClick={open} notificationsHref="/workspace/notifications" actions={<Link href="/workspace/quotations" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500"><ArrowLeft size={15}/>Quotations</Link>}/><div className="p-4 sm:p-6">{record ? <QuotationForm initialData={record} onSubmit={save} onSaveDraft={save} submitLabel="Save changes"/> : error ? <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"><CircleAlert size={18}/>{error}</div> : <div className="flex h-72 items-center justify-center"><Loader2 className="animate-spin text-red-600"/></div>}</div></>;
}
