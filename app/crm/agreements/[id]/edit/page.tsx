'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CrmHeader from '../../../components/CrmHeader';
import { useSidebar } from '../../../sidebar-context';
import { getAgreementById, updateAgreement } from '../../../lib/supabase-crm';
import type { AgreementRecord, AgreementFormData } from '../../../lib/types';
import AgreementForm from '../../components/AgreementForm';
import { reconcileServices } from '../../agreement-config';

export default function EditAgreementPage() {
  const { open } = useSidebar();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [agreement, setAgreement] = useState<AgreementRecord | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    getAgreementById(params.id).then(record => {
      setAgreement(record ? { ...record, services: reconcileServices(record.services) } : record);
      setMissing(!record);
    });
  }, [params.id]);

  const handleSubmit = async (data: AgreementFormData) => {
    const updated = await updateAgreement(params.id, data);
    router.push(`/crm/agreements/${updated.id}`);
  };

  return (
    <>
      <CrmHeader
        title="Edit Agreement"
        subtitle={agreement ? `${agreement.agreement_number} · creating v${agreement.version + 1}` : 'Loading agreement'}
        onMenuClick={open}
        actions={<Link href={`/crm/agreements/${params.id}`} className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15} /> <span className="hidden sm:inline">Back to preview</span></Link>}
      />
      <div className="p-4 sm:p-6">
        {agreement ? <AgreementForm initialData={agreement} onSubmit={handleSubmit} onSaveDraft={handleSubmit} submitLabel={`Save as v${agreement.version + 1}`} /> : missing ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center"><p className="font-bold text-gray-900">Agreement not found</p><Link href="/crm/agreements" className="mt-3 inline-block text-sm font-semibold text-red-600">Return to agreements</Link></div>
        ) : <div className="flex h-72 items-center justify-center"><Loader2 size={28} className="animate-spin text-red-600" /></div>}
      </div>
    </>
  );
}
