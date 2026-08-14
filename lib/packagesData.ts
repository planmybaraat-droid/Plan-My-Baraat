export interface PackageHighlight {
  icon: string;
  heading: string;
  body: string;
}

export interface PackageFaq {
  q: string;
  a: string;
}

export type PackageComparisonKey =
  | "djTruck"
  | "groomEntry"
  | "sound"
  | "ledPanel"
  | "dhol"
  | "chhatri"
  | "liquidCo2"
  | "confetti"
  | "pyro"
  | "host"
  | "performer"
  | "nameBoards"
  | "bouncers"
  | "addOns"
  | "safas";

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
  features: string[];
  comparison: Record<PackageComparisonKey, string>;
  longDescription: string;
  bestFor: string[];
  highlights: PackageHighlight[];
  faqs: PackageFaq[];
}

export interface PackageComparisonGroup {
  title: string;
  rows: { key: PackageComparisonKey; label: string }[];
}

export const PACKAGE_COMPARISON_GROUPS: PackageComparisonGroup[] = [
  {
    title: "Package foundation",
    rows: [
      { key: "djTruck", label: "DJ truck" },
      { key: "groomEntry", label: "Groom entry choice" },
      { key: "sound", label: "Sound experience" },
      { key: "ledPanel", label: "Moving LED panel" },
    ],
  },
  {
    title: "Music & royal formation",
    rows: [
      { key: "dhol", label: "Punjabi dhol" },
      { key: "chhatri", label: "Royal Chhatri lights" },
      { key: "safas", label: "Safa package" },
    ],
  },
  {
    title: "Effects & entertainment",
    rows: [
      { key: "liquidCo2", label: "Liquid CO2 gun" },
      { key: "confetti", label: "Confetti effect" },
      { key: "pyro", label: "Pyro guns" },
      { key: "host", label: "Hype host / anchor" },
      { key: "performer", label: "Gorilla entertainer" },
    ],
  },
  {
    title: "Personalization & support",
    rows: [
      { key: "nameBoards", label: "Personalized name boards" },
      { key: "bouncers", label: "Professional bouncers" },
      { key: "addOns", label: "Optional add-ons" },
    ],
  },
];

const included = "Included";
const customChoice = "Customized to your event";

export const BARAAT_PACKAGES: BaraatPackage[] = [
  {
    id: "raj-tilak",
    name: "Raj Tilak Package",
    shortName: "Raj Tilak",
    number: "01",
    tagline: "The Essential Royal Entry",
    description:
      "A complete premium Baraat foundation with a mini DJ truck, JBL sound, live dhol, royal lighting, effects and Safas for up to 31 guests.",
    image: "/Assests/packages/raj-tilak-premium.jpeg",
    imageAlt: "Raj Tilak royal groom entry experience",
    features: [
      "Mini DJ Truck - Compact mobile celebration setup",
      "Groom Entry Choice - Vintage car, Baggi or horse",
      "JBL Premium Sound - Clear, high-energy outdoor audio",
      "Moving LED Panel - Dynamic visuals throughout the procession",
      "2 Punjabi Dhol - Live traditional rhythm",
      "6 Royal Chhatri Lights - Illuminated ceremonial formation",
      "Liquid CO2 Gun - High-impact entry effect",
      "12 Pyro Guns - Coordinated celebration highlights",
      "Professional Safa Team - Styling for up to 31 Safas",
    ],
    comparison: {
      djTruck: "Mini DJ Truck",
      groomEntry: "Vintage car / Baggi / Horse",
      sound: "JBL premium sound",
      ledPanel: included,
      dhol: "2 Punjabi Dhol",
      chhatri: "6 Royal Chhatris",
      liquidCo2: included,
      confetti: "—",
      pyro: "12 Pyro Guns",
      host: "—",
      performer: "—",
      nameBoards: "—",
      bouncers: "—",
      addOns: "Available on request",
      safas: "Up to 31 Safas",
    },
    longDescription: `Raj Tilak is designed for families who want the complete Baraat experience in a focused, premium format. A mini DJ truck with JBL sound and a moving LED panel drives the celebration, while two Punjabi dhol players and six illuminated Chhatris create the traditional royal formation.

The groom can enter in a vintage car, Baggi or on horseback. A Liquid CO2 effect and 12 coordinated pyro guns add visual impact at planned moments, while the professional Safa team prepares up to 31 guests before the procession begins.`,
    bestFor: [
      "Intimate to mid-sized Baraats",
      "Families wanting all essential services in one package",
      "Venues with compact approach roads",
      "Celebrations requiring Safas for up to 31 guests",
    ],
    highlights: [
      { icon: "🚚", heading: "Complete Mini DJ Truck", body: "JBL sound and a moving LED panel in a compact, procession-ready setup." },
      { icon: "🥁", heading: "Royal Live Formation", body: "Two Punjabi dhol players and six Chhatri lights keep the entry energetic and traditional." },
      { icon: "👑", heading: "31-Safa Package", body: "Professional Safa styling for the groom and up to 31 members of the Baraat party." },
    ],
    faqs: [
      { q: "How can we get a quote for Raj Tilak?", a: "Message us on WhatsApp with your event date, city, venue and guest count. We will confirm availability and share a clear event-specific quote." },
      { q: "Which groom entry can we select?", a: "You can choose one entry from a vintage car, Baggi or horse, subject to availability for your date and city." },
      { q: "Can we increase the dhol, Chhatri or Safa count?", a: "Yes. Raj Tilak is a starting package and can be upgraded based on your guest count and procession plan." },
    ],
  },
  {
    id: "rajwada",
    name: "Rajwada Package",
    shortName: "Rajwada",
    number: "02",
    tagline: "More Energy. More Celebration.",
    description:
      "An upgraded mini-truck Baraat with RCF sound, more dhol and Chhatris, confetti, a hype host and Safas for up to 51 guests.",
    image: "/Assests/packages/rajwada-v2.png",
    imageAlt: "Rajwada grand Baraat celebration",
    featured: true,
    features: [
      "Mini DJ Truck - Upgraded mobile production setup",
      "Groom Entry Choice - Vintage car, Baggi, horse or ATV bike",
      "RCF Premium Sound - Powerful concert-style clarity",
      "Moving LED Panel - Dynamic celebration visuals",
      "4 Punjabi Dhol - Bigger live traditional energy",
      "10 Royal Chhatri Lights - Fuller illuminated formation",
      "Liquid CO2 Gun - High-impact entry effect",
      "Confetti Effect - A camera-ready celebration moment",
      "20 Pyro Guns - Coordinated visual highlights",
      "Hype Host / Anchor - Keeps guests engaged and the flow moving",
      "Professional Safa Team - Styling for up to 51 Safas",
    ],
    comparison: {
      djTruck: "Mini DJ Truck",
      groomEntry: "Vintage car / Baggi / Horse / ATV",
      sound: "RCF premium sound",
      ledPanel: included,
      dhol: "4 Punjabi Dhol",
      chhatri: "10 Royal Chhatris",
      liquidCo2: included,
      confetti: included,
      pyro: "20 Pyro Guns",
      host: included,
      performer: "—",
      nameBoards: "—",
      bouncers: "—",
      addOns: "Available on request",
      safas: "Up to 51 Safas",
    },
    longDescription: `Rajwada steps up the scale with upgraded RCF sound, four Punjabi dhol players and ten royal Chhatri lights. The groom can choose a vintage car, Baggi, horse or ATV bike, giving the entry more flexibility and personality.

Liquid CO2, confetti and 20 planned pyro guns create a stronger visual sequence. A dedicated hype host or anchor keeps guests involved and coordinates energy through the route, while the Safa team prepares up to 51 guests.`,
    bestFor: [
      "Mid-sized and energetic Baraats",
      "Families wanting a host to engage the procession",
      "Evening entries with stronger visual effects",
      "Celebrations requiring Safas for up to 51 guests",
    ],
    highlights: [
      { icon: "🔊", heading: "RCF Premium Sound", body: "An upgraded audio experience built for a larger, more energetic procession." },
      { icon: "🎉", heading: "Confetti + 20 Pyro Guns", body: "Layered effects planned around the strongest entry and celebration moments." },
      { icon: "🎤", heading: "Hype Host / Anchor", body: "A dedicated host keeps guests involved and supports smooth procession flow." },
    ],
    faqs: [
      { q: "What is the main upgrade from Raj Tilak?", a: "Rajwada adds RCF sound, more dhol and Chhatris, confetti, 20 pyro guns, an ATV entry option, a hype host and a larger 51-Safa package." },
      { q: "Is the ATV bike included as a groom-entry choice?", a: "Yes. You can choose one available option from a vintage car, Baggi, horse or ATV bike." },
      { q: "What does the hype host do?", a: "The host engages guests, supports announcements and helps maintain energy and timing across the procession." },
    ],
  },
  {
    id: "maharaja",
    name: "Maharaja Package",
    shortName: "Maharaja",
    number: "03",
    tagline: "The Grand Production",
    description:
      "A full-scale American DJ truck experience with RCF sound or a brass band, six dhol, 35 pyro guns, entertainment and Safas for up to 81 guests.",
    image: "/Assests/packages/maharaja-v2.png",
    imageAlt: "Maharaja American DJ truck Baraat production",
    features: [
      "DJ American Truck - Full-scale mobile celebration production",
      "Groom Entry Choice - Vintage car, Baggi, horse or ATV bike",
      "RCF Sound or Brass Band - Choose your preferred music experience",
      "Moving LED Panel - High-impact dynamic visuals",
      "6 Punjabi Dhol - Powerful live rhythm",
      "20 Royal Chhatri Lights - Grand illuminated procession formation",
      "Liquid CO2 Gun - High-impact entry effect",
      "Confetti Effect - Premium celebration reveal",
      "35 Pyro Guns - Large coordinated visual sequence",
      "Hype Host / Anchor - Crowd engagement and procession energy",
      "Gorilla Entertainer - Interactive guest entertainment",
      "2 Personalized Name Boards - Custom visual identity for the entry",
      "Flexible Add-ons - Extra personalization options",
      "Professional Safa Team - Styling for up to 81 Safas",
    ],
    comparison: {
      djTruck: "DJ American Truck",
      groomEntry: "Vintage car / Baggi / Horse / ATV",
      sound: "RCF sound or Brass Band",
      ledPanel: included,
      dhol: "6 Punjabi Dhol",
      chhatri: "20 Royal Chhatris",
      liquidCo2: included,
      confetti: included,
      pyro: "35 Pyro Guns",
      host: included,
      performer: "1 Gorilla Entertainer",
      nameBoards: "2 Personalized Boards",
      bouncers: "Available as add-on",
      addOns: "Flexible add-ons included",
      safas: "Up to 81 Safas",
    },
    longDescription: `Maharaja turns the Baraat into a complete moving production. The DJ American Truck carries a moving LED panel and your choice of premium RCF sound or a brass-band experience. Six Punjabi dhol players and twenty royal Chhatris create a procession with real scale.

The effect sequence includes Liquid CO2, confetti and 35 pyro guns. A hype host and Gorilla entertainer keep the crowd engaged, while two personalized name boards give the entry a custom identity. The Safa team prepares up to 81 guests, with flexible add-ons available for further personalization.`,
    bestFor: [
      "Large premium Baraats",
      "Families wanting an American DJ truck production",
      "Processions needing strong entertainment and personalization",
      "Celebrations requiring Safas for up to 81 guests",
    ],
    highlights: [
      { icon: "🚛", heading: "DJ American Truck", body: "A full-scale mobile production platform with moving LED visuals." },
      { icon: "🎆", heading: "35-Gun Pyro Sequence", body: "A large coordinated visual sequence with Liquid CO2 and confetti." },
      { icon: "✨", heading: "Personalized Entertainment", body: "Hype host, Gorilla entertainer and two custom name boards make the entry distinctly yours." },
    ],
    faqs: [
      { q: "Can we choose between RCF sound and a brass band?", a: "Yes. Maharaja allows you to choose the preferred sound experience, subject to date and city availability." },
      { q: "Are the two name boards personalized?", a: "Yes. The two boards can be personalized for the groom, couple or family theme once the artwork is confirmed." },
      { q: "Are bouncers available with Maharaja?", a: "Professional bouncers can be added based on guest count, venue approach and crowd-management requirements." },
    ],
  },
  {
    id: "signature",
    name: "Signature Custom Package",
    shortName: "Signature Custom",
    number: "04",
    tagline: "Built Completely Around You",
    description:
      "A fully customized American DJ truck production where the music, royal formation, effects, entertainment, support team and add-ons are built around your event.",
    image: "/Assests/packages/signature-v2.png",
    imageAlt: "Signature fully customized Baraat production",
    custom: true,
    features: [
      "DJ American Truck - Full-scale custom production",
      "Groom Entry Choice - Vintage car, Baggi, horse or ATV bike",
      "RCF Sound or Brass Band - Selected around your celebration style",
      "Moving LED Panel - Personalized visual content",
      "Punjabi Dhol Team - Count planned for your procession scale",
      "Royal Chhatri Formation - Count and design planned for your venue",
      "Liquid CO2, Confetti & Pyro - Custom effect sequence",
      "Hype Host / Anchor - Professional crowd engagement",
      "Gorilla Entertainer - Optional interactive performance",
      "Personalized Name Boards - Designed for your event",
      "Professional Bouncers - Team sized for guest flow and safety",
      "Flexible Add-ons - Choose the experiences that matter to you",
      "Professional Safa Team - Up to 81 Safas, expandable on request",
    ],
    comparison: {
      djTruck: "DJ American Truck",
      groomEntry: customChoice,
      sound: "RCF sound / Brass Band / Custom",
      ledPanel: customChoice,
      dhol: customChoice,
      chhatri: customChoice,
      liquidCo2: customChoice,
      confetti: customChoice,
      pyro: customChoice,
      host: customChoice,
      performer: "Optional",
      nameBoards: customChoice,
      bouncers: customChoice,
      addOns: "Fully flexible",
      safas: "Up to 81, expandable",
    },
    longDescription: `Signature Custom is created from the ground up for celebrations that need a distinctive production. The DJ American Truck, groom-entry vehicle, music format, LED content, dhol team and Chhatri formation are selected around your venue, route, guest count and visual direction.

CO2, confetti and pyro effects are choreographed as a custom sequence. The host, entertainers, name boards, professional bouncers, Safa team and additional experiences are then sized around the final plan. Your proposal is prepared after the event location, route and final production requirements are confirmed on WhatsApp.`,
    bestFor: [
      "High-profile and destination celebrations",
      "Families wanting a one-of-one Baraat production",
      "Large guest counts and complex venue approaches",
      "Events requiring custom entertainment, effects and support",
    ],
    highlights: [
      { icon: "🪄", heading: "Designed From Scratch", body: "Every major service is selected and sized around your event instead of a fixed checklist." },
      { icon: "🎬", heading: "Custom Production Sequence", body: "Music, visuals, effects and the groom entry are choreographed as one experience." },
      { icon: "🤝", heading: "One Specialist Team", body: "Artists, operators, bouncers and Safa teams are coordinated through one event plan." },
    ],
    faqs: [
      { q: "How is the Signature Custom quote prepared?", a: "The final quote depends on the dhol and Chhatri count, entertainment, effect sequence, bouncer team, entry vehicle, add-ons, city and venue logistics. Share your brief on WhatsApp for an event-specific proposal." },
      { q: "Can we start from Maharaja and add only a few upgrades?", a: "Yes. Signature Custom can begin with any package foundation and add or change only the services that matter to your event." },
      { q: "How early should we plan a custom package?", a: "Four to six weeks is recommended during peak wedding season so vehicles, artists, production and personalized assets can be secured together." },
    ],
  },
];
