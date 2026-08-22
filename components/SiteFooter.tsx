import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
} from "lucide-react";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/baraat-planning-guide", label: "Planning Guide" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact Us" },
];

const PACKAGE_LINKS = [
  { href: "/packages", label: "Signature Offering Package" },
  { href: "/downloads/planmybaraat-signature-package.pdf", label: "Download Package PDF" },
  { href: "/packages#customize", label: "Customize a Package" },
];

interface SiteFooterProps {
  variant?: "default" | "contact";
}

export default function SiteFooter({ variant = "default" }: SiteFooterProps) {
  const contactVariant = variant === "contact";

  if (contactVariant) {
    return (
      <footer className="relative bg-white text-[#010101] shadow-[0_-6px_20px_-18px_rgba(1,1,1,0.18)]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.7fr_0.7fr_1fr] lg:gap-10">
            <div className="max-w-md sm:col-span-2 lg:col-span-1">
              <Image
                src="/logo.png"
                alt="Plan My Baraat"
                width={207}
                height={56}
                className="h-12 w-auto object-contain sm:h-14"
              />
              <h2 className="mt-7 max-w-sm text-2xl font-extrabold leading-tight tracking-[-0.035em] sm:text-3xl">
                Your Baraat, planned with precision.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-[#010101]/55">
                Specialist planning and management for the groom&apos;s grand
                entrance—from the first idea to the final celebration.
              </p>

              <div className="mt-7 flex items-center gap-3" aria-label="Social media">
                <a
                  href="https://wa.me/919089081111"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Contact Plan My Baraat on WhatsApp"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                </a>
                <a
                  href="https://www.instagram.com/planmybaraatofficial?igsh=c3BsZGwwYmVyaW1o"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Follow Plan My Baraat on Instagram"
                  title="Instagram"
                >
                  <span className="instagram-brand-icon" aria-hidden="true" />
                </a>
                <a
                  href="https://www.facebook.com/share/1JTGqNsvfx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Follow Plan My Baraat on Facebook"
                  title="Facebook"
                >
                  <span className="text-xl font-extrabold leading-none" aria-hidden="true">
                    f
                  </span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="footer-heading">Explore</h3>
              <ul className="mt-5 space-y-3.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="footer-heading">Packages</h3>
              <ul className="mt-5 space-y-3.5">
                {PACKAGE_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="footer-heading">Contact</h3>
              <ul className="mt-5 space-y-4">
                <li>
                  <a
                    href="https://wa.me/919089081111"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-contact-link"
                  >
                    <PhoneCall className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>+91 90890 81111</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:planmybaraat@gmail.com"
                    className="footer-contact-link"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>planmybaraat@gmail.com</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm font-semibold leading-6 text-[#010101]/60">
                  <MapPin
                    className="mt-1 h-4 w-4 shrink-0 text-[#E30B1D]"
                    aria-hidden="true"
                  />
                  <span>
                    Studio 501-502, Broadway Signature,
                    <br />
                    Vadodara, Gujarat - 391110
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#010101]/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-xs font-semibold text-[#010101]/68 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
            <p>© 2026 Plan My Baraat. All rights reserved.</p>
            <a
              href="https://wa.me/919089081111"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 font-bold text-[#010101] transition-colors hover:text-[#E30B1D]"
            >
              Plan your Baraat with us
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <>
      <footer
        className={`border-t ${
          contactVariant
            ? "border-white/10 bg-black text-white/55"
            : "border-black/8 bg-[#F8F4EE] text-black/50"
        }`}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="space-y-4">
            <Image
              src="/logo.png"
              alt="PlanMyBaraat"
              width={185}
              height={50}
              className="h-10 w-auto object-contain sm:h-12"
            />
            <p className="text-xs leading-relaxed">
              Gujarat&apos;s trusted baraat specialists — double-decker DJ trucks, vintage cars,
              dhol, pyro effects, and safa teams, delivered as ready-made royal packages.
            </p>
          </div>

          <div className="space-y-4">
            <h3
              className={`text-[10px] font-bold uppercase tracking-widest ${
                contactVariant ? "text-white" : "text-black"
              }`}
            >
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs transition-colors hover:text-[#E30B1D]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3
              className={`text-[10px] font-bold uppercase tracking-widest ${
                contactVariant ? "text-white" : "text-black"
              }`}
            >
              Packages
            </h3>
            <ul className="space-y-2.5">
              {PACKAGE_LINKS.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-xs transition-colors hover:text-[#E30B1D]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3
              className={`text-[10px] font-bold uppercase tracking-widest ${
                contactVariant ? "text-white" : "text-black"
              }`}
            >
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-xs">
                <PhoneCall className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E30B1D]" />
                <a href="tel:+919089081111" className="transition-colors hover:text-[#E30B1D]">
                  +91 90890 81111
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-xs">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E30B1D]" />
                <a
                  href="https://planmybaraat.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#E30B1D]"
                >
                  planmybaraat.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-xs">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E30B1D]" />
                <span>Vadodara, Gujarat - 391110</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`border-t py-6 text-center ${
            contactVariant ? "border-white/10" : "border-black/10"
          }`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest">
            © 2026 PlanMyBaraat Corp • Delhi • Mumbai • Ahmedabad • Surat • Vadodara • Bangalore
          </p>
        </div>
      </footer>
    </>
  );
}
