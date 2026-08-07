'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CrmHeader from '../../../components/CrmHeader';
import { useSidebar } from '../../../sidebar-context';
import { getVendorAgreementById, updateVendorAgreement } from '../../../lib/supabase-crm';
import type { VendorAgreementRecord, VendorAgreementFormData } from '../../../lib/types';
import VendorAgreementForm from '../../components/VendorAgreementForm';

export default function EditVendorAgreementPage() {
  const { open } = useSidebar();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [agreement, setAgreement] = useState<VendorAgreementRecord | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    getVendorAgreementById(params.id).then(record => {
      setAgreement(record);
      setMissing(!record);
    });
  }, [params.id]);

  const handleSubmit = async (data: VendorAgreementFormData) => {
    const updated = await updateVendorAgreement(params.id, data);
    router.push(`/crm/vendor-agreements/${updated.id}`);
  };

  return (
    <>
      <CrmHeader
        title="Edit Vendor Agreement"
        subtitle={agreement ? `${agreement.vendor_agreement_number} · creating v${agreement.version + 1}` : 'Loading vendor agreement'}
        onMenuClick={open}
        actions={<Link href={`/crm/vendor-agreements/${params.id}`} className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15} /> <span className="hidden sm:inline">Back to preview</span></Link>}
      />
      <div className="p-4 sm:p-6">
        {agreement ? <VendorAgreementForm initialData={agreement} onSubmit={handleSubmit} submitLabel={`Save as v${agreement.version + 1}`} isEditing agreementId={agreement.id} /> : missing ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center"><p className="font-bold text-gray-900">Vendor agreement not found</p><Link href="/crm/vendor-agreements" className="mt-3 inline-block text-sm font-semibold text-red-600">Return to vendor agreements</Link></div>
        ) : <div className="flex h-72 items-center justify-center"><Loader2 size={28} className="animate-spin text-red-600" /></div>}
      </div>
    </>
  );
}
