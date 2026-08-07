import { CATEGORIES } from "./categories";
import { CITIES, FEATURED_CITIES } from "./cities";

const PRIORITY_CITY_NAMES = [
  "Vadodara",
  "Surat",
  "Ahmedabad",
  "Gandhinagar",
  "Rajkot",
  "Bhavnagar",
  "Jamnagar",
  "Junagadh",
  "Anand",
  "Mehsana",
  "Bharuch",
  "Navsari",
  "Valsad",
  "Vapi",
  "Rajpipla",
  "Kevadia",
  "Chhota Udepur",
];

export const PRIORITY_CITIES = FEATURED_CITIES.filter((city) =>
  PRIORITY_CITY_NAMES.includes(city.name)
);

export const CITY_AREA_MAP: Record<string, string[]> = {
  Vadodara: [
    "Alkapuri",
    "Sayajigunj",
    "Akota",
    "Manjalpur",
    "Gotri",
    "Karelibaug",
    "Waghodia Road",
    "Vasna-Bhayli Road",
    "Old Padra Road",
    "Fatehgunj",
    "Sama",
    "Subhanpura",
    "Tandalja",
    "New VIP Road",
    "Harni",
    "Chhani",
    "Diwalipura",
    "Race Course Circle",
    "Nizampura",
    "Makarpura",
    "Gorwa",
    "Bhayli",
    "Vasna",
    "Ellora Park",
    "Gendigate",
    "Raopura",
    "Mandvi",
    "Panigate",
    "Salatwada",
    "Kirti Mandir Road",
    "Jetalpur Road",
    "Genda Circle",
    "Vadsar",
    "Sunpharma Road",
    "Kalali",
    "Undera",
    "New Sama Road",
    "Ajwa Road",
    "Chhani Jakatnaka",
    "Vaghodia GIDC belt",
    "Atladra",
    "Bill",
    "Sherkhi"
  ],
  Surat: [
    "Vesu",
    "Adajan",
    "City Light",
    "Piplod",
    "Athwalines",
    "Ghod Dod Road",
    "Varachha",
    "Katargam",
    "Pal",
    "Dumas Road",
    "Rander",
    "Bhatar",
    "Palanpur Road (Surat)",
    "Nanpura",
    "Udhna",
    "Althan",
    "Vesu-Bharthana",
    "Magdalla",
    "Sarthana",
    "Puna",
    "Godadara",
    "Pandesara",
    "Adajan Patiya",
    "Ring Road",
    "Ved Road",
    "Parvat Patiya",
    "Amroli",
    "Sachin GIDC",
    "Kamrej",
    "Bhestan",
    "New Textile Market belt",
    "Dindoli",
    "Nana Varachha",
    "Katargam Ring Road",
    "Anand Mahal Road",
    "Jahangirpura",
    "Vaad",
    "Umra",
    "Piplod-Vesu Canal Road",
    "Dumas Beach Road",
    "Hazira",
    "Choryasi"
  ],
  Ahmedabad: [
    "SG Highway",
    "Satellite",
    "Bodakdev",
    "Prahlad Nagar",
    "Vastrapur",
    "Navrangpura",
    "Maninagar",
    "Bopal",
    "South Bopal",
    "Thaltej",
    "Gota",
    "Chandkheda",
    "Naranpura",
    "Shahibaug",
    "Vastral",
    "Nikol",
    "Paldi",
    "Ellisbridge",
    "CG Road",
    "Ghatlodia",
    "Science City Road",
    "Shela",
    "Nirnay Nagar",
    "Vaishnodevi Circle",
    "Ambawadi",
    "Vejalpur",
    "Jodhpur",
    "Judges Bungalow Road",
    "Sindhu Bhavan Road",
    "Shilaj",
    "South Bopal-Ghuma",
    "Iscon Cross Road",
    "Drive-in Road",
    "Motera",
    "Sabarmati",
    "Chandlodia",
    "Ranip",
    "New Ranip",
    "Naroda",
    "Odhav",
    "Vatva",
    "Isanpur",
    "Ghodasar",
    "Nava Vadaj",
    "Memnagar",
    "Usmanpura",
    "Khokhra",
    "Anand Nagar",
    "Bhat GIDC belt"
  ],
  Gandhinagar: [
    "Sector 7",
    "Sector 11",
    "Sector 16",
    "Sector 21",
    "Sector 22",
    "Sector 26",
    "Sector 28",
    "Sector 29",
    "Sector 30",
    "Kudasan",
    "Raysan",
    "Koba",
    "Infocity",
    "Adalaj",
    "Randesan",
    "Pethapur",
    "Sargasan",
    "Vavol",
    "Kolvada",
    "Por",
    "Ognaj (border area)",
    "Chiloda",
    "PDPU Road belt"
  ],
  Rajkot: [
    "Kalawad Road",
    "University Road",
    "Mavdi",
    "Gondal Road",
    "150 Feet Ring Road",
    "Raiya Road",
    "Nana Mava Road",
    "Kotharia Road",
    "Yagnik Road",
    "Amin Marg",
    "Kothariya",
    "Bhaktinagar",
    "Race Course Ring Road",
    "Madhapar Chowk",
    "Gujarat Housing Board Road",
    "Sadar",
    "Panchvati",
    "Vavdi",
    "Ayodhya Chowk",
    "Aji Dam Road"
  ],
  Bhavnagar: [
    "Waghawadi Road",
    "Kaliyabid",
    "Bhavnagar town center",
    "Ghogha Circle",
    "Sardarnagar",
    "Ghoghari Bazaar",
    "Ambavadi",
    "Nari Road",
    "Takhteshwar area"
  ],
  Jamnagar: [
    "Bedi",
    "Digjam",
    "Pandit Nehru Marg",
    "Patel Colony",
    "Bedi Bandar Road",
    "Jamnagar town",
    "Ranjit Sagar Road",
    "Guru Gobind Singh Marg"
  ],
  Junagadh: [
    "Girnar Road",
    "Junagadh town",
    "MG Road",
    "Zanzarda Road",
    "Moti Baug",
    "College Road"
  ],
  Anand: [
    "Anand town",
    "Vidyanagar",
    "Anand-Vidyanagar Road",
    "Karamsad",
    "Grid",
    "Sardar Gunj",
    "V V Nagar"
  ],
  Mehsana: [
    "Mehsana town",
    "Modhera Road",
    "Highway Road",
    "Radhanpur Road",
    "Malanpur"
  ],
  Bharuch: [
    "Zadeshwar",
    "Kasak",
    "Bharuch town",
    "Ankleshwar-Bharuch belt",
    "Station Road (Bharuch)",
    "Golden Bridge area"
  ],
  Navsari: [
    "Navsari town",
    "Lunsikui",
    "Eru Char Rasta",
    "Dandi Road",
    "Sayaji Road"
  ],
  Valsad: [
    "Valsad town",
    "Tithal Road",
    "Halar",
    "Sam Talav area"
  ],
  Vapi: [
    "Vapi GIDC",
    "Chala",
    "Silvassa border belt",
    "Vapi town",
    "Char Rasta area",
    "Dungra Road"
  ],
  Rajpipla: [
    "Rajpipla town",
    "Netrang Road",
    "Rajpipla Fort area"
  ],
  Kevadia: [
    "Statue of Unity belt",
    "Kevadia Colony",
    "Ekta Nagar",
    "Sardar Sarovar Dam area"
  ],
  "Chhota Udepur": [
    "Chhota Udepur town",
    "Kawant Road",
    "Bodeli belt"
  ]
};

export function getAreasForCity(cityName: string): string[] {
  return CITY_AREA_MAP[cityName] ?? [];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export interface FooterKeywordLink {
  label: string;
  href: string;
}

export interface SeoKeywordPage {
  slug: string;
  label: string;
  href: string;
  cityName: string;
  specialtyName: string;
  specialtySlug: string;
  citySlug: string;
  areaNames: string[];
}

const KEYWORD_CATEGORY_IDS = [
  "banquet_hall",
  "lawns_farmhouses",
  "resorts_hotels",
  "wedding_caterers",
  "live_counters",
  "desserts_cakes",
  "floral_decorators",
  "theme_decorators",
  "lighting_setup",
  "candid_photographer",
  "cinematographer",
  "drone_photography",
  "bridal_makeup",
  "hair_stylist",
  "groom_styling",
  "wedding_dj",
  "live_music_band",
  "dance_choreographer",
  "brass_band",
  "dhol_tasha",
  "vintage_baggi",
];

const SMALLER_TOWNS = [
  "Padra", "Karjan", "Dabhoi", "Ankleshwar", "Jambusar", "Dahej", "Vyara", "Songadh",
  "Mandvi (Surat)", "Bilimora", "Gandevi", "Dharampur", "Umargam", "Daman", "Sanand",
  "Kalol", "Vijapur", "Kadi", "Visnagar", "Unjha", "Patan", "Palanpur", "Deesa",
  "Himatnagar", "Idar", "Modasa", "Nadiad", "Kheda", "Petlad", "Borsad", "Dholka",
  "Viramgam", "Bavla", "Gondal", "Jetpur", "Dhoraji", "Upleta", "Morbi", "Wankaner",
  "Dwarka", "Khambhalia", "Keshod", "Veraval", "Somnath", "Porbandar", "Mahuva",
  "Amreli", "Savarkundla", "Botad", "Surendranagar", "Wadhwan", "Limbdi",
  "Nandod", "Dediapada", "Tilakwada", "Zaghadia", "Jhagadia GIDC belt"
];

// Target cities directory limit to our served Gujarat cities and towns
export const DIRECTORY_CITIES = CITIES.filter((city) =>
  [...PRIORITY_CITY_NAMES, ...SMALLER_TOWNS]
    .map((name) => name.toLowerCase())
    .includes(city.name.toLowerCase())
);

export const SEO_KEYWORD_PAGES: SeoKeywordPage[] = PRIORITY_CITIES.flatMap((city) =>
  KEYWORD_CATEGORY_IDS.map((categoryId) => {
    const category = CATEGORIES.find((item) => item.id === categoryId);

    if (!category) {
      return null;
    }

    const specialtySlug = slugify(category.name);
    const citySlug = slugify(city.name);

    return {
      slug: `${specialtySlug}-${citySlug}`,
      label: `${category.name} in ${city.name}`,
      href: `/${specialtySlug}-${citySlug}`,
      cityName: city.name,
      specialtyName: category.name,
      specialtySlug,
      citySlug,
      areaNames: getAreasForCity(city.name).slice(0, 6),
    };
  }).filter((item): item is SeoKeywordPage => Boolean(item))
).filter((item): item is SeoKeywordPage => Boolean(item));

export const FOOTER_KEYWORD_LINKS: FooterKeywordLink[] = SEO_KEYWORD_PAGES.map((page) => ({
  label: page.label,
  href: page.href,
}));

export function getSeoKeywordPageBySlug(slug: string): SeoKeywordPage | undefined {
  return SEO_KEYWORD_PAGES.find((page) => page.slug === slug);
}

// ── Standalone baraat guide pages from CLEAN_200_KEYWORDS ────────────────────
export interface BaraatKeywordPage {
  slug: string;
  keyword: string;
  label: string;
  href: string;
}

export const CLEAN_200_KEYWORDS = [
  // Core Product (Baraat on Wheels / DJ Truck)
  "baraat on wheels",
  "dj truck for baraat",
  "baraat dj truck",
  "double decker dj truck",
  "dj truck rental for wedding",
  "dj truck hire for baraat",
  "dj truck booking price",
  "dj van for wedding",
  "dj on wheels for wedding",
  "mobile dj truck for baraat",
  "wedding dj truck with lights",
  "dj truck with sound system rental",
  "baraat entry truck booking",
  "baraat truck decoration ideas",
  "baraat truck price",
  "book baraat dj truck online",
  "baraat dj on rent",
  "dj on rent for wedding",
  "wedding dj hire price",
  "wedding dj near me price",
  "professional dj for baraat entry",
  "non stop dj for wedding",
  "dj jockey hire near me",
  "sound and light setup for wedding",
  "concert style sound system wedding",
  "intelligent lighting rental wedding",

  // Baraat Entry Effects & Experience
  "baraat entry ideas",
  "unique baraat entry ideas",
  "best baraat entry ideas",
  "royal baraat entry",
  "grand baraat entry",
  "baraat entry effects",
  "led screen for wedding truck",
  "moving led panel rental india",
  "groom name light display",
  "custom led name board wedding",
  "confetti cannon for wedding",
  "confetti cannon rental near me",
  "confetti gun rental price wedding",
  "co2 gun for wedding",
  "co2 cannon rental price",
  "cold pyro rental for wedding",
  "hand pyro gun for wedding",
  "pyro effects for wedding entry",
  "fireworks for wedding",
  "wedding fireworks rental",
  "fake money gun rental",
  "money gun for sangeet",
  "entertainer for baraat",
  "entertainer for groom entry",
  "mascot artist for wedding",
  "crowd engagement artist wedding",

  // Dhol, Band & Traditional Elements
  "dhol for wedding",
  "dhol player near me",
  "dhol team for baraat",
  "dhol booking online",
  "punjabi dhol booking",
  "dhol group price",
  "band baja for wedding",
  "brass band for wedding",
  "brass band for baraat",
  "traditional brass band booking",
  "shehnai player booking",
  "baraat band booking",
  "chhatri lights for baraat",
  "chhatri lights rental wedding",
  "umbrella lights for wedding",
  "traditional light decoration wedding",

  // Vintage Car, Baggi & Transport
  "vintage car for baraat",
  "vintage car rental for wedding",
  "baggi for wedding",
  "baggi rental for wedding",
  "horse for baraat",
  "horse carriage for wedding",
  "ghodi for baraat",
  "classic car for groom entry",
  "american vintage car for wedding",
  "imported vintage car rental india",
  "wedding car rental vintage",

  // Safa, Turban & Groom Styling
  "safa for groom",
  "safa team booking",
  "safa team for wedding",
  "turban stylist for wedding",
  "turban tying service wedding",
  "pagdi rental for wedding",
  "rajputi pagdi rent",
  "wedding turban rental",
  "groom styling for wedding",
  "groom safa near me",

  // Security & Support Services
  "bouncers for wedding",
  "professional bouncers for wedding",
  "security guards for wedding event",
  "crowd control security wedding",
  "bouncer hiring for wedding events",

  // Cost, Pricing & Decision-Stage
  "baraat cost india",
  "how much does baraat cost",
  "baraat setup price",
  "baraat price list",
  "baraat starting price",
  "cheapest baraat setup",
  "most expensive baraat setup",
  "baraat setup for budget wedding",
  "baraat setup for luxury wedding",
  "baraat budget planning guide",
  "how much does a wedding dj cost",
  "how much does a baraat setup cost",
  "wedding dj package price",
  "baraat entry cost",
  "how to choose baraat setup",
  "compare baraat setups",
  "baraat setup comparison",
  "all inclusive baraat entry service",
  "full inclusive baraat entry",
  "custom baraat pricing",
  "baraat setup for guests count",
  "baraat setup for destination wedding",

  // Booking Process & Logistics
  "baraat planner near me",
  "baraat planning company",
  "baraat organizer",
  "baraat services near me",
  "how to book baraat on wheels",
  "baraat booking process",
  "advance payment for baraat service",
  "baraat cancellation policy",
  "baraat customization options",
  "how far in advance to book baraat",
  "baraat booking for wedding season",
  "wedding procession planner",
  "book wedding entertainment online",

  // Informational / Awareness
  "how many dhol players needed for baraat",
  "what is included in a baraat setup",
  "things to know before booking baraat",
  "best time for baraat entry",
  "best baraat entry ideas for winter",
  "best baraat entry ideas for summer",
  "best songs for baraat entry",
  "groom entry song ideas",
  "baraat dance songs",
  "baraat rituals and meaning",
  "what happens during baraat ceremony",
  "groom procession meaning",
  "groom procession traditions india",
  "modern baraat entry ideas",
  "traditional baraat entry ideas",
  "baraat entry trends",
  "how to plan baraat entry",
  "baraat vs wedding procession",
  "indian wedding traditions baraat",
  "best month for wedding in india",
  "shubh muhurat for wedding",

  // City-Specific (Vadodara + core operating cities)
  "baraat on wheels vadodara",
  "baraat on wheels surat",
  "baraat on wheels ahmedabad",
  "baraat on wheels mumbai",
  "baraat on wheels delhi ncr",
  "baraat on wheels bengaluru",
  "baraat on wheels gandhinagar",
  "baraat on wheels rajkot",
  "dj truck for baraat vadodara",
  "dj truck for baraat surat",
  "dj truck for baraat ahmedabad",
  "wedding dj truck vadodara",
  "baraat entry service vadodara",
  "best baraat company in gujarat",
  "baraat service provider gujarat",
  "wedding planner vadodara",
  "wedding planner surat",
  "wedding planner ahmedabad",
  "best wedding planner in gujarat",
  "baraat on wheels near me",

  // Comparison / Consideration
  "baraat setup with vintage car",
  "baraat setup with safa team",
  "baraat setup with dhol",
  "baraat setup with pyro effects",
  "baraat setup with led truck",
  "baraat setup with bouncers",
  "baraat setup with entertainer",
  "baraat with confetti and lights",
  "baraat with dj and dhol combo",
  "baraat with vintage car and safa",

  // Brand / Navigational
  "planmybaraat",
  "plan my baraat",
  "book my baraat",
  "make my baraat",
  "baraat on wheels india",
  "best baraat on wheels company",
  "top rated baraat service",
  "baraat on wheels reviews",
  "baraat entry service reviews",
  "trusted baraat vendor",

  // Long-tail Buyer Questions
  "where to book dj truck for wedding",
  "where to get vintage car for baraat",
  "who provides safa team for wedding",
  "how to organize a grand baraat",
  "how to make baraat entry memorable",
  "how to plan a royal baraat",
  "what makes a good baraat entry",
  "best way to enter baraat",
  "baraat entry checklist",
  "baraat planning checklist"
];

export const BARAAT_KEYWORD_PAGES: BaraatKeywordPage[] = CLEAN_200_KEYWORDS.map((kw) => {
  const s = kw
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return {
    slug: s,
    keyword: kw,
    label: kw.charAt(0).toUpperCase() + kw.slice(1),
    href: `/${s}`,
  };
});

export function getBaraatKeywordPageBySlug(slug: string): BaraatKeywordPage | undefined {
  return BARAAT_KEYWORD_PAGES.find((p) => p.slug === slug);
}

