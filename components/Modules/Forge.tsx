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
    <div className="w-full h-full flex flex-col bg-[#0a0a0a]">
      <header className="p-8 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Forge</h1>
            <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Visual Transformation & Fusion Engine</p>
          </div>
          <button 
            onClick={startForge}
            disabled={isForging}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              isForging ? "bg-white/10 text-white/40" : "bg-white text-black hover:scale-105 active:scale-95"
            )}
          >
            {isForging ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
            {isForging ? "Forging..." : "Initiate Fusion"}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5">
        {/* Configuration Panel */}
        <div className="bg-[#0a0a0a] p-8 space-y-8 overflow-y-auto scrollbar-hide">
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Blueprint Selection</h3>
            <div className="grid grid-cols-2 gap-4">
              <ForgeOption label="Standard" sub="General Purpose" active />
              <ForgeOption label="Aggressive" sub="High Compression" />
              <ForgeOption label="Semantic" sub="Context Aware" />
              <ForgeOption label="Legacy" sub="Format Migration" />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Matrix Configuration</h3>
            <div className="space-y-2">
              <MatrixToggle label="Preserve Metadata" active />
              <MatrixToggle label="Deep Normalization" active />
              <MatrixToggle label="Relation Mapping" />
              <MatrixToggle label="AI Enhancement" />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Source Context</h3>
            <div className="p-6 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 opacity-40">
              <Layers size={24} />
              <p className="text-[10px] font-bold uppercase tracking-widest">Select sources from Vault</p>
            </div>
          </section>
        </div>

        {/* Console / Output Panel */}
        <div className="bg-[#0f0f0f] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-white/40" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Forge Console</span>
            </div>
            {isForging && <span className="text-[10px] font-mono text-white/40">{progress}%</span>}
          </div>
          
          <div className="flex-1 p-6 font-mono text-[11px] space-y-2 overflow-y-auto scrollbar-hide">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span>
                <span className={cn(
                  log.includes('Complete') ? "text-green-400" : "text-white/60"
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
            <div className="p-6 bg-green-500/10 border-t border-green-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-400" />
                <div>
                  <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Fusion Successful</p>
                  <p className="text-[10px] text-green-400/60">1 asset generated • 0 errors</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-green-400 text-black rounded-lg text-[10px] font-bold uppercase tracking-widest">
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
      "p-4 border rounded-xl cursor-pointer transition-all",
      active ? "bg-white/10 border-white" : "bg-white/5 border-white/10 hover:border-white/30"
    )}>
      <p className="text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="text-[9px] text-white/40 uppercase font-bold">{sub}</p>
    </div>
  );
}

function MatrixToggle({ label, active }: { label: string, active?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{label}</span>
      <div className={cn(
        "w-8 h-4 rounded-full relative transition-colors",
        active ? "bg-white" : "bg-white/10"
      )}>
        <div className={cn(
          "absolute top-1 w-2 h-2 rounded-full transition-all",
          active ? "right-1 bg-black" : "left-1 bg-white/20"
        )} />
      </div>
    </div>
  );
}
