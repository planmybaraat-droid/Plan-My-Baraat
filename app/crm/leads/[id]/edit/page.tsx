'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CrmHeader from '../../../components/CrmHeader';
import LeadForm from '../../../components/LeadForm';
import { useSidebar } from '../../../sidebar-context';
import { getLeadById, updateLead, getCities } from '../../../lib/supabase-crm';
import type { CustomerLead, LeadFormData, City } from '../../../lib/types';

export default function EditLeadPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<CustomerLead | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [l, c] = await Promise.all([getLeadById(id), getCities()]);
        setLead(l); setCities(c);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSubmit = async (data: LeadFormData) => {
    await updateLead(id, data);
    router.push(`/crm/leads/${id}`);
  };

  return (
    <>
      <CrmHeader
        title="Edit Lead"
        subtitle={lead?.customer_name}
        onMenuClick={open}
        actions={
          <Link href={`/crm/leads/${id}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={16} /> Back
          </Link>
        }
      />
      <div className="p-4 sm:p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 size={28} className="animate-spin text-red-500" />
            </div>
          ) : lead ? (
            <LeadForm
              initialData={{
                customer_name: lead.customer_name,
                mobile: lead.mobile,
                email: lead.email ?? '',
                city_id: lead.city_id ?? '',
                requirement: lead.requirement ?? '',
                event_date: lead.event_date ?? '',
                package_discussed: lead.package_discussed ?? '',
                status: lead.status,
                remarks: lead.remarks ?? '',
              }}
              cities={cities}
              onSubmit={handleSubmit}
              onCancel={() => router.push(`/crm/leads/${id}`)}
              submitLabel="Update Lead"
            />
          ) : (
            <p className="text-center text-gray-500">Lead not found</p>
          )}
        </div>
      </div>
    </>
  );
}
