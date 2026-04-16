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
      title: 'Project Pitch v2', 
      slides: [
        { id: 's1', title: 'Welcome', content: 'WhisperXStudio: The Future of Visualization' },
        { id: 's2', title: 'The Problem', content: 'Data is disconnected and static.' }
      ],
      // eslint-disable-next-line react-hooks/purity
      updatedAt: Date.now() 
    }
  ], []);

  const [decks, setDecks] = useState<Deck[]>(initialDecks);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  if (activeModule !== 'slides') return null;

  return (
    <div className="w-full h-full flex bg-[#0a0a0a] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 flex flex-col bg-[#0f0f0f]">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Presentation size={14} className="text-white/40" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Decks</h3>
          </div>
          <button className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-colors">
            <Plus size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
          {decks.map(deck => (
            <button
              key={deck.id}
              onClick={() => { setSelectedDeck(deck); setActiveSlideIndex(0); }}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all group",
                selectedDeck?.id === deck.id ? "bg-white/10 border border-white/10" : "hover:bg-white/5 border border-transparent"
              )}
            >
              <p className={cn(
                "text-xs font-bold truncate",
                selectedDeck?.id === deck.id ? "text-white" : "text-white/40 group-hover:text-white/60"
              )}>{deck.title}</p>
              <p className="text-[9px] uppercase font-bold text-white/20 mt-1">{deck.slides.length} Slides</p>
            </button>
          ))}
        </div>
      </div>

      {/* Slide Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedDeck ? (
          <>
            <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0a]">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-black uppercase italic tracking-tight">{selectedDeck.title}</h2>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"><Play size={14} /></button>
                  <button className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"><Settings size={14} /></button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-black rounded text-[10px] font-bold uppercase tracking-wider hover:bg-white/90 transition-colors">
                  Present
                </button>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden bg-[#0f0f0f]">
              {/* Slide Strip */}
              <div className="w-48 border-r border-white/5 p-4 space-y-4 overflow-y-auto scrollbar-hide">
                {selectedDeck.slides.map((slide, i) => (
                  <div 
                    key={slide.id}
                    onClick={() => setActiveSlideIndex(i)}
                    className={cn(
                      "aspect-video rounded-lg border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all overflow-hidden relative group",
                      activeSlideIndex === i ? "border-white ring-2 ring-white/20" : "border-white/10 hover:border-white/30"
                    )}
                  >
                    <div className="absolute top-1 left-1 text-[8px] font-bold text-white/20">{i + 1}</div>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/40 truncate w-full px-2 text-center">{slide.title}</span>
                  </div>
                ))}
                <button className="w-full aspect-video rounded-lg border border-dashed border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:border-white/30 transition-all">
                  <Plus size={16} />
                </button>
              </div>

              {/* Slide Canvas */}
              <div className="flex-1 p-12 flex items-center justify-center bg-black/40 relative">
                <div className="aspect-video w-full max-w-4xl bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <h1 className="text-5xl font-black tracking-tighter uppercase italic">{selectedDeck.slides[activeSlideIndex].title}</h1>
                  <p className="text-xl text-white/60 leading-relaxed max-w-2xl">{selectedDeck.slides[activeSlideIndex].content}</p>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#1a1a1a] border border-white/10 p-2 rounded-xl shadow-2xl">
                  <button 
                    disabled={activeSlideIndex === 0}
                    onClick={() => setActiveSlideIndex(prev => prev - 1)}
                    className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-20"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-xs font-bold text-white/40">{activeSlideIndex + 1} / {selectedDeck.slides.length}</span>
                  <button 
                    disabled={activeSlideIndex === selectedDeck.slides.length - 1}
                    onClick={() => setActiveSlideIndex(prev => prev + 1)}
                    className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-20"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Inspector */}
              <div className="w-64 border-l border-white/5 p-6 space-y-8 bg-[#0a0a0a]">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Slide Inspector</h3>
                <div className="space-y-4">
                   <div className="space-y-1">
                     <label className="text-[9px] uppercase font-bold text-white/20">Background</label>
                     <div className="w-full h-8 bg-white/5 border border-white/10 rounded" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[9px] uppercase font-bold text-white/20">Layout</label>
                     <div className="grid grid-cols-2 gap-2">
                       <div className="aspect-video bg-white/10 rounded" />
                       <div className="aspect-video bg-white/5 rounded" />
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
            <Presentation size={64} />
            <p className="text-sm font-bold uppercase tracking-widest">Select or create a deck</p>
          </div>
        )}
      </div>
    </div>
  );
}
