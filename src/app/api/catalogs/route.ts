import { NextRequest, NextResponse } from 'next/server';
import { createCatalogApi } from '@/services/api/catalogApi';

// Initialize catalog API with server-side environment variables
const catalogApi = createCatalogApi({
  baseUrl: process.env.WABA_API_URL || "https://graph.facebook.com",
  accessToken: process.env.WABA_ACCESS_TOKEN || "",
  version: process.env.WABA_API_VERSION || "v23.0",
  businessAccountId: process.env.WABA_BUSINESS_ACCOUNT_ID || ""
});

export async function GET(request: NextRequest) {
  try {
    const catalogs = await catalogApi.getCatalogs();
    return NextResponse.json(catalogs);
  } catch (error: any) {
    console.error('Error fetching catalogs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch catalogs' },
      { status: 500 }
    );
  }
}
