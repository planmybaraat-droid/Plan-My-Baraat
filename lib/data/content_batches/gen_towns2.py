import json, re

WA = "+91 90890 81111"
EMAIL = "planmybaraat@gmail.com"

towns = [
  dict(slug="petlad", name="Petlad", cluster="A",
       region="a market town in the Anand-Kheda corridor, well known for its dairy and tobacco trade",
       nearby="Anand and Nadiad", road="the market lanes open onto wider stretches near the highway, giving the truck room to move",
       venue="wedding lawns and community wadis along the Petlad-Anand road"),
  dict(slug="borsad", name="Borsad", cluster="A",
       region="a well-settled town on the Anand-Kheda corridor with a long history of trade and civic life",
       nearby="Anand and Vadodara", road="Borsad's roads run wide and straight through much of the town, which suits a double decker truck comfortably",
       venue="banquet halls and family wadis around the Borsad-Tarapur belt"),
  dict(slug="dholka", name="Dholka", cluster="A",
       region="an old town southwest of Ahmedabad with a mixed economy of trade, agriculture and small industry",
       nearby="Ahmedabad and Bagodara", road="Dholka's main market road is busy through the day but opens up nicely by evening for a baraat procession",
       venue="lawns and party plots along the Dholka-Bagodara highway"),
  dict(slug="viramgam", name="Viramgam", cluster="A",
       region="a railway and highway junction town on the edge of the Ahmedabad district, historically a trading crossroads",
       nearby="Ahmedabad and Surendranagar", road="Viramgam sits where highways meet, so the truck and vintage car get a smooth, wide run in",
       venue="function halls and open grounds near the Viramgam railway junction"),
  dict(slug="bavla", name="Bavla", cluster="A",
       region="a growing town on the Ahmedabad-Bagodara stretch, increasingly a wedding and event hub in its own right",
       nearby="Ahmedabad and Sanand", road="Bavla's newer roads and party plots off the highway are built with vehicle access in mind",
       venue="party plots and resorts along the Ahmedabad-Bagodara highway"),
  dict(slug="gondal", name="Gondal", cluster="B",
       region="a former princely-state town near Rajkot, known for its palaces and its unhurried, dignified pace",
       nearby="Rajkot and Jetpur", road="Gondal's older quarters near the palaces are narrow, but the outer roads give the truck plenty of space",
       venue="lawns and heritage-adjacent venues around the Gondal palace area"),
  dict(slug="jetpur", name="Jetpur", cluster="B",
       region="a Saurashtra town near Rajkot built around its textile printing and dyeing industry",
       nearby="Rajkot and Dhoraji", road="Jetpur's roads carry heavy industrial traffic by day, so we plan baraat timings around the town's rhythm to keep the entry smooth",
       venue="community halls and lawns off the Jetpur-Rajkot highway"),
  dict(slug="dhoraji", name="Dhoraji", cluster="B",
       region="a compact Saurashtra town between Rajkot and Junagadh, with a steady, close-knit market culture",
       nearby="Rajkot and Upleta", road="Dhoraji's market core stays busy, so our teams favour the wider approach roads near most function venues for the truck's entry",
       venue="wedding halls and open grounds on the edges of Dhoraji"),
  dict(slug="upleta", name="Upleta", cluster="B",
       region="a Saurashtra town in the Rajkot district known for its cotton trade and agricultural markets",
       nearby="Rajkot and Dhoraji", road="Upleta's outskirts have open stretches near most venues, where the truck and dhol team stage before the entry",
       venue="lawns and community halls around Upleta town"),
  dict(slug="morbi", name="Morbi", cluster="C",
       region="a busy industrial town known across India for its ceramics and tiles manufacturing",
       nearby="Rajkot and Wankaner", road="Morbi's newer industrial-belt roads are broad and well laid out, which makes for an easy, unhurried baraat entry",
       venue="lawns and banquet venues along the Morbi-Rajkot highway"),
  dict(slug="wankaner", name="Wankaner", cluster="C",
       region="a historic palace town in the Morbi district, with a slower, more traditional character than its industrial neighbour",
       nearby="Morbi and Rajkot", road="Wankaner's roads near the palace and market are modest in width, so we scout the venue approach in advance",
       venue="lawns and halls close to the Wankaner palace area"),
  dict(slug="dwarka", name="Dwarka", cluster="D",
       region="one of Gujarat's major pilgrimage towns, home to the Dwarkadhish Temple",
       nearby="Khambhalia and Okha", road="Dwarka's temple-town lanes get crowded near the main road, so routes are planned around pilgrim traffic",
       venue="lawns and resorts on the outskirts of Dwarka, away from the temple crowds"),
  dict(slug="khambhalia", name="Khambhalia", cluster="D",
       region="a market town close to Dwarka, serving as a trading and transit point for the pilgrimage belt around it",
       nearby="Dwarka and Jamnagar", road="Khambhalia's highway-facing stretches give the truck and vintage car a clean, open run before turning into most venues",
       venue="lawns and function halls along the Khambhalia-Dwarka road"),
  dict(slug="keshod", name="Keshod", cluster="E",
       region="a Saurashtra coastal-belt town between Junagadh and Veraval, with a quiet, agricultural character",
       nearby="Junagadh and Veraval", road="Keshod's town roads are calm through most of the day, which gives our dhol team and truck an easy, unrushed entry",
       venue="lawns and halls around the Keshod market area"),
  dict(slug="veraval", name="Veraval", cluster="E",
       region="a fishing-harbor town on the Saurashtra coast, busy with boats, markets and a distinct sea-town rhythm",
       nearby="Somnath and Junagadh", road="Veraval's harbour-side lanes are narrow near the port, so we route the baraat through the town's wider connecting roads instead",
       venue="lawns and resorts between Veraval and neighbouring Somnath"),
  dict(slug="somnath", name="Somnath", cluster="E",
       region="home to the Somnath Temple, one of India's most visited pilgrimage sites",
       nearby="Veraval and Diu", road="Somnath's temple approach stays busy with pilgrims, so we keep to the outer roads and time the truck's arrival around temple hours",
       venue="lawns and beachside resorts around Somnath and Veraval"),
  dict(slug="porbandar", name="Porbandar", cluster="E",
       region="a coastal town on the Saurashtra shoreline, known nationally as the birthplace of Mahatma Gandhi",
       nearby="Veraval and Jamnagar", road="Porbandar's seafront roads and open squares give the truck and vintage car a graceful, wide run into most venues",
       venue="lawns and banquet halls along Porbandar's coastal roads"),
  dict(slug="mahuva", name="Mahuva", cluster="F",
       region="a coastal town in the Bhavnagar-Amreli belt, known for its groundnut and onion trade",
       nearby="Amreli and Talaja", road="Mahuva's market lanes are compact, but the town's outer roads near most function venues open up comfortably for the truck",
       venue="lawns and halls on the edges of Mahuva town"),
  dict(slug="amreli", name="Amreli", cluster="F",
       region="a district town anchoring the Bhavnagar-Amreli belt, with a fairly settled, mid-sized-town character",
       nearby="Savarkundla and Botad", road="Amreli's roads around the newer residential and commercial pockets are wide enough for the truck to move at an easy, celebratory pace",
       venue="lawns and community halls across Amreli town"),
  dict(slug="savarkundla", name="Savarkundla", cluster="F",
       region="a trading town in the Amreli district, sitting on the route between Amreli and the coast",
       nearby="Amreli and Mahuva", road="Savarkundla's approach roads near most venues are open and well kept, which keeps the baraat entry unhurried",
       venue="lawns and halls around Savarkundla town"),
  dict(slug="botad", name="Botad", cluster="F",
       region="a junction town at the edge of the Bhavnagar-Amreli belt, connecting Saurashtra's interior to Ahmedabad",
       nearby="Bhavnagar and Ahmedabad", road="Botad's highway-facing roads are broad and straight, ideal for the double decker truck's slow, steady entry",
       venue="lawns and resorts along the Botad-Bhavnagar highway"),
  dict(slug="surendranagar", name="Surendranagar", cluster="G",
       region="a trading and textile town anchoring the Surendranagar belt, with a busy, commerce-driven pace",
       nearby="Wadhwan and Limbdi", road="Surendranagar's market roads are lively by day, so we time the baraat for the calmer evening hours",
       venue="lawns and halls across Surendranagar town"),
  dict(slug="wadhwan", name="Wadhwan", cluster="G",
       region="an old trading town that today sits almost joined to neighbouring Surendranagar, with its own distinct market character",
       nearby="Surendranagar and Limbdi", road="Wadhwan's older lanes are narrower near the town centre, so our teams favour the broader roads closer to most function venues",
       venue="lawns and halls between Wadhwan and Surendranagar"),
  dict(slug="limbdi", name="Limbdi", cluster="G",
       region="a smaller trading town in the Surendranagar belt, quieter than its larger neighbours but steady in its own right",
       nearby="Surendranagar and Wadhwan", road="Limbdi's roads stay relatively calm outside market hours, giving the truck and dhol team an easy, unhurried entry",
       venue="lawns and community halls around Limbdi town"),
  dict(slug="nandod", name="Nandod", cluster="H",
       region="the administrative town of the Narmada district, close to Rajpipla, with a calm, riverside character",
       nearby="Rajpipla and Zaghadia", road="Nandod's roads are modest in width, so we plan the truck's route around the town's main venue approaches in advance",
       venue="lawns and halls around Nandod and neighbouring Rajpipla"),
  dict(slug="dediapada", name="Dediapada", cluster="H",
       region="a forested taluka town in the Narmada district, set against the hills that run along this part of Gujarat",
       nearby="Rajpipla and Nandod", road="Dediapada's roads are simpler and quieter than the district's bigger towns, which actually makes for a relaxed, scenic baraat entry",
       venue="lawns and community grounds in and around Dediapada"),
  dict(slug="tilakwada", name="Tilakwada", cluster="H",
       region="a riverside town in the Narmada district, sitting close to the Narmada's banks with a laid-back, rural character",
       nearby="Rajpipla and Nandod", road="Tilakwada's roads are narrower village stretches in parts, so we confirm the venue approach ahead of time",
       venue="lawns and riverside venues around Tilakwada"),
  dict(slug="zaghadia", name="Zaghadia", cluster="H",
       region="an industrial town in the Narmada district, built around its large GIDC industrial estate",
       nearby="Ankleshwar and Rajpipla", road="Zaghadia's industrial-estate roads are wide and well maintained, which suits the double decker truck's entry very well",
       venue="lawns and halls around Zaghadia and the nearby GIDC belt"),
]

assert len(towns) == 28

def wc(s):
    return len(re.findall(r"\S+", s))

def entry_wc(e):
    total = 0
    for k in ["intro","localArea","whatsIncluded","whyUs","pricingGuidance","planningNotes","closing"]:
        total += wc(e[k])
    for f in e["faqs"]:
        total += wc(f["q"]) + wc(f["a"])
    return total

def build(t):
    name = t["name"]
    region = t["region"]
    nearby = t["nearby"]
    road = t["road"]
    venue = t["venue"]

    intro_p1 = (
        f"Planning a groom's baraat entry in {name}? Plan My Baraat puts together the whole procession as one "
        f"booking, a double decker DJ truck, a dhol team, a vintage car or baggi for the groom, and a safa team "
        f"to style him and his baraatis. Families in {name} usually reach out once the venue and date are set "
        f"and they want the entry itself handled without chasing four separate vendors."
    )
    intro_p2 = (
        f"We are based in Vadodara and travel out to {name} regularly, so the crew, truck and safa team arrive "
        f"together, already familiar with how a {name} baraat typically plays out. Whether the family is from "
        f"{name} itself or travelling in from {nearby.split(' and ')[0]}, we build the timeline around the venue and guest list."
    )

    local_p1 = f"{name} is {region}. We do not treat it as a stop between bigger cities, its character shapes how we plan the entry, from where the truck can move to what time the street outside the venue quiets down."
    local_p2 = f"Most of our {name} bookings sit near {venue}, and {road}. We know which stretches work for a slow, photograph-friendly entry and which are better crossed quickly, especially near {nearby}."

    included_p1 = (
        f"Every {name} booking starts from the same core: the Baraat on Wheels double decker truck with sound "
        f"and a DJ artist, two dhol players, chhatri lights, a vintage car for the groom's entry, and the My Safa "
        f"team to dress the groom and style the baraatis' turbans. That is Raj Tilak, the base every other {name} package builds on."
    )
    included_p2 = (
        f"Rajwada adds two more dhol for four total plus a teddy or gorilla performer; Maharaja, our most-booked "
        f"package around {name}, brings moving LED panels with the groom's name lit up and six dhol; and Signature, "
        f"the top tier, adds a security team, cold pyro and confetti timed to the truck's arrival, plus an upgraded "
        f"American vintage car. Vintage car and safa styling are included from Raj Tilak up, never an add-on."
    )

    whyus_p1 = (
        f"We handle the entire {name} baraat as one coordinated unit instead of separate vendors hoping their "
        f"timing lines up. The truck operator, dhol team, vintage car driver and safa stylist work off the same "
        f"schedule, which matters in {name} because {road}."
    )
    whyus_p2 = (
        f"Because we run baraats across this part of Gujarat regularly, our {name} bookings benefit from a crew "
        f"that already knows the town rather than one reading a map for the first time. That familiarity keeps a "
        f"{name} baraat on time even when the venue or guest count changes at the last minute."
    )

    pricing_p1 = (
        f"We do not publish fixed prices for {name}, the right number depends on your date, venue, guest count "
        f"and which package you pick, Raj Tilak, Rajwada, Maharaja or Signature. Two {name} weddings on the same "
        f"street can need different setups depending on how the family wants the entry to feel."
    )
    pricing_p2 = (
        f"The fastest way to get a real quote is to message us on WhatsApp at {WA} with your date, area in {name} "
        f"and rough guest count. We usually reply within the hour with package options and a price built around your evening."
    )

    planning_p1 = (
        f"Wedding season in Gujarat runs November through February, the busiest stretch for {name} bookings too, "
        f"so we recommend locking your date two to three weeks ahead. Outside those months, a week's notice is usually enough."
    )
    planning_p2 = (
        f"Once you confirm, we work out the route, where the truck stages, how the dhol team leads the walk to "
        f"the venue, and where the vintage car pulls up for the groom's arrival. For {name}, {road}."
    )

    closing = (
        f"Ready to plan your baraat in {name}? WhatsApp us at {WA} or email {EMAIL} with your date and guest "
        f"count, and we will put together a package that fits your wedding."
    )

    faqs = [
        {"q": f"Do you provide baraat services in {name}, or only in Vadodara?",
         "a": f"Yes, we regularly travel to {name} for bookings. Our team, truck and safa stylists all come from Vadodara and set up on site for your event."},
        {"q": f"What is included in the base package for a {name} baraat?",
         "a": "Raj Tilak covers the double decker DJ truck with sound and a DJ artist, two dhol players, chhatri lights, a vintage car for the groom, and the My Safa turban styling team."},
        {"q": "Which package is most popular?",
         "a": "Maharaja is booked most often. It adds moving LED panels with the groom's name lit up and six dhol on top of the Raj Tilak and Rajwada inclusions."},
        {"q": f"How far in advance should we book for a {name} wedding?",
         "a": f"In wedding season, November to February, book two to three weeks ahead since {name} dates fill up fast. Outside that season, a week's notice usually works."},
        {"q": "Is the vintage car an extra cost?",
         "a": "No. A vintage car or baggi for the groom is included from Raj Tilak upward in every tier, along with the safa team, never a separate add-on."},
        {"q": f"How do we get an actual price for our {name} baraat?",
         "a": f"WhatsApp us at {WA} with your date, area in {name}, and guest count. We typically reply within the hour with package options and pricing."},
        {"q": f"Can the safa team style the whole baraati group, not just the groom?",
         "a": f"Yes, My Safa styles the groom and dresses the full baraati group with matching or coordinated safas, included in every {name} package."},
    ]

    return dict(
        slug=t["slug"],
        intro=intro_p1 + "\n\n" + intro_p2,
        localArea=local_p1 + "\n\n" + local_p2,
        whatsIncluded=included_p1 + "\n\n" + included_p2,
        whyUs=whyus_p1 + "\n\n" + whyus_p2,
        pricingGuidance=pricing_p1 + "\n\n" + pricing_p2,
        planningNotes=planning_p1 + "\n\n" + planning_p2,
        closing=closing,
        faqs=faqs,
    )

entries = [build(t) for t in towns]

rep = [(e["slug"], entry_wc(e)) for e in entries]
for s,c in rep:
    print(s, c)

with open("/sessions/eloquent-modest-faraday/mnt/outputs/project/lib/data/content_batches/batch_towns_2.json","w",encoding="utf-8") as f:
    json.dump(entries, f, ensure_ascii=False, indent=2)

print("TOTAL ENTRIES", len(entries))
