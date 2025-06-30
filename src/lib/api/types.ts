import { z } from 'zod';

// API Response Schema
export const ApiResponseSchema = z.object({
  data: z.unknown(),
  meta: z.object({
    timestamp: z.string(),
    requestId: z.string(),
  }).optional(),
  paging: z.object({
    cursors: z.object({
      before: z.string(),
      after: z.string(),
    }),
    next: z.string().optional(),
    previous: z.string().optional(),
  }).optional(),
});

export type ApiResponse<T> = z.infer<typeof ApiResponseSchema> & {
  data: T;
};

// API Error Schema
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
  status: z.number(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request Options
export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
}

// API Client Configuration
export interface ApiClientConfig {
  baseUrl: string;
  headers?: HeadersInit;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// API Route Definition
export interface ApiRoute<T = unknown> {
  path: string;
  method: HttpMethod;
  schema?: z.ZodType<T>;
}
