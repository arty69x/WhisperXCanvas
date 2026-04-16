import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useWorkspaceStore } from '@/lib/store';
import { Search, Bell, User, Sparkles } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [activeModule, setActiveModule] = useState('workspace');
  
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Header */}
        <header className="h-14 border-b border-white/10 bg-[#0a0a0a] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black">
                <Sparkles size={14} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest italic">WhisperXStudio</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <span className="text-white/60">{activeModule}</span>
              <span>/</span>
              <span>Production_v1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
              <input 
                type="text" 
                placeholder="Search Workspace..." 
                className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-[10px] w-64 focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="text-white/40 hover:text-white transition-colors relative">
                <Bell size={16} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0a0a]" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black uppercase tracking-widest">Arty69xx</p>
                  <p className="text-[9px] font-bold text-white/20 uppercase">Administrator</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                  <User size={16} className="text-white/40" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 relative overflow-hidden">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, { activeModule });
            }
            return child;
          })}
        </main>
      </div>
    </div>
  );
}
