import React from 'react';
import { Wallet, Search, Filter, Plus, ArrowUpRight, ArrowDownLeft, PieChart, TrendingUp, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from 'recharts';

const categories = [
  { label: 'Infrastructure', spent: 12400, budget: 15000, color: '#3b82f6' },
  { label: 'AI Services', spent: 18200, budget: 20000, color: '#a855f7' },
  { label: 'Personnel', spent: 45000, budget: 50000, color: '#10b981' },
  { label: 'Marketing', spent: 3500, budget: 5000, color: '#eab308' },
];

export default function Budget({ activeModule }: { activeModule: string }) {
  if (activeModule !== 'budget') return null;

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden selection:bg-pink-500/30">
      <header className="p-10 glass-panel border-white/5 bg-black/20 backdrop-blur-3xl m-6 rounded-[2.5rem] relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-glow text-white/90">Financial_Matrix</h1>
            <p className="text-[10px] text-pink-300/40 font-black uppercase tracking-[0.2em]">Resource Allocation • Neural Burn Rate Management</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-100/20">Fiscal Baseline</p>
              <p className="text-3xl font-black tracking-tighter text-glow text-white/90">$79,100.00</p>
            </div>
            <button className="w-16 h-16 bg-white text-pink-600 rounded-[1.5rem] flex items-center justify-center hover:scale-110 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Plus size={32} className="relative z-10" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-12 space-y-20 scrollbar-hide relative z-10 pt-0">
        {/* Summary Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <BudgetStat label="Burn Rate" value="$14.2K" trend="+4%" color="text-pink-400" />
            <BudgetStat label="Efficiency" value="96.4%" trend="+1.2%" color="text-green-400" />
            <BudgetStat label="Runway" value="14 Mo" trend="Stable" color="text-purple-400" />
          </div>

          <div className="lg:col-span-3 p-12 glass-panel rounded-[3.5rem] flex items-center justify-between bg-black/10 border-white/5 relative overflow-hidden group hover:bg-pink-500/[0.01] transition-all">
            <div className="flex-1 space-y-4 relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-100/20 mb-6 italic">Neural_Allocation_Graph</h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={10}
                      dataKey="spent"
                    >
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" className="hover:opacity-80 transition-opacity cursor-pointer" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 5, 10, 0.95)', border: '1px solid rgba(255, 126, 179, 0.2)', borderRadius: '24px', fontSize: '11px', color: '#fff', padding: '16px', backdropFilter: 'blur(10px)', fontWeight: 'bold' }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-72 space-y-6 relative z-10">
               {categories.map(cat => (
                 <div key={cat.label} className="flex items-center justify-between group/item cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] transition-transform group-hover/item:scale-125" style={{ backgroundColor: cat.color, color: cat.color }} />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-pink-100/20 group-hover/item:text-pink-100/50 transition-colors italic">{cat.label}</span>
                    </div>
                    <span className="text-[11px] font-black text-glow text-white/80">${(cat.spent / 1000).toFixed(1)}K</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Detailed Lists */}
        <div className="space-y-10">
           <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-pink-100/10 px-4 italic">Resource_Pipeline_Scenarios</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {categories.map(cat => (
                <div key={cat.label} className="p-10 glass-panel rounded-[3.5rem] space-y-10 group hover:bg-pink-500/[0.03] hover:border-pink-500/20 transition-all active:scale-[0.98] bg-black/10 border-white/5 relative overflow-hidden">
                   <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-pink-500/5 rounded-[1.5rem] flex items-center justify-center text-pink-300/40 group-hover:text-pink-400 group-hover:bg-pink-500/10 transition-all border border-pink-500/10">
                            <DollarSign size={28} />
                         </div>
                         <div>
                            <h4 className="text-lg font-black uppercase tracking-tight text-white/90 group-hover:text-white transition-colors">{cat.label}</h4>
                            <p className="text-[10px] text-pink-100/10 font-black uppercase tracking-[0.4em] mt-1">Resource Pool Alpha</p>
                         </div>
                      </div>
                      <button className="p-4 p-4 glass-button rounded-2xl text-pink-100/40 hover:text-pink-400 transition-all border-white/5">
                         <ArrowUpRight size={20} className="text-pink-300/20 group-hover:text-pink-400 transition-colors" />
                      </button>
                   </div>
                   <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest px-1">
                        <span className="text-pink-100/20 italic">Structural Utilization</span>
                        <span className="text-pink-400 text-glow">{Math.round((cat.spent / cat.budget) * 100)}% Matrix Load</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_currentColor]" style={{ width: `${(cat.spent / cat.budget) * 100}%`, backgroundColor: cat.color, color: cat.color }} />
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] pt-2 text-pink-100/10 px-1">
                        <span>Spent: ${cat.spent.toLocaleString()}</span>
                        <span className="opacity-40 tracking-[0.5em]">•</span>
                        <span>Cap: ${cat.budget.toLocaleString()}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function BudgetStat({ label, value, trend, color }: any) {
  return (
    <div className="p-10 glass-panel rounded-[3rem] space-y-6 group hover:bg-pink-500/[0.02] transition-colors bg-black/10 border-white/5">
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-100/20 italic group-hover:text-pink-100/40 transition-colors">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-4xl font-black tracking-tighter text-glow text-white/90 group-hover:text-white transition-colors italic leading-none">{value}</p>
        <div className={cn("px-4 py-2 rounded-2xl bg-white/5 border border-pink-500/10 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(255,126,179,0.05)]", color)}>
          {trend}
        </div>
      </div>
    </div>
  );
}
