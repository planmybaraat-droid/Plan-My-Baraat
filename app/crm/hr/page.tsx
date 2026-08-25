'use client';

import Link from 'next/link';
import { ArrowRight, FilePenLine, FileSignature, FolderCheck, Wallet } from 'lucide-react';
import CrmHeader from '../components/CrmHeader';
import { useSidebar } from '../sidebar-context';

const HR_SECTIONS = [
  {
    href: '/crm/hr/letterhead',
    icon: FilePenLine,
    color: 'bg-rose-50 text-rose-600',
    title: 'Letterhead',
    description: 'Create blank or custom official company letterheads and download print-ready A4 PDFs without a scanner or QR code.',
  },
  {
    href: '/crm/hr/letters',
    icon: FileSignature,
    color: 'bg-red-50 text-red-600',
    title: 'Letters',
    description: 'Generate and manage employee letters — offer, joining, increment, promotion, relieving and more.',
  },
  {
    href: '/crm/hr/kyc',
    icon: FolderCheck,
    color: 'bg-blue-50 text-blue-600',
    title: 'KYC & Documents',
    description: 'Manage employee KYC and uploaded documents — identity, education, employment and bank records.',
  },
  {
    href: '/crm/hr/payroll',
    icon: Wallet,
    color: 'bg-emerald-50 text-emerald-600',
    title: 'Salary & Payroll',
    description: 'Salary details, payroll history and payslips — synced automatically from letters, no duplicate entry.',
  },
];

export default function HrHomePage() {
  const { open } = useSidebar();

  return (
    <>
      <CrmHeader title="HR Management" subtitle="Letters, letterhead, KYC, documents and payroll — all connected" onMenuClick={open} />
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {HR_SECTIONS.map(({ href, icon: Icon, color, title, description }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                <Icon size={24} />
              </span>
              <h2 className="mt-5 text-xl font-black tracking-tight text-gray-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-red-600">
                Open {title} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
