import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Headphones,
  Lightbulb,
  MapPinned,
  MessageCircle,
  Music2,
  Route,
  ShieldCheck,
  Sparkles,
  Truck,
  UsersRound,
} from "lucide-react";

import Reveal from "@/components/Reveal";
import InnerPageHero from "@/components/InnerPageHero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About Plan My Baraat | Premium Baraat Planner in India",
  description:
    "Meet Plan My Baraat, a specialist Baraat planning company for groom entries, DJ trucks, vintage cars, dhol, safa, lighting, pyrotechnics and complete procession coordination.",
  keywords: [
    "Baraat planner",
    "Baraat planning services",
    "Baraat management company",
    "Baraat planner Vadodara",
    "Baraat planner Gujarat",
    "groom entry services",
    "DJ truck Baraat",
    "Baraat on wheels",
    "vintage car for groom entry",
    "dhol players for Baraat",
    "safa team for wedding",
    "Baraat lighting",
    "wedding pyrotechnics",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Plan My Baraat | Specialist Baraat Planners",
    description:
      "We plan and manage the groom's Baraat—from the first route decision to the final venue entry.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Plan My Baraat | Specialist Baraat Planners",
    description:
      "Premium groom entries, DJ trucks, vintage cars, dhol, safa, lighting, pyrotechnics and complete Baraat coordination.",
  },
};

const SERVICES = [
  {
    eyebrow: "Procession planning",
    title: "Baraat Planning & Coordination",
    description:
      "We shape the route, timing, procession flow and venue handover so every moving part follows one clear plan.",
    icon: Route,
    image: "/Assests/1000096849.png",
    position: "object-center",
  },
  {
    eyebrow: "Sound & movement",
    title: "DJ Trucks & Baraat on Wheels",
    description:
      "Powerful sound, lighting and a professionally managed moving setup built around the energy of your celebration.",
    icon: Truck,
    image: "/Assests/1000096852.png",
    position: "object-center",
  },
  {
    eyebrow: "Vintage car & Baggi",
    title: "Royal Groom Entry",
    description:
      "A polished arrival with the right vintage car, positioning, pace and photography-friendly entry moment.",
    icon: Sparkles,
    image: "/Assests/1000096850.png",
    position: "object-center",
  },
  {
    eyebrow: "Traditional energy",
    title: "Dhol, Safa & Chhatri Teams",
    description:
      "Experienced artists and coordinated teams arrive prepared, on time and aligned with your guest count.",
    icon: Music2,
    image: "/Assests/1000096848.png",
    position: "object-center",
  },
  {
    eyebrow: "Visual production",
    title: "Lighting & Pyrotechnics",
    description:
      "Chhatri lights, cold pyro and visual cues are planned around the route, venue rules and the groom's entry.",
    icon: Lightbulb,
    image: "/Assests/1000096856.png",
    position: "object-center",
  },
  {
    eyebrow: "One coordinated team",
    title: "On-Ground Family Support",
    description:
      "One dedicated team stays connected with your family, venue and vendors from assembly to final entry.",
    icon: Headphones,
    image: "/Assests/1000096855.png",
    position: "object-center",
  },
] as const;

const VALUES = [
  {
    title: "Specialist focus",
    description:
      "We plan the groom's Baraat—not the entire wedding—so our attention stays on making the procession exceptional.",
    icon: ShieldCheck,
  },
  {
    title: "One coordinated team",
    description:
      "Your family gets one point of contact instead of following up separately with every Baraat vendor.",
    icon: UsersRound,
  },
  {
    title: "Clear, practical planning",
    description:
      "Timelines, inclusions and responsibilities are agreed before the celebration, with no avoidable last-minute confusion.",
    icon: Check,
  },
  {
    title: "Local execution knowledge",
    description:
      "We understand procession movement, venue arrivals and celebration logistics across major Indian wedding cities.",
    icon: MapPinned,
  },
] as const;

const FAQS = [
  {
    question: "Is Plan My Baraat a complete wedding planning company?",
    answer:
      "No. We specialize only in planning and managing the groom's Baraat. This focused approach lets us handle the procession, groom entry, entertainment, timing and on-ground coordination in much greater detail.",
  },
  {
    question: "What Baraat services can your team coordinate?",
    answer:
      "Depending on the selected package, we can coordinate DJ trucks, Baraat on wheels, vintage groom-entry cars, dhol players, safa teams, Chhatri lights, sound, lighting, cold pyrotechnics and the complete procession flow.",
  },
  {
    question: "Do you manage the Baraat route and arrival timing?",
    answer:
      "Yes. We plan the assembly point, route movement, key cues and venue arrival with your family and relevant vendors so the Baraat remains enjoyable without losing control of the wedding timeline.",
  },
  {
    question: "Where are your Baraat planning services available?",
    answer:
      "Plan My Baraat is based in Vadodara and serves celebrations across Vadodara, Ahmedabad, Surat, Mumbai, Delhi and Bengaluru, with destination requirements discussed individually.",
  },
  {
    question: "How early should we book our Baraat package?",
    answer:
      "It is best to contact us as soon as your wedding date and venue are confirmed. Popular wedding dates, vintage cars and premium moving setups can be reserved early.",
  },
] as const;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Plan My Baraat",
  url: "https://www.planmybaraat.com",
  email: "planmybaraat@gmail.com",
  telephone: "+91-90890-81111",
  description:
    "A premium Baraat planning company specializing in groom entries, DJ trucks, vintage cars, dhol, safa, Chhatri lights, pyrotechnics and complete procession coordination.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Studio 501-502, Broadway Signature, Sevasi-Bhayli Canal Ring Road",
    addressLocality: "Vadodara",
    addressRegion: "Gujarat",
    postalCode: "391110",
    addressCountry: "IN",
  },
  areaServed: [
    "Vadodara",
    "Ahmedabad",
    "Surat",
    "Mumbai",
    "Delhi",
    "Bengaluru",
  ],
  sameAs: [
    "https://www.instagram.com/planmybaraatofficial",
    "https://www.facebook.com/share/1JTGqNsvfx/",
  ],
};

export default function AboutPage() {
  return (
    <div className="about-page inner-public-page relative flex min-h-screen flex-col bg-white font-sans text-[#010101]">
      <SiteHeader variant="contact" />

      <main className="flex-grow">
        <InnerPageHero
          eyebrow="Specialist Baraat planners"
          title="About Plan My Baraat."
          lead="We plan one thing exceptionally well."
          description="The groom’s Baraat—from the first route decision to the final, unforgettable venue entry."
        />

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <Reveal>
            <div className="grid items-end gap-9 xl:grid-cols-[1fr_0.86fr] xl:gap-16">
                <div className="max-w-3xl">
                  <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                    Our specialist approach
                  </p>
                  <h2 className="text-[clamp(1.8rem,4.2vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
                    Not full wedding planners. Baraat specialists.
                  </h2>
                </div>
                <div className="max-w-xl space-y-4 text-sm leading-[1.75] text-[#010101]/58 sm:text-base sm:leading-7">
                  <p>
                    Plan My Baraat is a premium Baraat planning company built
                    around the groom&apos;s grand procession. We bring the entry,
                    entertainment, movement and people together under one
                    coordinated plan.
                  </p>
                  <p>
                    That means your family can celebrate while our team manages
                    the practical details behind the DJ truck, vintage car,
                    dhol, safa, Chhatri lights, pyrotechnics and venue arrival.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-12 grid border-y border-[#010101]/10 sm:grid-cols-3">
              {[
                ["3", "Generations of wedding-industry experience"],
                ["500+", "Baraats coordinated"],
                ["6 cities", "Growing service presence"],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className={`py-6 sm:px-7 sm:py-8 ${
                    index > 0
                      ? "border-t border-[#010101]/10 sm:border-l sm:border-t-0"
                      : ""
                  }`}
                >
                  <p className="text-[clamp(1.75rem,3.4vw,2.25rem)] font-extrabold tracking-[-0.035em]">
                    {value}
                  </p>
                  <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#010101]/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#010101]/10 bg-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 lg:px-10 lg:py-24">
            <Reveal>
              <div className="relative min-h-[22rem] overflow-hidden rounded-2xl sm:min-h-[30rem] lg:min-h-[36rem]">
                <Image
                  src="/Assests/1000096853.png"
                  alt="Groom arriving on a horse decorated with floral details"
                  fill
                  sizes="(max-width: 1023px) 100vw, 45vw"
                  className="object-cover object-[center_48%]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.12)_18%,rgba(1,1,1,0.32)_55%,rgba(1,1,1,0.92)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/75">
                    One team. Every moving part.
                  </p>
                  <p className="mt-2 max-w-sm text-lg font-extrabold leading-6 tracking-[-0.02em] sm:text-xl">
                    Calm behind the scenes. Grand in the moment.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div>
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  Our story
                </p>
                <h2 className="text-[clamp(1.8rem,4vw,3.25rem)] font-extrabold leading-[1.08] tracking-[-0.038em]">
                  A family legacy, focused on a modern Baraat.
                </h2>
                <div className="mt-6 space-y-5 text-sm leading-[1.75] text-[#010101]/58 sm:text-base sm:leading-7">
                  <p>
                    Our roots come from three generations of work in the Indian
                    wedding industry. Over time, we saw the same problem
                    repeatedly: families were coordinating separate vendors
                    while also trying to enjoy one of the wedding&apos;s most
                    energetic moments.
                  </p>
                  <p>
                    Plan My Baraat was created to solve that problem with one
                    specialist team. Today, we plan premium Baraat experiences
                    that respect tradition while bringing modern sound,
                    lighting, groom-entry ideas and production discipline to the
                    procession.
                  </p>
                </div>
                <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    "Dedicated Baraat coordinator",
                    "Clear package inclusions",
                    "Route and timeline planning",
                    "Vendor and venue alignment",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm font-bold"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E30B1D] text-white">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                What we plan and manage
              </p>
              <h2 className="text-[clamp(1.75rem,4vw,2.65rem)] font-extrabold leading-[1.1] tracking-[-0.035em]">
                Complete Baraat coordination. One specialist team.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Reveal key={service.title} delay={index % 3}>
                    <article className="about-service-card group relative min-h-[29rem] overflow-hidden rounded-2xl bg-[#010101] text-white sm:min-h-[31rem]">
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        className={`object-cover transition-transform duration-700 group-hover:scale-105 ${service.position}`}
                        aria-hidden="true"
                      />
                      <div
                        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.12)_8%,rgba(1,1,1,0.30)_46%,rgba(1,1,1,0.94)_100%)]"
                        aria-hidden="true"
                      />
                      <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7">
                        <div className="mb-8 flex items-center justify-between gap-4">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E30B1D] text-white shadow-lg">
                            <Icon
                              className="h-5 w-5"
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />
                          </span>
                          <span className="text-[10px] font-extrabold tracking-[0.14em] text-white/60">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/70">
                          {service.eyebrow}
                        </p>
                        <h3 className="mt-2 text-xl font-extrabold leading-7 tracking-[-0.025em] sm:text-2xl">
                          {service.title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-white/78">
                          {service.description}
                        </p>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#010101] text-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <div className="grid gap-10 xl:grid-cols-[0.8fr_1.2fr] xl:gap-16">
              <div className="max-w-xl">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white sm:text-[11px]">
                  How we work
                </p>
                <h2 className="mt-3 text-[clamp(1.85rem,4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.035em]">
                  A clear plan before the first dhol beat.
                </h2>
                <p className="mt-5 text-sm leading-7 text-white/55 sm:text-base">
                  The best Baraats feel spontaneous to guests because the
                  important details were handled well before the procession
                  began.
                </p>
              </div>

              <ol className="grid gap-8 sm:grid-cols-3 sm:gap-0">
                {[
                  [
                    "01",
                    "Understand",
                    "We learn your date, venue, guest count, route, entry vision and priorities.",
                  ],
                  [
                    "02",
                    "Plan",
                    "We align the package, teams, timings, procession flow and venue handover.",
                  ],
                  [
                    "03",
                    "Coordinate",
                    "Our on-ground team manages the Baraat while your family stays in the celebration.",
                  ],
                ].map(([number, title, description], index) => (
                  <li
                    key={number}
                    className={`sm:px-4 xl:px-6 ${
                      index > 0
                        ? "border-t border-white/10 pt-8 sm:border-l sm:border-t-0 sm:pt-0"
                        : ""
                    }`}
                  >
                    <span className="text-xs font-extrabold tracking-[0.14em] text-white">
                      {number}
                    </span>
                    <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/50">
                      {description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mb-10 max-w-2xl">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                Why families choose us
              </p>
              <h2 className="text-[clamp(1.9rem,4vw,2.65rem)] font-extrabold leading-[1.1] tracking-[-0.035em]">
                Premium does not need to feel complicated.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Reveal key={value.title} delay={index}>
                    <article className="about-value-card h-full rounded-2xl border border-[#010101]/10 bg-white p-6">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E30B1D]/20 text-[#E30B1D]">
                        <Icon
                          className="h-4.5 w-4.5"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </span>
                      <h3 className="mt-7 text-lg font-extrabold leading-6 tracking-[-0.02em]">
                        {value.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#010101]/55">
                        {value.description}
                      </p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-[#010101]/10 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div className="max-w-lg">
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  Common questions
                </p>
                <h2 className="text-[clamp(1.9rem,4vw,2.65rem)] font-extrabold leading-[1.1] tracking-[-0.035em]">
                  Before you plan the Baraat.
                </h2>
                <p className="mt-5 text-sm leading-7 text-[#010101]/55 sm:text-base">
                  A few clear answers about our scope, services and planning
                  process.
                </p>
              </div>

              <div className="divide-y divide-[#010101]/10 border-y border-[#010101]/10">
                {FAQS.map((item, index) => (
                  <details key={item.question} className="about-faq group">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-6 text-left">
                      <span className="flex gap-4">
                        <span className="mt-0.5 text-[10px] font-extrabold tracking-[0.12em] text-[#E30B1D]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-base font-extrabold leading-6 tracking-[-0.015em]">
                          {item.question}
                        </span>
                      </span>
                      <span
                        className="relative mt-1 h-5 w-5 shrink-0"
                        aria-hidden="true"
                      >
                        <span className="absolute left-0 top-1/2 h-px w-5 bg-[#010101]" />
                        <span className="absolute left-1/2 top-0 h-5 w-px bg-[#010101] transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-6 pl-10 text-sm leading-[1.75] text-[#010101]/58 sm:leading-7">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl border border-[#E30B1D]/20 bg-[#E30B1D]/[0.035] p-6 sm:p-10 lg:p-14">
                <div className="relative z-10 grid items-end gap-8 xl:grid-cols-[1fr_auto] xl:gap-10">
                  <div>
                    <p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                      Let&apos;s plan the procession
                    </p>
                    <h2 className="max-w-3xl text-[clamp(1.65rem,4.3vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">
                      Ready to Plan the Groom&apos;s Grand Entry?
                    </h2>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-[#010101]/55 sm:text-base">
                      Share your wedding date, city and Baraat vision with our
                      specialist planning team.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href="https://wa.me/919089081111"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E30B1D] px-4 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#010101] sm:gap-2.5 sm:px-6 sm:text-xs sm:tracking-[0.1em]"
                    >
                      <MessageCircle
                        className="h-4.5 w-4.5"
                        aria-hidden="true"
                      />
                      Chat on WhatsApp
                    </a>
                    <Link
                      href="/contact"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#010101]/20 bg-white px-4 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#010101] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#010101] hover:bg-[#010101] hover:text-white sm:gap-2.5 sm:px-6 sm:text-xs sm:tracking-[0.1em]"
                    >
                      Contact Us
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter variant="contact" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
