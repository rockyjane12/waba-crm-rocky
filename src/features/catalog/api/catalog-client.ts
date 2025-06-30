import { z } from 'zod';
import { createApiClient } from '@/lib/api/client';
import { env } from '@/lib/utils/env';

// Meta Graph API Catalog Schema
export const CatalogSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional().nullable(),
  productCount: z.number().optional().default(0),
  status: z.enum(['active', 'inactive']).optional().default('inactive'),
  isDefault: z.boolean().optional().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Catalog = z.infer<typeof CatalogSchema>;

// Response Schemas
export const CatalogListResponseSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })),
  paging: z.object({
    cursors: z.object({
      before: z.string(),
      after: z.string(),
    }),
  }).optional(),
});

export type CatalogListResponse = z.infer<typeof CatalogListResponseSchema>;

// API Client
const catalogApi = createApiClient({
  baseUrl: env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increase timeout to 30 seconds
  retries: 2,     // Add retries
  retryDelay: 1000, // 1 second delay between retries
});

interface GetCatalogsParams {
  limit?: number;
  after?: string;
  before?: string;
}

const catalogClient = {
  getCatalogs: async (params?: GetCatalogsParams): Promise<CatalogListResponse> => {
    const response = await catalogApi.get<CatalogListResponse>('/api/catalogs', {
      params: params as Record<string, string | number | undefined>,
    });

    return CatalogListResponseSchema.parse(response.data);
  },

  getCatalog: async (id: string): Promise<Catalog> => {
    const response = await catalogApi.get<Catalog>(`/api/catalogs/${id}`);
    return CatalogSchema.parse(response.data);
  },

  createCatalog: async (data: Omit<Catalog, 'id' | 'created_at' | 'updated_at'>): Promise<Catalog> => {
    const response = await catalogApi.post<Catalog>('/api/catalogs', {
      body: JSON.stringify(data),
    });
    return CatalogSchema.parse(response.data);
  },

  updateCatalog: async (id: string, data: Partial<Catalog>): Promise<Catalog> => {
    const response = await catalogApi.patch<Catalog>(`/api/catalogs/${id}`, {
      body: JSON.stringify(data),
    });
    return CatalogSchema.parse(response.data);
  },

  deleteCatalog: async (id: string): Promise<void> => {
    await catalogApi.delete(`/api/catalogs/${id}`);
  },
};

export { catalogClient };
