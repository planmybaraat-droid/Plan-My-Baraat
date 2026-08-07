"use client";

import { MessageCircle, PartyPopper, X } from "lucide-react";
import confetti from "canvas-confetti";
import { useState } from "react";

import { buildPackageWhatsAppLink } from "@/lib/seoHelpers";
import type { BaraatPackage } from "@/lib/packagesData";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface PackageEnquiryModalProps {
  pkg: BaraatPackage;
  onClose: () => void;
}

export default function PackageEnquiryModal({ pkg, onClose }: PackageEnquiryModalProps) {
  const [name, setName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Please enter your name";
    if (!eventDate) newErrors.eventDate = "Please select your event date";
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("crm_baraat_enquiries").insert([
          {
            customer_name: name.trim(),
            event_date: eventDate,
            mobile: phone.trim(),
            package_name: pkg.name,
            status: "New",
          },
        ]);
        if (error) throw error;
      } catch (error) {
        console.error("Failed to save baraat enquiry to CRM", error);
      }
    } else {
      try {
        const saved = localStorage.getItem("pmb_baraat_enquiries");
        const list = saved ? JSON.parse(saved) : [];
        list.push({
          id: `baraat-${Date.now()}`,
          customer_name: name.trim(),
          event_date: eventDate,
          mobile: phone.trim(),
          package_name: pkg.name,
          status: "New",
          created_at: new Date().toISOString(),
        });
        localStorage.setItem("pmb_baraat_enquiries", JSON.stringify(list));
      } catch (error) {
        console.error("Failed to save baraat enquiry locally", error);
      }
    }

    const link = buildPackageWhatsAppLink(name.trim(), phone.trim(), eventDate, pkg.name);
    window.open(link, "_blank");
    confetti({ particleCount: 60, spread: 40 });
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden border border-[#E70D1D]/15 bg-[#FAF6F0] shadow-2xl rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center border border-black/10 bg-black/5 text-black/60 transition-colors hover:text-[#E70D1D]"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="space-y-5 p-10 text-center flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center border border-[#E70D1D]/25 bg-[#E70D1D]/5 text-[#E70D1D]">
              <PartyPopper className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-2xl font-black text-black tracking-wide">Enquiry Sent!</h3>
            <p className="text-xs leading-relaxed text-black/60 px-4">
              Your enquiry for the <span className="font-bold text-black">{pkg.name} Package</span> has
              been sent on WhatsApp. Our team will get back to you shortly.
            </p>
            <button
              onClick={onClose}
              className="h-11 bg-[#E70D1D] px-8 text-xs font-extrabold uppercase tracking-widest text-white transition-colors hover:bg-[#c40d1a] w-full max-w-[200px]"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 p-8">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E70D1D]">
                Enquire Now
              </span>
              <h3 className="font-serif text-2xl font-black text-black">{pkg.name} Package</h3>
              <p className="text-xs text-black/50 tracking-wide font-sans">
                Share your details and we&apos;ll reach out on WhatsApp.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-black/60">
                Your Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={`w-full border bg-black/[0.03] px-3.5 py-3 text-sm text-black placeholder:text-black/35 focus:border-[#E70D1D] focus:ring-1 focus:ring-[#E70D1D] focus:outline-none transition-all ${
                  errors.name ? "border-red-500 ring-1 ring-red-500" : "border-black/15"
                }`}
              />
              {errors.name ? <span className="text-[10px] text-red-500">{errors.name}</span> : null}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-black/60">
                Event Date *
              </label>
              <input
                type="date"
                value={eventDate}
                min={today}
                onChange={(e) => setEventDate(e.target.value)}
                className={`w-full border bg-black/[0.03] px-3.5 py-3 text-sm text-black focus:border-[#E70D1D] focus:ring-1 focus:ring-[#E70D1D] focus:outline-none transition-all ${
                  errors.eventDate ? "border-red-500 ring-1 ring-red-500" : "border-black/15"
                }`}
              />
              {errors.eventDate ? (
                <span className="text-[10px] text-red-500">{errors.eventDate}</span>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-black/60">
                Phone Number *
              </label>
              <div className="flex items-center gap-2">
                <span className="border border-black/15 bg-black/[0.03] px-3.5 py-3 text-sm font-semibold text-black/60">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9876543210"
                  className={`flex-1 border bg-black/[0.03] px-3.5 py-3 text-sm text-black placeholder:text-black/35 focus:border-[#E70D1D] focus:ring-1 focus:ring-[#E70D1D] focus:outline-none transition-all ${
                    errors.phone ? "border-red-500 ring-1 ring-red-500" : "border-black/15"
                  }`}
                />
              </div>
              {errors.phone ? <span className="text-[10px] text-red-500">{errors.phone}</span> : null}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center gap-2 bg-[#E70D1D] text-xs font-extrabold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#c40d1a] disabled:opacity-60"
            >
              <MessageCircle className="h-4.5 w-4.5 fill-current" />
              {submitting ? "SENDING..." : "SEND ENQUIRY ON WHATSAPP"}
            </button>

            <p className="text-center text-[9px] tracking-wide text-black/40">
              🔒 Your details are safe. We never share your information with third parties.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
