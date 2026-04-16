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
    <div className="w-full h-full flex flex-col bg-transparent">
      <header className="p-8 border-b border-white/10 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-glow">Forge Matrix</h1>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Visual Transformation & Fusion Engine</p>
          </div>
          <button 
            onClick={startForge}
            disabled={isForging}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]",
              isForging ? "bg-white/10 text-white/40" : "bg-white text-black hover:scale-105 active:scale-95"
            )}
          >
            {isForging ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
            {isForging ? "Forging..." : "Initiate Fusion"}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5 relative z-10">
        {/* Configuration Panel */}
        <div className="bg-black/20 backdrop-blur-md p-8 space-y-8 overflow-y-auto scrollbar-hide">
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Blueprint Selection</h3>
            <div className="grid grid-cols-2 gap-4">
              <ForgeOption label="Standard" sub="General Purpose" active />
              <ForgeOption label="Aggressive" sub="High Compression" />
              <ForgeOption label="Semantic" sub="Context Aware" />
              <ForgeOption label="Legacy" sub="Format Migration" />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Matrix Configuration</h3>
            <div className="space-y-2">
              <MatrixToggle label="Preserve Metadata" active />
              <MatrixToggle label="Deep Normalization" active />
              <MatrixToggle label="Relation Mapping" />
              <MatrixToggle label="AI Enhancement" />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Source Context</h3>
            <div className="p-10 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 opacity-40 glass-panel border-none">
              <Layers size={32} className="text-white/20" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Select sources from Vault</p>
            </div>
          </section>
        </div>

        {/* Console / Output Panel */}
        <div className="bg-black/40 backdrop-blur-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-white/40" />
              <span className="text-[10px] font-black uppercase tracking-widest text-glow">Forge Console</span>
            </div>
            {isForging && <span className="text-[10px] font-mono text-white/40 tracking-tighter">{progress}%</span>}
          </div>
          
          <div className="flex-1 p-6 font-mono text-[11px] space-y-2 overflow-y-auto scrollbar-hide">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span>
                <span className={cn(
                  log.includes('Complete') ? "text-green-400 text-glow" : "text-white/60"
                )}>{log}</span>
              </div>
            ))}
            {isForging && (
              <div className="flex gap-3 animate-pulse">
                <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-white/40">Processing...</span>
              </div>
            )}
          </div>

          {progress === 100 && (
            <div className="p-6 bg-green-500/10 border-t border-green-500/20 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-green-400 uppercase tracking-[0.2em] text-glow">Fusion Successful</p>
                  <p className="text-[9px] font-bold text-green-400/60 uppercase">1 asset generated • 0 errors</p>
                </div>
              </div>
              <button className="px-5 py-2.5 bg-green-400 text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:scale-105 transition-all active:scale-95">
                Export Result
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
      "p-4 rounded-2xl cursor-pointer transition-all",
      active 
        ? "bg-white/10 border border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
        : "glass-card border-none hover:bg-white/10"
    )}>
      <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
      <p className="text-[9px] text-white/20 uppercase font-bold">{sub}</p>
    </div>
  );
}

function MatrixToggle({ label, active }: { label: string, active?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 glass-card rounded-2xl border-none">
      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{label}</span>
      <div className={cn(
        "w-8 h-4 rounded-full relative transition-all",
        active ? "bg-white shadow-[0_0_10px_white]" : "bg-white/10"
      )}>
        <div className={cn(
          "absolute top-1 w-2 h-2 rounded-full transition-all",
          active ? "right-1 bg-black" : "left-1 bg-white/20"
        )} />
      </div>
    </div>
  );
}
