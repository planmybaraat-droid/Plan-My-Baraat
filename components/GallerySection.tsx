import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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

export default function GallerySection() {
  return (
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
  );
}
