import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenerativeAI, Type } from "@google/genai";
import { useAppStore } from '@/lib/store';
import { CanvasEntity, EntityType } from '@/types/canvas';
import { cn } from '@/lib/utils';
import Minimap from './Minimap';
import { 
  Undo2, 
  Redo2,
  Settings,
  Download,
  Share2,
  Layers,
  Bot,
  Database,
  Globe,
  Radio,
  Code2,
  Activity,
  Maximize, 
  Minus, 
  Plus, 
  RotateCcw, 
  Search, 
  Monitor,
  Lock,
  MessageSquare,
  FileText,
  FileJson,
  Box,
  ChevronRight,
  MoreVertical,
  Layout,
  Filter,
  X,
  Sparkles,
  ChevronUp,
  MousePointer2,
  Zap,
  Info,
  Maximize2,
  Minimize2,
  Grid,
  ExternalLink,
  Menu,
  Link,
  GitBranch,
  Table,
  Orbit,
  Workflow,
  ChevronRight as ChevronRightIcon,
  Activity as ActivityIcon,
  Box as BoxIcon
} from 'lucide-react';
import { EntityLink } from '@/types/canvas';

export default function CanvasEngine() {
  const { 
    undo, redo, canUndo, canRedo, runEngineStep,
    addLink, setLinkingMode, isLinkingMode, linkingSourceId, setLinkingSourceId,
    entities, links, removeEntity, updateEntity, selectedEntityIds, selectEntity,
    searchQuery, setSearchQuery, filterCategory, setFilterCategory,
    addEntity, resetWorkspace, applyLayout, fitToView, pan, setPan, zoom, setZoom,
    isFocusedMode, setFocusedMode, orchestrateEntities, clearSelection
  } = useAppStore();

  const [command, setCommand] = useState('');
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'logic' | 'data' | 'agent'>('all');

  const containerRef = useRef<HTMLDivElement>(null);

  const handleAiCommand = async () => {
    if (!command.trim()) return;
    setIsProcessingAi(true);
    try {
      const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
      const prompt = `You are a spatial node orchestrator for WhisperX Studio. 
      The user wants to orchestrate nodes for: ${command}
      
      Generate a set of logical nodes. Provide realistic titles and icons from lucide-react (e.g., Brain, Database, Globe, Radio, Code2, Activity, Zap, Link, GitBranch, Table, Orbit, Workflow).
      
      Categories available: logic, data, agent, interface.
      Port types: signal, data, error.
      
      Return valid JSON.`;

      const model = ai.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["logic", "data", "agent", "interface"] },
                    category: { type: Type.STRING, enum: ["logic", "data", "agent", "interface"] },
                    icon: { type: Type.STRING },
                    description: { type: Type.STRING },
                    ports: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          name: { type: Type.STRING },
                          type: { type: Type.STRING, enum: ["input", "output"] },
                          dataType: { type: Type.STRING, enum: ["signal", "data", "error"] }
                        },
                        required: ["id", "name", "type", "dataType"]
                      }
                    }
                  },
                  required: ["title", "type", "category", "icon", "ports"]
                }
              }
            },
            required: ["nodes"]
          }
        }
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const data = JSON.parse(response.text() || '{"nodes":[]}');
      data.nodes.forEach((node: any, index: number) => {
        addEntity({
          ...node,
          x: (index * 300) + 100,
          y: 200,
          width: 280,
          height: 180,
          isAiGenerated: true,
          status: 'active'
        });
      });
      setCommand('');
    } catch (error) {
      console.error("AI Command Failed", error);
    } finally {
      setIsProcessingAi(false);
    }
  };

  const avoidOverlap = (id: string, x: number, y: number) => {
    const PADDING = 20;
    let newX = x;
    let newY = y;
    
    entities.forEach(other => {
        if (other.id === id) return;
        const isOverlapping = 
            x < other.x + other.width + PADDING &&
            x + 280 > other.x - PADDING &&
            y < other.y + other.height + PADDING &&
            y + 180 > other.y - PADDING;
        
        if (isOverlapping) {
            // Very simple push logic
            newX += 300;
        }
    });

    return { x: newX, y: newY };
  };

  const isPanning = useRef(false);
  const [isPanningState, setIsPanningState] = useState(false);
  const [marquee, setMarquee] = useState<{ start: { x: number, y: number }, end: { x: number, y: number } } | null>(null);
  const settings = useAppStore((state) => state.settings);

  // Engine loop
  useEffect(() => {
    const timer = setInterval(() => {
      runEngineStep();
    }, 100);
    return () => clearInterval(timer);
  }, [runEngineStep]);
  
  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom
    };
  }, [pan, zoom]);

  // Handle Pan & Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const delta = -e.deltaY * 0.001; 
      const newZoom = Math.min(Math.max(zoom + delta, 0.1), 5);
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const canvasMouseBefore = {
          x: (mouseX - pan.x) / zoom,
          y: (mouseY - pan.y) / zoom
        };
        
        const newPan = {
          x: mouseX - canvasMouseBefore.x * newZoom,
          y: mouseY - canvasMouseBefore.y * newZoom
        };
        
        setZoom(newZoom);
        setPan(newPan);
      }
    } else {
      // Pan
      setPan({
        x: pan.x - e.deltaX,
        y: pan.y - e.deltaY
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      isPanning.current = true;
      setIsPanningState(true);
    } else if (e.target === containerRef.current) {
      if (!e.shiftKey && !e.metaKey) clearSelection();
      const pos = screenToCanvas(e.clientX, e.clientY);
      setMarquee({ start: pos, end: pos });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning.current) {
      setPan({
        x: pan.x + e.movementX,
        y: pan.y + e.movementY
      });
    } else if (marquee) {
      const pos = screenToCanvas(e.clientX, e.clientY);
      setMarquee(prev => prev ? { ...prev, end: pos } : null);
    }
  };

  const handleMouseUp = () => {
    if (marquee) {
      const x1 = Math.min(marquee.start.x, marquee.end.x);
      const y1 = Math.min(marquee.start.y, marquee.end.y);
      const x2 = Math.max(marquee.start.x, marquee.end.x);
      const y2 = Math.max(marquee.start.y, marquee.end.y);

      entities.forEach(entity => {
        const overlap = 
          entity.x + entity.width >= x1 && 
          entity.x <= x2 && 
          entity.y + entity.height >= y1 && 
          entity.y <= y2;
        
        if (overlap) {
          selectEntity(entity.id, true);
        }
      });
      setMarquee(null);
    }
    isPanning.current = false;
    setIsPanningState(false);
  };

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
        selectedEntityIds.forEach(id => removeEntity(id));
      }
      if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        entities.forEach(entity => selectEntity(entity.id, true));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEntityIds, removeEntity, entities, selectEntity]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "w-full h-full relative overflow-hidden bg-transparent select-none transition-colors",
        isPanningState ? "cursor-grabbing" : "cursor-crosshair"
      )}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        handleMouseDown({ 
          button: 0, 
          clientX: touch.clientX, 
          clientY: touch.clientY, 
          shiftKey: false, 
          metaKey: false, 
          target: e.target 
        } as any);
      }}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        handleMouseMove({ 
          clientX: touch.clientX, 
          clientY: touch.clientY, 
          movementX: 0, 
          movementY: 0 
        } as any);
      }}
      onTouchEnd={handleMouseUp}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`
          }}
        />
      </div>

      {/* Top Action Bar: Search & AI Command */}
      <div className="absolute top-8 left-8 right-32 flex flex-col gap-4 z-40 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
            {/* AI Command Bar */}
            <div className="relative group/command flex-1 max-w-2xl">
                <div className="relative bg-white border border-gray-200 rounded-xl flex items-center gap-3 px-4 py-2 shadow-sm focus-within:shadow-md transition-shadow">
                    <Sparkles className={cn("text-brand-orange shrink-0", isProcessingAi && "animate-spin")} size={16} />
                    <input 
                        type="text"
                        placeholder="Command Studio: 'Create an analytics workflow'..."
                        className="bg-transparent border-none outline-none text-black text-[11px] font-medium w-full placeholder:text-gray-300 tracking-wide"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAiCommand()}
                    />
                </div>
            </div>

            {/* Semantic Filters */}
            <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-100 rounded-xl shadow-sm">
                {(['all', 'logic', 'data', 'agent'] as const).map((type) => (
                    <button 
                        key={type}
                        onClick={() => {
                            setFilterType(type);
                            setFilterCategory(type === 'all' ? null : type as any);
                        }}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                            filterType === type ? "bg-black text-white" : "text-gray-300 hover:text-gray-500"
                        )}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>

        {/* Search & Suggestions */}
        <div className="flex items-center gap-4 pointer-events-auto">
             <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-3 ring-1 ring-white/5 shadow-lg w-72">
                <Search size={14} className="text-white/20" />
                <input 
                    type="text"
                    placeholder="Search Nodes..."
                    className="bg-transparent border-none outline-none text-white/60 text-[10px] font-bold w-full placeholder:text-white/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
      </div>
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      />
      
      {/* Mini Map */}
      <div className="absolute bottom-32 right-8 w-48 h-32 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 pointer-events-auto overflow-hidden group">
          <div className="absolute top-2 left-3 text-[8px] font-black uppercase tracking-widest text-gray-300">Spatial Map</div>
          <div className="w-full h-full p-4 relative opacity-40 grayscale group-hover:grayscale-0 transition-all">
              {entities.map(e => (
                  <div 
                      key={e.id}
                      className="absolute rounded-sm"
                      style={{
                          left: `${(e.x + 5000) / 10000 * 100}%`,
                          top: `${(e.y + 5000) / 10000 * 100}%`,
                          width: '4px',
                          height: '4px',
                          backgroundColor: e.color || '#000'
                      }}
                  />
              ))}
              {/* Viewport Indicator */}
              <div 
                  className="absolute border border-black/20 bg-black/5"
                  style={{
                      left: `${(-pan.x / zoom + 5000) / 10000 * 100}%`,
                      top: `${(-pan.y / zoom + 5000) / 10000 * 100}%`,
                      width: `${(window.innerWidth / zoom) / 10000 * 100}%`,
                      height: `${(window.innerHeight / zoom) / 10000 * 100}%`,
                  }}
              />
          </div>
      </div>

      {/* SVG Drawing Layer (Ghost Layer) */}
      <svg className="absolute inset-0 pointer-events-none z-0 overflow-visible">
          <defs>
              <linearGradient id="svg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff7eb3" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#000" stopOpacity="0.05" />
              </linearGradient>
          </defs>
          <circle cx="50%" cy="50%" r="40%" fill="url(#svg-grad)" className="animate-pulse" />
      </svg>

      {/* Entities Layer */}
      <div 
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        {/* Links Layer */}
        <svg className="absolute inset-0 pointer-events-none overflow-visible w-full h-full">
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orientation="auto">
              <polygon points="0 0, 6 2, 0 4" fill="#ff7eb3" opacity="0.6" />
            </marker>
          </defs>
          {links.map(link => {
            const source = entities.find(e => e.id === link.sourceId);
            const target = entities.find(e => e.id === link.targetId);
            if (!source || !target) return null;

            // Discrete Port Routing
            let startX = source.x + source.width;
            let startY = source.y + source.height / 2;
            let endX = target.x;
            let endY = target.y + target.height / 2;

            if (link.sourcePortId) {
                const sOutputPorts = source.ports.filter(p => p.type === 'output');
                const portPos = sOutputPorts.findIndex(p => p.id === link.sourcePortId);
                startY = source.y + (source.height / (sOutputPorts.length + 1)) * (portPos + 1);
            }
            if (link.targetPortId) {
                const tInputPorts = target.ports.filter(p => p.type === 'input');
                const portPos = tInputPorts.findIndex(p => p.id === link.targetPortId);
                endY = target.y + (target.height / (tInputPorts.length + 1)) * (portPos + 1);
            }

            const dx = Math.abs(endX - startX) * 0.5;
            const path = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

            return (
              <g key={link.id} className="group">
                <path 
                  d={path}
                  fill="none"
                  stroke={link.color || "#000"}
                  strokeWidth={2}
                  strokeOpacity={0.1}
                />
                <motion.path 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  d={path}
                  fill="none"
                  stroke={link.color || "#000"}
                  strokeWidth={1.5}
                  strokeOpacity={0.4}
                  markerEnd="url(#arrowhead)"
                />
                {link.animated && (
                  <>
                    <motion.path
                        d={path}
                        fill="none"
                        stroke={link.color || "#ff7eb3"}
                        strokeWidth={2.5}
                        strokeDasharray="4 20"
                        animate={{ strokeDashoffset: [-60, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        strokeOpacity={0.8}
                    />
                    {/* Signal Packet Tracking */}
                    <motion.circle
                        r={3}
                        fill="#fff"
                        filter="blur(2px)"
                        animate={{ 
                            offsetDistance: ["0%", "100%"],
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        style={{ offsetPath: `path("${path}")` } as any}
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        <AnimatePresence>
          {entities
            .filter(e => {
                const matchesSearch = !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesFilter = filterType === 'all' || e.category === filterType;
                return matchesSearch && matchesFilter;
            })
            .map((entity) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              isSelected={selectedEntityIds.includes(entity.id)}
              onSelect={(multi) => selectEntity(entity.id, multi)}
              onUpdate={(updates) => {
                let finalUpdates = { ...updates };
                if (updates.x !== undefined && updates.y !== undefined) {
                    const corrected = avoidOverlap(entity.id, updates.x, updates.y);
                    finalUpdates.x = corrected.x;
                    finalUpdates.y = corrected.y;
                }
                updateEntity(entity.id, finalUpdates);
              }}
              onRemove={() => removeEntity(entity.id)}
              zoom={zoom}
              isPotentialTarget={isLinkingMode && !!linkingSourceId && linkingSourceId !== entity.id}
              isLinkingSource={isLinkingMode && linkingSourceId === entity.id}
              linkingSourceId={linkingSourceId}
              onPortClick={(portId) => {
                if (!isLinkingMode) return;
                
                const port = entity.ports.find(p => p.id === portId);
                if (!port) return;

                if (!linkingSourceId) {
                  // Must start from an output port
                  if (port.type === 'output') {
                    setLinkingSourceId(entity.id, portId);
                  }
                } else if (linkingSourceId !== entity.id) {
                  // Must end on an input port
                  if (port.type === 'input') {
                    const sourcePortId = useAppStore.getState().linkingSourcePortId;
                    addLink(linkingSourceId, entity.id, 'data-flow', sourcePortId || undefined, portId);
                    setLinkingSourceId(null, null);
                  }
                } else {
                    // Clicking same node resets
                    setLinkingSourceId(null, null);
                }
              }}
            />
          ))}
        </AnimatePresence>

        {/* Marquee Selection Box */}
        {marquee && (
          <div 
            className="absolute border border-pink-400/30 bg-pink-400/5 pointer-events-none rounded-lg shadow-[0_0_20px_rgba(255,126,179,0.1)]"
            style={{
              left: Math.min(marquee.start.x, marquee.end.x),
              top: Math.min(marquee.start.y, marquee.end.y),
              width: Math.abs(marquee.end.x - marquee.start.x),
              height: Math.abs(marquee.end.y - marquee.start.y),
            }}
          />
        )}
      </div>

      {/* Multi-Select Orchestration Actions */}
      <AnimatePresence>
        {selectedEntityIds.length > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 bg-white border border-gray-100 p-3 rounded-2xl flex items-center gap-4 z-30 shadow-xl"
          >
            <div className="flex items-center gap-3 pr-4 border-r border-gray-100">
              <Sparkles className="text-brand-orange" size={16} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-black">{selectedEntityIds.length} Nodes</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Ready for orchestration</span>
              </div>
            </div>
            <button 
              onClick={() => orchestrateEntities(selectedEntityIds)}
              className="px-6 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue active:scale-95 transition-all shadow-md flex items-center gap-2"
            >
              <Workflow size={14} />
              <span>Orchestrate</span>
            </button>
            <button 
              onClick={() => clearSelection()}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"
            >
              <Minus size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-20">
        <button onClick={() => setZoom(Math.max(zoom - 0.1, 0.1))} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-black transition-colors">
          <Minus size={14} />
        </button>
        <div className="px-3 border-x border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </div>
        <button onClick={() => setZoom(Math.min(zoom + 0.1, 5))} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-black transition-colors">
          <Plus size={14} />
        </button>
        <div className="w-px h-6 bg-gray-100 mx-1" />
        <button onClick={() => fitToView(window.innerWidth - 400, window.innerHeight, 100)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-black transition-colors" title="Fit to View">
          <Monitor size={14} />
        </button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-black transition-colors" title="Reset View">
          <RotateCcw size={14} />
        </button>

        <div className="w-px h-6 bg-gray-100 mx-1" />
        
        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
            <button 
                onClick={undo}
                disabled={!canUndo}
                className={cn(
                    "p-2 rounded-lg transition-all",
                    canUndo ? "text-black hover:bg-gray-50" : "text-gray-200 cursor-not-allowed"
                )}
                title="Undo (Ctrl+Z)"
            >
                <Undo2 size={16} />
            </button>
            <button 
                onClick={redo}
                disabled={!canRedo}
                className={cn(
                    "p-2 rounded-lg transition-all",
                    canRedo ? "text-black hover:bg-gray-50" : "text-gray-200 cursor-not-allowed"
                )}
                title="Redo (Ctrl+Y)"
            >
                <Redo2 size={16} />
            </button>
        </div>

        <div className="w-px h-6 bg-gray-100 mx-1" />
        
        {/* Layout Tools */}
        <div className="flex items-center gap-1 hidden sm:flex">
            <button 
                onClick={() => applyLayout('grid')}
                className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-black transition-colors"
                title="Grid Matrix"
            >
                <Grid size={14} />
            </button>
            <button 
                onClick={() => applyLayout('circle')}
                className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-black transition-colors"
                title="Spiral Orbit"
            >
                <Orbit size={14} />
            </button>
        </div>

        <div className="w-px h-6 bg-gray-100 mx-1" />
        <button 
          onClick={() => setLinkingMode(!isLinkingMode)} 
          className={cn(
            "p-2 rounded-lg transition-all border flex items-center gap-2",
            isLinkingMode ? "bg-brand-blue text-white border-brand-blue shadow-md" : "bg-white border-gray-100 text-gray-400 hover:text-black"
          )}
          title="Toggle Link Mode"
        >
          <Zap size={14} className={isLinkingMode ? "animate-pulse" : ""} />
          <span className="text-[9px] font-black uppercase tracking-widest hidden lg:block">Link Matrix</span>
        </button>

        <div className="w-px h-6 bg-gray-100 mx-1" />
        <button 
          onClick={() => setFocusedMode(!isFocusedMode)} 
          className={cn(
            "p-2 rounded-lg transition-all border flex items-center gap-2",
            isFocusedMode ? "bg-black text-white border-black shadow-md" : "bg-white border-gray-100 text-gray-400 hover:text-black"
          )}
          title="Focus Matrix"
        >
          <Layout size={14} className={isFocusedMode ? "fill-current" : ""} />
          <span className="text-[9px] font-black uppercase tracking-widest hidden lg:block">Focus</span>
        </button>
      </div>

      <AnimatePresence>
        {!isFocusedMode && <Minimap />}
      </AnimatePresence>
      {/* Viewport Footer: System Bar & Breadcrumbs */}
      <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between z-40 pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
              <div className="flex bg-white/80 backdrop-blur-md border border-gray-100 rounded-full px-4 py-2 shadow-xl shadow-black/5 items-center gap-4">
                  <div className="flex items-center gap-2 border-r border-gray-100 pr-4">
                      <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Workspace Live</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                      <span>ROOT</span>
                      <ChevronRight size={12} className="opacity-30" />
                      <span className="text-gray-900">{entities.length} NODES</span>
                      <ChevronRight size={12} className="opacity-30" />
                      <span>{Math.round(zoom * 100)}% SCALE</span>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
              <div className="flex bg-gray-900 rounded-full px-4 py-2 shadow-2xl items-center gap-6">
                  <div className="flex items-center gap-2">
                       <Activity size={12} className="text-brand-orange" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-white/40">CPU::</span>
                       <span className="text-[9px] font-black uppercase tracking-widest text-white font-mono">12%</span>
                  </div>
                  <div className="flex items-center gap-2">
                       <Box size={12} className="text-brand-blue" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-white/40">MEM::</span>
                       <span className="text-[9px] font-black uppercase tracking-widest text-white font-mono">4.2GB</span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

function EntityCard({ 
  entity, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onRemove,
  zoom,
  isPotentialTarget,
  isLinkingSource,
  linkingSourceId,
  onPortClick
}: { 
  entity: CanvasEntity, 
  isSelected: boolean, 
  onSelect: (multi: boolean) => void,
  onUpdate: (updates: Partial<CanvasEntity>) => void,
  onRemove: () => void,
  zoom: number,
  isPotentialTarget?: boolean,
  isLinkingSource?: boolean,
  linkingSourceId?: string | null,
  onPortClick: (portId: string) => void
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (entity.locked) return;
    e.stopPropagation();
    onSelect(e.shiftKey || e.metaKey);
    setIsDragging(true);
    
    // Zoom-aware drag offset
    setDragOffset({
      x: e.clientX / zoom - entity.x,
      y: e.clientY / zoom - entity.y
    });
  };

  const handleTouchDown = (e: React.TouchEvent) => {
    if (entity.locked) return;
    const touch = e.touches[0];
    onSelect(false);
    setIsDragging(true);
    setDragOffset({
      x: touch.clientX / zoom - entity.x,
      y: touch.clientY / zoom - entity.y
    });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const settings = useAppStore.getState().settings;
      const snap = settings.canvasSnapToGrid ? 40 : 1;

      if (isDragging) {
        let newX = e.clientX / zoom - dragOffset.x;
        let newY = e.clientY / zoom - dragOffset.y;
        
        if (settings.canvasSnapToGrid) {
          newX = Math.round(newX / snap) * snap;
          newY = Math.round(newY / snap) * snap;
        }

        onUpdate({ x: newX, y: newY });
      } else if (isResizing) {
        let newWidth = e.clientX / zoom - entity.x;
        let newHeight = e.clientY / zoom - entity.y;

        if (settings.canvasSnapToGrid) {
          newWidth = Math.round(newWidth / snap) * snap;
          newHeight = Math.round(newHeight / snap) * snap;
        }

        onUpdate({
          width: Math.max(snap, newWidth),
          height: Math.max(snap, newHeight)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, entity, onUpdate, zoom]);

  return (
    <motion.div
      layoutId={entity.id}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        x: entity.x,
        y: entity.y,
        width: entity.width,
        height: entity.height,
        zIndex: entity.zIndex,
      }}
      className={cn(
        "group bg-white border border-gray-100 transition-all duration-300 rounded-[1.5rem] overflow-hidden flex flex-col shadow-sm hover:shadow-md",
        isSelected ? "ring-2 ring-black shadow-xl scale-[1.01]" : "hover:border-gray-300",
        entity.locked && "opacity-80 scale-95 grayscale",
        isLinkingSource && "ring-4 ring-brand-blue shadow-lg",
        isPotentialTarget && "ring-2 ring-brand-green cursor-alias scale-[1.01]",
        entity.executionStatus === 'running' && "ring-2 ring-brand-orange animate-pulse"
      )}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchDown}
    >
      {/* Ports Layer */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-center gap-4 -translate-x-1.5 z-10 pointer-events-none">
        {entity.ports.filter(p => p.type === 'input').map(port => (
          <button 
            key={port.id} 
            onClick={(e) => { e.stopPropagation(); onPortClick(port.id); }}
            className={cn(
                "w-3 h-3 rounded-full bg-white border-2 border-gray-200 shadow-sm flex items-center justify-center relative pointer-events-auto hover:scale-125 hover:border-black transition-all group/port",
                linkingSourceId && linkingSourceId !== entity.id && "animate-pulse border-brand-orange"
            )}
            title={`${port.name} (${port.dataType})`}
          >
            <div className="w-1 h-1 bg-gray-300 rounded-full group-hover/port:bg-black" />
            <div className="absolute left-full ml-3 px-2 py-1 bg-black rounded text-[6px] font-black uppercase text-white whitespace-nowrap opacity-0 group-hover/port:opacity-100 transition-opacity pointer-events-none z-50">
                {port.name}
            </div>
          </button>
        ))}
      </div>

      <div className="absolute right-0 top-0 h-full flex flex-col justify-center gap-4 translate-x-1.5 z-10 pointer-events-none">
        {entity.ports.filter(p => p.type === 'output').map(port => (
          <button 
            key={port.id} 
            onClick={(e) => { e.stopPropagation(); onPortClick(port.id); }}
            className={cn(
                "w-3 h-3 rounded-full bg-black border-2 border-gray-800 shadow-md flex items-center justify-center relative pointer-events-auto hover:scale-125 transition-all group/port",
                linkingSourceId === entity.id && "ring-2 ring-brand-blue"
            )}
            title={`${port.name} (${port.dataType})`}
          >
            <div className="w-1 h-1 bg-white rounded-full group-hover/port:scale-110" />
             <div className="absolute right-full mr-3 px-2 py-1 bg-black rounded text-[6px] font-black uppercase text-white whitespace-nowrap opacity-0 group-hover/port:opacity-100 transition-opacity text-right pointer-events-none z-50">
                {port.name}
            </div>
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="h-12 px-5 flex items-center justify-between bg-gray-50/50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors border shadow-sm"
            style={{ 
              backgroundColor: 'white',
              borderColor: entity.color || '#E5E7EB'
            }}
          >
            <div style={{ color: entity.color || '#000' }}>
              {renderEntityIcon(entity.type, entity.icon)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-black truncate max-w-[120px]">{entity.title}</h3>
                {entity.category && (
                    <span className={cn(
                        "px-1.5 py-0.5 rounded text-[6px] font-black uppercase tracking-tighter",
                        entity.category === 'logic' ? "bg-brand-blue/10 text-brand-blue" :
                        entity.category === 'data' ? "bg-brand-green/10 text-brand-green" :
                        "bg-brand-orange/10 text-brand-orange"
                    )}>
                        {entity.category}
                    </span>
                )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          {entity.isAiGenerated && (
            <Sparkles size={12} className="text-brand-orange mr-1" />
          )}
          {entity.locked && <Lock size={12} className="text-gray-300 mr-1" />}
          <button className="p-1 px-1.5 text-gray-300 hover:text-black transition-colors">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-hidden relative bg-white">
        <EntityContent entity={entity} />
      </div>

      {/* Resize Handle */}
      {!entity.locked && (
        <div 
          className="absolute bottom-1.5 right-1.5 w-3 h-3 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity text-gray-200 hover:text-black"
          onMouseDown={handleResizeStart}
        >
          <div className="w-1 h-1 bg-current rounded-full" />
        </div>
      )}
    </motion.div>
  );
}

function renderEntityIcon(type: EntityType, customIcon?: string) {
  if (customIcon) {
    switch (customIcon) {
      case 'Bot': return <Bot size={14} />;
      case 'Database': return <Database size={14} />;
      case 'Globe': return <Globe size={14} />;
      case 'Radio': return <Radio size={14} />;
      case 'Code2': return <Code2 size={14} />;
      case 'Activity': return <Activity size={14} />;
    }
  }

  switch (type) {
    case 'ai-processor': return <Sparkles size={14} />;
    case 'data-source': return <Database size={14} />;
    case 'data-stream': return <Radio size={14} />;
    case 'logic-gate': return <Code2 size={14} />;
    case 'ui-component': return <Activity size={14} />;
    case 'ai-chat-panel': return <Sparkles size={14} />;
    case 'summary-panel': return <FileText size={14} />;
    case 'doc': return <FileJson size={14} />;
    default: return <Layout size={14} />;
  }
}

function EntityContent({ entity }: { entity: CanvasEntity }) {
  const vault = useAppStore((state) => state.vault);
  const record = vault.find(r => r.id === entity.payload?.recordId);

  if (record) {
    switch (entity.type) {
      case 'media-preview':
        return (
          <div className="w-full h-full flex items-center justify-center p-2">
            {record.base64 ? (
              <div className="relative w-full h-full">
                <Image 
                  src={record.base64} 
                  alt={record.name}
                  fill
                  className="object-contain rounded-2xl shadow-2xl" 
                  unoptimized
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 opacity-20">
                <Layout size={32} />
                <p className="text-[10px] uppercase font-black tracking-widest">Image Unavailable</p>
              </div>
            )}
          </div>
        );
      case 'code-preview':
      case 'markdown-preview':
        return (
          <div className="h-full overflow-auto scrollbar-hide font-mono text-[9px] text-gray-400 p-4 whitespace-pre-wrap bg-gray-50 rounded-xl border border-gray-100 selection:bg-brand-blue/10">
            {record.text || "Empty content"}
          </div>
        );
      case 'pdf-preview':
        return (
          <div className="w-full h-full rounded-xl overflow-hidden border border-gray-100 bg-white">
            <iframe 
              src={record.objectUrl} 
              className="w-full h-full border-none" 
              title={record.name}
            />
          </div>
        );
      case 'archive-record':
        return (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40 grayscale">
             <div className="p-6 bg-gray-50 rounded-full border border-gray-100 shadow-inner">
               <RotateCcw size={40} className="text-gray-300" />
             </div>
             <div className="text-center">
               <p className="text-xs font-black uppercase tracking-widest text-black">{record.ext} ARCHIVE</p>
               <p className="text-[10px] font-bold text-gray-400">Content Locked</p>
             </div>
          </div>
        );
      default:
        break;
    }
  }

  switch (entity.type) {
    case 'ai-chat-panel':
      return (
        <div className="h-full flex flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide pr-2 text-[10px]">
            {[
              { role: 'user', text: "Analyze records in Workspace." },
              { role: 'ai', text: "Scanning... 4 assets detected. Optimization recommended for 03.pdf." }
            ].map((msg, i) => (
              <div key={i} className={cn(
                "p-3 rounded-xl leading-relaxed max-w-[90%]",
                msg.role === 'ai' ? "bg-gray-50 text-gray-600 self-start" : "bg-black text-white self-end ml-auto"
              )}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="pt-4 mt-auto">
            <div className="flex items-center gap-2 p-1.5 bg-gray-50 border border-gray-100 rounded-xl">
              <input 
                type="text" 
                placeholder="Query workspace..." 
                className="bg-transparent border-none text-[10px] flex-1 outline-none text-black placeholder:text-gray-300 px-2" 
              />
              <button className="p-1.5 bg-black text-white rounded-lg hover:bg-brand-blue transition-colors"><ChevronRight size={12} /></button>
            </div>
          </div>
        </div>
      );
    case 'summary-panel':
      return (
        <div className="grid grid-cols-2 gap-3 h-full content-start">
          {[
            { label: 'Ops', val: '24', color: 'text-brand-blue' },
            { label: 'Load', val: '42%', color: 'text-brand-orange' },
            { label: 'Vault', val: vault.length.toString(), color: 'text-brand-green' },
            { label: 'Uptime', val: '99.9%', color: 'text-brand-yellow' },
          ].map(stat => (
            <div key={stat.label} className="p-4 bg-white border border-gray-50 rounded-2xl space-y-1 hover:shadow-sm transition-all cursor-default overflow-hidden relative group">
              <div className={cn("absolute top-0 left-0 w-1 h-full opacity-20", stat.color.replace('text', 'bg'))} />
              <p className="text-[8px] font-black uppercase text-gray-300 tracking-widest">{stat.label}</p>
              <p className={cn("text-lg font-black tracking-tighter", stat.color)}>{stat.val}</p>
            </div>
          ))}
          <div className="col-span-2 p-4 bg-white border border-gray-50 rounded-2xl mt-2 overflow-hidden relative">
            <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
              <span className="text-[8px] font-black uppercase text-gray-300 tracking-widest">Active Feed</span>
              <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />
            </div>
            <div className="space-y-2.5">
               {[1, 2].map(i => (
                 <div key={i} className="flex items-center gap-3 text-[9px] text-gray-400">
                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                    <p className="truncate font-medium">Block {i} integration optimized</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-10">
          <Layout size={32} />
          <p className="text-[10px] font-black uppercase tracking-widest">No Content Interface</p>
        </div>
      );
  }
}
