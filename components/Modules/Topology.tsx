import React from 'react';
import { Network, Search, Filter, Maximize2, Settings, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Topology({ activeModule }: { activeModule: string }) {
  if (activeModule !== 'topology') return null;

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0a]">
      <header className="p-8 border-b border-white/10 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Topology</h1>
          <p className="text-xs text-white/40 font-bold uppercase tracking-wider">System Relation & Architecture Map</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"><Search size={16} /></button>
          <button className="p-2 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"><Filter size={16} /></button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button className="p-2 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"><Share2 size={16} /></button>
          <button className="p-2 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"><Maximize2 size={16} /></button>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden bg-[#0f0f0f]">
        {/* Mock Topology Canvas */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[600px] h-[400px]">
            {/* Nodes */}
            <TopologyNode x={300} y={50} label="Core Engine" active />
            <TopologyNode x={100} y={200} label="Vault" />
            <TopologyNode x={300} y={200} label="Archive" />
            <TopologyNode x={500} y={200} label="Forge" />
            <TopologyNode x={300} y={350} label="AI Service" />
            
            {/* Edges (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <line x1="300" y1="70" x2="100" y2="200" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
              <line x1="300" y1="70" x2="300" y2="200" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
              <line x1="300" y1="70" x2="500" y2="200" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
              <line x1="100" y1="200" x2="300" y2="200" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
              <line x1="300" y1="200" x2="500" y2="200" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
              <line x1="300" y1="200" x2="300" y2="350" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-8 left-8 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Legend</h4>
          <div className="space-y-2">
            <LegendItem label="Active Service" color="bg-white" />
            <LegendItem label="Relation" color="bg-white/20" />
            <LegendItem label="Dependency" color="bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TopologyNode({ x, y, label, active }: { x: number, y: number, label: string, active?: boolean }) {
  return (
    <div 
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer hover:scale-110",
        active ? "bg-white text-black border-white" : "bg-[#141414] border-white/10 text-white hover:border-white/30"
      )}
      style={{ left: x, top: y }}
    >
      <Network size={16} />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </div>
  );
}

function LegendItem({ label, color }: { label: string, color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", color)} />
      <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">{label}</span>
    </div>
  );
}
