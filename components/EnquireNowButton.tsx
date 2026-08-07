"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import LeadCaptureForm from "./LeadCaptureForm";

interface EnquireNowButtonProps {
  packageName?: string;
  className?: string;
  children: React.ReactNode;
}

export default function EnquireNowButton({
  packageName,
  className,
  children,
}: EnquireNowButtonProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={packageName ? `Enquire about ${packageName}` : "Enquire now"}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black/60 shadow-md transition-colors hover:bg-white hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>
            <LeadCaptureForm variant="hero" defaultPackage={packageName ?? ""} />
          </div>
        </div>
      ) : null}
    </>
  );
}
