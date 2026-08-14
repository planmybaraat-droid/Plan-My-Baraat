'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CircleAlert, Loader2 } from 'lucide-react';
import CrmHeader from '../../../crm/components/CrmHeader';
import { useSidebar } from '../../../crm/sidebar-context';
import { useCrmProfile } from '../../../crm/lib/useCrmProfile';
import type { QuotationFormData } from '../../../crm/lib/types';
import QuotationForm from '../../../crm/quotations/components/QuotationForm';
import { createBlankQuotation, reconcileQuotationServices } from '../../../crm/quotations/quotation-config';
import { createQuotation, getNextQuotationNumber } from '../../../crm/quotations/quotation-data';

export default function NewWorkspaceQuotationPage() {
  const { open }=useSidebar(); const router=useRouter(); const {profile}=useCrmProfile();
  const [initialData,setInitialData]=useState<QuotationFormData|null>(null); const [error,setError]=useState('');
  useEffect(()=>{ getNextQuotationNumber().then(number=>{
    const blank={...createBlankQuotation(number),created_by_name:profile?.name||createBlankQuotation(number).created_by_name};
    const draft=localStorage.getItem('crm_quotation_working_draft_v1');
    if(draft){try{const parsed=JSON.parse(draft) as QuotationFormData; const reconciled=reconcileQuotationServices(parsed.services||[]); const names=new Set(reconciled.map(item=>item.name)); setInitialData({...blank,...parsed,services:[...reconciled,...blank.services.filter(item=>!names.has(item.name))],quotation_number:number,created_by_name:profile?.name||parsed.created_by_name,status:'Draft',version:1,revisions:[],activity:[],converted_agreement_id:''});return;}catch{}}
    setInitialData(blank);
  }).catch(cause=>setError(cause instanceof Error?cause.message:'Unable to prepare a new quotation.')); },[profile?.name]);
  const submit=async(data:QuotationFormData)=>{setError('');try{await createQuotation({...data,created_by_name:profile?.name||data.created_by_name});localStorage.removeItem('crm_quotation_working_draft_v1');router.push('/workspace/quotations');}catch(cause){setError(cause instanceof Error?cause.message:'Unable to create quotation.');}};
  return <><CrmHeader title="Create Quotation" subtitle="Build a tailored package from the Agreement service catalogue" onMenuClick={open} notificationsHref="/workspace/notifications" actions={<Link href="/workspace/quotations" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500"><ArrowLeft size={15}/><span className="hidden sm:inline">Quotations</span></Link>}/><div className="p-4 sm:p-6">{error&&<div className="mx-auto mb-4 flex max-w-2xl items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"><CircleAlert className="shrink-0" size={18}/><p>{error}</p></div>}{initialData?<QuotationForm initialData={initialData} onSubmit={submit} submitLabel="Generate quotation"/>:<div className="flex h-72 items-center justify-center"><Loader2 className="animate-spin text-red-600"/></div>}</div></>;
}
