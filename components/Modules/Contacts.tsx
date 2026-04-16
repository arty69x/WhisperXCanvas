import React from 'react';
import { Users, Search, Filter, Plus, MoreVertical, Mail, Phone, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Contacts({ activeModule }: { activeModule: string }) {
  if (activeModule !== 'contacts') return null;

  const contacts = [
    { id: '1', name: 'Arty69x', role: 'Lead Architect', email: 'arty@whisperx.studio', status: 'online' },
    { id: '2', name: 'Sarah Chen', role: 'Data Scientist', email: 'sarah@whisperx.studio', status: 'offline' },
    { id: '3', name: 'Marcus Vane', role: 'Forge Engineer', email: 'marcus@whisperx.studio', status: 'online' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0a]">
      <header className="p-8 border-b border-white/10 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Contacts</h1>
          <p className="text-xs text-white/40 font-bold uppercase tracking-wider">System Stakeholders & Team</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-colors">
          <Plus size={14} /> Add Contact
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div key={contact.id} className="group bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 hover:border-white/30 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white transition-colors relative">
                    <Users size={24} />
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#141414]",
                      contact.status === 'online' ? "bg-green-500" : "bg-white/20"
                    )} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{contact.name}</h4>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">{contact.role}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-white/5 rounded text-white/20 hover:text-white">
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="space-y-2">
                <ContactInfo icon={Mail} label={contact.email} />
                <ContactInfo icon={Phone} label="+1 (555) 000-0000" />
                <ContactInfo icon={Globe} label="whisperx.studio" />
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-2">
                <button className="flex-1 py-2 bg-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">Message</button>
                <button className="flex-1 py-2 bg-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactInfo({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center gap-3 text-white/40 group-hover:text-white/60 transition-colors">
      <Icon size={12} />
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}
