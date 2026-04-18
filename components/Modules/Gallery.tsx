'use client';

import React, { useState } from 'react';
import { LayoutGrid, Plus, Search, Filter, Sparkles, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/lib/store';

const nodeTemplates = [
  { id: 'summary', title: 'Summary Panel', type: 'summary-panel', group: 'Analysis', description: 'Real-time NLP synthesis and extraction.' },
  { id: 'topology', title: 'Topology Node', type: 'topology-node', group: 'Network', description: 'Infrastructural relationship mapping.' },
  { id: 'ai-chat', title: 'AI Assistant', type: 'ai-chat-panel', group: 'Agentic', description: 'Context-aware LLM reasoning interface.' },
  { id: 'media', title: 'Media Preview', type: 'media-preview', group: 'Viewers', description: 'High-fidelity asset visualization.' },
  { id: 'code', title: 'Code Preview', type: 'code-preview', group: 'Development', description: 'Syntax-highlighted technical analysis.' },
  { id: 'budget', title: 'Finance Node', type: 'budget-panel', group: 'Data', description: 'Economic data and allocation modeling.' },
  { id: 'history', title: 'Temporal Line', type: 'history-timeline', group: 'Data', description: 'Chrono-sync event visualization.' },
  { id: 'readiness', title: 'Sync Status', type: 'readiness-panel', group: 'Systems', description: 'System integrity and readiness audit.' },
];

export default function Gallery() {
  const addEntity = useAppStore((state) => state.addEntity);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const groups = ['All', ...Array.from(new Set(nodeTemplates.map(t => t.group)))];
  
  const filtered = nodeTemplates.filter(t => 
    (filter === 'All' || t.group === filter) &&
    (t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="glass-card p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black italic uppercase italic tracking-tighter text-glow">Node Gallery</h2>
          <p className="text-pink-100/30 text-xs font-black uppercase tracking-[0.3em] mt-2">WhisperX Architecture Repository</p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
            <div className="glass-input flex items-center px-4 py-2 rounded-2xl w-64">
                <Search size={16} className="text-pink-300/50 mr-3" />
                <input 
                    type="text" 
                    placeholder="Search blueprints..." 
                    className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest placeholder:text-pink-300/20 w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <div className="flex gap-2">
                {groups.map(g => (
                    <button 
                        key={g} 
                        onClick={() => setFilter(g)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            filter === g ? "bg-pink-500 text-white accent-glow-pink" : "glass-button text-pink-100/40"
                        )}
                    >
                        {g}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
                {filtered.map((t, idx) => (
                    <motion.div
                        key={t.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className="glass-card group p-6 rounded-[2rem] hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent blur-2xl -mr-10 -mt-10" />
                        
                        <div className="flex items-start justify-between mb-6">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-pink-500/40 transition-colors">
                                <LayoutGrid size={24} className="text-pink-300 group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-[10px] font-black italic uppercase tracking-widest px-3 py-1 bg-pink-500/10 text-pink-300 rounded-full border border-pink-500/20">
                                {t.group}
                            </span>
                        </div>

                        <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-pink-50 group-hover:text-glow transition-all">{t.title}</h3>
                        <p className="text-pink-100/40 text-xs font-black uppercase leading-relaxed mb-8">{t.description}</p>

                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => addEntity({
                                    type: t.type as any,
                                    title: t.title,
                                    x: 100 + idx * 20,
                                    y: 100 + idx * 20,
                                    width: 350,
                                    height: 400,
                                    isAiGenerated: false
                                })}
                                className="flex-1 glass-button py-3 rounded-xl flex items-center justify-center gap-2 group/btn"
                            >
                                <Plus size={16} className="text-pink-300 group-hover/btn:rotate-90 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deploy to Canvas</span>
                            </button>
                            <button className="glass-button p-3 rounded-xl hover:text-pink-400">
                                <Heart size={16} />
                            </button>
                        </div>
                        
                        {/* Interactive Sparkle */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Sparkles size={14} className="text-pink-400 animate-pulse" />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
