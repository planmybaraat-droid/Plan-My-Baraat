import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import InnerPageHero from "@/components/InnerPageHero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { ALL_BARAAT_LOCATIONS, BARAAT_CITIES, BARAAT_TOWNS } from "@/lib/data/baraatLocations";
import { BARAAT_CITY_CONTENT } from "@/lib/data/baraatCityContent";

export const metadata: Metadata = {
  title: "Baraat Service Areas in Gujarat",
  description:
    "Find Plan My Baraat service areas across Gujarat, including city, neighbourhood and destination pages with locally relevant planning guidance.",
  alternates: { canonical: "/service-areas" },
};

const available = new Set(Object.keys(BARAAT_CITY_CONTENT));

export default function ServiceAreasPage() {
  const cities = BARAAT_CITIES.filter((city) => available.has(city.slug));
  const towns = BARAAT_TOWNS.filter((town) => available.has(town.slug));

  return (
    <div className="inner-public-page min-h-screen bg-white font-sans text-[#010101]">
      <SiteHeader variant="contact" />
      <main>
        <InnerPageHero
          eyebrow="Local planning coverage"
          title="Baraat service areas."
          lead="One specialist team. Local route awareness."
          description="Choose your city or locality to see planning guidance for Baraat routes, venue coordination, package inclusions and enquiry."
        />

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cities.map((city) => {
              const areas = ALL_BARAAT_LOCATIONS.filter(
                (location) => location.parentCity === city.slug && available.has(location.slug),
              );
              return (
                <article key={city.slug} className="rounded-2xl border border-[#010101]/10 bg-[#F8F7F4] p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E30B1D]">
                        {city.state}
                      </p>
                      <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">{city.name}</h2>
                    </div>
                    <MapPin className="h-5 w-5 text-[#E30B1D]" aria-hidden="true" />
                  </div>
                  <Link href={`/${city.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#E30B1D]">
                    View city planning guide <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  {areas.length ? (
                    <ul className="mt-6 flex flex-wrap gap-2 border-t border-[#010101]/10 pt-5">
                      {areas.map((area) => (
                        <li key={area.slug}>
                          <Link
                            href={`/${area.slug}`}
                            className="inline-flex rounded-full border border-[#010101]/10 bg-white px-3 py-2 text-xs font-bold transition-colors hover:border-[#E30B1D] hover:text-[#E30B1D]"
                          >
                            {area.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              );
            })}
          </div>

          {towns.length ? (
            <section className="mt-14 rounded-2xl border border-[#010101]/10 p-6 sm:p-8">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E30B1D]">More destinations</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">Towns and celebration destinations</h2>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {towns.map((town) => (
                  <li key={town.slug}>
                    <Link
                      href={`/${town.slug}`}
                      className="flex items-center justify-between rounded-xl bg-[#F8F7F4] px-4 py-3 text-sm font-bold transition-colors hover:bg-[#E30B1D] hover:text-white"
                    >
                      {town.name}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </section>
      </main>
      <SiteFooter variant="contact" />
    </div>
  );
}
