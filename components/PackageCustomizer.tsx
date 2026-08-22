"use client";

import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { FormEvent, useState } from "react";

const CUSTOM_OPTIONS = [
  "Double-Decker DJ Truck",
  "Custom Truck Branding",
  "Professional DJ Artist",
  "Punjabi Dhol Team",
  "Premium Chhatri Lights",
  "Vintage Car / Baggi",
  "Safa Team",
  "Moving LED Panels",
  "Groom Name LED Letters",
  "CO2 & Confetti Effects",
  "Hand Pyro Effects",
  "Professional Bouncers",
  "Entertainer Artist",
] as const;

export default function PackageCustomizer() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    setSelectedOptions((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const mobile = String(form.get("mobile") || "").trim();
    const city = String(form.get("city") || "").trim();
    const weddingDate = String(form.get("weddingDate") || "").trim();
    const startingPackage = String(form.get("startingPackage") || "").trim();
    const notes = String(form.get("notes") || "").trim();

    const message = [
      "Hello Plan My Baraat,",
      "",
      "I would like to customize a Baraat package.",
      "",
      `Name: ${name}`,
      `Mobile: ${mobile}`,
      `City: ${city || "Not specified"}`,
      `Wedding Date: ${weddingDate || "Not specified"}`,
      `Starting Package: ${startingPackage}`,
      "",
      "Services I am interested in:",
      selectedOptions.length
        ? selectedOptions.map((option) => `• ${option}`).join("\n")
        : "Please help me choose the right services.",
      "",
      `Additional Requirements: ${notes || "None"}`,
      "",
      "Please share the suitable custom package and availability.",
      "",
      "Thank you.",
    ].join("\n");

    window.open(
      `https://wa.me/919089081111?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="contact-field">
          <span>Full Name *</span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Your full name"
          />
        </label>
        <label className="contact-field">
          <span>Mobile Number *</span>
          <input
            type="tel"
            name="mobile"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="+91 98765 43210"
          />
        </label>
        <label className="contact-field">
          <span>Wedding City</span>
          <input
            type="text"
            name="city"
            autoComplete="address-level2"
            placeholder="Vadodara, Ahmedabad..."
          />
        </label>
        <label className="contact-field">
          <span>Wedding Date</span>
          <input type="date" name="weddingDate" />
        </label>
      </div>

      <label className="block">
        <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.06em]">
          Starting Package
        </span>
        <select
          name="startingPackage"
          defaultValue="Help me choose"
          className="mt-2.5 w-full border-0 border-b border-[#010101]/20 bg-white py-3 text-sm text-[#010101] outline-none transition-colors focus:border-[#E30B1D]"
        >
          <option>Help me choose</option>
          <option>Signature Offering</option>
          <option>Build from scratch</option>
        </select>
      </label>

      <fieldset>
        <legend className="text-[0.72rem] font-extrabold uppercase tracking-[0.06em]">
          Select Your Baraat Elements
        </legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {CUSTOM_OPTIONS.map((option) => {
            const selected = selectedOptions.includes(option);
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleOption(option)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-left text-[11px] font-bold leading-4 transition-all ${
                  selected
                    ? "border-[#E30B1D] bg-[#E30B1D] text-white"
                    : "border-[#010101]/12 bg-white text-[#010101]/60 hover:border-[#E30B1D]/40 hover:text-[#E30B1D]"
                }`}
              >
                {selected ? (
                  <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                ) : null}
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="contact-field">
        <span>Additional Requirements</span>
        <textarea
          name="notes"
          rows={4}
          placeholder="Guest count, route, theme, entry idea or any special request"
        />
      </label>

      <button type="submit" className="contact-submit">
        <span className="inline-flex items-center gap-2.5">
          <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
          <span className="min-[360px]:hidden">Send on WhatsApp</span>
          <span className="hidden min-[360px]:inline">
            Send Custom Package on WhatsApp
          </span>
        </span>
        <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
      </button>

      <p className="text-xs leading-5 text-[#010101]/42">
        Your selections open directly in WhatsApp. Nothing is submitted to a
        database.
      </p>
    </form>
  );
}
