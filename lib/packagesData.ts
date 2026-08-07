export interface PackageHighlight {
  icon: string;
  heading: string;
  body: string;
}

export interface PackageFaq {
  q: string;
  a: string;
}

export interface BaraatPackage {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  longDescription: string;
  bestFor: string[];
  highlights: PackageHighlight[];
  faqs: PackageFaq[];
}

export const BARAAT_PACKAGES: BaraatPackage[] = [
  {
    id: "raj-tilak",
    name: "Raj Tilak Package",
    tagline: "A Royal Beginning",
    description: "Perfect for a royal & memorable baraat entry.",
    features: [
      "Mini Double Decker Truck - High Energy Baraat Entry",
      "Professional DJ Operator Artist - Non-Stop Entertainment",
      "Exclusive Sound Quality - Crystal Clear, Powerful, Premium",
      "Liquid CO2 Gun - For a Dazzling Entry",
      "2 Punjabi Dhol - Traditional Vibes",
      "8 Chhatri Lights - Royal Traditional Look",
      "Vintage Car / Baggi - Royal & Classic Entry",
      "Safa Team by My Safa - For Groom & Baraati",
    ],
    longDescription: `The Raj Tilak package is where it all begins. It's our entry-level offering, built for families who want a proper baraat entry — with a real double-decker DJ truck, live dhol players, a vintage car for the groom, and safa styling for the full baraati group — without spending on effects they don't need.

The truck is a mini double-decker with a professional DJ onboard and a sound system loud enough to fill the street. Two Punjabi dhol players walk alongside, keeping the rhythm going from the moment the procession starts. Eight chhatri lights give the procession a royal, traditional look after dark.

The Liquid CO2 gun adds a burst of fog at just the right moment — when the groom steps out of the vintage car or baggi and enters the venue. It's a single dramatic effect that photographs and videos extremely well.

The safa team from My Safa ties turbans for the groom and the baraati group before the procession. That means no last-minute scrambling and no uneven turbans in the photos. They arrive early, work quickly, and everyone is ready before the procession steps off.

If you're planning a mid-size baraat and want it done properly without unnecessary extras, Raj Tilak is the right call.`,
    bestFor: [
      "Families planning a baraat of 50–150 guests",
      "Venues with narrower roads or tighter entry points",
      "Budget-conscious bookings that still want a premium feel",
      "Day baraats where pyro and LED effects matter less",
      "First-time bookings with PlanMyBaraat",
    ],
    highlights: [
      {
        icon: "🚌",
        heading: "Mini Double Decker DJ Truck",
        body: "A proper double-decker truck with a professional DJ and crystal-clear sound — enough to fill any street and get the crowd dancing before the procession even starts.",
      },
      {
        icon: "🥁",
        heading: "2 Punjabi Dhol Players",
        body: "Live dhol is what separates a real baraat from a quiet procession. Two players walking with the crowd keeps the energy up the entire route.",
      },
      {
        icon: "🎊",
        heading: "Vintage Car + Safa Team",
        body: "The groom arrives in a vintage car or baggi, turbaned by My Safa's professional team. The full baraati group gets safa styling too — so everyone looks the part.",
      },
    ],
    faqs: [
      {
        q: "What does the Raj Tilak package cost?",
        a: "Pricing depends on your city, venue, date, and route length. We give real quotes on WhatsApp — usually within the hour. Message us with your wedding date and area and we'll get back to you fast.",
      },
      {
        q: "Is a vintage car always included, or is it optional?",
        a: "A vintage car or baggi is included in every Raj Tilak booking. You don't need to arrange one separately. If you want an upgraded American vintage car, that's available in the Signature package.",
      },
      {
        q: "Can I add more dhol players to Raj Tilak?",
        a: "Yes. Raj Tilak includes 2 dhol players as standard, but you can add more for an additional cost. Just mention it when you enquire and we'll include it in your quote.",
      },
      {
        q: "Does the safa team cover the entire baraati group?",
        a: "Yes. The My Safa team ties turbans for the groom and the full baraati group, not just the groom. They arrive early enough that everyone is ready before the procession starts.",
      },
    ],
  },
  {
    id: "rajwada",
    name: "Rajwada Package",
    tagline: "The Grand Celebration",
    description: "A grander baraat entry with more music, lights, and entertainment.",
    features: [
      "Mini Double Decker DJ Truck - Full Body Custom Flex Branding",
      "Professional DJ Artist - Premium Sound Quality",
      "Liquid CO2 Gun",
      "4 Punjabi Dhol",
      "10 Premium Chhatri Lights",
      "1 Teddy / Gorilla Artist",
      "Vintage Car / Baggi",
      "Safa Team by My Safa",
    ],
    longDescription: `Rajwada takes everything in Raj Tilak and turns it up. The truck gets full-body custom flex branding — your family's name, the couple's name, a wedding theme — whatever you want printed across the entire vehicle. It becomes a moving billboard for the celebration.

Four dhol players instead of two means the music carries further and the crowd energy stays higher, especially in larger or more spread-out processions. Ten premium chhatri lights (up from eight) fill more of the street with colour and movement.

The biggest addition in Rajwada is the Teddy or Gorilla artist — a costumed performer who walks and dances with the baraati crowd, keeping the energy alive and entertaining guests of all ages. This one element makes the procession visually memorable in a way that pure sound and lights don't.

The vintage car and safa team are included just as in Raj Tilak, and the DJ setup is upgraded to premium sound quality. If you want your baraat to feel like a proper celebration — not just a procession from point A to B — Rajwada gives you the tools to do that.`,
    bestFor: [
      "Baraats with 100–250 guests",
      "Families who want custom branding on the truck",
      "Evening baraats where lights and atmosphere matter",
      "Wedding parties that want crowd entertainment beyond just music",
      "Venues with open roads and more space for the procession",
    ],
    highlights: [
      {
        icon: "🎨",
        heading: "Full Body Custom Flex Branding",
        body: "The entire truck is wrapped with custom artwork — your family name, the couple's name, your wedding theme. A procession that doubles as a statement.",
      },
      {
        icon: "🥁",
        heading: "4 Punjabi Dhol Players",
        body: "Doubling the dhol count fills larger spaces and keeps a bigger crowd moving. Four players create the kind of rhythm that gets even reluctant guests onto the street.",
      },
      {
        icon: "🐻",
        heading: "Teddy / Gorilla Entertainer",
        body: "A costumed performer who dances with the crowd, engages children and guests, and keeps the energy alive across the entire procession route.",
      },
    ],
    faqs: [
      {
        q: "What can we print on the custom truck branding?",
        a: "Almost anything — the bride and groom's names, your family name, a wedding hashtag, a theme-based design, or a combination. Share your idea on WhatsApp and we'll tell you what's possible with your booking timeline.",
      },
      {
        q: "How early do we need to confirm the branding artwork?",
        a: "At least 5–7 days before the wedding so the flex print can be produced and fitted to the truck. If you book last-minute, the truck still comes but branding may not be possible.",
      },
      {
        q: "Is the Gorilla / Teddy artist appropriate for families with children?",
        a: "Yes. The costumed artist is trained to be engaging and non-scary for younger guests while still being entertaining for adults. Most families love this addition.",
      },
      {
        q: "What's the main upgrade from Raj Tilak to Rajwada?",
        a: "Custom truck branding, 2 extra dhol players, 2 extra chhatri lights, and the Gorilla/Teddy entertainer. If you want a more festive, visually customised procession, Rajwada is worth the step up.",
      },
    ],
  },
  {
    id: "maharaja",
    name: "Maharaja Package",
    tagline: "Luxury Beyond Expectations",
    description: "A luxury-packed baraat experience with custom branding and effects.",
    features: [
      "Mini Double Decker DJ Truck - Custom Theme Branding",
      "Professional DJ Artist - Premium Concert Sound & Intelligent Lighting",
      "Moving LED Panels - High Definition Visual Experience",
      "Custom Groom Name LED Letters",
      "Liquid CO2 Gun",
      "Confetti CO2 Gun",
      "Hand Pyro Gun",
      "6 Punjabi Dhol",
      "12 Umbrella Lights (Premium Chhatri)",
      "Professional DJ Jockey",
      "CO2 Jet Effects",
      "2 Professional Bouncers",
      "Vintage Car / Baggi",
      "Safa Team by My Safa",
    ],
    longDescription: `The Maharaja package is where the baraat stops being just a procession and becomes a full production. Every element is designed to create a visual and sonic experience that your guests talk about for months.

The truck comes with moving LED panels — high-definition displays that can show custom content, the groom's name, or dynamic visuals synced to the music. The DJ is a professional jockey running concert-level sound with intelligent lighting control. Six dhol players and 12 premium umbrella chhatri lights fill even the largest venue approaches.

Three types of effects are stacked in Maharaja: Liquid CO2 for fog bursts, Confetti CO2 for a celebratory shower, and a Hand Pyro Gun for directed flame effects. CO2 jet cannons add choreographed blasts timed with key moments in the procession. Together, they turn the groom's arrival into a moment that looks like a film set.

The groom's name in custom LED letters is a Maharaja exclusive. It travels in the procession, visible from a distance, and creates the central photo backdrop when the groom arrives at the venue entrance.

Two professional bouncers manage crowd flow and keep the procession orderly — important when there are hundreds of guests and multiple effect timings to coordinate. The vintage car and safa team complete the package.`,
    bestFor: [
      "Large baraats of 200–400 guests",
      "Evening or night-time processions",
      "Families wanting a cinematic, highly photographed entry",
      "Weddings at large venue complexes with open approach roads",
      "Couples who want their name in lights — literally",
    ],
    highlights: [
      {
        icon: "📺",
        heading: "Moving LED Panels + Groom Name Letters",
        body: "High-definition LED displays on the truck plus custom LED letters spelling the groom's name. A visual centrepiece that photographs like nothing else.",
      },
      {
        icon: "🎆",
        heading: "Triple Effect Stack",
        body: "Liquid CO2, Confetti CO2, and Hand Pyro create a layered effects sequence. Each moment in the procession can have its own visual punctuation.",
      },
      {
        icon: "🎵",
        heading: "Concert-Level Sound & 6 Dhol",
        body: "Professional DJ jockey on intelligent concert sound, backed by six live dhol players. The music carries across the largest open spaces and keeps every guest moving.",
      },
    ],
    faqs: [
      {
        q: "Are the pyro effects safe for guests walking nearby?",
        a: "Yes. All pyro effects used in Maharaja — Hand Pyro and CO2 jets — are professional-grade and operated by trained staff. They are designed for outdoor procession use and maintain a safe distance from guests.",
      },
      {
        q: "Can the LED panels show custom video content or just the groom's name?",
        a: "The moving LED panels can display dynamic visuals and the groom's name. Custom video content requires prior coordination — mention it when enquiring and we'll advise based on your timeline.",
      },
      {
        q: "What do the 2 professional bouncers actually do?",
        a: "They manage crowd flow, keep guests from walking in front of the truck, coordinate effect timing with the DJ, and ensure the procession moves smoothly from start to venue arrival.",
      },
      {
        q: "Is Maharaja available for daytime baraats?",
        a: "Yes, though LED panels and pyro effects are significantly more dramatic after dark. If your baraat is daytime, we can advise which elements deliver the most impact in daylight — just mention the timing when you enquire.",
      },
    ],
  },
  {
    id: "signature",
    name: "Signature Package",
    tagline: "The Ultimate Royal Experience",
    description: "Our most complete, top-tier baraat production — the ultimate royal experience.",
    features: [
      "Sound & Light - Professional Concert Sound & Intelligent Lighting",
      "Pyro Highlight on Entry - Grand Entry with Pyro Effects",
      "Confetti CO2 Gun - Premium Confetti CO2 Gun",
      "Hand Pyro Gun - Safe & Spectacular Hand Pyro Gun",
      "American Vintage Car",
      "4 Professional Bouncers - Trained & Professional Security",
      "Professional DJ Jockey - Experienced DJ Jockey",
      "Entertainer Artist - Live Entertainer & Crowd Engagement",
      "Fake Money Gun - Fun Cash for Grand Celebration",
      "Moving LED Panels - High Resolution Moving LED Panels",
      "Custom Groom Name LED Letters - Customized as per Groom's Name",
      "Liquid CO2 Gun - High Pressure Liquid CO2 Effect",
      "4 Punjabi Dhol - High Energy Dhol Team",
      "10 Premium Chhatri Lights - Royal Premium Chhatri Lights",
      "Teddy / Gorilla Artist - Fun & Interactive Entertainment",
      "Safa Team by My Safa - Royal Safa Team for Groom & Baraatis",
    ],
    longDescription: `The Signature package is the full production. Every element PlanMyBaraat offers is included — nothing held back, nothing to add on. If you want the biggest, most cinematic baraat entry possible, this is the one.

The truck runs concert-level sound with intelligent lighting. A professional DJ jockey controls the music. Moving high-resolution LED panels display dynamic visuals, and the groom's name appears in custom LED letters that travel with the procession and frame the final arrival perfectly.

Five effect types are available: Pyro highlights timed to the venue entry, Confetti CO2 showers, Hand Pyro guns, Liquid CO2 fog, and a Fake Money Gun for a celebratory, cinematic touch that guests absolutely love. An entertainer artist and a Gorilla/Teddy performer keep crowd energy high across every part of the procession route.

The groom rides in an American vintage car — an upgrade from the standard vintage car or baggi in other packages. This is a full classic American automobile, and it makes the groom's arrival a visually distinct moment from any other element.

Four professional bouncers manage the entire procession — crowd flow, effect coordination, guest safety, and timing. Four dhol players and ten premium chhatri lights round out the procession.

The My Safa team provides full turban styling for the groom and the entire baraati group. The Signature package is the one families book when they've decided the baraat is the centrepiece of the wedding, and they want it done at the highest level.`,
    bestFor: [
      "Large, high-profile baraats of 300+ guests",
      "Weddings where the baraat is the centrepiece event",
      "Families who want every effect and element in one package",
      "Night baraats at premium venue complexes",
      "Grooms who want an American vintage car rather than a standard baggi",
    ],
    highlights: [
      {
        icon: "🚗",
        heading: "American Vintage Car",
        body: "A full classic American automobile for the groom's arrival — a significant visual step up from a standard vintage car or baggi, and a photograph centrepiece.",
      },
      {
        icon: "🎇",
        heading: "Five-Layer Effects Stack",
        body: "Pyro on entry, Confetti CO2, Hand Pyro, Liquid CO2 fog, and a Fake Money Gun. Every moment in the procession can be punctuated with a different visual effect.",
      },
      {
        icon: "👑",
        heading: "Full Entertainment Package",
        body: "Live entertainer artist, Gorilla/Teddy performer, 4 dhol players, professional DJ jockey, and 4 bouncers. Nothing is missing. The entire team works together on your booking.",
      },
    ],
    faqs: [
      {
        q: "What's the difference between Maharaja and Signature?",
        a: "Signature adds the American vintage car (vs standard), a Fake Money Gun, a live entertainer artist, a Gorilla/Teddy performer, 2 extra bouncers, and a Pyro Highlight timed to the venue entry. Maharaja is excellent — Signature is the complete package.",
      },
      {
        q: "How far in advance should we book the Signature package?",
        a: "At least 4–6 weeks in advance during wedding season (November to February). Signature requires the most coordination — truck, DJ, effects team, 4 bouncers, entertainer artist, safa team, and the American vintage car all need to be locked in together.",
      },
      {
        q: "Can the Fake Money Gun be used inside the venue?",
        a: "The Fake Money Gun works best outdoors during the procession, where the bills fly freely and get caught on camera. Inside a venue with aircon or tight spaces, the effect is smaller. We'll advise based on your venue layout.",
      },
      {
        q: "Is everything in Signature handled by one team or multiple vendors?",
        a: "One booking, one team. Every element — truck, DJ, dhol, effects operators, bouncers, entertainer, safa team — is coordinated under a single PlanMyBaraat booking. You don't have to manage multiple vendors or timelines.",
      },
    ],
  },
];
