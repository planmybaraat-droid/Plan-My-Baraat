'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, CalendarDays, Check, CheckCircle2, ChevronDown, Circle,
  Clock3, Loader2, MapPin, Play, RefreshCw, Save, ShieldAlert, Users,
} from 'lucide-react';
import { useCrmProfile } from '../lib/useCrmProfile';
import {
  assignStage, getActiveUsers, getActiveVendors, getEventJob, updateService,
  updateStage, type EventJobBundle, type EventJobStage,
} from '../lib/event-job-data';

const checklistByStage: Record<string,{key:string;label:string}[]> = {
  confirmation: [
    ['client_verified','Client details confirmed'],
    ['event_date_verified','Event date and time confirmed'],
    ['venue_verified','Venue, starting location and route confirmed'],
    ['services_verified','Agreement package and every selected service confirmed'],
  ].map(([key,label])=>({key,label})),
  client_meeting: [
    ['meeting_completed','Client meeting completed'],
    ['requirements_frozen','Final requirements frozen'],
    ['timeline_approved','Event timeline approved'],
    ['contacts_verified','Client contacts verified'],
  ].map(([key,label])=>({key,label})),
  final_checklist: [
    ['materials_ready','Materials ready'],['safas_ready','Safas and accessories ready'],
    ['equipment_ready','Equipment ready'],['vehicle_confirmed','Vehicle confirmed'],
    ['vendors_confirmed','Every agreement service/vendor booked'],['staff_confirmed','Staff confirmed'],
    ['documents_ready','Documents ready'],['special_requirements_checked','Special requirements checked'],
  ].map(([key,label])=>({key,label})),
  dispatch: [
    ['dispatch_team_ready','Dispatch team ready'],['dispatch_materials_loaded','Materials loaded and counted'],
    ['dispatch_vehicle_ready','Vehicle ready'],['dispatch_documents_ready','Event documents and contacts ready'],
    ['dispatch_released','Dispatch released'],
  ].map(([key,label])=>({key,label})),
  event_execution: [
    ['team_arrived','Team arrived'],['materials_arrived','Materials arrived'],
    ['vendors_arrived','All booked service vendors arrived'],['groom_ready','Groom ready'],
    ['service_started','Service started'],['baraat_started','Baraat started'],
    ['service_completed','Event services completed'],
  ].map(([key,label])=>({key,label})),
  payment_closure: [
    ['invoice_verified','Invoice verified'],['payment_received','Final payment received'],
    ['payment_receipt_shared','Receipt shared with client'],
  ].map(([key,label])=>({key,label})),
  feedback: [
    ['client_feedback_received','Client feedback received'],['vendor_performance_reviewed','Vendor performance reviewed'],
    ['staff_performance_reviewed','Staff performance reviewed'],['issues_documented','Issues and recommendations documented'],
  ].map(([key,label])=>({key,label})),
};

const inputClass='h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50';
const activeStatuses=['Assigned','In Progress','Needs Rework'];
const statusIcon=(status:string)=>status==='Completed'
  ? <CheckCircle2 size={19} className="text-emerald-600"/>
  : status==='Needs Rework' ? <RefreshCw size={19} className="text-amber-600"/>
  : status==='Blocked' ? <ShieldAlert size={19} className="text-red-600"/>
  : ['Assigned','In Progress'].includes(status) ? <Clock3 size={19} className="text-blue-600"/>
  : <Circle size={19} className="text-gray-300"/>;

export default function EventJobTracker({id,portal}:{id:string;portal:'crm'|'workspace'}) {
  const {profile}=useCrmProfile();
  const [bundle,setBundle]=useState<EventJobBundle|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [success,setSuccess]=useState('');
  const [users,setUsers]=useState<{id:string;full_name:string|null;email:string|null;role:string}[]>([]);
  const [vendors,setVendors]=useState<{id:string;company_name:string;contact_person:string;mobile:string}[]>([]);
  const [openStage,setOpenStage]=useState('');
  const [draft,setDraft]=useState<Record<string,unknown>>({});
  const [reworkStage,setReworkStage]=useState('final_checklist');
  const [reworkReason,setReworkReason]=useState('');
  const [working,setWorking]=useState(false);
  const isAdmin=profile?.role==='admin'||profile?.role==='super_admin';

  const load=useCallback(async()=>{
    setError('');
    try { setBundle(await getEventJob(id)); }
    catch(reason) { setError(reason instanceof Error?reason.message:'Unable to load tracker.'); }
    finally { setLoading(false); }
  },[id]);

  useEffect(()=>{load();},[load]);
  useEffect(()=>{Promise.allSettled([getActiveUsers(),getActiveVendors()]).then(([people,vendorRows])=>{
    if(people.status==='fulfilled')setUsers(people.value);
    if(vendorRows.status==='fulfilled')setVendors(vendorRows.value);
  });},[]);

  const activeStage=useMemo(()=>bundle?.stages.find((stage)=>stage.stage_key===openStage)||null,[bundle,openStage]);
  // Event Jobs are a shared operations board. Workspace access is already
  // controlled by the staff member's Event Jobs module permission; assignment
  // is a responsibility label and must not hide or lock the shared workflow.
  const canEdit=(_stage:EventJobStage)=>Boolean(isAdmin||portal==='workspace');
  const open=(stage:EventJobStage)=>{setOpenStage(stage.stage_key);setDraft(stage.data||{});setError('');setSuccess('');};
  const act=async(action:'start'|'save'|'complete'|'qc_fail'|'reopen')=>{
    if(!activeStage)return;
    setWorking(true);setError('');
    try {
      const payload={...draft};
      if(activeStage.stage_key==='final_checklist')payload.all_required_complete=checklistByStage.final_checklist.every((item)=>payload[item.key]===true);
      await updateStage(activeStage.id,action,payload,reworkStage,reworkReason);
      setSuccess(action==='complete'?'Stage completed and the next stage is active.':action==='qc_fail'?'Dispatch returned to the responsible stage.':action==='reopen'?'Stage reopened with history preserved.':'Changes saved.');
      await load();
    } catch(reason) { setError(reason instanceof Error?reason.message:'Unable to update stage.'); }
    finally { setWorking(false); }
  };

  if(loading)return <div className="flex h-72 items-center justify-center"><Loader2 className="animate-spin text-red-600"/></div>;
  if(!bundle)return <div className="p-6"><div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">{error||'Event Job not found.'}</div></div>;
  const {job,stages,services,activity}=bundle;
  const assignedCount=stages.filter((stage)=>stage.assigned_to).length;

  return <div className="p-4 sm:p-6">
    <Link href={`/${portal}/event-jobs`} className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15}/>Back to Event Jobs</Link>
    <section className="mt-4 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="bg-gradient-to-br from-gray-950 to-[#26070a] p-5 text-white sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-[10px] font-black uppercase tracking-[.22em] text-red-400">Job Tracker · {job.job_number}</p><h1 className="mt-2 text-2xl font-black sm:text-3xl">{job.event_name}</h1><p className="mt-1 text-sm text-white/60">{job.client_name} · {job.package_name||'Custom package'} · {services.length} agreement services</p></div><span className="self-start rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black">{job.status}</span></div>
        <div className="mt-5 flex flex-wrap gap-4 border-t border-white/10 pt-4 text-xs text-white/70"><span className="inline-flex items-center gap-2"><CalendarDays size={15}/>{new Date(`${job.event_date}T00:00:00`).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span><span className="inline-flex items-center gap-2"><MapPin size={15}/>{job.venue||'Venue pending'}</span><span className="inline-flex items-center gap-2"><Users size={15}/>{assignedCount} stages assigned</span></div>
      </div>
      <div className="grid divide-y divide-gray-100 lg:grid-cols-[430px_1fr] lg:divide-x lg:divide-y-0">
        <div className="p-4 sm:p-6"><p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Booking → delivery workflow</p><div className="mt-4">{stages.map((stage,index)=>{
          const selected=openStage===stage.stage_key;
          return <button key={stage.id} onClick={()=>open(stage)} className={`relative flex w-full gap-3 rounded-xl px-2 py-3 text-left transition ${selected?'bg-red-50':'hover:bg-gray-50'}`}>
            {index<stages.length-1&&<span className={`absolute left-[17px] top-8 h-[calc(100%-12px)] w-px ${stage.status==='Completed'?'bg-emerald-300':'bg-gray-200'}`}/>}<span className="relative z-10 mt-0.5 bg-white">{statusIcon(stage.status)}</span>
            <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><b className="text-sm text-gray-950">{stage.stage_name}</b><span className={`text-[9px] font-black uppercase ${stage.status==='Completed'?'text-emerald-600':stage.status==='Needs Rework'?'text-amber-600':['Assigned','In Progress'].includes(stage.status)?'text-blue-600':'text-gray-400'}`}>{stage.status}</span></span><span className="mt-1 block text-[11px] text-gray-400">{stage.assignee?.full_name?`Assigned to ${stage.assignee.full_name}`:stage.completed_at?`Completed ${new Date(stage.completed_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}`:'Not assigned'}{stage.due_at&&` · Due ${new Date(stage.due_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}`}</span></span><ChevronDown size={14} className={`mt-1 text-gray-300 ${selected?'rotate-180':''}`}/>
          </button>;
        })}</div></div>
        <div className="min-h-[520px] p-4 sm:p-6">{activeStage
          ? <StagePanel stage={activeStage} canEdit={canEdit(activeStage)} isAdmin={Boolean(isAdmin)} users={users} vendors={vendors} services={services} stages={stages} draft={draft} setDraft={setDraft} reworkStage={reworkStage} setReworkStage={setReworkStage} reworkReason={reworkReason} setReworkReason={setReworkReason} working={working} onAction={act} onReload={load} onError={setError}/>
          : <div className="flex h-72 flex-col items-center justify-center text-center"><CheckCircle2 size={36} className="text-gray-200"/><p className="mt-3 text-sm font-bold text-gray-700">Choose a workflow stage</p><p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">Event Jobs are shared across the operations team. Staff updates are saved to the same workflow shown in Admin.</p></div>}
        </div>
      </div>
    </section>
    {(error||success)&&<div className={`fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-xl rounded-2xl border p-4 text-sm font-semibold shadow-xl lg:bottom-6 ${error?'border-red-200 bg-red-50 text-red-700':'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{error||success}</div>}
    <section className="mt-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-base font-black text-gray-950">Activity history</h2><div className="mt-4 space-y-3">{activity.map((item)=><div key={item.id} className="flex gap-3 border-l-2 border-gray-200 pl-4"><div className="min-w-0 flex-1"><p className="text-xs font-bold capitalize text-gray-800">{item.action.replaceAll('_',' ')}</p><p className="mt-0.5 text-[11px] text-gray-500">{item.detail||'Workflow updated'}{item.actor_name&&` · ${item.actor_name}`}</p></div><time className="shrink-0 text-[10px] text-gray-400">{new Date(item.created_at).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</time></div>)}{!activity.length&&<p className="text-xs text-gray-400">No activity recorded yet.</p>}</div></section>
  </div>;
}

type PanelProps={
  stage:EventJobStage;canEdit:boolean;isAdmin:boolean;
  users:{id:string;full_name:string|null;email:string|null;role:string}[];
  vendors:{id:string;company_name:string;contact_person:string;mobile:string}[];
  services:EventJobBundle['services'];stages:EventJobStage[];
  draft:Record<string,unknown>;setDraft:(value:Record<string,unknown>)=>void;
  reworkStage:string;setReworkStage:(value:string)=>void;reworkReason:string;setReworkReason:(value:string)=>void;
  working:boolean;onAction:(action:'start'|'save'|'complete'|'qc_fail'|'reopen')=>void;
  onReload:()=>Promise<void>;onError:(message:string)=>void;
};

function StagePanel(props:PanelProps) {
  const {stage}=props;
  const checks=checklistByStage[stage.stage_key]||[];
  const set=(key:string,value:unknown)=>props.setDraft({...props.draft,[key]:value});
  const active=activeStatuses.includes(stage.status);
  const bookedCount=props.services.filter((service)=>['Booked','Not Required'].includes(service.booking_status)).length;
  const run=async(work:()=>Promise<void>)=>{try{props.onError('');await work();}catch(reason){props.onError(reason instanceof Error?reason.message:'Unable to update this stage.');}};
  const assign=()=>run(async()=>{await assignStage(stage.id,String(props.draft.assignment||'')||null,String(props.draft.due_at||'')||null);await props.onReload();});

  return <div>
    <div className="flex flex-col justify-between gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-start"><div><p className="text-[10px] font-black uppercase tracking-widest text-red-600">Stage {(stage.sort_order+1).toString().padStart(2,'0')}</p><h2 className="mt-1 text-xl font-black text-gray-950">{stage.stage_name}</h2><p className="mt-1 text-xs text-gray-400">{stage.assignee?.full_name?`Assigned to ${stage.assignee.full_name}`:'No staff assigned'} · {stage.status}</p></div>{!props.canEdit&&<span className="rounded-xl bg-gray-100 px-3 py-2 text-[10px] font-black text-gray-500">VIEW ONLY</span>}</div>

    {props.isAdmin&&stage.stage_key!=='booking'&&<div className="mt-4 grid gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:grid-cols-[1fr_180px_auto]"><select className={inputClass} value={String(props.draft.assignment||stage.assigned_to||'')} onChange={(event)=>set('assignment',event.target.value)}><option value="">Unassigned</option>{props.users.map((user)=><option key={user.id} value={user.id}>{user.full_name||user.email} · {user.role}</option>)}</select><input className={inputClass} type="datetime-local" value={String(props.draft.due_at||stage.due_at?.slice(0,16)||'')} onChange={(event)=>set('due_at',event.target.value)}/><button onClick={assign} className="rounded-xl bg-gray-950 px-4 py-2 text-xs font-black text-white">Assign</button></div>}

    {stage.stage_key==='vendor_blocking'&&<div className="mt-4"><div className="mb-3 flex flex-col justify-between gap-2 rounded-2xl bg-red-50 p-4 sm:flex-row sm:items-center"><div><p className="text-sm font-black text-gray-950">Agreement service coordination</p><p className="mt-1 text-xs text-gray-500">Every enabled service from this client’s agreement is tracked here.</p></div><span className="self-start rounded-full bg-white px-3 py-1.5 text-xs font-black text-red-600">{bookedCount} / {props.services.length} booked</span></div><div className="space-y-2">{props.services.map((service,index)=><div key={service.id} className="grid gap-2 rounded-2xl border border-gray-200 p-3 sm:grid-cols-[40px_1fr_160px_1fr]"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-black text-gray-500">{index+1}</span><div><p className="text-sm font-bold">{service.service_name}</p><select disabled={!props.canEdit} value={service.vendor_id||''} onChange={(event)=>void run(async()=>{const vendor=props.vendors.find((item)=>item.id===event.target.value);await updateService(service.id,{vendor_id:vendor?.id||null,vendor_name:vendor?.company_name||null,vendor_contact:vendor?`${vendor.contact_person} · ${vendor.mobile}`:null});await props.onReload();})} className="mt-2 h-9 w-full rounded-lg border border-gray-200 px-2 text-xs disabled:bg-gray-50"><option value="">Choose existing vendor</option>{props.vendors.map((vendor)=><option key={vendor.id} value={vendor.id}>{vendor.company_name} · {vendor.contact_person}</option>)}</select></div><select disabled={!props.canEdit} value={service.booking_status} onChange={(event)=>void run(async()=>{const value=event.target.value as EventJobBundle['services'][number]['booking_status'];await updateService(service.id,{booking_status:value,confirmation_status:value==='Booked'?'Confirmed':value==='Contacted'?'Contacted':value==='Issue'?'Needs Rework':'Pending',confirmation_date:value==='Booked'?new Date().toISOString().slice(0,10):null});await props.onReload();})} className="h-9 rounded-lg border border-gray-200 px-2 text-xs disabled:bg-gray-50">{['Not Started','Contacted','Blocked','Booked','Not Required','Issue'].map((value)=><option key={value}>{value}</option>)}</select><input disabled={!props.canEdit} defaultValue={service.notes||''} onBlur={(event)=>void run(async()=>{if(props.canEdit){await updateService(service.id,{notes:event.target.value});await props.onReload();}})} placeholder="Coordination notes" className="h-9 rounded-lg border border-gray-200 px-2 text-xs disabled:bg-gray-50"/></div>)}</div>{!props.services.length&&<div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">No enabled services are present in the connected agreement. Update the agreement services and reload this tracker.</div>}</div>}

    {stage.stage_key!=='vendor_blocking'&&<div className="mt-4">{checks.length>0&&<div className="divide-y divide-gray-100 rounded-2xl border border-gray-200">{checks.map((item)=><label key={item.key} className={`flex items-center gap-3 p-3.5 ${props.canEdit?'cursor-pointer':''}`}><input type="checkbox" disabled={!props.canEdit} checked={props.draft[item.key]===true} onChange={(event)=>set(item.key,event.target.checked)} className="h-4 w-4 accent-red-600"/><span className="text-sm font-semibold text-gray-800">{item.label}</span></label>)}</div>}
      {stage.stage_key==='confirmation'&&<div className="mt-3 grid gap-2 sm:grid-cols-2"><input disabled={!props.canEdit} className={inputClass} placeholder="Starting location / route" value={String(props.draft.route||'')} onChange={(event)=>set('route',event.target.value)}/><input disabled={!props.canEdit} className={inputClass} placeholder="Guest count" value={String(props.draft.guest_count||'')} onChange={(event)=>set('guest_count',event.target.value)}/></div>}
      {stage.stage_key==='client_meeting'&&<div className="mt-3 grid gap-2 sm:grid-cols-2"><input disabled={!props.canEdit} type="datetime-local" className={inputClass} value={String(props.draft.meeting_at||'')} onChange={(event)=>set('meeting_at',event.target.value)}/><input disabled={!props.canEdit} className={inputClass} placeholder="Meeting location / mode" value={String(props.draft.meeting_location||'')} onChange={(event)=>set('meeting_location',event.target.value)}/><textarea disabled={!props.canEdit} rows={4} className="rounded-2xl border border-gray-200 p-3 text-sm outline-none focus:border-red-400 disabled:bg-gray-50 sm:col-span-2" placeholder="Final meeting decisions, changes and client instructions (required)" value={String(props.draft.meeting_notes||'')} onChange={(event)=>set('meeting_notes',event.target.value)}/></div>}
      {stage.stage_key==='feedback'&&<div className="mt-3 grid gap-3 sm:grid-cols-3">{['event_quality','vendor_performance','staff_performance'].map((key)=><label key={key} className="text-[10px] font-black uppercase tracking-widest text-gray-400">{key.replaceAll('_',' ')}<select disabled={!props.canEdit} className={`${inputClass} mt-1`} value={String(props.draft[key]||'')} onChange={(event)=>set(key,event.target.value)}><option value="">Rate</option>{[1,2,3,4,5].map((value)=><option key={value}>{value}</option>)}</select></label>)}</div>}
      {stage.stage_key==='payment_closure'&&<div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs leading-5 text-blue-800">The connected CRM invoice must be marked <b>Paid</b>. The backend will prevent payment closure while any balance remains open.</div>}
      {stage.stage_key!=='client_meeting'&&<textarea disabled={!props.canEdit} rows={5} className="mt-3 w-full rounded-2xl border border-gray-200 p-3 text-sm outline-none focus:border-red-400 disabled:bg-gray-50" placeholder={stage.stage_key==='feedback'?'Client feedback, final review and recommendations (required)':'Important notes, instructions or issues'} value={String(props.draft[stage.stage_key==='feedback'?'feedback_summary':'notes']||'')} onChange={(event)=>set(stage.stage_key==='feedback'?'feedback_summary':'notes',event.target.value)}/>}</div>}

    {stage.stage_key==='dispatch'&&props.canEdit&&<div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3"><p className="text-xs font-black text-amber-800">Return dispatch for correction</p><div className="mt-2 grid gap-2 sm:grid-cols-2"><select value={props.reworkStage} onChange={(event)=>props.setReworkStage(event.target.value)} className={inputClass}>{props.stages.filter((item)=>item.sort_order>0&&item.sort_order<stage.sort_order).map((item)=><option key={item.stage_key} value={item.stage_key}>{item.stage_name}</option>)}</select><input value={props.reworkReason} onChange={(event)=>props.setReworkReason(event.target.value)} className={inputClass} placeholder="Correction reason (required)"/></div><button disabled={!props.reworkReason.trim()||props.working} onClick={()=>props.onAction('qc_fail')} className="mt-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-black text-white disabled:opacity-40">Return to responsible stage</button></div>}
    {props.isAdmin&&stage.status==='Completed'&&stage.stage_key!=='booking'&&<div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-3"><p className="text-xs font-black text-gray-700">Admin stage control</p><div className="mt-2 flex flex-col gap-2 sm:flex-row"><input value={props.reworkReason} onChange={(event)=>props.setReworkReason(event.target.value)} className={inputClass} placeholder="Reason for reopening (required)"/><button disabled={!props.reworkReason.trim()||props.working} onClick={()=>props.onAction('reopen')} className="shrink-0 rounded-xl bg-gray-900 px-4 py-2 text-xs font-black text-white disabled:opacity-40">Reopen</button></div></div>}
    {props.canEdit&&active&&stage.stage_key!=='booking'&&<div className="mt-5 flex flex-wrap justify-end gap-2">{stage.status==='Assigned'&&<button onClick={()=>props.onAction('start')} disabled={props.working} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-black"><Play size={14}/>Start</button>}<button onClick={()=>props.onAction('save')} disabled={props.working} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-black"><Save size={14}/>Save</button><button onClick={()=>props.onAction('complete')} disabled={props.working} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-black text-white disabled:opacity-50">{props.working?<Loader2 size={14} className="animate-spin"/>:<Check size={14}/>}Complete stage</button></div>}
  </div>;
}
