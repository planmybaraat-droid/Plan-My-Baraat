import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';

export interface AuthTrustPoint {
  icon: LucideIcon;
  label: string;
  desc: string;
}

interface AuthShellProps {
  eyebrow: string;
  heading: React.ReactNode;
  description: string;
  trustPoints: AuthTrustPoint[];
  children: React.ReactNode;
}

/**
 * Shared two-column premium auth layout (brand panel + card) used by both
 * the Admin CRM login and the Staff Workspace login, so the two portals
 * always look like one product without duplicating ~100 lines of chrome.
 */
export default function AuthShell({ eyebrow, heading, description, trustPoints, children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Left — brand panel */}
      <div className="relative hidden lg:flex lg:w-[46%] xl:w-[42%] flex-col justify-between overflow-hidden bg-[#090a0d] text-white p-12">
        <div className="absolute inset-0 opacity-25 bg-cover bg-center" style={{ backgroundImage: "url('/images/venue_luxury.png')" }} aria-hidden="true" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(9,10,13,0.96) 10%, rgba(9,10,13,0.86) 55%, rgba(46,6,9,0.9) 100%)' }} aria-hidden="true" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30 animate-[float_6s_ease-in-out_infinite]" style={{ background: 'radial-gradient(circle, rgba(227,11,29,0.55), transparent 70%)' }} aria-hidden="true" />

        <div className="relative z-10">
          <div className="crm-brand-crop" aria-hidden="true">
            <Image src="/crm-logo-dark.png" alt="" width={1536} height={1024} className="crm-brand-image" priority />
          </div>
          <span className="mt-1 inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-white/50">
            <i className="h-px w-5 bg-red-600" /> {eyebrow} <i className="h-px w-5 bg-red-600" />
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight">{heading}</h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-sm">{description}</p>
        </div>

        <div className="relative z-10 space-y-4">
          {trustPoints.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                <Icon size={15} className="text-red-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/90">{label}</p>
                <p className="text-[11px] text-white/45">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — auth card */}
      <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="lg:hidden overflow-hidden rounded-2xl bg-[#090a0d] px-4 pb-4 pt-2 text-center shadow-[0_18px_44px_-28px_rgba(0,0,0,.9)]">
            <div className="crm-brand-crop mx-auto" aria-hidden="true">
              <Image src="/crm-logo-dark.png" alt="" width={1536} height={1024} className="crm-brand-image" priority />
            </div>
            <span className="mt-[-2px] inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">
              <i className="h-px w-5 bg-red-600" /> {eyebrow} <i className="h-px w-5 bg-red-600" />
            </span>
          </div>
          {children}
        </div>
        <p className="mt-6 text-[11px] text-gray-400">© {new Date().getFullYear()} Plan My Baraat. Internal use only.</p>
      </div>
    </div>
  );
}
