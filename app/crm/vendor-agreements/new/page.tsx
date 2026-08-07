'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CrmHeader from '../../components/CrmHeader';
import { useSidebar } from '../../sidebar-context';
import { createVendorAgreement, getNextVendorAgreementNumber } from '../../lib/supabase-crm';
import type { VendorAgreementFormData } from '../../lib/types';
import VendorAgreementForm from '../components/VendorAgreementForm';
import { createBlankVendorAgreement } from '../vendor-agreement-config';

export default function NewVendorAgreementPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const [initialData, setInitialData] = useState<VendorAgreementFormData | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const number = await getNextVendorAgreementNumber();
      if (cancelled) return;
      const blank = createBlankVendorAgreement(number);
      const savedDraft = localStorage.getItem('crm_vendor_agreement_working_draft');
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft) as VendorAgreementFormData;
          // Merge the saved draft's services with the current master service
          // list by name, instead of letting a stale draft fully replace it —
          // otherwise a service added to the catalogue after the draft was
          // saved would silently disappear from the form.
          const parsedNames = new Set(parsed.services.map(service => service.name));
          const missingFromDraft = blank.services.filter(service => !parsedNames.has(service.name));
          setInitialData({
            ...blank,
            ...parsed,
            services: [...parsed.services, ...missingFromDraft],
            vendor_agreement_number: number,
          });
          return;
        } catch {}
      }
      setInitialData(blank);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (data: VendorAgreementFormData) => {
    const record = await createVendorAgreement(data);
    router.push(`/crm/vendor-agreements/${record.id}`);
  };

  return (
    <>
      <CrmHeader
        title="Create Vendor Agreement"
        subtitle="Guided vendor onboarding & contract workspace"
        onMenuClick={open}
        actions={<Link href="/crm/vendor-agreements" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15} /> <span className="hidden sm:inline">Vendor Agreements</span></Link>}
      />
      <div className="p-4 sm:p-6">
        {initialData ? <VendorAgreementForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Generate vendor agreement" /> : (
          <div className="flex h-72 items-center justify-center"><Loader2 size={28} className="animate-spin text-red-600" /></div>
        )}
      </div>
    </>
  );
}
