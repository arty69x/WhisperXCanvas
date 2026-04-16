import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AI({ activeModule }: { activeModule: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (activeModule !== 'ai') return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: input,
          history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      <header className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-glow">AI Service Layer</h2>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Gemini 3 Flash • Connected</p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide relative z-10">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <Sparkles size={48} className="text-white/20" />
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">How can I assist you?</p>
              <p className="text-[9px] font-bold uppercase tracking-widest">Ask about your workspace, archive, or forge tasks.</p>
            </div>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex gap-4 max-w-[80%]",
            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
          )}>
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
              msg.role === 'user' ? "bg-white text-black" : "bg-white/10 text-white backdrop-blur-md border border-white/10"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn(
              "p-4 rounded-3xl text-sm leading-relaxed",
              msg.role === 'user' ? "bg-white/10 text-white backdrop-blur-md border border-white/10" : "glass-panel text-white/80"
            )}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-3xl glass-panel flex items-center gap-3">
              <Loader2 size={16} className="animate-spin text-white/40" />
              <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl relative z-20">
        <div className="relative max-w-4xl mx-auto">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe a transformation or ask a question..."
            className="w-full glass-input rounded-2xl px-6 py-4 text-sm pr-16"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:bg-white/90 transition-all disabled:opacity-50 active:scale-95 shadow-lg"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
