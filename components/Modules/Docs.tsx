import React, { useState } from 'react';
import { 
  FileJson, 
  Plus, 
  Search, 
  MoreVertical, 
  FileText, 
  Clock, 
  ChevronRight,
  Save,
  Share2,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Doc {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export default function Docs({ activeModule }: { activeModule: string }) {
  const initialDocs = React.useMemo(() => [
    // eslint-disable-next-line react-hooks/purity
    { id: '1', title: 'System Architecture v1', content: '# System Architecture\n\nThis document outlines the core architecture of WhisperXStudio.', updatedAt: Date.now() }
  ], []);

  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);

  if (activeModule !== 'docs') return null;

  return (
    <div className="w-full h-full flex bg-[#0a0a0a] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 flex flex-col bg-[#0f0f0f]">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileJson size={14} className="text-white/40" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Documents</h3>
          </div>
          <button 
            onClick={() => {
              const newDoc = { id: Math.random().toString(), title: 'Untitled Doc', content: '', updatedAt: Date.now() };
              setDocs([newDoc, ...docs]);
              setSelectedDoc(newDoc);
            }}
            className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
          {docs.map(doc => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all group",
                selectedDoc?.id === doc.id ? "bg-white/10 border border-white/10" : "hover:bg-white/5 border border-transparent"
              )}
            >
              <p className={cn(
                "text-xs font-bold truncate",
                selectedDoc?.id === doc.id ? "text-white" : "text-white/40 group-hover:text-white/60"
              )}>{doc.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock size={10} className="text-white/20" />
                <p className="text-[9px] uppercase font-bold text-white/20">{new Date(doc.updatedAt).toLocaleDateString()}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedDoc ? (
          <>
            <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0a]">
              <input 
                type="text" 
                value={selectedDoc.title}
                onChange={(e) => {
                  const updated = { ...selectedDoc, title: e.target.value, updatedAt: Date.now() };
                  setSelectedDoc(updated);
                  setDocs(docs.map(d => d.id === selectedDoc.id ? updated : d));
                }}
                className="bg-transparent text-sm font-black uppercase italic tracking-tight focus:outline-none w-64"
              />
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">
                  <Save size={12} /> Save
                </button>
                <button className="p-2 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"><Share2 size={16} /></button>
                <button className="p-2 hover:bg-red-500/20 rounded text-white/40 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
              <textarea 
                value={selectedDoc.content}
                onChange={(e) => {
                  const updated = { ...selectedDoc, content: e.target.value, updatedAt: Date.now() };
                  setSelectedDoc(updated);
                  setDocs(docs.map(d => d.id === selectedDoc.id ? updated : d));
                }}
                placeholder="Start writing..."
                className="flex-1 bg-transparent p-12 text-white/80 leading-relaxed font-mono text-sm focus:outline-none resize-none scrollbar-hide"
              />
              <div className="w-64 border-l border-white/10 p-6 space-y-6 bg-[#0f0f0f]">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Outline</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <ChevronRight size={12} /> Introduction
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <ChevronRight size={12} /> Core Engine
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <ChevronRight size={12} /> Conclusion
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
            <FileJson size={64} />
            <p className="text-sm font-bold uppercase tracking-widest">Select or create a document</p>
          </div>
        )}
      </div>
    </div>
  );
}
