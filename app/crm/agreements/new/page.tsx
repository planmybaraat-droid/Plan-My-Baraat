'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CrmHeader from '../../components/CrmHeader';
import { useSidebar } from '../../sidebar-context';
import { createAgreement, getNextAgreementNumber } from '../../lib/supabase-crm';
import type { AgreementFormData } from '../../lib/types';
import AgreementForm from '../components/AgreementForm';
import { createBlankAgreement, reconcileServices } from '../agreement-config';

export default function NewAgreementPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const [initialData, setInitialData] = useState<AgreementFormData | null>(null);

  useEffect(() => {
    getNextAgreementNumber().then(number => {
      const blank = createBlankAgreement(number);
      const savedDraft = localStorage.getItem('crm_agreement_working_draft');
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft) as AgreementFormData;
          // Reconcile first (renames legacy service names like "Elephant" ->
          // "Royal Elephant" and backfills newer add-on fields) so the
          // "already present" check below lines up against current names.
          const reconciledServices = reconcileServices(parsed.services);
          // Merge saved services with the current master service list by
          // name, rather than letting the stale draft fully replace it —
          // otherwise any service added to SERVICE_NAMES after a draft was
          // saved would silently disappear from the form until the old
          // draft was manually cleared.
          const parsedNames = new Set(reconciledServices.map(service => service.name));
          const missingFromDraft = blank.services.filter(service => !parsedNames.has(service.name));
          setInitialData({
            ...blank,
            ...parsed,
            services: [...reconciledServices, ...missingFromDraft],
            agreement_number: number,
          });
          return;
        } catch {}
      }
      setInitialData(blank);
    });
  }, []);

  const handleSubmit = async (data: AgreementFormData) => {
    const record = await createAgreement(data);
    router.push(`/crm/agreements/${record.id}`);
  };

  return (
    <>
      <CrmHeader
        title="Create Agreement"
        subtitle="Guided Baraat Management Contract workspace"
        onMenuClick={open}
        actions={<Link href="/crm/agreements" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15} /> <span className="hidden sm:inline">Agreements</span></Link>}
      />
      <div className="p-4 sm:p-6">
        {initialData ? <AgreementForm initialData={initialData} onSubmit={handleSubmit} onSaveDraft={handleSubmit} submitLabel="Generate agreement" /> : (
          <div className="flex h-72 items-center justify-center"><Loader2 size={28} className="animate-spin text-red-600" /></div>
        )}
      </div>
    </>
  );
}
