import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { catalogClient } from "../api/catalog-client";
import { Catalog } from "../types";
import { env } from "@/lib/utils/env";

export interface UseCatalogsOptions {
  limit?: number;
  enableAutoRefetch?: boolean;
}

export const createUseCatalogs = () => {
  return (options: UseCatalogsOptions = {}) => {
    const queryClient = useQueryClient();
    const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);
    const [currentCursor, setCurrentCursor] = useState<string | null>(null);

    const {
      data,
      isLoading,
      error,
      refetch,
      isFetching
    } = useQuery({
      queryKey: ["catalogs", options.limit, currentCursor],
      queryFn: async () => {
        try {
          return await catalogClient.getCatalogs({
            limit: options.limit,
            after: currentCursor || undefined,
          });
        } catch (error) {
          console.error("Error fetching catalogs:", error);
          toast.error(`Failed to fetch catalogs: ${error instanceof Error ? error.message : String(error)}`);
          throw error;
        }
      },
      staleTime: env.NEXT_PUBLIC_CACHE_STALE_TIME,
      gcTime: env.NEXT_PUBLIC_CACHE_MAX_AGE,
      retry: env.NEXT_PUBLIC_API_MAX_RETRIES,
      refetchOnWindowFocus: options.enableAutoRefetch ?? false,
      refetchOnReconnect: options.enableAutoRefetch ?? false,
    });

    const selectCatalog = useCallback((catalogId: string) => {
      setSelectedCatalogId(catalogId);
      // Prefetch products for the selected catalog
      queryClient.prefetchQuery({
        queryKey: ["products", catalogId],
        queryFn: () => catalogClient.getCatalog(catalogId),
      });
    }, [queryClient]);

    const clearSelectedCatalog = useCallback(() => {
      setSelectedCatalogId(null);
    }, []);

    const getDefaultCatalog = useCallback((): Catalog | undefined => {
      if (!data?.data) return undefined;
      return data.data.find(catalog => catalog.isDefault);
    }, [data]);

    const getSelectedCatalog = useCallback((): Catalog | undefined => {
      if (!data?.data || !selectedCatalogId) return undefined;
      return data.data.find(catalog => catalog.id === selectedCatalogId);
    }, [data, selectedCatalogId]);

    const loadMore = useCallback(() => {
      if (data?.paging?.cursors?.after) {
        setCurrentCursor(data.paging.cursors.after);
      }
    }, [data]);

    const loadPrevious = useCallback(() => {
      if (data?.paging?.cursors?.before) {
        setCurrentCursor(data.paging.cursors.before);
      }
    }, [data]);

    return {
      catalogs: data?.data || [],
      isLoading,
      isFetching,
      error: error as Error | null,
      selectedCatalogId,
      selectedCatalog: getSelectedCatalog(),
      defaultCatalog: getDefaultCatalog(),
      selectCatalog,
      clearSelectedCatalog,
      refetch,
      pagination: {
        hasNextPage: !!data?.paging?.next,
        hasPreviousPage: !!data?.paging?.previous,
        loadMore,
        loadPrevious,
        isFetchingMore: isFetching && !!currentCursor,
      }
    };
  };
};

// Export a default instance
export const useCatalogs = createUseCatalogs();
