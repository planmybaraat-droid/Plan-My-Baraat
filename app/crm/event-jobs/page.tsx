'use client';
import CrmHeader from '../components/CrmHeader';
import EventJobsList from '../components/EventJobsList';
import { useSidebar } from '../sidebar-context';
export default function EventJobsPage(){const {open}=useSidebar();return <><CrmHeader title="Event Jobs" subtitle="Confirmed bookings, workflow progress and operational ownership" onMenuClick={open}/><EventJobsList portal="crm"/></>}
