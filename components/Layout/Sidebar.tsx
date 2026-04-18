import React from 'react';
import { 
  LayoutDashboard, 
  LayoutGrid,
  SquareTerminal, 
  Hammer, 
  Lock, 
  Archive, 
  BookOpen, 
  FileText, 
  History, 
  ShieldCheck, 
  FileJson, 
  Presentation, 
  Network, 
  Sparkles, 
  Users, 
  Wallet,
  Settings,
  HelpCircle,
  Command
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { motion } from 'motion/react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'workspace', label: 'Workspace', icon: SquareTerminal },
  { id: 'gallery', label: 'Design Gallery', icon: LayoutGrid },
  { id: 'forge', label: 'Forge Matrix', icon: Hammer },
  { id: 'vault', label: 'Vault', icon: Lock },
  { id: 'archive', label: 'Archive', icon: Archive },
  { id: 'reader', label: 'Reader', icon: BookOpen },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'history', label: 'History', icon: History },
  { id: 'readiness', label: 'Readiness', icon: ShieldCheck },
  { id: 'docs', label: 'Docs', icon: FileJson },
  { id: 'slides', label: 'Slides', icon: Presentation },
  { id: 'topology', label: 'Topology', icon: Network },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'budget', label: 'Budget', icon: Wallet },
];

export default function Sidebar({ activeModule, onModuleChange }: { activeModule: string, onModuleChange: (id: string) => void }) {
  const user = useAppStore((state) => state.user);

  return (
    <div className="w-16 md:w-64 h-full glass-panel border-r border-white/10 flex flex-col transition-all duration-800 overflow-hidden z-50 shadow-[20px_0_60px_rgba(255,126,179,0.05)] md:ml-4 md:my-4 md:rounded-[2.5rem] md:h-[calc(100vh-2rem)]">
      {/* Brand Section */}
      <div className="p-8 flex items-center gap-4 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-pink-500/[0.05] to-transparent pointer-events-none" />
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(255,126,179,0.5)] group cursor-pointer hover:rotate-12 transition-transform duration-500">
          <Command size={24} className="text-pink-600 group-hover:scale-110 transition-transform" />
        </div>
        <div className="hidden md:block overflow-hidden">
          <h1 className="font-black text-lg tracking-tighter uppercase italic leading-none text-glow text-pink-50">WhisperX</h1>
          <p className="text-[10px] font-black text-pink-200/20 uppercase tracking-[0.3em] mt-1">Workspace_v1.0</p>
        </div>
      </div>
      
      {/* Agentic Status */}
      <div className="px-8 pb-4 hidden md:block">
        <div className="p-3 bg-pink-500/5 border border-pink-500/10 rounded-xl flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_10px_#ff7eb3] animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-pink-300">Agentic_Link Status</span>
           </div>
           <span className="text-[8px] font-black text-pink-200/20 uppercase tracking-widest">Active</span>
        </div>
      </div>
      
      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide px-4 space-y-2">
        <div className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.4em] text-pink-100/10 hidden md:block border-b border-white/5 mb-4">Core_Systems</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[11px] transition-all group relative border",
              activeModule === item.id 
                ? "bg-white/[0.12] text-white border-pink-300/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-xl" 
                : "text-pink-100/30 border-transparent hover:text-white/60 hover:bg-white/[0.05]"
            )}
          >
            {activeModule === item.id && (
              <motion.div 
                layoutId="active-indicator"
                className="absolute left-0 w-1 h-5 bg-pink-400 rounded-full shadow-[0_0_15px_#ff7eb3]" 
              />
            )}
            <item.icon size={20} className={cn(
              "shrink-0 transition-all duration-300",
              activeModule === item.id ? "text-pink-300 scale-110 drop-shadow-[0_0_12px_#ff7eb3]" : "text-pink-100/30 group-hover:text-pink-100/60 group-hover:scale-110"
            )} />
            <span className={cn(
              "hidden md:block font-black uppercase tracking-[0.15em] transition-all",
              activeModule === item.id ? "text-white" : "text-pink-100/30 group-hover:text-pink-100/60"
            )}>
              {item.id === activeModule ? (
                <span className="text-glow">{item.label}</span>
              ) : item.label}
            </span>
          </button>
        ))}
      </nav>
      
      {/* Footer Section */}
      <div className="p-6 space-y-6 relative">
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-pink-500/[0.05] to-transparent pointer-events-none" />
        
        <div className="space-y-2 hidden md:block border-t border-white/5 pt-6">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-pink-100/20 hover:text-white transition-all hover:bg-white/[0.05] rounded-xl">
            <Settings size={14} className="opacity-50" /> System_Config
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-pink-100/20 hover:text-white transition-all hover:bg-white/[0.05] rounded-xl">
            <HelpCircle size={14} className="opacity-50" /> Documentation
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 rounded-[1.5rem] glass-card border-white/10 relative group cursor-pointer active:scale-95 transition-all overflow-hidden bg-white/5">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 border border-white/20 shadow-xl shrink-0 flex items-center justify-center text-white/80 font-black italic">
               {user.name.charAt(0)}
            </div>
            <div className="hidden md:block overflow-hidden text-left">
              <p className="text-[11px] font-black uppercase tracking-widest truncate text-glow text-pink-50">{user.name}</p>
              <p className="text-[9px] font-black text-pink-100/30 uppercase tracking-tighter">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
