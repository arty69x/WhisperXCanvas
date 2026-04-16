export type EntityType = 
  | 'doc' | 'slide' | 'deck' | 'topology' | 'topology-node' 
  | 'archive-record' | 'reader-panel' | 'summary-panel' 
  | 'history-timeline' | 'readiness-panel' | 'ai-chat-panel' 
  | 'ai-task-panel' | 'forge-blueprint' | 'forge-matrix' 
  | 'forge-result' | 'vault-preview' | 'contact-panel' 
  | 'budget-panel' | 'code-preview' | 'markdown-preview' 
  | 'media-preview' | 'pdf-preview' | 'comparison-panel';

export interface CanvasEntity {
  id: string;
  type: EntityType;
  title: string;
  subtitle?: string;
  linkedSourceIds?: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized?: boolean;
  pinned?: boolean;
  locked?: boolean;
  visualMode?: 'compact' | 'full' | 'preview';
  payload?: any;
  createdAt: number;
  updatedAt: number;
}

export interface WorkspaceState {
  entities: CanvasEntity[];
  zoom: number;
  pan: { x: number; y: number };
  selectedEntityIds: string[];
}
