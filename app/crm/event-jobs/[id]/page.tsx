'use client';
import { useParams } from 'next/navigation';
import CrmHeader from '../../components/CrmHeader';
import EventJobTracker from '../../components/EventJobTracker';
import { useSidebar } from '../../sidebar-context';
export default function EventJobPage(){const {open}=useSidebar();const {id}=useParams<{id:string}>();return <><CrmHeader title="Job Tracker" subtitle="Connected event operations workflow" onMenuClick={open}/><EventJobTracker id={id} portal="crm"/></>}
