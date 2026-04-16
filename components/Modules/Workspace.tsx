import React from 'react';
import CanvasEngine from '@/components/Canvas/CanvasEngine';
import { useWorkspaceStore } from '@/lib/store';
import Inspector from '@/components/Canvas/Inspector';
import { Plus, Layout, Save, Trash2, FileText, FileJson } from 'lucide-react';

export default function Workspace({ activeModule }: { activeModule: string }) {
  const store = useWorkspaceStore();

  if (activeModule !== 'workspace') return null;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-12 border-b border-white/10 bg-[#1a1a1a] flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Workspace</h2>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => store.addEntity({
                type: 'ai-chat-panel',
                title: 'AI Assistant',
                x: 100,
                y: 100,
                width: 300,
                height: 400
              })}
              className="p-1.5 hover:bg-white/5 rounded text-white/60 hover:text-white transition-colors"
              title="Add AI Panel"
            >
              <Plus size={16} />
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
              className="p-1.5 hover:bg-white/5 rounded text-white/60 hover:text-white transition-colors"
              title="Add Summary Panel"
            >
              <FileText size={16} />
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
              className="p-1.5 hover:bg-white/5 rounded text-white/60 hover:text-white transition-colors"
              title="Add Doc Panel"
            >
              <FileJson size={16} />
            </button>
            <button className="p-1.5 hover:bg-white/5 rounded text-white/60 hover:text-white transition-colors" title="Layout Presets">
              <Layout size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-black rounded text-[10px] font-bold uppercase tracking-wider hover:bg-white/90 transition-colors">
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
            className="p-1.5 hover:bg-red-500/20 rounded text-white/20 hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        <CanvasEngine 
          entities={store.entities}
          zoom={store.zoom}
          pan={store.pan}
          selectedEntityIds={store.selectedEntityIds}
          onEntityUpdate={store.updateEntity}
          onEntitySelect={store.selectEntity}
          onEntityRemove={store.removeEntity}
          onPanChange={store.setPan}
          onZoomChange={store.setZoom}
          onClearSelection={store.clearSelection}
          onFitToView={store.fitToView}
        />
        
        {/* Inspector Sidebar */}
        <Inspector 
          selectedEntities={store.entities.filter(e => store.selectedEntityIds.includes(e.id))}
          onUpdate={store.updateEntity}
          onRemove={store.removeEntity}
        />
      </div>
    </div>
  );
}
