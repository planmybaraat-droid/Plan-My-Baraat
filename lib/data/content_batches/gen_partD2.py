import json

towns = []
def add(slug, intro, localArea, whatsIncluded, whyUs, pricingGuidance, planningNotes, closing, faqs):
    towns.append({"slug": slug, "intro": intro, "localArea": localArea, "whatsIncluded": whatsIncluded,
        "whyUs": whyUs, "pricingGuidance": pricingGuidance, "planningNotes": planningNotes,
        "closing": closing, "faqs": faqs})

# ---------------- UMARGAM ----------------
add(
"umargam",
"Umargam sits at the southern tip of Valsad district, right against the Maharashtra border, with a coastline and a growing GIDC industrial estate that together give the town a mixed character - part fishing and coastal community, part industrial hub. Weddings here bring in families from both sides of the state line, and a baraat with a full truck and dhol setup makes for a proper, memorable send-off.\n\nPlan My Baraat handles the whole entry for Umargam weddings as one booking: the double decker Baraat on Wheels truck, a dhol team, a vintage car or baggi for the groom's arrival, and the My Safa team turban-styling him and the full baraati group.",
"Umargam's road network mixes wide industrial stretches near the GIDC estate with narrower coastal lanes closer to the fishing villages, so we plan the truck's exact route based on your venue's location within the town. Venues near the highway are the most straightforward for access.\n\nWe cover Umargam and the surrounding coastal and industrial areas regularly, and given the town's position right at the Gujarat-Maharashtra border, we've handled baraats here for families travelling in from just across the state line as well.",
"Every package includes the DJ truck, sound system, and a DJ artist keeping the crowd engaged as the baraat moves. Raj Tilak comes with 2 dhol and chhatri lighting. Rajwada steps up to 4 dhol and adds a teddy or gorilla performer alongside the truck. Maharaja, the package most Umargam families choose, brings moving LED panels and lights up the groom's name for the arrival. Signature, our top package, adds a security team, timed pyro and confetti, and an upgraded American vintage car.\n\nThe vintage car or baggi and the My Safa turban team are included in every package from Raj Tilak upward, so even the entry-level booking gives you a proper, complete arrival.",
"We're a Gujarat-based baraat planning team covering the Valsad-Umargam belt regularly, so our crews are familiar with both the industrial-side roads and the coastal lanes that come up around Umargam's venues.\n\nWith one team handling the truck, dhol, car, and safa, you avoid coordinating four separate vendors yourself. We manage the timing so the truck's arrival, the dhol beat, and the groom's step out of the vintage car all land together at your Umargam venue.",
"Pricing for an Umargam baraat depends on your package, dhol count, and any added effects like pyro or confetti. Raj Tilak is the most affordable way to get the complete core setup; Signature costs more because it's a genuinely bigger production, with more dhol, LED visuals, a security team, and the premium car.\n\nSend us your date, your venue or area in Umargam, and a rough guest count, and we'll respond on WhatsApp with a real quote, usually within the hour.",
"Wedding season runs November to February, and Umargam sees less competition for dates than bigger city venues, so 2 to 3 weeks' notice in peak season is usually enough. Outside that window, a week's notice generally works fine.\n\nIf your venue is closer to the coastal or fishing village side of Umargam, mention that when you message us, so we can plan the truck's route through the narrower lanes in advance.",
"Message us on WhatsApp with your wedding date, your venue in Umargam, and an approximate baraati headcount, and we'll confirm the truck's availability along with a package recommendation, usually within the hour.",
[
{"q": "Is Umargam right on the Gujarat-Maharashtra border?", "a": "Yes, Umargam sits at the southern tip of Valsad district, right against the Maharashtra border, and we've handled baraats here for families from both sides."},
{"q": "Can the truck access Umargam's coastal, fishing-village areas?", "a": "In most cases yes, though we plan the exact route in advance since those lanes are narrower than the roads near the GIDC estate."},
{"q": "How much notice do we need for an Umargam wedding?", "a": "2 to 3 weeks ahead in peak season (November to February) is usually enough, since Umargam sees less date competition than bigger city venues."},
{"q": "Do you cover villages and townships around Umargam too?", "a": "Yes, we regularly serve the coastal and industrial areas surrounding Umargam, not just the main town centre."},
{"q": "Is the vintage car included in every package?", "a": "Yes, starting from Raj Tilak. It upgrades to a premium American vintage car in the Signature package at the top."},
{"q": "What's the difference between Raj Tilak and Rajwada?", "a": "Rajwada adds 2 more dhol on top of Raj Tilak's 2, bringing the total to 4, plus a teddy or gorilla performer working the crowd."},
{"q": "Does the safa team style the whole baraati group in Umargam?", "a": "Yes, My Safa ties turbans for the groom and everyone walking in the baraat, arriving early enough for the group to be ready on time."},
]
)

# ---------------- DAMAN ----------------
add(
"daman",
"Daman is a Union Territory in its own right, separated from Gujarat administratively but tied to it in almost every practical sense, and its beach-town character sets it apart from the other towns we cover. Weddings here often carry a bit of extra flair, and a double decker DJ truck rolling along Daman's wider roads toward a beachside or riverside venue makes for a genuinely striking entrance.\n\nPlan My Baraat handles the complete entry for Daman weddings as one booking: the double decker Baraat on Wheels truck, a dhol team, a vintage car or baggi for the groom's arrival, and the My Safa team turban-styling him and the full baraati group.",
"Daman sits right on the coast, split by the Daman Ganga river into Nani Daman and Moti Daman, with roads that are generally well-maintained given the steady tourist traffic the town sees. Beachside and resort venues here are usually easy for our truck to access, though we always confirm the approach for anything tucked closer to the older parts of town.\n\nWe cover Daman regularly as part of our South Gujarat and Valsad-belt service area, and we're used to the mix of destination-style beach weddings and more traditional local celebrations that both happen here.",
"Every package starts with the DJ truck, sound system, and a DJ artist keeping the energy high as the baraat moves. Raj Tilak includes 2 dhol and chhatri lighting. Rajwada steps up to 4 dhol and adds a teddy or gorilla performer alongside the truck. Maharaja, the package most Daman bookings choose, brings moving LED panels and lights up the groom's name for the arrival. Signature, our top package, adds a security team, timed pyro and confetti, and an upgraded American vintage car for the entrance.\n\nThe vintage car or baggi and the My Safa turban team are included in every package from Raj Tilak upward, so even the entry-level booking includes a proper car and full turban styling.",
"We're a Gujarat-based baraat planning team that regularly covers Daman as part of our South Gujarat service area, so our crews are familiar with the roads here and the mix of beach resorts and local venues families choose.\n\nWith one team handling the truck, dhol, car, and safa, you avoid coordinating four separate vendors for a destination-style celebration. We manage the timing so the truck's arrival, the dhol beat, and the groom's entrance from the vintage car all land together at your Daman venue.",
"Pricing for a Daman baraat depends on your package, dhol count, and any added effects like pyro or confetti. Raj Tilak is the most affordable way to get the complete core setup; Signature costs more because it's a genuinely bigger production, with more dhol, LED visuals, a security team, and the premium car.\n\nSend us your date, your venue or area in Daman, and a rough guest count, and we'll respond on WhatsApp with a real quote, usually within the hour.",
"Wedding season runs November to February, and Daman can get busy with destination weddings during that stretch, so 2 to 3 weeks' notice in peak season is a sensible minimum. Outside that window, a week's notice generally works.\n\nIf you're planning a beachside or resort entry, let us know the venue early so we can plan the truck's access and confirm timing against tides or event schedules at the property.",
"Message us on WhatsApp with your wedding date, your venue in Daman, and an approximate baraati headcount, and we'll confirm the truck's availability along with a package recommendation, usually within the hour.",
[
{"q": "Is Daman part of Gujarat state?", "a": "Daman is a Union Territory, administratively separate from Gujarat, but we cover it as part of our regular South Gujarat and Valsad-belt service area."},
{"q": "Can the truck access beach resort venues in Daman?", "a": "Yes, most beachside and resort venues are straightforward for our truck. We confirm access in advance for anything closer to the older town areas."},
{"q": "How early should we book for a Daman wedding?", "a": "2 to 3 weeks ahead in peak season (November to February) is a sensible minimum, since Daman can get busy with destination weddings during that stretch."},
{"q": "Do you also cover villages and areas near Daman?", "a": "Yes, we regularly serve the areas around Daman as part of our wider South Gujarat coverage, not just the main town."},
{"q": "Is the vintage car included from the entry-level package?", "a": "Yes, the vintage car or baggi comes with Raj Tilak and every package above it, upgrading to an American vintage car in Signature."},
{"q": "What does the Maharaja package include for a Daman wedding?", "a": "6 dhol, moving LED panels, and the groom's name lit up, along with everything from Raj Tilak and Rajwada, including the car and safa team."},
{"q": "Does the safa team handle a large baraati group for a Daman wedding?", "a": "Yes, My Safa styles turbans for the groom and everyone walking in the baraat, arriving early enough for the entire group to be ready in time."},
]
)

with open("/sessions/eloquent-modest-faraday/mnt/outputs/project/lib/data/content_batches/partD2.json", "w", encoding="utf-8") as f:
    json.dump(towns, f, ensure_ascii=False, indent=2)

for t in towns:
    words = sum(len(t[k].split()) for k in ['intro','localArea','whatsIncluded','whyUs','pricingGuidance','planningNotes','closing'])
    words += sum(len(fq['q'].split())+len(fq['a'].split()) for fq in t['faqs'])
    print(t['slug'], words)
