"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { OPPORTUNITIES } from "./opportunities-data";

const WHATSAPP_NUMBER = "919033014432";

type FormStatus = { type: "idle" | "submitting" | "success" | "error"; message: string };

export default function OpportunitiesClient() {
  const [selectedPosition, setSelectedPosition] = useState(OPPORTUNITIES[0].title);
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });
  const formSectionRef = useRef<HTMLElement>(null);

  function selectPosition(title: string) {
    setSelectedPosition(title);
    setStatus({ type: "idle", message: "" });
    window.requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const city = String(data.get("city") || "").trim();
    const position = String(data.get("position") || "").trim();
    const experience = String(data.get("experience") || "").trim();
    const education = String(data.get("education") || "").trim();
    const skills = String(data.get("skills") || "").trim();
    const availability = String(data.get("availability") || "").trim();
    const resumeLink = String(data.get("resumeLink") || "").trim();
    const introduction = String(data.get("introduction") || "").trim();
    const phoneDigits = phone.replace(/\D/g, "");

    if (!name || phoneDigits.length < 10 || !email.includes("@") || !city || !position || !education || !experience || !skills || !availability || !resumeLink || !introduction) {
      setStatus({
        type: "error",
        message: "Please complete all required fields and enter a valid WhatsApp number.",
      });
      return;
    }

    try { new URL(resumeLink); } catch {
      setStatus({ type: "error", message: "Please enter a valid public resume link." });
      return;
    }

    const message = `Hello Plan My Baraat,

I would like to apply for the *${position}* opportunity.

*Applicant details*
Name: ${name}
WhatsApp: ${phone}
Email: ${email}
City: ${city}
Experience: ${experience}
Education: ${education}
Skills: ${skills}
Available to start: ${availability}
Resume: ${resumeLink}

*About me*
${introduction}

Please let me know the next steps. Thank you.`;

    setStatus({ type: "submitting", message: "Saving your application…" });
    try {
      const response = await fetch('/api/opportunities/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, email, city, position, education, experience, skills, availability, resumeLink, introduction }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to save your application.');
      setStatus({ type: "success", message: "Application submitted successfully. Opening WhatsApp…" });
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      form.reset();
      setSelectedPosition(OPPORTUNITIES[0].title);
    } catch (cause) {
      setStatus({ type: "error", message: cause instanceof Error ? cause.message : 'Unable to save your application.' });
    }
  }

  return (
    <>
      <section id="open-positions" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E30B1D] sm:text-[11px]">Current opportunities</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl">Find the role where you can make an impact.</h2>
            <p className="opportunities-copy mt-4 max-w-2xl text-sm leading-7 text-black/55 sm:text-base">
              Explore our open positions and choose the one that best matches your interests. The application takes only a few minutes.
            </p>
          </div>

          <div className="mt-10 grid max-w-4xl gap-4">
            {OPPORTUNITIES.map((role) => (
              <article key={role.id} className="group flex h-full flex-col rounded-2xl border border-black/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#E30B1D]/35 hover:shadow-[0_22px_50px_-35px_rgba(1,1,1,0.4)] sm:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#E30B1D] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.13em] text-white">{role.type}</span>
                  <span className="rounded-full bg-black/[0.045] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.13em] text-black/55">{role.department}</span>
                </div>
                <h3 className="mt-5 text-xl font-extrabold tracking-[-0.018em] sm:text-2xl">{role.title}</h3>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-black/45">
                  <MapPin className="h-4 w-4 text-[#E30B1D]" aria-hidden="true" />
                  {role.location}
                </div>
                <p className="opportunities-copy mt-5 text-sm leading-6 text-black/60">{role.summary}</p>
                <ul className="mt-5 space-y-3">
                  {role.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-semibold text-black/70">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E30B1D]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => selectPosition(role.title)}
                  className="mt-7 inline-flex min-h-12 w-full items-center justify-between gap-5 rounded-lg bg-[#010101] px-5 text-xs font-extrabold uppercase tracking-[0.075em] text-white transition-colors hover:bg-[#E30B1D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E30B1D] focus-visible:ring-offset-2 sm:w-auto sm:self-start"
                  aria-label={`Apply for ${role.title}`}
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section ref={formSectionRef} id="apply" className="scroll-mt-20 border-y border-black/10 bg-[#F8F4EE]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 lg:px-10 lg:py-24">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E30B1D] sm:text-[11px]">Application form</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl">Take the next step.</h2>
            <p className="opportunities-copy mt-4 text-sm leading-7 text-black/55 sm:text-base">
              Complete the form to securely submit your application. WhatsApp will then open with a prepared confirmation message.
            </p>
            <div className="mt-7 space-y-4 border-t border-black/10 pt-7">
              <p className="flex items-start gap-3 text-sm font-semibold text-black/65"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#E30B1D]" aria-hidden="true" />Usually takes less than 3 minutes.</p>
              <p className="flex items-start gap-3 text-sm font-semibold text-black/65"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#E30B1D]" aria-hidden="true" />Your application is saved securely before WhatsApp opens.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_24px_65px_-45px_rgba(1,1,1,0.45)] sm:p-8 lg:p-10">
            <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
              <ApplicationField label="Position" htmlFor="application-position" className="sm:col-span-2">
                <select id="application-position" name="position" value={selectedPosition} onChange={(event) => setSelectedPosition(event.target.value)} required>
                  {OPPORTUNITIES.map((role) => <option key={role.id} value={role.title}>{role.title}</option>)}
                </select>
              </ApplicationField>
              <ApplicationField label="Full name" htmlFor="application-name" required>
                <input id="application-name" name="name" autoComplete="name" placeholder="Your full name" required />
              </ApplicationField>
              <ApplicationField label="WhatsApp number" htmlFor="application-phone" required>
                <input id="application-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" required />
              </ApplicationField>
              <ApplicationField label="Email address" htmlFor="application-email" required>
                <input id="application-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
              </ApplicationField>
              <ApplicationField label="Current city" htmlFor="application-city" required>
                <input id="application-city" name="city" autoComplete="address-level2" placeholder="Your city" required />
              </ApplicationField>
              <ApplicationField label="Experience level" htmlFor="application-experience" required>
                <select id="application-experience" name="experience" defaultValue="" required>
                  <option value="" disabled>Select experience</option>
                  <option>Fresher / Student</option>
                  <option>Less than 1 year</option>
                  <option>1–2 years</option>
                  <option>2–4 years</option>
                  <option>4+ years</option>
                </select>
              </ApplicationField>
              <ApplicationField label="Education" htmlFor="application-education" required>
                <input id="application-education" name="education" placeholder="Degree / course and college" required />
              </ApplicationField>
              <ApplicationField label="Available to start" htmlFor="application-availability" required>
                <select id="application-availability" name="availability" defaultValue="" required>
                  <option value="" disabled>Select availability</option>
                  <option>Immediately</option>
                  <option>Within 15 days</option>
                  <option>Within 30 days</option>
                  <option>More than 30 days</option>
                </select>
              </ApplicationField>
              <ApplicationField label="Technical skills" htmlFor="application-skills" required className="sm:col-span-2">
                <input id="application-skills" name="skills" placeholder="React, Next.js, TypeScript, Supabase…" required />
              </ApplicationField>
              <ApplicationField label="Resume link" htmlFor="application-resume" required className="sm:col-span-2">
                <input id="application-resume" name="resumeLink" type="url" inputMode="url" placeholder="Google Drive, LinkedIn or portfolio link" required />
              </ApplicationField>
              <ApplicationField label="Why would you like to join us?" htmlFor="application-introduction" required className="sm:col-span-2">
                <textarea id="application-introduction" name="introduction" rows={5} placeholder="Tell us briefly about your interests, strengths and relevant experience." required />
              </ApplicationField>
            </div>

            <div aria-live="polite" className="min-h-7 pt-2">
              {status.message ? <p role="status" className={`text-sm font-semibold ${status.type === 'error' ? 'text-[#E30B1D]' : status.type === 'success' ? 'text-emerald-700' : 'text-black/55'}`}>{status.message}</p> : null}
            </div>

            <button type="submit" disabled={status.type === 'submitting'} className="flex min-h-14 w-full items-center justify-between rounded-xl bg-[#E30B1D] px-5 text-sm font-extrabold text-white transition-colors hover:bg-[#010101] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E30B1D] focus-visible:ring-offset-2 sm:px-6">
              <span className="flex items-center gap-3"><MessageCircle className="h-5 w-5" aria-hidden="true" />{status.type === 'submitting' ? 'Submitting…' : 'Submit Application'}</span>
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="mt-4 text-center text-xs leading-5 text-black/45">Your application is securely stored for recruitment review and used only by Plan My Baraat.</p>
          </form>
        </div>
      </section>
    </>
  );
}

function ApplicationField({
  label,
  htmlFor,
  required = false,
  hint,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`opportunity-field ${className}`}>
      <label htmlFor={htmlFor}>
        {label} {required ? <span aria-hidden="true">*</span> : null}
        {hint ? <span className="ml-1 font-normal normal-case tracking-normal text-black/35">({hint})</span> : null}
      </label>
      {children}
    </div>
  );
}
