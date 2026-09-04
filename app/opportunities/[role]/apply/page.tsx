import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { findOpportunity } from "../../opportunities-data";
import RoleApplicationForm from "./RoleApplicationForm";

export const metadata: Metadata = { title: "Apply | Careers", robots: { index: false, follow: true } };

export default async function ApplyPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: roleId } = await params;
  const role = findOpportunity(roleId);
  if (!role) notFound();
  return <div className="opportunities-page inner-public-page relative flex min-h-screen flex-col bg-white font-sans text-[#010101]"><SiteHeader variant="contact"/><main className="flex-grow"><RoleApplicationForm role={role}/></main><SiteFooter variant="contact"/></div>;
}
