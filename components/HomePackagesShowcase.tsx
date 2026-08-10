import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, SlidersHorizontal } from "lucide-react";

import Reveal from "@/components/Reveal";
import { BARAAT_PACKAGES } from "@/lib/packagesData";

const PACKAGE_IMAGES: Record<string, string> = {
  "raj-tilak": "/Assests/packages/raj-tilak-premium.jpeg",
  rajwada: "/Assests/packages/rajwada-v2.png",
  maharaja: "/Assests/packages/maharaja-v2.png",
  signature: "/Assests/packages/signature-home.png",
};

function featureParts(feature: string) {
  const [title, ...detailParts] = feature.split(/\s+-\s+/);
  return { title, detail: detailParts.join(" — ") };
}

export default function HomePackagesShowcase() {
  return (
    <section id="packages" className="bg-white">
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
              Every included service is listed clearly. Start with the package closest to your vision, then customize it around your venue, route and guest count.
            </p>
          </div>
          <Link href="/packages" className="inline-flex w-fit items-center gap-2 text-sm font-extrabold transition-colors hover:text-[#E30B1D]">
            Compare all packages
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 space-y-5">
          {BARAAT_PACKAGES.map((pkg, packageIndex) => {
            const featured = pkg.id === "maharaja";
            const signature = pkg.id === "signature";
            return (
              <Reveal key={pkg.id} delay={packageIndex % 2}>
                <article className={`overflow-hidden rounded-2xl border bg-white shadow-[0_24px_65px_-52px_rgba(1,1,1,0.7)] ${featured ? "border-[#E30B1D]/45" : "border-[#010101]/10"}`}>
                  <div className="grid lg:grid-cols-[0.34fr_0.66fr]">
                    <div
                      className={`relative flex flex-col overflow-hidden bg-[#100104] text-white lg:min-h-full ${
                        signature ? "min-h-[36rem] sm:min-h-[34rem]" : "min-h-64"
                      }`}
                    >
                      <div
                        className={`w-full overflow-hidden bg-[#010101] ${
                          signature
                            ? "absolute inset-0 h-full"
                            : "relative aspect-[16/10] lg:absolute lg:inset-0 lg:h-full lg:aspect-auto"
                        }`}
                      >
                        <Image
                          src={PACKAGE_IMAGES[pkg.id]}
                          alt={`${pkg.name} Baraat experience`}
                          fill
                          quality={95}
                          priority={packageIndex === 0}
                          sizes="(max-width: 1023px) 100vw, 34vw"
                          className={`object-cover transition-transform duration-700 ${
                            signature
                              ? "scale-[1.45] object-bottom hover:scale-[1.5] sm:scale-[1.38] sm:hover:scale-[1.43] lg:scale-[1.55] lg:hover:scale-[1.6]"
                              : "object-center hover:scale-[1.025]"
                          }`}
                        />
                        <div
                          className={`absolute inset-0 ${
                            signature
                              ? "bg-[linear-gradient(180deg,rgba(1,1,1,0.05)_22%,rgba(16,1,4,0.24)_48%,rgba(16,1,4,0.96)_100%)]"
                              : "bg-gradient-to-t from-[#100104] via-[#100104]/15 to-[#010101]/5 lg:from-[#100104] lg:via-[#100104]/35 lg:to-transparent"
                          }`}
                          aria-hidden="true"
                        />
                        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-5 sm:p-6">
                          {!signature && <span className="text-[11px] font-extrabold tracking-[0.18em] text-white/45">{String(packageIndex + 1).padStart(2, "0")}</span>}
                          {featured && <span className="rounded-full bg-[#E30B1D] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.11em] text-white">Most popular</span>}
                        </div>
                      </div>
                      <div
                        className={`relative flex flex-1 flex-col p-6 sm:p-8 lg:min-h-full lg:p-9 ${
                          signature
                            ? "min-h-[36rem] justify-end bg-[linear-gradient(180deg,transparent_32%,rgba(16,1,4,0.2)_50%,rgba(16,1,4,0.98)_88%)] sm:min-h-[34rem]"
                            : "justify-between bg-[linear-gradient(145deg,#050505_0%,#170308_58%,#6f0715_145%)] lg:bg-[linear-gradient(180deg,transparent_25%,rgba(16,1,4,0.42)_50%,rgba(16,1,4,0.98)_82%)] lg:pt-72"
                        }`}
                      >
                        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E30B1D]/18 blur-3xl" aria-hidden="true" />
                        <div className="relative">
                        {signature && <p className="mb-4 text-[11px] font-extrabold tracking-[0.18em] text-white/75">{String(packageIndex + 1).padStart(2, "0")}</p>}
                        {!signature && <p className="mt-8 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#ff6875]">{pkg.tagline}</p>}
                        <h3 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-none tracking-[-0.045em]">{pkg.name.replace(" Package", "")}</h3>
                        {signature && <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#ff6875]">{pkg.tagline}</p>}
                        <p className="mt-5 max-w-md text-sm leading-7 text-white/60">{pkg.description}</p>
                        </div>
                        <Link href={`/packages/${pkg.id}`} className="relative mt-8 inline-flex w-fit items-center gap-2 text-sm font-extrabold text-white transition-colors hover:text-[#ff6875]">
                          View full package
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-col p-6 sm:p-8 lg:p-9">
                      <div className="flex items-center justify-between gap-4 border-b border-[#010101]/10 pb-5">
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E30B1D]">Everything included</p>
                          <p className="mt-1 text-sm font-bold text-[#010101]/45">{pkg.features.length} coordinated services</p>
                        </div>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E30B1D]/8 text-[#E30B1D]">
                          <Check className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
                        </span>
                      </div>

                      <div className="mt-6 grid gap-x-7 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
                        {pkg.features.map((feature) => {
                          const { title, detail } = featureParts(feature);
                          return (
                            <div key={feature} className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E30B1D] text-white">
                                <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-extrabold leading-5 text-[#010101]">{title}</p>
                                {detail && <p className="mt-1 text-xs leading-5 text-[#010101]/48">{detail}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-8 flex items-center gap-2 border-t border-[#010101]/10 pt-5 text-xs font-bold text-[#010101]/48">
                        <SlidersHorizontal className="h-4 w-4 shrink-0 text-[#E30B1D]" aria-hidden="true" />
                        Every package can be customized for your celebration.
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col justify-between gap-6 rounded-2xl border border-[#E30B1D]/20 bg-[#E30B1D]/[0.035] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-lg font-extrabold tracking-[-0.025em]">Want a combination that is completely yours?</p>
            <p className="mt-2 text-sm leading-6 text-[#010101]/55">Build a custom Baraat package around your venue, guest count and entry vision.</p>
          </div>
          <Link href="/packages#customize" className="inline-flex min-h-12 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-[#E30B1D] px-6 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-[#010101]">
            Customize a Package
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
