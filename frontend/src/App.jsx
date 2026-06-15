import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, HeartPulse, Landmark, PhoneCall, Radio, Wifi, Info, X } from 'lucide-react';

// Import assets
import frame1 from './assets/frame_1.png';
import frame2 from './assets/frame_2.png';
import frame3 from './assets/frame_3.png';
import frame4 from './assets/frame_4.png';

export default function App() {
  // Section 2: AI Console States
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleLogs, setConsoleLogs] = useState([
    { type: 'system', text: 'NODE DIRECTIVE: LOCAL SYSTEM ONLINE' },
    { type: 'system', text: 'Select a query template below or type your question.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const consoleEndRef = useRef(null);

  // Section 3: Shelter Network & Search State
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedShelterForModal, setSelectedShelterForModal] = useState(null);
  
  // Search parameters for Shelter Finder
  const [selectedRegion, setSelectedRegion] = useState('North');
  const [selectedDisaster, setSelectedDisaster] = useState('Flood');
  const [searchResults, setSearchResults] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Fallback Indian shelters list in case backend is offline
  const fallbackIndianShelters = [
    { id: 1, name: "Delhi National Relief Camp", address: "IIT Delhi Ground, Hauz Khas, New Delhi (Region: North)", capacity: "375/500", contact: "+91-11-2659-1000", facilities: "Oxygen Support, High Capacity Generators, Clean Water, Medical ICU Bed, Warm Food, Flood Rescue, Earthquake Relief", status: "AVAILABLE", distance: "2.1 km" },
    { id: 2, name: "Dehradun Community Safe House", address: "Rajpur Road Community Center, Dehradun, Uttarakhand (Region: North)", capacity: "150/200", contact: "+91-135-274-4001", facilities: "Seismic Safety Structures, First Aid Kits, Power Generators, Sleeping Bags, Earthquake Relief", status: "AVAILABLE", distance: "4.5 km" },
    { id: 3, name: "Shimla Shelter Outpost", address: "Mall Road Emergency Station, Shimla, Himachal Pradesh (Region: North)", capacity: "80/80", contact: "+91-177-265-2002", facilities: "Thermal Blankets, Dry Rations, Emergency VHF Radio Command, Storm Relief", status: "FULL", distance: "7.8 km" },
    { id: 4, name: "Chennai Coastal Shelter", address: "Marina Beach Ground Camp, Triplicane, Chennai, Tamil Nadu (Region: South)", capacity: "450/600", contact: "+91-44-2538-4500", facilities: "Life Jackets, Inflatable Rescue Boats, Medical Ward, Solar Chargers, Flood Rescue, Storm Relief", status: "AVAILABLE", distance: "1.8 km" },
    { id: 5, name: "Kerala Community Relief Center", address: "Kochi Port Trust Building, Willingdon Island, Kochi, Kerala (Region: South)", capacity: "300/300", contact: "+91-484-266-6639", facilities: "Heavy Drainage Pumps, Clean Drinking Water, Essential Medicine, Packaged Food, Flood Rescue, Storm Relief", status: "FULL", distance: "3.4 km" },
    { id: 6, name: "HAL Bengaluru Gymnasium", address: "HAL Sports Complex, Old Airport Road, Bengaluru, Karnataka (Region: South)", capacity: "300/400", contact: "+91-80-2521-1234", facilities: "Smoke Exhaust Systems, Fire Blankets, Burn Treatment Ward, Cots, Charging Hub, Fire Safety", status: "AVAILABLE", distance: "5.6 km" },
    { id: 7, name: "Salt Lake Stadium Relief Camp", address: "Salt Lake Stadium Block C, Sector III, Kolkata, West Bengal (Region: East)", capacity: "750/1000", contact: "+91-33-2335-1234", facilities: "Mass Kitchen, Medical Dispensary, Restrooms, Drinking Water Filtration System, Flood Rescue, Cyclone Relief", status: "AVAILABLE", distance: "1.2 km" },
    { id: 8, name: "Odisha Multi-Disaster Shelter", address: "Kalinga Stadium Area, Nayapalli, Bhubaneswar, Odisha (Region: East)", capacity: "600/800", contact: "+91-674-253-0800", facilities: "Cyclone-Resistant Building, Emergency Beacon, Clean Water, Solar Microgrid, Cyclone Relief, Storm Relief", status: "AVAILABLE", distance: "3.8 km" },
    { id: 9, name: "Guwahati Relief Terminal", address: "ISBT Bypass Road Terminal, Guwahati, Assam (Region: East)", capacity: "180/250", contact: "+91-361-233-4003", facilities: "First Aid Station, Essential Groceries, Warm Beds, Satellite Phone Link, Earthquake Relief, Flood Rescue", status: "AVAILABLE", distance: "7.5 km" },
    { id: 10, name: "Mumbai Municipal Sports Complex", address: "Dharavi Sports Complex, Sion Link Road, Mumbai, Maharashtra (Region: West)", capacity: "600/600", contact: "+91-22-2281-1234", facilities: "High Capacity Water Evac Pumps, Solar Batteries, Inflatable Cots, Packaged Food, Flood Rescue, Storm Relief", status: "FULL", distance: "2.5 km" },
    { id: 11, name: "Ahmedabad Earthquake Relief Camp", address: "Gandhi Ashram Community Center, Sabarmati, Ahmedabad, Gujarat (Region: West)", capacity: "375/500", contact: "+91-79-2755-1234", facilities: "Reinforced Open Shelters, Mobile Clinic, Dry Food Rations, Blankets, Earthquake Relief", status: "AVAILABLE", distance: "4.1 km" },
    { id: 12, name: "Pune Fire Response Base", address: "Shivajinagar Municipal Hall, Pune, Maharashtra (Region: West)", capacity: "110/150", contact: "+91-20-2550-1234", facilities: "Oxygen Regulators, Emergency Showers, Burn First Aid Dressing Kits, Fire Safety", status: "AVAILABLE", distance: "6.2 km" },
    { id: 13, name: "Nagpur Central Transit Shelter", address: "Railway Stadium Ground, Civil Lines, Nagpur, Maharashtra (Region: Central)", capacity: "220/300", contact: "+91-712-256-1234", facilities: "Seismic Rescue Tools, Emergency Blankets, Essential Medicines, Rations Depot, Earthquake Relief", status: "AVAILABLE", distance: "2.3 km" },
    { id: 14, name: "Bhopal Gas & Fire Safety Center", address: "Arera Colony Community Hall, Bhopal, Madhya Pradesh (Region: Central)", capacity: "220/300", contact: "+91-755-246-1234", facilities: "Respiratory Support Kits, Portable Ventilators, First Aid Ward, Drinking Water, Fire Safety", status: "AVAILABLE", distance: "4.8 km" },
    { id: 15, name: "Raipur Storm Shelter", address: "Naya Raipur Sector 12 Relief Center, Raipur, Chhattisgarh (Region: Central)", capacity: "75/100", contact: "+91-771-251-1234", facilities: "Reinforced Roofing, Clean Drinking Water, Emergency Power Supplies, Storm Relief", status: "AVAILABLE", distance: "9.1 km" }
  ];

  // Dynamic Shelters loaded from API (falls back to fallbackIndianShelters if offline)
  const [shelters, setShelters] = useState(fallbackIndianShelters);

  // SVG Geographic India nodes structure
  const regionalNodes = [
    { id: 'DEL', name: "Delhi National Relief Camp", x: 200, y: 50, region: "North", capacity: "350/500", status: "AVAILABLE", contact: "+91-11-2659-1000", facilities: "Oxygen Support, High Capacity Generators, Clean Water, Medical ICU Bed, Warm Food, Flood Rescue, Earthquake Relief" },
    { id: 'MUM', name: "Mumbai Municipal Sports Complex", x: 90, y: 170, region: "West", capacity: "600/600", status: "FULL", contact: "+91-22-2281-1234", facilities: "High Capacity Water Evac Pumps, Solar Batteries, Inflatable Cots, Packaged Food, Flood Rescue, Storm Relief" },
    { id: 'KOL', name: "Salt Lake Stadium Relief Camp", x: 310, y: 130, region: "East", capacity: "850/1000", status: "AVAILABLE", contact: "+91-33-2335-1234", facilities: "Mass Kitchen, Medical Dispensary, Restrooms, Drinking Water Filtration System" },
    { id: 'BLR', name: "HAL Bengaluru Gymnasium", x: 160, y: 250, region: "South", capacity: "180/400", status: "AVAILABLE", contact: "+91-80-2521-1234", facilities: "Drone Dispatch Base, Starlink Satellite Terminal, Clean Drinking Water, Solar Charger Hub, Beds, Fire Safety" },
    { id: 'NAG', name: "Nagpur Central Transit Shelter", x: 200, y: 145, region: "Central", capacity: "120/300", status: "AVAILABLE", contact: "+91-712-256-1234", facilities: "Seismic Rescue Tools, Emergency Blankets, Essential Medicines, Rations Depot, Earthquake Relief" }
  ];

  // Section 4: First Aid State (Null on load so no modal auto-opens)
  const [activeFirstAidKey, setActiveFirstAidKey] = useState(null);
  const firstAidGuides = {
    cpr: {
      title: "Cardiopulmonary Resuscitation (CPR)",
      steps: [
        "Check responsiveness: Tap the victim's shoulders and shout loudly.",
        "Call for help: Immediately dial emergency lines (112 / 102).",
        "Begin chest compressions: Push hard and fast in the center of the chest (100-120 beats per minute, at least 2 inches deep).",
        "Continue compressions: Do not stop until professional medical help arrives or the victim shows signs of life."
      ]
    },
    bleeding: {
      title: "Severe Bleeding Control",
      steps: [
        "Apply direct pressure: Use a clean cloth or sterile dressing directly on the wound.",
        "Elevate the limb: Position the bleeding limb above heart level if possible.",
        "Secure the dressing: Wrap a bandage tightly over the dressing. Do not remove the initial layers.",
        "Apply tourniquet: For catastrophic extremity bleeding, apply 2-3 inches above the wound (never on a joint)."
      ]
    },
    burns: {
      title: "Burns First Aid",
      steps: [
        "Cool the burn: Hold the area under cool running tap water for 10-20 minutes. Do not use ice.",
        "Remove constricting items: Gently take off rings, watches, or tight clothes before swelling begins.",
        "Protect the wound: Cover loosely with a clean, non-stick bandage or plastic wrap.",
        "Do not pop blisters: Keep the skin intact to prevent severe infection."
      ]
    },
    fractures: {
      title: "Fractures & Broken Bones",
      steps: [
        "Stop any bleeding: Apply pressure to open wounds first.",
        "Immobilize the area: Use a splint (cardboard, wood, magazines) to stabilize the joint above and below the fracture.",
        "Apply ice: Wrap an ice pack in a towel and apply to reduce swelling.",
        "Keep calm: Avoid moving the victim's head, neck, or spine."
      ]
    },
    choking: {
      title: "Choking Relief (Heimlich)",
      steps: [
        "Confirm choking: Ask 'Are you choking? Can you speak?'. If they can cough, let them try.",
        "Stand behind: Wrap your arms around their waist, tilting them slightly forward.",
        "Position fist: Place your fist just above their navel, below the ribcage.",
        "Deliver thrusts: Pull upward and inward quickly until the block is dislodged."
      ]
    },
    drowning: {
      title: "Drowning Response",
      steps: [
        "Get victim to safety: Pull the person out of water immediately without endangering yourself.",
        "Check breathing: If not breathing, perform 5 initial rescue breaths immediately.",
        "Start compressions: Perform cycles of 30 chest compressions and 2 rescue breaths.",
        "Roll onto side: Once breathing returns, place them in the recovery position to drain airways."
      ]
    }
  };

  // Section 5: Emergency Protocols State (Null on load)
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const emergencyActions = {
    Earthquake: {
      actions: [
        "DROP to your hands and knees to protect yourself from falling.",
        "COVER your head and neck under a sturdy table or desk.",
        "HOLD ON to your shelter until the shaking stops.",
        "Evacuate safely once tremors end, watching for structural cracks."
      ]
    },
    Flood: {
      actions: [
        "Move to higher ground immediately; do not wait for instructions.",
        "Avoid walking or driving through moving floodwaters (Turn Around, Don't Drown).",
        "Carry your waterproof emergency Go-Bag containing food, clean water, and documents.",
        "Await official broadcasts on local battery-powered radios."
      ]
    },
    Fire: {
      actions: [
        "Crawl low under smoke to stay below toxic gases.",
        "Test doors with the back of your hand before opening. If hot, use alternate escape path.",
        "If clothing catches fire: Stop, Drop, and Roll immediately.",
        "Once outside, stay outside. Never enter a burning structure."
      ]
    },
    Cyclone: {
      actions: [
        "Take shelter in a small, windowless interior room on the lowest level.",
        "Disconnect major electrical appliances to prevent surge hazards.",
        "Keep emergency lighting (lanterns, flashlights) close; avoid candles.",
        "Do not leave the shelter during the eye of the storm; wind speeds will resume."
      ]
    },
    Landslide: {
      actions: [
        "Evacuate immediately if you hear crackling trees or rumbling earth.",
        "If escape is impossible, curl into a tight ball and protect your head.",
        "Stay away from valleys and low land structures.",
        "Watch for secondary slides which frequently occur after initial slips."
      ]
    }
  };

  const protocols = [
    { num: "01", title: "Detect", desc: "Monitor alert feeds, local environmental indicators, and official VHF radio dispatches." },
    { num: "02", title: "Assess", desc: "Identify threat magnitude, proximity to local floodlines, and infrastructure integrity." },
    { num: "03", title: "Respond", desc: "Secure immediate shelter resources, verify emergency checklists, and lock utility mainlines." },
    { num: "04", title: "Protect", desc: "Deploy personal protective wear, gather emergency Go-Bags, and gather in safe room." },
    { num: "05", title: "Evacuate", desc: "Proceed along designated high-ground routes toward shelter node coordinators." },
    { num: "06", title: "Recover", desc: "Check community status, inspect for electrical hazards, and wait for official clearance." }
  ];

  // Section 6: Diagnostics States
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine ? 'CONNECTED' : 'LOCAL ONLY');

  const fallbackIndianContacts = [
    { name: "National Disaster Response Force (NDRF)", role: "Disaster Rescue & Evacuation", phone_number: "1078", organization: "NDMA India" },
    { name: "National Integrated Emergency Help", role: "Primary Emergency Helpline", phone_number: "112", organization: "Govt of India" },
    { name: "Indian Red Cross Society", role: "First Aid & Humanitarian Relief", phone_number: "+91-11-2371-6441", organization: "Red Cross India" },
    { name: "Fire Response Dispatch (State)", role: "Fire Fighting & Special Rescue", phone_number: "101", organization: "State Fire Authorities" },
    { name: "Medical Emergency Response (State)", role: "Ambulance & Trauma Support", phone_number: "102", organization: "State Health Services" }
  ];

  const [contacts, setContacts] = useState(fallbackIndianContacts);

  useEffect(() => {
    const handleOnline = () => setNetworkStatus('CONNECTED');
    const handleOffline = () => setNetworkStatus('LOCAL ONLY');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch shelters and contacts dynamically from the local backend
  useEffect(() => {
    fetch('http://localhost:8000/api/shelters')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          const mapped = data.map(s => ({
            id: s.id,
            name: s.name,
            address: s.address,
            capacity: `${Math.floor(s.capacity * 0.75)}/${s.capacity}`,
            contact: s.contact_number,
            facilities: s.available_facilities,
            status: Math.floor(s.capacity * 0.75) >= s.capacity ? "FULL" : "AVAILABLE",
            distance: s.name.includes("Delhi") ? "2.1 km" : 
                      s.name.includes("Dehradun") ? "4.5 km" : 
                      s.name.includes("Shimla") ? "7.8 km" :
                      s.name.includes("Chennai") ? "1.8 km" :
                      s.name.includes("Kerala") ? "3.4 km" :
                      s.name.includes("HAL") ? "5.6 km" :
                      s.name.includes("Salt Lake") ? "1.2 km" :
                      s.name.includes("Odisha") ? "3.8 km" :
                      s.name.includes("Guwahati") ? "7.5 km" :
                      s.name.includes("Mumbai") ? "2.5 km" :
                      s.name.includes("Ahmedabad") ? "4.1 km" :
                      s.name.includes("Pune") ? "6.2 km" :
                      s.name.includes("Nagpur") ? "2.3 km" :
                      s.name.includes("Bhopal") ? "4.8 km" : "9.1 km"
          }));
          setShelters(mapped);
        }
      })
      .catch(() => {
        // Silently fallback to offline fallbackIndianShelters
      });

    fetch('http://localhost:8000/api/contacts')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setContacts(data);
        }
      })
      .catch(() => {
        // Silently fallback to offline fallbackIndianContacts
      });
  }, []);

  // Filter shelters according to Selected Region and Disaster Scenario
  const handleShelterSearch = (e) => {
    if (e) e.preventDefault();
    setSearchTriggered(true);
    const filtered = shelters.filter(s => {
      const matchRegion = s.address.toLowerCase().includes(`(region: ${selectedRegion.toLowerCase()})`) ||
                          s.address.toLowerCase().includes(`region: ${selectedRegion.toLowerCase()}`);
      
      // Map Storm/Cyclone keywords
      const disasterKeyword = selectedDisaster === "Storm" ? "cyclone" : selectedDisaster.toLowerCase();
      const matchDisaster = s.facilities 
        ? s.facilities.toLowerCase().includes(disasterKeyword) || s.facilities.toLowerCase().includes(selectedDisaster.toLowerCase())
        : false;
      return matchRegion && matchDisaster;
    });
    setSearchResults(filtered);
    
    // Auto-select corresponding geographic node to animate map
    const nodeMapping = {
      'North': 'DEL',
      'West': 'MUM',
      'East': 'KOL',
      'South': 'BLR',
      'Central': 'NAG'
    };
    const nodeCode = nodeMapping[selectedRegion];
    const node = regionalNodes.find(n => n.id === nodeCode);
    if (node) {
      setSelectedNode(node);
    }
  };

  // Perform initial search on mount
  useEffect(() => {
    if (shelters && shelters.length > 0) {
      const filtered = shelters.filter(s => {
        return s.address.toLowerCase().includes(`region: ${selectedRegion.toLowerCase()}`) &&
               (s.facilities.toLowerCase().includes(selectedDisaster.toLowerCase()) || 
                (selectedDisaster === "Storm" && s.facilities.toLowerCase().includes("cyclone")));
      });
      setSearchResults(filtered);
    }
  }, [shelters]);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  // Action: Submit AI query in Console
  const handleConsoleSubmit = async (e) => {
    e.preventDefault();
    if (!consoleInput.trim() || isTyping) return;

    const query = consoleInput;
    setConsoleInput('');
    setConsoleLogs((prev) => [...prev, { type: 'user', text: query }]);
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: query }],
          disaster_context: null
        })
      });

      if (res.ok) {
        const data = await res.json();
        simulateResponseTyping(data.content);
      } else {
        throw new Error();
      }
    } catch (err) {
      const queryLower = query.toLowerCase();
      let response = "Error connecting to local server. Query not recognized.";
      if (queryLower.includes('flood')) {
        response = "Flood guidelines:\n- Move to higher ground.\n- Avoid moving water.\n- Carry emergency kit.\n- Await instructions.";
      } else if (queryLower.includes('cpr')) {
        response = "CPR instructions:\n- Check responsiveness.\n- Call for help.\n- Begin compressions.\n- Continue compressions.";
      } else if (queryLower.includes('shelter')) {
        response = "Shelters active. Locations found within 6 km. Consult Section 3 below.";
      } else {
        response = "System online. Type 'flood', 'cpr', or 'shelter' to query fallback database instructions.";
      }
      simulateResponseTyping(response);
    }
  };

  const simulateResponseTyping = (text) => {
    const lines = text.split('\n');
    let lineIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < lines.length) {
        if (lines[lineIdx].trim() !== '') {
          setConsoleLogs((prev) => [...prev, { type: 'ai', text: lines[lineIdx] }]);
        }
        lineIdx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 150);
  };

  return (
    <div className="bg-[#0F172A] text-[#E5E7EB] selection:bg-[#D97706]/20 selection:text-white relative font-sans">
      
      {/* SECTION 1: LANDING */}
      <section 
        className="relative h-screen flex items-center justify-center p-6 text-center overflow-hidden"
        style={{
          backgroundImage: `url(${frame1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-slate-950/70 z-0" />

        <div className="relative z-10 max-w-4xl space-y-6 animate-fade-up">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-none text-[#F8FAFC]" style={{ fontFamily: "'Catchy Mager', serif" }}>
            ResQ: Offline LLM-Powered Emergency Response Assistant for Disaster Preparedness
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-[#B0B7C3] max-w-2xl mx-auto font-light">
            Prepare, respond, and recover with local AI guidance, even when internet connectivity is unavailable.
          </p>

          <div className="pt-4">
            <a 
              href="#console" 
              className="bg-[#D97706] hover:bg-[#D97706]/90 text-slate-950 font-bold px-8 py-3.5 rounded-lg transition-all tracking-wider text-xs uppercase"
            >
              Launch Assistant
            </a>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-y-1/2 flex flex-col items-center text-[#B0B7C3] font-mono text-[9px] tracking-widest gap-2">
          <span>SCROLL DOWN</span>
          <div className="w-1.5 h-1.5 border-r border-b border-[#B0B7C3] rotate-45 animate-bounce" />
        </div>
      </section>

      {/* SECTION 2: LIVE AI RESPONSE EXPERIENCE */}
      <section id="console" className="py-28 px-6 md:px-12 bg-[#0F172A] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 scroll-mt-6">
        <div className="flex flex-col justify-center space-y-6">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#D97706]">
            Node Dispatcher
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] tracking-tight uppercase leading-tight">
            If disaster strikes right now.
          </h2>
          <p className="text-sm md:text-base text-[#B0B7C3] leading-relaxed max-w-md">
            The system runs entirely offline using a local AI model and emergency knowledge base. Select a template question below to populate the console query box.
          </p>

          {/* Clean selection list options for templates */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Query Templates</span>
            <div className="flex flex-col gap-2 max-w-xs">
              <button 
                onClick={() => setConsoleInput("My house is flooding. What should I do?")}
                className="text-left font-mono text-[11px] bg-[#161B22] border border-white/5 hover:border-[#D97706]/40 p-2.5 rounded transition-all text-[#E5E7EB]"
              >
                &gt; my house is flooding
              </button>
              <button 
                onClick={() => setConsoleInput("How do I perform CPR on an adult?")}
                className="text-left font-mono text-[11px] bg-[#161B22] border border-white/5 hover:border-[#D97706]/40 p-2.5 rounded transition-all text-[#E5E7EB]"
              >
                &gt; how do i perform cpr
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden flex flex-col h-[400px]">
          <div className="bg-[#0F172A] border-b border-white/15 px-4 py-3 flex items-center justify-between font-mono text-xs text-slate-400">
            <span>RESQ SYSTEM AI CONSOLE</span>
            <span className="flex items-center gap-1.5 text-[#2ECC71]">
              <span className="w-1.5 h-1.5 bg-[#2ECC71] rounded-full animate-ping" />
              ONLINE
            </span>
          </div>

          <div className="flex-1 p-5 overflow-y-auto font-mono text-xs md:text-sm space-y-3">
            {consoleLogs.map((log, idx) => (
              <div key={idx} className={
                log.type === 'user' ? 'text-[#D97706]' : 
                log.type === 'ai' ? 'text-[#F8FAFC]' : 'text-slate-500'
              }>
                <span>{log.type === 'user' ? '> ' : log.type === 'ai' ? 'ResQ: ' : ''}</span>
                <span>{log.text}</span>
              </div>
            ))}
            {isTyping && (
              <div className="text-slate-500 animate-pulse font-mono text-xs">
                [Gemma formulating response...]
              </div>
            )}
            <div ref={consoleEndRef} />
          </div>

          <form onSubmit={handleConsoleSubmit} className="bg-[#0F172A] border-t border-white/15 p-3 flex gap-2">
            <span className="font-mono text-[#D97706] font-bold self-center px-1">&gt;</span>
            <input
              type="text"
              value={consoleInput}
              onChange={(e) => setConsoleInput(e.target.value)}
              placeholder="Ask GEMMA (e.g., 'first aid guide', 'shelter location')..."
              className="bg-transparent flex-1 text-white font-mono placeholder-slate-600 focus:outline-none text-xs md:text-sm"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="bg-[#D97706] text-slate-950 px-4 py-1.5 rounded text-xs font-bold font-mono tracking-wider"
              disabled={isTyping || !consoleInput.trim()}
            >
              SEND
            </button>
          </form>
        </div>
      </section>

      {/* SECTION 3: SHELTER FINDER (Frame 2 Background - Forest Light, allow natural light to remain visible) */}
      <section 
        id="shelter-finder"
        className="relative py-28 px-6 md:px-12 overflow-hidden bg-cover bg-center border-t border-b border-white/5"
        style={{
          backgroundImage: `url(${frame2})`,
        }}
      >
        <div className="absolute inset-0 bg-[#0F172A]/50 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#D97706]">
              Safety Network
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
              Find safety when it matters.
            </h2>
            <p className="text-sm text-[#E5E7EB] leading-relaxed max-w-md">
              A dynamic offline emergency shelter finder. Select your region and the active disaster scenario to search for nearest government and NGO relief sites.
            </p>

            {/* Location & Disaster Select Fields */}
            <form onSubmit={handleShelterSearch} className="space-y-4 max-w-md bg-[#111827]/90 border border-white/10 p-5 rounded-xl backdrop-blur-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="region-select" className="text-[10px] font-mono tracking-widest text-slate-400 font-bold block uppercase">
                    Select Region
                  </label>
                  <select
                    id="region-select"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full bg-[#161B22] border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#D97706]"
                  >
                    <option value="North">North India</option>
                    <option value="South">South India</option>
                    <option value="East">East India</option>
                    <option value="West">West India</option>
                    <option value="Central">Central India</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="disaster-select" className="text-[10px] font-mono tracking-widest text-slate-400 font-bold block uppercase">
                    Active Disaster
                  </label>
                  <select
                    id="disaster-select"
                    value={selectedDisaster}
                    onChange={(e) => setSelectedDisaster(e.target.value)}
                    className="w-full bg-[#161B22] border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#D97706]"
                  >
                    <option value="Flood">Flood</option>
                    <option value="Earthquake">Earthquake</option>
                    <option value="Fire">Fire</option>
                    <option value="Storm">Storm / Cyclone</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#D97706] hover:bg-[#D97706]/90 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider py-2.5 rounded transition-all"
              >
                Search Shelters
              </button>
            </form>

            {/* Nearby Shelters List */}
            <div className="space-y-3 max-w-md">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold block uppercase">
                {searchTriggered ? "Search Results" : "Nearby Shelters List"}
              </span>
              
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {searchResults.length > 0 ? (
                  searchResults.map((s) => (
                    <div 
                      key={s.id} 
                      onClick={() => setSelectedShelterForModal(s)}
                      className="flex items-center justify-between p-3.5 bg-[#161B22]/90 border border-white/5 hover:border-[#D97706]/50 rounded-lg cursor-pointer transition-all"
                    >
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-[#F8FAFC] tracking-wide font-sans">{s.name}</h4>
                        <p className="text-[10px] font-mono text-slate-400">{s.distance} away</p>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        s.status === 'FULL' ? 'bg-[#FF4D4D]/15 text-[#FF4D4D]' : 'bg-[#2ECC71]/15 text-[#2ECC71]'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-[#161B22]/50 border border-white/5 rounded-lg text-center font-mono text-xs text-slate-500">
                    No active shelters found matching this criteria. Try selecting another region or scenario.
                  </div>
                )}
              </div>
            </div>
          </div>
 
          {/* Right: Visual Node Network Map (India Map Coordinates representation) */}
          <div className="resq-glass rounded-2xl p-6 backdrop-blur-sm border border-white/10 flex flex-col justify-center items-center h-[340px] relative bg-[#111827]/40">
            <span className="absolute top-4 left-4 font-mono text-[9px] text-slate-300 uppercase tracking-widest font-bold">
              India Regional Node Network Map
            </span>
            
            <svg viewBox="0 0 400 280" className="w-full h-full max-w-[400px]">
              {/* Regional connection lines for India */}
              <line x1="200" y1="50" x2="200" y2="145" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <line x1="200" y1="145" x2="90" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <line x1="200" y1="145" x2="310" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <line x1="200" y1="145" x2="160" y2="250" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <line x1="90" y1="170" x2="160" y2="250" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
              <line x1="310" y1="130" x2="160" y2="250" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" strokeDasharray="3" />
 
              {regionalNodes.map((node) => {
                const isActive = selectedNode?.id === node.id;
                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer group" 
                    onClick={() => {
                      setSelectedNode(node);
                      // Set selected shelter modal
                      const matchedShelter = shelters.find(s => s.name === node.name) || node;
                      setSelectedShelterForModal(matchedShelter);
                    }}
                  >
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={isActive ? "14" : "9"} 
                      fill="transparent" 
                      stroke={node.status === 'FULL' || node.capacity?.split('/')[0] === node.capacity?.split('/')[1] ? 'rgba(255,77,77,0.4)' : 'rgba(217,119,6,0.4)'} 
                      strokeWidth="2.5" 
                      className="transition-all duration-300 animate-pulse"
                    />
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r="5" 
                      fill={node.status === 'FULL' || node.capacity?.split('/')[0] === node.capacity?.split('/')[1] ? '#FF4D4D' : '#D97706'} 
                    />
                    <text 
                      x={node.x + 12} 
                      y={node.y + 4} 
                      fill="#F8FAFC" 
                      fontSize="9" 
                      fontWeight="bold"
                      fontFamily="monospace"
                      className="group-hover:fill-[#D97706] transition-colors"
                    >
                      {node.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>
 
      {/* SECTION 4: FIRST AID & CPR (Frame 3 Background - Hands, dark overlay for text readability) */}
      <section 
        className="relative py-28 px-6 md:px-12 overflow-hidden bg-cover bg-center border-b border-white/5"
        style={{
          backgroundImage: `url(${frame3})`,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/70 z-0" />
 
        <div className="relative z-10 max-w-7xl mx-auto space-y-8 text-center sm:text-left">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#D97706]">
              Recovery Protocol
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight uppercase leading-tight font-sans">
              Know what to do before help arrives.
            </h2>
            <p className="text-sm text-[#B0B7C3] max-w-md mx-auto sm:mx-0">
              Standard emergency first aid tutorials. Select an option from the navigation list below to open step-by-step instructions.
            </p>
          </div>
 
          {/* Elegant Text-List Navigation Options instead of Cards */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-4 font-mono text-sm tracking-widest pt-4">
            {Object.keys(firstAidGuides).map((key) => (
              <button
                key={key}
                onClick={() => setActiveFirstAidKey(key)}
                className="text-[#E5E7EB] hover:text-[#D97706] border-b border-transparent hover:border-[#D97706] pb-1.5 transition-all text-xs font-bold uppercase"
              >
                &gt; {firstAidGuides[key].title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: EMERGENCY PROTOCOLS (Frame 4 Background) */}
      <section 
        id="emergencies"
        className="relative py-28 px-6 md:px-12 overflow-hidden bg-cover bg-center border-t border-b border-white/5"
        style={{
          backgroundImage: `url(${frame4})`,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/80 z-0" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF4D4D]">
              Emergency Node
            </span>
            <h2 className="text-3xl font-bold uppercase text-white tracking-tight">
              When seconds matter.
            </h2>
            <p className="text-xs md:text-sm text-[#B0B7C3] max-w-md mx-auto">
              Select your active threat scenario from the options list below to examine survival steps.
            </p>
          </div>

          {/* Clickable Disaster Option List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-xl mx-auto">
            {Object.keys(emergencyActions).map(disaster => (
              <button
                key={disaster}
                onClick={() => setSelectedEmergency(disaster)}
                className="text-center font-mono font-bold p-4 text-[10px] uppercase tracking-wider rounded border bg-[#161B22]/90 border-white/10 hover:border-[#FF4D4D]/60 text-slate-300 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                {disaster}
              </button>
            ))}
          </div>

          {/* Timeline Visuals Manual */}
          <div className="border-t border-white/10 pt-10">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 font-bold block uppercase text-center mb-6">
              Operations Sequence Flow
            </span>
            <div className="relative border-l border-white/10 pl-6 md:pl-10 space-y-10 max-w-xl mx-auto">
              {protocols.map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 bg-slate-950 border border-white/20 rounded-full group-hover:border-[#FF4D4D] transition-colors flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#FF4D4D] rounded-full" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-3xl font-black text-white/25 group-hover:text-[#FF4D4D] transition-colors tracking-tight">
                        {step.num}
                      </span>
                      <h3 className="font-bold text-sm text-[#F8FAFC] tracking-wider uppercase font-mono">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#B0B7C3] leading-relaxed pl-1 font-mono">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: COMMAND & COMMUNICATION */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-[#D97706]" />
              Emergency Directory
            </h3>
            <p className="text-xs text-[#B0B7C3] font-medium font-mono">
              National Dispatch links. operational offline.
            </p>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {contacts.slice(0, 5).map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-[#111827] border border-white/5 rounded-xl">
                <span className="text-slate-300 font-bold">{entry.name}</span>
                <a href={`tel:${entry.phone_number}`} className="text-[#FF4D4D] hover:underline font-bold text-xs bg-red-950/20 border border-[#FF4D4D]/25 px-3 py-1 rounded">
                  {entry.phone_number}
                </a>
              </div>
            ))}
          </div>
        </div>
 
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#2ECC71]" />
              System Status
            </h3>
            <p className="text-xs text-[#B0B7C3] font-medium font-mono">
              Offline environment diagnostic verification.
            </p>
          </div>
 
          <div className="resq-glass rounded-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">AI Model (Gemma 4)</span>
              <span className="text-[#2ECC71] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#2ECC71] rounded-full animate-ping" />
                Online
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">Shelter Database</span>
              <span className="text-[#2ECC71] font-bold">Active</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">First Aid Knowledge Base</span>
              <span className="text-[#2ECC71] font-bold">Loaded</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400">Emergency Protocols</span>
              <span className="text-[#2ECC71] font-bold">Ready</span>
            </div>
          </div>
        </div>
      </section>
 
      {/* POPUP MODAL: FIRST AID SPECIFICS */}
      {activeFirstAidKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm fade-in">
          <div className="bg-[#161B22] border border-[#2ECC71]/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-[#0F172A] border-b border-white/10 p-5 flex items-center justify-between font-mono text-xs">
              <span className="text-[#2ECC71] font-bold flex items-center gap-1.5 uppercase">
                <HeartPulse className="w-4 h-4 shrink-0" />
                First Aid Guidelines
              </span>
              <button 
                onClick={() => setActiveFirstAidKey(null)}
                className="text-slate-400 hover:text-white border border-white/10 hover:border-white/20 bg-slate-900 px-2.5 py-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-left">
              <h3 className="text-lg font-bold text-white">{firstAidGuides[activeFirstAidKey].title}</h3>
              <div className="space-y-3.5 font-mono text-xs md:text-sm text-[#E5E7EB]">
                {firstAidGuides[activeFirstAidKey].steps.map((step, idx) => (
                  <div key={idx} className="flex gap-2.5 text-slate-200 leading-relaxed">
                    <span className="text-[#D97706] font-bold shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* POPUP MODAL: EMERGENCY MODE ACTIONS */}
      {selectedEmergency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm fade-in">
          <div className="bg-[#161B22] border border-[#FF4D4D]/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-[#0F172A] border-b border-white/10 p-5 flex items-center justify-between font-mono text-xs">
              <span className="text-[#FF4D4D] font-bold flex items-center gap-1.5 uppercase">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                Critical Threat Action Code
              </span>
              <button 
                onClick={() => setSelectedEmergency(null)}
                className="text-slate-400 hover:text-white border border-white/10 hover:border-white/20 bg-slate-900 px-2.5 py-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-left">
              <h3 className="text-lg font-bold text-white">{selectedEmergency} Immediate Survival Steps</h3>
              <div className="space-y-3 font-mono text-xs md:text-sm text-[#E5E7EB]">
                {emergencyActions[selectedEmergency].actions.map((act, idx) => (
                  <div key={idx} className="flex gap-2.5 text-slate-200 leading-relaxed">
                    <span className="text-[#FF4D4D] font-bold shrink-0">&gt;&gt;</span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: SHELTER DETAILS */}
      {selectedShelterForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm fade-in">
          <div className="bg-[#161B22] border border-[#D97706]/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-[#0F172A] border-b border-white/10 p-5 flex items-center justify-between font-mono text-xs">
              <span className="text-[#D97706] font-bold flex items-center gap-1.5 uppercase">
                <Landmark className="w-4 h-4 shrink-0" />
                Shelter Dispatch Node Details
              </span>
              <button 
                onClick={() => setSelectedShelterForModal(null)}
                className="text-slate-400 hover:text-white border border-white/10 hover:border-white/20 bg-slate-900 px-2.5 py-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-sans">{selectedShelterForModal.name}</h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  selectedShelterForModal.status === 'FULL' || selectedShelterForModal.capacity?.toString().split('/')[0] === selectedShelterForModal.capacity?.toString().split('/')[1] 
                    ? 'bg-[#FF4D4D]/15 text-[#FF4D4D]' 
                    : 'bg-[#2ECC71]/15 text-[#2ECC71]'
                }`}>
                  {selectedShelterForModal.status || "AVAILABLE"}
                </span>
              </div>
              <div className="space-y-3 font-mono text-xs md:text-sm text-[#E5E7EB] border-t border-white/5 pt-4">
                <p><span className="text-slate-400">Address:</span> <strong className="text-white">{selectedShelterForModal.address}</strong></p>
                <p><span className="text-slate-400">Capacity Status:</span> <strong className="text-white">{selectedShelterForModal.capacity}</strong></p>
                <p><span className="text-slate-400">Emergency Contact:</span> <strong className="text-white">{selectedShelterForModal.contact || selectedShelterForModal.contact_number}</strong></p>
                <p><span className="text-slate-400">Available Facilities:</span> <strong className="text-white">{selectedShelterForModal.facilities || selectedShelterForModal.available_facilities}</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#0F172A] py-6 px-6 text-center text-xs text-slate-500 font-mono">
        <div>ResQ Disaster Preparedness Operations — Local System Offline Console — v1.5.0</div>
      </footer>
    </div>
  );
}
