import { useState, useCallback, useMemo } from 'react';
import { z } from 'zod';

export interface FilterConfig<T extends z.ZodType> {
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
}

export interface FilterActions<T> {
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  setFilters: (values: Partial<T>) => void;
  clearFilter: (key: keyof T) => void;
  clearAllFilters: () => void;
  reset: () => void;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface UseFiltersReturn<T> {
  filters: T;
  actions: FilterActions<T>;
  sort: SortConfig | null;
  setSort: (config: SortConfig | null) => void;
  toggleSort: (field: string) => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export const createUseFilters = <T extends z.ZodType>(config: FilterConfig<T>) => {
  return (): UseFiltersReturn<z.infer<T>> => {
    const [filters, setFiltersState] = useState<z.infer<T>>(() => {
      const defaultValues = config.defaultValues || {};
      return config.schema.parse(defaultValues);
    });

    const [sort, setSortState] = useState<SortConfig | null>(null);

    const setFilter = useCallback(<K extends keyof z.infer<T>>(
      key: K,
      value: z.infer<T>[K]
    ) => {
      setFiltersState(prev => {
        const updated = { ...prev, [key]: value };
        return config.schema.parse(updated);
      });
    }, []);

    const setFilters = useCallback((values: Partial<z.infer<T>>) => {
      setFiltersState(prev => {
        const updated = { ...prev, ...values };
        return config.schema.parse(updated);
      });
    }, []);

    const clearFilter = useCallback((key: keyof z.infer<T>) => {
      setFiltersState(prev => {
        const { [key]: _, ...rest } = prev;
        return config.schema.parse(rest);
      });
    }, []);

    const clearAllFilters = useCallback(() => {
      setFiltersState(config.schema.parse({}));
    }, []);

    const reset = useCallback(() => {
      setFiltersState(config.schema.parse(config.defaultValues || {}));
      setSortState(null);
    }, []);

    const setSort = useCallback((config: SortConfig | null) => {
      setSortState(config);
    }, []);

    const toggleSort = useCallback((field: string) => {
      setSortState(prev => {
        if (!prev || prev.field !== field) {
          return { field, direction: 'asc' };
        }
        if (prev.direction === 'asc') {
          return { field, direction: 'desc' };
        }
        return null;
      });
    }, []);

    const { hasActiveFilters, activeFilterCount } = useMemo(() => {
      const filterEntries = Object.entries(filters);
      const activeFilters = filterEntries.filter(([_, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        if (typeof value === 'object' && value !== null) {
          return Object.keys(value).length > 0;
        }
        return value !== undefined && value !== null && value !== '';
      });

      return {
        hasActiveFilters: activeFilters.length > 0,
        activeFilterCount: activeFilters.length,
      };
    }, [filters]);

    return {
      filters,
      actions: {
        setFilter,
        setFilters,
        clearFilter,
        clearAllFilters,
        reset,
      },
      sort,
      setSort,
      toggleSort,
      hasActiveFilters,
      activeFilterCount,
    };
  };
};

// Example usage:
// const filterSchema = z.object({
//   search: z.string().optional(),
//   status: z.enum(['active', 'inactive']).optional(),
//   dateRange: z.object({
//     from: z.date().optional(),
//     to: z.date().optional(),
//   }).optional(),
// });
// 
// export const useMyFilters = createUseFilters({
//   schema: filterSchema,
//   defaultValues: {
//     status: 'active',
//   },
// });
