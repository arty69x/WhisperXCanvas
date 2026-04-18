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
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden p-6 gap-6">
      <header className="p-10 glass-panel border-white/5 bg-black/10 backdrop-blur-3xl rounded-[2.5rem] relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-glow text-white/90">Contacts_Registry</h1>
            <p className="text-[10px] text-pink-300/40 font-black uppercase tracking-[0.2em]">System Stakeholders • Neural Team Nodes</p>
          </div>
          <button className="flex items-center gap-3 px-6 py-3 bg-pink-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-500 transition-all shadow-[0_0_30px_rgba(219,39,119,0.3)] active:scale-95">
            <Plus size={16} /> Synthesis Contact
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contacts.map((contact) => (
            <div key={contact.id} className="group glass-panel border-white/5 bg-black/10 rounded-[2.5rem] p-8 space-y-8 hover:bg-pink-500/[0.02] hover:border-pink-500/20 transition-all active:scale-[0.98] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-pink-500/5 border border-pink-500/10 flex items-center justify-center text-pink-300/40 group-hover:text-pink-400 group-hover:bg-pink-500/10 transition-all relative">
                    <Users size={32} />
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#0a050a]",
                      contact.status === 'online' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-white/20"
                    )} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight text-white/80 group-hover:text-white transition-colors">{contact.name}</h4>
                    <p className="text-[10px] text-pink-100/20 uppercase font-black tracking-[0.2em] mt-1 italic">{contact.role}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-xl text-pink-100/20 hover:text-pink-400 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="space-y-4 relative z-10">
                <ContactInfo icon={Mail} label={contact.email} />
                <ContactInfo icon={Phone} label="+1 (555) 000-0000" />
                <ContactInfo icon={Globe} label="whisperx.canvas" />
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-3 relative z-10">
                <button className="flex-1 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-pink-100/30 hover:bg-white/10 hover:text-white transition-all active:scale-95 border border-white/5">Message</button>
                <button className="flex-1 py-3 glass-button rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all active:scale-95 border-white/5">Profile_Link</button>
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
    <div className="flex items-center gap-4 text-pink-100/20 group-hover:text-pink-100/40 transition-colors group/info">
      <Icon size={16} className="group-hover/info:text-pink-400 transition-colors" />
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}
