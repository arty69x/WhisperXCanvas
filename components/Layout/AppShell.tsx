import React from 'react';
import Sidebar from './Sidebar';
import GlobalSearch from './GlobalSearch';
import ComponentLibrary from '../Library/ComponentLibrary';
import Inspector from '../Canvas/Inspector';
import AutoSaveManager from '../Utils/AutoSaveManager';
import ModuleSystemHandler from '../Modules/ModuleSystemHandler';
import { useAppStore } from '@/lib/store';
import { Search, Bell, User, Sparkles, Menu, LayoutDashboard, SquareTerminal, Hammer, Lock, Layers, Activity, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { activeModule, setActiveModule, user, isFocusedMode, isAutoSaving, lastSaved } = useAppStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="flex h-screen bg-white text-black overflow-hidden font-sans selection:bg-brand-blue/10">
      <AutoSaveManager />
      <ModuleSystemHandler />
      
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
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
               "flex z-[70] transition-transform duration-500 h-full fixed h-full md:relative shrink-0",
               isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}
          >
            <Sidebar activeModule={activeModule} onModuleChange={(id) => {
              setActiveModule(id);
              setIsSidebarOpen(false);
            }} />

            <AnimatePresence>
              {activeModule === 'workspace' && isLibraryOpen && (
                <>
                  {/* Desktop Library Sidebar */}
                  <motion.div
                    initial={{ x: -320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -320, opacity: 0 }}
                    className="h-full hidden lg:block shrink-0 border-r border-gray-100"
                  >
                    <ComponentLibrary />
                  </motion.div>

                  {/* Mobile/Tablet Library Drawer Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[80] lg:hidden"
                    onClick={() => setIsLibraryOpen(false)}
                  />
                  <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 h-[80vh] z-[90] lg:hidden rounded-t-[3rem] overflow-hidden"
                  >
                    <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-4 absolute top-0 left-1/2 -translate-x-1/2 z-20" />
                    <ComponentLibrary />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-white">
        {/* Global Header */}
        <AnimatePresence>
          {!isFocusedMode && (
            <motion.header 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-40 relative group"
            >
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2.5 -ml-2 text-gray-400 hover:text-black transition-colors"
                >
                  <Menu size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                       <Zap size={10} className="text-brand-orange animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">W-X_Studio</span>
                      {isAutoSaving ? (
                        <div className="flex items-center gap-2 ml-4 px-2 py-0.5 bg-brand-green/10 border border-brand-green/20 rounded-md animate-pulse">
                           <div className="w-1 h-1 bg-brand-green rounded-full" />
                           <span className="text-[7px] font-black uppercase text-brand-green tracking-[0.2em]">Live_Sync</span>
                        </div>
                      ) : lastSaved && (
                        <span className="text-[7px] font-black uppercase text-gray-300 tracking-[0.2em] ml-4">Commit: {new Date(lastSaved).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                       <span className="text-xl font-black uppercase tracking-tighter text-black">
                         {mounted ? activeModule : 'ENGINE_CORE'}
                       </span>
                       <div className="flex items-center gap-1.5 ml-4 px-2 py-0.5 bg-brand-black text-white rounded-md">
                          <Sparkles size={8} className="text-brand-yellow shrink-0" />
                          <span className="text-[8px] font-bold uppercase tracking-widest leading-none">Pro</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-10 h-full">
                <GlobalSearch />
                
                {/* Engine Stats */}
                <div className="hidden lg:flex items-center gap-8 h-full px-8 border-x border-gray-50">
                   <div className="flex flex-col">
                     <span className="hardware-stats">Core_Sync</span>
                     <span className="text-[13px] font-black text-brand-blue mt-0.5 tracking-tighter">99.9%</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="hardware-stats">Latent_Load</span>
                     <span className="text-[13px] font-black text-brand-orange mt-0.5 tracking-tighter">0.4ms</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="hardware-stats">Network</span>
                     <span className="text-[13px] font-black text-brand-green mt-0.5 tracking-tighter">Active</span>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                    className={cn(
                       "p-2.5 rounded-xl transition-all border border-transparent",
                       isLibraryOpen ? "bg-gray-100 text-black border-gray-200" : "text-gray-400 hover:text-black hover:bg-gray-50"
                    )}
                    title="Library"
                  >
                    <Layers size={18} />
                  </button>

                  <button className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all relative">
                    <Bell size={18} />
                    <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-red rounded-full border-2 border-white" />
                  </button>
                  
                  <div className="flex items-center gap-4 pl-6 border-l border-gray-100 h-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-[11px] font-black uppercase tracking-widest text-black leading-none">{user.name}</p>
                      <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-tighter mt-1">{user.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center hover:scale-105 transition-all cursor-pointer text-sm font-black text-black">
                       {user.name.charAt(0)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        <main className="flex-1 relative overflow-hidden flex">
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full p-4 pb-24 md:pb-4"
              >
                {React.Children.map(children, child => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, { activeModule });
                  }
                  return child;
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {!isFocusedMode && activeModule === 'workspace' && (
              <Inspector />
            )}
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation Rail */}
        <AnimatePresence>
          {!isFocusedMode && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 left-6 right-6 h-18 bg-white/90 backdrop-blur-3xl rounded-3xl md:hidden z-50 flex items-center justify-around px-6 border border-gray-100 shadow-2xl"
            >
                {[
                  { id: 'overview', icon: LayoutDashboard },
                  { id: 'workspace', icon: SquareTerminal },
                  { id: 'library', icon: Layers },
                  { id: 'forge', icon: Hammer },
                  { id: 'vault', icon: Lock },
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => {
                        if (item.id === 'library') {
                            setIsLibraryOpen(!isLibraryOpen);
                        } else {
                            setActiveModule(item.id);
                            setIsLibraryOpen(false);
                        }
                    }}
                    className={cn(
                      "p-4 rounded-full transition-all relative",
                      (activeModule === item.id || (item.id === 'library' && isLibraryOpen)) ? "text-brand-blue scale-110" : "text-gray-300"
                    )}
                  >
                     {(activeModule === item.id || (item.id === 'library' && isLibraryOpen)) && (
                       <motion.div 
                         layoutId="active-nav-bg"
                         className="absolute inset-0 bg-brand-blue/5 rounded-full"
                       />
                     )}
                     <item.icon size={22} />
                  </button>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
