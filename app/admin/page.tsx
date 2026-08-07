/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Sparkles, 
  Search, 
  Building, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  Check, 
  Phone, 
  Clock, 
  Shield, 
  RefreshCw, 
  Plus, 
  Users,
  X
} from "lucide-react";

import confetti from "canvas-confetti";
import { CITIES, INITIAL_VENDORS, Vendor, generateVendorsForCity } from "@/lib/vendorData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface Inquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  cityName: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  guestsCount: number;
  weddingDate: string;
  status: "new" | "contacted" | "negotiation" | "booked" | "lost";
  notes?: string;
  totalBudget?: number;
  timestamp: string;
}

function mapDbVendorToVendor(dbV: any): Vendor {
  return {
    id: dbV.id,
    name: dbV.name,
    category: dbV.category,
    city: dbV.city,
    rating: Number(dbV.rating || 5.0),
    reviewsCount: dbV.reviews_count || 0,
    price: dbV.price || 0,
    priceUnit: dbV.price_unit || "per event",
    imageUrl: dbV.image_url || "/images/venue_luxury.png",
    galleryUrls: dbV.gallery_urls || [],
    address: dbV.address || "",
    contact: dbV.contact || "",
    services: dbV.services || [],
    description: dbV.description || "",
    featured: !!dbV.featured,
    verified: !!dbV.verified,
    reviews: dbV.reviews ? (typeof dbV.reviews === 'string' ? JSON.parse(dbV.reviews) : dbV.reviews) : []
  };
}

function mapVendorToDbVendor(v: Vendor): any {
  return {
    id: v.id,
    name: v.name,
    category: v.category,
    city: v.city,
    rating: v.rating,
    reviews_count: v.reviewsCount,
    price: v.price,
    price_unit: v.priceUnit,
    image_url: v.imageUrl,
    gallery_urls: v.galleryUrls || [],
    address: v.address,
    contact: v.contact,
    services: v.services,
    description: v.description,
    featured: v.featured,
    verified: v.verified ?? true,
    reviews: v.reviews || []
  };
}

function mapDbInquiryToInquiry(dbI: any): Inquiry {
  return {
    id: dbI.id,
    customerName: dbI.customer_name,
    customerPhone: dbI.customer_phone,
    cityName: dbI.city_name,
    vendorId: dbI.vendor_id,
    vendorName: dbI.vendor_name || "",
    vendorCategory: dbI.vendor_category || "",
    guestsCount: dbI.guests_count || 250,
    weddingDate: dbI.wedding_date,
    status: dbI.status || "new",
    notes: dbI.notes || "",
    totalBudget: dbI.total_budget || 0,
    timestamp: dbI.created_at ? new Date(dbI.created_at).toISOString().replace("T", " ").substring(0, 16) : ""
  };
}

export default function AdminCRM() {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [leads, setLeads] = useState<Inquiry[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "pipeline" | "approvals" | "chat">("pipeline");
  
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: "admin" | "user"; text: string; time: string }[]>([
    { id: "msg-1", sender: "user", text: "Hello! I wanted to verify the availability of the Vintage Cars in Ahmedabad for Nov 20th.", time: "14:32" },
    { id: "msg-2", sender: "admin", text: "Hi Rohan! Let me check with Ahmedabad Vintage Cars and get back to you.", time: "14:35" }
  ]);
  const [newChatText, setNewChatText] = useState("");
  
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingStatus, setSeedingStatus] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, activeTab]);

  const loadData = async () => {
    if (!supabase || !isSupabaseConfigured) return;
    try {
      const { data: dbVendors } = await supabase.from("vendors").select("*").order("created_at", { ascending: false });
      if (dbVendors) setVendors(dbVendors.map(mapDbVendorToVendor));

      const { data: dbInquiries } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
      if (dbInquiries) setLeads(dbInquiries.map(mapDbInquiryToInquiry));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      const savedVendors = localStorage.getItem("pmv_vendors");
      const savedLeads = localStorage.getItem("pmv_leads");
      if (savedVendors) setVendors(JSON.parse(savedVendors));
      if (savedLeads) setLeads(JSON.parse(savedLeads));
      return;
    }

    loadData();

    const client = supabase;
    const inquiriesChannel = client
      .channel("crm-inquiries")
      .on("postgres_changes", { event: "*", schema: "public", table: "inquiries" }, () => { loadData(); })
      .subscribe();

    const vendorsChannel = client
      .channel("crm-vendors")
      .on("postgres_changes", { event: "*", schema: "public", table: "vendors" }, () => { loadData(); })
      .subscribe();

    return () => {
      client.removeChannel(inquiriesChannel);
      client.removeChannel(vendorsChannel);
    };
  }, []);

  const handleSeedDatabase = async () => {
    if (!supabase) return;
    setIsSeeding(true);
    setSeedingStatus("Seeding Cities Table...");

    try {
      const citiesToInsert = CITIES.map(c => ({
        name: c.name,
        state: c.state,
        tagline: c.tagline,
        image_url: c.imageUrl,
        description: c.description,
        is_international: c.isInternational
      }));
      await supabase.from("cities").upsert(citiesToInsert, { onConflict: "name" });

      setSeedingStatus("Seeding Default Songs...");
      const songsToInsert = [
        { id: "song-1", title: "Kala Chashma (Hip Hop Mix)", votes_count: 124 },
        { id: "song-2", title: "Sajan Ji Ghar Aaye (Brass Mix)", votes_count: 88 },
        { id: "song-3", title: "Ajj Din چڑھya (Melodic Wind)", votes_count: 42 },
        { id: "song-4", title: "Aankh Marey (High tempo Dhol)", votes_count: 28 }
      ];
      await supabase.from("song_votes").upsert(songsToInsert, { onConflict: "id" });

      const formattedVendors = INITIAL_VENDORS.map(v => mapVendorToDbVendor({
        ...v,
        verified: true
      }));

      const batchSize = 80;
      for (let i = 0; i < formattedVendors.length; i += batchSize) {
        const batchNum = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(formattedVendors.length / batchSize);
        setSeedingStatus(`Seeding 954 Vendors (Batch ${batchNum}/${totalBatches})...`);
        await supabase.from("vendors").upsert(formattedVendors.slice(i, i + batchSize), { onConflict: "id" });
      }

      setSeedingStatus("Seeding Complete!");
      confetti({ particleCount: 150, spread: 80 });
      setTimeout(() => {
        setIsSeeding(false);
        loadData();
      }, 1500);
    } catch (e: any) {
      alert(`Seeding failed: ${e.message || e}`);
      setIsSeeding(false);
    }
  };

  const handleLaunchCity = async (cityName: string, state: string, tagline: string) => {
    if (!cityName.trim()) return;

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from("cities").upsert([{
          name: cityName,
          state: state || "India",
          tagline: tagline || "Discover processional vendor networks",
          image_url: "/images/hero_bg.png",
          description: "New strategically launched destination hub.",
          is_international: false
        }], { onConflict: "name" });

        const generatedVendors = generateVendorsForCity(cityName).map(mapVendorToDbVendor);
        await supabase.from("vendors").upsert(generatedVendors, { onConflict: "id" });

        confetti({ particleCount: 100, spread: 60 });
        alert(`City "${cityName}" launched successfully! Seeding completed for 159 verified suppliers.`);
        loadData();
      } catch (e: any) {
        alert(`Failed to launch city: ${e.message}`);
      }
    } else {
      const hasVendors = vendors.some((v) => v.city.toLowerCase() === cityName.toLowerCase());
      if (!hasVendors) {
        const newVendors = generateVendorsForCity(cityName);
        const updated = [...vendors, ...newVendors];
        setVendors(updated);
        localStorage.setItem("pmv_vendors", JSON.stringify(updated));
        confetti({ particleCount: 75, spread: 50 });
        alert(`City "${cityName}" launched locally with 159 mock suppliers.`);
      }
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: Inquiry["status"]) => {
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from("inquiries").update({ status: newStatus }).eq("id", leadId);
        loadData();
      } catch (e) {
        console.error(e);
      }
    } else {
      const updated = leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
      setLeads(updated);
      localStorage.setItem("pmv_leads", JSON.stringify(updated));
    }
  };

  const approveVendor = async (vendorId: string) => {
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from("vendors").update({ verified: true }).eq("id", vendorId);
        confetti({ particleCount: 65, spread: 50, colors: ["#b8860b", "#7c1c2b"] });
        loadData();
      } catch (e) {
        console.error(e);
      }
    } else {
      const updated = vendors.map(v => v.id === vendorId ? { ...v, verified: true } : v);
      setVendors(updated);
      localStorage.setItem("pmv_vendors", JSON.stringify(updated));
      confetti({ particleCount: 65, spread: 50, colors: ["#b8860b", "#7c1c2b"] });
    }
  };

  const rejectVendor = async (vendorId: string) => {
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from("vendors").delete().eq("id", vendorId);
        loadData();
      } catch (e) {
        console.error(e);
      }
    } else {
      const updated = vendors.filter(v => v.id !== vendorId);
      setVendors(updated);
      localStorage.setItem("pmv_vendors", JSON.stringify(updated));
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: "admin" as const,
      text: newChatText,
      time: new Date().toTimeString().substring(0, 5)
    };

    setChatMessages(prev => [...prev, userMsg]);
    setNewChatText("");

    setTimeout(() => {
      const responseMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: "user" as const,
        text: "Thank you for looking into this! We really appreciate the quick response from PlanMyBaraat support.",
        time: new Date().toTimeString().substring(0, 5)
      };
      setChatMessages(prev => [...prev, responseMsg]);
    }, 1500);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#1c1917] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-stone-950 text-white py-5 px-8 flex items-center justify-between border-b border-[#B8860B]/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#B8860B]/10 border border-[#B8860B]/40 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(184,134,11,0.2)] animate-pulse">
            <Sparkles className="h-4.5 w-4.5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-sm uppercase tracking-widest text-[#F5EBE0]">PlanMyBaraat Marketplace CRM</span>
              <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black tracking-wide uppercase ${
                isSupabaseConfigured 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}>
                {isSupabaseConfigured ? "Live DB Connect" : "Local Mode"}
              </span>
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">Wedding Vendor Directory Admin Control Console</span>
          </div>
        </div>
        <a href="/" className="px-4 py-2 border border-stone-850 hover:bg-stone-900 text-[#F5EBE0] font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
          Go To Directory Website &rarr;
        </a>
      </header>

      {/* Main CRM Body */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-grow w-full flex flex-col gap-6">
        
        {/* CRM Navigation Submenu */}
        <div className="bg-white border border-stone-200 p-3 rounded-2xl flex flex-wrap gap-2 shadow-sm">
          {[
            { id: "overview", label: "📊 Overview Stats" },
            { id: "pipeline", label: "🎯 Leads Pipeline" },
            { id: "approvals", label: "🛡️ Verification Hub" },
            { id: "chat", label: "💬 Support Desk Chat" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#7C1C2B] text-white shadow-sm"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Database setup banner */}
        {vendors.length === 0 && isSupabaseConfigured && !isSeeding && (
          <div className="bg-amber-500/[0.04] border border-[#B8860B]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-[#B8860B] shrink-0" />
              <div>
                <h4 className="font-serif font-black text-stone-900 text-sm">Supabase Schema Connected but Empty</h4>
                <p className="text-stone-550 text-[10px] mt-0.5">The database connections are verified. Populate all 954 mock vendor listings to seed the search catalog.</p>
              </div>
            </div>
            <button
              onClick={handleSeedDatabase}
              className="px-4 py-2 bg-[#B8860B] hover:bg-amber-600 text-stone-900 font-extrabold uppercase text-xs rounded-xl tracking-widest transition-all shrink-0 animate-pulse"
            >
              Seed Database
            </button>
          </div>
        )}

        {isSeeding && (
          <div className="bg-stone-950 text-white rounded-2xl p-6 text-center space-y-3 shadow-lg border border-[#B8860B]/20">
            <RefreshCw className="h-8 w-8 text-amber-500 animate-spin mx-auto" />
            <h4 className="font-serif font-black text-sm uppercase tracking-widest text-[#F5EBE0]">Seeding Database...</h4>
            <p className="text-stone-400 text-[10px] font-mono">{seedingStatus}</p>
          </div>
        )}

        {/* CRM SUB-TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#B8860B]" />
                <span className="text-[9px] uppercase tracking-widest text-stone-400 block font-bold">Total Platform Leads</span>
                <div className="flex justify-between items-center mt-2">
                  <h3 className="font-serif font-black text-3xl text-stone-900">{leads.length}</h3>
                  <div className="h-9 w-9 bg-amber-500/5 rounded-xl flex items-center justify-center text-amber-600"><Users className="h-4.5 w-4.5" /></div>
                </div>
              </div>

              <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#7C1C2B]" />
                <span className="text-[9px] uppercase tracking-widest text-stone-400 block font-bold">Pipeline Valuation</span>
                <div className="flex justify-between items-center mt-2">
                  <h3 className="font-serif font-black text-3xl text-[#7C1C2B]">{formatPrice(leads.reduce((s,l) => s + (l.totalBudget || 0), 0))}</h3>
                  <div className="h-9 w-9 bg-rose-500/5 rounded-xl flex items-center justify-center text-rose-600"><DollarSign className="h-4.5 w-4.5" /></div>
                </div>
              </div>

              <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600" />
                <span className="text-[9px] uppercase tracking-widest text-stone-400 block font-bold">Active Listings Directory</span>
                <div className="flex justify-between items-center mt-2">
                  <h3 className="font-serif font-black text-3xl text-stone-900">{vendors.filter(v => v.verified !== false).length}</h3>
                  <div className="h-9 w-9 bg-emerald-500/5 rounded-xl flex items-center justify-center text-emerald-600"><Building className="h-4.5 w-4.5" /></div>
                </div>
              </div>

              <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
                <span className="text-[9px] uppercase tracking-widest text-stone-400 block font-bold">Booked Conversion Rate</span>
                <div className="flex justify-between items-center mt-2">
                  <h3 className="font-serif font-black text-3xl text-emerald-800">
                    {leads.length > 0 ? Math.round((leads.filter(l => l.status === "booked").length / leads.length) * 100) : 0}%
                  </h3>
                  <div className="h-9 w-9 bg-blue-500/5 rounded-xl flex items-center justify-center text-blue-650"><CheckCircle2 className="h-4.5 w-4.5" /></div>
                </div>
              </div>
            </div>

            {/* Geographical Launcher */}
            <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-card space-y-5">
              <div>
                <h3 className="font-serif font-black text-base text-stone-900">Geographical City Launcher</h3>
                <p className="text-[10px] text-stone-400 mt-0.5">Input a new region location target and click launch. System automatically creates a directory and seeds 159 verified mock vendor listings.</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const nameInput = form.elements.namedItem("cityName") as HTMLInputElement;
                  const stateInput = form.elements.namedItem("stateName") as HTMLInputElement;
                  const tagInput = form.elements.namedItem("tagline") as HTMLInputElement;
                  handleLaunchCity(nameInput.value, stateInput.value, tagInput.value);
                  nameInput.value = "";
                  stateInput.value = "";
                  tagInput.value = "";
                }}
                className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                <div className="space-y-1 text-left">
                  <label className="text-[9px] uppercase font-bold text-stone-455 tracking-wider">City Name</label>
                  <input name="cityName" type="text" placeholder="e.g. Udaipur" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold" required />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[9px] uppercase font-bold text-stone-455 tracking-wider">State Region</label>
                  <input name="stateName" type="text" placeholder="e.g. Rajasthan" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold" required />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[9px] uppercase font-bold text-stone-455 tracking-wider">Marketing Tagline</label>
                  <input name="tagline" type="text" placeholder="e.g. The Lake City" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold" required />
                </div>
                <button type="submit" className="w-full py-2 bg-[#7C1C2B] hover:bg-rose-900 text-white font-extrabold uppercase rounded-xl text-xs tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 h-10">
                  <Plus className="h-4 w-4" /> Launch City
                </button>
              </form>
            </div>

            {/* City database report */}
            <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-card space-y-4">
              <h3 className="font-serif font-black text-base text-stone-900">Geographical Database Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[
                  { name: "Delhi-NCR", count: vendors.filter(v => v.city === "Delhi-NCR").length },
                  { name: "Mumbai", count: vendors.filter(v => v.city === "Mumbai").length },
                  { name: "Ahmedabad", count: vendors.filter(v => v.city === "Ahmedabad").length },
                  { name: "Surat", count: vendors.filter(v => v.city === "Surat").length },
                  { name: "Vadodara", count: vendors.filter(v => v.city === "Vadodara").length },
                  { name: "Bengaluru", count: vendors.filter(v => v.city === "Bengaluru").length }
                ].map((city) => (
                  <div key={city.name} className="bg-stone-50 border border-stone-150 p-4 rounded-2xl text-center">
                    <span className="text-[10px] font-bold text-stone-450 uppercase">{city.name}</span>
                    <h4 className="text-xl font-black text-stone-900 mt-1.5">{city.count}</h4>
                    <span className="text-[8px] text-emerald-700 font-bold block mt-1">Seeded Verified</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CRM SUB-TAB: PIPELINE */}
        {activeTab === "pipeline" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 shrink-0">
            {(["new", "contacted", "negotiation", "booked", "lost"] as const).map((status) => {
              const columnLeads = leads.filter(l => l.status === status);
              return (
                <div key={status} className="bg-stone-100/60 border border-stone-200 p-4 rounded-2xl min-w-[245px] flex flex-col gap-3.5 min-h-[500px]">
                  <div className="flex justify-between items-center border-b border-stone-200 pb-2 select-none">
                    <span className="text-[10.5px] uppercase font-bold text-stone-700 tracking-wider">
                      {status === "new" ? "📥 New Inquiries" :
                       status === "contacted" ? "📞 Contacted" :
                       status === "negotiation" ? "🤝 Negotiating" :
                       status === "booked" ? "✅ Booked" :
                       "❌ Lost Deal"}
                    </span>
                    <span className="bg-stone-200 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{columnLeads.length}</span>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[460px] scrollbar-none">
                    {columnLeads.map((lead) => (
                      <div key={lead.id} className="bg-white border border-stone-200 p-3.5 rounded-xl shadow-xs space-y-2.5 hover:border-[#B8860B]/40 transition-all duration-300 text-left">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-[11px] font-extrabold text-stone-900 leading-tight">{lead.customerName}</h4>
                          <span className="text-[8px] bg-stone-50 border border-stone-150 px-1.5 py-0.5 rounded text-stone-500 font-bold shrink-0">{lead.cityName}</span>
                        </div>
                        <div className="text-[9.5px] text-stone-500 space-y-1">
                          <div className="truncate"><strong>Service:</strong> {lead.vendorName}</div>
                          <div><strong>Guests:</strong> {lead.guestsCount} • <strong>Date:</strong> {lead.weddingDate}</div>
                          <div><strong>Outflow:</strong> <span className="text-amber-800 font-extrabold">{formatPrice(lead.totalBudget || 0)}</span></div>
                        </div>
                        <p className="text-[9px] text-stone-400 line-clamp-2 leading-tight italic bg-stone-50 p-2 rounded-lg border border-stone-100">&ldquo;{lead.notes}&rdquo;</p>
                        <div className="flex flex-wrap gap-1 border-t border-stone-100 pt-2.5">
                          {status === "new" && (
                            <button onClick={() => updateLeadStatus(lead.id, "contacted")} className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[8.5px] uppercase font-bold rounded-lg transition-colors">
                              Contacted
                            </button>
                          )}
                          {status === "contacted" && (
                            <button onClick={() => updateLeadStatus(lead.id, "negotiation")} className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[8.5px] uppercase font-bold rounded-lg transition-colors">
                              Negotiate
                            </button>
                          )}
                          {status === "negotiation" && (
                            <button onClick={() => updateLeadStatus(lead.id, "booked")} className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[8.5px] uppercase font-bold rounded-lg transition-colors">
                              Booked
                            </button>
                          )}
                          {status !== "booked" && status !== "lost" && (
                            <button onClick={() => updateLeadStatus(lead.id, "lost")} className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-[8.5px] uppercase font-bold rounded-lg transition-colors">
                              Lost
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CRM SUB-TAB: VENDOR APPROVALS */}
        {activeTab === "approvals" && (
          <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-card space-y-4">
            <h2 className="font-serif font-black text-xl text-[#1c1917] border-b border-stone-100 pb-3">New Vendor Verification Hub</h2>
            
            {vendors.filter(v => v.verified === false).length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Shield className="h-9 w-9 text-stone-300 mx-auto" />
                <h4 className="text-xs font-extrabold text-stone-455 uppercase tracking-widest">Verification Pipeline Clear</h4>
                <p className="text-[10px] text-stone-400 max-w-xs mx-auto">Go to the website portal and register a new vendor listing to test approvals.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendors.filter(v => v.verified === false).map((pending) => (
                  <div key={pending.id} className="border border-stone-150 p-5 rounded-2xl space-y-3 bg-[#FCFBF9] hover:shadow-sm transition-all duration-300">
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-amber-700 font-extrabold bg-amber-50 px-2 py-0.5 rounded">{pending.category}</span>
                        <h4 className="font-serif font-extrabold text-base text-stone-900 mt-1">{pending.name}</h4>
                        <span className="text-[10px] text-stone-400 block mt-0.5">Located: {pending.city} • Contact: {pending.contact}</span>
                      </div>
                      <span className="text-[9px] font-bold text-red-800 bg-red-50 border border-red-200 rounded px-2 py-0.5">Unverified</span>
                    </div>
                    <p className="text-xs text-stone-600 bg-white p-3 rounded-lg border border-stone-150 leading-relaxed italic">&ldquo;{pending.description}&rdquo;</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveVendor(pending.id)}
                        className="py-2 px-3 bg-emerald-800 hover:bg-[#0B4F35] text-white font-extrabold uppercase rounded-xl text-[10px] flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve &amp; Publish
                      </button>
                      <button
                        onClick={() => rejectVendor(pending.id)}
                        className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold uppercase rounded-xl text-[10px] flex items-center gap-1.5 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" /> Reject Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CRM SUB-TAB: LIVE SUPPORT CHAT */}
        {activeTab === "chat" && (
          <div className="bg-white border border-stone-200 rounded-2xl shadow-card overflow-hidden flex flex-col h-[500px]">
            <div className="bg-[#7C1C2B] p-4.5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#B8860B] fill-current" />
                <span className="font-serif font-bold text-sm tracking-wide">Platform Support Desk</span>
              </div>
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white animate-pulse" title="System online"></div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FCFBF9]">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3.5 rounded-2xl space-y-1.5 shadow-sm ${
                    msg.sender === "admin" 
                      ? "bg-[#7C1C2B] text-white rounded-tr-none text-right" 
                      : "bg-white border border-stone-200 text-stone-850 rounded-tl-none"
                  }`}>
                    <p className="text-xs leading-relaxed font-semibold">{msg.text}</p>
                    <span className="text-[8px] text-stone-300 block">{msg.time}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendChatMessage} className="p-3 bg-stone-50 border-t border-stone-155 flex gap-2 shrink-0">
              <input
                type="text"
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
                placeholder="Type support response..."
                className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-850 focus:outline-none focus:border-[#B8860B]"
              />
              <button
                type="submit"
                className="h-9 w-9 bg-[#B8860B] text-stone-900 rounded-xl flex items-center justify-center hover:bg-amber-600 transition-all hover:scale-105 shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
