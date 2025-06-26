import { Catalog } from "@/types/catalog";

export interface ApiResponse<T> {
  data: T;
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
    previous?: string;
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

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error?.message || errorData.message || `API request failed with status ${response.status}`,
      response.status,
      errorData
    );
  }
  return response.json();
};

export const catalogApiClient = {
  getCatalogs: async (options?: { 
    limit?: number; 
    after?: string; 
    before?: string; 
  }): Promise<ApiResponse<Catalog[]>> => {
    try {
      const searchParams = new URLSearchParams();
      if (options?.limit) searchParams.append('limit', options.limit.toString());
      if (options?.after) searchParams.append('after', options.after);
      if (options?.before) searchParams.append('before', options.before);

      const url = `/api/catalogs${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return handleResponse<ApiResponse<Catalog[]>>(response);
    } catch (error) {
      console.error("Error fetching catalogs:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'An unknown error occurred',
        500
      );
    }
  }
};
