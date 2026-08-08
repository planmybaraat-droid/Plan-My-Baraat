"use client";

import { ArrowUpRight, MessageCircle, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

interface ConsultationFormProps {
  onSent?: () => void;
}

export default function ConsultationForm({ onSent }: ConsultationFormProps) {
  const [sent, setSent] = useState(false);

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
    onSent?.();
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E30B1D]/10 text-[#E30B1D]">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-base font-extrabold tracking-[-0.02em]">Sent on WhatsApp!</p>
        <p className="max-w-xs text-sm leading-6 text-[#010101]/55">
          Our team will get back to you shortly with availability and package options.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
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
  );
}
