'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CalendarDays, CheckCircle2, ClipboardCheck, Loader2, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { getActiveUsers, getActiveVendors, getEventJobs, type EventJob } from '../lib/event-job-data';

const statusStyle: Record<string,string> = {
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Needs Rework': 'bg-amber-50 text-amber-700 border-amber-200',
  Blocked: 'bg-red-50 text-red-700 border-red-200',
  Cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function EventJobsList({ portal }: { portal: 'crm' | 'workspace' }) {
  const [jobs,setJobs]=useState<EventJob[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [query,setQuery]=useState('');
  const [status,setStatus]=useState('All');
  const [stage,setStage]=useState('All');
  const [view,setView]=useState(portal==='workspace'?'Active':'All');
  const [city,setCity]=useState('All');
  const [packageName,setPackageName]=useState('All');
  const [staff,setStaff]=useState('All');
  const [vendor,setVendor]=useState('All');
  const [team,setTeam]=useState('All');
  const [fromDate,setFromDate]=useState('');
  const [toDate,setToDate]=useState('');
  const [people,setPeople]=useState<{id:string;full_name:string|null;email:string|null}[]>([]);
  const [vendors,setVendors]=useState<{id:string;company_name:string}[]>([]);

  useEffect(()=>{
    getEventJobs().then(setJobs).catch((reason)=>setError(reason instanceof Error?reason.message:'Unable to load Event Jobs.')).finally(()=>setLoading(false));
    if(portal==='crm'){
      Promise.allSettled([getActiveUsers(),getActiveVendors()]).then(([staffResult,vendorResult])=>{
        if(staffResult.status==='fulfilled')setPeople(staffResult.value);
        if(vendorResult.status==='fulfilled')setVendors(vendorResult.value);
      });
    }
  },[portal]);

  const today=new Date().toISOString().slice(0,10);
  const filtered=useMemo(()=>jobs.filter((job)=>{
    const search=query.toLowerCase();
    const matchesView=view==='All'
      ||(view==='Active'&&!['Completed','Cancelled'].includes(job.status))
      ||(view==='Upcoming'&&job.event_date>=today&&!['Completed','Cancelled'].includes(job.status))
      ||(view==='Delayed'&&job.event_date<today&&!['Completed','Cancelled'].includes(job.status))
      ||(view==='Attention'&&['Blocked','Needs Rework'].includes(job.status))
      ||(view==='Completed'&&job.status==='Completed');
    return (!search||`${job.job_number} ${job.client_name} ${job.event_name} ${job.venue||''} ${job.city||''} ${job.package_name||''}`.toLowerCase().includes(search))
      &&(status==='All'||job.status===status)
      &&(stage==='All'||job.current_stage_key===stage)
      &&(city==='All'||job.city===city)
      &&(packageName==='All'||job.package_name===packageName)
      &&(staff==='All'||job.assigned_staff_ids?.includes(staff))
      &&(vendor==='All'||job.vendor_ids?.includes(vendor))
      &&(team==='All'||job.team_names?.includes(team))
      &&(!fromDate||job.event_date>=fromDate)
      &&(!toDate||job.event_date<=toDate)
      &&matchesView;
  }),[jobs,query,status,stage,view,city,packageName,staff,vendor,team,fromDate,toDate,today]);

  const stages=Array.from(new Set(jobs.map((job)=>job.current_stage_key)));
  const cities=Array.from(new Set(jobs.map((job)=>job.city).filter(Boolean) as string[]));
  const packages=Array.from(new Set(jobs.map((job)=>job.package_name).filter(Boolean) as string[]));
  const teams=Array.from(new Set(jobs.flatMap((job)=>job.team_names||[])));
  const summary=[['All Jobs',jobs.length,ClipboardCheck],['Active',jobs.filter((job)=>job.status==='In Progress').length,CalendarDays],['Attention',jobs.filter((job)=>['Blocked','Needs Rework'].includes(job.status)).length,AlertTriangle],['Completed',jobs.filter((job)=>job.status==='Completed').length,CheckCircle2]] as const;
  const selectClass='h-10 min-w-0 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-red-400';

  return <div className="p-4 sm:p-6">
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{summary.map(([label,value,Icon])=><div key={label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p><Icon size={16} className="text-red-600"/></div><p className="mt-2 text-2xl font-black text-gray-950">{value}</p></div>)}</div>
    <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="grid gap-2 md:grid-cols-[1fr_180px_220px_180px]">
        <label className="relative"><Search size={16} className="absolute left-3 top-3 text-gray-400"/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search job, client, city, venue or package" className="h-10 w-full rounded-xl border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-red-400"/></label>
        <select value={status} onChange={(event)=>setStatus(event.target.value)} className={selectClass}><option>All</option>{['In Progress','Needs Rework','Blocked','Completed','Cancelled'].map((value)=><option key={value}>{value}</option>)}</select>
        <select value={stage} onChange={(event)=>setStage(event.target.value)} className={selectClass}><option>All</option>{stages.map((value)=><option key={value} value={value}>{value.replaceAll('_',' ')}</option>)}</select>
        <select value={view} onChange={(event)=>setView(event.target.value)} className={selectClass}><option>All</option>{['Active','Upcoming','Delayed','Attention','Completed'].map((value)=><option key={value}>{value}</option>)}</select>
      </div>
      {portal==='crm'&&<details className="mt-2 rounded-xl border border-gray-100 bg-gray-50 p-2"><summary className="flex cursor-pointer list-none items-center gap-2 px-1 text-xs font-black text-gray-600"><SlidersHorizontal size={14}/>More filters</summary><div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <select value={staff} onChange={(event)=>setStaff(event.target.value)} className={selectClass}><option value="All">All assigned staff</option>{people.map((person)=><option key={person.id} value={person.id}>{person.full_name||person.email}</option>)}</select>
        <select value={team} onChange={(event)=>setTeam(event.target.value)} className={selectClass}><option>All</option>{teams.map((value)=><option key={value}>{value}</option>)}</select>
        <select value={vendor} onChange={(event)=>setVendor(event.target.value)} className={selectClass}><option value="All">All vendors</option>{vendors.map((item)=><option key={item.id} value={item.id}>{item.company_name}</option>)}</select>
        <select value={city} onChange={(event)=>setCity(event.target.value)} className={selectClass}><option>All</option>{cities.map((value)=><option key={value}>{value}</option>)}</select>
        <select value={packageName} onChange={(event)=>setPackageName(event.target.value)} className={selectClass}><option>All</option>{packages.map((value)=><option key={value}>{value}</option>)}</select>
        <input type="date" value={fromDate} onChange={(event)=>setFromDate(event.target.value)} className={selectClass} aria-label="Event date from"/>
        <input type="date" value={toDate} onChange={(event)=>setToDate(event.target.value)} className={selectClass} aria-label="Event date to"/>
        <button onClick={()=>{setStaff('All');setTeam('All');setVendor('All');setCity('All');setPackageName('All');setFromDate('');setToDate('');}} className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-black text-gray-600">Clear advanced filters</button>
      </div></details>}
    </div>
    {error&&<div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
    {loading?<div className="flex h-56 items-center justify-center"><Loader2 className="animate-spin text-red-600"/></div>:<div className="mt-4 grid gap-3 xl:grid-cols-2">{filtered.map((job)=>{
      const overdue=job.event_date<today&&job.status!=='Completed';
      return <Link key={job.id} href={`/${portal}/event-jobs/${job.id}`} className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md sm:p-5">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[.18em] text-red-600">{job.job_number}</p><h3 className="mt-1 truncate text-base font-black text-gray-950">{job.event_name}</h3><p className="mt-1 text-xs text-gray-500">{job.client_name} · {job.package_name||'Custom package'}</p></div><span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black ${statusStyle[job.status]||statusStyle['In Progress']}`}>{job.status}</span></div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-3 text-[11px] font-semibold text-gray-500"><span className="inline-flex items-center gap-1.5"><CalendarDays size={13}/>{new Date(`${job.event_date}T00:00:00`).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span><span className="inline-flex min-w-0 items-center gap-1.5"><MapPin size={13}/><span className="truncate">{job.venue||'Venue pending'}</span></span>{overdue&&<span className="font-black text-red-600">OVERDUE</span>}</div>
        <div className="mt-3 flex items-center justify-between"><p className="text-[10px] uppercase tracking-widest text-gray-400">Current stage</p><p className="text-xs font-black capitalize text-gray-800">{job.current_stage_key.replaceAll('_',' ')}</p></div>
      </Link>;
    })}{!filtered.length&&!error&&<div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center"><ClipboardCheck className="mx-auto text-gray-300"/><p className="mt-3 text-sm font-bold text-gray-700">No Event Jobs match these filters</p><p className="mt-1 text-xs text-gray-400">Confirmed bookings will appear automatically.</p></div>}</div>}
  </div>;
}
