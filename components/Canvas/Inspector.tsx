import React from 'react';
import { CanvasEntity } from '@/types/canvas';
import { cn } from '@/lib/utils';
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
  Layers
} from 'lucide-react';

interface InspectorProps {
  selectedEntities: CanvasEntity[];
  onUpdate: (id: string, updates: Partial<CanvasEntity>) => void;
  onRemove: (id: string) => void;
}

export default function Inspector({ selectedEntities, onUpdate, onRemove }: InspectorProps) {
  if (selectedEntities.length === 0) {
    return (
      <div className="w-80 border-l border-white/10 bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
          <Settings size={24} />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">No Selection</p>
          <p className="text-[10px] text-white/20 uppercase font-bold tracking-wider">Select an entity to inspect</p>
        </div>
      </div>
    );
  }

  const isMulti = selectedEntities.length > 1;
  const primary = selectedEntities[0];

  return (
    <div className="w-80 border-l border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden">
      <header className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-2">
          <Settings size={14} className="text-white/40" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest">Inspector</h3>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-white/10 rounded text-white/60">
          {selectedEntities.length} {isMulti ? 'Entities' : 'Entity'}
        </span>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        {/* Identity Section */}
        {!isMulti && (
          <section className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/20">Identity</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-white/40">Title</label>
                <input 
                  type="text" 
                  value={primary.title}
                  onChange={(e) => onUpdate(primary.id, { title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-white/40">Type</label>
                  <div className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-bold uppercase text-white/40">
                    {primary.type}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-white/40">ID</label>
                  <div className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-white/20 truncate">
                    {primary.id}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Transform Section */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/20">Transform</h4>
          <div className="grid grid-cols-2 gap-4">
            <TransformInput 
              label="X" 
              value={isMulti ? '-' : Math.round(primary.x)} 
              onChange={(val) => !isMulti && onUpdate(primary.id, { x: parseInt(val) })}
            />
            <TransformInput 
              label="Y" 
              value={isMulti ? '-' : Math.round(primary.y)} 
              onChange={(val) => !isMulti && onUpdate(primary.id, { y: parseInt(val) })}
            />
            <TransformInput 
              label="Width" 
              value={isMulti ? '-' : Math.round(primary.width)} 
              onChange={(val) => !isMulti && onUpdate(primary.id, { width: parseInt(val) })}
            />
            <TransformInput 
              label="Height" 
              value={isMulti ? '-' : Math.round(primary.height)} 
              onChange={(val) => !isMulti && onUpdate(primary.id, { height: parseInt(val) })}
            />
          </div>
        </section>

        {/* Appearance Section */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/20">Appearance</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <Lock size={12} className="text-white/40" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Locked</span>
              </div>
              <button 
                onClick={() => selectedEntities.forEach(e => onUpdate(e.id, { locked: !e.locked }))}
                className={cn(
                  "w-8 h-4 rounded-full relative transition-colors",
                  primary.locked ? "bg-white" : "bg-white/10"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-2 h-2 rounded-full transition-all",
                  primary.locked ? "right-1 bg-black" : "left-1 bg-white/20"
                )} />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <Layers size={12} className="text-white/40" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Z-Index</span>
              </div>
              <span className="text-[10px] font-mono text-white/40">{isMulti ? '-' : primary.zIndex}</span>
            </div>
          </div>
        </section>

        {/* Actions Section */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/20">Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors text-[10px] font-bold uppercase tracking-widest">
              <Copy size={12} /> Duplicate
            </button>
            <button 
              onClick={() => selectedEntities.forEach(e => onRemove(e.id))}
              className="flex items-center justify-center gap-2 p-3 bg-red-500/10 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-colors text-[10px] font-bold uppercase tracking-widest text-red-400"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </section>
      </div>

      <footer className="p-4 border-t border-white/10 bg-black/40">
        <button className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-colors">
          Export Selection
        </button>
      </footer>
    </div>
  );
}

function TransformInput({ label, value, onChange }: { label: string, value: string | number, onChange: (val: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] uppercase font-bold text-white/40">{label}</label>
      <div className="relative">
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>
    </div>
  );
}
