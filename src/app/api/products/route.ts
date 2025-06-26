import { NextRequest, NextResponse } from 'next/server';
import { createProductApi } from '@/services/api/productApi';

// Initialize product API with server-side environment variables
const productApi = createProductApi({
  baseUrl: process.env.NEXT_PUBLIC_WABA_API_URL || "https://graph.facebook.com",
  accessToken: process.env.WABA_ACCESS_TOKEN || "",
  version: process.env.NEXT_PUBLIC_WABA_API_VERSION || "v23.0"
});

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

    // Make direct call to Facebook Graph API
    const fields = [
      "name",
      "currency",
      "availability",
      "description",
      "image_url",
      "price",
      "retailer_id",
      "visibility",
      "url",
      "sale_price"
    ].join(",");

    const fbSearchParams = new URLSearchParams({
      fields,
      access_token: process.env.WABA_ACCESS_TOKEN || "",
    });

    if (searchParams.get('limit')) {
      fbSearchParams.append('limit', searchParams.get('limit')!);
    }
    if (searchParams.get('after')) {
      fbSearchParams.append('after', searchParams.get('after')!);
    }
    if (searchParams.get('before')) {
      fbSearchParams.append('before', searchParams.get('before')!);
    }

    const url = `https://graph.facebook.com/v23.0/${catalogId}/products?${fbSearchParams.toString()}`;
    console.log("Making direct request to:", url.replace(process.env.WABA_ACCESS_TOKEN || "", "[REDACTED]"));

    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("Facebook API error:", error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch products from Facebook' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching products:', error);
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

    const productData = await request.json();
    const product = await productApi.createProduct(catalogId, productData);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: error.status || 500 }
    );
  }
}
