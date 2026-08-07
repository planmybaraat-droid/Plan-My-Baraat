"use client";

import React, { useState } from "react";
import type { FAQ } from "@/lib/seoHelpers";

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className={`faq-item${isOpen ? " open" : ""}`}>
            <button
              className="faq-question"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              id={`faq-q-${idx}`}
              aria-controls={`faq-a-${idx}`}
            >
              <span>{faq.question}</span>
              <svg
                className="faq-chevron"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              id={`faq-a-${idx}`}
              role="region"
              aria-labelledby={`faq-q-${idx}`}
              className={`faq-answer${isOpen ? " open" : ""}`}
            >
              {faq.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
