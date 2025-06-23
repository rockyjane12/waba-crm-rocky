"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { SortingState } from "@tanstack/react-table";

interface TableState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  sorting: SortingState;
  filters: Record<string, any>;
}

interface UseTableDataOptions<T> {
  initialPageSize?: number;
  initialSorting?: SortingState;
  initialFilters?: Record<string, any>;
}

export function useTableData<T>(
  fetchFn: () => Promise<{ data: T[] | null; error: Error | null }>,
  options: UseTableDataOptions<T> = {},
) {
  const [state, setState] = useState<TableState<T>>({
    data: [],
    loading: true,
    error: null,
    pagination: {
      page: 1,
      pageSize: options.initialPageSize || 10,
      total: 0,
    },
    sorting: options.initialSorting || [],
    filters: options.initialFilters || {},
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { data, error } = await fetchFn();
      if (error) throw error;

      setState((prev) => ({
        ...prev,
        data: data || [],
        pagination: {
          ...prev.pagination,
          total: data?.length || 0,
        },
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error as Error,
        loading: false,
      }));
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setPage = useCallback((page: number) => {
    setState((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, page },
    }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setState((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, pageSize, page: 1 },
    }));
  }, []);

  const setSorting = useCallback((sorting: SortingState) => {
    setState((prev) => ({
      ...prev,
      sorting,
    }));
  }, []);

  const setFilters = useCallback((filters: Record<string, any>) => {
    setState((prev) => ({
      ...prev,
      filters,
      pagination: { ...prev.pagination, page: 1 },
    }));
  }, []);

  const paginatedData = useMemo(() => {
    const { page, pageSize } = state.pagination;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    let filteredData = state.data;

    // Apply filters
    if (Object.keys(state.filters).length > 0) {
      filteredData = filteredData.filter((item) => {
        return Object.entries(state.filters).every(([key, value]) => {
          if (!value) return true;
          const itemValue = (item as any)[key];
          return itemValue
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        });
      });
    }

    // Apply sorting
    if (state.sorting.length > 0) {
      filteredData = [...filteredData].sort((a, b) => {
        for (const sort of state.sorting) {
          const aValue = (a as any)[sort.id];
          const bValue = (b as any)[sort.id];

          if (aValue === bValue) continue;
          if (aValue === null || aValue === undefined) return 1;
          if (bValue === null || bValue === undefined) return -1;

          const comparison = aValue > bValue ? 1 : -1;
          return sort.desc ? -comparison : comparison;
        }
        return 0;
      });
    }

    return filteredData.slice(start, end);
  }, [state]);

  return {
    data: paginatedData,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    sorting: state.sorting,
    filters: state.filters,
    setPage,
    setPageSize,
    setSorting,
    setFilters,
    refresh: fetchData,
  };
}
