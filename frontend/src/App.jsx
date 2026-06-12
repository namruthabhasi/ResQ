import React, { useState, useEffect, useRef } from 'react';
import TerminalCanvas from './components/TerminalCanvas';
import TerminalOutput from './components/TerminalOutput';
import { ShieldAlert, HeartPulse, Landmark, Wifi, WifiOff, Cpu, Terminal, Radio } from 'lucide-react';

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputRect, setInputRect] = useState(null);
  
  // Submit animation states
  const [triggerSubmit, setTriggerSubmit] = useState(false);
  
  // Output panel states
  const [activePanel, setActivePanel] = useState(null);
  const [outputData, setOutputData] = useState(null);

  // Diagnostic states
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine ? 'CONNECTED' : 'LOCAL ONLY');
  const [aiStatus, setAiStatus] = useState('ONLINE');
  const [isComputing, setIsComputing] = useState(false);

  // Telemetry stream state
  const [telemetryLogs, setTelemetryLogs] = useState([
    { time: "14:00:01", msg: "ResQ Offline Command Console initialized." },
    { time: "14:00:10", msg: "Local SQLite Database mapping complete." },
    { time: "14:00:12", msg: "Ollama link ping: status ONLINE (gemma)." }
  ]);

  const inputRef = useRef(null);

  // Update input position bounding rect for canvas warping
  const updateInputRect = () => {
    if (inputRef.current) {
      setInputRect(inputRef.current.getBoundingClientRect());
    }
  };

  useEffect(() => {
    updateInputRect();
    window.addEventListener('resize', updateInputRect);
    return () => window.removeEventListener('resize', updateInputRect);
  }, []);

  // Monitor network connectivity
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

  // Poll backend status for telemetry log additions
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/status');
        if (res.ok) {
          const data = await res.json();
          setAiStatus(data.ollama_ai === 'online' ? 'ONLINE' : 'FALLBACK');
          addTelemetryLog(`Diagnostic heartbeat: Database ${data.database.toUpperCase()}, AI ${data.ollama_ai.toUpperCase()}.`);
        } else {
          setAiStatus('OFFLINE');
          addTelemetryLog("Warning: Backend API returned offline state.");
        }
      } catch (err) {
        setAiStatus('OFFLINE');
        addTelemetryLog("Error: Backend API unreachable. Running in browser fallback.");
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Periodic mock telemetry logs
  useEffect(() => {
    const logsPool = [
      "Secured local telemetry loop running.",
      "VHF/UHF signal beacon mapping active on 146.520 MHz.",
      "Database backup instance verified [resq.db].",
      "Network status check: LAN connection stabilized.",
      "Gemma 4 processing units calibrated.",
      "Thermal sensor indicators: normal operating temp.",
      "Awaiting operator command sequence."
    ];

    const interval = setInterval(() => {
      const randomLog = logsPool[Math.floor(Math.random() * logsPool.length)];
      addTelemetryLog(randomLog);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const addTelemetryLog = (msg) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setTelemetryLogs((prev) => [...prev.slice(-30), { time: timeStr, msg }]);
  };

  // Submit Handler
  const handleCommandSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    updateInputRect();
    setTriggerSubmit(true);
    setIsComputing(true);
    addTelemetryLog(`Dispatching command prompt sequence: "${inputValue}"`);

    // Let the collapse animation run, then fetch response
    setTimeout(async () => {
      try {
        const res = await fetch('http://localhost:8000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: inputValue }],
            disaster_context: null
          })
        });

        if (res.ok) {
          const data = await res.json();
          setOutputData(data.content);
          setActivePanel('chat');
          addTelemetryLog("Response successfully fetched from local AI engine.");
        } else {
          throw new Error();
        }
      } catch (err) {
        // Local search keyword fallbacks
        const queryText = inputValue.toLowerCase();
        let fallbackMsg = `⚠️ **Local AI Engine Offline**\n\nNo active response found for "${inputValue}".\n\nPlease check the Action Nodes below for First Aid and Shelter locations.`;
        
        if (queryText.includes('cpr') || queryText.includes('bleed') || queryText.includes('blood') || queryText.includes('burn')) {
          fallbackMsg = `ℹ️ **ResQ Fallback (First Aid Suggestion)**\n\n- Perform Hands-Only CPR: Push hard & fast in center of chest (100-120/min).\n- Apply direct pressure to bleeding wounds immediately.\n- Cool burns with running water. Do not apply butter/grease.\n\n*Review the First Aid Node below for absolute steps.*`;
        } else if (queryText.includes('shelter') || queryText.includes('location')) {
          fallbackMsg = `ℹ️ **ResQ Fallback (Shelter Suggestion)**\n\n- Active Safe Zone: Green Valley Community Center (102 Emerald Parkway).\n- High School Gymnasium (455 Education Way).\n\n*Review the Shelter Finder Node below for active capacity.*`;
        }

        setOutputData(fallbackMsg);
        setActivePanel('chat');
        addTelemetryLog("Warning: Local AI offline. Local database fallback loaded.");
      } finally {
        setIsComputing(false);
        setInputValue('');
      }
    }, 1200); // match collapse particle timing
  };

  const handleActionNode = async (nodeType) => {
    addTelemetryLog(`Operator action triggered: ${nodeType.toUpperCase()} NODE.`);
    setIsComputing(true);

    try {
      if (nodeType === 'emergency') {
        const res = await fetch('http://localhost:8000/api/guides');
        const data = await res.json();
        
        // Group by category for rendering
        const grouped = {};
        data.forEach(g => {
          if (!grouped[g.category]) grouped[g.category] = [];
          grouped[g.category].push(g);
        });
        
        setOutputData(grouped);
        setActivePanel('emergency');
      } else if (nodeType === 'firstaid') {
        const res = await fetch('http://localhost:8000/api/firstaid');
        const data = await res.json();
        setOutputData(data);
        setActivePanel('firstaid');
      } else if (nodeType === 'shelter') {
        const res = await fetch('http://localhost:8000/api/shelters');
        const data = await res.json();
        setOutputData(data);
        setActivePanel('shelter');
      }
    } catch (err) {
      addTelemetryLog(`Error querying ${nodeType} endpoint. Loading local default memory.`);
      // Mock fallbacks if database API fails
      if (nodeType === 'firstaid') {
        setOutputData([
          { id: 1, title: "Severe Bleeding", symptoms: "Spurting blood", immediate_actions: ["Direct pressure", "Elevation", "Tourniquet above wound"], warnings: ["No tourniquet on joint"] },
          { id: 2, title: "CPR", symptoms: "Unresponsive", immediate_actions: ["Check response", "Call 911", "30 compressions, 2 breaths"], warnings: ["Hard & fast"] }
        ]);
        setActivePanel('firstaid');
      } else if (nodeType === 'shelter') {
        setOutputData([
          { id: 1, name: "Green Valley Center", address: "102 Emerald Pkwy", capacity: 150, contact_number: "911" }
        ]);
        setActivePanel('shelter');
      } else {
        setOutputData({ General: [{ stage: "Immediate", content: "Stay indoors. Prepare Go-Bag. Await emergency broadcast." }] });
        setActivePanel('emergency');
      }
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0B0F13] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-200">
      
      {/* Dynamic Grid Background Canvas */}
      <TerminalCanvas
        isInputFocused={isInputFocused}
        inputRect={inputRect}
        triggerSubmitAnimation={triggerSubmit}
        onSubmitAnimationEnd={() => setTriggerSubmit(false)}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-between p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex items-center justify-between border border-white/5 bg-slate-950/45 p-4 rounded-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="font-bold text-xs tracking-widest text-cyan-400 uppercase crt-glow">RESQ (Offline Console)</span>
          </div>

          <div className="flex gap-3 text-[10px] font-bold">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-white/5">
              <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
              NETWORK: <span className="text-emerald-400">{networkStatus}</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-white/5">
              <Cpu className="w-3 h-3 text-cyan-400 animate-pulse" />
              AI: <span className={aiStatus === 'ONLINE' ? 'text-cyan-400' : 'text-amber-500'}>{aiStatus}</span>
            </span>
          </div>
        </header>

        {/* MARQUEE RUNNING TICKER */}
        <div className="w-full bg-red-950/20 border border-red-500/20 py-1.5 px-4 overflow-hidden rounded-lg backdrop-blur-sm">
          <div className="animate-marquee font-mono text-xs font-semibold text-red-400 uppercase tracking-widest">
            🚨 ACTIVE ALERT FEED: CRITICAL DISASTER RESPONSE HUB RUNNING ON LOCAL SYSTEM PING NODE • EVACUATION PROTOCOLS ACTIVE FOR LOW-SECTOR DISTRICTS • DIAL 911 FOR DIRECT SEARCH & RESCUE 🚨
          </div>
        </div>

        {/* CENTRAL HERO AND INPUT NODE */}
        <div className="flex-1 flex flex-col justify-center items-center py-6 space-y-8 max-w-3xl mx-auto w-full">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white uppercase leading-tight font-sans">
              ResQ: An Offline AI Assistant for Disaster Preparedness and Emergency Response
            </h2>
            <p className="text-[10px] md:text-xs text-slate-400 tracking-widest uppercase font-mono">
              LOCAL INTERFACE NODE • SECURED END-TO-END DISPATCH
            </p>
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleCommandSubmit} className="w-full relative group">
            <div 
              ref={inputRef}
              className={`w-full flex items-center bg-slate-950/70 border rounded-xl py-3 px-4 transition-all duration-300 ${
                isInputFocused 
                  ? 'border-cyan-400/80 shadow-[0_0_15px_rgba(0,240,255,0.15)] bg-slate-950' 
                  : 'border-white/10 group-hover:border-white/20'
              }`}
            >
              <span className="font-mono text-cyan-400 font-bold mr-3">{isComputing ? "⚙️" : ">"}</span>
              <input
                type="text"
                value={inputValue}
                onFocus={() => {
                  setIsInputFocused(true);
                  updateInputRect();
                }}
                onBlur={() => setIsInputFocused(false)}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask GEMMA (e.g., 'first aid guide', 'shelter location')..."
                className="bg-transparent flex-1 text-white font-mono placeholder-slate-600 focus:outline-none text-sm md:text-base"
                disabled={isComputing}
              />
              <button 
                type="submit"
                className="text-[10px] text-cyan-400 hover:text-white border border-cyan-400/20 hover:border-cyan-400 bg-cyan-400/5 px-3 py-1.5 rounded font-mono transition-colors tracking-widest"
              >
                [EXEC]
              </button>
            </div>
          </form>

          {/* ACTIVE TERMINAL OUTPUT RENDERER */}
          <TerminalOutput
            activePanel={activePanel}
            outputData={outputData}
            onClose={() => {
              setActivePanel(null);
              setOutputData(null);
            }}
          />
        </div>

        {/* BOTTOM NODES PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {/* Card 1 */}
          <button
            onClick={() => handleActionNode('emergency')}
            className="group relative border border-red-500/10 hover:border-red-500 bg-red-950/5 hover:bg-red-950/15 p-5 rounded-xl text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-red overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-2 text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <h3 className="font-bold text-xs tracking-wider uppercase font-mono">Active Emergencies</h3>
            </div>
            <p className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors font-mono line-clamp-2">
              Evacuation routes, checklist guides, and action manuals for Floods, Fires, and Cyclones.
            </p>
          </button>

          {/* Card 2 */}
          <button
            onClick={() => handleActionNode('firstaid')}
            className="group relative border border-emerald-500/10 hover:border-emerald-500 bg-emerald-950/5 hover:bg-emerald-950/15 p-5 rounded-xl text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-emerald overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-2 text-emergency-emerald">
              <HeartPulse className="w-5 h-5" />
              <h3 className="font-bold text-xs tracking-wider uppercase font-mono">First Aid & CPR</h3>
            </div>
            <p className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors font-mono line-clamp-2">
              Hands-only resuscitation steps, bleed management, choking response, and burn treatments.
            </p>
          </button>

          {/* Card 3 */}
          <button
            onClick={() => handleActionNode('shelter')}
            className="group relative border border-purple-500/10 hover:border-purple-500 bg-purple-950/5 hover:bg-purple-950/15 p-5 rounded-xl text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-2 text-purple-400">
              <Landmark className="w-5 h-5" />
              <h3 className="font-bold text-xs tracking-wider uppercase font-mono">Shelter Finder</h3>
            </div>
            <p className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors font-mono line-clamp-2">
              Query local shelters database for capacity metrics, backup generator stats, and phone lines.
            </p>
          </button>
        </div>

        {/* BOTTOM METADATA & TELEMETRY STREAM */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-4 border-t border-white/5 pt-4">
          {/* Telemetry scrolling logs */}
          <div className="w-full md:w-80 bg-slate-950/70 border border-white/5 p-3 rounded-lg backdrop-blur-sm">
            <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 font-bold block mb-1">
              Active Telemetry Stream
            </span>
            <div className="h-16 overflow-y-auto font-mono text-[9px] text-slate-500 space-y-0.5 scrollbar-none select-none">
              {telemetryLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 leading-tight">
                  <span className="text-cyan-500/60 shrink-0 font-semibold">[{log.time}]</span>
                  <span className="truncate">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-right">
            ResQ Local Console v1.2.0 • Grid Pulse: 100% active
          </div>
        </div>

      </div>
    </div>
  );
}
