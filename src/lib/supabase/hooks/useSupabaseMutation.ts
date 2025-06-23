import { useState, useCallback } from "react";
import { PostgrestError } from "@supabase/supabase-js";

interface SupabaseMutationResult<T> {
  data: T | null;
  isLoading: boolean;
  error: PostgrestError | Error | null;
  mutate: (variables?: any) => Promise<T | null>;
  reset: () => void;
}

/**
 * A hook for performing Supabase mutations with loading and error states
 * @param mutationFn Function that performs the mutation
 */
export function useSupabaseMutation<T, V = any>(
  mutationFn: (variables?: V) => Promise<{ data: T | null; error: PostgrestError | null }>
): SupabaseMutationResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | Error | null>(null);

  const mutate = useCallback(
    async (variables?: V) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await mutationFn(variables);

        if (result.error) {
          setError(result.error);
          setData(null);
          return null;
        } else {
          setData(result.data);
          return result.data;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        setData(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    mutate,
    reset,
  };
}