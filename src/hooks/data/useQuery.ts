import { useState, useCallback } from "react";

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface QueryOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  initialData?: T | null;
}

export function useQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: Error | null }>,
  options: QueryOptions<T> = {},
) {
  const [state, setState] = useState<QueryState<T>>({
    data: options.initialData || null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { data, error } = await queryFn();
      if (error) throw error;

      setState({ data, loading: false, error: null });
      options.onSuccess?.(data as T);
    } catch (error) {
      const errorObj = error as Error;
      setState({ data: null, loading: false, error: errorObj });
      options.onError?.(errorObj);
    }
  }, [queryFn, options]);

  const refresh = useCallback(() => {
    return execute();
  }, [execute]);

  return {
    ...state,
    refresh,
    execute,
  };
}
