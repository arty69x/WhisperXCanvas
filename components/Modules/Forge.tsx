import React, { useState } from 'react';
import { 
  Hammer, 
  Zap, 
  Cpu, 
  ArrowRight, 
  Layers, 
  Terminal,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Forge({ activeModule }: { activeModule: string }) {
  const [isForging, setIsForging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  if (activeModule !== 'forge') return null;

  const startForge = () => {
    setIsForging(true);
    setProgress(0);
    setLogs(['Initializing Forge Runtime...', 'Loading Blueprint: Standard_v1', 'Validating Source Materials...']);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsForging(false);
          setLogs(l => [...l, 'Transformation Complete.', 'Result: forge_result_alpha.json']);
          return 100;
        }
        const next = prev + 5;
        if (next === 40) setLogs(l => [...l, 'Applying Matrix Transformations...']);
        if (next === 70) setLogs(l => [...l, 'Normalizing Output Data...']);
        return next;
      });
    }, 200);
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent p-6 space-y-6">
      <header className="p-8 glass-panel rounded-[2.5rem] border-white/10 relative z-10 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-glow text-white/90">Forge Matrix</h1>
          <p className="text-[10px] text-pink-300/40 font-black uppercase tracking-[0.2em]">Visual Transformation & Fusion Engine</p>
        </div>
        <button 
          onClick={startForge}
          disabled={isForging}
          className={cn(
            "flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all accent-glow-pink",
            isForging ? "bg-white/10 text-white/40" : "bg-white text-black hover:scale-105 active:scale-95"
          )}
        >
          {isForging ? <Loader2 size={16} className="animate-spin text-pink-500" /> : <Zap size={16} className="text-pink-500" />}
          {isForging ? "Forging..." : "Initiate Fusion"}
        </button>
      </header>

      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Configuration Panel */}
        <div className="glass-panel rounded-[3rem] p-8 space-y-8 overflow-y-auto scrollbar-hide border-white/10">
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-100/20">Blueprint Selection</h3>
            <div className="grid grid-cols-2 gap-4">
              <ForgeOption label="Standard" sub="General Purpose" active />
              <ForgeOption label="Aggressive" sub="High Compression" />
              <ForgeOption label="Semantic" sub="Context Aware" />
              <ForgeOption label="Legacy" sub="Format Migration" />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-100/20">Matrix Configuration</h3>
            <div className="grid grid-cols-1 gap-3">
              <MatrixToggle label="Preserve Metadata" active />
              <MatrixToggle label="Deep Normalization" active />
              <MatrixToggle label="Relation Mapping" />
              <MatrixToggle label="AI Enhancement" />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-100/20">Source Context</h3>
            <div className="p-12 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all hover:bg-white/[0.02]">
              <Layers size={32} className="text-pink-300/10" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-100/10">Select sources from Vault</p>
            </div>
          </section>
        </div>

        {/* Console / Output Panel */}
        <div className="glass-panel rounded-[3rem] flex flex-col overflow-hidden border-white/10 bg-black/10">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <Terminal size={14} className="text-pink-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-glow text-white/70">Forge Console</span>
            </div>
            {isForging && (
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-pink-300/40 tracking-tighter uppercase">Compiling Logic...</span>
                <span className="text-[10px] font-mono text-pink-400 font-bold">{progress}%</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-8 font-mono text-[10px] space-y-3 overflow-y-auto scrollbar-hide">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="text-pink-300/10 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                <span className={cn(
                  "leading-relaxed",
                  log.includes('Complete') ? "text-pink-400 text-glow" : "text-white/40"
                )}>
                  {log.includes('Result') ? (
                    <span className="flex items-center gap-2">
                       <CheckCircle2 size={12} /> {log}
                    </span>
                  ) : log}
                </span>
              </div>
            ))}
            {isForging && (
              <div className="flex gap-4 animate-pulse">
                <span className="text-pink-300/10">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                <span className="text-pink-400/40">Executing fusion matrix...</span>
              </div>
            )}
          </div>

          {progress === 100 && (
            <div className="p-8 bg-pink-500/5 border-t border-white/5 flex items-center justify-between backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,126,179,0.2)]">
                  <CheckCircle2 size={24} className="text-pink-400" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-pink-400 uppercase tracking-[0.2em] text-glow">Fusion Successful</p>
                  <p className="text-[9px] font-bold text-pink-400/40 uppercase tracking-widest">1 active node generated • context normalized</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-pink-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(255,126,179,0.4)] hover:scale-105 transition-all active:scale-95 border border-pink-400/30">
                Register to Vault
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ForgeOption({ label, sub, active }: { label: string, sub: string, active?: boolean }) {
  return (
    <div className={cn(
      "p-5 rounded-3xl cursor-pointer transition-all border-none relative group overflow-hidden",
      active 
        ? "bg-white/15 shadow-[0_0_30px_rgba(255,126,179,0.15)] ring-1 ring-pink-300/30" 
        : "glass-card hover:bg-white/20"
    )}>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/80">{label}</p>
        <p className="text-[9px] text-pink-100/20 uppercase font-black tracking-widest mt-0.5 group-hover:text-pink-100/40 transition-colors">{sub}</p>
      </div>
      {active && <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-50" />}
    </div>
  );
}

function MatrixToggle({ label, active }: { label: string, active?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 glass-card rounded-[1.5rem] border-none group hover:translate-x-1 duration-300">
      <span className="text-[10px] font-black uppercase tracking-widest text-pink-100/40 group-hover:text-pink-100/70 transition-colors">{label}</span>
      <div className={cn(
        "w-10 h-5 rounded-full relative transition-all duration-300",
        active ? "bg-pink-500 shadow-[0_0_20px_#ff7eb3]" : "bg-white/5"
      )}>
        <div className={cn(
          "absolute top-1 w-3 h-3 rounded-full transition-all duration-300",
          active ? "right-1 bg-white" : "left-1 bg-pink-100/20"
        )} />
      </div>
    </div>
  );
}
