export interface EmbeddedRecord {
  id: string;
  name: string;
  title: string;
  ext: string;
  mime: string;
  size: number;
  tags: string[];
  sourceCategory: string;
  origin: string;
  summary?: string;
  searchableText?: string;
  parsedText?: string;
  base64Fallback?: string;
  rawPathReference?: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'whisperx_archive_records';

export function getArchiveRecords(): EmbeddedRecord[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load archive records', e);
    }
  }
  return [];
}

export function saveArchiveRecords(records: EmbeddedRecord[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addArchiveRecord(record: Omit<EmbeddedRecord, 'id' | 'createdAt' | 'updatedAt'>) {
  const records = getArchiveRecords();
  const newRecord: EmbeddedRecord = {
    ...record,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveArchiveRecords([...records, newRecord]);
  return newRecord;
}
