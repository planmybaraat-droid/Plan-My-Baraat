'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CrmHeader from '../../components/CrmHeader';
import LeadForm from '../../components/LeadForm';
import { useSidebar } from '../../sidebar-context';
import { createLead, getCities } from '../../lib/supabase-crm';
import type { LeadFormData, City } from '../../lib/types';

export default function NewLeadPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    getCities()
      .then(c => setCities(c))
      .catch(console.error)
      .finally(() => setInitLoading(false));
  }, []);

  const handleSubmit = async (data: LeadFormData) => {
    await createLead(data);
    router.push('/crm/leads');
  };

  return (
    <>
      <CrmHeader
        title="Add Lead"
        subtitle="Create a new customer lead"
        onMenuClick={open}
        actions={
          <Link href="/crm/leads" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={16} /> Back
          </Link>
        }
      />
      <div className="p-4 sm:p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {initLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 size={28} className="animate-spin text-red-500" />
            </div>
          ) : (
            <LeadForm
              cities={cities}
              onSubmit={handleSubmit}
              onCancel={() => router.push('/crm/leads')}
              submitLabel="Create Lead"
            />
          )}
        </div>
      </div>
    </>
  );
}
