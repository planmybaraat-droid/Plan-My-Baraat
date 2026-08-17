"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export default function ConversionTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (/^\/(crm|workspace|admin)(\/|$)/.test(pathname)) return;

    function push(type: string, destination?: string) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "pmb_conversion",
        conversion_type: type,
        page_path: window.location.pathname,
        link_destination: destination,
      });
    }

    function onClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (href.includes("wa.me/") || href.includes("api.whatsapp.com/")) {
        push("whatsapp_click", "whatsapp");
      } else if (href.startsWith("tel:")) {
        push("phone_click", "phone");
      }
    }

    function onSubmit(event: SubmitEvent) {
      const form = event.target as HTMLFormElement | null;
      if (!form) return;
      push(form.dataset.conversionType || "website_form_submit", "form");
    }

    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit);
    };
  }, [pathname]);

  return null;
}
