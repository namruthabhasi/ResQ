import React, { useState } from 'react';
import { ShieldAlert, MessageSquare, HeartPulse, Landmark, PhoneCall, Search, FileText } from 'lucide-react';

export default function HeroLanding({ setActivePage, setDisasterSearchQuery }) {
  const [searchVal, setSearchVal] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    setDisasterSearchQuery(searchVal);
    setActivePage('chat');
  };

  const quickShortcuts = [
    {
      title: "Active Emergencies",
      desc: "Emergency procedures and evacuations",
      icon: ShieldAlert,
      page: "emergency",
      color: "from-red-500/20 to-red-950/20 border-red-500/35 hover:border-red-500 text-red-400"
    },
    {
      title: "ResQ AI Dispatch",
      desc: "Ask Gemma 4 for step-by-step guidance",
      icon: MessageSquare,
      page: "chat",
      color: "from-blue-500/20 to-blue-950/20 border-emergency-blue/35 hover:border-emergency-blue text-emergency-blue"
    },
    {
      title: "First Aid & CPR",
      desc: "Instant treatment steps for severe injury",
      icon: HeartPulse,
      page: "toolkit",
      color: "from-emerald-500/20 to-emerald-950/20 border-emergency-emerald/35 hover:border-emergency-emerald text-emergency-emerald"
    },
    {
      title: "Local Shelters",
      desc: "Find nearest shelter & facility listing",
      icon: Landmark,
      page: "toolkit",
      color: "from-purple-500/20 to-purple-950/20 border-purple-500/35 hover:border-purple-500 text-purple-400"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header Glass Card */}
      <div className="relative glass-panel rounded-2xl overflow-hidden p-6 md:p-10 border border-command-border/30 radar-sweep">
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-emergency-blue/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emergency-emerald/10 border border-emergency-emerald/35 rounded-full text-xs font-mono text-emergency-emerald font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emergency-emerald animate-ping" />
            Local Server Operating Normal
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Calm During Chaos. <br />
            Your Offline <span className="bg-clip-text text-transparent bg-gradient-to-r from-emergency-blue to-emergency-emerald">ResQ Assistant.</span>
          </h2>
          
          <p className="text-sm md:text-lg text-command-muted font-medium">
            This dashboard operates entirely locally. No internet connection required. Access critical survival instructions, step-by-step first aid guides, shelter lists, and local AI support directly from this terminal.
          </p>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl group">
            <input
              type="text"
              placeholder="Ask a question (e.g. 'how to stop severe bleeding' or 'earthquake safety')..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-slate-950/70 border border-command-border/50 focus:border-emergency-blue/80 rounded-2xl py-4 pl-12 pr-4 text-sm md:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emergency-blue/20 transition-all shadow-inner"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emergency-blue transition-colors" />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-emergency-blue hover:bg-sky-500 text-command-bg font-bold px-4 py-1.5 rounded-xl text-xs md:text-sm transition-colors shadow-glow-blue"
            >
              Consult AI
            </button>
          </form>
        </div>
      </div>

      {/* Primary Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickShortcuts.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => setActivePage(item.page)}
              className={`p-5 rounded-2xl border text-left bg-gradient-to-br transition-all hover:-translate-y-0.5 duration-200 flex flex-col justify-between h-44 hover:shadow-lg ${item.color}`}
            >
              <div className="bg-slate-950/40 p-3 rounded-xl w-max border border-white/5">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base md:text-lg text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Grid: Instructions Summary & Emergency Hotlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Notices Panel */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-command-border/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-command-border/20 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emergency-blue" />
                Active Incident Guidelines
              </h3>
              <span className="text-[10px] font-mono bg-slate-900 border border-command-border/30 px-2 py-0.5 rounded text-command-muted">
                UPDATED LOCAL
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-2 border-emergency-red pl-4 py-1">
                <h4 className="font-bold text-sm text-red-300">Evacuation Plan</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Prepare Family Go-Bags and seal waterproof containers. Power plants may disable grids shortly.
                </p>
              </div>
              <div className="border-l-2 border-emergency-emerald pl-4 py-1">
                <h4 className="font-bold text-sm text-emerald-300">Clean Water Procedures</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Boil tap water for at least 1 full minute or use chlorine purification tablets. Avoid standing water.
                </p>
              </div>
              <div className="border-l-2 border-emergency-blue pl-4 py-1">
                <h4 className="font-bold text-sm text-sky-300">Medical Point-of-Contact</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  A triage center is established at Green Valley Community Center. Open 24/7.
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActivePage('emergency')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-command-border/40 py-3 rounded-xl transition-colors mt-6 text-center shadow-sm"
          >
            Open All Survival Guides
          </button>
        </div>

        {/* Hotlines Sidebar */}
        <div className="glass-panel rounded-2xl p-6 border border-command-border/30 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2 mb-4 border-b border-command-border/20 pb-3">
              <PhoneCall className="w-5 h-5 text-emergency-red animate-bounce" />
              Urgent Dispatch Dial
            </h3>
            
            <div className="space-y-4">
              <a 
                href="tel:911" 
                className="flex items-center justify-between p-3.5 bg-slate-950/70 border border-red-500/20 hover:border-red-500/50 rounded-xl transition-all group hover:bg-red-950/10"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-200">National Disasters</h4>
                  <span className="text-[10px] text-slate-400">Police & Ambulance Service</span>
                </div>
                <span className="text-base font-mono font-black text-emergency-red group-hover:scale-110 transition-transform bg-red-950/40 px-3 py-1 rounded-lg">
                  911
                </span>
              </a>

              <a 
                href="tel:999" 
                className="flex items-center justify-between p-3.5 bg-slate-950/70 border border-orange-500/20 hover:border-orange-500/50 rounded-xl transition-all group hover:bg-orange-950/10"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-200">Fire Command</h4>
                  <span className="text-[10px] text-slate-400">Search & Rescue Operations</span>
                </div>
                <span className="text-base font-mono font-black text-orange-400 group-hover:scale-110 transition-transform bg-orange-950/40 px-3 py-1 rounded-lg">
                  999
                </span>
              </a>
            </div>
          </div>

          <button 
            onClick={() => setActivePage('contacts')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-command-border/40 py-3 rounded-xl transition-colors mt-6 text-center"
          >
            All Offline Contacts
          </button>
        </div>
      </div>
    </div>
  );
}
