import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FAQAccordion from "@/components/FAQAccordion";
import EnquireNowButton from "@/components/EnquireNowButton";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import Reveal from "@/components/Reveal";
import { BARAAT_PACKAGES } from "@/lib/packagesData";
import { WHATSAPP_NUMBER } from "@/lib/seoHelpers";
import {
  generateJsonLdBreadcrumbGeneric,
  generateJsonLdServiceGeneric,
  generateJsonLdFAQGeneric,
} from "@/lib/seoHelpers";

const BASE_URL = "https://planmybaraat.com";

// Same hero imagery used for each package on the packages overview page,
// kept here so the detail page hero stays visually consistent with it.
const PACKAGE_HERO_IMAGES: Record<string, string> = {
  "raj-tilak": "/Assests/packages/raj-tilak-premium.jpeg",
  rajwada: "/Gallery/AMN_0591-scaled-Medium.webp",
  maharaja: "/Gallery/Homepage.png",
  signature: "/Gallery/AMN_9633-scaled-Medium.webp",
};

export function generateStaticParams() {
  return BARAAT_PACKAGES.map((pkg) => ({ id: pkg.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const pkg = BARAAT_PACKAGES.find((p) => p.id === params.id);
  if (!pkg) return {};

  const title = `${pkg.name} – ${pkg.tagline} | PlanMyBaraat`;
  const description = `${pkg.description} Full details on what's included, pricing guidance, and FAQs for the ${pkg.name} baraat package by PlanMyBaraat.`;
  const canonical = `/packages/${pkg.id}`;

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

function paragraphs(text: string) {
  return text.split("\n\n");
}

export default function PackagePage({ params }: { params: { id: string } }) {
  const pkg = BARAAT_PACKAGES.find((p) => p.id === params.id);
  if (!pkg) notFound();

  const waText = encodeURIComponent(
    `Hi PlanMyBaraat!\n\nI'm interested in the *${pkg.name}* (${pkg.tagline}).\n\nCould you share pricing and availability? Looking forward to hearing from you!`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  const breadcrumbItems = [
    { name: "Home", url: BASE_URL },
    { name: "Packages", url: `${BASE_URL}/packages` },
    { name: pkg.name, url: `${BASE_URL}/packages/${pkg.id}` },
  ];

  const jsonLdBreadcrumb = generateJsonLdBreadcrumbGeneric(breadcrumbItems);
  const jsonLdService = generateJsonLdServiceGeneric({
    name: pkg.name,
    description: pkg.description,
    areaServedName: "Gujarat, India",
    url: `${BASE_URL}/packages/${pkg.id}`,
  });
  const jsonLdFaq = generateJsonLdFAQGeneric(pkg.faqs);

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
            src={PACKAGE_HERO_IMAGES[pkg.id] ?? "/Gallery/Homepage.png"}
            alt={pkg.name}
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
                <Link href="/packages" className="hover:text-[#E30B1D]">Packages</Link>
                <span>/</span>
                <span className="text-white/60">{pkg.name}</span>
              </nav>

              <div className="hero-label-row mb-5 justify-center">
                <span className="hero-label-line" aria-hidden="true" />
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white sm:text-[11px]">
                  Baraat Package
                </p>
              </div>

              <h1 className="text-[clamp(2.1rem,5.4vw,3.75rem)] font-extrabold leading-[1] tracking-[-0.04em] text-white">
                {pkg.name}
              </h1>
              <p className="mt-3 text-base font-bold text-white sm:text-lg">{pkg.tagline}</p>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                {pkg.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-[#E30B1D] px-7 text-xs font-extrabold uppercase tracking-widest text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-[#010101]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
                <EnquireNowButton
                  packageName={pkg.name}
                  className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-white/25 bg-white/[0.06] px-7 text-xs font-extrabold uppercase tracking-widest text-white backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#010101]"
                >
                  Enquire Now
                </EnquireNowButton>
              </div>
            </div>
          </div>
        </section>

        {/* ── What's Included ── */}
        <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  Full Inclusions
                </p>
                <h2 className="text-[clamp(1.6rem,3.2vw,2.35rem)] font-extrabold leading-[1.1] tracking-[-0.035em]">
                  What&apos;s included in {pkg.name}
                </h2>
              </div>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pkg.features.map((f) => {
                const [title, ...rest] = f.split(" - ");
                const subtitle = rest.join(" - ");
                return (
                  <div
                    key={f}
                    className="flex items-start gap-3.5 rounded-2xl border border-[#010101]/10 bg-white p-4"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E30B1D] text-white">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold leading-5">{title}</p>
                      {subtitle && (
                        <p className="mt-0.5 text-xs leading-5 text-[#010101]/48">{subtitle}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Highlights ── */}
        <section className="border-y border-[#010101]/10 bg-[#010101]/[0.018] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  Key Highlights
                </p>
                <h2 className="text-[clamp(1.6rem,3.2vw,2.35rem)] font-extrabold leading-[1.1] tracking-[-0.035em]">
                  What makes this package stand out
                </h2>
              </div>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {pkg.highlights.map((h, i) => (
                <Reveal key={h.heading} delay={i}>
                  <div className="home-text-card flex h-full flex-col rounded-2xl border border-[#010101]/10 bg-white p-7">
                    <span className="text-4xl leading-none">{h.icon}</span>
                    <h3 className="mt-4 text-lg font-extrabold tracking-[-0.015em]">{h.heading}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#010101]/55">{h.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── About / Long Description ── */}
        <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <Reveal>
            <div className="mx-auto max-w-2xl">
              <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                In Detail
              </p>
              <h2 className="text-[clamp(1.4rem,2.8vw,1.95rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
                About the {pkg.name}
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-[#010101]/60 sm:text-base">
                {paragraphs(pkg.longDescription).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Best For ── */}
        <section className="border-y border-[#010101]/10 bg-[#010101]/[0.018] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <Reveal>
            <div className="mx-auto max-w-2xl">
              <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                Ideal For
              </p>
              <h2 className="text-[clamp(1.4rem,2.8vw,1.95rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
                Who should pick the {pkg.name}
              </h2>
              <ul className="mt-6 space-y-3">
                {pkg.bestFor.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E30B1D] text-white">
                      <Check className="h-3 w-3" strokeWidth={2.6} aria-hidden="true" />
                    </span>
                    <span className="text-sm leading-relaxed text-[#010101]/65">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <Reveal>
            <div className="mx-auto max-w-2xl">
              <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                Common Questions
              </p>
              <h2 className="text-[clamp(1.4rem,2.8vw,1.95rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
                FAQs for the {pkg.name}
              </h2>
              <div className="mt-6">
                <FAQAccordion
                  faqs={pkg.faqs.map((f) => ({ question: f.q, answer: f.a }))}
                />
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Lead Form ── */}
        <section className="border-t border-[#010101]/10 bg-[#010101]/[0.018] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                Get a Quote
              </p>
              <h2 className="text-[clamp(1.6rem,3.2vw,2.35rem)] font-extrabold leading-[1.1] tracking-[-0.035em]">
                Book the {pkg.name} for your baraat
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#010101]/55">
                Fill in your details and we&apos;ll confirm availability and pricing within the hour.
              </p>
            </div>
            <div className="mx-auto mt-8 max-w-xl">
              <LeadCaptureForm variant="hero" defaultPackage={pkg.name} />
            </div>
          </Reveal>
        </section>

        {/* ── Compare Packages ── */}
        <section className="bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  Compare
                </p>
                <h2 className="text-[clamp(1.4rem,2.8vw,1.95rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
                  Other baraat packages
                </h2>
              </div>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {BARAAT_PACKAGES.filter((p) => p.id !== pkg.id).map((other, i) => (
                <Reveal key={other.id} delay={i}>
                  <Link
                    href={`/packages/${other.id}`}
                    className="home-text-card flex h-full flex-col rounded-2xl border border-[#010101]/10 bg-white p-6"
                  >
                    <h3 className="text-base font-extrabold tracking-[-0.01em]">{other.name}</h3>
                    <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#E30B1D]">
                      {other.tagline}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-[#010101]/50">{other.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#010101]/60">
                      View details
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
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
                  Ready to plan your baraat?
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[#010101]/55 sm:text-base">
                  Message us on WhatsApp with your date and city — we&apos;ll confirm the {pkg.name} is available and send a full quote within the hour.
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
      </main>

      <SiteFooter variant="contact" />
    </>
  );
}
