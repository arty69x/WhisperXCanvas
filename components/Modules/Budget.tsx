import React from 'react';
import { Wallet, Search, Filter, Plus, ArrowUpRight, ArrowDownLeft, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Budget({ activeModule }: { activeModule: string }) {
  if (activeModule !== 'budget') return null;

  const categories = [
    { label: 'Infrastructure', spent: 12400, budget: 15000, color: 'bg-blue-400' },
    { label: 'AI Services', spent: 8200, budget: 10000, color: 'bg-purple-400' },
    { label: 'Personnel', spent: 45000, budget: 50000, color: 'bg-green-400' },
    { label: 'Marketing', spent: 3500, budget: 5000, color: 'bg-yellow-400' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0a]">
      <header className="p-8 border-b border-white/10 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Budget</h1>
          <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Financial Resource Management</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Total Spent</p>
            <p className="text-xl font-black tracking-tight">$69,100.00</p>
          </div>
          <button className="p-3 bg-white text-black rounded-xl hover:bg-white/90 transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BudgetStat label="Monthly Burn" value="$12,400" trend="+4%" />
          <BudgetStat label="Remaining" value="$10,900" trend="-2%" />
          <BudgetStat label="Efficiency" value="94%" trend="+1%" />
        </div>

        {/* Categories */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Category Breakdown</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div key={cat.label} className="p-6 bg-[#141414] border border-white/10 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{cat.label}</span>
                  <span className="text-[10px] font-bold uppercase text-white/40">${cat.spent.toLocaleString()} / ${cat.budget.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", cat.color)} 
                    style={{ width: `${(cat.spent / cat.budget) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
                  <span>{Math.round((cat.spent / cat.budget) * 100)}% Utilized</span>
                  <button className="hover:text-white transition-colors flex items-center gap-1">
                    Details <ArrowUpRight size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetStat({ label, value, trend }: { label: string, value: string, trend: string }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="p-6 bg-[#141414] border border-white/10 rounded-2xl space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-black tracking-tight">{value}</p>
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded",
          isPositive ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
        )}>{trend}</span>
      </div>
    </div>
  );
}
