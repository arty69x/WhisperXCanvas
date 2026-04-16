import React from 'react';
import Sidebar from './Sidebar';
import { useAppStore } from '@/lib/store';
import { Search, Bell, User, Sparkles, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { activeModule, setActiveModule } = useAppStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  return (
    <div className="flex h-screen bg-[#05070a] text-white overflow-hidden font-sans selection:bg-blue-500/30">
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      <div className={cn(
        "fixed md:relative z-50 transition-transform duration-300 h-full",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <Sidebar activeModule={activeModule} onModuleChange={(id) => {
          setActiveModule(id);
          setIsSidebarOpen(false);
        }} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Global Header */}
        <header className="h-14 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <Sparkles size={14} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest italic text-glow">WhisperXStudio</span>
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
                className="glass-input rounded-full pl-9 pr-4 py-1.5 text-[10px] w-64"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="text-white/40 hover:text-white transition-colors relative glass-button p-2 rounded-full border-none bg-transparent">
                <Bell size={16} />
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-glow">Arty69xx</p>
                  <p className="text-[9px] font-bold text-white/20 uppercase">Administrator</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
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
