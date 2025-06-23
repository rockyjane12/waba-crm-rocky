import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/services/api/catalogApi";
import { ProductFilters, ProductSort } from "@/types/catalog";
import { useState } from "react";

export const useProducts = (catalogId: string | null) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<ProductSort>({
    field: 'name',
    direction: 'asc'
  });

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["products", catalogId, page, pageSize, filters, sort],
    queryFn: async () => {
      if (!catalogId) return { data: [], meta: { page: 1, pageSize, totalItems: 0, totalPages: 0 } };
      
      // Use mock implementation for development
      return catalogApi.getMockProducts(catalogId, {
        page,
        pageSize,
        sort: sort.field as string,
        direction: sort.direction,
        filters: {
          ...(filters.category ? { category: filters.category } : {}),
          ...(filters.availability !== undefined ? { availability: String(filters.availability) } : {}),
          ...(filters.status ? { status: filters.status } : {}),
          ...(filters.search ? { search: filters.search } : {})
        }
      });
    },
    enabled: !!catalogId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const updateSort = (field: keyof ProductSort['field'], direction: 'asc' | 'desc') => {
    setSort({ field, direction });
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  return {
    products: data?.data || [],
    pagination: data?.meta || { page, pageSize, totalItems: 0, totalPages: 0 },
    isLoading,
    error: error as Error | null,
    filters,
    sort,
    updateFilters,
    updateSort,
    clearFilters,
    setPage,
    setPageSize,
    refetch
  };
};