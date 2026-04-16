import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CanvasEntity, WorkspaceState } from '@/types/canvas';

interface AppSettings {
  theme: 'dark' | 'light';
  compactMode: boolean;
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
}

interface ModuleData {
  [moduleId: string]: any;
}

interface AppState extends WorkspaceState {
  // Navigation
  activeModule: string;
  setActiveModule: (moduleId: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Canvas Actions
  addEntity: (entity: Omit<CanvasEntity, 'id' | 'createdAt' | 'updatedAt' | 'zIndex'>) => void;
  updateEntity: (id: string, updates: Partial<CanvasEntity>) => void;
  removeEntity: (id: string) => void;
  selectEntity: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  setPan: (pan: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  fitToView: (width?: number, height?: number, padding?: number) => void;

  // Vault Actions
  addRecordToVault: (record: IngestedRecord) => void;
  removeRecordFromVault: (id: string) => void;

  // Module Data
  moduleData: ModuleData;
  updateModuleData: (moduleId: string, data: any) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeModule: 'workspace',
      entities: [],
      vault: [],
      zoom: 1,
      pan: { x: 0, y: 0 },
      selectedEntityIds: [],
      settings: {
        theme: 'dark',
        compactMode: false,
        animationsEnabled: true,
        notificationsEnabled: true,
      },
      moduleData: {},

      // Actions
      setActiveModule: (moduleId) => set({ activeModule: moduleId }),

      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),

      addEntity: (entity) => set((state) => {
        const newEntity: CanvasEntity = {
          ...entity,
          id: Math.random().toString(36).substring(2, 11),
          zIndex: state.entities.length,
          createdAt: Date.now(),
          updatedAt: Date.now(),
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

      removeEntity: (id) => set((state) => ({
        entities: state.entities.filter((e) => e.id !== id),
        selectedEntityIds: state.selectedEntityIds.filter((sid) => sid !== id),
      })),

      selectEntity: (id, multi = false) => set((state) => {
        const isSelected = state.selectedEntityIds.includes(id);
        if (multi) {
          return {
            selectedEntityIds: isSelected
              ? state.selectedEntityIds.filter((sid) => sid !== id)
              : [...state.selectedEntityIds, id],
          };
        }
        return { selectedEntityIds: [id] };
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
