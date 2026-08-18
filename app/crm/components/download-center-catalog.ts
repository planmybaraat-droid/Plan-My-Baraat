export interface DownloadCenterPackage {
  id: string;
  packageNumber: string;
  name: string;
  tagline: string;
  description: string;
  features: readonly string[];
}

export interface DownloadCenterService {
  id: string;
  name: string;
  category: string;
  description: string;
  options?: readonly string[];
  active: boolean;
}

export const DOWNLOAD_CENTER_PACKAGES: readonly DownloadCenterPackage[] = [
  {
    id: 'the-festive',
    packageNumber: 'Package 1',
    name: 'The Festive',
    tagline: 'Perfect for a royal and memorable Baraat',
    description: 'A complete, well-coordinated Baraat experience combining the essential entry, music, lighting, effects and Safa services.',
    features: [
      'Choose one procession experience - Mini Truck, Thar or 11-member Brass Band',
      'Choose one royal entry - Vintage Car, Baggi or Horse',
      'Exclusive Sound - RCF or JBL',
      'Groom Name LED',
      'Moving LED Panel',
      '2 Dhol - Punjabi, Nashik, Puneri or Rajasthani',
      '6 Royal Chhatris',
      'Liquid CO2 Gun',
      '12 Pyro Hand Guns',
      'Complete PlanMyBaraat Team',
      '31 Safas with Dedicated Safa Team',
      'Complete Baraat Coordination and On-ground Management',
    ],
  },
  {
    id: 'the-grand',
    packageNumber: 'Package 2',
    name: 'The Grand',
    tagline: 'Perfect for an energetic and unforgettable Baraat',
    description: 'A higher-energy production with expanded entry choices, personalised visuals, enhanced effects and a larger Safa experience.',
    features: [
      'Choose one procession experience - Mini Truck, Thar, Flex Baraat or 11-member Brass Band',
      'Choose one royal entry - Vintage Car, Baggi or Horse',
      'Choose one entertainment experience - ATV Bike or Carnival Artist',
      'Groom Name LED',
      'Custom Hashtags',
      'Exclusive Sound - RCF or JBL',
      'Moving LED Panel',
      '4 Punjabi Dhol',
      '8 Royal Chhatris',
      'Liquid CO2 Gun',
      'Confetti Gun',
      '20 Pyro Hand Guns',
      'Hyper or Anchor',
      'Complete PlanMyBaraat Team',
      '51 Safas with Dedicated Safa Team',
      'Complete Baraat Coordination and On-ground Management',
    ],
  },
  {
    id: 'the-royal',
    packageNumber: 'Package 3',
    name: 'The Royal',
    tagline: 'Perfect for a royal and spectacular Baraat',
    description: 'A premium American DJ Truck production with multiple live performance choices, large-scale effects and a complete royal Safa experience.',
    features: [
      'DJ American Truck',
      'Choose one royal entry - Vintage Car, Baggi, Horse or 11-member Brass Band',
      'Choose one entertainment experience - ATV Bike or Carnival Artist',
      'Exclusive Sound - RCF or JBL',
      'Groom Name LED',
      'Custom Hashtags',
      'Moving LED Panel',
      '4 to 6 Dhol - Punjabi, Nashik, Puneri or Rajasthani',
      '12 Royal Chhatris',
      'Liquid CO2 Gun',
      'Confetti Gun',
      '35 Pyro Hand Guns',
      'Hyper or Anchor',
      'Choose one Artist - Gorilla or Panda',
      '2 Custom Name Boards',
      'Complete PlanMyBaraat Team',
      '81 Safas with Dedicated Safa Team',
      'Complete Baraat Coordination and On-ground Management',
    ],
  },
  {
    id: 'the-signature',
    packageNumber: 'Package 4',
    name: 'The Signature',
    tagline: 'Perfect for a custom and extraordinary Baraat',
    description: 'A fully custom Baraat production that can be shaped around the family, venue, procession route and preferred entertainment experience.',
    features: [
      'DJ American Truck',
      'Choose one royal entry - Vintage Car, Baggi, Horse or ATV Bike',
      'Exclusive Sound - RCF or Brass Band',
      'ATV Bike or Carnival Artist',
      'Groom Name LED',
      'Custom Hashtags',
      'Moving LED Panel',
      'Punjabi Dhol',
      'Royal Chhatris',
      'Liquid CO2 Gun',
      'Confetti Gun',
      'Pyro Guns',
      'Hyper or Anchor',
      'Gorilla Artist',
      'Custom Name Boards',
      'Professional Bouncers',
      'Custom Safa Package with Dedicated Safa Team',
      'Complete Baraat Coordination and On-ground Management',
    ],
  },
] as const;

export const DOWNLOAD_CENTER_ADDONS: DownloadCenterPackage = {
  id: 'add-ons',
  packageNumber: 'Build Your Baraat',
  name: 'Add-ons',
  tagline: 'Add what you want. Make every moment count.',
  description: 'Optional experiences that can be added to a selected package based on availability, venue rules and the final event plan.',
  features: [
    'Darbuka Artist', 'Brass Band', 'Additional Dhol', 'Gorilla Artist',
    'Dancer or Russian Dancer', 'Vintage Car', 'ATV Bike', 'Extra Horse',
    'Moving LED Panel', 'Custom Hashtags', 'Royal Chhatri', 'Liquid CO2 Gun',
    'Confetti Gun', 'Professional Bouncers', 'Extra PlanMyBaraat Team',
    'Additional Safas', 'Reel Creator',
  ],
};

const service = (name: string, category: string, description: string, options?: readonly string[]): DownloadCenterService => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  name, category, description, options, active: true,
});

export const DOWNLOAD_CENTER_SERVICES: readonly DownloadCenterService[] = [
  service('Baraat Procession Experience', 'DJ & Procession', 'Mobile entertainment options for the complete procession.', ['Mini Truck', 'Thar', 'Flex Baraat', 'DJ American Truck', '11-member Brass Band']),
  service('Royal Groom Entry', 'Royal Entry', 'A dedicated arrival experience for the groom.', ['Vintage Car', 'Baggi', 'Horse', 'ATV Bike']),
  service('Exclusive Sound', 'Music & Sound', 'Professional outdoor sound configured for a moving Baraat.', ['RCF', 'JBL', 'Brass Band']),
  service('Moving LED Panel', 'Lighting & Visuals', 'Dynamic LED visuals integrated with the Baraat production.'),
  service('Groom Name LED', 'Lighting & Visuals', 'Personalised illuminated name display for the groom.'),
  service('Custom Hashtags', 'Lighting & Visuals', 'Personalised wedding hashtags for the procession display.'),
  service('Custom Name Boards', 'Lighting & Visuals', 'Custom-designed name boards for the event.'),
  service('Dhol Artists', 'Live Music', 'High-energy live rhythm for the Baraat procession.', ['Punjabi', 'Nashik', 'Puneri', 'Rajasthani']),
  service('Royal Chhatris', 'Traditional Elements', 'Coordinated royal Chhatris for the groom and procession.'),
  service('Liquid CO2 Gun', 'Special Effects', 'Managed liquid CO2 celebration effect.'),
  service('Confetti Gun', 'Special Effects', 'A timed confetti highlight for key entry moments.'),
  service('Pyro Hand Guns', 'Special Effects', 'Professionally coordinated hand-pyro effects.'),
  service('Hyper or Anchor', 'Entertainment', 'A host who keeps the procession active and coordinated.'),
  service('Carnival Artist', 'Entertainment', 'Interactive artist experience for guests and the procession.'),
  service('Gorilla or Panda Artist', 'Entertainment', 'Character artist for high-energy guest engagement.'),
  service('Professional Bouncers', 'Safety & Operations', 'Professional on-ground crowd and procession support.'),
  service('Safa Experience', 'Traditional Elements', 'Safa package with a dedicated tying and coordination team.'),
  service('PlanMyBaraat Team', 'Safety & Operations', 'Dedicated production and on-ground event team.'),
  service('Baraat Coordination', 'Safety & Operations', 'Complete planning, sequencing and on-ground management.'),
  service('Darbuka Artist', 'Add-ons', 'Optional live percussion performance.'),
  service('Dancer or Russian Dancer', 'Add-ons', 'Optional choreographed performance artists.'),
  service('Reel Creator', 'Add-ons', 'Short-form event content captured for social sharing.'),
];
