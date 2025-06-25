import { useQuery } from "@tanstack/react-query";
import { catalogApiClient } from "@/services/api/catalogApiClient";
import { Catalog } from "@/types/catalog";
import { useState } from "react";
import { toast } from "sonner";

export const useCatalogs = () => {
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);

  const {
    data: catalogs,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["catalogs"],
    queryFn: async () => {
      try {
        // Use the new API route to fetch catalogs
        const response = await catalogApiClient.getCatalogs();
        
        // Add default product count since the API doesn't provide it
        const catalogsWithCount = response.data.map(catalog => ({
          ...catalog,
          productCount: 0
        }));
        
        return catalogsWithCount;
      } catch (error) {
        console.error("Error fetching catalogs:", error);
        toast.error(`Failed to fetch catalogs: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const selectCatalog = (catalogId: string) => {
    setSelectedCatalogId(catalogId);
  };

  const clearSelectedCatalog = () => {
    setSelectedCatalogId(null);
  };

  const getDefaultCatalog = (): Catalog | undefined => {
    if (!catalogs) return undefined;
    return catalogs.find(catalog => catalog.isDefault);
  };

  const getSelectedCatalog = (): Catalog | undefined => {
    if (!catalogs || !selectedCatalogId) return undefined;
    return catalogs.find(catalog => catalog.id === selectedCatalogId);
  };

  return {
    catalogs: catalogs || [],
    isLoading,
    error: error as Error | null,
    selectedCatalogId,
    selectedCatalog: getSelectedCatalog(),
    defaultCatalog: getDefaultCatalog(),
    selectCatalog,
    clearSelectedCatalog,
    refetch
  };
};
