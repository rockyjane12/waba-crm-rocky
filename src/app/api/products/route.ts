import { NextRequest, NextResponse } from 'next/server';
import { createProductApi } from '@/services/api/productApi';
import { getServerEnvVars } from '@/lib/utils/env';

// Initialize product API with server-side environment variables
const getServerConfig = () => {
  const serverEnv = getServerEnvVars();
  return createProductApi({
    baseUrl: serverEnv.WABA_API_URL,
    accessToken: serverEnv.WABA_ACCESS_TOKEN,
    version: serverEnv.WABA_API_VERSION
  });
};

// Log configuration for debugging (excluding sensitive data)
console.log('API Configuration:', {
  baseUrl: process.env.NEXT_PUBLIC_WABA_API_URL || "https://graph.facebook.com",
  version: process.env.NEXT_PUBLIC_WABA_API_VERSION || "v23.0",
  hasAccessToken: !!process.env.WABA_ACCESS_TOKEN
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const catalogId = searchParams.get('catalogId');
    
    if (!catalogId) {
      return NextResponse.json(
        { error: 'Catalog ID is required' },
        { status: 400 }
      );
    }

    const productApi = getServerConfig();
    const params = {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      after: searchParams.get('after') || undefined,
      before: searchParams.get('before') || undefined,
      fields: searchParams.get('fields')?.split(',')
    };

    const products = await productApi.getProducts(catalogId, params);
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    
    // Handle specific Facebook API errors
    if (error.message?.includes('access token')) {
      return NextResponse.json(
        { 
          error: 'Invalid or expired Facebook access token. Please check your WABA_ACCESS_TOKEN environment variable.',
          details: error.message
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const catalogId = searchParams.get('catalogId');
    
    if (!catalogId) {
      return NextResponse.json(
        { error: 'Catalog ID is required' },
        { status: 400 }
      );
    }

    const productApi = getServerConfig();
    const data = await request.json();
    
    const product = await productApi.createProduct(catalogId, data);
    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    
    // Handle specific Facebook API errors
    if (error.message?.includes('access token')) {
      return NextResponse.json(
        { 
          error: 'Invalid or expired Facebook access token. Please check your WABA_ACCESS_TOKEN environment variable.',
          details: error.message
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: error.status || 500 }
    );
  }
}
