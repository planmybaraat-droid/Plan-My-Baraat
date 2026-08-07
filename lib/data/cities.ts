import { CITIES_INDIA } from "./citiesIndia";
import { CITIES_INTERNATIONAL } from "./citiesInternational";

export interface City {
  name: string;
  state: string;
  tagline: string;
  imageUrl: string;
  description: string;
  isInternational: boolean;
  featured?: boolean;
}

// Top featured cities that have bespoke designs/images
export const FEATURED_CITIES: City[] = [
  {
    name: "Vadodara",
    state: "Gujarat",
    tagline: "The Cultural Capital of Gujarat",
    imageUrl: "/images/hero_bg.png",
    description: "Famous for majestic palaces, heritage gates, and grand royal garba entries.",
    isInternational: false,
    featured: true
  },
  {
    name: "Surat",
    state: "Gujarat",
    tagline: "The Diamond City of India",
    imageUrl: "/images/decor_mandap.png",
    description: "Perfect for lavish canal road setups, high-end textile events, and grand riverfront wedding entries.",
    isInternational: false,
    featured: true
  },
  {
    name: "Ahmedabad",
    state: "Gujarat",
    tagline: "The Heritage City of Gujarat",
    imageUrl: "/images/venue_luxury.png",
    description: "Grand wedding plots on SG Highway, historic haveli charm, and massive community celebrations.",
    isInternational: false,
    featured: true
  },
  {
    name: "Gandhinagar",
    state: "Gujarat",
    tagline: "The Green Capital City",
    imageUrl: "/images/photo_candid.png",
    description: "Vibrant garden entries, wide sector avenues, and serene VIP wedding processions.",
    isInternational: false,
    featured: true
  },
  {
    name: "Rajkot",
    state: "Gujarat",
    tagline: "The Heart of Kathiawar",
    imageUrl: "/images/makeup_bride.png",
    description: "Energetic Kathiawadi dhol, royal Kalawad road settings, and massive public entries.",
    isInternational: false,
    featured: true
  },
  {
    name: "Bhavnagar",
    state: "Gujarat",
    tagline: "The Cultural Hub of Gohilwad",
    imageUrl: "/images/venue_luxury.png",
    description: "Rich heritage, custom dhol entries, and beautiful coastal vibes.",
    isInternational: false,
    featured: true
  },
  {
    name: "Jamnagar",
    state: "Gujarat",
    tagline: "The Jewel of Kathiawar",
    imageUrl: "/images/hero_bg.png",
    description: "Tie the knot in the home of royal brass bands and colorful bandhani celebrations.",
    isInternational: false,
    featured: true
  },
  {
    name: "Junagadh",
    state: "Gujarat",
    tagline: "The Historic City of Girnar",
    imageUrl: "/images/decor_mandap.png",
    description: "Mystical Girnar backdrops, rich historical settings, and traditional wedding entries.",
    isInternational: false,
    featured: true
  },
  {
    name: "Anand",
    state: "Gujarat",
    tagline: "The Milk Capital of India",
    imageUrl: "/images/photo_candid.png",
    description: "Modern NRI wedding celebrations, grand lawns, and lively Vidyanagar entries.",
    isInternational: false,
    featured: true
  },
  {
    name: "Mehsana",
    state: "Gujarat",
    tagline: "The Historical Modhera Hub",
    imageUrl: "/images/makeup_bride.png",
    description: "Close to majestic sun temples, high-energy rural dhols, and grand highway banquets.",
    isInternational: false,
    featured: true
  },
  {
    name: "Bharuch",
    state: "Gujarat",
    tagline: "The Ancient Port City on Narmada",
    imageUrl: "/images/venue_luxury.png",
    description: "Beautiful riverside processions, industrial GIDC grandeur, and historic golden bridge entries.",
    isInternational: false,
    featured: true
  },
  {
    name: "Navsari",
    state: "Gujarat",
    tagline: "The Twin City of Surat",
    imageUrl: "/images/hero_bg.png",
    description: "Vibrant Parsi heritage, classic coastal entries, and traditional NRI wedding vibes.",
    isInternational: false,
    featured: true
  },
  {
    name: "Valsad",
    state: "Gujarat",
    tagline: "The Beautiful Coastal Haven",
    imageUrl: "/images/decor_mandap.png",
    description: "Serene Tithal beach views, mango grove retreats, and grand family celebrations.",
    isInternational: false,
    featured: true
  },
  {
    name: "Vapi",
    state: "Gujarat",
    tagline: "The Gateway to Daman & Silvassa",
    imageUrl: "/images/photo_candid.png",
    description: "Vast industrial layouts, cross-border destination vibes, and massive banquet halls.",
    isInternational: false,
    featured: true
  },
  {
    name: "Rajpipla",
    state: "Gujarat",
    tagline: "The Royal Princely State",
    imageUrl: "/images/makeup_bride.png",
    description: "Stunning heritage palace backdrops, princely state hospitality, and royal entry processions.",
    isInternational: false,
    featured: true
  },
  {
    name: "Kevadia",
    state: "Gujarat",
    tagline: "The Statue of Unity Landmark",
    imageUrl: "/images/venue_luxury.png",
    description: "World-class tourist destination weddings, scenic Narmada views, and modern entries.",
    isInternational: false,
    featured: true
  },
  {
    name: "Chhota Udepur",
    state: "Gujarat",
    tagline: "The Tribal Heritage Center",
    imageUrl: "/images/decor_mandap.png",
    description: "Vibrant traditional art forms, lush forest settings, and authentic local wedding entries.",
    isInternational: false,
    featured: true
  }
];

// Map SimpleCity lists to standard City interface with default values
const mapSimpleToCity = (simpleList: typeof CITIES_INDIA, isInt: boolean): City[] => {
  return simpleList.map(item => {
    // Check if it's already a featured city
    const feat = FEATURED_CITIES.find(fc => fc.name.toLowerCase() === item.name.toLowerCase());
    if (feat) return feat;

    const baseTagline = isInt 
      ? `Exotic destination wedding in ${item.name}` 
      : `Beautiful celebration in ${item.name}, ${item.state}`;
      
    const baseDesc = isInt 
      ? `Plan an unforgettable international wedding experience in ${item.name}. Choose from a premium collection of global vendor packages.` 
      : `Connect with verified wedding suppliers and venues in ${item.name}. Plan your local custom wedding celebrations with ease.`;

    // Pick a default beautiful image from our public assets
    const images = [
      "/images/venue_luxury.png",
      "/images/hero_bg.png",
      "/images/decor_mandap.png",
      "/images/photo_candid.png",
      "/images/makeup_bride.png"
    ];
    // Deterministic image index based on city name characters
    const charSum = item.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const imageUrl = images[charSum % images.length];

    return {
      name: item.name,
      state: item.state,
      tagline: baseTagline,
      imageUrl: imageUrl,
      description: baseDesc,
      isInternational: isInt
    };
  });
};

export const CITIES: City[] = [
  ...FEATURED_CITIES,
  ...mapSimpleToCity(CITIES_INDIA.filter(c => !FEATURED_CITIES.some(fc => fc.name.toLowerCase() === c.name.toLowerCase())), false),
  ...mapSimpleToCity(CITIES_INTERNATIONAL, true)
];
