import { Product, ProductResponse } from "@/types/product";

export interface ProductQueryParams {
  limit?: number;
  after?: string;
  before?: string;
  fields?: string[];
  filter?: Record<string, string>;
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

const handleResponse = async <T>(response: Response): Promise<T> => {
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

const buildQueryString = (params: Record<string, any> = {}): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        queryParams.append(key, value.join(','));
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        Object.entries(value).forEach(([filterKey, filterValue]) => {
          if (filterValue !== undefined && filterValue !== null) {
            queryParams.append(`filter[${filterKey}]`, String(filterValue));
          }
        });
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const productApiClient = {
  getProducts: async (catalogId: string, params?: ProductQueryParams): Promise<ProductResponse> => {
    try {
      const queryString = buildQueryString({ catalogId, ...params });
      const response = await fetch(`/api/products${queryString}`);
      return handleResponse<ProductResponse>(response);
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProduct: async (productId: string): Promise<Product> => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      return handleResponse<Product>(response);
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  createProduct: async (catalogId: string, productData: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const response = await fetch(`/api/products?catalogId=${catalogId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      return handleResponse<Product>(response);
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  updateProduct: async (productId: string, productData: Partial<Product>): Promise<Product> => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      return handleResponse<Product>(response);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  deleteProduct: async (productId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      await handleResponse<void>(response);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },
};
