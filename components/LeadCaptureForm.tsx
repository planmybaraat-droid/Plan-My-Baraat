"use client";

import React, { useState } from "react";

import { BARAAT_PACKAGES } from "@/lib/packagesData";
import { buildWhatsAppLink } from "@/lib/seoHelpers";
import { trackMetaEvent } from "@/lib/metaPixel";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface LeadCaptureFormProps {
  variant?: "hero" | "bottom";
  defaultPackage?: string;
  defaultLocation?: string;
  showPackageField?: boolean;
}

export default function LeadCaptureForm({
  variant = "hero",
  defaultPackage = "",
  defaultLocation = "",
  showPackageField = true,
}: LeadCaptureFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState(defaultLocation);
  const [packageInterested, setPackageInterested] = useState(defaultPackage);
  const [requirement, setRequirement] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(false);

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Please enter your name";
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim()))
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    if (!location.trim()) newErrors.location = "Please enter your city or area";
    if (showPackageField && !packageInterested)
      newErrors.packageInterested = "Please select a package";
    if (!requirement.trim() || requirement.trim().length < 10)
      newErrors.requirement = "Please describe your requirement (min 10 chars)";
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    setErrors({});
    setSubmitting(true);

    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("crm_baraat_enquiries").insert([
          {
            customer_name: name.trim(),
            event_date: null,
            mobile: phone.trim(),
            package_name: packageInterested,
            remarks: `Location: ${location.trim()}\nRequirement: ${requirement.trim()}`,
            status: "New",
          },
        ]);
        if (error) throw error;
      } catch (error) {
        console.error("Failed to save website lead", error);
      }
    } else {
      try {
        const saved = localStorage.getItem("pmb_baraat_enquiries");
        const list = saved ? JSON.parse(saved) : [];
        list.push({
          id: `baraat-${Date.now()}`,
          customer_name: name.trim(),
          event_date: null,
          mobile: phone.trim(),
          package_name: packageInterested,
          remarks: `Location: ${location.trim()}\nRequirement: ${requirement.trim()}`,
          status: "New",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        localStorage.setItem("pmb_baraat_enquiries", JSON.stringify(list));
      } catch (error) {
        console.error("Failed to save website lead locally", error);
      }
    }

    trackMetaEvent("Lead", {
      content_name: packageInterested,
      content_category: "Baraat Package Enquiry",
      city: location.trim(),
      value: 1,
      currency: "INR",
    });

    const whatsappLink = buildWhatsAppLink(
      name.trim(),
      `+91 ${phone.trim()}`,
      location.trim(),
      "Baraat package",
      "Not shared",
      requirement.trim(),
      packageInterested
    );

    window.open(whatsappLink, "_blank");
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="wa-success-card">
        <div className="wa-success-icon">🎊</div>
        <h3 className="wa-success-title">Your Request Has Been Submitted!</h3>
        <p className="wa-success-sub">
          Your lead is saved in our CRM and WhatsApp has been opened for faster follow-up.
        </p>
        <button
          className="wa-send-btn"
          onClick={() => {
            setSubmitted(false);
            setName("");
            setPhone("");
            setLocation(defaultLocation);
            setPackageInterested(defaultPackage);
            setRequirement("");
          }}
          style={{ marginTop: "1.25rem" }}
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`wa-form ${variant === "hero" ? "wa-form-hero" : "wa-form-bottom"} ${
        shake ? "wa-shake" : ""
      }`}
      noValidate
    >
      <div className="wa-form-header">
        <span className="wa-badge">FREE INQUIRY</span>
        <h2 className="wa-form-title">Get a Free Baraat Quote</h2>
        <p className="wa-form-sub">
          Fill in your details, save your lead, and continue the conversation on WhatsApp
        </p>
      </div>

      <div className="wa-fields">
        {/* Name */}
        <div className="wa-field-group wa-field-full">
          <label className="wa-label" htmlFor="lead-name">
            Your Name *
          </label>
          <input
            id="lead-name"
            type="text"
            className={`wa-input ${errors.name ? "wa-input-error" : ""}`}
            placeholder="e.g. Rahul Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          {errors.name && <span className="wa-error">{errors.name}</span>}
        </div>

        {/* Phone */}
        <div className="wa-field-group wa-field-full">
          <label className="wa-label" htmlFor="lead-phone">
            WhatsApp Number *
          </label>
          <div className="wa-phone-wrap">
            <span className="wa-phone-prefix">🇮🇳 +91</span>
            <input
              id="lead-phone"
              type="tel"
              className={`wa-input wa-input-phone ${errors.phone ? "wa-input-error" : ""}`}
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              autoComplete="tel"
            />
          </div>
          {errors.phone && <span className="wa-error">{errors.phone}</span>}
        </div>

        {/* Location */}
        <div className="wa-field-group wa-field-full">
          <label className="wa-label" htmlFor="lead-location">
            Your City / Area *
          </label>
          <input
            id="lead-location"
            type="text"
            className={`wa-input ${errors.location ? "wa-input-error" : ""}`}
            placeholder="e.g. Vadodara, Alkapuri"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            autoComplete="address-level2"
          />
          {errors.location && <span className="wa-error">{errors.location}</span>}
        </div>

        {/* Package */}
        {showPackageField && (
          <div className="wa-field-group wa-field-full">
            <label className="wa-label" htmlFor="lead-package">
              Package Interested *
            </label>
            <select
              id="lead-package"
              className={`wa-input ${errors.packageInterested ? "wa-input-error" : ""}`}
              value={packageInterested}
              onChange={(e) => setPackageInterested(e.target.value)}
            >
              <option value="">Select a package</option>
              {BARAAT_PACKAGES.map((pkg) => (
                <option key={pkg.name} value={pkg.name}>
                  {pkg.name}
                </option>
              ))}
              <option value="Not sure yet">Not sure yet</option>
            </select>
            {errors.packageInterested && (
              <span className="wa-error">{errors.packageInterested}</span>
            )}
          </div>
        )}

        {/* Requirement */}
        <div className="wa-field-group wa-field-full">
          <label className="wa-label" htmlFor="lead-req">
            Your Requirement *
          </label>
          <textarea
            id="lead-req"
            className={`wa-input wa-textarea ${errors.requirement ? "wa-input-error" : ""}`}
            placeholder="Describe what you need. E.g. budget range, number of guests, wedding date, any special requests..."
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            rows={3}
          />
          {errors.requirement && <span className="wa-error">{errors.requirement}</span>}
        </div>
      </div>

      <button type="submit" className="wa-send-btn" disabled={submitting}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {submitting ? "Submitting..." : "Send Inquiry"}
      </button>

      <p className="wa-disclaimer">
        🔒 Your details are safe. We never share your information with third parties.
      </p>
    </form>
  );
}
