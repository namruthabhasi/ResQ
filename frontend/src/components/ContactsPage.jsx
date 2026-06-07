import React, { useState, useEffect } from 'react';
import { Phone, Search, Users, ExternalLink, ShieldAlert } from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fallbackContacts = [
    {
      id: 1,
      name: "National Disaster Response Dispatch",
      role: "National Emergency Coordination",
      phone_number: "911",
      organization: "Federal Emergency Agency"
    },
    {
      id: 2,
      name: "Metropolitan Fire Command",
      role: "Fire & Rescue Operations",
      phone_number: "999",
      organization: "Municipal Fire Service"
    },
    {
      id: 3,
      name: "Red Cross Emergency Dispatch",
      role: "First Aid & Shelter Assistance",
      phone_number: "+1-800-733-2767",
      organization: "International Red Cross"
    },
    {
      id: 4,
      name: "Coast Guard Rescue Operations",
      role: "Flood & Water Rescue",
      phone_number: "+1-800-555-0220",
      organization: "National Coast Guard"
    }
  ];

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/contacts');
        if (res.ok) {
          const data = await res.json();
          setContacts(data.length > 0 ? data : fallbackContacts);
        } else {
          setContacts(fallbackContacts);
        }
      } catch (err) {
        setContacts(fallbackContacts);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // Filter and search
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'National') return c.phone_number.length <= 4;
    if (activeFilter === 'Rescue') return c.role.toLowerCase().includes('rescue') || c.role.toLowerCase().includes('fire');
    if (activeFilter === 'Medical') return c.role.toLowerCase().includes('medical') || c.role.toLowerCase().includes('first aid') || c.organization.toLowerCase().includes('red cross');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-command-border/20 pb-4">
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
          Emergency Contacts
        </h2>
        <p className="text-sm text-command-muted mt-0.5">
          Local authorities, fire dispatch, emergency ambulance centers, and civilian rescue team lists.
        </p>
      </div>

      {/* Control Panel: Search & Filter Chips */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search emergency directory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/70 border border-command-border/40 focus:border-emergency-blue/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['All', 'National', 'Rescue', 'Medical'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeFilter === filter
                  ? 'bg-emergency-blue/15 border-emergency-blue text-white shadow-glow-blue'
                  : 'bg-slate-950/40 border-command-border/20 text-slate-400 hover:text-white'
              }`}
            >
              {filter === 'All' ? 'All Contacts' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="text-center py-20 font-mono text-xs text-command-muted">
          Accessing local emergency catalog...
        </div>
      ) : filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="border border-command-border/30 rounded-xl p-5 bg-slate-950/50 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emergency-emerald uppercase font-bold tracking-widest block">
                  {contact.organization}
                </span>
                <h4 className="font-bold text-base md:text-lg text-white leading-tight">
                  {contact.name}
                </h4>
                <p className="text-xs text-slate-400 font-semibold">{contact.role}</p>
              </div>

              {/* Call Trigger button */}
              <a
                href={`tel:${contact.phone_number}`}
                className="flex items-center gap-2 bg-gradient-to-r from-emergency-red/20 to-red-950/30 border border-emergency-red/35 hover:border-emergency-red/90 text-white font-bold px-4 py-3 rounded-xl transition-all shadow-glow-red hover:scale-105"
              >
                <Phone className="w-4 h-4 text-emergency-red animate-pulse" />
                <span className="font-mono text-sm">{contact.phone_number}</span>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-command-muted font-mono text-xs">
          No emergency contacts matched your search query.
        </div>
      )}

      {/* Local Safety Notice */}
      <div className="bg-gradient-to-r from-red-950/20 via-red-950/10 to-red-950/20 border border-red-500/25 p-5 rounded-2xl flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-emergency-red shrink-0 mt-0.5 animate-bounce" />
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-red-200">System Dispatch Advisory:</h4>
          <p className="text-xs text-slate-300">
            During complete network failures, cellular base stations may be powered by batteries for only 24-48 hours. Keep calls short, state your location first, and conserve device battery.
          </p>
        </div>
      </div>
    </div>
  );
}
