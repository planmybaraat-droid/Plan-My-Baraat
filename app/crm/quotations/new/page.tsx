'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CrmHeader from '../../components/CrmHeader';
import { useSidebar } from '../../sidebar-context';
import type { QuotationFormData } from '../../lib/types';
import QuotationForm from '../components/QuotationForm';
import { createBlankQuotation, reconcileQuotationServices } from '../quotation-config';
import { createQuotation, getNextQuotationNumber } from '../quotation-data';

// Quotation creation intentionally reuses the Agreement service catalogue.

export default function NewQuotationPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const [initialData, setInitialData] = useState<QuotationFormData | null>(null);

  useEffect(() => { getNextQuotationNumber().then(number => {
    const blank = createBlankQuotation(number);
    const draft = localStorage.getItem('crm_quotation_working_draft_v1');
    if (draft) {
      try {
        const parsed = JSON.parse(draft) as QuotationFormData;
        // Merge saved services with the current master service list by name
        // instead of letting a stale draft fully replace it, so a service
        // added after the draft was saved (e.g. a new catalogue entry)
        // still shows up.
        const reconciledServices = reconcileQuotationServices(parsed.services);
        const parsedNames = new Set(reconciledServices.map(service => service.name));
        const missingFromDraft = blank.services.filter(service => !parsedNames.has(service.name));
        setInitialData({
          ...blank,
          ...parsed,
          services: [...reconciledServices, ...missingFromDraft],
          quotation_number: number,
          status: 'Draft',
          version: 1,
          revisions: [],
          activity: [],
          converted_agreement_id: '',
        });
        return;
      } catch {}
    }
    setInitialData(blank);
  }); }, []);

  const submit = async (data: QuotationFormData) => { const record = await createQuotation(data); router.push(`/crm/quotations/${record.id}`); };

  return <><CrmHeader title="Create Quotation" subtitle="Build a tailored package from the Agreement service catalogue" onMenuClick={open} actions={<Link href="/crm/quotations" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500"><ArrowLeft size={15} /> Quotations</Link>} /><div className="p-4 sm:p-6">{initialData ? <QuotationForm initialData={initialData} onSubmit={submit} submitLabel="Generate quotation" /> : <div className="flex h-72 items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>}</div></>;
}
