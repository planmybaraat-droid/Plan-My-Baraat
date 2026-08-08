'use client';

import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import CrmHeader from '../../crm/components/CrmHeader';
import { useSidebar } from '../../crm/sidebar-context';
import { getPackages } from '../../crm/lib/supabase-crm';
import type { VendorPackage } from '../../crm/lib/types';

export default function WorkspacePackagesPage() {
  const { open } = useSidebar();
  const [packages, setPackages] = useState<VendorPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPackages().then(setPackages).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <CrmHeader title="Packages" subtitle={`${packages.length} packages in the catalogue`} onMenuClick={open} notificationsHref="/workspace/notifications" />
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex h-60 items-center justify-center"><span className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" /></div>
        ) : !packages.length ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">
            <Package className="mx-auto text-red-600" size={28} />
            <p className="mt-4 font-black">No packages yet</p>
            <p className="mt-1 text-sm text-gray-400">Your admin manages the package catalogue from the CRM.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <div key={pkg.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-black text-gray-950">{pkg.name}</p>
                <p className="mt-1 text-lg font-black text-red-600">₹{Number(pkg.price).toLocaleString('en-IN')}</p>
                {pkg.description && <p className="mt-2 text-xs text-gray-500">{pkg.description}</p>}
                {pkg.features && <p className="mt-2 whitespace-pre-line text-xs text-gray-400">{pkg.features}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
