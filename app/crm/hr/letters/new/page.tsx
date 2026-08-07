'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CrmHeader from '../../../components/CrmHeader';
import { useSidebar } from '../../../sidebar-context';
import { getLetterTemplate } from '../../hr-data';
import type { LetterTemplate, LetterType } from '../../../lib/types';
import LetterWizard from '../components/LetterWizard';

export default function NewLetterPage() {
  const { open } = useSidebar();
  const searchParams = useSearchParams();
  const letterType = searchParams.get('type') as LetterType | null;
  const [template, setTemplate] = useState<LetterTemplate | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!letterType) { setMissing(true); return; }
    getLetterTemplate(letterType).then(result => {
      setTemplate(result);
      setMissing(!result);
    });
  }, [letterType]);

  return (
    <>
      <CrmHeader
        title={template ? template.label : 'Generate Letter'}
        subtitle="HR letter generation wizard"
        onMenuClick={open}
        actions={<Link href="/crm/hr/letters" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15} /> <span className="hidden sm:inline">Letters</span></Link>}
      />
      <div className="p-4 sm:p-6">
        {template ? <LetterWizard template={template} /> : missing ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center"><p className="font-bold text-gray-900">Letter type not found</p><Link href="/crm/hr/letters" className="mt-3 inline-block text-sm font-semibold text-red-600">Return to Letters</Link></div>
        ) : <div className="flex h-72 items-center justify-center"><Loader2 size={28} className="animate-spin text-red-600" /></div>}
      </div>
    </>
  );
}
