import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CanvasEntity } from '@/types/canvas';
import { cn } from '@/lib/utils';
import { Maximize2, Minimize2, Pin, Lock, Unlock, Trash2, ExternalLink, Focus } from 'lucide-react';

interface CanvasEngineProps {
  entities: CanvasEntity[];
  zoom: number;
  pan: { x: number; y: number };
  selectedEntityIds: string[];
  onEntityUpdate: (id: string, updates: Partial<CanvasEntity>) => void;
  onEntitySelect: (id: string, multi: boolean) => void;
  onEntityRemove: (id: string) => void;
  onPanChange: (pan: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onClearSelection: () => void;
  onFitToView: () => void;
}

export default function CanvasEngine({
  entities,
  zoom,
  pan,
  selectedEntityIds,
  onEntityUpdate,
  onEntitySelect,
  onEntityRemove,
  onPanChange,
  onZoomChange,
  onClearSelection,
  onFitToView
}: CanvasEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [marquee, setMarquee] = useState<{ start: { x: number, y: number }, end: { x: number, y: number } } | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const delta = -e.deltaY * 0.001;
      onZoomChange(zoom + delta);
    } else {
      onPanChange({
        x: pan.x - e.deltaX,
        y: pan.y - e.deltaY
      });
    }
  };

  const screenToCanvas = (x: number, y: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (x - rect.left - pan.x) / zoom,
      y: (y - rect.top - pan.y) / zoom
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey && !e.target)) {
      setIsPanning(true);
    } else if (e.target === containerRef.current) {
      onClearSelection();
      const pos = screenToCanvas(e.clientX, e.clientY);
      setMarquee({ start: pos, end: pos });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      onPanChange({
        x: pan.x + e.movementX,
        y: pan.y + e.movementY
      });
    } else if (marquee) {
      const pos = screenToCanvas(e.clientX, e.clientY);
      setMarquee(prev => prev ? { ...prev, end: pos } : null);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
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
          onEntitySelect(entity.id, true);
        }
      });
      setMarquee(null);
    }
    setIsPanning(false);
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-[#0f0f0f] cursor-grab active:cursor-grabbing select-none"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={(e) => handleMouseUp(e)}
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      />

      {/* Canvas Content */}
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
              onSelect={(multi) => onEntitySelect(entity.id, multi)}
              onUpdate={(updates) => onEntityUpdate(entity.id, updates)}
              onRemove={() => onEntityRemove(entity.id)}
              zoom={zoom}
            />
          ))}
        </AnimatePresence>

        {/* Selection Marquee */}
        {marquee && (
          <div 
            className="absolute border border-white/40 bg-white/5 pointer-events-none"
            style={{
              left: Math.min(marquee.start.x, marquee.end.x),
              top: Math.min(marquee.start.y, marquee.end.y),
              width: Math.abs(marquee.end.x - marquee.start.x),
              height: Math.abs(marquee.end.y - marquee.start.y),
            }}
          />
        )}
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-[#1a1a1a] border border-white/10 p-1 rounded-lg shadow-2xl">
        <button onClick={() => onZoomChange(zoom - 0.1)} className="p-2 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors">-</button>
        <span className="text-xs font-mono w-12 text-center text-white/60">{Math.round(zoom * 100)}%</span>
        <button onClick={() => onZoomChange(zoom + 0.1)} className="p-2 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors">+</button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button 
          onClick={onFitToView} 
          className="p-2 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"
          title="Fit to View"
        >
          <Focus size={14} />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button onClick={() => { onPanChange({ x: 0, y: 0 }); onZoomChange(1); }} className="text-[10px] px-2 uppercase font-bold text-white/40 hover:text-white transition-colors">Reset</button>
      </div>
    </div>
  );
}

function EntityCard({ entity, isSelected, onSelect, onUpdate, onRemove, zoom }: { 
  entity: CanvasEntity, 
  isSelected: boolean, 
  onSelect: (multi: boolean) => void,
  onUpdate: (updates: Partial<CanvasEntity>) => void,
  onRemove: () => void,
  zoom: number
}) {
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      onUpdate({
        width: Math.max(100, entity.width + e.movementX / zoom),
        height: Math.max(100, entity.height + e.movementY / zoom)
      });
    };

    const handleMouseUp = () => setIsResizing(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResizing, entity.width, entity.height, zoom]);

  return (
    <motion.div
      layoutId={entity.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: entity.x,
        y: entity.y,
        width: entity.width,
        height: entity.height,
        zIndex: entity.zIndex,
      }}
      drag={!entity.locked}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        onUpdate({ x: entity.x + info.offset.x, y: entity.y + info.offset.y });
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect(e.shiftKey || e.metaKey);
      }}
      className={cn(
        "absolute bg-[#1a1a1a] border rounded-xl shadow-2xl overflow-hidden flex flex-col group transition-shadow",
        isSelected ? "border-white ring-2 ring-white/20 shadow-white/10" : "border-white/10 hover:border-white/30",
        entity.locked && "cursor-default"
      )}
    >
      {/* Header */}
      <div className={cn(
        "p-3 border-b border-white/5 flex items-center justify-between bg-white/5",
        !entity.locked ? "cursor-move" : "cursor-default"
      )}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className={cn("w-2 h-2 rounded-full", isSelected ? "bg-white" : "bg-white/20")} />
          <span className="text-xs font-bold truncate uppercase tracking-wider text-white/80">{entity.title}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onUpdate({ locked: !entity.locked }); }} className={cn("p-1 rounded hover:bg-white/10", entity.locked && "text-blue-400")}>
            {entity.locked ? <Lock size={12} /> : <Unlock size={12} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden p-4 relative">
        {renderEntityContent(entity)}
      </div>

      {/* Footer / Meta */}
      <div className="px-3 py-2 border-t border-white/5 bg-black/20 flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold text-white/20">{entity.type}</span>
        <div className="flex items-center gap-2">
           <button className="text-white/20 hover:text-white transition-colors">
             <ExternalLink size={10} />
           </button>
        </div>
      </div>

      {/* Resize Handle */}
      {!entity.locked && (
        <div 
          onMouseDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize flex items-center justify-center group/resize"
        >
          <div className="w-1.5 h-1.5 bg-white/10 rounded-full group-hover/resize:bg-white transition-colors" />
        </div>
      )}
    </motion.div>
  );
}

function renderEntityContent(entity: CanvasEntity) {
  switch (entity.type) {
    case 'ai-chat-panel':
      return (
        <div className="space-y-3">
          <div className="p-2 rounded bg-white/5 text-[10px] text-white/60">How can I help you today?</div>
          <div className="flex gap-2">
            <div className="flex-1 h-8 bg-white/5 rounded border border-white/10" />
            <div className="w-8 h-8 bg-white rounded" />
          </div>
        </div>
      );
    case 'archive-record':
      return (
        <div className="space-y-2">
          <div className="h-2 w-3/4 bg-white/10 rounded" />
          <div className="h-2 w-1/2 bg-white/5 rounded" />
          <div className="h-2 w-2/3 bg-white/5 rounded" />
        </div>
      );
    case 'summary-panel':
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/40 uppercase">Health</span>
            <span className="text-[10px] font-bold text-green-400">92%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-[92%] bg-green-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-12 bg-white/5 rounded" />
            <div className="h-12 bg-white/5 rounded" />
          </div>
        </div>
      );
    case 'doc':
      return (
        <div className="space-y-2">
          <div className="h-3 w-full bg-white/10 rounded" />
          <div className="h-2 w-full bg-white/5 rounded" />
          <div className="h-2 w-full bg-white/5 rounded" />
          <div className="h-2 w-2/3 bg-white/5 rounded" />
        </div>
      );
    case 'slide':
      return (
        <div className="w-full h-full bg-[#141414] border border-white/5 rounded flex items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 italic">Slide Preview</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center h-full text-white/10 italic text-xs">
          No preview available
        </div>
      );
  }
}
