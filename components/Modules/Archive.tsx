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
    <div className="w-full h-full flex flex-col bg-transparent p-6 space-y-6">
      <header className="p-8 glass-panel rounded-[3rem] border-white/10 flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-glow text-white/90">Archive Matrix</h1>
          <p className="text-[10px] text-pink-300/40 font-black uppercase tracking-[0.2em]">System-Wide Source & Legacy Records</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-300/20" size={16} />
            <input 
              type="text" 
              placeholder="Search archive repository..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-input rounded-2xl pl-12 pr-4 py-4 text-xs font-black uppercase tracking-widest border-white/5"
            />
          </div>
          <button className="p-4 glass-button rounded-2xl text-pink-300/40 hover:text-pink-400 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 glass-panel rounded-[3rem] border-white/10 overflow-hidden relative z-10 bg-black/10 overflow-y-auto scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#0f050a]/80 backdrop-blur-xl z-20">
            <tr className="border-b border-white/5">
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-pink-100/20">Name / Metadata</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-pink-100/20">Category</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-pink-100/20">Payload</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-pink-100/20">Temporal_Marker</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-pink-100/20 text-right">Rituals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredRecords.map((record) => (
              <tr key={record.id} className="hover:bg-pink-500/[0.03] transition-colors group cursor-pointer">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-pink-500/5 rounded-2xl border border-pink-500/10 flex items-center justify-center text-pink-300/20 group-hover:text-pink-400 group-hover:bg-pink-500/10 transition-all duration-300">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight text-white/80 group-hover:text-white transition-colors">{record.name}</p>
                      <p className="text-[9px] text-pink-100/10 font-black uppercase tracking-widest mt-1">ID: {record.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <span className="px-3 py-1 bg-pink-500/5 border border-pink-500/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-pink-400 group-hover:shadow-[0_0_10px_rgba(255,126,179,0.2)] transition-all">
                    {record.sourceCategory}
                  </span>
                </td>
                <td className="px-10 py-6 text-[10px] font-black text-pink-100/20 uppercase tracking-widest">
                  {(record.size / 1024).toFixed(1)} KB
                </td>
                <td className="px-10 py-6 text-[10px] font-black text-pink-300/30 uppercase tracking-[0.1em]">
                  {new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center justify-end gap-3 opacity-20 group-hover:opacity-100 transition-all duration-300">
                    <button className="p-3 hover:bg-pink-500/10 rounded-xl text-pink-100/40 hover:text-pink-400 transition-all" title="Open in Canvas">
                      <Layers size={18} />
                    </button>
                    <button className="p-3 hover:bg-pink-500/10 rounded-xl text-pink-100/40 hover:text-pink-400 transition-all" title="View Source">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredRecords.length === 0 && (
          <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-6 opacity-20">
            <div className="w-24 h-24 rounded-full bg-pink-500/5 flex items-center justify-center border border-pink-500/10 animate-pulse">
              <Database size={48} className="text-pink-300/20" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-100/40">Repository scan empty • no records detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
