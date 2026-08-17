import type { Metadata } from "next";

import InnerPageHero from "@/components/InnerPageHero";
import PackageComparison from "@/components/PackageComparison";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Compare Baraat Packages",
  description: "Compare Baraat packages side by side by truck, groom entry, sound, dhol, Chhatris, effects, entertainment, Safa capacity and customization.",
  alternates: { canonical: "/compare-packages" },
  openGraph: {
    title: "Compare Baraat Packages | Plan My Baraat",
    description: "A simple side-by-side guide to choosing the right Baraat experience.",
    url: "/compare-packages",
    type: "website",
  },
};

export default function ComparePackagesPage() {
  return (
    <div className="inner-public-page min-h-screen bg-white font-sans text-[#010101]">
      <SiteHeader variant="contact" />
      <main>
        <InnerPageHero
          eyebrow="A clearer way to choose"
          title="Compare Baraat packages."
          lead="Understand what changes—and why it matters."
          description="Choose any three experiences and compare every important service in plain language. When you find the right fit, enquire directly on WhatsApp for availability and a personalized quote."
        />
        <section className="bg-[#010101]/[0.018]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
            <PackageComparison />
          </div>
        </section>
      </main>
      <SiteFooter variant="contact" />
    </div>
  );
}
import type { Metadata } from "next";

import InnerPageHero from "@/components/InnerPageHero";
import PackageComparison from "@/components/PackageComparison";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Compare Baraat Packages | Plan My Baraat",
  description: "Compare Plan My Baraat packages side by side. Understand DJ trucks, groom entries, sound, dhol, Chhatris, effects, entertainment, Safa capacity and customization in plain language.",
  alternates: { canonical: "/compare-packages" },
  openGraph: {
    title: "Compare Baraat Packages | Plan My Baraat",
    description: "A simple side-by-side guide to choosing the right Baraat experience.",
    url: "/compare-packages",
    type: "website",
  },
};

export default function ComparePackagesPage() {
  return (
    <div className="inner-public-page min-h-screen bg-white font-sans text-[#010101]">
      <SiteHeader variant="contact" />
      <main>
        <InnerPageHero
          eyebrow="A clearer way to choose"
          title="Compare Baraat packages."
          lead="Understand what changes—and why it matters."
          description="Choose any three experiences and compare every important service in plain language. When you find the right fit, enquire directly on WhatsApp for availability and a personalized quote."
        />
        <section className="bg-[#010101]/[0.018]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
            <PackageComparison />
          </div>
        </section>
      </main>
      <SiteFooter variant="contact" />
    </div>
  );
}
