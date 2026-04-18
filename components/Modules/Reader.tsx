import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Type, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Settings,
  Split,
  Database
} from 'lucide-react';
import { getArchiveRecords, EmbeddedRecord } from '@/lib/archive';
import { cn } from '@/lib/utils';

export default function Reader({ activeModule }: { activeModule: string }) {
  const [records, setRecords] = useState<EmbeddedRecord[]>(() => getArchiveRecords());
  const [selectedRecord, setSelectedRecord] = useState<EmbeddedRecord | null>(() => {
    const all = getArchiveRecords();
    return all.length > 0 ? all[0] : null;
  });

  useEffect(() => {
    const all = getArchiveRecords();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecords(all);
    if (all.length > 0 && !selectedRecord) {
      setSelectedRecord(all[0]);
    }
  }, [activeModule, selectedRecord]);

  if (activeModule !== 'reader') return null;

  return (
    <div className="w-full h-full flex bg-transparent overflow-hidden p-6 gap-6">
      {/* Sidebar - Record List */}
      <div className="w-80 glass-panel border-white/10 flex flex-col bg-black/5 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-pink-500/10 flex items-center justify-center">
            <BookOpen size={16} className="text-pink-400" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Library Core</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {records.map(record => (
            <button
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className={cn(
                "w-full text-left p-5 rounded-2xl transition-all group relative overflow-hidden active:scale-[0.98]",
                selectedRecord?.id === record.id 
                  ? "bg-white/15 border-white/20 shadow-[0_0_20px_rgba(255,126,179,0.15)]" 
                  : "hover:bg-white/5 border-transparent"
              )}
            >
              <p className={cn(
                "text-sm font-black uppercase tracking-tight truncate relative z-10",
                selectedRecord?.id === record.id ? "text-white" : "text-white/40 group-hover:text-white/60"
              )}>{record.title}</p>
              <p className="text-[9px] uppercase font-black tracking-widest text-pink-100/10 mt-1 relative z-10">{record.ext} • {(record.size / 1024).toFixed(1)} KB</p>
              {selectedRecord?.id === record.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Reader View */}
      <div className="flex-1 flex flex-col overflow-hidden glass-panel rounded-[3rem] border-white/10 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400/30 to-transparent" />
        
        {selectedRecord ? (
          <>
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.02]">
              <div className="flex items-center gap-6">
                <h2 className="text-lg font-black uppercase italic tracking-tighter text-glow text-white/90">{selectedRecord.title}</h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-pink-500/5 border border-pink-500/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-pink-300">v1.2</span>
                  <span className="px-3 py-1 bg-pink-500/5 border border-pink-500/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-pink-300">Classified</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 glass-button rounded-xl text-pink-100/40 hover:text-pink-400 transition-all"><Search size={18} /></button>
                <button className="p-3 glass-button rounded-xl text-pink-100/40 hover:text-pink-400 transition-all"><Type size={18} /></button>
                <div className="w-px h-6 bg-white/5 mx-2" />
                <button className="p-3 glass-button rounded-xl text-pink-100/40 hover:text-pink-400 transition-all"><Split size={18} /></button>
                <button className="p-3 glass-button rounded-xl text-pink-100/40 hover:text-pink-400 transition-all"><Maximize2 size={18} /></button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-16 scrollbar-hide selection:bg-pink-500/30">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-4 text-center">
                  <h1 className="text-5xl font-black tracking-tighter uppercase italic text-glow text-white/90 leading-tight">{selectedRecord.title}</h1>
                  <div className="flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-pink-100/10">
                    <span className="flex items-center gap-2 text-pink-300/40"><Database size={12} /> {selectedRecord.origin}</span>
                    <span className="w-1.5 h-1.5 bg-pink-500/20 rounded-full" />
                    <span>Created: {new Date(selectedRecord.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-4 bg-pink-500/[0.02] blur-3xl rounded-[3rem] pointer-events-none" />
                  <div className="relative p-12 glass-panel rounded-[2.5rem] min-h-[500px] text-pink-50/70 leading-relaxed font-serif text-xl border-white/5 shadow-inner">
                    <div className="columns-1 gap-12 text-justify">
                      {selectedRecord.parsedText || selectedRecord.searchableText || (
                        <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-6 opacity-20">
                          <FileText size={64} className="text-pink-300/20" />
                          <p className="text-sm font-black uppercase tracking-[0.3em] text-pink-100/20">Empty Matrix Structure</p>
                          <p className="text-xs italic font-sans max-w-xs">Binary node detected • linguistic extraction requires deep-scan augmentation.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="h-14 border-t border-white/5 bg-black/10 flex items-center justify-between px-8">
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-pink-300/20">
                <span className="text-pink-400 font-black">Page 01</span>
                <span className="opacity-30">/</span>
                <span className="opacity-30">Total 01</span>
                <div className="w-px h-4 bg-white/5 mx-2" />
                <span>Reading Index: Stable</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-pink-500/10 rounded-xl text-pink-100/20 hover:text-pink-400 transition-all"><ChevronLeft size={20} /></button>
                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="w-1/3 h-full bg-pink-500 shadow-[0_0_10px_#ff7eb3]" />
                </div>
                <button className="p-2 hover:bg-pink-500/10 rounded-xl text-pink-100/20 hover:text-pink-400 transition-all"><ChevronRight size={20} /></button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-20">
             <div className="w-24 h-24 rounded-full bg-pink-500/5 flex items-center justify-center border border-pink-500/10 animate-pulse">
                <BookOpen size={48} className="text-pink-300/20" />
             </div>
            <p className="text-sm font-black uppercase tracking-[0.4em] text-pink-100/40">Repository Scan Required</p>
            <p className="text-xs text-pink-300/20 font-bold uppercase">Select a node from library to initialize reader</p>
          </div>
        )}
      </div>
    </div>
  );
}
