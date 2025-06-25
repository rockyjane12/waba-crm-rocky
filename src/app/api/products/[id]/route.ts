import { NextRequest, NextResponse } from 'next/server';
import { createProductApi } from '@/services/api/productApi';

// Initialize product API with server-side environment variables
const productApi = createProductApi({
  baseUrl: process.env.WABA_API_URL || "https://graph.facebook.com",
  accessToken: process.env.WABA_ACCESS_TOKEN || "",
  version: process.env.WABA_API_VERSION || "v23.0"
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await productApi.getProduct(params.id);
    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productData = await request.json();
    const product = await productApi.updateProduct(params.id, productData);
    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await productApi.deleteProduct(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
