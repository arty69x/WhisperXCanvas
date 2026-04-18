import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Search, 
  Grid, 
  List as ListIcon, 
  Upload, 
  MoreVertical, 
  FileText,
  Image as ImageIcon,
  FileCode,
  File as FileIcon,
  Lock as LockIcon,
  Layout,
  Plus
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { processFile } from '@/lib/ingestion';
import { IngestedRecord } from '@/types/canvas';
import { cn } from '@/lib/utils';

export default function Vault({ activeModule }: { activeModule: string }) {
  const vault = useAppStore((state) => state.vault);
  const addRecord = useAppStore((state) => state.addRecordToVault);
  const addEntity = useAppStore((state) => state.addEntity);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (activeModule !== 'vault') return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const record = await processFile(file);
      addRecord(record);
    }
  };

  const filteredRecords = vault.filter(r => {
    const s = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(s) || 
      r.kind.toLowerCase().includes(s) ||
      (r.text && r.text.toLowerCase().includes(s))
    );
  });

  const spawnOnCanvas = (record: IngestedRecord) => {
    addEntity({
      type: record.renderType,
      title: record.name,
      subtitle: record.kind.toUpperCase(),
      x: 100,
      y: 100,
      width: 400,
      height: 500,
      payload: { recordId: record.id }
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent p-6 space-y-6">
      <header className="p-8 glass-panel rounded-[3rem] border-white/10 space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-glow text-white/90">Vault Storage</h1>
            <p className="text-[10px] text-pink-300/40 font-black uppercase tracking-[0.2em]">Secure Asset Storage & Ingestion Pipeline</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95">
              <Upload size={14} className="text-pink-600" />
              Import Asset
              <input type="file" className="hidden" onChange={handleFileUpload} multiple />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-300/20" size={16} />
            <input 
              type="text" 
              placeholder="Search assets by name, kind, or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-input rounded-2xl pl-12 pr-4 py-4 text-xs font-black uppercase tracking-widest border-white/5"
            />
          </div>
          <div className="flex items-center gap-1 glass-card p-1.5 rounded-2xl border-white/10">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-white/10 text-pink-400 shadow-inner" : "text-white/20 hover:text-white/40")}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2.5 rounded-xl transition-all", viewMode === 'list' ? "bg-white/10 text-pink-400 shadow-inner" : "text-white/20 hover:text-white/40")}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide relative z-10">
        {filteredRecords.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
            <div className="w-24 h-24 rounded-full bg-pink-500/5 flex items-center justify-center border border-pink-500/10">
              <LockIcon size={48} className="text-pink-300/20" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-100">No records in vault pipeline</p>
          </div>
        ) : (
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-3"
          )}>
            {filteredRecords.map((record) => (
              <AssetCard key={record.id} record={record} viewMode={viewMode} onSpawn={() => spawnOnCanvas(record)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AssetCard({ record, viewMode, onSpawn }: { record: IngestedRecord, viewMode: 'grid' | 'list', onSpawn: () => void }) {
  const Icon = record.kind === 'image' ? ImageIcon : 
               record.kind === 'pdf' ? FileText :
               record.renderType === 'code-preview' ? FileCode :
               FileIcon;

  if (viewMode === 'list') {
    return (
      <div className="group p-5 glass-card rounded-[1.8rem] flex items-center justify-between cursor-pointer border-none transition-all duration-300 hover:translate-x-1">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-pink-500/5 rounded-2xl flex items-center justify-center text-pink-400/40 group-hover:text-pink-400 group-hover:bg-pink-500/10 transition-all border border-pink-500/10">
            <Icon size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-tight text-white/90">{record.name}</span>
            <span className="text-[9px] text-pink-100/20 uppercase font-black tracking-widest mt-0.5">{record.mime} • {(record.size / 1024).toFixed(1)} KB</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onSpawn(); }}
            className="p-3 hover:bg-pink-500/10 rounded-xl text-pink-300/20 hover:text-pink-400 transition-all"
            title="Spawn on Canvas"
          >
            <Layout size={16} />
          </button>
          <button className="p-3 hover:bg-pink-500/10 rounded-xl text-pink-300/20 hover:text-pink-400 transition-all">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group glass-card rounded-[2.5rem] overflow-hidden flex flex-col border-none transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,126,179,0.2)]">
      <div className="aspect-video bg-black/40 flex items-center justify-center relative overflow-hidden border-b border-white/5">
        {record.kind === 'image' && record.base64 ? (
          <div className="relative w-full h-full">
            <Image 
              src={record.base64} 
              alt={record.name} 
              fill
              className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <Icon size={48} className="text-pink-300/10 group-hover:text-pink-400/20 transition-all duration-500 group-hover:scale-110" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-5 backdrop-blur-[4px] gap-3">
          <button 
            onClick={onSpawn}
            className="flex-1 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={14} className="text-pink-600" /> Canvas
          </button>
          <button className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
      <div className="p-6 space-y-1 relative">
        <h4 className="text-sm font-black uppercase tracking-tight truncate text-white/90">{record.name}</h4>
        <div className="flex items-center justify-between">
           <p className="text-[9px] text-pink-100/20 uppercase font-black tracking-widest">{record.ext} • {(record.size / 1024).toFixed(1)} KB</p>
           <span className="text-[8px] font-black uppercase text-pink-400/30 tracking-[0.2em]">{record.kind}</span>
        </div>
      </div>
    </div>
  );
}
