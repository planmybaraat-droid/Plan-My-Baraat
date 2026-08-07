import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FAQAccordion from "@/components/FAQAccordion";
import EnquireNowButton from "@/components/EnquireNowButton";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import SeoLinkBlock from "@/components/SeoLinkBlock";
import KeywordTagBlock from "@/components/KeywordTagBlock";
import Reveal from "@/components/Reveal";
import { ALL_BARAAT_LOCATIONS, getLocationBySlug } from "@/lib/data/baraatLocations";
import { BARAAT_CITY_CONTENT } from "@/lib/data/baraatCityContent";
import { BARAAT_KEYWORDS } from "@/lib/data/baraatKeywordList";
import { BARAAT_PACKAGES } from "@/lib/packagesData";
import { SITE_IMAGES } from "@/lib/siteImages";
import { WHATSAPP_NUMBER } from "@/lib/seoHelpers";
import {
  generateJsonLdBreadcrumbGeneric,
  generateJsonLdServiceGeneric,
  generateJsonLdFAQGeneric,
} from "@/lib/seoHelpers";

const BASE_URL = "https://planmybaraat.com";

export function generateStaticParams() {
  return Object.keys(BARAAT_CITY_CONTENT).map((slug) => ({ location: slug }));
}

function paragraphs(text: string) {
  return text.split("\n\n");
}

export async function generateMetadata({
  params,
}: {
  params: { location: string };
}): Promise<Metadata> {
  const loc = getLocationBySlug(params.location);
  const content = BARAAT_CITY_CONTENT[params.location];
  if (!loc || !content) return {};

  const title = `Baraat Packages in ${loc.name}`;
  const description = `DJ truck, dhol team, vintage car, and safa styling for your baraat in ${loc.name}, ${loc.state}. Four curated packages, real pricing guidance, one WhatsApp enquiry.`;
  const canonical = `/${params.location}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "PlanMyBaraat",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function LocationPage({
  params,
}: {
  params: { location: string };
}) {
  const loc = getLocationBySlug(params.location);
  const content = BARAAT_CITY_CONTENT[params.location];

  if (!loc || !content) notFound();

  const parent = loc.parentCity
    ? ALL_BARAAT_LOCATIONS.find((l) => l.slug === loc.parentCity && l.type === "city")
    : undefined;
  const displayRegion = parent ? `${loc.name}, ${parent.name}` : `${loc.name}, ${loc.state}`;

  const waText = encodeURIComponent(
    `Hi PlanMyBaraat!\n\nI'm looking for baraat package services in ${loc.name}${parent ? `, ${parent.name}` : ""}. Please share package details and availability.`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  const breadcrumbItems = [
    { name: "Home", url: BASE_URL },
    ...(parent ? [{ name: parent.name, url: `${BASE_URL}/${parent.slug}` }] : []),
    { name: loc.name, url: `${BASE_URL}/${loc.slug}` },
  ];

  const jsonLdBreadcrumb = generateJsonLdBreadcrumbGeneric(breadcrumbItems);
  const jsonLdService = generateJsonLdServiceGeneric({
    name: `Baraat Package Services in ${loc.name}`,
    description: `DJ truck, dhol team, vintage car, and safa styling for baraat processions in ${loc.name}, ${loc.state}.`,
    areaServedName: displayRegion,
    url: `${BASE_URL}/${loc.slug}`,
  });
  const jsonLdFaq = generateJsonLdFAQGeneric(content.faqs);

  const sections: Array<{ eyebrow: string; heading: string; body: string }> = [
    { eyebrow: "Local Area", heading: `Where we work in ${loc.name}`, body: content.localArea },
    { eyebrow: "What's Included", heading: "What every package includes", body: content.whatsIncluded },
    { eyebrow: "Why PlanMyBaraat", heading: `Why families in ${loc.name} choose us`, body: content.whyUs },
    { eyebrow: "Pricing", heading: "How pricing works", body: content.pricingGuidance },
    { eyebrow: "Planning", heading: "Planning your baraat entry", body: content.planningNotes },
  ];

  const childAreas = ALL_BARAAT_LOCATIONS.filter(
    (l) =>
      l.parentCity === loc.slug &&
      (l.type === "area" || l.type === "town") &&
      Boolean(BARAAT_CITY_CONTENT[l.slug])
  );

  const siblingAreas =
    childAreas.length === 0 && loc.parentCity
      ? ALL_BARAAT_LOCATIONS.filter(
          (l) =>
            l.parentCity === loc.parentCity &&
            l.slug !== loc.slug &&
            Boolean(BARAAT_CITY_CONTENT[l.slug])
        )
      : [];

  const areasBlock = childAreas.length > 0 ? childAreas : siblingAreas;
  const areasTitle =
    childAreas.length > 0
      ? `Areas we serve in ${loc.name}`
      : `Other areas we serve near ${loc.name}`;
  const areasSummary =
    childAreas.length > 0
      ? `${childAreas.length} localities across ${loc.name} where we run baraat packages.`
      : `${areasBlock.length} more localities in ${parent?.name ?? loc.state} where we run baraat packages.`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdBreadcrumb }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdService }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdFaq }} />

      <SiteHeader variant="contact" />

      <main className="bg-white font-sans text-[#010101]">
        {/* ── Hero ── */}
        <section className="contact-hero">
          <Image
            src={SITE_IMAGES.heroFloral}
            alt={`Baraat procession in ${loc.name}`}
            fill
            priority
            sizes="100vw"
            className="contact-hero-image"
          />
          <div className="contact-hero-overlay" aria-hidden="true" />

          <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <nav className="mb-3 flex items-center justify-center gap-1 text-[9px] uppercase tracking-wide text-white/40">
                <Link href="/" className="hover:text-[#E30B1D]">Home</Link>
                <span>/</span>
                {parent ? (
                  <>
                    <Link href={`/${parent.slug}`} className="hover:text-[#E30B1D]">{parent.name}</Link>
                    <span>/</span>
                  </>
                ) : null}
                <span className="text-white/60">{loc.name}</span>
              </nav>

              <div className="hero-label-row mb-5 justify-center">
                <span className="hero-label-line" aria-hidden="true" />
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white sm:text-[11px]">
                  {displayRegion}
                </p>
              </div>

              <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-white">
                Baraat Packages in {loc.name}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                A double-decker DJ truck, a dhol team, a vintage car, and safa styling —
                booked as one package for your baraat entry in {loc.name}.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-xl">
              <LeadCaptureForm variant="hero" defaultLocation={loc.name} />
            </div>
          </div>
        </section>

        {/* ── Intro ── */}
        <section className="bg-white px-5 py-14 sm:px-8 lg:px-10">
          <Reveal>
            <div className="mx-auto max-w-2xl space-y-4 text-sm leading-7 text-[#010101]/60 sm:text-base">
              {paragraphs(content.intro).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── Packages ── */}
        <section className="border-y border-[#010101]/10 bg-[#010101]/[0.018] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  Our Packages
                </p>
                <h2 className="text-[clamp(1.6rem,3.2vw,2.35rem)] font-extrabold leading-[1.1] tracking-[-0.035em]">
                  Choose your entry for {loc.name}
                </h2>
              </div>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {BARAAT_PACKAGES.map((pkg, i) => (
                <Reveal key={pkg.id} delay={i}>
                  <div className="home-package-card flex h-full flex-col rounded-2xl border border-[#010101]/10 bg-white p-6">
                    <h3 className="text-lg font-extrabold tracking-[-0.015em]">{pkg.name}</h3>
                    <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#E30B1D]">
                      {pkg.tagline}
                    </span>
                    <p className="mt-2 text-xs leading-relaxed text-[#010101]/50">{pkg.description}</p>
                    <ul className="mt-4 flex-1 space-y-2">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs leading-relaxed text-[#010101]/65">
                          <span className="mt-0.5 text-[#E30B1D]">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-center gap-2">
                      <EnquireNowButton
                        packageName={pkg.name}
                        className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[#E30B1D] text-xs font-extrabold uppercase tracking-widest text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#010101]"
                      >
                        Enquire Now
                      </EnquireNowButton>
                      <a
                        href={`/packages/${pkg.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 items-center justify-center rounded-xl border border-[#010101]/15 px-4 text-[10px] font-extrabold uppercase tracking-widest text-[#010101]/60 transition-all duration-200 hover:border-[#E30B1D] hover:text-[#E30B1D]"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Body sections ── */}
        {sections.map((section, idx) => (
          <section
            key={section.heading}
            className={`px-5 py-14 sm:px-8 sm:py-16 lg:px-10 ${
              idx % 2 === 1 ? "border-y border-[#010101]/10 bg-[#010101]/[0.018]" : "bg-white"
            }`}
          >
            <Reveal>
              <div className="mx-auto max-w-2xl">
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  {section.eyebrow}
                </p>
                <h2 className="text-[clamp(1.4rem,2.8vw,1.95rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-[#010101]/60 sm:text-base">
                  {paragraphs(section.body).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>
        ))}

        {/* ── FAQ ── */}
        <section className="border-t border-[#010101]/10 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <Reveal>
            <div className="mx-auto max-w-2xl">
              <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                Common Questions
              </p>
              <h2 className="text-[clamp(1.4rem,2.8vw,1.95rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
                FAQs for a baraat in {loc.name}
              </h2>
              <div className="mt-6">
                <FAQAccordion
                  faqs={content.faqs.map((f) => ({ question: f.q, answer: f.a }))}
                />
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Closing CTA ── */}
        <section className="border-t border-[#010101]/10 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <Reveal>
            <div className="mx-auto grid max-w-7xl items-end gap-8 rounded-2xl border border-[#010101]/10 bg-[#010101]/[0.018] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12">
              <div className="max-w-2xl">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D]">
                  Ready when you are
                </p>
                <h2 className="mt-3 text-[clamp(1.6rem,3.2vw,2.35rem)] font-extrabold leading-[1.1] tracking-[-0.035em]">
                  Ready to plan your baraat in {loc.name}?
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[#010101]/55 sm:text-base">
                  {content.closing}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-[#E30B1D] px-7 text-xs font-extrabold uppercase tracking-widest text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#010101]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
                <EnquireNowButton className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-[#010101]/15 bg-white px-7 text-xs font-extrabold uppercase tracking-widest text-[#010101] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E30B1D] hover:text-[#E30B1D]">
                  Get a Callback
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </EnquireNowButton>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Areas mesh ── */}
        {areasBlock.length > 0 ? (
          <section className="border-t border-[#010101]/10 bg-white px-5 py-12 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-4xl">
              <SeoLinkBlock
                title={areasTitle}
                summary={areasSummary}
                items={areasBlock.map((a) => ({ label: a.name, href: `/${a.slug}` }))}
              />
            </div>
          </section>
        ) : null}

        {/* ── Popular searches ── */}
        <section className="border-t border-[#010101]/10 bg-white px-5 pb-16 pt-2 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <KeywordTagBlock
              title="Popular baraat searches"
              summary={`${BARAAT_KEYWORDS.length} baraat-related searches people use across Gujarat.`}
              items={BARAAT_KEYWORDS.map((k) => ({ label: k.phrase }))}
            />
          </div>
        </section>
      </main>

      <SiteFooter variant="contact" />
    </>
  );
}
