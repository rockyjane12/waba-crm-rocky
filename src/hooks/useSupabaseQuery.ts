"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SupabaseQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface QueryCache {
  [key: string]: {
    data: any;
    timestamp: number;
    promise?: Promise<any>;
  };
}

// Global query cache
const queryCache: QueryCache = {};
const CACHE_TTL = 60000; // 1 minute cache TTL

export function useSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  deps: any[] = [],
  options: {
    cacheKey?: string;
    enabled?: boolean;
    staleTime?: number;
  } = {}
): SupabaseQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  const fetchIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const { 
    cacheKey = '', 
    enabled = true, 
    staleTime = CACHE_TTL 
  } = options;

  // Generate a stable cache key if not provided
  const effectiveCacheKey = cacheKey || 
    (deps.length > 0 ? `query_${JSON.stringify(deps)}` : '');

  const fetchData = useCallback(async (skipCache = false) => {
    // Skip if query is disabled
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    const currentFetchId = ++fetchIdRef.current;
    
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first if we have a cache key and not skipping cache
      if (effectiveCacheKey && !skipCache) {
        const cachedData = queryCache[effectiveCacheKey];
        
        // If there's a pending promise for this query, wait for it
        if (cachedData?.promise) {
          try {
            const result = await cachedData.promise;
            if (isMounted.current && currentFetchId === fetchIdRef.current) {
              setData(result.data);
              setIsLoading(false);
            }
            return;
          } catch (error) {
            // If the promise fails, continue with a new request
            console.error("Cached promise failed:", error);
          }
        }
        
        // If we have fresh cached data, use it
        if (
          cachedData && 
          Date.now() - cachedData.timestamp < staleTime
        ) {
          setData(cachedData.data);
          setIsLoading(false);
          return;
        }
      }

      // Create a promise for this query and store it in cache
      const queryPromise = queryFn();
      
      if (effectiveCacheKey) {
        queryCache[effectiveCacheKey] = {
          ...queryCache[effectiveCacheKey],
          promise: queryPromise
        };
      }

      const result = await queryPromise;

      // Only update state if component is still mounted and this is the latest fetch
      if (isMounted.current && currentFetchId === fetchIdRef.current) {
        if (result.error) {
          setError(new Error(result.error.message || "Unknown error"));
          setData(null);
        } else {
          setData(result.data);
          
          // Update cache
          if (effectiveCacheKey) {
            queryCache[effectiveCacheKey] = {
              data: result.data,
              timestamp: Date.now()
            };
          }
        }
      }
    } catch (err) {
      if (isMounted.current && currentFetchId === fetchIdRef.current) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setData(null);
      }
    } finally {
      if (isMounted.current && currentFetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
      
      // Clean up promise from cache
      if (effectiveCacheKey && queryCache[effectiveCacheKey]?.promise) {
        const { promise, ...rest } = queryCache[effectiveCacheKey];
        queryCache[effectiveCacheKey] = rest;
      }
    }
  }, [queryFn, effectiveCacheKey, enabled, staleTime]);

  useEffect(() => {
    isMounted.current = true;
    fetchData();

    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [...deps, enabled, effectiveCacheKey]);

  const refetch = useCallback(async () => {
    // Clear cache for this query
    if (effectiveCacheKey) {
      delete queryCache[effectiveCacheKey];
    }
    await fetchData(true);
  }, [fetchData, effectiveCacheKey]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

// Utility to manually clear the entire cache or specific keys
export const clearQueryCache = (key?: string) => {
  if (key) {
    delete queryCache[key];
  } else {
    Object.keys(queryCache).forEach(k => delete queryCache[k]);
  }
};