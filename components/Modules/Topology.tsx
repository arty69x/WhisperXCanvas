import React from 'react';
import { Network, Search, Filter, Maximize2, Settings, Share2, Activity, Zap, Cpu, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';

const nodes = [
  { x: 50, y: 80, z: 200, name: 'Core Engine', type: 'service' },
  { x: 30, y: 50, z: 150, name: 'Vault', type: 'system' },
  { x: 70, y: 50, z: 150, name: 'Forge', type: 'system' },
  { x: 50, y: 30, z: 180, name: 'AI Layer', type: 'service' },
  { x: 20, y: 20, z: 100, name: 'Auth Node', type: 'node' },
  { x: 80, y: 20, z: 100, name: 'Storage Node', type: 'node' },
  { x: 50, y: 10, z: 80, name: 'Gateway', type: 'node' },
];

export default function Topology({ activeModule }: { activeModule: string }) {
  if (activeModule !== 'topology') return null;

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden selection:bg-pink-500/30">
      <header className="p-12 glass-panel border-white/5 bg-black/20 backdrop-blur-3xl relative z-10 m-6 rounded-[2.5rem]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-glow text-white/90">Topology_Matrix</h1>
            <p className="text-[10px] text-pink-300/40 font-black uppercase tracking-[0.2em]">System Relation & Architecture mapping • Node Readiness: 98.4%</p>
          </div>
          <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 p-1.5 glass-panel rounded-2xl border-white/5 bg-black/5">
                  <button className="px-6 py-2 text-[9px] font-black uppercase tracking-widest bg-white text-pink-600 rounded-xl shadow-lg">Matrix View</button>
                  <button className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-pink-100/20 hover:text-pink-100/40">3D Neural</button>
               </div>
               <div className="w-px h-8 bg-white/5 mx-2" />
               <button className="p-3.5 glass-button rounded-2xl text-pink-100/40 hover:text-pink-400 transition-all border-white/5"><Settings size={18} /></button>
               <button className="p-3.5 glass-button rounded-2xl text-pink-100/40 hover:text-pink-400 transition-all border-white/5"><Maximize2 size={18} /></button>
          </div>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden flex p-6 gap-6 pt-0">
        {/* Sidebar Info */}
        <div className="w-96 glass-panel border-white/5 bg-black/10 rounded-[3rem] p-10 space-y-10 overflow-y-auto scrollbar-hide">
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-100/20 px-2 italic">Node_Inspector</h3>
            <div className="p-8 glass-panel rounded-[2.5rem] space-y-8 bg-black/20 border-white/5 group hover:bg-pink-500/[0.03] transition-all">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-pink-500/10 rounded-[1.25rem] flex items-center justify-center text-pink-400 border border-pink-500/20 shadow-[0_0_20px_rgba(255,126,179,0.1)] group-hover:scale-110 transition-transform">
                  <Activity size={28} />
                </div>
                <div>
                  <h4 className="text-base font-black uppercase tracking-tight text-white/90">Core Engine</h4>
                  <p className="text-[10px] text-pink-400 font-black uppercase tracking-[0.2em] mt-1">Master Service Hub</p>
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-white/5">
                <NodeStat label="Status" val="Optimal" color="text-green-400" />
                <NodeStat label="Throughput" val="1.4 GB/s" />
                <NodeStat label="Latency" val="12.4ms" />
                <NodeStat label="Nodes Linked" val="14 Nodes" />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-100/20 px-2 italic">Traffic Flow Matrix</h3>
            <div className="space-y-6 px-1">
              <FlowItem label="Vault → Forge Matrix" load={84} />
              <FlowItem label="Forge → Archive Protocol" load={42} />
              <FlowItem label="AI → Neural Gateway" load={96} />
            </div>
          </section>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative glass-panel rounded-[3rem] border-white/10 bg-black/5 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #ff7eb3 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          </div>
          
          <div className="w-full h-full p-16">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis type="number" dataKey="x" hide />
                <YAxis type="number" dataKey="y" hide />
                <ZAxis type="number" dataKey="z" range={[1500, 4500]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '4 4', stroke: '#ff7eb3', opacity: 0.3 }} 
                  contentStyle={{ backgroundColor: 'rgba(15, 5, 10, 0.95)', border: '1px solid rgba(255, 126, 179, 0.2)', borderRadius: '24px', fontSize: '11px', color: '#fff', padding: '16px', backdropFilter: 'blur(10px)', fontWeight: 'bold' }}
                />
                <Scatter name="Nodes" data={nodes}>
                  {nodes.map((node, index) => (
                    <Cell 
                      key={index} 
                      fill={node.type === 'service' ? '#ec4899' : node.type === 'system' ? '#a855f7' : '#ff7eb3'} 
                      fillOpacity={0.2}
                      stroke={node.type === 'service' ? '#ec4899' : node.type === 'system' ? '#a855f7' : '#ff7eb3'}
                      strokeWidth={3}
                      className="cursor-pointer transition-all hover:fill-opacity-40"
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Node Labels Overlay */}
          <div className="absolute inset-0 pointer-events-none">
             {nodes.map(n => (
               <div key={n.name} className="absolute flex flex-col items-center gap-3 -translate-x-1/2 -translate-y-1/2" style={{ left: `${n.x}%`, top: `${100 - n.y}%` }}>
                 <div className="w-2.5 h-2.5 bg-pink-400 rounded-full shadow-[0_0_15px_#ec4899] animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-[0.25em] text-pink-50/60 glass-panel border-white/10 px-3 py-1.5 rounded-xl shadow-xl">{n.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NodeStat({ label, val, color }: any) {
  return (
    <div className="flex items-center justify-between group/stat">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-100/10 group-hover/stat:text-pink-100/30 transition-colors">{label}</span>
      <span className={cn("text-[11px] font-black uppercase tracking-tighter text-glow", color || "text-white/60")}>{val}</span>
    </div>
  );
}

function FlowItem({ label, load }: { label: string, load: number }) {
  return (
    <div className="space-y-3 group/flow p-1">
      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em]">
        <span className="text-pink-100/30 group-hover/flow:text-pink-100/60 transition-colors italic">{label}</span>
        <span className="text-pink-400 text-glow">{load}% Network Load</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div className="h-full bg-pink-500 shadow-[0_0_15px_#ff7eb3] transition-all duration-1000" style={{ width: `${load}%` }} />
      </div>
    </div>
  );
}
