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
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface Doc {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export default function Docs({ activeModule }: { activeModule: string }) {
  const initialDocs = React.useMemo(() => [
    { 
      id: '1', 
      title: 'Matrix_Architecture_v1', 
      content: '# Matrix Architecture\n\nThis document outlines the core architecture of WhisperXCanvas.\n\n## Core Engine\nThe canvas engine is built with React and Framer Motion for high-performance visual interaction.\n\n## Normalization\nIngestion pipeline utilizes serverless fragments for data isolation.', 
      updatedAt: 1713370000000 
    }
  ], []);

  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [mode, setMode] = useState<'editor' | 'preview' | 'split'>('split');

  if (activeModule !== 'docs') return null;

  const currentDoc = selectedDoc || docs[0];

  return (
    <div className="w-full h-full flex bg-transparent overflow-hidden p-6 gap-6">
      {/* Sidebar */}
      <div className="w-80 glass-panel border-white/10 flex flex-col bg-black/10 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-100/30 italic text-glow">Matrix_Registry</h3>
          </div>
          <button 
            onClick={() => {
              const newDoc = { id: Math.random().toString(), title: 'Untitled_Node', content: '', updatedAt: Date.now() };
              setDocs([newDoc, ...docs]);
              setSelectedDoc(newDoc);
            }}
            className="p-3 glass-button rounded-xl text-pink-300/40 hover:text-pink-400 transition-all active:scale-95 border-white/5"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {docs.map(doc => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={cn(
                "w-full text-left p-5 rounded-2xl transition-all group border relative overflow-hidden active:scale-[0.98]",
                (selectedDoc?.id === doc.id || (!selectedDoc && doc.id === '1')) 
                  ? "bg-white/15 border-white/20 shadow-[0_0_20px_rgba(255,126,179,0.1)]" 
                  : "hover:bg-white/[0.03] border-transparent"
              )}
            >
              <p className={cn(
                "text-sm font-black uppercase tracking-tight truncate relative z-10",
                (selectedDoc?.id === doc.id || (!selectedDoc && doc.id === '1')) ? "text-white text-glow" : "text-white/40 group-hover:text-white/60"
              )}>{doc.title}</p>
              <div className="flex items-center gap-2 mt-2 relative z-10">
                <Clock size={12} className="text-pink-300/20" />
                <p className="text-[9px] uppercase font-black tracking-widest text-pink-100/10">{new Date(doc.updatedAt).toLocaleDateString()}</p>
              </div>
              {(selectedDoc?.id === doc.id || (!selectedDoc && doc.id === '1')) && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Hub */}
      <div className="flex-1 flex flex-col overflow-hidden glass-panel rounded-[3rem] border-white/10 relative">
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-white/[0.02] relative z-10">
          <div className="flex items-center gap-8">
            <input 
              type="text" 
              value={currentDoc?.title || ''}
              onChange={(e) => {
                const updated = { ...currentDoc, title: e.target.value, updatedAt: Date.now() };
                setSelectedDoc(updated);
                setDocs(docs.map(d => d.id === currentDoc.id ? updated : d));
              }}
              className="bg-transparent text-2xl font-black uppercase italic tracking-tighter focus:outline-none w-80 text-glow text-white/90"
            />
            <div className="flex items-center gap-1 p-1.5 glass-panel rounded-2xl border-white/5 bg-black/5">
              {[
                { id: 'editor', label: 'Matrix' },
                { id: 'preview', label: 'Reality' },
                { id: 'split', label: 'Hybrid' }
              ].map(bt => (
                <button 
                  key={bt.id}
                  onClick={() => setMode(bt.id as any)}
                  className={cn(
                    "px-6 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
                    mode === bt.id ? "bg-white text-pink-600 shadow-xl" : "text-pink-100/20 hover:text-pink-100/40"
                  )}
                >
                  {bt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-3 px-6 py-3 bg-pink-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-500 transition-all shadow-[0_0_30px_rgba(219,39,119,0.3)] active:scale-95">
               <Save size={14} /> Commit Node
             </button>
             <button className="p-4 glass-button rounded-2xl text-pink-100/40 hover:text-pink-400 transition-all border-white/5"><Share2 size={20} /></button>
             <button className="p-4 glass-button rounded-2xl text-pink-100/40 hover:text-red-400 transition-all border-white/5"><Trash2 size={20} /></button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden relative z-10">
          {(mode === 'editor' || mode === 'split') && (
            <textarea 
              value={currentDoc?.content || ''}
              onChange={(e) => {
                const updated = { ...currentDoc, content: e.target.value, updatedAt: Date.now() };
                setSelectedDoc(updated);
                setDocs(docs.map(d => d.id === currentDoc.id ? updated : d));
              }}
              placeholder="Inject matrix content..."
              className={cn(
                "bg-transparent p-12 text-pink-50/70 leading-relaxed font-mono text-sm focus:outline-none resize-none scrollbar-hide border-r border-white/5",
                mode === 'editor' ? "flex-1" : "w-1/2"
              )}
            />
          )}
          {(mode === 'preview' || mode === 'split') && (
            <div className={cn(
              "p-12 overflow-y-auto scrollbar-hide bg-black/5",
              mode === 'preview' ? "flex-1" : "w-1/2"
            )}>
              <div className="max-w-3xl mx-auto">
                <div className="prose prose-invert prose-pink prose-xl max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-headings:text-glow">
                  <ReactMarkdown>{currentDoc?.content || ''}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
