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
        className="px-4 py-2 rounded-xl flex items-center gap-3 group border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 transition-all hover:shadow-md"
      >
        <Search size={16} className="text-gray-400 group-hover:text-gray-900" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-600">Spatial Search...</span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white rounded border border-gray-100 ml-2 group-hover:bg-gray-900">
            <Command size={10} className="text-gray-400 group-hover:text-white" />
            <span className="text-[9px] font-black text-gray-400 group-hover:text-white">K</span>
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
              className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[200]" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[600px] z-[201] border border-gray-100 bg-white shadow-2xl rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
                <Search size={24} className="text-gray-900" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Universal discovery across spatial nodes..." 
                  className="w-full bg-transparent border-none outline-none text-base font-bold uppercase tracking-wide text-gray-900 placeholder:text-gray-300"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeys}
                />
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto scrollbar-hide p-4">
                {query.trim() === '' && filteredEntities.length === 0 && (
                   <div className="p-12 text-center space-y-4">
                      <Layout size={40} className="mx-auto text-gray-200" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Initialize Nodes to Begin</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">WhisperX spatial discovery requires active entities in the workspace matrix.</p>
                   </div>
                )}
                
                <div className="space-y-1">
                  {filteredEntities.map((e, idx) => (
                    <button 
                      key={e.id}
                      onClick={() => handleSelect(e.id)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group relative border",
                        selectedIndex === idx ? "bg-gray-900 text-white border-transparent shadow-xl" : "hover:bg-gray-50 border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                            selectedIndex === idx ? "bg-white/10 text-white" : "bg-gray-100 text-gray-400"
                        )}>
                           <Box size={20} />
                        </div>
                        <div className="text-left">
                          <p className={cn(
                            "text-xs font-bold uppercase tracking-tighter",
                            selectedIndex === idx ? "text-white" : "text-gray-900"
                          )}>{e.title}</p>
                          <p className={cn(
                            "text-[9px] font-black uppercase tracking-widest mt-0.5",
                            selectedIndex === idx ? "text-gray-400" : "text-gray-300"
                          )}>{e.type} • {e.id.substring(0, 8)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                         {e.isAiGenerated && (
                            <span className={cn(
                                "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                                selectedIndex === idx ? "bg-white/10 border-white/20 text-white" : "bg-gray-100 border-gray-100 text-gray-500"
                            )}>AI</span>
                         )}
                         <div className={cn(
                            "p-2 rounded-lg transition-opacity",
                            selectedIndex === idx ? "opacity-100 bg-brand-orange text-white" : "opacity-0"
                         )}>
                            <Sparkles size={12} />
                         </div>
                      </div>
                    </button>
                  ))}
                  
                  {query.trim() !== '' && filteredEntities.length === 0 && (
                     <div className="p-12 text-center text-gray-300">
                        <X size={32} className="mx-auto mb-4 opacity-50" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Signal Lost: No Matches found</p>
                     </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="px-1.5 py-0.5 bg-white rounded border border-gray-200 text-[8px] font-bold text-gray-400">↑↓</div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Navigate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-1.5 py-0.5 bg-white rounded border border-gray-200 text-[8px] font-bold text-gray-400">ENTER</div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Focus</span>
                    </div>
                 </div>
                 <div className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                    Spatial Discovery Engine 2.0
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
