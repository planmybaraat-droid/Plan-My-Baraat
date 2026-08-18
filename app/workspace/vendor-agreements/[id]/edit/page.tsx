'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CircleAlert, Loader2 } from 'lucide-react';
import CrmHeader from '../../../../crm/components/CrmHeader';
import { useSidebar } from '../../../../crm/sidebar-context';
import { getVendorAgreementById, updateVendorAgreement } from '../../../../crm/lib/supabase-crm';
import type { VendorAgreementFormData, VendorAgreementRecord } from '../../../../crm/lib/types';
import VendorAgreementForm from '../../../../crm/vendor-agreements/components/VendorAgreementForm';

export default function EditWorkspaceVendorAgreementPage() {
  const { open } = useSidebar(); const params = useParams<{ id: string }>(); const router = useRouter();
  const [record, setRecord] = useState<VendorAgreementRecord | null>(null); const [error, setError] = useState('');
  useEffect(() => { getVendorAgreementById(params.id).then(setRecord).catch(cause => setError(cause instanceof Error ? cause.message : 'Unable to load vendor agreement.')); }, [params.id]);
  const save = async (data: VendorAgreementFormData) => { await updateVendorAgreement(params.id, data); router.push('/workspace/vendor-agreements'); };
  return <><CrmHeader title="Edit Vendor Agreement" subtitle={record?.vendor_agreement_number || 'Loading vendor agreement'} onMenuClick={open} notificationsHref="/workspace/notifications" actions={<Link href="/workspace/vendor-agreements" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500"><ArrowLeft size={15}/>Vendor agreements</Link>}/><div className="p-4 sm:p-6">{record ? <VendorAgreementForm initialData={record} onSubmit={save} onSaveDraft={save} submitLabel="Save changes" isEditing agreementId={record.id}/> : error ? <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"><CircleAlert size={18}/>{error}</div> : <div className="flex h-72 items-center justify-center"><Loader2 className="animate-spin text-red-600"/></div>}</div></>;
}
