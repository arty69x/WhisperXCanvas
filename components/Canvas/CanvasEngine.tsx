import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/lib/store';
import { CanvasEntity } from '@/types/canvas';
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
  MoreVertical
} from 'lucide-react';

export default function CanvasEngine() {
  const entities = useAppStore((state) => state.entities);
  const zoom = useAppStore((state) => state.zoom);
  const pan = useAppStore((state) => state.pan);
  const selectedEntityIds = useAppStore((state) => state.selectedEntityIds);
  
  const updateEntity = useAppStore((state) => state.updateEntity);
  const selectEntity = useAppStore((state) => state.selectEntity);
  const removeEntity = useAppStore((state) => state.removeEntity);
  const setPan = useAppStore((state) => state.setPan);
  const setZoom = useAppStore((state) => state.setZoom);
  const clearSelection = useAppStore((state) => state.clearSelection);
  const fitToView = useAppStore((state) => state.fitToView);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [marquee, setMarquee] = useState<{ start: { x: number, y: number }, end: { x: number, y: number } } | null>(null);
  
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
      const delta = -e.deltaY * 0.001; // Slower zoom
      const newZoom = Math.min(Math.max(zoom + delta, 0.1), 5);
      
      // Zoom relative to mouse position
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
      setIsPanning(true);
    } else if (e.target === containerRef.current) {
      clearSelection();
      const pos = screenToCanvas(e.clientX, e.clientY);
      setMarquee({ start: pos, end: pos });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
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
        const inBounds = 
          entity.x >= x1 && 
          entity.y >= y1 && 
          entity.x + entity.width <= x2 && 
          entity.y + entity.height <= y2;
        
        if (inBounds) {
          selectEntity(entity.id, true);
        }
      });
      setMarquee(null);
    }
    setIsPanning(false);
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
        isPanning ? "cursor-grabbing" : "cursor-crosshair"
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
        <AnimatePresence>
          {entities.map((entity) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              isSelected={selectedEntityIds.includes(entity.id)}
              onSelect={(multi) => selectEntity(entity.id, multi)}
              onUpdate={(updates) => updateEntity(entity.id, updates)}
              onRemove={() => removeEntity(entity.id)}
              zoom={zoom}
            />
          ))}
        </AnimatePresence>

        {/* Marquee Selection Box */}
        {marquee && (
          <div 
            className="absolute border border-white/20 bg-white/5 pointer-events-none rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.05)]"
            style={{
              left: Math.min(marquee.start.x, marquee.end.x),
              top: Math.min(marquee.start.y, marquee.end.y),
              width: Math.abs(marquee.end.x - marquee.start.x),
              height: Math.abs(marquee.end.y - marquee.start.y),
            }}
          />
        )}
      </div>

      {/* Control Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-20">
        <button onClick={() => setZoom(Math.max(zoom - 0.1, 0.1))} className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all">
          <Minus size={14} />
        </button>
        <div className="px-3 border-x border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </div>
        <button onClick={() => setZoom(Math.min(zoom + 0.1, 5))} className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all">
          <Plus size={14} />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button onClick={() => fitToView(window.innerWidth - 400, window.innerHeight, 100)} className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all" title="Fit to View">
          <Monitor size={14} />
        </button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all" title="Reset View">
          <RotateCcw size={14} />
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
  zoom 
}: { 
  entity: CanvasEntity, 
  isSelected: boolean, 
  onSelect: (multi: boolean) => void,
  onUpdate: (updates: Partial<CanvasEntity>) => void,
  onRemove: () => void,
  zoom: number
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
      if (isDragging) {
        onUpdate({
          x: e.clientX / zoom - dragOffset.x,
          y: e.clientY / zoom - dragOffset.y
        });
      } else if (isResizing) {
        onUpdate({
          width: Math.max(100, e.clientX / zoom - entity.x),
          height: Math.max(100, e.clientY / zoom - entity.y)
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
        "group bg-black/40 backdrop-blur-2xl border transition-all duration-300 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl",
        isSelected ? "border-white/40 ring-1 ring-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]" : "border-white/10 hover:border-white/20 hover:bg-black/60",
        entity.locked && "opacity-80"
      )}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="h-14 px-6 flex items-center justify-between bg-white/[0.03] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
            {renderEntityIcon(entity.type)}
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60 truncate max-w-[150px]">{entity.title}</h3>
            <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">{entity.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {entity.locked && <Lock size={12} className="text-white/40 mr-2" />}
          <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/20 hover:text-white transition-all">
            <ExternalLink size={12} />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/20 hover:text-white transition-all">
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
