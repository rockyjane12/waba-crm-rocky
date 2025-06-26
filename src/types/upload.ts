export interface UploadedFile {
  url: string;
  path: string;
  size: number;
  type: string;
}

export interface ImageUploadOptions {
  wabaId: string;
  contentType: string;
  fileName: string;
  maxSizeMB?: number;
}

export interface StorageError {
  message: string;
  status: number;
} 