import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  PieChart, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { getArchiveRecords, EmbeddedRecord } from '@/lib/archive';
import { cn } from '@/lib/utils';

export default function Summary({ activeModule }: { activeModule: string }) {
  const [records, setRecords] = useState<EmbeddedRecord[]>(() => getArchiveRecords());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecords(getArchiveRecords());
  }, [activeModule]);

  if (activeModule !== 'summary') return null;

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent p-12 space-y-16 scrollbar-hide relative selection:bg-pink-500/30">
      <header className="space-y-4 relative z-10">
        <h1 className="text-6xl font-black tracking-tighter uppercase italic text-glow text-white/90 leading-none">Intelligence<br/>Convergence</h1>
        <p className="max-w-md text-pink-100/30 text-xs font-medium leading-relaxed uppercase tracking-widest">
          Actionable Insights & Data Intelligence Matrix. Synchronized real-time analytics.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        {/* Intelligence Feed */}
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-100/20 px-2 flex items-center gap-3">
              <Sparkles size={14} className="text-pink-400" /> AI Insights Protocol
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InsightCard 
                title="Archive Growth" 
                desc="Data ingestion has increased by 42% this week. Consider optimizing Forge blueprints for high-density assets."
                type="info"
              />
              <InsightCard 
                title="Readiness Status" 
                desc="3 legacy records are missing embedded summaries. This may impact AI context retrieval accuracy."
                type="warning"
              />
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-100/20 px-2">Content Matrix Distribution</h3>
            <div className="p-10 glass-panel rounded-[3rem] border-white/10 flex items-center justify-around bg-white/[0.02]">
               <DistributionItem label="Documents" value={45} color="bg-pink-500" />
               <DistributionItem label="Visuals" value={25} color="bg-purple-500" />
               <DistributionItem label="Logic" value={15} color="bg-pink-300" />
               <DistributionItem label="Legacy" value={15} color="bg-white/10" />
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-100/20 px-2">Actionable Directives</h3>
            <div className="space-y-3">
              <ActionItem label="Normalize 12 pending Vault assets" />
              <ActionItem label="Update Slide Deck: System Topology v2" />
              <ActionItem label="Review Budget discrepancies in Q3" />
            </div>
          </section>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-8">
          <div className="p-8 glass-panel rounded-[3rem] border-white/10 space-y-8 bg-black/10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-100/30">Archive Health Node</h3>
            <div className="flex items-center justify-center p-8 relative">
              <div className="w-40 h-40 rounded-full border-[10px] border-white/5 flex items-center justify-center relative">
                <span className="text-5xl font-black tracking-tighter text-glow text-white/90">92</span>
                <div className="absolute -bottom-2 px-3 py-1 bg-pink-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-[0_0_15px_#ff7eb3]">Stable</div>
              </div>
              <svg className="absolute inset-0 w-full h-full -rotate-90 scale-110">
                <circle cx="50%" cy="50%" r="76" fill="none" stroke="#ff7eb3" strokeWidth="10" strokeDasharray="477" strokeDashoffset="38" strokeLinecap="round" className="opacity-20" />
              </svg>
            </div>
            <div className="space-y-4 px-2">
              <HealthStat label="Integrity" value="98%" />
              <HealthStat label="Coverage" value="84%" />
              <HealthStat label="Reliability" value="96%" />
            </div>
          </div>

          <div className="p-8 glass-card rounded-[2.5rem] border-white/10 space-y-5 bg-white shadow-[0_0_50px_rgba(255,255,255,0.1)]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-600/40">System Recommendation</h3>
            <p className="text-sm font-black leading-tight text-gray-900 uppercase tracking-tight">Initiate Forge fusion for the &apos;legacy_docs&apos; collection to improve searchability index.</p>
            <button className="w-full py-4 bg-pink-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(219,39,119,0.4)] active:scale-95 transition-all">
              Execute Forge Matrix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, desc, type }: { title: string, desc: string, type: 'info' | 'warning' | 'success' }) {
  const Icon = type === 'warning' ? AlertCircle : type === 'success' ? CheckCircle2 : PieChart;
  const color = type === 'warning' ? 'text-yellow-400' : type === 'success' ? 'text-green-400' : 'text-pink-400';

  return (
    <div className="p-8 glass-card rounded-[2.5rem] space-y-4 border-none transition-all hover:translate-y-[-4px]">
      <div className={cn("flex items-center gap-3", color)}>
        <Icon size={18} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{title}</span>
      </div>
      <p className="text-xs text-pink-100/40 leading-relaxed font-bold uppercase tracking-widest">{desc}</p>
    </div>
  );
}

function DistributionItem({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="flex flex-col items-center gap-4 group">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className={cn("absolute inset-0 rounded-full opacity-5 group-hover:opacity-10 transition-opacity", color)} />
        <div className={cn("absolute inset-4 rounded-full border-2 border-dashed opacity-10 blur-[1px]", color.replace('bg-', 'border-'))} />
        <span className="text-lg font-black text-glow text-white/90">{value}%</span>
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-pink-100/20 group-hover:text-pink-100/50 transition-colors">{label}</span>
    </div>
  );
}

function ActionItem({ label }: { label: string }) {
  return (
    <div className="group p-6 glass-card rounded-2xl flex items-center justify-between border-none hover:translate-x-2 transition-all cursor-pointer">
      <span className="text-sm font-black uppercase tracking-tight text-white/70 group-hover:text-white transition-colors">{label}</span>
      <div className="w-10 h-10 rounded-xl bg-pink-500/5 flex items-center justify-center text-pink-300/20 group-hover:text-pink-400 group-hover:bg-pink-500/10 transition-all border border-pink-500/10">
        <ArrowRight size={16} />
      </div>
    </div>
  );
}

function HealthStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-1">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-100/20">{label}</span>
      <span className="text-xs font-black text-glow text-white/70">{value}</span>
    </div>
  );
}
