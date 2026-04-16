import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  Grid, 
  List as ListIcon, 
  Upload, 
  MoreVertical, 
  ExternalLink,
  FileText,
  Image as ImageIcon,
  FileCode,
  File as FileIcon,
  Lock as LockIcon
} from 'lucide-react';
import { getArchiveRecords, EmbeddedRecord, addArchiveRecord } from '@/lib/archive';
import { cn } from '@/lib/utils';

export default function Vault({ activeModule }: { activeModule: string }) {
  const [records, setRecords] = useState<EmbeddedRecord[]>(() => getArchiveRecords());
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecords(getArchiveRecords());
  }, [activeModule]);

  if (activeModule !== 'vault') return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const newRecord = addArchiveRecord({
        name: file.name,
        title: file.name.split('.')[0],
        ext: file.name.split('.').pop() || '',
        mime: file.type,
        size: file.size,
        tags: ['imported'],
        sourceCategory: 'user-upload',
        origin: 'vault',
        base64Fallback: base64
      });
      setRecords(prev => [...prev, newRecord]);
    };
    reader.readAsDataURL(file);
  };

  const filteredRecords = records.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      <header className="p-8 border-b border-white/10 space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-glow">Vault</h1>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Secure Asset Storage & Ingestion</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95">
              <Upload size={14} />
              Import Asset
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text" 
              placeholder="Search assets by name, tag, or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-input rounded-2xl pl-12 pr-4 py-4 text-sm"
            />
          </div>
          <div className="flex items-center gap-1 glass-card p-1 rounded-2xl border-none">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-white/10 text-white shadow-inner" : "text-white/20 hover:text-white")}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2.5 rounded-xl transition-all", viewMode === 'list' ? "bg-white/10 text-white shadow-inner" : "text-white/20 hover:text-white")}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide relative z-10">
        {filteredRecords.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
            <LockIcon size={64} className="text-white/20" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">No assets found in vault</p>
          </div>
        ) : (
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-2"
          )}>
            {filteredRecords.map((record) => (
              <AssetCard key={record.id} record={record} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AssetCard({ record, viewMode }: { record: EmbeddedRecord, viewMode: 'grid' | 'list' }) {
  const Icon = record.mime.startsWith('image/') ? ImageIcon : 
               record.mime.includes('pdf') ? FileText :
               record.mime.includes('javascript') || record.mime.includes('typescript') ? FileCode :
               FileIcon;

  if (viewMode === 'list') {
    return (
      <div className="group p-4 glass-card rounded-2xl flex items-center justify-between cursor-pointer border-none">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-white transition-all group-hover:scale-110">
            <Icon size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-tight">{record.name}</span>
            <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">{record.mime}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[10px] text-white/20 font-mono tracking-tighter">{(record.size / 1024).toFixed(1)} KB</span>
          <button className="p-2 hover:bg-white/10 rounded-xl text-white/20 hover:text-white transition-all">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group glass-card rounded-3xl overflow-hidden flex flex-col border-none">
      <div className="aspect-video bg-black/40 flex items-center justify-center relative overflow-hidden">
        {record.mime.startsWith('image/') && record.base64Fallback ? (
          <div className="relative w-full h-full">
            <Image 
              src={record.base64Fallback} 
              alt={record.title} 
              fill
              className="object-cover opacity-60 group-hover:opacity-100 transition-all group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <Icon size={48} className="text-white/10 group-hover:text-white/20 transition-all group-hover:scale-110" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-4 backdrop-blur-[2px]">
          <button className="w-full py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
            Open in Reader
          </button>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 overflow-hidden">
            <h4 className="text-sm font-black uppercase tracking-tight truncate">{record.title}</h4>
            <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">{record.ext} • {(record.size / 1024).toFixed(1)} KB</p>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-xl text-white/20 hover:text-white transition-all">
            <MoreVertical size={16} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {record.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-white/5 rounded-lg text-[9px] font-black uppercase text-white/40 tracking-widest border border-white/5">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
