"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Images,
  MessageCircle,
  Play,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import Reveal from "@/components/Reveal";
import InnerPageHero from "@/components/InnerPageHero";
import { GALLERY_VIDEOS, type GalleryVideo } from "@/lib/siteContent";

const GALLERY_MOMENTS = [
  {
    src: "/Assests/1000096845.jpg.jpeg",
    title: "A Royal Arrival",
    category: "Horse Entry",
    alt: "Groom making a royal Baraat entrance on a decorated white horse",
    width: 1080,
    height: 1080,
    position: "object-center",
  },
  {
    src: "/Assests/1000096846.png",
    title: "The Name in Lights",
    category: "Custom DJ Entry",
    alt: "Groom posing in front of a personalised illuminated Baraat sign",
    width: 1122,
    height: 1402,
    position: "object-center",
  },
  {
    src: "/Assests/1000096847.png",
    title: "Her Baraat Moment",
    category: "Celebration",
    alt: "Bride celebrating in front of a personalised illuminated Baraat sign",
    width: 1086,
    height: 1448,
    position: "object-center",
  },
  {
    src: "/Assests/1000096848.png",
    title: "Every Beat, Together",
    category: "Dhol Team",
    alt: "Colourfully dressed dhol players leading a daytime Baraat",
    width: 1085,
    height: 1450,
    position: "object-center",
  },
  {
    src: "/Assests/1000096849.png",
    title: "Under the Royal Chhatri",
    category: "Groom Entry",
    alt: "Smiling groom arriving beneath a traditional red royal Chhatri",
    width: 1537,
    height: 1023,
    position: "object-center",
  },
  {
    src: "/Assests/1000096850.png",
    title: "Vintage, Reimagined",
    category: "Vintage Car",
    alt: "Groom posing beside a cream vintage Baraat car",
    width: 1122,
    height: 1402,
    position: "object-center",
  },
  {
    src: "/Assests/1000096851.png",
    title: "Colour in the Air",
    category: "Day Baraat",
    alt: "Groom celebrating with clouds of colourful smoke in the air",
    width: 1024,
    height: 1536,
    position: "object-center",
  },
  {
    src: "/Assests/1000096852.png",
    title: "Baraat on Wheels",
    category: "DJ Truck",
    alt: "Groom celebrating in front of a personalised Baraat DJ truck",
    width: 1086,
    height: 1448,
    position: "object-center",
  },
  {
    src: "/Assests/1000096853.png",
    title: "A Floral Horse Entry",
    category: "Horse Baraat",
    alt: "Groom arriving on a horse decorated with pink floral details",
    width: 929,
    height: 1693,
    position: "object-center",
  },
  {
    src: "/Assests/1000096854.png",
    title: "In the Heart of It All",
    category: "Family Moments",
    alt: "Groom dancing among family and friends beneath decorative Chhatris",
    width: 1586,
    height: 992,
    position: "object-center",
  },
  {
    src: "/Assests/1000096855.png",
    title: "Made for Their Baraat",
    category: "Custom Production",
    alt: "Couple posing beside a personalised floral Baraat installation",
    width: 1024,
    height: 1535,
    position: "object-center",
  },
  {
    src: "/Assests/1000096856.png",
    title: "A Night to Remember",
    category: "Grand Finale",
    alt: "Groom celebrating on a flower-covered car beneath fireworks and confetti",
    width: 1122,
    height: 1402,
    position: "object-center",
  },
  {
    src: "/Gallery/vibrant-indian-wedding-at-leonards-palazzo-in-new-york-new_1159915-scaled.avif",
    title: "Tradition in Colour",
    category: "From the Archive",
    alt: "Groom celebrating on horseback amid colourful powder during a Baraat",
    width: 2560,
    height: 1707,
    position: "object-center",
  },
] as const;

type GalleryTab = "photos" | "videos";

export default function GalleryClient() {
  const [tab, setTab] = useState<GalleryTab>("photos");
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<GalleryVideo | null>(null);

  useEffect(() => {
    if (activePhoto === null && !activeVideo) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePhoto(null);
        setActiveVideo(null);
      }
      if (activePhoto !== null && event.key === "ArrowLeft") {
        setActivePhoto(
          (activePhoto - 1 + GALLERY_MOMENTS.length) % GALLERY_MOMENTS.length,
        );
      }
      if (activePhoto !== null && event.key === "ArrowRight") {
        setActivePhoto((activePhoto + 1) % GALLERY_MOMENTS.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhoto, activeVideo]);

  const showPreviousPhoto = () => {
    if (activePhoto === null) return;
    setActivePhoto(
      (activePhoto - 1 + GALLERY_MOMENTS.length) % GALLERY_MOMENTS.length,
    );
  };

  const showNextPhoto = () => {
    if (activePhoto === null) return;
    setActivePhoto((activePhoto + 1) % GALLERY_MOMENTS.length);
  };

  return (
    <main className="gallery-content">
      <InnerPageHero
        eyebrow="Our work in motion"
        title="Gallery."
        lead="Real moments. Thoughtfully planned."
        description="Step inside celebrations where every light, beat, entry and family moment came together with purpose."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <Reveal>
            <div className="grid items-end gap-8 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
              <div className="max-w-2xl">
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                  Inside every celebration
                </p>
                <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-0.04em]">
                  Every frame has a story behind it.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-[#010101]/58 sm:text-base sm:leading-8">
                From the first safa to the final dhol beat, these are real
                Baraats shaped by careful coordination—and enjoyed without the
                family having to manage the details.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid border-y border-[#010101]/10 sm:grid-cols-3">
            {[
              ["500+", "Baraats coordinated"],
              ["6", "Major cities served"],
              ["One team", "From planning to entry"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`py-6 sm:px-7 sm:py-8 ${
                  index > 0
                    ? "border-t border-[#010101]/10 sm:border-l sm:border-t-0"
                    : ""
                }`}
              >
                <p className="text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
                  {value}
                </p>
                <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#010101]/45">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="gallery-collection"
        className="border-y border-[#010101]/10 bg-white"
      >
        <div className="mx-auto w-full max-w-[96rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mb-10 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                The celebration archive
              </p>
              <h2 className="text-[clamp(1.85rem,4vw,2.35rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
                Moments worth remembering.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#010101]/55 sm:text-base sm:leading-7">
                Browse real entries, joyful processions and the details that
                turn a Baraat into a story worth reliving.
              </p>
            </div>

            <div
              className="grid w-full grid-cols-2 rounded-xl border border-[#010101]/10 p-1 sm:w-auto"
              role="tablist"
              aria-label="Gallery media"
            >
              <button
                type="button"
                role="tab"
                aria-selected={tab === "photos"}
                aria-controls="photos-panel"
                onClick={() => setTab("photos")}
                className={`min-h-11 rounded-lg px-5 text-[10px] font-extrabold uppercase tracking-[0.12em] transition-colors ${
                  tab === "photos"
                    ? "bg-[#E30B1D] text-white"
                    : "bg-white text-[#010101]/55 hover:text-[#E30B1D]"
                }`}
              >
                Photos · {GALLERY_MOMENTS.length}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "videos"}
                aria-controls="videos-panel"
                onClick={() => setTab("videos")}
                className={`min-h-11 rounded-lg px-5 text-[10px] font-extrabold uppercase tracking-[0.12em] transition-colors ${
                  tab === "videos"
                    ? "bg-[#E30B1D] text-white"
                    : "bg-white text-[#010101]/55 hover:text-[#E30B1D]"
                }`}
              >
                Films · {GALLERY_VIDEOS.length}
              </button>
            </div>
          </div>

          {tab === "photos" ? (
            <div
              id="photos-panel"
              role="tabpanel"
              className="w-full columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4"
            >
              {GALLERY_MOMENTS.map((moment, index) => (
                <button
                  key={`${moment.src}-${moment.title}`}
                  type="button"
                  onClick={() => setActivePhoto(index)}
                  className="gallery-moment group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl bg-[#010101]/5 text-left sm:mb-4"
                  aria-label={`Open photo: ${moment.title}`}
                >
                  <Image
                    src={moment.src}
                    alt={moment.alt}
                    width={moment.width}
                    height={moment.height}
                    sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                    className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <span
                    className="absolute inset-0 bg-gradient-to-t from-[#010101]/80 via-[#010101]/5 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-5">
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/60">
                      {moment.category}
                    </span>
                    <span className="mt-1 block text-sm font-extrabold tracking-[-0.02em] sm:text-base">
                      {moment.title}
                    </span>
                  </span>
                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-[#010101]/25 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Images className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div
              id="videos-panel"
              role="tabpanel"
              className="grid w-full grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
            >
              {GALLERY_VIDEOS.map((video) => (
                <button
                  key={`${video.src}-${video.label}`}
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  className="gallery-film group relative aspect-[9/16] overflow-hidden rounded-xl bg-[#010101] text-left shadow-[0_18px_50px_rgba(0,0,0,0.10)]"
                  aria-label={`Play film: ${video.label}`}
                >
                  <Image
                    src={video.thumb}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, (max-width: 1535px) 25vw, 20vw"
                    className="object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-85"
                    aria-hidden="true"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#010101]/85 via-transparent to-[#010101]/15" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[#E30B1D] text-white shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
                      <Play className="ml-0.5 h-4 w-4 fill-current sm:h-5 sm:w-5" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-4 text-white sm:p-5">
                    <span>
                      <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/55">
                        Plan My Baraat film
                      </span>
                      <span className="mt-1.5 block text-sm font-extrabold tracking-[-0.02em] sm:text-base">
                        {video.label}
                      </span>
                    </span>
                    <span className="shrink-0 text-[10px] font-bold text-white/65">
                      {video.duration}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#010101] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-9 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1fr_auto] lg:px-10">
          <div className="max-w-2xl">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">
              More than beautiful frames
            </p>
            <h2 className="mt-3 text-[clamp(1.65rem,4vw,2.5rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
              Every grand moment begins with calm coordination.
            </h2>
          </div>
          <Link
            href="/testimonials"
            className="inline-flex min-h-12 w-fit items-center gap-3 rounded-xl border border-white/20 px-6 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#010101]"
          >
            Read client stories
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-[#E30B1D]/20 bg-[#E30B1D]/[0.035] p-6 sm:p-10 lg:p-14">
              <div className="relative z-10 grid items-end gap-8 xl:grid-cols-[1fr_auto] xl:gap-10">
                <div>
                  <p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
                    Your celebration belongs here
                  </p>
                  <h2 className="max-w-3xl text-[clamp(1.8rem,4.3vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">
                    Ready to Create Your Grand Baraat?
                  </h2>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-[#010101]/55 sm:text-base">
                    Tell us how you imagine the groom&apos;s entrance. We&apos;ll
                    help plan every detail around it.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href="https://wa.me/919089081111"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E30B1D] px-4 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#010101] sm:gap-2.5 sm:px-6 sm:text-xs sm:tracking-[0.1em]"
                  >
                    <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
                    Chat on WhatsApp
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#010101]/20 bg-white px-4 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#010101] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#010101] hover:bg-[#010101] hover:text-white sm:gap-2.5 sm:px-6 sm:text-xs sm:tracking-[0.1em]"
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

      {activePhoto !== null ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#010101]/95 p-3 backdrop-blur-md sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${GALLERY_MOMENTS[activePhoto].title} photo viewer`}
          onClick={() => setActivePhoto(null)}
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#010101]/60 text-white transition-colors hover:bg-[#E30B1D] sm:right-6 sm:top-6"
            aria-label="Close photo viewer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <div
            className="relative flex h-[82vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-[#010101]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-0 flex-1">
              <Image
                src={GALLERY_MOMENTS[activePhoto].src}
                alt={GALLERY_MOMENTS[activePhoto].alt}
                fill
                sizes="95vw"
                className={`object-contain ${GALLERY_MOMENTS[activePhoto].position}`}
                priority
              />
              <button
                type="button"
                onClick={showPreviousPhoto}
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#010101]/55 text-white transition-colors hover:bg-[#E30B1D] sm:left-5"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={showNextPhoto}
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#010101]/55 text-white transition-colors hover:bg-[#E30B1D] sm:right-5"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex items-end justify-between gap-5 border-t border-white/10 px-5 py-4 text-white sm:px-7">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white">
                  {GALLERY_MOMENTS[activePhoto].category}
                </p>
                <p className="mt-1 text-sm font-extrabold sm:text-base">
                  {GALLERY_MOMENTS[activePhoto].title}
                </p>
              </div>
              <p className="shrink-0 text-xs font-bold text-white/45">
                {String(activePhoto + 1).padStart(2, "0")} /{" "}
                {String(GALLERY_MOMENTS.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {activeVideo ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#010101]/95 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeVideo.label} video player`}
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative h-[88vh] max-h-[56rem] aspect-[9/16] overflow-hidden rounded-xl bg-[#010101] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#010101]/65 text-white transition-colors hover:bg-[#E30B1D]"
              aria-label="Close video player"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <video
              key={activeVideo.src}
              src={activeVideo.src}
              poster={activeVideo.thumb}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            >
              Your browser does not support the video element.
            </video>
          </div>
        </div>
      ) : null}
    </main>
  );
}
