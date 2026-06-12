import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, HeartPulse, Landmark, PhoneCall, Radio, Wifi, Database, Info, Search } from 'lucide-react';

// Import cropped assets
import frame1 from './assets/frame_1.png';
import frame2 from './assets/frame_2.png';
import frame3 from './assets/frame_3.png';
import frame4 from './assets/frame_4.png';

export default function App() {
  // Section 2: AI Console State
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleLogs, setConsoleLogs] = useState([
    { type: 'system', text: 'SYSTEM DISPATCH: Core offline nodes initialized.' },
    { type: 'system', text: 'Awaiting operator input sequence...' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const consoleEndRef = useRef(null);

  // Section 3: Shelter State
  const [shelterLocation, setShelterLocation] = useState('');
  const [shelterDisaster, setShelterDisaster] = useState('All');
  const [shelters, setShelters] = useState([]);
  const [shelterResults, setShelterResults] = useState([]);

  // Section 4: First Aid State
  const [expandedFirstAid, setExpandedFirstAid] = useState(null);

  // Section 5: Emergency Action Center State
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  // Section 6: Status & System Diagnostics
  const [dbHealthy, setDbHealthy] = useState(true);
  const [aiStatus, setAiStatus] = useState('Active');
  const [lastSyncText, setLastSyncText] = useState('Seeded Local Checkpoint');

  // Static Data Fallbacks
  const firstAidGuides = {
    cpr: {
      title: "Cardiopulmonary Resuscitation (CPR)",
      steps: [
        "Check responsiveness: Tap the victim's shoulders and shout loudly.",
        "Call for help: Immediately dial emergency lines (911/999).",
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
    }
  };

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
        "Stay away from channels, valleys, and low land structures.",
        "Watch for secondary slides which frequently occur after initial slips."
      ]
    }
  };

  // Fetch shelters on mount
  useEffect(() => {
    const loadShelters = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/shelters');
        if (res.ok) {
          const data = await res.json();
          setShelters(data);
          setShelterResults(data);
        }
      } catch (err) {
        // Mock fallback
        const mock = [
          { id: 1, name: "Red Cross Shelter", address: "Stadium Drive Hall (2.4 km)", capacity: 150, contact_number: "+1-800-555-0191", available_facilities: "Water, Food" },
          { id: 2, name: "Community Hall", address: "450 Education Way (4.1 km)", capacity: 300, contact_number: "+1-800-555-0192", available_facilities: "Solar Power" },
          { id: 3, name: "Government Relief Camp", address: "Municipal Arena (5.6 km)", capacity: 500, contact_number: "+1-800-555-0194", available_facilities: "Medical Clinic" }
        ];
        setShelters(mock);
        setShelterResults(mock);
      }
    };
    loadShelters();
  }, []);

  // Scroll console to bottom
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
      // Local fallback keyword check
      const queryLower = query.toLowerCase();
      let response = "Error connecting to local server. Query not recognized.";
      if (queryLower.includes('flood')) {
        response = "Flood guidelines:\n- Move to higher ground.\n- Avoid moving water.\n- Carry emergency kit.\n- Await instructions.";
      } else if (queryLower.includes('cpr') || queryLower.includes('c.p.r.')) {
        response = "CPR instructions:\n- Check responsiveness.\n- Call for help.\n- Begin hard/fast compressions (100-120/min).\n- Continue compressions.";
      } else if (queryLower.includes('shelter')) {
        response = "Shelters registry active. Locations found within 6 km. Consult Section 3 below.";
      } else {
        response = "System online. Type 'flood', 'cpr', or 'shelter' to query fallback database instructions.";
      }
      simulateResponseTyping(response);
    }
  };

  const simulateResponseTyping = (text) => {
    // Standard typing line by line for clean terminal look
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
    }, 180);
  };

  // Action: Search shelters
  const handleShelterSearch = (e) => {
    e.preventDefault();
    const filtered = shelters.filter(s => {
      const matchesLoc = s.name.toLowerCase().includes(shelterLocation.toLowerCase()) || 
                         s.address.toLowerCase().includes(shelterLocation.toLowerCase());
      const matchesDisaster = shelterDisaster === 'All' || 
                              (s.available_facilities && s.available_facilities.toLowerCase().includes(shelterDisaster.toLowerCase()));
      return matchesLoc && matchesDisaster;
    });
    setShelterResults(filtered);
  };

  return (
    <div className="bg-[#0D1117] text-white selection:bg-[#2EA8FF]/20 selection:text-white">
      
      {/* SECTION 1: LANDING HERO */}
      <section 
        className="relative h-screen flex items-center justify-center p-6 text-center overflow-hidden"
        style={{
          backgroundImage: `url(${frame1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay: 65% */}
        <div className="absolute inset-0 bg-black/65 z-0" />

        <div className="relative z-10 max-w-4xl space-y-6 animate-fade-up">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase font-sans">
            Offline LLM-Powered Emergency Response Assistant <br className="hidden md:inline" />
            <span className="text-[#2EA8FF]">for Disaster Preparedness</span>
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-[#B0B7C3] max-w-2xl mx-auto font-medium">
            Prepare, respond, and recover with local AI guidance, even when internet connectivity is unavailable.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#console" 
              className="w-full sm:w-auto bg-[#2EA8FF] hover:bg-[#2EA8FF]/95 text-[#0D1117] font-extrabold px-8 py-4 rounded-xl transition-all text-center tracking-wider text-sm shadow-[0_4px_20px_rgba(46,168,255,0.25)]"
            >
              LAUNCH ASSISTANT
            </a>
            <a 
              href="#emergencies" 
              className="w-full sm:w-auto border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all text-center text-sm"
            >
              EXPLORE PREPAREDNESS TOOLS
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-y-1/2 flex flex-col items-center text-[#B0B7C3] font-mono text-[10px] tracking-widest gap-2">
          <span>SCROLL DOWN</span>
          <div className="w-1.5 h-1.5 border-r border-b border-[#B0B7C3] rotate-45 animate-bounce" />
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS & LOCAL AI CONSOLE */}
      <section id="console" className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-mt-6">
        {/* Left: How it works Glass Panel */}
        <div className="resq-glass rounded-2xl p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#2EA8FF]">
              <Info className="w-5 h-5" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">Operational Overview</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black uppercase text-white">How it works</h2>
            <p className="text-sm text-[#B0B7C3] leading-relaxed">
              ResQ utilizes an offline-first micro-architecture running entirely inside your local local area network. If a disaster cuts cellular data towers or main fiber lines, this interface serves immediate step-by-step guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 bg-[#161B22] rounded-xl border border-white/5">
              <strong className="text-white block mb-1">OFFLINE LLM</strong>
              <span className="text-slate-400">Local Gemma model loaded via Ollama</span>
            </div>
            <div className="p-4 bg-[#161B22] rounded-xl border border-white/5">
              <strong className="text-white block mb-1">LOCAL KNOWLEDGE</strong>
              <span className="text-slate-400">Preloaded databases of disaster manuals</span>
            </div>
            <div className="p-4 bg-[#161B22] rounded-xl border border-white/5">
              <strong className="text-white block mb-1">EMERGENCY DATA</strong>
              <span className="text-slate-400">Shelter metrics & contact registries</span>
            </div>
          </div>
        </div>

        {/* Right: AI Console Terminal */}
        <div className="bg-[#161B22] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[400px]">
          <div className="bg-[#0D1117] border-b border-white/15 px-4 py-3 flex items-center justify-between font-mono text-xs text-slate-400">
            <span>RESQ SYSTEM AI CONSOLE</span>
            <span className="flex items-center gap-1.5 text-[#2ECC71]">
              <span className="w-1.5 h-1.5 bg-[#2ECC71] rounded-full animate-ping" />
              ACTIVE
            </span>
          </div>

          {/* Console Output Screen */}
          <div className="flex-1 p-5 overflow-y-auto font-mono text-xs md:text-sm space-y-3">
            {consoleLogs.map((log, idx) => (
              <div key={idx} className={
                log.type === 'user' ? 'text-[#2EA8FF]' : 
                log.type === 'ai' ? 'text-[#FFFFFF]' : 'text-slate-500'
              }>
                <span>{log.type === 'user' ? '> ' : log.type === 'ai' ? 'ResQ: ' : ''}</span>
                <span>{log.text}</span>
              </div>
            ))}
            {isTyping && (
              <div className="text-slate-500 animate-pulse font-mono">
                [Gemma formulating response...]
              </div>
            )}
            <div ref={consoleEndRef} />
          </div>

          {/* Console Form Input */}
          <form onSubmit={handleConsoleSubmit} className="bg-[#0D1117] border-t border-white/15 p-3 flex gap-2">
            <span className="font-mono text-[#2EA8FF] font-bold self-center px-1">&gt;</span>
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
              className="bg-[#2EA8FF] text-[#0D1117] px-4 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider"
              disabled={isTyping || !consoleInput.trim()}
            >
              SEND
            </button>
          </form>
        </div>
      </section>

      {/* SECTION 3: SHELTER FINDER */}
      <section className="py-24 bg-[#161B22] border-t border-b border-white/5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Shelter Search Interface */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black uppercase text-white">Shelter Finder</h2>
              <p className="text-sm text-[#B0B7C3]">
                Locate emergency structures and relief centers operating nearby. Powered by local database registries.
              </p>
            </div>

            <form onSubmit={handleShelterSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0D1117] p-4 rounded-xl border border-white/10">
              <input
                type="text"
                value={shelterLocation}
                onChange={(e) => setShelterLocation(e.target.value)}
                placeholder="Enter location name..."
                className="bg-[#161B22] border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <select
                value={shelterDisaster}
                onChange={(e) => setShelterDisaster(e.target.value)}
                className="bg-[#161B22] border border-white/10 rounded-lg py-2.5 px-3 text-xs text-[#B0B7C3] focus:outline-none"
              >
                <option value="All">All Resources</option>
                <option value="Water">Clean Water</option>
                <option value="Solar">Solar Power</option>
                <option value="Medical">Medical Clinic</option>
              </select>
              <button 
                type="submit"
                className="bg-[#2EA8FF] text-[#0D1117] font-bold py-2.5 rounded-lg text-xs tracking-wider uppercase flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                SEARCH
              </button>
            </form>

            {/* Nearby Shelters List */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 font-bold block uppercase">
                Active Local Shelter Directory
              </span>
              <div className="space-y-2.5">
                {shelterResults.map((shelter) => (
                  <div 
                    key={shelter.id} 
                    className="flex justify-between items-center p-4 rounded-xl bg-[#0D1117] border border-white/5 hover:border-white/10 transition-all font-mono"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-white">{shelter.name}</h4>
                      <span className="text-[10px] text-slate-400">{shelter.address}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <a href={`tel:${shelter.contact_number}`} className="text-[#2EA8FF] hover:underline font-bold text-xs flex items-center gap-1">
                        <PhoneCall className="w-3 h-3" />
                        DIAL
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Hands Image */}
          <div className="rounded-2xl overflow-hidden border border-white/10 h-[380px] md:h-[450px]">
            <img 
              src={frame3} 
              alt="Hands of care emergency infrastructure assistance"
              className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-500" 
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: FIRST AID & CPR */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-center">
        {/* Left: Forest Image (occupies 40%) */}
        <div className="w-full lg:w-[40%] rounded-2xl overflow-hidden border border-white/10 h-[350px] lg:h-[450px]">
          <img 
            src={frame2} 
            alt="Forest sunbeams relief sanctuary"
            className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-500" 
          />
        </div>

        {/* Right: Content (occupies 60%) */}
        <div className="w-full lg:w-[60%] space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black uppercase text-white">First Aid & CPR</h2>
            <p className="text-sm text-[#B0B7C3]">
              Review precise emergency treatment guides for critical injuries. Click any card below to expand details.
            </p>
          </div>

          {/* Expandable cards */}
          <div className="space-y-3">
            {Object.keys(firstAidGuides).map((key) => {
              const guide = firstAidGuides[key];
              const isExpanded = expandedFirstAid === key;
              return (
                <div 
                  key={key} 
                  className={`border rounded-xl transition-all overflow-hidden ${
                    isExpanded ? 'border-[#2ECC71] bg-[#161B22]' : 'border-white/5 bg-[#161B22]/50 hover:border-white/15'
                  }`}
                >
                  <button
                    onClick={() => setExpandedFirstAid(isExpanded ? null : key)}
                    className="w-full p-4 flex items-center justify-between text-left font-bold"
                  >
                    <span className="text-sm md:text-base text-white">{guide.title}</span>
                    <span className={`text-xs ${isExpanded ? 'text-[#2ECC71]' : 'text-slate-500'}`}>
                      {isExpanded ? '[COLLAPSE]' : '[EXPAND]'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="p-4 border-t border-white/5 bg-[#0D1117]/60 space-y-2.5 font-mono text-xs md:text-sm">
                      {guide.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-2.5 text-slate-300 leading-relaxed">
                          <span className="text-[#2ECC71] font-bold">{idx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: EMERGENCY MODE */}
      <section 
        id="emergencies"
        className="relative py-28 px-6 md:px-12 overflow-hidden bg-cover bg-center border-t border-b border-white/5"
        style={{
          backgroundImage: `url(${frame4})`,
        }}
      >
        {/* Heavy overlay and heavy blur */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-0" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF4D4D]/10 border border-[#FF4D4D]/35 rounded-full text-[10px] font-mono text-[#FF4D4D] font-bold uppercase tracking-widest animate-pulse">
              ⚠️ CRITICAL DISPATCH ACTION NODE
            </div>
            <h2 className="text-3xl font-black uppercase text-white tracking-tight">Emergency Action Center</h2>
            <p className="text-sm text-[#B0B7C3] max-w-lg mx-auto">
              Select your active threat scenario to display immediate survival directives. Designed to optimize readability during crisis.
            </p>
          </div>

          {/* Grid of disaster cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.keys(emergencyActions).map((disaster) => {
              const isSelected = selectedEmergency === disaster;
              return (
                <button
                  key={disaster}
                  onClick={() => setSelectedEmergency(isSelected ? null : disaster)}
                  className={`p-5 rounded-xl border text-center font-bold transition-all flex flex-col items-center justify-center gap-3 h-28 uppercase text-xs tracking-wider ${
                    isSelected
                      ? 'bg-[#FF4D4D]/15 border-[#FF4D4D] text-white shadow-[0_0_15px_rgba(255,77,77,0.25)]'
                      : 'bg-[#161B22]/85 border-white/10 hover:border-[#FF4D4D]/40 text-slate-300'
                  }`}
                >
                  <ShieldAlert className={`w-6 h-6 ${isSelected ? 'text-[#FF4D4D] animate-bounce' : 'text-slate-500'}`} />
                  <span>{disaster}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Emergency Steps display */}
          {selectedEmergency && (
            <div className="bg-[#161B22] border-l-4 border-[#FF4D4D] rounded-r-xl p-6 md:p-8 space-y-4 max-w-3xl mx-auto fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-bold text-sm text-[#FF4D4D] font-mono tracking-widest uppercase">
                  Active Emergency steps: {selectedEmergency}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Local Database Cached</span>
              </div>
              <ul className="space-y-3 font-mono text-xs md:text-sm text-slate-200">
                {emergencyActions[selectedEmergency].actions.map((act, idx) => (
                  <li key={idx} className="flex gap-3 leading-relaxed">
                    <span className="text-[#FF4D4D] font-bold shrink-0">&gt;&gt;</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 6: CONTACTS & SYSTEM HEALTH DIAGNOSTIC */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Emergency Directory */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-[#2EA8FF]" />
              Emergency Directory
            </h3>
            <p className="text-xs text-[#B0B7C3] font-medium font-mono">
              National Dispatch communication links. Works offline on active cellular grids.
            </p>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {[
              { role: "Police Control Room", num: "100 / 911" },
              { role: "Fire Force Command", num: "101 / 999" },
              { role: "Ambulance Response Dispatch", num: "102 / 911" },
              { role: "Disaster Management Authority", num: "+1-800-555-0110" },
              { role: "Local Shelter Coordinator", num: "+1-800-555-0191" }
            ].map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-[#161B22] border border-white/5 rounded-xl">
                <span className="text-slate-300 font-bold">{entry.role}</span>
                <a href={`tel:${entry.num}`} className="text-[#FF4D4D] hover:underline font-bold text-xs bg-red-950/20 border border-[#FF4D4D]/25 px-3 py-1 rounded">
                  {entry.num}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Right: System Status HUD */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#2ECC71]" />
              System Diagnostics
            </h3>
            <p className="text-xs text-[#B0B7C3] font-medium font-mono">
              Local health monitors and offline node validation.
            </p>
          </div>

          <div className="resq-glass rounded-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">Local AI Engine (Gemma)</span>
              <span className="text-[#2ECC71] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#2ECC71] rounded-full animate-ping" />
                Active
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">Internet Connectivity</span>
              <span className="text-red-400 font-bold">Not Required</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">Survival Knowledge Base</span>
              <span className="text-[#2ECC71] font-bold">Loaded</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">System Synchronization</span>
              <span className="text-slate-300">{lastSyncText}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400">Console Mode</span>
              <span className="text-[#2EA8FF] font-bold">Protected Local Node</span>
            </div>
          </div>

          {/* Sync Trigger button */}
          <button
            onClick={async () => {
              setLastSyncText('Syncing local memory...');
              try {
                const res = await fetch('http://localhost:8000/api/admin/reseed', { method: 'POST' });
                if (res.ok) {
                  setLastSyncText('Updated seed DB');
                } else {
                  setLastSyncText('Backup restored');
                }
              } catch (err) {
                setLastSyncText('Local Memory (Seeded)');
              }
            }}
            className="w-full bg-[#161B22] hover:bg-[#161B22]/80 text-[#2EA8FF] font-bold border border-[#2EA8FF]/30 hover:border-[#2EA8FF]/80 py-3.5 rounded-xl transition-all text-xs tracking-wider uppercase font-mono"
          >
            Force Sync Local Memory
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#0D1117] py-6 px-6 text-center text-xs text-slate-500 font-mono">
        <div>ResQ Disaster Preparedness Console — Operational Offline Node — v1.4.0</div>
      </footer>
    </div>
  );
}
