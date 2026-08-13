'use client';
import { useParams } from 'next/navigation';
import EventJobTracker from '../../../crm/components/EventJobTracker';
export default function WorkspaceEventJobPage(){const {id}=useParams<{id:string}>();return <div><div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6"><h1 className="text-lg font-black text-gray-950">Job Tracker</h1><p className="mt-0.5 text-xs text-gray-400">Full workflow visibility with assignment-controlled actions</p></div><EventJobTracker id={id} portal="workspace"/></div>}
