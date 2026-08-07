export interface KeywordFaq {
  q: string;
  a: string;
}

export interface KeywordContent {
  slug: string;
  intro: string;
  explanation: string;
  whatsIncluded: string;
  pricingGuidance: string;
  bookingNotes: string;
  closing: string;
  faqs: KeywordFaq[];
}

export const BARAAT_KEYWORD_CONTENT: Record<string, KeywordContent> = {
  "baraat-on-wheels": {
    slug: "baraat-on-wheels",
    intro:
      "Baraat on wheels is the name for a wedding entry built around a moving DJ truck instead of the groom just walking in with a small band. The truck carries the sound system and lights, and the whole baraati group dances alongside it as it rolls slowly toward the venue.\n\nPlanMyBaraat runs baraat on wheels packages across Gujarat: a double decker DJ truck, a dhol team, a vintage car or baggi for the groom, and a safa team for turban styling, all booked as one package instead of arranging each piece separately.",
    explanation:
      "A baraat on wheels setup replaces the old-style small speaker-on-a-cart with a proper double decker truck that has a full concert sound system, lighting rig, and space for the DJ to perform live while the truck moves. It's become the standard for a modern baraat entry because it keeps the music consistent and loud enough for a large crowd, without anyone having to carry equipment.\n\nThe groom usually arrives separately in a vintage car or on a decorated horse, joins the procession near the entrance, and the whole group — truck, dhol players, dancing guests — moves together toward the venue gate.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, and DJ artist as the base. Raj Tilak, our starting package, adds 2 dhol players and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer for extra entertainment. Maharaja brings moving LED panels on the truck and the groom's name lit up in lights. Signature, our top package, adds a security team plus pyro and confetti effects timed to the truck's arrival.\n\nA vintage car and a safa team are included from Raj Tilak upward, so the entry-level package already covers the full experience, not just the truck.",
    pricingGuidance:
      "Baraat on wheels pricing depends mainly on which package you pick, how many dhol players you want, and whether you add effects like pyro or confetti. Raj Tilak is the most affordable way to get a proper truck entry. Signature costs more because it includes more — bigger truck branding, more dhol, LED visuals, and a security team.\n\nWe don't publish a single flat number because guest count, city, and date all affect the final quote. Message us on WhatsApp with your details and we'll respond with a real price, usually within the hour.",
    bookingNotes:
      "Wedding season in Gujarat runs November to February, and trucks get booked out fast during that window. 3-4 weeks' notice is a safe bet if your date falls in peak season.\n\nWhen you reach out, share your wedding date, city, venue name, and roughly how many guests are walking in the baraat. That's enough for us to recommend the right package and confirm truck availability.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count for the baraat. We'll recommend a package and confirm the truck's available, usually within the hour.",
    faqs: [
      {
        q: "What exactly is baraat on wheels?",
        a: "It's a baraat entry built around a moving DJ truck — the truck carries the sound system and lights while the baraati group dances alongside it toward the venue, instead of a small band walking with a portable speaker.",
      },
      {
        q: "How much does a baraat on wheels setup cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does baraat on wheels include the groom's car?",
        a: "Yes, a vintage car or baggi is included in every package from Raj Tilak upward, so you don't need to arrange transport for the groom separately.",
      },
      {
        q: "Which cities do you cover for baraat on wheels?",
        a: "We run baraat on wheels packages across Gujarat, including Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts in the state.",
      },
      {
        q: "How many dhol players come with a baraat on wheels package?",
        a: "Raj Tilak includes 2 dhol, Rajwada includes 4, and Maharaja and Signature include 6, with Signature adding extra entertainers on top.",
      },
      {
        q: "How early should I book a baraat on wheels truck?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since trucks get booked out fast in peak months.",
      },
      {
        q: "Is the safa team part of the baraat on wheels package?",
        a: "Yes, the My Safa team ties turbans for the groom and the full baraati group, included from the starting package upward.",
      },
      {
        q: "What's the difference between the packages?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, the groom's name in lights, pyro and confetti effects, and a security team.",
      },
    ],
  },

  "dj-truck-for-baraat": {
    slug: "dj-truck-for-baraat",
    intro:
      "A DJ truck for baraat is the double decker vehicle that carries the sound system, lights, and DJ during a wedding procession. It leads the baraati group toward the venue, playing music the whole way so the entry feels like a proper celebration, not just a walk to the gate.\n\nPlanMyBaraat provides the DJ truck as part of a full baraat on wheels package, along with a dhol team, a vintage car, and a safa team — all booked together as one service.",
    explanation:
      "The truck itself is a mini double decker structure, built to carry a full concert-grade sound system on the lower deck and the DJ artist performing live on the upper deck, visible to the whole crowd. Lighting rigs run along the truck for night entries, and on higher packages, moving LED panels and custom name displays are added to the truck's sides.\n\nThe truck moves at walking pace so the baraati group can dance alongside it the whole way to the venue, with the dhol team usually walking just ahead or beside the truck to keep the energy up between DJ tracks.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, and a professional DJ artist as the base. Raj Tilak adds 2 dhol and chhatri lights around the truck. Rajwada steps up to 4 dhol and adds a teddy or gorilla performer. Maharaja brings moving LED panels on the truck body and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects synced to the truck's arrival.\n\nA vintage car and safa team come with every package from Raj Tilak upward, so the truck isn't a standalone rental — it's part of a complete baraat entry.",
    pricingGuidance:
      "DJ truck pricing depends on the package tier, how many dhol players you add, and whether you want extra effects like pyro or confetti timed to the truck's arrival. Raj Tilak is the most affordable option with a proper truck and sound system. Signature costs more because it includes bigger truck branding, more dhol, LED visuals, and a security team.\n\nWe quote based on your actual date, city, and guest count rather than a flat number, since truck size and add-ons vary by package. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and DJ trucks get booked out early during that stretch. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your wedding date, city, and venue when you reach out, along with a rough headcount for the baraati group — that's enough for us to confirm truck availability and recommend a package.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the DJ truck's available and recommend the right package, usually within the hour.",
    faqs: [
      {
        q: "What does a DJ truck for baraat actually look like?",
        a: "It's a mini double decker structure — the sound system sits on the lower deck and the DJ performs live on the upper deck, visible to the whole crowd, with lighting rigs and (on higher packages) LED panels along the sides.",
      },
      {
        q: "How much does a DJ truck for baraat cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Can the DJ truck play any songs I want?",
        a: "Yes, our DJ artists take song requests ahead of time and can build a set around your preferred entry songs and dance tracks for the baraat.",
      },
      {
        q: "Does the truck come with its own driver?",
        a: "Yes, an experienced driver comes with the truck, used to navigating baraat routes at walking pace alongside a dancing crowd.",
      },
      {
        q: "Is the dhol team separate from the DJ truck booking?",
        a: "No, the dhol team is included in the same package as the truck — you don't need to book them separately.",
      },
      {
        q: "How early should I book a DJ truck for baraat?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since trucks get booked out early.",
      },
      {
        q: "Can the truck handle a very large baraati group?",
        a: "Yes, the sound system is built for outdoor, open-crowd use, and we adjust the route plan based on your expected guest count.",
      },
      {
        q: "What's the difference between the package tiers?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, the groom's name in lights, pyro and confetti effects, and a security team.",
      },
    ],
  },

  "how-much-does-baraat-cost": {
    slug: "how-much-does-baraat-cost",
    intro:
      "How much does baraat cost is one of the first questions almost every family asks us, and the honest answer is that it depends on a few clear factors: which package you pick, how many dhol players you want, and whether you add effects like pyro or confetti to the entry.\n\nPlanMyBaraat offers four packages — Raj Tilak, Rajwada, Maharaja, and Signature — each building on the last with more dhol, more visual effects, and more entertainment, so there's a real range to choose from rather than one fixed price.",
    explanation:
      "The base of every package is the same: a double decker DJ truck, a professional DJ artist, a vintage car for the groom, and a safa team for turban styling. What changes as you move up the tiers is the number of dhol players (2 in Raj Tilak, up to 6 in Signature), the lighting and LED setup, and extra elements like a teddy or gorilla performer, pyro effects, confetti cannons, and a security team on the top package.\n\nBecause the base is consistent across every tier, the price difference between packages comes down to exactly how much extra production you want on top of a solid, working baraat entry.",
    whatsIncluded:
      "Raj Tilak, our starting package, includes the DJ truck, sound system, DJ artist, 2 dhol, chhatri lights, a vintage car, and a safa team. Rajwada adds 2 more dhol and a teddy or gorilla performer. Maharaja brings moving LED panels on the truck and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects timed to the truck's arrival.\n\nSo the cost isn't just for the truck — every tier includes the full entry: truck, dhol, car, and safa team together.",
    pricingGuidance:
      "We don't publish one flat number for baraat cost because your actual quote depends on the package, dhol count, extra effects, your city, and your guest count. What we can say is that Raj Tilak is the most affordable way to get a full, proper baraat entry, and Signature is the most complete, production-heavy option.\n\nThe fastest way to get a real number is to message us on WhatsApp with your wedding date, city, and rough guest count — we'll respond with an actual quote, usually within the hour, instead of a generic estimate.",
    bookingNotes:
      "Wedding season runs November to February across Gujarat, and prices and availability both tighten up during that window. Booking 3-4 weeks ahead during peak season is a safe bet, especially if you want a specific package or add-on.\n\nWhen you reach out, share your date, city, venue, and roughly how many guests will be in the baraat — that's enough for us to give you an accurate quote rather than a rough range.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll send you a real quote for the package that fits your baraat, usually within the hour.",
    faqs: [
      {
        q: "How much does baraat cost on average?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote instead of a generic estimate.",
      },
      {
        q: "What's included in the baraat cost?",
        a: "Every package includes the DJ truck, sound system, DJ artist, dhol team, a vintage car, and a safa team. Higher tiers add more dhol, LED visuals, entertainers, and effects like pyro and confetti.",
      },
      {
        q: "Why don't you list a fixed price?",
        a: "Because the real cost depends on your city, date, guest count, and which add-ons you want, so a single flat number would be misleading. We quote based on your actual details.",
      },
      {
        q: "Is the cheapest package still a full baraat entry?",
        a: "Yes, Raj Tilak includes the truck, DJ, 2 dhol, chhatri lights, a vintage car, and a safa team — it's a complete entry, just with less production than the higher tiers.",
      },
      {
        q: "Does the guest count affect the price?",
        a: "It can factor into our recommendation, since a bigger baraati group sometimes calls for a bigger sound setup or more dhol, but the packages themselves are fixed tiers.",
      },
      {
        q: "How much more does the top package cost compared to the starting one?",
        a: "Signature costs more than Raj Tilak because it includes triple the dhol count, moving LED screens, the groom's name in lights, pyro and confetti effects, and a security team — significantly more production overall.",
      },
      {
        q: "Do prices change based on the city?",
        a: "Yes, logistics can vary slightly by city, which is why we confirm your exact quote once we know your date and location rather than quoting blind.",
      },
      {
        q: "How do I get an exact quote?",
        a: "Message us on WhatsApp with your wedding date, city, venue, and rough guest count, and we'll respond with a real number, usually within the hour.",
      },
    ],
  },

  "double-decker-dj-truck": {
    slug: "double-decker-dj-truck",
    intro:
      "A double decker DJ truck is a two-level vehicle built specifically for wedding entries — the sound system and equipment sit on the lower deck, while the DJ performs live on the upper deck, raised above the crowd so everyone can see them working the set.\n\nPlanMyBaraat's double decker DJ truck comes as part of a full baraat package, alongside a dhol team, a vintage car, and a safa team, not as a standalone rental.",
    explanation:
      "The two-level design solves a real problem: a DJ standing at ground level in a crowd gets lost, and a static speaker setup can't move with the procession. The double decker structure raises the performance above the baraati group, keeps the sound equipment stable and protected, and lets the truck roll slowly at walking pace while the whole crowd dances around it.\n\nLighting rigs run along both decks, and on higher packages, moving LED panels and custom name displays are added to the truck body itself, making the truck as much a visual centerpiece as a sound source.",
    whatsIncluded:
      "Every package includes the double decker truck, sound system, and a professional DJ artist as the base. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up on the truck. Signature, the top package, adds a security team plus pyro and confetti effects timed to the truck's arrival.\n\nA vintage car and safa team come with every package from Raj Tilak upward, so the truck is always part of a complete entry, not a rental on its own.",
    pricingGuidance:
      "Double decker DJ truck pricing depends on the package tier, dhol count, and any extra effects you add. Raj Tilak is the most affordable option that still includes a proper double decker setup. Signature costs more because it includes bigger truck branding, more dhol, LED visuals, and a security team.\n\nWe quote based on your date, city, and guest count rather than a flat number. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and double decker trucks get booked out fast during that window. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your wedding date, city, and venue when you reach out, along with a rough headcount for the baraati group — that's enough for us to confirm truck availability.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the double decker truck's available, usually within the hour.",
    faqs: [
      {
        q: "What makes a double decker DJ truck different from a regular DJ setup?",
        a: "The two-level structure raises the DJ above the crowd on the upper deck while the sound system sits on the lower deck, so the performance is visible and the equipment stays stable while the truck moves.",
      },
      {
        q: "How much does a double decker DJ truck cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the truck move during the baraat or stay parked?",
        a: "It moves at walking pace alongside the baraati group for the whole procession, not just parked at one spot.",
      },
      {
        q: "Is the double decker truck safe for a large crowd?",
        a: "Yes, the driver is experienced with navigating baraat routes slowly through a dancing crowd, and the structure is built for this exact use.",
      },
      {
        q: "Can I see photos of the truck before booking?",
        a: "Yes, message us on WhatsApp and we'll share photos and videos of the truck setup for your reference.",
      },
      {
        q: "How early should I book a double decker DJ truck?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since trucks get booked out fast.",
      },
      {
        q: "Does the truck come with lighting built in?",
        a: "Yes, chhatri lights come with the starting package, and higher tiers add moving LED panels and custom name displays on the truck body.",
      },
      {
        q: "What's the difference between the package tiers?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, the groom's name in lights, pyro and confetti effects, and a security team.",
      },
    ],
  },

  "dj-truck-rental-for-wedding": {
    slug: "dj-truck-rental-for-wedding",
    intro:
      "Searching for a DJ truck rental for wedding usually means you want the truck itself — the sound, the lights, the moving stage — without having to think about the rest of the baraat separately. That's exactly how PlanMyBaraat packages it.\n\nInstead of a standalone rental, our DJ truck comes bundled with a dhol team, a vintage car for the groom, and a safa team, all as one booking with one point of contact.",
    explanation:
      "A pure equipment rental leaves you to arrange the dhol group, the groom's transport, and turban styling separately, often with different vendors who don't coordinate with each other. Our approach treats the truck as one piece of a complete entry, so timing, routing, and styling are all planned together rather than stitched together on the day.\n\nThe truck itself carries a full sound system and DJ setup, with the artist performing live as the truck moves slowly toward the venue at the pace of the dancing crowd.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, and DJ artist as the base. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team are included from Raj Tilak upward, so you're not renting a truck — you're booking a full entry.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Raj Tilak is the most affordable way to get a proper truck rental bundled with the rest of the entry. Signature costs more because it includes more — bigger branding, more dhol, LED visuals, and a security team.\n\nWe quote based on your actual date, city, and guest count. Message us on WhatsApp for a real number.",
    bookingNotes:
      "Wedding season runs November to February, and trucks get booked out fast during that window. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your wedding date, city, venue, and rough guest count when you reach out — that's enough for us to confirm availability and recommend a package.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the truck's available and recommend the right package, usually within the hour.",
    faqs: [
      {
        q: "Can I rent just the DJ truck without the other services?",
        a: "We package the truck with the dhol team, vintage car, and safa team as one complete entry rather than renting the truck alone, since that's what makes the baraat cohesive.",
      },
      {
        q: "How much does a DJ truck rental for wedding cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the rental include the DJ artist?",
        a: "Yes, a professional DJ artist performing live on the truck is included in every package, not billed separately.",
      },
      {
        q: "What cities do you offer this in?",
        a: "We cover Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat.",
      },
      {
        q: "How far in advance should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since trucks get booked out fast.",
      },
      {
        q: "Is there a difference between a rental and a package?",
        a: "Our package bundles the truck with dhol, car, and safa team as one coordinated booking, which is more reliable than piecing together separate rentals from different vendors.",
      },
      {
        q: "Can the truck be customized with our names or theme?",
        a: "Yes, the Maharaja and Signature packages include the groom's name displayed in LED lights on the truck, and custom branding can be discussed on request.",
      },
      {
        q: "What's included in the starting package?",
        a: "Raj Tilak covers the truck, DJ, 2 dhol, chhatri lights, a vintage car, and a safa team — a complete entry at the most affordable tier.",
      },
    ],
  },

  "dj-truck-hire-for-baraat": {
    slug: "dj-truck-hire-for-baraat",
    intro:
      "DJ truck hire for baraat is the search families use when they want to book the truck that leads the wedding procession — the double decker vehicle with the sound system and DJ that everyone dances alongside on the way to the venue.\n\nPlanMyBaraat handles this as part of a complete baraat package: the truck, a dhol team, a vintage car, and a safa team, all under one booking.",
    explanation:
      "Hiring the truck on its own means you'd still need to separately find dhol players, arrange the groom's transport, and book someone for turban styling — three more vendors to coordinate on the wedding day. Our packages remove that friction by bundling everything the baraat entry needs into one booking with one point of contact.\n\nThe truck itself moves at walking pace with the DJ performing live, while the dhol team keeps the energy up alongside it, and the groom arrives in a vintage car that joins the procession near the entrance.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, and DJ artist. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team are included from Raj Tilak upward, so hiring the truck through us means hiring the full entry.",
    pricingGuidance:
      "Pricing depends on the package, dhol count, and any extra effects. Raj Tilak is the most affordable option and Signature is the most complete. We quote based on your actual date, city, and guest count rather than a flat number.\n\nMessage us on WhatsApp with your details and we'll respond with a real quote, usually within the hour.",
    bookingNotes:
      "Wedding season runs November to February, and trucks book out fast during that stretch. 3-4 weeks' notice is a safe bet for peak season.\n\nShare your date, city, venue, and rough guest count when you reach out — that's enough for us to confirm the truck's available.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the truck's available and recommend a package, usually within the hour.",
    faqs: [
      {
        q: "How do I hire a DJ truck for my baraat?",
        a: "Message us on WhatsApp with your wedding date, city, venue, and rough guest count. We'll recommend a package and confirm the truck's available, usually within the hour.",
      },
      {
        q: "How much does DJ truck hire for baraat cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Do I need to hire the dhol team separately?",
        a: "No, the dhol team is included in the same package as the truck, so you don't need to book them separately.",
      },
      {
        q: "Does hiring the truck include a driver?",
        a: "Yes, an experienced driver comes with the truck, used to navigating baraat routes at walking pace alongside a dancing crowd.",
      },
      {
        q: "Can I hire the truck for a single evening only?",
        a: "Yes, our packages are built around a single baraat entry, typically for a few hours around the procession and venue arrival.",
      },
      {
        q: "How far in advance should I hire the truck?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since trucks book out fast.",
      },
      {
        q: "Is the vintage car included when I hire the truck?",
        a: "Yes, a vintage car or baggi for the groom is included in every package from Raj Tilak upward.",
      },
      {
        q: "What's the difference between the package tiers?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, the groom's name in lights, pyro and confetti effects, and a security team.",
      },
    ],
  },

  "dj-truck-booking-price": {
    slug: "dj-truck-booking-price",
    intro:
      "DJ truck booking price is what most people are really asking when they search for baraat truck costs — they want a sense of the range before they reach out. The honest answer: it depends on the package, dhol count, and any extra effects, not a single fixed number.\n\nPlanMyBaraat's DJ truck comes as part of a full baraat package — truck, dhol team, vintage car, and safa team — so the booking price covers the whole entry, not just the vehicle.",
    explanation:
      "The base of every package — truck, sound system, and DJ artist — stays the same across all four tiers. What changes the booking price is the number of dhol players (2 to 6), the lighting and LED setup on the truck, and add-ons like a teddy or gorilla performer, pyro effects, confetti cannons, and a security team on the top package.\n\nBecause the truck is never sold as a standalone item, the booking price you get quoted already includes the vintage car and safa team, which is worth keeping in mind when comparing against a bare equipment rental elsewhere.",
    whatsIncluded:
      "Raj Tilak, our starting package, includes the truck, DJ artist, 2 dhol, chhatri lights, a vintage car, and a safa team. Rajwada adds 2 more dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.",
    pricingGuidance:
      "We don't publish one flat number because the real booking price depends on your city, date, guest count, and which package and add-ons you want. Raj Tilak is the most affordable way to get a proper truck entry, and Signature is the most complete, production-heavy option.\n\nThe fastest way to get an exact price is to message us on WhatsApp with your wedding date, city, and rough guest count — we'll respond with a real quote, usually within the hour.",
    bookingNotes:
      "Wedding season runs November to February, and truck booking prices and availability both tighten during that window. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and guest count when you reach out — that's enough for an accurate quote.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll send you a real booking price, usually within the hour.",
    faqs: [
      {
        q: "What's the DJ truck booking price range?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the booking price include the dhol team?",
        a: "Yes, dhol players are included in every package — 2 in Raj Tilak, up to 6 in Signature — so it's not a separate line item.",
      },
      {
        q: "Is a deposit needed to confirm the booking?",
        a: "Yes, we usually take an advance payment to lock in your date, with the balance due closer to the event. We'll share exact terms once you confirm your package.",
      },
      {
        q: "Why do prices vary between quotes I've seen online?",
        a: "Different vendors bundle different things — some quote the truck alone, others include dhol, car, and safa team like we do. Compare what's actually included, not just the number.",
      },
      {
        q: "Does the price change by city?",
        a: "Logistics can vary slightly by city, which is why we confirm your exact price once we know your date and location rather than quoting blind.",
      },
      {
        q: "How early should I lock in a booking price?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since prices and truck availability both tighten during peak season.",
      },
      {
        q: "Can I customize a package to fit my budget?",
        a: "Yes, tell us your budget and requirements on WhatsApp and we'll recommend the package tier that fits best.",
      },
      {
        q: "What's the cheapest way to book a DJ truck?",
        a: "Raj Tilak is our most affordable package and still includes the full entry — truck, DJ, 2 dhol, chhatri lights, car, and safa team.",
      },
    ],
  },

  "dj-van-for-wedding": {
    slug: "dj-van-for-wedding",
    intro:
      "A DJ van for wedding is another name for the same double decker truck setup — a vehicle carrying the sound system and DJ that leads the baraat procession toward the venue, with the whole group dancing alongside it.\n\nPlanMyBaraat's DJ van comes as part of a complete baraat package: the vehicle itself, a dhol team, a vintage car for the groom, and a safa team, booked together as one service.",
    explanation:
      "Whether you call it a DJ van, DJ truck, or baraat truck, the setup is the same — a two-level structure with the sound system on the lower deck and the DJ performing live on the upper deck, visible above the crowd. The vehicle moves at walking pace so the baraati group can dance alongside it the whole way to the venue.\n\nWe use a mini double decker structure specifically, which gives better visibility and sound projection than a regular van with speakers mounted on top.",
    whatsIncluded:
      "Every package includes the DJ van, sound system, and DJ artist as the base. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team come with every package from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Raj Tilak is the most affordable option and Signature is the most complete. We quote based on your actual date, city, and guest count.\n\nMessage us on WhatsApp with your details and we'll respond with a real quote, usually within the hour.",
    bookingNotes:
      "Wedding season runs November to February, and DJ vans get booked out fast during that window. 3-4 weeks' notice is a safe bet for peak season.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the DJ van's available, usually within the hour.",
    faqs: [
      {
        q: "Is a DJ van the same as a DJ truck?",
        a: "Yes, we use the same double decker truck structure for both — the terms are used interchangeably by different families searching for the same setup.",
      },
      {
        q: "How much does a DJ van for wedding cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the DJ van come with lighting?",
        a: "Yes, chhatri lights come with the starting package, and higher tiers add moving LED panels and custom name displays on the vehicle.",
      },
      {
        q: "Can the DJ van play a custom playlist?",
        a: "Yes, our DJ artists take song requests ahead of time and build a set around your preferred entry and dance tracks.",
      },
      {
        q: "How far in advance should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since vans get booked out fast.",
      },
      {
        q: "Does the van include the dhol team?",
        a: "Yes, dhol players are included in every package, not booked separately.",
      },
      {
        q: "What cities do you offer this in?",
        a: "We cover Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat.",
      },
      {
        q: "What's included in the starting package?",
        a: "Raj Tilak covers the DJ van, DJ artist, 2 dhol, chhatri lights, a vintage car, and a safa team.",
      },
    ],
  },

  "dj-on-wheels-for-wedding": {
    slug: "dj-on-wheels-for-wedding",
    intro:
      "DJ on wheels for wedding describes a moving DJ setup mounted on a truck, built for baraat entries where the music needs to travel with the procession rather than stay fixed in one spot.\n\nPlanMyBaraat runs this as a full package: a double decker DJ truck, a dhol team, a vintage car, and a safa team, booked together for your baraat entry.",
    explanation:
      "A DJ on wheels setup solves the core problem of a moving procession — a fixed sound system can't follow the crowd, and a portable speaker isn't loud enough for a large group. Our double decker truck carries a full concert sound system and the DJ artist performs live from the upper deck as the truck moves at walking pace.\n\nThe dhol team walks alongside or just ahead of the truck to keep the energy up between DJ tracks, and the whole procession moves together toward the venue entrance.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, and DJ artist. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team are included from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package, dhol count, and any extra effects. Raj Tilak is the most affordable option and Signature is the most complete. We quote based on your date, city, and guest count.\n\nMessage us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for DJ on wheels setups peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "What does DJ on wheels mean exactly?",
        a: "It's a DJ setup mounted on a moving truck, so the music travels with the baraat procession instead of staying fixed at the venue entrance.",
      },
      {
        q: "How much does DJ on wheels for wedding cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the truck stop at the venue or keep moving?",
        a: "It moves the whole way from the starting point to the venue entrance, then typically stops once the baraat has arrived.",
      },
      {
        q: "Is the sound quality good for an outdoor crowd?",
        a: "Yes, the truck carries a concert-grade sound system built for open-air, moving-crowd use.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window.",
      },
      {
        q: "Does the package include the groom's transport?",
        a: "Yes, a vintage car or baggi is included in every package from Raj Tilak upward.",
      },
      {
        q: "Can I request specific songs for the entry?",
        a: "Yes, our DJ artists take requests ahead of time and build the set around your preferred entry and dance tracks.",
      },
      {
        q: "What's the difference between the packages?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, the groom's name in lights, pyro and confetti effects, and a security team.",
      },
    ],
  },

  "mobile-dj-truck-for-baraat": {
    slug: "mobile-dj-truck-for-baraat",
    intro:
      "A mobile DJ truck for baraat is exactly what it sounds like — a truck-mounted DJ setup that moves with the procession instead of staying fixed at one point, so the music never stops as the baraati group walks toward the venue.\n\nPlanMyBaraat's mobile DJ truck comes as part of a full baraat package, alongside a dhol team, a vintage car, and a safa team.",
    explanation:
      "The mobility is the whole point — a fixed sound system at the venue entrance means the baraat walks in silence until they arrive, which defeats the purpose of a grand entry. Our truck carries the sound system and DJ artist and moves at walking pace for the entire route, so the music and energy build the whole way, not just at the last few steps.\n\nThe dhol team walks alongside the truck to keep rhythm going between DJ tracks, and the whole procession arrives at the venue together as one continuous celebration.",
    whatsIncluded:
      "Every package includes the mobile DJ truck, sound system, and DJ artist. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team are included from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package, dhol count, and any extra effects. Raj Tilak is the most affordable option and Signature is the most complete. We quote based on your date, city, and guest count.\n\nMessage us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and mobile DJ trucks get booked out fast during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the truck's available, usually within the hour.",
    faqs: [
      {
        q: "Does the mobile DJ truck play music the whole route?",
        a: "Yes, the DJ performs live from the truck for the entire walk from the starting point to the venue, not just at the entrance.",
      },
      {
        q: "How much does a mobile DJ truck for baraat cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "What speed does the truck move at?",
        a: "It moves at walking pace so the baraati group can dance alongside it comfortably the whole way.",
      },
      {
        q: "Can the truck navigate narrow lanes?",
        a: "In most cases yes, though we check your exact venue's approach road in advance since some older neighborhoods have narrower lanes.",
      },
      {
        q: "How early should I book a mobile DJ truck?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since trucks get booked out fast.",
      },
      {
        q: "Is the dhol team included with the truck?",
        a: "Yes, dhol players are included in every package alongside the truck, not booked separately.",
      },
      {
        q: "Does the truck have lighting for evening entries?",
        a: "Yes, chhatri lights come with the starting package, and higher tiers add moving LED panels.",
      },
      {
        q: "What's included in the starting package?",
        a: "Raj Tilak covers the truck, DJ, 2 dhol, chhatri lights, a vintage car, and a safa team.",
      },
    ],
  },

  "wedding-dj-truck-with-lights": {
    slug: "wedding-dj-truck-with-lights",
    intro:
      "A wedding DJ truck with lights is the standard setup for an evening baraat entry — the truck carries not just the sound system but a full lighting rig, so the entry looks as good as it sounds once the sun goes down.\n\nPlanMyBaraat's DJ truck comes with lighting built in from the starting package, as part of a complete baraat entry alongside a dhol team, a vintage car, and a safa team.",
    explanation:
      "Chhatri lights — traditional umbrella-style lights carried or mounted around the truck — come standard with every package, giving the entry a warm, festive glow for evening processions. On higher packages, we add moving LED panels along the truck body and custom LED lettering that spells out the groom's name, visible from a distance as the truck approaches.\n\nThe lighting is designed to work with the truck's movement, so it stays bright and visible the whole route, not just when the truck is stationary.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, and lighting as the base. Raj Tilak includes 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team come with every package from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and how much lighting and effects you want. Raj Tilak is the most affordable option with proper chhatri lighting included. Signature costs more because it includes moving LED panels, custom name lighting, and more.\n\nMessage us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and evening entries with full lighting are especially popular during that stretch. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the truck's available, usually within the hour.",
    faqs: [
      {
        q: "Does every package include lighting on the truck?",
        a: "Yes, chhatri lights come with every package starting from Raj Tilak, and higher tiers add moving LED panels and custom name lettering.",
      },
      {
        q: "How much does a wedding DJ truck with lights cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Can the lights spell out our names?",
        a: "Yes, the Maharaja and Signature packages include the groom's name displayed in custom LED lettering on the truck.",
      },
      {
        q: "Is the lighting good enough for a night entry?",
        a: "Yes, the lighting setup is built specifically for evening and night baraat entries, when it has the most visual impact.",
      },
      {
        q: "How early should I book for an evening entry?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since evening slots are especially popular.",
      },
      {
        q: "Does the lighting work while the truck is moving?",
        a: "Yes, it's designed to stay bright and visible for the whole moving procession, not just when the truck is parked.",
      },
      {
        q: "Can I choose a specific lighting color theme?",
        a: "Message us on WhatsApp with your preferences and we'll let you know what's possible for your package.",
      },
      {
        q: "What's the difference between the package tiers?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, the groom's name in lights, pyro and confetti effects, and a security team.",
      },
    ],
  },

  "dj-truck-with-sound-system-rental": {
    slug: "dj-truck-with-sound-system-rental",
    intro:
      "Searching for a DJ truck with sound system rental usually means you want to be sure the audio quality is genuinely good, not just a truck with a small speaker bolted on. PlanMyBaraat's trucks carry a concert-grade sound system built for outdoor, moving-crowd use.\n\nThe truck and sound system come as part of a full baraat package, alongside a dhol team, a vintage car, and a safa team.",
    explanation:
      "Outdoor sound for a moving crowd is different from indoor venue audio — it needs to project clearly over dhol drums, crowd noise, and open-air acoustics without distortion. Our trucks are fitted with a professional sound system sized for this exact use, run by a DJ artist who performs live rather than just playing a fixed playlist.\n\nThe sound system sits on the lower deck of the double decker truck, with the DJ performing on the upper deck, so the audio quality holds up even as the truck moves at walking pace through a dancing crowd.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, and DJ artist as the base. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team come with every package from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Raj Tilak is the most affordable option with a proper sound system included. Signature costs more because it includes more overall production.\n\nMessage us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for full sound setups peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "Is the sound system good enough for a large outdoor crowd?",
        a: "Yes, the truck carries a concert-grade sound system specifically built for outdoor, moving-crowd baraat use.",
      },
      {
        q: "How much does a DJ truck with sound system rental cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does a live DJ operate the sound system?",
        a: "Yes, a professional DJ artist performs live from the truck rather than just running a fixed playlist.",
      },
      {
        q: "Can the sound system handle both music and announcements?",
        a: "Yes, it's set up for both continuous music and any announcements you might need during the procession.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since trucks get booked out fast.",
      },
      {
        q: "Does the sound quality hold up while the truck is moving?",
        a: "Yes, it's designed for exactly that — steady, clear sound as the truck moves at walking pace through the crowd.",
      },
      {
        q: "Is the dhol team included with the sound system rental?",
        a: "Yes, dhol players are included in every package, not booked separately from the truck.",
      },
      {
        q: "What's included in the starting package?",
        a: "Raj Tilak covers the truck, sound system, DJ artist, 2 dhol, chhatri lights, a vintage car, and a safa team.",
      },
    ],
  },

  "baraat-entry-truck-booking": {
    slug: "baraat-entry-truck-booking",
    intro:
      "Baraat entry truck booking is the process of reserving the double decker DJ truck that leads your wedding procession — and with PlanMyBaraat, that booking covers the whole entry, not just the vehicle.\n\nOne booking gets you the truck, a dhol team, a vintage car for the groom, and a safa team, coordinated as a single service from date confirmation through the entry itself.",
    explanation:
      "A baraat entry truck booking typically starts with a WhatsApp conversation about your date, city, venue, and rough guest count. From there we recommend a package, confirm the truck's availability, and lock in the date. On the day, our team handles the truck, dhol, car, and safa styling as one coordinated operation rather than separate vendors showing up independently.\n\nThis matters because timing is everything in a baraat — the truck, dhol, and groom's car all need to arrive and move together, which is much easier when one team is managing all of it.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, and DJ artist. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team come with every package from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package, dhol count, and any extra effects. Raj Tilak is the most affordable option and Signature is the most complete. We quote based on your date, city, and guest count.\n\nMessage us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and truck booking slots fill up fast during that window. 3-4 weeks' notice is a safe bet for peak season dates.\n\nWhen you reach out, share your date, city, venue, and rough guest count — we'll confirm availability and walk you through the packages.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the truck's available, usually within the hour.",
    faqs: [
      {
        q: "How does baraat entry truck booking work?",
        a: "Message us on WhatsApp with your date, city, venue, and rough guest count. We'll recommend a package, confirm truck availability, and lock in your date.",
      },
      {
        q: "How much does baraat entry truck booking cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Do I need to pay a deposit to confirm the booking?",
        a: "Yes, we usually take an advance payment to lock in your date, with the balance due closer to the event. We'll share exact terms once you confirm a package.",
      },
      {
        q: "What happens if my wedding date changes?",
        a: "Message us as soon as you know so we can check truck availability for the new date and adjust the booking.",
      },
      {
        q: "How far in advance should I complete the booking?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since booking slots fill up fast.",
      },
      {
        q: "Is the whole team coordinated under one booking?",
        a: "Yes, the truck, dhol team, car, and safa team are all managed by us as one operation, not separate vendors.",
      },
      {
        q: "Can I change my package after booking?",
        a: "Message us and we'll see what's possible depending on your date and how far out we are from the event.",
      },
      {
        q: "What info do you need to confirm a booking?",
        a: "Your wedding date, city, venue, rough guest count, and preferred package — that's enough for us to confirm and lock in the truck.",
      },
    ],
  },

  "baraat-truck-decoration-ideas": {
    slug: "baraat-truck-decoration-ideas",
    intro:
      "Baraat truck decoration ideas usually come up once families have picked a package and start thinking about how to make the truck feel personal — custom branding, lighting themes, and small touches that make the entry feel like theirs specifically.\n\nPlanMyBaraat's packages come with a base level of decoration and lighting built in, with more customization available as you move up the package tiers.",
    explanation:
      "Every truck comes with chhatri lights as standard, giving a warm, traditional look right out of the starting package. From there, decoration options scale up: full body flex branding on the truck at the Rajwada tier, custom theme branding at Maharaja, and the groom's name spelled out in LED lettering from Maharaja upward.\n\nBeyond the truck itself, decoration extends to the overall look of the entry — the vintage car is styled for the occasion, and the safa team's turban styling for the groom and baraatis adds another visual layer to the whole procession.",
    whatsIncluded:
      "Raj Tilak includes chhatri lights around the truck. Rajwada adds full body custom flex branding. Maharaja brings custom theme branding, moving LED panels, and the groom's name in LED letters. Signature includes all of this plus pyro and confetti effects timed to the truck's arrival for maximum visual impact.\n\nA vintage car and safa team are styled as part of every package, adding to the overall decorated look of the entry.",
    pricingGuidance:
      "Decoration level scales with the package tier — the more elaborate the branding and lighting you want, the higher up the tiers you'll look. Raj Tilak covers the basics well, while Maharaja and Signature offer the most customization.\n\nMessage us on WhatsApp with your date and city, and mention any specific decoration ideas you have — we'll let you know what's possible within each package.",
    bookingNotes:
      "Wedding season runs November to February. If you have specific decoration or branding requests, mention them early — 3-4 weeks' notice gives us time to plan the details properly.\n\nShare your date, city, venue, and any decoration preferences when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and any decoration ideas you have in mind, and we'll let you know what fits your package.",
    faqs: [
      {
        q: "Can I customize the truck's decoration?",
        a: "Yes, decoration options scale with the package — full body branding from Rajwada upward, and custom theme branding with LED name lettering from Maharaja upward.",
      },
      {
        q: "What decoration comes with the starting package?",
        a: "Raj Tilak includes chhatri lights around the truck, giving a warm, traditional look for the entry.",
      },
      {
        q: "Can the truck display our names?",
        a: "Yes, the Maharaja and Signature packages include the groom's name displayed in custom LED lettering on the truck.",
      },
      {
        q: "Are there theme options for the truck branding?",
        a: "Yes, custom theme branding is available from the Maharaja package upward — message us with your ideas on WhatsApp.",
      },
      {
        q: "Does decoration cost extra on top of the package price?",
        a: "No, the decoration level is built into each package tier, so there's no separate add-on charge for the base decoration included in your chosen package.",
      },
      {
        q: "How early should I share decoration ideas?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we have time to plan any specific branding or theme details properly.",
      },
      {
        q: "Is the vintage car decorated too?",
        a: "Yes, the vintage car is styled for the occasion as part of every package, not left plain.",
      },
      {
        q: "Which package has the most decoration options?",
        a: "Signature, our top package, includes the most decoration along with pyro and confetti effects for maximum visual impact.",
      },
    ],
  },

  "baraat-truck-price": {
    slug: "baraat-truck-price",
    intro:
      "Baraat truck price depends on which package you pick, how many dhol players you want, and whether you add effects like pyro or confetti — there's no single flat number, but there is a clear range across our four packages.\n\nPlanMyBaraat's baraat truck price always covers the full entry: the truck, dhol team, vintage car, and safa team together, not the truck alone.",
    explanation:
      "The base — truck, sound system, and DJ artist — is consistent across every package. What moves the price up as you go through the tiers is the dhol count (2 to 6), the lighting and LED setup, and extras like a teddy or gorilla performer, pyro effects, confetti cannons, and a security team on Signature, our top package.\n\nBecause the price always includes the vintage car and safa team too, it's worth comparing against the full entry cost elsewhere, not just a bare truck rental quote.",
    whatsIncluded:
      "Raj Tilak includes the truck, DJ artist, 2 dhol, chhatri lights, a vintage car, and a safa team. Rajwada adds 2 more dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature adds a security team plus pyro and confetti effects.",
    pricingGuidance:
      "We don't publish a flat baraat truck price because it depends on your city, date, guest count, and package choice. Raj Tilak is the most affordable way to get a proper truck entry, and Signature is the most complete.\n\nMessage us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real price, usually within the hour.",
    bookingNotes:
      "Wedding season runs November to February, and both price and truck availability tighten during that window. 3-4 weeks' notice is a safe bet for peak season.\n\nShare your date, city, venue, and guest count when you reach out for an accurate quote.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll send you a real baraat truck price, usually within the hour.",
    faqs: [
      {
        q: "What's the baraat truck price range?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the price include just the truck or the full entry?",
        a: "The full entry — truck, dhol team, vintage car, and safa team are all included in every package price.",
      },
      {
        q: "Is Raj Tilak a full baraat entry or a stripped-down version?",
        a: "It's a complete entry with the truck, DJ, 2 dhol, chhatri lights, car, and safa team — just with less production than the higher tiers, not missing any core piece.",
      },
      {
        q: "Why is Signature more expensive?",
        a: "It includes 6 dhol, moving LED screens, the groom's name in lights, pyro and confetti effects, and a security team — significantly more production than the starting package.",
      },
      {
        q: "Does the price change based on my city?",
        a: "Logistics can vary slightly, which is why we confirm your exact price once we know your date and location rather than quoting blind.",
      },
      {
        q: "How early should I lock in a price?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since prices and availability both tighten during peak season.",
      },
      {
        q: "Can I negotiate the baraat truck price?",
        a: "Message us with your budget and requirements on WhatsApp and we'll recommend the package that fits best.",
      },
      {
        q: "How do I get an exact price for my date?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real number, usually within the hour.",
      },
    ],
  },

  "book-baraat-dj-truck-online": {
    slug: "book-baraat-dj-truck-online",
    intro:
      "Booking a baraat DJ truck online with PlanMyBaraat starts with a WhatsApp message, not a long form — you tell us your date, city, and rough guest count, and we take it from there.\n\nThe online booking process covers the full entry: the truck, a dhol team, a vintage car, and a safa team, not just the vehicle.",
    explanation:
      "Instead of filling out a lengthy form and waiting for a callback, our process is built around WhatsApp because that's where most of the actual back-and-forth happens anyway — sharing photos, confirming dates, answering questions. You reach out, we respond with package options and a real quote, and once you confirm, we lock in your date.\n\nThis online-first approach also means you can browse packages, see what's included, and start the conversation whenever it's convenient, without needing to call during office hours.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, and DJ artist. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team come with every package from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package, dhol count, and any extra effects. Raj Tilak is the most affordable option and Signature is the most complete. We quote based on your date, city, and guest count.\n\nMessage us on WhatsApp for a real quote, usually within the hour.",
    bookingNotes:
      "Wedding season runs November to February, and online booking slots fill up fast during that window. 3-4 weeks' notice is a safe bet for peak season.\n\nShare your date, city, venue, and rough guest count when you message us — that's enough to get started.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue to start the booking process, usually confirmed within the hour.",
    faqs: [
      {
        q: "How do I book a baraat DJ truck online?",
        a: "Message us on WhatsApp with your wedding date, city, venue, and rough guest count. We'll recommend a package and confirm availability, usually within the hour.",
      },
      {
        q: "Is there a website form I need to fill out?",
        a: "No, WhatsApp is our main booking channel — it's faster and lets us share photos, quotes, and answer questions directly.",
      },
      {
        q: "How much does the truck cost when booked online?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city for a real quote.",
      },
      {
        q: "Can I pay a deposit online?",
        a: "Yes, we'll share payment details once you confirm your package and date, and take an advance to lock in the booking.",
      },
      {
        q: "How quickly do you respond to online inquiries?",
        a: "Usually within the hour during business hours, sometimes faster during less busy periods.",
      },
      {
        q: "Can I see photos of the truck before booking online?",
        a: "Yes, message us on WhatsApp and we'll share photos and videos of the truck and past setups.",
      },
      {
        q: "How early should I book online for peak season?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since slots fill up fast.",
      },
      {
        q: "What details do I need to book online?",
        a: "Your wedding date, city, venue, rough guest count, and preferred package — that's enough for us to confirm.",
      },
    ],
  },

  "baraat-dj-on-rent": {
    slug: "baraat-dj-on-rent",
    intro:
      "Baraat DJ on rent typically means you want a DJ specifically for the wedding procession, not the whole reception — someone who can perform live from a truck as the baraati group dances toward the venue.\n\nPlanMyBaraat's DJ comes as part of a full baraat package: the truck, the DJ artist, a dhol team, a vintage car, and a safa team, all together.",
    explanation:
      "Renting just a DJ without the truck and sound infrastructure leaves you without a way to actually deliver that sound to a moving crowd outdoors. Our packages solve this by pairing the DJ with the double decker truck that carries the sound system, so the DJ has a proper stage and equipment built for exactly this use.\n\nThe DJ artist performs live, taking song requests ahead of time and building a set that works with the dhol team's rhythm, rather than just running a fixed playlist.",
    whatsIncluded:
      "Every package includes the DJ artist, truck, and sound system as the base. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team come with every package from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package, dhol count, and any extra effects. Raj Tilak is the most affordable option and Signature is the most complete. We quote based on your date, city, and guest count.\n\nMessage us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and DJ availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the DJ and truck are available, usually within the hour.",
    faqs: [
      {
        q: "Can I rent just a DJ without the truck?",
        a: "We package the DJ with the truck and sound system, since that's what makes the performance actually work for a moving baraat crowd outdoors.",
      },
      {
        q: "How much does baraat DJ on rent cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the DJ take song requests?",
        a: "Yes, our DJ artists take requests ahead of time and build a set around your preferred entry and dance tracks.",
      },
      {
        q: "Is the DJ experienced with baraat entries specifically?",
        a: "Yes, our DJs work with us regularly and are experienced with the pacing and energy a baraat procession needs, not just standard party sets.",
      },
      {
        q: "How early should I book the DJ?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since DJ and truck availability both tighten during peak season.",
      },
      {
        q: "Does the DJ coordinate with the dhol team?",
        a: "Yes, the DJ and dhol team work together during the procession to keep the energy consistent throughout.",
      },
      {
        q: "What equipment does the DJ use?",
        a: "A professional sound system mounted on the truck, sized for outdoor, moving-crowd baraat use.",
      },
      {
        q: "What's included in the starting package?",
        a: "Raj Tilak covers the DJ artist, truck, sound system, 2 dhol, chhatri lights, a vintage car, and a safa team.",
      },
    ],
  },

  "dj-on-rent-for-wedding": {
    slug: "dj-on-rent-for-wedding",
    intro:
      "DJ on rent for wedding is a broad search, but if you're planning the baraat entry specifically, PlanMyBaraat's DJ comes as part of a complete package built for exactly that moment — the walk from the starting point to the venue.\n\nThe DJ, truck, dhol team, vintage car, and safa team are all booked together as one service.",
    explanation:
      "A general wedding DJ rental usually covers the reception or sangeet, playing from a fixed setup indoors or at a stage. A baraat DJ is different — they perform live from a moving truck, outdoors, with a crowd walking and dancing around the vehicle the whole time.\n\nOur DJ artists are specifically experienced with this format: reading the crowd's energy while the truck moves, working with the dhol team's rhythm, and building toward the venue arrival as a climax.",
    whatsIncluded:
      "Every package includes the DJ artist, truck, and sound system. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team come with every package from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package, dhol count, and any extra effects. Raj Tilak is the most affordable option and Signature is the most complete. We quote based on your date, city, and guest count.\n\nMessage us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and DJ availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "Is a baraat DJ different from a reception DJ?",
        a: "Yes, a baraat DJ performs live from a moving truck outdoors, working with a walking, dancing crowd — different pacing and setup than a fixed reception DJ.",
      },
      {
        q: "How much does DJ on rent for wedding cost for the baraat?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Can I also book a separate DJ for the reception?",
        a: "Our packages focus specifically on the baraat entry — for reception DJ needs, mention it to us and we'll let you know what's possible.",
      },
      {
        q: "Does the baraat DJ come with the truck automatically?",
        a: "Yes, the DJ, truck, and sound system are bundled together in every package, not booked separately.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
      {
        q: "Can the DJ play regional and Bollywood songs?",
        a: "Yes, our DJ artists take requests across genres and build a set that matches your preferences.",
      },
      {
        q: "Is the dhol team part of the same booking?",
        a: "Yes, dhol players are included in every package alongside the DJ and truck.",
      },
      {
        q: "What's the difference between the packages?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, the groom's name in lights, pyro and confetti effects, and a security team.",
      },
    ],
  },

  "wedding-dj-hire-price": {
    slug: "wedding-dj-hire-price",
    intro:
      "Wedding DJ hire price for a baraat entry specifically depends on the package, dhol count, and any extra effects — not a flat number, since the DJ is always bundled with the truck, dhol team, vintage car, and safa team in our packages.\n\nPlanMyBaraat quotes based on your actual date, city, and guest count, so the price you get reflects your real event, not a generic estimate.",
    explanation:
      "Because the DJ performs from a truck as part of a moving baraat entry, the hire price includes more than just the artist's time — it covers the truck, sound system, and the coordination needed to keep the DJ working alongside a dhol team and a moving procession. This is different from hiring a DJ for a fixed reception stage.\n\nThe base package price stays the same structure across all tiers: truck, DJ, and dhol as the core, with lighting, effects, and extra entertainers added as you move up.",
    whatsIncluded:
      "Every package includes the DJ artist, truck, and sound system. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team come with every package from Raj Tilak upward.",
    pricingGuidance:
      "We don't publish a flat wedding DJ hire price because it depends on your city, date, guest count, and package choice. Raj Tilak is the most affordable way to get a proper DJ and truck entry, and Signature is the most complete.\n\nMessage us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real price, usually within the hour.",
    bookingNotes:
      "Wedding season runs November to February, and DJ hire prices and availability both tighten during that window. 3-4 weeks' notice is a safe bet for peak season.\n\nShare your date, city, venue, and guest count when you reach out for an accurate quote.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll send you a real DJ hire price, usually within the hour.",
    faqs: [
      {
        q: "What's the wedding DJ hire price for a baraat?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the price include the truck or just the DJ?",
        a: "The full entry — DJ, truck, sound system, dhol team, vintage car, and safa team are all included in the package price.",
      },
      {
        q: "Why is baraat DJ hire different from reception DJ hire?",
        a: "A baraat DJ performs live from a moving truck outdoors with a dancing crowd, which requires different equipment and coordination than a fixed reception setup.",
      },
      {
        q: "Is the starting package good value?",
        a: "Yes, Raj Tilak includes the truck, DJ, 2 dhol, chhatri lights, car, and safa team — a complete entry at our most affordable tier.",
      },
      {
        q: "Does the price vary by city?",
        a: "Logistics can vary slightly, which is why we confirm your exact price once we know your date and location.",
      },
      {
        q: "How early should I lock in a hire price?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since prices and availability tighten during peak season.",
      },
      {
        q: "Can I negotiate based on my budget?",
        a: "Message us with your budget and requirements on WhatsApp and we'll recommend the package that fits best.",
      },
      {
        q: "How do I get an exact hire price?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real number, usually within the hour.",
      },
    ],
  },

  "wedding-dj-near-me-price": {
    slug: "wedding-dj-near-me-price",
    intro:
      "Searching for a wedding DJ near me for the baraat entry usually means you want someone local who knows the area, not a DJ flown in from elsewhere. PlanMyBaraat is Gujarat-based, covering Vadodara, Surat, Ahmedabad, Rajkot, and most cities and towns across the state.\n\nOur DJ comes as part of a full baraat package: the truck, dhol team, vintage car, and safa team, priced based on your actual date and location.",
    explanation:
      "Being local matters for a baraat specifically, because the DJ and truck driver need to know how to navigate your city's roads at walking pace with a dancing crowd around them. Our team works across Gujarat regularly, so we're familiar with route planning in most cities, not learning the area for the first time on your wedding day.\n\nWhen you search \"near me,\" we match that to your actual city and confirm truck and DJ availability for your specific date and venue.",
    whatsIncluded:
      "Every package includes the DJ artist, truck, and sound system. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team come with every package from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package, dhol count, and any extra effects, and we confirm the exact price once we know your city and date. Raj Tilak is the most affordable option and Signature is the most complete.\n\nMessage us on WhatsApp with your city and we'll respond with a real quote for your area.",
    bookingNotes:
      "Wedding season runs November to February, and local DJ and truck availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your city, date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your city and wedding date, and we'll confirm availability near you, usually within the hour.",
    faqs: [
      {
        q: "Do you cover DJ services near my city?",
        a: "We cover Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat. Message us your city to confirm.",
      },
      {
        q: "How much does a wedding DJ near me cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does being local mean lower travel costs?",
        a: "Being Gujarat-based helps us plan logistics efficiently, though the final price is based on your package choice rather than travel distance in most cases.",
      },
      {
        q: "How do you confirm coverage for my specific area?",
        a: "Message us your exact city and venue on WhatsApp and we'll confirm truck and DJ availability directly.",
      },
      {
        q: "How early should I book a local DJ?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since local slots fill up fast in peak season.",
      },
      {
        q: "Is the truck driver familiar with local roads?",
        a: "Yes, our drivers work across Gujarat regularly and are experienced with route planning in most cities and towns we cover.",
      },
      {
        q: "Can I request a specific DJ if I've seen them before?",
        a: "Message us with details and we'll let you know if that's possible for your date.",
      },
      {
        q: "What's the difference between the packages?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, the groom's name in lights, pyro and confetti effects, and a security team.",
      },
    ],
  },

  "professional-dj-for-baraat-entry": {
    slug: "professional-dj-for-baraat-entry",
    intro:
      "A professional DJ for baraat entry means someone experienced specifically with this format — performing live from a moving truck, reading a dancing crowd's energy, and working alongside a dhol team, not just running a standard party playlist.\n\nPlanMyBaraat's DJ artists work with us regularly and are experienced with exactly this kind of entry, included as part of a full baraat package.",
    explanation:
      "A baraat entry has a different rhythm than a typical party set — it needs to build energy gradually as the procession moves, sync with the dhol team's live drumming, and peak right around the venue arrival. Our DJs are chosen and trained for this specific skill, not generalist party DJs doing baraat work occasionally.\n\nBecause they work with us regularly rather than being hired last-minute, they're also familiar with how our truck setup works and how to coordinate with the dhol team in real time.",
    whatsIncluded:
      "Every package includes the professional DJ artist, truck, and sound system. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team come with every package from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package, dhol count, and any extra effects. Raj Tilak is the most affordable option and Signature is the most complete. We quote based on your date, city, and guest count.\n\nMessage us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for experienced baraat DJs peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm a professional DJ is available, usually within the hour.",
    faqs: [
      {
        q: "What makes a DJ 'professional' for a baraat entry specifically?",
        a: "Experience with the format — building energy as the procession moves, syncing with live dhol drumming, and peaking around the venue arrival, not just running a standard playlist.",
      },
      {
        q: "How much does a professional DJ for baraat entry cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Do your DJs work with the dhol team in real time?",
        a: "Yes, they coordinate with the dhol players throughout the procession to keep the energy consistent and build toward the venue arrival.",
      },
      {
        q: "Can I hear samples of the DJ's work before booking?",
        a: "Message us on WhatsApp and we'll share videos of past entries so you can get a sense of the style.",
      },
      {
        q: "How early should I book a professional DJ?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since experienced DJs get booked out fast.",
      },
      {
        q: "Do the DJs take custom song requests?",
        a: "Yes, they take requests ahead of time and build a set around your preferred entry and dance tracks.",
      },
      {
        q: "Is the DJ the same person who manages the truck?",
        a: "The DJ focuses on the performance while a separate driver handles the truck, so both jobs are done by specialists.",
      },
      {
        q: "What's included in the starting package?",
        a: "Raj Tilak covers the professional DJ artist, truck, sound system, 2 dhol, chhatri lights, a vintage car, and a safa team.",
      },
    ],
  },

  "non-stop-dj-for-wedding": {
    slug: "non-stop-dj-for-wedding",
    intro:
      "A non stop DJ for wedding means the music doesn't cut out between the starting point and the venue — the DJ keeps the set going continuously for the whole baraat procession, so the energy never drops.\n\nPlanMyBaraat's DJ performs live from the truck for the entire route, included as part of a full baraat package alongside a dhol team, a vintage car, and a safa team.",
    explanation:
      "Gaps in the music during a baraat can kill the momentum, especially if the procession is long or the route has stops. Our DJs are experienced with keeping a continuous set running, transitioning smoothly between tracks and working with the dhol team's live drumming to fill any natural pauses.\n\nThe truck's sound system is built for sustained outdoor use too, so there's no risk of the equipment cutting out partway through the entry.",
    whatsIncluded:
      "Every package includes the DJ artist, truck, and sound system. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team come with every package from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package, dhol count, and any extra effects. Raj Tilak is the most affordable option and Signature is the most complete. We quote based on your date, city, and guest count.\n\nMessage us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count, along with your expected route length, when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the truck's available, usually within the hour.",
    faqs: [
      {
        q: "Does the music really run non stop the whole route?",
        a: "Yes, the DJ keeps the set continuous for the whole procession, transitioning smoothly between tracks and working with the dhol team during any natural pauses.",
      },
      {
        q: "How much does a non stop DJ for wedding cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "What if my baraat route is unusually long?",
        a: "Let us know the expected route length when you book so we can plan the set and timing accordingly.",
      },
      {
        q: "Can the sound system handle a long, continuous set?",
        a: "Yes, it's built for sustained outdoor use throughout the whole entry, not just short bursts.",
      },
      {
        q: "Does the dhol team play the whole time too?",
        a: "The dhol team works alongside the DJ, keeping the energy up especially between tracks or during any natural transitions.",
      },
      {
        q: "How early should I book for a longer route?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, and mentioning your route length helps us plan properly.",
      },
      {
        q: "Can the DJ take requests throughout the set?",
        a: "Yes, our DJs take requests ahead of time and build a continuous set around your preferred tracks.",
      },
      {
        q: "What's included in the starting package?",
        a: "Raj Tilak covers the DJ artist, truck, sound system, 2 dhol, chhatri lights, a vintage car, and a safa team.",
      },
    ],
  },

  "dj-jockey-hire-near-me": {
    slug: "dj-jockey-hire-near-me",
    intro:
      "DJ jockey hire near me for a baraat means finding a live performer local to your city who can work the truck setup, not just play a fixed track list from a laptop.\n\nPlanMyBaraat's DJ jockeys work across Gujarat regularly and come as part of a full baraat package: the truck, dhol team, vintage car, and safa team.",
    explanation:
      "A DJ jockey specifically refers to the live performer working the decks and reading the crowd, as opposed to a pre-recorded playlist system. For a baraat, this matters because the DJ needs to adjust in real time — building energy as the procession moves, responding to the dhol team, and timing the set to peak around the venue arrival.\n\nOur DJ jockeys are experienced with exactly this format and work with us regularly across the cities and towns we cover in Gujarat.",
    whatsIncluded:
      "Every package includes the DJ jockey, truck, and sound system. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team come with every package from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package, dhol count, and any extra effects. Raj Tilak is the most affordable option and Signature is the most complete. We quote based on your date, city, and guest count.\n\nMessage us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and DJ jockey availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your city, date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your city and wedding date, and we'll confirm a DJ jockey's available near you, usually within the hour.",
    faqs: [
      {
        q: "Do you have DJ jockeys near my city?",
        a: "We cover Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat. Message us your city to confirm.",
      },
      {
        q: "How much does DJ jockey hire near me cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is the DJ jockey a live performer or a fixed playlist?",
        a: "A live performer who reads the crowd and adjusts the set in real time, not a pre-set playlist running unattended.",
      },
      {
        q: "Does the jockey work with the truck sound system?",
        a: "Yes, the DJ jockey performs from the truck using the built-in sound system, included as part of the package.",
      },
      {
        q: "How early should I book a DJ jockey near me?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
      {
        q: "Can I request specific tracks for the jockey to play?",
        a: "Yes, our DJ jockeys take requests ahead of time and build a set around your preferences.",
      },
      {
        q: "Is the jockey experienced with baraat-specific pacing?",
        a: "Yes, they're chosen and experienced specifically for baraat entries, not generalist party DJing.",
      },
      {
        q: "What's the difference between the packages?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, the groom's name in lights, pyro and confetti effects, and a security team.",
      },
    ],
  },

  "sound-and-light-setup-for-wedding": {
    slug: "sound-and-light-setup-for-wedding",
    intro:
      "A sound and light setup for wedding baraat entries needs to work outdoors, on the move, and be visible and audible to a large dancing crowd — which is exactly what PlanMyBaraat's truck-mounted system is built for.\n\nThe sound and light setup comes as part of a full baraat package, alongside a dhol team, a vintage car, and a safa team.",
    explanation:
      "Sound and lighting for a baraat is different from a fixed venue setup — everything needs to be mounted on a vehicle that moves at walking pace while still delivering clear audio and visible lighting to a crowd around it. Our double decker truck carries a concert-grade sound system on the lower deck and lighting rigs across both levels.\n\nChhatri lights come standard, giving the entry a warm, traditional evening look. Higher packages add moving LED panels and custom name lettering, making the truck a visual centerpiece as much as a sound source.",
    whatsIncluded:
      "Every package includes the sound system, DJ artist, and base lighting. Raj Tilak includes chhatri lights. Rajwada adds branding on the truck body. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds pyro and confetti effects on top of the full lighting setup.\n\nA vintage car and safa team come with every package from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package, how elaborate a lighting setup you want, and any extra effects. Raj Tilak is the most affordable option with solid sound and lighting included. Signature costs more because it includes the most complete visual and audio production.\n\nMessage us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and evening entries with full sound and light setups are especially popular during that stretch. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the setup's available, usually within the hour.",
    faqs: [
      {
        q: "Is the sound and light setup built for outdoor use?",
        a: "Yes, it's specifically designed for outdoor, moving-crowd baraat use, not adapted from an indoor venue setup.",
      },
      {
        q: "How much does a sound and light setup for wedding cost?",
        a: "It depends on the package, dhol count, and how elaborate the lighting is. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the lighting work while the truck is moving?",
        a: "Yes, it's designed to stay bright and visible for the whole moving procession, not just when parked.",
      },
      {
        q: "Can I get custom LED name lighting?",
        a: "Yes, the Maharaja and Signature packages include the groom's name displayed in custom LED lettering on the truck.",
      },
      {
        q: "How early should I book for a full sound and light setup?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since evening entries with full setups are popular.",
      },
      {
        q: "Is the sound quality good enough for a large crowd?",
        a: "Yes, the truck carries a concert-grade sound system sized for outdoor, moving-crowd use.",
      },
      {
        q: "What lighting comes with the starting package?",
        a: "Raj Tilak includes chhatri lights around the truck, giving a warm, traditional evening look.",
      },
      {
        q: "Which package has the most complete sound and light production?",
        a: "Signature, our top package, includes the full sound system, moving LED panels, custom name lighting, and pyro and confetti effects.",
      },
    ],
  },

  "concert-style-sound-system-wedding": {
    slug: "concert-style-sound-system-wedding",
    intro:
      "A concert style sound system for wedding baraat entries means audio that's actually built for a large outdoor crowd, not a small party speaker stretched beyond its limits. PlanMyBaraat's trucks carry exactly this kind of setup.\n\nThe concert style sound system comes as part of a full baraat package, alongside a dhol team, a vintage car, and a safa team.",
    explanation:
      "Concert-grade audio means clean, powerful sound that holds up over distance and crowd noise, run by a professional DJ artist who knows how to manage levels for an outdoor, moving environment. This is a meaningful step up from a standard party PA system, which often distorts or loses clarity once you add a large dancing crowd and open-air acoustics.\n\nThe system sits on the lower deck of our double decker truck, with the DJ performing live on the upper deck, so both power and control stay consistent as the truck moves through the procession.",
    whatsIncluded:
      "Every package includes the concert style sound system, truck, and DJ artist. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.\n\nA vintage car and safa team come with every package from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package, dhol count, and any extra effects. Raj Tilak is the most affordable option with a proper concert-grade system included. Signature costs more because it includes more overall production.\n\nMessage us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for full sound production peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "Is the sound system really concert grade?",
        a: "Yes, it's professional-grade audio equipment built for outdoor, large-crowd use, run by a trained DJ artist rather than a basic party speaker.",
      },
      {
        q: "How much does a concert style sound system for wedding cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does it distort at higher volumes?",
        a: "No, the system is sized to run clean at the volumes needed for an outdoor baraat crowd without distortion.",
      },
      {
        q: "Can the system handle both music and live dhol sound?",
        a: "Yes, the sound is balanced to work alongside the live dhol drumming rather than competing with it.",
      },
      {
        q: "How early should I book for a full sound production?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since demand peaks then.",
      },
      {
        q: "Is the system operated by a trained technician?",
        a: "The DJ artist manages the sound levels and mix throughout the performance as part of the package.",
      },
      {
        q: "Does the sound system come with the truck automatically?",
        a: "Yes, the sound system, DJ, and truck are all bundled together in every package.",
      },
      {
        q: "What's included in the starting package?",
        a: "Raj Tilak covers the sound system, DJ artist, truck, 2 dhol, chhatri lights, a vintage car, and a safa team.",
      },
    ],
  },

  "intelligent-lighting-rental-wedding": {
    slug: "intelligent-lighting-rental-wedding",
    intro:
      "Intelligent lighting rental for wedding baraat entries refers to programmable, moving lights — not just static bulbs — that add visual movement and effects to the truck as it processes toward the venue.\n\nPlanMyBaraat's higher packages include intelligent, moving LED lighting as part of the truck setup, alongside a dhol team, vintage car, and safa team.",
    explanation:
      "Standard chhatri lights give a warm, traditional glow, but intelligent lighting adds programmable movement — panels that shift patterns, colors that sync with the music, and custom effects that make the truck feel more like a moving stage production. This is included from our Maharaja package upward.\n\nCombined with the groom's name spelled out in LED lettering, the intelligent lighting setup turns the truck into a visual centerpiece that's noticeable well before it arrives at the venue.",
    whatsIncluded:
      "Raj Tilak includes chhatri lights as the base lighting. Rajwada adds full body branding with additional lighting. Maharaja introduces moving LED panels and the groom's name in LED letters — the intelligent lighting tier. Signature includes all of this plus pyro and confetti effects synced to the truck's arrival.",
    pricingGuidance:
      "Intelligent lighting is included from the Maharaja package upward, so pricing reflects that tier and above. Message us on WhatsApp with your date and city, and we'll walk you through what's included at each level and give you a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for higher-tier packages with full lighting production peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm availability for a package with intelligent lighting, usually within the hour.",
    faqs: [
      {
        q: "Which package includes intelligent lighting?",
        a: "Maharaja and Signature include moving LED panels and custom LED name lettering — our intelligent, programmable lighting tier.",
      },
      {
        q: "How much does intelligent lighting rental for wedding cost?",
        a: "It's included as part of the Maharaja and Signature packages. Message your date and city on WhatsApp for a real quote covering the full package.",
      },
      {
        q: "Does the lighting sync with the music?",
        a: "Yes, the moving LED panels are set up to complement the DJ's set and the overall energy of the procession.",
      },
      {
        q: "Can the lights display our names?",
        a: "Yes, the groom's name is displayed in custom LED lettering as part of the Maharaja and Signature packages.",
      },
      {
        q: "Is intelligent lighting worth it over the base chhatri lights?",
        a: "It depends on how much visual production you want — chhatri lights give a traditional look, while intelligent lighting adds movement and a more modern, dramatic effect.",
      },
      {
        q: "How early should I book a package with intelligent lighting?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since higher-tier packages are popular during peak season.",
      },
      {
        q: "Does the lighting work well for daytime entries too?",
        a: "It's most visually striking in evening or night entries, though it's included regardless of timing in the relevant packages.",
      },
      {
        q: "What else comes with the Maharaja package besides lighting?",
        a: "Maharaja includes 6 dhol, moving LED panels, the groom's name in lights, the truck, DJ, vintage car, and safa team.",
      },
    ],
  },

  "baraat-entry-ideas": {
    slug: "baraat-entry-ideas",
    intro:
      "Looking for baraat entry ideas usually means you want the entry to feel memorable, not just functional — something guests talk about afterward. PlanMyBaraat's four packages give you a clear set of options to build from, rather than a blank page.\n\nEach package combines a DJ truck, dhol team, vintage car, and safa team differently, so the 'idea' really comes down to how much production you want layered on top of that base.",
    explanation:
      "The simplest strong idea is the classic double decker truck entry with a solid dhol team and good lighting — that alone, done well, is memorable. From there, ideas scale up: adding a teddy or gorilla performer for crowd engagement, moving LED visuals and the groom's name in lights, or going all the way to pyro and confetti effects timed to the truck's arrival.\n\nThe vintage car and safa team add another layer regardless of which truck package you pick, since the groom's arrival and the baraati group's turban styling are both part of how the entry looks as a whole.",
    whatsIncluded:
      "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Rajwada adds 2 more dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name in lights. Signature, the top package, adds a security team plus pyro and confetti effects.",
    pricingGuidance:
      "Pricing depends on which package matches your entry idea, dhol count, and any extra effects. Raj Tilak is the most affordable option and Signature is the most complete.\n\nMessage us on WhatsApp with your date and city, and describe the kind of entry you're imagining — we'll match it to a package and give you a real quote.",
    bookingNotes:
      "Wedding season runs November to February. If you have a specific idea in mind, mention it early — 3-4 weeks' notice gives us time to plan any custom details.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and any entry ideas you have in mind, and we'll recommend the package that fits.",
    faqs: [
      {
        q: "What are some good baraat entry ideas?",
        a: "A double decker DJ truck with a strong dhol team and good lighting is a solid, memorable base — from there, adding entertainers, LED visuals, or pyro and confetti effects builds up the production further.",
      },
      {
        q: "How much does a baraat entry cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Can I mix ideas from different packages?",
        a: "Message us with what you're imagining and we'll let you know what's possible — some elements are tied to specific package tiers.",
      },
      {
        q: "Do you have example videos of past entries?",
        a: "Yes, message us on WhatsApp and we'll share videos of past baraat entries for inspiration.",
      },
      {
        q: "How early should I plan a custom entry idea?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, and earlier is better if you want specific customization.",
      },
      {
        q: "Is the vintage car part of every entry idea?",
        a: "Yes, a vintage car or baggi is included in every package from Raj Tilak upward, regardless of which truck production level you choose.",
      },
      {
        q: "What makes an entry feel more 'grand'?",
        a: "More dhol players, moving LED visuals, entertainers, and effects like pyro or confetti all add to a grander feel — that's the difference between our package tiers.",
      },
      {
        q: "Can I get help deciding which package fits my idea?",
        a: "Yes, describe what you're imagining on WhatsApp and we'll recommend the package that matches best.",
      },
    ],
  },

  "unique-baraat-entry-ideas": {
    slug: "unique-baraat-entry-ideas",
    intro:
      "Unique baraat entry ideas usually mean adding something beyond the standard truck-and-dhol setup — a specific lighting theme, a custom LED name display, or an entertainer that makes your entry stand out from others your guests have seen.\n\nPlanMyBaraat's Maharaja and Signature packages are built for exactly this kind of customization, on top of the same reliable base every package includes.",
    explanation:
      "A unique entry doesn't necessarily mean starting from scratch — it usually means picking specific add-ons that reflect your personality as a couple. Custom LED lettering with the groom's name, a teddy or gorilla performer for crowd engagement, moving LED panels with a particular color theme, or pyro and confetti timed to a specific moment are all ways to make a standard package feel personal.\n\nBecause the truck, dhol, car, and safa team are consistent across every tier, the 'unique' part comes from layering these specific touches on top rather than reinventing the whole format.",
    whatsIncluded:
      "Raj Tilak covers the essentials. Rajwada adds a teddy or gorilla performer. Maharaja brings moving LED panels and custom LED name lettering. Signature adds pyro and confetti effects plus a security team — the most room for a distinctive, layered entry.",
    pricingGuidance:
      "Pricing depends on the package tier and any custom touches you want. Maharaja and Signature offer the most room for unique customization. Message us on WhatsApp with your ideas and we'll let you know what's possible within your budget.",
    bookingNotes:
      "Wedding season runs November to February. If you want something specific and custom, mention it as early as possible — 3-4 weeks' notice gives us time to plan the details properly.\n\nShare your date, city, venue, and any specific ideas when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and any unique ideas you're considering, and we'll let you know what fits your package.",
    faqs: [
      {
        q: "What makes an entry feel unique rather than standard?",
        a: "Specific touches like custom LED name lettering, a particular lighting theme, an entertainer, or effects timed to a specific moment — layered on top of the reliable truck-and-dhol base.",
      },
      {
        q: "Which package offers the most customization?",
        a: "Maharaja and Signature offer the most room for unique touches — moving LED panels, custom lettering, entertainers, and effects like pyro and confetti.",
      },
      {
        q: "How much does a unique baraat entry cost?",
        a: "It depends on the package and any custom touches you add. Message your date and city on WhatsApp for a real quote based on your specific ideas.",
      },
      {
        q: "Can I request a specific color theme for the lighting?",
        a: "Message us with your preferences and we'll let you know what's possible for your package.",
      },
      {
        q: "How early should I discuss custom ideas?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we have time to plan any specific requests properly.",
      },
      {
        q: "Is a unique entry much more expensive than a standard one?",
        a: "It depends on how many custom elements you add — the price scales with the package tier and effects, not a separate 'unique' surcharge.",
      },
      {
        q: "Can you show me examples of custom entries you've done?",
        a: "Yes, message us on WhatsApp and we'll share photos and videos of past custom entries for inspiration.",
      },
      {
        q: "Do custom LED names cost extra?",
        a: "Custom LED name lettering is included as part of the Maharaja and Signature packages, not a separate add-on charge.",
      },
    ],
  },

  "best-baraat-entry-ideas": {
    slug: "best-baraat-entry-ideas",
    intro:
      "The best baraat entry ideas usually combine three things well: strong, consistent music, a lively dhol team, and enough visual production to match the scale of your celebration — not just the flashiest single element.\n\nPlanMyBaraat's packages are built around that balance, from Raj Tilak's solid basics to Signature's full production with pyro, confetti, and security.",
    explanation:
      "In our experience running entries across Gujarat, the best ones aren't necessarily the most expensive — they're the ones where the package matches the venue, guest count, and family's style. A smaller, tighter guest list often works beautifully with Raj Tilak's straightforward truck-and-dhol entry, while a large destination-style wedding might call for Signature's full production.\n\nWhat consistently makes an entry feel like 'the best' is good timing — the truck, dhol, and groom's arrival all coordinated together — more than any single flashy add-on.",
    whatsIncluded:
      "Raj Tilak covers the truck, DJ, 2 dhol, chhatri lights, car, and safa team. Rajwada adds more dhol and an entertainer. Maharaja brings LED visuals and custom lettering. Signature adds pyro, confetti, and security for the most complete production.",
    pricingGuidance:
      "Pricing depends on the package that fits your event best, dhol count, and any extra effects. Message us on WhatsApp with your date, city, venue, and guest count, and we'll recommend what actually suits your event rather than just the most expensive option.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll recommend the package that fits your event best.",
    faqs: [
      {
        q: "What's actually the best baraat entry idea?",
        a: "The one that matches your venue, guest count, and family's style — a smaller entry often works beautifully with Raj Tilak, while a bigger celebration might call for Signature's full production.",
      },
      {
        q: "Is the most expensive package always the best choice?",
        a: "Not necessarily — the right fit depends on your specific event, not just spending the most. We help you pick based on your actual details.",
      },
      {
        q: "How much does the best entry package cost?",
        a: "It depends on which package fits your event. Raj Tilak is our most affordable and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "What matters most for a great baraat entry?",
        a: "Good coordination — the truck, dhol, and groom's arrival timed together well — matters more than any single flashy add-on.",
      },
      {
        q: "How do I know which package is right for my event?",
        a: "Share your date, city, venue, and guest count on WhatsApp and we'll recommend a package based on what actually fits.",
      },
      {
        q: "How early should I book for the best availability?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window for the best chance at your preferred package and date.",
      },
      {
        q: "Can I see examples of well-executed past entries?",
        a: "Yes, message us on WhatsApp and we'll share photos and videos of past baraat entries.",
      },
      {
        q: "Does a bigger guest count need a bigger package?",
        a: "Often yes, since a larger crowd benefits from a stronger sound system and more dhol players, but we'll advise based on your specific numbers.",
      },
    ],
  },

  "royal-baraat-entry": {
    slug: "royal-baraat-entry",
    intro:
      "A royal baraat entry aims for that grand, Rajwada-style feel — vintage cars, rich lighting, a full dhol team, and an overall sense of occasion that matches Gujarat's royal wedding traditions.\n\nPlanMyBaraat's Rajwada and Maharaja packages are named and built specifically for this kind of entry, layering more dhol, lighting, and entertainment on top of the base truck setup.",
    explanation:
      "The royal feel comes from a combination of things working together: the vintage car for the groom's arrival, chhatri lights or moving LED panels on the truck, a strong dhol team keeping the traditional energy up, and the safa team's turban styling tying the whole look together for the groom and baraatis.\n\nOur Rajwada package specifically builds toward this with full body truck branding and a teddy or gorilla performer for extra entertainment, while Maharaja pushes further with custom LED lettering and moving visual panels.",
    whatsIncluded:
      "Raj Tilak covers the essentials with a royal touch through chhatri lights and the vintage car. Rajwada adds full body branding and a performer. Maharaja brings moving LED panels and custom lettering. Signature, the top package, adds security and pyro effects for the most complete royal production.",
    pricingGuidance:
      "Pricing depends on the package tier and how much royal-style production you want. Rajwada and Maharaja are built specifically for this look. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and royal-style entries are especially popular during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll recommend the package that gives you the royal entry you're picturing.",
    faqs: [
      {
        q: "What makes an entry feel 'royal'?",
        a: "A combination of the vintage car, rich lighting, a strong dhol team, and coordinated safa styling — the elements our Rajwada and Maharaja packages are built around.",
      },
      {
        q: "Which package is best for a royal baraat entry?",
        a: "Rajwada and Maharaja are specifically built for this look, with full body branding, moving LED visuals, and extra entertainment on top of the base setup.",
      },
      {
        q: "How much does a royal baraat entry cost?",
        a: "It depends on the package tier and production level. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is the vintage car part of the royal look?",
        a: "Yes, the vintage car or baggi is a key part of the royal feel and is included in every package from Raj Tilak upward.",
      },
      {
        q: "Does the dhol team play traditional music for a royal entry?",
        a: "Yes, our dhol players keep the traditional energy that fits a royal-style baraat entry.",
      },
      {
        q: "How early should I book for a royal entry?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since these entries are especially popular.",
      },
      {
        q: "Can the truck lighting match a royal color theme?",
        a: "Message us with your preferences and we'll let you know what's possible for your package.",
      },
      {
        q: "Is the safa team part of the royal look too?",
        a: "Yes, the My Safa team's turban styling for the groom and baraatis is part of every package and adds to the overall royal presentation.",
      },
    ],
  },

  "grand-baraat-entry": {
    slug: "grand-baraat-entry",
    intro:
      "A grand baraat entry is about scale — more dhol, more lighting, a bigger visual production, and enough energy to fill a larger guest list. PlanMyBaraat's Maharaja and Signature packages are built for exactly this kind of scale.\n\nBoth packages layer more dhol players, moving LED visuals, and additional effects on top of the same reliable truck and DJ base every package includes.",
    explanation:
      "Scale for a baraat entry mostly comes down to three things: how many dhol players are keeping the energy up, how much visual production the truck carries, and whether there are extra effects timed to the arrival. Maharaja brings 6 dhol and moving LED panels with custom name lettering. Signature adds pyro and confetti effects plus a security team, making it our most production-heavy option.\n\nA grand entry also benefits from good route planning — wider roads let the truck and dancing crowd move more freely, which is something we factor in when recommending a package for your specific venue.",
    whatsIncluded:
      "Maharaja includes 6 dhol, moving LED panels, and the groom's name in lights, on top of the truck, DJ, car, and safa team every package has. Signature adds a security team plus pyro and confetti effects for the most complete, grand production.",
    pricingGuidance:
      "Pricing depends on the package tier and scale of production. Maharaja and Signature are built specifically for a grand entry. Message us on WhatsApp with your date, city, and guest count for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and grand entries with fuller production are especially popular during peak dates. 3-4 weeks' notice is a safe bet, sometimes longer for very large events.\n\nShare your date, city, venue, and guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and guest count, and we'll recommend the package that matches the scale you're going for.",
    faqs: [
      {
        q: "What makes an entry 'grand'?",
        a: "More dhol players, moving LED visuals, extra entertainers, and effects like pyro or confetti — the elements that scale up through Maharaja and Signature.",
      },
      {
        q: "Which package is best for a grand baraat entry?",
        a: "Maharaja and Signature are built specifically for scale, with 6 dhol, moving LED panels, and (in Signature) pyro and confetti effects plus security.",
      },
      {
        q: "How much does a grand baraat entry cost?",
        a: "It depends on the package tier. Message your date, city, and guest count on WhatsApp for a real quote.",
      },
      {
        q: "Does a grand entry need a bigger venue or wider roads?",
        a: "Wider roads help the truck and dancing crowd move more freely, so mention your venue details and we'll factor that into our recommendation.",
      },
      {
        q: "How many dhol players come with the grand package options?",
        a: "Maharaja includes 6 dhol, and Signature includes 6 plus extra entertainment on top.",
      },
      {
        q: "How early should I book for a very large event?",
        a: "3-4 weeks ahead is a safe minimum during wedding season (November to February), and earlier is better for very large or destination-style events.",
      },
      {
        q: "Does Signature include a security team?",
        a: "Yes, Signature includes 4 professional bouncers as part of its full production package.",
      },
      {
        q: "Can I combine effects like pyro and confetti with moving LED panels?",
        a: "Yes, that combination is exactly what the Signature package includes.",
      },
    ],
  },

  "baraat-entry-effects": {
    slug: "baraat-entry-effects",
    intro:
      "Baraat entry effects refer to the extra visual and audio moments layered onto the core truck-and-dhol setup — things like pyro, confetti, LED lighting, and live entertainers that punctuate the entry at key moments.\n\nPlanMyBaraat's packages include a growing range of these effects as you move up the tiers, from Raj Tilak's clean basics to Signature's full production.",
    explanation:
      "Effects work best when they're timed well, not just present. Our packages sync effects like pyro guns and confetti cannons to the truck's arrival at the venue, so they land as a climax rather than going off randomly mid-procession. LED lighting effects run throughout the entry, building visual interest the whole way.\n\nEntertainers like a teddy or gorilla performer add a different kind of effect — interactive, crowd-engaging moments rather than a one-off visual burst — and are included from the Rajwada package upward.",
    whatsIncluded:
      "Raj Tilak includes chhatri lights and a liquid CO2 gun for a dazzling entry moment. Rajwada adds a teddy or gorilla performer. Maharaja brings moving LED panels, confetti CO2 gun, and hand pyro gun. Signature, the top package, adds pyro highlights, confetti, hand pyro, and a fake money gun for the most complete effects lineup.",
    pricingGuidance:
      "Pricing depends on the package tier and which effects are included at that level. Message us on WhatsApp with your date and city, and mention any specific effects you're interested in — we'll match it to a package.",
    bookingNotes:
      "Wedding season runs November to February. If you want specific effects timed to a particular moment, mention it early — 3-4 weeks' notice gives us time to plan the details properly.\n\nShare your date, city, venue, and any effect preferences when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and any effects you're interested in, and we'll recommend the right package.",
    faqs: [
      {
        q: "What baraat entry effects do you offer?",
        a: "Liquid CO2 guns, confetti cannons, hand pyro guns, moving LED panels, and fake money guns, layered across our package tiers from Raj Tilak to Signature.",
      },
      {
        q: "Which package has the most effects?",
        a: "Signature, our top package, includes the fullest range: pyro highlights, confetti, hand pyro, a fake money gun, moving LED panels, and custom LED lettering.",
      },
      {
        q: "Are the effects safe for a large crowd?",
        a: "Yes, our effects are handled by experienced operators and timed to the truck's arrival for a controlled, safe moment.",
      },
      {
        q: "How much do baraat entry effects cost?",
        a: "They're included as part of the package tiers rather than priced separately. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Can effects be timed to a specific moment, like the groom stepping down?",
        a: "Yes, message us with your preference and we'll plan the timing around that moment.",
      },
      {
        q: "Does the starting package include any effects?",
        a: "Yes, Raj Tilak includes a liquid CO2 gun for a dazzling entry moment, on top of chhatri lighting.",
      },
      {
        q: "How early should I request specific effects?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we have time to plan and confirm the details.",
      },
      {
        q: "Is a security team included with the effects packages?",
        a: "Yes, Signature includes a professional bouncer team alongside its full effects lineup, useful for crowd management during a bigger production.",
      },
    ],
  },

  "led-screen-for-wedding-truck": {
    slug: "led-screen-for-wedding-truck",
    intro:
      "An LED screen for wedding truck usually refers to the moving LED panels mounted on the truck body that display visuals, patterns, or lighting effects as the baraat procession moves toward the venue.\n\nPlanMyBaraat includes moving LED panels from our Maharaja package upward, as part of a full baraat entry with a dhol team, vintage car, and safa team.",
    explanation:
      "The LED screens run along the truck body and add a dynamic visual layer beyond static chhatri lights — patterns, colors, and effects that catch the eye from a distance and build anticipation as the truck approaches. Combined with the groom's name spelled out in LED lettering, the truck becomes a visual centerpiece as much as a sound source.\n\nThe screens are built into the truck structure rather than added separately, so they're properly integrated with the sound and lighting system rather than a bolt-on extra.",
    whatsIncluded:
      "Raj Tilak and Rajwada include chhatri lights and truck branding without LED screens. Maharaja introduces moving LED panels and custom name lettering. Signature includes the same LED setup plus pyro and confetti effects for the most complete visual production.",
    pricingGuidance:
      "LED screens are included from the Maharaja package upward. Message us on WhatsApp with your date and city, and we'll walk you through what's included at each tier and give you a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for LED-equipped packages peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm availability for a package with LED screens, usually within the hour.",
    faqs: [
      {
        q: "Which package includes LED screens on the truck?",
        a: "Maharaja and Signature include moving LED panels mounted on the truck body, along with custom LED name lettering.",
      },
      {
        q: "How much does an LED screen for wedding truck cost?",
        a: "It's included as part of the Maharaja and Signature packages. Message your date and city on WhatsApp for a real quote covering the full package.",
      },
      {
        q: "Are the LED screens visible during the day too?",
        a: "They're most visually striking in evening or night entries, though they're included regardless of timing in the relevant packages.",
      },
      {
        q: "Can the screens display custom graphics?",
        a: "Message us with your specific requests on WhatsApp and we'll let you know what's possible.",
      },
      {
        q: "How early should I book a package with LED screens?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since these higher-tier packages are popular.",
      },
      {
        q: "Do the LED screens work while the truck is moving?",
        a: "Yes, they're designed to stay visible and functional throughout the moving procession.",
      },
      {
        q: "Is the LED screen part of the truck or a separate rental?",
        a: "It's built into the truck structure as part of the Maharaja and Signature packages, not a separate rental.",
      },
      {
        q: "What else comes with a package that has LED screens?",
        a: "Maharaja includes 6 dhol, the groom's name in lights, a vintage car, and a safa team alongside the LED panels.",
      },
    ],
  },

  "moving-led-panel-rental-india": {
    slug: "moving-led-panel-rental-india",
    intro:
      "Moving LED panel rental in India for wedding baraats usually means finding a vendor who can integrate the panels properly with the truck, sound, and lighting setup, not just rent a screen on its own.\n\nPlanMyBaraat includes moving LED panels as part of our Maharaja and Signature packages, fully integrated with the truck, dhol team, vintage car, and safa team.",
    explanation:
      "A standalone LED panel rental would need to be mounted, powered, and synced separately from your truck and sound system, adding coordination complexity on the wedding day. Our approach builds the LED panels directly into the truck package, so everything works together as one unit from the start.\n\nWe operate across Gujarat specifically, so if you're searching more broadly for India-wide options, we can confirm whether we cover your city directly.",
    whatsIncluded:
      "Maharaja includes moving LED panels and custom name lettering on the truck, alongside 6 dhol, a vintage car, and a safa team. Signature includes the same LED setup plus pyro, confetti, and a security team.",
    pricingGuidance:
      "Pricing depends on the package tier, since LED panels are included as part of Maharaja and Signature rather than priced as a standalone rental. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for LED-equipped packages peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm coverage and availability for a package with moving LED panels.",
    faqs: [
      {
        q: "Do you rent LED panels on their own?",
        a: "No, our moving LED panels come integrated with the truck as part of the Maharaja and Signature packages, not as a standalone rental.",
      },
      {
        q: "Which cities in India do you cover?",
        a: "We're Gujarat-based, covering Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts in the state. Message us your city to confirm.",
      },
      {
        q: "How much does moving LED panel inclusion cost?",
        a: "It's part of the Maharaja and Signature package pricing. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is the LED panel setup reliable for outdoor use?",
        a: "Yes, it's built into the truck structure specifically for outdoor, moving-crowd baraat use.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since these packages are popular.",
      },
      {
        q: "Can the panels be synced with the DJ's set?",
        a: "The lighting is coordinated to complement the overall energy of the procession alongside the DJ's performance.",
      },
      {
        q: "Do the panels come with a technician on-site?",
        a: "The setup is handled as part of our team's coordinated operation, so it's managed alongside the truck and sound system.",
      },
      {
        q: "What's the difference between Maharaja and Signature for LED panels?",
        a: "Both include the same moving LED panels and custom lettering; Signature adds pyro, confetti, and a security team on top.",
      },
    ],
  },

  "groom-name-light-display": {
    slug: "groom-name-light-display",
    intro:
      "A groom name light display is custom LED lettering mounted on the truck that spells out the groom's name, visible to guests well before the truck arrives at the venue — a popular personal touch for a baraat entry.\n\nPlanMyBaraat includes this as part of our Maharaja and Signature packages, alongside moving LED panels and the rest of the truck production.",
    explanation:
      "The name display sits on the truck body alongside the moving LED panels, custom-built for each booking rather than a generic template. It's one of the most personal touches available in our packages, since it's specific to your wedding rather than a standard visual effect.\n\nCombined with the rest of the LED setup, the name display makes the truck instantly identifiable and adds a memorable, personal element that guests notice and remember.",
    whatsIncluded:
      "Maharaja includes the groom's name in custom LED letters alongside moving LED panels, 6 dhol, a vintage car, and a safa team. Signature includes the same name display plus pyro, confetti, and a security team.",
    pricingGuidance:
      "The name display is included as part of the Maharaja and Signature packages, not priced separately. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February. Since the name display is custom-built, mention it early — 3-4 weeks' notice gives us time to prepare it properly.\n\nShare your date, city, venue, and the exact spelling of the name when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and the groom's name, and we'll confirm the custom display for your package.",
    faqs: [
      {
        q: "Which package includes the groom's name in lights?",
        a: "Maharaja and Signature both include custom LED lettering displaying the groom's name on the truck.",
      },
      {
        q: "How much does a groom name light display cost?",
        a: "It's included as part of the Maharaja and Signature packages. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Can I choose the font or style of the lettering?",
        a: "Message us with your preferences and we'll let you know what's possible for your booking.",
      },
      {
        q: "How far in advance do you need the name for the display?",
        a: "As early as possible, ideally 3-4 weeks ahead, since the lettering is custom-built for each booking.",
      },
      {
        q: "Is the display visible during the day?",
        a: "It's most visually striking in evening or night entries, though it's part of the package regardless of timing.",
      },
      {
        q: "Can the display include both names, like the couple's names together?",
        a: "Message us with your specific request and we'll let you know what's possible.",
      },
      {
        q: "Does the name display work while the truck is moving?",
        a: "Yes, it's mounted securely on the truck body and stays visible throughout the moving procession.",
      },
      {
        q: "What else comes with the package that includes the name display?",
        a: "Maharaja includes moving LED panels, 6 dhol, the truck, DJ, vintage car, and safa team alongside the name display.",
      },
    ],
  },

  "custom-led-name-board-wedding": {
    slug: "custom-led-name-board-wedding",
    intro:
      "A custom LED name board for wedding baraats is the mounted display on the truck that spells out the groom's name in lights, built specifically for each booking rather than a generic stock sign.\n\nPlanMyBaraat includes this custom LED name board as part of our Maharaja and Signature packages, alongside moving LED panels and the rest of the truck production.",
    explanation:
      "The name board is prepared ahead of time based on the exact spelling and details you provide, then mounted securely on the truck body alongside the moving LED panels. It's designed to stay legible and bright from a distance, so guests can spot the truck and recognize the personal touch as it approaches.\n\nBecause it's custom for each wedding, this is one of the more personal elements in our packages compared to standard lighting or effects that look the same for every booking.",
    whatsIncluded:
      "Maharaja includes the custom LED name board alongside moving LED panels, 6 dhol, a vintage car, and a safa team. Signature includes the same name board plus pyro, confetti, and a security team.",
    pricingGuidance:
      "The custom LED name board is included as part of the Maharaja and Signature packages, not priced separately. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February. Since the board is custom-built, share the exact name spelling as early as possible — 3-4 weeks' notice gives us time to prepare it properly.\n\nShare your date, city, venue, and the name details when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and the exact name spelling, and we'll confirm the custom board for your package.",
    faqs: [
      {
        q: "Which package includes a custom LED name board?",
        a: "Maharaja and Signature both include a custom LED name board displaying the groom's name on the truck.",
      },
      {
        q: "How much does a custom LED name board for wedding cost?",
        a: "It's included as part of the Maharaja and Signature packages. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "How long does the board take to prepare?",
        a: "We recommend sharing the name details as early as possible, ideally 3-4 weeks ahead, since the board is custom-built for each booking.",
      },
      {
        q: "Can the board include a wedding date or short message too?",
        a: "Message us with your specific request and we'll let you know what's possible.",
      },
      {
        q: "Is the board secure on the truck while it's moving?",
        a: "Yes, it's mounted securely and stays visible and stable throughout the moving procession.",
      },
      {
        q: "Can I see a sample of a past name board before booking?",
        a: "Yes, message us on WhatsApp and we'll share photos of past custom boards for reference.",
      },
      {
        q: "Does the board work for daytime entries too?",
        a: "It's most visually striking in the evening, though it's included as part of the package regardless of timing.",
      },
      {
        q: "What else comes with the Maharaja package?",
        a: "Moving LED panels, 6 dhol, the truck, DJ, vintage car, and safa team, alongside the custom name board.",
      },
    ],
  },

  "confetti-cannon-for-wedding": {
    slug: "confetti-cannon-for-wedding",
    intro:
      "A confetti cannon for wedding baraats adds a burst of celebration timed to a specific moment — usually the truck's arrival at the venue or the groom stepping down — turning that instant into a clear visual climax.\n\nPlanMyBaraat includes confetti cannon effects as part of our Maharaja and Signature packages, alongside the rest of the truck production.",
    explanation:
      "The confetti cannon is operated by our team, not a self-service unit, so the timing is coordinated with the truck's arrival and the DJ's set for maximum impact. It's one of several effects available at the higher package tiers, alongside pyro and moving LED visuals.\n\nBecause it's a physical effect involving equipment and safety considerations, we handle the setup and operation as part of the package rather than renting out the cannon itself.",
    whatsIncluded:
      "Maharaja includes a confetti CO2 gun as part of its effects lineup, alongside moving LED panels, 6 dhol, a vintage car, and a safa team. Signature includes the same confetti effect plus pyro highlights, hand pyro, and a security team.",
    pricingGuidance:
      "The confetti cannon effect is included as part of the Maharaja and Signature packages, not priced as a standalone rental. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February. If you want the confetti timed to a specific moment, mention it early — 3-4 weeks' notice gives us time to plan the details.\n\nShare your date, city, venue, and any timing preferences when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm the confetti effect for your package.",
    faqs: [
      {
        q: "Which package includes a confetti cannon?",
        a: "Maharaja and Signature both include confetti CO2 gun effects as part of their production.",
      },
      {
        q: "How much does a confetti cannon for wedding cost?",
        a: "It's included as part of the Maharaja and Signature packages. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is the confetti cannon safe for guests nearby?",
        a: "Yes, it's operated by our experienced team with safety in mind, timed and positioned appropriately for the crowd.",
      },
      {
        q: "Can the confetti be timed to a specific moment?",
        a: "Yes, message us with your preference — usually the truck's arrival or the groom stepping down — and we'll plan the timing.",
      },
      {
        q: "How early should I request this effect?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we can plan the timing and logistics properly.",
      },
      {
        q: "Does the confetti create a mess that needs cleanup?",
        a: "There is some cleanup involved after a confetti effect, which is worth discussing with your venue in advance.",
      },
      {
        q: "Can I combine confetti with pyro effects?",
        a: "Yes, that combination is part of the Signature package's full effects lineup.",
      },
      {
        q: "Is the confetti cannon rented separately from the truck?",
        a: "No, it's included and operated as part of the Maharaja and Signature packages, coordinated with the rest of the truck production.",
      },
    ],
  },

  "confetti-cannon-rental-near-me": {
    slug: "confetti-cannon-rental-near-me",
    intro:
      "Confetti cannon rental near me for a baraat entry means finding a local team who can operate the effect safely and time it to your truck's arrival, not just a generic party rental.\n\nPlanMyBaraat operates across Gujarat, including confetti cannon effects as part of our Maharaja and Signature baraat packages.",
    explanation:
      "Rather than renting the cannon on its own, our confetti effect comes operated by our team, coordinated with the truck's timing, the DJ's set, and any other effects like pyro. This ensures the moment lands properly rather than going off at the wrong time or in the wrong spot relative to your guests.\n\nWe cover Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most cities and towns across Gujarat, so message us your city to confirm coverage near you.",
    whatsIncluded:
      "Maharaja includes a confetti CO2 gun as part of its effects lineup, alongside moving LED panels, 6 dhol, a vintage car, and a safa team. Signature includes the same confetti effect plus pyro highlights and a security team.",
    pricingGuidance:
      "The confetti effect is included as part of the Maharaja and Signature packages. Message us on WhatsApp with your city and date for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for full-effects packages peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your city, date, venue, and any timing preferences when you reach out.",
    closing:
      "Message us on WhatsApp with your city and wedding date, and we'll confirm the confetti effect's available near you.",
    faqs: [
      {
        q: "Do you offer confetti cannon rental near my city?",
        a: "We cover Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat. Message us your city to confirm.",
      },
      {
        q: "How much does confetti cannon rental near me cost?",
        a: "It's included as part of the Maharaja and Signature packages. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is the confetti cannon operated by your team or self-service?",
        a: "It's operated by our experienced team, coordinated with the truck's arrival timing rather than a self-service rental.",
      },
      {
        q: "Can I rent just the confetti cannon without the truck?",
        a: "No, it's included as part of the Maharaja and Signature baraat packages rather than a standalone rental.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since full-effects packages are popular during peak season.",
      },
      {
        q: "Does the effect work well with an outdoor venue?",
        a: "Yes, it's designed for outdoor baraat use and coordinated with the truck's arrival at the venue.",
      },
      {
        q: "Is cleanup included after the confetti effect?",
        a: "This is worth discussing with your venue directly, since cleanup expectations can vary by location.",
      },
      {
        q: "What's the difference between Maharaja and Signature for this effect?",
        a: "Both include the confetti cannon; Signature adds pyro highlights, hand pyro, a fake money gun, and a security team on top.",
      },
    ],
  },

  "confetti-gun-rental-price-wedding": {
    slug: "confetti-gun-rental-price-wedding",
    intro:
      "Confetti gun rental price for wedding baraats isn't a standalone number with PlanMyBaraat, since the confetti effect comes bundled into our Maharaja and Signature packages rather than priced as a separate rental.\n\nThat means the price you get covers the confetti effect plus the truck, dhol team, vintage car, safa team, and the rest of the package production.",
    explanation:
      "Because the confetti gun is operated by our team as part of a coordinated baraat entry, it isn't rented out separately the way a party supply store might rent one for a birthday. The cost is folded into the Maharaja and Signature package pricing, which also includes moving LED panels, extra dhol, and other effects.\n\nThis bundled approach means the confetti effect is properly timed and safely operated as part of your entry, rather than a separate piece you'd need to coordinate yourself.",
    whatsIncluded:
      "Maharaja includes the confetti CO2 gun alongside moving LED panels, 6 dhol, a vintage car, and a safa team. Signature includes the same confetti effect plus pyro highlights, hand pyro, and a security team.",
    pricingGuidance:
      "There's no separate confetti gun rental price — it's part of the Maharaja and Signature package cost. Message us on WhatsApp with your date and city, and we'll give you a real quote covering the full package.",
    bookingNotes:
      "Wedding season runs November to February, and demand for full-effects packages peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll send you a real quote covering the confetti effect and full package.",
    faqs: [
      {
        q: "What's the confetti gun rental price for a wedding baraat?",
        a: "There's no separate price — the confetti effect is included as part of the Maharaja and Signature packages. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Can I rent just the confetti gun without the rest of the package?",
        a: "No, it's included as part of our Maharaja and Signature baraat packages, operated by our team alongside the truck and other effects.",
      },
      {
        q: "Is the confetti effect worth the higher package price?",
        a: "It depends on how much visual production you want — if confetti and other effects matter to you, Maharaja or Signature give you that on top of the reliable base every package includes.",
      },
      {
        q: "How much more does Maharaja cost compared to Raj Tilak?",
        a: "Maharaja adds 6 dhol, moving LED panels, custom name lighting, and the confetti effect compared to Raj Tilak's essentials — message us for an exact price comparison.",
      },
      {
        q: "How early should I decide if I want the confetti effect?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we can confirm your package and plan the timing.",
      },
      {
        q: "Does the price change based on my city?",
        a: "Logistics can vary slightly, which is why we confirm your exact price once we know your date and location.",
      },
      {
        q: "Can I get a quote comparing packages with and without confetti?",
        a: "Yes, message us on WhatsApp and we'll walk you through what each package tier includes and the price difference.",
      },
      {
        q: "How do I get an exact quote?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real number, usually within the hour.",
      },
    ],
  },

  "co2-gun-for-wedding": {
    slug: "co2-gun-for-wedding",
    intro:
      "A CO2 gun for wedding baraats creates a dramatic burst of vapor effect, timed to the truck's arrival or another key moment in the procession, adding a striking visual punctuation to the entry.\n\nPlanMyBaraat includes a liquid CO2 gun starting from our Raj Tilak package, with confetti and pyro CO2 effects added at higher tiers.",
    explanation:
      "Unlike confetti or pyro, the CO2 gun produces a dense, dramatic vapor burst that's visually striking without any mess or fire risk, which is why it's included even in our starting package. It gives every entry, even the most affordable one, a moment of visual drama.\n\nHigher packages layer on additional CO2-based effects — the confetti CO2 gun at Maharaja and CO2 jet effects that add more sustained visual impact throughout the entry.",
    whatsIncluded:
      "Raj Tilak includes a liquid CO2 gun as part of its base package. Rajwada carries the same effect forward. Maharaja adds a confetti CO2 gun and CO2 jet effects on top. Signature includes the full liquid CO2 gun effect alongside pyro and confetti.",
    pricingGuidance:
      "The CO2 gun effect is included starting from Raj Tilak, our most affordable package. Message us on WhatsApp with your date and city for a real quote covering the full entry.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "Is a CO2 gun included even in the starting package?",
        a: "Yes, Raj Tilak includes a liquid CO2 gun for a dazzling entry moment, even at our most affordable tier.",
      },
      {
        q: "How much does a CO2 gun for wedding cost?",
        a: "It's included as part of every package, starting from Raj Tilak. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Is the CO2 effect safe for guests?",
        a: "Yes, it's operated by our experienced team with safety and crowd positioning in mind.",
      },
      {
        q: "Does the CO2 gun leave any mess afterward?",
        a: "No, unlike confetti, the CO2 vapor effect doesn't leave debris that needs cleanup.",
      },
      {
        q: "Can the CO2 effect be timed to a specific moment?",
        a: "Yes, message us with your preference and we'll plan the timing around the truck's arrival or another key moment.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since trucks and effects get booked out fast.",
      },
      {
        q: "What's the difference between a CO2 gun and CO2 jet effects?",
        a: "The CO2 gun creates a single dramatic burst, while CO2 jet effects (included in Maharaja and Signature) add more sustained visual impact throughout the entry.",
      },
      {
        q: "Which package has the most CO2-based effects?",
        a: "Maharaja and Signature include the confetti CO2 gun and CO2 jet effects alongside the base liquid CO2 gun.",
      },
    ],
  },

  "co2-cannon-rental-price": {
    slug: "co2-cannon-rental-price",
    intro:
      "CO2 cannon rental price for a wedding baraat isn't a separate line item with PlanMyBaraat, since the CO2 gun effect is included as part of every package starting from Raj Tilak, our most affordable tier.\n\nThe price you get covers the CO2 effect plus the truck, dhol team, vintage car, safa team, and the rest of the package.",
    explanation:
      "Because the CO2 gun is operated by our team as part of a coordinated entry, it isn't priced or rented as a standalone item. It's built into every package from the start, with additional CO2-based effects like the confetti CO2 gun and CO2 jet effects added at the Maharaja and Signature tiers.\n\nThis means even our most affordable package includes a proper visual effect moment, not just the truck and dhol alone.",
    whatsIncluded:
      "Raj Tilak includes a liquid CO2 gun as part of its base package, alongside the truck, DJ, 2 dhol, chhatri lights, a vintage car, and a safa team. Higher tiers add more CO2-based effects on top.",
    pricingGuidance:
      "There's no separate CO2 cannon rental price — it's included starting from Raj Tilak. Message us on WhatsApp with your date and city, and we'll give you a real quote for the full package.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll send you a real quote covering the CO2 effect and full package.",
    faqs: [
      {
        q: "What's the CO2 cannon rental price for a wedding?",
        a: "There's no separate price — the CO2 gun effect is included starting from Raj Tilak, our most affordable package. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Can I rent just the CO2 cannon without the rest of the package?",
        a: "No, it's included as part of our baraat packages, operated by our team alongside the truck and dhol.",
      },
      {
        q: "Is the CO2 effect included even in the cheapest package?",
        a: "Yes, Raj Tilak includes a liquid CO2 gun even at our most affordable tier.",
      },
      {
        q: "Does adding more CO2 effects cost extra?",
        a: "Additional CO2-based effects like confetti CO2 and jet effects are included as you move up to Maharaja and Signature, reflected in that package's price rather than as separate add-ons.",
      },
      {
        q: "How early should I book to include this effect?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since it's included by default and just requires confirming your package.",
      },
      {
        q: "Is the CO2 effect worth it compared to no effects at all?",
        a: "Since it's included even in Raj Tilak at no extra charge, it's part of the standard entry rather than an optional upgrade.",
      },
      {
        q: "Does the price change based on my city?",
        a: "Logistics can vary slightly, which is why we confirm your exact price once we know your date and location.",
      },
      {
        q: "How do I get an exact quote?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real number, usually within the hour.",
      },
    ],
  },

  "cold-pyro-rental-for-wedding": {
    slug: "cold-pyro-rental-for-wedding",
    intro:
      "Cold pyro rental for wedding baraats gives you the dramatic spark and flame look of traditional pyrotechnics without the heat or fire risk, making it safer for close-proximity use around a dancing crowd.\n\nPlanMyBaraat includes pyro effects — cold and hand pyro — as part of our Signature package, our most complete production tier.",
    explanation:
      "Cold pyro works using a different mechanism than traditional fireworks, producing the visual spark effect at a much lower temperature, which is why it's suitable for use closer to guests during a baraat entry. It's operated by our experienced team and timed to a specific moment, usually the truck's arrival at the venue.\n\nThis effect is combined with confetti and other visual elements in our Signature package to create a fuller sensory moment right as the baraat reaches the entrance.",
    whatsIncluded:
      "Signature includes pyro highlights on entry, hand pyro gun effects, confetti CO2 gun, liquid CO2 gun, moving LED panels, custom name lighting, 4 dhol, an American vintage car, 4 professional bouncers, and a safa team — our most complete package.",
    pricingGuidance:
      "Pyro effects are included as part of the Signature package. Message us on WhatsApp with your date and city for a real quote covering the full production.",
    bookingNotes:
      "Wedding season runs November to February. If you want pyro effects timed to a specific moment, mention it early — 3-4 weeks' notice gives us time to plan the details and coordinate with your venue on safety requirements.\n\nShare your date, city, venue, and venue's fire safety policies when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm the Signature package with pyro effects for your entry.",
    faqs: [
      {
        q: "Is cold pyro safe for use near guests?",
        a: "Yes, cold pyro produces the visual spark effect at a much lower temperature than traditional pyrotechnics, making it more suitable for close-proximity use, and it's operated by our experienced team.",
      },
      {
        q: "Which package includes cold pyro?",
        a: "Signature, our top package, includes pyro highlights and hand pyro gun effects as part of its full production.",
      },
      {
        q: "How much does cold pyro rental for wedding cost?",
        a: "It's included as part of the Signature package. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Do I need to check with my venue before adding pyro effects?",
        a: "Yes, we recommend confirming your venue's fire safety policies in advance, and we'll coordinate accordingly.",
      },
      {
        q: "How early should I book for a pyro-included entry?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, especially to allow time for venue coordination.",
      },
      {
        q: "Is the pyro effect combined with other effects?",
        a: "Yes, Signature combines pyro with confetti, CO2 effects, and moving LED panels for a fuller visual moment.",
      },
      {
        q: "Who operates the pyro equipment?",
        a: "Our experienced team handles the setup and operation as part of the Signature package.",
      },
      {
        q: "Can pyro be timed to the groom stepping down from the truck?",
        a: "Yes, message us with your preference and we'll plan the timing around that specific moment.",
      },
    ],
  },

  "hand-pyro-gun-for-wedding": {
    slug: "hand-pyro-gun-for-wedding",
    intro:
      "A hand pyro gun for wedding baraats is a handheld device that produces a controlled spark or flame burst, adding a striking, personal-feeling effect that's operated up close rather than from a fixed rig.\n\nPlanMyBaraat includes hand pyro gun effects as part of our Signature package, our most complete production tier.",
    explanation:
      "The handheld nature of this effect gives it a different feel than fixed pyro rigs — it can be positioned and timed flexibly, often used right at the moment the groom steps down from the truck or as the baraat crosses the venue threshold. It's operated by our experienced team with safety as the priority.\n\nCombined with the rest of Signature's effects lineup — confetti, CO2, and moving LED panels — the hand pyro gun adds one more layer to a fully produced entry.",
    whatsIncluded:
      "Signature includes the hand pyro gun alongside pyro highlights on entry, confetti CO2 gun, liquid CO2 gun, moving LED panels, custom name lighting, 4 dhol, an American vintage car, 4 professional bouncers, and a safa team.",
    pricingGuidance:
      "The hand pyro gun effect is included as part of the Signature package. Message us on WhatsApp with your date and city for a real quote covering the full production.",
    bookingNotes:
      "Wedding season runs November to February. If you want this effect timed to a specific moment, mention it early — 3-4 weeks' notice gives us time to plan properly and coordinate with your venue.\n\nShare your date, city, venue, and any timing preferences when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm the Signature package with hand pyro effects.",
    faqs: [
      {
        q: "Which package includes a hand pyro gun?",
        a: "Signature, our top package, includes hand pyro gun effects along with pyro highlights and other visual production.",
      },
      {
        q: "How much does a hand pyro gun for wedding cost?",
        a: "It's included as part of the Signature package. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is the hand pyro gun safe to use near guests?",
        a: "Yes, it's operated by our experienced team with safety and crowd positioning as priorities.",
      },
      {
        q: "Can the effect be timed to the groom stepping down?",
        a: "Yes, message us with your preference and we'll plan the timing around that specific moment.",
      },
      {
        q: "Do I need to inform my venue about this effect?",
        a: "Yes, we recommend confirming your venue's fire safety policies in advance, and we'll coordinate accordingly.",
      },
      {
        q: "How early should I book for this effect?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, especially to allow for venue coordination.",
      },
      {
        q: "What else comes with the Signature package?",
        a: "Confetti, CO2 effects, moving LED panels, custom name lighting, 6 dhol, an American vintage car, a security team, and a safa team.",
      },
      {
        q: "Who operates the hand pyro gun during the entry?",
        a: "Our experienced team handles the equipment and timing as part of the Signature package.",
      },
    ],
  },

  "pyro-effects-for-wedding-entry": {
    slug: "pyro-effects-for-wedding-entry",
    intro:
      "Pyro effects for wedding entry add a dramatic, spark-based visual moment to the baraat, typically timed to the truck's arrival or the groom stepping down, giving the entry a clear high point.\n\nPlanMyBaraat includes pyro highlights and hand pyro gun effects as part of our Signature package, our most complete production tier.",
    explanation:
      "Pyro effects work best as a punctuation mark rather than a constant presence — a burst timed precisely to a key moment reads as intentional and dramatic, rather than random. Our team plans the timing around the truck's arrival, coordinating with the DJ's set and the rest of the entry's flow.\n\nBecause pyro involves fire safety considerations, it's operated by our experienced team and planned in coordination with your venue rather than left to chance.",
    whatsIncluded:
      "Signature includes pyro highlights on entry and a hand pyro gun, alongside confetti CO2 gun, liquid CO2 gun, moving LED panels, custom name lighting, 6 dhol, an American vintage car, 4 professional bouncers, and a safa team.",
    pricingGuidance:
      "Pyro effects are included as part of the Signature package. Message us on WhatsApp with your date and city for a real quote covering the full production.",
    bookingNotes:
      "Wedding season runs November to February. If you want pyro timed to a specific moment, mention it early — 3-4 weeks' notice gives us time to plan the details and coordinate with your venue on any safety requirements.\n\nShare your date, city, venue, and any timing preferences when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm the Signature package with pyro effects for your entry.",
    faqs: [
      {
        q: "Which package includes pyro effects?",
        a: "Signature, our top package, includes pyro highlights on entry and a hand pyro gun as part of its full production.",
      },
      {
        q: "How much do pyro effects for wedding entry cost?",
        a: "They're included as part of the Signature package. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Are pyro effects safe for outdoor baraat use?",
        a: "Yes, they're operated by our experienced team with safety and appropriate positioning around the crowd.",
      },
      {
        q: "Do I need to check with my venue about pyro effects?",
        a: "Yes, we recommend confirming your venue's fire safety policies in advance, and we'll coordinate the timing accordingly.",
      },
      {
        q: "How early should I book for pyro-included effects?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, especially to allow time for venue coordination.",
      },
      {
        q: "Can pyro be combined with confetti and CO2 effects?",
        a: "Yes, Signature combines all three for a fuller visual moment at the truck's arrival.",
      },
      {
        q: "Is pyro included in the lower package tiers?",
        a: "No, pyro effects are specific to the Signature package, our most complete production tier.",
      },
      {
        q: "Who times and operates the pyro effects?",
        a: "Our experienced team handles the setup, timing, and operation as part of the Signature package.",
      },
    ],
  },

  "fireworks-for-wedding": {
    slug: "fireworks-for-wedding",
    intro:
      "Fireworks for wedding baraats usually refers to the pyro and spark effects timed to the entry, giving the truck's arrival a dramatic visual climax rather than traditional aerial fireworks.\n\nPlanMyBaraat includes pyro highlights and hand pyro gun effects as part of our Signature package, designed specifically for close-proximity baraat use.",
    explanation:
      "Traditional aerial fireworks require significant open space and specific permissions, which isn't practical for most baraat venues. Our pyro effects are designed for the actual format of a baraat entry — close to the truck, timed to a specific moment, and operated safely by our experienced team without needing a large open field.\n\nThis gives you the dramatic visual impact associated with fireworks, adapted specifically for a procession moving through a venue or neighborhood setting.",
    whatsIncluded:
      "Signature includes pyro highlights on entry and a hand pyro gun, alongside confetti CO2 gun, liquid CO2 gun, moving LED panels, custom name lighting, 6 dhol, an American vintage car, 4 professional bouncers, and a safa team.",
    pricingGuidance:
      "Pyro effects are included as part of the Signature package. Message us on WhatsApp with your date and city for a real quote covering the full production.",
    bookingNotes:
      "Wedding season runs November to February. Mention your venue's space and any fire safety policies early — 3-4 weeks' notice gives us time to plan and coordinate properly.\n\nShare your date, city, venue, and venue details when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm the Signature package with pyro effects for your entry.",
    faqs: [
      {
        q: "Do you offer traditional aerial fireworks?",
        a: "We offer pyro and spark effects designed for close-proximity baraat use, timed to the truck's arrival, rather than traditional aerial fireworks that need open space.",
      },
      {
        q: "Which package includes these effects?",
        a: "Signature, our top package, includes pyro highlights and a hand pyro gun as part of its full production.",
      },
      {
        q: "How much do fireworks-style effects for wedding cost?",
        a: "They're included as part of the Signature package. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is it safe to use pyro effects near my venue?",
        a: "Yes, our team operates the effects safely and we recommend confirming your venue's fire safety policies in advance.",
      },
      {
        q: "How early should I discuss this with my venue?",
        a: "As early as possible, ideally 3-4 weeks ahead, to allow time for venue coordination on safety requirements.",
      },
      {
        q: "Do I need a large open space for this effect?",
        a: "No, our pyro effects are designed for close-proximity baraat use, not requiring the space traditional aerial fireworks need.",
      },
      {
        q: "Is this effect combined with other visuals?",
        a: "Yes, Signature combines pyro with confetti, CO2 effects, and moving LED panels for a fuller visual moment.",
      },
      {
        q: "How do I book this effect for my baraat?",
        a: "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the Signature package's available.",
      },
    ],
  },

  "wedding-fireworks-rental": {
    slug: "wedding-fireworks-rental",
    intro:
      "Wedding fireworks rental searches for baraat entries usually lead to PlanMyBaraat's pyro effects, which are operated by our team as part of the Signature package rather than rented as standalone equipment.\n\nThis bundled approach means the pyro effects are safely timed to your truck's arrival, coordinated with the rest of your entry.",
    explanation:
      "Renting fireworks-style equipment on its own would leave you responsible for safe operation, timing, and coordination with the rest of your baraat — a significant undertaking on your wedding day. Our approach handles all of this as part of the Signature package, with our experienced team managing setup, timing, and safety.\n\nThe effects are specifically chosen and adapted for close-proximity baraat use, not general aerial fireworks, which wouldn't be practical for most venues.",
    whatsIncluded:
      "Signature includes pyro highlights on entry and a hand pyro gun, alongside confetti CO2 gun, liquid CO2 gun, moving LED panels, custom name lighting, 6 dhol, an American vintage car, 4 professional bouncers, and a safa team.",
    pricingGuidance:
      "There's no separate fireworks rental price — the pyro effects are included as part of the Signature package. Message us on WhatsApp with your date and city for a real quote covering the full production.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet, especially to allow time for venue coordination on safety.\n\nShare your date, city, venue, and any venue safety policies when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm the Signature package with pyro effects.",
    faqs: [
      {
        q: "Can I rent fireworks equipment on its own?",
        a: "No, our pyro effects come operated by our team as part of the Signature package, not as standalone equipment rental.",
      },
      {
        q: "What's the wedding fireworks rental price?",
        a: "There's no separate rental price — pyro effects are included as part of the Signature package. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Who operates the pyro equipment safely?",
        a: "Our experienced team handles setup, timing, and operation as part of the package.",
      },
      {
        q: "Do you need permission from my venue?",
        a: "We recommend confirming your venue's fire safety policies in advance, and we'll coordinate accordingly.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, especially for venue coordination.",
      },
      {
        q: "Is this effect suitable for indoor venues?",
        a: "It's designed for outdoor baraat entries — mention your venue setup and we'll advise on what's appropriate.",
      },
      {
        q: "What package tier includes this effect?",
        a: "Signature, our top package, includes pyro highlights and hand pyro gun effects.",
      },
      {
        q: "Can I combine this with confetti and LED effects?",
        a: "Yes, Signature combines pyro with confetti, CO2 effects, and moving LED panels.",
      },
    ],
  },

  "fake-money-gun-rental": {
    slug: "fake-money-gun-rental",
    intro:
      "A fake money gun rental for a baraat entry adds a fun, celebratory burst of flying cash-style notes, a playful effect that's become popular for grand entries and celebrations.\n\nPlanMyBaraat includes a fake money gun as part of our Signature package, our most complete production tier.",
    explanation:
      "The money gun effect is more playful than dramatic — it's designed to add a burst of fun and celebration rather than a visually intense moment like pyro or confetti. It works well combined with the rest of Signature's effects lineup, adding variety to the overall production.\n\nOur team operates the effect as part of the coordinated entry, timed alongside the truck's arrival and other visual moments.",
    whatsIncluded:
      "Signature includes the fake money gun alongside pyro highlights, confetti CO2 gun, liquid CO2 gun, moving LED panels, custom name lighting, 6 dhol, an American vintage car, 4 professional bouncers, and a safa team.",
    pricingGuidance:
      "The fake money gun is included as part of the Signature package. Message us on WhatsApp with your date and city for a real quote covering the full production.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm the Signature package with the fake money gun effect.",
    faqs: [
      {
        q: "Which package includes the fake money gun?",
        a: "Signature, our top package, includes the fake money gun as part of its full production lineup.",
      },
      {
        q: "How much does fake money gun rental cost?",
        a: "It's included as part of the Signature package. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Can I rent just the money gun without the rest of the package?",
        a: "No, it's included as part of the Signature baraat package, operated by our team alongside the truck and other effects.",
      },
      {
        q: "Is this effect safe to use near guests?",
        a: "Yes, it's a playful, low-risk effect operated by our team with appropriate crowd positioning.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since Signature is a popular package during peak season.",
      },
      {
        q: "Can the money gun be timed to a specific moment?",
        a: "Yes, message us with your preference and we'll coordinate the timing with the rest of the entry.",
      },
      {
        q: "What other effects come with the money gun in Signature?",
        a: "Pyro highlights, confetti, CO2 effects, moving LED panels, and custom name lighting, alongside 6 dhol and a security team.",
      },
      {
        q: "Is this effect suitable for sangeet or other functions too?",
        a: "It's included as part of our baraat entry package — mention if you're interested in it for another function and we'll let you know what's possible.",
      },
    ],
  },

  "money-gun-for-sangeet": {
    slug: "money-gun-for-sangeet",
    intro:
      "A money gun for sangeet is a fun, playful effect that showers flying cash-style notes during a celebration moment — while PlanMyBaraat's core packages are built around the baraat entry, the same fake money gun featured in our Signature package can be discussed for other functions too.\n\nMessage us on WhatsApp if you're interested in this effect for your sangeet, and we'll let you know what's possible.",
    explanation:
      "Our packages are primarily designed around the baraat procession — the truck, dhol, vintage car, and safa team all built for that specific moment. The fake money gun featured in Signature is part of that entry production, timed to the truck's arrival.\n\nIf you're looking for the effect specifically for a sangeet function separate from the baraat, reach out and describe what you need — we'll advise on what we can offer.",
    whatsIncluded:
      "The fake money gun is included as part of our Signature baraat package, alongside pyro highlights, confetti, CO2 effects, moving LED panels, 6 dhol, an American vintage car, a security team, and a safa team.",
    pricingGuidance:
      "The money gun effect is bundled into the Signature package pricing rather than sold separately. Message us on WhatsApp with details on what you're planning, and we'll let you know what's possible and give you a real quote.",
    bookingNotes:
      "Wedding season runs November to February. Mention your specific function and timing needs early so we can plan accordingly.\n\nShare your date, city, venue, and what function you're planning this for when you reach out.",
    closing:
      "Message us on WhatsApp with your event details, and we'll let you know what we can offer for your celebration.",
    faqs: [
      {
        q: "Do you offer a money gun specifically for sangeet functions?",
        a: "Our packages are built around the baraat entry, where the fake money gun is included in Signature. Message us with your sangeet plans and we'll let you know what's possible.",
      },
      {
        q: "How much does a money gun for sangeet cost?",
        a: "It's part of our Signature baraat package pricing. Message your event details on WhatsApp for a real quote and to discuss options for other functions.",
      },
      {
        q: "Is this effect safe to use indoors?",
        a: "This depends on the venue — mention your setup and we'll advise on what's appropriate.",
      },
      {
        q: "Can I book just the money gun effect without the full baraat package?",
        a: "Message us with what you're planning and we'll let you know what's possible outside of the standard baraat entry package.",
      },
      {
        q: "How early should I ask about this for my sangeet?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we have time to plan and confirm what's feasible.",
      },
      {
        q: "What other effects are similar to the money gun?",
        a: "Confetti cannons and CO2 guns offer a similar celebratory burst effect and are included in our Maharaja and Signature packages.",
      },
      {
        q: "Is the money gun effect messy to clean up?",
        a: "There's some cleanup involved, similar to confetti, which is worth discussing with your venue in advance.",
      },
      {
        q: "How do I find out if this is available for my event?",
        a: "Message us on WhatsApp with your date, city, and what you're planning, and we'll let you know what's possible.",
      },
    ],
  },

  "entertainer-for-baraat": {
    slug: "entertainer-for-baraat",
    intro:
      "An entertainer for baraat adds a live, interactive element to the procession beyond music — a costumed performer who engages directly with the dancing crowd and adds a fun, memorable moment to the entry.\n\nPlanMyBaraat includes a teddy or gorilla performer as part of our Rajwada package and above, alongside the truck, dhol team, vintage car, and safa team.",
    explanation:
      "A costumed entertainer works differently from the DJ or dhol team — they move through the crowd directly, dancing with guests, taking photos, and creating spontaneous, interactive moments that a fixed performance can't. It's a popular addition for families who want the entry to feel playful, not just musically loud.\n\nThe entertainer works alongside the truck and dhol team throughout the procession, adding to the overall energy rather than performing separately.",
    whatsIncluded:
      "Rajwada includes 1 teddy or gorilla artist alongside the truck, DJ, 4 dhol, chhatri lights, a vintage car, and a safa team. Maharaja and Signature carry this entertainer forward alongside their additional effects and production.",
    pricingGuidance:
      "The entertainer is included from the Rajwada package upward. Message us on WhatsApp with your date and city, and we'll walk you through what's included at each tier and give you a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for packages with entertainers peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm a package with an entertainer for your baraat.",
    faqs: [
      {
        q: "Which package includes an entertainer?",
        a: "Rajwada and above include a teddy or gorilla performer alongside the truck, dhol, car, and safa team.",
      },
      {
        q: "How much does an entertainer for baraat cost?",
        a: "It's included as part of the Rajwada package and above. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the entertainer interact directly with guests?",
        a: "Yes, they move through the crowd, dancing with guests and creating interactive, photo-worthy moments throughout the procession.",
      },
      {
        q: "What kind of costume does the entertainer wear?",
        a: "A teddy bear or gorilla costume, chosen for its crowd-pleasing, fun character.",
      },
      {
        q: "How early should I book a package with an entertainer?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since these packages are popular.",
      },
      {
        q: "Is the entertainer available in the starting package?",
        a: "No, the entertainer is included from Rajwada upward, not in Raj Tilak.",
      },
      {
        q: "Does the entertainer work alongside the dhol team?",
        a: "Yes, they add to the overall energy of the procession alongside the truck, DJ, and dhol team.",
      },
      {
        q: "Can I request a specific costume theme?",
        a: "Message us with your preferences and we'll let you know what's possible.",
      },
    ],
  },

  "entertainer-for-groom-entry": {
    slug: "entertainer-for-groom-entry",
    intro:
      "An entertainer for groom entry adds a lively, interactive presence to the procession, dancing alongside the crowd and creating a fun, energetic atmosphere as the groom makes his way toward the venue.\n\nPlanMyBaraat includes a teddy or gorilla performer as part of our Rajwada package and above.",
    explanation:
      "While the groom typically arrives in a vintage car and joins the procession, the entertainer works the crowd around him — engaging with guests, dancing, and adding a playful visual element that complements the more formal, royal feel of the vintage car arrival.\n\nThis combination — dignified groom entry plus playful crowd entertainment — is part of what makes our Rajwada package and above feel like a fuller celebration rather than just a procession.",
    whatsIncluded:
      "Rajwada includes 1 teddy or gorilla artist alongside the truck, DJ, 4 dhol, chhatri lights, a vintage car, and a safa team. Maharaja and Signature carry this entertainer forward with additional production layered on top.",
    pricingGuidance:
      "The entertainer is included from the Rajwada package upward. Message us on WhatsApp with your date and city for a real quote covering the full entry.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm a package with an entertainer for the groom's entry.",
    faqs: [
      {
        q: "Does the entertainer perform specifically for the groom?",
        a: "The entertainer works the crowd throughout the procession, adding energy around the groom's entry rather than a solo performance just for him.",
      },
      {
        q: "Which package includes this?",
        a: "Rajwada and above include a teddy or gorilla performer alongside the vintage car and rest of the entry.",
      },
      {
        q: "How much does an entertainer for groom entry cost?",
        a: "It's included as part of the Rajwada package and above. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the groom still arrive in a vintage car with this package?",
        a: "Yes, the vintage car is included in every package from Raj Tilak upward, and the entertainer adds to the overall procession energy alongside it.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since these packages are popular.",
      },
      {
        q: "Can the entertainer take photos with guests?",
        a: "Yes, they typically move through the crowd, dancing and creating photo-worthy moments throughout the procession.",
      },
      {
        q: "Is this available in the starting package?",
        a: "No, it's included from Rajwada upward, not in Raj Tilak, our starting tier.",
      },
      {
        q: "What's the difference between Rajwada and Maharaja for this?",
        a: "Both include the entertainer; Maharaja adds moving LED panels and custom name lighting on top.",
      },
    ],
  },

  "mascot-artist-for-wedding": {
    slug: "mascot-artist-for-wedding",
    intro:
      "A mascot artist for wedding baraats is a costumed performer — like a teddy bear or gorilla character — who dances through the crowd during the procession, adding a fun, visually distinct presence to the entry.\n\nPlanMyBaraat includes a mascot performer as part of our Rajwada package and above, alongside the truck, dhol team, vintage car, and safa team.",
    explanation:
      "The mascot works the crowd directly, unlike the DJ or dhol team who perform from a fixed position — dancing alongside guests, posing for photos, and adding a lighthearted visual element to balance the more traditional aspects of the procession.\n\nThis is a popular addition for families who want the entry to feel playful and interactive, not just musically loud, and works well alongside the dhol team's energy throughout the walk.",
    whatsIncluded:
      "Rajwada includes 1 teddy or gorilla artist alongside the truck, DJ, 4 dhol, chhatri lights, a vintage car, and a safa team. Maharaja and Signature carry this mascot forward alongside their additional production.",
    pricingGuidance:
      "The mascot artist is included from the Rajwada package upward. Message us on WhatsApp with your date and city, and we'll walk you through what's included and give you a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for packages with entertainers peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm a package with a mascot artist for your baraat.",
    faqs: [
      {
        q: "What kind of mascot character do you offer?",
        a: "A teddy bear or gorilla costume, chosen for its fun, crowd-pleasing character, included from the Rajwada package upward.",
      },
      {
        q: "How much does a mascot artist for wedding cost?",
        a: "It's included as part of the Rajwada package and above. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the mascot dance with guests directly?",
        a: "Yes, they move through the crowd, dancing with guests and creating fun, interactive photo moments throughout the procession.",
      },
      {
        q: "Is the mascot artist available in the starting package?",
        a: "No, it's included from Rajwada upward, not in Raj Tilak, our starting tier.",
      },
      {
        q: "How early should I book a package with a mascot?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since these packages are popular.",
      },
      {
        q: "Does the mascot work alongside the dhol team?",
        a: "Yes, they add to the overall energy of the procession alongside the truck, DJ, and dhol team.",
      },
      {
        q: "Can I request a different mascot character?",
        a: "Message us with your preferences on WhatsApp and we'll let you know what's possible.",
      },
      {
        q: "Is the mascot suitable for all ages in the crowd?",
        a: "Yes, it's a family-friendly, playful character designed to entertain guests of all ages.",
      },
    ],
  },

  "crowd-engagement-artist-wedding": {
    slug: "crowd-engagement-artist-wedding",
    intro:
      "A crowd engagement artist for wedding baraats works the procession directly, interacting with guests, encouraging dancing, and keeping the energy up beyond what music alone provides.\n\nPlanMyBaraat includes a teddy or gorilla performer for this role as part of our Rajwada package and above.",
    explanation:
      "While the DJ and dhol team provide the music and rhythm, a crowd engagement artist adds a personal, interactive layer — moving through the group, dancing with individual guests, and helping keep momentum up especially during longer processions or quieter musical stretches.\n\nThis role works best alongside a strong music setup rather than replacing it, which is why it's included as an add-on to the truck and dhol combination rather than a standalone booking.",
    whatsIncluded:
      "Rajwada includes 1 teddy or gorilla artist alongside the truck, DJ, 4 dhol, chhatri lights, a vintage car, and a safa team. Maharaja and Signature carry this forward with additional production layered on top.",
    pricingGuidance:
      "The crowd engagement artist is included from the Rajwada package upward. Message us on WhatsApp with your date and city, and we'll give you a real quote covering the full package.",
    bookingNotes:
      "Wedding season runs November to February, and demand for packages with entertainers peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm a package with a crowd engagement artist for your baraat.",
    faqs: [
      {
        q: "What does a crowd engagement artist actually do during the baraat?",
        a: "They move through the procession, dancing with guests directly and helping keep energy up throughout the walk, especially during quieter musical moments.",
      },
      {
        q: "Which package includes this?",
        a: "Rajwada and above include a teddy or gorilla performer for crowd engagement.",
      },
      {
        q: "How much does a crowd engagement artist cost?",
        a: "It's included as part of the Rajwada package and above. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does this replace the need for a DJ or dhol team?",
        a: "No, it works alongside the music setup rather than replacing it — the truck, DJ, and dhol team are the foundation, with the entertainer adding to that energy.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since these packages are popular.",
      },
      {
        q: "Is this available in the starting package?",
        a: "No, it's included from Rajwada upward, not in Raj Tilak.",
      },
      {
        q: "Does the artist interact with the whole guest list or just a few people?",
        a: "They move through the whole crowd during the procession, engaging with as many guests as possible along the way.",
      },
      {
        q: "What costume does the crowd engagement artist wear?",
        a: "A teddy bear or gorilla costume, chosen for being fun and approachable for guests of all ages.",
      },
    ],
  },

  "dhol-for-wedding": {
    slug: "dhol-for-wedding",
    intro:
      "Dhol for wedding baraats is the traditional double-sided drum played live throughout the procession, giving the entry its core rhythm and energy alongside the DJ truck's music.\n\nPlanMyBaraat includes a dhol team in every package, starting from 2 players in Raj Tilak up to 6 in Signature, alongside the truck, vintage car, and safa team.",
    explanation:
      "The dhol is central to any baraat — its beat is what most people associate with the celebratory, dancing energy of the procession. Our players work alongside the DJ, filling in during transitions and adding a live, physical energy that recorded music alone doesn't provide.\n\nPlayers are experienced with baraat-specific rhythms and pacing, keeping the beat consistent as the truck moves at walking pace and the crowd dances around it.",
    whatsIncluded:
      "Raj Tilak includes 2 dhol players. Rajwada steps up to 4. Maharaja and Signature both include 6 dhol, with Signature adding extra entertainment on top. All tiers include the truck, DJ, chhatri lights, a vintage car, and a safa team alongside the dhol team.",
    pricingGuidance:
      "Pricing depends on the package tier and dhol count. Raj Tilak is the most affordable option and Signature is the most complete. We quote based on your date, city, and guest count.\n\nMessage us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and dhol teams get booked out fast during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the dhol team's available, usually within the hour.",
    faqs: [
      {
        q: "How many dhol players come with each package?",
        a: "Raj Tilak includes 2, Rajwada includes 4, and Maharaja and Signature both include 6, with Signature adding extra entertainment on top.",
      },
      {
        q: "How much does dhol for wedding cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Can I request more dhol players than the package includes?",
        a: "Message us with your preference and we'll let you know what's possible for your booking.",
      },
      {
        q: "Do the dhol players work with the DJ or separately?",
        a: "They coordinate together throughout the procession, filling in during DJ transitions and keeping the energy consistent.",
      },
      {
        q: "How early should I book a dhol team?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since dhol teams get booked out fast.",
      },
      {
        q: "Are the dhol players experienced with baraat pacing specifically?",
        a: "Yes, they work with us regularly and are experienced with the rhythm and pacing a moving baraat procession needs.",
      },
      {
        q: "Is the dhol team booked separately from the truck?",
        a: "No, dhol players are included in the same package as the truck, not booked separately.",
      },
      {
        q: "What's the difference between Raj Tilak and Signature for dhol count?",
        a: "Raj Tilak includes 2 dhol while Signature includes 6, alongside significantly more production overall.",
      },
    ],
  },

  "dhol-player-near-me": {
    slug: "dhol-player-near-me",
    intro:
      "Searching for a dhol player near me for a baraat means finding local, experienced players who know the pacing a wedding procession needs — not just any drummer, but one used to walking alongside a moving crowd for an extended period.\n\nPlanMyBaraat's dhol players work across Gujarat regularly, included as part of every baraat package alongside the truck, vintage car, and safa team.",
    explanation:
      "Baraat dhol playing is physically demanding and requires a different skill set than a studio or stage performance — players need stamina for a long walking procession, awareness of the crowd's energy, and coordination with the DJ's live set. Our players work with us regularly across the cities and towns we cover, so they're experienced with exactly this format.\n\nBeing local also means our team knows typical route lengths and timing in different cities, helping plan the right pacing for your specific procession.",
    whatsIncluded:
      "Raj Tilak includes 2 dhol players. Rajwada steps up to 4. Maharaja and Signature both include 6, alongside the truck, DJ, chhatri lights, a vintage car, and a safa team.",
    pricingGuidance:
      "Pricing depends on the package tier and dhol count. We confirm the exact price once we know your city and date. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and local dhol availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your city, date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your city and wedding date, and we'll confirm a dhol team's available near you, usually within the hour.",
    faqs: [
      {
        q: "Do you have dhol players near my city?",
        a: "We cover Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat. Message us your city to confirm.",
      },
      {
        q: "How much does a dhol player near me cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Are the players experienced with long processions?",
        a: "Yes, they're chosen for stamina and experience with the pacing a moving baraat needs, not just short performances.",
      },
      {
        q: "How many dhol players are typically needed for a baraat?",
        a: "It depends on your package and guest count — our tiers range from 2 to 6 dhol players, and we'll recommend based on your event size.",
      },
      {
        q: "How early should I book local dhol players?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since local availability tightens during peak season.",
      },
      {
        q: "Do the players know the local route timing?",
        a: "Yes, our team works across Gujarat regularly and understands typical route lengths and timing in the cities we cover.",
      },
      {
        q: "Can I book just dhol players without the full package?",
        a: "Dhol players are included as part of our baraat packages alongside the truck, car, and safa team, not booked as a standalone service.",
      },
      {
        q: "What cities do you cover for dhol players?",
        a: "Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat.",
      },
    ],
  },

  "dhol-team-for-baraat": {
    slug: "dhol-team-for-baraat",
    intro:
      "A dhol team for baraat is the group of drummers who provide the live rhythm for your wedding procession, working alongside the DJ truck to keep the energy consistent from start to finish.\n\nPlanMyBaraat includes a dhol team in every package, from 2 players in Raj Tilak up to 6 in Signature, alongside the truck, vintage car, and safa team.",
    explanation:
      "The dhol team's role goes beyond just playing music — they help pace the procession, respond to the crowd's energy, and fill in during moments when the DJ transitions between tracks. A well-coordinated team makes the whole entry feel seamless rather than like two separate performances happening at once.\n\nOur players work with us regularly, so they're familiar with our truck setup and DJ style, making the coordination smoother than a last-minute hired group would be.",
    whatsIncluded:
      "Raj Tilak includes 2 dhol players and chhatri lights. Rajwada steps up to 4 dhol and adds a teddy or gorilla performer. Maharaja and Signature both include 6 dhol, with Signature adding pyro, confetti, and security on top.",
    pricingGuidance:
      "Pricing depends on the package tier and dhol count. Raj Tilak is the most affordable option and Signature is the most complete. We quote based on your date, city, and guest count.\n\nMessage us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and dhol teams get booked out fast during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the dhol team's available, usually within the hour.",
    faqs: [
      {
        q: "How does the dhol team coordinate with the DJ truck?",
        a: "They work together throughout the procession, with the dhol filling in during DJ transitions and matching the overall energy of the entry.",
      },
      {
        q: "How much does a dhol team for baraat cost?",
        a: "It's included as part of every package, from 2 players in Raj Tilak to 6 in Signature. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is the dhol team the same players every time or does it vary?",
        a: "Our players work with us regularly, so the team is consistent and experienced with our setup rather than hired ad hoc for each event.",
      },
      {
        q: "How many dhol players do I need for my guest count?",
        a: "We'll recommend based on your specific guest count and venue — message us the details and we'll suggest the right package.",
      },
      {
        q: "How early should I book a dhol team?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since teams get booked out fast.",
      },
      {
        q: "Do the dhol players walk the whole route?",
        a: "Yes, they walk alongside the truck for the entire procession, keeping the rhythm going from start to finish.",
      },
      {
        q: "Is the dhol team included even in the cheapest package?",
        a: "Yes, Raj Tilak includes 2 dhol players even at our most affordable tier.",
      },
      {
        q: "What's the maximum number of dhol players available?",
        a: "Our Maharaja and Signature packages both include 6 dhol players, our highest tier.",
      },
    ],
  },

  "dhol-booking-online": {
    slug: "dhol-booking-online",
    intro:
      "Dhol booking online with PlanMyBaraat starts with a WhatsApp message, not a long form — share your date, city, and rough guest count, and we'll confirm your dhol team as part of a full baraat package.\n\nThe online booking covers the whole entry: the dhol team, DJ truck, vintage car, and safa team, not the dhol alone.",
    explanation:
      "Rather than a website form and a wait for a callback, our process happens over WhatsApp because that's where the actual coordination happens anyway — sharing details, confirming availability, sending quotes. You message us, we respond with package options, and once you confirm, we lock in your dhol team along with the rest of the entry.\n\nThis makes it easy to book whenever is convenient for you, without needing to call during specific hours.",
    whatsIncluded:
      "Raj Tilak includes 2 dhol players. Rajwada steps up to 4. Maharaja and Signature both include 6, alongside the truck, DJ, chhatri lights, a vintage car, and a safa team.",
    pricingGuidance:
      "Pricing depends on the package tier and dhol count. We quote based on your date, city, and guest count. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and online booking slots fill up fast during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you message us.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue to start the booking process, usually confirmed within the hour.",
    faqs: [
      {
        q: "How do I book a dhol team online?",
        a: "Message us on WhatsApp with your wedding date, city, venue, and rough guest count. We'll recommend a package and confirm availability, usually within the hour.",
      },
      {
        q: "Is there a form I need to fill out on a website?",
        a: "No, WhatsApp is our main booking channel — it's faster and lets us share quotes and answer questions directly.",
      },
      {
        q: "How much does dhol booking online cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Can I pay a deposit online to confirm?",
        a: "Yes, we'll share payment details once you confirm your package and date, and take an advance to lock in the booking.",
      },
      {
        q: "How quickly do you respond to online booking inquiries?",
        a: "Usually within the hour during business hours.",
      },
      {
        q: "Can I see videos of the dhol team before booking online?",
        a: "Yes, message us on WhatsApp and we'll share videos of past entries.",
      },
      {
        q: "How early should I book online for peak season?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since slots fill up fast.",
      },
      {
        q: "What details do I need to book online?",
        a: "Your wedding date, city, venue, rough guest count, and preferred package — that's enough for us to confirm.",
      },
    ],
  },

  "punjabi-dhol-booking": {
    slug: "punjabi-dhol-booking",
    intro:
      "Punjabi dhol booking for a baraat means the traditional double-sided drum played in the energetic, celebratory style associated with Punjabi wedding processions — a style that's become the standard for baraat entries across India, including Gujarat.\n\nPlanMyBaraat includes Punjabi dhol players in every package, from 2 in Raj Tilak up to 6 in Signature.",
    explanation:
      "The Punjabi dhol style is characterized by its powerful, driving rhythm, well suited to a dancing, moving crowd. Our players are trained in this style specifically, which is why it works so well alongside the DJ truck's music and the overall energy of a grand baraat entry.\n\nThe style also pairs naturally with Bollywood and Punjabi music, which our DJ artists often include in their sets, creating a cohesive sound throughout the procession.",
    whatsIncluded:
      "Raj Tilak includes 2 dhol players. Rajwada steps up to 4. Maharaja and Signature both include 6, alongside the truck, DJ, chhatri lights, a vintage car, and a safa team.",
    pricingGuidance:
      "Pricing depends on the package tier and dhol count. We quote based on your date, city, and guest count. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and dhol teams get booked out fast during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the Punjabi dhol team's available, usually within the hour.",
    faqs: [
      {
        q: "What is Punjabi dhol style specifically?",
        a: "It's characterized by a powerful, driving rhythm well suited to a dancing crowd, and it's become the standard style for baraat entries across India.",
      },
      {
        q: "How much does Punjabi dhol booking cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Do the players know Bollywood and Punjabi music styles?",
        a: "Yes, they're trained in the Punjabi dhol style and coordinate well with our DJ's Bollywood and Punjabi music sets.",
      },
      {
        q: "How many Punjabi dhol players come with each package?",
        a: "Raj Tilak includes 2, Rajwada includes 4, and Maharaja and Signature both include 6.",
      },
      {
        q: "How early should I book Punjabi dhol players?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since teams get booked out fast.",
      },
      {
        q: "Are the players experienced with baraat-specific pacing?",
        a: "Yes, they work with us regularly and are experienced with the rhythm and pacing a moving baraat procession needs.",
      },
      {
        q: "Is Punjabi dhol suitable for a Gujarati wedding?",
        a: "Yes, the Punjabi dhol style has become the standard for baraat entries across regions, including Gujarat.",
      },
      {
        q: "Can the players adjust their style for a specific song request?",
        a: "Message us with your preference and we'll coordinate with the team and DJ accordingly.",
      },
    ],
  },

  "dhol-group-price": {
    slug: "dhol-group-price",
    intro:
      "Dhol group price for a baraat isn't a standalone number with PlanMyBaraat, since the dhol team is included in every package alongside the DJ truck, vintage car, and safa team.\n\nThe price depends on the package tier and dhol count — 2 players in Raj Tilak up to 6 in Signature.",
    explanation:
      "Because the dhol group works as part of a coordinated entry alongside the DJ, truck, and other elements, it isn't priced or booked as a separate service. Each package tier includes a set number of dhol players, with the count increasing as you move up from Raj Tilak to Signature.\n\nThis bundled approach means the dhol group's price reflects the whole entry's production level, not just headcount.",
    whatsIncluded:
      "Raj Tilak includes 2 dhol players. Rajwada steps up to 4. Maharaja and Signature both include 6, alongside the truck, DJ, chhatri lights, a vintage car, and a safa team.",
    pricingGuidance:
      "There's no separate dhol group price — it's included as part of the package cost. Message us on WhatsApp with your date and city, and we'll give you a real quote for the full package.",
    bookingNotes:
      "Wedding season runs November to February, and both price and dhol availability tighten during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and guest count when you reach out for an accurate quote.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll send you a real quote covering the dhol group and full package.",
    faqs: [
      {
        q: "What's the dhol group price for a baraat?",
        a: "There's no separate price — dhol players are included in every package, from 2 in Raj Tilak to 6 in Signature. Message your date and city for a real quote covering the full entry.",
      },
      {
        q: "Can I book just the dhol group without the truck?",
        a: "No, dhol players are included as part of our baraat packages alongside the truck, car, and safa team, not booked separately.",
      },
      {
        q: "Does more dhol players mean a higher price?",
        a: "Yes, dhol count increases with the package tier, so more players come with a higher-tier, more complete package.",
      },
      {
        q: "Is the starting package's dhol count enough for a smaller wedding?",
        a: "Yes, 2 dhol players in Raj Tilak works well for smaller to mid-sized guest lists — we'll advise based on your specific numbers.",
      },
      {
        q: "How early should I lock in a price?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since prices and availability both tighten during peak season.",
      },
      {
        q: "Does the price change based on my city?",
        a: "Logistics can vary slightly, which is why we confirm your exact price once we know your date and location.",
      },
      {
        q: "Can I request extra dhol players beyond the package?",
        a: "Message us with your requirements and we'll let you know what's possible for your booking.",
      },
      {
        q: "How do I get an exact price for the dhol group and full package?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real number, usually within the hour.",
      },
    ],
  },

  "band-baja-for-wedding": {
    slug: "band-baja-for-wedding",
    intro:
      "Band baja for wedding is the traditional term for a live musical procession — historically a brass band, though today it's often replaced or paired with a modern DJ truck setup for a bigger sound.\n\nPlanMyBaraat brings both traditions together: a live dhol team alongside a full DJ truck production, giving you the celebratory energy of a band baja with modern sound and lighting.",
    explanation:
      "The classic band baja was a walking brass ensemble leading the procession, and while that tradition still exists in some regions, most modern baraats in Gujarat combine live dhol drumming with a DJ truck for a fuller, louder sound that works better for large guest lists and bigger venues.\n\nOur packages keep the live, celebratory energy of a traditional band baja through the dhol team, while the truck adds the scale and production a modern wedding often wants.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, and DJ artist, along with a dhol team — 2 players in Raj Tilak up to 6 in Signature. A vintage car and safa team are included from Raj Tilak upward.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Raj Tilak is the most affordable option and Signature is the most complete. We quote based on your date, city, and guest count.\n\nMessage us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for full baraat productions peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "Is band baja the same as what you offer?",
        a: "We combine the live, celebratory energy of a traditional band baja through our dhol team with a modern DJ truck setup for a fuller, louder production.",
      },
      {
        q: "Do you offer a traditional brass band instead of a DJ truck?",
        a: "Our core packages are built around the DJ truck and dhol combination. Message us if you're specifically interested in a traditional brass band and we'll let you know what's possible.",
      },
      {
        q: "How much does band baja for wedding cost?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is live drumming included alongside the DJ truck?",
        a: "Yes, dhol players are included in every package, working alongside the DJ throughout the procession.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since demand peaks then.",
      },
      {
        q: "Can I combine traditional and modern elements in my entry?",
        a: "Yes, our packages already blend live dhol drumming with modern DJ and lighting production for exactly this kind of combination.",
      },
      {
        q: "Does the vintage car come with this package too?",
        a: "Yes, a vintage car or baggi is included in every package from Raj Tilak upward.",
      },
      {
        q: "What's the difference between the package tiers?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, effects, and a security team.",
      },
    ],
  },

  "brass-band-for-wedding": {
    slug: "brass-band-for-wedding",
    intro:
      "A brass band for wedding is the classic walking musical ensemble traditionally seen leading baraat processions — while PlanMyBaraat's core packages center on the modern DJ truck and dhol combination, we can discuss brass band needs alongside our standard offering.\n\nMessage us on WhatsApp if you're specifically interested in a brass band element for your baraat, and we'll let you know what's possible.",
    explanation:
      "Many modern baraats in Gujarat have shifted toward the DJ truck and dhol combination for a bigger, more contemporary sound, but some families still want elements of the traditional brass band experience. Our core packages are built around the truck setup, though we're happy to discuss what's possible if a brass band element matters to you specifically.\n\nReach out with your specific vision and we'll advise on how to incorporate it alongside or instead of our standard packages.",
    whatsIncluded:
      "Our standard packages include the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team. For brass band inquiries specifically, message us to discuss options.",
    pricingGuidance:
      "Our standard package pricing depends on the tier, dhol count, and any extra effects. For brass band-specific requests, message us on WhatsApp and we'll advise on what's possible and provide pricing.",
    bookingNotes:
      "Wedding season runs November to February. If you have a specific brass band request, mention it as early as possible, ideally 3-4 weeks ahead.\n\nShare your date, city, venue, and specific requirements when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and any brass band-specific requirements, and we'll let you know what's possible.",
    faqs: [
      {
        q: "Do you offer traditional brass bands for baraat?",
        a: "Our core packages center on the DJ truck and dhol combination. Message us with your specific brass band interest and we'll let you know what's possible.",
      },
      {
        q: "What's included in your standard packages instead?",
        a: "A DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team — a modern take on the traditional procession.",
      },
      {
        q: "How much does a brass band for wedding cost through you?",
        a: "Message us with your specific request on WhatsApp and we'll advise on what's possible and provide pricing.",
      },
      {
        q: "Can I combine a brass band with your DJ truck package?",
        a: "Message us with your vision and we'll let you know what combinations are feasible for your event.",
      },
      {
        q: "How early should I discuss a brass band request?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we have time to plan and confirm what's feasible.",
      },
      {
        q: "Is the dhol team a good alternative to a brass band?",
        a: "Yes, many families find the live dhol drumming alongside the DJ truck gives similar celebratory energy with a more modern production.",
      },
      {
        q: "Do you cover this across Gujarat?",
        a: "We operate across Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts in Gujarat.",
      },
      {
        q: "How do I find out what's possible for my event?",
        a: "Message us on WhatsApp with your date, city, and specific requirements, and we'll advise on the best options.",
      },
    ],
  },

  "brass-band-for-baraat": {
    slug: "brass-band-for-baraat",
    intro:
      "A brass band for baraat is the traditional walking musical ensemble that historically led wedding processions — PlanMyBaraat's core packages center on the modern DJ truck and dhol combination, but we're happy to discuss brass band-specific requests.\n\nMessage us on WhatsApp with your vision, and we'll let you know what's possible alongside or instead of our standard offering.",
    explanation:
      "The shift toward DJ trucks and dhol teams reflects a broader trend in Gujarat wedding processions, offering bigger sound and more visual production than a traditional brass band typically provides. That said, we understand some families want to keep specific traditional elements, and we're open to discussing what's feasible.\n\nOur standard packages already include live dhol drumming, which carries forward some of the traditional, celebratory energy associated with a brass band procession.",
    whatsIncluded:
      "Our standard packages include the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team. For brass band-specific requests, message us to discuss options.",
    pricingGuidance:
      "Standard package pricing depends on the tier, dhol count, and any extra effects. For brass band-specific requests, message us on WhatsApp and we'll advise on what's possible and provide pricing.",
    bookingNotes:
      "Wedding season runs November to February. If you have a specific brass band request, mention it as early as possible, ideally 3-4 weeks ahead.\n\nShare your date, city, venue, and specific requirements when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and any brass band-specific requirements, and we'll let you know what's possible.",
    faqs: [
      {
        q: "Do you provide brass bands for baraat processions?",
        a: "Our core packages center on the DJ truck and dhol combination. Message us your specific brass band interest and we'll advise on what's possible.",
      },
      {
        q: "What do your standard packages include instead?",
        a: "A DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, offering a modern take on the traditional procession.",
      },
      {
        q: "How much does a brass band for baraat cost?",
        a: "Message us with your specific request on WhatsApp and we'll advise on options and pricing.",
      },
      {
        q: "Can the dhol team give a similar traditional feel?",
        a: "Yes, live dhol drumming carries forward some of the traditional, celebratory energy associated with a brass band.",
      },
      {
        q: "How early should I ask about this?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we have time to confirm what's feasible for your event.",
      },
      {
        q: "Do you serve all of Gujarat for this kind of request?",
        a: "We operate across Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts in Gujarat.",
      },
      {
        q: "Is a brass band more traditional than a DJ truck setup?",
        a: "Historically yes, though DJ truck and dhol combinations have become the modern standard for most baraats in the region.",
      },
      {
        q: "How do I find out what's possible for my specific wedding?",
        a: "Message us on WhatsApp with your date, city, and requirements, and we'll advise on the best options for your event.",
      },
    ],
  },

  "traditional-brass-band-booking": {
    slug: "traditional-brass-band-booking",
    intro:
      "Traditional brass band booking for a baraat is a specific request PlanMyBaraat can discuss alongside our core DJ truck and dhol packages — while our standard offering centers on the modern setup, we're happy to advise on what's possible for a more traditional request.\n\nMessage us on WhatsApp with your vision, and we'll let you know how to approach it.",
    explanation:
      "Traditional brass bands bring a specific, classic sound that some families want to preserve as part of their wedding, even alongside modern elements like a DJ truck. We understand this and can discuss combining traditions or advising on options depending on what matters most to you.\n\nOur standard packages already include live dhol drumming, which many families find provides a similar traditional, celebratory energy within a more modern production.",
    whatsIncluded:
      "Our standard packages include the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team. For traditional brass band-specific requests, message us to discuss options.",
    pricingGuidance:
      "Standard package pricing depends on the tier, dhol count, and any extra effects. For traditional brass band requests, message us on WhatsApp and we'll advise on what's possible and provide pricing.",
    bookingNotes:
      "Wedding season runs November to February. If you have a specific traditional booking request, mention it as early as possible, ideally 3-4 weeks ahead.\n\nShare your date, city, venue, and specific requirements when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and any traditional brass band requirements, and we'll let you know what's possible.",
    faqs: [
      {
        q: "Can I book a traditional brass band through PlanMyBaraat?",
        a: "Our core packages center on the DJ truck and dhol combination. Message us your specific request and we'll advise on what's possible.",
      },
      {
        q: "What's the alternative you typically recommend?",
        a: "A DJ truck with live dhol drumming, which offers a modern production while still carrying forward traditional, celebratory energy.",
      },
      {
        q: "How much does traditional brass band booking cost?",
        a: "Message us with your specific request on WhatsApp and we'll advise on options and pricing.",
      },
      {
        q: "Can traditional and modern elements be combined?",
        a: "Message us with your vision and we'll let you know what combinations are feasible for your specific event.",
      },
      {
        q: "How early should I discuss this request?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we have time to confirm what's feasible.",
      },
      {
        q: "Do you cover this across all of Gujarat?",
        a: "We operate across Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts in Gujarat.",
      },
      {
        q: "Is the dhol team a common substitute for a traditional band?",
        a: "Yes, many families find live dhol drumming alongside the DJ truck provides similar traditional energy in a more modern format.",
      },
      {
        q: "How do I find out what's possible for my wedding?",
        a: "Message us on WhatsApp with your date, city, and requirements, and we'll advise on the best options.",
      },
    ],
  },

  "shehnai-player-booking": {
    slug: "shehnai-player-booking",
    intro:
      "Shehnai player booking for a wedding brings the classical, ceremonial sound of the traditional wind instrument often associated with the more solemn or ceremonial parts of an Indian wedding — a different feel from the DJ truck's energetic baraat entry.\n\nPlanMyBaraat's core packages focus on the baraat procession itself. Message us if you're specifically interested in shehnai music for another part of your wedding, and we'll advise on what's possible.",
    explanation:
      "The shehnai has a distinct role in Indian weddings — often played during specific ceremonial moments rather than the dancing, celebratory baraat entry, which is what our packages are built around. If shehnai music matters to you for a particular moment in your wedding, let us know and we'll advise on how to approach it alongside our core offering.\n\nOur baraat packages themselves focus on the DJ truck, dhol team, and overall procession energy, which serves a different purpose than the more ceremonial shehnai tradition.",
    whatsIncluded:
      "Our standard baraat packages include the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team. For shehnai-specific requests, message us to discuss options.",
    pricingGuidance:
      "Standard baraat package pricing depends on the tier, dhol count, and any extra effects. For shehnai-specific requests, message us on WhatsApp and we'll advise on what's possible.",
    bookingNotes:
      "Wedding season runs November to February. If you have a specific shehnai request for another part of your wedding, mention it as early as possible.\n\nShare your date, city, venue, and specific requirements when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and any shehnai-specific requirements, and we'll let you know what's possible.",
    faqs: [
      {
        q: "Do you offer shehnai players for baraat entries?",
        a: "Our core baraat packages center on the DJ truck and dhol combination, which suits the energetic procession format. Message us about shehnai for other parts of your wedding.",
      },
      {
        q: "When is a shehnai typically used in a wedding?",
        a: "It's often played during more ceremonial or solemn moments, distinct from the celebratory, dancing energy of the baraat entry.",
      },
      {
        q: "How much does shehnai player booking cost?",
        a: "Message us with your specific request on WhatsApp and we'll advise on options and pricing.",
      },
      {
        q: "Can I add shehnai music to a specific part of my wedding day?",
        a: "Message us with your vision and we'll let you know what's feasible for your event.",
      },
      {
        q: "How early should I ask about this?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we have time to advise properly.",
      },
      {
        q: "Is the dhol team a good fit for the baraat entry specifically?",
        a: "Yes, the dhol team is specifically suited to the energetic, dancing format of a baraat entry, unlike the more ceremonial shehnai.",
      },
      {
        q: "Do you operate across Gujarat for this kind of request?",
        a: "We operate across Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts in Gujarat.",
      },
      {
        q: "How do I find out what's possible for my wedding?",
        a: "Message us on WhatsApp with your date, city, and requirements, and we'll advise on the best options.",
      },
    ],
  },

  "baraat-band-booking": {
    slug: "baraat-band-booking",
    intro:
      "Baraat band booking with PlanMyBaraat means booking the live dhol team that provides the drumming energy for your wedding procession, alongside the DJ truck, vintage car, and safa team.\n\nOne booking covers the whole entry, with dhol count ranging from 2 players in Raj Tilak up to 6 in Signature.",
    explanation:
      "Rather than booking a band separately from the truck and other elements, our approach bundles the dhol team into one coordinated package. This means timing, positioning, and coordination with the DJ are all handled together as one operation, rather than a separately hired band showing up independently.\n\nThe dhol team's role is specifically tuned to a baraat's needs — walking pace, sustained energy, and coordination with a live DJ set, different from a fixed-stage musical performance.",
    whatsIncluded:
      "Raj Tilak includes 2 dhol players. Rajwada steps up to 4. Maharaja and Signature both include 6, alongside the truck, DJ, chhatri lights, a vintage car, and a safa team.",
    pricingGuidance:
      "Pricing depends on the package tier and dhol count. We quote based on your date, city, and guest count. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and baraat band slots fill up fast during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the band's available, usually within the hour.",
    faqs: [
      {
        q: "How do I book a baraat band?",
        a: "Message us on WhatsApp with your wedding date, city, venue, and rough guest count. We'll recommend a package and confirm availability, usually within the hour.",
      },
      {
        q: "How much does baraat band booking cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Is the band coordinated with the DJ truck?",
        a: "Yes, the dhol team works alongside the DJ throughout the procession as one coordinated performance.",
      },
      {
        q: "How many musicians are in the baraat band?",
        a: "Dhol count ranges from 2 in Raj Tilak to 6 in Signature, depending on your package.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since slots fill up fast.",
      },
      {
        q: "Can I book the band without the truck?",
        a: "No, the dhol team is included as part of our coordinated baraat packages, not booked separately from the truck.",
      },
      {
        q: "Does the band walk the whole procession route?",
        a: "Yes, they walk alongside the truck for the entire route, keeping the energy consistent throughout.",
      },
      {
        q: "What's the difference between package tiers for the band?",
        a: "Raj Tilak includes 2 dhol while Maharaja and Signature include 6, alongside significantly more overall production.",
      },
    ],
  },

  "chhatri-lights-for-baraat": {
    slug: "chhatri-lights-for-baraat",
    intro:
      "Chhatri lights for baraat are the traditional umbrella-style lights that give a wedding procession its classic, warm evening glow — a staple of Indian baraat entries for generations.\n\nPlanMyBaraat includes chhatri lights as standard in every package, starting from Raj Tilak, our most affordable tier.",
    explanation:
      "The chhatri light style creates a soft, festive canopy of light around the procession, traditionally carried by attendants walking alongside the baraat. This traditional look pairs well with the truck and dhol setup, giving the entry a warm, celebratory feel especially for evening processions.\n\nHigher packages add more chhatri lights and combine them with modern LED elements, but the traditional chhatri look remains included at every tier as the visual foundation of the entry.",
    whatsIncluded:
      "Raj Tilak includes 8 chhatri lights. Rajwada steps up to 10 premium chhatri lights. Maharaja and Signature both include 10 premium chhatri lights alongside their additional LED and effects production.",
    pricingGuidance:
      "Chhatri lights are included in every package, so pricing reflects the overall tier rather than a separate lighting charge. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and evening entries with chhatri lighting are especially popular during that stretch. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "Are chhatri lights included in every package?",
        a: "Yes, every package includes chhatri lights, starting with 8 in Raj Tilak and 10 premium chhatri lights from Rajwada upward.",
      },
      {
        q: "How much do chhatri lights for baraat cost?",
        a: "They're included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Do chhatri lights work well for a daytime entry too?",
        a: "They're most visually striking in the evening, though they're included as part of the package regardless of timing.",
      },
      {
        q: "How many chhatri lights come with the higher packages?",
        a: "Rajwada, Maharaja, and Signature all include 10 premium chhatri lights.",
      },
      {
        q: "How early should I book for an evening entry with chhatri lighting?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since evening entries are especially popular.",
      },
      {
        q: "Are chhatri lights carried by attendants or mounted on the truck?",
        a: "They're set up around the procession as part of the overall lighting production, coordinated by our team.",
      },
      {
        q: "Can chhatri lights be combined with LED effects?",
        a: "Yes, Maharaja and Signature combine premium chhatri lights with moving LED panels and custom name lighting for a fuller visual production.",
      },
      {
        q: "Is the traditional look still popular for modern baraats?",
        a: "Yes, many families combine the classic chhatri look with modern elements like the DJ truck for a blend of tradition and production.",
      },
    ],
  },

  "chhatri-lights-rental-wedding": {
    slug: "chhatri-lights-rental-wedding",
    intro:
      "Chhatri lights rental for wedding baraats is included as standard in every PlanMyBaraat package, rather than a separate rental you'd need to arrange on your own.\n\nThe lights come as part of the full entry, alongside the DJ truck, dhol team, vintage car, and safa team.",
    explanation:
      "Rather than renting chhatri lights separately and coordinating attendants to carry or set them up, our packages bundle the lighting into the overall production, managed by our team alongside the truck and dhol. This removes one more piece of coordination from your wedding day.\n\nThe number and quality of chhatri lights scale with the package tier — 8 lights in Raj Tilak, and 10 premium chhatri lights from Rajwada upward.",
    whatsIncluded:
      "Raj Tilak includes 8 chhatri lights. Rajwada, Maharaja, and Signature all include 10 premium chhatri lights, alongside the truck, DJ, dhol team, vintage car, and safa team.",
    pricingGuidance:
      "There's no separate chhatri lights rental price — they're included in every package. Message us on WhatsApp with your date and city for a real quote covering the full entry.",
    bookingNotes:
      "Wedding season runs November to February, and evening entries with chhatri lighting are especially popular during that stretch. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "Can I rent chhatri lights separately from the truck?",
        a: "No, chhatri lights are included as part of every baraat package, managed by our team alongside the truck and dhol, not rented separately.",
      },
      {
        q: "What's the chhatri lights rental price for a wedding?",
        a: "There's no separate rental price — they're included in every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "How many lights come with each package?",
        a: "Raj Tilak includes 8 chhatri lights, and Rajwada, Maharaja, and Signature all include 10 premium chhatri lights.",
      },
      {
        q: "Does the lighting require extra setup time?",
        a: "It's coordinated as part of our team's overall setup, managed alongside the truck and dhol arrangement.",
      },
      {
        q: "How early should I book for chhatri lighting?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since evening entries are popular.",
      },
      {
        q: "Is the traditional look available with modern effects too?",
        a: "Yes, Maharaja and Signature combine premium chhatri lights with moving LED panels and other modern effects.",
      },
      {
        q: "Do the lights work for a daytime baraat too?",
        a: "They're most visually striking in the evening, though included regardless of timing.",
      },
      {
        q: "Is there a way to see the lighting setup before booking?",
        a: "Yes, message us on WhatsApp and we'll share photos and videos of past setups.",
      },
    ],
  },

  "umbrella-lights-for-wedding": {
    slug: "umbrella-lights-for-wedding",
    intro:
      "Umbrella lights for wedding baraats, also known as chhatri lights, are the traditional canopy-style lights that give a procession its warm, classic evening glow.\n\nPlanMyBaraat includes umbrella lights as standard in every package, starting with 8 in Raj Tilak and 10 premium lights from Rajwada upward.",
    explanation:
      "The umbrella-shaped design creates a soft, festive light pattern that's been part of Indian wedding processions for generations, giving the entry a distinctly traditional and celebratory look. It works especially well combined with the truck and dhol setup for evening entries.\n\nHigher packages upgrade to premium umbrella lights and combine them with modern LED elements, but the classic look remains included at every tier.",
    whatsIncluded:
      "Raj Tilak includes 8 umbrella lights. Rajwada, Maharaja, and Signature all include 10 premium umbrella lights, alongside the truck, DJ, dhol team, vintage car, and safa team.",
    pricingGuidance:
      "Umbrella lights are included in every package, so pricing reflects the overall package tier. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and evening entries with umbrella lighting are especially popular during that stretch. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "Are umbrella lights the same as chhatri lights?",
        a: "Yes, they're the same traditional canopy-style lighting, included in every package starting with 8 in Raj Tilak.",
      },
      {
        q: "How much do umbrella lights for wedding cost?",
        a: "They're included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "How many umbrella lights come with each package tier?",
        a: "Raj Tilak includes 8, and Rajwada, Maharaja, and Signature all include 10 premium umbrella lights.",
      },
      {
        q: "Do umbrella lights work for a daytime entry?",
        a: "They're most visually striking in the evening, though included regardless of timing.",
      },
      {
        q: "How early should I book for umbrella lighting?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since evening entries are popular.",
      },
      {
        q: "Can umbrella lights be combined with modern LED effects?",
        a: "Yes, Maharaja and Signature combine premium umbrella lights with moving LED panels for a fuller visual production.",
      },
      {
        q: "Is this a traditional or modern lighting style?",
        a: "It's traditional, dating back generations in Indian wedding processions, though it pairs well with modern elements like the DJ truck.",
      },
      {
        q: "Can I see photos of the umbrella lighting setup?",
        a: "Yes, message us on WhatsApp and we'll share photos and videos of past setups.",
      },
    ],
  },

  "traditional-light-decoration-wedding": {
    slug: "traditional-light-decoration-wedding",
    intro:
      "Traditional light decoration for wedding baraats centers on chhatri or umbrella-style lighting, giving the procession its classic, warm evening glow — a look that's been part of Indian wedding entries for generations.\n\nPlanMyBaraat includes traditional lighting as standard in every package, starting with 8 chhatri lights in Raj Tilak and 10 premium lights from Rajwada upward.",
    explanation:
      "The traditional lighting style creates a soft, celebratory canopy effect that pairs naturally with the dhol team's live drumming and the overall festive feel of a baraat entry. It's a look that's remained popular even as trucks, DJs, and modern LED elements have become common additions.\n\nOur packages blend this traditional lighting with modern production as you move up the tiers, giving families the choice of keeping the entry mostly traditional or adding contemporary LED visuals on top.",
    whatsIncluded:
      "Raj Tilak includes 8 chhatri lights as the traditional lighting base. Rajwada, Maharaja, and Signature all include 10 premium chhatri lights, with Maharaja and Signature adding modern LED panels on top.",
    pricingGuidance:
      "Traditional light decoration is included in every package. Message us on WhatsApp with your date and city for a real quote covering the full entry.",
    bookingNotes:
      "Wedding season runs November to February, and evening entries with traditional lighting are especially popular during that stretch. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "What does traditional light decoration include?",
        a: "Chhatri or umbrella-style lighting, included in every package starting with 8 lights in Raj Tilak and 10 premium lights from Rajwada upward.",
      },
      {
        q: "How much does traditional light decoration for wedding cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Can I keep the entry purely traditional without modern LED effects?",
        a: "Yes, Raj Tilak and Rajwada focus on the traditional chhatri lighting without the moving LED panels included in higher tiers.",
      },
      {
        q: "Does traditional lighting work for a daytime baraat?",
        a: "It's most visually striking in the evening, though included regardless of timing.",
      },
      {
        q: "How early should I book for traditional lighting?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since evening entries are popular.",
      },
      {
        q: "Can traditional and modern lighting be combined?",
        a: "Yes, Maharaja and Signature combine premium chhatri lights with modern moving LED panels for a blended look.",
      },
      {
        q: "Is traditional lighting still common for modern baraats?",
        a: "Yes, many families keep the classic chhatri look even while adding a modern truck and DJ setup.",
      },
      {
        q: "Can I see examples of the traditional lighting setup?",
        a: "Yes, message us on WhatsApp and we'll share photos and videos of past setups.",
      },
    ],
  },

  "vintage-car-for-baraat": {
    slug: "vintage-car-for-baraat",
    intro:
      "A vintage car for baraat is how the groom typically arrives and joins the wedding procession, adding a classic, elegant element to the entry before the truck, dhol, and dancing crowd take over.\n\nPlanMyBaraat includes a vintage car in every package, from Raj Tilak upward, alongside the DJ truck, dhol team, and safa team.",
    explanation:
      "The vintage car arrival is often one of the first photographed moments of the baraat, giving the groom a dignified, classic entrance before joining the louder, more energetic procession with the truck and dhol. It sets a tone that contrasts nicely with the celebratory chaos that follows.\n\nOur vintage cars are maintained specifically for wedding use, with drivers experienced in coordinating arrival timing with the rest of the procession.",
    whatsIncluded:
      "Every package from Raj Tilak includes a vintage car or baggi for the groom, alongside the DJ truck, sound system, DJ artist, dhol team, and safa team. Signature upgrades this to an American vintage car specifically.",
    pricingGuidance:
      "The vintage car is included in every package, so pricing reflects the overall tier rather than a separate car rental charge. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and vintage car availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the vintage car's available, usually within the hour.",
    faqs: [
      {
        q: "Is a vintage car included in every package?",
        a: "Yes, every package from Raj Tilak includes a vintage car or baggi for the groom, with Signature upgrading to an American vintage car specifically.",
      },
      {
        q: "How much does a vintage car for baraat cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Can I choose the specific vintage car model?",
        a: "Message us with your preferences on WhatsApp and we'll let you know what's available for your date.",
      },
      {
        q: "Does the vintage car come with a driver?",
        a: "Yes, an experienced driver comes with the car, coordinated with the rest of the baraat timing.",
      },
      {
        q: "How early should I book to secure a specific vintage car?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since vintage car availability tightens during peak season.",
      },
      {
        q: "Is the American vintage car only in the Signature package?",
        a: "Yes, Signature specifically upgrades the vehicle to an American vintage car, while other packages include a standard vintage car or baggi.",
      },
      {
        q: "Does the car join the truck procession or arrive separately?",
        a: "The groom typically arrives in the car separately and joins the procession near the entrance, coordinated with the truck's timing.",
      },
      {
        q: "Can I see photos of the vintage cars available?",
        a: "Yes, message us on WhatsApp and we'll share photos of the cars we work with.",
      },
    ],
  },

  "vintage-car-rental-for-wedding": {
    slug: "vintage-car-rental-for-wedding",
    intro:
      "Vintage car rental for wedding baraats with PlanMyBaraat is included as part of the full package, not a standalone rental you'd need to arrange separately alongside the truck and dhol team.\n\nEvery package from Raj Tilak includes a vintage car or baggi for the groom's arrival.",
    explanation:
      "Renting a vintage car on its own would still leave you to coordinate the timing with a separately hired truck and dhol team — potentially three different vendors managing three different schedules. Our approach bundles the car into the same booking as the rest of the baraat, so timing is coordinated by one team.\n\nThe car is maintained specifically for wedding use, and the driver is experienced with baraat timing, joining the procession at the right moment rather than arriving independently.",
    whatsIncluded:
      "Every package from Raj Tilak includes a vintage car or baggi, alongside the DJ truck, sound system, DJ artist, dhol team, and safa team. Signature upgrades this to an American vintage car.",
    pricingGuidance:
      "The vintage car is included in every package, so there's no separate rental price. Message us on WhatsApp with your date and city for a real quote covering the full entry.",
    bookingNotes:
      "Wedding season runs November to February, and vintage car availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the vintage car's available, usually within the hour.",
    faqs: [
      {
        q: "Can I rent a vintage car without the rest of the baraat package?",
        a: "No, the vintage car is included as part of our baraat packages alongside the truck and dhol team, not rented separately.",
      },
      {
        q: "What's the vintage car rental price for a wedding?",
        a: "There's no separate rental price — it's included in every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Is the driver experienced with baraat timing specifically?",
        a: "Yes, our drivers are experienced with coordinating the groom's arrival timing alongside the truck and dhol team.",
      },
      {
        q: "Does every package include the same vintage car?",
        a: "Raj Tilak through Maharaja include a vintage car or baggi, while Signature specifically upgrades to an American vintage car.",
      },
      {
        q: "How early should I book to secure vintage car availability?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
      {
        q: "Can I request a specific car color or model?",
        a: "Message us with your preferences on WhatsApp and we'll let you know what's available for your date.",
      },
      {
        q: "Is the car decorated for the wedding?",
        a: "Yes, the vintage car is styled appropriately for the occasion as part of the package.",
      },
      {
        q: "Does the vintage car join the truck procession together?",
        a: "The groom typically arrives separately and joins the procession near the entrance, coordinated with the truck's timing.",
      },
    ],
  },

  "baggi-for-wedding": {
    slug: "baggi-for-wedding",
    intro:
      "A baggi for wedding baraats is the traditional horse-drawn carriage option for the groom's arrival, offering a classic, regal alternative to a vintage car for families who want that specific look.\n\nPlanMyBaraat includes a vintage car or baggi in every package, from Raj Tilak upward, depending on availability and preference.",
    explanation:
      "The baggi carries a distinctly traditional, royal feel, often associated with classic Rajwada-style wedding processions. It's one of two options — alongside the vintage car — included in our packages for the groom's arrival, and families can discuss which fits their vision better.\n\nBecause a baggi involves a horse and carriage, coordination and route planning matter more than with a car — our team accounts for this when planning your specific procession.",
    whatsIncluded:
      "Every package from Raj Tilak includes a vintage car or baggi option for the groom, alongside the DJ truck, sound system, DJ artist, dhol team, and safa team.",
    pricingGuidance:
      "The baggi option is included as part of the package, so pricing reflects the overall tier. Message us on WhatsApp with your date, city, and preference between car or baggi for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and baggi availability can be more limited than vintage cars, so mention your preference early. 3-4 weeks' notice is a safe bet, longer if possible for a baggi specifically.\n\nShare your date, city, venue, and preference when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and your preference for a baggi, and we'll confirm availability.",
    faqs: [
      {
        q: "Is a baggi included in every package?",
        a: "A vintage car or baggi option is included from Raj Tilak upward — mention your preference and we'll confirm availability for your date.",
      },
      {
        q: "How much does a baggi for wedding cost?",
        a: "It's included as part of the package. Message your date, city, and preference on WhatsApp for a real quote.",
      },
      {
        q: "Is a baggi more traditional than a vintage car?",
        a: "Yes, the horse-drawn baggi carries a distinctly traditional, royal feel often associated with classic Rajwada-style processions.",
      },
      {
        q: "Does a baggi require more route planning than a car?",
        a: "Yes, since it involves a horse and carriage, we account for this specifically when planning your procession route.",
      },
      {
        q: "How early should I request a baggi specifically?",
        a: "As early as possible, ideally 3-4 weeks ahead or more, since baggi availability can be more limited than vintage cars.",
      },
      {
        q: "Can I choose between a car and a baggi?",
        a: "Yes, message us your preference and we'll confirm what's available for your date and location.",
      },
      {
        q: "Is the baggi decorated for the occasion?",
        a: "Yes, it's styled appropriately for the wedding as part of the package.",
      },
      {
        q: "Does the safa team match the baggi's traditional style?",
        a: "The safa team's turban styling for the groom and baraatis complements either option, car or baggi, as part of the overall entry look.",
      },
    ],
  },

  "baggi-rental-for-wedding": {
    slug: "baggi-rental-for-wedding",
    intro:
      "Baggi rental for wedding baraats is included as part of PlanMyBaraat's full package, not a standalone item you'd need to arrange separately from the truck and dhol team.\n\nA baggi is offered as an option alongside the vintage car in every package from Raj Tilak upward.",
    explanation:
      "Rather than renting a horse-drawn carriage independently and coordinating its timing with a separately hired truck and dhol team, our approach bundles the baggi into the same booking, so our team plans the route and timing around it as one coordinated operation.\n\nBecause a baggi involves live horses, our team factors in road conditions, route length, and timing more carefully than with a standard vintage car.",
    whatsIncluded:
      "Every package from Raj Tilak includes the option of a vintage car or baggi for the groom, alongside the DJ truck, sound system, DJ artist, dhol team, and safa team.",
    pricingGuidance:
      "The baggi option is included as part of the package, so there's no separate rental price. Message us on WhatsApp with your date, city, and preference for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and baggi availability can be more limited than vintage cars, so mention your preference as early as possible.\n\nShare your date, city, venue, and preference when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and preference for a baggi, and we'll confirm availability.",
    faqs: [
      {
        q: "Can I rent a baggi without the rest of the baraat package?",
        a: "No, the baggi option is included as part of our baraat packages alongside the truck and dhol team, not rented separately.",
      },
      {
        q: "What's the baggi rental price for a wedding?",
        a: "There's no separate rental price — it's included in the package. Message your date, city, and preference on WhatsApp for a real quote.",
      },
      {
        q: "Does the baggi come with an experienced handler?",
        a: "Yes, an experienced handler accompanies the baggi, coordinated with the rest of the baraat timing.",
      },
      {
        q: "How far in advance should I request a baggi?",
        a: "As early as possible, ideally 3-4 weeks ahead or more, since baggi availability can be more limited than vintage cars.",
      },
      {
        q: "Are there road condition requirements for a baggi?",
        a: "Yes, our team factors in road conditions and route length when planning a baggi-based entry — mention your venue details when booking.",
      },
      {
        q: "Can I switch from a baggi to a vintage car later?",
        a: "Message us as soon as possible if your preference changes, and we'll check what's still available for your date.",
      },
      {
        q: "Is the baggi decorated for the wedding?",
        a: "Yes, it's styled appropriately for the occasion as part of the package.",
      },
      {
        q: "Does the baggi work for all venue types?",
        a: "It works best on roads suitable for horse-drawn transport — mention your venue and we'll advise on suitability.",
      },
    ],
  },

  "horse-for-baraat": {
    slug: "horse-for-baraat",
    intro:
      "A horse for baraat is the classic option for the groom's arrival, offering a traditional, ceremonial entrance often associated with royal wedding processions across India.\n\nPlanMyBaraat can discuss a horse-based arrival alongside our standard vintage car or baggi options — message us if this specifically matters to your entry.",
    explanation:
      "The horse arrival carries deep traditional significance in Indian weddings, and some families specifically want this element as part of their baraat. Our core packages include a vintage car or baggi as the standard option, and we're happy to discuss horse-specific requests separately.\n\nBecause this involves a live animal, careful route planning, timing, and coordination with the rest of the procession matter even more than with a baggi or car.",
    whatsIncluded:
      "Our standard packages include a vintage car or baggi option, alongside the DJ truck, dhol team, and safa team. For horse-specific requests, message us to discuss options and any additional coordination needed.",
    pricingGuidance:
      "Standard package pricing includes the vintage car or baggi option. For a horse-specific request, message us on WhatsApp and we'll advise on what's possible and provide pricing.",
    bookingNotes:
      "Wedding season runs November to February. If a horse arrival matters specifically to you, mention it as early as possible, ideally 3-4 weeks ahead or more, since this requires more planning.\n\nShare your date, city, venue, and specific preference when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and your preference for a horse arrival, and we'll let you know what's possible.",
    faqs: [
      {
        q: "Do you offer a horse for the groom's arrival?",
        a: "Our standard packages include a vintage car or baggi. Message us with your specific interest in a horse arrival and we'll let you know what's possible.",
      },
      {
        q: "How much does a horse for baraat cost?",
        a: "Message us with your specific request on WhatsApp and we'll advise on options and pricing.",
      },
      {
        q: "Is the horse decorated for the wedding?",
        a: "If arranged, the horse would be appropriately styled for the occasion — discuss specifics with us when you reach out.",
      },
      {
        q: "How early should I request this option?",
        a: "As early as possible, ideally 3-4 weeks ahead or more, since a horse arrival requires more careful planning and coordination.",
      },
      {
        q: "Is a baggi a good alternative if a horse isn't available?",
        a: "Yes, our baggi option offers a similar traditional, ceremonial feel and is included as a standard option in our packages.",
      },
      {
        q: "Does a horse arrival require specific venue conditions?",
        a: "Yes, road and venue conditions matter for a horse-based entry — mention your venue details and we'll advise on suitability.",
      },
      {
        q: "Do you handle safety and coordination for a horse arrival?",
        a: "This would need to be discussed and coordinated carefully — message us with your specific request and we'll advise on what's involved.",
      },
      {
        q: "How do I find out if this is available for my date and city?",
        a: "Message us on WhatsApp with your details, and we'll let you know what's possible.",
      },
    ],
  },

  "horse-carriage-for-wedding": {
    slug: "horse-carriage-for-wedding",
    intro:
      "A horse carriage for wedding, also called a baggi, is the traditional carriage option for the groom's arrival, offering a classic, regal look for the start of the baraat procession.\n\nPlanMyBaraat includes a baggi as an option alongside the vintage car in every package from Raj Tilak upward.",
    explanation:
      "The horse carriage brings a distinctly royal, ceremonial feel to the groom's arrival, often chosen by families who want that classic Rajwada-style look for their entry. It's one of two arrival options included in our packages, alongside the vintage car.\n\nBecause it involves live horses, we factor in road conditions and route planning more carefully than with a standard car, and we recommend mentioning your preference early so we can plan accordingly.",
    whatsIncluded:
      "Every package from Raj Tilak includes the option of a vintage car or horse carriage (baggi) for the groom, alongside the DJ truck, sound system, DJ artist, dhol team, and safa team.",
    pricingGuidance:
      "The horse carriage option is included as part of the package. Message us on WhatsApp with your date, city, and preference for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and horse carriage availability can be more limited than vintage cars, so mention your preference as early as possible.\n\nShare your date, city, venue, and preference when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and preference for a horse carriage, and we'll confirm availability.",
    faqs: [
      {
        q: "Is a horse carriage the same as a baggi?",
        a: "Yes, baggi is the term we use for the traditional horse-drawn carriage option included in our packages.",
      },
      {
        q: "How much does a horse carriage for wedding cost?",
        a: "It's included as part of the package. Message your date, city, and preference on WhatsApp for a real quote.",
      },
      {
        q: "Is the horse carriage more traditional than a car?",
        a: "Yes, it carries a distinctly royal, ceremonial feel often associated with classic Rajwada-style processions.",
      },
      {
        q: "How early should I request a horse carriage specifically?",
        a: "As early as possible, ideally 3-4 weeks ahead or more, since availability can be more limited than vintage cars.",
      },
      {
        q: "Does the carriage require specific road conditions?",
        a: "Yes, we factor in road conditions and route length when planning a carriage-based entry — mention your venue details when booking.",
      },
      {
        q: "Is an experienced handler included?",
        a: "Yes, an experienced handler accompanies the carriage, coordinated with the rest of the baraat timing.",
      },
      {
        q: "Can I switch between a carriage and a vintage car?",
        a: "Message us as soon as possible if your preference changes, and we'll check availability for your date.",
      },
      {
        q: "Is the carriage decorated for the occasion?",
        a: "Yes, it's styled appropriately for the wedding as part of the package.",
      },
    ],
  },

  "ghodi-for-baraat": {
    slug: "ghodi-for-baraat",
    intro:
      "Ghodi for baraat refers to the traditional mare used for the groom's ceremonial arrival, a well-known custom in many Indian wedding traditions, especially in North Indian-style baraats.\n\nPlanMyBaraat's standard packages include a vintage car or baggi. Message us if a ghodi specifically matters to your entry, and we'll discuss what's possible.",
    explanation:
      "The ghodi tradition carries deep cultural significance, with the groom riding to the venue on a decorated mare as part of the ceremonial procession. Our core packages focus on the vintage car or baggi option, and we're happy to discuss a ghodi-specific request separately from our standard offering.\n\nBecause this involves a live animal and specific ceremonial customs, coordination and timing require more careful planning than our standard vehicle options.",
    whatsIncluded:
      "Our standard packages include a vintage car or baggi option, alongside the DJ truck, dhol team, and safa team. For ghodi-specific requests, message us to discuss options.",
    pricingGuidance:
      "Standard package pricing includes the vintage car or baggi option. For a ghodi-specific request, message us on WhatsApp and we'll advise on what's possible and provide pricing.",
    bookingNotes:
      "Wedding season runs November to February. If a ghodi matters specifically to you, mention it as early as possible, ideally 3-4 weeks ahead or more, given the additional planning involved.\n\nShare your date, city, venue, and specific preference when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and your preference for a ghodi, and we'll let you know what's possible.",
    faqs: [
      {
        q: "Do you offer a ghodi for the groom's arrival?",
        a: "Our standard packages include a vintage car or baggi. Message us with your specific interest in a ghodi and we'll let you know what's possible.",
      },
      {
        q: "How much does a ghodi for baraat cost?",
        a: "Message us with your specific request on WhatsApp and we'll advise on options and pricing.",
      },
      {
        q: "Is the ghodi tradition specific to certain regions?",
        a: "It's especially common in North Indian-style baraats, though families across regions sometimes choose to include it.",
      },
      {
        q: "How early should I request this option?",
        a: "As early as possible, ideally 3-4 weeks ahead or more, since a ghodi arrival requires more careful planning.",
      },
      {
        q: "Is a baggi a good alternative if a ghodi isn't available?",
        a: "Yes, our baggi option offers a similar traditional feel and is included as a standard option in our packages.",
      },
      {
        q: "Does the ghodi come decorated?",
        a: "If arranged, the mare would be appropriately decorated for the occasion — discuss specifics with us when you reach out.",
      },
      {
        q: "Do you handle the safety and coordination for a ghodi entry?",
        a: "This would need to be discussed and coordinated carefully — message us with your specific request and we'll advise on what's involved.",
      },
      {
        q: "How do I find out if this is available for my wedding?",
        a: "Message us on WhatsApp with your details, and we'll let you know what's possible.",
      },
    ],
  },

  "classic-car-for-groom-entry": {
    slug: "classic-car-for-groom-entry",
    intro:
      "A classic car for groom entry gives the wedding procession a stylish, elegant start, before the truck and dhol take over for the main baraat energy.\n\nPlanMyBaraat includes a vintage car in every package from Raj Tilak upward, with Signature specifically upgrading to an American vintage car.",
    explanation:
      "The classic car arrival is often one of the most photographed moments of the day, giving the groom a memorable, dignified entrance. Our cars are maintained specifically for wedding use, and drivers coordinate arrival timing carefully with the rest of the procession.\n\nAs you move up the package tiers, the car options improve, with Signature specifically featuring an American vintage car for the most premium look.",
    whatsIncluded:
      "Raj Tilak through Maharaja include a vintage car or baggi for the groom's arrival. Signature upgrades this specifically to an American vintage car, alongside the truck, dhol team, and safa team.",
    pricingGuidance:
      "The classic car is included in every package, so pricing reflects the overall tier. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and classic car availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the classic car's available, usually within the hour.",
    faqs: [
      {
        q: "Is a classic car included in every package?",
        a: "Yes, every package from Raj Tilak includes a vintage car or baggi, with Signature upgrading specifically to an American vintage car.",
      },
      {
        q: "How much does a classic car for groom entry cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Can I request a specific classic car model?",
        a: "Message us with your preferences on WhatsApp and we'll let you know what's available for your date.",
      },
      {
        q: "Does the classic car come with a driver?",
        a: "Yes, an experienced driver comes with the car, coordinated with the rest of the baraat timing.",
      },
      {
        q: "How early should I book to secure a specific car?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
      {
        q: "Is the American vintage car only available in Signature?",
        a: "Yes, that specific upgrade is included in our top package, while other tiers include a standard vintage car or baggi.",
      },
      {
        q: "Does the car arrive with the truck or separately?",
        a: "The groom typically arrives in the car separately and joins the procession near the entrance, coordinated with the truck's timing.",
      },
      {
        q: "Can I see photos of the classic car options?",
        a: "Yes, message us on WhatsApp and we'll share photos of the cars we work with.",
      },
    ],
  },

  "american-vintage-car-for-wedding": {
    slug: "american-vintage-car-for-wedding",
    intro:
      "An American vintage car for wedding baraats gives the groom's arrival a distinctly premium, classic look, and it's specifically included in PlanMyBaraat's Signature package, our top tier.\n\nThe car comes alongside the DJ truck, 6 dhol, moving LED panels, and a full effects lineup in Signature's complete production.",
    explanation:
      "American vintage cars have a particular styling and presence that stands out from more common vintage car options, making them a popular choice for families wanting the most premium look for the groom's arrival. It's specifically featured in Signature to match the top package's overall production level.\n\nThe car is maintained specifically for wedding use, with an experienced driver coordinating arrival timing with the truck and dhol team.",
    whatsIncluded:
      "Signature includes the American vintage car alongside the DJ truck, sound system, DJ artist, 6 dhol, moving LED panels, custom name lighting, pyro and confetti effects, a security team, and a safa team.",
    pricingGuidance:
      "The American vintage car is included specifically in the Signature package. Message us on WhatsApp with your date and city for a real quote covering the full production.",
    bookingNotes:
      "Wedding season runs November to February, and Signature package (including the American vintage car) availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm the Signature package with the American vintage car.",
    faqs: [
      {
        q: "Which package includes the American vintage car?",
        a: "Signature, our top package, specifically features the American vintage car alongside its full production lineup.",
      },
      {
        q: "How much does an American vintage car for wedding cost?",
        a: "It's included as part of the Signature package. Message your date and city on WhatsApp for a real quote covering the full production.",
      },
      {
        q: "Is the American vintage car different from the standard vintage car?",
        a: "Yes, it has a distinctly premium styling and presence, specifically chosen for our top-tier package.",
      },
      {
        q: "Can I upgrade to just the American vintage car without the full Signature package?",
        a: "The car is included as part of the Signature package's complete production. Message us with your specific interest and we'll advise on options.",
      },
      {
        q: "How early should I book for the Signature package?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since this popular top-tier package books out fast.",
      },
      {
        q: "Does the car come with a professional driver?",
        a: "Yes, an experienced driver coordinates the car's timing with the rest of the Signature package production.",
      },
      {
        q: "Can I see photos of the American vintage car?",
        a: "Yes, message us on WhatsApp and we'll share photos of the specific vehicle for your reference.",
      },
      {
        q: "What else comes with the Signature package?",
        a: "6 dhol, moving LED panels, custom name lighting, pyro and confetti effects, a security team, and a safa team, alongside the American vintage car.",
      },
    ],
  },

  "imported-vintage-car-rental-india": {
    slug: "imported-vintage-car-rental-india",
    intro:
      "Imported vintage car rental in India for wedding baraats usually points toward premium options like American vintage cars — a style PlanMyBaraat includes specifically in our Signature package.\n\nWe operate across Gujarat, so if you're searching more broadly for India-wide options, message us to confirm coverage in your city.",
    explanation:
      "Imported vintage cars carry a distinct look and presence compared to locally sourced vintage options, which is why they're specifically featured in our top-tier Signature package rather than the standard vehicle offering. The car comes as part of a full baraat entry, not a standalone rental.\n\nBecause imported vehicles require more specialized maintenance and availability planning, we recommend booking well in advance if this specific option matters to your entry.",
    whatsIncluded:
      "Signature includes the American vintage car alongside the DJ truck, sound system, DJ artist, 6 dhol, moving LED panels, custom name lighting, pyro and confetti effects, a security team, and a safa team.",
    pricingGuidance:
      "The imported vintage car is included as part of the Signature package. Message us on WhatsApp with your date and city for a real quote covering the full production.",
    bookingNotes:
      "Wedding season runs November to February, and Signature package availability tightens during that window, especially for the imported car option. 3-4 weeks' notice or more is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm the Signature package with the imported vintage car.",
    faqs: [
      {
        q: "Do you offer imported vintage cars for weddings?",
        a: "Yes, our Signature package specifically features an American vintage car as part of its full production.",
      },
      {
        q: "Which cities in India do you cover?",
        a: "We're Gujarat-based, covering Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts in the state. Message us your city to confirm.",
      },
      {
        q: "How much does imported vintage car rental cost?",
        a: "It's included as part of the Signature package. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is the imported car reliable for wedding-day use?",
        a: "Yes, it's maintained specifically for wedding use with an experienced driver coordinating timing.",
      },
      {
        q: "How early should I book for the imported car option?",
        a: "3-4 weeks ahead or more is a safe window during wedding season (November to February), since this specific option has more limited availability.",
      },
      {
        q: "Can I rent just the imported car without the rest of Signature?",
        a: "The car is included as part of the Signature package's complete production. Message us with your specific interest and we'll advise on options.",
      },
      {
        q: "Can I see photos of the imported vintage car?",
        a: "Yes, message us on WhatsApp and we'll share photos of the specific vehicle.",
      },
      {
        q: "What else does Signature include besides the car?",
        a: "6 dhol, moving LED panels, custom name lighting, pyro and confetti effects, and a security team.",
      },
    ],
  },

  "wedding-car-rental-vintage": {
    slug: "wedding-car-rental-vintage",
    intro:
      "Wedding car rental for a vintage-style groom's arrival is included as part of PlanMyBaraat's full baraat package, not a separate rental you'd need to coordinate on your own.\n\nEvery package from Raj Tilak upward includes a vintage car or baggi, with Signature specifically featuring an American vintage car.",
    explanation:
      "Rather than sourcing a vintage car rental independently and coordinating its timing with a separately hired truck and dhol team, our approach bundles the car into the same booking as the rest of the baraat entry. This means timing, positioning, and coordination are all handled by one team.\n\nThe car is maintained specifically for wedding use, and our drivers are experienced with baraat-specific timing, joining the procession at the right moment.",
    whatsIncluded:
      "Raj Tilak through Maharaja include a vintage car or baggi. Signature upgrades this to an American vintage car, alongside the truck, DJ, dhol team, and safa team.",
    pricingGuidance:
      "The vintage car is included in every package, so there's no separate rental price. Message us on WhatsApp with your date and city for a real quote covering the full entry.",
    bookingNotes:
      "Wedding season runs November to February, and vintage car availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the vintage car's available, usually within the hour.",
    faqs: [
      {
        q: "Can I rent a vintage car without the rest of the baraat package?",
        a: "No, the vintage car is included as part of our baraat packages alongside the truck and dhol team, not rented separately.",
      },
      {
        q: "What's the vintage car rental price for a wedding?",
        a: "There's no separate rental price — it's included in every package. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Which package includes the premium American vintage car?",
        a: "Signature, our top package, specifically features the American vintage car.",
      },
      {
        q: "Does the car come with a driver?",
        a: "Yes, an experienced driver coordinates the car's timing with the rest of the baraat.",
      },
      {
        q: "How early should I book vintage car availability?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
      {
        q: "Can I request a specific vintage car color or style?",
        a: "Message us with your preferences on WhatsApp and we'll let you know what's available for your date.",
      },
      {
        q: "Is the car decorated for the wedding?",
        a: "Yes, it's styled appropriately for the occasion as part of the package.",
      },
      {
        q: "Does the vintage car join the truck procession together?",
        a: "The groom typically arrives separately and joins the procession near the entrance, coordinated with the truck's timing.",
      },
    ],
  },

  "safa-for-groom": {
    slug: "safa-for-groom",
    intro:
      "A safa for groom is the traditional turban tied specifically for the wedding day, a key part of the groom's look for the baraat entry and ceremony.\n\nPlanMyBaraat includes the My Safa team as part of every package from Raj Tilak upward, styling the groom's turban alongside the rest of the baraati group.",
    explanation:
      "The safa isn't just tied once and left alone — our team arrives early enough to style it properly before the procession begins, making sure it holds up through the dancing, walking, and photos that follow. The style and color can often be coordinated with the groom's outfit for a cohesive look.\n\nBeyond the groom, the My Safa team also styles turbans for the wider baraati group, so the whole procession has a consistent, polished appearance, not just the groom individually.",
    whatsIncluded:
      "Every package from Raj Tilak includes the My Safa team for the groom and baraati group, alongside the DJ truck, sound system, DJ artist, dhol team, and vintage car.",
    pricingGuidance:
      "The safa styling is included in every package, so pricing reflects the overall tier. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and safa team availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the safa team's available, usually within the hour.",
    faqs: [
      {
        q: "Is the safa included in every package?",
        a: "Yes, the My Safa team styles the groom's turban as part of every package from Raj Tilak upward.",
      },
      {
        q: "How much does a safa for groom cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Can the safa color match the groom's outfit?",
        a: "Message us with your outfit details and preferences on WhatsApp and we'll coordinate the styling accordingly.",
      },
      {
        q: "How early does the safa team arrive before the entry?",
        a: "Early enough to style the turban properly before the procession begins — we'll confirm exact timing when planning your entry.",
      },
      {
        q: "Does the safa stay in place through dancing and walking?",
        a: "Yes, it's tied to hold up through the full procession, not just for initial photos.",
      },
      {
        q: "How early should I book for safa styling?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
      {
        q: "Does the safa team style just the groom or others too?",
        a: "The My Safa team styles turbans for the groom and the full baraati group, not just the groom individually.",
      },
      {
        q: "Is the safa styling different for each package tier?",
        a: "The styling itself is consistent — what changes across tiers is the rest of the production, like dhol count and effects.",
      },
    ],
  },

  "safa-team-booking": {
    slug: "safa-team-booking",
    intro:
      "Safa team booking with PlanMyBaraat is included as part of the full baraat package, not a separate service you'd need to arrange on your own alongside the truck and dhol team.\n\nThe My Safa team styles turbans for the groom and baraati group in every package from Raj Tilak upward.",
    explanation:
      "Rather than booking a turban stylist separately and coordinating their arrival time with your other vendors, our approach bundles the safa team into the same booking as the rest of the entry. This means they arrive at the right time, coordinated with the truck and dhol team's schedule.\n\nThe My Safa team works with us regularly, so they're experienced with baraat-day timing and pacing, not hired ad hoc for each event.",
    whatsIncluded:
      "Every package from Raj Tilak includes the My Safa team, alongside the DJ truck, sound system, DJ artist, dhol team, and vintage car.",
    pricingGuidance:
      "Safa team booking is included in every package, so there's no separate booking fee. Message us on WhatsApp with your date and city for a real quote covering the full entry.",
    bookingNotes:
      "Wedding season runs November to February, and safa team availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the safa team's available, usually within the hour.",
    faqs: [
      {
        q: "How do I book the safa team?",
        a: "Message us on WhatsApp with your wedding date, city, venue, and rough guest count. The My Safa team is included as part of every package we confirm.",
      },
      {
        q: "How much does safa team booking cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Can I book just the safa team without the rest of the baraat package?",
        a: "No, the safa team is included as part of our baraat packages alongside the truck and dhol team, not booked separately.",
      },
      {
        q: "Is the safa team experienced with baraat-day timing?",
        a: "Yes, they work with us regularly and coordinate with the rest of the entry's schedule, not hired independently.",
      },
      {
        q: "How early should I book to secure the safa team?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
      {
        q: "Do they style the whole baraati group or just the groom?",
        a: "The My Safa team styles turbans for the groom and the full baraati group, not just the groom individually.",
      },
      {
        q: "Can I request a specific turban style when booking?",
        a: "Message us with your preferences on WhatsApp and we'll coordinate accordingly.",
      },
      {
        q: "Is the safa team part of every package tier?",
        a: "Yes, they're included in every package from Raj Tilak to Signature.",
      },
    ],
  },

  "safa-team-for-wedding": {
    slug: "safa-team-for-wedding",
    intro:
      "A safa team for wedding baraats handles the traditional turban styling for the groom and the wider baraati group, a key visual element of the procession alongside the truck and dhol setup.\n\nPlanMyBaraat's My Safa team is included in every package from Raj Tilak upward.",
    explanation:
      "The safa team's work happens before the procession starts, styling turbans for the groom and as many of the baraati group as needed, so everyone looks polished and coordinated as the entry begins. This is a detail that adds significantly to the overall visual impression of the baraat.\n\nBecause they work with us regularly, the My Safa team is used to coordinating their timing with the truck's arrival and the rest of the entry's schedule, rather than working independently.",
    whatsIncluded:
      "Every package from Raj Tilak includes the My Safa team, alongside the DJ truck, sound system, DJ artist, dhol team, and vintage car.",
    pricingGuidance:
      "The safa team is included in every package, so pricing reflects the overall tier. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and safa team availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the safa team's available, usually within the hour.",
    faqs: [
      {
        q: "Is the safa team included in every package?",
        a: "Yes, the My Safa team is included in every package from Raj Tilak upward, styling turbans for the groom and baraati group.",
      },
      {
        q: "How much does a safa team for wedding cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "How many people can the safa team style?",
        a: "They can style turbans for the groom and a good portion of the baraati group — let us know your guest count and we'll plan accordingly.",
      },
      {
        q: "How early do they arrive before the procession?",
        a: "Early enough to style everyone properly before the entry begins — we'll confirm exact timing when planning your event.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
      {
        q: "Can the turban style be customized?",
        a: "Message us with your preferences on WhatsApp and we'll coordinate the styling accordingly.",
      },
      {
        q: "Does the safa team coordinate with the truck's timing?",
        a: "Yes, they work with us regularly and coordinate their schedule with the rest of the baraat entry.",
      },
      {
        q: "Is this a separate cost from the truck package?",
        a: "No, it's included as part of every package, not a separate line item.",
      },
    ],
  },

  "turban-stylist-for-wedding": {
    slug: "turban-stylist-for-wedding",
    intro:
      "A turban stylist for wedding baraats is a skilled artist who ties the traditional safa or pagdi for the groom and baraati group, a detail that adds significantly to the overall look of the procession.\n\nPlanMyBaraat's My Safa team of experienced turban stylists is included in every package from Raj Tilak upward.",
    explanation:
      "Tying a turban properly is a specific skill — it needs to look sharp for photos while also holding up through hours of dancing, walking, and celebration. Our stylists are experienced specifically with baraat-day styling, not just event-day quick fixes.\n\nThey arrive early enough to style the groom and as much of the baraati group as needed before the procession begins, working alongside the rest of our team's coordinated schedule.",
    whatsIncluded:
      "Every package from Raj Tilak includes our turban stylist team, alongside the DJ truck, sound system, DJ artist, dhol team, and vintage car.",
    pricingGuidance:
      "The turban stylist service is included in every package, so pricing reflects the overall tier. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and stylist team availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the turban stylist team's available, usually within the hour.",
    faqs: [
      {
        q: "Is a turban stylist included in every package?",
        a: "Yes, our My Safa team of turban stylists is included in every package from Raj Tilak upward.",
      },
      {
        q: "How much does a turban stylist for wedding cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Does the turban hold up through dancing and walking?",
        a: "Yes, it's styled to last through the full procession, not just for initial photos.",
      },
      {
        q: "How many people can the stylist team handle?",
        a: "They can style the groom and a good portion of the baraati group — let us know your guest count and we'll plan accordingly.",
      },
      {
        q: "How early should I book a turban stylist?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
      {
        q: "Can I request a specific turban color or style?",
        a: "Message us with your preferences on WhatsApp and we'll coordinate the styling accordingly.",
      },
      {
        q: "Is the stylist experienced with baraat-specific timing?",
        a: "Yes, they work with us regularly and coordinate their arrival with the rest of the entry's schedule.",
      },
      {
        q: "Does the stylist charge separately from the truck package?",
        a: "No, it's included as part of every package, not a separate charge.",
      },
    ],
  },

  "turban-tying-service-wedding": {
    slug: "turban-tying-service-wedding",
    intro:
      "Turban tying service for wedding baraats covers the traditional safa or pagdi styling for the groom and baraati group, a detail included in every PlanMyBaraat package from Raj Tilak upward.\n\nThe service comes bundled with the DJ truck, dhol team, and vintage car, not as a standalone booking.",
    explanation:
      "Proper turban tying requires skill and experience specific to the style being used — different fabrics, colors, and shapes each tie differently, and the result needs to look sharp while holding up through hours of dancing and walking. Our team is experienced specifically with baraat-day requirements.\n\nBecause it's bundled with the rest of the entry, the turban tying service is coordinated with the truck and dhol team's timing rather than scheduled independently.",
    whatsIncluded:
      "Every package from Raj Tilak includes turban tying service for the groom and baraati group, alongside the DJ truck, sound system, DJ artist, dhol team, and vintage car.",
    pricingGuidance:
      "Turban tying is included in every package, so there's no separate service charge. Message us on WhatsApp with your date and city for a real quote covering the full entry.",
    bookingNotes:
      "Wedding season runs November to February, and demand for the full turban and baraat package tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the service's available, usually within the hour.",
    faqs: [
      {
        q: "Is turban tying service included with every package?",
        a: "Yes, it's included in every package from Raj Tilak upward, styling the groom and baraati group before the procession.",
      },
      {
        q: "How much does turban tying service for wedding cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Can I book just the turban tying service alone?",
        a: "No, it's included as part of our baraat packages alongside the truck and dhol team, not booked separately.",
      },
      {
        q: "How long does the tying process take?",
        a: "It varies based on how many people need styling — we arrive early enough to have everyone ready before the procession starts.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
      {
        q: "Does the service include fabric or just the tying itself?",
        a: "Message us with your specific needs on WhatsApp — we can discuss whether you're providing fabric or need it sourced.",
      },
      {
        q: "Is the turban style customizable?",
        a: "Yes, message us with your preferences and we'll coordinate the styling accordingly.",
      },
      {
        q: "Does this service work for large baraati groups?",
        a: "Yes, let us know your guest count and we'll plan the timing to accommodate everyone before the entry begins.",
      },
    ],
  },

  "pagdi-rental-for-wedding": {
    slug: "pagdi-rental-for-wedding",
    intro:
      "Pagdi rental for wedding baraats means sourcing and tying the traditional turban fabric for the groom and baraati group — a service included as part of PlanMyBaraat's packages rather than a separate rental.\n\nEvery package from Raj Tilak upward includes our My Safa team, who handle both the pagdi and its styling.",
    explanation:
      "Rather than sourcing pagdi fabric independently and finding someone to tie it separately, our approach bundles this into the package, so the fabric, styling, and timing are all coordinated by our team. This removes another piece of coordination from your wedding planning.\n\nOur stylists are experienced with different pagdi styles and can coordinate colors and patterns with the groom's outfit and the overall wedding theme.",
    whatsIncluded:
      "Every package from Raj Tilak includes pagdi styling by the My Safa team, alongside the DJ truck, sound system, DJ artist, dhol team, and vintage car.",
    pricingGuidance:
      "Pagdi rental and styling is included in every package, so there's no separate rental price. Message us on WhatsApp with your date and city for a real quote covering the full entry.",
    bookingNotes:
      "Wedding season runs November to February. If you have specific color or style preferences, mention them early — 3-4 weeks' notice gives us time to plan the details.\n\nShare your date, city, venue, and any style preferences when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and any pagdi style preferences, and we'll confirm availability.",
    faqs: [
      {
        q: "Is pagdi fabric included or do I need to provide it?",
        a: "Message us with your specific needs on WhatsApp — we can discuss whether you're providing fabric or need it sourced as part of the styling.",
      },
      {
        q: "How much does pagdi rental for wedding cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Can the pagdi color match my wedding theme?",
        a: "Yes, message us with your color scheme and we'll coordinate accordingly.",
      },
      {
        q: "Is the styling included, not just the fabric?",
        a: "Yes, our My Safa team handles both sourcing and tying as part of the package.",
      },
      {
        q: "How early should I share style preferences?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we have time to plan the details properly.",
      },
      {
        q: "Can the whole baraati group get matching pagdis?",
        a: "Message us with your guest count and preferences and we'll discuss what's possible for a coordinated group look.",
      },
      {
        q: "Does the pagdi style vary by region or tradition?",
        a: "Yes, and our stylists are experienced with different styles — mention your specific tradition and we'll accommodate accordingly.",
      },
      {
        q: "How early should I book for pagdi styling?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
    ],
  },

  "rajputi-pagdi-rent": {
    slug: "rajputi-pagdi-rent",
    intro:
      "Rajputi pagdi rent for a wedding refers to the distinctive royal Rajasthani-style turban, known for its bold color and structured shape — a popular choice for grooms wanting a specifically regal look.\n\nPlanMyBaraat's My Safa team can style a Rajputi pagdi as part of our packages — message us with your preference and we'll confirm what's available.",
    explanation:
      "The Rajputi pagdi style has a distinct silhouette and color tradition compared to other turban styles, often chosen to match a royal or Rajwada-style wedding theme. Our stylists are experienced with different regional turban styles, including Rajputi, and can discuss what's possible for your specific vision.\n\nThis styling is included as part of our packages alongside the truck, dhol team, and vintage car, coordinated with the rest of your entry's timing.",
    whatsIncluded:
      "Every package from Raj Tilak includes turban styling by the My Safa team, alongside the DJ truck, sound system, DJ artist, dhol team, and vintage car. Mention your preference for the Rajputi style specifically.",
    pricingGuidance:
      "Turban styling is included in every package. Message us on WhatsApp with your date, city, and preference for a Rajputi pagdi, and we'll give you a real quote covering the full entry.",
    bookingNotes:
      "Wedding season runs November to February. If you want a specific Rajputi style, mention it early — 3-4 weeks' notice gives us time to plan the details properly.\n\nShare your date, city, venue, and style preference when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and preference for a Rajputi pagdi, and we'll confirm what's possible.",
    faqs: [
      {
        q: "Can I get a Rajputi-style pagdi for my baraat?",
        a: "Message us with your preference on WhatsApp — our My Safa team is experienced with different regional turban styles including Rajputi.",
      },
      {
        q: "How much does a Rajputi pagdi cost as part of the package?",
        a: "It's included as part of every package. Message your date, city, and style preference on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "What makes Rajputi pagdi different from other turban styles?",
        a: "It has a distinct silhouette and bold color tradition associated with Rajasthani royal styling, often chosen for a specifically regal look.",
      },
      {
        q: "Can the color be customized to match my outfit?",
        a: "Yes, message us with your color preferences and we'll coordinate accordingly.",
      },
      {
        q: "How early should I mention this preference?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we have time to plan the styling properly.",
      },
      {
        q: "Is this style included in every package tier?",
        a: "The turban styling service itself is included in every package — mention the specific Rajputi style and we'll confirm it fits your booking.",
      },
      {
        q: "Does the whole baraati group wear the same style?",
        a: "Message us with your preference for a coordinated group look, and we'll discuss what's possible.",
      },
      {
        q: "How early should I book overall?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window.",
      },
    ],
  },

  "wedding-turban-rental": {
    slug: "wedding-turban-rental",
    intro:
      "Wedding turban rental for a baraat is included as part of PlanMyBaraat's packages, with our My Safa team handling both the fabric and the styling rather than a separate rental you'd arrange on your own.\n\nEvery package from Raj Tilak upward includes this service alongside the truck, dhol team, and vintage car.",
    explanation:
      "Rather than renting a turban independently and finding someone to style it separately, our approach bundles fabric and styling into the package, with our experienced team handling both. This removes another coordination step from your wedding planning.\n\nOur stylists work with different fabrics, colors, and regional styles, and can coordinate the look with the groom's outfit and overall wedding theme.",
    whatsIncluded:
      "Every package from Raj Tilak includes turban rental and styling by the My Safa team, alongside the DJ truck, sound system, DJ artist, dhol team, and vintage car.",
    pricingGuidance:
      "Turban rental and styling is included in every package, so there's no separate rental price. Message us on WhatsApp with your date and city for a real quote covering the full entry.",
    bookingNotes:
      "Wedding season runs November to February. If you have specific style or color preferences, mention them early — 3-4 weeks' notice gives us time to plan the details.\n\nShare your date, city, venue, and preferences when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and any turban preferences, and we'll confirm availability.",
    faqs: [
      {
        q: "Is the turban rental and styling included together?",
        a: "Yes, our My Safa team handles both sourcing and tying as part of every package from Raj Tilak upward.",
      },
      {
        q: "How much does wedding turban rental cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Can I choose the turban color and fabric?",
        a: "Yes, message us with your preferences and we'll coordinate accordingly.",
      },
      {
        q: "Does the rental include styling for the full baraati group?",
        a: "Yes, the My Safa team styles turbans for the groom and the wider baraati group as needed.",
      },
      {
        q: "How early should I share my preferences?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we have time to plan the details properly.",
      },
      {
        q: "Is the turban included at every package tier?",
        a: "Yes, it's included from Raj Tilak through Signature.",
      },
      {
        q: "Does the turban hold up through the whole procession?",
        a: "Yes, it's styled to stay in place through dancing and walking, not just for initial photos.",
      },
      {
        q: "How early should I book overall?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
    ],
  },

  "groom-styling-for-wedding": {
    slug: "groom-styling-for-wedding",
    intro:
      "Groom styling for wedding baraats centers on the turban and overall look for the entry — PlanMyBaraat's My Safa team handles this as part of every package, coordinating the groom's appearance with the vintage car and overall entry aesthetic.\n\nThis styling is included from Raj Tilak upward, alongside the DJ truck, dhol team, and vintage car.",
    explanation:
      "Groom styling for the baraat specifically focuses on the turban and how it complements the rest of the entry — the vintage car, the outfit, and the overall visual impression as the groom joins the procession. Our stylists coordinate this with your specific outfit and preferences.\n\nBecause the styling happens before the procession begins, timing is coordinated with the rest of the entry's schedule, ensuring the groom is ready right when the truck and dhol team arrive.",
    whatsIncluded:
      "Every package from Raj Tilak includes groom turban styling by the My Safa team, alongside the DJ truck, sound system, DJ artist, dhol team, and vintage car.",
    pricingGuidance:
      "Groom styling is included in every package, so pricing reflects the overall tier. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February. If you have specific styling preferences, mention them early — 3-4 weeks' notice gives us time to plan the details.\n\nShare your date, city, venue, and any styling preferences when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and any styling preferences, and we'll confirm availability.",
    faqs: [
      {
        q: "What does groom styling for the baraat include?",
        a: "Primarily turban styling by our My Safa team, coordinated with the groom's outfit and the overall look of the entry.",
      },
      {
        q: "How much does groom styling for wedding cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Can the styling match my outfit color and theme?",
        a: "Yes, message us with your outfit details and we'll coordinate the turban styling accordingly.",
      },
      {
        q: "When does the styling happen relative to the procession?",
        a: "Before the entry begins, timed so the groom is ready right when the truck and dhol team arrive.",
      },
      {
        q: "How early should I discuss styling preferences?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we have time to plan the details properly.",
      },
      {
        q: "Is styling included at every package tier?",
        a: "Yes, it's included from Raj Tilak through Signature.",
      },
      {
        q: "Does the groom's styling coordinate with the baraati group's look?",
        a: "Yes, the My Safa team can style the wider group too, for a coordinated overall appearance.",
      },
      {
        q: "How early should I book overall?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
    ],
  },

  "groom-safa-near-me": {
    slug: "groom-safa-near-me",
    intro:
      "Searching for groom safa near me means finding a local turban stylist for the baraat, one who knows the timing and pacing your specific city and venue require.\n\nPlanMyBaraat's My Safa team works across Gujarat regularly, included in every package from Raj Tilak upward.",
    explanation:
      "Being local matters for safa styling specifically because our team needs to coordinate arrival timing with the truck, dhol team, and your venue's schedule — something that's easier when the stylists work across your region regularly rather than being flown in for a single event.\n\nWe cover Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most cities and towns across Gujarat, so message us your city to confirm coverage near you.",
    whatsIncluded:
      "Every package from Raj Tilak includes the My Safa team, alongside the DJ truck, sound system, DJ artist, dhol team, and vintage car.",
    pricingGuidance:
      "Safa styling is included in every package, and pricing is confirmed once we know your city and date. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and local safa team availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your city, date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your city and wedding date, and we'll confirm the safa team's available near you, usually within the hour.",
    faqs: [
      {
        q: "Do you offer safa styling near my city?",
        a: "We cover Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat. Message us your city to confirm.",
      },
      {
        q: "How much does groom safa near me cost?",
        a: "It's included as part of every package. Message your date and city on WhatsApp for a real quote covering the full entry.",
      },
      {
        q: "Is the stylist team familiar with my local venue?",
        a: "Our team works across Gujarat regularly, so they're experienced with typical venue setups and timing in most areas we cover.",
      },
      {
        q: "How early should I book a local safa team?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since local availability tightens during peak season.",
      },
      {
        q: "Does being local mean faster response times?",
        a: "Being Gujarat-based helps us plan logistics efficiently and respond quickly to your inquiries.",
      },
      {
        q: "How do I confirm coverage for my specific area?",
        a: "Message us your exact city and venue on WhatsApp and we'll confirm the safa team's availability directly.",
      },
      {
        q: "Can I request a specific stylist if I've seen their work before?",
        a: "Message us with details and we'll let you know if that's possible for your date.",
      },
      {
        q: "What cities do you cover for safa styling?",
        a: "Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat.",
      },
    ],
  },

  "bouncers-for-wedding": {
    slug: "bouncers-for-wedding",
    intro:
      "Bouncers for wedding baraats help manage the crowd around the truck and dancing procession, especially useful for larger guest lists or venues with tighter access points.\n\nPlanMyBaraat includes 4 professional bouncers as part of our Signature package, our most complete production tier.",
    explanation:
      "As a baraat grows in scale — more guests, bigger production, effects like pyro and confetti — having trained security helps keep the crowd safely positioned around the truck and any effects happening. This is why we specifically include bouncers in Signature, our top-tier package built for bigger, more elaborate entries.\n\nOur bouncers are trained and professional, focused on smooth crowd management rather than a heavy-handed presence, so the celebratory feel of the entry isn't disrupted.",
    whatsIncluded:
      "Signature includes 4 professional bouncers alongside the DJ truck, 6 dhol, moving LED panels, custom name lighting, pyro and confetti effects, an American vintage car, and a safa team.",
    pricingGuidance:
      "Bouncers are included specifically as part of the Signature package. Message us on WhatsApp with your date and city for a real quote covering the full production.",
    bookingNotes:
      "Wedding season runs November to February, and Signature package availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm the Signature package with bouncers for your entry.",
    faqs: [
      {
        q: "Which package includes bouncers?",
        a: "Signature, our top package, includes 4 professional bouncers as part of its full production.",
      },
      {
        q: "How much do bouncers for wedding cost?",
        a: "They're included as part of the Signature package. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Why are bouncers included with the top package specifically?",
        a: "Signature is built for bigger, more elaborate entries, and having trained security helps manage the crowd around the truck and any effects like pyro or confetti.",
      },
      {
        q: "Are the bouncers trained specifically for wedding events?",
        a: "Yes, they're professional and focused on smooth crowd management, keeping the celebratory feel of the entry intact.",
      },
      {
        q: "How early should I book for the Signature package?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since this package is popular during peak season.",
      },
      {
        q: "Can I add bouncers to a lower-tier package?",
        a: "Message us with your specific needs on WhatsApp and we'll let you know what's possible.",
      },
      {
        q: "Do bouncers help with pyro and confetti effect safety?",
        a: "Yes, they help manage crowd positioning around effects for a safer, smoother experience.",
      },
      {
        q: "How many bouncers come with the Signature package?",
        a: "4 professional bouncers are included as part of Signature's full production.",
      },
    ],
  },

  "professional-bouncers-for-wedding": {
    slug: "professional-bouncers-for-wedding",
    intro:
      "Professional bouncers for wedding baraats add trained crowd management to a bigger, more elaborate entry, especially useful when effects like pyro and confetti are part of the production.\n\nPlanMyBaraat includes 4 professional bouncers as part of our Signature package.",
    explanation:
      "Being \"professional\" matters here — these aren't generic security hired last minute, but trained personnel experienced with wedding events specifically, focused on smooth, respectful crowd management rather than a disruptive presence.\n\nThey work alongside the rest of the Signature package's production, helping position the crowd safely around the truck and any effects timed to the entry's key moments.",
    whatsIncluded:
      "Signature includes 4 professional bouncers alongside the DJ truck, 6 dhol, moving LED panels, custom name lighting, pyro and confetti effects, an American vintage car, and a safa team.",
    pricingGuidance:
      "Professional bouncers are included specifically as part of the Signature package. Message us on WhatsApp with your date and city for a real quote covering the full production.",
    bookingNotes:
      "Wedding season runs November to February, and Signature package availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm the Signature package with professional bouncers.",
    faqs: [
      {
        q: "What makes the bouncers 'professional'?",
        a: "They're trained personnel experienced with wedding events specifically, focused on smooth, respectful crowd management.",
      },
      {
        q: "How much do professional bouncers for wedding cost?",
        a: "They're included as part of the Signature package. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Do the bouncers interfere with the celebratory feel of the entry?",
        a: "No, they're focused on smooth crowd management without disrupting the celebration.",
      },
      {
        q: "Is this included at every package tier?",
        a: "No, professional bouncers are specific to the Signature package, our top-tier production.",
      },
      {
        q: "How early should I book?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since Signature is popular during peak season.",
      },
      {
        q: "Do bouncers help manage effects like pyro and confetti?",
        a: "Yes, they help position the crowd safely around effects timed to the entry's key moments.",
      },
      {
        q: "How many bouncers are typically provided?",
        a: "Signature includes 4 professional bouncers as part of its full production.",
      },
      {
        q: "What else comes with Signature besides bouncers?",
        a: "6 dhol, moving LED panels, custom name lighting, pyro and confetti effects, and an American vintage car.",
      },
    ],
  },

  "security-guards-for-wedding-event": {
    slug: "security-guards-for-wedding-event",
    intro:
      "Security guards for wedding events help manage crowd flow and safety around a larger baraat entry, especially one with effects and a bigger production, like PlanMyBaraat's Signature package.\n\nSignature includes 4 professional bouncers as part of its complete production tier.",
    explanation:
      "For a bigger baraat entry — more guests, more production, effects timed to specific moments — having dedicated security helps keep everything running smoothly and safely. This is why bouncers are specifically part of our top-tier package rather than a universal add-on.\n\nThey coordinate with the rest of our team, positioning themselves around the truck and any effects to help manage crowd flow without disrupting the celebration.",
    whatsIncluded:
      "Signature includes 4 professional bouncers alongside the DJ truck, 6 dhol, moving LED panels, custom name lighting, pyro and confetti effects, an American vintage car, and a safa team.",
    pricingGuidance:
      "Security guards are included specifically as part of the Signature package. Message us on WhatsApp with your date and city for a real quote covering the full production.",
    bookingNotes:
      "Wedding season runs November to February, and Signature package availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm the Signature package with security included.",
    faqs: [
      {
        q: "Do you provide security guards for wedding events?",
        a: "Signature, our top package, includes 4 professional bouncers as part of its full production.",
      },
      {
        q: "How much do security guards for wedding event cost?",
        a: "They're included as part of the Signature package. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Why is security needed for a baraat specifically?",
        a: "For bigger entries with more guests and effects like pyro and confetti, dedicated security helps manage crowd flow and safety around key moments.",
      },
      {
        q: "Is security included at lower package tiers?",
        a: "No, it's specific to the Signature package, our top-tier production.",
      },
      {
        q: "How early should I book Signature for the security inclusion?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window.",
      },
      {
        q: "Do the guards manage venue entry too?",
        a: "Their focus is on the baraat procession and crowd positioning around the truck and effects — discuss any additional venue needs with us directly.",
      },
      {
        q: "How many security personnel are included?",
        a: "4 professional bouncers are included as part of the Signature package.",
      },
      {
        q: "Can I add security to a smaller package?",
        a: "Message us with your specific needs on WhatsApp and we'll let you know what's possible.",
      },
    ],
  },

  "crowd-control-security-wedding": {
    slug: "crowd-control-security-wedding",
    intro:
      "Crowd control security for wedding baraats helps manage guest positioning around the truck and any effects, especially important for bigger, more elaborate entries.\n\nPlanMyBaraat's Signature package includes 4 professional bouncers specifically for this purpose.",
    explanation:
      "A large baraati group dancing around a moving truck, combined with effects like pyro and confetti timed to specific moments, benefits from trained crowd control to keep everyone safely positioned. This is a specific need at the scale of our Signature package's production.\n\nOur bouncers work alongside the rest of the team, coordinating positioning without disrupting the flow or energy of the celebration.",
    whatsIncluded:
      "Signature includes 4 professional bouncers alongside the DJ truck, 6 dhol, moving LED panels, custom name lighting, pyro and confetti effects, an American vintage car, and a safa team.",
    pricingGuidance:
      "Crowd control security is included specifically as part of the Signature package. Message us on WhatsApp with your date and city for a real quote covering the full production.",
    bookingNotes:
      "Wedding season runs November to February, and Signature package availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm the Signature package with crowd control security.",
    faqs: [
      {
        q: "Why does a baraat need crowd control security?",
        a: "For bigger entries with a large dancing crowd and effects like pyro and confetti, trained crowd control helps keep everyone safely positioned around the truck.",
      },
      {
        q: "How much does crowd control security for wedding cost?",
        a: "It's included as part of the Signature package. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is this included in every package?",
        a: "No, it's specific to the Signature package, our top-tier production built for bigger entries.",
      },
      {
        q: "Does crowd control affect the celebratory energy of the entry?",
        a: "No, our bouncers coordinate positioning without disrupting the flow or energy of the celebration.",
      },
      {
        q: "How early should I book for Signature?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since this package is popular during peak season.",
      },
      {
        q: "How many security personnel handle crowd control?",
        a: "4 professional bouncers are included as part of the Signature package.",
      },
      {
        q: "Do they help specifically during pyro and confetti moments?",
        a: "Yes, they help position the crowd safely around effects timed to the entry's key moments.",
      },
      {
        q: "What's the full Signature package lineup?",
        a: "The truck, DJ, 6 dhol, moving LED panels, custom name lighting, pyro and confetti effects, an American vintage car, and a safa team, alongside the security team.",
      },
    ],
  },

  "bouncer-hiring-for-wedding-events": {
    slug: "bouncer-hiring-for-wedding-events",
    intro:
      "Bouncer hiring for wedding events is included as part of PlanMyBaraat's Signature package, not a separate service you'd need to arrange independently alongside the truck and dhol team.\n\nSignature includes 4 professional bouncers as part of its complete production.",
    explanation:
      "Rather than hiring security independently and coordinating their positioning around a separately booked truck and effects, our approach bundles bouncers into the Signature package, so they're part of the same coordinated team managing your entry.\n\nThis means they're briefed on the specific timing of effects like pyro and confetti, and positioned accordingly as part of the overall plan, rather than working with limited information about the event.",
    whatsIncluded:
      "Signature includes 4 professional bouncers alongside the DJ truck, 6 dhol, moving LED panels, custom name lighting, pyro and confetti effects, an American vintage car, and a safa team.",
    pricingGuidance:
      "Bouncer hiring is included specifically as part of the Signature package. Message us on WhatsApp with your date and city for a real quote covering the full production.",
    bookingNotes:
      "Wedding season runs November to February, and Signature package availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm the Signature package with bouncers included.",
    faqs: [
      {
        q: "Can I hire bouncers separately from the baraat package?",
        a: "No, bouncers are included as part of the Signature package, coordinated with the rest of our team, not hired independently.",
      },
      {
        q: "What's the bouncer hiring price for wedding events?",
        a: "There's no separate hiring price — it's included in the Signature package. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Are the bouncers briefed on the event's specific timing?",
        a: "Yes, they're part of our coordinated team and briefed on effects like pyro and confetti timing as part of the overall plan.",
      },
      {
        q: "Is this available at lower package tiers?",
        a: "No, it's specific to the Signature package, our top-tier production.",
      },
      {
        q: "How early should I book to include bouncers?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since Signature is popular during peak season.",
      },
      {
        q: "How many bouncers are included?",
        a: "4 professional bouncers are part of the Signature package.",
      },
      {
        q: "Do the bouncers work with the rest of our team on the day?",
        a: "Yes, they're coordinated with the truck, DJ, dhol team, and effects timing as one operation.",
      },
      {
        q: "What's the full Signature package lineup?",
        a: "The truck, DJ, 6 dhol, moving LED panels, custom name lighting, pyro and confetti effects, an American vintage car, and a safa team.",
      },
    ],
  },

  "baraat-cost-india": {
    slug: "baraat-cost-india",
    intro:
      "Baraat cost in India varies widely depending on region, city, and how elaborate the production is — PlanMyBaraat operates specifically across Gujarat, with pricing based on your package tier, dhol count, and any extra effects.\n\nRather than a single national number, we quote based on your actual date, city, and guest count for an accurate price.",
    explanation:
      "Costs for a baraat entry differ significantly across India based on regional traditions, typical production scale, and local vendor pricing. Within Gujarat specifically, our four packages give a clear range — Raj Tilak as the most affordable complete entry, up to Signature's full production with pyro, confetti, and security.\n\nThe base of every package — truck, DJ, dhol, vintage car, and safa team — stays consistent, with the price increasing as you add more dhol players, lighting production, and effects at higher tiers.",
    whatsIncluded:
      "Raj Tilak includes the truck, DJ, 2 dhol, chhatri lights, a vintage car, and a safa team. Rajwada, Maharaja, and Signature add progressively more dhol, LED production, entertainers, effects, and security.",
    pricingGuidance:
      "We don't publish one flat number since costs vary by city, date, and guest count even within Gujarat. Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real price, usually within the hour.",
    bookingNotes:
      "Wedding season runs November to February across Gujarat, and both price and availability tighten during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and guest count when you reach out for an accurate quote.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll send you a real quote, usually within the hour.",
    faqs: [
      {
        q: "What's the average baraat cost in India?",
        a: "It varies significantly by region. Within Gujarat, where we operate, it depends on the package, dhol count, and any extra effects — message your date and city for a real quote.",
      },
      {
        q: "Do you operate across all of India?",
        a: "We're Gujarat-based, covering Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts in the state.",
      },
      {
        q: "Why does baraat cost vary so much by region?",
        a: "Regional traditions, typical production scale, and local vendor pricing all differ significantly across India's states and cities.",
      },
      {
        q: "What's included in the baraat cost within Gujarat specifically?",
        a: "Every package includes the truck, DJ, dhol team, vintage car, and safa team, with pricing increasing at higher tiers for more production.",
      },
      {
        q: "How do I get an accurate baraat cost for my specific wedding?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real quote, usually within the hour.",
      },
      {
        q: "Is the cheapest package still a complete entry?",
        a: "Yes, Raj Tilak includes the truck, DJ, 2 dhol, chhatri lights, car, and safa team — a full entry at our most affordable tier.",
      },
      {
        q: "How early should I book to lock in a price?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since prices and availability both tighten during peak season.",
      },
      {
        q: "Can I compare package prices before deciding?",
        a: "Yes, message us on WhatsApp and we'll walk you through what each package includes and the price difference.",
      },
    ],
  },

  "baraat-setup-price": {
    slug: "baraat-setup-price",
    intro:
      "Baraat setup price depends on the package tier, dhol count, and any extra effects you add — not a single flat number, but a clear range across our four packages.\n\nPlanMyBaraat's baraat setup price always covers the full entry: the truck, dhol team, vintage car, and safa team together.",
    explanation:
      "The base setup — truck, sound system, and DJ artist — is consistent across every package. What moves the price as you go through the tiers is the dhol count (2 to 6), the lighting and LED setup, and extras like an entertainer, pyro effects, confetti cannons, and a security team on Signature, our top package.\n\nBecause the setup price always includes the vintage car and safa team too, it's worth comparing against the full entry cost, not just a bare truck rental quote.",
    whatsIncluded:
      "Raj Tilak includes the truck, DJ artist, 2 dhol, chhatri lights, a vintage car, and a safa team. Rajwada adds 2 more dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature adds a security team plus pyro and confetti effects.",
    pricingGuidance:
      "We don't publish a flat baraat setup price because it depends on your city, date, guest count, and package choice. Raj Tilak is the most affordable way to get a proper setup, and Signature is the most complete.\n\nMessage us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real price, usually within the hour.",
    bookingNotes:
      "Wedding season runs November to February, and both price and truck availability tighten during that window. 3-4 weeks' notice is a safe bet for peak season.\n\nShare your date, city, venue, and guest count when you reach out for an accurate quote.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll send you a real baraat setup price, usually within the hour.",
    faqs: [
      {
        q: "What's the baraat setup price range?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the setup price include just the truck or the full entry?",
        a: "The full entry — truck, dhol team, vintage car, and safa team are all included in every package price.",
      },
      {
        q: "Is Raj Tilak a complete setup or a stripped-down version?",
        a: "It's a complete entry with the truck, DJ, 2 dhol, chhatri lights, car, and safa team — just with less production than the higher tiers.",
      },
      {
        q: "Why is Signature more expensive?",
        a: "It includes 6 dhol, moving LED screens, the groom's name in lights, pyro and confetti effects, and a security team — significantly more production than the starting package.",
      },
      {
        q: "Does the setup price change based on my city?",
        a: "Logistics can vary slightly, which is why we confirm your exact price once we know your date and location.",
      },
      {
        q: "How early should I lock in a setup price?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since prices and availability both tighten during peak season.",
      },
      {
        q: "Can I negotiate the baraat setup price?",
        a: "Message us with your budget and requirements on WhatsApp and we'll recommend the package that fits best.",
      },
      {
        q: "How do I get an exact setup price?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real number, usually within the hour.",
      },
    ],
  },

  "baraat-price-list": {
    slug: "baraat-price-list",
    intro:
      "A baraat price list would ideally show one number per package, but the real price for each tier depends on your city, date, and guest count — so PlanMyBaraat quotes based on your actual details rather than a fixed printed list.\n\nWhat we can share clearly is what's included at each of our four package tiers, so you know exactly what you're comparing.",
    explanation:
      "Raj Tilak, our starting package, includes the truck, DJ, 2 dhol, chhatri lights, a vintage car, and a safa team. Rajwada adds 2 more dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, our top package, adds a security team plus pyro and confetti effects.\n\nRather than a static price list, we recommend messaging us with your specific date and city so the quote reflects your actual event, not a generic range that might not apply to your situation.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, and DJ artist as the base, with dhol count, lighting, entertainers, and effects scaling up from Raj Tilak to Signature.",
    pricingGuidance:
      "We don't publish a fixed baraat price list because your actual quote depends on your city, date, and guest count. Message us on WhatsApp with those details and we'll respond with a real price for each package you're considering.",
    bookingNotes:
      "Wedding season runs November to February, and both price and availability tighten during that window. 3-4 weeks' notice is a safe bet for peak season.\n\nShare your date, city, venue, and guest count when you reach out for an accurate quote across packages.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll send you real prices for each package, usually within the hour.",
    faqs: [
      {
        q: "Do you have a published baraat price list?",
        a: "We don't publish a fixed list since prices depend on your city, date, and guest count. Message us your details and we'll send you real quotes for each package.",
      },
      {
        q: "What packages can I compare pricing across?",
        a: "Raj Tilak, Rajwada, Maharaja, and Signature — each with a clear set of inclusions that build on the last.",
      },
      {
        q: "Why isn't there a fixed price for each package?",
        a: "Because city, date, and guest count all affect the final quote, and we want to give you an accurate number rather than a misleading generic one.",
      },
      {
        q: "Can I get quotes for all four packages at once?",
        a: "Yes, message us your date and city and we'll walk you through pricing for each tier.",
      },
      {
        q: "Is Raj Tilak significantly cheaper than Signature?",
        a: "Yes, Raj Tilak covers the essentials while Signature includes significantly more production — dhol count, LED visuals, effects, and security.",
      },
      {
        q: "How early should I request price comparisons?",
        a: "As early as possible, ideally 3-4 weeks ahead during wedding season (November to February), since prices and availability both tighten during peak season.",
      },
      {
        q: "Does the price list vary by city within Gujarat?",
        a: "Logistics can vary slightly, which is why we confirm exact prices once we know your date and location rather than quoting blind.",
      },
      {
        q: "How do I get real numbers for my wedding?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with real quotes, usually within the hour.",
      },
    ],
  },

  "baraat-starting-price": {
    slug: "baraat-starting-price",
    intro:
      "Baraat starting price refers to our most affordable package, Raj Tilak, which still includes a complete entry: the truck, DJ, dhol team, vintage car, and safa team.\n\nMessage us on WhatsApp with your date and city, and we'll give you the exact starting price for your specific wedding.",
    explanation:
      "Raj Tilak is built to be a genuinely complete baraat entry at our most accessible price point, not a stripped-down version missing key pieces. It includes the truck, sound system, DJ artist, 2 dhol players, chhatri lights, a vintage car, and the safa team's turban styling.\n\nFrom there, Rajwada, Maharaja, and Signature each add more production — more dhol, LED visuals, entertainers, and effects — for families wanting a bigger, more elaborate entry.",
    whatsIncluded:
      "Raj Tilak includes the DJ truck, sound system, DJ artist, 2 dhol, chhatri lights, a vintage car, and a safa team — the complete starting-price entry.",
    pricingGuidance:
      "The starting price reflects Raj Tilak's package cost, which varies slightly by city, date, and guest count. Message us on WhatsApp with your details, and we'll respond with the exact starting price for your event.",
    bookingNotes:
      "Wedding season runs November to February, and even our starting package books out fast during that window. 2-3 weeks' notice is usually enough.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll send you the exact starting price for Raj Tilak, usually within the hour.",
    faqs: [
      {
        q: "What's included in the baraat starting price?",
        a: "Raj Tilak, our starting package, includes the truck, DJ, 2 dhol, chhatri lights, a vintage car, and a safa team — a complete entry.",
      },
      {
        q: "Is the starting price a stripped-down version of the full entry?",
        a: "No, it's a complete baraat entry with all the core pieces, just with less dhol, lighting, and effects than the higher tiers.",
      },
      {
        q: "How much is the exact starting price for my wedding?",
        a: "It varies slightly by city, date, and guest count. Message us on WhatsApp with your details for the exact number.",
      },
      {
        q: "Can I upgrade from the starting package later?",
        a: "Message us if your plans change and we'll see what's possible depending on your date and how far out we are from the event.",
      },
      {
        q: "How early should I book the starting package?",
        a: "2-3 weeks ahead during wedding season (November to February) is usually enough, though earlier is always safer.",
      },
      {
        q: "Is the starting price good value?",
        a: "Yes, it includes the full core entry — truck, DJ, dhol, car, and safa team — without the extra production of higher tiers.",
      },
      {
        q: "Does the starting price include the vintage car?",
        a: "Yes, a vintage car or baggi is included even at the starting price tier.",
      },
      {
        q: "How do I get the exact starting price?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real number, usually within the hour.",
      },
    ],
  },

  "cheapest-baraat-setup": {
    slug: "cheapest-baraat-setup",
    intro:
      "The cheapest baraat setup PlanMyBaraat offers is Raj Tilak, and it's still a complete entry — the truck, DJ, dhol team, vintage car, and safa team, not a partial or stripped-down version.\n\nMessage us on WhatsApp with your date and city, and we'll give you the exact price for the cheapest option that fits your event.",
    explanation:
      "We built Raj Tilak specifically to be a genuinely usable, complete package at our most accessible price point, rather than cutting corners on the core elements. Every family gets the truck, sound system, DJ artist, dhol players, vintage car, and safa team, regardless of which tier they choose.\n\nWhat differs between Raj Tilak and the higher tiers is the amount of extra production — more dhol, LED visuals, entertainers, and effects — not the fundamentals of the entry itself.",
    whatsIncluded:
      "Raj Tilak includes the DJ truck, sound system, DJ artist, 2 dhol, chhatri lights, a vintage car, and a safa team.",
    pricingGuidance:
      "The cheapest setup's exact price varies slightly by city, date, and guest count. Message us on WhatsApp with your details, and we'll respond with the real number for Raj Tilak.",
    bookingNotes:
      "Wedding season runs November to February, and even our cheapest package books out fast during that window. 2-3 weeks' notice is usually enough.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll send you the exact price for the cheapest baraat setup, usually within the hour.",
    faqs: [
      {
        q: "What's the cheapest baraat setup you offer?",
        a: "Raj Tilak, our starting package, includes the truck, DJ, 2 dhol, chhatri lights, a vintage car, and a safa team — a complete entry at our most affordable tier.",
      },
      {
        q: "Is the cheapest setup missing any important elements?",
        a: "No, it includes all the core pieces of a baraat entry — just with less production (fewer dhol, simpler lighting) than the higher tiers.",
      },
      {
        q: "How much is the cheapest baraat setup exactly?",
        a: "It varies slightly by city, date, and guest count. Message us on WhatsApp with your details for the exact number.",
      },
      {
        q: "Is the cheapest option good enough for a proper baraat?",
        a: "Yes, families regularly book Raj Tilak for a solid, complete entry — it's not a lesser version, just a leaner production.",
      },
      {
        q: "How early should I book the cheapest package?",
        a: "2-3 weeks ahead during wedding season (November to February) is usually enough, though earlier is always safer.",
      },
      {
        q: "Does the cheapest setup include a vintage car?",
        a: "Yes, a vintage car or baggi is included even at this tier.",
      },
      {
        q: "Can I add extras to the cheapest setup?",
        a: "Message us with your specific needs on WhatsApp and we'll let you know what's possible.",
      },
      {
        q: "How do I get the exact price?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real number, usually within the hour.",
      },
    ],
  },

  "most-expensive-baraat-setup": {
    slug: "most-expensive-baraat-setup",
    intro:
      "The most expensive baraat setup PlanMyBaraat offers is Signature, our top package, built for families wanting the fullest, most elaborate production for their entry.\n\nMessage us on WhatsApp with your date and city, and we'll give you the exact price for Signature.",
    explanation:
      "Signature includes 6 dhol players, moving LED panels, the groom's name spelled out in custom lettering, pyro highlights, confetti and CO2 effects, a fake money gun, an American vintage car, and 4 professional bouncers for crowd management — the most complete version of everything our other packages offer.\n\nIt's built for larger celebrations where scale and visual production matter, giving the entry a truly grand, memorable feel from start to finish.",
    whatsIncluded:
      "Signature includes the DJ truck, sound system, DJ artist, 6 dhol, moving LED panels, custom name lighting, pyro highlights, confetti CO2 gun, liquid CO2 gun, hand pyro gun, a fake money gun, an American vintage car, 4 professional bouncers, and a safa team.",
    pricingGuidance:
      "Signature's exact price varies by city, date, and guest count. Message us on WhatsApp with your details, and we'll respond with the real number for the full production.",
    bookingNotes:
      "Wedding season runs November to February, and Signature availability tightens during that window since it's a popular top-tier choice. 3-4 weeks' notice or more is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll send you the exact price for the Signature package, usually within the hour.",
    faqs: [
      {
        q: "What's the most expensive baraat setup you offer?",
        a: "Signature, our top package, includes the fullest production: 6 dhol, moving LED panels, custom name lighting, pyro and confetti effects, an American vintage car, and a security team.",
      },
      {
        q: "Is Signature worth the higher price?",
        a: "It depends on how much production and scale you want — Signature is built for families specifically wanting the fullest, most memorable entry.",
      },
      {
        q: "How much does Signature exactly cost?",
        a: "It varies by city, date, and guest count. Message us on WhatsApp with your details for the exact number.",
      },
      {
        q: "What makes Signature the most complete package?",
        a: "It includes the maximum dhol count, full LED and effects lineup, the premium American vintage car, and a dedicated security team, on top of the core truck and DJ.",
      },
      {
        q: "How early should I book Signature?",
        a: "3-4 weeks ahead or more during wedding season (November to February) is a safe window, since it's a popular top-tier choice.",
      },
      {
        q: "Does Signature include a security team?",
        a: "Yes, 4 professional bouncers are part of the Signature package.",
      },
      {
        q: "Is Signature suitable for large guest lists?",
        a: "Yes, it's built for bigger, more elaborate celebrations with the production to match a larger guest count.",
      },
      {
        q: "How do I get the exact price?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real number, usually within the hour.",
      },
    ],
  },

  "baraat-setup-for-budget-wedding": {
    slug: "baraat-setup-for-budget-wedding",
    intro:
      "A baraat setup for budget wedding doesn't have to mean cutting corners — PlanMyBaraat's Raj Tilak package gives you a complete entry: truck, DJ, dhol team, vintage car, and safa team, at our most accessible price point.\n\nMessage us on WhatsApp with your date and city, and we'll help you plan a baraat that fits your budget without missing the essentials.",
    explanation:
      "For families working within a tighter budget, Raj Tilak includes everything a baraat entry genuinely needs — a proper double decker truck, live DJ performance, 2 dhol players, chhatri lighting, a vintage car for the groom, and turban styling for the baraati group.\n\nWe've found that a well-executed Raj Tilak entry often feels just as celebratory as a bigger production, since the core elements — good music, live drumming, and a dignified groom's arrival — are all there.",
    whatsIncluded:
      "Raj Tilak includes the DJ truck, sound system, DJ artist, 2 dhol, chhatri lights, a vintage car, and a safa team — the complete entry at our budget-friendly tier.",
    pricingGuidance:
      "Raj Tilak's exact price varies slightly by city, date, and guest count. Message us on WhatsApp with your details, and we'll respond with the real number for your budget.",
    bookingNotes:
      "Wedding season runs November to February. 2-3 weeks' notice is usually enough for the starting package, though earlier is always safer.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and budget range, and we'll recommend a setup that fits, usually within the hour.",
    faqs: [
      {
        q: "What's the best baraat setup for a budget wedding?",
        a: "Raj Tilak, our starting package, gives you a complete entry — truck, DJ, 2 dhol, chhatri lights, car, and safa team — at our most affordable price point.",
      },
      {
        q: "Does a budget setup feel less celebratory?",
        a: "Not necessarily — the core elements that make a baraat feel celebratory (music, live drumming, the groom's arrival) are all included even at the starting tier.",
      },
      {
        q: "How much does a budget baraat setup cost?",
        a: "It varies slightly by city, date, and guest count. Message us on WhatsApp with your details for the exact number.",
      },
      {
        q: "Can I add small upgrades without jumping to the next tier?",
        a: "Message us with your specific needs and budget, and we'll let you know what's possible.",
      },
      {
        q: "How early should I book for a budget-friendly entry?",
        a: "2-3 weeks ahead during wedding season (November to February) is usually enough for Raj Tilak.",
      },
      {
        q: "Is the vintage car included even in the budget package?",
        a: "Yes, a vintage car or baggi is included in every package, including Raj Tilak.",
      },
      {
        q: "Does a smaller guest list work well with the budget package?",
        a: "Yes, Raj Tilak works especially well for smaller to mid-sized guest lists, and we can advise based on your specific numbers.",
      },
      {
        q: "How do I get a quote that fits my budget?",
        a: "Message us on WhatsApp with your wedding date, city, and budget range, and we'll recommend the right package.",
      },
    ],
  },

  "baraat-setup-for-luxury-wedding": {
    slug: "baraat-setup-for-luxury-wedding",
    intro:
      "A baraat setup for luxury wedding calls for PlanMyBaraat's Maharaja or Signature packages, built with the extra production, dhol count, and effects a bigger, more elaborate celebration deserves.\n\nMessage us on WhatsApp with your date, city, and vision, and we'll recommend the right tier for a luxury entry.",
    explanation:
      "Maharaja steps up with 6 dhol players, moving LED panels, and the groom's name displayed in custom lettering — a strong step above the base tiers. Signature goes further, adding pyro highlights, confetti and CO2 effects, a fake money gun, an American vintage car, and 4 professional bouncers for full crowd management.\n\nThese higher tiers are designed for families who want the entry itself to feel like a major production, matching the scale of a larger, more elaborate wedding celebration.",
    whatsIncluded:
      "Maharaja includes 6 dhol, moving LED panels, custom name lighting, a vintage car, and a safa team. Signature adds pyro, confetti, CO2 effects, a fake money gun, an American vintage car, and 4 professional bouncers.",
    pricingGuidance:
      "Maharaja and Signature pricing varies by city, date, and guest count. Message us on WhatsApp with your details, and we'll respond with real numbers for both tiers.",
    bookingNotes:
      "Wedding season runs November to February, and our higher-tier packages are especially popular during that stretch. 3-4 weeks' notice or more is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll recommend Maharaja or Signature based on your vision, usually within the hour.",
    faqs: [
      {
        q: "Which package is best for a luxury wedding?",
        a: "Maharaja and Signature are built for this — more dhol, LED visuals, entertainers, and (in Signature) effects like pyro and confetti plus a security team.",
      },
      {
        q: "What's the difference between Maharaja and Signature for a luxury entry?",
        a: "Maharaja includes 6 dhol and LED visuals; Signature adds pyro, confetti, CO2 effects, a fake money gun, the American vintage car, and security.",
      },
      {
        q: "How much does a luxury baraat setup cost?",
        a: "It varies by city, date, and guest count. Message us on WhatsApp with your details for real numbers on Maharaja and Signature.",
      },
      {
        q: "Is Signature the most complete luxury option?",
        a: "Yes, it's our top package with the fullest production lineup available.",
      },
      {
        q: "How early should I book for a luxury entry?",
        a: "3-4 weeks ahead or more during wedding season (November to February) is a safe window, since these packages are popular.",
      },
      {
        q: "Does a luxury setup include a premium vintage car?",
        a: "Yes, Signature specifically includes an American vintage car for a more premium look.",
      },
      {
        q: "Is security included with the luxury package?",
        a: "Yes, Signature includes 4 professional bouncers as part of its full production.",
      },
      {
        q: "How do I plan a luxury entry for my wedding?",
        a: "Message us on WhatsApp with your date, city, and vision, and we'll recommend the right package and give you a real quote.",
      },
    ],
  },

  "baraat-budget-planning-guide": {
    slug: "baraat-budget-planning-guide",
    intro:
      "A baraat budget planning guide starts with knowing what drives cost — package tier, dhol count, and any extra effects — so you can decide where to spend and where to keep things simple.\n\nPlanMyBaraat's four packages give you a clear structure to plan against, from Raj Tilak's essentials to Signature's full production.",
    explanation:
      "Start by deciding on your priorities: if a strong, reliable entry matters most, Raj Tilak covers the truck, DJ, dhol, car, and safa team at our most affordable tier. If visual production matters more — LED visuals, custom lighting, entertainers — Maharaja is worth considering. If you want the fullest, most memorable production with effects and security, Signature is built for that.\n\nGuest count also matters for planning — a larger crowd often benefits from more dhol players and a stronger sound system, which naturally points toward the higher tiers.",
    whatsIncluded:
      "Raj Tilak covers the essentials. Rajwada adds more dhol and an entertainer. Maharaja brings LED visuals and custom lettering. Signature adds pyro, confetti, and security for the most complete production.",
    pricingGuidance:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll walk you through real pricing for each package so you can plan your budget with actual numbers.",
    bookingNotes:
      "Wedding season runs November to February. Planning your budget early — ideally 3-4 weeks ahead — gives you time to compare packages without rushing a decision.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll help you plan a baraat budget that fits your priorities.",
    faqs: [
      {
        q: "How do I start planning my baraat budget?",
        a: "Decide what matters most — a solid, reliable entry (Raj Tilak), visual production (Maharaja), or the fullest experience (Signature) — then message us for real pricing on that tier.",
      },
      {
        q: "What drives the cost of a baraat setup?",
        a: "Package tier, dhol count, and any extra effects like pyro or confetti are the main cost drivers.",
      },
      {
        q: "Should guest count affect my budget planning?",
        a: "Yes, a larger crowd often benefits from more dhol players and a stronger sound system, which points toward the higher tiers.",
      },
      {
        q: "Is it better to start with the cheapest package and add on?",
        a: "It's usually clearer to pick the package tier that matches your priorities from the start — message us and we'll help you decide.",
      },
      {
        q: "How early should I plan my baraat budget?",
        a: "As early as possible, ideally 3-4 weeks ahead during wedding season (November to February), to compare packages without rushing.",
      },
      {
        q: "Can I get real prices for all four packages to compare?",
        a: "Yes, message us your date and city and we'll walk you through pricing for each tier.",
      },
      {
        q: "Does the vintage car cost extra on top of my budget?",
        a: "No, a vintage car or baggi is included in every package, not a separate add-on.",
      },
      {
        q: "How do I get a personalized budget plan?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll help you plan based on real numbers.",
      },
    ],
  },

  "how-much-does-a-wedding-dj-cost": {
    slug: "how-much-does-a-wedding-dj-cost",
    intro:
      "How much does a wedding DJ cost for the baraat entry specifically depends on the package, dhol count, and any extra effects — since our DJ is always bundled with the truck, dhol team, vintage car, and safa team, not sold separately.\n\nPlanMyBaraat quotes based on your actual date, city, and guest count, so the price reflects your real event.",
    explanation:
      "Because the DJ performs from a truck as part of a moving baraat entry, the cost includes more than just the artist's time — it covers the truck, sound system, and coordination needed to keep the DJ working alongside a dhol team and moving procession. This is different from hiring a DJ for a fixed reception stage.\n\nThe base package structure stays the same across all tiers: truck, DJ, and dhol as the core, with lighting, effects, and extra entertainers added as you move up.",
    whatsIncluded:
      "Every package includes the DJ artist, truck, and sound system. Raj Tilak adds 2 dhol and chhatri lights. Rajwada steps up to 4 dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.",
    pricingGuidance:
      "We don't publish a flat wedding DJ cost because it depends on your city, date, guest count, and package choice. Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real price, usually within the hour.",
    bookingNotes:
      "Wedding season runs November to February, and DJ availability and prices both tighten during that window. 3-4 weeks' notice is a safe bet for peak season.\n\nShare your date, city, venue, and guest count when you reach out for an accurate quote.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll send you a real DJ cost, usually within the hour.",
    faqs: [
      {
        q: "How much does a wedding DJ cost for a baraat?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the cost include the truck or just the DJ artist?",
        a: "The full entry — DJ, truck, sound system, dhol team, vintage car, and safa team are all included in the package price.",
      },
      {
        q: "Why is baraat DJ cost different from reception DJ cost?",
        a: "A baraat DJ performs live from a moving truck outdoors with a dancing crowd, which requires different equipment and coordination than a fixed reception setup.",
      },
      {
        q: "Is the starting package good value for a wedding DJ?",
        a: "Yes, Raj Tilak includes the truck, DJ, 2 dhol, chhatri lights, car, and safa team — a complete entry at our most affordable tier.",
      },
      {
        q: "Does the DJ cost vary by city?",
        a: "Logistics can vary slightly, which is why we confirm your exact price once we know your date and location.",
      },
      {
        q: "How early should I lock in a DJ cost?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since prices and availability tighten during peak season.",
      },
      {
        q: "Can I negotiate based on my budget?",
        a: "Message us with your budget and requirements on WhatsApp and we'll recommend the package that fits best.",
      },
      {
        q: "How do I get an exact DJ cost?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real number, usually within the hour.",
      },
    ],
  },

  "how-much-does-a-baraat-setup-cost": {
    slug: "how-much-does-a-baraat-setup-cost",
    intro:
      "How much does a baraat setup cost is one of the first questions almost every family asks us, and the honest answer is that it depends on the package, dhol count, and any extra effects — not a single fixed number.\n\nPlanMyBaraat offers four packages — Raj Tilak, Rajwada, Maharaja, and Signature — each building on the last with more dhol, more visual effects, and more entertainment.",
    explanation:
      "The base of every package is the same: a double decker DJ truck, a professional DJ artist, a vintage car for the groom, and a safa team for turban styling. What changes as you move up the tiers is the number of dhol players (2 in Raj Tilak, up to 6 in Signature), the lighting and LED setup, and extra elements like a teddy or gorilla performer, pyro effects, confetti cannons, and a security team on the top package.\n\nBecause the base is consistent across every tier, the price difference between packages comes down to exactly how much extra production you want on top of a solid, working baraat entry.",
    whatsIncluded:
      "Raj Tilak includes the DJ truck, sound system, DJ artist, 2 dhol, chhatri lights, a vintage car, and a safa team. Rajwada adds 2 more dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, the top package, adds a security team plus pyro and confetti effects.",
    pricingGuidance:
      "We don't publish one flat number for baraat setup cost because your actual quote depends on the package, dhol count, extra effects, your city, and your guest count. Message us on WhatsApp with your wedding date, city, and rough guest count — we'll respond with an actual quote, usually within the hour.",
    bookingNotes:
      "Wedding season runs November to February across Gujarat, and prices and availability both tighten up during that window. Booking 3-4 weeks ahead during peak season is a safe bet.\n\nShare your date, city, venue, and roughly how many guests will be in the baraat.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll send you a real quote for the package that fits your baraat, usually within the hour.",
    faqs: [
      {
        q: "How much does a baraat setup cost on average?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote instead of a generic estimate.",
      },
      {
        q: "What's included in the baraat setup cost?",
        a: "Every package includes the DJ truck, sound system, DJ artist, dhol team, a vintage car, and a safa team. Higher tiers add more dhol, LED visuals, entertainers, and effects like pyro and confetti.",
      },
      {
        q: "Why don't you list a fixed price?",
        a: "Because the real cost depends on your city, date, guest count, and which add-ons you want, so a single flat number would be misleading. We quote based on your actual details.",
      },
      {
        q: "Is the cheapest package still a full baraat setup?",
        a: "Yes, Raj Tilak includes the truck, DJ, 2 dhol, chhatri lights, a vintage car, and a safa team — it's a complete entry, just with less production than the higher tiers.",
      },
      {
        q: "Does the guest count affect the setup cost?",
        a: "It can factor into our recommendation, since a bigger baraati group sometimes calls for a bigger sound setup or more dhol, but the packages themselves are fixed tiers.",
      },
      {
        q: "How much more does the top package cost compared to the starting one?",
        a: "Signature costs more than Raj Tilak because it includes triple the dhol count, moving LED screens, the groom's name in lights, pyro and confetti effects, and a security team.",
      },
      {
        q: "Do prices change based on the city?",
        a: "Yes, logistics can vary slightly by city, which is why we confirm your exact quote once we know your date and location rather than quoting blind.",
      },
      {
        q: "How do I get an exact quote?",
        a: "Message us on WhatsApp with your wedding date, city, venue, and rough guest count, and we'll respond with a real number, usually within the hour.",
      },
    ],
  },

  "wedding-dj-package-price": {
    slug: "wedding-dj-package-price",
    intro:
      "Wedding DJ package price for a baraat entry reflects the full package — truck, DJ, dhol team, vintage car, and safa team — not just the DJ's fee on its own.\n\nPlanMyBaraat's four packages each build on the last, from Raj Tilak's essentials to Signature's full production.",
    explanation:
      "Every package includes the truck, sound system, and DJ artist as the base, with the package price scaling up based on dhol count, lighting production, entertainers, and effects. This bundled pricing means you're not separately sourcing and coordinating a DJ, sound equipment, dhol players, and a car.\n\nComparing our package prices against a bare DJ quote elsewhere isn't quite apples to apples, since our price covers the entire baraat entry, not just the music.",
    whatsIncluded:
      "Raj Tilak includes the DJ artist, truck, sound system, 2 dhol, chhatri lights, a vintage car, and a safa team. Rajwada, Maharaja, and Signature add progressively more dhol, LED visuals, entertainers, and effects.",
    pricingGuidance:
      "Package pricing depends on the tier, dhol count, and any extra effects. Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real price, usually within the hour.",
    bookingNotes:
      "Wedding season runs November to February, and package prices and availability both tighten during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and guest count when you reach out for an accurate quote.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll send you a real DJ package price, usually within the hour.",
    faqs: [
      {
        q: "What's the wedding DJ package price?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the package price include more than just the DJ?",
        a: "Yes, it covers the truck, sound system, dhol team, vintage car, and safa team, not just the DJ's performance fee.",
      },
      {
        q: "Why might this cost more than a standalone DJ quote?",
        a: "Because it bundles the entire baraat entry — truck, dhol, car, and safa team — rather than just the music, so it's not directly comparable to a bare DJ fee.",
      },
      {
        q: "Is the starting package price good value?",
        a: "Yes, Raj Tilak includes the truck, DJ, 2 dhol, chhatri lights, car, and safa team — a complete entry at our most affordable tier.",
      },
      {
        q: "How early should I lock in a package price?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since prices and availability tighten during peak season.",
      },
      {
        q: "Does the price vary by city?",
        a: "Logistics can vary slightly, which is why we confirm your exact price once we know your date and location.",
      },
      {
        q: "Can I compare prices across all four packages?",
        a: "Yes, message us your date and city and we'll walk you through pricing for each tier.",
      },
      {
        q: "How do I get an exact package price?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real number, usually within the hour.",
      },
    ],
  },

  "baraat-entry-cost": {
    slug: "baraat-entry-cost",
    intro:
      "Baraat entry cost depends on the package, dhol count, and any extra effects you add — not a single flat number, but a clear range across our four packages.\n\nPlanMyBaraat's baraat entry cost always covers the full production: the truck, dhol team, vintage car, and safa team together.",
    explanation:
      "The base of the entry — truck, sound system, and DJ artist — is consistent across every package. What moves the cost up as you go through the tiers is the dhol count (2 to 6), the lighting and LED setup, and extras like a teddy or gorilla performer, pyro effects, confetti cannons, and a security team on Signature, our top package.\n\nBecause the entry cost always includes the vintage car and safa team too, it's worth comparing against the full production elsewhere, not just a bare truck rental quote.",
    whatsIncluded:
      "Raj Tilak includes the truck, DJ artist, 2 dhol, chhatri lights, a vintage car, and a safa team. Rajwada adds 2 more dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature adds a security team plus pyro and confetti effects.",
    pricingGuidance:
      "We don't publish a flat baraat entry cost because it depends on your city, date, guest count, and package choice. Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real price, usually within the hour.",
    bookingNotes:
      "Wedding season runs November to February, and both cost and truck availability tighten during that window. 3-4 weeks' notice is a safe bet for peak season.\n\nShare your date, city, venue, and guest count when you reach out for an accurate quote.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll send you a real baraat entry cost, usually within the hour.",
    faqs: [
      {
        q: "What's the baraat entry cost range?",
        a: "It depends on the package, dhol count, and any extra effects. Raj Tilak is our most affordable package and Signature is the most complete. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does the entry cost include just the truck or the full production?",
        a: "The full production — truck, dhol team, vintage car, and safa team are all included in every package price.",
      },
      {
        q: "Is the starting package a full entry or a stripped-down version?",
        a: "It's a complete entry with the truck, DJ, 2 dhol, chhatri lights, car, and safa team — just with less production than the higher tiers.",
      },
      {
        q: "Why is Signature more expensive?",
        a: "It includes 6 dhol, moving LED screens, the groom's name in lights, pyro and confetti effects, and a security team — significantly more production than the starting package.",
      },
      {
        q: "Does the entry cost change based on my city?",
        a: "Logistics can vary slightly, which is why we confirm your exact price once we know your date and location.",
      },
      {
        q: "How early should I lock in an entry cost?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since costs and availability both tighten during peak season.",
      },
      {
        q: "Can I negotiate the baraat entry cost?",
        a: "Message us with your budget and requirements on WhatsApp and we'll recommend the package that fits best.",
      },
      {
        q: "How do I get an exact cost for my date?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real number, usually within the hour.",
      },
    ],
  },

  "how-to-choose-baraat-setup": {
    slug: "how-to-choose-baraat-setup",
    intro:
      "How to choose baraat setup comes down to matching your priorities, guest count, and venue to the right package — PlanMyBaraat's four tiers each build on the last, from Raj Tilak's essentials to Signature's full production.\n\nMessage us on WhatsApp with your date, city, and vision, and we'll help you decide.",
    explanation:
      "Start by thinking about what matters most: if a reliable, complete entry is your priority, Raj Tilak covers the truck, DJ, dhol, car, and safa team well. If you want more visual production — LED visuals, an entertainer, more dhol — Rajwada or Maharaja fit better. If you want the fullest, most memorable experience with effects and security, Signature is built for that.\n\nGuest count and venue also matter — a bigger crowd or a venue with wider roads often works well with a higher-tier package's stronger sound and more elaborate production, while a smaller, more intimate wedding might suit Raj Tilak just fine.",
    whatsIncluded:
      "Raj Tilak covers the essentials. Rajwada adds more dhol and an entertainer. Maharaja brings LED visuals and custom lettering. Signature adds pyro, confetti, and security for the most complete production.",
    pricingGuidance:
      "Pricing depends on which package fits your event best. Message us on WhatsApp with your date, city, venue, and guest count, and we'll recommend the right tier along with a real quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll help you choose the right baraat setup.",
    faqs: [
      {
        q: "How do I choose the right baraat setup?",
        a: "Think about your priorities — a solid, reliable entry (Raj Tilak), more visual production (Rajwada/Maharaja), or the fullest experience (Signature) — and message us with your date and city for a recommendation.",
      },
      {
        q: "Does guest count affect which setup I should pick?",
        a: "Yes, a larger crowd often benefits from more dhol players and a stronger sound system, which points toward the higher tiers.",
      },
      {
        q: "Does my venue affect which package fits best?",
        a: "Yes, wider roads and bigger venues can accommodate a more elaborate production, while a smaller, intimate wedding might suit a simpler setup.",
      },
      {
        q: "Should I always pick the most expensive package?",
        a: "Not necessarily — the right fit depends on your specific event, not just spending the most.",
      },
      {
        q: "How much does each package cost?",
        a: "It depends on your city, date, and guest count. Message us on WhatsApp and we'll walk you through real pricing for each tier.",
      },
      {
        q: "How early should I decide on a package?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window for the best chance at your preferred package and date.",
      },
      {
        q: "Can I see examples of past entries at each tier?",
        a: "Yes, message us on WhatsApp and we'll share photos and videos of past baraat entries.",
      },
      {
        q: "Can I get help deciding based on my specific event?",
        a: "Yes, share your date, city, venue, and guest count on WhatsApp and we'll recommend a package based on what actually fits.",
      },
    ],
  },

  "compare-baraat-setups": {
    slug: "compare-baraat-setups",
    intro:
      "To compare baraat setups, it helps to look at what each package tier adds beyond the shared base — the truck, DJ, dhol, vintage car, and safa team every package includes.\n\nPlanMyBaraat's four packages — Raj Tilak, Rajwada, Maharaja, and Signature — each layer on more production as you move up.",
    explanation:
      "Raj Tilak includes 2 dhol, chhatri lights, a vintage car, and a safa team alongside the truck and DJ. Rajwada adds 2 more dhol and a teddy or gorilla performer. Maharaja brings the count to 6 dhol, plus moving LED panels and custom name lighting. Signature keeps the 6 dhol and LED setup, adding pyro highlights, confetti and CO2 effects, a fake money gun, an American vintage car, and 4 professional bouncers.\n\nComparing them side by side, the jump from Raj Tilak to Rajwada is mostly about dhol count and an entertainer, while the jump to Maharaja and Signature adds significantly more visual and effects production.",
    whatsIncluded:
      "Every package shares the truck, DJ, vintage car, and safa team as the base, with dhol count, lighting, entertainers, and effects scaling up from Raj Tilak to Signature.",
    pricingGuidance:
      "Pricing depends on which package you're comparing and your city, date, and guest count. Message us on WhatsApp and we'll give you real quotes across all four tiers to compare directly.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates, giving you time to compare before booking.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll send you a side-by-side comparison of our packages.",
    faqs: [
      {
        q: "What's the easiest way to compare baraat setups?",
        a: "Look at what each tier adds beyond the shared base (truck, DJ, dhol, car, safa team) — dhol count, lighting, entertainers, and effects all scale up from Raj Tilak to Signature.",
      },
      {
        q: "What's the main difference between Raj Tilak and Rajwada?",
        a: "Rajwada adds 2 more dhol (4 total) and a teddy or gorilla performer on top of Raj Tilak's essentials.",
      },
      {
        q: "What does Maharaja add over Rajwada?",
        a: "Maharaja brings the dhol count to 6 and adds moving LED panels plus custom name lighting.",
      },
      {
        q: "What's unique to Signature compared to Maharaja?",
        a: "Signature adds pyro highlights, confetti and CO2 effects, a fake money gun, an American vintage car, and 4 professional bouncers.",
      },
      {
        q: "How much does each package cost?",
        a: "It varies by city, date, and guest count. Message us on WhatsApp and we'll send you real quotes for all four tiers.",
      },
      {
        q: "Is there a big price jump between tiers?",
        a: "The jump reflects the added production — more dhol, LED visuals, and effects — message us for exact numbers to compare.",
      },
      {
        q: "How early should I compare before booking?",
        a: "As early as possible, ideally 3-4 weeks ahead during wedding season (November to February), to give yourself time to decide.",
      },
      {
        q: "Can you help me decide which package fits my event?",
        a: "Yes, share your date, city, venue, and guest count on WhatsApp and we'll recommend the right tier.",
      },
    ],
  },

  "baraat-setup-comparison": {
    slug: "baraat-setup-comparison",
    intro:
      "A baraat setup comparison across PlanMyBaraat's four packages shows a clear progression — Raj Tilak's essentials, Rajwada's added dhol and entertainer, Maharaja's LED production, and Signature's full effects and security lineup.\n\nMessage us on WhatsApp with your date and city, and we'll send you a real, side-by-side comparison with pricing.",
    explanation:
      "The comparison starts with what's shared: every package includes the truck, DJ artist, sound system, a vintage car, and the safa team's turban styling. From there, the differences are dhol count (2 to 6), lighting production (chhatri lights to moving LED panels with custom name lettering), entertainment (a teddy or gorilla performer from Rajwada upward), and effects (pyro, confetti, and CO2 guns specific to Maharaja and Signature).\n\nSignature also uniquely includes a security team and the premium American vintage car, making it the most complete comparison point among the four.",
    whatsIncluded:
      "Raj Tilak: truck, DJ, 2 dhol, chhatri lights, car, safa team. Rajwada: adds 2 dhol and an entertainer. Maharaja: 6 dhol, LED panels, custom lettering. Signature: adds pyro, confetti, CO2 effects, fake money gun, American vintage car, and security.",
    pricingGuidance:
      "Pricing varies by city, date, and guest count across all four tiers. Message us on WhatsApp and we'll send you real numbers for each package to compare directly.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet, giving you time to compare before booking.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll send you a full comparison of our packages with real pricing.",
    faqs: [
      {
        q: "What's the quickest way to see a baraat setup comparison?",
        a: "Message us your date and city on WhatsApp and we'll send a real side-by-side comparison with pricing for all four packages.",
      },
      {
        q: "What's shared across all four packages?",
        a: "The truck, DJ artist, sound system, a vintage car, and the safa team's turban styling are included in every tier.",
      },
      {
        q: "What differs the most between the packages?",
        a: "Dhol count, lighting production, entertainment, and effects like pyro and confetti scale up significantly from Raj Tilak to Signature.",
      },
      {
        q: "Is Signature significantly more expensive than Raj Tilak?",
        a: "Yes, reflecting its much larger production — 6 dhol, full LED lighting, effects, the premium vintage car, and security.",
      },
      {
        q: "How do I know which tier is right for me after comparing?",
        a: "Message us your venue, guest count, and priorities and we'll recommend the tier that fits best.",
      },
      {
        q: "How early should I do this comparison before booking?",
        a: "As early as possible, ideally 3-4 weeks ahead during wedding season (November to February), to give yourself time to decide.",
      },
      {
        q: "Can I see photos comparing the different tiers?",
        a: "Yes, message us on WhatsApp and we'll share photos and videos of past entries at different package levels.",
      },
      {
        q: "Is the vintage car the same across all tiers?",
        a: "Raj Tilak through Maharaja include a vintage car or baggi, while Signature specifically upgrades to an American vintage car.",
      },
    ],
  },

  "all-inclusive-baraat-entry-service": {
    slug: "all-inclusive-baraat-entry-service",
    intro:
      "An all inclusive baraat entry service means one booking covers everything — the truck, dhol team, vintage car, and safa team — instead of coordinating multiple vendors separately.\n\nEvery PlanMyBaraat package, from Raj Tilak to Signature, is built this way, so you get a complete entry with one point of contact.",
    explanation:
      "Rather than separately sourcing a DJ truck rental, a dhol group, a car for the groom, and a turban stylist, our all inclusive approach bundles everything into one coordinated booking. This means timing, positioning, and the overall flow of the entry are planned together by one team, not stitched together on the day from independent vendors.\n\nThis matters especially for a baraat, where the truck, dhol, and groom's arrival all need to move in sync — much easier when one team is managing the whole thing.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team as the core all-inclusive base, with higher tiers adding more dhol, LED production, entertainers, and effects.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. We quote based on your date, city, and guest count. Message us on WhatsApp for a real quote covering the full all-inclusive service.",
    bookingNotes:
      "Wedding season runs November to February, and demand for full-service packages peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the all-inclusive package's available, usually within the hour.",
    faqs: [
      {
        q: "What does 'all inclusive' mean for your baraat service?",
        a: "One booking covers the truck, dhol team, vintage car, and safa team together, coordinated by one team rather than separate vendors.",
      },
      {
        q: "Is this different from booking each piece separately?",
        a: "Yes, separate bookings mean coordinating multiple vendors' schedules independently, while our all-inclusive approach handles timing and positioning as one operation.",
      },
      {
        q: "How much does the all-inclusive service cost?",
        a: "It depends on the package tier, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does every package tier offer this all-inclusive structure?",
        a: "Yes, from Raj Tilak to Signature, every package bundles the truck, dhol, car, and safa team together.",
      },
      {
        q: "How early should I book an all-inclusive package?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since demand peaks then.",
      },
      {
        q: "Does the all-inclusive service handle timing coordination too?",
        a: "Yes, our team plans the timing and positioning of the truck, dhol, and groom's arrival together as one coordinated entry.",
      },
      {
        q: "Is this more reliable than separate vendors?",
        a: "Yes, since one team manages the whole entry, there's less risk of miscommunication or timing issues between separately hired vendors.",
      },
      {
        q: "How do I book the all-inclusive service?",
        a: "Message us on WhatsApp with your wedding date, city, venue, and rough guest count, and we'll confirm availability.",
      },
    ],
  },

  "full-inclusive-baraat-entry": {
    slug: "full-inclusive-baraat-entry",
    intro:
      "A full inclusive baraat entry covers the truck, dhol team, vintage car, and safa team as one coordinated package, so you're not piecing together multiple separate vendors for your procession.\n\nPlanMyBaraat's packages, from Raj Tilak to Signature, are built this way from the start.",
    explanation:
      "Full inclusion means every core element of the baraat — the truck's sound and lighting, live dhol drumming, the groom's vintage car arrival, and turban styling for the group — comes as one booking with one team managing the timing and coordination.\n\nThis is different from a partial service that covers just the truck or just the dhol, leaving you to arrange the rest independently and hope everything lines up on the wedding day.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team as the full inclusive base, with higher tiers adding more dhol, LED production, entertainers, and effects.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. We quote based on your date, city, and guest count. Message us on WhatsApp for a real quote covering the full inclusive entry.",
    bookingNotes:
      "Wedding season runs November to February, and demand for fully inclusive packages peaks then. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm the full inclusive package's available, usually within the hour.",
    faqs: [
      {
        q: "What does 'full inclusive' mean for a baraat entry?",
        a: "Every core element — truck, dhol, vintage car, and safa team — is included in one booking, managed by one coordinated team.",
      },
      {
        q: "Is this different from a partial baraat service?",
        a: "Yes, a partial service might cover just the truck or just the dhol, leaving you to arrange the rest separately.",
      },
      {
        q: "How much does a full inclusive baraat entry cost?",
        a: "It depends on the package tier, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does every package tier offer full inclusion?",
        a: "Yes, from Raj Tilak to Signature, every package includes the truck, dhol, car, and safa team.",
      },
      {
        q: "How early should I book a full inclusive package?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since demand peaks then.",
      },
      {
        q: "Does full inclusion cover timing coordination too?",
        a: "Yes, our team plans the timing and positioning of the truck, dhol, and groom's arrival together.",
      },
      {
        q: "Is a full inclusive entry more expensive than piecing it together myself?",
        a: "It's typically comparable or better value, since you avoid coordination gaps and multiple vendor markups by booking through one team.",
      },
      {
        q: "How do I book a full inclusive entry?",
        a: "Message us on WhatsApp with your wedding date, city, venue, and rough guest count, and we'll confirm availability.",
      },
    ],
  },

  "custom-baraat-pricing": {
    slug: "custom-baraat-pricing",
    intro:
      "Custom baraat pricing reflects the fact that every wedding is different — your city, date, guest count, and specific package choice all factor into the final number, rather than a one-size-fits-all rate.\n\nPlanMyBaraat quotes based on your actual event details, giving you a price that reflects your specific baraat, not a generic estimate.",
    explanation:
      "Rather than a fixed price sheet, we build your quote around what you actually need — which package tier fits your vision, how many dhol players you want, whether you're adding effects like pyro or confetti, and any specific requests you have. This means two families with different needs get different, accurate prices rather than the same generic number.\n\nCustom pricing also means we can advise on trade-offs — for example, if budget is a priority, we can suggest where to save without losing the core experience.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, with the specific mix and quantity depending on your chosen tier and any custom requests.",
    pricingGuidance:
      "We build custom quotes based on your city, date, guest count, and package preferences. Message us on WhatsApp with your details and any specific requests, and we'll respond with a real, tailored price.",
    bookingNotes:
      "Wedding season runs November to February. If you have specific custom requests, mention them early — 3-4 weeks' notice gives us time to plan the details properly.\n\nShare your date, city, venue, guest count, and any custom requirements when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and any custom requirements, and we'll build a tailored quote for your baraat.",
    faqs: [
      {
        q: "Do you offer custom baraat pricing?",
        a: "Yes, we quote based on your actual event details — city, date, guest count, and package choice — rather than a fixed generic rate.",
      },
      {
        q: "How does custom pricing work?",
        a: "Message us your date, city, and specific requirements, and we'll build a quote tailored to your event, not a generic estimate.",
      },
      {
        q: "Can you help me find the right balance between budget and production?",
        a: "Yes, tell us your budget and priorities and we'll advise on where to invest and where to keep things simple.",
      },
      {
        q: "Is custom pricing more expensive than standard packages?",
        a: "No, our four packages already provide the pricing structure — 'custom' means the exact quote reflects your specific date, city, and guest count within that structure.",
      },
      {
        q: "How early should I request a custom quote?",
        a: "As early as possible, ideally 3-4 weeks ahead during wedding season (November to February), especially if you have specific requests.",
      },
      {
        q: "Can I customize a package with specific add-ons?",
        a: "Message us with your specific requests and we'll let you know what's possible within your chosen package tier.",
      },
      {
        q: "Does the guest count affect my custom price?",
        a: "It can factor into our recommendation, since a bigger baraati group sometimes calls for a bigger sound setup or more dhol.",
      },
      {
        q: "How do I get my custom quote?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll respond with a real, tailored number.",
      },
    ],
  },

  "baraat-setup-for-guests-count": {
    slug: "baraat-setup-for-guests-count",
    intro:
      "Baraat setup for guests count is about matching the right package to your specific crowd size — a smaller guest list often works well with Raj Tilak, while a larger baraati group typically benefits from more dhol and a stronger sound system.\n\nPlanMyBaraat can recommend the right tier once we know your rough headcount.",
    explanation:
      "Guest count affects a few practical things: how many dhol players are needed to keep the energy up across a bigger group, whether the sound system needs to project further, and how much room the truck needs on your route. For smaller, more intimate weddings, Raj Tilak's 2 dhol players and standard sound setup are usually plenty.\n\nFor larger celebrations, Maharaja or Signature's 6 dhol players and more powerful production help keep everyone engaged, especially across a bigger, more spread-out crowd.",
    whatsIncluded:
      "Raj Tilak includes 2 dhol, suited to smaller guest lists. Rajwada steps up to 4. Maharaja and Signature both include 6 dhol along with stronger production, suited to larger celebrations.",
    pricingGuidance:
      "Pricing depends on the package tier that fits your guest count, along with your city and date. Message us on WhatsApp with your rough headcount, and we'll recommend the right package and give you a real quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll recommend the right package for your crowd size.",
    faqs: [
      {
        q: "Which package is best for a small guest list?",
        a: "Raj Tilak, with 2 dhol players and a standard sound setup, works well for smaller, more intimate baraati groups.",
      },
      {
        q: "Which package is best for a large guest list?",
        a: "Maharaja or Signature, with 6 dhol players and stronger production, suit larger, more spread-out celebrations better.",
      },
      {
        q: "Does guest count change the price?",
        a: "It can factor into our recommendation, since a bigger group sometimes calls for a bigger setup, but message us your specific numbers for an accurate quote.",
      },
      {
        q: "What if I'm not sure of my exact guest count yet?",
        a: "A rough estimate is enough for us to recommend a package — message us what you have and we'll advise accordingly.",
      },
      {
        q: "Does a bigger crowd need a bigger truck?",
        a: "The truck size is generally consistent; what scales with guest count is dhol players and sound projection strength.",
      },
      {
        q: "How early should I book based on my guest count?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, especially for larger events needing the higher tiers.",
      },
      {
        q: "Can I upgrade dhol count without upgrading the whole package?",
        a: "Message us with your specific needs and we'll let you know what's possible.",
      },
      {
        q: "How do I find out which package fits my guest count?",
        a: "Message us on WhatsApp with your rough headcount, date, and city, and we'll recommend the right package.",
      },
    ],
  },

  "baraat-setup-for-destination-wedding": {
    slug: "baraat-setup-for-destination-wedding",
    intro:
      "A baraat setup for destination wedding needs extra planning around venue access, guest travel logistics, and unfamiliar routes — PlanMyBaraat covers destination-style venues across Gujarat, including areas like the Statue of Unity belt.\n\nMessage us on WhatsApp with your destination venue details, and we'll confirm what's possible for your specific location.",
    explanation:
      "Destination weddings often happen at resorts or event spaces built for exactly this kind of celebration, sometimes in areas we're less routinely booked in than major cities. We plan the truck route carefully around these venues, accounting for road access, parking for the truck, and guest travel patterns unique to a destination location.\n\nBecause destination venues can book out fast and require more logistics planning, we recommend reaching out earlier than usual for these events.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, with route planning adjusted specifically for your destination venue.",
    pricingGuidance:
      "Pricing depends on the package tier, your specific destination location, and guest count. Message us on WhatsApp with your venue details, and we'll respond with a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and destination venues book out especially fast during that window. 4 weeks' notice or more is a safe bet for these events.\n\nShare your date, destination venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and destination venue, and we'll confirm what's possible for your baraat entry.",
    faqs: [
      {
        q: "Do you cover destination wedding venues?",
        a: "Yes, we cover destination-style venues across Gujarat, including areas like the Statue of Unity belt. Message us your specific venue to confirm.",
      },
      {
        q: "How much does a baraat setup for destination wedding cost?",
        a: "It depends on the package, your specific location, and guest count. Message your date and venue on WhatsApp for a real quote.",
      },
      {
        q: "How early should I book for a destination wedding?",
        a: "4 weeks or more is a safe window, since destination venues book out especially fast during peak season.",
      },
      {
        q: "Does the truck route need special planning for destination venues?",
        a: "Yes, we plan around road access, parking, and guest travel patterns specific to the destination location.",
      },
      {
        q: "Are all packages available for destination weddings?",
        a: "Message us with your specific venue and we'll confirm which packages are best suited for that location.",
      },
      {
        q: "Does guest travel affect the baraat planning?",
        a: "Yes, destination weddings often have unique guest travel patterns, which we factor into route and timing planning.",
      },
      {
        q: "Is the vintage car suitable for destination venue roads?",
        a: "We assess this based on your specific venue's road conditions when planning the entry.",
      },
      {
        q: "How do I confirm coverage for my destination venue?",
        a: "Message us on WhatsApp with your venue name and location, and we'll confirm what's possible.",
      },
    ],
  },

  "baraat-planner-near-me": {
    slug: "baraat-planner-near-me",
    intro:
      "Searching for a baraat planner near me means finding a local team who knows your city's roads, venues, and typical wedding timing — not a generic vendor unfamiliar with the area.\n\nPlanMyBaraat operates across Gujarat regularly, covering Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts.",
    explanation:
      "Being local matters because a baraat planner needs to understand route planning, typical venue setups, and even things like noise curfews in specific neighborhoods. Our team works across Gujarat regularly, not flown in for a single event, so we're familiar with the practical realities of planning a procession in most of the cities and towns we cover.\n\nWe handle the whole entry — truck, dhol, vintage car, and safa team — as one coordinated booking, so you deal with a single local team rather than piecing together separate vendors.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, planned around your specific local venue and route.",
    pricingGuidance:
      "Pricing depends on the package tier, your city, date, and guest count. Message us on WhatsApp with your city to confirm coverage and get a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and local availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your city, date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your city and wedding date, and we'll confirm we cover your area, usually within the hour.",
    faqs: [
      {
        q: "Do you cover baraat planning near my city?",
        a: "We cover Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat. Message us your city to confirm.",
      },
      {
        q: "How much does a baraat planner near me cost?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Does being local mean better route planning?",
        a: "Yes, our team works across Gujarat regularly and understands typical route lengths, venue access, and local timing considerations.",
      },
      {
        q: "How early should I book a local baraat planner?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since local availability tightens during peak season.",
      },
      {
        q: "Does local knowledge include noise curfews or restrictions?",
        a: "Yes, our team is familiar with typical local considerations in the areas we serve and plans accordingly.",
      },
      {
        q: "Can I get a quote specific to my city?",
        a: "Yes, message us your city and date on WhatsApp and we'll respond with a real, location-specific quote.",
      },
      {
        q: "What cities do you cover for baraat planning?",
        a: "Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat.",
      },
      {
        q: "How do I confirm coverage for my specific area?",
        a: "Message us your exact city and venue on WhatsApp and we'll confirm directly.",
      },
    ],
  },

  "baraat-planning-company": {
    slug: "baraat-planning-company",
    intro:
      "A baraat planning company handles the whole procession — truck, dhol team, vintage car, and safa team — as one coordinated booking, rather than you sourcing each element separately.\n\nPlanMyBaraat is a Gujarat-based baraat planning company, working across Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most cities and towns in the state.",
    explanation:
      "As a dedicated planning company, our focus is specifically the baraat entry — not weddings broadly, but this exact moment of the procession. That focus means our drivers, DJs, dhol players, and safa artists work with us regularly and are experienced specifically with baraat timing and pacing.\n\nWe handle route planning, timing coordination between the truck and dhol team, and the overall flow of the entry, so you have one point of contact rather than managing multiple vendors independently.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, coordinated by our team as one complete service.",
    pricingGuidance:
      "Pricing depends on the package tier, your city, date, and guest count. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for our services peaks during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "What does a baraat planning company do?",
        a: "We handle the whole procession — truck, dhol team, vintage car, and safa team — as one coordinated booking, rather than separate vendors.",
      },
      {
        q: "How much does a baraat planning company charge?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is PlanMyBaraat focused only on the baraat entry?",
        a: "Yes, our focus is specifically on the baraat procession, which is why our team is experienced specifically with its timing and pacing.",
      },
      {
        q: "How early should I contact a baraat planning company?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since demand peaks then.",
      },
      {
        q: "Do you handle all logistics, including timing?",
        a: "Yes, we plan the route, timing coordination between the truck and dhol team, and the overall flow of the entry.",
      },
      {
        q: "Which cities does your company cover?",
        a: "Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat.",
      },
      {
        q: "Is one team responsible for the whole entry?",
        a: "Yes, you deal with one point of contact for the truck, dhol, car, and safa team, not multiple separate vendors.",
      },
      {
        q: "How do I get started with a baraat planning company?",
        a: "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm availability and recommend a package.",
      },
    ],
  },

  "baraat-organizer": {
    slug: "baraat-organizer",
    intro:
      "A baraat organizer coordinates the whole procession on your wedding day, managing the truck, dhol team, vintage car, and safa team so everything moves together smoothly.\n\nPlanMyBaraat serves as your baraat organizer, handling this coordination as part of every package we offer.",
    explanation:
      "Organizing a baraat means more than just showing up with a truck — it means planning the route, timing the groom's vintage car arrival with the truck's approach, coordinating the dhol team with the DJ's set, and making sure the safa team has styled everyone before the procession starts.\n\nOur team handles this coordination as a single operation, so you don't need to separately manage the timing and communication between multiple independent vendors on your wedding day.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, coordinated together by our team as your baraat organizer.",
    pricingGuidance:
      "Pricing depends on the package tier, your city, date, and guest count. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for organized baraat services peaks during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "What does a baraat organizer actually coordinate?",
        a: "The route, timing between the truck and groom's car, coordination between the dhol team and DJ, and making sure the safa team has everyone styled before the procession starts.",
      },
      {
        q: "How much does a baraat organizer cost?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Do I still need to manage timing myself on the wedding day?",
        a: "No, our team handles the coordination as one operation, so you don't need to separately manage multiple vendors.",
      },
      {
        q: "How early should I book a baraat organizer?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since demand peaks then.",
      },
      {
        q: "Is the organizer present throughout the whole procession?",
        a: "Yes, our team coordinates the entry from start to finish, not just at the beginning.",
      },
      {
        q: "Does the organizer handle unexpected timing changes?",
        a: "Yes, our experienced team can adjust on the day if timing shifts, since they're familiar with baraat-specific coordination.",
      },
      {
        q: "Which cities do you organize baraats in?",
        a: "Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat.",
      },
      {
        q: "How do I get started?",
        a: "Message us on WhatsApp with your wedding date, city, and venue, and we'll confirm availability and recommend a package.",
      },
    ],
  },

  "baraat-services-near-me": {
    slug: "baraat-services-near-me",
    intro:
      "Baraat services near me means finding a local provider who covers your specific city or town, with drivers and performers familiar with the area's roads and venues.\n\nPlanMyBaraat operates across Gujarat, covering Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts.",
    explanation:
      "Our services cover the complete baraat entry — the truck, dhol team, vintage car, and safa team — as one package, and because we work across Gujarat regularly, our team is familiar with typical routes, venue setups, and logistics in most of the areas we serve.\n\nMessage us your specific city or town, and we'll confirm coverage and connect you with a package that fits your event.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, delivered by our team local to your area.",
    pricingGuidance:
      "Pricing depends on the package tier and your specific city, date, and guest count. Message us on WhatsApp to confirm coverage and get a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and local availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your city, date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your city and wedding date, and we'll confirm we cover your area, usually within the hour.",
    faqs: [
      {
        q: "Do you offer baraat services near my city?",
        a: "We cover Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat. Message us your city to confirm.",
      },
      {
        q: "How much do baraat services near me cost?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is your team familiar with venues in my area?",
        a: "Our team works across Gujarat regularly, so they're experienced with typical venue setups and logistics in most areas we cover.",
      },
      {
        q: "How early should I book local baraat services?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since local availability tightens during peak season.",
      },
      {
        q: "What's included in your baraat services?",
        a: "The DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, all as one package.",
      },
      {
        q: "Can I get a quote specific to my area?",
        a: "Yes, message us your city and date on WhatsApp and we'll respond with a real, location-specific quote.",
      },
      {
        q: "What if my town isn't listed among the major cities you mention?",
        a: "Message us your specific location and we'll confirm whether we can cover it.",
      },
      {
        q: "How do I get started with local baraat services?",
        a: "Message us on WhatsApp with your city, date, and venue, and we'll confirm availability.",
      },
    ],
  },

  "how-to-book-baraat-on-wheels": {
    slug: "how-to-book-baraat-on-wheels",
    intro:
      "How to book baraat on wheels with PlanMyBaraat is a simple, WhatsApp-based process — share your date, city, and rough guest count, and we'll recommend a package and confirm availability, usually within the hour.\n\nThere's no lengthy form or wait for a callback involved.",
    explanation:
      "The booking process starts with a message: tell us your wedding date, city, venue, and roughly how many guests will be in the baraat. From there, we recommend a package based on your needs, share a real quote, and once you confirm, we lock in your date with an advance payment.\n\nThis WhatsApp-first approach means you can book whenever is convenient, share photos and details easily, and get quick responses without needing to call during specific business hours.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, with the specific tier depending on your preferences and budget.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. We quote based on your date, city, and guest count. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and booking slots fill up fast during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you message us to start the process.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue to start the booking process, usually confirmed within the hour.",
    faqs: [
      {
        q: "How do I book baraat on wheels?",
        a: "Message us on WhatsApp with your wedding date, city, venue, and rough guest count. We'll recommend a package and confirm availability, usually within the hour.",
      },
      {
        q: "Is there a form I need to fill out?",
        a: "No, WhatsApp is our main booking channel — it's faster and lets us share quotes and answer questions directly.",
      },
      {
        q: "Do I need to pay a deposit to confirm?",
        a: "Yes, we usually take an advance payment to lock in your date, with the balance due closer to the event.",
      },
      {
        q: "How quickly will I hear back after messaging?",
        a: "Usually within the hour during business hours.",
      },
      {
        q: "Can I see photos before booking?",
        a: "Yes, message us on WhatsApp and we'll share photos and videos of past entries.",
      },
      {
        q: "How early should I start the booking process?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since slots fill up fast.",
      },
      {
        q: "What information do I need to provide?",
        a: "Your wedding date, city, venue, rough guest count, and preferred package — that's enough for us to confirm.",
      },
      {
        q: "Can I change my package after booking?",
        a: "Message us and we'll see what's possible depending on your date and how far out we are from the event.",
      },
    ],
  },

  "baraat-booking-process": {
    slug: "baraat-booking-process",
    intro:
      "The baraat booking process with PlanMyBaraat happens over WhatsApp, starting with your date, city, and rough guest count, and ending with a confirmed truck, dhol team, vintage car, and safa team for your entry.\n\nThe whole process is designed to be quick and straightforward, without lengthy forms.",
    explanation:
      "First, you message us with your wedding details. We respond with package recommendations and a real quote based on your specific date, city, and guest count. Once you decide on a package, we take an advance payment to lock in your date, and confirm the details closer to the event.\n\nOn the wedding day itself, our team arrives with everything coordinated — the truck, dhol players, vintage car, and safa team all working as one operation, without you needing to manage separate vendors.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, confirmed through our booking process.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects, confirmed during the booking conversation. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and the booking process moves fastest when you reach out early. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count to start the process.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue to start the booking process, usually confirmed within the hour.",
    faqs: [
      {
        q: "What are the steps in the baraat booking process?",
        a: "Message us your details, we recommend a package and share a quote, you confirm with an advance payment, and we finalize details closer to the event.",
      },
      {
        q: "How long does the booking process take?",
        a: "Usually just a WhatsApp conversation — we respond within the hour, and you can confirm as soon as you're ready.",
      },
      {
        q: "Is a deposit required during the booking process?",
        a: "Yes, we take an advance payment to lock in your date, with the balance due closer to the event.",
      },
      {
        q: "What details do I need for the booking process?",
        a: "Your wedding date, city, venue, rough guest count, and preferred package.",
      },
      {
        q: "How early should I start the booking process?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since booking slots fill up fast.",
      },
      {
        q: "Can I make changes during the booking process?",
        a: "Yes, message us if your plans change and we'll see what's possible.",
      },
      {
        q: "Is the process the same for every package tier?",
        a: "Yes, the booking process is the same regardless of which package you choose.",
      },
      {
        q: "How do I start the booking process?",
        a: "Message us on WhatsApp with your wedding date, city, and venue, and we'll take it from there.",
      },
    ],
  },

  "advance-payment-for-baraat-service": {
    slug: "advance-payment-for-baraat-service",
    intro:
      "Advance payment for baraat service is how PlanMyBaraat locks in your date once you've decided on a package — a standard part of confirming a truck, dhol team, vintage car, and safa team for your specific wedding day.\n\nMessage us on WhatsApp with your details, and we'll share exact advance payment terms once your package is confirmed.",
    explanation:
      "Because wedding dates, especially during peak season, get booked out fast, an advance payment secures your truck and team for that specific date rather than leaving it open to other inquiries. The balance is typically due closer to the event.\n\nThis is standard practice across event services generally, and we're transparent about the terms once you've settled on a package, so there are no surprises later in the process.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, confirmed once the advance payment is received.",
    pricingGuidance:
      "The advance payment amount depends on your total package cost, which is based on the tier, dhol count, and any extra effects. Message us on WhatsApp for the exact terms once we've confirmed your package.",
    bookingNotes:
      "Wedding season runs November to February, and confirming with an advance payment early secures your date during this busy window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and preferred package when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and preferred package, and we'll share advance payment details to lock in your booking.",
    faqs: [
      {
        q: "Do I need to pay an advance to confirm my baraat booking?",
        a: "Yes, an advance payment locks in your date and package, with the balance due closer to the event.",
      },
      {
        q: "How much is the advance payment?",
        a: "It depends on your total package cost. Message us on WhatsApp for exact terms once your package is confirmed.",
      },
      {
        q: "When is the remaining balance due?",
        a: "Typically closer to the event date — we'll confirm exact timing when discussing your booking.",
      },
      {
        q: "Is the advance payment refundable?",
        a: "Message us with any specific concerns about cancellations, and we'll walk you through our policy.",
      },
      {
        q: "How early should I pay the advance to secure my date?",
        a: "As early as possible, ideally 3-4 weeks ahead during wedding season (November to February), since dates fill up fast.",
      },
      {
        q: "What payment methods are accepted?",
        a: "Message us on WhatsApp and we'll share the accepted payment methods for your booking.",
      },
      {
        q: "Does the advance lock in a specific package or just the date?",
        a: "It locks in both your date and the specific package you've chosen.",
      },
      {
        q: "How do I proceed with payment?",
        a: "Message us on WhatsApp with your wedding date, city, and preferred package, and we'll share the next steps.",
      },
    ],
  },

  "baraat-cancellation-policy": {
    slug: "baraat-cancellation-policy",
    intro:
      "Baraat cancellation policy details vary based on how far in advance you cancel relative to your event date — message us on WhatsApp with your specific situation, and we'll walk you through the terms clearly.\n\nWe aim to be transparent about cancellation terms from the start of your booking.",
    explanation:
      "Because a confirmed booking holds your date and reserves our truck, dhol team, and other resources for that specific day, cancellation policies typically account for how much notice you're able to give. Earlier cancellations generally have more flexibility than last-minute changes close to the event.\n\nWe understand wedding plans can shift, and we try to work with families as reasonably as possible while also protecting the commitment we've made to hold your date exclusively.",
    whatsIncluded:
      "Cancellation terms apply to all our packages equally, regardless of which tier — truck, dhol, vintage car, and safa team — you've booked.",
    pricingGuidance:
      "Cancellation and refund terms depend on your specific booking and timing. Message us on WhatsApp with your situation and we'll explain the applicable terms clearly.",
    bookingNotes:
      "If your wedding date changes, message us as soon as you know so we can advise on rebooking or cancellation terms for your new plans.\n\nShare your original booking details and new date (if applicable) when you reach out.",
    closing:
      "Message us on WhatsApp with your specific situation, and we'll walk you through our cancellation policy clearly.",
    faqs: [
      {
        q: "What is your baraat cancellation policy?",
        a: "Terms depend on how far in advance you cancel relative to your event date. Message us with your specific situation and we'll explain clearly.",
      },
      {
        q: "Can I get a refund if I cancel my booking?",
        a: "This depends on timing and your specific booking — message us and we'll walk you through what applies to your situation.",
      },
      {
        q: "What if my wedding date changes instead of a full cancellation?",
        a: "Message us as soon as you know so we can check availability for the new date and discuss rebooking.",
      },
      {
        q: "Is there a deadline for cancellation without penalty?",
        a: "This varies by booking — message us your specific timeline and we'll clarify what applies.",
      },
      {
        q: "Does the cancellation policy differ by package tier?",
        a: "No, our cancellation terms apply consistently regardless of which package you've booked.",
      },
      {
        q: "How do I request a cancellation?",
        a: "Message us on WhatsApp with your booking details and the reason for cancellation, and we'll guide you through the process.",
      },
      {
        q: "What happens to my advance payment if I cancel?",
        a: "This depends on timing — message us your specific situation and we'll explain what applies.",
      },
      {
        q: "Who do I contact for cancellation questions?",
        a: "Message us on WhatsApp with your booking details, and we'll address your specific situation.",
      },
    ],
  },

  "baraat-customization-options": {
    slug: "baraat-customization-options",
    intro:
      "Baraat customization options let you tailor elements of your entry within our package structure — from custom LED name lettering to specific song requests and lighting themes.\n\nPlanMyBaraat's Maharaja and Signature packages offer the most room for customization, on top of the reliable base every package includes.",
    explanation:
      "While the core structure of each package is fixed, there's meaningful room to personalize within it — the exact spelling and style of the groom's name in LED lettering, preferred songs for the DJ set, specific timing for effects like pyro and confetti, and coordination of the safa team's turban colors with the wedding outfit.\n\nMessage us with your specific ideas, and we'll let you know what's possible within your chosen package tier, or whether a different tier might better accommodate what you're picturing.",
    whatsIncluded:
      "Customization varies by package: Maharaja and Signature offer LED name lettering and moving visual panels, while all tiers allow some level of song requests and turban style coordination.",
    pricingGuidance:
      "Customization options are generally included within the relevant package tier rather than priced as separate add-ons. Message us on WhatsApp with your specific ideas, and we'll let you know what's possible and provide pricing.",
    bookingNotes:
      "Wedding season runs November to February. If you have specific customization requests, mention them early — 3-4 weeks' notice gives us time to plan the details properly.\n\nShare your date, city, venue, and any customization ideas when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and any customization ideas, and we'll let you know what's possible.",
    faqs: [
      {
        q: "What can I customize in my baraat entry?",
        a: "LED name lettering, song requests, effect timing, and turban color coordination are all areas where we can personalize within your package.",
      },
      {
        q: "Which package offers the most customization?",
        a: "Maharaja and Signature offer the most room, with LED visuals and custom lettering as part of their standard inclusions.",
      },
      {
        q: "Do customizations cost extra?",
        a: "Most customization options are included within the relevant package tier. Message us your specific request and we'll clarify any pricing.",
      },
      {
        q: "Can I request a specific color theme for the lighting?",
        a: "Message us with your preferences and we'll let you know what's possible for your package.",
      },
      {
        q: "How early should I share customization requests?",
        a: "As early as possible, ideally 3-4 weeks ahead, so we have time to plan the details properly.",
      },
      {
        q: "Can I request specific songs for the DJ?",
        a: "Yes, our DJ artists take requests ahead of time and build a set around your preferences.",
      },
      {
        q: "Can I customize the safa team's turban colors?",
        a: "Yes, message us with your outfit details and we'll coordinate the turban styling accordingly.",
      },
      {
        q: "How do I discuss my customization ideas?",
        a: "Message us on WhatsApp with your date, city, and specific ideas, and we'll let you know what's possible.",
      },
    ],
  },

  "how-far-in-advance-to-book-baraat": {
    slug: "how-far-in-advance-to-book-baraat",
    intro:
      "How far in advance to book baraat services depends on your wedding date — during peak season (November to February), we recommend 3-4 weeks' notice, while off-season dates often have more flexibility.\n\nPlanMyBaraat's trucks and dhol teams get booked out fast during the busiest months, so earlier is always safer.",
    explanation:
      "Wedding season in Gujarat concentrates heavily in the November to February window, meaning demand for trucks, dhol teams, and specific packages peaks during that stretch. Booking 3-4 weeks ahead gives you a good chance at your preferred package and date, though popular dates within peak season can fill up even earlier.\n\nFor larger productions like Signature, or requests involving specific customization like custom LED lettering, we recommend even more lead time to plan the details properly.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, subject to availability for your specific date.",
    pricingGuidance:
      "Pricing depends on the package tier, your city, date, and guest count. Message us on WhatsApp as early as possible to confirm availability and get a real quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe general guideline, with more lead time recommended for popular dates or larger packages.\n\nShare your date, city, venue, and preferred package when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date as early as possible, and we'll confirm what's still available.",
    faqs: [
      {
        q: "How far in advance should I book my baraat?",
        a: "3-4 weeks' notice is a safe general guideline during wedding season (November to February), with more lead time recommended for popular dates or larger packages.",
      },
      {
        q: "Is off-season booking more flexible?",
        a: "Yes, dates outside November to February often have more availability and can be booked with less lead time.",
      },
      {
        q: "Do I need more notice for the Signature package specifically?",
        a: "Yes, since it's a popular top-tier package, booking earlier gives you a better chance at securing it for your date.",
      },
      {
        q: "What happens if I book last minute?",
        a: "Message us anyway — we'll check what's available for your date, though options may be more limited close to the event.",
      },
      {
        q: "Does custom LED lettering need extra lead time?",
        a: "Yes, since the name board is custom-built, sharing details as early as possible helps us prepare it properly.",
      },
      {
        q: "Are certain dates within wedding season busier than others?",
        a: "Yes, auspicious dates can be especially busy — mention your specific date and we'll confirm availability directly.",
      },
      {
        q: "Can I lock in a date without finalizing every detail?",
        a: "Yes, an advance payment can secure your date while we finalize package specifics closer to the event.",
      },
      {
        q: "How do I check availability for my date?",
        a: "Message us on WhatsApp with your wedding date and city, and we'll confirm what's available.",
      },
    ],
  },

  "baraat-booking-for-wedding-season": {
    slug: "baraat-booking-for-wedding-season",
    intro:
      "Baraat booking for wedding season (November to February) requires earlier planning than off-season dates, since trucks, dhol teams, and popular packages get booked out fast during Gujarat's busiest wedding months.\n\nPlanMyBaraat recommends 3-4 weeks' notice at minimum for peak season bookings.",
    explanation:
      "The concentration of weddings during this window means our team and equipment are in high demand simultaneously across the cities and towns we cover. Booking early gives you the best chance at your preferred package, and specific dates within the season (especially auspicious dates) can fill up even faster.\n\nFor destination-style venues or requests involving customization like specific LED lettering, we recommend booking even earlier to allow time for the additional planning involved.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, subject to availability during the busy wedding season.",
    pricingGuidance:
      "Pricing depends on the package tier, your city, date, and guest count. Message us on WhatsApp as early as possible during wedding season for a real quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe minimum, with earlier booking recommended for popular dates.\n\nShare your date, city, venue, and preferred package when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date as early as possible during the season, and we'll confirm availability.",
    faqs: [
      {
        q: "Why is wedding season booking more urgent?",
        a: "November to February concentrates most weddings in Gujarat, so demand for trucks, dhol teams, and packages peaks simultaneously across all the areas we cover.",
      },
      {
        q: "How early should I book during wedding season?",
        a: "3-4 weeks' notice is a safe minimum, with earlier booking recommended for particularly popular or auspicious dates.",
      },
      {
        q: "Are auspicious dates busier than others?",
        a: "Yes, mention your specific date and we'll confirm availability directly, since these can fill up especially fast.",
      },
      {
        q: "Does booking early guarantee my preferred package?",
        a: "It significantly improves your chances, though we recommend confirming as soon as you've decided.",
      },
      {
        q: "What if I'm planning a destination wedding during peak season?",
        a: "We recommend booking even earlier for destination venues, given the additional route and logistics planning involved.",
      },
      {
        q: "Does custom production, like Signature's effects, need extra lead time?",
        a: "Yes, more elaborate packages benefit from earlier booking to plan the details properly.",
      },
      {
        q: "What happens if my preferred date is already booked?",
        a: "Message us anyway — we'll let you know what's available and can suggest alternatives if needed.",
      },
      {
        q: "How do I secure my wedding season date?",
        a: "Message us on WhatsApp with your date and city as early as possible, and we'll confirm availability and next steps.",
      },
    ],
  },

  "wedding-procession-planner": {
    slug: "wedding-procession-planner",
    intro:
      "A wedding procession planner coordinates the full baraat entry — truck, dhol team, vintage car, and safa team — as one managed operation rather than separate pieces you'd need to arrange independently.\n\nPlanMyBaraat serves this role, planning the route, timing, and overall flow of your specific procession.",
    explanation:
      "Planning a wedding procession involves more than booking a truck — it means mapping the route from starting point to venue, timing the groom's vintage car arrival, coordinating the dhol team with the DJ's set, and making sure the safa team has everyone styled before the walk begins.\n\nOur team handles this planning as part of every package, drawing on experience across the cities and towns we cover to anticipate route challenges, timing considerations, and venue-specific logistics.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, with full procession planning included as part of the service.",
    pricingGuidance:
      "Pricing depends on the package tier, your city, date, and guest count. Message us on WhatsApp for a real quote covering the full planned entry.",
    bookingNotes:
      "Wedding season runs November to February, and demand for procession planning peaks during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue, and we'll start planning your procession.",
    faqs: [
      {
        q: "What does a wedding procession planner do?",
        a: "Maps the route, times the vintage car and truck arrival, coordinates the dhol team with the DJ, and ensures the safa team has everyone styled before the walk begins.",
      },
      {
        q: "How much does a wedding procession planner cost?",
        a: "It depends on the package tier, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is procession planning included with every package?",
        a: "Yes, route and timing planning is part of every package we offer, not a separate service.",
      },
      {
        q: "How early should I involve a procession planner?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since demand peaks then.",
      },
      {
        q: "Does the planner account for venue-specific logistics?",
        a: "Yes, we factor in your specific venue's road access, parking, and typical timing when planning your entry.",
      },
      {
        q: "Can the planner handle unexpected changes on the day?",
        a: "Yes, our experienced team can adjust timing if needed, since they're familiar with baraat-specific coordination.",
      },
      {
        q: "Which cities do you plan processions in?",
        a: "Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat.",
      },
      {
        q: "How do I get started with procession planning?",
        a: "Message us on WhatsApp with your wedding date, city, and venue, and we'll begin planning your entry.",
      },
    ],
  },

  "book-wedding-entertainment-online": {
    slug: "book-wedding-entertainment-online",
    intro:
      "Book wedding entertainment online for your baraat with PlanMyBaraat — a WhatsApp-based process covering the DJ truck, dhol team, and any entertainers or effects included in your chosen package.\n\nMessage us your date, city, and rough guest count, and we'll recommend a package and confirm availability, usually within the hour.",
    explanation:
      "Our entertainment offering centers on the baraat entry specifically: a live DJ performing from the truck, a dhol team keeping the rhythm, and (from Rajwada upward) a costumed entertainer engaging directly with the crowd. Higher packages add visual entertainment through LED effects, pyro, and confetti.\n\nBooking online through WhatsApp lets you browse what's included at each tier, ask questions, and confirm whenever is convenient, without needing a phone call during specific hours.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, and dhol team. Rajwada adds a teddy or gorilla performer. Maharaja and Signature add LED visuals and (in Signature) pyro and confetti effects.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. We quote based on your date, city, and guest count. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and entertainment booking slots fill up fast during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you message us.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and venue to book your baraat entertainment, usually confirmed within the hour.",
    faqs: [
      {
        q: "How do I book wedding entertainment online for my baraat?",
        a: "Message us on WhatsApp with your wedding date, city, venue, and rough guest count. We'll recommend a package and confirm availability, usually within the hour.",
      },
      {
        q: "What entertainment is included in the packages?",
        a: "A live DJ, dhol team, and (from Rajwada upward) a costumed entertainer, plus LED visuals and effects at higher tiers.",
      },
      {
        q: "How much does wedding entertainment cost?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Can I see videos of the entertainment before booking?",
        a: "Yes, message us on WhatsApp and we'll share videos of past entries.",
      },
      {
        q: "Is there a form to fill out for online booking?",
        a: "No, WhatsApp is our main booking channel — it's faster and lets us share quotes and answer questions directly.",
      },
      {
        q: "How early should I book entertainment for my baraat?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since slots fill up fast.",
      },
      {
        q: "Does the entertainer interact with guests directly?",
        a: "Yes, the costumed performer moves through the crowd, dancing with guests and creating interactive moments.",
      },
      {
        q: "How do I confirm my booking?",
        a: "Message us on WhatsApp with your wedding date, city, and venue, and we'll guide you through confirming your package.",
      },
    ],
  },

  "how-many-dhol-players-needed-for-baraat": {
    slug: "how-many-dhol-players-needed-for-baraat",
    intro:
      "How many dhol players needed for baraat depends mostly on your guest count and how much energy you want the procession to have — PlanMyBaraat's packages range from 2 players in Raj Tilak up to 6 in Signature.\n\nFor most mid-sized weddings, 2-4 dhol players provide plenty of energy, while larger celebrations often benefit from the full 6-player lineup.",
    explanation:
      "For a smaller, more intimate guest list, 2 dhol players (Raj Tilak) usually provide enough rhythm and energy without feeling excessive. As guest count grows, more players help the sound carry across a bigger, more spread-out crowd and keep the energy consistent throughout a longer procession.\n\n6 dhol players, included in Maharaja and Signature, work well for larger celebrations or when the family specifically wants a bigger, more elaborate sound presence throughout the entry.",
    whatsIncluded:
      "Raj Tilak includes 2 dhol players. Rajwada steps up to 4. Maharaja and Signature both include 6, alongside the truck, DJ, chhatri lights, a vintage car, and a safa team.",
    pricingGuidance:
      "Pricing depends on the package tier and dhol count. Message us on WhatsApp with your guest count, and we'll recommend the right number of players and give you a real quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your rough guest count, and we'll recommend the right dhol team size for your baraat.",
    faqs: [
      {
        q: "How many dhol players do I need for a small wedding?",
        a: "2 dhol players (included in Raj Tilak) usually provide plenty of energy for a smaller, more intimate guest list.",
      },
      {
        q: "How many dhol players do I need for a large wedding?",
        a: "6 dhol players (included in Maharaja and Signature) work well for larger celebrations with bigger guest counts.",
      },
      {
        q: "Is 4 dhol players a good middle ground?",
        a: "Yes, Rajwada's 4 dhol players suit mid-sized weddings that want more energy than the starting tier but don't need the full 6-player lineup.",
      },
      {
        q: "Does more dhol players cost more?",
        a: "Dhol count scales with the package tier, so more players come with the corresponding package price. Message us for a real quote.",
      },
      {
        q: "Can I request extra dhol players beyond my package?",
        a: "Message us with your specific requirements and we'll let you know what's possible for your booking.",
      },
      {
        q: "How early should I decide on dhol count?",
        a: "As early as possible, ideally 3-4 weeks ahead during wedding season (November to February), so we can confirm the right package.",
      },
      {
        q: "Do more dhol players mean a louder, more chaotic sound?",
        a: "No, our players are experienced and coordinate together, so more players add fuller sound rather than chaos.",
      },
      {
        q: "How do I decide on the right number for my wedding?",
        a: "Message us your rough guest count on WhatsApp and we'll recommend the package with the right dhol count.",
      },
    ],
  },

  "what-is-included-in-a-baraat-setup": {
    slug: "what-is-included-in-a-baraat-setup",
    intro:
      "What is included in a baraat setup with PlanMyBaraat is the same core across every package: a DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team — with more production added at higher tiers.\n\nUnderstanding what's included helps you compare our packages against any other quotes you might be considering.",
    explanation:
      "Raj Tilak, our starting package, includes the truck, DJ, 2 dhol players, chhatri lights, a vintage car, and safa team turban styling. Rajwada adds 2 more dhol and a teddy or gorilla performer. Maharaja brings moving LED panels and the groom's name lit up. Signature, our top package, adds a security team plus pyro and confetti effects.\n\nAcross all tiers, the setup is designed as a complete entry, not a truck rental with everything else arranged separately — this is worth keeping in mind when comparing against other providers who might only offer the truck.",
    whatsIncluded:
      "Raj Tilak: truck, DJ, 2 dhol, chhatri lights, car, safa team. Rajwada: adds 2 dhol and an entertainer. Maharaja: 6 dhol, LED panels, custom lettering. Signature: adds pyro, confetti, CO2 effects, fake money gun, American vintage car, and security.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll walk you through exactly what's included in each package.",
    faqs: [
      {
        q: "What's included in the basic baraat setup?",
        a: "Raj Tilak includes the truck, DJ, 2 dhol, chhatri lights, a vintage car, and a safa team — a complete entry at our most affordable tier.",
      },
      {
        q: "Is the vintage car included or a separate cost?",
        a: "It's included in every package from Raj Tilak upward, not a separate cost.",
      },
      {
        q: "What's included in the top-tier setup?",
        a: "Signature includes 6 dhol, moving LED panels, custom name lighting, pyro and confetti effects, an American vintage car, and 4 professional bouncers.",
      },
      {
        q: "Is the safa team part of every setup?",
        a: "Yes, turban styling for the groom and baraati group is included in every package.",
      },
      {
        q: "Does the setup include the DJ's performance or just equipment?",
        a: "Both — a professional DJ artist performs live from the truck, not just equipment rental.",
      },
      {
        q: "How do the setups differ in terms of dhol count?",
        a: "Raj Tilak has 2, Rajwada has 4, and Maharaja and Signature both have 6 dhol players.",
      },
      {
        q: "Are effects like pyro included in every setup?",
        a: "No, pyro and confetti effects are specific to the Signature package.",
      },
      {
        q: "How do I get exact details for my specific event?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll walk you through the package options.",
      },
    ],
  },

  "things-to-know-before-booking-baraat": {
    slug: "things-to-know-before-booking-baraat",
    intro:
      "Things to know before booking baraat services include understanding what's included in each package, how far in advance to book, and what details help us give you an accurate quote.\n\nThis quick guide covers what to think about before reaching out to PlanMyBaraat.",
    explanation:
      "First, know your rough guest count — this affects how many dhol players and how strong a sound system you'll want. Second, know your venue and any access considerations, like narrower roads or noise curfews, since these affect route planning. Third, decide your priorities: a solid, reliable entry (Raj Tilak) versus a bigger, more elaborate production (Maharaja or Signature).\n\nFinally, timing matters — wedding season (November to February) books out fast, so reaching out 3-4 weeks ahead gives you the best chance at your preferred package and date.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, with the specifics varying by tier.",
    pricingGuidance:
      "Pricing depends on the package tier, your city, date, and guest count. Message us on WhatsApp with these details for a real, accurate quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll help you get started.",
    faqs: [
      {
        q: "What should I know before booking a baraat service?",
        a: "Your rough guest count, venue access details, your priorities (reliable entry vs. bigger production), and booking timing all matter for getting an accurate quote and the right package.",
      },
      {
        q: "How does guest count affect my booking?",
        a: "It affects how many dhol players and how strong a sound system you'll want — larger groups often benefit from higher-tier packages.",
      },
      {
        q: "Should I know about my venue's access before booking?",
        a: "Yes, narrower roads or noise curfews can affect route and timing planning, so sharing venue details helps us plan properly.",
      },
      {
        q: "How much does it typically cost?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "How early should I start the booking process?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
      {
        q: "What if I'm not sure which package fits my needs?",
        a: "Message us your priorities, guest count, and venue details, and we'll recommend the right tier.",
      },
      {
        q: "Do I need to decide on customizations before booking?",
        a: "Not necessarily, though mentioning any specific ideas early gives us more time to plan the details.",
      },
      {
        q: "What's the first step to booking?",
        a: "Message us on WhatsApp with your wedding date, city, and rough guest count, and we'll take it from there.",
      },
    ],
  },

  "best-time-for-baraat-entry": {
    slug: "best-time-for-baraat-entry",
    intro:
      "The best time for baraat entry is typically evening, when chhatri lights, LED visuals, and any pyro or confetti effects have the most visual impact, and temperatures are more comfortable for dancing.\n\nPlanMyBaraat plans entries around your specific muhurat timing, coordinating the truck and dhol team's arrival to match.",
    explanation:
      "Evening entries let the truck's lighting — from chhatri lights in Raj Tilak to moving LED panels in Maharaja and Signature — really stand out, since these effects are far more visible after dark. Cooler evening temperatures also make for a more comfortable dancing experience for the baraati group.\n\nThat said, many families' muhurat timing is set by astrological considerations rather than pure preference, so we work with whatever timing your wedding requires, adjusting our setup and effects accordingly.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, planned around your specific entry timing.",
    pricingGuidance:
      "Pricing depends on the package tier, not the timing of your entry. Message us on WhatsApp with your date, time, and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and evening slots are especially popular during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, planned entry time, city, and venue when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and planned entry time, and we'll confirm availability.",
    faqs: [
      {
        q: "Is evening really the best time for a baraat entry?",
        a: "Evening entries let lighting effects stand out most and offer more comfortable temperatures, though many families' timing is set by their muhurat.",
      },
      {
        q: "Can you accommodate a daytime entry too?",
        a: "Yes, we work with whatever timing your wedding requires, adjusting the setup accordingly.",
      },
      {
        q: "Does entry timing affect the price?",
        a: "No, pricing depends on the package tier, not the specific time of your entry.",
      },
      {
        q: "Do LED effects work during the day?",
        a: "They're included regardless of timing, though they're most visually striking in the evening or at night.",
      },
      {
        q: "How early should I confirm my entry timing?",
        a: "Share it as early as possible when booking, ideally 3-4 weeks ahead during wedding season (November to February).",
      },
      {
        q: "What if my muhurat is set for early morning?",
        a: "We'll plan the setup around your specific timing, whatever it is.",
      },
      {
        q: "Does the dhol team's energy change based on timing?",
        a: "No, our team maintains consistent energy regardless of entry timing.",
      },
      {
        q: "How do I plan my entry timing with you?",
        a: "Message us on WhatsApp with your wedding date and planned time, and we'll confirm availability and plan accordingly.",
      },
    ],
  },

  "best-baraat-entry-ideas-for-winter": {
    slug: "best-baraat-entry-ideas-for-winter",
    intro:
      "Best baraat entry ideas for winter weddings, which make up most of Gujarat's wedding season (November to February), often lean into evening entries with full lighting production, since winter evenings are cool and comfortable for extended dancing.\n\nPlanMyBaraat's Maharaja and Signature packages, with their moving LED panels and effects, work especially well for winter's cooler, longer evening celebrations.",
    explanation:
      "Winter's comfortable evening temperatures mean guests can dance longer without the heat exhaustion that can affect entries during hotter months, making it a great time to go bigger with the entry itself. Full LED lighting, longer dhol performances, and effects like pyro and confetti all read especially well in winter's crisp evening air.\n\nBecause winter is also peak wedding season, booking early — 3-4 weeks ahead or more — is especially important to secure your preferred package and date.",
    whatsIncluded:
      "Maharaja includes moving LED panels and custom name lighting. Signature adds pyro, confetti, and CO2 effects on top, well suited to a full winter evening production.",
    pricingGuidance:
      "Pricing depends on the package tier, your city, and guest count. Message us on WhatsApp with your winter wedding date for a real quote.",
    bookingNotes:
      "Winter (November to February) is peak wedding season, and availability tightens significantly. 3-4 weeks' notice or more is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your winter wedding date and city, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "Why is winter a good time for a bigger baraat production?",
        a: "Cool evening temperatures let guests dance comfortably for longer, making it a great time for full lighting and effects production.",
      },
      {
        q: "Which package works best for a winter entry?",
        a: "Maharaja and Signature, with moving LED panels and effects, work especially well for winter's longer, cooler evening celebrations.",
      },
      {
        q: "How much does a winter baraat entry cost?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is winter more expensive because it's peak season?",
        a: "Pricing depends on the package tier rather than seasonal surcharges, though availability is tighter, so booking early matters.",
      },
      {
        q: "How early should I book for a winter wedding?",
        a: "3-4 weeks ahead or more is a safe window, since winter is peak wedding season across Gujarat.",
      },
      {
        q: "Do effects like pyro work well in winter?",
        a: "Yes, they read especially well in winter's crisp evening air, adding to the overall visual impact.",
      },
      {
        q: "Can the dhol team perform longer in cooler weather?",
        a: "Cooler temperatures generally make for a more comfortable, sustained performance for the whole team.",
      },
      {
        q: "How do I book for my winter wedding date?",
        a: "Message us on WhatsApp with your wedding date and city as early as possible, given how busy this season gets.",
      },
    ],
  },

  "best-baraat-entry-ideas-for-summer": {
    slug: "best-baraat-entry-ideas-for-summer",
    intro:
      "Best baraat entry ideas for summer weddings often favor shorter, well-timed evening entries, since Gujarat's summer heat makes extended daytime processions more demanding for guests.\n\nPlanMyBaraat can plan a summer entry timed for cooler evening hours, still delivering the full energy of the truck, dhol team, and effects.",
    explanation:
      "Summer weddings benefit from planning the baraat for later in the evening, after the day's peak heat has passed, so guests can dance comfortably. Keeping the procession route as direct as possible also helps, minimizing time spent walking in warmer conditions.\n\nOur team can advise on route and timing specifically to make the most of cooler hours, while still delivering a full, high-energy entry with the truck, dhol team, and any effects you've chosen.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, planned with summer timing considerations in mind.",
    pricingGuidance:
      "Pricing depends on the package tier, your city, date, and guest count, not the season itself. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Summer weddings happen outside Gujarat's main wedding season, so availability is often more flexible. Still, 2-3 weeks' notice is a good practice.\n\nShare your date, city, venue, and preferred evening timing when you reach out.",
    closing:
      "Message us on WhatsApp with your summer wedding date and city, and we'll help plan the timing for a comfortable, high-energy entry.",
    faqs: [
      {
        q: "Should I plan my summer baraat entry for the evening?",
        a: "Yes, timing it for after the day's peak heat has passed makes for a more comfortable experience for the whole baraati group.",
      },
      {
        q: "Does the route matter more in summer?",
        a: "Yes, keeping the route as direct as possible helps minimize time spent in warmer conditions.",
      },
      {
        q: "How much does a summer baraat entry cost?",
        a: "It depends on the package, dhol count, and any extra effects, not the season. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is summer availability more flexible than wedding season?",
        a: "Yes, since summer falls outside Gujarat's main wedding season (November to February), availability is often more flexible.",
      },
      {
        q: "How early should I book for a summer wedding?",
        a: "2-3 weeks' notice is a good general practice, even with the more flexible summer availability.",
      },
      {
        q: "Can the truck and dhol team handle summer heat?",
        a: "Yes, though we recommend evening timing for the most comfortable experience for guests and performers alike.",
      },
      {
        q: "Does the lighting still look good in summer evenings?",
        a: "Yes, chhatri lights and LED effects work well once the sun sets, regardless of season.",
      },
      {
        q: "How do I plan my summer entry timing?",
        a: "Message us on WhatsApp with your date, city, and venue, and we'll advise on the best evening timing.",
      },
    ],
  },

  "best-songs-for-baraat-entry": {
    slug: "best-songs-for-baraat-entry",
    intro:
      "Best songs for baraat entry usually mix high-energy Bollywood and Punjabi tracks that work well with live dhol drumming, building toward a strong finish as the truck arrives at the venue.\n\nPlanMyBaraat's DJ artists take song requests ahead of time and build a set tailored to your preferences and the pacing of your specific procession.",
    explanation:
      "A good baraat playlist typically opens with moderate-energy tracks to get the crowd moving, builds through the middle of the procession, and peaks with high-energy songs right as the truck approaches the venue — often timed with effects like pyro or confetti in higher packages.\n\nOur DJs are experienced with pacing a set for a moving, dancing crowd specifically, which is different from a fixed reception set, and they coordinate closely with the dhol team throughout.",
    whatsIncluded:
      "Every package includes a professional DJ artist who builds a custom set based on your preferences, alongside the dhol team, truck, vintage car, and safa team.",
    pricingGuidance:
      "Song selection and DJ performance are included in every package. Message us on WhatsApp with your date and city for a real quote, and share your song preferences when planning.",
    bookingNotes:
      "Wedding season runs November to February. If you have specific song requests, share them early — 3-4 weeks' notice gives the DJ time to prepare the set properly.\n\nShare your date, city, venue, and song preferences when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and favorite songs, and we'll build a set around your preferences.",
    faqs: [
      {
        q: "Can I choose the songs for my baraat entry?",
        a: "Yes, our DJ artists take requests ahead of time and build a custom set around your preferences.",
      },
      {
        q: "What kind of music works best for a baraat?",
        a: "High-energy Bollywood and Punjabi tracks that work well with live dhol drumming tend to work best for a dancing, moving crowd.",
      },
      {
        q: "Does the set build toward a specific climax?",
        a: "Yes, our DJs typically build energy through the procession, peaking right as the truck approaches the venue.",
      },
      {
        q: "How early should I share my song preferences?",
        a: "As early as possible, ideally 3-4 weeks ahead, so the DJ has time to prepare the set properly.",
      },
      {
        q: "Does the DJ coordinate with the dhol team's rhythm?",
        a: "Yes, they work together throughout the procession, with the dhol filling in during transitions.",
      },
      {
        q: "Can I request regional or specific language songs?",
        a: "Yes, message us your preferences and we'll let you know what's possible.",
      },
      {
        q: "Is there an extra cost for custom song requests?",
        a: "No, song selection is part of the DJ service included in every package.",
      },
      {
        q: "How do I share my song list with the DJ?",
        a: "Message us on WhatsApp with your preferences when you book, and we'll pass them along to the DJ.",
      },
    ],
  },

  "groom-entry-song-ideas": {
    slug: "groom-entry-song-ideas",
    intro:
      "Groom entry song ideas usually focus on tracks with a strong, celebratory build — something that feels like a proper welcome as the groom joins the procession in his vintage car.\n\nPlanMyBaraat's DJ artists can time specific songs to the groom's arrival moment, coordinated with the truck and dhol team.",
    explanation:
      "The groom's specific entry moment — stepping out of the vintage car and joining the procession — often gets its own musical cue, distinct from the general dancing playlist that plays throughout the walk. Many families choose a track with personal significance or a strong, anthemic feel for this specific moment.\n\nOur DJs can plan this transition carefully, timing the shift from general procession music to the groom's specific entry song, then back into the broader set as the baraat continues toward the venue.",
    whatsIncluded:
      "Every package includes a professional DJ artist who can time specific songs to key moments like the groom's entry, alongside the dhol team, truck, vintage car, and safa team.",
    pricingGuidance:
      "Song timing and DJ performance are included in every package. Message us on WhatsApp with your date and city for a real quote, and share your song preferences when planning.",
    bookingNotes:
      "Wedding season runs November to February. If you have a specific song for the groom's entry, mention it early — 3-4 weeks' notice gives the DJ time to prepare.\n\nShare your date, city, venue, and song preference when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and your chosen groom entry song, and we'll plan the timing.",
    faqs: [
      {
        q: "Can I choose a specific song for the groom's entry moment?",
        a: "Yes, message us your preference and our DJ will time it specifically to the groom's arrival.",
      },
      {
        q: "What kind of songs work well for this moment?",
        a: "Tracks with a strong, celebratory build or personal significance to the couple tend to work well for this specific cue.",
      },
      {
        q: "How does the DJ transition from this song back to the general set?",
        a: "Our DJs plan the transition carefully, moving from the groom's specific entry song back into the broader dancing playlist as the procession continues.",
      },
      {
        q: "How early should I choose the groom's entry song?",
        a: "As early as possible, ideally 3-4 weeks ahead, so the DJ has time to prepare and plan the timing.",
      },
      {
        q: "Can the song coordinate with visual effects too?",
        a: "Yes, message us if you want the entry song timed with effects like pyro or confetti (available in Maharaja and Signature).",
      },
      {
        q: "Is there an extra cost for a specific entry song?",
        a: "No, this is part of the DJ service included in every package.",
      },
      {
        q: "Can I choose a song with personal meaning to us?",
        a: "Yes, message us your choice and we'll incorporate it into the set.",
      },
      {
        q: "How do I share my chosen song?",
        a: "Message us on WhatsApp with your preference when you book, and we'll pass it along to the DJ.",
      },
    ],
  },

  "baraat-dance-songs": {
    slug: "baraat-dance-songs",
    intro:
      "Baraat dance songs are the tracks that keep the baraati group moving throughout the procession, mixed by the DJ to match the crowd's energy and coordinate with the live dhol drumming.\n\nPlanMyBaraat's DJ artists build a dance-focused set for the whole entry, taking requests ahead of time.",
    explanation:
      "A good baraat dance set typically mixes Bollywood, Punjabi, and other high-energy tracks, transitioning smoothly to keep the crowd dancing continuously rather than stopping between songs. Our DJs are experienced with reading a moving, outdoor crowd's energy and adjusting the set accordingly.\n\nThe dance songs work alongside the dhol team's live drumming, sometimes with the dhol taking over during transitions to keep the energy from dipping.",
    whatsIncluded:
      "Every package includes a professional DJ artist who builds a dance-focused set for your procession, alongside the dhol team, truck, vintage car, and safa team.",
    pricingGuidance:
      "Dance song selection and DJ performance are included in every package. Message us on WhatsApp with your date and city for a real quote, and share your preferences when planning.",
    bookingNotes:
      "Wedding season runs November to February. If you have specific song requests, share them early — 3-4 weeks' notice gives the DJ time to prepare the set properly.\n\nShare your date, city, venue, and song preferences when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and favorite dance songs, and we'll build a set around your preferences.",
    faqs: [
      {
        q: "What genres work best for baraat dance songs?",
        a: "Bollywood, Punjabi, and other high-energy tracks tend to work well for a dancing, moving procession crowd.",
      },
      {
        q: "Can I request specific dance songs?",
        a: "Yes, our DJ artists take requests ahead of time and build a set around your preferences.",
      },
      {
        q: "Does the music ever stop during the procession?",
        a: "No, the set is designed to run continuously, with the dhol team filling in during any transitions.",
      },
      {
        q: "How early should I share my song requests?",
        a: "As early as possible, ideally 3-4 weeks ahead, so the DJ has time to build the set properly.",
      },
      {
        q: "Does the DJ adjust the set based on the crowd's energy?",
        a: "Yes, our DJs are experienced with reading a moving, outdoor crowd and adjusting accordingly.",
      },
      {
        q: "Is there an extra cost for song requests?",
        a: "No, this is part of the DJ service included in every package.",
      },
      {
        q: "Can I request a mix of old and new songs?",
        a: "Yes, message us your preferences and we'll let you know what's possible for the set.",
      },
      {
        q: "How do I share my preferred dance songs?",
        a: "Message us on WhatsApp with your preferences when you book, and we'll pass them along to the DJ.",
      },
    ],
  },

  "baraat-rituals-and-meaning": {
    slug: "baraat-rituals-and-meaning",
    intro:
      "Baraat rituals and meaning trace back to the groom's traditional procession to the wedding venue, historically on horseback, symbolizing his journey to claim his bride and formally begin the wedding ceremony.\n\nPlanMyBaraat helps modernize this tradition with a double decker DJ truck, dhol team, vintage car, and safa team, while keeping the core spirit of a joyful, celebratory procession intact.",
    explanation:
      "The baraat represents the groom's family and friends accompanying him to the bride's venue, a public, celebratory declaration of the wedding before the couple's union is formalized. The music, dancing, and overall energy of the procession are meant to express joy and community support for the couple.\n\nWhile the specific transportation has evolved — from horses to baggis to vintage cars and now often DJ trucks — the underlying meaning remains: a public, joyful procession marking this significant transition for the groom and his family.",
    whatsIncluded:
      "Every package includes the modern elements that carry this tradition forward: the DJ truck, dhol team, vintage car or baggi, and safa team turban styling for the groom and baraatis.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll help plan a baraat that honors the tradition with modern production.",
    faqs: [
      {
        q: "What does the baraat symbolize traditionally?",
        a: "It represents the groom's journey to the bride's venue, accompanied by family and friends, as a public, joyful declaration before the wedding ceremony.",
      },
      {
        q: "How has the baraat evolved over time?",
        a: "Transportation has shifted from horses to baggis, vintage cars, and now often DJ trucks, though the core meaning of a celebratory procession remains.",
      },
      {
        q: "Does a modern DJ truck entry lose the traditional meaning?",
        a: "No, the underlying spirit — a public, joyful procession celebrating the groom's journey — carries forward even with modern production elements.",
      },
      {
        q: "Why is the safa or turban part of the tradition?",
        a: "Turban styling is a traditional element of the groom's ceremonial dress for this significant procession.",
      },
      {
        q: "Is the vintage car a traditional element?",
        a: "It represents an evolution of the traditional horse or baggi arrival, while our packages also offer the baggi option for a more classic feel.",
      },
      {
        q: "Does the dhol have specific ritual significance?",
        a: "The dhol has long been part of Indian wedding celebrations, providing the rhythmic, celebratory energy central to the procession's joyful character.",
      },
      {
        q: "How can I honor the tradition while adding modern elements?",
        a: "Message us your preferences, and we'll help balance traditional elements like the safa and baggi with modern production like the DJ truck and lighting.",
      },
      {
        q: "How do I plan a baraat that fits both traditional and modern elements?",
        a: "Message us on WhatsApp with your vision, date, and city, and we'll recommend a package that fits.",
      },
    ],
  },

  "what-happens-during-baraat-ceremony": {
    slug: "what-happens-during-baraat-ceremony",
    intro:
      "What happens during baraat ceremony is essentially the groom's procession to the venue — starting with his arrival in a vintage car, joining the dancing crowd, DJ truck, and dhol team, and ending with the formal entrance at the venue gate.\n\nPlanMyBaraat coordinates this whole sequence as one managed entry.",
    explanation:
      "The ceremony typically starts with the groom, often styled with a safa turban, arriving in a vintage car or baggi. He then joins the broader baraati group — family and friends dancing alongside the DJ truck and dhol team — for the walk toward the venue. Along the way, the music builds, effects may be timed to specific moments in higher packages, and the whole group moves together toward the entrance.\n\nAt the venue, the bride's family traditionally welcomes the baraat, often with a ritual greeting, before the wedding ceremony itself begins. Our role focuses specifically on the procession leading up to this point.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, coordinating the full procession sequence.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll help plan the full baraat sequence for your event.",
    faqs: [
      {
        q: "What's the typical sequence of events during a baraat?",
        a: "The groom arrives in a vintage car (often styled with a safa turban), joins the dancing crowd alongside the DJ truck and dhol team, and the whole group processes toward the venue entrance.",
      },
      {
        q: "Does the ceremony include a welcome at the venue?",
        a: "Traditionally, yes — the bride's family often welcomes the baraat with a ritual greeting before the wedding ceremony begins.",
      },
      {
        q: "How long does the baraat procession typically last?",
        a: "It varies based on route length and pacing, and we'll help plan timing based on your specific venue and preferences.",
      },
      {
        q: "Does the music play throughout the whole procession?",
        a: "Yes, our DJ performs continuously from the truck, with the dhol team filling in during transitions.",
      },
      {
        q: "Is the groom's safa styled before or during the procession?",
        a: "Before — our My Safa team styles the turban ahead of time so the groom is ready when the procession begins.",
      },
      {
        q: "What role does PlanMyBaraat play in this sequence?",
        a: "We handle the truck, dhol team, vintage car, and safa team coordination for the procession leading up to the venue entrance.",
      },
      {
        q: "Can effects be timed to specific moments in the ceremony?",
        a: "Yes, higher packages like Maharaja and Signature include effects that can be timed to key moments like the venue arrival.",
      },
      {
        q: "How do I plan the full sequence for my wedding?",
        a: "Message us on WhatsApp with your date, city, and venue, and we'll help plan the procession from start to finish.",
      },
    ],
  },

  "groom-procession-meaning": {
    slug: "groom-procession-meaning",
    intro:
      "Groom procession meaning centers on the symbolic journey the groom takes with family and friends to the wedding venue, a public celebration marking this significant life transition before the formal ceremony begins.\n\nPlanMyBaraat helps bring this tradition to life with a modern production: DJ truck, dhol team, vintage car, and safa team.",
    explanation:
      "The procession represents more than just transportation — it's a public declaration of the wedding, with the groom's community accompanying him in celebration. The music, dancing, and overall energy express collective joy and support, rather than a quiet, private journey.\n\nHistorically involving horses or carriages, the procession has modernized over time, with many families now choosing a DJ truck-led entry for a bigger, more elaborate celebration, while keeping the core meaning — a joyful, communal journey — intact.",
    whatsIncluded:
      "Every package includes the elements that carry this tradition forward: the DJ truck, dhol team, vintage car or baggi, and safa team turban styling.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll help plan a procession that honors this tradition.",
    faqs: [
      {
        q: "What does the groom's procession symbolize?",
        a: "It's a public celebration of the groom's journey to the wedding venue, accompanied by family and friends, marking a significant life transition.",
      },
      {
        q: "Why is the procession celebratory rather than quiet?",
        a: "It's meant to express collective joy and community support for the couple, which is why music and dancing are central to the tradition.",
      },
      {
        q: "Has the procession's transportation changed over time?",
        a: "Yes, from horses and carriages historically to vintage cars and DJ trucks in many modern celebrations, though the core meaning remains.",
      },
      {
        q: "Does a modern production still carry the traditional meaning?",
        a: "Yes, the celebratory, communal spirit of the procession carries forward even with modern elements like the DJ truck and lighting.",
      },
      {
        q: "Is the safa turban part of the procession's traditional significance?",
        a: "Yes, it's part of the groom's ceremonial dress for this significant journey.",
      },
      {
        q: "Can I keep more traditional elements in my procession?",
        a: "Yes, our baggi option and safa styling help preserve traditional elements alongside the modern truck production.",
      },
      {
        q: "How does PlanMyBaraat approach this tradition?",
        a: "We aim to balance traditional elements with modern production, coordinated as one complete package.",
      },
      {
        q: "How do I plan a procession that fits my vision?",
        a: "Message us on WhatsApp with your preferences, date, and city, and we'll recommend the right package.",
      },
    ],
  },

  "groom-procession-traditions-india": {
    slug: "groom-procession-traditions-india",
    intro:
      "Groom procession traditions across India vary by region, but the core idea is consistent — the groom, accompanied by family and friends, travels to the wedding venue in a celebratory, public procession.\n\nPlanMyBaraat brings this tradition to life in Gujarat with a modern production: DJ truck, dhol team, vintage car, and safa team.",
    explanation:
      "Different regions have their own specific customs — the ghodi (horse) tradition especially prominent in North Indian weddings, various styles of dhol and band accompaniment, and regional variations in the groom's attire and turban styling. In Gujarat specifically, baraats have embraced the modern DJ truck format, blending regional traditions with contemporary production.\n\nOur packages reflect this blend, keeping traditional elements like the safa turban and vintage car or baggi option, while adding modern elements like the DJ truck and lighting production that have become standard for Gujarat weddings.",
    whatsIncluded:
      "Every package includes the DJ truck, dhol team, vintage car or baggi, and safa team, reflecting a blend of traditional and modern procession elements.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll help plan a procession honoring your specific traditions.",
    faqs: [
      {
        q: "Do groom procession traditions vary across India?",
        a: "Yes, different regions have their own specific customs, though the core idea of a celebratory, public procession to the venue is consistent.",
      },
      {
        q: "What's the tradition specific to Gujarat weddings?",
        a: "Gujarat has embraced the modern DJ truck format for baraat entries, blending regional traditions with contemporary production.",
      },
      {
        q: "Is the ghodi (horse) tradition common in Gujarat?",
        a: "It's more prominent in North Indian-style weddings, though some families incorporate it. Message us if this specifically matters to your entry.",
      },
      {
        q: "How does PlanMyBaraat blend tradition and modern production?",
        a: "We keep traditional elements like the safa turban and vintage car or baggi option, while adding modern elements like the DJ truck and lighting.",
      },
      {
        q: "Can I incorporate specific regional traditions from my family?",
        a: "Message us your specific traditions and we'll let you know what's possible to incorporate.",
      },
      {
        q: "Does the safa styling vary by region?",
        a: "Yes, and our stylists are experienced with different regional turban styles — mention your specific tradition when booking.",
      },
      {
        q: "How much does a procession honoring specific traditions cost?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "How do I plan a procession that fits my family's traditions?",
        a: "Message us on WhatsApp with your specific customs, date, and city, and we'll advise on what's possible.",
      },
    ],
  },

  "modern-baraat-entry-ideas": {
    slug: "modern-baraat-entry-ideas",
    intro:
      "Modern baraat entry ideas center on the DJ truck format — moving LED panels, custom lighting, effects like pyro and confetti, and a live DJ set — a significant shift from the traditional small band and walking procession.\n\nPlanMyBaraat's Maharaja and Signature packages are built specifically around this modern production style.",
    explanation:
      "Modern entries treat the baraat as a full production, not just transportation — the truck becomes a moving stage with sound, lighting, and visual effects timed to specific moments. This shift has become especially popular in Gujarat, where families increasingly want the entry itself to feel like a memorable event.\n\nOur higher-tier packages layer in these modern elements progressively: Maharaja brings moving LED panels and custom name lettering, while Signature adds pyro highlights, confetti, CO2 effects, a fake money gun, and a dedicated security team for full crowd management.",
    whatsIncluded:
      "Maharaja includes 6 dhol, moving LED panels, and custom name lighting. Signature adds pyro, confetti, CO2 effects, a fake money gun, an American vintage car, and a security team.",
    pricingGuidance:
      "Pricing depends on the package tier and how much modern production you want. Message us on WhatsApp with your date and city for a real quote on Maharaja or Signature.",
    bookingNotes:
      "Wedding season runs November to February, and our modern-production packages are especially popular during that stretch. 3-4 weeks' notice or more is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll recommend the right modern package for your vision.",
    faqs: [
      {
        q: "What makes an entry feel 'modern'?",
        a: "Moving LED panels, custom lighting, effects like pyro and confetti, and a live DJ set — a significant production beyond the traditional walking procession.",
      },
      {
        q: "Which package is best for a modern entry?",
        a: "Maharaja and Signature are built specifically for this, with LED visuals and (in Signature) a full effects lineup.",
      },
      {
        q: "How much does a modern baraat entry cost?",
        a: "It depends on the package tier. Message your date and city on WhatsApp for a real quote on Maharaja or Signature.",
      },
      {
        q: "Is a modern entry more complex to plan?",
        a: "It requires more coordination for effects timing, which is why we recommend booking earlier for these packages.",
      },
      {
        q: "How early should I book for a modern production entry?",
        a: "3-4 weeks ahead or more during wedding season (November to February) is a safe window.",
      },
      {
        q: "Does modern mean losing traditional elements entirely?",
        a: "No, the safa turban and vintage car remain part of every package, blending tradition with modern production.",
      },
      {
        q: "Can I see examples of modern entries you've done?",
        a: "Yes, message us on WhatsApp and we'll share photos and videos of past Maharaja and Signature entries.",
      },
      {
        q: "How do I plan a modern entry for my wedding?",
        a: "Message us on WhatsApp with your date, city, and vision, and we'll recommend the right package.",
      },
    ],
  },

  "traditional-baraat-entry-ideas": {
    slug: "traditional-baraat-entry-ideas",
    intro:
      "Traditional baraat entry ideas lean into classic elements — chhatri lighting, a baggi or vintage car, live dhol drumming, and safa turban styling — without the heavier modern production of LED panels and pyro effects.\n\nPlanMyBaraat's Raj Tilak and Rajwada packages fit this more classic, traditional feel.",
    explanation:
      "A traditional entry focuses on the fundamentals that have defined baraat processions for generations: warm chhatri lighting, the groom's classic vintage car or baggi arrival, live dhol drumming providing the celebratory rhythm, and coordinated safa turban styling for the groom and baraati group.\n\nOur Raj Tilak and Rajwada packages emphasize these traditional elements without the heavier LED visuals and effects found in Maharaja and Signature, giving families who prefer a more classic look a strong, complete option.",
    whatsIncluded:
      "Raj Tilak includes the truck, DJ, 2 dhol, chhatri lights, a vintage car or baggi, and a safa team. Rajwada adds 2 more dhol and a teddy or gorilla performer, still within a classic, traditional feel.",
    pricingGuidance:
      "Pricing depends on the package tier. Message us on WhatsApp with your date and city for a real quote on Raj Tilak or Rajwada.",
    bookingNotes:
      "Wedding season runs November to February. 2-3 weeks' notice is usually enough for these packages.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll recommend a traditional-style package for your entry.",
    faqs: [
      {
        q: "What makes an entry feel 'traditional'?",
        a: "Chhatri lighting, a baggi or vintage car, live dhol drumming, and safa turban styling, without the heavier LED and effects production of higher tiers.",
      },
      {
        q: "Which package is best for a traditional entry?",
        a: "Raj Tilak and Rajwada emphasize these classic elements without the heavier modern production.",
      },
      {
        q: "Can I choose a baggi instead of a vintage car for a traditional look?",
        a: "Yes, message us your preference and we'll confirm availability for a baggi-based entry.",
      },
      {
        q: "How much does a traditional baraat entry cost?",
        a: "It depends on the package. Message your date and city on WhatsApp for a real quote on Raj Tilak or Rajwada.",
      },
      {
        q: "How early should I book a traditional-style package?",
        a: "2-3 weeks' notice is usually enough, though earlier is always safer during wedding season (November to February).",
      },
      {
        q: "Does a traditional entry still include a DJ truck?",
        a: "Yes, all our packages include the truck and DJ, giving even a traditional-leaning entry a strong sound foundation.",
      },
      {
        q: "Is chhatri lighting part of the traditional look?",
        a: "Yes, it's the classic umbrella-style lighting included in every package, giving a warm, festive glow.",
      },
      {
        q: "How do I plan a traditional entry for my wedding?",
        a: "Message us on WhatsApp with your date, city, and vision, and we'll recommend Raj Tilak or Rajwada.",
      },
    ],
  },

  "baraat-entry-trends": {
    slug: "baraat-entry-trends",
    intro:
      "Baraat entry trends have moved steadily toward bigger production over the past several years — moving LED panels, custom name lighting, and effects like pyro and confetti have become increasingly common, especially in Gujarat.\n\nPlanMyBaraat's Maharaja and Signature packages reflect these current trends, layered on top of the classic truck and dhol foundation.",
    explanation:
      "The biggest trend shift has been toward treating the truck as a visual production, not just a sound source — moving LED panels, custom lettering with the groom's name, and synchronized effects have become standard requests for families wanting a memorable, shareable entry.\n\nAt the same time, some families are leaning back into more traditional elements like baggis and classic chhatri lighting, so there's no single dominant trend — more a range of options families are mixing based on their specific preferences.",
    whatsIncluded:
      "Maharaja and Signature reflect current trends with LED panels, custom lettering, and (in Signature) pyro, confetti, and CO2 effects, while Raj Tilak and Rajwada maintain a more classic approach.",
    pricingGuidance:
      "Pricing depends on the package tier and how much current production you want to incorporate. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and trend-forward packages like Signature are especially popular during that stretch. 3-4 weeks' notice or more is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll help you incorporate current trends into your entry.",
    faqs: [
      {
        q: "What are the current baraat entry trends?",
        a: "Moving LED panels, custom name lighting, and effects like pyro and confetti have become increasingly common, especially in Gujarat.",
      },
      {
        q: "Which package reflects the latest trends?",
        a: "Maharaja and Signature are built specifically around this modern production style.",
      },
      {
        q: "Is everyone moving toward bigger production?",
        a: "Not entirely — some families are also leaning into traditional elements like baggis and classic lighting, so it's more a range of options than one dominant trend.",
      },
      {
        q: "How much does a trend-forward baraat entry cost?",
        a: "It depends on the package tier. Message your date and city on WhatsApp for a real quote on Maharaja or Signature.",
      },
      {
        q: "How early should I book for a trend-forward package?",
        a: "3-4 weeks ahead or more during wedding season (November to February) is a safe window, since these packages are popular.",
      },
      {
        q: "Can you show me examples of current trending entries?",
        a: "Yes, message us on WhatsApp and we'll share photos and videos of recent baraat entries.",
      },
      {
        q: "Are custom LED name displays a popular trend?",
        a: "Yes, they're one of the most requested modern touches, included in our Maharaja and Signature packages.",
      },
      {
        q: "How do I incorporate current trends into my entry?",
        a: "Message us on WhatsApp with your date, city, and vision, and we'll recommend the right package.",
      },
    ],
  },

  "how-to-plan-baraat-entry": {
    slug: "how-to-plan-baraat-entry",
    intro:
      "How to plan baraat entry starts with your priorities — a reliable, complete entry versus a bigger, more elaborate production — then your guest count, venue, and timing.\n\nPlanMyBaraat helps with this planning as part of every package, from Raj Tilak's essentials to Signature's full production.",
    explanation:
      "Start by deciding what matters most to you: if a solid, dependable entry with the core elements is the priority, Raj Tilak covers the truck, DJ, dhol, car, and safa team well. If visual production and effects matter more, Maharaja or Signature fit better.\n\nFrom there, share your guest count (which affects dhol count and sound needs), your venue details (which affect route planning), and your preferred timing (evening entries showcase lighting best). We'll use these details to recommend the right package and plan the specifics.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, with planning tailored to your specific event.",
    pricingGuidance:
      "Pricing depends on the package tier, your city, date, and guest count. Message us on WhatsApp with these details for a real quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates, giving us time to plan properly.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, city, and vision, and we'll help you plan your baraat entry step by step.",
    faqs: [
      {
        q: "Where do I start when planning a baraat entry?",
        a: "Decide your priorities first — a reliable entry (Raj Tilak) versus more production (Maharaja/Signature) — then share your guest count, venue, and timing with us.",
      },
      {
        q: "How does guest count factor into planning?",
        a: "It affects dhol count and sound system needs — a larger crowd often benefits from more players and stronger sound.",
      },
      {
        q: "Does venue location matter for planning?",
        a: "Yes, road width and access affect route planning, especially for larger trucks or a baggi-based entry.",
      },
      {
        q: "What timing should I plan for?",
        a: "Evening entries showcase lighting effects best, though we can plan around your specific muhurat timing.",
      },
      {
        q: "How much does baraat entry planning cost?",
        a: "It's included as part of your package. Message your date, city, and guest count on WhatsApp for a real quote.",
      },
      {
        q: "How early should I start planning?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, giving us time to plan properly.",
      },
      {
        q: "Can I make changes to my plan after booking?",
        a: "Message us if your plans change and we'll see what's possible depending on your date and timing.",
      },
      {
        q: "How do I get started planning?",
        a: "Message us on WhatsApp with your wedding date, city, and vision, and we'll walk you through the process.",
      },
    ],
  },

  "baraat-vs-wedding-procession": {
    slug: "baraat-vs-wedding-procession",
    intro:
      "Baraat vs wedding procession — the terms are often used interchangeably, though 'baraat' specifically refers to the Indian tradition of the groom's procession to the wedding venue, accompanied by family, friends, music, and dancing.\n\nPlanMyBaraat specializes specifically in this tradition, with packages built around the DJ truck, dhol team, vintage car, and safa team.",
    explanation:
      "A general 'wedding procession' could refer to various cultural traditions of moving toward a ceremony, but 'baraat' specifically carries the cultural weight and specific customs of Indian weddings — the celebratory, dancing energy, the dhol drumming, and the groom's traditional arrival, whether by horse, baggi, or modern vintage car.\n\nOur focus is specifically on the baraat tradition and its modern expression, which is why our packages are built around elements — the truck, dhol, safa styling — specific to this format rather than a generic procession service.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team — elements specific to the baraat tradition.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll help plan your baraat entry.",
    faqs: [
      {
        q: "Is baraat the same as a general wedding procession?",
        a: "Baraat specifically refers to the Indian tradition of the groom's celebratory procession, distinct from generic wedding processions in other cultures.",
      },
      {
        q: "What makes baraat distinct from other wedding traditions?",
        a: "The celebratory dancing, dhol drumming, and specific groom's arrival customs (horse, baggi, or vintage car) are unique to this tradition.",
      },
      {
        q: "Does PlanMyBaraat handle general wedding processions too?",
        a: "Our focus is specifically on the baraat tradition and its elements — truck, dhol, safa styling, and vintage car.",
      },
      {
        q: "Why is the dhol specific to baraat rather than general processions?",
        a: "It's a longstanding part of Indian wedding celebrations, providing the rhythmic, celebratory energy central to the baraat's character.",
      },
      {
        q: "How much does a baraat-specific entry cost?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Is the safa turban unique to the baraat tradition?",
        a: "It's a traditional element of the groom's ceremonial dress specifically for this celebratory procession.",
      },
      {
        q: "How early should I book for a baraat entry?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window.",
      },
      {
        q: "How do I plan my baraat specifically?",
        a: "Message us on WhatsApp with your date, city, and vision, and we'll recommend the right package for this specific tradition.",
      },
    ],
  },

  "indian-wedding-traditions-baraat": {
    slug: "indian-wedding-traditions-baraat",
    intro:
      "Indian wedding traditions place the baraat as one of the most celebrated moments — the groom's procession to the venue, accompanied by dancing family and friends, music, and drumming.\n\nPlanMyBaraat specializes in bringing this tradition to life across Gujarat with a modern DJ truck, dhol team, vintage car, and safa team.",
    explanation:
      "Within the broader arc of Indian wedding traditions — engagement ceremonies, mehendi, sangeet, and the main wedding ceremony — the baraat stands out as the most public and celebratory moment, a joyful declaration before the couple's formal union. It's meant to be loud, energetic, and memorable.\n\nOur role focuses specifically on this tradition, helping families execute a baraat that balances traditional elements (safa turban styling, vintage car or baggi arrival) with as much or as little modern production (DJ truck, LED lighting, effects) as they want.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car or baggi, and safa team — the core elements of a baraat celebration.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and city for a real quote.",
    bookingNotes:
      "Wedding season runs November to February. 3-4 weeks' notice is a safe bet for peak season dates.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll help plan a baraat that honors this important tradition.",
    faqs: [
      {
        q: "Where does the baraat fit within Indian wedding traditions?",
        a: "It's one of the most celebrated and public moments, the groom's procession to the venue, distinct from other pre-wedding functions like mehendi or sangeet.",
      },
      {
        q: "Why is the baraat considered so important?",
        a: "It's a joyful, public declaration before the couple's formal union, meant to be loud, energetic, and memorable for everyone involved.",
      },
      {
        q: "Does the tradition vary across Indian regions?",
        a: "Yes, different regions have their own specific customs, though the core spirit of a celebratory procession is broadly shared.",
      },
      {
        q: "How does PlanMyBaraat approach this tradition?",
        a: "We balance traditional elements — safa turban styling, vintage car or baggi — with modern production like the DJ truck and lighting, based on your preferences.",
      },
      {
        q: "How much does honoring this tradition cost?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "Can I keep the entry mostly traditional?",
        a: "Yes, Raj Tilak and Rajwada emphasize classic elements without the heavier LED and effects production of higher tiers.",
      },
      {
        q: "How early should I book for my baraat?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window.",
      },
      {
        q: "How do I plan a baraat that fits my family's traditions?",
        a: "Message us on WhatsApp with your specific customs, date, and city, and we'll advise on what's possible.",
      },
    ],
  },

  "best-month-for-wedding-in-india": {
    slug: "best-month-for-wedding-in-india",
    intro:
      "The best months for weddings in India, especially in Gujarat, typically fall between November and February, when the weather is cooler and considered auspicious for many families.\n\nPlanMyBaraat's busiest season aligns with this window, so booking early is especially important if you're planning during these months.",
    explanation:
      "Cooler temperatures during November to February make for more comfortable outdoor celebrations, including baraat processions where guests dance for extended periods. This period also often overlaps with auspicious dates according to Hindu calendars, making it doubly popular for weddings.\n\nOutside this window, some families still choose summer or monsoon dates based on personal circumstances or specific muhurat timing, and we're happy to work with whatever timing your wedding requires.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, available year-round, with peak demand during wedding season.",
    pricingGuidance:
      "Pricing depends on the package tier, not the specific month, though availability tightens significantly during peak season. Message us on WhatsApp with your date for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and this is when booking early matters most. 3-4 weeks' notice or more is a safe bet during this window.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date, and we'll confirm availability for your specific month.",
    faqs: [
      {
        q: "What are the best months for weddings in India?",
        a: "November to February is generally considered the best window, especially in Gujarat, due to cooler weather and auspicious timing.",
      },
      {
        q: "Why is cooler weather important for a baraat specifically?",
        a: "It makes for a more comfortable dancing experience during an extended outdoor procession.",
      },
      {
        q: "Do you still cover weddings outside this window?",
        a: "Yes, we work with whatever timing your wedding requires, whether that's during peak season or otherwise.",
      },
      {
        q: "How does peak season affect availability?",
        a: "Availability tightens significantly during November to February, so booking early is especially important during this window.",
      },
      {
        q: "How early should I book during peak season months?",
        a: "3-4 weeks ahead or more is a safe bet, since demand is highest during this stretch.",
      },
      {
        q: "Does pricing change based on the month?",
        a: "Pricing depends on the package tier rather than the specific month, though availability is the main consideration during peak season.",
      },
      {
        q: "Is summer a bad time for a baraat?",
        a: "It requires more careful timing (usually evening) due to heat, but it's still possible — message us and we'll advise on planning.",
      },
      {
        q: "How do I book for my specific wedding month?",
        a: "Message us on WhatsApp with your wedding date and city, and we'll confirm availability.",
      },
    ],
  },

  "shubh-muhurat-for-wedding": {
    slug: "shubh-muhurat-for-wedding",
    intro:
      "Shubh muhurat for wedding refers to the astrologically auspicious timing many Indian families choose for their ceremony — and PlanMyBaraat plans the baraat entry around whatever specific timing your muhurat requires.\n\nWe coordinate the truck, dhol team, and vintage car arrival to match your exact schedule.",
    explanation:
      "Because muhurat timing can fall at any hour, including early morning or late at night, we adjust our setup accordingly — evening lighting effects work differently for a daytime entry, and our team plans logistics around whatever specific timing your family has determined.\n\nMuhurat dates during wedding season (November to February) can be especially popular, meaning trucks and dhol teams may be in high demand for those specific auspicious windows, so we recommend booking as early as possible once your muhurat is confirmed.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, planned around your specific muhurat timing.",
    pricingGuidance:
      "Pricing depends on the package tier, not the specific muhurat timing. Message us on WhatsApp with your date and time for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and popular muhurat dates within this window can fill up especially fast. 3-4 weeks' notice or more is a safe bet.\n\nShare your date, muhurat time, city, and venue when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and muhurat timing, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "Can you plan a baraat entry around any muhurat timing?",
        a: "Yes, we adjust our setup and logistics to match whatever specific timing your family's muhurat requires.",
      },
      {
        q: "Does an early morning muhurat change the entry setup?",
        a: "Yes, lighting effects work differently for daytime entries — we'll plan accordingly based on your timing.",
      },
      {
        q: "Are popular muhurat dates harder to book?",
        a: "Yes, auspicious dates within wedding season can be especially busy — mention your specific date and we'll confirm availability directly.",
      },
      {
        q: "How much does entry planning around a muhurat cost?",
        a: "Pricing depends on the package tier, not the specific timing. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "How early should I book once my muhurat is confirmed?",
        a: "As early as possible, ideally 3-4 weeks ahead or more, especially if your date falls during wedding season (November to February).",
      },
      {
        q: "Can effects like pyro and confetti still work for a daytime muhurat?",
        a: "They're included as part of the relevant packages regardless of timing, though they're most visually striking in the evening.",
      },
      {
        q: "Does the dhol team's energy change based on timing?",
        a: "No, our team maintains consistent energy regardless of what time your muhurat is scheduled.",
      },
      {
        q: "How do I plan my entry around my muhurat?",
        a: "Message us on WhatsApp with your wedding date and exact muhurat time, and we'll plan the entry accordingly.",
      },
    ],
  },

  "baraat-on-wheels-vadodara": {
    slug: "baraat-on-wheels-vadodara",
    intro:
      "Baraat on wheels in Vadodara means a double decker DJ truck leading your procession, with a dhol team, vintage car, and safa team all coordinated as one booking.\n\nPlanMyBaraat is based in Vadodara and covers the whole city, from Alkapuri and Sayajigunj to Waghodia Road and beyond.",
    explanation:
      "Being based in Vadodara means we know the city's roads well, from the wider stretches near Old Padra Road to the busier central areas around Sayajigunj. Our drivers plan truck routes based on your exact venue, and our team is familiar with typical venue setups across the city.\n\nWe've handled entries across Vadodara's neighborhoods regularly, so timing and logistics are planned with real local knowledge, not guesswork.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team. Raj Tilak starts with 2 dhol, up through Signature's 6 dhol and full effects lineup.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and Vadodara venue for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and Vadodara venues book out fast during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and Vadodara venue, and we'll confirm the truck's available, usually within the hour.",
    faqs: [
      {
        q: "Do you cover all of Vadodara for baraat on wheels?",
        a: "Yes, we're based in Vadodara and cover the whole city, from Alkapuri and Sayajigunj to Waghodia Road and beyond.",
      },
      {
        q: "How much does baraat on wheels cost in Vadodara?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and venue on WhatsApp for a real quote.",
      },
      {
        q: "Are you familiar with Vadodara's venue locations?",
        a: "Yes, we've handled entries across Vadodara's neighborhoods regularly and plan routes based on real local knowledge.",
      },
      {
        q: "How early should I book for a Vadodara wedding?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since venues book out fast.",
      },
      {
        q: "Can the truck navigate Vadodara's busier central areas?",
        a: "Yes, though we plan routes carefully around busier areas like Sayajigunj based on your exact venue.",
      },
      {
        q: "Is the vintage car included for Vadodara bookings?",
        a: "Yes, a vintage car or baggi is included in every package from Raj Tilak upward.",
      },
      {
        q: "How do I book a baraat on wheels entry in Vadodara?",
        a: "Message us on WhatsApp with your wedding date and Vadodara venue, and we'll confirm availability.",
      },
      {
        q: "What's the difference between packages for a Vadodara entry?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, LED screens, effects, and security.",
      },
    ],
  },

  "baraat-on-wheels-surat": {
    slug: "baraat-on-wheels-surat",
    intro:
      "Baraat on wheels in Surat means a double decker DJ truck leading your procession, with a dhol team, vintage car, and safa team all coordinated as one booking.\n\nPlanMyBaraat covers all of Surat, from Vesu and Adajan to Varachha and Katargam.",
    explanation:
      "Surat's mix of newer developed areas like Vesu and City Light alongside older, denser neighborhoods like Varachha means route planning varies significantly across the city. Our team accounts for this based on your exact venue.\n\nWe've handled entries throughout Surat regularly, giving us real familiarity with typical venue access, timing, and logistics across the city's different areas.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team. Raj Tilak starts with 2 dhol, up through Signature's 6 dhol and full effects lineup.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and Surat venue for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and Surat venues book out fast during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and Surat venue, and we'll confirm the truck's available, usually within the hour.",
    faqs: [
      {
        q: "Do you cover all of Surat for baraat on wheels?",
        a: "Yes, we cover all of Surat, from Vesu and Adajan to Varachha and Katargam.",
      },
      {
        q: "How much does baraat on wheels cost in Surat?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and venue on WhatsApp for a real quote.",
      },
      {
        q: "Are you familiar with Surat's newer and older areas?",
        a: "Yes, we've handled entries across both newer developed areas and older, denser neighborhoods regularly.",
      },
      {
        q: "How early should I book for a Surat wedding?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since venues book out fast.",
      },
      {
        q: "Can the truck navigate Surat's older neighborhoods?",
        a: "In most cases yes, though we check your exact venue in advance since some older areas have narrower lanes.",
      },
      {
        q: "Is the dhol team included for Surat bookings?",
        a: "Yes, dhol players are included in every package, from 2 in Raj Tilak up to 6 in Signature.",
      },
      {
        q: "How do I book a baraat on wheels entry in Surat?",
        a: "Message us on WhatsApp with your wedding date and Surat venue, and we'll confirm availability.",
      },
      {
        q: "What's the difference between packages for a Surat entry?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, LED screens, effects, and security.",
      },
    ],
  },

  "baraat-on-wheels-ahmedabad": {
    slug: "baraat-on-wheels-ahmedabad",
    intro:
      "Baraat on wheels in Ahmedabad means a double decker DJ truck leading your procession, with a dhol team, vintage car, and safa team all coordinated as one booking.\n\nPlanMyBaraat covers all of Ahmedabad, from SG Highway and Satellite to Maninagar and Paldi.",
    explanation:
      "Ahmedabad has some of the biggest wedding venues in Gujarat, spread across newer areas like SG Highway and Sindhu Bhavan Road as well as older, established neighborhoods like Maninagar and Paldi. Our team plans routes based on your specific venue and area.\n\nWe cover the whole city, adjusting for road width, traffic patterns, and noise curfews that can vary between Ahmedabad's newer and older neighborhoods.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team. Raj Tilak starts with 2 dhol, up through Signature's 6 dhol and full effects lineup.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and Ahmedabad venue for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and Ahmedabad venues book out fast during that window, especially popular areas. 4 weeks' notice is a safe bet.\n\nShare your date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and Ahmedabad venue, and we'll confirm the truck's available, usually within the hour.",
    faqs: [
      {
        q: "Do you cover both SG Highway venues and older areas like Maninagar?",
        a: "Yes, we cover all of Ahmedabad, from the newer venues on SG Highway and Sindhu Bhavan Road to older, established areas like Maninagar and Paldi.",
      },
      {
        q: "How much does baraat on wheels cost in Ahmedabad?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and venue on WhatsApp for a real quote.",
      },
      {
        q: "How far in advance should I book a DJ truck for baraat in Ahmedabad?",
        a: "During wedding season (November to February), 4 weeks ahead is a safe bet, especially for popular areas.",
      },
      {
        q: "Can you plan around noise curfews in residential areas?",
        a: "Yes. Some societies in older parts of Ahmedabad, like Maninagar and Paldi, have evening noise rules, and we plan around them.",
      },
      {
        q: "Is the vintage car included for Ahmedabad bookings?",
        a: "Yes, starting from Raj Tilak. The Signature package upgrades this to a premium American vintage car.",
      },
      {
        q: "What's the real difference between Raj Tilak and Signature?",
        a: "Raj Tilak covers the basics — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, effects, and a security team.",
      },
      {
        q: "How many dhol players come with each package?",
        a: "Raj Tilak includes 2, Rajwada includes 4, Maharaja includes 6, and Signature includes 6 plus extra entertainment.",
      },
      {
        q: "How do I book a baraat on wheels entry in Ahmedabad?",
        a: "Message us on WhatsApp with your wedding date and Ahmedabad venue, and we'll confirm availability.",
      },
    ],
  },

  "baraat-on-wheels-mumbai": {
    slug: "baraat-on-wheels-mumbai",
    intro:
      "If you're searching for baraat on wheels in Mumbai, PlanMyBaraat is a Gujarat-based service and doesn't currently operate in Mumbai. We cover Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most cities and towns across Gujarat.\n\nIf your wedding is happening in one of our Gujarat locations, or if guests are traveling from Mumbai to a Gujarat venue, message us and we'll confirm what's possible.",
    explanation:
      "We've built our team, drivers, and vendor relationships specifically around Gujarat, which is what lets us offer the level of local knowledge and coordination we do in the cities we serve. Rather than stretching into Mumbai without that same local depth, we've kept our focus within Gujarat.\n\nIf you have any connection to a Gujarat venue or city for your wedding, we'd be glad to help — message us with the details and we'll confirm.",
    whatsIncluded:
      "Our packages — DJ truck, dhol team, vintage car, and safa team — are available across our Gujarat coverage area, not currently in Mumbai.",
    pricingGuidance:
      "Since we don't operate in Mumbai, we can't provide pricing for that city. If your event is in Gujarat, message us your date and city for a real quote.",
    bookingNotes:
      "If your wedding venue is in Gujarat, even if some guests are traveling from Mumbai, message us with your Gujarat location and date.",
    closing:
      "Message us on WhatsApp if your wedding is happening in Gujarat, and we'll confirm what's possible.",
    faqs: [
      {
        q: "Do you offer baraat on wheels in Mumbai?",
        a: "No, we're a Gujarat-based service covering Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most cities and towns in Gujarat, not Mumbai.",
      },
      {
        q: "Can you recommend someone in Mumbai?",
        a: "We don't have a specific referral for Mumbai, but we're happy to help if any part of your wedding is happening in Gujarat.",
      },
      {
        q: "What if my venue is technically near the Gujarat-Maharashtra border?",
        a: "Message us your exact location and we'll confirm whether it falls within our coverage area.",
      },
      {
        q: "Do you plan to expand to Mumbai in the future?",
        a: "We're currently focused on Gujarat. If that changes, we'll update our coverage information.",
      },
      {
        q: "Can I still get pricing information for reference?",
        a: "Our pricing structure is specific to our Gujarat operations, so it may not translate directly to Mumbai given different local logistics.",
      },
      {
        q: "Are your packages the same everywhere you operate?",
        a: "Yes, our four packages — Raj Tilak, Rajwada, Maharaja, Signature — are consistent across all the Gujarat cities and towns we serve.",
      },
      {
        q: "What cities do you actually cover?",
        a: "Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat.",
      },
      {
        q: "How do I check if you cover my specific location?",
        a: "Message us on WhatsApp with your exact city or venue, and we'll confirm directly.",
      },
    ],
  },

  "baraat-on-wheels-delhi-ncr": {
    slug: "baraat-on-wheels-delhi-ncr",
    intro:
      "If you're searching for baraat on wheels in Delhi NCR, PlanMyBaraat is a Gujarat-based service and doesn't currently operate in Delhi NCR. We cover Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most cities and towns across Gujarat.\n\nIf your wedding is happening in one of our Gujarat locations, message us and we'll confirm what's possible.",
    explanation:
      "Our team, drivers, and vendor relationships are built specifically around Gujarat's cities and towns, which is what allows us to offer the local knowledge and coordination we do within our coverage area. We've chosen to focus on doing this well within Gujarat rather than expanding broadly without that same depth.\n\nIf any part of your wedding connects to a Gujarat venue, we'd be glad to help — message us with the details.",
    whatsIncluded:
      "Our packages — DJ truck, dhol team, vintage car, and safa team — are available across our Gujarat coverage area, not currently in Delhi NCR.",
    pricingGuidance:
      "Since we don't operate in Delhi NCR, we can't provide pricing for that region. If your event is in Gujarat, message us your date and city for a real quote.",
    bookingNotes:
      "If your wedding venue is in Gujarat, even if some guests are traveling from Delhi NCR, message us with your Gujarat location and date.",
    closing:
      "Message us on WhatsApp if your wedding is happening in Gujarat, and we'll confirm what's possible.",
    faqs: [
      {
        q: "Do you offer baraat on wheels in Delhi NCR?",
        a: "No, we're a Gujarat-based service covering Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most cities and towns in Gujarat, not Delhi NCR.",
      },
      {
        q: "Can you recommend someone in Delhi NCR?",
        a: "We don't have a specific referral for Delhi NCR, but we're happy to help if any part of your wedding is happening in Gujarat.",
      },
      {
        q: "Do you plan to expand to Delhi NCR in the future?",
        a: "We're currently focused on Gujarat. If that changes, we'll update our coverage information.",
      },
      {
        q: "Can I still get pricing information for reference?",
        a: "Our pricing structure is specific to our Gujarat operations, so it may not translate directly to Delhi NCR given different local logistics.",
      },
      {
        q: "Are your packages the same everywhere you operate?",
        a: "Yes, our four packages — Raj Tilak, Rajwada, Maharaja, Signature — are consistent across all the Gujarat cities and towns we serve.",
      },
      {
        q: "What if part of my wedding is in Gujarat and part in Delhi NCR?",
        a: "Message us the Gujarat portion details and we'll confirm what we can help with.",
      },
      {
        q: "What cities do you actually cover?",
        a: "Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat.",
      },
      {
        q: "How do I check if you cover my specific location?",
        a: "Message us on WhatsApp with your exact city or venue, and we'll confirm directly.",
      },
    ],
  },

  "baraat-on-wheels-bengaluru": {
    slug: "baraat-on-wheels-bengaluru",
    intro:
      "If you're searching for baraat on wheels in Bengaluru, PlanMyBaraat is a Gujarat-based service and doesn't currently operate in Bengaluru. We cover Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most cities and towns across Gujarat.\n\nIf your wedding is happening in one of our Gujarat locations, message us and we'll confirm what's possible.",
    explanation:
      "Our team, drivers, and vendor relationships are built specifically around Gujarat, which is what allows us to offer the local knowledge and coordination we do within our coverage area. Rather than expanding into Bengaluru without that same local depth, we've focused on serving Gujarat well.\n\nIf any part of your wedding connects to a Gujarat venue, we'd be glad to help — message us with the details.",
    whatsIncluded:
      "Our packages — DJ truck, dhol team, vintage car, and safa team — are available across our Gujarat coverage area, not currently in Bengaluru.",
    pricingGuidance:
      "Since we don't operate in Bengaluru, we can't provide pricing for that city. If your event is in Gujarat, message us your date and city for a real quote.",
    bookingNotes:
      "If your wedding venue is in Gujarat, even if some guests are traveling from Bengaluru, message us with your Gujarat location and date.",
    closing:
      "Message us on WhatsApp if your wedding is happening in Gujarat, and we'll confirm what's possible.",
    faqs: [
      {
        q: "Do you offer baraat on wheels in Bengaluru?",
        a: "No, we're a Gujarat-based service covering Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most cities and towns in Gujarat, not Bengaluru.",
      },
      {
        q: "Can you recommend someone in Bengaluru?",
        a: "We don't have a specific referral for Bengaluru, but we're happy to help if any part of your wedding is happening in Gujarat.",
      },
      {
        q: "Do you plan to expand to Bengaluru in the future?",
        a: "We're currently focused on Gujarat. If that changes, we'll update our coverage information.",
      },
      {
        q: "Can I still get pricing information for reference?",
        a: "Our pricing structure is specific to our Gujarat operations, so it may not translate directly to Bengaluru given different local logistics.",
      },
      {
        q: "Are your packages the same everywhere you operate?",
        a: "Yes, our four packages — Raj Tilak, Rajwada, Maharaja, Signature — are consistent across all the Gujarat cities and towns we serve.",
      },
      {
        q: "What if my family is from Bengaluru but marrying into a Gujarati family?",
        a: "If the wedding venue is in Gujarat, message us the details and we'll confirm coverage.",
      },
      {
        q: "What cities do you actually cover?",
        a: "Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat.",
      },
      {
        q: "How do I check if you cover my specific location?",
        a: "Message us on WhatsApp with your exact city or venue, and we'll confirm directly.",
      },
    ],
  },

  "baraat-on-wheels-gandhinagar": {
    slug: "baraat-on-wheels-gandhinagar",
    intro:
      "Baraat on wheels in Gandhinagar means a double decker DJ truck leading your procession, with a dhol team, vintage car, and safa team all coordinated as one booking.\n\nPlanMyBaraat covers all of Gandhinagar, from the numbered sectors to Kudasan, Raysan, Koba, and Adalaj.",
    explanation:
      "Gandhinagar's planned-city layout with its numbered sectors makes for generally straightforward route planning, while newer growth areas like Kudasan and Randesan have their own newer road networks. Our team plans around your exact venue and area within the city.\n\nWe've handled entries across Gandhinagar regularly, including its many well-known sector venues and the newer areas that have developed around the city's edges.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team. Raj Tilak starts with 2 dhol, up through Signature's 6 dhol and full effects lineup.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and Gandhinagar venue for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and Gandhinagar venues book out fast during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and Gandhinagar venue, and we'll confirm the truck's available, usually within the hour.",
    faqs: [
      {
        q: "Do you cover all of Gandhinagar for baraat on wheels?",
        a: "Yes, we cover all of Gandhinagar, from the numbered sectors to Kudasan, Raysan, Koba, and Adalaj.",
      },
      {
        q: "How much does baraat on wheels cost in Gandhinagar?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and venue on WhatsApp for a real quote.",
      },
      {
        q: "Are the roads in Gandhinagar's sectors good for a truck entry?",
        a: "Yes, the planned-city layout with numbered sectors generally makes for straightforward truck access.",
      },
      {
        q: "How early should I book for a Gandhinagar wedding?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since venues book out fast.",
      },
      {
        q: "Do you cover the newer growth areas like Kudasan and Randesan?",
        a: "Yes, we've handled entries across these newer areas as well as the established sectors.",
      },
      {
        q: "Is the safa team included for Gandhinagar bookings?",
        a: "Yes, turban styling for the groom and baraati group is included in every package.",
      },
      {
        q: "How do I book a baraat on wheels entry in Gandhinagar?",
        a: "Message us on WhatsApp with your wedding date and Gandhinagar venue, and we'll confirm availability.",
      },
      {
        q: "What's the difference between packages for a Gandhinagar entry?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, LED screens, effects, and security.",
      },
    ],
  },

  "baraat-on-wheels-rajkot": {
    slug: "baraat-on-wheels-rajkot",
    intro:
      "Baraat on wheels in Rajkot means a double decker DJ truck leading your procession, with a dhol team, vintage car, and safa team all coordinated as one booking.\n\nPlanMyBaraat covers all of Rajkot, from Kalawad Road and University Road to Gondal Road and beyond.",
    explanation:
      "Rajkot weddings have a reputation across Saurashtra for being big, loud, and genuinely fun, and our team is built to match that energy. Wide roads like Kalawad Road and 150 Feet Ring Road are made for exactly this kind of grand baraat entry, with room for a full crowd, a proper truck, and the dhol team to really open up.\n\nWe've handled entries across Rajkot's neighborhoods, from the busier central areas to the newer developing parts of the city.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team. Raj Tilak starts with 2 dhol, up through Signature's 6 dhol and full effects lineup.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and Rajkot venue for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and Rajkot venues book out fast during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and Rajkot venue, and we'll confirm the truck's available, usually within the hour.",
    faqs: [
      {
        q: "Do you cover all of Rajkot for baraat on wheels?",
        a: "Yes, we cover all of Rajkot, from Kalawad Road and University Road to Gondal Road and beyond.",
      },
      {
        q: "How much does baraat on wheels cost in Rajkot?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and venue on WhatsApp for a real quote.",
      },
      {
        q: "Is Rajkot known for big baraat entries?",
        a: "Yes, Rajkot weddings have a reputation across Saurashtra for being big, loud, and genuinely fun.",
      },
      {
        q: "How early should I book for a Rajkot wedding?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since venues book out fast.",
      },
      {
        q: "Are Rajkot's roads good for a grand entry?",
        a: "Yes, wide roads like Kalawad Road and 150 Feet Ring Road are made for exactly this kind of large-scale procession.",
      },
      {
        q: "Is the vintage car included for Rajkot bookings?",
        a: "Yes, starting from Raj Tilak, with Signature upgrading to an American vintage car.",
      },
      {
        q: "How do I book a baraat on wheels entry in Rajkot?",
        a: "Message us on WhatsApp with your wedding date and Rajkot venue, and we'll confirm availability.",
      },
      {
        q: "What's the difference between packages for a Rajkot entry?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, LED screens, effects, and security.",
      },
    ],
  },

  "dj-truck-for-baraat-vadodara": {
    slug: "dj-truck-for-baraat-vadodara",
    intro:
      "A DJ truck for baraat in Vadodara is the double decker vehicle leading your procession, carrying the sound system and lights while the DJ performs live as the truck moves at walking pace.\n\nPlanMyBaraat is based in Vadodara, providing the truck as part of a full baraat package alongside a dhol team, vintage car, and safa team.",
    explanation:
      "Being based in Vadodara means our drivers know the city's roads well, from wider stretches to the busier central areas, and plan the truck's route based on your exact venue. We've handled entries across the city regularly, from Alkapuri to Waghodia Road.\n\nThe truck itself carries a full concert-grade sound system with the DJ performing live, plus lighting that scales from chhatri lights in the starting package up to moving LED panels in higher tiers.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, with production scaling from Raj Tilak's essentials to Signature's full effects lineup.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and Vadodara venue for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and Vadodara truck availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and Vadodara venue, and we'll confirm the truck's available, usually within the hour.",
    faqs: [
      {
        q: "Do you provide DJ trucks for baraat across Vadodara?",
        a: "Yes, we're based in Vadodara and cover the whole city with our DJ truck packages.",
      },
      {
        q: "How much does a DJ truck for baraat cost in Vadodara?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and venue on WhatsApp for a real quote.",
      },
      {
        q: "Does the truck come with an experienced local driver?",
        a: "Yes, our drivers know Vadodara's roads well and plan the route based on your exact venue.",
      },
      {
        q: "How early should I book a DJ truck for a Vadodara wedding?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
      {
        q: "Is the truck bundled with the dhol team automatically?",
        a: "Yes, the dhol team is included in the same package as the truck, not booked separately.",
      },
      {
        q: "Can the truck play custom song requests?",
        a: "Yes, our DJ artists take requests ahead of time and build a set around your preferences.",
      },
      {
        q: "How do I book a DJ truck in Vadodara?",
        a: "Message us on WhatsApp with your wedding date and Vadodara venue, and we'll confirm availability.",
      },
      {
        q: "What's the difference between the package tiers?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, effects, and security.",
      },
    ],
  },

  "dj-truck-for-baraat-surat": {
    slug: "dj-truck-for-baraat-surat",
    intro:
      "A DJ truck for baraat in Surat is the double decker vehicle leading your procession, carrying the sound system and lights while the DJ performs live as the truck moves at walking pace.\n\nPlanMyBaraat provides the truck as part of a full baraat package across Surat, alongside a dhol team, vintage car, and safa team.",
    explanation:
      "Surat's mix of newer areas like Vesu and City Light alongside denser neighborhoods like Varachha means our drivers plan the truck's route carefully based on your exact venue. We've handled entries throughout the city regularly.\n\nThe truck itself carries a full concert-grade sound system with the DJ performing live, plus lighting that scales from chhatri lights in the starting package up to moving LED panels in higher tiers.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, with production scaling from Raj Tilak's essentials to Signature's full effects lineup.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and Surat venue for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and Surat truck availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and Surat venue, and we'll confirm the truck's available, usually within the hour.",
    faqs: [
      {
        q: "Do you provide DJ trucks for baraat across Surat?",
        a: "Yes, we cover all of Surat, from Vesu and Adajan to Varachha and Katargam.",
      },
      {
        q: "How much does a DJ truck for baraat cost in Surat?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and venue on WhatsApp for a real quote.",
      },
      {
        q: "Does the truck come with an experienced local driver?",
        a: "Yes, our drivers know Surat's roads well and plan the route based on your exact venue.",
      },
      {
        q: "How early should I book a DJ truck for a Surat wedding?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
      {
        q: "Is the truck bundled with the dhol team automatically?",
        a: "Yes, the dhol team is included in the same package as the truck, not booked separately.",
      },
      {
        q: "Can the truck navigate Surat's older, denser areas?",
        a: "In most cases yes, though we check your exact venue in advance since some older areas have narrower lanes.",
      },
      {
        q: "How do I book a DJ truck in Surat?",
        a: "Message us on WhatsApp with your wedding date and Surat venue, and we'll confirm availability.",
      },
      {
        q: "What's the difference between the package tiers?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, effects, and security.",
      },
    ],
  },

  "dj-truck-for-baraat-ahmedabad": {
    slug: "dj-truck-for-baraat-ahmedabad",
    intro:
      "A DJ truck for baraat in Ahmedabad is the double decker vehicle leading your procession, carrying the sound system and lights while the DJ performs live as the truck moves at walking pace.\n\nPlanMyBaraat provides the truck as part of a full baraat package across Ahmedabad, alongside a dhol team, vintage car, and safa team.",
    explanation:
      "Ahmedabad has some of the biggest wedding venues in Gujarat, spread across newer areas like SG Highway as well as older, established neighborhoods like Maninagar. Our drivers plan the truck's route carefully based on your exact venue, and we're familiar with noise curfews in some residential societies.\n\nThe truck itself carries a full concert-grade sound system with the DJ performing live, plus lighting that scales from chhatri lights in the starting package up to moving LED panels in higher tiers.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, with production scaling from Raj Tilak's essentials to Signature's full effects lineup.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and Ahmedabad venue for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and Ahmedabad truck availability tightens during that window. 4 weeks' notice is a safe bet, especially for popular areas.\n\nShare your date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and Ahmedabad venue, and we'll confirm the truck's available, usually within the hour.",
    faqs: [
      {
        q: "Do you provide DJ trucks for baraat across Ahmedabad?",
        a: "Yes, we cover all of Ahmedabad, from SG Highway and Satellite to Maninagar and Paldi.",
      },
      {
        q: "How much does a DJ truck for baraat cost in Ahmedabad?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and venue on WhatsApp for a real quote.",
      },
      {
        q: "Does the truck come with an experienced local driver?",
        a: "Yes, our drivers know Ahmedabad's roads well and plan the route based on your exact venue.",
      },
      {
        q: "How early should I book a DJ truck for an Ahmedabad wedding?",
        a: "4 weeks ahead during wedding season (November to February) is a safe bet, especially for popular areas.",
      },
      {
        q: "Can you plan around noise curfews in residential areas?",
        a: "Yes, some societies in older parts of Ahmedabad have evening noise rules, and we plan around them.",
      },
      {
        q: "Is the truck bundled with the dhol team automatically?",
        a: "Yes, the dhol team is included in the same package as the truck, not booked separately.",
      },
      {
        q: "How do I book a DJ truck in Ahmedabad?",
        a: "Message us on WhatsApp with your wedding date and Ahmedabad venue, and we'll confirm availability.",
      },
      {
        q: "What's the difference between the package tiers?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, effects, and security.",
      },
    ],
  },

  "wedding-dj-truck-vadodara": {
    slug: "wedding-dj-truck-vadodara",
    intro:
      "A wedding DJ truck in Vadodara leads your baraat procession, carrying the sound system, lights, and DJ as it moves at walking pace toward the venue.\n\nPlanMyBaraat is based in Vadodara, providing the truck as part of a full baraat package alongside a dhol team, vintage car, and safa team.",
    explanation:
      "Being based in Vadodara means our drivers know the city's roads well, planning routes based on your specific venue, whether it's near Alkapuri, Old Padra Road, or further out toward Waghodia Road. We've handled entries across the city regularly.\n\nThe truck itself carries a full concert-grade sound system with the DJ performing live, plus lighting that scales from chhatri lights in the starting package up to moving LED panels in higher tiers.",
    whatsIncluded:
      "Every package includes the wedding DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, with production scaling from Raj Tilak's essentials to Signature's full effects lineup.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and Vadodara venue for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and Vadodara truck availability tightens during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and Vadodara venue, and we'll confirm the truck's available, usually within the hour.",
    faqs: [
      {
        q: "Do you provide wedding DJ trucks across Vadodara?",
        a: "Yes, we're based in Vadodara and cover the whole city with our truck packages.",
      },
      {
        q: "How much does a wedding DJ truck cost in Vadodara?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and venue on WhatsApp for a real quote.",
      },
      {
        q: "Does the truck come with an experienced local driver?",
        a: "Yes, our drivers know Vadodara's roads well and plan the route based on your exact venue.",
      },
      {
        q: "How early should I book a wedding DJ truck for a Vadodara wedding?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since availability tightens during peak season.",
      },
      {
        q: "Is the truck bundled with the dhol team automatically?",
        a: "Yes, the dhol team is included in the same package as the truck, not booked separately.",
      },
      {
        q: "Can the DJ take song requests for our wedding?",
        a: "Yes, our DJ artists take requests ahead of time and build a set around your preferences.",
      },
      {
        q: "How do I book a wedding DJ truck in Vadodara?",
        a: "Message us on WhatsApp with your wedding date and Vadodara venue, and we'll confirm availability.",
      },
      {
        q: "What's the difference between the package tiers?",
        a: "Raj Tilak covers the essentials — truck, DJ, 2 dhol, chhatri lights, car, and safa team. Signature adds 6 dhol, moving LED screens, effects, and security.",
      },
    ],
  },

  "baraat-entry-service-vadodara": {
    slug: "baraat-entry-service-vadodara",
    intro:
      "A baraat entry service in Vadodara from PlanMyBaraat covers the whole procession — DJ truck, dhol team, vintage car, and safa team — coordinated as one booking with our locally based team.\n\nWe've handled entries across Vadodara's neighborhoods, from Alkapuri to Waghodia Road.",
    explanation:
      "As a Vadodara-based service, our team knows the city's roads, typical venue setups, and logistics well, which shapes how we plan route timing and truck access for your specific venue. This local depth is what lets us coordinate the whole entry smoothly rather than treating it as a one-off booking.\n\nOur drivers, DJs, dhol players, and safa artists work with us regularly across the city, not hired independently for each event.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, delivered by our Vadodara-based team.",
    pricingGuidance:
      "Pricing depends on the package tier, dhol count, and any extra effects. Message us on WhatsApp with your date and venue for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for our Vadodara service peaks during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and Vadodara venue, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "What does your baraat entry service in Vadodara include?",
        a: "The DJ truck, dhol team, vintage car, and safa team, all coordinated as one booking by our locally based team.",
      },
      {
        q: "How much does the service cost?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and venue on WhatsApp for a real quote.",
      },
      {
        q: "Is your team actually based in Vadodara?",
        a: "Yes, we're headquartered in Vadodara and know the city's roads and venues well.",
      },
      {
        q: "How early should I book this service?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since demand peaks then.",
      },
      {
        q: "Do the same drivers and performers work with you regularly?",
        a: "Yes, our team works with us regularly across the city, not hired independently for each event.",
      },
      {
        q: "Which areas of Vadodara do you cover?",
        a: "We cover the whole city, including Alkapuri, Sayajigunj, Old Padra Road, and Waghodia Road.",
      },
      {
        q: "How do I book the service?",
        a: "Message us on WhatsApp with your wedding date and Vadodara venue, and we'll confirm availability.",
      },
      {
        q: "What's included in the starting package?",
        a: "Raj Tilak covers the truck, DJ, 2 dhol, chhatri lights, a vintage car, and a safa team.",
      },
    ],
  },

  "best-baraat-company-in-gujarat": {
    slug: "best-baraat-company-in-gujarat",
    intro:
      "PlanMyBaraat is a Gujarat-based baraat company operating across Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most cities and towns in the state, offering DJ truck, dhol team, vintage car, and safa team packages as one coordinated booking.\n\nMessage us on WhatsApp with your wedding date and city, and we'll help plan your entry.",
    explanation:
      "What we focus on is doing the baraat entry specifically well — our drivers, DJs, dhol players, and safa artists work with us regularly, giving us consistency and local knowledge across the areas we cover. Rather than trying to be everything to every wedding, we've built our team and packages around this one specific moment.\n\nOur four packages, Raj Tilak through Signature, give families a clear range to choose from, whether they want a solid, reliable entry or a full, elaborate production.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, with production scaling from Raj Tilak's essentials to Signature's full effects lineup.",
    pricingGuidance:
      "Pricing depends on the package tier, your city, date, and guest count. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand peaks during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "What makes PlanMyBaraat a strong baraat company in Gujarat?",
        a: "Our focused specialization on the baraat entry specifically, with a consistent team working with us regularly across the cities and towns we cover.",
      },
      {
        q: "Which cities does the company cover?",
        a: "Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat.",
      },
      {
        q: "How much does the company charge?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "How early should I book with this company?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since demand peaks then.",
      },
      {
        q: "Is the whole entry handled by one team?",
        a: "Yes, the truck, dhol, car, and safa team are all coordinated by our team as one operation.",
      },
      {
        q: "Can I see photos of past entries the company has done?",
        a: "Yes, message us on WhatsApp and we'll share photos and videos of past work.",
      },
      {
        q: "What packages does the company offer?",
        a: "Raj Tilak, Rajwada, Maharaja, and Signature, each building on the last with more dhol, LED production, entertainers, and effects.",
      },
      {
        q: "How do I get started with the company?",
        a: "Message us on WhatsApp with your wedding date and city, and we'll recommend a package.",
      },
    ],
  },

  "baraat-service-provider-gujarat": {
    slug: "baraat-service-provider-gujarat",
    intro:
      "PlanMyBaraat is a baraat service provider operating across Gujarat, covering Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most cities and towns in the state.\n\nWe provide the DJ truck, dhol team, vintage car, and safa team as one coordinated package for your wedding procession.",
    explanation:
      "As a dedicated service provider, our focus is specifically the baraat entry, not general wedding planning. This focus means our drivers, DJs, dhol players, and safa artists are experienced specifically with baraat timing and pacing, rather than being general event staff.\n\nOur four package tiers give you a clear structure to choose from based on your priorities — a reliable, complete entry, or a bigger, more elaborate production with more dhol, lighting, and effects.",
    whatsIncluded:
      "Every package includes the DJ truck, sound system, DJ artist, dhol team, vintage car, and safa team, with production scaling from Raj Tilak's essentials to Signature's full effects lineup.",
    pricingGuidance:
      "Pricing depends on the package tier, your city, date, and guest count. Message us on WhatsApp for a real quote.",
    bookingNotes:
      "Wedding season runs November to February, and demand for our services peaks during that window. 3-4 weeks' notice is a safe bet.\n\nShare your date, city, venue, and rough guest count when you reach out.",
    closing:
      "Message us on WhatsApp with your wedding date and city, and we'll confirm availability, usually within the hour.",
    faqs: [
      {
        q: "What services does this provider offer across Gujarat?",
        a: "The DJ truck, dhol team, vintage car, and safa team, coordinated as one package for the baraat entry.",
      },
      {
        q: "Which cities does the service provider cover?",
        a: "Vadodara, Surat, Ahmedabad, Gandhinagar, Rajkot, and most major towns and districts across Gujarat.",
      },
      {
        q: "How much does the service cost?",
        a: "It depends on the package, dhol count, and any extra effects. Message your date and city on WhatsApp for a real quote.",
      },
      {
        q: "How early should I book with this provider?",
        a: "3-4 weeks ahead during wedding season (November to February) is a safe window, since demand peaks then.",
      },
      {
        q: "Is this provider focused specifically on baraat services?",
        a: "Yes, our focus is specifically the baraat entry, which is why our team is experienced specifically with its timing and pacing.",
      },
      {
        q: "Does the provider handle all logistics for the entry?",
        a: "Yes, route planning, timing coordination, and the overall flow of the procession are all handled as one operation.",
      },
      {
        q: "What packages does the provider offer?",
        a: "Raj Tilak, Rajwada, Maharaja, and Signature, each building on the last with more dhol, LED production, entertainers, and effects.",
      },
      {
        q: "How do I get started with this provider?",
        a: "Message us on WhatsApp with your wedding date and city, and we'll recommend a package.",
      },
    ],
  },
};
