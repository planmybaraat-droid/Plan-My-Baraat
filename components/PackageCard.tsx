"use client";

import { Check, Crown, MessageCircle } from "lucide-react";

import type { BaraatPackage } from "@/lib/packagesData";

interface PackageCardProps {
  pkg: BaraatPackage;
  featured?: boolean;
  onEnquire: (pkg: BaraatPackage) => void;
}

export default function PackageCard({ pkg, featured, onEnquire }: PackageCardProps) {
  return (
    <div
      className={`group relative flex min-w-0 w-full flex-col border transition-all duration-300 hover:-translate-y-1 ${
        featured
          ? "rounded-[28px] border-[#9F1239]/30 bg-white/72 backdrop-blur-xl hover:bg-[#F8F4EE]"
          : "rounded-[28px] border-black/10 bg-white/62 backdrop-blur-xl hover:border-[#9F1239]/20 hover:bg-[#F8F4EE]"
      }`}
    >
      {featured ? (
        <span className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-[#9F1239] px-4 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-md">
          Most Popular
        </span>
      ) : null}

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[28px] p-7">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.58),rgba(255,255,255,0.18)_38%,rgba(255,255,255,0.06))] transition-opacity duration-300 group-hover:opacity-90" />

        <div className="relative z-10 mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#9F1239]/20 text-[#9F1239]">
          <Crown className="h-5 w-5" />
        </div>

        <h3 className="relative z-10 font-serif text-xl font-black tracking-wide text-black">
          {pkg.name}
        </h3>
        <span className="relative z-10 mt-1 text-[10px] font-bold uppercase tracking-widest text-[#9F1239]">
          {pkg.tagline}
        </span>
        <p className="relative z-10 mt-3 text-xs leading-relaxed text-black/50">{pkg.description}</p>

        <ul className="relative z-10 mt-5 flex-1 space-y-2.5">
          {pkg.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2.5 text-xs leading-snug">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9F1239]" />
              <span className="text-black/75">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => onEnquire(pkg)}
          className={`relative z-10 mt-7 flex h-12 w-full items-center justify-center gap-2.5 text-xs font-extrabold uppercase tracking-widest text-white transition-all duration-300 ${
            featured ? "rounded-full bg-[#9F1239] hover:bg-[#7d0f2d]" : "rounded-full bg-black hover:bg-[#9F1239]"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          Enquire on WhatsApp
        </button>
      </div>
    </div>
  );
}
