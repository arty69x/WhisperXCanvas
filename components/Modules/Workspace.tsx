import React from 'react';
import CanvasEngine from '@/components/Canvas/CanvasEngine';
import { useWorkspaceStore } from '@/lib/store';
import Inspector from '@/components/Canvas/Inspector';
import { Plus, Layout, Save, Trash2, FileText, FileJson, Upload, Database, Sparkles } from 'lucide-react';
import { processFile } from '@/lib/ingestion';

export default function Workspace({ activeModule }: { activeModule: string }) {
  const store = useWorkspaceStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (activeModule !== 'workspace') return null;

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const record = await processFile(file);
      store.addRecordToVault(record);
      
      // Auto-spawn on canvas
      store.addEntity({
        type: record.renderType,
        title: record.name,
        subtitle: record.kind.toUpperCase(),
        x: Math.random() * 300 + 100,
        y: Math.random() * 300 + 100,
        width: 400,
        height: 500,
        payload: { recordId: record.id }
      });
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden">
      {/* Toolbar */}
      <div className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-3xl flex items-center justify-between px-10 z-[100] relative">
        <div className="flex items-center gap-10">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-100/20 italic text-glow">Workspace_Matrix</h2>
            <p className="text-[8px] font-black tracking-widest text-pink-500/40 uppercase mt-0.5 animate-pulse">Neural_Link: Active</p>
          </div>
          
          <div className="flex items-center gap-1.5 glass-panel p-1.5 rounded-2xl border-white/5 bg-black/5">
            <button 
              onClick={() => store.addEntity({
                type: 'ai-chat-panel',
                title: 'AI_Assistant',
                x: 100,
                y: 100,
                width: 350,
                height: 500
              })}
              className="p-3 hover:bg-white/10 rounded-xl text-pink-100/20 hover:text-pink-400 transition-all active:scale-90 border border-transparent hover:border-pink-500/20"
              title="Spawn AI Node"
            >
              <Plus size={18} />
            </button>
            <button 
              onClick={() => store.addEntity({
                type: 'summary-panel',
                title: 'System_Summary',
                x: 450,
                y: 100,
                width: 350,
                height: 300
              })}
              className="p-3 hover:bg-white/10 rounded-xl text-pink-100/20 hover:text-pink-400 transition-all active:scale-90 border border-transparent hover:border-pink-500/20"
              title="Spawn Intelligence Summary"
            >
              <FileText size={18} />
            </button>
            <button 
              onClick={() => store.addEntity({
                type: 'doc',
                title: 'New_Registry_Node',
                x: 100,
                y: 550,
                width: 450,
                height: 350
              })}
              className="p-3 hover:bg-white/10 rounded-xl text-pink-100/20 hover:text-pink-400 transition-all active:scale-90 border border-transparent hover:border-pink-500/20"
              title="Spawn Documentation Node"
            >
              <FileJson size={18} />
            </button>
            <div className="w-px h-5 bg-white/5 mx-2" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 hover:bg-pink-500/20 rounded-xl text-pink-400/40 hover:text-pink-400 transition-all active:scale-90 border border-transparent hover:border-pink-500/30" 
              title="Import Vector Record"
            >
              <Upload size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileImport} 
              className="hidden" 
              multiple 
            />
            <button 
              onClick={() => store.setActiveModule('vault')}
              className="p-3 hover:bg-white/10 rounded-xl text-pink-100/20 hover:text-pink-400 transition-all active:scale-90 border border-transparent hover:border-pink-500/20" 
              title="Access Vault Matrix"
            >
              <Database size={18} />
            </button>
            <button 
              onClick={() => store.setActiveModule('ai')}
              className="p-3 hover:bg-white/10 rounded-xl text-pink-100/20 hover:text-pink-400 transition-all active:scale-90 border border-transparent hover:border-pink-500/20 shadow-[0_0_15px_rgba(255,126,179,0.05)]" 
              title="Neural Intelligence Core"
            >
              <Sparkles size={18} />
            </button>
            <div className="w-px h-5 bg-white/5 mx-2" />
            <button className="p-3 hover:bg-white/10 rounded-xl text-pink-100/20 hover:text-pink-400 transition-all active:scale-90 border border-transparent hover:border-pink-500/20" title="Spatial Configuration Presets">
              <Layout size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 px-6 py-3 glass-panel hover:bg-pink-500/10 border-white/10 text-white/80 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 group">
            <Save size={14} className="group-hover:text-pink-400 transition-colors" />
            Commit Configuration
          </button>
          <button 
            onClick={() => {
              if (confirm('De-serialize all active nodes?')) {
                store.entities.forEach(e => store.removeEntity(e.id));
              }
            }}
            className="p-3.5 hover:bg-red-500/20 rounded-2xl text-pink-100/10 hover:text-red-400 transition-all active:scale-90 border border-white/5"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        <CanvasEngine />
        
        {/* Inspector Sidebar */}
        <Inspector />
      </div>
    </div>
  );
}
