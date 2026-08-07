import type { Metadata } from "next";

import PublicHeader from "./PublicHeader";

interface PublicContentPageProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
  ctaLabel?: string;
  ctaHref?: string;
}

export function buildSimpleMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function PublicContentPage({
  eyebrow,
  title,
  description,
  sections,
  ctaLabel = "Start on WhatsApp",
  ctaHref = "https://wa.me/919089081111",
}: PublicContentPageProps) {
  return (
    <main className="min-h-screen bg-[#fcfbf9] text-stone-900">
      <PublicHeader />
      <section className="border-b border-stone-200 bg-[#F8F4EE]">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-stone-950 sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-stone-700">
            {description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 lg:px-10">
        <div className="space-y-10">
          {sections.map((section) => (
            <div
              key={section.heading}
              className="rounded-[28px] border border-stone-200 bg-[#F8F4EE] p-7 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-stone-950">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-stone-700">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            {ctaLabel}
          </a>
        </div>
      </section>
    </main>
  );
}
