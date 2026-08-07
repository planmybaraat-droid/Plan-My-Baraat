import { getLocationBySlug } from "./baraatLocations";

export interface PageContent {
  metaTitle: string;
  metaDescription: string;
  pageTitle: string;
  pageSubtitle: string;
  intro: string;
  localArea: string;
  whatsIncluded: string;
  whyUs: string;
  pricingGuidance: string;
  planningNotes: string;
  closing: string;
  faqs: { q: string; a: string }[];
}

// ── CUSTOM HUMAN-WRITTEN COPY MAPS FOR MAIN CITIES ──────────────────────────
const CITY_COPY: Record<string, Partial<PageContent>> = {
  surat: {
    intro: "Surat weddings are known for their scale, grandeur, and lively celebrations. In areas like Vesu and Adajan, families plan every detail of the groom's entry to make it stand out. A grand entry is a signature part of the wedding day, and PlanMyBaraat provides everything you need in one place. From double-decker DJ trucks and live DJ artists to traditional dhol teams, vintage cars, and professional safa tying, we handle the entire procession under a single booking. This saves you the trouble of coordinating with multiple individual vendors on a busy wedding day.",
    localArea: "We cover all major locations in Surat, including Vesu, Adajan, City Light, Piplod, Athwalines, Ghod Dod Road, Varachha, Katargam, Pal, Dumas Road, and Rander. Whether your venue is an upscale banquet hall in Vesu, a lawn in Piplod, or a venue in Varachha, our teams are familiar with the local routes, street widths, and access points to ensure the DJ truck and vintage car navigate smoothly.",
    whyUs: "Our deep familiarity with Surat's wedding locations ensures a smooth setup. We understand the traffic flows in Ghod Dod Road and the space layouts of farmhouses in Dumas. We don't outsource our services; our drivers, DJs, dhol players, and safa artists work regularly as a cohesive team to ensure the timing of your entry is perfect.",
    pricingGuidance: "Baraat packages in Surat are priced based on the size of the sound system, the number of dhol players, and additional visual effects. Our entry-level Raj Tilak package is perfect for classic entries, while the Signature package offers the ultimate experience with pyro and confetti effects. We provide customized quotes on WhatsApp based on your date, venue, and guest count.",
    planningNotes: "For weddings in Vesu, Adajan, or Varachha during the busy wedding season (November to February), we recommend booking at least 4 weeks in advance. If your venue has specific sound restrictions or local curfews, let us know so we can plan the dhol and DJ timings to comply with local guidelines.",
  },
  ahmedabad: {
    intro: "Ahmedabad host some of the most vibrant weddings in Gujarat, especially around SG Highway and Sindhu Bhavan Road. A grand groom entry is essential for setting the tone of the celebration. PlanMyBaraat offers an all-in-one procession package featuring double-decker DJ trucks, live DJs, high-energy dhol teams, classic vintage cars, and safa styling. By booking everything through a single team, you ensure seamless coordination and eliminate the stress of managing multiple vendors.",
    localArea: "We serve all major areas in Ahmedabad, including SG Highway, Satellite, Bodakdev, Prahlad Nagar, Vastrapur, Navrangpura, Maninagar, Bopal, South Bopal, Thaltej, Gota, Chandkheda, Shahibaug, Nikol, and Paldi. From hotel driveways on SG Highway to lawns in Bopal and Sindhu Bhavan Road, we have managed entries across all venue types.",
    whyUs: "Our team has extensive local experience managing entries in Ahmedabad's busiest wedding corridors. We know how to coordinate with hotels on SG Highway and how to navigate the narrower streets of Navrangpura or Paldi. Our in-house equipment and experienced crew guarantee a highly reliable service.",
    pricingGuidance: "Baraat pricing in Ahmedabad varies depending on your chosen package and venue distance. The Maharaja package is highly popular for its moving LED panel displays and 6-dhol setup, while Raj Tilak covers the essentials beautifully. Get in touch on WhatsApp with your date and venue for a personalized quote.",
    planningNotes: "Given the high demand for wedding venues on SG Highway and Sindhu Bhavan Road, booking 4-5 weeks in advance is highly recommended for peak dates. Please share details about your procession starting point so we can map out the route and coordinate parking.",
  },
  gandhinagar: {
    intro: "Gandhinagar's serene environment and planned layouts make it a wedding destination of choice in Gujarat. Processions here require a blend of traditional grandeur and modern presentation. PlanMyBaraat provides complete baraat packages featuring double-decker DJ trucks, dhol players, vintage cars, and safa tying. Our integrated booking ensures that every element of the groom's entry runs smoothly and on schedule.",
    localArea: "We cover all sectors in Gandhinagar, including Sector 7, Sector 11, Sector 16, Sector 21, Sector 22, Sector 26, Sector 28, Sector 29, and Sector 30, as well as Kudasan, Raysan, Koba, Infocity, and Sargasan. The wide and clean roads of Gandhinagar are ideal for our double-decker DJ trucks, allowing for grand entries with excellent sound and lighting.",
    whyUs: "Our team is highly familiar with Gandhinagar's sectors and local rules. We ensure that our double-decker DJ trucks and sound setups comply with local guidelines while delivering premium audio. Our regular crew of dhol players and safa artists ensures a professional and coordinated experience.",
    pricingGuidance: "Our pricing is transparent and based on the package you select. Raj Tilak is our most budget-friendly option, while Maharaja and Signature packages include premium features like LED name boards and pyro effects. Contact us on WhatsApp for a custom quote for your Gandhinagar wedding.",
    planningNotes: "Sector venues in Gandhinagar have clear parking and entry zones, but it is important to align on the exact procession starting point in advance. We recommend booking at least 3 weeks before the event during the peak season.",
  },
};

// ── CUSTOM HUMAN-WRITTEN COPY MAPS FOR KEYWORDS ─────────────────────────────
const KEYWORD_COPY: Record<string, Partial<PageContent>> = {
  "baraat-on-wheels": {
    intro: "Baraat on Wheels is the ultimate modern wedding entry concept in Gujarat. Instead of booking a DJ, dhol team, vintage car, and turban tying service separately, you book a fully coordinated procession. PlanMyBaraat provides a double-decker DJ truck with a live DJ, high-energy dhol players, a decorated vintage car or baggi, and a professional safa styling team under a single booking. This ensures seamless timing and eliminates coordination issues on your big day.",
    whyUs: "We are the pioneers of the Baraat on Wheels concept in Vadodara, Surat, and Ahmedabad. Our custom-built double-decker DJ trucks are maintained in-house, and our team of artists, dhol players, and safa tie makers work together regularly to deliver a flawless, high-energy experience.",
    pricingGuidance: "Baraat on Wheels pricing depends on the scale of the package and the event location. We offer four distinct tiers—Raj Tilak, Rajwada, Maharaja, and Signature—designed to fit different budgets and styles. Share your event details on WhatsApp to receive a precise quote.",
    planningNotes: "We recommend booking your Baraat on Wheels package at least 3-4 weeks in advance during the peak wedding season. Please provide the venue address and a rough procession route so we can check road clearance for our double-decker truck.",
  },
  "dj-truck-for-baraat": {
    intro: "A professional DJ truck for baraat brings concert-level sound and lighting to your wedding procession. Our custom-built double-decker DJ trucks feature high-fidelity sound rigs, an elevated DJ booth, and dynamic LED lighting setups. The live DJ reads the crowd's energy, playing non-stop hits to keep your guests dancing all the way to the wedding venue.",
    whyUs: "Our DJ trucks are built specifically for street processions, ensuring clean audio without distortion. Our experienced DJs specialize in wedding baraat music and coordinate seamlessly with our dhol players to maintain peak energy throughout the walk.",
    pricingGuidance: "The DJ truck is included in all PlanMyBaraat packages. Pricing varies depending on the sound configuration and lighting details. For example, our Maharaja package adds a custom LED name board showing the groom's name. Message us on WhatsApp to get exact rates.",
    planningNotes: "Please ensure there are no low-hanging power lines or arches on your procession route, as our double-decker DJ trucks require vertical clearance. Share the route with us in advance so we can confirm accessibility.",
  },
};

// ── modular content generator ──────────────────────────────────────────────
export function getSeoPageContent(slug: string): PageContent {
  const loc = getLocationBySlug(slug);

  // If it's a location page
  if (loc) {
    const parentCityName = loc.parentCity ? getLocationBySlug(loc.parentCity)?.name : "";
    const parentText = parentCityName ? ` in ${parentCityName}` : "";

    // Get base city copy or fall back to Surat style
    const key = loc.parentCity || loc.slug;
    const baseContent = CITY_COPY[key] || {};

    const intro = baseContent.intro || `Planning a wedding in ${loc.name}${parentText}? A grand groom entry is the highlight of the celebration. PlanMyBaraat provides complete, coordinated wedding procession services in ${loc.name}, featuring a double-decker DJ truck, live DJ artist, high-energy dhol players, a beautiful vintage car, and expert safa tying. We bring all these elements under a single booking so your family can focus on celebrating without coordination stress.`;

    const localArea = baseContent.localArea || `We cover all key venues and residential pockets in ${loc.name}${parentText} and the surrounding regions. Our coordinators assess the local streets, turning radiuses, and venue entry points to guarantee that the DJ truck and vintage car can navigate the route safely and arrive on time.`;

    const whatsIncluded = baseContent.whatsIncluded || `Every baraat package we deliver in ${loc.name} is fully inclusive. You receive a double-decker DJ truck with professional sound and lights, a live DJ, dhol players (2 to 6 depending on the package), a classic vintage car or traditional baggi, and turban styling by our My Safa team. Upgraded packages also offer moving LED screens, custom name displays, pyro effects, and security bouncers.`;

    const whyUs = baseContent.whyUs || `PlanMyBaraat is known across Gujarat for reliability and top-tier presentation. We don't hire temporary freelancers; our team works together regularly. This local knowledge of ${loc.name}'s venues and professional coordination is what makes our service trusted by hundreds of families.`;

    const pricingGuidance = baseContent.pricingGuidance || `Our baraat package pricing in ${loc.name} is clear and depends on the specific setup you select. The Raj Tilak package is highly cost-effective, while the Signature package offers a full visual production. Message us on WhatsApp with your wedding date and venue in ${loc.name} for an accurate quote.`;

    const planningNotes = baseContent.planningNotes || `We recommend booking your package at least 3 weeks in advance for weddings in ${loc.name}. Please confirm the exact start time and route details so we can coordinate the arrival of the DJ truck and safa tying team.`;

    const closing = `Enquire on WhatsApp with your wedding date, venue in ${loc.name}, and guest count. We'll help you select the perfect package.`;

    const metaTitle = `Baraat Packages in ${loc.name} | DJ Truck & Dhol | PlanMyBaraat`;
    const metaDescription = `Book a double-decker DJ truck, dhol team, vintage car, and safa tying in ${loc.name}, ${loc.state}. Clean packages, transparent pricing, and WhatsApp enquiry.`;

    const faqs = [
      {
        q: `What is included in a baraat package in ${loc.name}?`,
        a: `Every package includes a double-decker DJ truck, a live DJ, dhol players, a vintage car or baggi for the groom, and turban tying for the group. Higher tiers add LED screens, pyro, and bouncers.`,
      },
      {
        q: `Do you serve all areas in ${loc.name}?`,
        a: `Yes, we cover the entire ${loc.name} region and surrounding areas. Our team is familiar with the local banquet halls, hotels, and lawns.`,
      },
      {
        q: `How do we get a price quote for ${loc.name}?`,
        a: `Since prices vary depending on your date, venue location, and package tier, please send us your details on WhatsApp and we will provide a custom quote quickly.`,
      },
      {
        q: `Can you accommodate curfews or sound rules in ${loc.name}?`,
        a: `Yes. If your area in ${loc.name} has a noise curfew, we will adjust the DJ and dhol schedules to ensure everything is completed before the restriction time.`,
      },
    ];

    return {
      metaTitle,
      metaDescription,
      pageTitle: `Baraat Packages in ${loc.name}`,
      pageSubtitle: `DJ truck, dhol team, vintage car, and safa styling for your entry in ${loc.name}, ${loc.state}`,
      intro,
      localArea,
      whatsIncluded,
      whyUs,
      pricingGuidance,
      planningNotes,
      closing,
      faqs,
    };
  }

  // If it's a keyword page
  const keywordClean = slug.replace(/-/g, " ");
  const keywordTitle = keywordClean.charAt(0).toUpperCase() + keywordClean.slice(1);
  const baseContent = KEYWORD_COPY[slug] || {};

  const intro = baseContent.intro || `Looking to book ${keywordClean} for an upcoming wedding? PlanMyBaraat is Gujarat's premier service provider, bringing professional double-decker DJ trucks, live DJs, high-energy dhol players, vintage cars, and safa styling under a single coordinated booking. We ensure that your ${keywordClean} is managed professionally with top-tier equipment and seamless timing.`;

  const localArea = baseContent.localArea || `We offer our ${keywordClean} services across all major cities in Gujarat, including Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and more. Our teams handle all logistics, venue coordination, and route assessments to ensure a smooth, stress-free procession.`;

  const whatsIncluded = baseContent.whatsIncluded || `Our packages cover the ${keywordClean} along with a live DJ, sound and light systems, professional dhol players, a vintage car for the groom, and safa tying for the family. We offer different tiers—from the classic Raj Tilak to the grand Signature package—to fit your event's scale.`;

  const whyUs = baseContent.whyUs || `We own our fleet of double-decker DJ trucks and work with a dedicated team of artists, ensuring the highest standards of safety, coordination, and audio quality. Our 3-generation wedding industry legacy makes us the most reliable choice for ${keywordClean} in Gujarat.`;

  const pricingGuidance = baseContent.pricingGuidance || `Pricing for ${keywordClean} depends on the chosen package, event date, and location. We offer competitive rates and all-in packages with no hidden costs. Connect with our team on WhatsApp for an instant, customized quote.`;

  const planningNotes = baseContent.planningNotes || `To secure your date, we recommend booking your ${keywordClean} package at least 3-4 weeks in advance. Please share your venue address so we can coordinate logistics and ensure clearance for our vehicles.`;

  const closing = `Ready to plan your entry? Send us a message on WhatsApp with your date and venue to book ${keywordClean}.`;

  const metaTitle = `${keywordTitle} | Wedding Baraat Entry Packages | PlanMyBaraat`;
  const metaDescription = `Get the best packages for ${keywordClean} in Vadodara, Surat, Ahmedabad & across Gujarat. DJ truck, dhol, vintage car, and safa team in one booking.`;

  const faqs = [
    {
      q: `How do I book ${keywordClean}?`,
      a: `Simply send us a message on WhatsApp with your wedding date, city, and venue. We will confirm availability and guide you through the package options.`,
    },
    {
      q: `Is the sound system included with the ${keywordClean}?`,
      a: `Yes, all our packages include a professional sound system, live DJ, and light show.`,
    },
    {
      q: `Can I customize the package for ${keywordClean}?`,
      a: `Absolutely. You can add extra dhol players, bouncers, or special effects like cold pyro and confetti cannons to any package.`,
    },
  ];

  return {
    metaTitle,
    metaDescription,
    pageTitle: keywordTitle,
    pageSubtitle: `Premium ${keywordClean} packages for wedding entries across Vadodara, Surat, and Ahmedabad`,
    intro,
    localArea,
    whatsIncluded,
    whyUs,
    pricingGuidance,
    planningNotes,
    closing,
    faqs,
  };
}
