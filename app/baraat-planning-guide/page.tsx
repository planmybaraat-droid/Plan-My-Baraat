import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarCheck2, CloudRain, GitCompareArrows, Route, ShieldCheck } from "lucide-react";

import FAQAccordion from "@/components/FAQAccordion";
import InnerPageHero from "@/components/InnerPageHero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  ORGANIZATION_ID,
  generateJsonLdBreadcrumbGeneric,
  generateJsonLdFAQGeneric,
} from "@/lib/seoHelpers";

export const metadata: Metadata = {
  title: "Baraat Planning Guide and Checklist",
  description:
    "Plan a smooth Baraat with clear guidance for timelines, routes, venue coordination, safety, weather contingencies and package comparison.",
  alternates: { canonical: "/baraat-planning-guide" },
};

const FAQS = [
  {
    question: "How early should we book our Baraat team?",
    answer:
      "Start once your date, city and venue are confirmed. Popular wedding dates and specialist vehicles or artists can require more lead time, so early availability checks give you more choices.",
  },
  {
    question: "What information is needed for an accurate quote?",
    answer:
      "Share the event date, city, venue, estimated route, guest count, preferred entry, sound and lighting expectations, Safa quantity, effects and any venue restrictions. Quotes are personalized; package prices are not published on the website.",
  },
  {
    question: "Who checks permissions for sound, vehicles and effects?",
    answer:
      "Requirements vary by venue and local authority. The family, venue and planning team should confirm applicable rules before finalizing sound levels, vehicle access, pyrotechnics or CO2 effects.",
  },
  {
    question: "What happens if it rains or the Baraat is delayed?",
    answer:
      "Build a backup route, protected waiting area and revised cue plan before the event. Weather-sensitive equipment and effects should only proceed when the venue and operating team confirm conditions are suitable.",
  },
  {
    question: "How do we choose between packages?",
    answer:
      "Compare the entry vehicle, sound scale, dhol count, Chhatri coverage, visual effects, Safa capacity and entertainment. Choose the closest foundation, then personalize it around your venue and guest experience.",
  },
] as const;

const STEPS = [
  {
    icon: CalendarCheck2,
    title: "Confirm the event brief",
    text: "Date, city, venue, guest count and the groom's preferred entry determine availability and production scale.",
  },
  {
    icon: Route,
    title: "Walk through the route",
    text: "Confirm vehicle width, turning space, assembly point, procession distance, venue gate and final entry cue.",
  },
  {
    icon: ShieldCheck,
    title: "Check safety and permissions",
    text: "Align with the venue and relevant local authority on sound, traffic access, power, effects and operating restrictions.",
  },
  {
    icon: CloudRain,
    title: "Prepare a contingency",
    text: "Agree on rain, delay and route-change decisions before the event so every team follows the same backup plan.",
  },
] as const;

export default function BaraatPlanningGuidePage() {
  const faqItems = FAQS.map((faq) => ({ question: faq.question, answer: faq.answer }));
  const faqSchema = generateJsonLdFAQGeneric(
    FAQS.map((faq) => ({ q: faq.question, a: faq.answer })),
  );
  const breadcrumbSchema = generateJsonLdBreadcrumbGeneric([
    { name: "Home", url: "https://planmybaraat.com" },
    { name: "Baraat Planning Guide", url: "https://planmybaraat.com/baraat-planning-guide" },
  ]);
  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Baraat Planning Guide and Checklist",
    description: metadata.description,
    mainEntityOfPage: "https://planmybaraat.com/baraat-planning-guide",
    publisher: { "@id": ORGANIZATION_ID },
    dateModified: "2026-08-17",
  });

  return (
    <div className="inner-public-page min-h-screen bg-white font-sans text-[#010101]">
      <SiteHeader variant="contact" />
      <main>
        <InnerPageHero
          eyebrow="Answer-first planning resource"
          title="Plan the procession, not just the entry."
          lead="A practical checklist for families and venues."
          description="Use this guide to prepare the timeline, route, production brief, safety checks and contingency plan before choosing your Baraat package."
        />

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="grid gap-5 md:grid-cols-2">
            {STEPS.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="rounded-2xl border border-[#010101]/10 bg-[#F8F7F4] p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <Icon className="h-6 w-6 text-[#E30B1D]" aria-hidden="true" />
                  <span className="text-[10px] font-extrabold tracking-[0.15em] text-[#010101]/45">0{index + 1}</span>
                </div>
                <h2 className="mt-8 text-xl font-extrabold tracking-[-0.03em]">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#010101]/65">{text}</p>
              </article>
            ))}
          </div>

          <section className="mt-14 grid gap-8 rounded-2xl bg-[#010101] p-7 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#ff6673]">Choosing your package</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">See every inclusion in our Signature Offering.</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
                Truck format, groom entry, sound, dhol, Chhatris, effects, entertainment and Safa capacity should match the route and guest experience—not a generic price list.
              </p>
            </div>
            <Link href="/packages" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-[#010101] transition-colors hover:bg-[#E30B1D] hover:text-white">
              <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
              View the Signature Offering
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>

          <section className="mt-16">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#E30B1D]">Common planning questions</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em]">Answers before you enquire.</h2>
            <div className="mt-8">
              <FAQAccordion faqs={faqItems} />
            </div>
          </section>
        </section>
      </main>
      <SiteFooter variant="contact" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleSchema }} />
    </div>
  );
}
