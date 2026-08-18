'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CrmHeader from '../../../crm/components/CrmHeader';
import { useSidebar } from '../../../crm/sidebar-context';
import { createVendorAgreement, getNextVendorAgreementNumber } from '../../../crm/lib/supabase-crm';
import type { VendorAgreementFormData } from '../../../crm/lib/types';
import VendorAgreementForm from '../../../crm/vendor-agreements/components/VendorAgreementForm';
import { createBlankVendorAgreement } from '../../../crm/vendor-agreements/vendor-agreement-config';

export default function NewWorkspaceVendorAgreementPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const [initialData, setInitialData] = useState<VendorAgreementFormData | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const number = await getNextVendorAgreementNumber();
      if (cancelled) return;
      setInitialData(createBlankVendorAgreement(number));
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (data: VendorAgreementFormData) => {
    await createVendorAgreement(data);
    router.push('/workspace/vendor-agreements');
  };

  return (
    <>
      <CrmHeader
        title="Create Vendor Agreement"
        subtitle="Guided vendor onboarding & contract workspace"
        onMenuClick={open}
        actions={<Link href="/workspace/vendor-agreements" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15} /> <span className="hidden sm:inline">Vendor Agreements</span></Link>}
      />
      <div className="p-4 sm:p-6">
        {initialData ? <VendorAgreementForm initialData={initialData} onSubmit={handleSubmit} onSaveDraft={handleSubmit} submitLabel="Generate vendor agreement" /> : (
          <div className="flex h-72 items-center justify-center"><Loader2 size={28} className="animate-spin text-red-600" /></div>
        )}
      </div>
    </>
  );
}
