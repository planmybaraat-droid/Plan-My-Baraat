"use client";

import Image from "next/image";
import { ArrowUpRight, MessageCircle, ShieldCheck, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

export default function HomeWelcomePopup() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    // Show on every fresh homepage visit, including a browser refresh.
    const timer = window.setTimeout(() => setOpen(true), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const dismiss = () => {
    setOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const mobile = String(form.get("mobile") || "").trim();
    const city = String(form.get("city") || "").trim();
    const weddingDate = String(form.get("weddingDate") || "").trim();

    const message = [
      "Hello Plan My Baraat,",
      "",
      "I'd like a free Baraat consultation.",
      "",
      `Name: ${name}`,
      `Mobile: ${mobile}`,
      `Wedding City: ${city || "Not specified"}`,
      `Wedding Date: ${weddingDate || "Not specified"}`,
      "",
      "Please share availability and the most suitable package.",
      "",
      "Thank you.",
    ].join("\n");

    window.open(
      `https://wa.me/919089081111?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );

    setSent(true);
    window.setTimeout(() => setOpen(false), 1400);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#010101]/72 p-4 backdrop-blur-sm home-welcome-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-popup-heading"
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <div className="home-welcome-panel relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-[0_40px_90px_-30px_rgba(1,1,1,0.65)]">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-sm transition-colors hover:bg-white/22"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="relative overflow-hidden bg-[#010101] px-6 pb-8 pt-9 text-white sm:px-8 sm:pt-10">
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#E30B1D]/25 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-14 bottom-0 h-40 w-40 rounded-full bg-[#E30B1D]/15 blur-3xl" aria-hidden="true" />

          <div className="relative flex flex-col items-start">
            <span className="flex items-center rounded-lg bg-white px-3 py-2">
              <Image src="/logo.png" alt="Plan My Baraat" width={168} height={40} className="h-6 w-auto object-contain" />
            </span>

            <div className="mt-7 flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/80">
              <Sparkles className="h-3 w-3 text-[#E30B1D]" aria-hidden="true" />
              Welcome to Plan My Baraat
            </div>

            <h2 id="welcome-popup-heading" className="mt-5 max-w-sm text-[clamp(1.55rem,4vw,2.05rem)] font-extrabold leading-[1.2] tracking-[-0.035em]">
              Let&apos;s plan a Baraat your guests won&apos;t forget.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
              Share a few details and our specialists will reach out on WhatsApp with priority availability for your wedding date.
            </p>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-8 sm:py-9">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E30B1D]/10 text-[#E30B1D]">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-base font-extrabold tracking-[-0.02em]">Sent on WhatsApp!</p>
              <p className="max-w-xs text-sm leading-6 text-[#010101]/55">
                Our team will get back to you shortly with availability and package options.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="home-planner-field">
                  <span>Full Name *</span>
                  <input type="text" name="name" required autoComplete="name" placeholder="Your full name" />
                </label>
                <label className="home-planner-field">
                  <span>Mobile Number *</span>
                  <input type="tel" name="mobile" required autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" />
                </label>
                <label className="home-planner-field">
                  <span>Wedding City</span>
                  <input type="text" name="city" autoComplete="address-level2" placeholder="Vadodara, Ahmedabad..." />
                </label>
                <label className="home-planner-field">
                  <span>Wedding Date</span>
                  <input type="date" name="weddingDate" />
                </label>
              </div>

              <button type="submit" className="home-planner-submit">
                <span className="inline-flex min-w-0 items-center gap-2.5">
                  <MessageCircle className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                  Get My Free Consultation
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>

              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#010101]/40">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#E30B1D]/70" aria-hidden="true" />
                No spam, ever. Just one quick WhatsApp reply from our team.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
