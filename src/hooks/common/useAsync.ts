// Advanced async state management hook with error handling and loading states

import { useState, useEffect, useCallback, useRef } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface AsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Advanced hook for managing async operations with loading states and error handling
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: AsyncOptions = {},
) {
  const { immediate = true, onSuccess, onError } = options;
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const isMountedRef = useRef(true);
  const lastCallIdRef = useRef(0);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    const callId = ++lastCallIdRef.current;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFunction();

      if (isMountedRef.current && callId === lastCallIdRef.current) {
        setState({ data, loading: false, error: null });
        onSuccess?.(data);
      }
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      if (isMountedRef.current && callId === lastCallIdRef.current) {
        setState({ data: null, loading: false, error: errorObj });
        onError?.(errorObj);
      }
    }
  }, [asyncFunction, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for managing multiple async operations
 */
export function useAsyncQueue<T>() {
  const [queue, setQueue] = useState<
    Array<{
      id: string;
      promise: Promise<T>;
      status: "pending" | "fulfilled" | "rejected";
      result?: T;
      error?: Error;
    }>
  >([]);

  const addToQueue = useCallback((id: string, promise: Promise<T>) => {
    setQueue((prev) => [...prev, { id, promise, status: "pending" }]);

    promise
      .then((result) => {
        setQueue((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: "fulfilled", result } : item,
          ),
        );
      })
      .catch((error) => {
        setQueue((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: "rejected", error } : item,
          ),
        );
      });
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const pendingCount = queue.filter((item) => item.status === "pending").length;
  const completedCount = queue.filter(
    (item) => item.status === "fulfilled",
  ).length;
  const failedCount = queue.filter((item) => item.status === "rejected").length;

  return {
    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    stats: {
      total: queue.length,
      pending: pendingCount,
      completed: completedCount,
      failed: failedCount,
    },
  };
}

/**
 * Hook for debounced async operations
 */
export function useDebouncedAsync<T>(
  asyncFunction: () => Promise<T>,
  delay: number = 300,
  dependencies: any[] = [],
) {
  const [debouncedDeps, setDebouncedDeps] = useState(dependencies);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDeps(dependencies);
    }, delay);

    return () => clearTimeout(timer);
  }, [dependencies, delay]);

  return useAsync(asyncFunction, debouncedDeps);
}
