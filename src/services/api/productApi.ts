import { Product, ProductResponse } from "@/types/product";

export interface ProductApiConfig {
  baseUrl: string;
  accessToken: string;
  version: string;
}

export interface ProductQueryParams {
  limit?: number;
  after?: string;
  before?: string;
  fields?: string[];
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

export const createProductApi = (config: ProductApiConfig) => {
  const { baseUrl, accessToken, version } = config;

  const defaultFields = [
    "name",
    "currency",
    "availability",
    "description",
    "image_url",
    "price",
    "retailer_id",
    "visibility",
    "url",
    "sale_price"
  ].join(",");

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

  return {
    getProducts: async (catalogId: string, params?: ProductQueryParams): Promise<ProductResponse> => {
      try {
        const searchParams = new URLSearchParams();
        searchParams.append("access_token", accessToken);
        searchParams.append("fields", params?.fields?.join(",") || defaultFields);
        
        if (params?.limit) searchParams.append("limit", params.limit.toString());
        if (params?.after) searchParams.append("after", params.after);
        if (params?.before) searchParams.append("before", params.before);
        
        const url = `${baseUrl}/${version}/${catalogId}/products?${searchParams.toString()}`;
        console.log("Fetching products from URL:", url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to fetch products: ${response.statusText}`
          );
        }
        
        return handleResponse<ProductResponse>(response);
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },

    getProduct: async (productId: string): Promise<Product> => {
      try {
        const searchParams = new URLSearchParams();
        searchParams.append("access_token", accessToken);
        searchParams.append("fields", defaultFields);
        
        const url = `${baseUrl}/${version}/${productId}?${searchParams.toString()}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to fetch product: ${response.statusText}`
          );
        }
        
        return handleResponse<Product>(response);
      } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
      }
    },

    createProduct: async (catalogId: string, productData: Omit<Product, 'id'>): Promise<Product> => {
      try {
        const url = `${baseUrl}/${version}/${catalogId}/products?access_token=${accessToken}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to create product: ${response.statusText}`
          );
        }
        
        return handleResponse<Product>(response);
      } catch (error) {
        console.error("Error creating product:", error);
        throw error;
      }
    },

    updateProduct: async (productId: string, productData: Partial<Product>): Promise<Product> => {
      try {
        const url = `${baseUrl}/${version}/${productId}?access_token=${accessToken}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to update product: ${response.statusText}`
          );
        }
        
        return handleResponse<Product>(response);
      } catch (error) {
        console.error("Error updating product:", error);
        throw error;
      }
    },

    deleteProduct: async (productId: string): Promise<void> => {
      try {
        const url = `${baseUrl}/${version}/${productId}?access_token=${accessToken}`;
        
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to delete product: ${response.statusText}`
          );
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
      }
    }
  };
};

// Create a default instance with Facebook Graph API implementation
export const productApi = createProductApi({
  baseUrl: process.env.NEXT_PUBLIC_WABA_API_URL || "https://graph.facebook.com",
  accessToken: process.env.NEXT_PUBLIC_WABA_ACCESS_TOKEN || "",
  version: process.env.NEXT_PUBLIC_WABA_API_VERSION || "v23.0"
});