'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CrmHeader from '../../../components/CrmHeader';
import VendorForm from '../../../components/VendorForm';
import { useSidebar } from '../../../sidebar-context';
import { getVendorById, updateVendor, getCities, getCategories, getPackages } from '../../../lib/supabase-crm';
import type { Vendor, VendorFormData, City, Category, VendorPackage } from '../../../lib/types';

export default function EditVendorPage() {
  const { open } = useSidebar();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [packages, setPackages] = useState<VendorPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [v, c, cat, pkg] = await Promise.all([
          getVendorById(id),
          getCities(),
          getCategories(),
          getPackages(),
        ]);
        setVendor(v);
        setCities(c);
        setCategories(cat);
        setPackages(pkg);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSubmit = async (data: VendorFormData) => {
    await updateVendor(id, data);
    router.push(`/crm/vendors/${id}`);
  };

  return (
    <>
      <CrmHeader
        title="Edit Vendor"
        subtitle={vendor?.company_name}
        onMenuClick={open}
        actions={
          <Link href={`/crm/vendors/${id}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
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
          ) : vendor ? (
            <VendorForm
              initialData={{
                company_name: vendor.company_name,
                contact_person: vendor.contact_person,
                mobile: vendor.mobile,
                email: vendor.email ?? '',
                city_id: vendor.city_id ?? '',
                category_id: vendor.category_id ?? '',
                package_id: vendor.package_id ?? '',
                status: vendor.status,
                remarks: vendor.remarks ?? '',
              }}
              cities={cities}
              categories={categories}
              packages={packages}
              onSubmit={handleSubmit}
              onCancel={() => router.push(`/crm/vendors/${id}`)}
              submitLabel="Update Vendor"
            />
          ) : (
            <p className="text-center text-gray-500">Vendor not found</p>
          )}
        </div>
      </div>
    </>
  );
}
