'use client';

import React from 'react';
import { 
  Bot, 
  Database, 
  Settings2, 
  Compass, 
  Cpu, 
  Zap, 
  Layout, 
  Activity, 
  Search, 
  Code2, 
  Globe,
  Radio,
  FileSearch,
  MessageSquare,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { EntityType, EntityPort } from '@/types/canvas';
import { motion, AnimatePresence } from 'motion/react';

interface NodeBlueprint {
  type: EntityType;
  title: string;
  subtitle: string;
  color: string;
  icon: any;
  ports: EntityPort[];
  width: number;
  height: number;
}

const libraryCategories = [
  {
    id: 'ai',
    label: 'AI & Intelligence',
    icon: Sparkles,
    nodes: [
      {
        type: 'ai-processor',
        title: 'Neural Transformer',
        subtitle: 'LLM Inference Node',
        color: '#ff7eb3',
        icon: Bot,
        width: 280,
        height: 180,
        ports: [
          { id: 'in-prompt', name: 'Prompt', type: 'input', dataType: 'string' },
          { id: 'out-resp', name: 'Response', type: 'output', dataType: 'string' }
        ]
      },
      {
        type: 'ai-processor',
        title: 'Vision Synthesis',
        subtitle: 'Object Recognition',
        color: '#ff7eb3',
        icon: Globe,
        width: 260,
        height: 160,
        ports: [
          { id: 'in-img', name: 'Image', type: 'input', dataType: 'image' },
          { id: 'out-meta', name: 'Metadata', type: 'output', dataType: 'json' }
        ]
      },
      {
        type: 'ai-processor',
        title: 'Sentiment Flux',
        subtitle: 'Emotional Analysis',
        color: '#ff7eb3',
        icon: Sparkles,
        width: 240,
        height: 140,
        ports: [
          { id: 'in-txt', name: 'Text', type: 'input', dataType: 'string' },
          { id: 'out-score', name: 'Sentiment', type: 'output', dataType: 'number' }
        ]
      }
    ]
  },
  {
    id: 'data',
    label: 'Data & Streams',
    icon: Database,
    nodes: [
      {
        type: 'data-source',
        title: 'SQL Nexus',
        subtitle: 'Postgres Connector',
        color: '#a855f7',
        icon: Database,
        width: 240,
        height: 140,
        ports: [
          { id: 'out-query', name: 'Result', type: 'output', dataType: 'array' }
        ]
      },
      {
        type: 'data-stream',
        title: 'Event Bus',
        subtitle: 'Live WebSocket Stream',
        color: '#a855f7',
        icon: Radio,
        width: 220,
        height: 120,
        ports: [
          { id: 'out-stream', name: 'Payload', type: 'output', dataType: 'stream' }
        ]
      },
      {
        type: 'data-source',
        title: 'S3 Storage',
        subtitle: 'Blob Archive',
        color: '#a855f7',
        icon: Layers,
        width: 220,
        height: 140,
        ports: [
          { id: 'in-path', name: 'Path', type: 'input', dataType: 'string' },
          { id: 'out-blob', name: 'Blob', type: 'output', dataType: 'binary' }
        ]
      }
    ]
  },
  {
    id: 'logic',
    label: 'Logic & Flow',
    icon: Settings2,
    nodes: [
      {
        type: 'logic-gate',
        title: 'Condition Gate',
        subtitle: 'Boolean Logic',
        color: '#3b82f6',
        icon: Code2,
        width: 200,
        height: 140,
        ports: [
          { id: 'in-val', name: 'Input', type: 'input', dataType: 'any' },
          { id: 'out-true', name: 'True', type: 'output', dataType: 'any' },
          { id: 'out-false', name: 'False', type: 'output', dataType: 'any' }
        ]
      },
      {
        type: 'logic-gate',
        title: 'Router',
        subtitle: 'Signal Distribution',
        color: '#3b82f6',
        icon: Zap,
        width: 180,
        height: 160,
        ports: [
          { id: 'in-sig', name: 'Signal', type: 'input', dataType: 'signal' },
          { id: 'out-1', name: 'Port A', type: 'output', dataType: 'signal' },
          { id: 'out-2', name: 'Port B', type: 'output', dataType: 'signal' },
          { id: 'out-3', name: 'Port C', type: 'output', dataType: 'signal' }
        ]
      }
    ]
  },
  {
    id: 'ui',
    label: 'Interface Elements',
    icon: Layout,
    nodes: [
      {
        type: 'ui-component',
        title: 'Dashboard Plot',
        subtitle: 'Real-time Chart',
        color: '#10b981',
        icon: Activity,
        width: 320,
        height: 240,
        ports: [
          { id: 'in-data', name: 'Data', type: 'input', dataType: 'array' }
        ]
      },
      {
        type: 'ui-component',
        title: 'Sensor Monitor',
        subtitle: 'Telemetry Analytics',
        color: '#10b981',
        icon: Activity,
        width: 240,
        height: 180,
        ports: [
          { id: 'in-t1', name: 'T1', type: 'input', dataType: 'number' },
          { id: 'in-t2', name: 'T2', type: 'input', dataType: 'number' }
        ]
      },
      {
        type: 'ui-component',
        title: 'Control Terminal',
        subtitle: 'Manual Override',
        color: '#10b981',
        icon: Settings2,
        width: 280,
        height: 200,
        ports: [
          { id: 'out-cmd', name: 'Command', type: 'output', dataType: 'signal' }
        ]
      }
    ]
  }
];

export default function ComponentLibrary() {
  const [activeCategory, setActiveCategory] = React.useState('ai');
  const addEntity = useAppStore((state) => state.addEntity);
  const pan = useAppStore((state) => state.pan);
  const zoom = useAppStore((state) => state.zoom);

  const spawnNode = (blueprint: NodeBlueprint) => {
    // Spawn in visible center of canvas
    const x = (window.innerWidth / 2 - pan.x - blueprint.width / 2) / zoom;
    const y = (window.innerHeight / 2 - pan.y - blueprint.height / 2) / zoom;

    addEntity({
      type: blueprint.type,
      title: blueprint.title,
      subtitle: blueprint.subtitle,
      color: blueprint.color,
      icon: blueprint.icon.displayName || blueprint.icon.name,
      x,
      y,
      width: blueprint.width,
      height: blueprint.height,
      ports: blueprint.ports,
      visualMode: 'full',
    });
  };

  return (
    <div className="w-80 h-full glass-panel border-r border-white/10 flex flex-col overflow-hidden relative shadow-[20px_0_60px_rgba(0,0,0,0.4)]">
      <div className="p-6 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-pink-50">Node Library</h2>
            <p className="text-[10px] font-black text-pink-100/20 uppercase tracking-widest mt-1">Component_Registry_v1</p>
          </div>
          <div className="p-2.5 glass-button rounded-xl text-pink-400">
             <Layers size={16} />
          </div>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input 
            type="text" 
            placeholder="FILTER_NODES..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-[10px] font-black uppercase tracking-widest text-pink-50 focus:outline-none focus:border-pink-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Categories Rail */}
      <div className="flex p-2 gap-2 border-b border-white/5 overflow-x-auto scrollbar-hide">
        {libraryCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border shrink-0",
              activeCategory === cat.id 
                ? "bg-white/10 border-pink-500/30 text-white shadow-[0_0_15px_rgba(255,126,179,0.1)]" 
                : "border-transparent text-white/20 hover:text-white/40"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Node Grid */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide space-y-3">
        <AnimatePresence mode="wait">
          {libraryCategories.find(c => c.id === activeCategory)?.nodes.map((node, i) => (
            <motion.div
              key={node.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => spawnNode(node as any)}
              className="p-4 glass-card border-white/5 rounded-2xl hover:border-pink-500/30 group cursor-grab active:cursor-grabbing hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                    "shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                  )}
                  style={{ backgroundColor: `${node.color}20`, border: `1px solid ${node.color}40` }}
                >
                  <node.icon size={20} style={{ color: node.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-pink-50 group-hover:text-glow truncate">{node.title}</h3>
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-tighter truncate mt-0.5">{node.subtitle}</p>
                </div>
                <Zap size={12} className="text-white/10 group-hover:text-pink-400 group-hover:animate-pulse" />
              </div>

              {/* Port Previews */}
              <div className="mt-4 flex items-center gap-4 justify-between border-t border-white/5 pt-3">
                <div className="flex -space-x-1">
                  {node.ports.filter(p => p.type === 'input').map(p => (
                    <div key={p.id} className="w-2 h-2 rounded-full bg-pink-500/20 border border-pink-500/40" title={p.name} />
                  ))}
                </div>
                <div className="flex -space-x-1">
                  {node.ports.filter(p => p.type === 'output').map(p => (
                    <div key={p.id} className="w-2 h-2 rounded-full bg-purple-500/20 border border-purple-500/40" title={p.name} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-gradient-to-t from-pink-500/[0.02] to-transparent pointer-events-none absolute bottom-0 left-0 w-full" />
    </div>
  );
}
