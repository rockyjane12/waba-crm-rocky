import { NextRequest, NextResponse } from 'next/server';
import { CatalogListResponseSchema } from '@/features/catalog/api/catalog-client';
import { getServerEnvVars } from '@/lib/utils/env';

export const dynamic = 'force-dynamic'; // Ensure the route is not cached

async function fetchMetaGraphAPI(path: string, params: Record<string, string> = {}) {
  const envVars = getServerEnvVars();
  console.log('Environment variables loaded:', {
    WABA_API_URL: envVars.WABA_API_URL,
    WABA_API_VERSION: envVars.WABA_API_VERSION,
    BUSINESS_ID: envVars.BUSINESS_ID,
    // Don't log access token for security
    hasAccessToken: !!envVars.WABA_ACCESS_TOKEN,
  });
  
  const url = new URL(`${envVars.WABA_API_URL}/${envVars.WABA_API_VERSION}/${path}`);
  
  // Add query parameters
  const searchParams = new URLSearchParams({
    access_token: envVars.WABA_ACCESS_TOKEN,
    ...params
  });
  url.search = searchParams.toString();

  console.log('Fetching from Meta Graph API:', {
    url: url.toString().replace(envVars.WABA_ACCESS_TOKEN, '[REDACTED]'),
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('Meta Graph API response:', {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Meta Graph API error response:', error);
    throw new Error(error.error?.message || `Failed to fetch from Meta Graph API: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Meta Graph API success response:', {
    dataShape: {
      keys: Object.keys(data),
      dataLength: data.data?.length,
      hasPaging: !!data.paging,
    },
  });

  return data;
}

export async function GET(request: NextRequest) {
  try {
    const envVars = getServerEnvVars();
    
    // Fetch catalogs from Meta Graph API
    console.log('Fetching catalogs for business:', envVars.BUSINESS_ID);
    const metaResponse = await fetchMetaGraphAPI(`${envVars.BUSINESS_ID}/owned_product_catalogs`);

    // Validate response schema
    const validatedResponse = CatalogListResponseSchema.parse(metaResponse);

    return NextResponse.json(validatedResponse);
  } catch (error: any) {
    console.error('Error fetching catalogs from Meta Graph API:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch catalogs',
        code: error.code || 'META_API_ERROR',
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
