import { Catalog } from "@/types/catalog";

export interface CatalogApiConfig {
  baseUrl: string;
  accessToken: string;
  version: string;
  businessAccountId: string;
}

export interface ApiResponse<T> {
  data: T;
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
  const { baseUrl, accessToken, version, businessAccountId } = config;

  const headers = {
    "Content-Type": "application/json",
  };

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
    getCatalogs: async (): Promise<ApiResponse<Catalog[]>> => {
      try {
        const url = `${baseUrl}/${version}/${businessAccountId}/owned_product_catalogs?access_token=${accessToken}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error?.message || errorData.message || `Failed to fetch catalogs: ${response.statusText}`;
          throw new Error(errorMessage);
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
        throw error;
      }
    }
  };
};

// Create a default instance with Facebook Graph API implementation
export const catalogApi = createCatalogApi({
  baseUrl: process.env.NEXT_PUBLIC_WABA_API_URL || "https://graph.facebook.com",
  accessToken: process.env.NEXT_PUBLIC_WABA_ACCESS_TOKEN || "",
  version: process.env.NEXT_PUBLIC_WABA_API_VERSION || "v23.0",
  businessAccountId: process.env.NEXT_PUBLIC_WABA_BUSINESS_ACCOUNT_ID || ""
});