import React, { useState } from 'react';
import { 
  Presentation, 
  Plus, 
  Layout, 
  Play, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Trash2,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Slide {
  id: string;
  title: string;
  content: string;
}

interface Deck {
  id: string;
  title: string;
  slides: Slide[];
  updatedAt: number;
}

export default function Slides({ activeModule }: { activeModule: string }) {
  const initialDecks = React.useMemo(() => [
    { 
      id: '1', 
      title: 'Mission_Briefing_v1', 
      slides: [
        { id: 's1', title: 'Initialization', content: 'WhisperXCanvas: The Future of Intelligence Visualization' },
        { id: 's2', title: 'Strategic Objective', content: 'Transforming disconnected data into agentic matrix structures.' }
      ],
      updatedAt: 1713370000000
    }
  ], []);

  const [decks, setDecks] = useState<Deck[]>(initialDecks);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  if (activeModule !== 'slides') return null;

  return (
    <div className="w-full h-full flex bg-transparent overflow-hidden p-6 gap-6">
      {/* Sidebar */}
      <div className="w-80 glass-panel border-white/10 flex flex-col bg-black/10 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <Presentation size={16} className="text-pink-400" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Decks Hub</h3>
          </div>
          <button className="p-3 glass-button rounded-xl text-pink-300/40 hover:text-pink-400 transition-all border-white/5">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {decks.map(deck => (
            <button
              key={deck.id}
              onClick={() => { setSelectedDeck(deck); setActiveSlideIndex(0); }}
              className={cn(
                "w-full text-left p-5 rounded-2xl transition-all group relative overflow-hidden active:scale-[0.98]",
                selectedDeck?.id === deck.id ? "bg-white/15 border-white/20 shadow-[0_0_20px_rgba(255,126,179,0.1)]" : "hover:bg-white/5 border-transparent"
              )}
            >
              <p className={cn(
                "text-sm font-black uppercase tracking-tight truncate relative z-10",
                selectedDeck?.id === deck.id ? "text-white" : "text-white/40 group-hover:text-white/60"
              )}>{deck.title}</p>
              <p className="text-[9px] uppercase font-black tracking-widest text-pink-100/10 mt-1 relative z-10">{deck.slides.length} Artifacts</p>
              {selectedDeck?.id === deck.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Slide Editor */}
      <div className="flex-1 flex flex-col overflow-hidden glass-panel rounded-[3rem] border-white/10 relative">
        {selectedDeck ? (
          <>
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-white/[0.02] relative z-10">
              <div className="flex items-center gap-6">
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-glow text-white/90">{selectedDeck.title}</h2>
                <div className="flex items-center gap-2">
                  <button className="p-3 glass-button rounded-xl text-pink-100/40 hover:text-pink-400 transition-all border-white/5"><Play size={18} /></button>
                  <button className="p-3 glass-button rounded-xl text-pink-100/40 hover:text-pink-400 transition-all border-white/5"><Settings size={18} /></button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-3 px-6 py-3 bg-pink-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-500 transition-all shadow-[0_0_30px_rgba(219,39,119,0.3)] active:scale-95">
                  <Play size={14} fill="currentColor" /> Present Matrix
                </button>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden bg-transparent relative z-10">
              {/* Slide Strip */}
              <div className="w-56 border-r border-white/5 p-6 space-y-6 overflow-y-auto scrollbar-hide bg-black/5">
                {selectedDeck.slides.map((slide, i) => (
                  <div 
                    key={slide.id}
                    onClick={() => setActiveSlideIndex(i)}
                    className={cn(
                      "aspect-video rounded-2xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all overflow-hidden relative group active:scale-95 bg-black/20",
                      activeSlideIndex === i 
                        ? "border-pink-500 shadow-[0_0_15px_rgba(255,126,179,0.2)]" 
                        : "border-white/5 hover:border-pink-500/30"
                    )}
                  >
                    <div className="absolute top-2 left-2 text-[10px] font-black text-pink-100/20">{String(i + 1).padStart(2, '0')}</div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-pink-100/40 truncate w-full px-4 text-center group-hover:text-pink-100/60 transition-colors">{slide.title}</span>
                  </div>
                ))}
                <button className="w-full aspect-video rounded-2xl border-2 border-dashed border-white/5 flex items-center justify-center text-pink-100/20 hover:text-pink-400 hover:border-pink-500/30 transition-all hover:bg-pink-500/5">
                  <Plus size={24} />
                </button>
              </div>

              {/* Slide Canvas */}
              <div className="flex-1 p-16 flex items-center justify-center bg-black/10 relative">
                <div className="aspect-video w-full max-w-5xl glass-panel border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-20 text-center space-y-12 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-50" />
                  <div className="absolute top-10 left-10 w-20 h-px bg-gradient-to-r from-pink-500/50 to-transparent" />
                  <div className="absolute top-10 left-10 w-px h-20 bg-gradient-to-b from-pink-500/50 to-transparent" />
                  
                  <h1 className="text-7xl font-black tracking-tighter uppercase italic text-glow relative z-10 text-white/90 leading-none">{selectedDeck.slides[activeSlideIndex].title}</h1>
                  <p className="text-2xl text-pink-50/60 leading-relaxed max-w-3xl relative z-10 font-bold uppercase tracking-tight">{selectedDeck.slides[activeSlideIndex].content}</p>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 glass-panel border-white/10 p-3 rounded-2xl shadow-2xl">
                  <button 
                    disabled={activeSlideIndex === 0}
                    onClick={() => setActiveSlideIndex(prev => prev - 1)}
                    className="p-3 hover:bg-pink-500/10 rounded-xl disabled:opacity-10 text-pink-300 transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <span className="text-xs font-black text-pink-100/30 uppercase tracking-[0.4em]">{activeSlideIndex + 1} <span className="opacity-30">/</span> {selectedDeck.slides.length}</span>
                  <button 
                    disabled={activeSlideIndex === selectedDeck.slides.length - 1}
                    onClick={() => setActiveSlideIndex(prev => prev + 1)}
                    className="p-3 hover:bg-pink-500/10 rounded-xl disabled:opacity-10 text-pink-300 transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>

              {/* Inspector */}
              <div className="w-80 border-l border-white/5 p-8 space-y-10 bg-black/10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-100/30 italic">Ritual_Config</h3>
                <div className="space-y-8">
                   <div className="space-y-3">
                     <label className="text-[9px] uppercase font-black tracking-widest text-pink-100/20">Matrix_Background</label>
                     <div className="w-full h-12 bg-pink-500/5 border border-pink-500/10 rounded-2xl cursor-pointer hover:bg-pink-500/10 transition-all" />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[9px] uppercase font-black tracking-widest text-pink-100/20">Structural_Layout</label>
                     <div className="grid grid-cols-2 gap-3 font-black text-[10px] text-pink-100/40">
                       <div className="aspect-video bg-pink-500/10 rounded-xl border border-pink-500/20 cursor-pointer flex items-center justify-center hover:text-pink-300 transition-all">GRID</div>
                       <div className="aspect-video bg-white/5 rounded-xl border border-white/5 cursor-pointer flex items-center justify-center hover:bg-white/10 transition-all">NULL</div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-20">
             <div className="w-24 h-24 rounded-full bg-pink-500/5 flex items-center justify-center border border-pink-500/10 animate-pulse">
                <Presentation size={48} className="text-pink-300/20" />
             </div>
            <p className="text-sm font-black uppercase tracking-[0.4em] text-pink-100/40">Deck Synthesis Required</p>
            <p className="text-xs text-pink-300/20 font-bold uppercase">Initialize a presentation artifact to begin serialization</p>
          </div>
        )}
      </div>
    </div>
  );
}
