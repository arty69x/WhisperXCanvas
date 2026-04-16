import React from 'react';
import { History as HistoryIcon, Clock, ArrowRight, Zap, Database, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function History({ activeModule }: { activeModule: string }) {
  if (activeModule !== 'history') return null;

  const events = [
    { id: '1', type: 'import', label: 'Imported source_doc_01.pdf', time: '2 hours ago', icon: Database },
    { id: '2', type: 'forge', label: 'Forge transformation: standard_v1', time: '3 hours ago', icon: Zap },
    { id: '3', type: 'ai', label: 'AI Analysis: Archive Summary', time: '5 hours ago', icon: Sparkles },
    { id: '4', type: 'workspace', label: 'Workspace layout updated', time: '1 day ago', icon: HistoryIcon },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0a]">
      <header className="p-8 border-b border-white/10">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Event History</h1>
        <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Interactive System Timeline</p>
      </header>
      
      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-6 relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5" />
          
          {events.map((event) => (
            <div key={event.id} className="relative flex gap-6 group">
              <div className="w-12 h-12 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white transition-colors z-10">
                <event.icon size={20} />
              </div>
              <div className="flex-1 p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{event.type}</span>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase">
                    <Clock size={12} /> {event.time}
                  </div>
                </div>
                <p className="text-sm font-bold">{event.label}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  View Details <ArrowRight size={10} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
