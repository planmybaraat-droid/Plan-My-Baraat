"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Heart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SiteHeaderProps {
  wishlistCount?: number;
  onWishlistClick?: () => void;
  variant?: "default" | "contact";
}

const NAV_ITEMS = [
  { href: "/", label: "Home", sectionId: "home", pageHref: "/" },
  { href: "/packages", label: "Packages", sectionId: "packages", pageHref: "/packages" },
  { href: "/compare-packages", label: "Compare Packages", sectionId: "compare-packages", pageHref: "/compare-packages" },
  { href: "/#about", label: "About Us", sectionId: "about", pageHref: "/about" },
  { href: "/gallery", label: "Gallery", sectionId: "gallery", pageHref: "/gallery" },
  { href: "/#testimonials", label: "Testimonials", sectionId: "testimonials", pageHref: "/testimonials" },
  { href: "/#contact", label: "Contact Us", sectionId: "contact", pageHref: "/contact" },
];

const BOOKING_URL =
  "https://wa.me/919089081111?text=Hello%20Plan%20My%20Baraat%2C%20I%20would%20like%20to%20check%20availability%20and%20book%20a%20Baraat%20package.";

export default function SiteHeader({
  wishlistCount = 0,
  onWishlistClick,
  variant = "default",
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsCompact(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-black/8 shadow-sm backdrop-blur-md transition-all duration-300 ${
        variant === "contact" ? "bg-white/95" : "bg-[rgba(248,244,238,0.95)]"
      } ${
        isCompact ? "shadow-md" : ""
      }`}
    >
      <div className="h-[3px] bg-[#E30B1D]" />
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          isCompact ? "h-16" : "h-20"
        }`}
      >
        <Link href="/" className="flex cursor-pointer select-none flex-col items-start gap-0.5">
          <Image
            src="/logo.png"
            alt="PlanMyBaraat"
            width={170}
            height={46}
            className={`w-auto object-contain transition-all duration-300 ${
              isCompact ? "h-8" : "h-10"
            }`}
            priority
          />
          <span
            className={`font-bold uppercase leading-tight tracking-widest text-black transition-all duration-300 ${
              isCompact ? "text-[9px]" : "text-[10px]"
            }`}
          >
            Managed by Ronak
          </span>
          <span className="text-[9px] font-semibold uppercase leading-tight tracking-widest text-black/65 transition-all duration-300">
            CEO &amp; Director, Safawala.com
          </span>
        </Link>

        <nav className="hidden items-center lg:flex">
          {NAV_ITEMS.map((item) => {
            const active =
              item.pageHref === "/"
                ? pathname === "/"
                : pathname.startsWith(item.pageHref);

            return (
              <Link
                key={item.label}
                href={item.pageHref}
                className={`group relative px-2.5 py-2 text-[11px] font-bold uppercase tracking-[0.13em] transition-all duration-200 xl:px-4 xl:text-xs xl:tracking-[0.15em] ${
                  active
                    ? "text-[#E30B1D]"
                    : "text-black/50 hover:text-black"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-1 left-2.5 right-2.5 h-[2px] origin-left bg-[#E30B1D] transition-transform duration-300 xl:left-4 xl:right-4 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {onWishlistClick ? (
            <button
              onClick={onWishlistClick}
              className="relative rounded-full border border-black/10 p-3 text-black/70 transition-all hover:border-[#E30B1D]/20 hover:text-[#E30B1D]"
              title="View Shortlist"
            >
              <Heart
                className={`h-4.5 w-4.5 ${wishlistCount > 0 ? "fill-[#E30B1D] text-[#E30B1D]" : ""}`}
              />
              {wishlistCount > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 flex h-5.5 w-5.5 items-center justify-center rounded-full border-2 border-[#F8F4EE] bg-[#E30B1D] text-[10px] font-black text-white">
                  {wishlistCount}
                </span>
              ) : null}
            </button>
          ) : null}

          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden min-h-11 items-center justify-center gap-4 rounded-md bg-[#E30B1D] px-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white shadow-[0_8px_20px_rgba(227,11,29,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#010101] hover:shadow-[0_10px_24px_rgba(1,1,1,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E30B1D] focus-visible:ring-offset-2 sm:inline-flex"
            aria-label="Book your Baraat package on WhatsApp"
          >
            Book Now
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>

          <button
            onClick={() => setMobileOpen((value) => !value)}
            className="rounded-full border border-black/10 p-3 text-black/70 transition-all hover:border-[#E30B1D]/20 hover:text-[#E30B1D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E30B1D] focus-visible:ring-offset-2 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          className={`border-t border-black/8 lg:hidden ${
            variant === "contact" ? "bg-white" : "bg-[#F8F4EE]"
          }`}
        >
          <div className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const active =
                item.pageHref === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.pageHref);

              return (
                <Link
                  key={item.label}
                  href={item.pageHref}
                  onClick={() => setMobileOpen(false)}
                  className={`border-b border-black/5 px-6 py-4 text-xs font-bold uppercase tracking-[0.13em] transition-colors ${
                    active ? "text-[#E30B1D]" : "text-black/60 hover:text-[#E30B1D]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="m-4 inline-flex min-h-12 items-center justify-center gap-4 rounded-md bg-[#E30B1D] px-5 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#010101] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E30B1D] focus-visible:ring-offset-2 sm:hidden"
              aria-label="Book your Baraat package on WhatsApp"
            >
              Book Now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
