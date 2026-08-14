import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, GitCompareArrows, MessageCircle, SlidersHorizontal } from "lucide-react";

import Reveal from "@/components/Reveal";
import { BARAAT_PACKAGES } from "@/lib/packagesData";

function featureParts(feature: string) {
  const [title, ...details] = feature.split(/\s+-\s+/);
  return { title, detail: details.join(" — ") };
}

function whatsappPackageLink(packageName: string) {
  return `https://wa.me/919089081111?text=${encodeURIComponent(
    `Hello Plan My Baraat,\n\nI am interested in the ${packageName}. Please share availability, a personalized quote and the best options for my event.`,
  )}`;
}

export default function HomePackagesShowcase() {
  return (
    <section id="packages" className="overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
              Four ways to celebrate
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.35rem)] font-extrabold leading-[1.04] tracking-[-0.045em]">
              Find the Baraat that feels like yours.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#010101]/56 sm:text-base">
              Start with the scale, energy and production you want. Every package is clearly explained and can be personalized around your venue, route and guest count.
            </p>
          </div>
          <Link
            href="/compare-packages"
            className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl border border-[#010101]/12 bg-white px-5 text-sm font-extrabold transition-all hover:-translate-y-0.5 hover:border-[#E30B1D] hover:text-[#E30B1D]"
          >
            <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
            Compare packages
          </Link>
        </div>

        <div className="mt-12 space-y-7">
          {BARAAT_PACKAGES.map((pkg, index) => (
            <Reveal key={pkg.id} delay={index % 2}>
              <article className={`group overflow-hidden rounded-2xl border bg-white ${pkg.featured ? "border-[#E30B1D]/35 shadow-[0_30px_80px_-65px_rgba(227,11,29,0.85)]" : "border-[#010101]/10"}`}>
                <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
                <Link href={`/packages/${pkg.id}`} className="relative block min-h-[27rem] overflow-hidden bg-[#100104] sm:min-h-[31rem] lg:min-h-full">
                  <Image
                    src={pkg.image}
                    alt={pkg.imageAlt}
                    fill
                    quality={92}
                    priority={index === 0}
                    sizes="(max-width: 1023px) 100vw, 39vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.06)_20%,rgba(1,1,1,0.72)_100%)]" aria-hidden="true" />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5">
                    <span className="text-[10px] font-extrabold tracking-[0.16em] text-white/80">{pkg.number}</span>
                    {pkg.featured ? (
                      <span className="rounded-full bg-[#E30B1D] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white">Most popular</span>
                    ) : pkg.custom ? (
                      <span className="rounded-full border border-white/25 bg-[#010101]/35 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white backdrop-blur-sm">Fully custom</span>
                    ) : null}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/65">{pkg.tagline}</p>
                    <h3 className="mt-2 text-[clamp(2rem,4vw,3.1rem)] font-extrabold leading-none tracking-[-0.045em]">{pkg.shortName}</h3>
                    <p className="mt-5 max-w-md text-sm leading-7 text-white/70">{pkg.description}</p>
                  </div>
                </Link>

                <div className="flex flex-col p-6 sm:p-8 lg:p-10 xl:p-12">
                  <div className="flex items-center justify-between gap-4 border-b border-[#010101]/10 pb-5">
                    <div><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E30B1D]">Everything included</p><p className="mt-1 text-sm font-bold text-[#010101]/42">{pkg.features.length} coordinated services</p></div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E30B1D]/8 text-[#E30B1D]"><Check className="h-5 w-5" aria-hidden="true" /></span>
                  </div>
                  <div className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    {pkg.features.map((feature) => {
                      const { title, detail } = featureParts(feature);
                      return <div key={feature} className="flex items-start gap-3"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E30B1D] text-white"><Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" /></span><div><p className="text-sm font-extrabold leading-5">{title}</p>{detail ? <p className="mt-1 text-xs leading-5 text-[#010101]/48">{detail}</p> : null}</div></div>;
                    })}
                  </div>

                  <div className="mt-9 grid gap-3 border-t border-[#010101]/10 pt-6 sm:grid-cols-[1fr_auto] sm:items-center">
                    <p className="inline-flex items-center gap-2 text-xs font-bold text-[#010101]/48"><SlidersHorizontal className="h-4 w-4 text-[#E30B1D]" aria-hidden="true" />Every package can be personalized.</p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                    <Link href={`/packages/${pkg.id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#010101]/12 px-4 text-xs font-extrabold transition-colors hover:border-[#E30B1D] hover:text-[#E30B1D]">Full details <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
                    <a
                      href={whatsappPackageLink(pkg.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#E30B1D] px-4 text-xs font-extrabold text-white transition-colors hover:bg-[#010101]"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      Enquire on WhatsApp
                    </a>
                    </div>
                  </div>
                </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid overflow-hidden rounded-2xl border border-[#010101]/10 bg-[#010101] text-white lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="p-6 sm:p-8">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#ff6673]">Not sure which package fits?</p>
            <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">Compare every service in plain language.</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">See the truck, entry choices, sound, dhol, Chhatris, effects, entertainment and Safa capacity side by side—then enquire directly on WhatsApp.</p>
          </div>
          <Link href="/compare-packages" className="m-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-[#010101] transition-all hover:bg-[#E30B1D] hover:text-white sm:m-6 lg:ml-0">
            Start comparing
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
