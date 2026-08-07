"use client";

import { useEffect, useRef, useState } from "react";

type RevealVariant = "up" | "left" | "scale";

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
}

const HIDDEN_TRANSFORM: Record<RevealVariant, string> = {
  up: "translateY(28px)",
  left: "translateX(-28px)",
  scale: "scale(0.94)",
};

export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) translateX(0) scale(1)" : HIDDEN_TRANSFORM[variant],
        transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: `${delay * 90}ms`,
      }}
    >
      {children}
    </div>
  );
}
