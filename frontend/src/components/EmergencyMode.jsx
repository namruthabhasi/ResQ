import React, { useState, useEffect } from 'react';
import { Flame, Wind, Waves, Activity, AlertTriangle, ShieldCheck, HeartPulse, ChevronLeft } from 'lucide-react';

export default function EmergencyMode() {
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [activeStage, setActiveStage] = useState('during'); // default to 'during' (stress state)
  const [guideContent, setGuideContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const disasterTypes = [
    { id: 'Flood', label: 'Flood Emergency', icon: Waves, color: 'from-blue-600/30 to-blue-950/40 border-blue-500/40 hover:border-blue-400 text-blue-400' },
    { id: 'Fire', label: 'Fire Outbreak', icon: Flame, color: 'from-red-600/30 to-red-950/40 border-red-500/40 hover:border-red-400 text-red-400' },
    { id: 'Earthquake', label: 'Earthquake', icon: Activity, color: 'from-amber-600/30 to-amber-950/40 border-amber-500/40 hover:border-amber-400 text-amber-400' },
    { id: 'Cyclone', label: 'Cyclone / Storm', icon: Wind, color: 'from-teal-600/30 to-teal-950/40 border-teal-500/40 hover:border-teal-400 text-teal-400' },
    { id: 'Landslide', label: 'Landslide', icon: AlertTriangle, color: 'from-orange-600/30 to-orange-950/40 border-orange-500/40 hover:border-orange-400 text-orange-400' },
  ];

  // Static Fallback Guides in case backend has a temporary connection issue
  const fallbackGuides = {
    Flood: [
      { stage: 'Before', content: "### Before a Flood\n1. Move valuable items to higher floors.\n2. Keep fresh water containers filled.\n3. Prepare a Family Go-Bag.\n4. Check local emergency alerts regularly." },
      { stage: 'During', content: "### DURING A FLOOD: IMMEDIATE SAFETY\n\n> [!CAUTION]\n> **NEVER** drive or walk through flood waters. Just 6 inches of flowing water can sweep you off your feet!\n\n- Move to higher ground immediately.\n- Disconnect electrical mains if you can do so safely.\n- Avoid touching power cords or standing water with electrical equipment." },
      { stage: 'After', content: "### After a Flood\n1. Do not enter homes until cleared by safety inspectors.\n2. Treat tap water as contaminated; boil for 1 minute before drinking.\n3. Throw away food that has touched flood water." }
    ],
    Fire: [
      { stage: 'Prevention', content: "### Fire Prevention\n- Test smoke alarms once a month.\n- Keep space heaters 3 feet away from bedding or drapes.\n- Ensure fire extinguishers are charged and accessible." },
      { stage: 'During', content: "### DURING A FIRE: IMMEDIATE ACTION\n\n> [!WARNING]\n> **SMOKE IS TOXIC.** Crawl low to the floor where the air is cleanest.\n\n- Evacuate the structure immediately. Do not retrieve personal items.\n- Feel doors with the back of your hand before opening. If hot, use an alternate exit.\n- Call emergency dispatch (999/911) once safely outside." },
      { stage: 'After', content: "### After Evacuation\n- Stay outside. Never go back into a burning building.\n- Administer cool water to minor burns.\n- Wait for the fire marshal to clear the building." }
    ],
    Earthquake: [
      { stage: 'Before', content: "### Earthquake Preparation\n- Anchor tall bookcases and water heaters to walls.\n- Practice Drop, Cover, and Hold On drills.\n- Store thick shoes near your bed." },
      { stage: 'During', content: "### DURING AN EARTHQUAKE: IMMEDIATE ACTION\n\n> [!IMPORTANT]\n> **DROP, COVER, AND HOLD ON.** Do not run outside during shaking.\n\n- **DROP** to hands and knees to prevent falling.\n- **COVER** head and neck under a sturdy table.\n- **HOLD ON** to your shelter until shaking stops." },
      { stage: 'After', content: "### After shaking stops\n- Check yourself and others for injuries.\n- Check for gas leaks. Smell gas? Turn off the main valve immediately.\n- Be ready for aftershocks." }
    ],
    Cyclone: [
      { stage: 'Before', content: "### Cyclone Preparation\n- Secure roof tiles and clear gutters.\n- Store outdoor patio furniture indoors.\n- Tape windows or attach storm shutters." },
      { stage: 'During', content: "### DURING A CYCLONE: IMMEDIATE SAFETY\n- Stay indoors on the lowest floor in a central room without windows.\n- Turn off major appliances to protect from grid surges.\n- Do not go outside during the calm eye of the storm; winds will return." },
      { stage: 'After', content: "### After a Cyclone\n- Watch for downed power lines and dangerous debris.\n- Report utility damage to rescue contacts.\n- Avoid standing water which might hide live lines." }
    ],
    Landslide: [
      { stage: 'Before', content: "### Landslide Preparation\n- Find out if your area has landslide history.\n- Plant ground covers on slopes to stabilize soil.\n- Plan evacuation paths away from valleys." },
      { stage: 'During', content: "### DURING A LANDSLIDE: IMMEDIATE SAFETY\n- Evacuate immediately if you hear cracking trees or rushing debris.\n- If evacuation is impossible, curl into a ball and protect your head.\n- Stay away from valleys and low-lying channels." },
      { stage: 'After', content: "### After a Landslide\n- Keep away from the slide area; secondary slides are common.\n- Check for trapped neighbors without entering directly.\n- Check utility lines for breaks." }
    ],
  };

  useEffect(() => {
    if (!selectedDisaster) return;
    
    const fetchGuides = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/api/guides?category=${selectedDisaster}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setGuideContent(data);
          } else {
            setGuideContent(fallbackGuides[selectedDisaster]);
          }
        } else {
          setGuideContent(fallbackGuides[selectedDisaster]);
        }
      } catch (err) {
        // Fallback to offline data
        setGuideContent(fallbackGuides[selectedDisaster]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [selectedDisaster]);

  const activeContent = guideContent.find(
    (g) => g.stage.toLowerCase() === activeStage.toLowerCase()
  )?.content || "No local guide available for this stage.";

  // Format simple markdown-like syntax for readability under stress
  const formatContentText = (text) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-xl font-bold text-white border-b border-command-border/20 pb-2 mt-4 mb-2">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('> [!CAUTION]') || line.startsWith('> [!WARNING]')) {
        return null; // Handle banner formatting below
      }
      if (line.startsWith('> **') || line.startsWith('> ')) {
        return (
          <div key={idx} className="bg-red-950/20 border-l-4 border-emergency-red p-4 rounded-r-xl my-4 text-red-200 text-sm font-semibold">
            {line.replace(/^>\s*(\*\*|\*|)/, '').replace(/(\*\*|\*)$/, '')}
          </div>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-6 list-disc text-slate-300 text-base md:text-lg py-1 font-semibold leading-relaxed">
            {line.substring(2)}
          </li>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <li key={idx} className="ml-6 list-decimal text-slate-300 text-base md:text-lg py-1 font-semibold leading-relaxed">
            {line.replace(/^\d+\.\s*/, '')}
          </li>
        );
      }
      if (line.trim() === '') return <div key={idx} className="h-2" />;
      return <p key={idx} className="text-slate-300 text-sm md:text-base leading-relaxed my-2">{line}</p>;
    });
  };

  const getStagesForDisaster = (disaster) => {
    if (disaster === 'Fire') {
      return ['prevention', 'during', 'after'];
    }
    return ['before', 'during', 'after'];
  };

  if (selectedDisaster) {
    const disasterConfig = disasterTypes.find(d => d.id === selectedDisaster);
    const Icon = disasterConfig.icon;
    const stages = getStagesForDisaster(selectedDisaster);

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedDisaster(null)}
          className="flex items-center gap-2 text-command-muted hover:text-white font-bold transition-colors text-sm px-4 py-2 border border-command-border/40 rounded-xl bg-slate-950/50"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Disaster Hub
        </button>

        {/* Selected Disaster Header */}
        <div className={`p-6 rounded-2xl border bg-gradient-to-r ${disasterConfig.color} flex items-center gap-4`}>
          <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/10 shrink-0">
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white">{disasterConfig.label}</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-widest">
              OFFLINE PROTOCOLS LOADED
            </p>
          </div>
        </div>

        {/* Stages Switcher (Before, During, After) */}
        <div className="flex gap-2 border-b border-command-border/20 pb-3">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-black tracking-wider uppercase transition-all border ${
                activeStage === stage
                  ? stage === 'during'
                    ? 'bg-emergency-red text-white border-red-500/50 shadow-glow-red'
                    : 'bg-emergency-blue text-command-bg border-sky-400/50 font-bold'
                  : 'text-command-muted bg-slate-950/40 hover:bg-slate-900 border-transparent hover:border-command-border/20'
              }`}
            >
              {stage === 'during' ? '🚨 DURING (IMMEDIATE)' : stage}
            </button>
          ))}
        </div>

        {/* Guide Content Display */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 border border-command-border/30 space-y-4">
          {loading ? (
            <div className="text-center py-10 font-mono text-command-muted">
              Loading local response directives...
            </div>
          ) : (
            <div className="space-y-2">
              {formatContentText(activeContent)}
            </div>
          )}
        </div>

        {/* Emergency Help Action Box */}
        <div className="glass-panel-red rounded-2xl p-6 border border-red-500/25 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-7 h-7 text-emergency-red shrink-0" />
            <div>
              <h4 className="font-bold text-base text-red-200">Need Immediate Evacuation or Triage?</h4>
              <p className="text-xs text-red-300 mt-0.5">
                Always follow local responder commands. Dial our emergency hotline below if trapped.
              </p>
            </div>
          </div>
          <a
            href="tel:911"
            className="w-full md:w-auto bg-emergency-red hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl text-center text-sm md:text-base shadow-glow-red tracking-wider transition-colors shrink-0"
          >
            CALL DISPATCH (911)
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
          Emergency Mode Hub
        </h2>
        <p className="text-sm text-command-muted font-medium">
          Select an active threat card to display critical survival instructions immediately. Designed for high visibility under stress.
        </p>
      </div>

      {/* Grid of Large Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {disasterTypes.map((disaster) => {
          const Icon = disaster.icon;
          return (
            <button
              key={disaster.id}
              onClick={() => {
                setSelectedDisaster(disaster.id);
                setActiveStage('during'); // default to 'during' when clicked
              }}
              className={`p-6 rounded-2xl border bg-gradient-to-br transition-all hover:scale-[1.01] hover:shadow-lg flex items-center justify-between group h-36 ${disaster.color}`}
            >
              <div className="flex items-center gap-5">
                <div className="bg-slate-950/55 p-4 rounded-2xl border border-white/10 shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg md:text-xl text-white">{disaster.label}</h3>
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                    Select for immediate steps
                  </span>
                </div>
              </div>

              <div className="bg-white/5 group-hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors">
                CRITICAL
              </div>
            </button>
          );
        })}
      </div>

      {/* General Survival Rule Banner */}
      <div className="glass-panel-emerald rounded-2xl p-6 border border-emerald-500/20 flex items-center gap-4">
        <ShieldCheck className="w-8 h-8 text-emergency-emerald shrink-0" />
        <div>
          <h4 className="font-bold text-sm text-emerald-200">The Golden Rule of Disaster Safety:</h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Do not delay evacuation to collect belongings. Safety of life is your absolute priority. Always inform contacts of your location before grids disconnect.
          </p>
        </div>
      </div>
    </div>
  );
}
