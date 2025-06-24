import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import formidable from 'formidable';
import { Readable } from 'stream';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to convert ReadableStream to Buffer
async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  
  return Buffer.concat(chunks);
}

export async function POST(request: NextRequest) {
  try {
    // Get the content type
    const contentType = request.headers.get('content-type') || '';
    
    // Process the request based on content type
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('image') as File;
      
      if (!file) {
        return NextResponse.json(
          { error: 'No file uploaded' },
          { status: 400 }
        );
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
          { status: 400 }
        );
      }

      // Validate file size (8MB max)
      if (file.size > 8 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size must be less than 8MB' },
          { status: 400 }
        );
      }

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${nanoid()}.${fileExt}`;
      const filePath = `cat_images/${fileName}`;

      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('cat_images')
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('cat_images')
        .getPublicUrl(filePath);

      return NextResponse.json({
        url: urlData.publicUrl,
        path: filePath,
        size: file.size,
        type: file.type
      });
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during upload' },
      { status: 500 }
    );
  }
}