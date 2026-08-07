'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CrmHeader from '../../components/CrmHeader';
import VendorForm from '../../components/VendorForm';
import { useSidebar } from '../../sidebar-context';
import { createVendor, getCities, getCategories, getPackages } from '../../lib/supabase-crm';
import type { VendorFormData, City, Category, VendorPackage } from '../../lib/types';

export default function NewVendorPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [packages, setPackages] = useState<VendorPackage[]>([]);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [c, cat, pkg] = await Promise.all([getCities(), getCategories(), getPackages()]);
        setCities(c); setCategories(cat); setPackages(pkg);
      } catch (err) {
        console.error(err);
      } finally {
        setInitLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (data: VendorFormData) => {
    await createVendor(data);
    router.push('/crm/vendors');
  };

  return (
    <>
      <CrmHeader
        title="Add Vendor"
        subtitle="Create a new vendor record"
        onMenuClick={open}
        actions={
          <Link href="/crm/vendors" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
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
            <VendorForm
              cities={cities}
              categories={categories}
              packages={packages}
              onSubmit={handleSubmit}
              onCancel={() => router.push('/crm/vendors')}
              submitLabel="Create Vendor"
            />
          )}
        </div>
      </div>
    </>
  );
}
