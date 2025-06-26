import { NextRequest, NextResponse } from 'next/server';
import { StorageService } from '@/lib/supabase/services/storageService';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  try {
    // Create a Supabase client using the route handler client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    // Get the session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get WABA ID from user metadata or users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('waba_id')
      .eq('id', session.user.id)
      .single();

    if (userError || !userData?.waba_id) {
      return NextResponse.json(
        { error: 'No WABA ID found for user' },
        { status: 400 }
      );
    }

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

      // Upload file using StorageService
      const uploadedFile = await StorageService.uploadProductImage(file, {
        wabaId: userData.waba_id,
        contentType: file.type,
        fileName: file.name,
        maxSizeMB: 8
      });

      return NextResponse.json(uploadedFile);
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
      { status: error.status || 500 }
    );
  }
}