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
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden selection:bg-pink-500/30">
      <header className="p-12 glass-panel border-white/5 bg-black/20 backdrop-blur-3xl relative z-10 m-6 rounded-[2.5rem]">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-glow text-white/90">Mission_Event_Log</h1>
          <p className="text-[10px] text-pink-300/40 font-black uppercase tracking-[0.2em]">Immutable System Audit Trail • Real-time Synchronization</p>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-12 scrollbar-hide relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 relative">
          <div className="absolute left-10 top-0 bottom-0 w-px bg-pink-500/10" />
          
          {events.map((event) => (
            <div key={event.id} className="relative flex gap-12 group">
              <div className="w-20 h-20 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center text-pink-300/20 group-hover:text-pink-400 group-hover:scale-110 group-hover:border-pink-500/30 transition-all z-10 backdrop-blur-md shadow-2xl relative">
                <event.icon size={32} />
                <div className="absolute inset-0 rounded-3xl bg-pink-500/5 group-hover:bg-pink-500/10 transition-colors" />
              </div>
              <div className="flex-1 p-8 glass-panel rounded-[3rem] hover:bg-white/[0.04] transition-all cursor-pointer space-y-6 border-white/5 relative group/card overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover/card:opacity-[0.05] transition-opacity pointer-events-none">
                  <event.icon size={120} />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-[0.3em] text-pink-100/40">{event.type}</span>
                    <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_10px_#ff7eb3]" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-pink-100/20 uppercase tracking-widest">
                    <Clock size={12} className="text-pink-300" /> {event.time}
                  </div>
                </div>
                <p className="text-xl font-black uppercase tracking-tight text-white/80 group-hover/card:text-white transition-colors">{event.label}</p>
                <div className="flex items-center gap-2 text-[9px] font-black text-pink-100/20 uppercase tracking-[0.3em] group-hover/card:text-pink-400 transition-colors">
                  DEEP_ANALYSIS_LINK <ArrowRight size={10} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
