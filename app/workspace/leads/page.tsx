'use client';

import { useEffect, useState } from 'react';
import { UserSearch, Phone, Mail, ChevronDown } from 'lucide-react';
import CrmHeader from '../../crm/components/CrmHeader';
import { useSidebar } from '../../crm/sidebar-context';
import { getLeads, getNotes } from '../../crm/lib/supabase-crm';
import NotesTimeline from '../../crm/components/NotesTimeline';
import type { CustomerLead, Note } from '../../crm/lib/types';

const STATUS_STYLE: Record<string, string> = { new: 'bg-blue-50 text-blue-700', contacted: 'bg-amber-50 text-amber-700', negotiation: 'bg-purple-50 text-purple-700', booked: 'bg-emerald-50 text-emerald-700', lost: 'bg-gray-100 text-gray-500' };

export default function MyLeadsPage() {
  const { open } = useSidebar();
  const [leads, setLeads] = useState<CustomerLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => { getLeads().then(setLeads).finally(() => setLoading(false)); }, []);

  const toggle = async (lead: CustomerLead) => {
    if (expanded === lead.id) { setExpanded(null); return; }
    setExpanded(lead.id);
    setNotes(await getNotes('lead', lead.id));
  };

  return (
    <>
      <CrmHeader title="My Leads" subtitle={`${leads.length} leads assigned to you`} onMenuClick={open} notificationsHref="/workspace/notifications" />
      <div className="p-4 sm:p-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex h-60 items-center justify-center"><span className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" /></div>
          ) : !leads.length ? (
            <div className="px-6 py-20 text-center"><UserSearch className="mx-auto text-red-600" size={28} /><p className="mt-4 font-black">No leads assigned yet</p><p className="mt-1 text-sm text-gray-400">When your admin assigns you a lead, it&apos;ll show up here instantly.</p></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <div key={lead.id}>
                  <button onClick={() => toggle(lead)} className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left hover:bg-gray-50 sm:px-6">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900">{lead.customer_name}</p>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Phone size={11} /> {lead.mobile}</span>
                        {lead.email && <span className="flex items-center gap-1"><Mail size={11} /> {lead.email}</span>}
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${STATUS_STYLE[lead.status] || 'bg-gray-100 text-gray-600'}`}>{lead.status}</span>
                    <ChevronDown size={16} className={`flex-shrink-0 text-gray-400 transition-transform ${expanded === lead.id ? 'rotate-180' : ''}`} />
                  </button>
                  {expanded === lead.id && (
                    <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-4 sm:px-6">
                      {lead.requirement && <p className="mb-3 text-sm text-gray-600">{lead.requirement}</p>}
                      <NotesTimeline notes={notes} entityType="lead" entityId={lead.id} onNotesChange={setNotes} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
