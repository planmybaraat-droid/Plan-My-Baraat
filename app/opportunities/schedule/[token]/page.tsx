import type { Metadata } from 'next';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import ScheduleInterview from './ScheduleInterview';
export const metadata: Metadata = { title: 'Schedule interview | Plan My Baraat', robots: { index: false, follow: false } };
export default async function SchedulePage({ params }: { params: Promise<{ token: string }> }) { const { token } = await params; return <div className="inner-public-page flex min-h-screen flex-col bg-white font-sans text-[#010101]"><SiteHeader variant="contact"/><main className="flex-grow"><ScheduleInterview token={token}/></main><SiteFooter variant="contact"/></div>; }
