import React from 'react';
import { Terminal, ShieldAlert, HeartPulse, Landmark, PhoneCall, CheckSquare } from 'lucide-react';

export default function TerminalOutput({ activePanel, outputData, onClose, onToggleChecklist }) {
  if (!activePanel) return null;

  const renderPanelIcon = () => {
    switch (activePanel) {
      case 'emergency': return <ShieldAlert className="w-5 h-5 text-emergency-red animate-pulse" />;
      case 'firstaid': return <HeartPulse className="w-5 h-5 text-emergency-emerald" />;
      case 'shelter': return <Landmark className="w-5 h-5 text-purple-400" />;
      case 'contacts': return <PhoneCall className="w-5 h-5 text-emergency-blue" />;
      case 'chat': return <Terminal className="w-5 h-5 text-emergency-blue animate-pulse" />;
      default: return <Terminal className="w-5 h-5 text-emerald-400" />;
    }
  };

  const renderPanelTitle = () => {
    switch (activePanel) {
      case 'emergency': return "ACTIVE EMERGENCIES PROTOCOLS";
      case 'firstaid': return "FIRST AID & MEDICAL GUIDES";
      case 'shelter': return "LOCAL EMERGENCY SHELTER REGISTRY";
      case 'contacts': return "COMMUNICATION NODE DIRECTORY";
      case 'chat': return "GEMMA AI DISPATCH TERMINAL";
      default: return "SYSTEM OPERATION NODE";
    }
  };

  const getPanelClass = () => {
    switch (activePanel) {
      case 'emergency': return 'tactical-panel-red border-red-500/30';
      case 'firstaid': return 'tactical-panel-emerald border-emerald-500/30';
      case 'shelter': return 'tactical-panel-purple border-purple-500/30';
      default: return 'tactical-panel border-command-border/30';
    }
  };

  return (
    <div className={`w-full rounded-2xl border p-6 ${getPanelClass()} scanline-container fade-in z-10 relative`}>
      {/* Terminal Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 font-mono text-xs font-semibold">
        <div className="flex items-center gap-2.5">
          {renderPanelIcon()}
          <span className="tracking-wider text-slate-100 font-bold crt-glow">{renderPanelTitle()}</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white border border-white/10 hover:border-white/20 bg-slate-950/40 px-3 py-1 rounded transition-colors uppercase tracking-widest font-mono text-[10px]"
        >
          [Close Node]
        </button>
      </div>

      {/* Terminal Screen Body */}
      <div className="text-slate-300 font-mono text-sm space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {/* Render: AI Chat/Query Output */}
        {activePanel === 'chat' && (
          <div className="space-y-4 leading-relaxed">
            <div className="bg-slate-950/60 p-4 border border-white/5 rounded-xl font-mono text-xs flex gap-2 items-center text-emergency-emerald">
              <span className="w-1.5 h-1.5 bg-emergency-emerald rounded-full animate-ping" />
              <span>LOG: Computational retrieval completed. Source: local_ai_engine.</span>
            </div>

            <div className="space-y-3 whitespace-pre-line text-slate-200 text-sm md:text-base leading-relaxed font-mono">
              {outputData?.split('\n').map((line, idx) => {
                if (line.startsWith('### ')) {
                  return <h4 key={idx} className="text-base font-bold text-white crt-glow mt-4 mb-2">{line.replace('### ', '')}</h4>;
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <strong key={idx} className="block text-emergency-blue mt-3">{line.replace(/\*\*/g, '')}</strong>;
                }
                if (line.startsWith('- ') || line.startsWith('* ')) {
                  return <li key={idx} className="ml-4 list-disc py-0.5">{line.substring(2)}</li>;
                }
                return <p key={idx} className="mb-1">{line}</p>;
              })}
            </div>
          </div>
        )}

        {/* Render: Active Emergencies (Survival Guides) */}
        {activePanel === 'emergency' && outputData && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(outputData).map((key) => (
                <div key={key} className="bg-slate-950/40 border border-red-500/15 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-red-400 border-b border-red-500/10 pb-1 text-sm">{key.toUpperCase()} EMERGENCY</h4>
                  <div className="space-y-1.5 text-xs">
                    {outputData[key].map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-red-500 font-bold shrink-0">{item.stage}:</span>
                        <span className="text-slate-300 leading-normal">{item.content.split('\n')[1] || item.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Render: First Aid */}
        {activePanel === 'firstaid' && outputData && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outputData.map((guide) => (
                <div key={guide.id} className="bg-slate-950/40 border border-emerald-500/15 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-emerald-400 border-b border-emerald-500/10 pb-1 text-sm">{guide.title}</h4>
                  <div className="space-y-2 text-xs">
                    <p><strong className="text-slate-200">Symptoms:</strong> {guide.symptoms}</p>
                    <div>
                      <strong className="text-emergency-emerald block mb-1">Actions:</strong>
                      {guide.immediate_actions.map((act, idx) => (
                        <div key={idx} className="flex gap-1.5 mb-0.5 text-slate-300">
                          <span className="text-emerald-500">{idx+1}.</span>
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Render: Shelter Finder */}
        {activePanel === 'shelter' && outputData && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-white/10 rounded-xl bg-slate-950/40">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-white/10 text-purple-400">
                    <th className="p-3">SHELTER LOCATION</th>
                    <th className="p-3">ADDRESS</th>
                    <th className="p-3">CAPACITY</th>
                    <th className="p-3">TELEPHONE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {outputData.map((shelter) => (
                    <tr key={shelter.id} className="hover:bg-purple-950/5">
                      <td className="p-3 font-bold text-white">{shelter.name}</td>
                      <td className="p-3">{shelter.address}</td>
                      <td className="p-3 font-mono text-emergency-emerald font-bold">{shelter.capacity}</td>
                      <td className="p-3">
                        <a href={`tel:${shelter.contact_number}`} className="text-emergency-blue font-bold hover:underline flex items-center gap-1">
                          <PhoneCall className="w-3 h-3" />
                          {shelter.contact_number}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Render: Contacts Directory */}
        {activePanel === 'contacts' && outputData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {outputData.map((contact) => (
              <div key={contact.id} className="bg-slate-950/50 border border-command-border/25 rounded-xl p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-emergency-blue uppercase tracking-wider block font-bold">{contact.organization}</span>
                  <h4 className="font-bold text-sm text-white">{contact.name}</h4>
                  <span className="text-slate-400">{contact.role}</span>
                </div>
                <a href={`tel:${contact.phone_number}`} className="bg-slate-900 border border-command-border/40 hover:border-emergency-blue px-3 py-2 rounded-lg text-emergency-blue hover:text-white font-bold flex items-center gap-1.5 transition-all shrink-0">
                  <PhoneCall className="w-3.5 h-3.5" />
                  {contact.phone_number}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
