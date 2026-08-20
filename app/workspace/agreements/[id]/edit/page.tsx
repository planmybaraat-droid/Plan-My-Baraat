'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CircleAlert, Loader2 } from 'lucide-react';
import CrmHeader from '../../../../crm/components/CrmHeader';
import { useSidebar } from '../../../../crm/sidebar-context';
import { getAgreementById, updateAgreement } from '../../../../crm/lib/supabase-crm';
import type { AgreementFormData, AgreementRecord } from '../../../../crm/lib/types';
import AgreementForm from '../../../../crm/agreements/components/AgreementForm';
import { reconcileServices } from '../../../../crm/agreements/agreement-config';

export default function EditWorkspaceAgreementPage() {
  const { open } = useSidebar(); const params = useParams<{ id: string }>(); const router = useRouter();
  const [record, setRecord] = useState<AgreementRecord | null>(null); const [error, setError] = useState('');
  useEffect(() => { getAgreementById(params.id).then(value => setRecord(value ? { ...value, services: reconcileServices(value.services) } : null)).catch(cause => setError(cause instanceof Error ? cause.message : 'Unable to load agreement.')); }, [params.id]);
  const save = async (data: AgreementFormData) => { const next = await updateAgreement(params.id, data); router.push(`/workspace/agreements/${next.id}`); };
  return <><CrmHeader title="Edit Agreement" subtitle={record?.agreement_number || 'Loading agreement'} onMenuClick={open} notificationsHref="/workspace/notifications" actions={<Link href={`/workspace/agreements/${params.id}`} className="inline-flex items-center gap-2 text-xs font-bold text-gray-500"><ArrowLeft size={15}/>Preview</Link>}/><div className="p-4 sm:p-6">{record ? <AgreementForm initialData={record} onSubmit={save} onSaveDraft={save} submitLabel="Save changes"/> : error ? <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"><CircleAlert size={18}/>{error}</div> : <div className="flex h-72 items-center justify-center"><Loader2 className="animate-spin text-red-600"/></div>}</div></>;
}
