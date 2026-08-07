import Image from 'next/image';

interface BrandedLoaderProps {
  label?: string;
}

/**
 * Shared full-screen loading state for both portals (Admin CRM + Staff
 * Workspace) — a single component so any future redesign only needs to
 * happen once. Used for the route-level Suspense fallback (crm/loading.tsx)
 * and the client-side auth-check gate in both portal layouts.
 */
export default function BrandedLoader({ label = 'Loading' }: BrandedLoaderProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-white">
      <div className="crm-loader-enter flex flex-col items-center gap-6">
        <div className="overflow-hidden rounded-2xl bg-[#090a0d] px-5 pb-4 pt-3 text-center shadow-[0_12px_32px_-16px_rgba(0,0,0,.35)]">
          <div className="crm-brand-crop mx-auto" aria-hidden="true">
            <Image src="/crm-logo-dark.png" alt="" width={1536} height={1024} className="crm-brand-image" priority />
          </div>
        </div>
        <span className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-gray-200 border-t-red-600" aria-hidden="true" />
        <p className="-mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400">{label}</p>
      </div>
    </div>
  );
}
