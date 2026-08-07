export interface Category {
  id: string;
  name: string;
  icon: string;
  group: "Venues" | "Catering" | "Decoration" | "Photography" | "Makeup & Styling" | "Entertainment" | "Baraat Processions";
}

export const CATEGORIES: Category[] = [
  // 1. Venues
  { id: "banquet_hall", name: "Banquet Halls", icon: "Building", group: "Venues" },
  { id: "lawns_farmhouses", name: "Lawns & Farmhouses", icon: "Building", group: "Venues" },
  { id: "resorts_hotels", name: "Resorts & Hotels", icon: "Building", group: "Venues" },
  
  // 2. Catering
  { id: "wedding_caterers", name: "Wedding Caterers", icon: "GlassWater", group: "Catering" },
  { id: "live_counters", name: "Live Food Counters", icon: "GlassWater", group: "Catering" },
  { id: "desserts_cakes", name: "Desserts & Cakes", icon: "Cake", group: "Catering" },
  
  // 3. Decoration
  { id: "floral_decorators", name: "Floral Decorators", icon: "Flower2", group: "Decoration" },
  { id: "theme_decorators", name: "Thematic Designers", icon: "Paintbrush", group: "Decoration" },
  { id: "lighting_setup", name: "Wedding Lighting", icon: "Lightbulb", group: "Decoration" },
  
  // 4. Photography
  { id: "candid_photographer", name: "Candid Photographers", icon: "Camera", group: "Photography" },
  { id: "cinematographer", name: "Cinematographers", icon: "Video", group: "Photography" },
  { id: "drone_photography", name: "Drone Video Teams", icon: "Plane", group: "Photography" },
  
  // 5. Makeup & Styling
  { id: "bridal_makeup", name: "Bridal Makeup Artists", icon: "Shirt", group: "Makeup & Styling" },
  { id: "hair_stylist", name: "Hairstylists & Drapers", icon: "Shirt", group: "Makeup & Styling" },
  { id: "groom_styling", name: "Groom Styling & Safa", icon: "Shirt", group: "Makeup & Styling" },
  
  // 6. Entertainment
  { id: "wedding_dj", name: "Wedding DJs & Sound", icon: "Volume2", group: "Entertainment" },
  { id: "live_music_band", name: "Live Bands & Singers", icon: "Mic", group: "Entertainment" },
  { id: "dance_choreographer", name: "Dance Choreographers", icon: "Activity", group: "Entertainment" },
  
  // 7. Baraat Processions
  { id: "brass_band", name: "Traditional Brass Bands", icon: "Music", group: "Baraat Processions" },
  { id: "dhol_tasha", name: "Dhol & Tasha Teams", icon: "Music", group: "Baraat Processions" },
  { id: "vintage_baggi", name: "Vintage Cars & Baggi", icon: "Car", group: "Baraat Processions" },
  { id: "cold_pyro_effects", name: "Cold Pyro & Sparklers", icon: "Flame", group: "Baraat Processions" }
];
