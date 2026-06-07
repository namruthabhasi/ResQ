import React, { useState, useEffect } from 'react';
import { ShieldAlert, MessageSquare, Briefcase, Phone, Settings, Activity, Wifi, WifiOff, Cpu, Database, Bell } from 'lucide-react';

export default function Layout({ activePage, setActivePage, children }) {
  const [dbStatus, setDbStatus] = useState('checking');
  const [aiStatus, setAiStatus] = useState('checking');
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine ? 'online' : 'offline');
  const [emergencyAlert, setEmergencyAlert] = useState(
    "ALERT LEVEL RED: Severe flood warning active in Lowland sectors. Move to designated high shelters."
  );

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setNetworkStatus('online');
    const handleOffline = () => setNetworkStatus('offline');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Poll backend status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/status');
        if (res.ok) {
          const data = await res.json();
          setDbStatus(data.database === 'healthy' ? 'connected' : 'error');
          setAiStatus(data.ollama_ai === 'online' ? 'ready' : 'offline');
        } else {
          setDbStatus('offline');
          setAiStatus('offline');
        }
      } catch (err) {
        setDbStatus('offline');
        setAiStatus('offline');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Check status every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Command Center', icon: Activity },
    { id: 'emergency', label: 'Emergency Mode', icon: ShieldAlert, highlight: true },
    { id: 'chat', label: 'ResQ AI Chat', icon: MessageSquare },
    { id: 'toolkit', label: 'Survival Toolkit', icon: Briefcase },
    { id: 'contacts', label: 'Emergency Contacts', icon: Phone },
    { id: 'settings', label: 'Settings & Admin', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-command-bg text-command-text flex flex-col radar-grid">
      {/* Top Warning Banner */}
      {emergencyAlert && (
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-b border-red-500/30 text-red-200 px-4 py-2.5 text-sm md:text-base flex items-center justify-between font-semibold shadow-glow-red animate-pulse">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-emergency-red shrink-0" />
            <span>{emergencyAlert}</span>
          </div>
          <button 
            onClick={() => setEmergencyAlert(null)}
            className="text-red-400 hover:text-red-100 px-2 py-1 text-xs border border-red-500/40 rounded bg-red-900/30 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-command-border glass-panel sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emergency-blue to-emerald-500 p-2 rounded-xl shadow-glow-blue">
            <ShieldAlert className="w-6 h-6 text-command-bg" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-emergency-blue">
              RESQ
            </h1>
            <span className="text-[10px] md:text-xs text-emergency-emerald uppercase tracking-widest font-mono">
              Offline Command Console
            </span>
          </div>
        </div>

        {/* System Diagnostics (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-mono bg-slate-950/80 px-4 py-2 rounded-xl border border-command-border/50">
          <div className="flex items-center gap-2">
            <Database className={`w-3.5 h-3.5 ${dbStatus === 'connected' ? 'text-emergency-emerald' : 'text-emergency-red'}`} />
            <span>DATABASE: <span className={dbStatus === 'connected' ? 'text-emergency-emerald' : 'text-emergency-red font-bold'}>{dbStatus.toUpperCase()}</span></span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <Cpu className={`w-3.5 h-3.5 ${aiStatus === 'ready' ? 'text-emergency-emerald' : 'text-emergency-red'}`} />
            <span>AI ENGINE (GEMMA): <span className={aiStatus === 'ready' ? 'text-emergency-emerald' : 'text-emergency-red font-bold'}>{aiStatus.toUpperCase()}</span></span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            {networkStatus === 'online' ? (
              <Wifi className="w-3.5 h-3.5 text-emergency-emerald" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-emergency-yellow" />
            )}
            <span>NET: <span className={networkStatus === 'online' ? 'text-emergency-emerald' : 'text-emergency-yellow'}>{networkStatus === 'online' ? 'ONLINE (WAN)' : 'OFFLINE (LAN)'}</span></span>
          </div>
        </div>

        {/* Mobile menu trigger helper/info */}
        <div className="lg:hidden flex items-center gap-2 font-mono text-[10px] bg-slate-900 px-2.5 py-1.5 rounded-lg border border-command-border/30">
          <span className="w-2 h-2 rounded-full bg-emergency-emerald animate-ping" />
          <span className="text-slate-300">LOCAL MODE ACTIVE</span>
        </div>
      </header>

      {/* Main layout wrapper */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <nav className="w-full lg:w-72 bg-slate-950/45 lg:border-r border-command-border/30 p-4 lg:p-6 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible shrink-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm md:text-base font-bold transition-all w-max lg:w-full shrink-0 ${
                  isActive
                    ? item.highlight
                      ? 'bg-emergency-red text-white shadow-glow-red border border-red-400/30'
                      : 'bg-gradient-to-r from-emergency-blue/30 to-emergency-blue/10 text-white border border-emergency-blue/50 shadow-glow-blue'
                    : item.highlight
                    ? 'bg-red-950/20 text-red-400 hover:bg-red-900/25 border border-red-500/20 hover:border-red-500/40'
                    : 'text-command-muted hover:text-white hover:bg-slate-900/60 border border-transparent hover:border-command-border/30'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'scale-110' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Viewport Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Status Bar (Mobile Footer & Diagnostics Details) */}
      <footer className="border-t border-command-border/30 bg-slate-950/80 px-6 py-3 text-center text-xs text-command-muted font-mono flex flex-col md:flex-row items-center justify-between gap-2">
        <div>
          <span>ResQ v1.0.0 — Secured Command System (Offline First)</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] md:text-xs">
          <span>SYSTEM DISPATCH: <strong className="text-emergency-emerald">SECURE</strong></span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span>LATENCY: <strong className="text-emergency-blue">0ms (LOCAL)</strong></span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span>OLLAMA ENDPOINT: <strong className="text-slate-300">127.0.0.1:11434</strong></span>
        </div>
      </footer>
    </div>
  );
}
