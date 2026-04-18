import React from 'react';
import Sidebar from './Sidebar';
import GlobalSearch from './GlobalSearch';
import { useAppStore } from '@/lib/store';
import { Search, Bell, User, Sparkles, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import PetalsBackground from '../Visuals/PetalsBackground';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { activeModule, setActiveModule, user, isFocusedMode } = useAppStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="flex h-screen bg-[#0f050a] text-pink-50 overflow-hidden font-sans selection:bg-pink-500/30">
      <PetalsBackground />
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar Container */}
      <AnimatePresence>
        {!isFocusedMode && (
          <motion.div 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed md:relative z-[70] transition-transform duration-500 h-full",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}
          >
            <Sidebar activeModule={activeModule} onModuleChange={(id) => {
              setActiveModule(id);
              setIsSidebarOpen(false);
            }} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Environment Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-600/10 blur-[180px] rounded-full pointer-events-none animate-pulse-soft" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[180px] rounded-full pointer-events-none animate-pulse-soft" style={{ animationDelay: '2s' }} />

        {/* Global Header */}
        <AnimatePresence>
          {!isFocusedMode && (
            <motion.header 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-16 border-b border-white/10 glass-panel flex items-center justify-between px-8 shrink-0 z-40 relative group mx-4 mt-4 rounded-3xl"
            >
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-400/20 to-transparent" />
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2.5 -ml-2 glass-button rounded-xl text-pink-200/40 hover:text-white border-white/10"
                >
                  <Menu size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                       <Sparkles size={10} className="text-pink-400 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-100/30">Node_Matrix</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-xl font-black uppercase tracking-tighter italic text-glow drop-shadow-[0_0_15px_rgba(255,126,179,0.3)] text-pink-50">
                         {mounted ? activeModule : 'INITIALIZING'}
                       </span>
                       <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full">
                          <Sparkles size={10} className="text-pink-400 animate-pulse" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-pink-400">AI_Augmented</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <GlobalSearch />
                
                {/* Mission Stats */}
                <div className="hidden lg:flex items-center gap-8 px-8 border-x border-white/5">
                   <div className="flex flex-col">
                     <span className="hardware-stats">Heartbeat_Sync</span>
                     <span className="text-[13px] font-black text-pink-300 mt-0.5">98.2 bpm</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="hardware-stats">Petal_Load</span>
                     <span className="text-[13px] font-black text-purple-300 mt-0.5">14.2%</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="hardware-stats">Flower_Net</span>
                     <span className="text-[13px] font-black text-white/60 mt-0.5 whitespace-nowrap italic">Stable_link</span>
                   </div>
                </div>

                <div className="flex items-center gap-6">
                  <button className="text-white/40 hover:text-pink-100 transition-all relative glass-button p-3 rounded-2xl border-white/10">
                    <Bell size={18} />
                    <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_12px_rgba(255,126,179,1)] border-2 border-[#0f050a]" />
                  </button>
                  
                  <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                      <p className="text-[11px] font-black uppercase tracking-widest text-glow truncate max-w-[120px] text-pink-50">{user.name}</p>
                      <p className="text-[9px] font-black text-pink-100/20 uppercase tracking-tighter">{user.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 border border-white/20 flex items-center justify-center hover:scale-105 transition-all cursor-pointer shadow-xl text-sm font-black italic text-white/80">
                       {user.name.charAt(0)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        <main className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full p-4"
            >
              {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child as React.ReactElement<any>, { activeModule });
                }
                return child;
              })}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
