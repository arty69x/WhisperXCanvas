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
  Command,
  Play,
  Activity
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
  const { user, entities, updateEntity } = useAppStore();

  const runSimulation = () => {
    // Basic simulation logic: cycle through nodes and set them to running
    entities.forEach((entity, index) => {
        setTimeout(() => {
            updateEntity(entity.id, { executionStatus: 'running' });
            setTimeout(() => {
                updateEntity(entity.id, { executionStatus: 'success' });
            }, 3000);
        }, index * 1000);
    });
  };

  return (
    <div className="w-16 md:w-64 h-full bg-white border-r border-gray-100 flex flex-col transition-all duration-800 overflow-hidden z-20 shadow-sm md:ml-4 md:my-4 md:rounded-3xl md:h-[calc(100vh-2rem)]">
      {/* Brand Section */}
      <div className="p-8 flex items-center gap-4 relative">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shrink-0 group cursor-pointer hover:rotate-12 transition-transform duration-500 shadow-xl shadow-black/10">
          <Command size={24} className="text-white group-hover:scale-110 transition-transform" />
        </div>
        <div className="hidden md:block overflow-hidden">
          <h1 className="font-black text-lg tracking-tighter uppercase leading-none text-gray-900">WhisperX</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Studio_v2.0</p>
        </div>
      </div>
      
      {/* Engine Status */}
      <div className="px-8 pb-4 hidden md:block">
        <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-brand-green rounded-full shadow-[0_0_10px_#22c55e] animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">Engine_Status</span>
           </div>
           <span className="text-[8px] font-black text-brand-blue uppercase tracking-widest">Optimal</span>
        </div>
      </div>
      
      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide px-4 space-y-1">
        <div className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 hidden md:block border-b border-gray-50 mb-4">Navigation</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] transition-all group relative border",
              activeModule === item.id 
                ? "bg-gray-900 text-white border-transparent shadow-lg shadow-gray-200" 
                : "text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            {activeModule === item.id && (
              <motion.div 
                layoutId="active-indicator"
                className="absolute left-0 w-1.5 h-6 bg-brand-orange rounded-full" 
              />
            )}
            <item.icon size={18} className={cn(
              "shrink-0 transition-all duration-300",
              activeModule === item.id ? "text-white" : "text-gray-400 group-hover:text-gray-600 group-hover:scale-110"
            )} />
            <span className={cn(
              "hidden md:block font-bold uppercase tracking-wider transition-all",
              activeModule === item.id ? "text-white" : "text-gray-500 group-hover:text-gray-900"
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
      
      {/* Footer Section */}
      <div className="p-6 space-y-6">
        <div className="space-y-4 hidden md:block border-t border-gray-50 pt-6">
          <button 
            onClick={runSimulation}
            className="w-full p-4 rounded-xl flex items-center justify-center gap-3 bg-brand-blue text-white group hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Activity size={14} className="group-hover:scale-125 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Diagnostics</span>
          </button>
          
          <div className="space-y-0.5">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all hover:bg-gray-50 rounded-lg">
              <Settings size={14} className="opacity-70" /> Configuration
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all hover:bg-gray-50 rounded-lg">
              <HelpCircle size={14} className="opacity-70" /> Resources
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3 rounded-2xl border border-gray-100 relative group cursor-pointer active:scale-95 transition-all overflow-hidden bg-gray-50/50 hover:bg-white hover:border-gray-200">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 shadow-xl shrink-0 flex items-center justify-center text-white font-black italic">
               {user.name.charAt(0)}
            </div>
            <div className="hidden md:block overflow-hidden text-left flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wide truncate text-gray-900">{user.name}</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-brand-green rounded-full" />
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
