import React from 'react';
import { CanvasEntity } from '@/types/canvas';
import { cn } from '@/lib/utils';
import { 
  Info, 
  Settings, 
  Link2, 
  Layers, 
  Sparkles, 
  Zap, 
  Wand2, 
  RefreshCw,
  Cpu,
  Workflow,
  BarChart3,
  X
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'motion/react';

export default function Inspector({ 
  selectedEntities, 
  onUpdate 
}: { 
  selectedEntities: CanvasEntity[],
  onUpdate: (id: string, updates: Partial<CanvasEntity>) => void
}) {
  const { setAiQuery, orchestrateEntities, links, entities, removeLink } = useAppStore();

  if (selectedEntities.length === 0) return (
    <div className="w-80 border-l border-white/10 glass-panel flex flex-col items-center justify-center p-12 text-center">
        <Cpu size={32} className="text-pink-500/20 mb-4 animate-pulse" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-100/20">Awaiting Signal...</h3>
        <p className="text-[9px] font-black uppercase tracking-widest text-pink-100/10 mt-2 italic leading-relaxed">Select a node from the WhisperX Matrix to begin inspection</p>
    </div>
  );

  const isMulti = selectedEntities.length > 1;
  const entity = selectedEntities[0];

  const handleAiHelp = (field?: string) => {
    const context = field 
        ? `Help me understand more about the '${field}' property of '${entity.title}' (${entity.type}).`
        : `Provide context and technical insights for the following entity: ${entity.title}. Its type is ${entity.type}. Suggest possible interactions.`;
    setAiQuery(context);
  };

  const handleOrchestrate = () => {
    orchestrateEntities(selectedEntities.map(e => e.id));
  };

  const handleEnrich = () => {
    setAiQuery(`Analyze and enrich the payload of entity [${entity.id}] titled "${entity.title}". Expand its internal data structure based on its type: ${entity.type}.`);
  };

  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 border-l border-white/10 glass-panel flex flex-col z-20 shadow-[-20px_0_60px_rgba(255,126,179,0.05)] relative"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-transparent shadow-[0_4px_20px_#ff7eb3/20]" />
      
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
        <div className="flex items-center gap-3">
          <Settings size={14} className="text-pink-400" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-glow">Inspector_Core</h3>
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full text-pink-300">
            {selectedEntities.length} NODES
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        {/* Multi-Select Orchestration */}
        {isMulti && (
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card bg-gradient-to-tr from-pink-600/10 to-purple-600/10 border-pink-400/20 p-5 rounded-3xl"
            >
                <div className="flex items-center gap-3 mb-4">
                    <Workflow size={14} className="text-pink-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-50">Spatial Orchestration</span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-pink-100/40 leading-normal mb-4">
                    Multiple nodes detected. Initiate agentic workflow synthesis?
                </p>
                <button 
                    onClick={handleOrchestrate}
                    className="w-full glass-button py-3 rounded-xl flex items-center justify-center gap-3 group bg-white/5"
                >
                    <Sparkles size={14} className="text-pink-300 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Orchestrate Matrix</span>
                </button>
            </motion.div>
        )}

        {/* Info Section */}
        {!isMulti && (
            <>
                <section className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-pink-100/20">
                            <Info size={12} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Node Blueprints</span>
                        </div>
                        <button onClick={() => handleAiHelp()} className="p-2 hover:bg-pink-500/10 rounded-lg group transition-all" title="Request AI Context">
                            <Sparkles size={12} className="text-pink-300/40 group-hover:text-pink-400 transition-colors" />
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2 relative group">
                            <label className="text-[9px] uppercase font-black tracking-widest text-pink-100/20 px-1">Identity_Title</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={entity.title}
                                    onChange={(e) => onUpdate(entity.id, { title: e.target.value })}
                                    className="flex-1 glass-input rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest focus:ring-1 ring-pink-500/30 transition-all border-white/5"
                                />
                                <button onClick={() => handleAiHelp('title')} className="glass-button px-3 rounded-xl opacity-0 group-hover:opacity-100 hover:text-pink-300">
                                    <Zap size={10} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] uppercase font-black tracking-widest text-pink-100/20 px-1">Architecture_Type</label>
                            <div className="px-4 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-[10px] text-pink-300/60 font-black uppercase tracking-[0.2em] italic">
                                {entity.type}
                            </div>
                        </div>

                        {entity.isAiGenerated && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-pink-500/5 border border-pink-500/10 rounded-xl">
                                <Wand2 size={12} className="text-pink-400" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-pink-300">Synthetic Node</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{entity.agentLabel || 'Unknown_Agent'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Spatial Section */}
                <section className="space-y-5 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-pink-100/20">
                        <Layers size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Dimension_Metrics</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[8px] uppercase font-black tracking-tighter text-pink-100/10 ml-1">Pos_X</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={Math.round(entity.x)}
                                    onChange={(e) => onUpdate(entity.id, { x: parseInt(e.target.value) })}
                                    className="w-full glass-input rounded-xl px-4 py-3 text-xs font-black font-mono border-white/5 hover:border-pink-500/20 transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[8px] uppercase font-black tracking-tighter text-pink-100/10 ml-1">Pos_Y</label>
                            <input 
                                type="number" 
                                value={Math.round(entity.y)}
                                onChange={(e) => onUpdate(entity.id, { y: parseInt(e.target.value) })}
                                className="w-full glass-input rounded-xl px-4 py-3 text-xs font-black font-mono border-white/5"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[8px] uppercase font-black tracking-tighter text-pink-100/10 ml-1">Dim_W</label>
                            <input 
                                type="number" 
                                value={Math.round(entity.width)}
                                onChange={(e) => onUpdate(entity.id, { width: Math.max(100, parseInt(e.target.value)) })}
                                className="w-full glass-input rounded-xl px-4 py-3 text-xs font-black font-mono border-white/5"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[8px] uppercase font-black tracking-tighter text-pink-100/10 ml-1">Dim_H</label>
                            <input 
                                type="number" 
                                value={Math.round(entity.height)}
                                onChange={(e) => onUpdate(entity.id, { height: Math.max(100, parseInt(e.target.value)) })}
                                className="w-full glass-input rounded-xl px-4 py-3 text-xs font-black font-mono border-white/5"
                            />
                        </div>
                    </div>
                </section>

                {/* Relations Section */}
                <section className="space-y-5 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-2 text-pink-100/20">
                        <Link2 size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active_Connections</span>
                    </div>
                    <div className="space-y-3">
                        {links.filter(l => l.sourceId === entity.id || l.targetId === entity.id).length === 0 ? (
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-pink-100/5 px-2">No active flows detected</p>
                        ) : (
                            links.filter(l => l.sourceId === entity.id || l.targetId === entity.id).map(link => {
                                const otherId = link.sourceId === entity.id ? link.targetId : link.sourceId;
                                const otherEntity = entities.find(e => e.id === otherId);
                                return (
                                    <div key={link.id} className="group/link flex items-center justify-between p-3 glass-card bg-white/[0.02] border-white/5 rounded-xl hover:bg-white/5 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_10px_#ff7eb3] animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-pink-100/40 truncate max-w-[120px]">{otherEntity?.title || 'Unknown Node'}</span>
                                        </div>
                                        <button 
                                            onClick={() => removeLink(link.id)}
                                            className="p-1 hover:bg-red-500/10 rounded text-red-400 opacity-0 group-hover/link:opacity-100 transition-all"
                                            title="Sever Link"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Operations Section */}
                <section className="space-y-5 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-2 text-pink-100/20">
                        <Cpu size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Cognitive_Action</span>
                    </div>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={handleEnrich}
                            className="w-full glass-button py-4 rounded-xl flex items-center justify-center gap-3 hover:text-pink-300 group"
                        >
                            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Enrich Payload</span>
                        </button>
                        
                        {(entity.type === 'budget-panel' || entity.type === 'forge-result') && (
                            <button 
                                onClick={() => setAiQuery(`Generate a high-fidelity data visualization for the node [${entity.id}] titled "${entity.title}". Based on its type (${entity.type}), create a new comparative analysis chart or summary node on the canvas.`)}
                                className="w-full glass-button py-4 rounded-xl flex items-center justify-center gap-3 hover:text-pink-300 group bg-pink-500/5 border-pink-500/20"
                            >
                                <BarChart3 size={14} className="text-pink-400 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-pink-300">Generate Visualization</span>
                            </button>
                        )}
                        
                        <button 
                            className="w-full glass-button py-4 rounded-xl flex items-center justify-center gap-3 opacity-30 hover:opacity-100 transition-opacity"
                        >
                            <Workflow size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Trace Relations</span>
                        </button>
                    </div>
                </section>
            </>
        )}
      </div>

      <div className="p-6 bg-white/[0.02] border-t border-white/10 space-y-4">
        <button 
          onClick={() => onUpdate(entity.id, { locked: !entity.locked })}
          className={cn(
            "w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden group",
            entity.locked ? "bg-red-500/10 text-red-300 border border-red-500/20" : "glass-button text-pink-100/40"
          )}
        >
          <div className="absolute inset-0 bg-red-400/5 translate-y-full group-hover:translate-y-0 transition-transform" />
          <span className="relative z-10">{entity.locked ? 'Unlock Module' : 'Lock Module'}</span>
        </button>
      </div>
    </motion.div>
  );
}
