"use client";

import Image from "next/image";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import ConsultationForm from "@/components/ConsultationForm";

export default function HomeWelcomePopup() {
  const [open, setOpen] = useState(false);

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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-[#010101]/72 p-3 backdrop-blur-sm home-welcome-overlay sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-popup-heading"
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <div className="home-welcome-panel relative my-4 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-[0_40px_90px_-30px_rgba(1,1,1,0.65)] sm:my-8 sm:rounded-3xl">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-sm transition-colors hover:bg-white/22 sm:right-4 sm:top-4 sm:h-9 sm:w-9"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="relative overflow-hidden bg-[#010101] px-5 pb-6 pt-7 text-white sm:px-8 sm:pb-8 sm:pt-10">
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#E30B1D]/25 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-14 bottom-0 h-40 w-40 rounded-full bg-[#E30B1D]/15 blur-3xl" aria-hidden="true" />

          <div className="relative flex flex-col items-start">
            <span className="flex items-center rounded-lg bg-white px-2.5 py-1.5 sm:px-3 sm:py-2">
              <Image src="/logo.png" alt="Plan My Baraat" width={168} height={40} className="h-5 w-auto object-contain sm:h-6" />
            </span>

            <div className="mt-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.14em] text-white/80 sm:mt-7 sm:px-3 sm:py-1.5 sm:text-[9px]">
              <Sparkles className="h-3 w-3 text-[#E30B1D]" aria-hidden="true" />
              Welcome to Plan My Baraat
            </div>

            <h2 id="welcome-popup-heading" className="mt-3 max-w-sm text-[clamp(1.3rem,5vw,2.05rem)] font-extrabold leading-[1.2] tracking-[-0.035em] sm:mt-5">
              Let&apos;s plan a Baraat your guests won&apos;t forget.
            </h2>
            <p className="mt-2.5 max-w-sm text-xs leading-5 text-white/60 sm:mt-4 sm:text-sm sm:leading-6">
              Share a few details and our specialists will reach out on WhatsApp with priority availability for your wedding date.
            </p>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-8 sm:py-9">
          <ConsultationForm onSent={() => window.setTimeout(() => setOpen(false), 1400)} />
        </div>
      </div>
    </div>
  );
}
