import type { Metadata } from 'next';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { ShieldCheck, ShieldAlert, CalendarDays, Package, IndianRupee, Hash, FileCheck2, Wallet, Info } from 'lucide-react';
import { publicSupabaseKey, publicSupabaseUrl } from '../../../lib/deployment-config';

export const metadata: Metadata = {
  title: 'Document Verification',
  description: 'Verify the authenticity of a PlanMyBaraat client or vendor document.',
  robots: { index: false, follow: false },
};

interface VerifyResult {
  found: boolean;
  audience?: 'client' | 'vendor' | 'employee';
  doc_type?: string;
  document_number?: string;
  party_label?: string;
  party_name?: string;
  event_date?: string | null;
  package_name?: string | null;
  status?: string;
  amount?: number;
  amount_paid?: number;
  balance_due?: number;
  valid_until?: string | null;
  agreement_number?: string | null;
  vendor_name?: string | null;
  service_category?: string | null;
  agreement_end_date?: string | null;
  blacklist_status?: string | null;
  version?: number;
  issued_date?: string;
  issue_date?: string;
  month?: number;
  year?: number;
}

async function verifyDocument(code: string): Promise<VerifyResult> {
  const supabaseUrl = publicSupabaseUrl;
  const supabaseAnonKey = publicSupabaseKey;
  if (!supabaseUrl || !supabaseAnonKey) return { found: false };

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.rpc('crm_verify_document', { p_code: code });
    if (error || !data) return { found: false };
    return data as VerifyResult;
  } catch {
    return { found: false };
  }
}

const formatDate = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return '';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
};

function Row({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
      <span className="flex items-center gap-2 text-[13px] font-semibold text-gray-500"><Icon size={15} className="text-gray-400" />{label}</span>
      <span className="text-right text-[13px] font-bold text-gray-950">{value}</span>
    </div>
  );
}

export default async function VerifyPage({ params }: { params: { code: string } }) {
  const result = await verifyDocument(params.code);

  if (!result.found) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fcfbf9] px-4 py-12">
        <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <ShieldAlert size={30} className="text-red-600" />
          </div>
          <h1 className="mt-5 text-lg font-black text-gray-950">Document not recognized</h1>
          <p className="mt-2 text-sm text-gray-500">This QR code doesn&apos;t match any document in PlanMyBaraat&apos;s records. It may be invalid, expired, or altered.</p>
          <p className="mt-5 text-xs font-semibold text-gray-400">If you believe this is an error, contact PlanMyBaraat directly at +91 90890 81111.</p>
        </div>
      </main>
    );
  }

  const isVendor = result.audience === 'vendor';
  const isEmployee = result.audience === 'employee';
  const statusStyles: Record<string, string> = {
    Signed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Draft: 'bg-amber-50 text-amber-700 border-amber-200',
    Sent: 'bg-amber-50 text-amber-700 border-amber-200',
    Issued: 'bg-amber-50 text-amber-700 border-amber-200',
    'Partially Paid': 'bg-amber-50 text-amber-700 border-amber-200',
    Overdue: 'bg-red-50 text-red-700 border-red-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
    Terminated: 'bg-red-50 text-red-700 border-red-200',
    Expired: 'bg-red-50 text-red-700 border-red-200',
  };
  const statusClass = (result.status && statusStyles[result.status]) || 'bg-gray-50 text-gray-700 border-gray-200';
  const isSuspended = result.blacklist_status && result.blacklist_status !== 'Active';

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#fcfbf9] px-4 py-10 sm:py-14">
      <div className="w-full max-w-sm">
        <div className="mb-5 flex justify-center">
          <Image src="/logo.png" alt="PlanMyBaraat" width={168} height={48} className="h-10 w-auto object-contain" priority />
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col items-center gap-3 border-b border-gray-100 bg-gradient-to-b from-emerald-50/70 to-transparent px-6 pb-6 pt-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
              <ShieldCheck size={30} className="text-white" />
            </div>
            <h1 className="text-lg font-black text-gray-950">Verified Original Document</h1>
            <p className="text-[13px] text-gray-500">This {result.doc_type?.toLowerCase()} was issued by PlanMyBaraat and matches our official records.</p>
            <span className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wide ${statusClass}`}>{result.status}</span>
          </div>

          <div className="px-6 py-5">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{isVendor ? 'Vendor agreement' : result.doc_type}</p>
            <p className="mt-1 text-center text-xl font-black text-gray-950">{result.document_number}</p>

            <div className="mt-5">
              <Row icon={FileCheck2} label={result.party_label || 'Party'} value={result.party_name} />
              {!isVendor && !isEmployee && <Row icon={CalendarDays} label="Event date" value={formatDate(result.event_date)} />}
              {!isVendor && !isEmployee && result.package_name && <Row icon={Package} label="Package" value={result.package_name} />}
              {isVendor && <Row icon={Package} label="Service category" value={result.service_category} />}
              {isVendor && <Row icon={CalendarDays} label="Valid until" value={formatDate(result.agreement_end_date)} />}
              {isEmployee && result.month && result.year && <Row icon={CalendarDays} label="Pay period" value={`${['January','February','March','April','May','June','July','August','September','October','November','December'][result.month - 1]} ${result.year}`} />}
              {isEmployee && result.doc_type === 'Payslip' && result.amount !== undefined && <Row icon={IndianRupee} label="Net salary" value={formatCurrency(result.amount)} />}
              {!isVendor && !isEmployee && result.amount !== undefined && result.amount > 0 && <Row icon={IndianRupee} label="Document value" value={formatCurrency(result.amount)} />}
              {!isVendor && !isEmployee && result.balance_due !== undefined && <Row icon={Wallet} label="Balance due" value={formatCurrency(result.balance_due)} />}
              {result.valid_until && <Row icon={CalendarDays} label="Quotation valid until" value={formatDate(result.valid_until)} />}
              {result.agreement_number && <Row icon={Hash} label="Linked agreement" value={result.agreement_number} />}
              <Row icon={CalendarDays} label="Issued on" value={formatDate(result.issued_date || result.issue_date)} />
              {result.version !== undefined && <Row icon={Hash} label="Version" value={`v${result.version}`} />}
            </div>

            {isSuspended && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] font-semibold text-red-700">
                <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                <span>This vendor&apos;s standing is currently &ldquo;{result.blacklist_status}&rdquo; with PlanMyBaraat.</span>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 border-t border-gray-100 bg-gray-50/60 px-6 py-4 text-[11px] text-gray-500">
            <Info size={14} className="mt-0.5 shrink-0 text-gray-400" />
            <span>Only non-sensitive details are shown here for verification purposes. For questions about this {isVendor ? 'agreement' : 'document'}, contact PlanMyBaraat at +91 90890 81111.</span>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] font-semibold text-gray-400">PlanMyBaraat &middot; Premium Baraat Planning</p>
      </div>
    </main>
  );
}
