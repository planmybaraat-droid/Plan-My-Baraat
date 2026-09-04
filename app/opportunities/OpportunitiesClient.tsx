"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { OPPORTUNITIES } from "./opportunities-data";

export default function OpportunitiesClient() {
  return <section id="open-positions" className="scroll-mt-24 bg-white"><div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
    <div className="max-w-3xl"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E30B1D] sm:text-[11px]">Current opportunities</p><h1 className="mt-3 text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl">Find the role where you can make an impact.</h1><p className="opportunities-copy mt-4 max-w-2xl text-sm leading-7 text-black/55 sm:text-base">Choose an open position to view its dedicated application form.</p></div>
    <div className="mt-10 grid gap-5 lg:grid-cols-2">{OPPORTUNITIES.map((role) => <article key={role.id} className="flex h-full flex-col rounded-2xl border border-black/10 bg-white p-6 transition hover:border-[#E30B1D]/35 sm:p-7">
      <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#E30B1D] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.13em] text-white">{role.type}</span><span className="rounded-full bg-black/[0.045] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.13em] text-black/55">{role.department}</span></div>
      <h2 className="mt-5 text-xl font-extrabold tracking-[-0.018em] sm:text-2xl">{role.title}</h2><div className="mt-3 flex items-center gap-2 text-xs font-semibold text-black/45"><MapPin className="h-4 w-4 text-[#E30B1D]"/>{role.location}</div><p className="opportunities-copy mt-5 text-sm leading-6 text-black/60">{role.summary}</p>
      <ul className="mt-5 space-y-3">{role.responsibilities.map((item) => <li key={item} className="flex items-start gap-3 text-sm font-semibold text-black/70"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E30B1D]"/>{item}</li>)}</ul>
      <Link href={`/opportunities/${role.id}/apply`} className="mt-7 inline-flex min-h-12 w-full items-center justify-between gap-5 rounded-lg bg-[#010101] px-5 text-xs font-extrabold uppercase tracking-[0.075em] text-white transition-colors hover:bg-[#E30B1D] sm:w-auto sm:self-start">Apply Now <ArrowRight className="h-4 w-4"/></Link>
    </article>)}</div>
  </div></section>;
}
