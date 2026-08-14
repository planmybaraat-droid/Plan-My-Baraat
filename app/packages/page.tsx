import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, GitCompareArrows, MessageCircle, SlidersHorizontal, Sparkles } from "lucide-react";

import InnerPageHero from "@/components/InnerPageHero";
import PackageCustomizer from "@/components/PackageCustomizer";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { BARAAT_PACKAGES } from "@/lib/packagesData";

export const metadata: Metadata = {
  title: "Baraat Packages | Compare Royal Baraat Experiences",
  description: "Explore four Plan My Baraat packages with clear inclusions for DJ trucks, groom entries, sound, dhol, Chhatri lights, effects, entertainment and Safa teams.",
  alternates: { canonical: "/packages" },
  openGraph: {
    title: "Royal Baraat Packages | Plan My Baraat",
    description: "Four premium Baraat foundations, clearly explained and customizable for your celebration.",
    url: "/packages",
    type: "website",
  },
};

function whatsappPackageLink(packageName: string) {
  return `https://wa.me/919089081111?text=${encodeURIComponent(
    `Hello Plan My Baraat,\n\nI am interested in the ${packageName}. Please share availability, a personalized quote and the best options for my event.`,
  )}`;
}

function featureParts(feature: string) {
  const [title, ...details] = feature.split(/\s+-\s+/);
  return { title, detail: details.join(" — ") };
}

export default function PackagesPage() {
  return (
    <div className="inner-public-page relative flex min-h-screen flex-col bg-white font-sans text-[#010101]">
      <SiteHeader variant="contact" />
      <main className="flex-grow">
        <InnerPageHero
          eyebrow="Four curated Baraat experiences"
          title="Choose your celebration."
          lead="Clear packages. Flexible possibilities. One specialist team."
          description="Understand every included service, choose the closest fit, and enquire on WhatsApp for availability and a personalized event quote."
        />

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
              <Reveal>
                <div className="max-w-3xl">
                  <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">Package collection</p>
                  <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.04] tracking-[-0.045em]">Begin with the experience you want guests to remember.</h2>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-[#010101]/56 sm:text-base">Each package combines the moving production, royal entry, live music, lighting, effects and Safa support under one coordinated plan.</p>
                </div>
              </Reveal>
              <Link href="/compare-packages" className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl border border-[#010101]/12 px-5 text-sm font-extrabold transition-all hover:border-[#E30B1D] hover:text-[#E30B1D]">
                <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
                Compare side by side
              </Link>
            </div>

            <nav aria-label="Browse package details" className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {BARAAT_PACKAGES.map((pkg, index) => (
                <Reveal key={pkg.id} delay={index % 2}>
                  <Link href={`#${pkg.id}`} className="group flex h-full min-h-44 flex-col justify-between rounded-2xl border border-[#010101]/10 bg-white p-5 transition-all hover:-translate-y-1 hover:border-[#E30B1D]/35 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[10px] font-extrabold tracking-[0.15em] text-[#E30B1D]">{pkg.number}</span>
                      {pkg.featured ? <span className="rounded-full bg-[#E30B1D] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white">Most popular</span> : pkg.custom ? <span className="rounded-full border border-[#010101]/10 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#010101]/55">Custom</span> : null}
                    </div>
                    <div className="mt-8">
                      <h3 className="text-xl font-extrabold tracking-[-0.035em]">{pkg.shortName}</h3>
                      <p className="mt-2 text-xs font-semibold leading-5 text-[#010101]/45">{pkg.tagline}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold">View inclusions <ArrowDown className="h-3.5 w-3.5 text-[#E30B1D] transition-transform group-hover:translate-y-1" aria-hidden="true" /></span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </nav>
          </div>
        </section>

        <section className="border-y border-[#010101]/10 bg-[#010101]/[0.018]">
          <div className="mx-auto max-w-7xl space-y-7 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            {BARAAT_PACKAGES.map((pkg, packageIndex) => (
              <Reveal key={pkg.id}>
                <article id={pkg.id} className={`package-anchor overflow-hidden rounded-2xl border bg-white ${pkg.featured ? "border-[#E30B1D]/40 shadow-[0_30px_80px_-65px_rgba(227,11,29,0.9)]" : "border-[#010101]/10"}`}>
                  <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
                    <div className="relative min-h-[29rem] overflow-hidden sm:min-h-[34rem] lg:min-h-full">
                      <Image src={pkg.image} alt={pkg.imageAlt} fill priority={packageIndex === 0} sizes="(max-width: 1023px) 100vw, 39vw" className="object-cover transition-transform duration-700 hover:scale-[1.025]" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.05)_16%,rgba(1,1,1,0.86)_100%)]" aria-hidden="true" />
                      <div className="absolute inset-x-0 top-0 flex justify-between gap-3 p-6 sm:p-8">
                        <span className="text-[10px] font-extrabold tracking-[0.16em] text-white/80">{pkg.number}</span>
                        {pkg.featured ? <span className="rounded-full bg-[#E30B1D] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white">Most popular</span> : null}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/62">{pkg.tagline}</p>
                        <h2 className="mt-2 text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-none tracking-[-0.045em]">{pkg.shortName}</h2>
                        <p className="mt-5 max-w-md text-sm leading-7 text-white/70">{pkg.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-col p-6 sm:p-8 lg:p-10 xl:p-12">
                      <div className="flex items-center justify-between gap-4 border-b border-[#010101]/10 pb-5">
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E30B1D]">Everything included</p>
                          <p className="mt-1 text-sm font-bold text-[#010101]/42">{pkg.features.length} coordinated services</p>
                        </div>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E30B1D]/8 text-[#E30B1D]"><Check className="h-5 w-5" aria-hidden="true" /></span>
                      </div>

                      <div className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                        {pkg.features.map((feature) => {
                          const { title, detail } = featureParts(feature);
                          return (
                            <div key={feature} className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E30B1D] text-white"><Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" /></span>
                              <div><p className="text-sm font-extrabold leading-5">{title}</p>{detail ? <p className="mt-1 text-xs leading-5 text-[#010101]/48">{detail}</p> : null}</div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-9 grid gap-3 border-t border-[#010101]/10 pt-6 sm:grid-cols-[1fr_auto] sm:items-center">
                        <p className="inline-flex items-center gap-2 text-xs font-bold text-[#010101]/48"><SlidersHorizontal className="h-4 w-4 text-[#E30B1D]" aria-hidden="true" />Every package can be personalized.</p>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Link href={`/packages/${pkg.id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#010101]/12 px-4 text-xs font-extrabold transition-colors hover:border-[#E30B1D] hover:text-[#E30B1D]">Full details <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
                          <a href={whatsappPackageLink(pkg.name)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#E30B1D] px-4 text-xs font-extrabold text-white transition-colors hover:bg-[#010101]"><MessageCircle className="h-4 w-4" aria-hidden="true" />Enquire on WhatsApp</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-[#010101] text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1fr_auto] lg:px-10">
            <div className="max-w-3xl">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#ff6673]">Need a clearer answer?</p>
              <h2 className="mt-3 text-[clamp(1.8rem,3.5vw,2.75rem)] font-extrabold tracking-[-0.04em]">Compare every service side by side.</h2>
              <p className="mt-4 text-sm leading-7 text-white/58 sm:text-base">Plain-language explanations show what changes from one package to the next and which experience best matches your celebration.</p>
            </div>
            <Link href="/compare-packages" className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-[#010101] transition-colors hover:bg-[#E30B1D] hover:text-white">Compare packages <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>

        <section id="customize" className="package-anchor bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 lg:px-10 lg:py-24">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E30B1D] text-white"><Sparkles className="h-5 w-5" aria-hidden="true" /></span>
                <p className="mb-3 mt-8 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D]">Build it your way</p>
                <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.04em]">Tell us what your dream entry looks like.</h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-[#010101]/58 sm:text-base">Choose the experiences that matter, share your event details, and continue directly on WhatsApp. Our team will recommend the right foundation and prepare your personalized quote.</p>
              </div>
            </Reveal>
            <Reveal delay={1}><div className="rounded-2xl border border-[#010101]/10 bg-white p-5 shadow-[0_28px_80px_-65px_rgba(1,1,1,0.65)] sm:p-8 lg:p-10"><PackageCustomizer /></div></Reveal>
          </div>
        </section>
      </main>
      <SiteFooter variant="contact" />
    </div>
  );
}
