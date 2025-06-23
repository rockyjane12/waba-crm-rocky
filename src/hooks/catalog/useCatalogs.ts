import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/services/api/catalogApi";
import { Catalog } from "@/types/catalog";
import { useState } from "react";

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
      // Use mock implementation for development
      const response = await catalogApi.getMockCatalogs();
      return response.data;
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