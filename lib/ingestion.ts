import { IngestedRecord, RecordKind, EntityType } from '@/types/canvas';

/**
 * Normalized Ingestion Pipeline
 * Supports: text, image, pdf, office documents, archives, and generic binary files.
 */
export async function processFile(file: File): Promise<IngestedRecord> {
  const name = file.name;
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const mime = file.type || 'application/octet-stream';
  const size = file.size;
  const id = Math.random().toString(36).substring(2, 11);
  const now = Date.now();

  let kind: RecordKind = 'unknown';
  let renderType: EntityType = 'doc';

  // Determine Kind and RenderType
  if (mime.startsWith('text/') || ['txt', 'md', 'js', 'ts', 'tsx', 'jsx', 'json', 'csv', 'yaml'].includes(ext)) {
    kind = 'text';
    renderType = ext === 'md' ? 'markdown-preview' : 'code-preview';
  } else if (mime.startsWith('image/')) {
    kind = 'image';
    renderType = 'media-preview';
  } else if (mime === 'application/pdf') {
    kind = 'pdf';
    renderType = 'pdf-preview';
  } else if (
    ['zip', 'rar', '7z', 'tar', 'tgz', 'gz'].includes(ext) || 
    ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'].includes(mime)
  ) {
    kind = 'archive';
    renderType = 'archive-record';
  } else if (
    ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext) ||
    mime.includes('officedocument') || 
    mime.includes('msword') || 
    mime.includes('ms-excel') || 
    mime.includes('ms-powerpoint')
  ) {
    kind = 'office';
    renderType = 'doc';
  } else {
    kind = 'binary';
    renderType = 'vault-preview';
  }

  const record: IngestedRecord = {
    id,
    name,
    ext,
    mime,
    size,
    kind,
    renderType,
    createdAt: now,
    updatedAt: now,
    objectUrl: URL.createObjectURL(file), // Transient but useful for immediate preview
  };

  // Processing based on Kind
  try {
    if (kind === 'text') {
      record.text = await file.text();
    }

    if (kind === 'image') {
      const reader = new FileReader();
      record.base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    // For PDF and Office, we might want a raw look in some modules
    // but the objectUrl is usually enough for the 'renderType' components.
    
  } catch (err) {
    console.error(`Inversion Pipeline Error processing ${name}:`, err);
  }

  return record;
}

export function getKindIcon(kind: RecordKind) {
  switch (kind) {
    case 'text': return 'FileText';
    case 'image': return 'Image';
    case 'pdf': return 'FileCode';
    case 'office': return 'Briefcase';
    case 'archive': return 'Archive';
    case 'binary': return 'Database';
    default: return 'File';
  }
}
