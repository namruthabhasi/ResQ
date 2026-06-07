import React, { useState, useEffect } from 'react';
import { Database, Cpu, RefreshCw, AlertTriangle, ShieldCheck, Plus, List, Save, HelpCircle } from 'lucide-react';

export default function SettingsPage() {
  const [dbStatus, setDbStatus] = useState('checking');
  const [aiStatus, setAiStatus] = useState('checking');
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState('');

  // Shelter Form State
  const [shelterName, setShelterName] = useState('');
  const [shelterAddress, setShelterAddress] = useState('');
  const [shelterCapacity, setShelterCapacity] = useState('');
  const [shelterPhone, setShelterPhone] = useState('');
  const [shelterFacilities, setShelterFacilities] = useState('');
  const [shelterStatusText, setShelterStatusText] = useState('');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactOrg, setContactOrg] = useState('');
  const [contactStatusText, setContactStatusText] = useState('');

  // Diagnostics check
  const checkDiagnostics = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data.database === 'healthy' ? 'online' : 'error');
        setAiStatus(data.ollama_ai === 'online' ? 'online' : 'offline');
      } else {
        setDbStatus('offline');
        setAiStatus('offline');
      }
    } catch (err) {
      setDbStatus('offline');
      setAiStatus('offline');
    }
  };

  useEffect(() => {
    checkDiagnostics();
  }, []);

  // Reseed Database handler
  const handleReseedDb = async () => {
    setSyncLoading(true);
    setSyncStatusText('Erasing and resetting SQLite schema...');
    try {
      const res = await fetch('http://localhost:8000/api/admin/reseed', {
        method: 'POST'
      });
      if (res.ok) {
        setSyncStatusText('Reseeding complete! Default guides, checklists, and contacts restored.');
        checkDiagnostics();
      } else {
        setSyncStatusText('Error reseeding: Server responded with error.');
      }
    } catch (err) {
      setSyncStatusText('Network failure: Server is offline.');
    } finally {
      setSyncLoading(false);
    }
  };

  // Submit Shelter Form
  const handleAddShelter = async (e) => {
    e.preventDefault();
    if (!shelterName || !shelterAddress || !shelterPhone) {
      setShelterStatusText("Please fill out all required fields.");
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/shelters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: shelterName,
          address: shelterAddress,
          capacity: parseInt(shelterCapacity) || 0,
          contact_number: shelterPhone,
          available_facilities: shelterFacilities || null
        })
      });

      if (res.ok) {
        setShelterStatusText("Shelter added to local database successfully!");
        setShelterName('');
        setShelterAddress('');
        setShelterCapacity('');
        setShelterPhone('');
        setShelterFacilities('');
      } else {
        setShelterStatusText("Failed to add shelter. Verify backend connection.");
      }
    } catch (err) {
      setShelterStatusText("Connection error. Is backend API running?");
    }
  };

  // Submit Contact Form
  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!contactName || !contactRole || !contactPhone || !contactOrg) {
      setContactStatusText("Please fill out all required fields.");
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          role: contactRole,
          phone_number: contactPhone,
          organization: contactOrg
        })
      });

      if (res.ok) {
        setContactStatusText("Emergency contact registered successfully!");
        setContactName('');
        setContactRole('');
        setContactPhone('');
        setContactOrg('');
      } else {
        setContactStatusText("Failed to register contact. Check server logs.");
      }
    } catch (err) {
      setContactStatusText("Connection error. Verify backend API.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-command-border/20 pb-4">
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
          System Control & Admin
        </h2>
        <p className="text-sm text-command-muted mt-0.5">
          Diagnose local resources, manage emergency databases, and update survival directives offline.
        </p>
      </div>

      {/* Section 1: System Status Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DB Status */}
        <div className="glass-panel rounded-2xl p-5 border border-command-border/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border shrink-0 ${
              dbStatus === 'online' ? 'bg-emergency-emerald/10 border-emergency-emerald/30 text-emergency-emerald' : 'bg-red-950/20 border-red-500/20 text-emergency-red'
            }`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">SQLite Database</h4>
              <span className="text-xs text-command-muted">Stores shelter capacity and contacts</span>
            </div>
          </div>
          <span className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded-lg border ${
            dbStatus === 'online' ? 'bg-emerald-950/35 text-emergency-emerald border-emergency-emerald/30' : 'bg-red-950/30 text-emergency-red border-red-500/20'
          }`}>
            {dbStatus === 'online' ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        {/* AI Status */}
        <div className="glass-panel rounded-2xl p-5 border border-command-border/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border shrink-0 ${
              aiStatus === 'online' ? 'bg-emergency-emerald/10 border-emergency-emerald/30 text-emergency-emerald' : 'bg-red-950/20 border-red-500/20 text-emergency-red'
            }`}>
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Gemma Local Server</h4>
              <span className="text-xs text-command-muted">Ollama model runner endpoint status</span>
            </div>
          </div>
          <span className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded-lg border ${
            aiStatus === 'online' ? 'bg-emerald-950/35 text-emergency-emerald border-emergency-emerald/30' : 'bg-red-950/30 text-emergency-red border-red-500/20 animate-pulse'
          }`}>
            {aiStatus === 'online' ? 'READY' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Section 2: Administrative Control Actions */}
      <div className="glass-panel rounded-2xl p-6 border border-command-border/30 space-y-4">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emergency-blue" />
            Database Synchronization & Re-seeding
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Overwrite custom additions and restore default guides, first aid steps, and standard checklists.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 pt-2">
          <button
            onClick={handleReseedDb}
            disabled={syncLoading}
            className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-command-border/45 text-white font-bold px-5 py-3 rounded-xl text-xs md:text-sm tracking-wider uppercase transition-colors shrink-0 flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${syncLoading ? 'animate-spin' : ''}`} />
            Seed / Reset SQLite DB
          </button>

          {syncStatusText && (
            <span className="text-xs font-mono font-semibold text-emergency-blue">
              {syncStatusText}
            </span>
          )}
        </div>
      </div>

      {/* Section 3: Admin Forms - Create/Add resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form: Add Shelter */}
        <div className="glass-panel rounded-2xl p-6 border border-command-border/30 flex flex-col justify-between">
          <form onSubmit={handleAddShelter} className="space-y-4">
            <div className="border-b border-command-border/20 pb-3 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emergency-emerald animate-pulse" />
              <h3 className="font-bold text-base md:text-lg text-white">Register Emergency Shelter</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Shelter Name *</label>
                <input
                  type="text"
                  value={shelterName}
                  onChange={(e) => setShelterName(e.target.value)}
                  placeholder="e.g. Oak Street High Gymnasium"
                  className="w-full bg-slate-950 border border-command-border/30 focus:border-emergency-blue rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Address *</label>
                <input
                  type="text"
                  value={shelterAddress}
                  onChange={(e) => setShelterAddress(e.target.value)}
                  placeholder="e.g. 789 Oak Ave, Sector B"
                  className="w-full bg-slate-950 border border-command-border/30 focus:border-emergency-blue rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={shelterCapacity}
                    onChange={(e) => setShelterCapacity(e.target.value)}
                    placeholder="e.g. 200"
                    className="w-full bg-slate-950 border border-command-border/30 focus:border-emergency-blue rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    value={shelterPhone}
                    onChange={(e) => setShelterPhone(e.target.value)}
                    placeholder="e.g. +1-800-555-0100"
                    className="w-full bg-slate-950 border border-command-border/30 focus:border-emergency-blue rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Available Facilities (Comma-separated)</label>
                <input
                  type="text"
                  value={shelterFacilities}
                  onChange={(e) => setShelterFacilities(e.target.value)}
                  placeholder="e.g. Clean Water, Food Rations, Solar Charging"
                  className="w-full bg-slate-950 border border-command-border/30 focus:border-emergency-blue rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {shelterStatusText && (
              <p className="text-xs font-semibold text-emergency-blue font-mono">{shelterStatusText}</p>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl border border-command-border/45 text-xs uppercase tracking-wider transition-colors"
            >
              Commit Shelter to DB
            </button>
          </form>
        </div>

        {/* Form: Add Contact */}
        <div className="glass-panel rounded-2xl p-6 border border-command-border/30 flex flex-col justify-between">
          <form onSubmit={handleAddContact} className="space-y-4">
            <div className="border-b border-command-border/20 pb-3 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emergency-emerald animate-pulse" />
              <h3 className="font-bold text-base md:text-lg text-white">Add Emergency Contact</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Contact/Agency Name *</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Emergency Helicopter Command"
                  className="w-full bg-slate-950 border border-command-border/30 focus:border-emergency-blue rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Designation/Role *</label>
                <input
                  type="text"
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  placeholder="e.g. Flood Air Evacuations"
                  className="w-full bg-slate-950 border border-command-border/30 focus:border-emergency-blue rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +1-800-555-0999"
                  className="w-full bg-slate-950 border border-command-border/30 focus:border-emergency-blue rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Organization *</label>
                <input
                  type="text"
                  value={contactOrg}
                  onChange={(e) => setContactOrg(e.target.value)}
                  placeholder="e.g. State Defense Corps"
                  className="w-full bg-slate-950 border border-command-border/30 focus:border-emergency-blue rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {contactStatusText && (
              <p className="text-xs font-semibold text-emergency-blue font-mono">{contactStatusText}</p>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl border border-command-border/45 text-xs uppercase tracking-wider transition-colors"
            >
              Commit Contact to DB
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
