# -*- coding: utf-8 -*-
import json, re

AREAS = [
    ("SG Highway", "sg-highway", "suburb"),
    ("Satellite", "satellite", "upscale"),
    ("Bodakdev", "bodakdev", "upscale"),
    ("Prahlad Nagar", "prahlad-nagar", "upscale"),
    ("Vastrapur", "vastrapur", "upscale"),
    ("Navrangpura", "navrangpura", "central"),
    ("Maninagar", "maninagar", "eastern"),
    ("Bopal", "bopal", "suburb"),
    ("South Bopal", "south-bopal", "suburb"),
    ("Thaltej", "thaltej", "suburb"),
    ("Gota", "gota", "suburb"),
    ("Chandkheda", "chandkheda", "north"),
    ("Naranpura", "naranpura", "central"),
    ("Shahibaug", "shahibaug", "central"),
    ("Vastral", "vastral", "eastern"),
    ("Nikol", "nikol", "eastern"),
    ("Paldi", "paldi", "central"),
    ("Ellisbridge", "ellisbridge", "central"),
    ("CG Road", "cg-road", "central"),
    ("Ghatlodia", "ghatlodia", "north"),
    ("Science City Road", "science-city-road", "suburb"),
    ("Shela", "shela", "suburb"),
    ("Nirnay Nagar", "nirnay-nagar", "north"),
    ("Vaishnodevi Circle", "vaishnodevi-circle", "suburb"),
    ("Ambawadi", "ambawadi", "central"),
    ("Vejalpur", "vejalpur", "central"),
    ("Jodhpur", "jodhpur", "central"),
    ("Judges Bungalow Road", "judges-bungalow-road", "upscale"),
    ("Sindhu Bhavan Road", "sindhu-bhavan-road", "upscale"),
    ("Shilaj", "shilaj", "suburb"),
    ("South Bopal-Ghuma", "south-bopal-ghuma", "suburb"),
    ("Iscon Cross Road", "iscon-cross-road", "suburb"),
    ("Drive-in Road", "drive-in-road", "suburb"),
    ("Motera", "motera", "north"),
    ("Sabarmati", "sabarmati", "north"),
    ("Chandlodia", "chandlodia", "north"),
    ("Ranip", "ranip", "north"),
    ("New Ranip", "new-ranip", "north"),
    ("Naroda", "naroda", "eastern"),
    ("Odhav", "odhav", "eastern"),
    ("Vatva", "vatva", "eastern"),
    ("Isanpur", "isanpur", "eastern"),
    ("Ghodasar", "ghodasar", "eastern"),
    ("Nava Vadaj", "nava-vadaj", "central"),
    ("Memnagar", "memnagar", "central"),
    ("Usmanpura", "usmanpura", "central"),
    ("Khokhra", "khokhra", "eastern"),
    ("Anand Nagar", "anand-nagar", "eastern"),
    ("Bhat GIDC belt", "bhat-gidc-belt", "eastern"),
]

ALL_NAMES = [a[0] for a in AREAS]

def neighbors_for(name, group, idx):
    pool = [n for n in ALL_NAMES if n != name]
    same_group = [a[0] for a in AREAS if a[2] == group and a[0] != name]
    others = [n for n in pool if n not in same_group]
    sg = same_group[idx % max(len(same_group),1):] + same_group[:idx % max(len(same_group),1)]
    ot = others[idx % max(len(others),1):] + others[:idx % max(len(others),1)]
    picks = sg[:2] + ot[:2]
    seen = []
    for p in picks:
        if p not in seen:
            seen.append(p)
        if len(seen) == 3:
            break
    return seen

GROUP_CHAR = {
    "upscale": {
        "desc": "an established, upscale pocket of west Ahmedabad",
        "traits": ["wide internal roads", "a mix of high-rise apartments and independent bungalows", "banquet halls and rooftop lawns that host a steady run of weddings each season", "well-lit approach roads that make a night entry look sharper"],
        "road_word": "the main road",
    },
    "suburb": {
        "desc": "one of Ahmedabad's newer, fast-growing western suburbs",
        "traits": ["broad, recently laid roads built for exactly this kind of traffic", "large gated townships and standalone lawns with generous parking", "still-developing stretches where a truck has plenty of room to swing in", "a mix of new banquet properties and open-ground venues"],
        "road_word": "the approach road",
    },
    "central": {
        "desc": "one of the older, more established neighbourhoods of central Ahmedabad",
        "traits": ["narrower internal lanes shaped decades before double decker trucks existed", "a dense mix of housing societies, old halls, and a handful of newer venues", "heavier evening traffic that needs an earlier entry slot", "societies where a gate committee often asks about timing in advance"],
        "road_word": "the internal lane",
    },
    "north": {
        "desc": "part of the growth belt on the northern edge of Ahmedabad",
        "traits": ["a stretch that has filled in quickly with new residential blocks and halls", "roads that are wider than the old city but still busy near the main junctions", "a good number of newer banquet venues built specifically for bigger functions", "riverfront-adjacent pockets where evening traffic can build up fast"],
        "road_word": "the main stretch",
    },
    "eastern": {
        "desc": "part of the industrial and residential belt on Ahmedabad's eastern side",
        "traits": ["a working-class, densely populated stretch with narrower approach roads", "a mix of older housing, community halls, and factory-adjacent roads", "roads shared with heavy commercial traffic through the day that eases out by evening", "close-knit residential pockets where the whole lane turns out for a baraat"],
        "road_word": "the approach lane",
    },
}

INTRO_OPENERS = [
    "{name} is {desc}, and it's become a regular stop on our baraat calendar in {city}.",
    "Ask anyone planning a wedding around {name} and they'll tell you it's {desc} in {city}.",
    "{name} sits in {city} as {desc}, which shapes how we plan a baraat entry there.",
    "In {city}, {name} is known as {desc}, and that character carries into every baraat we run here.",
    "We get a steady flow of bookings from {name}, {desc} on the {city} map.",
    "{name} has grown into {desc}, and families here expect the baraat to match the occasion.",
]

INTRO_SECOND = [
    "That means a baraat here needs {trait}, so PlanMyBaraat builds the entry around what actually works on the ground -- the double decker DJ truck, a dhol team, a vintage car or baggi for the groom, and a My Safa turban team, booked together as one baraat on wheels package instead of four separate vendors.",
    "Because of {trait}, we plan the whole procession as one unit rather than piecing it together -- DJ truck, dhol players, the groom's vintage car or baggi, and safa styling from My Safa, all under a single booking and a single point of contact.",
    "With {trait} in the picture, we treat the truck route, the dhol formation, and the car entry as one coordinated plan, not separate bookings -- the DJ truck, dhol team, vintage car or baggi, and My Safa turban team all move together.",
    "Given {trait}, we don't send a generic setup here -- the DJ truck, dhol team, vintage car or baggi, and My Safa turban stylists are planned specifically for how this part of {city} actually works on a wedding evening.",
]

LOCALAREA_OPENERS = [
    "{name} connects easily to {n1}, {n2}, and {n3}, and we regularly run baraats that start in one of these pockets and finish near a venue in {name} itself.",
    "Families booking from {name} are often close to {n1} and {n2}, with {n3} not far off either -- all areas we cover as part of the same route planning.",
    "If you're getting ready in {name}, chances are your guest list overlaps with {n1}, {n2}, or {n3} -- we plan around that kind of cross-area movement all the time.",
    "{name} borders the stretch that runs toward {n1} and {n2}, and isn't far from {n3} either, so we're used to scouting all of these together before confirming a route.",
]

LOCALAREA_SECOND = [
    "The area has {trait1} and {trait2}, which we factor in before the truck is booked -- a proper site check tells us where the double decker can park and where the vintage car should line up for the groom's entry.",
    "What stands out about {name} is {trait1}, along with {trait2} -- details that decide whether we run the full truck configuration or a slightly leaner one for a smoother approach.",
    "Between {trait1} and {trait2}, {name} isn't a one-size-fits-all location, so we walk the route in advance rather than assuming it'll work like the last booking nearby.",
    "We've learned that {trait1} and {trait2} in {name} both affect timing, so our coordinator checks the lane width and parking before the DJ truck for baraat is confirmed for your slot.",
]

WHATS_INCLUDED_1 = [
    "Every package starts with the same base -- the double decker DJ truck, sound system, and a professional DJ artist. Raj Tilak is the entry point: 2 dhol players and chhatri lights, a clean entry that suits a smaller baraat in {name} or a tighter budget. Rajwada adds 2 more dhol for 4 total, plus a teddy or gorilla performer to keep the crowd engaged.",
    "The base across all four packages is the same -- DJ truck, sound system, and a DJ artist. Raj Tilak keeps it to 2 dhol and chhatri lights, a good fit for a compact baraat around {name}. Rajwada steps up to 4 dhol total, plus a teddy or gorilla performer for extra energy.",
    "We keep the base consistent no matter the package -- DJ truck, sound, and a DJ artist. Raj Tilak is the lighter option: 2 dhol and chhatri lights, enough for a clean entry near {name}. Rajwada adds 2 more dhol for 4 total, plus a teddy or gorilla performer to keep baraatis dancing.",
]

WHATS_INCLUDED_2 = [
    "Maharaja, our most-booked package, adds moving LED panels, the groom's name lit up, and 6 dhol players -- it reads especially well after dark, when most {name} baraats move. Signature adds a security team, pyro and confetti timed to the truck's arrival, and an upgraded American vintage car. The vintage car and My Safa turban team are included from Raj Tilak upward in every package -- never an add-on.",
    "Maharaja is the one most families in {name} choose -- moving LED panels, the groom's name lit up, and 6 dhol players. Signature goes further with a security team, pyro and confetti synced to the truck's arrival, and an American vintage car upgrade. From Raj Tilak upward, the vintage car and My Safa team come standard, not bolted on later.",
    "Most people booking around {name} land on Maharaja -- 6 dhol, moving LED panels, and the groom's name lit up in lights. Signature is the full package: a security team, cold pyro and confetti timed with the truck's entry, and an American vintage car upgrade. The vintage car and My Safa team are part of every package from Raj Tilak onward.",
]

WHY_US_1 = [
    "We're a Gujarat-based baraat planning team, and for {name} that matters -- we already know where {group_road} gets tight, when traffic peaks on a wedding evening, and how much room the dhol formation needs before the truck rolls in.",
    "Working out of Gujarat means we're not guessing when it comes to {name} -- we know {group_road} well enough to plan the truck's approach and the car entry without a last-minute scramble.",
    "Being local to Gujarat, we've planned enough baraats around {name} to know the practical details -- how {group_road} behaves on a Saturday evening, where parking works, and what time the procession needs to start.",
]

WHY_US_2 = [
    "We also don't hand your booking to whoever's free that week. Our drivers, DJs, dhol players, and My Safa artists work with us regularly, so the team that ran a wedding near {n1} last month could be the same one showing up in {name} -- fewer surprises on the day.",
    "Nothing here is outsourced to one-off freelancers either. The same drivers, DJs, dhol players, and safa artists work with us booking after booking, so the crew arriving in {name} has likely already run this setup in nearby areas like {n1}.",
    "Our team isn't assembled fresh for each event. The drivers, DJs, dhol players, and My Safa stylists work with PlanMyBaraat regularly, so when they show up in {name}, they're coordinating as a group that's already run baraats in places like {n1}.",
]

PRICING_1 = [
    "People searching for baraat cost in {name} usually want a straight number. The honest answer: it depends on the package, the dhol count, and whether you add pyro or confetti. Raj Tilak is the lightest on the budget, and Signature costs more because it genuinely delivers more.",
    "The real cost of a baraat in {name} comes down to three things -- the package, the dhol count, and whether effects like pyro or confetti are included. Raj Tilak sits at the more affordable end, while Signature is priced higher because it includes considerably more.",
    "If you're comparing baraat costs for {name}, know it's mostly driven by package tier, dhol count, and any add-on effects. Raj Tilak is the most budget-friendly starting point, and Signature costs more simply because it includes a lot more.",
]

PRICING_2 = [
    "Route plays a small part too -- {group_road} in {name} can need a bit more planning than a straightforward wide-road entry. Rather than post one number that won't suit most people, message your date, area, and rough guest count on WhatsApp for a real quote, usually within the hour.",
    "The route matters too -- how {group_road} in {name} behaves on your date can shift the plan slightly. We don't publish a flat price since it wouldn't fit most bookings fairly. Send your date, area, and an approximate guest count on WhatsApp for real numbers, usually inside an hour.",
    "Access around {group_road} in {name} can shift things slightly too, which is why we avoid quoting a flat number upfront. Share your wedding date, area, and a rough headcount on WhatsApp, and you'll have a proper quote back within the hour, most days.",
]

PLANNING_1 = [
    "Wedding season across Ahmedabad runs November through February, and {name} is no exception -- popular dates get booked out early. In peak season, aim to lock in your baraat 3 to 4 weeks ahead; outside those months, a week or two is usually enough.",
    "Like the rest of Ahmedabad, {name} gets busiest between November and February, when trucks, dhol teams, and safa artists go first. Booking 3 to 4 weeks ahead in peak season keeps your slot safe; outside that window, 1 to 2 weeks' notice is normally fine.",
    "November to February is peak wedding season in {name}, as across Ahmedabad, and dates fill up fast. Confirm your baraat 3 to 4 weeks out if your date falls in that stretch -- outside season, a week or two ahead is generally enough.",
]

PLANNING_2 = [
    "It also helps to flag anything specific about your venue early -- a noise curfew, a tight society gate, or a preferred arrival time -- so we can plan the dhol and any pyro or confetti to wrap up on schedule. A rough headcount for {name} lets us plan how much room the formation will need.",
    "Let us know upfront about anything unusual with your venue in {name} -- restricted entry timing, a narrow gate, or a curfew on loud music -- so the dhol and effects segments finish within that window. An approximate guest count also helps us size the formation properly.",
    "If your venue in {name} has any restrictions -- a noise cutoff, limited vehicle access, or a fixed arrival window -- tell us early so we can time the truck and dhol accordingly. A rough headcount also helps us plan enough space for everyone to move comfortably.",
]

CLOSINGS = [
    "Send us your wedding date, {name} as your area, and a rough guest count on WhatsApp at +91 90890 81111. We'll recommend the right package and confirm truck availability, usually within the hour.",
    "Message your date, your venue area in {name}, and an approximate headcount to +91 90890 81111 on WhatsApp. We'll get back with a package recommendation and availability, typically within the hour.",
    "WhatsApp us at +91 90890 81111 with your wedding date, {name} as the location, and roughly how many guests are joining the baraat. Expect a reply with package options and availability within the hour.",
]

FAQS_TEMPLATES = [
    ("How much does a baraat cost in {name}?",
     "It depends on the package, the dhol count, and any effects like pyro or confetti you add. Raj Tilak is our most affordable option, Signature the most complete. Send your date and area on WhatsApp for a real quote."),
    ("Do you cover {name} and the areas around it?",
     "Yes, {name} is part of our regular Ahmedabad coverage, along with nearby areas like {n1} and {n2}. Tell us your exact venue and we'll confirm the route before booking."),
    ("How far ahead should I book a DJ truck for baraat in {name}?",
     "During wedding season, November to February, book 3 to 4 weeks ahead, especially for a popular date. Outside that season, a week or two of notice is usually enough."),
    ("Is the vintage car included in every package for {name} bookings?",
     "Yes, from Raj Tilak upward the vintage car is part of the package, not an add-on. Signature upgrades this to a premium American vintage car for a bigger entrance."),
    ("What's the difference between Raj Tilak and Signature for a baraat in {name}?",
     "Raj Tilak covers the essentials -- truck, DJ, 2 dhol, chhatri lights, vintage car, and safa team. Signature adds 6 dhol, moving LED panels, the groom's name in lights, pyro, confetti, and a security team."),
    ("Can the safa team style the whole baraati group in {name}, not just the groom?",
     "Yes. The My Safa team ties turbans for the groom and the full baraati group, arriving early enough that everyone's ready before the procession starts."),
    ("Does road width or traffic in {name} affect the baraat setup?",
     "It can. Some pockets have narrower lanes or heavier evening traffic, which we account for when planning the truck's parking spot. Share your exact venue and we'll plan the route accordingly."),
]


def wc(text):
    return len(text.split())


def build_entry(idx, name, slug_suffix, group):
    g = GROUP_CHAR[group]
    n1, n2, n3 = neighbors_for(name, group, idx)
    trait_a, trait_b = g["traits"][idx % 4], g["traits"][(idx + 2) % 4]

    intro_p1 = INTRO_OPENERS[idx % len(INTRO_OPENERS)].format(name=name, desc=g["desc"], city="Ahmedabad")
    intro_p2 = INTRO_SECOND[idx % len(INTRO_SECOND)].format(trait=trait_a, city="Ahmedabad")
    intro = intro_p1 + "\n\n" + intro_p2

    la_p1 = LOCALAREA_OPENERS[idx % len(LOCALAREA_OPENERS)].format(name=name, n1=n1, n2=n2, n3=n3)
    la_p2 = LOCALAREA_SECOND[idx % len(LOCALAREA_SECOND)].format(name=name, trait1=trait_a, trait2=trait_b)
    localArea = la_p1 + "\n\n" + la_p2

    wi_p1 = WHATS_INCLUDED_1[idx % len(WHATS_INCLUDED_1)].format(name=name)
    wi_p2 = WHATS_INCLUDED_2[idx % len(WHATS_INCLUDED_2)].format(name=name)
    whatsIncluded = wi_p1 + "\n\n" + wi_p2

    wy_p1 = WHY_US_1[idx % len(WHY_US_1)].format(name=name, group_road=g["road_word"] + " near " + name)
    wy_p2 = WHY_US_2[idx % len(WHY_US_2)].format(n1=n1, name=name)
    whyUs = wy_p1 + "\n\n" + wy_p2

    pr_p1 = PRICING_1[idx % len(PRICING_1)].format(name=name)
    pr_p2 = PRICING_2[idx % len(PRICING_2)].format(name=name, group_road=g["road_word"])
    pricingGuidance = pr_p1 + "\n\n" + pr_p2

    pl_p1 = PLANNING_1[idx % len(PLANNING_1)].format(name=name)
    pl_p2 = PLANNING_2[idx % len(PLANNING_2)].format(name=name)
    planningNotes = pl_p1 + "\n\n" + pl_p2

    closing = CLOSINGS[idx % len(CLOSINGS)].format(name=name)

    faqs = []
    for qi, (q, a) in enumerate(FAQS_TEMPLATES):
        faqs.append({
            "q": q.format(name=name),
            "a": a.format(name=name, n1=n1, n2=n2),
        })

    entry = {
        "slug": f"ahmedabad-{slug_suffix}",
        "intro": intro,
        "localArea": localArea,
        "whatsIncluded": whatsIncluded,
        "whyUs": whyUs,
        "pricingGuidance": pricingGuidance,
        "planningNotes": planningNotes,
        "closing": closing,
        "faqs": faqs,
    }
    return entry


def total_words(entry):
    total = 0
    for k in ["intro", "localArea", "whatsIncluded", "whyUs", "pricingGuidance", "planningNotes", "closing"]:
        total += wc(entry[k])
    for f in entry["faqs"]:
        total += wc(f["q"]) + wc(f["a"])
    return total


entries = []
for idx, (name, slug_suffix, group) in enumerate(AREAS):
    e = build_entry(idx, name, slug_suffix, group)
    entries.append(e)

counts = [(e["slug"], total_words(e)) for e in entries]
for s, c in counts:
    print(s, c)

out_path = "/sessions/eloquent-modest-faraday/mnt/outputs/project/lib/data/content_batches/batch_ahmedabad.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(entries, f, ensure_ascii=False, indent=2)

print("WROTE", out_path, "entries:", len(entries))
