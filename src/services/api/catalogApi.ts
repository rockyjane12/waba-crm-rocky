import { Catalog, Product, ProductFilters, ProductSort } from "@/types/catalog";

export interface CatalogApiConfig {
  baseUrl: string;
  accessToken: string;
  businessAccountId: string;
  version: string;
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
  const { baseUrl, accessToken, businessAccountId, version } = config;

  const headers = {
    "Content-Type": "application/json",
  };

  const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `API request failed with status ${response.status}`,
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
        const url = `${baseUrl}/${version}/${businessAccountId}/owned_product_catalogs?access_token=${accessToken}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to fetch catalogs: ${response.statusText}`
          );
        }
        
        const fbResponse = await response.json();
        
        // Transform Facebook API response to our app's format
        const catalogs: Catalog[] = fbResponse.data.map((catalog: any) => ({
          id: catalog.id,
          name: catalog.name,
          description: "Facebook product catalog",
          thumbnailUrl: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          productCount: 0, // We'll need another API call to get this
          status: "active",
          isDefault: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        
        // Set the first catalog as default if any exist
        if (catalogs.length > 0) {
          catalogs[0].isDefault = true;
        }
        
        return {
          data: catalogs
        };
      } catch (error) {
        console.error("Error fetching catalogs:", error);
        throw new Error(`Failed to fetch catalogs: ${error instanceof Error ? error.message : String(error)}`);
      }
    },

    getProducts: async (
      catalogId: string,
      params?: QueryParams
    ): Promise<ApiResponse<Product[]>> => {
      try {
        const url = `${baseUrl}/${version}/${catalogId}/products?access_token=${accessToken}${buildQueryString(params)}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to fetch products: ${response.statusText}`
          );
        }
        
        const fbResponse = await response.json();
        
        // Transform Facebook API response to our app's format
        const products: Product[] = fbResponse.data.map((product: any) => ({
          id: product.id,
          catalogId,
          name: product.name || "Unnamed Product",
          description: product.description || "",
          price: product.price || 0,
          currency: product.currency || "USD",
          imageUrl: product.image_url || "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          status: product.availability === "in stock" ? "active" : "out_of_stock",
          category: "other",
          availability: product.availability === "in stock",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        
        return {
          data: products,
          meta: {
            page: params?.page || 1,
            pageSize: params?.pageSize || 10,
            totalItems: products.length,
            totalPages: Math.ceil(products.length / (params?.pageSize || 10))
          }
        };
      } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error(`Failed to fetch products: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };
};

// Create a default instance with Facebook Graph API implementation
export const catalogApi = createCatalogApi({
  baseUrl: process.env.NEXT_PUBLIC_WABA_API_URL,
  accessToken: process.env.NEXT_PUBLIC_WABA_ACCESS_TOKEN ,
  businessAccountId: process.env.WABA_BUSINESS_ACCOUNT_ID || '1558479901353656',
  version: process.env.NEXT_PUBLIC_WABA_API_VERSION
});