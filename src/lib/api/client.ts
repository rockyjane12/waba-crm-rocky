import { ApiClientConfig, ApiError, ApiResponse, RequestOptions } from './types';

const DEFAULT_CONFIG: Required<ApiClientConfig> = {
  baseUrl: '',
  headers: {},
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
};

/**
 * Creates a type-safe API client with automatic error handling and retries
 */
export const createApiClient = (config: ApiClientConfig) => {
  const finalConfig: Required<ApiClientConfig> = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  /**
   * Handles API errors in a consistent way
   */
  const handleError = (error: unknown): never => {
    if (error instanceof Response) {
      throw {
        code: 'API_ERROR',
        message: `API request failed with status ${error.status}`,
        status: error.status,
      } as ApiError;
    }

    if (error instanceof Error) {
      throw {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        status: 500,
      } as ApiError;
    }

    throw {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      status: 500,
    } as ApiError;
  };

  /**
   * Retries a failed request with exponential backoff
   */
  const withRetry = async <T>(
    fn: () => Promise<T>,
    retries: number = finalConfig.retries,
    delay: number = finalConfig.retryDelay
  ): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && error instanceof Response && error.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return withRetry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  /**
   * Makes an API request with automatic error handling and retries
   */
  const request = async <T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    const {
      params,
      timeout = finalConfig.timeout,
      headers: optionHeaders,
      ...init
    } = options;

    // Build URL with query parameters
    const url = new URL(path, finalConfig.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Merge headers
    const headers = new Headers(finalConfig.headers);
    if (optionHeaders) {
      new Headers(optionHeaders).forEach((value, key) => {
        headers.set(key, value);
      });
    }

    // Add default headers
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await withRetry(() =>
        fetch(url.toString(), {
          ...init,
          headers,
          signal: controller.signal,
        })
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      const requestId = response.headers.get('x-request-id');
      
      return {
        data,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: requestId || 'no-request-id',
        },
      };
    } catch (error) {
      clearTimeout(timeoutId);
      return handleError(error);
    }
  };

  return {
    get: <T>(path: string, options?: Omit<RequestOptions, 'method'>) =>
      request<T>(path, { ...options, method: 'GET' }),

    post: <T>(path: string, options?: Omit<RequestOptions, 'method'>) =>
      request<T>(path, { ...options, method: 'POST' }),

    put: <T>(path: string, options?: Omit<RequestOptions, 'method'>) =>
      request<T>(path, { ...options, method: 'PUT' }),

    patch: <T>(path: string, options?: Omit<RequestOptions, 'method'>) =>
      request<T>(path, { ...options, method: 'PATCH' }),

    delete: <T>(path: string, options?: Omit<RequestOptions, 'method'>) =>
      request<T>(path, { ...options, method: 'DELETE' }),
  };
};

/**
 * Type-safe error guard for API errors
 */
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'status' in error
  );
};
