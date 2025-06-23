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
        const response = await fetch(
          `https://graph.facebook.com/v23.0/1558479901353656/owned_product_catalogs?access_token=${process.env.NEXT_PUBLIC_WABA_ACCESS_TOKEN}`
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
          isDefault: catalog.id === "1444914166670906", // Set the first one as default
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        
        return {
          data: catalogs
        };
      } catch (error) {
        console.error("Error fetching catalogs:", error);
        // Fallback to mock data if API fails
        return getMockCatalogs();
      }
    },

    getProducts: async (
      catalogId: string,
      params?: QueryParams
    ): Promise<ApiResponse<Product[]>> {
      try {
        // Here you would implement the actual API call to get products
        // For now, we'll use mock data
        return getMockProducts(catalogId, params);
      } catch (error) {
        console.error("Error fetching products:", error);
        return getMockProducts(catalogId, params);
      }
    },

    // Mock implementation for development
    getMockCatalogs: getMockCatalogs,
    getMockProducts: getMockProducts
  };
};

// Mock data functions
async function getMockCatalogs(): Promise<ApiResponse<Catalog[]>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const mockCatalogs: Catalog[] = [
    {
      id: "1444914166670906",
      name: "Catalogue_Products",
      description: "Facebook product catalog",
      thumbnailUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      productCount: 24,
      status: "active",
      isDefault: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  return {
    data: mockCatalogs
  };
}

async function getMockProducts(
  catalogId: string,
  params?: QueryParams
): Promise<ApiResponse<Product[]>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const mockProducts: Product[] = [
    {
      id: "prod_1",
      catalogId,
      name: "Margherita Pizza",
      description: "Classic pizza with tomato, mozzarella, and basil",
      price: 12.99,
      currency: "USD",
      imageUrl: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      status: "active",
      category: "main_courses",
      availability: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "prod_2",
      catalogId,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with Caesar dressing and croutons",
      price: 8.99,
      currency: "USD",
      imageUrl: "https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      status: "active",
      category: "appetizers",
      availability: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "prod_3",
      catalogId,
      name: "Chocolate Cake",
      description: "Rich chocolate cake with ganache frosting",
      price: 6.99,
      currency: "USD",
      imageUrl: "https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      status: "active",
      category: "desserts",
      availability: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Apply filters if provided
  let filteredProducts = [...mockProducts];
  
  if (params?.filters) {
    const filters = params.filters;
    
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    
    if (filters.availability) {
      filteredProducts = filteredProducts.filter(p => 
        filters.availability === 'true' ? p.availability : !p.availability
      );
    }
    
    if (filters.status) {
      filteredProducts = filteredProducts.filter(p => p.status === filters.status);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }
  }
  
  // Apply sorting
  if (params?.sort) {
    const sortField = params.sort as keyof Product;
    const direction = params.direction || 'asc';
    
    filteredProducts.sort((a, b) => {
      if (a[sortField] < b[sortField]) return direction === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  // Apply pagination
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return {
    data: paginatedProducts,
    meta: {
      page,
      pageSize,
      totalItems,
      totalPages
    }
  };
}

// Create a default instance with implementation
export const catalogApi = createCatalogApi({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  accessToken: process.env.NEXT_PUBLIC_API_TOKEN || 'mock-token',
  endpoints: {
    getCatalogs: '/catalogs',
    getProducts: (catalogId) => `/catalogs/${catalogId}/products`
  }
});