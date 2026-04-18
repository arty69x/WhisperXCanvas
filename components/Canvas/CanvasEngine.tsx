import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/lib/store';
import { CanvasEntity, EntityType } from '@/types/canvas';
import { cn } from '@/lib/utils';
import { 
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
  Layout,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Menu,
  MoreVertical,
  Zap,
  Link,
  GitBranch
} from 'lucide-react';
import { EntityLink } from '@/types/canvas';

export default function CanvasEngine() {
  const entities = useAppStore((state) => state.entities);
  const zoom = useAppStore((state) => state.zoom);
  const pan = useAppStore((state) => state.pan);
  const selectedEntityIds = useAppStore((state) => state.selectedEntityIds);
  const links = useAppStore((state) => state.links);
  const isLinkingMode = useAppStore((state) => state.isLinkingMode);
  const linkingSourceId = useAppStore((state) => state.linkingSourceId);
  
  const updateEntity = useAppStore((state) => state.updateEntity);
  const selectEntity = useAppStore((state) => state.selectEntity);
  const removeEntity = useAppStore((state) => state.removeEntity);
  const setPan = useAppStore((state) => state.setPan);
  const setZoom = useAppStore((state) => state.setZoom);
  const clearSelection = useAppStore((state) => state.clearSelection);
  const fitToView = useAppStore((state) => state.fitToView);
  const addLink = useAppStore((state) => state.addLink);
  const removeLink = useAppStore((state) => state.removeLink);
  const setLinkingMode = useAppStore((state) => state.setLinkingMode);
  const setLinkingSourceId = useAppStore((state) => state.setLinkingSourceId);

  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const [isPanningState, setIsPanningState] = useState(false);
  const [marquee, setMarquee] = useState<{ start: { x: number, y: number }, end: { x: number, y: number } } | null>(null);
  const settings = useAppStore((state) => state.settings);
  
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
    >
      {/* Grid Pattern */}
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
      
      {/* Entities Layer */}
      <div 
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        {/* Links Layer (SVG) */}
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

            const startX = source.x + source.width / 2;
            const startY = source.y + source.height / 2;
            const endX = target.x + target.width / 2;
            const endY = target.y + target.height / 2;

            // Simple cubic bezier curve
            const dx = endX - startX;
            const dy = endY - startY;
            const ctrlX = startX + dx * 0.5;
            const path = `M ${startX} ${startY} C ${ctrlX} ${startY}, ${ctrlX} ${endY}, ${endX} ${endY}`;

            return (
              <g key={link.id}>
                <motion.path 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  d={path}
                  fill="none"
                  stroke={link.color || "#ff7eb3"}
                  strokeWidth={2}
                  strokeOpacity={0.4}
                  markerEnd="url(#arrowhead)"
                  className={link.animated ? "animate-dash-flow" : ""}
                  style={{ strokeDasharray: '8 4' }}
                />
                <circle 
                  cx={endX} cy={endY} r={3} fill="#ff7eb3" 
                  className="animate-pulse shadow-[0_0_10px_#ff7eb3]" 
                />
              </g>
            );
          })}
        </svg>

        <AnimatePresence>
          {entities.map((entity) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              isSelected={selectedEntityIds.includes(entity.id)}
              onSelect={(multi) => {
                if (isLinkingMode) {
                  if (!linkingSourceId) {
                    setLinkingSourceId(entity.id);
                  } else if (linkingSourceId !== entity.id) {
                    addLink(linkingSourceId, entity.id);
                    setLinkingSourceId(null);
                  }
                } else {
                  selectEntity(entity.id, multi);
                }
              }}
              onUpdate={(updates) => updateEntity(entity.id, updates)}
              onRemove={() => removeEntity(entity.id)}
              zoom={zoom}
              isPotentialTarget={isLinkingMode && !!linkingSourceId && linkingSourceId !== entity.id}
              isLinkingSource={isLinkingMode && linkingSourceId === entity.id}
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
            className="absolute top-8 left-1/2 -translate-x-1/2 glass-panel p-4 rounded-3xl flex items-center gap-4 z-30 ring-1 ring-pink-500/20"
          >
            <div className="flex items-center gap-3 pr-4 border-r border-white/10">
              <Sparkles className="text-pink-400" size={18} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-50">{selectedEntityIds.length} Entities Selected</span>
                <span className="text-[8px] font-bold text-pink-200/40 uppercase tracking-tighter">Ready for orchestration</span>
              </div>
            </div>
            <button 
              onClick={() => useAppStore.getState().orchestrateEntities(selectedEntityIds)}
              className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_4px_15px_rgba(255,126,179,0.3)]"
            >
              Orchestrate AI Workflow
            </button>
            <button 
              onClick={() => clearSelection()}
              className="p-2.5 glass-button rounded-xl text-pink-200/40 hover:text-white"
            >
              <Minus size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 glass-panel rounded-2xl shadow-2xl z-20">
        <button onClick={() => setZoom(Math.max(zoom - 0.1, 0.1))} className="p-2 hover:bg-white/10 rounded-xl text-pink-200/40 hover:text-white transition-all">
          <Minus size={14} />
        </button>
        <div className="px-3 border-x border-white/5 text-[10px] font-black uppercase tracking-widest text-pink-100/60 min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </div>
        <button onClick={() => setZoom(Math.min(zoom + 0.1, 5))} className="p-2 hover:bg-white/10 rounded-xl text-pink-200/40 hover:text-white transition-all">
          <Plus size={14} />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button onClick={() => fitToView(window.innerWidth - 400, window.innerHeight, 100)} className="p-2 hover:bg-white/10 rounded-xl text-pink-200/40 hover:text-white transition-all" title="Fit to View">
          <Monitor size={14} />
        </button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-2 hover:bg-white/10 rounded-xl text-pink-200/40 hover:text-white transition-all" title="Reset View">
          <RotateCcw size={14} />
        </button>
        <div className="w-px h-10 bg-white/5 mx-2" />
        <button 
          onClick={() => setLinkingMode(!isLinkingMode)} 
          className={cn(
            "p-3 rounded-xl transition-all border flex items-center gap-2",
            isLinkingMode ? "bg-pink-500 text-white border-pink-400 shadow-[0_0_20px_rgba(255,126,179,0.4)]" : "glass-button border-white/5 text-pink-100/30 hover:text-white"
          )}
          title="Toggle Link Mode"
        >
          <Zap size={16} className={isLinkingMode ? "animate-pulse" : ""} />
          <span className="text-[9px] font-black uppercase tracking-widest hidden lg:block">Link Matrix</span>
        </button>
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
  isLinkingSource
}: { 
  entity: CanvasEntity, 
  isSelected: boolean, 
  onSelect: (multi: boolean) => void,
  onUpdate: (updates: Partial<CanvasEntity>) => void,
  onRemove: () => void,
  zoom: number,
  isPotentialTarget?: boolean,
  isLinkingSource?: boolean
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
        "group glass-card transition-all duration-300 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl",
        isSelected ? "border-pink-300/50 ring-2 ring-pink-500/20 shadow-[0_0_60px_rgba(255,126,179,0.15)] bg-white/20" : "border-white/10 hover:border-pink-300/30",
        entity.locked && "opacity-80",
        isLinkingSource && "ring-4 ring-pink-500 shadow-[0_0_40px_rgba(255,126,179,0.5)]",
        isPotentialTarget && "ring-2 ring-pink-400/40 cursor-alias"
      )}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="h-14 px-6 flex items-center justify-between bg-white/[0.05] border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-300/60 group-hover:text-pink-300 transition-colors">
            {renderEntityIcon(entity.type)}
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-pink-50 truncate max-w-[150px]">{entity.title}</h3>
            <p className="text-[8px] font-bold text-pink-200/20 uppercase tracking-tighter">NODE::{entity.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          {entity.isAiGenerated && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-pink-500/10 border border-pink-500/20 rounded-lg mr-2">
              <Sparkles size={10} className="text-pink-400" />
              <span className="text-[8px] font-black uppercase text-pink-400 tracking-widest">{entity.agentLabel || 'Agent'}</span>
            </div>
          )}
          {entity.locked && <Lock size={12} className="text-pink-100/40 mr-2" />}
          <button className="p-1.5 hover:bg-white/10 rounded-lg text-pink-100/20 hover:text-pink-100 transition-all">
            <ExternalLink size={12} />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded-lg text-pink-100/20 hover:text-pink-100 transition-all">
            <MoreVertical size={12} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-hidden relative">
        <EntityContent entity={entity} />
      </div>

      {/* Resize Handle */}
      {!entity.locked && (
        <div 
          className="absolute bottom-2 right-2 w-4 h-4 cursor-nwse-resize flex items-center justify-center text-white/10 hover:text-white transition-colors"
          onMouseDown={handleResizeStart}
        >
          <div className="w-1.5 h-1.5 bg-current rounded-full" />
        </div>
      )}
      
      {/* Selection Border */}
      {isSelected && (
        <motion.div 
          layoutId={`border-${entity.id}`}
          className="absolute inset-0 border-2 border-white/40 rounded-[2rem] pointer-events-none"
          initial={false}
        />
      )}
    </motion.div>
  );
}

function renderEntityIcon(type: EntityType) {
  switch (type) {
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
          <div className="h-full overflow-auto scrollbar-hide font-mono text-[9px] text-white/50 p-4 whitespace-pre-wrap bg-black/20 rounded-2xl border border-white/5 selection:bg-blue-500/20">
            {record.text || "Empty content"}
          </div>
        );
      case 'pdf-preview':
        return (
          <div className="w-full h-full rounded-2xl overflow-hidden border border-white/5 bg-black/40">
            <iframe 
              src={record.objectUrl} 
              className="w-full h-full border-none" 
              title={record.name}
            />
          </div>
        );
      case 'archive-record':
        return (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40">
             <div className="p-6 bg-white/5 rounded-full border border-white/5 shadow-inner">
               <RotateCcw size={48} className="text-white/40" />
             </div>
             <div className="text-center">
               <p className="text-xs font-black uppercase tracking-widest">{record.ext} ARCHIVE</p>
               <p className="text-[10px] font-bold text-white/20">Contents encrypted or compressed</p>
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
          <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide pr-2">
            {[
              { role: 'user', text: "Analyze records in Forge Matrix." },
              { role: 'ai', text: "Scanning records... Detected 4 normalized assets. Optimization targets identified in 03.pdf." }
            ].map((msg, i) => (
              <div key={i} className={cn(
                "p-3 rounded-2xl text-[10px] leading-relaxed max-w-[85%]",
                msg.role === 'ai' ? "bg-white/10 text-white/80 self-start" : "bg-blue-500/10 text-blue-400 self-end ml-auto border border-blue-500/10"
              )}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="pt-4 mt-auto">
            <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/5 rounded-xl">
              <input 
                type="text" 
                placeholder="Message AI Assistant..." 
                className="bg-transparent border-none text-[10px] flex-1 outline-none text-white/60 placeholder:text-white/20" 
              />
              <button className="p-1.5 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"><ChevronRight size={12} /></button>
            </div>
          </div>
        </div>
      );
    case 'summary-panel':
      return (
        <div className="grid grid-cols-2 gap-3 h-full content-start">
          {[
            { label: 'Active Tasks', val: '24', color: 'text-blue-400' },
            { label: 'System Load', val: '42%', color: 'text-purple-400' },
            { label: 'Vault Items', val: vault.length.toString(), color: 'text-green-400' },
            { label: 'Forge Matrix', val: 'Optimal', color: 'text-yellow-400' },
          ].map(stat => (
            <div key={stat.label} className="p-4 bg-white/5 border border-white/5 rounded-[1.5rem] space-y-1 hover:bg-white/10 transition-colors cursor-default">
              <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">{stat.label}</p>
              <p className={cn("text-lg font-black tracking-tighter", stat.color)}>{stat.val}</p>
            </div>
          ))}
          <div className="col-span-2 p-4 bg-white/5 border border-white/5 rounded-[1.5rem] mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">Recent Activity</span>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
               {[1, 2].map(i => (
                 <div key={i} className="flex items-center gap-3 text-[9px] text-white/40">
                   <div className="w-1 h-4 bg-white/5 rounded-full" />
                   <p className="truncate">Normalization complete for block_0{i}</p>
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
