'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 space-y-6 text-center">
        <div className="overflow-hidden rounded-2xl bg-[#090a0d] px-4 pb-4 pt-2 shadow-[0_18px_44px_-28px_rgba(0,0,0,.9)]">
          <div className="crm-brand-crop mx-auto" aria-hidden="true">
            <Image src="/crm-logo-dark.png" alt="" width={1536} height={1024} className="crm-brand-image" priority />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <ShieldAlert size={24} className="text-red-600" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">You don&apos;t have access to this</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            Your account doesn&apos;t have permission to view this page. If you think this is a mistake, ask an admin to review your role.
          </p>
        </div>

        <Link
          href="/crm"
          className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
