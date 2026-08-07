import { CITIES, FEATURED_CITIES } from "./data/cities";
import { CATEGORIES } from "./data/categories";

export { CITIES, FEATURED_CITIES, CATEGORIES };

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  city: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  price: number; // starting price in INR
  priceUnit: string; // e.g. "per day", "per plate", "per event"
  imageUrl: string;
  galleryUrls?: string[];
  address: string;
  contact: string;
  capacity?: number; // only for Venues
  vegOnly?: boolean; // only for Caterers/Venues
  services: string[];
  description: string;
  featured: boolean;
  verified?: boolean;
}

export interface City {
  name: string;
  state: string;
  tagline: string;
  imageUrl: string;
  description: string;
  isInternational: boolean;
  featured?: boolean;
}

// Dynamic helper to generate mock vendors for a specific city on-demand
export function generateVendorsForCity(cityName: string, citySeedOffset?: number): Vendor[] {
  const cityIdx = citySeedOffset !== undefined ? citySeedOffset : 
    cityName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const generatedList: Vendor[] = [];

  CATEGORIES.forEach((catObj, catIdx) => {
    // Create exactly 3 vendors for this category in this city
    for (let vendorIdx = 0; vendorIdx < 3; vendorIdx++) {
      const uniqueSeed = cityIdx * 100 + catIdx * 10 + vendorIdx;
      
      const baseNames = [
        `Elite ${catObj.name}`,
        `Royal ${catObj.name} Services`,
        `Signature ${catObj.name} Co.`
      ];
      const baseName = baseNames[vendorIdx];
      const fullName = `${cityName} ${baseName}`;

      // Deterministic image pool based on category group
      let imagePool = ["/images/venue_luxury.png", "/images/hero_bg.png", "/images/decor_mandap.png"];
      if (catObj.group === "Photography") {
        imagePool = ["/images/photo_candid.png", "/images/hero_bg.png", "/images/venue_luxury.png"];
      } else if (catObj.group === "Makeup & Styling") {
        imagePool = ["/images/makeup_bride.png", "/images/photo_candid.png", "/images/decor_mandap.png"];
      } else if (catObj.group === "Catering") {
        imagePool = ["/images/decor_mandap.png", "/images/hero_bg.png", "/images/venue_luxury.png"];
      }
      
      const mainImage = imagePool[vendorIdx % imagePool.length];
      
      // Setup galleries
      const gallery = [
        imagePool[(vendorIdx + 1) % imagePool.length],
        imagePool[(vendorIdx + 2) % imagePool.length]
      ];

      // Base price calculation bounds
      let basePrice = 20000;
      let priceUnit = "per event";

      if (catObj.group === "Venues") {
        basePrice = 150000 + (uniqueSeed % 8) * 50000;
        priceUnit = "per day";
      } else if (catObj.group === "Catering") {
        basePrice = 800 + (uniqueSeed % 10) * 200;
        priceUnit = "per plate";
      } else if (catObj.group === "Decoration") {
        basePrice = 50000 + (uniqueSeed % 6) * 15000;
        priceUnit = "per event";
      } else if (catObj.group === "Photography") {
        basePrice = 40000 + (uniqueSeed % 8) * 10000;
        priceUnit = "per day";
      } else if (catObj.group === "Makeup & Styling") {
        basePrice = 15000 + (uniqueSeed % 8) * 4000;
        priceUnit = "per package";
      } else if (catObj.group === "Entertainment") {
        basePrice = 30000 + (uniqueSeed % 10) * 8000;
        priceUnit = "per event";
      } else if (catObj.group === "Baraat Processions") {
        basePrice = 25000 + (uniqueSeed % 12) * 5000;
        priceUnit = "per event";
      }

      // Ratings between 4.4 and 5.0
      const rating = Number((4.4 + ((uniqueSeed % 7) * 0.1)).toFixed(1));
      const reviewsCount = 15 + (uniqueSeed % 135);

      // Pre-filled reviews
      const reviews: Review[] = [
        {
          id: `rev-${uniqueSeed}-1`,
          author: "Aman Preet",
          rating: Math.ceil(rating),
          date: "2026-03-12",
          comment: `We booked them for our wedding in ${cityName} and the service was absolutely top notch. Extremely professional behavior and gorgeous execution!`
        },
        {
          id: `rev-${uniqueSeed}-2`,
          author: "Neha Sharma",
          rating: Math.floor(rating),
          date: "2025-11-28",
          comment: `Highly recommended! Everything went exactly as planned. The starting price of ${basePrice} in ${cityName} is very reasonable for this quality of service.`
        }
      ];

      // Services mapping
      let servicesList = ["Bespoke Arrangements", "Premium Customer Service", "Dedicated Account Manager"];
      if (catObj.group === "Venues") {
        servicesList = ["Air Conditioned Hall", "Valet Parking Space", "24/7 Power Backup", "Dedicated Changing Rooms"];
      } else if (catObj.group === "Catering") {
        servicesList = ["Premium Buffet Setup", "Live Food Counters", "Customizable Menu Options", "Uniformed Serving Staff"];
      } else if (catObj.group === "Decoration") {
        servicesList = ["Mandap Styling Decor", "LED Spotlights Setup", "Fresh Flower Accessories", "Seating Carpet Layouts"];
      } else if (catObj.group === "Photography") {
        servicesList = ["Candid Digital Coverage", "Cinematic Teaser Trailer", "Drone Outdoor Angles", "Pre-Wedding Couple Shoot"];
      } else if (catObj.group === "Makeup & Styling") {
        servicesList = ["Airbrush Bridal Makeup", "Saree & Lehenga Draping", "Pre-bridal Facial Sessions", "Premium Cosmetics Only"];
      } else if (catObj.group === "Entertainment") {
        servicesList = ["Premium Sound Output", "Wireless Handheld Mics", "Custom Music Playlist", "Live DJ Mixing Console"];
      } else if (catObj.group === "Baraat Processions") {
        servicesList = ["Ceremonial Chariot Ride", "Uniformed Dhol Artists", "Cold Pyrotechnics Gates", "Safety escorts blockades"];
      }

      generatedList.push({
        id: `gen-${cityName.toLowerCase().replace(/[^a-z0-9]/g, "")}-${catObj.id.replace(/[^a-z0-9]/g, "")}-${vendorIdx}`,
        name: fullName,
        category: catObj.name,
        city: cityName,
        rating,
        reviewsCount,
        reviews,
        price: basePrice,
        priceUnit,
        imageUrl: mainImage,
        galleryUrls: gallery,
        address: `Palace Road, Near Heritage Center, ${cityName}`,
        contact: `+91 98765 ${String(10000 + uniqueSeed).substring(1)}`,
        capacity: catObj.group === "Venues" ? 300 + (uniqueSeed % 5) * 100 : undefined,
        vegOnly: catObj.group === "Catering" || catObj.group === "Venues" ? (uniqueSeed % 2 === 0) : undefined,
        services: servicesList,
        description: `The premier provider of ${catObj.name} in ${cityName}. Famous for outstanding execution, premium themes, and localized packages designed to fit your unique Indian celebration budget.`,
        featured: vendorIdx === 0 && (catObj.group === "Venues" || catObj.group === "Photography")
      });
    }
  });

  return generatedList;
}

// Generates initial vendors for the 6 target cities to pre-seed the database
export function generateVendors(): Vendor[] {
  const generatedList: Vendor[] = [];
  const targetCities = ["Delhi-NCR", "Mumbai", "Ahmedabad", "Surat", "Vadodara", "Bengaluru"];

  targetCities.forEach((cityName, cityIdx) => {
    generatedList.push(...generateVendorsForCity(cityName, cityIdx));
  });

  return generatedList;
}

export const INITIAL_VENDORS: Vendor[] = generateVendors();

// Helper estimation allocations for all 53 categories based on style
export function calculateBudgetAllocation(totalBudget: number, style: string): { category: string; amount: number; percentage: number; group: string }[] {
  let groupWeights: Record<string, number> = {};

  if (style === "Royal Palace") {
    groupWeights = {
      "Entry & Procession": 0.15,
      "Music & Entertainment": 0.15,
      "Groom Royal Styling": 0.10,
      "Decoration & Experience": 0.15,
      "Guest Experience": 0.10,
      "Wedding Production": 0.20,
      "Luxury Add-ons": 0.15
    };
  } else if (style === "Elegant Beach") {
    groupWeights = {
      "Entry & Procession": 0.12,
      "Music & Entertainment": 0.18,
      "Groom Royal Styling": 0.08,
      "Decoration & Experience": 0.12,
      "Guest Experience": 0.12,
      "Wedding Production": 0.23,
      "Luxury Add-ons": 0.15
    };
  } else if (style === "Intimate Traditional") {
    groupWeights = {
      "Entry & Procession": 0.10,
      "Music & Entertainment": 0.12,
      "Groom Royal Styling": 0.15,
      "Decoration & Experience": 0.15,
      "Guest Experience": 0.15,
      "Wedding Production": 0.23,
      "Luxury Add-ons": 0.10
    };
  } else {
    // Default Modern Chic
    groupWeights = {
      "Entry & Procession": 0.13,
      "Music & Entertainment": 0.15,
      "Groom Royal Styling": 0.10,
      "Decoration & Experience": 0.14,
      "Guest Experience": 0.12,
      "Wedding Production": 0.21,
      "Luxury Add-ons": 0.15
    };
  }

  // Count categories per group to distribute weights evenly inside the group
  const groupCounts: Record<string, number> = {};
  CATEGORIES.forEach(c => {
    groupCounts[c.group] = (groupCounts[c.group] || 0) + 1;
  });

  // Calculate allocation for all 53 categories
  return CATEGORIES.map(cat => {
    const groupWeight = groupWeights[cat.group] || 0.10;
    const catCount = groupCounts[cat.group] || 1;
    const percentage = groupWeight / catCount;

    return {
      category: cat.name,
      amount: Math.round(totalBudget * percentage),
      percentage: Math.round(percentage * 1000) / 10,
      group: cat.group
    };
  });
}
