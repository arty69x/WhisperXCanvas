import { useState, useEffect, useCallback } from 'react';
import { CanvasEntity, WorkspaceState } from '@/types/canvas';

const STORAGE_KEY = 'whisperx_workspace_state';

export function useWorkspaceStore() {
  const [state, setState] = useState<WorkspaceState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to load workspace state', e);
        }
      }
    }
    return {
      entities: [],
      zoom: 1,
      pan: { x: 0, y: 0 },
      selectedEntityIds: [],
    };
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addEntity = useCallback((entity: Omit<CanvasEntity, 'id' | 'createdAt' | 'updatedAt' | 'zIndex'>) => {
    const newEntity: CanvasEntity = {
      ...entity,
      id: Math.random().toString(36).substr(2, 9),
      zIndex: state.entities.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setState(prev => ({
      ...prev,
      entities: [...prev.entities, newEntity],
      selectedEntityIds: [newEntity.id],
    }));
  }, [state.entities.length]);

  const updateEntity = useCallback((id: string, updates: Partial<CanvasEntity>) => {
    setState(prev => ({
      ...prev,
      entities: prev.entities.map(e => e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e),
    }));
  }, []);

  const removeEntity = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      entities: prev.entities.filter(e => e.id !== id),
      selectedEntityIds: prev.selectedEntityIds.filter(sid => sid !== id),
    }));
  }, []);

  const selectEntity = useCallback((id: string, multi: boolean = false) => {
    setState(prev => ({
      ...prev,
      selectedEntityIds: multi 
        ? (prev.selectedEntityIds.includes(id) ? prev.selectedEntityIds.filter(sid => sid !== id) : [...prev.selectedEntityIds, id])
        : [id],
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedEntityIds: [] }));
  }, []);

  const fitToView = useCallback(() => {
    if (state.entities.length === 0) {
      setState(prev => ({ ...prev, zoom: 1, pan: { x: 0, y: 0 } }));
      return;
    }

    const padding = 100;
    const minX = Math.min(...state.entities.map(e => e.x));
    const minY = Math.min(...state.entities.map(e => e.y));
    const maxX = Math.max(...state.entities.map(e => e.x + e.width));
    const maxY = Math.max(...state.entities.map(e => e.y + e.height));

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth - 320 : 1000; // Subtract sidebar/inspector
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    const zoomX = (viewportWidth - padding * 2) / contentWidth;
    const zoomY = (viewportHeight - padding * 2) / contentHeight;
    const newZoom = Math.max(0.1, Math.min(1, Math.min(zoomX, zoomY)));

    const newPan = {
      x: (viewportWidth / 2) - (minX + contentWidth / 2) * newZoom,
      y: (viewportHeight / 2) - (minY + contentHeight / 2) * newZoom
    };

    setState(prev => ({ ...prev, zoom: newZoom, pan: newPan }));
  }, [state.entities]);

  const setPan = useCallback((pan: { x: number; y: number }) => {
    setState(prev => ({ ...prev, pan }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(0.1, Math.min(5, zoom)) }));
  }, []);

  return {
    ...state,
    addEntity,
    updateEntity,
    removeEntity,
    selectEntity,
    clearSelection,
    fitToView,
    setPan,
    setZoom,
  };
}
