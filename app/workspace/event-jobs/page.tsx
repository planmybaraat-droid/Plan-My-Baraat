'use client';
import EventJobsList from '../../crm/components/EventJobsList';
export default function WorkspaceEventJobsPage(){return <div><div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6"><h1 className="text-lg font-black text-gray-950">Event Jobs</h1><p className="mt-0.5 text-xs text-gray-400">All active event workflows. Update workflow stages and service status.</p></div><EventJobsList portal="workspace"/></div>}
