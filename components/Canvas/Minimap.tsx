'use client';

import React, { useMemo } from 'react';
import { useAppStore } from '@/lib/store';

export default function Minimap() {
  const entities = useAppStore((state) => state.entities);
  const pan = useAppStore((state) => state.pan);
  const zoom = useAppStore((state) => state.zoom);

  // Calculate bounds
  const bounds = useMemo(() => {
    if (entities.length === 0) return { minX: 0, minY: 0, width: 2000, height: 2000 };
    
    const minX = Math.min(...entities.map(e => e.x)) - 200;
    const minY = Math.min(...entities.map(e => e.y)) - 200;
    const maxX = Math.max(...entities.map(e => e.x + e.width)) + 200;
    const maxY = Math.max(...entities.map(e => e.y + e.height)) + 200;
    
    return {
      minX,
      minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }, [entities]);

  // Viewport rect
  const viewport = useMemo(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0, w: 0, h: 0 };
    return {
      x: -pan.x / zoom,
      y: -pan.y / zoom,
      w: window.innerWidth / zoom,
      h: window.innerHeight / zoom
    };
  }, [pan, zoom]);

  const mapWidth = 160;
  const mapHeight = (bounds.height / bounds.width) * mapWidth;

  const scale = mapWidth / bounds.width;

  return (
    <div className="absolute bottom-6 right-6 w-40 glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl p-1 pointer-events-none md:pointer-events-auto">
      <svg 
        width={mapWidth} 
        height={mapHeight} 
        viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
        className="w-full h-auto"
      >
        {/* Entities */}
        {entities.map(e => (
          <rect 
            key={e.id}
            x={e.x}
            y={e.y}
            width={e.width}
            height={e.height}
            rx={20}
            fill={e.color || '#ff7eb3'}
            opacity={0.3}
          />
        ))}

        {/* Viewport indicator */}
        <rect 
          x={viewport.x}
          y={viewport.y}
          width={viewport.w}
          height={viewport.h}
          fill="none"
          stroke="white"
          strokeWidth={10 / scale}
          opacity={0.5}
        />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-pink-500/[0.05] to-transparent pointer-events-none" />
    </div>
  );
}
