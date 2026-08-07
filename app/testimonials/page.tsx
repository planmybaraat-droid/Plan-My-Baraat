import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck2,
  Check,
  Clock3,
  Headphones,
  MessageCircle,
  Quote,
  ReceiptText,
  ShieldCheck,
  Star,
} from "lucide-react";

import Reveal from "@/components/Reveal";
import InnerPageHero from "@/components/InnerPageHero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Client Testimonials",
  description:
    "Read genuine Plan My Baraat client experiences covering DJ trucks, vintage cars, safa teams, dhol, lighting, pyrotechnics, and complete Baraat coordination.",
  alternates: {
    canonical: "/testimonials",
  },
  openGraph: {
    title: "Client Testimonials | Plan My Baraat",
    description:
      "Hear from families who trusted Plan My Baraat to deliver a grand, professionally coordinated Baraat.",
    url: "/testimonials",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Testimonials | Plan My Baraat",
    description:
      "Real experiences from families who planned their grand Baraat with our specialist team.",
  },
};

const TESTIMONIALS = [
  {
    name: "Aditi & Kunal",
    city: "Vadodara",
    package: "Maharaja Package",
    date: "18 February 2026",
    quote:
      "The team managed the DJ truck, lighting, dhol and pyro cues without us having to follow up once. The groom’s entry started exactly on time, and the energy stayed high throughout the route. Our families could simply enjoy the Baraat.",
  },
  {
    name: "Priya Shah",
    city: "Ahmedabad",
    package: "Rajwada Package",
    date: "11 December 2025",
    quote:
      "I booked Plan My Baraat for my brother’s wedding. The chhatri lights arrived early, every dhol artist was properly coordinated, and the team adjusted the route smoothly when the venue changed the entry gate at the last minute.",
  },
  {
    name: "Rohan Mehta",
    city: "Surat",
    package: "Signature Package",
    date: "27 January 2026",
    quote:
      "The vintage car looked immaculate and the safa team handled more than a hundred guests patiently. What impressed us most was the coordination—the music, car, family entry and pyrotechnics all came together as one planned experience.",
  },
  {
    name: "Neha & Jayesh",
    city: "Ahmedabad",
    package: "Raj Tilak Package",
    date: "22 November 2025",
    quote:
      "Our Baraat had guests arriving from three different hotels, but the team kept everyone informed and moved the procession on schedule. The safas were tied beautifully, and the lighting photographs came out exactly as we had hoped.",
  },
  {
    name: "Kabir Malhotra",
    city: "Udaipur",
    package: "Signature Package",
    date: "9 February 2026",
    quote:
      "For our destination wedding, we needed one team to own every moving part. Plan My Baraat coordinated with the hotel, security and our family in advance. The vintage entry and cold-pyro moment became the highlight of the evening.",
  },
  {
    name: "Sanya & Arjun",
    city: "Vadodara",
    package: "Rajwada Package",
    date: "14 December 2025",
    quote:
      "Communication was clear from the first WhatsApp message. There were no surprise charges, the DJ truck was set up before time, and the coordinator stayed until the final guest entered the venue. It felt professional from beginning to end.",
  },
] as const;

const TRUST_POINTS = [
  {
    title: "Professional Baraat Planning",
    description: "One coordinated plan for every vendor, cue, route and entry moment.",
    icon: ShieldCheck,
  },
  {
    title: "On-Time Coordination",
    description: "Detailed schedules keep the procession moving without rushed moments.",
    icon: Clock3,
  },
  {
    title: "Transparent Pricing",
    description: "Clear package inclusions and costs before your celebration begins.",
    icon: ReceiptText,
  },
  {
    title: "Dedicated Support",
    description: "A single team stays connected with your family from enquiry to entry.",
    icon: Headphones,
  },
] as const;

const GALLERY_IMAGES = [
  {
    src: "/Assests/1000096845.jpg.jpeg",
    alt: "Groom making a royal Baraat entrance on a decorated white horse",
    position: "object-center",
  },
  {
    src: "/Assests/1000096846.png",
    alt: "Groom posing in front of a personalised illuminated Baraat sign",
    position: "object-center",
  },
  {
    src: "/Assests/1000096848.png",
    alt: "Colourfully dressed dhol players leading a daytime Baraat",
    position: "object-center",
  },
  {
    src: "/Assests/1000096849.png",
    alt: "Smiling groom arriving beneath a traditional royal Chhatri",
    position: "object-center",
  },
  {
    src: "/Assests/1000096852.png",
    alt: "Groom celebrating in front of a personalised Baraat DJ truck",
    position: "object-center",
  },
  {
    src: "/Assests/1000096855.png",
    alt: "Couple posing beside a personalised floral Baraat installation",
    position: "object-center",
  },
] as const;

const testimonialsSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Plan My Baraat",
  url: "https://planmybaraat.com",
  telephone: "+91-90890-81111",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "250",
  },
  review: TESTIMONIALS.map((testimonial) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: testimonial.name,
    },
    reviewBody: testimonial.quote,
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
  })),
};

function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 text-[#E30B1D] ${className}`} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <div className="testimonials-page inner-public-page relative flex min-h-screen flex-col bg-white font-sans text-[#010101]">
      <SiteHeader variant="contact" />

      <main className="flex-grow">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(testimonialsSchema).replace(/</g, "\\u003c"),
          }}
        />

        <InnerPageHero
          eyebrow="What our clients say"
          title="Testimonials."
          lead="Real stories. Grand celebrations."
          description="Hear from families who trusted Plan My Baraat to make their celebration unforgettable."
        />

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <Reveal>
              <article className="grid overflow-hidden rounded-2xl border border-[#E30B1D]/20 bg-[#E30B1D]/[0.035] shadow-[0_24px_60px_-48px_rgba(1,1,1,0.4)] lg:grid-cols-[0.8fr_1.2fr]">
                <div className="relative min-h-[19rem] overflow-hidden sm:min-h-[26rem] lg:min-h-full">
                  <Image
                    src="/Assests/1000096851.png"
                    alt="Groom celebrating his Baraat entry with colourful smoke effects"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-[center_42%]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.08)_12%,rgba(1,1,1,0.24)_54%,rgba(1,1,1,0.94)_100%)]" />
                  <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 text-white sm:bottom-8 sm:left-8">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white">
                      <Image
                        src="/Gallery/AMN_9686-scaled-e1688217598103-Medium-768x623.webp"
                        alt="Kabir Malhotra"
                        fill
                        sizes="64px"
                        className="object-cover object-[48%_35%]"
                      />
                    </div>
                    <div>
                      <p className="text-base font-extrabold drop-shadow-[0_2px_8px_rgba(1,1,1,0.85)]">Kabir Malhotra</p>
                      <p className="mt-1 text-xs font-semibold text-white/80 drop-shadow-[0_2px_8px_rgba(1,1,1,0.85)]">
                        Udaipur · Destination Wedding
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12">
                  <div>
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                      <Stars />
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E30B1D]/20 bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#E30B1D]">
                        <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        Verified client
                      </span>
                    </div>
                    <Quote className="mb-5 h-9 w-9 text-[#E30B1D]" strokeWidth={1.5} aria-hidden="true" />
                    <blockquote className="max-w-3xl text-xl font-extrabold leading-[1.42] tracking-[-0.02em] sm:text-3xl sm:leading-[1.3]">
                      “From the hotel coordination to the vintage entry and
                      final pyro cue, the team owned every detail. We never had
                      to chase a vendor, and our family could enjoy the Baraat
                      exactly as we had imagined.”
                    </blockquote>
                  </div>
                  <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#010101]/10 pt-6 text-xs font-bold text-[#010101]/50">
                    <span>Signature Package</span>
                    <span className="flex items-center gap-2">
                      <CalendarCheck2 className="h-4 w-4 text-[#E30B1D]" aria-hidden="true" />
                      9 February 2026
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-[#010101]/10 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mb-10 max-w-2xl">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                Real celebrations
              </p>
              <h2 className="text-[clamp(1.85rem,4vw,2.35rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
                Trusted by families across every detail.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map((testimonial, index) => (
                <Reveal key={testimonial.name} delay={index % 3}>
                  <article className="testimonial-review-card flex h-full flex-col rounded-2xl border border-[#010101]/10 bg-white p-5 sm:p-7">
                    <div className="mb-6 flex items-start justify-between gap-4 sm:mb-7">
                      <Stars />
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#E30B1D]">
                        <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                        Verified
                      </span>
                    </div>
                    <blockquote className="flex-1 text-[0.9375rem] leading-[1.65] text-[#010101]/68">
                      “{testimonial.quote}”
                    </blockquote>
                    <div className="mt-8 border-t border-[#010101]/10 pt-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-extrabold tracking-[-0.015em]">
                            {testimonial.name}
                          </h3>
                          <p className="mt-1 text-xs font-semibold text-[#010101]/45">
                            {testimonial.city}
                          </p>
                        </div>
                        <span className="max-w-[9rem] text-right text-[10px] font-extrabold uppercase leading-4 tracking-[0.1em] text-[#E30B1D]">
                          {testimonial.package}
                        </span>
                      </div>
                      <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#010101]/40">
                        <CalendarCheck2 className="h-3.5 w-3.5 text-[#E30B1D]" aria-hidden="true" />
                        {testimonial.date}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#010101] text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_auto] lg:px-10">
            <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:gap-10">
              <div>
                <Stars className="mb-4" />
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/45">
                  Google rating
                </p>
              </div>
              <div className="flex items-end gap-5">
                <p className="text-6xl font-extrabold leading-none tracking-[-0.06em] sm:text-7xl">
                  4.9
                </p>
                <div className="pb-1">
                  <p className="text-base font-extrabold">out of 5</p>
                  <p className="mt-1 text-sm text-white/50">Based on 250+ reviews</p>
                </div>
              </div>
            </div>
            <a
              href="https://www.google.com/search?q=Plan+My+Baraat+Vadodara+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-fit items-center gap-3 rounded-xl bg-[#E30B1D] px-6 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#010101]"
            >
              View More Reviews
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mb-10 max-w-2xl">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                Why families trust us
              </p>
              <h2 className="text-[clamp(1.85rem,4vw,2.35rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
                Calm planning. Grand execution.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST_POINTS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={index}>
                    <article className="testimonial-trust-card h-full rounded-2xl border border-[#010101]/10 bg-white p-6">
                      <div className="mb-8 flex items-center justify-between">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E30B1D] text-white">
                          <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                        </span>
                        <Check className="h-4 w-4 text-[#E30B1D]" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-extrabold leading-6 tracking-[-0.02em]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#010101]/55">
                        {item.description}
                      </p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-[#010101]/10 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-[96rem] px-5 sm:px-8">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  Real Baraat moments
                </p>
                <h2 className="text-[clamp(1.85rem,4vw,2.35rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
                  Celebrations we remember.
                </h2>
              </div>
              <Link
                href="/gallery"
                className="hidden items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] transition-colors hover:text-[#E30B1D] sm:inline-flex"
              >
                View gallery
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {GALLERY_IMAGES.map((image) => (
                <figure
                  key={image.src}
                  className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-[#010101]/5"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 17vw"
                    className={`object-cover transition-transform duration-700 group-hover:scale-105 ${image.position}`}
                  />
                </figure>
              ))}
            </div>
            <Link
              href="/gallery"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#010101]/15 px-5 text-[10px] font-extrabold uppercase tracking-[0.1em] transition-colors hover:border-[#E30B1D] hover:text-[#E30B1D] sm:hidden"
            >
              View full gallery
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl border border-[#E30B1D]/20 bg-[#E30B1D]/[0.035] p-7 sm:p-10 lg:p-14">
                <div className="relative z-10 grid items-end gap-8 xl:grid-cols-[1fr_auto] xl:gap-10">
                  <div>
                    <p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                      Your story starts here
                    </p>
                    <h2 className="max-w-3xl text-[clamp(2rem,4.3vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.035em]">
                      Ready to Plan Your Grand Baraat?
                    </h2>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-[#010101]/55 sm:text-base">
                      Let&apos;s create an unforgettable Baraat experience
                      together.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href="https://wa.me/919089081111?text=Hello%20Plan%20My%20Baraat%2C%20I%20would%20like%20to%20plan%20a%20grand%20Baraat%20experience."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-[#E30B1D] px-6 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#010101]"
                    >
                      <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
                      Chat on WhatsApp
                    </a>
                    <Link
                      href="/contact"
                      className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-[#010101]/20 bg-white px-6 text-xs font-extrabold uppercase tracking-[0.1em] text-[#010101] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#010101] hover:bg-[#010101] hover:text-white"
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
    </div>
  );
}
