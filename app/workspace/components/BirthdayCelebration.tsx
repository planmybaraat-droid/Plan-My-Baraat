'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Cake, PartyPopper, Sparkles, X } from 'lucide-react';
import { crmSupabase } from '../../crm/lib/supabase-crm';

export default function BirthdayCelebration() {
  const [name,setName]=useState('');

  useEffect(()=>{
    let active=true;
    crmSupabase.rpc('crm_claim_my_birthday_celebration').then(({data,error})=>{
      if(!active||error||!data?.[0]?.full_name)return;
      setName(String(data[0].full_name));
      const end=Date.now()+2600;
      const colors=['#ef233c','#ffb703','#ff5d8f','#ffffff'];
      const burst=()=>{
        confetti({particleCount:7,angle:60,spread:65,origin:{x:0,y:.7},colors});
        confetti({particleCount:7,angle:120,spread:65,origin:{x:1,y:.7},colors});
        if(Date.now()<end)requestAnimationFrame(burst);
      };
      burst();
    });
    return()=>{active=false;};
  },[]);

  if(!name)return null;
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Birthday celebration">
    <div className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/20 bg-white p-7 text-center shadow-2xl sm:p-9">
      <button onClick={()=>setName('')} className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200" aria-label="Close birthday celebration"><X size={17}/></button>
      <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-pink-200/60 blur-3xl"/><div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-amber-200/70 blur-3xl"/>
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-200"><Cake size={38}/></div>
      <div className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-red-600"><Sparkles size={12}/> Today is your day</div>
      <h2 className="relative mt-4 text-3xl font-black tracking-tight text-gray-950">Happy Birthday,<br/><span className="text-red-600">{name}!</span></h2>
      <p className="relative mx-auto mt-3 max-w-xs text-sm leading-6 text-gray-500">The entire PlanMyBaraat team wishes you a joyful year filled with success, happiness and memorable celebrations.</p>
      <button onClick={()=>setName('')} className="relative mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3.5 text-sm font-black text-white hover:bg-red-600"><PartyPopper size={18}/> Start celebrating</button>
    </div>
  </div>;
}
