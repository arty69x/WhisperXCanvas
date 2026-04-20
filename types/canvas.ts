export type EntityType = 
  | 'doc' | 'slide' | 'deck' | 'topology' | 'topology-node' 
  | 'archive-record' | 'reader-panel' | 'summary-panel' 
  | 'history-timeline' | 'readiness-panel' | 'ai-chat-panel' 
  | 'ai-task-panel' | 'forge-blueprint' | 'forge-matrix' 
  | 'forge-result' | 'vault-preview' | 'contact-panel' 
  | 'budget-panel' | 'code-preview' | 'markdown-preview' 
  | 'media-preview' | 'pdf-preview' | 'comparison-panel'
  | 'ai-processor' | 'data-source' | 'data-stream' | 'logic-gate'
  | 'ui-component' | 'system-node' | 'signal-tower' | 'neural-link';

export interface EntityPort {
  id: string;
  name: string;
  type: 'input' | 'output';
  dataType: string;
  value?: any;
}

export interface CanvasEntity {
  id: string;
  type: EntityType;
  title: string;
  subtitle?: string;
  category?: 'logic' | 'data' | 'agent' | 'input' | 'output' | 'system';
  status?: 'active' | 'idle' | 'error' | 'success';
  color?: string; // High-fidelity category branding
  icon?: string; // Lucide icon name
  linkedSourceIds?: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized?: boolean;
  pinned?: boolean;
  locked?: boolean;
  isAiGenerated?: boolean;
  agentLabel?: string;
  visualMode?: 'compact' | 'full' | 'preview';
  payload?: any;
  ports: EntityPort[];
  executionStatus: 'idle' | 'running' | 'success' | 'error' | 'warning';
  energy: number; // 0-100 visual intensity
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

export interface EntityLink {
  id: string;
  sourceId: string;
  targetId: string;
  sourcePortId?: string;
  targetPortId?: string;
  label?: string;
  type?: 'dependency' | 'data-flow' | 'reference';
  color?: string;
  animated?: boolean;
  intensity?: number;
}

export interface WorkspaceState {
  entities: CanvasEntity[];
  links: EntityLink[];
  vault: IngestedRecord[];
  zoom: number;
  pan: { x: number; y: number };
  selectedEntityIds: string[];
  isLinkingMode: boolean;
  linkingSourceId: string | null;
  linkingSourcePortId: string | null;
  searchQuery: string;
  filterCategory: string | null;
}
