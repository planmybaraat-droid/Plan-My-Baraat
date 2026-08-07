export interface BaraatLocation {
  slug: string;
  name: string;
  type: "city" | "area" | "town";
  parentCity?: string; // slug of parent city, for area/town tier
  state: string;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function city(name: string, state: string): BaraatLocation {
  return { slug: slugify(name), name, type: "city", state };
}

function area(name: string, parentCity: string, state: string): BaraatLocation {
  return { slug: `${slugify(parentCity)}-${slugify(name)}`, name, type: "area", parentCity: slugify(parentCity), state };
}

function town(name: string, state: string): BaraatLocation {
  return { slug: slugify(name), name, type: "town", state };
}

const GJ = "Gujarat";

export const BARAAT_CITIES: BaraatLocation[] = [
  city("Vadodara", GJ),
  city("Surat", GJ),
  city("Ahmedabad", GJ),
  city("Gandhinagar", GJ),
  city("Rajkot", GJ),
  city("Bhavnagar", GJ),
  city("Jamnagar", GJ),
  city("Junagadh", GJ),
  city("Anand", GJ),
  city("Mehsana", GJ),
  city("Bharuch", GJ),
  city("Navsari", GJ),
  city("Valsad", GJ),
  city("Vapi", GJ),
  city("Rajpipla", "Narmada, Gujarat"),
  city("Kevadia", "Narmada, Gujarat"),
  city("Chhota Udepur", GJ),
];

const VADODARA_AREAS = [
  "Alkapuri", "Sayajigunj", "Akota", "Manjalpur", "Gotri", "Karelibaug", "Waghodia Road",
  "Vasna-Bhayli Road", "Old Padra Road", "Fatehgunj", "Sama", "Subhanpura", "Tandalja",
  "New VIP Road", "Harni", "Chhani", "Diwalipura", "Race Course Circle", "Nizampura",
  "Makarpura", "Gorwa", "Bhayli", "Vasna", "Ellora Park", "Gendigate", "Raopura", "Mandvi",
  "Panigate", "Salatwada", "Kirti Mandir Road", "Jetalpur Road", "Genda Circle", "Vadsar",
  "Sunpharma Road", "Kalali", "Undera", "New Sama Road", "Ajwa Road", "Chhani Jakatnaka",
  "Vaghodia GIDC belt", "Atladra", "Bill", "Sherkhi",
];

const SURAT_AREAS = [
  "Vesu", "Adajan", "City Light", "Piplod", "Athwalines", "Ghod Dod Road", "Varachha",
  "Katargam", "Pal", "Dumas Road", "Rander", "Bhatar", "Palanpur Road", "Nanpura", "Udhna",
  "Althan", "Vesu-Bharthana", "Magdalla", "Sarthana", "Puna", "Godadara", "Pandesara",
  "Adajan Patiya", "Ring Road", "Ved Road", "Parvat Patiya", "Amroli", "Sachin GIDC",
  "Kamrej", "Bhestan", "New Textile Market belt", "Dindoli", "Nana Varachha",
  "Katargam Ring Road", "Anand Mahal Road", "Jahangirpura", "Vaad", "Umra",
  "Piplod-Vesu Canal Road", "Dumas Beach Road", "Hazira", "Choryasi",
];

const AHMEDABAD_AREAS = [
  "SG Highway", "Satellite", "Bodakdev", "Prahlad Nagar", "Vastrapur", "Navrangpura",
  "Maninagar", "Bopal", "South Bopal", "Thaltej", "Gota", "Chandkheda", "Naranpura",
  "Shahibaug", "Vastral", "Nikol", "Paldi", "Ellisbridge", "CG Road", "Ghatlodia",
  "Science City Road", "Shela", "Nirnay Nagar", "Vaishnodevi Circle", "Ambawadi",
  "Vejalpur", "Jodhpur", "Judges Bungalow Road", "Sindhu Bhavan Road", "Shilaj",
  "South Bopal-Ghuma", "Iscon Cross Road", "Drive-in Road", "Motera", "Sabarmati",
  "Chandlodia", "Ranip", "New Ranip", "Naroda", "Odhav", "Vatva", "Isanpur", "Ghodasar",
  "Nava Vadaj", "Memnagar", "Usmanpura", "Khokhra", "Anand Nagar", "Bhat GIDC belt",
];

const GANDHINAGAR_AREAS = [
  "Sector 7", "Sector 11", "Sector 16", "Sector 21", "Sector 22", "Sector 26", "Sector 28",
  "Sector 29", "Sector 30", "Kudasan", "Raysan", "Koba", "Infocity", "Adalaj", "Randesan",
  "Pethapur", "Sargasan", "Vavol", "Kolvada", "Por", "Ognaj", "Chiloda", "PDPU Road belt",
];

const RAJKOT_AREAS = [
  "Kalawad Road", "University Road", "Mavdi", "Gondal Road", "150 Feet Ring Road",
  "Raiya Road", "Nana Mava Road", "Kotharia Road", "Yagnik Road", "Amin Marg", "Kothariya",
  "Bhaktinagar", "Race Course Ring Road", "Madhapar Chowk", "Gujarat Housing Board Road",
  "Sadar", "Panchvati", "Vavdi", "Ayodhya Chowk", "Aji Dam Road",
];

const BHAVNAGAR_AREAS = [
  "Waghawadi Road", "Kaliyabid", "Bhavnagar Town Center", "Ghogha Circle", "Sardarnagar",
  "Ghoghari Bazaar", "Ambavadi", "Nari Road", "Takhteshwar Area",
];

const JAMNAGAR_AREAS = [
  "Bedi", "Digjam", "Pandit Nehru Marg", "Patel Colony", "Bedi Bandar Road", "Jamnagar Town",
  "Ranjit Sagar Road", "Guru Gobind Singh Marg",
];

const JUNAGADH_AREAS = ["Girnar Road", "Junagadh Town", "MG Road", "Zanzarda Road", "Moti Baug", "College Road"];

const ANAND_AREAS = ["Anand Town", "Vidyanagar", "Anand-Vidyanagar Road", "Karamsad", "Grid", "Sardar Gunj", "V V Nagar"];

const MEHSANA_AREAS = ["Mehsana Town", "Modhera Road", "Highway Road", "Radhanpur Road", "Malanpur"];

const BHARUCH_AREAS = ["Zadeshwar", "Kasak", "Bharuch Town", "Ankleshwar-Bharuch Belt", "Station Road", "Golden Bridge Area"];

const NAVSARI_AREAS = ["Navsari Town", "Lunsikui", "Eru Char Rasta", "Dandi Road", "Sayaji Road"];

const VALSAD_AREAS = ["Valsad Town", "Tithal Road", "Halar", "Sam Talav Area"];

const VAPI_AREAS = ["Vapi GIDC", "Chala", "Silvassa Border Belt", "Vapi Town", "Char Rasta Area", "Dungra Road"];

const RAJPIPLA_AREAS = ["Rajpipla Town", "Netrang Road", "Rajpipla Fort Area"];
const KEVADIA_AREAS = ["Statue of Unity Belt", "Kevadia Colony", "Ekta Nagar", "Sardar Sarovar Dam Area"];
const CHHOTA_UDEPUR_AREAS = ["Chhota Udepur Town", "Kawant Road", "Bodeli Belt"];

export const BARAAT_AREAS: BaraatLocation[] = [
  ...VADODARA_AREAS.map((a) => area(a, "Vadodara", GJ)),
  ...SURAT_AREAS.map((a) => area(a, "Surat", GJ)),
  ...AHMEDABAD_AREAS.map((a) => area(a, "Ahmedabad", GJ)),
  ...GANDHINAGAR_AREAS.map((a) => area(a, "Gandhinagar", GJ)),
  ...RAJKOT_AREAS.map((a) => area(a, "Rajkot", GJ)),
  ...BHAVNAGAR_AREAS.map((a) => area(a, "Bhavnagar", GJ)),
  ...JAMNAGAR_AREAS.map((a) => area(a, "Jamnagar", GJ)),
  ...JUNAGADH_AREAS.map((a) => area(a, "Junagadh", GJ)),
  ...ANAND_AREAS.map((a) => area(a, "Anand", GJ)),
  ...MEHSANA_AREAS.map((a) => area(a, "Mehsana", GJ)),
  ...BHARUCH_AREAS.map((a) => area(a, "Bharuch", GJ)),
  ...NAVSARI_AREAS.map((a) => area(a, "Navsari", GJ)),
  ...VALSAD_AREAS.map((a) => area(a, "Valsad", GJ)),
  ...VAPI_AREAS.map((a) => area(a, "Vapi", GJ)),
  ...RAJPIPLA_AREAS.map((a) => area(a, "Rajpipla", "Narmada, Gujarat")),
  ...KEVADIA_AREAS.map((a) => area(a, "Kevadia", "Narmada, Gujarat")),
  ...CHHOTA_UDEPUR_AREAS.map((a) => area(a, "Chhota Udepur", GJ)),
];

const SMALLER_TOWNS = [
  "Padra", "Karjan", "Dabhoi", "Ankleshwar", "Jambusar", "Dahej", "Vyara", "Songadh",
  "Mandvi (Surat)", "Bilimora", "Gandevi", "Dharampur", "Umargam", "Daman", "Sanand",
  "Kalol", "Vijapur", "Kadi", "Visnagar", "Unjha", "Patan", "Palanpur", "Deesa",
  "Himatnagar", "Idar", "Modasa", "Nadiad", "Kheda", "Petlad", "Borsad", "Dholka",
  "Viramgam", "Bavla", "Gondal", "Jetpur", "Dhoraji", "Upleta", "Morbi", "Wankaner",
  "Dwarka", "Khambhalia", "Keshod", "Veraval", "Somnath", "Porbandar", "Mahuva",
  "Amreli", "Savarkundla", "Botad", "Surendranagar", "Wadhwan", "Limbdi",
  "Nandod", "Dediapada", "Tilakwada", "Zaghadia",
];

export const BARAAT_TOWNS: BaraatLocation[] = SMALLER_TOWNS.map((t) => town(t, GJ));

export const ALL_BARAAT_LOCATIONS: BaraatLocation[] = [
  ...BARAAT_CITIES,
  ...BARAAT_AREAS,
  ...BARAAT_TOWNS,
];

export function getLocationBySlug(slug: string): BaraatLocation | undefined {
  return ALL_BARAAT_LOCATIONS.find((l) => l.slug === slug);
}
