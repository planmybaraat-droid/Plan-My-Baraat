import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#fcfbf9]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-stone-950">
          PlanMyBaraat
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-stone-700 transition hover:text-stone-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/crm/login"
          className="rounded-full border border-stone-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-800 transition hover:border-stone-700 hover:bg-[#F8F4EE]"
        >
          CRM Login
        </Link>
      </div>
    </header>
  );
}
