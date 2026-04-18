import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { 
  Settings, 
  Trash2, 
  Copy, 
  Lock, 
  Unlock,
  ChevronDown, 
  Type, 
  Move, 
  Maximize,
  Layers,
  Layout,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Link,
  MoreVertical,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Inspector() {
  const entities = useAppStore((state) => state.entities);
  const selectedEntityIds = useAppStore((state) => state.selectedEntityIds);
  const updateEntity = useAppStore((state) => state.updateEntity);
  const removeEntity = useAppStore((state) => state.removeEntity);
  const addEntity = useAppStore((state) => state.addEntity);
  const setAiQuery = useAppStore((state) => state.setAiQuery);

  const toggleEntityLock = useAppStore((state) => state.toggleEntityLock);
  const isFocusedMode = useAppStore((state) => state.isFocusedMode);
  const toggleFocusedMode = useAppStore((state) => state.toggleFocusedMode);

  const selectedEntities = entities.filter(e => selectedEntityIds.includes(e.id));
  const [activeTab, setActiveTab] = useState<'props' | 'meta' | 'data'>('props');

  if (selectedEntities.length === 0) {
    return (
      <div className="w-80 border-l border-white/10 glass-panel flex flex-col items-center justify-center p-12 text-center space-y-6 z-20 md:mr-4 md:my-4 md:rounded-[2.5rem] md:h-[calc(100vh-2rem)] shadow-[-20px_0_60px_rgba(255,126,179,0.05)]">
        <div className="w-20 h-20 rounded-[2rem] bg-pink-500/5 border border-pink-500/10 flex items-center justify-center text-pink-300/20 shadow-inner group overflow-hidden relative">
          <Settings size={32} className="group-hover:rotate-90 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-200/20">Empty Matrix</h3>
          <p className="text-[9px] text-pink-100/10 uppercase font-black leading-relaxed tracking-widest">
            Select a canvas node to initialize properties and relational metadata.
          </p>
        </div>
      </div>
    );
  }

  const isMulti = selectedEntities.length > 1;
  const primary = selectedEntities[0];

  const handleDuplicate = () => {
    selectedEntities.forEach(e => {
      addEntity({
        ...e,
        x: e.x + 40,
        y: e.y + 40,
      });
    });
  };

  const handleAiHelp = (field: string) => {
    const val = (primary as any)[field];
    const query = `Provide analysis and help for the node '${primary.title}' regarding its ${field}: '${val}'. Node type is ${primary.type}.`;
    setAiQuery(query);
  };

  const handleEnrich = () => {
    const query = `Enrich and re-analyze the full context of node '${primary.title}' (ID: ${primary.id}). Analyze its payload and suggest property updates or deeper relational links. Payload: ${JSON.stringify(primary.payload)}`;
    setAiQuery(query);
  };

  return (
    <div className="w-80 border-l border-white/10 glass-panel flex flex-col overflow-hidden z-[60] selection:bg-pink-500/30 shadow-[-40px_0_80px_rgba(255,126,179,0.05)] md:mr-4 md:my-4 md:rounded-[2.5rem] md:h-[calc(100vh-2rem)]">
      {/* Header */}
      <header className="p-8 border-b border-white/10 space-y-6 bg-white/[0.05] relative">
        <div className="absolute top-0 right-0 p-4">
          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse shadow-[0_0_10px_#ff7eb3]" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-glow italic text-pink-100">Inspector_Matrix</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-black text-pink-200/20 uppercase tracking-[0.2em]">Status: Calibration Stable</span>
              {primary.isAiGenerated && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-pink-500/10 border border-pink-500/20 rounded-md">
                   <Sparkles size={10} className="text-pink-400" />
                   <span className="text-[8px] font-black uppercase text-pink-400 tracking-widest">{primary.agentLabel || 'Agentic'}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
             <div className="px-3 py-1.5 bg-white/10 rounded-xl text-[9px] font-black uppercase text-pink-100/60 border border-white/10 shadow-inner">
               {selectedEntities.length} NODE{isMulti ? 'S' : ''}
             </div>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-black/20 rounded-2xl border border-white/10">
           {['props', 'meta', 'data'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={cn(
                 "flex-1 py-2 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all",
                 activeTab === tab ? "bg-white text-pink-600 shadow-2xl scale-[1.02]" : "text-pink-100/20 hover:text-pink-100/40"
               )}
             >
               {tab}
             </button>
           ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-10"
          >
            {activeTab === 'props' && (
              <>
                {/* Identity Section */}
                <section className="space-y-6">
                  <header className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-200/20 italic">Identity</h3>
                    <button 
                      onClick={handleEnrich}
                      className="flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest text-pink-400 hover:bg-pink-500/20 transition-all"
                    >
                      <Sparkles size={10} /> Enrich Context
                    </button>
                  </header>
                  <div className="space-y-4">
                    <Field label="Node Title">
                      <div className="relative group">
                        <input 
                          type="text" 
                          value={isMulti ? 'Multiple Selected' : primary.title}
                          disabled={isMulti}
                          onChange={(e) => updateEntity(primary.id, { title: e.target.value })}
                          className="w-full glass-input rounded-2xl px-4 py-3 text-xs font-black uppercase italic tracking-tight text-glow disabled:opacity-50 text-pink-50"
                        />
                        {!isMulti && (
                          <button 
                            onClick={() => handleAiHelp('title')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Sparkles size={12} />
                          </button>
                        )}
                      </div>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Node ID">
                        <div className="p-3 bg-pink-500/5 border border-pink-500/10 rounded-2xl text-[9px] font-mono text-pink-200/20 truncate">
                          {isMulti ? '-' : primary.id}
                        </div>
                      </Field>
                      <Field label="Node Type">
                        <div className="p-3 bg-pink-500/5 border border-pink-500/10 rounded-2xl text-[9px] font-black uppercase text-pink-300 italic">
                          {isMulti ? 'Mixed' : primary.type}
                        </div>
                      </Field>
                    </div>
                  </div>
                </section>

                {/* Transform Section */}
                <section className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-200/20 italic">Positioning</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <TransformInput label="X_AXIS" value={isMulti ? '-' : Math.round(primary.x)} onChange={(v) => !isMulti && updateEntity(primary.id, { x: parseInt(v) })} />
                    <TransformInput label="Y_AXIS" value={isMulti ? '-' : Math.round(primary.y)} onChange={(v) => !isMulti && updateEntity(primary.id, { y: parseInt(v) })} />
                    <TransformInput label="WIDTH" value={isMulti ? '-' : Math.round(primary.width)} onChange={(v) => !isMulti && updateEntity(primary.id, { width: parseInt(v) })} />
                    <TransformInput label="HEIGHT" value={isMulti ? '-' : Math.round(primary.height)} onChange={(v) => !isMulti && updateEntity(primary.id, { height: parseInt(v) })} />
                  </div>
                </section>

                {/* Layering Section */}
                <section className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-200/20 italic">Stacking</h3>
                  <div className="p-6 glass-panel rounded-3xl space-y-4 bg-black/20 border-white/10 ring-1 ring-pink-500/5">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <Layers size={14} className="text-pink-100/20" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-pink-100/60">Z_INDEX</span>
                       </div>
                       <span className="text-xs font-mono text-pink-400 text-glow">{isMulti ? '-' : primary.zIndex}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <Lock size={14} className="text-pink-100/20" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-pink-100/60">LOCKED</span>
                       </div>
                       <button 
                        onClick={() => selectedEntities.forEach(e => toggleEntityLock(e.id))}
                        className={cn(
                          "w-10 h-5 rounded-full relative transition-all",
                          primary.locked ? "bg-white shadow-[0_0_15px_white]" : "bg-white/5"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-3 h-3 rounded-full transition-all",
                          primary.locked ? "right-1 bg-pink-600" : "left-1 bg-pink-100/20"
                        )} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <Copy size={14} className="text-pink-100/20" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-pink-100/60">PINNED</span>
                       </div>
                       <button 
                        onClick={() => selectedEntities.forEach(e => updateEntity(e.id, { pinned: !e.pinned }))}
                        className={cn(
                          "w-10 h-5 rounded-full relative transition-all",
                          primary.pinned ? "bg-pink-500 shadow-[0_0_15px_rgba(255,126,179,0.5)]" : "bg-white/5"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-3 h-3 rounded-full transition-all",
                          primary.pinned ? "right-1 bg-white" : "left-1 bg-pink-100/20"
                        )} />
                      </button>
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeTab === 'meta' && (
              <section className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-200/20 italic">Metadata</h3>
                <div className="p-6 glass-panel rounded-3xl space-y-4 border-white/10">
                   <MetaItem label="Created" val={new Date(primary.createdAt).toLocaleDateString()} />
                   <MetaItem label="Updated" val={new Date(primary.updatedAt).toLocaleDateString()} />
                   <MetaItem label="Source Link" val="vault://asset_x98.pdf" />
                   <MetaItem label="Relational Nodes" val="4 active" />
                </div>
                <div className="p-6 bg-pink-500/5 border border-pink-500/10 rounded-[2.5rem] space-y-3">
                   <div className="flex items-center gap-2">
                     <Sparkles size={14} className="text-pink-400" />
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-pink-400">AI Intelligence</h4>
                   </div>
                   <p className="text-[10px] text-pink-400/40 font-bold uppercase tracking-widest leading-relaxed">
                     Analyzing node content... Potential collision detected with parallel Forge matrix.
                   </p>
                   <button 
                    onClick={() => handleAiHelp('metadata')}
                    className="w-full mt-2 py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                   >
                     Re-analyze Context
                   </button>
                </div>
              </section>
            )}

            {activeTab === 'data' && (
              <section className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-200/20 italic">Raw Structure</h3>
                <div className="p-6 glass-panel rounded-[2rem] bg-black/20 border-white/10 overflow-hidden">
                   <pre className="text-[9px] font-mono text-pink-100/40 leading-relaxed overflow-x-auto scrollbar-hide py-2">
                      {JSON.stringify(primary.payload || {}, null, 2)}
                   </pre>
                </div>
                <button 
                  onClick={() => handleAiHelp('payload')}
                  className="w-full py-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.2em] text-pink-100/40 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={12} /> Sync Relationship
                </button>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global Actions */}
      <footer className="p-8 border-t border-white/10 bg-white/[0.05] space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleDuplicate}
            className="flex items-center justify-center gap-3 p-4 glass-panel rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border-white/10 shadow-xl text-pink-100"
          >
            <Copy size={16} className="text-pink-100/20" /> Duplicate
          </button>
          <button 
            onClick={() => selectedEntities.forEach(e => removeEntity(e.id))}
            className="flex items-center justify-center gap-3 p-4 bg-red-500/10 rounded-2xl border border-red-500/20 hover:bg-red-500/20 transition-all text-[10px] font-black uppercase tracking-widest text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
          >
            <Trash2 size={16} /> Destroy
          </button>
        </div>
        
        <button 
          onClick={() => {
            if (isFocusedMode) {
              toggleFocusedMode(false);
            } else if (!isMulti) {
              useAppStore.getState().setZoom(1.2);
              useAppStore.getState().setPan({
                x: (window.innerWidth / 2) - primary.x * 1.2 - (primary.width * 1.2) / 2,
                y: (window.innerHeight / 2) - primary.y * 1.2 - (primary.height * 1.2) / 2
              });
              toggleFocusedMode(true);
            }
          }}
          className={cn(
            "w-full py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl",
            isFocusedMode 
              ? "bg-pink-600 text-white shadow-[0_0_40px_rgba(255,126,179,0.4)]" 
              : "bg-white text-pink-600 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          )}
        >
          {isFocusedMode ? <Maximize size={18} /> : <Sparkles size={18} />}
          {isFocusedMode ? 'EXIT_FOCUSED_STREAM' : 'FOCUS_NODE_STREAM'}
        </button>

        <p className="text-[8px] font-black text-pink-100/10 text-center uppercase tracking-widest leading-loose">
          Encrypted Data Stream Protocol v1.4.2<br/>
          Secure Node Manifest_302
        </p>
      </footer>
    </div>
  );
}

function Field({ label, children }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] uppercase font-black tracking-widest text-pink-100/10 px-2 italic">{label}</label>
      {children}
    </div>
  );
}

function TransformInput({ label, value, onChange }: { label: string, value: string | number, onChange: (val: string) => void }) {
  return (
    <div className="space-y-3 p-1">
      <label className="text-[9px] uppercase font-black text-pink-100/10 tracking-[0.2em]">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-[10px] font-mono text-pink-100/60 focus:bg-white/5 focus:border-pink-300/20 transition-all outline-none"
      />
    </div>
  );
}

function MetaItem({ label, val }: { label: string, val: string }) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-[9px] font-black uppercase tracking-widest text-pink-100/20">{label}</span>
       <span className="text-[9px] font-black tracking-widest text-pink-100/60">{val}</span>
    </div>
  );
}
