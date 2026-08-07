import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowUpRight,
  Clock3,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  Sparkles,
  UserRoundCheck,
  Zap,
} from "lucide-react";

import InnerPageHero from "@/components/InnerPageHero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Plan My Baraat",
  description:
    "Contact Plan My Baraat for expert groom's Baraat planning and management. Send your enquiry directly to our team on WhatsApp.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Plan My Baraat",
    description:
      "Planning your Baraat? Connect with our specialist team directly on WhatsApp.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Plan My Baraat",
    description:
      "Planning your Baraat? Connect with our specialist team directly on WhatsApp.",
  },
};

const CONTACT_CARDS = [
  {
    label: "Call / WhatsApp",
    value: "+91 90890 81111",
    href: "https://wa.me/919089081111",
    icon: PhoneCall,
  },
  {
    label: "Website",
    value: "www.planmybaraat.com",
    href: "https://www.planmybaraat.com",
    icon: Globe2,
  },
  {
    label: "Studio",
    value: (
      <>
        Studio 501-502, Broadway Signature, 5th Floor,
        <br />
        Near Red Petal Party Plot, Opp. Sevasi-Bhayli Canal Ring Road,
        <br />
        Vadodara, Gujarat - 391110
      </>
    ),
    icon: MapPin,
  },
  {
    label: "Working Hours",
    value: (
      <>
        Monday – Sunday
        <br />
        10:00 AM – 8:00 PM
      </>
    ),
    icon: Clock3,
  },
] as const;

const TRUST_CARDS = [
  {
    title: "Quick WhatsApp Response",
    description: "We usually reply within a few minutes.",
    icon: Zap,
  },
  {
    title: "Experienced Baraat Planning Team",
    description: "Professional planning from start to finish.",
    icon: UserRoundCheck,
  },
  {
    title: "Personalized Assistance",
    description: "Every Baraat is planned according to your requirements.",
    icon: Sparkles,
  },
  {
    title: "Easy Communication",
    description: "Connect with our team instantly on WhatsApp.",
    icon: MessageCircle,
  },
] as const;

export default function ContactPage() {
  return (
    <div className="contact-page inner-public-page relative flex min-h-screen flex-col bg-white font-sans text-[#010101]">
      <SiteHeader variant="contact" />

      <main className="flex-grow">
        <InnerPageHero
          eyebrow="Your grand entrance starts here"
          title="Contact Plan My Baraat."
          lead="Planning your Baraat?"
          description="Our team is here to help you create a grand and unforgettable Baraat experience. Reach out today and let’s make your celebration truly memorable."
        />

        <section id="contact-details" className="border-b border-[#010101]/10 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <div className="mb-10 max-w-2xl">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                Contact information
              </p>
              <h2 className="text-[1.75rem] font-extrabold leading-tight tracking-[-0.035em] sm:text-4xl">
                Reach us your way.
              </h2>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-[#010101]/10 bg-[#010101]/10 sm:grid-cols-2 lg:grid-cols-4">
              {CONTACT_CARDS.map((contact) => {
                const Icon = contact.icon;
                const content = (
                  <>
                    <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#010101]/10 text-[#E30B1D] transition-all duration-300 group-hover:border-[#E30B1D] group-hover:bg-[#E30B1D] group-hover:text-white sm:mb-7">
                      <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="mb-2.5 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#010101]/45">
                      {contact.label}
                    </span>
                    <span className="block text-sm font-semibold leading-6 text-[#010101]">
                      {contact.value}
                    </span>
                  </>
                );

                return "href" in contact ? (
                  <a
                    key={contact.label}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white p-6 transition-colors duration-300 hover:bg-[#010101]/[0.025] sm:p-7"
                  >
                    {content}
                  </a>
                ) : (
                  <article
                    key={contact.label}
                    className="group bg-white p-6 transition-colors duration-300 hover:bg-[#010101]/[0.025] sm:p-7"
                  >
                    {content}
                  </article>
                );
              })}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <a
                href="mailto:planmybaraat@gmail.com"
                className="group flex min-w-0 items-center gap-4 rounded-xl border border-[#010101]/10 bg-white px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E30B1D]/40 hover:shadow-[0_12px_30px_-22px_rgba(1,1,1,0.4)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#010101]/10 text-[#E30B1D] transition-colors group-hover:border-[#E30B1D]">
                  <Mail className="h-4.5 w-4.5" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#010101]/45">
                    Email
                  </span>
                  <span className="mt-1 block truncate text-sm font-semibold text-[#010101]">
                    planmybaraat@gmail.com
                  </span>
                </span>
              </a>

              <a
                href="https://www.instagram.com/planmybaraatofficial?igsh=c3BsZGwwYmVyaW1o"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-w-0 items-center gap-4 rounded-xl border border-[#010101]/10 bg-white px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E30B1D]/40 hover:shadow-[0_12px_30px_-22px_rgba(1,1,1,0.4)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#010101]/10 text-[#E30B1D] transition-colors group-hover:border-[#E30B1D]">
                  <span className="instagram-brand-icon" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#010101]/45">
                    Instagram
                  </span>
                  <span className="mt-1 block truncate text-sm font-semibold text-[#010101]">
                    @planmybaraatofficial
                  </span>
                </span>
              </a>

              <a
                href="https://www.facebook.com/share/1JTGqNsvfx/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-w-0 items-center gap-4 rounded-xl border border-[#010101]/10 bg-white px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E30B1D]/40 hover:shadow-[0_12px_30px_-22px_rgba(1,1,1,0.4)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#010101]/10 text-[#E30B1D] transition-colors group-hover:border-[#E30B1D]">
                  <span className="text-lg font-extrabold leading-none" aria-hidden="true">
                    f
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#010101]/45">
                    Facebook
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-[#010101]">
                    Follow Plan My Baraat
                  </span>
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10 lg:px-10 lg:py-24">
            <div className="relative flex min-h-[32rem] flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-[#010101] p-7 text-white shadow-[0_28px_65px_-40px_rgba(1,1,1,0.8)] sm:min-h-[36rem] sm:p-10 lg:min-h-0">
              <Image
                src="/Assests/1000096850.png"
                alt=""
                fill
                sizes="(max-width: 1023px) 100vw, 42vw"
                className="object-cover object-center"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.68)_0%,rgba(1,1,1,0.78)_48%,rgba(1,1,1,0.94)_100%)]"
                aria-hidden="true"
              />
              <div className="relative z-10">
                <p className="mb-5 inline-flex w-fit rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E30B1D] shadow-[0_8px_24px_-14px_rgba(1,1,1,0.9)] sm:text-[11px]">
                  Direct to our team
                </p>
                <h2 className="max-w-lg text-[clamp(2.125rem,3vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.035em]">
                  One message. A memorable Baraat.
                </h2>
                <p className="mt-6 max-w-sm text-sm leading-7 text-white/75">
                  Tell us what you have in mind. Your message opens directly in
                  WhatsApp, ready to send to our specialist planning team.
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

            <ContactForm />
          </div>
        </section>

        <section className="border-t border-[#010101]/10 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  Why contact us
                </p>
                <h2 className="text-[1.75rem] font-extrabold leading-tight tracking-[-0.035em] sm:text-4xl">
                  Clear, personal, dependable.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#010101]/55">
                Specialist support focused entirely on planning and managing the
                groom&apos;s Baraat.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST_CARDS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="group rounded-2xl border border-[#010101]/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#E30B1D]/50 hover:shadow-[0_20px_50px_-25px_rgba(1,1,1,0.35)]"
                  >
                    <div className="mb-8 flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E30B1D] text-white">
                        <Icon className="h-4.5 w-4.5" strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <span className="text-xs font-bold text-[#010101]/30">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold leading-6 tracking-[-0.02em]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#010101]/55">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="contact" />
    </div>
  );
}
