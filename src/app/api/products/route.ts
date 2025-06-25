import { NextRequest, NextResponse } from 'next/server';
import { createProductApi } from '@/services/api/productApi';

// Initialize product API with server-side environment variables
const productApi = createProductApi({
  baseUrl: process.env.NEXT_PUBLIC_WABA_API_URL || "https://graph.facebook.com",
  accessToken: process.env.NEXT_PUBLIC_WABA_ACCESS_TOKEN || "",
  version: process.env.NEXT_PUBLIC_WABA_API_VERSION || "v23.0"
});

// Log configuration for debugging (excluding sensitive data)
console.log('API Configuration:', {
  baseUrl: process.env.NEXT_PUBLIC_WABA_API_URL || "https://graph.facebook.com",
  version: process.env.NEXT_PUBLIC_WABA_API_VERSION || "v23.0",
  hasAccessToken: !!process.env.NEXT_PUBLIC_WABA_ACCESS_TOKEN
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

    const limit = searchParams.get('limit') || undefined;
    const after = searchParams.get('after') || undefined;
    const before = searchParams.get('before') || undefined;
    const fields = searchParams.get('fields')?.split(',');
    const filter = Object.fromEntries(
      Array.from(searchParams.entries())
        .filter(([key]) => key.startsWith('filter['))
        .map(([key, value]) => [key.replace('filter[', '').replace(']', ''), value])
    );

    const products = await productApi.getProducts(catalogId, {
      limit: limit ? parseInt(limit) : undefined,
      after,
      before,
      fields,
      filter
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
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

    const productData = await request.json();
    const product = await productApi.createProduct(catalogId, productData);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
