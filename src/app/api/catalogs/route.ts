import { NextRequest, NextResponse } from 'next/server';
import { createCatalogApi } from '@/services/api/catalogApi';
import { getServerEnvVars } from '@/lib/utils/env';

// Initialize catalog API with server-side environment variables
const getServerConfig = () => {
  const serverEnv = getServerEnvVars();
  return createCatalogApi({
    baseUrl: serverEnv.WABA_API_URL,
    accessToken: serverEnv.WABA_ACCESS_TOKEN,
    version: serverEnv.WABA_API_VERSION,
    businessId: serverEnv.BUSINESS_ID,
  });
};

export async function GET(request: NextRequest) {
  try {
    const catalogApi = getServerConfig();
    const catalogs = await catalogApi.getCatalogs();
    console.log("catalogs",catalogs);
    
    return NextResponse.json(catalogs);
  } catch (error: any) {
    console.error('Error fetching catalogs------>:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch catalogs' },
      { status: 500 }
    );
  }
}
