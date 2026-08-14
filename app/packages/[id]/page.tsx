import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Check,
  ChevronRight,
  GitCompareArrows,
  MapPinned,
  MessageCircle,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";

import EnquireNowButton from "@/components/EnquireNowButton";
import FAQAccordion from "@/components/FAQAccordion";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { BARAAT_PACKAGES } from "@/lib/packagesData";
import {
  generateJsonLdBreadcrumbGeneric,
  generateJsonLdFAQGeneric,
  generateJsonLdServiceGeneric,
  WHATSAPP_NUMBER,
} from "@/lib/seoHelpers";

const BASE_URL = "https://planmybaraat.com";

export function generateStaticParams() {
  return BARAAT_PACKAGES.map((pkg) => ({ id: pkg.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const pkg = BARAAT_PACKAGES.find((item) => item.id === params.id);
  if (!pkg) return {};

  const title = `${pkg.name} – ${pkg.tagline}`;
  const description = `${pkg.description} Understand every inclusion, who it suits, customization options and common questions.`;
  const canonical = `/packages/${pkg.id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: "PlanMyBaraat", type: "website", images: [pkg.image] },
    twitter: { card: "summary_large_image", title, description, images: [pkg.image] },
  };
}

function featureParts(feature: string) {
  const [title, ...details] = feature.split(/\s+-\s+/);
  return { title, detail: details.join(" — ") };
}

function paragraphs(text: string) {
  return text.split("\n\n");
}

const JOURNEY = [
  { number: "01", title: "Understand your event", body: "We confirm your date, city, venue, route, guest count and preferred groom-entry style." },
  { number: "02", title: "Personalize the plan", body: "Entry choice, music, visual moments, Safa count and any suitable upgrades are finalized together." },
  { number: "03", title: "Coordinate every team", body: "Artists, operators and support teams receive one clear production plan before the celebration." },
  { number: "04", title: "Execute the Baraat", body: "Our team manages the procession cues so your family can participate instead of coordinating vendors." },
];

export default function PackagePage({ params }: { params: { id: string } }) {
  const pkg = BARAAT_PACKAGES.find((item) => item.id === params.id);
  if (!pkg) notFound();

  const waText = encodeURIComponent(
    `Hello Plan My Baraat,\n\nI am interested in the ${pkg.name}. Please help me check availability and personalize it for my event date, city and guest count.`,
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  const jsonLdBreadcrumb = generateJsonLdBreadcrumbGeneric([
    { name: "Home", url: BASE_URL },
    { name: "Packages", url: `${BASE_URL}/packages` },
    { name: pkg.name, url: `${BASE_URL}/packages/${pkg.id}` },
  ]);
  const jsonLdService = generateJsonLdServiceGeneric({
    name: pkg.name,
    description: pkg.description,
    areaServedName: "Gujarat, India",
    url: `${BASE_URL}/packages/${pkg.id}`,
  });
  const jsonLdFaq = generateJsonLdFAQGeneric(pkg.faqs);

  const quickFacts = [
    { icon: Sparkles, label: "Production", value: pkg.comparison.djTruck },
    { icon: Users, label: "Royal formation", value: `${pkg.comparison.dhol} · ${pkg.comparison.chhatri}` },
    { icon: SlidersHorizontal, label: "Music", value: pkg.comparison.sound },
    { icon: CalendarCheck, label: "Safa support", value: pkg.comparison.safas },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdBreadcrumb }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdService }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdFaq }} />

      <div className="min-h-screen bg-white font-sans text-[#010101]">
        <SiteHeader variant="contact" />
        <main>
          <section className="relative overflow-hidden bg-[#080808] text-white">
            <Image src={pkg.image} alt={pkg.imageAlt} fill priority sizes="100vw" className="object-cover object-center opacity-58" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,1,1,0.94)_0%,rgba(1,1,1,0.79)_46%,rgba(1,1,1,0.24)_100%)]" aria-hidden="true" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(1,1,1,0.68)_0%,transparent_55%)]" aria-hidden="true" />
            <div className="relative mx-auto flex min-h-[38rem] max-w-7xl items-end px-5 pb-14 pt-32 sm:px-8 sm:pb-16 lg:min-h-[44rem] lg:px-10 lg:pb-20">
              <div className="max-w-3xl">
                <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                  <Link href="/" className="transition-colors hover:text-white">Home</Link><ChevronRight className="h-3 w-3" aria-hidden="true" />
                  <Link href="/packages" className="transition-colors hover:text-white">Packages</Link><ChevronRight className="h-3 w-3" aria-hidden="true" />
                  <span className="text-white/80">{pkg.shortName}</span>
                </nav>
                <div className="flex items-center gap-3"><span className="h-px w-10 bg-[#E30B1D]" /><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/78">Package {pkg.number} · {pkg.tagline}</p></div>
                <h1 className="mt-5 text-[clamp(3rem,8vw,6.4rem)] font-extrabold leading-[0.9] tracking-[-0.06em]">{pkg.shortName}</h1>
                <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/72 sm:text-lg">{pkg.description}</p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-[#E30B1D] px-6 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-[#010101]"><MessageCircle className="h-4 w-4" aria-hidden="true" />Enquire on WhatsApp</a>
                  <Link href="#inclusions" className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-white/22 bg-white/[0.06] px-6 text-sm font-extrabold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[#010101]">See every inclusion <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                </div>
              </div>
            </div>
          </section>

          <section className="relative z-10 mx-auto -mt-7 max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid overflow-hidden rounded-2xl border border-[#010101]/10 bg-white shadow-[0_30px_80px_-62px_rgba(1,1,1,0.75)] sm:grid-cols-2 xl:grid-cols-4">
              {quickFacts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex min-h-32 gap-4 border-b border-[#010101]/10 p-5 last:border-b-0 sm:p-6 sm:[&:nth-child(odd)]:border-r xl:border-b-0 xl:border-r xl:last:border-r-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E30B1D]/8 text-[#E30B1D]"><Icon className="h-4.5 w-4.5" aria-hidden="true" /></span>
                  <div><p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#010101]/38">{label}</p><p className="mt-2 text-sm font-extrabold leading-5">{value}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:px-10 lg:py-28">
            <Reveal>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D]">Understand the experience</p>
                <h2 className="mt-4 text-[clamp(2rem,4.2vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.05em]">What the {pkg.shortName} feels like.</h2>
                <div className="mt-7 space-y-5 text-sm leading-7 text-[#010101]/58 sm:text-base sm:leading-8">{paragraphs(pkg.longDescription).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <aside className="rounded-2xl bg-[#010101] p-6 text-white sm:p-8 lg:sticky lg:top-28">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ff6673]">This package is ideal for</p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.035em]">Choose it when these sound like your celebration.</h3>
                <ul className="mt-7 space-y-5">{pkg.bestFor.map((item) => <li key={item} className="flex items-start gap-3 text-sm font-semibold leading-6 text-white/72"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E30B1D] text-white"><Check className="h-3 w-3" strokeWidth={2.6} aria-hidden="true" /></span>{item}</li>)}</ul>
                <Link href="/compare-packages" className="mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-extrabold text-[#010101] transition-colors hover:bg-[#E30B1D] hover:text-white"><GitCompareArrows className="h-4 w-4" aria-hidden="true" />Compare with other packages</Link>
              </aside>
            </Reveal>
          </section>

          <section id="inclusions" className="scroll-mt-24 border-y border-[#010101]/10 bg-[#010101]/[0.018]">
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
              <Reveal>
                <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
                  <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D]">Complete package clarity</p><h2 className="mt-4 text-[clamp(2rem,4.2vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.05em]">Every included service, clearly explained.</h2></div>
                  <p className="max-w-2xl text-sm leading-7 text-[#010101]/55 sm:text-base">Nothing is hidden behind vague labels. This is the working foundation our team coordinates for the {pkg.shortName}, with suitable personalization confirmed for your venue and route.</p>
                </div>
              </Reveal>
              <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {pkg.features.map((feature, index) => {
                  const { title, detail } = featureParts(feature);
                  return <Reveal key={feature} delay={index % 3}><article className="flex h-full gap-4 rounded-2xl border border-[#010101]/10 bg-white p-5 transition-colors hover:border-[#E30B1D]/30 sm:p-6"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E30B1D] text-white"><Check className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" /></span><div><h3 className="text-sm font-extrabold leading-5">{title}</h3>{detail ? <p className="mt-2 text-xs leading-5 text-[#010101]/50">{detail}</p> : null}</div></article></Reveal>;
                })}
              </div>
            </div>
          </section>

          <section className="bg-[#0A0A0A] text-white">
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
              <Reveal><div className="max-w-3xl"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ff6673]">Package highlights</p><h2 className="mt-4 text-[clamp(2rem,4.2vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.05em]">The moments guests will notice.</h2></div></Reveal>
              <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/12 md:grid-cols-3">{pkg.highlights.map((highlight, index) => <Reveal key={highlight.heading} delay={index}><article className="h-full bg-[#0A0A0A] p-7 sm:p-9"><span className="text-4xl" aria-hidden="true">{highlight.icon}</span><h3 className="mt-7 text-xl font-extrabold tracking-[-0.03em]">{highlight.heading}</h3><p className="mt-3 text-sm leading-7 text-white/55">{highlight.body}</p></article></Reveal>)}</div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
            <Reveal><div className="max-w-3xl"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D]">From enquiry to execution</p><h2 className="mt-4 text-[clamp(2rem,4.2vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.05em]">How your Baraat comes together.</h2><p className="mt-5 text-sm leading-7 text-[#010101]/55 sm:text-base">One team turns all the moving parts into a clear plan, so your family knows what happens next.</p></div></Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{JOURNEY.map((step, index) => <Reveal key={step.number} delay={index % 2}><article className="h-full rounded-2xl border border-[#010101]/10 p-6 sm:p-7"><div className="flex items-center justify-between"><span className="text-xs font-extrabold tracking-[0.16em] text-[#E30B1D]">{step.number}</span><MapPinned className="h-4 w-4 text-[#E30B1D]" aria-hidden="true" /></div><h3 className="mt-8 text-lg font-extrabold tracking-[-0.025em]">{step.title}</h3><p className="mt-3 text-sm leading-6 text-[#010101]/52">{step.body}</p></article></Reveal>)}</div>
          </section>

          <section className="border-y border-[#010101]/10 bg-[#FFF7F8]">
            <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
              <div className="max-w-3xl"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D]">Built around the real event</p><h2 className="mt-3 text-[clamp(1.8rem,3.6vw,2.8rem)] font-extrabold tracking-[-0.045em]">Personalize the package without losing clarity.</h2><p className="mt-4 text-sm leading-7 text-[#010101]/55 sm:text-base">Guest count, route, venue rules and your preferred entry shape the final recommendation. We confirm compatible changes before preparing your event-specific quote.</p></div>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl bg-[#E30B1D] px-6 text-sm font-extrabold text-white transition-colors hover:bg-[#010101]"><MessageCircle className="h-4 w-4" aria-hidden="true" />Discuss customization</a>
            </div>
          </section>

          <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20 lg:px-10 lg:py-28">
            <Reveal><div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D]">Common questions</p><h2 className="mt-4 text-[clamp(2rem,4vw,3.3rem)] font-extrabold leading-[1.04] tracking-[-0.05em]">Clear answers before you enquire.</h2><p className="mt-5 max-w-md text-sm leading-7 text-[#010101]/55 sm:text-base">These are the questions families most often ask about the {pkg.shortName}.</p></div></Reveal>
            <Reveal delay={1}><FAQAccordion faqs={pkg.faqs.map((faq) => ({ question: faq.q, answer: faq.a }))} /></Reveal>
          </section>

          <section className="border-y border-[#010101]/10 bg-[#010101]/[0.018]">
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
              <Reveal><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D]">Explore your options</p><h2 className="mt-4 text-[clamp(1.9rem,4vw,3.1rem)] font-extrabold tracking-[-0.045em]">See the other Baraat experiences.</h2></div><Link href="/compare-packages" className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-[#010101]/12 bg-white px-5 text-xs font-extrabold hover:border-[#E30B1D] hover:text-[#E30B1D]"><GitCompareArrows className="h-4 w-4" aria-hidden="true" />Compare all packages</Link></div></Reveal>
              <div className="mt-10 grid gap-5 md:grid-cols-3">{BARAAT_PACKAGES.filter((item) => item.id !== pkg.id).map((other, index) => <Reveal key={other.id} delay={index}><Link href={`/packages/${other.id}`} className="group overflow-hidden rounded-2xl border border-[#010101]/10 bg-white"><div className="relative aspect-[16/10] overflow-hidden"><Image src={other.image} alt={other.imageAlt} fill sizes="(max-width:767px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#010101]/70 to-transparent" /></div><div className="p-5 sm:p-6"><p className="text-[9px] font-extrabold uppercase tracking-[0.13em] text-[#E30B1D]">{other.tagline}</p><div className="mt-2 flex items-center justify-between gap-4"><h3 className="text-xl font-extrabold tracking-[-0.035em]">{other.shortName}</h3><ArrowUpRight className="h-4 w-4 text-[#E30B1D]" aria-hidden="true" /></div><p className="mt-3 text-xs leading-5 text-[#010101]/50">{other.description}</p></div></Link></Reveal>)}</div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-16 lg:px-10 lg:py-28">
              <Reveal><div className="lg:sticky lg:top-28"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D]">Check your date</p><h2 className="mt-4 text-[clamp(2rem,4.2vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.05em]">Is the {pkg.shortName} right for your event?</h2><p className="mt-5 max-w-lg text-sm leading-7 text-[#010101]/55 sm:text-base">Share the essential details. Our team will check availability, understand your route and recommend the right package setup without showing generic pricing.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row"><a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E30B1D] px-6 text-sm font-extrabold text-white hover:bg-[#010101]"><MessageCircle className="h-4 w-4" aria-hidden="true" />WhatsApp our team</a><EnquireNowButton packageName={pkg.name} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#010101]/12 px-6 text-sm font-extrabold hover:border-[#E30B1D] hover:text-[#E30B1D]">Request a callback <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></EnquireNowButton></div></div></Reveal>
              <Reveal delay={1}><div className="rounded-2xl border border-[#010101]/10 bg-white p-5 shadow-[0_30px_90px_-70px_rgba(1,1,1,0.75)] sm:p-8"><LeadCaptureForm variant="hero" defaultPackage={pkg.name} /></div></Reveal>
            </div>
          </section>
        </main>
        <SiteFooter variant="contact" />
      </div>
    </>
  );
}
