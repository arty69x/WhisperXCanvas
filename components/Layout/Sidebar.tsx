import React from 'react';
import { 
  LayoutDashboard, 
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
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'workspace', label: 'Workspace', icon: SquareTerminal },
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
  return (
    <div className="w-16 md:w-64 h-screen bg-black/40 backdrop-blur-xl text-white border-r border-white/10 flex flex-col transition-all duration-300 overflow-hidden z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
          <span className="text-black font-black text-xl italic">W</span>
        </div>
        <div className="hidden md:block overflow-hidden">
          <h1 className="font-black text-sm tracking-tighter uppercase italic leading-none text-glow">WhisperX</h1>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Studio v1.0</p>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-hide px-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hidden md:block">Navigation</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all group relative",
              activeModule === item.id 
                ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-md" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            {activeModule === item.id && (
              <div className="absolute left-0 w-1 h-4 bg-white rounded-full shadow-[0_0_10px_white]" />
            )}
            <item.icon size={18} className={cn(
              "shrink-0 transition-transform group-hover:scale-110",
              activeModule === item.id ? "text-white" : "text-white/20"
            )} />
            <span className="hidden md:block font-bold uppercase tracking-widest text-[10px]">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 space-y-4">
        <div className="space-y-1 hidden md:block">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors glass-button border-none bg-transparent">
            <Settings size={14} /> Settings
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors glass-button border-none bg-transparent">
            <HelpCircle size={14} /> Support
          </button>
        </div>

        <div className="p-3 rounded-2xl glass-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20 shadow-lg shrink-0 accent-glow" />
            <div className="hidden md:block overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest truncate text-glow">Arty69x</p>
              <p className="text-[9px] font-bold text-white/20 uppercase">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
