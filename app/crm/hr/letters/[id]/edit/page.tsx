'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CrmHeader from '../../../../components/CrmHeader';
import { useSidebar } from '../../../../sidebar-context';
import { getEmployeeLetterById, getLetterTemplate } from '../../../hr-data';
import type { EmployeeLetterRecord, LetterTemplate } from '../../../../lib/types';
import LetterWizard from '../../components/LetterWizard';

export default function EditLetterPage() {
  const { open } = useSidebar();
  const params = useParams<{ id: string }>();
  const [letter, setLetter] = useState<EmployeeLetterRecord | null>(null);
  const [template, setTemplate] = useState<LetterTemplate | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    getEmployeeLetterById(params.id).then(async result => {
      if (!result) { setMissing(true); return; }
      setLetter(result);
      const templateResult = await getLetterTemplate(result.letter_type);
      setTemplate(templateResult);
      setMissing(!templateResult);
    });
  }, [params.id]);

  return (
    <>
      <CrmHeader
        title={template ? `Edit — ${template.label}` : 'Edit Letter'}
        subtitle="Update letter content and regenerate the PDF"
        onMenuClick={open}
        actions={<Link href="/crm/hr/letters" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15} /> <span className="hidden sm:inline">Letters</span></Link>}
      />
      <div className="p-4 sm:p-6">
        {template && letter ? <LetterWizard template={template} existingLetter={letter} /> : missing ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center"><p className="font-bold text-gray-900">Letter not found</p><Link href="/crm/hr/letters" className="mt-3 inline-block text-sm font-semibold text-red-600">Return to Letters</Link></div>
        ) : <div className="flex h-72 items-center justify-center"><Loader2 size={28} className="animate-spin text-red-600" /></div>}
      </div>
    </>
  );
}
