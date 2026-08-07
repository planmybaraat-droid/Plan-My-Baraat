import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  MessageCircle,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import PackageCustomizer from "@/components/PackageCustomizer";
import InnerPageHero from "@/components/InnerPageHero";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Baraat Packages | Customizable Royal Baraat Experiences",
  description:
    "Explore Raj Tilak, Rajwada, Maharaja and Signature Baraat packages by Plan My Baraat. Customize DJ trucks, dhol, lighting, vintage cars, effects, safa teams and more.",
  keywords: [
    "Baraat packages",
    "custom Baraat package",
    "DJ truck package",
    "royal groom entry package",
    "vintage car Baraat package",
    "dhol and safa package",
    "Baraat package Vadodara",
    "Baraat package Gujarat",
  ],
  alternates: {
    canonical: "/packages",
  },
  openGraph: {
    title: "Royal Baraat Packages | Plan My Baraat",
    description:
      "Four premium starting points, customized around your Baraat, venue and celebration.",
    url: "/packages",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Baraat Packages | Plan My Baraat",
    description:
      "Choose a premium Baraat package and personalize every important detail.",
  },
};

const PACKAGES = [
  {
    id: "raj-tilak",
    number: "01",
    name: "Raj Tilak",
    tagline: "A Royal Beginning",
    description:
      "A polished, high-energy Baraat foundation with the essential sound, tradition and royal-entry elements thoughtfully coordinated.",
    image: "/Assests/packages/raj-tilak-v2.png",
    imageAlt: "A groom making a royal horse entry at his Baraat",
    featured: false,
    inclusions: [
      ["Mini Double-Decker Truck", "High-energy Baraat entry"],
      ["Professional DJ Operator Artist", "Non-stop entertainment"],
      ["Exclusive Sound Quality", "Crystal-clear, powerful and premium"],
      ["Liquid CO2 Gun", "A dazzling entry effect"],
      ["2 Punjabi Dhol", "Traditional Baraat energy"],
      ["8 Chhatri Lights", "A royal traditional look"],
      ["Vintage Car / Baggi", "A classic groom entry"],
      ["Safa Team by My Safa", "For the groom and Baraatis"],
    ],
  },
  {
    id: "rajwada",
    number: "02",
    name: "Rajwada",
    tagline: "The Grand Celebration",
    description:
      "A bigger visual statement with custom truck branding, more live rhythm and an entertainer who keeps guests engaged throughout the procession.",
    image: "/Assests/packages/rajwada-v2.png",
    imageAlt: "A groom celebrating beneath royal red chhatris",
    featured: false,
    inclusions: [
      ["Mini Double-Decker DJ Truck", "Full-body custom flex branding"],
      ["Professional DJ Artist", "Premium sound quality"],
      ["Liquid CO2 Gun", "High-impact celebration effect"],
      ["4 Punjabi Dhol", "Fuller traditional energy"],
      ["10 Premium Chhatri Lights", "A richer royal procession"],
      ["1 Teddy / Gorilla Artist", "Interactive guest entertainment"],
      ["Vintage Car / Baggi", "A classic groom entry"],
      ["Safa Team by My Safa", "For the groom and Baraatis"],
    ],
  },
  {
    id: "maharaja",
    number: "03",
    name: "Maharaja",
    tagline: "Luxury Beyond Expectations",
    description:
      "Our most popular experience combines concert-style production, personalized visuals, premium effects and dedicated on-ground support.",
    image: "/Assests/packages/maharaja-v2.png",
    imageAlt: "A luxury groom entry surrounded by fireworks and confetti",
    featured: true,
    inclusions: [
      ["Mini Double-Decker DJ Truck", "Custom theme branding"],
      ["Professional DJ Artist", "Concert sound and intelligent lighting"],
      ["Moving LED Panels", "High-definition visual experience"],
      ["Groom Name LED Letters", "A personalized moving display"],
      ["Liquid CO2 Gun", "High-energy entry effect"],
      ["Confetti CO2 Gun", "A celebratory visual moment"],
      ["Hand Pyro Gun", "A spectacular planned highlight"],
      ["6 Punjabi Dhol", "Powerful traditional rhythm"],
      ["12 Premium Chhatri Lights", "A grand royal formation"],
      ["Professional DJ Jockey", "Experienced live music control"],
      ["CO2 Jet Effects", "Concert-style impact"],
      ["2 Professional Bouncers", "Dedicated procession support"],
      ["Vintage Car / Baggi", "A royal groom entry"],
      ["Safa Team by My Safa", "For the groom and Baraatis"],
    ],
  },
  {
    id: "signature",
    number: "04",
    name: "Signature",
    tagline: "The Ultimate Royal Experience",
    description:
      "A complete statement Baraat created for families who want premium production, exceptional entertainment and a truly distinctive groom entry.",
    image: "/Assests/packages/signature-v2.png",
    imageAlt: "A personalized signature Baraat production for the couple",
    featured: false,
    inclusions: [
      ["Sound & Light", "Concert sound and intelligent lighting"],
      ["Pyro Highlight on Entry", "A grand planned entry moment"],
      ["Confetti CO2 Gun", "Premium confetti effect"],
      ["Hand Pyro Gun", "A spectacular hand-pyro highlight"],
      ["American Vintage Car", "A statement groom entry"],
      ["4 Professional Bouncers", "Trained procession support"],
      ["Professional DJ Jockey", "Experienced live entertainment"],
      ["Entertainer Artist", "Crowd engagement throughout"],
      ["Fake Money Gun", "A playful celebration moment"],
      ["Moving LED Panels", "High-resolution moving visuals"],
      ["Groom Name LED Letters", "Personalized for the groom"],
      ["Liquid CO2 Gun", "High-pressure CO2 effect"],
      ["4 Punjabi Dhol", "High-energy live rhythm"],
      ["10 Premium Chhatri Lights", "A royal illuminated formation"],
      ["Teddy / Gorilla Artist", "Interactive entertainment"],
      ["Safa Team by My Safa", "For the groom and Baraatis"],
    ],
  },
] as const;

const FAQS = [
  {
    question: "Can every Baraat package be customized?",
    answer:
      "Yes. Each package is a starting point. We can adjust the DJ truck branding, dhol count, lighting, effects, groom entry, entertainment and support elements around your venue, guest count and celebration style.",
  },
  {
    question: "Which Baraat package is the most popular?",
    answer:
      "The Maharaja Package is our most popular option. It balances personalized visuals, concert-style production, premium effects, traditional dhol and on-ground support.",
  },
  {
    question: "Can I create a package from scratch?",
    answer:
      "Yes. Use the custom package builder on this page, select the elements you want and send the complete request directly to our WhatsApp team. We will help shape the right combination.",
  },
  {
    question: "Are vintage cars and safa teams included?",
    answer:
      "The listed packages include a vintage car or Baggi and a Safa Team by My Safa. The Signature Package includes an American vintage car. Final availability is confirmed for your date and city.",
  },
] as const;

function whatsappPackageLink(packageName: string) {
  return `https://wa.me/919089081111?text=${encodeURIComponent(
    `Hello Plan My Baraat,\n\nI am interested in the ${packageName} Package. Please share availability, customization options and next steps.\n\nThank you.`,
  )}`;
}

export default function PackagesPage() {
  return (
    <div className="packages-page inner-public-page relative flex min-h-screen flex-col bg-white font-sans text-[#010101]">
      <SiteHeader variant="contact" />

      <main className="flex-grow">
        <InnerPageHero
          eyebrow="Curated Baraat experiences"
          title="Baraat Packages."
          lead="Four starting points. Every detail can be yours."
          description="Choose Raj Tilak, Rajwada, Maharaja or Signature—then personalize the music, lighting, entry style and add-ons around your celebration."
        />

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <Reveal>
              <div className="grid items-end gap-8 xl:grid-cols-[1fr_0.78fr] xl:gap-16">
                <div className="max-w-3xl">
                  <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                    Choose your royal experience
                  </p>
                  <h2 className="text-[clamp(1.85rem,4.2vw,3.35rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
                    A package for every scale of celebration.
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-[1.75] text-[#010101]/58 sm:text-base sm:leading-7">
                  Each experience combines the important people, production and
                  procession elements under one specialist team. Begin with the
                  closest fit and customize from there.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid border-y border-[#010101]/10 sm:grid-cols-3">
              {[
                ["4", "Curated packages"],
                ["1", "Specialist coordination team"],
                ["Your way", "Flexible customization"],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className={`py-6 sm:px-7 sm:py-8 ${
                    index > 0
                      ? "border-t border-[#010101]/10 sm:border-l sm:border-t-0"
                      : ""
                  }`}
                >
                  <p className="text-[clamp(1.7rem,3.4vw,2.25rem)] font-extrabold tracking-[-0.035em]">
                    {value}
                  </p>
                  <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#010101]/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <nav
              aria-label="Browse package details"
              className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
              {PACKAGES.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className="package-overview-card group flex h-full min-h-44 flex-col justify-between rounded-2xl border border-[#010101]/10 bg-white p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[10px] font-extrabold tracking-[0.14em] text-[#E30B1D]">
                      {item.number}
                    </span>
                    {item.featured ? (
                      <span className="rounded-full bg-[#E30B1D] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white">
                        Most popular
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-8">
                    <p className="text-[clamp(1.35rem,2vw,1.7rem)] font-extrabold leading-[1.08] tracking-[-0.035em]">
                      {item.name}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-4">
                      <p className="text-xs font-semibold text-[#010101]/45">
                        {item.tagline}
                      </p>
                      <ArrowDown
                        className="h-4 w-4 shrink-0 text-[#E30B1D] transition-transform duration-200 group-hover:translate-y-1"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <section
          aria-labelledby="package-details-heading"
          className="border-y border-[#010101]/10 bg-[#010101]/[0.018]"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mb-10 max-w-3xl sm:mb-14">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                Package details
              </p>
              <h2
                id="package-details-heading"
                className="text-[clamp(1.85rem,4vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.038em]"
              >
                Compare what belongs in your Baraat.
              </h2>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {PACKAGES.map((item, packageIndex) => (
                <Reveal key={item.id}>
                  <article
                    id={item.id}
                    className="package-detail-card package-anchor overflow-hidden rounded-2xl border border-[#010101]/10 bg-white lg:h-[46rem] xl:h-[44rem]"
                  >
                    <div className="grid h-full lg:grid-cols-[0.9fr_1.1fr]">
                      <div className="relative min-h-72 overflow-hidden sm:min-h-96 lg:min-h-full">
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          loading={packageIndex === 0 ? "eager" : "lazy"}
                          sizes="(max-width: 1023px) 100vw, 40vw"
                          className="object-cover transition-transform duration-700 hover:scale-[1.025]"
                        />
                        <div className="absolute inset-0 bg-[#010101]/20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#010101]/95 via-[#010101]/38 to-[#010101]/5" />
                        <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[10px] font-extrabold tracking-[0.15em] text-white/60">
                              {item.number}
                            </span>
                            {item.featured ? (
                              <span className="rounded-full bg-[#E30B1D] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white">
                                Most popular
                              </span>
                            ) : null}
                          </div>
                          <h3 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-extrabold leading-none tracking-[-0.04em]">
                            {item.name}
                          </h3>
                          <p className="mt-2 text-sm font-bold text-white/70">
                            {item.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex h-full flex-col p-6 sm:p-8 lg:p-10 xl:p-12">
                        <p className="max-w-2xl text-sm leading-7 text-[#010101]/58 sm:text-base">
                          {item.description}
                        </p>
                        <div className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                          {item.inclusions.map(([title, detail]) => (
                            <div key={title} className="flex items-start gap-3.5">
                              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E30B1D] text-white">
                                <Check
                                  className="h-3.5 w-3.5"
                                  strokeWidth={2.4}
                                  aria-hidden="true"
                                />
                              </span>
                              <div>
                                <p className="text-sm font-extrabold leading-5">
                                  {title}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[#010101]/48">
                                  {detail}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-9 flex flex-col gap-3 border-t border-[#010101]/10 pt-6 sm:flex-row sm:items-center sm:justify-between lg:mt-auto">
                          <p className="inline-flex items-center gap-2 text-xs font-bold text-[#010101]/50">
                            <SlidersHorizontal
                              className="h-4 w-4 text-[#E30B1D]"
                              aria-hidden="true"
                            />
                            Every package can be customized.
                          </p>
                          <a
                            href={whatsappPackageLink(item.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center gap-2 text-sm font-extrabold text-[#010101] transition-colors hover:text-[#E30B1D]"
                            aria-label={`Enquire about the ${item.name} Package on WhatsApp`}
                          >
                            Enquire on WhatsApp
                            <ArrowUpRight
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="customize" className="package-anchor bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 lg:px-10 lg:py-24">
            <Reveal>
              <div className="lg:sticky lg:top-28 lg:self-start">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E30B1D] text-white">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mb-3 mt-8 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  Build it your way
                </p>
                <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.04em]">
                  Your Baraat does not need to fit a template.
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-[#010101]/58 sm:text-base">
                  Start with any package or build from scratch. Select what
                  matters to you and our team will turn the brief into a
                  coordinated, date-specific proposal.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Adjust dhol count, lighting and effects",
                    "Personalize truck and groom-name branding",
                    "Choose the right vintage entry and entertainment",
                    "Align the experience with your venue and guest count",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm font-bold leading-6"
                    >
                      <Check
                        className="mt-1 h-4 w-4 shrink-0 text-[#E30B1D]"
                        strokeWidth={2.4}
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="package-customizer-card rounded-2xl border border-[#010101]/10 bg-white p-6 sm:p-8 lg:p-10">
                <div className="mb-8 border-b border-[#010101]/10 pb-7">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D]">
                    Custom package builder
                  </p>
                  <h3 className="mt-3 text-xl font-extrabold tracking-[-0.025em] sm:text-2xl">
                    Tell us what your grand entry needs.
                  </h3>
                </div>
                <PackageCustomizer />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-[#010101] text-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <div className="grid gap-10 xl:grid-cols-[0.76fr_1.24fr] xl:gap-16">
              <div className="max-w-xl">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white sm:text-[11px]">
                  From package to procession
                </p>
                <h2 className="mt-3 text-[clamp(1.85rem,4vw,2.65rem)] font-extrabold leading-[1.1] tracking-[-0.035em]">
                  A clear path to your celebration.
                </h2>
                <p className="mt-5 text-sm leading-7 text-white/55 sm:text-base">
                  One focused conversation gives our team the details needed to
                  recommend, personalize and coordinate the right Baraat.
                </p>
              </div>

              <ol className="grid gap-8 sm:grid-cols-3 sm:gap-0">
                {[
                  [
                    "01",
                    "Choose",
                    "Select the package closest to the scale and energy you imagine.",
                  ],
                  [
                    "02",
                    "Customize",
                    "Adjust the entry, music, lights, artists, effects and support.",
                  ],
                  [
                    "03",
                    "Confirm",
                    "Our team checks availability and shapes a final coordinated plan.",
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
          <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mb-9 max-w-2xl">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                Package questions
              </p>
              <h2 className="text-[clamp(1.8rem,4vw,2.65rem)] font-extrabold leading-[1.1] tracking-[-0.035em]">
                Helpful answers before you choose.
              </h2>
            </div>
            <div className="divide-y divide-[#010101]/10 border-y border-[#010101]/10">
              {FAQS.map((faq, index) => (
                <details key={faq.question} className="package-faq group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left">
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
                  <p className="max-w-3xl pb-6 pl-9 pr-12 text-sm leading-7 text-[#010101]/55 sm:pl-10 sm:text-base">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#010101]/10 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="grid items-end gap-9 rounded-2xl border border-[#010101]/10 bg-[#010101]/[0.018] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12">
              <div className="max-w-3xl">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D]">
                  Personal guidance
                </p>
                <h2 className="mt-3 text-[clamp(1.85rem,4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.04em]">
                  Not sure which package fits your Baraat?
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#010101]/55 sm:text-base">
                  Share your date, city and vision. We will help you find the
                  right starting point and customize it around your celebration.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <a
                  href="https://wa.me/919089081111?text=Hello%20Plan%20My%20Baraat%2C%20please%20help%20me%20choose%20the%20right%20Baraat%20package."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E30B1D] px-6 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-[#010101]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#010101]/15 bg-white px-6 text-sm font-extrabold text-[#010101] transition-all hover:-translate-y-0.5 hover:border-[#E30B1D] hover:text-[#E30B1D]"
                >
                  Contact Us
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="contact" />
    </div>
  );
}
