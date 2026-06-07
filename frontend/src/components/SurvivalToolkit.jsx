import React, { useState, useEffect } from 'react';
import { HeartPulse, CheckSquare, Landmark, Search, AlertCircle, Phone, Sparkles, AlertOctagon } from 'lucide-react';

export default function SurvivalToolkit() {
  const [activeTab, setActiveTab] = useState('firstaid');

  // --- Sub-component: First Aid ---
  const FirstAidSection = () => {
    const [guides, setGuides] = useState([]);
    const [selectedGuideId, setSelectedGuideId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fallbackFirstAid = [
      {
        id: 1,
        title: "CPR Guidance (Cardiopulmonary Resuscitation)",
        symptoms: "Victim is unresponsive, unconscious, and not breathing or only gasping.",
        immediate_actions: [
          "Check response: Tap the shoulders and shout 'Are you okay?'.",
          "Call for emergency help immediately (911/999).",
          "Place hands in the center of the chest and push hard and fast (100-120 compressions/min, 2 inches deep).",
          "Perform 30 compressions followed by 2 rescue breaths. Repeat.",
          "If untrained, perform Hands-Only CPR (continuous, uninterrupted chest compressions) until medical staff arrives."
        ],
        warnings: [
          "Do not perform CPR if the victim is breathing normally.",
          "Do not interrupt compressions for more than 10 seconds."
        ],
        seek_help_trigger: "CPR is an absolute life-or-death emergency. Always call for professional medical dispatch immediately."
      },
      {
        id: 2,
        title: "Bleeding Management",
        symptoms: "Visible cut or wound, spurting or flowing blood, weakness, or pale skin.",
        immediate_actions: [
          "Apply direct pressure to the wound with a clean cloth or sterile bandage.",
          "Elevate the injured limb above the level of the heart if possible.",
          "If bleeding does not stop, add more layers on top; do not remove the original cloth.",
          "Apply a tourniquet 2-3 inches above the wound (never on a joint) if bleeding is arterial and catastrophic."
        ],
        warnings: [
          "Do not wash deep, severe wounds as it may cause more bleeding.",
          "Do not remove embedded objects; stabilize them in place."
        ],
        seek_help_trigger: "Seek emergency care if bleeding is spurting, will not stop after 10 minutes of direct pressure, or if the victim shows signs of shock."
      },
      {
        id: 3,
        title: "Burns Treatment",
        symptoms: "Redness, intense pain, blistering, or charred/white skin.",
        immediate_actions: [
          "Cool the burn immediately using cool running water for 10 to 20 minutes. Do not use ice.",
          "Remove rings, tight clothing, or jewelry from the area before swelling starts.",
          "Cover the burn loosely with sterile non-adhesive cling film or plastic wrap.",
          "Elevate the burned area if possible to reduce swelling."
        ],
        warnings: [
          "Do not apply butter, grease, toothpaste, or home remedies.",
          "Do not pop or puncture blisters."
        ],
        seek_help_trigger: "Seek medical help if the burn is larger than the victim's palm, involves the face, hands, feet, groin, or is chemical/electrical."
      }
    ];

    useEffect(() => {
      const fetchFirstAid = async () => {
        try {
          const res = await fetch('http://localhost:8000/api/firstaid');
          if (res.ok) {
            const data = await res.json();
            setGuides(data.length > 0 ? data : fallbackFirstAid);
            setSelectedGuideId(data.length > 0 ? data[0].id : fallbackFirstAid[0].id);
          } else {
            setGuides(fallbackFirstAid);
            setSelectedGuideId(fallbackFirstAid[0].id);
          }
        } catch (err) {
          setGuides(fallbackFirstAid);
          setSelectedGuideId(fallbackFirstAid[0].id);
        } finally {
          setLoading(false);
        }
      };
      fetchFirstAid();
    }, []);

    const currentGuide = guides.find(g => g.id === selectedGuideId);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Guide Selection list */}
        <div className="space-y-2 lg:col-span-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">
            Select Guide
          </span>
          {loading ? (
            <div className="text-center py-6 text-sm text-command-muted font-mono">Loading...</div>
          ) : (
            <div className="flex flex-col gap-2">
              {guides.map((guide) => (
                <button
                  key={guide.id}
                  onClick={() => setSelectedGuideId(guide.id)}
                  className={`p-4 rounded-xl text-left border font-bold transition-all ${
                    selectedGuideId === guide.id
                      ? 'bg-emergency-emerald/15 border-emergency-emerald text-white shadow-glow-emerald'
                      : 'bg-slate-950/40 border-command-border/20 text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  {guide.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Detailed View */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-command-border/30 space-y-5">
          {currentGuide ? (
            <>
              <div>
                <h3 className="text-xl font-black text-white">{currentGuide.title}</h3>
                {currentGuide.symptoms && (
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    <strong className="text-slate-200">Symptoms:</strong> {currentGuide.symptoms}
                  </p>
                )}
              </div>

              {/* Steps */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emergency-emerald block">
                  Immediate Rescue Actions
                </span>
                <ol className="space-y-2.5">
                  {currentGuide.immediate_actions.map((act, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-300 text-sm md:text-base leading-relaxed font-semibold">
                      <span className="bg-slate-900 border border-command-border/40 text-emergency-emerald font-mono text-xs w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        {idx + 1}
                      </span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Warnings Box */}
              {currentGuide.warnings && currentGuide.warnings.length > 0 && (
                <div className="bg-red-950/20 border-l-4 border-emergency-red p-4 rounded-r-xl space-y-1.5">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 shrink-0" />
                    Critical Warnings
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-red-200 font-medium">
                    {currentGuide.warnings.map((warn, idx) => (
                      <li key={idx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Seek Help Trigger */}
              {currentGuide.seek_help_trigger && (
                <div className="bg-slate-900 border border-command-border/40 p-4 rounded-xl text-xs flex gap-3">
                  <AlertCircle className="w-5 h-5 text-emergency-blue shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 block mb-0.5">When to Seek Medical Attention</strong>
                    <span className="text-slate-400">{currentGuide.seek_help_trigger}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-command-muted font-mono">
              Select a first aid item from the list.
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- Sub-component: Emergency Checklists ---
  const ChecklistsSection = () => {
    const [checklists, setChecklists] = useState([]);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [checkedItems, setCheckedItems] = useState({});
    const [loading, setLoading] = useState(true);

    const fallbackChecklists = [
      {
        id: 1,
        title: "Family Emergency Kit",
        items: [
          "Water: 1 gallon per person per day for 3 days",
          "Food: 3-day supply of non-perishable food",
          "Flashlight & extra batteries",
          "First Aid Kit & prescription medications",
          "Hand-crank radio & multi-tool",
          "Emergency blankets & warm clothing"
        ]
      },
      {
        id: 2,
        title: "Flood Survival Kit",
        items: [
          "Waterproof bag for documents and cash",
          "Sturdy boots or waders",
          "Raincoat or emergency ponchos",
          "Disinfectant, hand sanitizer & masks",
          "Nylon rope (50 feet)"
        ]
      }
    ];

    useEffect(() => {
      // Load saved checkboxes from localStorage
      const saved = localStorage.getItem('resq_checked_items');
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      }

      const fetchChecklists = async () => {
        try {
          const res = await fetch('http://localhost:8000/api/checklists');
          if (res.ok) {
            const data = await res.json();
            setChecklists(data.length > 0 ? data : fallbackChecklists);
          } else {
            setChecklists(fallbackChecklists);
          }
        } catch (err) {
          setChecklists(fallbackChecklists);
        } finally {
          setLoading(false);
        }
      };
      fetchChecklists();
    }, []);

    const toggleItem = (checklistTitle, itemText) => {
      const key = `${checklistTitle}-${itemText}`;
      const updated = {
        ...checkedItems,
        [key]: !checkedItems[key]
      };
      setCheckedItems(updated);
      localStorage.setItem('resq_checked_items', JSON.stringify(updated));
    };

    const currentChecklist = checklists[selectedIdx];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Checklists selector */}
        <div className="space-y-2 lg:col-span-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">
            Select Checklist
          </span>
          {loading ? (
            <div className="text-center py-6 text-sm text-command-muted font-mono">Loading...</div>
          ) : (
            <div className="flex flex-col gap-2">
              {checklists.map((check, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  className={`p-4 rounded-xl text-left border font-bold transition-all ${
                    selectedIdx === idx
                      ? 'bg-emergency-blue/15 border-emergency-blue text-white shadow-glow-blue'
                      : 'bg-slate-950/40 border-command-border/20 text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  {check.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Checklist display */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-command-border/30 space-y-4">
          {currentChecklist ? (
            <>
              <div>
                <h3 className="text-xl font-black text-white">{currentChecklist.title}</h3>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">
                  Progress is saved automatically locally
                </span>
              </div>

              <div className="space-y-2 border-t border-command-border/10 pt-4">
                {currentChecklist.items.map((item, idx) => {
                  const itemKey = `${currentChecklist.title}-${item}`;
                  const isChecked = !!checkedItems[itemKey];
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleItem(currentChecklist.title, item)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left font-semibold transition-all ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emergency-emerald/40 text-emerald-300 line-through'
                          : 'bg-slate-900/50 border-command-border/20 hover:border-command-border/40 text-slate-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded border-slate-600 bg-slate-950 text-emergency-emerald focus:ring-emergency-emerald w-4.5 h-4.5 cursor-pointer accent-emergency-emerald"
                      />
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action utilities */}
              <div className="flex justify-between items-center text-xs font-mono pt-4 border-t border-command-border/10">
                <button
                  onClick={() => {
                    const keysToClear = currentChecklist.items.map(i => `${currentChecklist.title}-${i}`);
                    const updated = { ...checkedItems };
                    keysToClear.forEach(k => delete updated[k]);
                    setCheckedItems(updated);
                    localStorage.setItem('resq_checked_items', JSON.stringify(updated));
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  Reset Checklist
                </button>

                <button
                  onClick={() => window.print()}
                  className="text-emergency-blue hover:text-sky-300"
                >
                  Export & Print Kit
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-command-muted font-mono">
              Select a checklist to display.
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- Sub-component: Shelter Database ---
  const SheltersSection = () => {
    const [shelters, setShelters] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [facilityFilter, setFacilityFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const fallbackShelters = [
      {
        id: 1,
        name: "Green Valley Community Center",
        address: "102 Emerald Parkway, Sector 4",
        capacity: 150,
        contact_number: "+1-800-555-0191",
        available_facilities: "Backup Generator, Clean Water, Medical Station, Cots, Food Rations"
      },
      {
        id: 2,
        name: "Central High School Gymnasium",
        address: "450 Education Way, Downtown",
        capacity: 400,
        contact_number: "+1-800-555-0192",
        available_facilities: "Clean Water, Restrooms, First Aid Kit, Solar Power Charging"
      }
    ];

    const fetchShelters = async () => {
      setLoading(true);
      try {
        const url = searchQuery
          ? `http://localhost:8000/api/shelters?query=${encodeURIComponent(searchQuery)}`
          : 'http://localhost:8000/api/shelters';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setShelters(data.length > 0 ? data : fallbackShelters);
        } else {
          setShelters(fallbackShelters);
        }
      } catch (err) {
        setShelters(fallbackShelters);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchShelters();
    }, [searchQuery]);

    // Filter shelters by facility on client side
    const filteredShelters = shelters.filter(s => {
      if (!facilityFilter) return true;
      return s.available_facilities?.toLowerCase().includes(facilityFilter.toLowerCase());
    });

    const uniqueFacilities = [
      "Water", "Generator", "Medical", "Food", "Cots", "Solar"
    ];

    return (
      <div className="space-y-4">
        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search shelters by name, area or facilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/70 border border-command-border/40 focus:border-emergency-blue/80 rounded-xl py-3 pl-10 pr-4 text-xs md:text-sm text-white focus:outline-none"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>

          <select
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
            className="bg-slate-950/70 border border-command-border/40 text-slate-300 rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none"
          >
            <option value="">Filter by facility...</option>
            {uniqueFacilities.map((fac, idx) => (
              <option key={idx} value={fac}>{fac}</option>
            ))}
          </select>
        </div>

        {/* Shelters Grid */}
        {loading ? (
          <div className="text-center py-20 text-command-muted font-mono text-xs">
            Querying local shelter registry...
          </div>
        ) : filteredShelters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredShelters.map((shelter) => (
              <div
                key={shelter.id}
                className="border border-command-border/30 rounded-xl p-5 bg-slate-950/50 hover:bg-slate-950/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-bold text-base md:text-lg text-white">{shelter.name}</h4>
                    <span className="text-[10px] font-mono bg-emerald-950/40 text-emergency-emerald border border-emergency-emerald/30 px-2 py-0.5 rounded font-bold">
                      CAP: {shelter.capacity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mb-3">{shelter.address}</p>

                  {/* Facility Tags */}
                  {shelter.available_facilities && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {shelter.available_facilities.split(',').map((fac, fIdx) => (
                        <span
                          key={fIdx}
                          className="bg-slate-900 border border-command-border/35 text-[10px] text-slate-300 font-mono px-2 py-0.5 rounded"
                        >
                          {fac.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact Dial Button */}
                <a
                  href={`tel:${shelter.contact_number}`}
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs py-2.5 rounded-lg border border-command-border/45 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emergency-emerald" />
                  {shelter.contact_number}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-command-muted font-mono text-xs">
            No shelters matching your active filters.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Description */}
      <div className="flex items-center justify-between border-b border-command-border/20 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
            Survival Toolkit
          </h2>
          <p className="text-sm text-command-muted mt-0.5">
            Essential offline utilities, medical steps, interactive checklist kits, and shelter databases.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-xs text-emergency-emerald font-mono bg-emerald-950/20 border border-emergency-emerald/30 px-3 py-1.5 rounded-lg">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>OFFLINE CACHE ACTIVE</span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('firstaid')}
          className={`flex-1 py-3.5 rounded-xl text-xs md:text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 border ${
            activeTab === 'firstaid'
              ? 'bg-emergency-emerald/15 border-emergency-emerald text-white shadow-glow-emerald'
              : 'text-command-muted bg-slate-950/40 hover:bg-slate-900 border-transparent hover:border-command-border/20'
          }`}
        >
          <HeartPulse className="w-4.5 h-4.5 shrink-0" />
          <span>First Aid</span>
        </button>

        <button
          onClick={() => setActiveTab('checklists')}
          className={`flex-1 py-3.5 rounded-xl text-xs md:text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 border ${
            activeTab === 'checklists'
              ? 'bg-emergency-blue/15 border-emergency-blue text-white shadow-glow-blue'
              : 'text-command-muted bg-slate-950/40 hover:bg-slate-900 border-transparent hover:border-command-border/20'
          }`}
        >
          <CheckSquare className="w-4.5 h-4.5 shrink-0" />
          <span>Checklists</span>
        </button>

        <button
          onClick={() => setActiveTab('shelters')}
          className={`flex-1 py-3.5 rounded-xl text-xs md:text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 border ${
            activeTab === 'shelters'
              ? 'bg-purple-950/15 border-purple-500/50 text-white hover:shadow-lg'
              : 'text-command-muted bg-slate-950/40 hover:bg-slate-900 border-transparent hover:border-command-border/20'
          }`}
        >
          <Landmark className="w-4.5 h-4.5 shrink-0" />
          <span>Shelters</span>
        </button>
      </div>

      {/* Active Tab View */}
      <div className="mt-4">
        {activeTab === 'firstaid' && <FirstAidSection />}
        {activeTab === 'checklists' && <ChecklistsSection />}
        {activeTab === 'shelters' && <SheltersSection />}
      </div>
    </div>
  );
}
