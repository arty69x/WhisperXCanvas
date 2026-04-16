import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Readiness({ activeModule }: { activeModule: string }) {
  if (activeModule !== 'readiness') return null;

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0a0a0a] p-8 space-y-12 scrollbar-hide">
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Readiness Inspector</h1>
        <p className="text-white/40 text-sm font-medium">Runtime Integrity & Coverage Evaluation</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ReadinessSection title="Route Readiness" status="Optimal">
            <ReadinessItem label="API Endpoints" status="pass" />
            <ReadinessItem label="Canvas Runtime" status="pass" />
            <ReadinessItem label="Persistence Layer" status="pass" />
          </ReadinessSection>

          <ReadinessSection title="Archive Integrity" status="Warning">
            <ReadinessItem label="Embedded Source Coverage" status="warning" desc="3 records missing summaries" />
            <ReadinessItem label="Relation Mapping" status="pass" />
            <ReadinessItem label="Normalization Pipeline" status="pass" />
          </ReadinessSection>

          <ReadinessSection title="AI Service Layer" status="Optimal">
            <ReadinessItem label="Model Connectivity" status="pass" />
            <ReadinessItem label="Context Window" status="pass" />
            <ReadinessItem label="Prompt Templates" status="pass" />
          </ReadinessSection>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-[#141414] border border-white/10 rounded-2xl space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Next Fixes</h3>
            <div className="space-y-3">
              <FixItem label="Generate summaries for legacy records" />
              <FixItem label="Verify Budget scenario Q4" />
              <FixItem label="Update Topology relations" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadinessSection({ title, status, children }: { title: string, status: string, children: React.ReactNode }) {
  return (
    <div className="p-8 bg-[#141414] border border-white/10 rounded-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">{title}</h3>
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded",
          status === 'Optimal' ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
        )}>{status}</span>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function ReadinessItem({ label, status, desc }: { label: string, status: 'pass' | 'warning' | 'fail', desc?: string }) {
  const Icon = status === 'pass' ? CheckCircle2 : status === 'warning' ? AlertCircle : Info;
  const color = status === 'pass' ? 'text-green-400' : status === 'warning' ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="flex items-start justify-between group">
      <div className="flex items-center gap-3">
        <Icon size={14} className={color} />
        <div>
          <p className="text-sm font-medium text-white/80">{label}</p>
          {desc && <p className="text-[10px] text-white/20 font-bold uppercase tracking-wider">{desc}</p>}
        </div>
      </div>
      <span className={cn("text-[10px] font-bold uppercase tracking-widest opacity-20 group-hover:opacity-100 transition-opacity", color)}>{status}</span>
    </div>
  );
}

function FixItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-colors cursor-pointer group">
      <ArrowRight size={12} className="text-white/20 group-hover:text-white" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{label}</span>
    </div>
  );
}
