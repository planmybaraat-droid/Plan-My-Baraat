import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Crown,
  Headphones,
  Lightbulb,
  MapPin,
  MessageCircle,
  Music2,
  Quote,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import HomePackagesShowcase from "@/components/HomePackagesShowcase";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import HomeWhatsAppPlanner from "@/components/HomeWhatsAppPlanner";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Premium Baraat Planning Company in India",
  description:
    "Plan My Baraat creates premium groom entries with DJ trucks, Baraat on Wheels, vintage cars, Punjabi dhol, safa teams, Chhatri lights, pyrotechnics and complete procession coordination.",
  keywords: [
    "Baraat planning company",
    "Baraat planner India",
    "Baraat planner Gujarat",
    "Baraat planner Vadodara",
    "premium Baraat planning services",
    "DJ truck Baraat",
    "Baraat on Wheels",
    "royal groom entry",
    "vintage car groom entry",
    "Punjabi dhol for Baraat",
    "safa team for wedding",
    "Chhatri lights for Baraat",
    "custom Baraat packages",
    "wedding pyrotechnics Gujarat",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Plan My Baraat | Premium Baraat Planning Company",
    description:
      "Specialist planning for premium Baraat entries, DJ trucks, vintage cars, dhol, safa, lighting, effects and complete on-ground coordination.",
    url: "/",
    siteName: "Plan My Baraat",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1680,
        height: 945,
        alt: "Plan My Baraat — your grand entry, planned to be unforgettable",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plan My Baraat | Premium Baraat Planning Company",
    description:
      "Your groom entry, music, movement and celebration—planned by one specialist Baraat team.",
    images: ["/og.png"],
  },
};

const SERVICES = [
  {
    title: "DJ Truck Baraat",
    eyebrow: "Baraat on Wheels",
    description:
      "A professionally managed moving DJ setup with powerful sound, intelligent lighting and custom truck branding.",
    image: "/Assests/1000096852.png",
    imageAlt: "Premium DJ truck Baraat procession by Plan My Baraat",
    icon: Truck,
  },
  {
    title: "Royal Groom Entry",
    eyebrow: "Vintage Car & Baggi",
    description:
      "A polished groom entrance planned around the right vehicle, venue approach, photography and arrival cue.",
    image: "/Assests/1000096850.png",
    imageAlt: "Groom arriving in a decorated vintage car",
    icon: Crown,
  },
  {
    title: "Lighting & Effects",
    eyebrow: "Visual Production",
    description:
      "Chhatri lights, LED panels, cold pyro, CO2 and confetti effects synchronized with the music and entry.",
    image: "/Assests/1000096856.png",
    imageAlt: "Baraat celebration with lighting and special effects",
    icon: Sparkles,
  },
] as const;

const COORDINATION_SERVICES = [
  {
    title: "Punjabi Dhol, Safa & Chhatri Teams",
    eyebrow: "Traditional Energy",
    description:
      "Experienced artists arrive prepared, coordinated and aligned with your guest count and procession timeline.",
    icon: Music2,
    image: "/Assests/1000096848.png",
    imageAlt: "Dhol players ready to lead a daytime Baraat celebration",
  },
  {
    title: "Route & Timeline Planning",
    eyebrow: "Procession Planning",
    description:
      "Assembly, procession movement, venue permissions and the final entry are shaped into one realistic schedule.",
    icon: Route,
    image: "/Assests/1000096849.png",
    imageAlt: "Groom moving through his Baraat beneath a royal Chhatri",
  },
  {
    title: "On-Ground Baraat Coordination",
    eyebrow: "One Coordinated Team",
    description:
      "One specialist team manages vendors, family communication, cues and crowd movement from start to finish.",
    icon: Headphones,
    image: "/Assests/1000096855.png",
    imageAlt: "A coordinated couple moment beside a personalised Baraat installation",
  },
] as const;

const PACKAGES = [
  {
    id: "raj-tilak",
    number: "01",
    name: "Raj Tilak",
    tagline: "A Royal Beginning",
    description:
      "The essential premium Baraat experience with a DJ truck, dhol, Chhatri lights, vintage entry and safa team.",
    image: "/Assests/packages/raj-tilak-premium.jpeg",
    featured: false,
  },
  {
    id: "rajwada",
    number: "02",
    name: "Rajwada",
    tagline: "The Grand Celebration",
    description:
      "More dhol, custom truck branding, premium lighting and an entertainer for a bigger procession.",
    image: "/Assests/packages/rajwada-v2.png",
    featured: false,
  },
  {
    id: "maharaja",
    number: "03",
    name: "Maharaja",
    tagline: "Luxury Beyond Expectations",
    description:
      "Concert sound, LED visuals, personalized groom-name lighting and premium effects for a cinematic entry.",
    image: "/Assests/packages/maharaja-v2.png",
    featured: true,
  },
  {
    id: "signature",
    number: "04",
    name: "Signature",
    tagline: "The Ultimate Royal Experience",
    description:
      "Our complete statement Baraat with an American vintage car, entertainment, effects and dedicated support.",
    image: "/Assests/packages/signature-v2.png",
    featured: false,
  },
] as const;

const GALLERY = [
  {
    src: "/Assests/packages/raj-tilak-premium.jpeg",
    alt: "Groom making a royal horse entry beneath illuminated Chhatris",
    width: 1536,
    height: 1024,
  },
  {
    src: "/Assests/1000096846.png",
    alt: "Groom celebrating beside a personalised Baraat installation",
    width: 1122,
    height: 1402,
  },
  {
    src: "/Assests/1000096847.png",
    alt: "Bride enjoying a colourful personalised wedding celebration",
    width: 1086,
    height: 1448,
  },
  {
    src: "/Assests/1000096851.png",
    alt: "Groom celebrating amid colourful daytime smoke effects",
    width: 1024,
    height: 1536,
  },
  {
    src: "/Assests/1000096853.png",
    alt: "Groom arriving on a flower-decorated horse",
    width: 929,
    height: 1693,
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "The team managed the DJ truck, lighting, dhol and pyro cues without us following up once. Our families could simply enjoy the Baraat.",
    name: "Aditi & Kunal",
    city: "Vadodara",
    package: "Maharaja Package",
  },
  {
    quote:
      "The vintage car looked immaculate, and the safa team handled more than a hundred guests patiently. Every moment felt coordinated.",
    name: "Rohan Mehta",
    city: "Surat",
    package: "Signature Package",
  },
  {
    quote:
      "There were no surprise charges, the DJ truck was ready before time, and the coordinator stayed until the final guest entered the venue.",
    name: "Sanya & Arjun",
    city: "Vadodara",
    package: "Rajwada Package",
  },
] as const;

const FAQS = [
  {
    question: "What does a Baraat planning company manage?",
    answer:
      "Plan My Baraat manages the groom’s procession rather than the complete wedding. Depending on your package, this can include the DJ truck, vintage car or Baggi, dhol, safa team, Chhatri lights, LED visuals, effects, route planning, timing and on-ground coordination.",
  },
  {
    question: "Can I customize a Baraat package?",
    answer:
      "Yes. Raj Tilak, Rajwada, Maharaja and Signature are starting points. You can adjust the dhol count, lighting, effects, entertainment, entry vehicle, truck branding and other elements around your celebration.",
  },
  {
    question: "How early should we book our Baraat planner?",
    answer:
      "It is best to enquire once your wedding date and venue are confirmed. During peak wedding season, early booking helps secure the preferred DJ truck, vintage car, artists and production team.",
  },
  {
    question: "Do you provide Baraat planning outside Vadodara?",
    answer:
      "Yes. Plan My Baraat serves celebrations across Vadodara, Ahmedabad, Surat, Mumbai, Delhi and Bengaluru, with destination wedding Baraat requirements discussed individually.",
  },
  {
    question: "How do we get availability and pricing?",
    answer:
      "Send your wedding date, city, venue and preferred package through WhatsApp. Our team will confirm availability, understand the route and guest count, and recommend a suitable package or customization.",
  },
] as const;

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Premium Baraat Planning Services",
  serviceType: "Baraat planning and groom entry coordination",
  provider: {
    "@type": "Organization",
    name: "Plan My Baraat",
    url: "https://planmybaraat.com",
    telephone: "+91-90890-81111",
  },
  areaServed: [
    "Vadodara",
    "Ahmedabad",
    "Surat",
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "India",
  ],
  description:
    "Specialist Baraat planning for DJ trucks, Baraat on Wheels, vintage groom entries, Punjabi dhol, safa teams, Chhatri lights, effects and procession coordination.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function HomePage() {
  return (
    <div className="home-page relative flex min-h-screen flex-col bg-white font-sans text-[#010101]">
      <SiteHeader variant="contact" />

      <main className="flex-grow">
        <section id="home" className="home-hero">
          <Image
            src="/Gallery/Homepage.png"
            alt="A groom celebrating during a premium Plan My Baraat procession"
            fill
            priority
            sizes="100vw"
            className="home-hero-image"
          />
          <div className="home-hero-overlay" aria-hidden="true" />
          <div className="home-hero-grid" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex min-h-[44rem] max-w-7xl flex-col items-center px-5 py-20 sm:px-8 sm:py-24 lg:min-h-[46rem] lg:flex-row lg:justify-between lg:gap-6 lg:px-10 lg:py-20 xl:gap-10 xl:py-24">
            <div className="w-full min-w-0 max-w-4xl">
              <div className="hero-label-row mb-7">
                <span className="hero-label-line" aria-hidden="true" />
                <p className="home-hero-eyebrow text-[10px] font-extrabold uppercase tracking-[0.18em] text-white sm:text-[11px]">
                  Premium Baraat planning company
                </p>
              </div>

              <h1
                className="max-w-4xl text-[clamp(2.9rem,9vw,4.75rem)] font-extrabold leading-[1] tracking-[-0.04em] text-white sm:leading-[0.97]"
                aria-label="Make your entry unforgettable."
              >
                Make your entry
                <span className="block">
                  unforgettable<span className="text-white">.</span>
                </span>
              </h1>

              <p className="home-hero-copy mt-6 max-w-2xl text-[15px] leading-7 text-white/70 sm:mt-8 sm:text-base sm:leading-8">
                Specialist Baraat planning for luxury groom entries, DJ trucks,
                vintage cars, Punjabi dhol, safa teams, Chhatri lights,
                pyrotechnics and complete procession coordination.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/packages"
                  className="home-primary-cta"
                >
                  Explore Baraat Packages
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href="https://wa.me/919089081111?text=Hello%20Plan%20My%20Baraat%2C%20I%20would%20like%20to%20plan%20a%20premium%20Baraat%20experience."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-secondary-cta"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Plan on WhatsApp
                </a>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-3 border-y border-white/15 py-5 sm:mt-12 sm:py-6">
                {[
                  ["500+", "Baraats coordinated"],
                  ["3", "Generations of experience"],
                  ["1", "Specialist planning team"],
                ].map(([value, label], index) => (
                  <div
                    key={label}
                    className={`min-w-0 px-1 text-center sm:px-0 sm:text-left ${
                      index > 0 ? "border-l border-white/15 sm:pl-6" : ""
                    }`}
                  >
                    <p className="text-xl font-extrabold tracking-[-0.04em] text-white sm:text-2xl">
                      {value}
                    </p>
                    <p className="mt-1.5 max-w-[9rem] break-words text-[10px] font-bold uppercase leading-4 tracking-[0.05em] text-white/45 sm:tracking-[0.09em]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-hero-lead-form mt-10 flex w-full justify-center lg:mt-0 lg:w-[25rem] lg:max-w-[42%] lg:shrink-0 lg:justify-start xl:w-[29rem]">
              <LeadCaptureForm variant="hero" showPackageField={false} />
            </div>
          </div>

          <div className="home-hero-location">
            <MapPin className="h-4 w-4 text-[#E30B1D]" aria-hidden="true" />
            Vadodara · Gujarat · Destination Baraats
          </div>
        </section>

        <section
          aria-label="Plan My Baraat services"
          className="border-y border-white/10 bg-[#010101] text-white"
        >
          <div className="mx-auto flex max-w-[96rem] flex-wrap items-center justify-center gap-x-7 gap-y-3 px-5 py-5 sm:px-8 lg:gap-x-10">
            {[
              "DJ Truck Baraat",
              "Baraat on Wheels",
              "Vintage Groom Entry",
              "Punjabi Dhol",
              "Safa Team",
              "Chhatri Lights",
              "Cold Pyro & CO2",
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-7 lg:gap-10">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/58">
                  {item}
                </span>
                {index < 6 ? (
                  <span className="h-1 w-1 rounded-full bg-[#E30B1D]" aria-hidden="true" />
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="border-y border-[#010101]/8 bg-[#F7F6F3]">
          <div className="mx-auto grid max-w-7xl items-stretch gap-6 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-24">
            <Reveal className="h-full">
              <figure className="group relative mx-auto min-h-[36rem] w-full max-w-2xl overflow-hidden rounded-2xl bg-[#010101] shadow-[0_28px_65px_-42px_rgba(1,1,1,0.7)] sm:min-h-[40rem] lg:h-full lg:min-h-0">
                <Image
                  src="/Gallery/4d2e7c7745bbffba807f98e39b3f9f26.jpg"
                  alt="Groom making a grand Baraat entrance beneath ceremonial umbrellas and pyrotechnics"
                  fill
                  sizes="(max-width: 1023px) 100vw, 43vw"
                  className="object-cover object-[center_44%] transition-transform duration-700 group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#010101]/78 via-[#010101]/5 to-transparent" />
                <div className="absolute left-6 top-6 flex items-center gap-3 rounded-full border border-white/15 bg-[#010101]/45 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-sm sm:left-8 sm:top-8">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E30B1D]" aria-hidden="true" />
                  Specialist planning
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/65">
                    The plan behind the celebration
                  </p>
                  <p className="mt-2 max-w-sm text-xl font-extrabold leading-tight tracking-[-0.03em] sm:text-2xl">
                    Every cue, beautifully coordinated.
                  </p>
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={1} className="h-full">
              <div className="flex h-full flex-col rounded-2xl bg-white p-7 shadow-[0_24px_60px_-46px_rgba(1,1,1,0.55)] sm:p-10 lg:p-12">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-9 bg-[#E30B1D]" aria-hidden="true" />
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                    The specialist difference
                  </p>
                </div>
                <h2 className="max-w-2xl text-[clamp(2rem,3.5vw,3.05rem)] font-extrabold leading-[1.07] tracking-[-0.04em]">
                  We perfect the Baraat.
                </h2>
                <div className="mt-6 max-w-xl space-y-4 text-sm leading-7 text-[#010101]/58 sm:text-base">
                  <p>
                    Plan My Baraat is a specialist Baraat planning company for
                    families who want the groom&apos;s procession to feel
                    effortless, premium and unmistakably personal.
                  </p>
                  <p>
                    Instead of coordinating separate vendors, you get one team
                    for the entry, entertainment, route, production and venue
                    arrival—so your family can stay inside the celebration.
                  </p>
                </div>

                <ul className="mt-8 grid border-y border-[#010101]/10 sm:grid-cols-2">
                  {[
                    "One point of contact",
                    "Clear package inclusions",
                    "Route and timing coordination",
                    "Customized groom entry",
                  ].map((item, index) => (
                    <li
                      key={item}
                      className={`flex min-h-14 items-center gap-3 py-4 text-sm font-extrabold leading-5 sm:px-4 ${
                        index > 0 ? "border-t border-[#010101]/10" : ""
                      } ${index === 1 ? "sm:border-l sm:border-t-0" : ""} ${
                        index === 3 ? "sm:border-l" : ""
                      }`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E30B1D] text-white">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-9">
                  <div className="grid grid-cols-3 border-y border-[#010101]/10 py-5">
                    {[
                      ["One team", "Start to finish"],
                      ["Four", "Package foundations"],
                      ["Your way", "Fully customizable"],
                    ].map(([value, label], index) => (
                      <div
                        key={label}
                        className={index > 0 ? "border-l border-[#010101]/10 pl-4 sm:pl-6" : "pr-3"}
                      >
                        <p className="text-base font-extrabold tracking-[-0.025em] sm:text-lg">
                          {value}
                        </p>
                        <p className="mt-1 text-[9px] font-bold uppercase leading-4 tracking-[0.1em] text-[#010101]/42 sm:text-[10px]">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/about"
                    className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#010101] px-6 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-[#E30B1D]"
                  >
                    Meet Plan My Baraat
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <HomePackagesShowcase />

        <section className="border-y border-[#010101]/10 bg-[#010101]/[0.018]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="grid items-end gap-8 xl:grid-cols-[1fr_0.72fr] xl:gap-16">
              <div className="max-w-3xl">
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  Premium Baraat planning services
                </p>
                <h2 className="text-[clamp(1.95rem,3.4vw,2.85rem)] font-extrabold leading-[1.08] tracking-[-0.038em]">
                  First beat to grand entry.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-[#010101]/55 sm:text-base">
                Music, movement, tradition and production are designed as one
                experience—not assembled as disconnected bookings.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...SERVICES, ...COORDINATION_SERVICES].map((service, index) => {
                const Icon = service.icon;
                return (
                  <Reveal key={service.title} delay={index % 3}>
                    <article className="home-service-photo group relative min-h-[29rem] overflow-hidden rounded-2xl bg-[#010101] text-white sm:min-h-[31rem]">
                      <Image
                        src={service.image}
                        alt={service.imageAlt}
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.12)_8%,rgba(1,1,1,0.30)_46%,rgba(1,1,1,0.94)_100%)]"
                        aria-hidden="true"
                      />
                      <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7">
                        <div className="mb-8 flex items-center justify-between gap-4">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E30B1D] text-white shadow-lg">
                            <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
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

        {false && <section id="legacy-packages" className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  Customizable Baraat packages
                </p>
                <h2 className="text-[clamp(2rem,3.4vw,2.85rem)] font-extrabold leading-[1.08] tracking-[-0.038em]">
                  Choose your royal experience.
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#010101]/55 sm:text-base">
                  Begin with the package closest to your vision, then customize
                  the music, lighting, entry style, entertainment and support.
                </p>
              </div>
              <Link
                href="/packages"
                className="inline-flex w-fit items-center gap-2 text-sm font-extrabold transition-colors hover:text-[#E30B1D]"
              >
                Compare all inclusions
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {PACKAGES.map((item, index) => (
                <Reveal key={item.id} delay={index}>
                  <Link
                    href={`/packages#${item.id}`}
                    className="home-package-card group flex h-full flex-col overflow-hidden rounded-2xl border border-[#010101]/10 bg-white"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={`${item.name} Baraat Package`}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#010101]/58 via-transparent to-transparent" />
                      <span className="absolute left-5 top-5 text-[10px] font-extrabold tracking-[0.14em] text-white">
                        {item.number}
                      </span>
                      {item.featured ? (
                        <span className="absolute right-4 top-4 rounded-full bg-[#E30B1D] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white">
                          Most popular
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#E30B1D]">
                        {item.tagline}
                      </p>
                      <h3 className="mt-2 text-[clamp(1.55rem,2.2vw,1.9rem)] font-extrabold leading-[1.08] tracking-[-0.04em]">
                        {item.name}
                      </h3>
                      <p className="mt-4 flex-1 text-sm leading-6 text-[#010101]/55">
                        {item.description}
                      </p>
                      <span className="mt-7 inline-flex items-center justify-between border-t border-[#010101]/10 pt-5 text-xs font-extrabold uppercase tracking-[0.09em]">
                        View package
                        <ArrowUpRight
                          className="h-4 w-4 text-[#E30B1D] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

            <div className="mt-5 flex flex-col justify-between gap-6 rounded-2xl border border-[#E30B1D]/20 bg-[#E30B1D]/[0.035] p-6 sm:flex-row sm:items-center sm:p-8">
              <div>
                <p className="text-lg font-extrabold tracking-[-0.025em]">
                  Want a combination that is completely yours?
                </p>
                <p className="mt-2 text-sm leading-6 text-[#010101]/55">
                  Build a custom Baraat package around your venue, guest count and entry vision.
                </p>
              </div>
              <Link
                href="/packages#customize"
                className="inline-flex min-h-12 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-[#E30B1D] px-6 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-[#010101]"
              >
                Customize a Package
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>}

        <section className="bg-[#010101] text-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="grid gap-12 xl:grid-cols-[0.78fr_1.22fr] xl:gap-16">
              <div className="max-w-xl">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white sm:text-[11px]">
                  How Baraat planning works
                </p>
                <h2 className="mt-3 text-[clamp(2rem,3.3vw,2.75rem)] font-extrabold leading-[1.09] tracking-[-0.038em]">
                  Grand for guests. Effortless for family.
                </h2>
                <p className="mt-5 text-sm leading-7 text-white/55 sm:text-base">
                  Guests experience the energy. Our team handles the plan behind it.
                </p>
              </div>

              <ol className="grid gap-8 sm:grid-cols-3 sm:gap-0">
                {[
                  [
                    "01",
                    "Discover",
                    "We understand your date, venue, route, guest count and groom-entry vision.",
                  ],
                  [
                    "02",
                    "Design",
                    "We recommend a package and personalize the music, visuals, artists and effects.",
                  ],
                  [
                    "03",
                    "Coordinate",
                    "One on-ground team manages every cue until the final venue entry.",
                  ],
                ].map(([number, title, description], index) => (
                  <li
                    key={number}
                    className={`sm:px-5 ${
                      index > 0
                        ? "border-t border-white/12 pt-8 sm:border-l sm:border-t-0 sm:pt-0"
                        : ""
                    }`}
                  >
                    <span className="text-xs font-extrabold tracking-[0.14em] text-white">
                      {number}
                    </span>
                    <h3 className="mt-5 text-xl font-extrabold tracking-[-0.025em]">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/50">
                      {description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="gallery" className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-3xl">
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  Real Baraat moments
                </p>
                <h2 className="text-[clamp(2rem,3.3vw,2.75rem)] font-extrabold leading-[1.09] tracking-[-0.038em]">
                  Made for the moment.
                </h2>
              </div>
              <Link
                href="/gallery"
                className="inline-flex w-fit items-center gap-2 text-sm font-extrabold transition-colors hover:text-[#E30B1D]"
              >
                Explore the gallery
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="home-gallery-grid">
              {[GALLERY.slice(0, 2), GALLERY.slice(2)].map((row, rowIndex) => (
                <div className="home-gallery-row" key={`gallery-row-${rowIndex}`}>
                  {row.map((image) => (
                    <figure
                      key={image.src}
                      className="home-gallery-item group relative overflow-hidden rounded-2xl bg-[#010101]/5"
                      style={
                        {
                          "--gallery-grow": image.width / image.height,
                          "--gallery-ar": `${image.width} / ${image.height}`,
                        } as CSSProperties
                      }
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 767px) 50vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#010101]/28 via-transparent to-transparent" />
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="border-y border-[#010101]/10 bg-[#010101]/[0.018]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-3xl">
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  Trusted Baraat planners
                </p>
                <h2 className="text-[clamp(2rem,3.3vw,2.75rem)] font-extrabold leading-[1.09] tracking-[-0.038em]">
                  Trusted by families.
                </h2>
              </div>
              <Link
                href="/testimonials"
                className="inline-flex w-fit items-center gap-2 text-sm font-extrabold transition-colors hover:text-[#E30B1D]"
              >
                Read client stories
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
              <Reveal>
                <article className="flex h-full flex-col justify-between rounded-2xl border border-[#E30B1D]/20 bg-[#E30B1D]/[0.035] p-7 sm:p-10">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex gap-1 text-[#E30B1D]" aria-label="5 out of 5 stars">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E30B1D]/20 bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#E30B1D]">
                        <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        Verified client
                      </span>
                    </div>
                    <Quote className="mt-9 h-9 w-9 text-[#E30B1D]" strokeWidth={1.5} aria-hidden="true" />
                    <blockquote className="mt-5 max-w-3xl text-[clamp(1.45rem,3vw,2.2rem)] font-extrabold leading-[1.28] tracking-[-0.035em]">
                      “{TESTIMONIALS[0].quote}”
                    </blockquote>
                  </div>
                  <div className="mt-10 border-t border-[#010101]/10 pt-6">
                    <p className="text-base font-extrabold">{TESTIMONIALS[0].name}</p>
                    <p className="mt-1 text-xs font-semibold text-[#010101]/45">
                      {TESTIMONIALS[0].city} · {TESTIMONIALS[0].package}
                    </p>
                  </div>
                </article>
              </Reveal>

              <div className="grid gap-5">
                {TESTIMONIALS.slice(1).map((testimonial, index) => (
                  <Reveal key={testimonial.name} delay={index + 1}>
                    <article className="home-testimonial-card rounded-2xl border border-[#010101]/10 bg-white p-6 sm:p-7">
                      <div className="flex items-start justify-between gap-5">
                        <Quote className="h-6 w-6 shrink-0 text-[#E30B1D]" strokeWidth={1.5} aria-hidden="true" />
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#E30B1D]">
                          {testimonial.package}
                        </span>
                      </div>
                      <blockquote className="mt-5 text-sm leading-7 text-[#010101]/65">
                        “{testimonial.quote}”
                      </blockquote>
                      <div className="mt-6 border-t border-[#010101]/10 pt-5">
                        <p className="text-sm font-extrabold">{testimonial.name}</p>
                        <p className="mt-1 text-xs font-semibold text-[#010101]/42">
                          {testimonial.city}
                        </p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-[#010101]/10 bg-[#010101]/10 sm:grid-cols-3">
              {[
                ["500+", "Baraats coordinated"],
                ["4.9/5", "Average client rating"],
                ["6 cities", "Growing service presence"],
              ].map(([value, label]) => (
                <div key={label} className="bg-white px-6 py-7 text-center">
                  <p className="text-2xl font-extrabold tracking-[-0.04em]">{value}</p>
                  <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#010101]/42">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 lg:px-10 lg:py-24">
            <div>
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                Baraat planners across India
              </p>
              <h2 className="text-[clamp(1.95rem,3.2vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.038em]">
                Local expertise. Destination ready.
              </h2>
            </div>
            <div>
              <div className="space-y-4 text-sm leading-7 text-[#010101]/58 sm:text-base">
                <p>
                  Based in Vadodara, Plan My Baraat plans premium groom entries
                  and wedding processions across Gujarat and major Indian
                  wedding cities. Our local knowledge helps shape practical
                  routes, venue arrival times and production plans.
                </p>
                <p>
                  Whether you need a Baraat planner in Vadodara, a DJ truck
                  Baraat in Ahmedabad, a vintage-car groom entry in Surat or a
                  coordinated destination Baraat, every requirement begins with
                  the same focused planning process.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {[
                  "Vadodara",
                  "Ahmedabad",
                  "Surat",
                  "Mumbai",
                  "Delhi",
                  "Bengaluru",
                  "Destination Weddings",
                ].map((city) => (
                  <span
                    key={city}
                    className="rounded-full border border-[#010101]/12 bg-white px-4 py-2 text-xs font-extrabold text-[#010101]/58"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#010101]/10 bg-white">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mb-9 max-w-2xl">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                Baraat planning questions
              </p>
              <h2 className="text-[clamp(1.9rem,3vw,2.45rem)] font-extrabold leading-[1.1] tracking-[-0.035em]">
                Before you begin.
              </h2>
            </div>
            <div className="divide-y divide-[#010101]/10 border-y border-[#010101]/10">
              {FAQS.map((faq, index) => (
                <details key={faq.question} className="home-faq group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-left">
                    <span className="flex items-start gap-4">
                      <span className="pt-1 text-[10px] font-extrabold tracking-[0.12em] text-[#E30B1D]">
                        0{index + 1}
                      </span>
                      <span className="text-sm font-extrabold leading-6 sm:text-base">
                        {faq.question}
                      </span>
                    </span>
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#010101]/10 text-lg font-light transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-3xl pb-6 pl-9 pr-10 text-sm leading-7 text-[#010101]/55 sm:pl-10 sm:text-base">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:px-10 lg:py-24">
            <Reveal>
              <div className="relative flex min-h-[32rem] flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-[#010101] p-7 text-white shadow-[0_28px_65px_-40px_rgba(1,1,1,0.8)] sm:min-h-[36rem] sm:p-10 lg:h-full lg:min-h-0">
                <Image
                  src="/Assests/1000096854.png"
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 100vw, 42vw"
                  className="object-cover object-[center_42%]"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.68)_0%,rgba(1,1,1,0.78)_48%,rgba(1,1,1,0.94)_100%)]"
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <p className="mb-5 inline-flex w-fit rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E30B1D] shadow-[0_8px_24px_-14px_rgba(1,1,1,0.9)] sm:text-[11px]">
                    Your Baraat starts here
                  </p>
                  <h2 className="max-w-lg text-[clamp(2.125rem,3vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.035em]">
                    Your vision. Our plan.
                  </h2>
                  <p className="mt-6 max-w-sm text-sm leading-7 text-white/75">
                    Share your wedding date, city and priorities. Our specialist
                    team will help you choose or customize the right Baraat
                    package.
                  </p>
                </div>

                <div className="relative z-10 mt-10 border-t border-white/20 pt-6">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
                    WhatsApp
                  </p>
                  <a
                    href="https://wa.me/919089081111"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-white transition-colors hover:text-[#E30B1D]"
                  >
                    +91 90890 81111
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="home-planner-card rounded-2xl border border-[#010101]/10 bg-white p-5 sm:p-8 lg:p-10">
                <div className="mb-8 border-b border-[#010101]/10 pb-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E30B1D] text-white">
                      <Lightbulb className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <ShieldCheck className="h-5 w-5 text-[#E30B1D]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.035em]">
                    Check your date and package.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#010101]/52">
                    A simple WhatsApp enquiry—no database submission and no
                    unnecessary quotation form.
                  </p>
                </div>
                <HomeWhatsAppPlanner />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter variant="contact" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
