import { createClient } from '@supabase/supabase-js';
import { UploadedFile, ImageUploadOptions, StorageError } from '@/types/upload';

const STORAGE_BUCKET = 'product-images';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class StorageService {
  private static generateUniqueFileName(originalName: string): string {
    const timestamp = new Date().getTime();
    const fileExt = originalName.split('.').pop();
    const baseName = originalName.replace(/\.[^/.]+$/, ""); // Remove extension
    return `${baseName}_${timestamp}.${fileExt}`;
  }

  private static getWabaFolderPath(wabaId: string, fileName: string): string {
    return `waba_${wabaId}/${fileName}`;
  }

  private static validateFile(file: File, options: ImageUploadOptions): StorageError | null {
    const maxSize = (options.maxSizeMB || 8) * 1024 * 1024; // Default 8MB
    
    if (file.size > maxSize) {
      return {
        message: `File size must be less than ${options.maxSizeMB || 8}MB`,
        status: 400
      };
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return {
        message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.',
        status: 400
      };
    }

    return null;
  }

  static async uploadProductImage(
    file: File,
    options: ImageUploadOptions
  ): Promise<UploadedFile> {
    // Validate file
    const validationError = this.validateFile(file, options);
    if (validationError) {
      throw validationError;
    }

    // Generate unique filename with timestamp
    const uniqueFileName = this.generateUniqueFileName(options.fileName);
    const filePath = this.getWabaFolderPath(options.wabaId, uniqueFileName);

    try {
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, buffer, {
          contentType: options.contentType,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw {
          message: error.message,
          status: 500
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: filePath,
        size: file.size,
        type: file.type
      };
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to upload file',
        status: error.status || 500
      };
    }
  }

  static async deleteProductImage(wabaId: string, fileName: string): Promise<void> {
    const filePath = this.getWabaFolderPath(wabaId, fileName);
    
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      throw {
        message: error.message,
        status: 500
      };
    }
  }
} 