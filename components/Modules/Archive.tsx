import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Database, 
  History, 
  Layers, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { getArchiveRecords, EmbeddedRecord } from '@/lib/archive';
import { cn } from '@/lib/utils';

export default function Archive({ activeModule }: { activeModule: string }) {
  const [records, setRecords] = useState<EmbeddedRecord[]>(() => getArchiveRecords());
  const [search, setSearch] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecords(getArchiveRecords());
  }, [activeModule]);

  if (activeModule !== 'archive') return null;

  const filteredRecords = records.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0a]">
      <header className="p-8 border-b border-white/10 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Archive</h1>
          <p className="text-xs text-white/40 font-bold uppercase tracking-wider">System-Wide Source & Legacy Records</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            <input 
              type="text" 
              placeholder="Search archive..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-white/30"
            />
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#0a0a0a] z-10">
            <tr className="border-b border-white/5">
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white/20">Name / Title</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white/20">Category</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white/20">Size</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white/20">Created At</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white/20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center text-white/20 group-hover:text-white transition-colors">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{record.name}</p>
                      <p className="text-[10px] text-white/20 font-mono uppercase">{record.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold uppercase text-white/40">{record.sourceCategory}</span>
                </td>
                <td className="px-8 py-4 text-[10px] font-mono text-white/40">
                  {(record.size / 1024).toFixed(1)} KB
                </td>
                <td className="px-8 py-4 text-[10px] font-bold text-white/20 uppercase">
                  {new Date(record.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/10 rounded text-white/40 hover:text-white" title="Open in Canvas">
                      <Layers size={14} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded text-white/40 hover:text-white" title="View Source">
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredRecords.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
            <Database size={48} />
            <p className="text-xs font-bold uppercase tracking-widest">No records found in archive</p>
          </div>
        )}
      </div>
    </div>
  );
}
