from sqlalchemy.orm import Session
from . import models

def seed_database(db: Session):
    # Check if database is already seeded
    if db.query(models.Shelter).first() is not None:
        print("Database already seeded.")
        return

    print("Seeding database with offline resources...")

    # 1. Seed Shelters (Re-aligned to India)
    shelters = [
        models.Shelter(
            name="Delhi National Relief Camp",
            address="IIT Delhi Ground, Hauz Khas, New Delhi (Region: North)",
            capacity=500,
            contact_number="+91-11-2659-1000",
            available_facilities="Oxygen Support, High Capacity Generators, Clean Water, Medical ICU Bed, Warm Food, Flood Rescue, Earthquake Relief"
        ),
        models.Shelter(
            name="Dehradun Community Safe House",
            address="Rajpur Road Community Center, Dehradun, Uttarakhand (Region: North)",
            capacity=200,
            contact_number="+91-135-274-4001",
            available_facilities="Seismic Safety Structures, First Aid Kits, Power Generators, Sleeping Bags, Earthquake Relief"
        ),
        models.Shelter(
            name="Shimla Shelter Outpost",
            address="Mall Road Emergency Station, Shimla, Himachal Pradesh (Region: North)",
            capacity=80,
            contact_number="+91-177-265-2002",
            available_facilities="Thermal Blankets, Dry Rations, Emergency VHF Radio Command, Storm Relief"
        ),
        models.Shelter(
            name="Chennai Coastal Shelter",
            address="Marina Beach Ground Camp, Triplicane, Chennai, Tamil Nadu (Region: South)",
            capacity=600,
            contact_number="+91-44-2538-4500",
            available_facilities="Life Jackets, Inflatable Rescue Boats, Medical Ward, Solar Chargers, Flood Rescue, Storm Relief"
        ),
        models.Shelter(
            name="Kerala Community Relief Center",
            address="Kochi Port Trust Building, Willingdon Island, Kochi, Kerala (Region: South)",
            capacity=300,
            contact_number="+91-484-266-6639",
            available_facilities="Heavy Drainage Pumps, Clean Drinking Water, Essential Medicine, Packaged Food, Flood Rescue, Storm Relief"
        ),
        models.Shelter(
            name="HAL Bengaluru Gymnasium",
            address="HAL Sports Complex, Old Airport Road, Bengaluru, Karnataka (Region: South)",
            capacity=400,
            contact_number="+91-80-2521-1234",
            available_facilities="Smoke Exhaust Systems, Fire Blankets, Burn Treatment Ward, Cots, Charging Hub, Fire Safety"
        ),
        models.Shelter(
            name="Salt Lake Stadium Relief Camp",
            address="Salt Lake Stadium Block C, Sector III, Kolkata, West Bengal (Region: East)",
            capacity=1000,
            contact_number="+91-33-2335-1234",
            available_facilities="Mass Kitchen, Medical Dispensary, Restrooms, Drinking Water Filtration System, Flood Rescue, Cyclone Relief"
        ),
        models.Shelter(
            name="Odisha Multi-Disaster Shelter",
            address="Kalinga Stadium Area, Nayapalli, Bhubaneswar, Odisha (Region: East)",
            capacity=800,
            contact_number="+91-674-253-0800",
            available_facilities="Cyclone-Resistant Building, Emergency Beacon, Clean Water, Solar Microgrid, Cyclone Relief, Storm Relief"
        ),
        models.Shelter(
            name="Guwahati Relief Terminal",
            address="ISBT Bypass Road Terminal, Guwahati, Assam (Region: East)",
            capacity=250,
            contact_number="+91-361-233-4003",
            available_facilities="First Aid Station, Essential Groceries, Warm Beds, Satellite Phone Link, Earthquake Relief, Flood Rescue"
        ),
        models.Shelter(
            name="Mumbai Municipal Sports Complex",
            address="Dharavi Sports Complex, Sion Link Road, Mumbai, Maharashtra (Region: West)",
            capacity=600,
            contact_number="+91-22-2281-1234",
            available_facilities="High Capacity Water Evac Pumps, Solar Batteries, Inflatable Cots, Packaged Food, Flood Rescue, Storm Relief"
        ),
        models.Shelter(
            name="Ahmedabad Earthquake Relief Camp",
            address="Gandhi Ashram Community Center, Sabarmati, Ahmedabad, Gujarat (Region: West)",
            capacity=500,
            contact_number="+91-79-2755-1234",
            available_facilities="Reinforced Open Shelters, Mobile Clinic, Dry Food Rations, Blankets, Earthquake Relief"
        ),
        models.Shelter(
            name="Pune Fire Response Base",
            address="Shivajinagar Municipal Hall, Pune, Maharashtra (Region: West)",
            capacity=150,
            contact_number="+91-20-2550-1234",
            available_facilities="Oxygen Regulators, Emergency Showers, Burn First Aid Dressing Kits, Fire Safety"
        ),
        models.Shelter(
            name="Nagpur Central Transit Shelter",
            address="Railway Stadium Ground, Civil Lines, Nagpur, Maharashtra (Region: Central)",
            capacity=300,
            contact_number="+91-712-256-1234",
            available_facilities="Seismic Rescue Tools, Emergency Blankets, Essential Medicines, Rations Depot, Earthquake Relief"
        ),
        models.Shelter(
            name="Bhopal Gas & Fire Safety Center",
            address="Arera Colony Community Hall, Bhopal, Madhya Pradesh (Region: Central)",
            capacity=300,
            contact_number="+91-755-246-1234",
            available_facilities="Respiratory Support Kits, Portable Ventilators, First Aid Ward, Drinking Water, Fire Safety"
        ),
        models.Shelter(
            name="Raipur Storm Shelter",
            address="Naya Raipur Sector 12 Relief Center, Raipur, Chhattisgarh (Region: Central)",
            capacity=100,
            contact_number="+91-771-251-1234",
            available_facilities="Reinforced Roofing, Clean Drinking Water, Emergency Power Supplies, Storm Relief"
        )
    ]
    db.bulk_save_objects(shelters)

    # 2. Seed Emergency Contacts (Re-aligned to India)
    contacts = [
        models.EmergencyContact(
            name="National Disaster Response Force (NDRF)",
            role="Disaster Rescue & Evacuation",
            phone_number="1078",
            organization="NDMA India"
        ),
        models.EmergencyContact(
            name="National Integrated Emergency Help",
            role="Primary Emergency Helpline",
            phone_number="112",
            organization="Govt of India"
        ),
        models.EmergencyContact(
            name="Indian Red Cross Society",
            role="First Aid & Humanitarian Relief",
            phone_number="+91-11-2371-6441",
            organization="Red Cross India"
        ),
        models.EmergencyContact(
            name="Fire Response Dispatch (State)",
            role="Fire Fighting & Special Rescue",
            phone_number="101",
            organization="State Fire Authorities"
        ),
        models.EmergencyContact(
            name="Medical Emergency Response (State)",
            role="Ambulance & Trauma Support",
            phone_number="102",
            organization="State Health Services"
        )
    ]
    db.bulk_save_objects(contacts)

    # 3. Seed First Aid Guides
    first_aid_guides = [
        models.FirstAidGuide(
            title="Bleeding Management",
            symptoms="Visible cut or wound, spurting or flowing blood, weakness, confusion or pale skin due to blood loss.",
            immediate_actions=[
                "Apply direct pressure to the wound with a clean cloth or sterile bandage.",
                "Elevate the injured limb above the level of the heart if possible.",
                "If bleeding does not stop, apply firmer pressure. Do not remove the original cloth; add more layers on top.",
                "For severe arterial bleeding, apply a tourniquet 2-3 inches above the wound (never on a joint) and note the exact time applied."
            ],
            warnings=[
                "Do not wash severe, deeply penetrating wounds as it might cause more bleeding.",
                "Do not remove embedded objects; stabilize them in place with bulky dressings.",
                "Do not release a tourniquet once applied until professional medical help arrives."
            ],
            seek_help_trigger="Seek emergency care if the bleeding is spurting, will not stop after 10 minutes of direct pressure, or if the victim shows signs of shock (dizziness, rapid breathing, pale skin)."
        ),
        models.FirstAidGuide(
            title="Burns Treatment",
            symptoms="Redness, pain, swelling, blistering (2nd degree), or charred/white skin with no pain due to nerve damage (3rd degree).",
            immediate_actions=[
                "Cool the burn immediately using cool running water for 10 to 20 minutes. Do not use ice.",
                "Remove rings, tight clothing, or jewelry from the burned area before swelling starts.",
                "Cover the burn loosely with a sterile, non-adhesive bandage or clean plastic wrap.",
                "Elevate the burned area if possible to reduce swelling."
            ],
            warnings=[
                "Do not apply butter, grease, toothpaste, or home remedies to the burn; these lock in heat and cause infection.",
                "Do not pop or puncture blisters, as this increases infection risk.",
                "Do not peel off clothing that is stuck to the burn."
            ],
            seek_help_trigger="Seek medical assistance immediately if the burn is larger than the victim's palm, involves the face, hands, feet, groin, or major joints, or if the burn appears charred, white, or is chemical/electrical in nature."
        ),
        models.FirstAidGuide(
            title="Fractures & Broken Bones",
            symptoms="Intense pain, swelling, bruising, deformity, inability to move the limb, or a grating sensation.",
            immediate_actions=[
                "Control any bleeding first using clean dressings.",
                "Immobilize the injured area. Use a splint (folded cardboard, magazines, wood) secured with cloth to prevent movement.",
                "Apply cold packs wrapped in a cloth to reduce swelling. Do not apply ice directly.",
                "Keep the victim calm and still to avoid shifting the bone."
            ],
            warnings=[
                "Do not attempt to push a protruding bone back into the wound.",
                "Do not try to align or straighten a deformed bone.",
                "Do not give the victim anything to drink or eat in case surgery is required."
            ],
            seek_help_trigger="Seek immediate emergency response for compound fractures (bone visible), neck, head, or back injuries, or if the limb below the fracture is cold, pale, or blue."
        ),
        models.FirstAidGuide(
            title="CPR Guidance (Cardiopulmonary Resuscitation)",
            symptoms="Victim is unresponsive, unconscious, and not breathing or only gasping.",
            immediate_actions=[
                "Check response: Tap the shoulders and shout 'Are you okay?'.",
                "Call for emergency help immediately (911/999) and get an AED if available.",
                "Start Chest Compressions: Place hands in the center of the chest and push hard and fast (100-120 compressions per minute, at least 2 inches deep).",
                "Perform 30 compressions followed by 2 rescue breaths (tilt head, pinch nose, blow into mouth for 1 second). Repeat cycle.",
                "If untrained, perform Hands-Only CPR (continuous, uninterrupted chest compressions) until medical staff arrives."
            ],
            warnings=[
                "Do not perform CPR if the victim is breathing normally.",
                "Do not interrupt compressions for more than 10 seconds.",
                "Do not press on the lower tip of the breastbone (xiphoid process)."
            ],
            seek_help_trigger="CPR is an absolute life-or-death emergency. Always dial emergency response services immediately before starting compressions."
        ),
        models.FirstAidGuide(
            title="Choking Response",
            symptoms="Inability to speak, breathe, or cough; clutching the throat (universal choking sign); blue lips or skin; panic.",
            immediate_actions=[
                "Ask 'Are you choking? Can you speak?'. If they can cough or speak, encourage them to cough hard.",
                "If they cannot speak or breathe, perform Heimlich Maneuver: Stand behind the person, wrap arms around their waist.",
                "Make a fist with one hand, place it just above the navel (well below the breastbone). Grasp the fist with the other hand.",
                "Deliver quick, upward and inward thrusts.",
                "For an unconscious choking person: Lower them to the ground, look inside the mouth for the object (sweep only if visible), and begin chest compressions (CPR)."
            ],
            warnings=[
                "Do not perform abdominal thrusts on pregnant women or infants under 1 year old. Use chest thrusts instead.",
                "Do not perform a blind finger sweep if you cannot see the object, as you might push it deeper."
            ],
            seek_help_trigger="Seek immediate medical assistance if the obstruction does not clear within a few thrusts or if the person loses consciousness."
        ),
        models.FirstAidGuide(
            title="Snake Bite Treatment",
            symptoms="Two puncture marks at the bite site, severe pain, swelling, redness, difficulty breathing, sweating, or blurred vision.",
            immediate_actions=[
                "Keep the victim completely still and calm. Movement causes the venom to spread faster.",
                "Wash the bite area gently with clean soap and water.",
                "Keep the bitten limb positioned at or below the level of the heart.",
                "Remove tight clothing, rings, or bands near the bite before swelling occurs."
            ],
            warnings=[
                "Do not apply a tourniquet or tight band.",
                "Do not apply ice or submerge the wound in water.",
                "Do not cut the wound or attempt to suck out the venom by mouth.",
                "Do not try to capture the snake, but take a photo from a safe distance if possible to help identify the species."
            ],
            seek_help_trigger="All snake bites should be treated as a medical emergency. Go to the nearest hospital immediately to receive anti-venom."
        ),
        models.FirstAidGuide(
            title="Heat Stroke Emergency",
            symptoms="Core body temperature above 103°F (39.4°C), hot, red, dry skin (no sweating), rapid pulse, headache, dizziness, nausea, confusion, or fainting.",
            immediate_actions=[
                "Move the person to a cool, shaded area or air-conditioned room immediately.",
                "Cool the body rapidly: Spray with cool water, fan them, or place ice packs or wet towels on the head, neck, armpits, and groin.",
                "If the person is conscious and able to swallow, offer cool water. Do not force fluids if they are confused."
            ],
            warnings=[
                "Do not use cold baths for older adults or young children without medical advice.",
                "Do not give aspirin or acetaminophen to treat heat stroke."
            ],
            seek_help_trigger="Heat stroke is a medical emergency. Call emergency services immediately. Delaying treatment can lead to brain damage or death."
        ),
        models.FirstAidGuide(
            title="Drowning Response",
            symptoms="Victim pulled from water, unresponsive, not breathing, cyanosis (blue lips/skin), cold skin, vomiting water.",
            immediate_actions=[
                "Get the victim out of the water safely without endangering yourself.",
                "Place the victim on their back on a flat, firm surface.",
                "Check for breathing and pulse. If not breathing, tilt the head back and give 5 rescue breaths immediately (crucial in drowning cases).",
                "Begin cycles of 30 chest compressions and 2 rescue breaths. Repeat until the victim starts breathing or help arrives.",
                "If the victim begins breathing, roll them onto their side in the recovery position to allow water to drain from the airway."
            ],
            warnings=[
                "Do not perform abdominal thrusts (Heimlich) to drain water from the lungs; this increases vomiting and airway blockage.",
                "Do not delay starting CPR to drain water; compressions and rescue breaths are top priority."
            ],
            seek_help_trigger="Always call emergency services immediately for any drowning incident, even if the victim revives, due to the risk of delayed lung complications ('secondary drowning')."
        )
    ]
    db.bulk_save_objects(first_aid_guides)

    # 4. Seed Survival Checklists
    checklists = [
        models.EmergencyChecklist(
            title="Family Emergency Kit",
            items=[
                "Water: One gallon per person per day for at least 3 days (for drinking and sanitation).",
                "Food: At least a 3-day supply of non-perishable, easy-to-prepare food.",
                "Flashlight: Crank-powered or battery-powered, with extra batteries.",
                "First Aid Kit: Bandages, antiseptic wipes, painkillers, thermometer, and personal medications.",
                "Multi-tool or Swiss Army Knife.",
                "Battery-powered or Hand-crank NOAA Weather Radio.",
                "Whistle: To signal for emergency rescue.",
                "Personal Hygiene Items: Moist towelettes, garbage bags, and plastic ties.",
                "Local Maps: Physical paper maps of your area.",
                "Cell Phone: Fully charged with chargers, cables, and a backup power bank.",
                "Emergency Blanket or sleeping bags for each family member."
            ]
        ),
        models.EmergencyChecklist(
            title="Flood Survival Kit",
            items=[
                "Waterproof Document Bag: Passports, IDs, insurance policies, and cash sealed in plastic.",
                "Sturdy Boots or Waterproof Waders.",
                "Personal Flotation Device (Life jackets) for each family member.",
                "Rain gear: Ponchos, raincoats, and heavy-duty plastic garbage bags.",
                "Disinfectant & Hand Sanitizer: Floodwaters are highly contaminated.",
                "Rubber Gloves & Face Masks (N95) for cleanup safety.",
                "Insect Repellent: Standing water brings mosquitoes and pests.",
                "Rope (50 feet): Strong nylon rope for rescue or securing items."
            ]
        ),
        models.EmergencyChecklist(
            title="Earthquake Survival Kit",
            items=[
                "Heavy Leather Gloves: To protect hands from shattered glass and debris.",
                "Sturdy, Thick-soled Shoes: Keep next to your bed to avoid stepping on glass.",
                "Goggles or Eye Protection: To protect against falling plaster and dust.",
                "Dust Masks (N95) or bandanas to filter dust and airborne particles.",
                "Wrench or Pliers: To turn off gas and water utility valves.",
                "Sturdy Helmet or hard hat for head protection.",
                "Fire Extinguisher: Earthquakes frequently trigger electrical and gas fires.",
                "Emergency whistle or air horn to signal if trapped under rubble."
            ]
        ),
        models.EmergencyChecklist(
            title="Cyclone Preparedness Kit",
            items=[
                "Heavy Duty Tarps: To cover broken windows or roof damage temporarily.",
                "Hammer, Nails, and Duct Tape: For quick house fortification.",
                "Tie-down Straps or Bungee Cords: To secure outdoor furniture, bins, and bicycles.",
                "Battery-operated Lantern: Safer than candles which pose a fire hazard in high winds.",
                "Prescription Medications: A 2-week supply since pharmacies may be closed.",
                "Cash: ATMs will not work if power lines are down.",
                "Matches or Lighters in a waterproof container."
            ]
        ),
        models.EmergencyChecklist(
            title="Emergency Evacuation Kit ('Go-Bag')",
            items=[
                "Lightweight Backpack: Ready to grab instantly, one for each family member.",
                "Emergency Cash: Small bills (ATMs and card machines might be down).",
                "Copies of Key Documents: Stored on a secure USB drive or printed.",
                "Prescription Medications & Extra Glasses/Contact Lenses.",
                "Change of clothes: Lightweight, warm layers, and sturdy socks.",
                "High-calorie Snacks: Energy bars, nuts, dried fruit, or military-style MREs.",
                "Water Filter Bottle or purification tablets.",
                "Multi-tool, small flashlight, and emergency whistle.",
                "Contact card: List of emergency contacts and family meeting spots."
            ]
        )
    ]
    db.bulk_save_objects(checklists)

    # 5. Seed Survival Guides (Before, During, After, Prevention)
    survival_guides = [
        # --- FLOOD ---
        models.SurvivalGuide(
            category="Flood",
            stage="Before",
            content="""### Before a Flood: Preparation
- **Know Your Risk**: Check local maps to see if your home is in a flood-prone zone.
- **Set Up Emergency Alerts**: Download local warning apps and keep a weather radio ready.
- **Fortify Your Home**: Elevate critical electrical components (breaker boxes, water heaters).
- **Clear Gutters**: Clear leaves, twigs, and sediment from gutters and storm drains.
- **Prepare an Evacuation Plan**: Identify high-ground evacuation routes and local emergency shelters.
- **Pack a Go-Bag**: Prepare a waterproof bag with critical documents, cash, and fresh water.
"""
        ),
        models.SurvivalGuide(
            category="Flood",
            stage="During",
            content="""### During a Flood: Immediate Actions
- **Move to Higher Ground**: If flooding is imminent or occurring, move to higher ground immediately.
- **Do Not Drive**: Never drive or walk through floodwaters. Just 6 inches of moving water can knock you down, and 12 inches can sweep a car away ("Turn Around, Don't Drown").
- **Evacuate if Ordered**: Leave your home immediately if local officials advise evacuation.
- **Disconnect Utilities**: If safe to do so, turn off gas and electricity at the main switch.
- **Avoid Contact**: Avoid contact with floodwater, which can carry sewage, chemicals, and live electricity.
"""
        ),
        models.SurvivalGuide(
            category="Flood",
            stage="After",
            content="""### After a Flood: Recovery & Safety
- **Wait for All-Clear**: Do not return home until local authorities declare it safe.
- **Beware of Hazards**: Look out for downed power lines, cracked foundations, gas leaks, and wild animals (snakes, rodents) displaced by water.
- **Clean Safely**: Wear rubber boots, gloves, and N95 masks. Discard any food that touched floodwater.
- **Dry the Structure**: Dry out your home as quickly as possible to prevent toxic mold growth.
- **Verify Drinking Water**: Do not drink tap water until verified safe. Boil water for at least 1 minute before drinking or cooking.
"""
        ),

        # --- EARTHQUAKE ---
        models.SurvivalGuide(
            category="Earthquake",
            stage="Before",
            content="""### Before an Earthquake: Preparedness
- **Secure Heavy Items**: Bolt tall furniture, bookshelves, and water heaters to wall studs. Use latch hooks on cabinets.
- **Clear Bedside Areas**: Do not hang heavy pictures or mirrors above beds or couches.
- **Practice Drills**: Conduct 'Drop, Cover, and Hold On' drills regularly with family members.
- **Locate Shut-Offs**: Learn how to shut off gas, water, and electricity in your home.
- **Pack Sturdy Shoes**: Keep a pair of thick-soled shoes and a flashlight near your bed.
"""
        ),
        models.SurvivalGuide(
            category="Earthquake",
            stage="During",
            content="""### During an Earthquake: Survival Actions
- **DROP, COVER, AND HOLD ON**:
  - **Drop**: Drop onto your hands and knees. This protects you from falling.
  - **Cover**: Cover your head and neck under a sturdy table or desk. If no shelter is nearby, crawl to an interior wall.
  - **Hold On**: Hold onto your shelter until the shaking stops.
- **Stay Indoors**: Do not run outside. Most injuries occur when people try to leave buildings.
- **If Outdoors**: Move to an open area away from buildings, power lines, streetlights, and trees. Drop to the ground.
- **If Driving**: Pull over to a safe area away from overpasses, bridges, and power lines. Remain inside the vehicle.
"""
        ),
        models.SurvivalGuide(
            category="Earthquake",
            stage="After",
            content="""### After an Earthquake: Safety Procedures
- **Check for Injuries**: Administer basic first aid, but do not move seriously injured people unless they are in immediate danger.
- **Inspect for Fires**: Check for gas leaks. If you smell gas, open windows, shut off the main valve, and do NOT turn on light switches (which can cause sparks).
- **Expect Aftershocks**: Be prepared for subsequent tremors. They can cause damaged structures to collapse.
- **Stay Clear of Damaged Buildings**: Avoid entering buildings showing visible cracks or structural failure.
- **Listen to Radio**: Tune into emergency broadcasts for evacuation orders or water safety warnings.
"""
        ),

        # --- FIRE ---
        models.SurvivalGuide(
            category="Fire",
            stage="Prevention",
            content="""### Fire Prevention & Home Safety
- **Install Smoke Alarms**: Place smoke alarms on every level of your home, inside bedrooms, and outside sleeping areas. Test them monthly.
- **Inspect Heating Units**: Keep space heaters at least 3 feet away from combustible materials (curtains, beds).
- **Maintain Wiring**: Replace frayed electrical cords. Do not overload power strips.
- **Plan Exit Routes**: Establish two clear exit paths from every room in your home.
- **Keep Extinguishers Handy**: Place fire extinguishers in the kitchen, garage, and near fireplace zones. Learn the P.A.S.S. method (Pull, Aim, Squeeze, Sweep).
"""
        ),
        models.SurvivalGuide(
            category="Fire",
            stage="During",
            content="""### During a Fire: Safe Evacuation
- **Crawl Low**: Smoke and toxic gases rise. Crawl on your hands and knees where the air is cleaner.
- **Test Doors**: Before opening any door, touch it with the back of your hand. If it is hot, do not open it; use your alternate exit.
- **Stop, Drop, and Roll**: If your clothes catch fire, immediately stop, drop to the ground, cover your face, and roll back and forth until the flames are out.
- **Do Not Use Elevators**: Always use the stairs during a building evacuation.
- **Get Out, Stay Out**: Once you escape, stay outside. Never re-enter a burning building under any circumstances.
"""
        ),
        models.SurvivalGuide(
            category="Fire",
            stage="After",
            content="""### After Evacuation: Next Steps
- **Call Emergency Services**: Call 911 or local emergency dispatchers immediately from a safe location.
- **Render First Aid**: Treat minor burns with cool water; seek immediate help for severe burns or smoke inhalation.
- **Wait for Fire Marshal**: Do not enter the building until fire officials state it is structurally safe.
- **Document Damages**: Take photos of structural and property damage once cleared for insurance claims.
- **Discard Food/Meds**: Throw away any food, medicine, or cosmetics exposed to heat, smoke, or soot.
"""
        ),

        # --- CYCLONE ---
        models.SurvivalGuide(
            category="Cyclone",
            stage="Before",
            content="""### Before a Cyclone: Preparation
- **Secure Windows**: Install storm shutters or board up windows with marine plywood.
- **Clear Outdoor Area**: Bring inside all outdoor furniture, trash cans, toys, and gardening tools.
- **Trim Branches**: Trim tree branches close to your house to prevent them from breaking and crashing into windows.
- **Fill Water Containers**: Clean bathtubs and large containers and fill them with clean water.
- **Charge Batteries**: Fully charge your mobile devices, power banks, and battery-operated lanterns.
- **Fuel Vehicles**: Keep your car's fuel tank full in case evacuation is ordered.
"""
        ),
        models.SurvivalGuide(
            category="Cyclone",
            stage="During",
            content="""### During a Cyclone: High Wind Safety
- **Stay Indoors**: Remain inside until the cyclone has completely passed.
- **Take Shelter**: Move to a small, windowless interior room, hallway, or basement on the lowest level.
- **Keep Away from Windows**: Close all interior doors and secure exterior windows.
- **Beware the Eye of the Storm**: If the wind stops suddenly, you may be in the center (eye) of the cyclone. High-velocity winds will resume from the opposite direction shortly. Stay inside.
- **Turn off Major Appliances**: Protect appliances from electrical power surges.
"""
        ),
        models.SurvivalGuide(
            category="Cyclone",
            stage="After",
            content="""### After a Cyclone: Recovery
- **Watch for Debris**: Beware of fallen power lines, broken glass, sharp metal, and flooded areas.
- **Check Utility Lines**: Inspect gas, water, and electricity lines. Report damages to utility providers.
- **Avoid Tap Water**: Treat water as contaminated until local authorities declare it safe.
- **Use Flashlights, Not Candles**: Avoid candles due to potential gas leaks; use battery-powered lights instead.
- **Check on Neighbors**: Help vulnerable neighbors (elderly, families with infants) if safe to do so.
"""
        )
    ]
    db.bulk_save_objects(survival_guides)

    db.commit()
    print("Database seeding completed successfully.")
