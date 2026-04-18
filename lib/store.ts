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
  toggleFocusedMode: (focused?: boolean) => void;

  // Canvas Actions
  addEntity: (entity: Omit<CanvasEntity, 'id' | 'createdAt' | 'updatedAt' | 'zIndex'>) => void;
  updateEntity: (id: string, updates: Partial<CanvasEntity>) => void;
  toggleEntityLock: (id: string) => void;
  removeEntity: (id: string) => void;
  
  // New: Links
  addLink: (sourceId: string, targetId: string, type?: EntityLink['type']) => void;
  removeLink: (id: string) => void;
  isLinkingMode: boolean;
  setLinkingMode: (active: boolean) => void;
  linkingSourceId: string | null;
  setLinkingSourceId: (id: string | null) => void;

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
  orchestrateEntities: (ids: string[]) => void;
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

      // Actions
      setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
      
      setActiveModule: (moduleId) => set({ activeModule: moduleId }),
      setAiQuery: (query) => set({ prefilledAiQuery: query, activeModule: 'ai' }),

      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),

      toggleFocusedMode: (focused) => set((state) => ({ 
        isFocusedMode: focused !== undefined ? focused : !state.isFocusedMode 
      })),

      addEntity: (entity) => set((state) => {
        const newEntity: CanvasEntity = {
          ...entity,
          id: Math.random().toString(36).substring(2, 11),
          zIndex: state.entities.length,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          locked: false,
        };
        return {
          entities: [...state.entities, newEntity],
          selectedEntityIds: [newEntity.id],
        };
      }),

      updateEntity: (id, updates) => set((state) => ({
        entities: state.entities.map((e) =>
          e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e
        ),
      })),

      toggleEntityLock: (id) => set((state) => ({
        entities: state.entities.map((e) =>
          e.id === id ? { ...e, locked: !e.locked, updatedAt: Date.now() } : e
        ),
      })),

      removeEntity: (id) => set((state) => ({
        entities: state.entities.filter((e) => e.id !== id),
        links: state.links.filter((l) => l.sourceId !== id && l.targetId !== id),
        selectedEntityIds: state.selectedEntityIds.filter((sid) => sid !== id),
      })),

      addLink: (sourceId, targetId, type = 'data-flow') => set((state) => {
        // Prevent duplicate links
        const exists = state.links.find(l => 
          (l.sourceId === sourceId && l.targetId === targetId) ||
          (l.sourceId === targetId && l.targetId === sourceId)
        );
        if (exists || sourceId === targetId) return state;

        const newLink: EntityLink = {
          id: `link_${Math.random().toString(36).substring(2, 9)}`,
          sourceId,
          targetId,
          type,
          animated: true,
          color: '#ff7eb3'
        };
        return { links: [...state.links, newLink] };
      }),

      removeLink: (id) => set((state) => ({
        links: state.links.filter(l => l.id !== id)
      })),

      setLinkingMode: (active) => set({ isLinkingMode: active, linkingSourceId: null }),
      setLinkingSourceId: (id) => set({ linkingSourceId: id }),

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
