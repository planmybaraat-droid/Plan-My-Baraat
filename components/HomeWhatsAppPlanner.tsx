"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import { FormEvent } from "react";

export default function HomeWhatsAppPlanner() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const mobile = String(form.get("mobile") || "").trim();
    const city = String(form.get("city") || "").trim();
    const weddingDate = String(form.get("weddingDate") || "").trim();
    const interest = String(form.get("interest") || "").trim();
    const requirements = String(form.get("requirements") || "").trim();

    const message = [
      "Hello Plan My Baraat,",
      "",
      "I would like to plan a premium Baraat experience.",
      "",
      `Name: ${name}`,
      `Mobile: ${mobile}`,
      `Wedding City: ${city || "Not specified"}`,
      `Wedding Date: ${weddingDate || "Not specified"}`,
      `Interested In: ${interest}`,
      `Requirements: ${requirements || "Please help me choose the right package."}`,
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="home-planner-field">
          <span>Full Name *</span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Your full name"
          />
        </label>
        <label className="home-planner-field">
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
        <label className="home-planner-field">
          <span>Wedding City</span>
          <input
            type="text"
            name="city"
            autoComplete="address-level2"
            placeholder="Vadodara, Ahmedabad..."
          />
        </label>
        <label className="home-planner-field">
          <span>Wedding Date</span>
          <input type="date" name="weddingDate" />
        </label>
      </div>

      <label className="home-planner-field">
        <span>What are you looking for?</span>
        <select name="interest" defaultValue="Help me choose a package">
          <option>Help me choose a package</option>
          <option>Signature Offering</option>
          <option>DJ Truck / Baraat on Wheels</option>
          <option>Vintage Car Groom Entry</option>
        </select>
      </label>

      <label className="home-planner-field">
        <span>Your Baraat Vision</span>
        <textarea
          name="requirements"
          rows={3}
          placeholder="Guest count, venue, route, entry idea or any special requirement"
        />
      </label>

      <button type="submit" className="home-planner-submit">
        <span className="inline-flex min-w-0 items-center gap-2.5">
          <MessageCircle className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
          <span className="min-[360px]:hidden">Send Inquiry</span>
          <span className="hidden min-[360px]:inline">
            Submit Inquiry
          </span>
        </span>
        <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
      </button>
    </form>
  );
}
