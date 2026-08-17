import { SITE_IMAGES } from "@/lib/siteImages";

export const ABOUT_POINTS = [
  "500+ baraats delivered across 6 major Gujarat & India cities",
  "In-house double-decker DJ trucks and vintage car fleet - no third-party delays",
  "Dedicated safa team, dhol artists, and pyro crew on every booking",
  "One point of contact from enquiry to the day of the event",
];

export const TESTIMONIALS = [
  {
    quote:
      "The Maharaja package made our baraat entry unforgettable - the DJ truck, lights, and pyro effects had every guest recording the moment.",
    name: "Aditi & Kunal",
    place: "Vadodara Baraat",
  },
  {
    quote:
      "Booked the Rajwada package for my brother's wedding. The dhol team and chhatri lights were exactly as promised - zero last-minute surprises.",
    name: "Priya Shah",
    place: "Ahmedabad Baraat",
  },
  {
    quote:
      "Professional from the first WhatsApp message to the last dance. The vintage car and safa team were the highlight of our whole event.",
    name: "Rohan Mehta",
    place: "Surat Baraat",
  },
  {
    quote:
      "The safa team tied over 150 turbans in under an hour and every single one looked royal. Incredible coordination on the big day.",
    name: "Neha & Jayesh",
    place: "Ahmedabad Baraat",
  },
  {
    quote:
      "We booked the Signature package for a destination wedding - the vintage car and pyro entry left the whole venue speechless.",
    name: "Kabir Malhotra",
    place: "Surat Baraat",
  },
  {
    quote:
      "From the first WhatsApp enquiry to the final dhol beat, everything ran exactly on time. Highly recommended for a stress-free baraat.",
    name: "Sanya & Arjun",
    place: "Vadodara Baraat",
  },
];

export const CONTACT_DETAILS = [
  {
    iconName: "PhoneCall",
    label: "Call / WhatsApp",
    value: "+91 90890 81111",
    href: "tel:+919089081111",
  },
  {
    iconName: "Mail",
    label: "Website",
    value: "planmybaraat.com",
    href: "https://planmybaraat.com",
  },
  {
    iconName: "MapPin",
    label: "Studio",
    value:
      "Studio 501-502, Broadway Signature, 5th Floor, Near Red Petal Party Plot, Opp. Sevasi-Bhayli Canal Ring Road, Vadodara, Gujarat - 391110",
  },
  { iconName: "Clock", label: "Hours", value: "Mon - Sun, 10:00 AM - 8:00 PM" },
] as const;

export const GALLERY_IMAGES = [
  { src: SITE_IMAGES.coupleGolden, label: "Golden Hour Vows" },
  { src: SITE_IMAGES.traditionalCouple, label: "Traditional Attire" },
  { src: SITE_IMAGES.confettiCelebration, label: "Confetti Celebration" },
  { src: SITE_IMAGES.floralCanopy, label: "Floral Canopy Entry" },
  { src: SITE_IMAGES.outdoorTentEvent, label: "Grand Outdoor Setup" },
  { src: SITE_IMAGES.floralUmbrella, label: "Chhatri Procession" },
  { src: SITE_IMAGES.heroMain, label: "Night Baraat Lights" },
  { src: SITE_IMAGES.heroFloral, label: "Gold Floral Decor" },
  { src: SITE_IMAGES.goldCrownMoment, label: "Groom's Royal Moment" },
];

export interface GalleryVideo {
  label: string;
  duration: string;
  thumb: string;
  src: string;
}

export const GALLERY_VIDEOS: GalleryVideo[] = [
  {
    label: "The Grand Arrival",
    duration: "00:38",
    thumb: "/Gallery/AMN_9633-scaled-Medium.webp",
    src: "/Assests/1000096815.mp4",
  },
  {
    label: "Baraat After Dark",
    duration: "00:35",
    thumb: "/Assests/1000096846.png",
    src: "/Assests/1000096816.mp4",
  },
  {
    label: "A Royal Celebration",
    duration: "00:26",
    thumb: "/Gallery/AMN_0591-scaled-Medium.webp",
    src: "/Assests/1000096817.mp4",
  },
  {
    label: "Dhol in Full Swing",
    duration: "00:34",
    thumb: "/Assests/1000096848.png",
    src: "/Assests/1000096818.mp4",
  },
  {
    label: "The Groom's Moment",
    duration: "00:19",
    thumb: "/Assests/1000096849.png",
    src: "/Assests/1000096819.mp4",
  },
  {
    label: "Vintage Car Entrance",
    duration: "00:23",
    thumb: "/Assests/1000096850.png",
    src: "/Assests/1000096820.mp4",
  },
  {
    label: "Colour in the Air",
    duration: "00:41",
    thumb: "/Assests/1000096851.png",
    src: "/Assests/1000096821.mp4",
  },
  {
    label: "The DJ Truck Rolls In",
    duration: "00:23",
    thumb: "/Assests/1000096852.png",
    src: "/Assests/1000096822.mp4",
  },
  {
    label: "A Daytime Procession",
    duration: "00:20",
    thumb: "/Assests/1000096853.png",
    src: "/Assests/1000096823.mp4",
  },
  {
    label: "Dancing with the Groom",
    duration: "00:24",
    thumb: "/Assests/1000096854.png",
    src: "/Assests/1000096824.mp4",
  },
  {
    label: "Made for the Baraat",
    duration: "00:10",
    thumb: "/Assests/1000096855.png",
    src: "/Assests/1000096826.mp4",
  },
  {
    label: "Fireworks & Flowers",
    duration: "00:13",
    thumb: "/Gallery/AMN_9608-scaled-Medium-1.webp",
    src: "/Assests/1000096827.mp4",
  },
  {
    label: "One Unforgettable Entry",
    duration: "00:09",
    thumb: "/Assests/1000096845.jpg.jpeg",
    src: "/Assests/1000096828.mp4",
  },
  {
    label: "The Celebration Builds",
    duration: "00:13",
    thumb: "/Assests/1000096847.png",
    src: "/Assests/1000096829.mp4",
  },
  {
    label: "The Final Dhol Beat",
    duration: "00:29",
    thumb: "/Assests/1000096856.png",
    src: "/Assests/1000096830.mp4",
  },
];

export interface PortfolioProject {
  title: string;
  city: string;
  package: string;
  image: string;
  highlights: string[];
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    title: "Aditi & Kunal's Royal Entry",
    city: "Vadodara",
    package: "Maharaja Package",
    image: SITE_IMAGES.heroMain,
    highlights: ["Double-decker DJ truck", "Pyro entry", "Vintage car"],
  },
  {
    title: "Priya's Rajwada Baraat",
    city: "Ahmedabad",
    package: "Rajwada Package",
    image: SITE_IMAGES.floralUmbrella,
    highlights: ["Dhol team", "Chhatri procession", "Safa team"],
  },
  {
    title: "Rohan & Family Celebration",
    city: "Surat",
    package: "Signature Package",
    image: SITE_IMAGES.confettiCelebration,
    highlights: ["Vintage car entry", "Confetti finale", "Live band"],
  },
  {
    title: "Neha & Jayesh's Grand Setup",
    city: "Ahmedabad",
    package: "Maharaja Package",
    image: SITE_IMAGES.outdoorTentEvent,
    highlights: ["Outdoor pandal", "150+ safa turbans", "Floral decor"],
  },
  {
    title: "Kabir's Destination Wedding",
    city: "Surat",
    package: "Signature Package",
    image: SITE_IMAGES.floralCanopy,
    highlights: ["Floral canopy entry", "Vintage car", "Pyro effects"],
  },
  {
    title: "Sanya & Arjun's Baraat",
    city: "Vadodara",
    package: "Rajwada Package",
    image: SITE_IMAGES.goldCrownMoment,
    highlights: ["Groom's royal entry", "Gold decor", "Dhol beats"],
  },
];
