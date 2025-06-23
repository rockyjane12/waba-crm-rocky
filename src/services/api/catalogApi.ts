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
      const url = `${baseUrl}${endpoints.getCatalogs}`;
      return fetchWithRetry<Catalog[]>(url, { headers });
    },

    getProducts: async (
      catalogId: string,
      params?: QueryParams
    ): Promise<ApiResponse<Product[]>> => {
      const queryString = buildQueryString(params);
      const url = `${baseUrl}${endpoints.getProducts(catalogId)}${queryString}`;
      return fetchWithRetry<Product[]>(url, { headers });
    },

    // Mock implementation for development
    async getMockCatalogs(): Promise<ApiResponse<Catalog[]>> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockCatalogs: Catalog[] = [
        {
          id: "cat_1",
          name: "Main Menu",
          description: "Our standard food menu with all items",
          thumbnailUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          productCount: 24,
          status: "active",
          isDefault: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "cat_2",
          name: "Seasonal Specials",
          description: "Limited time seasonal offerings",
          thumbnailUrl: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          productCount: 8,
          status: "active",
          isDefault: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "cat_3",
          name: "Catering Menu",
          description: "Special menu for events and large orders",
          thumbnailUrl: "https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          productCount: 15,
          status: "active",
          isDefault: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "cat_4",
          name: "Holiday Menu",
          description: "Special holiday offerings",
          thumbnailUrl: "https://images.pexels.com/photos/5718071/pexels-photo-5718071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          productCount: 12,
          status: "draft",
          isDefault: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      return {
        data: mockCatalogs
      };
    },

    async getMockProducts(
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
        },
        {
          id: "prod_4",
          catalogId,
          name: "Iced Coffee",
          description: "Cold brewed coffee served over ice",
          price: 4.50,
          currency: "USD",
          imageUrl: "https://images.pexels.com/photos/2074122/pexels-photo-2074122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          status: "active",
          category: "beverages",
          availability: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "prod_5",
          catalogId,
          name: "Garlic Bread",
          description: "Toasted bread with garlic butter",
          price: 3.99,
          currency: "USD",
          imageUrl: "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          status: "active",
          category: "sides",
          availability: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "prod_6",
          catalogId,
          name: "Seasonal Fruit Tart",
          description: "Buttery pastry filled with seasonal fruits",
          price: 7.99,
          currency: "USD",
          imageUrl: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          status: "out_of_stock",
          category: "desserts",
          availability: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "prod_7",
          catalogId,
          name: "Veggie Burger",
          description: "Plant-based burger with all the fixings",
          price: 10.99,
          currency: "USD",
          imageUrl: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          status: "active",
          category: "main_courses",
          availability: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "prod_8",
          catalogId,
          name: "Truffle Fries",
          description: "French fries tossed with truffle oil and parmesan",
          price: 5.99,
          currency: "USD",
          imageUrl: "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          status: "active",
          category: "sides",
          availability: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "prod_9",
          catalogId,
          name: "Mango Smoothie",
          description: "Fresh mango blended with yogurt and honey",
          price: 5.50,
          currency: "USD",
          imageUrl: "https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          status: "active",
          category: "beverages",
          availability: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "prod_10",
          catalogId,
          name: "Caprese Salad",
          description: "Fresh mozzarella, tomatoes, and basil with balsamic glaze",
          price: 9.99,
          currency: "USD",
          imageUrl: "https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          status: "active",
          category: "appetizers",
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
  };
};

// Create a default instance with mock implementation
export const catalogApi = createCatalogApi({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  accessToken: process.env.NEXT_PUBLIC_API_TOKEN || 'mock-token',
  endpoints: {
    getCatalogs: '/catalogs',
    getProducts: (catalogId) => `/catalogs/${catalogId}/products`
  }
});