"use client";

import React from "react";
import { FadeUp } from "./HomeClient";
import FAQAccordion from "./FAQAccordion";

export default function HomeSeoContentSection() {
  const faqs = [
    {
      question: "What is a complete baraat package?",
      answer: "A complete baraat package wraps all the essential elements of a groom's entry into a single coordinated booking. This includes our custom double-decker DJ truck with a live DJ, sound and light systems, professional dhol players, a vintage car or carriage for the groom, and turban tying for the group. By bundling these together, we ensure flawless timing and eliminate coordination issues.",
    },
    {
      question: "Do you serve cities outside Vadodara?",
      answer: "Yes, we serve all major cities in Gujarat, including Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, Bhavnagar, Jamnagar, Junagadh, Anand, Mehsana, Bharuch, Navsari, Valsad, and Vapi. For destination weddings outside Gujarat, please get in touch on WhatsApp to discuss travel and logistics.",
    },
    {
      question: "How early should we book our baraat package?",
      answer: "During the busy Gujarat wedding season (November to February), we recommend booking at least 3 to 4 weeks in advance. Because we own our fleet of DJ trucks, slots for popular dates fill up quickly. Outside the peak season, a week or two is usually sufficient.",
    },
    {
      question: "How do you handle noise curfews and local regulations?",
      answer: "We are highly experienced with local curfews, especially in residential areas of Vadodara, Surat, and Ahmedabad. When you share your venue details, we plan the procession schedule to ensure all loud elements (like dhol and high-volume DJ sound) are completed before the curfew starts.",
    },
    {
      question: "Is the vintage car decorated?",
      answer: "Yes, the vintage car or baggi included in our packages comes with standard floral decorations appropriate for the groom's entry. If you have specific floral decoration themes or color preferences, please let us know so we can align it with your overall wedding decor.",
    },
    {
      question: "How many turbans (safas) does the safa team tie?",
      answer: "Our packages cover turban tying for the groom and the main baraati group (typically up to 20-30 guests depending on the tier). If you have a larger group requiring turbans, we can easily add extra safa artists to your booking for a small additional fee.",
    },
  ];

  return (
    <section className="bg-[#F8F4EE] border-y border-black/8 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-12">
        <FadeUp className="space-y-4 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#9F1239]">
            Professional Baraat Management
          </span>
          <h2 className="font-serif text-3xl font-black tracking-wide text-black md:text-5xl">
            Gujarat&apos;s Premier End-to-End Wedding Procession Service
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-black/60 sm:text-base">
            Everything your wedding entry needs — double-decker DJ trucks, live DJs, high-energy dhol artists, classic vintage cars, and safa tying — managed by one professional team.
          </p>
        </FadeUp>

        <div className="space-y-8 text-[0.95rem] leading-relaxed text-black/70">
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-black text-black">
              1. What is the Baraat on Wheels Concept?
            </h3>
            <p>
              Baraat on Wheels represents the modern evolution of the traditional Indian wedding procession. In the past, families had to coordinate with multiple independent vendors: renting a generator truck, hiring a DJ, finding a dhol group, arranging a vintage car, and booking a turban stylist. On a busy wedding day, this often led to delays, communication gaps, and logistical stress.
            </p>
            <p>
              Our concept brings all these elements under a single, highly coordinated booking. When you book PlanMyBaraat, you deal with a single coordinator who manages the entire timeline. Our custom-built double-decker DJ trucks arrive fully equipped, the dhol team is synced with the DJ, the vintage car is positioned on schedule, and the safa team finishes styling before the procession begins.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-xl font-black text-black">
              2. Custom Procession Packages for Every Budget
            </h3>
            <p>
              Every family has a unique vision for their celebration. We have structured four distinct packages—Raj Tilak, Rajwada, Maharaja, and Signature—designed to scale from elegant, intimate entries to grand street-filling spectacles.
            </p>
            <p>
              The Raj Tilak package is perfect for smaller groups, offering a high-quality sound truck, live DJ, 2 dhol players, chhatri lights, a classic vintage car, and turban styling. The Maharaja package adds dynamic moving LED panels showing the groom&apos;s name in lights and a 6-dhol setup. For the ultimate entry, the Signature package includes a premium American vintage car, cold pyro effects, confetti cannons, and a dedicated security bouncers team.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-xl font-black text-black">
              3. Our 3-Generation Legacy of Wedding Coordination
            </h3>
            <p>
              PlanMyBaraat is managed by Ronak, who also serves as the CEO and Director of Safawala.com. Our family has been involved in Gujarat&apos;s wedding industry for three generations. This isn&apos;t just a business for us; it is a family craft.
            </p>
            <p>
              Because we own our fleet of DJ trucks and maintain long-term relationships with our artists, we deliver consistent quality. We do not outsource our bookings to third-party sub-contractors. The crew that arrives on your wedding day consists of professionals who work together regularly and know how to deliver a safe, high-energy show.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-xl font-black text-black">
              4. Practical Planning Tips for a Flawless Entry
            </h3>
            <p>
              To ensure a perfect procession, we recommend setting a realistic timeline. Safa tying typically takes about 60 to 75 minutes for a group of 20-30 guests, and should be completed before the dhol begins.
            </p>
            <p>
              Additionally, please share the exact route and venue gate dimensions. Our double-decker DJ trucks require vertical clearance, so checking for low-hanging power lines or arches along the route is an essential step. Our team is happy to assist you in assessing the route beforehand.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-xl font-black text-black">
              5. Local Expertise & Curfew Compliance
            </h3>
            <p>
              We are deeply familiar with the venues and regulations in all major Gujarat cities. Whether you are hosting a wedding on Ahmedabad&apos;s SG Highway, Surat&apos;s Vesu lawns, or in Vadodara&apos;s residential pockets like Gotri or Nizampura, we know the local curfews.
            </p>
            <p>
              If your venue has strict noise limits after 10 PM, we structure the timeline so that all loud sound and pyro effects are completed on schedule, ensuring your celebration is both spectacular and fully compliant.
            </p>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-6 border-t border-black/8 pt-12">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#9F1239]">
              Common Questions
            </span>
            <h3 className="mt-2 font-serif text-2xl font-black text-black">
              Frequently Asked Questions
            </h3>
          </div>
          <FAQAccordion
            faqs={faqs.map((f) => ({ question: f.question, answer: f.answer }))}
          />
        </div>
      </div>
    </section>
  );
}
