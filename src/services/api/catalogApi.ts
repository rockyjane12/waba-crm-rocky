import { Catalog, Product, ProductFilters, ProductSort } from "@/types/catalog";

export interface CatalogApiConfig {
  baseUrl: string;
  accessToken: string;
  endpoints: {
    getCatalogs: string;
    getProducts: (catalogId: string) => string;
  };
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  filters?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const createCatalogApi = (config: CatalogApiConfig) => {
  const { baseUrl, accessToken, endpoints } = config;

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
  };

  const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || "An error occurred",
        response.status,
        errorData
      );
    }

    return response.json();
  };

  const fetchWithRetry = async <T>(
    url: string,
    options: RequestInit,
    retries = 3
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(url, options);
      return await handleResponse<T>(response);
    } catch (error) {
      if (retries > 0 && error instanceof ApiError && error.status >= 500) {
        // Wait for 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchWithRetry<T>(url, options, retries - 1);
      }
      throw error;
    }
  };

  const buildQueryString = (params?: QueryParams): string => {
    if (!params) return "";

    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.direction) queryParams.append("direction", params.direction);

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : "";
  };

  return {
    getCatalogs: async (): Promise<ApiResponse<Catalog[]>> => {
      try {
        // Use Facebook Graph API to get catalogs
        const accessToken = process.env.NEXT_PUBLIC_WABA_ACCESS_TOKEN;
        const response = await fetch(
          `https://graph.facebook.com/v23.0/1558479901353656/owned_product_catalogs?access_token=${accessToken}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch catalogs: ${response.statusText}`);
        }
        
        const fbData = await response.json();
        
        // Transform Facebook API response to our Catalog format
        const catalogs: Catalog[] = fbData.data.map((catalog: any) => ({
          id: catalog.id,
          name: catalog.name,
          description: "Facebook product catalog",
          thumbnailUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          productCount: 0, // We'll need another API call to get this
          status: "active",
          isDefault: catalog.id === fbData.data[0]?.id, // Set the first one as default
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        
        return {
          data: catalogs
        };
      } catch (error) {
        console.error("Error fetching catalogs:", error);
        throw error;
      }
    },

    getProducts: async (
      catalogId: string,
      params?: QueryParams
    ): Promise<ApiResponse<Product[]>> => {
      try {
        // Here you would implement the actual API call to get products
        // For now, we'll throw an error to indicate this needs to be implemented
        throw new Error("Product API not implemented");
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    }
  };
};

// Create a default instance with implementation
export const catalogApi = createCatalogApi({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  accessToken: process.env.NEXT_PUBLIC_API_TOKEN || 'mock-token',
  endpoints: {
    getCatalogs: '/catalogs',
    getProducts: (catalogId) => `/catalogs/${catalogId}/products`
  }
});