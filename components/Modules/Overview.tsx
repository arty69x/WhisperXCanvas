import React from 'react';
import { 
  Activity, 
  Database, 
  Zap, 
  Clock, 
  Shield, 
  FileSearch,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

  const data = [
  { name: '00:00', val: 400 },
  { name: '04:00', val: 300 },
  { name: '08:00', val: 600 },
  { name: '12:00', val: 800 },
  { name: '16:00', val: 500 },
  { name: '20:00', val: 900 },
  { name: '23:59', val: 700 },
];

export default function Overview({ activeModule }: { activeModule: string }) {
  if (activeModule !== 'overview') return null;

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent p-12 space-y-16 scrollbar-hide relative selection:bg-pink-500/30">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-pink-600/5 blur-[160px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <header className="space-y-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-[0.3em] text-pink-300/40">
            Node Active
          </div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_10px_#ff7eb3]" />
        </div>
        <h1 className="text-6xl font-black tracking-tighter uppercase italic text-glow leading-none text-white/90">WhisperXWorkspace<br/>Overview</h1>
        <p className="max-w-md text-pink-100/30 text-xs font-medium leading-relaxed uppercase tracking-widest">
          High-performance ingestion and logic matrix. Visualizing real-time node readiness and vault throughput.
        </p>
      </header>

      {/* Grid: Stats & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        <div className="lg:col-span-1 space-y-6">
          <StatCard icon={Activity} label="Core Flow" value="Optimal" color="text-pink-400" />
          <StatCard icon={Database} label="Vault Load" value="1.2 TB" color="text-purple-400" />
          <StatCard icon={Cpu} label="Agent Logic" value="Engaged" color="text-pink-300" />
        </div>
        
        <div className="lg:col-span-3 p-8 glass-panel rounded-[3rem] flex flex-col min-h-[400px] border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-pink-100/60">Logic Throughput</h3>
              <p className="text-[10px] text-pink-100/20 uppercase font-black tracking-[0.2em]">Operations / Second (Real-time)</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-pink-100/40">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pink-500 rounded-full" /> Inbound</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Processed</span>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[250px] -ml-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff7eb3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff7eb3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 5, 10, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', color: '#fff', backdropFilter: 'blur(10px)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="val" 
                  stroke="#ff7eb3" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Signals & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <PanelSection title="Readiness Signals" className="lg:col-span-1">
           <SignalItem label="Gemini AI Engine" status="online" />
           <SignalItem label="Vector Search Node" status="online" />
           <SignalItem label="Canvas Persistence" status="online" />
           <SignalItem label="Agent Orchestrator" status="online" />
           <SignalItem label="Forge Runtime" status="online" />
           <SignalItem label="Storage Hub" status="warning" />
           <div className="pt-6">
             <button className="w-full py-4 glass-button text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-glow">
                System Diagnostics
             </button>
           </div>
        </PanelSection>

        <PanelSection title="Mission Event Log" className="lg:col-span-2">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/5 transition-all cursor-pointer group glass-card border-none">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-pink-500/5 rounded-2xl flex items-center justify-center text-pink-300/20 group-hover:text-pink-400 group-hover:scale-110 transition-all border border-pink-500/10">
                    <FileSearch size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-pink-50/80">Asset_Block_0x8{i}.obj</h4>
                    <p className="text-[9px] text-pink-100/20 uppercase font-black tracking-widest mt-1">Ingested via Forge Matrix • 03:22 PM</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-pink-500/10 rounded-full border border-pink-500/20 text-pink-400 text-[8px] font-black uppercase tracking-widest text-glow">
                  Verified
                </div>
              </div>
            ))}
          </div>
        </PanelSection>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="p-8 glass-card rounded-[2.5rem] space-y-6 group relative overflow-hidden border-none">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={80} />
      </div>
      <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110 shadow-xl border border-white/10", color)}>
        <Icon size={24} />
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-100/20">{label}</p>
        <p className="text-3xl font-black tracking-tighter text-glow text-white/90">{value}</p>
      </div>
    </div>
  );
}

function PanelSection({ title, children, className }: any) {
  return (
    <div className={cn("space-y-6", className)}>
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-100/10 px-2">{title}</h3>
      <div className="p-8 glass-panel rounded-[3rem] space-y-6 border-white/10">
        {children}
      </div>
    </div>
  );
}

function SignalItem({ label, status }: { label: string, status: 'online' | 'offline' | 'warning' }) {
  return (
    <div className="flex items-center justify-between p-1">
      <span className="text-xs font-black uppercase tracking-tighter text-pink-100/40">{label}</span>
      <div className="flex items-center gap-3">
        <span className={cn(
          "text-[9px] font-black uppercase tracking-widest",
          status === 'online' ? "text-pink-500/40" : status === 'warning' ? "text-yellow-500/40" : "text-red-500/40"
        )}>{status}</span>
        <div className={cn(
          "w-2 h-2 rounded-full",
          status === 'online' ? "bg-pink-500 shadow-[0_0_12px_rgba(255,126,179,0.6)]" : 
          status === 'warning' ? "bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.6)]" : 
          "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]"
        )} />
      </div>
    </div>
  );
}
