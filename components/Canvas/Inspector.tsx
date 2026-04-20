'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  X, 
  Settings2, 
  Trash2, 
  Lock, 
  Unlock, 
  ChevronDown, 
  Zap, 
  Cpu, 
  Database,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Inspector() {
  const selectedEntityIds = useAppStore((state) => state.selectedEntityIds);
  const entities = useAppStore((state) => state.entities);
  const updateEntity = useAppStore((state) => state.updateEntity);
  const removeEntity = useAppStore((state) => state.removeEntity);
  const clearSelection = useAppStore((state) => state.clearSelection);
  const updatePortValue = useAppStore((state) => state.updatePortValue);

  const selectedEntity = entities.find(e => e.id === selectedEntityIds[0]);

  if (!selectedEntity || selectedEntityIds.length > 1) return null;

  return (
    <motion.div 
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="w-80 h-full glass-panel border-l border-white/10 flex flex-col z-[80] shadow-[-20px_0_60px_rgba(0,0,0,0.4)]"
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/10 rounded-xl text-pink-400">
            <Settings2 size={16} />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-pink-50">Inspector</h2>
            <p className="text-[8px] font-bold text-pink-200/20 uppercase tracking-tighter">Entity_Properties_v2</p>
          </div>
        </div>
        <button onClick={() => clearSelection()} className="p-2 hover:bg-white/5 rounded-xl text-white/20 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        {/* Core Identity */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[9px] font-black text-pink-200/40 uppercase tracking-[0.2em]">
            <Info size={10} />
            <span>Identity</span>
          </div>
          
          <div className="space-y-2">
            <label className="text-[8px] font-black uppercase text-pink-100/30 ml-1">Title</label>
            <input 
              type="text" 
              value={selectedEntity.title}
              onChange={(e) => updateEntity(selectedEntity.id, { title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-pink-50 focus:outline-none focus:border-pink-500/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[8px] font-black uppercase text-pink-100/30 ml-1">Subtitle</label>
            <input 
              type="text" 
              value={selectedEntity.subtitle || ''}
              onChange={(e) => updateEntity(selectedEntity.id, { subtitle: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-pink-50/60 focus:outline-none focus:border-pink-500/50 transition-colors"
            />
          </div>
        </section>

        {/* Input/Output Ports (REAL DATA PASSING) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[9px] font-black text-pink-200/40 uppercase tracking-[0.2em]">
            <Zap size={10} />
            <span>I/O Interface</span>
          </div>

          <div className="space-y-3">
            {selectedEntity.ports.map(port => (
              <div key={port.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        port.type === 'input' ? "bg-blue-400" : "bg-pink-500 shadow-[0_0_8px_rgba(255,126,179,0.5)]"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-50/80">{port.name}</span>
                  </div>
                  <span className="text-[8px] font-bold text-white/10 uppercase">{port.dataType}</span>
                </div>
                
                {/* Manual override for inputs/outputs to see propagation */}
                <div className="flex items-center gap-2">
                   <input 
                    type="text" 
                    value={port.value || ''}
                    placeholder="ENTER_DATA..."
                    onChange={(e) => updatePortValue(selectedEntity.id, port.id, e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-[9px] font-mono text-pink-200 focus:outline-none focus:border-pink-400/50"
                   />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Visual Attributes */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[9px] font-black text-pink-200/40 uppercase tracking-[0.2em]">
            <Layers size={10} />
            <span>Dimensions</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase text-pink-100/30 ml-1">Width</label>
              <input 
                type="number" 
                value={selectedEntity.width}
                onChange={(e) => updateEntity(selectedEntity.id, { width: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold text-pink-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase text-pink-100/30 ml-1">Height</label>
              <input 
                type="number" 
                value={selectedEntity.height}
                onChange={(e) => updateEntity(selectedEntity.id, { height: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold text-pink-50"
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="pt-6 space-y-3">
          <button 
            onClick={() => updateEntity(selectedEntity.id, { locked: !selectedEntity.locked })}
            className="w-full py-3 glass-button border-white/5 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-pink-100/40 hover:text-white transition-all"
          >
            {selectedEntity.locked ? <Lock size={14} /> : <Unlock size={14} />}
            <span>{selectedEntity.locked ? 'Unlock Matrix' : 'Lock Position'}</span>
          </button>
          
          <button 
            onClick={() => removeEntity(selectedEntity.id)}
            className="w-full py-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-all"
          >
            <Trash2 size={14} />
            <span>Eliminate Node</span>
          </button>
        </section>
      </div>

      <div className="p-6 bg-gradient-to-t from-pink-500/[0.03] to-transparent pointer-events-none absolute bottom-0 left-0 w-full" />
    </motion.div>
  );
}
