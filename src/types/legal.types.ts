export interface LegalDocument {
  id: string;
  title: string;
  category: string;
  version?: string | null;
  sourceUrl?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentPayload {
  title: string;
  category: string;
  version?: string;
  sourceUrl?: string;
  file: File;
}
