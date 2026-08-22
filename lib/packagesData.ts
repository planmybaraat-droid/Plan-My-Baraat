export interface PackageHighlight {
  icon: string;
  heading: string;
  body: string;
}

export interface PackageFaq {
  q: string;
  a: string;
}

export interface BaraatPackage {
  id: string;
  name: string;
  shortName: string;
  number: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
  custom?: boolean;
  // Combined flat list — used anywhere a single scrollable checklist is
  // shown (package cards, city/keyword landing pages, etc).
  features: string[];
  // The two source lists from the official package flyer, kept separate so
  // the full package page can present them exactly as designed: fixed
  // must-haves vs. experiences the couple chooses per event.
  essentials: string[];
  selectableExperiences: string[];
  support: string[];
  longDescription: string;
  bestFor: string[];
  highlights: PackageHighlight[];
  faqs: PackageFaq[];
  pdfUrl: string;
}

// PlanMyBaraat now offers one all-inclusive package instead of four separate
// tiers — everything below is transcribed directly from the official
// "Our Signature Offering" flyer (PLANMYBARAAT_FINAL_PACKAGE.pdf).
export const SIGNATURE_PACKAGE: BaraatPackage = {
  id: "signature-offering",
  name: "Signature Offering",
  shortName: "Signature Offering",
  number: "01",
  tagline: "Perfect for a Custom & Extraordinary Baraat",
  description:
    "One all-inclusive Baraat production: a full choice of DJ trucks, royal groom entry, premium sound, live dhol, Chhatris, effects and a dedicated 30-50 member execution team — with selectable experiences to make it entirely yours.",
  image: "/Assests/packages/signature-v2.png",
  imageAlt: "PlanMyBaraat Signature Offering royal Baraat production",
  featured: true,
  features: [
    "Baraat on Wheels - Mini American DJ Truck, Max American DJ Truck, Flex Baraat or Thar",
    "Groom Entry - Vintage car, Baggi or Horse",
    "Premium Sound - RCF or JBL",
    "Dhol - Punjabi, Nashik, Puneri or Rajasthani",
    "Royal Chatris",
    "Moving LED Panels",
    "Liquid CO2 Guns",
    "Confetti",
    "Pyro Hand Guns",
    "Safas & Tying Team",
    "Brass Band - 11 Members",
    "ATV Bike",
    "Carnival Artist",
    "Gorilla Artist",
    "Name Boards",
    "Custom Hashtags",
    "Hyper / Anchor",
    "Darbuka Artist",
    "Colour Blast",
    "Paper Blast / Flower Blast",
    "Bouncers",
    "Regional / International Dancers",
    "Reel Creator",
  ],
  essentials: [
    "Baraat on Wheels - Mini American DJ Truck, Max American DJ Truck, Flex Baraat or Thar",
    "Groom Entry - Vintage car, Baggi or Horse",
    "Premium Sound - RCF or JBL",
    "Dhol - Punjabi, Nashik, Puneri or Rajasthani",
    "Royal Chatris",
    "Moving LED Panels",
    "Liquid CO2 Guns",
    "Confetti",
    "Pyro Hand Guns",
    "Safas & Tying Team",
  ],
  selectableExperiences: [
    "Brass Band - 11 Members",
    "ATV Bike",
    "Carnival Artist",
    "Gorilla Artist",
    "Name Boards",
    "Custom Hashtags",
    "Hyper / Anchor",
    "Darbuka Artist",
    "Colour Blast",
    "Paper Blast / Flower Blast",
    "Bouncers",
    "Regional / International Dancers",
    "Reel Creator",
  ],
  support: [
    "Dedicated on-ground PMB team of 30-50 execution members",
    "1 Dedicated Manager",
    "1 Assistant Manager",
  ],
  longDescription: `Our Signature Offering brings everything a Baraat needs into one coordinated production. Every event starts from the same set of essentials — your choice of Baraat on Wheels (Mini American DJ Truck, Max American DJ Truck, Flex Baraat or Thar), a groom entry in a vintage car, Baggi or on horseback, premium RCF or JBL sound, moving LED panels, live dhol, royal Chatris, Liquid CO2, confetti, pyro hand guns and a professional Safas & tying team.

From there, the celebration is shaped entirely around you. Selectable experiences — a full 11-member brass band, ATV bike entry, carnival and gorilla artists, personalized name boards and hashtags, a hype anchor, Darbuka artist, colour or paper/flower blast, professional bouncers, regional or international dancers and a dedicated reel creator — are added exactly where your event calls for them.

Every Baraat is run on the ground by a dedicated PMB team of 30 to 50 execution members, led by one dedicated manager and one assistant manager, so your family can enjoy the procession instead of coordinating it.`,
  bestFor: [
    "Families who want one premium foundation instead of comparing tiers",
    "Celebrations that want to hand-pick their own selectable experiences",
    "Baraats of any scale — the truck, dhol count and effects flex to your event",
    "Anyone who wants a dedicated on-ground team managing the entire procession",
  ],
  highlights: [
    { icon: "🚚", heading: "Choose Your Baraat on Wheels", body: "Mini American DJ Truck, Max American DJ Truck, Flex Baraat or Thar — sized to your route and guest count." },
    { icon: "🎭", heading: "Selectable Experiences", body: "Brass band, artists, dancers, blasts and a reel creator — pick exactly what fits your celebration." },
    { icon: "🤝", heading: "30-50 Member Execution Team", body: "A dedicated manager and assistant manager run the ground team so your family can just celebrate." },
  ],
  faqs: [
    { q: "How can we get a quote for the Signature Offering?", a: "Message us on WhatsApp with your event date, city, venue and guest count. We will confirm availability and share a clear, event-specific quote." },
    { q: "Which Baraat on Wheels and groom entry can we select?", a: "You can choose one Baraat on Wheels option (Mini American DJ Truck, Max American DJ Truck, Flex Baraat or Thar) and one groom entry (vintage car, Baggi or horse), subject to availability for your date and city." },
    { q: "How do the selectable experiences work?", a: "The essentials are included in every Baraat. From the selectable experiences list — brass band, ATV bike, artists, name boards, blasts, bouncers, dancers, reel creator and more — you choose the ones that match your celebration, and we build them into your quote." },
    { q: "How large is the on-ground team?", a: "Every Signature Offering Baraat is supported by 30 to 50 dedicated execution members, plus one dedicated manager and one assistant manager who run the procession end to end." },
  ],
  pdfUrl: "/downloads/planmybaraat-signature-package.pdf",
};

// Kept as an array (with a single entry) so every existing consumer that
// expects a list — package cards, dropdown selects, location/keyword
// landing pages — keeps working unchanged now that there is one package.
export const BARAAT_PACKAGES: BaraatPackage[] = [SIGNATURE_PACKAGE];
