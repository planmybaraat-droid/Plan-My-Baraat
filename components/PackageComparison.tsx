"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, CircleHelp, GitCompareArrows, MessageCircle, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { BARAAT_PACKAGES, PACKAGE_COMPARISON_GROUPS, type PackageComparisonKey } from "@/lib/packagesData";

const ROW_HELP: Record<PackageComparisonKey, string> = {
  djTruck: "The moving production platform that carries the DJ, sound and visual setup through the procession.",
  groomEntry: "The vehicle or traditional entry option available for the groom.",
  sound: "The main audio experience used to carry music clearly across an outdoor dancing crowd.",
  ledPanel: "A moving display for celebration visuals, names and dynamic content during the procession.",
  dhol: "Live Punjabi drummers who add traditional rhythm alongside the DJ truck.",
  chhatri: "Illuminated ceremonial umbrellas that form a royal walking formation around the groom and family.",
  liquidCo2: "A safe, high-impact burst effect planned for key entry or music moments.",
  confetti: "A camera-friendly celebratory shower used at a planned reveal or arrival cue.",
  pyro: "Professionally operated visual highlights coordinated around the outdoor procession plan.",
  host: "A live host who engages guests, supports announcements and keeps the procession energy moving.",
  performer: "An interactive costumed entertainer who dances with guests and adds a playful visual element.",
  nameBoards: "Personalized boards that carry the groom, couple or family identity through the entry.",
  bouncers: "Professional support for guest flow, safe spacing and coordination around production equipment.",
  addOns: "Extra services that can be selected after the venue, route, guest count and entry idea are understood.",
  safas: "Professional turban styling capacity included for the groom and Baraat party.",
};

function whatsappPackageLink(packageName: string) {
  return `https://wa.me/919089081111?text=${encodeURIComponent(
    `Hello Plan My Baraat,\n\nI compared your packages and I am interested in the ${packageName}. Please share availability and a personalized quote for my event.`,
  )}`;
}

export default function PackageComparison() {
  const [selectedIds, setSelectedIds] = useState(["raj-tilak", "rajwada", "maharaja"]);
  const [differencesOnly, setDifferencesOnly] = useState(false);

  const selectedPackages = useMemo(
    () => selectedIds.map((id) => BARAAT_PACKAGES.find((pkg) => pkg.id === id) ?? BARAAT_PACKAGES[0]),
    [selectedIds],
  );

  const selectPackage = (column: number, id: string) => {
    setSelectedIds((current) => current.map((value, index) => (index === column ? id : value)));
  };

  const isDifferent = (key: PackageComparisonKey) => {
    const values = selectedPackages.map((pkg) => pkg.comparison[key]);
    return new Set(values).size > 1;
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-[#010101]/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E30B1D]/8 text-[#E30B1D]"><GitCompareArrows className="h-4.5 w-4.5" aria-hidden="true" /></span>
          <div>
            <p className="text-sm font-extrabold">Choose any three packages</p>
            <p className="mt-1 text-xs leading-5 text-[#010101]/45">Switch a column anytime. On smaller screens, swipe sideways to see every package.</p>
          </div>
        </div>
        <label className={`inline-flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-xl border px-4 text-xs font-extrabold transition-colors sm:justify-start ${differencesOnly ? "border-[#E30B1D]/25 bg-[#FFF3F4] text-[#B80918]" : "border-[#010101]/10 bg-white"}`}>
          <span>Highlight key differences</span>
          <input type="checkbox" checked={differencesOnly} onChange={(event) => setDifferencesOnly(event.target.checked)} className="h-4 w-4 accent-[#E30B1D]" />
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#010101]/10 bg-white shadow-[0_30px_90px_-75px_rgba(1,1,1,0.7)]">
        <div className="min-w-[880px]">
          <div className="grid grid-cols-[220px_repeat(3,minmax(0,1fr))] border-b border-[#010101]/10 bg-white">
            <div className="flex flex-col justify-end border-r border-[#010101]/10 p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E30B1D]">Your comparison</p>
              <p className="mt-2 text-sm font-bold leading-5 text-[#010101]/50">Everything important, side by side.</p>
            </div>
            {selectedPackages.map((pkg, column) => (
              <div key={`${column}-${pkg.id}`} className={`relative border-r border-[#010101]/10 p-4 last:border-r-0 ${pkg.featured ? "bg-[#E30B1D]/[0.025]" : ""}`}>
                <label className="block">
                  <span className="sr-only">Package in comparison column {column + 1}</span>
                  <select value={pkg.id} onChange={(event) => selectPackage(column, event.target.value)} className="h-11 w-full rounded-xl border border-[#010101]/12 bg-white px-3 text-xs font-extrabold outline-none transition-colors focus:border-[#E30B1D]">
                    {BARAAT_PACKAGES.map((option) => <option key={option.id} value={option.id} disabled={selectedIds.includes(option.id) && option.id !== pkg.id}>{option.shortName}</option>)}
                  </select>
                </label>
                <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl bg-[#010101]">
                  <Image src={pkg.image} alt={pkg.imageAlt} fill sizes="220px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010101]/75 via-transparent to-transparent" aria-hidden="true" />
                  <span className="absolute bottom-3 left-3 text-[9px] font-extrabold uppercase tracking-[0.13em] text-white/75">{pkg.tagline}</span>
                </div>
                <div className="mt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-lg font-extrabold tracking-[-0.03em]">{pkg.shortName}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.11em] text-[#E30B1D]">{pkg.custom ? "Fully custom" : `${pkg.features.length} inclusions`}</p></div>
                    {pkg.featured ? <span className="rounded-full bg-[#E30B1D] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-white">Popular</span> : null}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[#010101]/50"><strong className="text-[#010101]">Best for:</strong> {pkg.bestFor[0]}</p>
                </div>
              </div>
            ))}
          </div>

          {PACKAGE_COMPARISON_GROUPS.map((group) => {
            return (
              <section key={group.title} aria-label={group.title}>
                <div className="border-b border-[#010101]/10 bg-[#010101] px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white">{group.title}</div>
                {group.rows.map((row) => {
                  const different = isDifferent(row.key);
                  const highlighted = differencesOnly && different;
                  return (
                    <div key={row.key} className={`grid grid-cols-[220px_repeat(3,minmax(0,1fr))] border-b border-[#010101]/10 transition-colors last:border-b-0 ${highlighted ? "bg-[#FFF7F8]" : "bg-white"}`}>
                      <div className={`border-r border-[#010101]/10 p-5 transition-colors ${highlighted ? "bg-[#FFF0F2]" : ""}`}>
                        <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-extrabold leading-5">{row.label}</p><CircleHelp className="h-3.5 w-3.5 shrink-0 text-[#E30B1D]" aria-hidden="true" />{highlighted ? <span className="rounded-full bg-white px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#C30A19] ring-1 ring-[#E30B1D]/15">Key difference</span> : null}</div>
                        <p className="mt-2 text-[11px] leading-[1.55] text-[#010101]/43">{ROW_HELP[row.key]}</p>
                      </div>
                      {selectedPackages.map((pkg) => {
                        const value = pkg.comparison[row.key];
                        const unavailable = value === "—";
                        return (
                          <div key={`${pkg.id}-${row.key}`} className={`flex min-h-24 items-center border-r border-[#010101]/10 p-5 transition-colors last:border-r-0 ${highlighted ? "bg-[#FFF9F9]" : ""}`}>
                            <div className={`flex items-start gap-2.5 text-sm font-bold leading-5 ${unavailable ? "text-[#010101]/26" : "text-[#010101]/76"}`}>
                              {!unavailable ? <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E30B1D] text-white"><Check className="h-3 w-3" strokeWidth={2.6} aria-hidden="true" /></span> : null}
                              <span>{unavailable ? "Not included" : value}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </section>
            );
          })}

          <div className="grid grid-cols-[220px_repeat(3,minmax(0,1fr))] bg-[#010101]/[0.018]">
            <div className="border-r border-[#010101]/10 p-5"><p className="text-sm font-extrabold">Ready for the next step?</p><p className="mt-2 text-xs leading-5 text-[#010101]/45">Ask about availability and your event-specific quote.</p></div>
            {selectedPackages.map((pkg) => (
              <div key={`cta-${pkg.id}`} className="border-r border-[#010101]/10 p-4 last:border-r-0">
                <a href={whatsappPackageLink(pkg.name)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E30B1D] px-3 text-xs font-extrabold text-white transition-colors hover:bg-[#010101]"><MessageCircle className="h-4 w-4" aria-hidden="true" />Enquire on WhatsApp</a>
                <Link href={`/packages/${pkg.id}`} className="mt-2 inline-flex min-h-9 w-full items-center justify-center gap-1.5 text-[11px] font-extrabold text-[#010101]/48 transition-colors hover:text-[#E30B1D]">Full package details <ArrowUpRight className="h-3 w-3" aria-hidden="true" /></Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {BARAAT_PACKAGES.map((pkg) => (
          <article key={`guide-${pkg.id}`} className="rounded-2xl border border-[#010101]/10 bg-white p-6">
            <div className="flex items-center justify-between gap-4"><span className="text-[10px] font-extrabold tracking-[0.15em] text-[#E30B1D]">{pkg.number}</span><SlidersHorizontal className="h-4 w-4 text-[#E30B1D]" aria-hidden="true" /></div>
            <h3 className="mt-5 text-lg font-extrabold tracking-[-0.03em]">Choose {pkg.shortName} if…</h3>
            <ul className="mt-4 space-y-3">{pkg.bestFor.slice(0, 3).map((item) => <li key={item} className="flex items-start gap-2.5 text-xs font-semibold leading-5 text-[#010101]/58"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E30B1D]" aria-hidden="true" />{item}</li>)}</ul>
          </article>
        ))}
      </div>
    </div>
  );
}
