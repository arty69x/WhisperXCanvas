'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Layout, Box, Sparkles, Command } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const entities = useAppStore((state) => state.entities);
  const focusOnEntity = useAppStore((state) => state.focusOnEntity);
  const setActiveModule = useAppStore((state) => state.setActiveModule);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredEntities = entities.filter(e => 
    e.title.toLowerCase().includes(query.toLowerCase()) ||
    e.type.toLowerCase().includes(query.toLowerCase()) ||
    (e.payload && JSON.stringify(e.payload).toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedIndex(0);
    }
  }, [isOpen, query]);

  const handleSelect = (id: string) => {
    focusOnEntity(id);
    setActiveModule('workspace');
    setQuery('');
    setIsOpen(false);
  };

  const currentSelection = filteredEntities[selectedIndex];

  const handleKeys = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => Math.min(prev + 1, filteredEntities.length - 1));
    } else if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => Math.max(prev - 0, selectedIndex - 1));
    } else if (e.key === 'Enter' && currentSelection) {
        handleSelect(currentSelection.id);
    }
  };

  return (
    <div ref={searchRef}>
      <button 
        onClick={() => setIsOpen(true)}
        className="glass-button px-4 py-2 rounded-2xl flex items-center gap-3 group border-white/5 bg-black/5"
      >
        <Search size={16} className="text-pink-300/40 group-hover:text-pink-400" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-100/20">Search Matrix...</span>
        <div className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded-lg border border-white/10 ml-2">
            <Command size={10} className="text-pink-100/40" />
            <span className="text-[9px] font-black text-pink-100/40">K</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#0f050a]/60 backdrop-blur-md z-[200]" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[600px] z-[201] glass-panel border-white/10 bg-black/40 shadow-2xl rounded-[2.5rem] overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-white/[0.02]">
                <Search size={24} className="text-pink-400" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Query titles, types, or internal data..." 
                  className="w-full bg-transparent border-none outline-none text-base font-black uppercase tracking-widest text-pink-50 placeholder:text-pink-100/10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeys}
                />
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-pink-100/20 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto scrollbar-hide p-4">
                {query.trim() === '' && filteredEntities.length === 0 && (
                   <div className="p-12 text-center space-y-4 opacity-20">
                      <Layout size={40} className="mx-auto text-pink-300" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-200">No Entities Configured</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest">Spawn nodes in the workspace matrix to enable spatial discovery.</p>
                   </div>
                )}
                
                <div className="space-y-2">
                  {filteredEntities.map((e, idx) => (
                    <button 
                      key={e.id}
                      onClick={() => handleSelect(e.id)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl transition-all group relative",
                        selectedIndex === idx ? "bg-white/10 border-white/20 shadow-xl" : "hover:bg-white/5 border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                            selectedIndex === idx ? "bg-pink-500/20 text-pink-400" : "bg-white/5 text-pink-100/20"
                        )}>
                           <Box size={20} />
                        </div>
                        <div className="text-left">
                          <p className={cn(
                            "text-xs font-black uppercase tracking-tight",
                            selectedIndex === idx ? "text-white text-glow" : "text-white/60"
                          )}>{e.title}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-pink-100/10 mt-1">NODE::{e.type} • {e.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                         {e.isAiGenerated && (
                            <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 rounded-md text-[8px] font-black uppercase text-pink-400 tracking-widest">AI</span>
                         )}
                         <div className={cn(
                            "p-2 rounded-lg transition-opacity",
                            selectedIndex === idx ? "opacity-100 bg-white text-pink-600" : "opacity-0"
                         )}>
                            <Sparkles size={12} />
                         </div>
                      </div>
                    </button>
                  ))}
                  
                  {query.trim() !== '' && filteredEntities.length === 0 && (
                     <div className="p-12 text-center opacity-20">
                        <X size={32} className="mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">No matching signals found</p>
                     </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-black/20 border-t border-white/5 flex items-center justify-between">
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-[8px] text-pink-100/40">↑↓</div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-pink-100/10">Navigate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-[8px] text-pink-100/40">ENTER</div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-pink-100/10">Focus</span>
                    </div>
                 </div>
                 <div className="text-[8px] font-black uppercase tracking-widest text-pink-100/20">
                    WhisperX Search Engine_v1.0
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
