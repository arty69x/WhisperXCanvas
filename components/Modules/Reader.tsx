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
  Split
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
    <div className="w-full h-full flex bg-[#0a0a0a] overflow-hidden">
      {/* Sidebar - Record List */}
      <div className="w-64 border-r border-white/10 flex flex-col bg-[#0f0f0f]">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <BookOpen size={14} className="text-white/40" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest">Library</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
          {records.map(record => (
            <button
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all group",
                selectedRecord?.id === record.id ? "bg-white/10 border border-white/10" : "hover:bg-white/5 border border-transparent"
              )}
            >
              <p className={cn(
                "text-xs font-bold truncate",
                selectedRecord?.id === record.id ? "text-white" : "text-white/40 group-hover:text-white/60"
              )}>{record.title}</p>
              <p className="text-[9px] uppercase font-bold text-white/20">{record.ext} • {(record.size / 1024).toFixed(1)} KB</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Reader View */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedRecord ? (
          <>
            <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0a]">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-black uppercase italic tracking-tight">{selectedRecord.title}</h2>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-bold uppercase text-white/40">v1.0</span>
                  <span className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-bold uppercase text-white/40">Draft</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"><Search size={16} /></button>
                <button className="p-2 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"><Type size={16} /></button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button className="p-2 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"><Split size={16} /></button>
                <button className="p-2 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"><Maximize2 size={16} /></button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-black tracking-tighter uppercase italic">{selectedRecord.title}</h1>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                    <span>Source: {selectedRecord.origin}</span>
                    <span>•</span>
                    <span>Created: {new Date(selectedRecord.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="p-8 bg-white/5 border border-white/5 rounded-2xl min-h-[400px] text-white/60 leading-relaxed font-serif text-lg">
                    {selectedRecord.parsedText || selectedRecord.searchableText || (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                        <FileText size={48} />
                        <p className="text-sm font-bold uppercase tracking-widest">No text content available</p>
                        <p className="text-xs italic">This asset may be a binary file or image without OCR.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <footer className="h-10 border-t border-white/10 bg-[#0f0f0f] flex items-center justify-between px-6">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <span>Page 1 of 1</span>
                <span>•</span>
                <span>Words: 0</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-white/5 rounded text-white/20 hover:text-white"><ChevronLeft size={14} /></button>
                <button className="p-1.5 hover:bg-white/5 rounded text-white/20 hover:text-white"><ChevronRight size={14} /></button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
            <BookOpen size={64} />
            <p className="text-sm font-bold uppercase tracking-widest">Select a record to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
