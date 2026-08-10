/**
 * Neutral business catalogue shared by the public-site data consumers and
 * every CRM document flow. Keep service definitions here so agreements,
 * vendor agreements, quotations and downloadable documents cannot drift.
 */
export interface BusinessService {
  id: string;
  name: string;
  category: string;
  description: string;
  active: boolean;
  options?: readonly string[];
}

const categoryDescriptions: Record<string, string> = {
  Transport: 'Royal groom arrivals and procession vehicles.',
  'Music & Sound': 'Live and amplified entertainment for the procession.',
  'Traditional Elements': 'Traditional artists, styling and ceremonial details.',
  'Lighting & Visuals': 'Lighting, displays and personalised visual elements.',
  'Special Effects': 'Celebration effects operated as part of the event production.',
  Entertainment: 'Artists and crowd-engagement experiences.',
  'Safety & Operations': 'On-ground coordination, security and guest operations.',
  Digital: 'Digital coverage and guest-sharing services.',
};

const serviceGroups = {
  Transport: ['DJ On Wheels', 'Vintage Car', 'Buggy', 'Horse', 'Royal Elephant', 'Helicopter', 'Premium ATV Bikes', 'Premium Cars', 'Drink on Wheels'],
  'Music & Sound': ['Exclusive Sound', 'DJ Artist', 'Anchor', 'Dhol', 'Brass Band'],
  'Traditional Elements': ['Chhatri', 'Ganga Aarti', 'Safa', 'Safa Team'],
  'Lighting & Visuals': ['Moving LED', 'LED Letters'],
  'Special Effects': ['CO2 Gun', 'Confetti Gun', 'Fake Money Gun', 'Hand Pyro', 'CO2 Jet', 'Low Fog', 'Paper Blast', 'Smoke Bubble', 'Fireworks'],
  Entertainment: ['Props', 'Carnival Artist'],
  'Safety & Operations': ['Professional Bouncer', 'Dedicated Manager'],
  Digital: ['Live Streaming', 'QR Gallery'],
} as const;

export const SERVICE_OPTIONS: Readonly<Record<string, readonly string[]>> = {
  'DJ On Wheels': ['Premium DJ Truck', 'Mini DJ Truck', 'Flex DJ Truck', 'American DJ Truck', 'Concert DJ Truck (Trolla)'],
  'Vintage Car': ['Premium Rolls Royce', 'American Rolls Royce', 'Convertible Vintage Car'],
  Buggy: ['AC Buggy', '2 Horse Buggy', '4 Horse Buggy', 'Royal Buggy', 'LED Buggy', 'Floral Buggy'],
  Horse: ['Ghoda', 'Ghodi'],
  'Premium Cars': ['Convertible', 'Rolls Royce', 'Vanity Van', 'Luxury XUV'],
  'Exclusive Sound': ['Premium Line Array', 'Concert Sound'],
  'DJ Artist': ['Professional DJ Artist', 'Celebrity DJ', 'International DJ'],
  Anchor: ['Premium Anchor', 'Bollywood Anchor', 'Traditional Anchor'],
  Dhol: ['Punjabi Dhol with Artist', 'Nashik Dhol with Artist', 'Rajasthani Dhol with Artist'],
  'Brass Band': ['11 Piece', '21 Piece', '31 Piece'],
  Chhatri: ['Royal Classic', 'Royal LED', 'Royal Floral LED'],
  'Carnival Artist': [
    '1 Jungler, 1 Unicyclist, 1 Still Walker, 1 Twins Head',
    '1 Headless Man, 1 Dwarf Men, 1 Mirror Man, 1 Disco Man',
    '1 Chained Lion, 2 Carnival Girls',
  ],
};

export const MASTER_SERVICES: readonly BusinessService[] = Object.entries(serviceGroups).flatMap(([category, names]) =>
  names.map((name) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name,
    category,
    description: categoryDescriptions[category],
    active: true,
    options: SERVICE_OPTIONS[name],
  })),
);

export const SERVICE_NAMES = MASTER_SERVICES.filter((service) => service.active).map((service) => service.name);

export const SERVICE_COLOR_OPTIONS: Readonly<Record<string, readonly string[]>> = {
  'Vintage Car': ['Red', 'White'],
};

export const SERVICE_DECORATION_OPTIONS: Readonly<Record<string, readonly string[]>> = {
  Horse: ['With Decoration', 'Without Decoration'],
  'Royal Elephant': ['With Decoration', 'Without Decoration'],
  'Premium ATV Bikes': ['With Decoration', 'Without Decoration'],
};

export const SERVICE_PURPOSE_OPTIONS: Readonly<Record<string, readonly string[]>> = {
  'Premium ATV Bikes': ['For Haldi', 'For Baraat'],
};

export const SERVICE_MULTI_OPTIONS: Readonly<Record<string, readonly string[]>> = {
  'Drink on Wheels': ['With Mocktail', 'With Cocktail', 'With Caterers'],
};

export const SERVICE_AVAILABILITY_NOTE: Readonly<Record<string, string>> = {
  Helicopter: 'Subject to availability at the time of confirmation.',
  'Royal Elephant': 'Subject to availability at the time of confirmation.',
};
