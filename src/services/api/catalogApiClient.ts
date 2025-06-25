import { Catalog } from "@/types/catalog";

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

export const catalogApiClient = {
  getCatalogs: async (): Promise<ApiResponse<Catalog[]>> => {
    try {
      const response = await fetch('/api/catalogs');
      return handleResponse<ApiResponse<Catalog[]>>(response);
    } catch (error) {
      console.error("Error fetching catalogs:", error);
      throw error;
    }
  }
};
