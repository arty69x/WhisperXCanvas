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
    <div className="w-full h-full flex flex-col bg-[#0a0a0a]">
      <header className="p-8 border-b border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Vault</h1>
            <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Secure Asset Storage & Ingestion</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-colors cursor-pointer">
              <Upload size={14} />
              Import Asset
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text" 
              placeholder="Search assets by name, tag, or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-lg transition-colors", viewMode === 'grid' ? "bg-white/10 text-white" : "text-white/20 hover:text-white")}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-lg transition-colors", viewMode === 'list' ? "bg-white/10 text-white" : "text-white/20 hover:text-white")}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        {filteredRecords.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
            <LockIcon size={64} />
            <p className="text-sm font-bold uppercase tracking-widest">No assets found in vault</p>
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
      <div className="group p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
            <Icon size={16} />
          </div>
          <span className="text-sm font-bold">{record.name}</span>
          <span className="text-[10px] text-white/20 uppercase font-bold">{record.mime}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-white/20 font-mono">{(record.size / 1024).toFixed(1)} KB</span>
          <button className="p-1 hover:bg-white/10 rounded text-white/20 hover:text-white">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-[#141414] border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all flex flex-col">
      <div className="aspect-video bg-black/40 flex items-center justify-center relative overflow-hidden">
        {record.mime.startsWith('image/') && record.base64Fallback ? (
          <div className="relative w-full h-full">
            <Image 
              src={record.base64Fallback} 
              alt={record.title} 
              fill
              className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <Icon size={48} className="text-white/10 group-hover:text-white/20 transition-colors" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <button className="w-full py-2 bg-white text-black rounded-lg text-[10px] font-bold uppercase tracking-widest">
            Open in Reader
          </button>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 overflow-hidden">
            <h4 className="text-sm font-bold truncate">{record.title}</h4>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">{record.ext} • {(record.size / 1024).toFixed(1)} KB</p>
          </div>
          <button className="p-1 hover:bg-white/5 rounded text-white/20 hover:text-white">
            <MoreVertical size={16} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {record.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-bold uppercase text-white/40">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
