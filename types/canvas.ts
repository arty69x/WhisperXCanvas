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

export type RecordKind = 'text' | 'image' | 'pdf' | 'office' | 'archive' | 'binary' | 'unknown';

export interface IngestedRecord {
  id: string;
  name: string;
  ext: string;
  mime: string;
  size: number;
  kind: RecordKind;
  renderType: EntityType;
  text?: string;
  base64?: string;
  arrayBuffer?: ArrayBuffer | string; // Can be string for persistence
  objectUrl?: string;
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, any>;
}

export interface WorkspaceState {
  entities: CanvasEntity[];
  vault: IngestedRecord[];
  zoom: number;
  pan: { x: number; y: number };
  selectedEntityIds: string[];
}
