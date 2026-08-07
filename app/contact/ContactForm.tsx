"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import { FormEvent, useState } from "react";

const WHATSAPP_NUMBER = "919089081111";

type FormStatus = {
  type: "idle" | "error";
  message: string;
};

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const city = String(data.get("city") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const phoneDigits = phone.replace(/\D/g, "");

    if (!name || phoneDigits.length < 10) {
      setStatus({
        type: "error",
        message: "Please enter your name and a valid mobile number.",
      });
      return;
    }

    const whatsappMessage = `Hello Plan My Baraat,

I would like to get in touch regarding your Baraat Planning services.

Name:
${name}

Mobile:
${phone}

Email:
${email || "Not provided"}

City:
${city || "Not provided"}

Subject:
${subject || "General enquiry"}

Message:
${message || "I would like to know more about your Baraat Planning services."}

Please contact me when convenient.

Thank you.`;

    setStatus({ type: "idle", message: "" });
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      whatsappMessage,
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#E30B1D] sm:text-[11px]">
            Start a conversation
          </p>
          <h2 className="text-[1.4rem] font-extrabold leading-tight tracking-[-0.025em] text-[#010101] sm:text-3xl">
            Tell us how we can help.
          </h2>
        </div>
        <span
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#010101] text-white sm:flex"
          aria-hidden="true"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
        </span>
      </div>

      <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <div className="contact-field">
          <label htmlFor="contact-name">
            Full Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-phone">
            Mobile Number <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-email">
            Email Address <span className="font-normal text-[#010101]/40">(Optional)</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-city">City</label>
          <input
            id="contact-city"
            name="city"
            type="text"
            autoComplete="address-level2"
            placeholder="Your city"
          />
        </div>

        <div className="contact-field sm:col-span-2">
          <label htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="How can we help?"
          />
        </div>

        <div className="contact-field sm:col-span-2">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            placeholder="Share a few details about your Baraat..."
          />
        </div>
      </div>

      <div aria-live="polite" className="min-h-6 pt-2">
        {status.type === "error" ? (
          <p className="text-sm font-semibold text-[#E30B1D]" role="alert">
            {status.message}
          </p>
        ) : null}
      </div>

      <button className="contact-submit" type="submit">
        <span className="flex items-center gap-3">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Send Message on WhatsApp
        </span>
        <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-[#010101]/50">
        Your details are used only to create your WhatsApp message. Nothing is
        saved on this website.
      </p>
    </form>
  );
}
