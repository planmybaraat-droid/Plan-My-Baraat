"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import type { Opportunity } from "../../opportunities-data";

const WHATSAPP_NUMBER = "919033014432";
type State = { type: "idle" | "submitting" | "success" | "error"; message: string };
const experienceOptions = ["Fresher / Less than 1 year", "1–2 Years", "2–5 Years", "5–7 Years", "7+ Years"];

export default function RoleApplicationForm({ role }: { role: Opportunity }) {
  const [state, setState] = useState<State>({ type: "idle", message: "" });
  const [eventExperience, setEventExperience] = useState("No");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.type === "submitting") return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const fd = new FormData(form);
    const values: Record<string, string | string[]> = {};
    fd.forEach((value, key) => {
      if (key === "confirm") return;
      const text = String(value).trim();
      const current = values[key];
      values[key] = current ? (Array.isArray(current) ? [...current, text] : [current, text]) : text;
    });
    setState({ type: "submitting", message: "Saving your application…" });
    try {
      const response = await fetch("/api/opportunities/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: role.id, ...values }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save your application.");
      const message = `Hello Plan My Baraat,\n\nI have submitted my application for *${role.title}*.\n\nName: ${values.fullName}\nWhatsApp: ${values.phone}\nEmail: ${values.email}\nApplication ID: ${result.applicationId}\n\nPlease let me know the next steps. Thank you.`;
      setState({ type: "success", message: "Application submitted successfully. Opening WhatsApp…" });
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      form.reset();
    } catch (error) {
      setState({ type: "error", message: error instanceof Error ? error.message : "Unable to submit your application." });
    }
  }

  return <section className="bg-[#F8F4EE]"><div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
    <Link href="/opportunities" className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-black/55 hover:text-[#E30B1D]"><ArrowLeft size={15}/>Back to opportunities</Link>
    <div className="mt-7 rounded-3xl border border-black/10 bg-white p-5 sm:p-8 lg:p-10">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E30B1D]">Application form</p><h1 className="mt-3 text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl">{role.title}</h1><p className="opportunities-copy mt-4 text-sm leading-7 text-black/55">Complete the relevant details below. Your application is saved before WhatsApp opens.</p>
      <form onSubmit={submit} className="mt-9 space-y-9">
        <Section title="Personal details"><div className="grid gap-5 sm:grid-cols-2"><Field label="Full name" name="fullName" autoComplete="name" required/><Field label="WhatsApp number" name="phone" type="tel" autoComplete="tel" required/><Field label="Email ID" name="email" type="email" autoComplete="email" required/><Field label={role.id === "sales-executive" ? "Area / locality where you live" : "Area / city"} name="city" required/><Field label="Date of birth" name="dateOfBirth" type="date" required/><Select label="Gender" name="gender" options={["Female", "Male", "Other"]} required/></div></Section>

        {role.id === "sales-executive" ? <>
          <Section title="Sales experience"><div className="grid gap-5 sm:grid-cols-2"><Select label="Total sales experience" name="experience" options={experienceOptions} required/><Field label="Average monthly sales target" name="averageSalesTarget" type="number" min="0" placeholder="₹5,00,000" required/><Select label="Worked in wedding / event sales?" name="eventIndustryExperience" options={["No", "Yes"]} value={eventExperience} onChange={setEventExperience} required/><Field label="Largest single deal personally closed" name="largestDealClosed" type="number" min="0" placeholder="₹2,50,000" required/>{eventExperience === "Yes" && <><Field label="Company / business name" name="eventCompany"/><Field label="Duration of event-sales experience" name="eventExperienceDuration"/></>}</div></Section>
          <Section title="Role compatibility"><div className="grid gap-5 sm:grid-cols-2"><Select label="Comfortable calling and following up with leads daily?" name="dailyFollowUp" options={["Yes", "No"]} required/><Select label="Comfortable with 10:00 AM – 7:00 PM timing?" name="workingHours" options={["Yes", "No"]} required/></div></Section>
        </> : <>
          <Section title="Editing experience"><div className="grid gap-5 sm:grid-cols-2"><Select label="Total experience" name="experience" options={["1–2 Years", "2–5 Years", "5–7 Years", "7+ Years"]} required/><Field label="Current / last company" name="currentCompany" required/><Select label="Primary editing niche" name="editingNiche" options={["Wedding", "Commercial", "Reels", "YouTube", "Corporate"]} required/></div></Section>
          <Section title="Professional skills"><div className="grid gap-5 sm:grid-cols-2"><Checks label="Editing software" name="software" options={["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "Final Cut Pro", "Photoshop", "Lightroom", "Other"]}/><div className="grid gap-5"><Field label="Average videos edited per month" name="videosPerMonth" type="number" min="0" required/><Select label="Fastest delivery for a 60–90 sec reel" name="deliveryTime" options={["Same Day", "24 Hours", "48 Hours", "3+ Days"]} required/></div></div></Section>
          <Section title="Portfolio & quality"><div className="grid gap-5 sm:grid-cols-2"><Field label="Portfolio link" name="portfolioLink" type="url" placeholder="Google Drive, Behance, Instagram or YouTube" required/><Field label="Best wedding edit link" name="bestWeddingEditLink" type="url"/><Field label="Largest client / brand edited for" name="largestClient"/><Field label="Highest project value worked on" name="highestProjectValue" type="number" min="0"/></div></Section>
          <Section title="Role compatibility"><div className="grid gap-5 sm:grid-cols-3"><Select label="Comfortable editing wedding and event content daily?" name="dailyEventEditing" options={["Yes", "No"]} required/><Select label="Comfortable with 10:00 AM – 7:00 PM timing?" name="workingHours" options={["Yes", "No"]} required/><Select label="Can handle urgent same-day edits?" name="urgentEdits" options={["Yes", "No"]} required/></div></Section>
        </>}

        <Section title="Joining & communication"><div className="grid gap-5 sm:grid-cols-2"><Field label="Earliest joining date" name="joiningDate" type="date" required/><Checks label="Languages known" name="languages" options={["English", "Hindi", "Gujarati", "Other"]}/><Field label="Resume upload link" name="resumeLink" type="url" placeholder="Public Google Drive or Dropbox link" required/><Field label="Resume / profile link (optional)" name="profileLink" type="url" placeholder="LinkedIn or portfolio URL"/></div></Section>
        <label className="flex items-start gap-3 rounded-xl bg-black/[0.035] p-4 text-sm font-semibold text-black/65"><input className="mt-0.5 h-4 w-4 accent-[#E30B1D]" type="checkbox" name="confirm" required/>I confirm that the information provided above is correct.</label>
        <div aria-live="polite" className="min-h-6">{state.message && <p className={`text-sm font-semibold ${state.type === "error" ? "text-[#E30B1D]" : state.type === "success" ? "text-emerald-700" : "text-black/55"}`}>{state.message}</p>}</div>
        <button disabled={state.type === "submitting"} className="flex min-h-14 w-full items-center justify-between rounded-xl bg-[#E30B1D] px-6 text-sm font-extrabold text-white transition hover:bg-[#010101] disabled:opacity-60"><span className="flex items-center gap-3"><MessageCircle size={19}/>{state.type === "submitting" ? "Submitting…" : "Submit Application"}</span><ArrowRight size={19}/></button>
        {state.type === "success" && <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 size={17}/>Our team will review your application and contact shortlisted candidates.</p>}
      </form>
    </div>
  </div></section>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <fieldset><legend className="mb-5 text-lg font-extrabold">{title}</legend>{children}</fieldset>; }
function Field({ label, name, ...props }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) { return <label className="opportunity-field"><span>{label}{props.required && <b className="ml-1 text-[#E30B1D]">*</b>}</span><input name={name} {...props}/></label>; }
function Select({ label, name, options, value, onChange, required }: { label: string; name: string; options: string[]; value?: string; onChange?: (value: string) => void; required?: boolean }) { return <label className="opportunity-field"><span>{label}{required && <b className="ml-1 text-[#E30B1D]">*</b>}</span><select name={name} required={required} value={value} defaultValue={value === undefined ? "" : undefined} onChange={onChange ? e => onChange(e.target.value) : undefined}><option value="" disabled>Select an option</option>{options.map(option => <option key={option}>{option}</option>)}</select></label>; }
function Checks({ label, name, options }: { label: string; name: string; options: string[] }) { return <fieldset className="opportunity-field"><legend>{label} <span>*</span></legend><div className="mt-2 grid grid-cols-2 gap-2">{options.map(option => <label key={option} className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold"><input type="checkbox" name={name} value={option}/>{option}</label>)}</div></fieldset>; }
