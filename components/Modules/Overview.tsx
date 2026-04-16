import React from 'react';
import { 
  Activity, 
  Database, 
  Zap, 
  Clock, 
  Shield, 
  FileSearch,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Overview({ activeModule }: { activeModule: string }) {
  if (activeModule !== 'overview') return null;

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0a0a0a] p-8 space-y-12 scrollbar-hide">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">System Overview</h1>
        <p className="text-white/40 text-sm font-medium">WhisperXStudio v.final — Production Runtime Alpha</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Activity} label="System Health" value="Optimal" color="text-green-400" />
        <StatCard icon={Database} label="Archive Coverage" value="84%" color="text-blue-400" />
        <StatCard icon={Zap} label="Forge Readiness" value="Ready" color="text-yellow-400" />
        <StatCard icon={Shield} label="Security Layer" value="Active" color="text-purple-400" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Imports */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Recent Imports</h3>
            <button className="text-[10px] font-bold uppercase text-white/20 hover:text-white transition-colors flex items-center gap-1">
              View Vault <ArrowUpRight size={12} />
            </button>
          </div>
          
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white/20 group-hover:text-white transition-colors">
                    <FileSearch size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">source_document_0{i}.pdf</p>
                    <p className="text-[10px] text-white/20 uppercase font-bold tracking-wider">Archive Record • 2.4 MB</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-white/40">2 hours ago</p>
                  <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Normalized</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Readiness Signals</h3>
          <div className="p-6 bg-[#141414] border border-white/10 rounded-2xl space-y-6">
             <SignalItem label="API Connectivity" status="online" />
             <SignalItem label="Canvas Engine" status="online" />
             <SignalItem label="Persistence Layer" status="online" />
             <SignalItem label="AI Service" status="online" />
             <SignalItem label="Forge Runtime" status="online" />
             
             <div className="pt-4 border-t border-white/5">
               <button className="w-full py-3 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-colors">
                 Run Full Diagnostics
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="p-6 bg-[#141414] border border-white/10 rounded-2xl space-y-4 hover:border-white/20 transition-colors group">
      <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center", color)}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">{label}</p>
        <p className="text-2xl font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function SignalItem({ label, status }: { label: string, status: 'online' | 'offline' | 'warning' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-white/60">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{status}</span>
        <div className={cn(
          "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
          status === 'online' ? "bg-green-500 shadow-green-500/50" : "bg-red-500 shadow-red-500/50"
        )} />
      </div>
    </div>
  );
}
