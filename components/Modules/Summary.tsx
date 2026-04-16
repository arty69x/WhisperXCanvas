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
    <div className="w-full h-full overflow-y-auto bg-[#0a0a0a] p-8 space-y-12 scrollbar-hide">
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">System Summary</h1>
        <p className="text-white/40 text-sm font-medium">Actionable Insights & Data Intelligence</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Intelligence Feed */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Sparkles size={14} /> AI Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InsightCard 
                title="Archive Growth" 
                desc="Data ingestion has increased by 42% this week. Consider optimizing Forge blueprints for high-density assets."
                type="info"
              />
              <InsightCard 
                title="Readiness Alert" 
                desc="3 legacy records are missing embedded summaries. This may impact AI context retrieval accuracy."
                type="warning"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Content Distribution</h3>
            <div className="p-8 bg-[#141414] border border-white/10 rounded-2xl flex items-center justify-around">
               <DistributionItem label="Documents" value={45} color="bg-blue-400" />
               <DistributionItem label="Images" value={25} color="bg-purple-400" />
               <DistributionItem label="Code" value={15} color="bg-green-400" />
               <DistributionItem label="Other" value={15} color="bg-white/20" />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Actionable Next Steps</h3>
            <div className="space-y-2">
              <ActionItem label="Normalize 12 pending Vault assets" />
              <ActionItem label="Update Slide Deck: System Topology v2" />
              <ActionItem label="Review Budget discrepancies in Q3" />
            </div>
          </section>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-8">
          <div className="p-6 bg-[#141414] border border-white/10 rounded-2xl space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Archive Health</h3>
            <div className="flex items-center justify-center p-8 relative">
              <div className="w-32 h-32 rounded-full border-8 border-white/5 flex items-center justify-center">
                <span className="text-3xl font-black tracking-tighter">92</span>
              </div>
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="64" fill="none" stroke="white" strokeWidth="8" strokeDasharray="402" strokeDashoffset="32" strokeLinecap="round" className="opacity-20" />
              </svg>
            </div>
            <div className="space-y-3">
              <HealthStat label="Integrity" value="98%" />
              <HealthStat label="Coverage" value="84%" />
              <HealthStat label="Redundancy" value="12%" />
            </div>
          </div>

          <div className="p-6 bg-white text-black rounded-2xl space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40">System Recommendation</h3>
            <p className="text-sm font-bold leading-tight">Initiate Forge fusion for the &apos;legacy_docs&apos; collection to improve searchability.</p>
            <button className="w-full py-2 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">
              Execute Forge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, desc, type }: { title: string, desc: string, type: 'info' | 'warning' | 'success' }) {
  const Icon = type === 'warning' ? AlertCircle : type === 'success' ? CheckCircle2 : PieChart;
  const color = type === 'warning' ? 'text-yellow-400' : type === 'success' ? 'text-green-400' : 'text-blue-400';

  return (
    <div className="p-6 bg-[#141414] border border-white/10 rounded-2xl space-y-3">
      <div className={cn("flex items-center gap-2", color)}>
        <Icon size={14} />
        <span className="text-[10px] font-bold uppercase tracking-widest">{title}</span>
      </div>
      <p className="text-xs text-white/60 leading-relaxed">{desc}</p>
    </div>
  );
}

function DistributionItem({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className={cn("absolute inset-0 rounded-full opacity-20", color)} />
        <span className="text-xs font-black">{value}%</span>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">{label}</span>
    </div>
  );
}

function ActionItem({ label }: { label: string }) {
  return (
    <div className="group p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
      <span className="text-sm font-medium text-white/80">{label}</span>
      <ArrowRight size={14} className="text-white/20 group-hover:text-white transition-colors" />
    </div>
  );
}

function HealthStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</span>
      <span className="text-xs font-bold">{value}</span>
    </div>
  );
}
