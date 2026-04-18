import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, Info, ArrowRight, Activity, Zap, Shield, Cpu, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Readiness({ activeModule }: { activeModule: string }) {
  const [scanning, setScanning] = useState(false);
  
  if (activeModule !== 'readiness') return null;

  const startScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 3000);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-transparent p-12 space-y-16 scrollbar-hide relative selection:bg-pink-500/30">
      <div className="absolute top-0 right-1/4 w-1/3 h-1/3 bg-pink-600/5 blur-[160px] rounded-full pointer-events-none" />
      
      <header className="flex items-center justify-between relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-4 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-pink-300">
                Security Core Matrix
             </div>
             <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse shadow-[0_0_15px_#ff7eb3]" />
          </div>
          <h1 className="text-7xl font-black tracking-tighter uppercase italic text-glow leading-none text-white/90">System_Readiness</h1>
          <p className="max-w-md text-pink-100/30 text-xs font-medium leading-relaxed uppercase tracking-widest">
            Runtime integrity verification and real-time coverage evaluation. Scanning for node entropy and logical gaps in the neural link.
          </p>
        </div>
        <button 
          onClick={startScan}
          disabled={scanning}
          className="w-24 h-24 bg-white text-pink-600 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-transparent" />
          <Zap size={36} className={cn("transition-all relative z-10", scanning && "animate-spin")} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        <div className="lg:col-span-2 space-y-12">
          <ReadinessSection title="Protocol Integrity" status="Optimal">
            <ReadinessItem label="Core API Mesh" status="pass" val="99.9%" />
            <ReadinessItem label="Canvas Persistence Layer" status="pass" val="Active" />
            <ReadinessItem label="Encryption Matrix" status="pass" val="AES-256-HQ" />
            <ReadinessItem label="Auth Handshake Node" status="pass" val="Verified" />
          </ReadinessSection>

          <ReadinessSection title="Data Coverage / Entropy" status="Warning">
            <ReadinessItem label="Vault Normalization" status="pass" val="Optimal" />
            <ReadinessItem label="Archive Source Sync" status="warning" val="3 Gaps" desc="Manual reconciliation required for sector_04 legacy nodes" />
            <ReadinessItem label="Relation Graph Integrity" status="pass" val="Solid" />
          </ReadinessSection>

          <ReadinessSection title="Neural Layer Hub" status="Optimal">
            <ReadinessItem label="Gemini Connectivity" status="pass" val="Active" />
            <ReadinessItem label="Context Buffer Index" status="pass" val="32K OK" />
            <ReadinessItem label="Pattern Recognition" status="pass" val="Deep_Enabled" />
          </ReadinessSection>
        </div>

        <div className="space-y-12">
          <PanelSection title="Action Priority Hub">
             <div className="space-y-4">
                <FixItem label="Reconcile Sector_04 Archive" priority="High" />
                <FixItem label="Optimize Canvas Overlay Buffer" priority="Medium" />
                <FixItem label="Rotate Secret Matrix Keys" priority="Low" />
             </div>
          </PanelSection>

          <PanelSection title="Diagnostic Node Metrics">
             <div className="grid grid-cols-2 gap-4">
                <MetricBox label="Uptime" val="14d 2h" />
                <MetricBox label="Threats" val="0" />
                <MetricBox label="Active Nodes" val="24" />
                <MetricBox label="Link Sync" val="98%" />
             </div>
          </PanelSection>
        </div>
      </div>
      
      {/* Scanning Overlay */}
      <AnimatePresence>
        {scanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0a050a]/80 backdrop-blur-3xl flex flex-col items-center justify-center gap-12 pointer-events-none"
          >
            <div className="relative">
              <div className="w-48 h-48 border-[6px] border-pink-500/10 border-t-pink-500 rounded-full animate-spin shadow-[0_0_100px_rgba(255,126,179,0.3)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Zap size={64} className="text-pink-400 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-glow animate-pulse text-white/90">Scanning Runtime Protocol...</h2>
              <p className="text-[12px] text-pink-300/40 font-black uppercase tracking-[0.4em]">Mapping logical dependencies • indexing node readiness</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReadinessSection({ title, status, children }: { title: string, status: string, children: React.ReactNode }) {
  return (
    <div className="p-12 glass-panel rounded-[3.5rem] space-y-10 relative overflow-hidden group hover:bg-white/[0.03] transition-all bg-black/10">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-100/20 italic">{title}</h3>
        <span className={cn(
          "text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl border transition-all",
          status === 'Optimal' ? "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
        )}>{status}</span>
      </div>
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );
}

function ReadinessItem({ label, status, val, desc }: { label: string, status: 'pass' | 'warning' | 'fail', val?: string, desc?: string }) {
  const Icon = status === 'pass' ? CheckCircle2 : status === 'warning' ? AlertCircle : Info;
  const color = status === 'pass' ? 'text-green-400' : status === 'warning' ? 'text-yellow-400' : 'text-pink-400';

  return (
    <div className="flex items-start justify-between group/item">
      <div className="flex items-start gap-6">
        <div className={cn("w-12 h-12 rounded-2xl bg-pink-500/5 border border-pink-500/10 flex items-center justify-center transition-all group-hover/item:scale-110 group-hover/item:bg-pink-500/10", color)}>
          <Icon size={22} />
        </div>
        <div className="pt-1.5">
          <p className="text-base font-black uppercase tracking-tight text-white/80 group-hover/item:text-white transition-colors">{label}</p>
          {desc && <p className="text-[10px] text-pink-100/20 font-black uppercase tracking-widest mt-2 leading-relaxed max-w-sm">{desc}</p>}
        </div>
      </div>
      <div className="text-right pt-2">
        <p className={cn("text-base font-black tracking-tighter uppercase text-glow", color)}>{val || status}</p>
        <p className="text-[9px] font-black uppercase tracking-widest text-pink-100/10 mt-1">Readiness Node Index</p>
      </div>
    </div>
  );
}

function FixItem({ label, priority }: { label: string, priority: string }) {
  return (
    <div className="flex items-center gap-5 p-6 glass-card rounded-3xl border-white/5 hover:translate-x-2 transition-all cursor-pointer group active:scale-95 bg-white/[0.02]">
      <div className={cn(
        "w-2 h-8 rounded-full shadow-lg",
        priority === 'High' ? "bg-pink-500 shadow-pink-500/20" : priority === 'Medium' ? "bg-purple-500 shadow-purple-500/20" : "bg-pink-300 shadow-pink-300/20"
      )} />
      <div className="flex-1">
        <p className="text-[11px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{label}</p>
        <p className="text-[9px] font-black uppercase tracking-widest text-pink-100/10 mt-1">{priority} Resolution Priority</p>
      </div>
      <ArrowRight size={16} className="text-pink-300/20 group-hover:text-pink-400 transition-all" />
    </div>
  );
}

function PanelSection({ title, children }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-100/10 px-4">{title}</h3>
      <div className="p-10 glass-panel rounded-[3.5rem] space-y-8 bg-black/40 backdrop-blur-3xl border-white/10">
        {children}
      </div>
    </div>
  );
}

function MetricBox({ label, val }: { label: string, val: string }) {
  return (
    <div className="p-6 glass-card border-none rounded-3xl text-center space-y-2 group hover:bg-pink-500/5 transition-all">
      <p className="text-[9px] font-black uppercase text-pink-100/20 tracking-[0.2em] group-hover:text-pink-300 transition-colors">{label}</p>
      <p className="text-base font-black tracking-tighter text-glow text-white/90">{val}</p>
    </div>
  );
}
