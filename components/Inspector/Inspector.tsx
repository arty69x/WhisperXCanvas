import React from 'react';
import { CanvasEntity } from '@/types/canvas';
import { cn } from '@/lib/utils';
import { Info, Settings, Link2, Layers, X } from 'lucide-react';

export default function Inspector({ 
  selectedEntities, 
  onUpdate 
}: { 
  selectedEntities: CanvasEntity[],
  onUpdate: (id: string, updates: Partial<CanvasEntity>) => void
}) {
  if (selectedEntities.length === 0) return null;

  const entity = selectedEntities[0]; // Inspect first selected for now

  return (
    <div className="w-80 border-l border-white/10 bg-[#141414] flex flex-col z-20 shadow-2xl">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Settings size={14} className="text-white/40" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest">Inspector</h3>
        </div>
        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60">{selectedEntities.length} selected</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        {/* Metadata Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white/40">
            <Info size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Metadata</span>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-white/20">Title</label>
              <input 
                type="text" 
                value={entity.title}
                onChange={(e) => onUpdate(entity.id, { title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-white/20">Type</label>
              <div className="px-3 py-2 bg-white/5 border border-white/10 rounded text-[10px] text-white/40 font-mono uppercase">
                {entity.type}
              </div>
            </div>
          </div>
        </section>

        {/* Layout Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white/40">
            <Layers size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Layout</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-white/20">X</label>
              <input 
                type="number" 
                value={Math.round(entity.x)}
                onChange={(e) => onUpdate(entity.id, { x: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-white/20">Y</label>
              <input 
                type="number" 
                value={Math.round(entity.y)}
                onChange={(e) => onUpdate(entity.id, { y: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-white/20">Width</label>
              <input 
                type="number" 
                value={Math.round(entity.width)}
                onChange={(e) => onUpdate(entity.id, { width: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-white/20">Height</label>
              <input 
                type="number" 
                value={Math.round(entity.height)}
                onChange={(e) => onUpdate(entity.id, { height: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-white/30"
              />
            </div>
          </div>
        </section>

        {/* Relations Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white/40">
            <Link2 size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Relations</span>
          </div>
          
          <div className="p-4 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center gap-2 opacity-40">
            <Link2 size={16} />
            <span className="text-[9px] uppercase font-bold">No active links</span>
          </div>
        </section>
      </div>

      <div className="p-4 border-t border-white/10 bg-black/20">
        <button 
          onClick={() => onUpdate(entity.id, { locked: !entity.locked })}
          className={cn(
            "w-full py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-colors",
            entity.locked ? "bg-red-500/20 text-red-400" : "bg-white/5 text-white/40 hover:bg-white/10"
          )}
        >
          {entity.locked ? 'Unlock Entity' : 'Lock Entity'}
        </button>
      </div>
    </div>
  );
}
