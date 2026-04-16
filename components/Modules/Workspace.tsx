import React from 'react';
import CanvasEngine from '@/components/Canvas/CanvasEngine';
import { useWorkspaceStore } from '@/lib/store';
import Inspector from '@/components/Canvas/Inspector';
import { Plus, Layout, Save, Trash2, FileText, FileJson, Upload, Database } from 'lucide-react';
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
    <div className="w-full h-full flex flex-col bg-transparent">
      {/* Toolbar */}
      <div className="h-12 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Workspace</h2>
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
            <button 
              onClick={() => store.addEntity({
                type: 'ai-chat-panel',
                title: 'AI Assistant',
                x: 100,
                y: 100,
                width: 300,
                height: 400
              })}
              className="p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-white transition-all active:scale-90"
              title="Add AI Panel"
            >
              <Plus size={14} />
            </button>
            <button 
              onClick={() => store.addEntity({
                type: 'summary-panel',
                title: 'System Summary',
                x: 450,
                y: 100,
                width: 300,
                height: 250
              })}
              className="p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-white transition-all active:scale-90"
              title="Add Summary Panel"
            >
              <FileText size={14} />
            </button>
            <button 
              onClick={() => store.addEntity({
                type: 'doc',
                title: 'New Document',
                x: 100,
                y: 550,
                width: 400,
                height: 300
              })}
              className="p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-white transition-all active:scale-90"
              title="Add Doc Panel"
            >
              <FileJson size={14} />
            </button>
            <div className="w-px h-3 bg-white/10 mx-1" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 hover:bg-blue-500/20 rounded-md text-blue-400/60 hover:text-blue-400 transition-all active:scale-90" 
              title="Import Record"
            >
              <Upload size={14} />
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
              className="p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-white transition-all active:scale-90" 
              title="Open Vault"
            >
              <Database size={14} />
            </button>
            <div className="w-px h-3 bg-white/10 mx-1" />
            <button className="p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-white transition-all active:scale-90" title="Layout Presets">
              <Layout size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
            <Save size={12} />
            Save Preset
          </button>
          <button 
            onClick={() => {
              if (confirm('Clear workspace?')) {
                // Clear all entities
                store.entities.forEach(e => store.removeEntity(e.id));
              }
            }}
            className="p-2 hover:bg-red-500/20 rounded-lg text-white/20 hover:text-red-400 transition-all active:scale-90"
          >
            <Trash2 size={14} />
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
