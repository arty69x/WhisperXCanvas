import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, AlertCircle, PlusCircle } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/lib/store';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AI({ activeModule }: { activeModule: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const addEntity = useAppStore((state) => state.addEntity);
  const prefilledAiQuery = useAppStore((state) => state.prefilledAiQuery);
  const setAiQuery = useAppStore((state) => state.setAiQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (prefilledAiQuery && activeModule === 'ai') {
      setInput(prefilledAiQuery);
      setAiQuery(null);
    }
  }, [prefilledAiQuery, activeModule, setAiQuery]);

  if (activeModule !== 'ai') return null;

  const handleSend = async (overrideInput?: string) => {
    const currentInput = overrideInput || input;
    if (!currentInput.trim() || isLoading) return;

    setError(null);
    const userMsg: Message = { role: 'user', text: currentInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not configured.');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        history,
        config: {
          systemInstruction: "You are WhisperXCanvas AI, a professional assistant for a high-fidelity visualization platform. Provide concise, technical responses. Maintain a professional 'operator' persona. You can create canvas entities using the 'create_canvas_entity' tool. When asked to help with a node or orchestrate, analyze and offer to create links or new summarizing nodes.",
          tools: [
            {
              functionDeclarations: [
                {
                  name: 'create_canvas_entity',
                  description: 'Creates a new visual entity (node) on the workspace canvas.',
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: 'The title of the node' },
                      type: { type: Type.STRING, description: 'Type of entity: summary-panel, doc, ai-chat-panel, media-preview, code-preview' },
                      x: { type: Type.NUMBER, description: 'Initial X position' },
                      y: { type: Type.NUMBER, description: 'Initial Y position' },
                      width: { type: Type.NUMBER, description: 'Width of node' },
                      height: { type: Type.NUMBER, description: 'Height of node' },
                      agentLabel: { type: Type.STRING, description: 'Optional label showing which agent created this' }
                    },
                    required: ['title', 'type', 'x', 'y']
                  }
                }
              ]
            }
          ]
        }
      });

      const response = await chat.sendMessage({ message: currentInput });
      
      const calls = response.functionCalls;
      if (calls && calls.length > 0) {
        let toolResponseText = "";
        for (const call of calls) {
          if (call.name === 'create_canvas_entity') {
            const args = call.args as any;
            addEntity({
              ...args,
              isAiGenerated: true,
              agentLabel: args.agentLabel || 'WhisperX_Synthesis'
            });
            
            toolResponseText += `_Matrix directive executed: Spawned [${args.title}] at spatial coordinates._\n`;
            
            // Note: In this SDK, we might need a separate message for tool results depending on implementation, 
            // but usually we can proceed. The skill says: 
            // "accessing the .text property... Returns the extracted string output."
          }
        }
        
        const finalText = response.text || toolResponseText || "Operation completed.";
        setMessages(prev => [...prev, { role: 'model', text: finalText }]);
      } else {
        const text = response.text || '';
        setMessages(prev => [...prev, { role: 'model', text }]);
      }

    } catch (err: any) {
      console.error('AI Interaction Error:', err);
      const errorMsg = err.message || 'An unexpected error occurred.';
      setError(errorMsg);
      setMessages(prev => [...prev, { role: 'model', text: `SYSTEM ERROR: ${errorMsg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0f050a] overflow-hidden selection:bg-pink-500/30 relative">
      <header className="p-8 border-b border-white/10 flex items-center justify-between relative z-10 bg-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pink-600 shadow-[0_0_30px_rgba(255,126,179,0.3)] group cursor-pointer hover:rotate-12 transition-all">
            <Sparkles size={24} className="group-hover:scale-110" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-tighter italic text-glow text-pink-50">AI Service Matrix</h2>
            <p className="text-[10px] text-pink-200/20 font-black uppercase tracking-[0.2em]">Model_Node: Gemini_2_Flash • Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-[8px] font-black uppercase tracking-widest text-pink-400">Synchronized</div>
           <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_10px_#ff7eb3]" />
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide relative z-10">
        {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-4 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
            <AlertCircle size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest text-red-400">
              Critical Warning: GEMINI_API_KEY is not configured.
            </p>
          </div>
        )}

        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20">
            <div className="w-24 h-24 bg-pink-500/5 rounded-[2.5rem] flex items-center justify-center text-pink-300/10 group overflow-hidden relative border border-pink-500/10">
              <Sparkles size={48} className="group-hover:scale-125 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent" />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-200">Initialize Conversation</p>
              <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto text-pink-300">
                Consult the AI node regarding workspace operations, asset forge blueprints, or database relations.
              </p>
            </div>
          </div>
        )}
        
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={cn(
                "flex gap-5 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-all border",
                msg.role === 'user' 
                  ? "bg-white text-pink-600 border-white" 
                  : "glass-panel text-pink-300 border-white/10"
              )}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={cn(
                "p-6 rounded-[2.5rem] text-[13px] leading-relaxed relative group transition-all",
                msg.role === 'user' 
                  ? "bg-white/10 text-white border border-white/10 backdrop-blur-md" 
                  : "glass-panel text-pink-50 border border-white/10 ring-1 ring-pink-500/5"
              )}>
                {msg.text}
                <div className="absolute top-2 right-6 opacity-0 group-hover:opacity-10 transition-opacity text-[8px] font-black uppercase tracking-widest text-pink-200">{msg.role}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-2xl glass-panel border border-white/10 flex items-center justify-center animate-pulse text-pink-300">
              <Bot size={18} />
            </div>
            <div className="p-6 rounded-[2.5rem] glass-panel border border-white/10 flex items-center gap-4">
               <Loader2 size={16} className="text-pink-400 animate-spin" />
               <span className="text-[10px] text-pink-100/40 font-black uppercase tracking-[0.2em]">Generating Node Response...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-white/10 bg-white/5 backdrop-blur-2xl relative z-20">
        <div className="relative max-w-5xl mx-auto flex gap-4">
          <div className="flex-1 relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query logical engine..."
              className="w-full glass-input rounded-[2rem] px-8 py-5 text-sm pr-20 shadow-inner text-pink-50 focus:border-pink-300/50 transition-all border-white/10"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-pink-100/10 pointer-events-none group-focus-within:opacity-0 transition-opacity">
              SHIFT + Enter to send
            </div>
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim() || !process.env.NEXT_PUBLIC_GEMINI_API_KEY}
            className="w-16 h-16 bg-white text-pink-600 rounded-[1.8rem] flex items-center justify-center hover:bg-pink-50 transition-all disabled:opacity-50 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
