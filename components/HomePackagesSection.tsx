"use client";

import { useState } from "react";

import PackageCard from "@/components/PackageCard";
import PackageEnquiryModal from "@/components/PackageEnquiryModal";
import type { BaraatPackage } from "@/lib/packagesData";
import { BARAAT_PACKAGES } from "@/lib/packagesData";

export default function HomePackagesSection() {
  const [selectedPackage, setSelectedPackage] = useState<BaraatPackage | null>(null);

  return (
    <>
      <section
        id="packages"
        className="mx-auto max-w-7xl overflow-hidden space-y-8 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="space-y-1 text-center">
          <span className="block text-[9px] font-bold uppercase tracking-widest text-[#9F1239]">
            Curated Baraat Packages
          </span>
          <h2 className="font-serif text-2xl font-black tracking-wide text-black md:text-4xl">
            Choose Your Royal Experience
          </h2>
          <p className="mx-auto max-w-2xl pt-2 text-xs text-black/50 md:text-sm">
            Every package can be customized for your celebration with music,
            lights, entry style, and add-ons tailored to your event.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4">
          {BARAAT_PACKAGES.map((pkg, index) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              featured={index === 2}
              onEnquire={setSelectedPackage}
            />
          ))}
        </div>
      </section>

      {selectedPackage ? (
        <PackageEnquiryModal pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />
      ) : null}
    </>
  );
}
