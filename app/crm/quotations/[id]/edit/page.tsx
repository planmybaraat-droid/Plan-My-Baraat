'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CrmHeader from '../../../components/CrmHeader';
import { useSidebar } from '../../../sidebar-context';
import type { QuotationFormData, QuotationRecord } from '../../../lib/types';
import QuotationForm from '../../components/QuotationForm';
import { getQuotationById, updateQuotation } from '../../quotation-data';
import { reconcileQuotationServices } from '../../quotation-config';

export default function EditQuotationPage() {
  const { open } = useSidebar(); const params = useParams<{ id: string }>(); const router = useRouter();
  const [quotation, setQuotation] = useState<QuotationRecord | null>(null); const [missing, setMissing] = useState(false);
  useEffect(() => { getQuotationById(params.id).then(record => { setQuotation(record ? { ...record, services: reconcileQuotationServices(record.services) } : record); setMissing(!record); }); }, [params.id]);
  const submit = async (data: QuotationFormData) => { const record = await updateQuotation(params.id, data); router.push(`/crm/quotations/${record.id}`); };
  return <><CrmHeader title="Revise Quotation" subtitle={quotation ? `${quotation.quotation_number} · creating v${quotation.version + 1}` : 'Loading quotation'} onMenuClick={open} actions={<Link href={`/crm/quotations/${params.id}`} className="inline-flex items-center gap-2 text-xs font-bold text-gray-500"><ArrowLeft size={15} /> Preview</Link>} /><div className="p-4 sm:p-6">{quotation ? <QuotationForm initialData={quotation} onSubmit={submit} submitLabel={`Save as v${quotation.version + 1}`} /> : missing ? <div className="rounded-2xl border bg-white p-12 text-center">Quotation not found.</div> : <div className="flex h-72 items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>}</div></>;
}
