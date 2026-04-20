import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CanvasEntity, WorkspaceState, IngestedRecord } from '@/types/canvas';

interface UserProfile {
  name: string;
  avatar?: string;
  role: string;
  id: string;
}

interface AppSettings {
  theme: 'dark' | 'light';
  compactMode: boolean;
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  autoSave: boolean;
  canvasGridVisible: boolean;
  canvasSnapToGrid: boolean;
}

interface ModuleData {
  [moduleId: string]: any;
}

interface AppState extends WorkspaceState {
  // User
  user: UserProfile;
  setUser: (user: Partial<UserProfile>) => void;

  // Navigation
  activeModule: string;
  setActiveModule: (moduleId: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;

  // New: Focused Mode
  isFocusedMode: boolean;
  setFocusedMode: (focused?: boolean) => void;

  // Canvas Actions
  addEntity: (entity: Omit<CanvasEntity, 'id' | 'createdAt' | 'updatedAt' | 'zIndex' | 'executionStatus' | 'energy'>) => void;
  updateEntity: (id: string, updates: Partial<CanvasEntity>) => void;
  updatePortValue: (entityId: string, portId: string, value: any) => void;
  toggleEntityLock: (id: string) => void;
  removeEntity: (id: string) => void;
  resetWorkspace: () => void;
  
  // New: Links
  addLink: (sourceId: string, targetId: string, type?: EntityLink['type'], sourcePortId?: string, targetPortId?: string) => void;
  removeLink: (id: string) => void;
  isLinkingMode: boolean;
  setLinkingMode: (active: boolean) => void;
  linkingSourceId: string | null;
  linkingSourcePortId: string | null;
  setLinkingSourceId: (id: string | null, portId?: string | null) => void;

  // New: Workspace Management
  lastSaved: number | null;
  isAutoSaving: boolean;
  setAutoSaving: (active: boolean) => void;
  orchestrateEntities: (ids: string[]) => void;
  applyLayout: (type: 'grid' | 'circle' | 'random') => void;

  // New: Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // New: Data Engine
  runEngineStep: () => void;
  
  selectEntity: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  setPan: (pan: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  fitToView: (width?: number, height?: number, padding?: number) => void;
  focusOnEntity: (id: string) => void;

  // Vault Actions
  addRecordToVault: (record: IngestedRecord) => void;
  removeRecordFromVault: (id: string) => void;

  // Module Data
  moduleData: ModuleData;
  updateModuleData: (moduleId: string, data: any) => void;

  // New: AI Marking
  markAsAiGenerated: (id: string, label?: string) => void;

  // New: AI Context
  prefilledAiQuery: string | null;
  setAiQuery: (query: string | null) => void;
  // Search & Filter
  searchQuery: string;
  filterCategory: string | null;
  setSearchQuery: (query: string) => void;
  setFilterCategory: (category: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: {
        name: 'Arty69xx',
        role: 'Administrator',
        id: 'admin_01',
      },
      activeModule: 'workspace',
      entities: [],
      links: [],
      vault: [],
      zoom: 1,
      pan: { x: 0, y: 0 },
      selectedEntityIds: [],
      isLinkingMode: false,
      linkingSourceId: null,
      linkingSourcePortId: null,
      searchQuery: '',
      filterCategory: null,
      lastSaved: null,
      isAutoSaving: false,
      settings: {
        theme: 'dark',
        compactMode: false,
        animationsEnabled: true,
        notificationsEnabled: true,
        autoSave: true,
        canvasGridVisible: true,
        canvasSnapToGrid: false,
      },
      moduleData: {},
      isFocusedMode: false,
      prefilledAiQuery: null,
      history: [] as { entities: CanvasEntity[], links: EntityLink[] }[],
      future: [] as { entities: CanvasEntity[], links: EntityLink[] }[],
      canUndo: false,
      canRedo: false,

      // Helper to push history
      _pushHistory: () => {
        const { entities, links, history } = get();
        const newState = { 
          entities: JSON.parse(JSON.stringify(entities)), 
          links: JSON.parse(JSON.stringify(links)) 
        };
        set({ 
          history: [...history.slice(-49), newState], // Limit to 50 steps
          future: [],
          canUndo: true,
          canRedo: false
        });
      },

      // Actions
      setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
      
      undo: () => {
        const { history, future, entities, links } = get();
        if (history.length === 0) return;

        const prevState = history[history.length - 1];
        const currentState = { 
          entities: JSON.parse(JSON.stringify(entities)), 
          links: JSON.parse(JSON.stringify(links)) 
        };

        set({
          entities: prevState.entities,
          links: prevState.links,
          history: history.slice(0, -1),
          future: [currentState, ...future.slice(0, 49)],
          canUndo: history.length > 1,
          canRedo: true
        });
      },

      redo: () => {
        const { history, future, entities, links } = get();
        if (future.length === 0) return;

        const nextState = future[0];
        const currentState = { 
          entities: JSON.parse(JSON.stringify(entities)), 
          links: JSON.parse(JSON.stringify(links)) 
        };

        set({
          entities: nextState.entities,
          links: nextState.links,
          history: [...history, currentState],
          future: future.slice(1),
          canUndo: true,
          canRedo: future.length > 1
        });
      },

      runEngineStep: () => {
        const { entities, links, updatePortValue } = get();
        
        // Propagation logic: For each link, take value from source output and set to target input
        links.forEach(link => {
          if (link.sourcePortId && link.targetPortId) {
            const source = entities.find(e => e.id === link.sourceId);
            const sourcePort = source?.ports.find(p => p.id === link.sourcePortId);
            
            if (sourcePort?.value !== undefined) {
              updatePortValue(link.targetId, link.targetPortId, sourcePort.value);
            }
          }
        });
      },
      setAiQuery: (query) => set({ prefilledAiQuery: query, activeModule: 'ai' }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterCategory: (category) => set({ filterCategory: category }),

      orchestrateEntities: (ids) => {
        set((state) => ({
          entities: state.entities.map(e => 
            ids.includes(e.id) ? { ...e, executionStatus: 'running' } : e
          )
        }));
        
        // Auto-complete orchestration after 3 seconds
        setTimeout(() => {
          set((state) => ({
            entities: state.entities.map(e => 
              ids.includes(e.id) ? { ...e, executionStatus: 'completed' } : e
            )
          }));
        }, 3000);
      },

      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),

      setFocusedMode: (focused) => set((state) => ({ 
        isFocusedMode: focused !== undefined ? focused : !state.isFocusedMode 
      })),

      addEntity: (entity) => {
        get()._pushHistory();
        set((state) => {
          const id = `node_${Math.random().toString(36).substring(2, 9)}`;
          const newEntity: CanvasEntity = {
            ...entity,
            id,
            zIndex: state.entities.length + 1,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            executionStatus: 'idle',
            energy: 30,
            locked: false,
          };
          return {
            entities: [...state.entities, newEntity],
            selectedEntityIds: [newEntity.id],
          };
        });
      },

      resetWorkspace: () => {
        get()._pushHistory();
        set({ entities: [], links: [], selectedEntityIds: [] });
      },

      updateEntity: (id, updates) => {
        // We only push history for major changes, but for now let's push for all
        // debounce this in a real scenario
        set((state) => ({
          entities: state.entities.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e
          ),
        }));
      },

      updatePortValue: (entityId, portId, value) => set((state) => ({
        entities: state.entities.map(e => 
          e.id === entityId 
            ? { ...e, ports: e.ports.map(p => p.id === portId ? { ...p, value } : p) }
            : e
        )
      })),

      toggleEntityLock: (id) => set((state) => ({
        entities: state.entities.map((e) =>
          e.id === id ? { ...e, locked: !e.locked, updatedAt: Date.now() } : e
        ),
      })),

      removeEntity: (id) => {
        get()._pushHistory();
        set((state) => ({
          entities: state.entities.filter((e) => e.id !== id),
          links: state.links.filter((l) => l.sourceId !== id && l.targetId !== id),
          selectedEntityIds: state.selectedEntityIds.filter((sid) => sid !== id),
        }));
      },

      addLink: (sourceId, targetId, type = 'data-flow', sourcePortId, targetPortId) => {
        get()._pushHistory();
        set((state) => {
          // Prevent duplicate links with same ports
          const exists = state.links.find(l => 
            l.sourceId === sourceId && 
            l.targetId === targetId && 
            l.sourcePortId === sourcePortId && 
            l.targetPortId === targetPortId
          );
          if (exists || sourceId === targetId) return state;

          const newLink: EntityLink = {
            id: `link_${Math.random().toString(36).substring(2, 9)}`,
            sourceId,
            targetId,
            sourcePortId,
            targetPortId,
            type,
            animated: true,
            color: '#ff7eb3'
          };
          return { links: [...state.links, newLink] };
        });
      },

      removeLink: (id) => set((state) => ({
        links: state.links.filter(l => l.id !== id)
      })),

      setLinkingMode: (active) => set({ isLinkingMode: active, linkingSourceId: null, linkingSourcePortId: null }),
      setLinkingSourceId: (id, portId) => set({ linkingSourceId: id, linkingSourcePortId: portId || null }),

      setAutoSaving: (active) => set({ isAutoSaving: active, lastSaved: active ? get().lastSaved : Date.now() }),

      orchestrateEntities: (ids) => {
        const { entities, addLink } = get();
        if (ids.length < 2) return;
        
        // Simple logic: Link them in sequence for now
        for (let i = 0; i < ids.length - 1; i++) {
            addLink(ids[i], ids[i+1], 'data-flow');
        }
      },

      applyLayout: (type) => set((state) => {
        const { entities } = state;
        const spacing = 450;
        const newEntities = [...entities];

        if (type === 'grid') {
            const cols = Math.ceil(Math.sqrt(entities.length));
            newEntities.forEach((e, i) => {
                const col = i % cols;
                const row = Math.floor(i / cols);
                e.x = col * spacing;
                e.y = row * spacing;
            });
        } else if (type === 'circle') {
            const radius = entities.length * 60;
            const centerX = 1000;
            const centerY = 1000;
            newEntities.forEach((e, i) => {
                const angle = (i / entities.length) * Math.PI * 2;
                e.x = centerX + radius * Math.cos(angle) - e.width / 2;
                e.y = centerY + radius * Math.sin(angle) - e.height / 2;
            });
        }

        return { entities: newEntities };
      }),

      selectEntity: (id, multi = false) => set((state) => {
        const isSelected = state.selectedEntityIds.includes(id);
        const maxZ = state.entities.length > 0 
          ? Math.max(...state.entities.map(e => e.zIndex)) 
          : 0;

        // Bring the newly selected entity to top
        const updatedEntities = state.entities.map(e => 
          e.id === id ? { ...e, zIndex: maxZ + 1 } : e
        );

        if (multi) {
          return {
            entities: updatedEntities,
            selectedEntityIds: isSelected
              ? state.selectedEntityIds.filter((sid) => sid !== id)
              : [...state.selectedEntityIds, id],
          };
        }
        return { 
          entities: updatedEntities,
          selectedEntityIds: [id] 
        };
      }),

      clearSelection: () => set({ selectedEntityIds: [] }),

      setPan: (pan) => set({ pan }),

      setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),

      fitToView: (width, height, pad) => {
        const { entities } = get();
        if (entities.length === 0) {
          set({ zoom: 1, pan: { x: 0, y: 0 } });
          return;
        }

        const padding = pad ?? 100;
        const minX = Math.min(...entities.map((e) => e.x));
        const minY = Math.min(...entities.map((e) => e.y));
        const maxX = Math.max(...entities.map((e) => e.x + e.width));
        const maxY = Math.max(...entities.map((e) => e.y + e.height));

        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;

        const viewportWidth = width ?? (typeof window !== 'undefined' ? window.innerWidth - 320 : 1000);
        const viewportHeight = height ?? (typeof window !== 'undefined' ? window.innerHeight : 800);

        const zoomX = (viewportWidth - padding * 2) / contentWidth;
        const zoomY = (viewportHeight - padding * 2) / contentHeight;
        const newZoom = Math.max(0.1, Math.min(1, Math.min(zoomX, zoomY)));

        const newPan = {
          x: (viewportWidth / 2) - (minX + contentWidth / 2) * newZoom,
          y: (viewportHeight / 2) - (minY + contentHeight / 2) * newZoom,
        };

        set({ zoom: newZoom, pan: newPan });
      },

      focusOnEntity: (id) => {
        const { entities, setZoom, setPan, selectEntity } = get();
        const entity = entities.find(e => e.id === id);
        if (!entity) return;

        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth - 320 : 1000;
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
        
        const newZoom = 1.2;
        const newPan = {
          x: (viewportWidth / 2) - (entity.x + entity.width / 2) * newZoom,
          y: (viewportHeight / 2) - (entity.y + entity.height / 2) * newZoom,
        };

        selectEntity(id);
        setZoom(newZoom);
        setPan(newPan);
      },

      addRecordToVault: (record) => set((state) => ({
        vault: [...state.vault, record]
      })),

      removeRecordFromVault: (id) => set((state) => ({
        vault: state.vault.filter((r) => r.id !== id)
      })),

      updateModuleData: (moduleId, data) => set((state) => ({
        moduleData: {
          ...state.moduleData,
          [moduleId]: typeof data === 'function' ? data(state.moduleData[moduleId]) : { ...state.moduleData[moduleId], ...data }
        }
      })),

      markAsAiGenerated: (id, label) => set((state) => ({
        entities: state.entities.map((e) =>
          e.id === id ? { ...e, isAiGenerated: true, agentLabel: label || 'Agentic', updatedAt: Date.now() } : e
        ),
      })),

      orchestrateEntities: (ids) => {
        const { entities } = get();
        const selected = entities.filter(e => ids.includes(e.id));
        const titles = selected.map(e => e.title).join(', ');
        const query = `Orchestrate a workflow for the following entities: ${titles}. Define the task sequence and suggest new orchestration nodes.`;
        get().setAiQuery(query);
      }
    }),
    {
      name: 'whisperx-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Hook for managing module-specific data with persistence
 */
export function useModuleData<T>(moduleId: string, initialData: T): [T, (data: Partial<T> | ((prev: T) => T)) => void] {
  const data = useAppStore((state) => state.moduleData[moduleId]) as T;
  const updateData = useAppStore((state) => state.updateModuleData);

  const setModuleData = (newData: Partial<T> | ((prev: T) => T)) => updateData(moduleId, newData);

  return [data || initialData, setModuleData];
}

// Backward compatibility or alternative hook if needed
export const useWorkspaceStore = () => useAppStore();
