import Image from "next/image";

interface InnerPageHeroProps {
  eyebrow: string;
  title: string;
  lead: string;
  description: string;
}

export default function InnerPageHero({
  eyebrow,
  title,
  lead,
  description,
}: InnerPageHeroProps) {
  return (
    <section className="contact-hero inner-page-hero">
      <Image
        src="/Assests/1000096854.png"
        alt="Premium groom entry during a Plan My Baraat celebration"
        fill
        priority
        sizes="100vw"
        className="contact-hero-image"
      />
      <div className="contact-hero-overlay" aria-hidden="true" />

      <div className="inner-page-hero-shell relative z-10 mx-auto flex h-full max-w-7xl items-center px-5 sm:px-8 lg:px-10">
        <div className="w-full max-w-6xl">
          <div className="hero-label-row mb-5 sm:mb-7">
            <span className="hero-label-line" aria-hidden="true" />
            <p className="inner-page-hero-eyebrow text-[10px] font-extrabold uppercase text-white sm:text-[11px]">
              {eyebrow}
            </p>
          </div>

          <h1 className="inner-page-hero-title max-w-5xl text-[clamp(2.5rem,6vw,5.35rem)] font-extrabold leading-[0.96] text-white">
            {title}
          </h1>

          <div className="mt-6 grid max-w-4xl gap-3 border-l-2 border-[#E30B1D] pl-5 sm:mt-8 sm:grid-cols-[0.75fr_1.25fr] sm:gap-8 sm:pl-7">
            <p className="text-base font-bold leading-6 text-white sm:text-lg sm:leading-7">
              {lead}
            </p>
            <p className="max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
