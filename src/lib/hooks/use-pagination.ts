import { useState, useCallback, useMemo } from 'react';

export interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialTotalItems?: number;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface PaginationActions {
  nextPage: () => void;
  previousPage: () => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  reset: () => void;
}

export interface PaginationMetadata {
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

export type UsePaginationReturn = [
  PaginationState,
  PaginationActions,
  PaginationMetadata
];

export const createUsePagination = (defaultOptions: PaginationOptions = {}) => {
  return (options: PaginationOptions = {}): UsePaginationReturn => {
    const mergedOptions = {
      initialPage: 1,
      initialPageSize: 10,
      initialTotalItems: 0,
      ...defaultOptions,
      ...options,
    };

    const [state, setState] = useState<PaginationState>({
      currentPage: mergedOptions.initialPage,
      pageSize: mergedOptions.initialPageSize,
      totalItems: mergedOptions.initialTotalItems,
    });

    const nextPage = useCallback(() => {
      setState(prev => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
    }, []);

    const previousPage = useCallback(() => {
      setState(prev => ({
        ...prev,
        currentPage: Math.max(1, prev.currentPage - 1),
      }));
    }, []);

    const setPage = useCallback((page: number) => {
      setState(prev => ({
        ...prev,
        currentPage: Math.max(1, page),
      }));
    }, []);

    const setPageSize = useCallback((size: number) => {
      setState(prev => ({
        ...prev,
        pageSize: Math.max(1, size),
        currentPage: 1, // Reset to first page when changing page size
      }));
    }, []);

    const setTotalItems = useCallback((total: number) => {
      setState(prev => ({
        ...prev,
        totalItems: Math.max(0, total),
      }));
    }, []);

    const reset = useCallback(() => {
      setState({
        currentPage: mergedOptions.initialPage,
        pageSize: mergedOptions.initialPageSize,
        totalItems: mergedOptions.initialTotalItems,
      });
    }, [mergedOptions.initialPage, mergedOptions.initialPageSize, mergedOptions.initialTotalItems]);

    const metadata = useMemo((): PaginationMetadata => {
      const totalPages = Math.ceil(state.totalItems / state.pageSize);
      const startIndex = (state.currentPage - 1) * state.pageSize;
      const endIndex = Math.min(startIndex + state.pageSize, state.totalItems);

      return {
        totalPages,
        hasNextPage: state.currentPage < totalPages,
        hasPreviousPage: state.currentPage > 1,
        startIndex,
        endIndex,
      };
    }, [state.currentPage, state.pageSize, state.totalItems]);

    const actions: PaginationActions = {
      nextPage,
      previousPage,
      setPage,
      setPageSize,
      setTotalItems,
      reset,
    };

    return [state, actions, metadata];
  };
};

// Export a default instance
export const usePagination = createUsePagination();
