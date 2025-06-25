import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { productApiClient } from "@/services/api/productApiClient";
import { Product, ProductFilters, ProductSort, ProductResponse } from "@/types/product";
import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

export const useProducts = (catalogId: string | null) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(19);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<ProductSort>({
    field: 'name',
    direction: 'asc'
  });
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const queryKey = useMemo(() => ["products", catalogId, page, pageSize, filters, sort], [catalogId, page, pageSize, filters, sort]);
  const queryFn = useCallback(async () => {
    if (!catalogId) return { data: [], paging: { cursors: { before: "", after: "" } } };
    try {
      // Convert filters to API format
      const apiFilters: Record<string, string> = {};
      if (filters.availability) {
        apiFilters.availability = filters.availability;
      }
      if (filters.visibility) {
        apiFilters.visibility = filters.visibility;
      }
      // Get products from API
      return await productApiClient.getProducts(catalogId, {
        limit: pageSize,
        filter: apiFilters,
        // Facebook Graph API doesn't support sorting directly,
        // we'll sort the results client-side
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }, [catalogId, pageSize, filters, sort]);

  const {
    data = { data: [], paging: { cursors: { before: "", after: "" } } },
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery<ProductResponse, Error, ProductResponse, any[]>(
    {
      queryKey,
      queryFn,
      enabled: !!catalogId,
      staleTime: 1 * 60 * 1000, // 1 minute
      // keepPreviousData: true, // Uncomment if supported by your React Query version
    }
  );

  // Client-side sorting and filtering
  const processedProducts = useCallback(() => {
    if (!data?.data) return [];
    
    let result = [...data.data];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.retailer_id.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      result = result.filter(product => {
        const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
        return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sort.direction === 'asc'
        ? (aValue > bValue ? 1 : -1)
        : (bValue > aValue ? 1 : -1);
    });
    
    return result;
  }, [data, filters, sort]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (productData: Omit<Product, 'id'>) => 
      productApiClient.createProduct(catalogId!, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", catalogId] });
      toast.success("Product created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create product: ${error.message}`);
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => 
      productApiClient.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", catalogId] });
      setEditingProduct(null);
      setIsEditing(false);
      toast.success("Product updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update product: ${error.message}`);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApiClient.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", catalogId] });
      toast.success("Product deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete product: ${error.message}`);
    }
  });

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  }, []);

  const updateSort = useCallback((field: keyof Product, direction: 'asc' | 'desc') => {
    setSort({ field, direction });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  const startEditing = useCallback((productId: string) => {
    setEditingProduct(productId);
    setIsEditing(true);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingProduct(null);
    setIsEditing(false);
  }, []);

  const createProduct = useCallback((productData: Omit<Product, 'id'>) => {
    return createMutation.mutateAsync(productData);
  }, [createMutation]);

  const updateProduct = useCallback((id: string, productData: Partial<Product>) => {
    return updateMutation.mutateAsync({ id, data: productData });
  }, [updateMutation]);

  const deleteProduct = useCallback((id: string) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  return {
    products: processedProducts(),
    rawData: data,
    pagination: {
      page,
      pageSize,
      totalItems: processedProducts().length,
      totalPages: Math.ceil(processedProducts().length / pageSize),
      hasNextPage: !!data?.paging?.next,
      hasPreviousPage: !!data?.paging?.previous,
      nextCursor: data?.paging?.cursors?.after,
      previousCursor: data?.paging?.cursors?.before
    },
    isLoading,
    isFetching,
    error: error as Error | null,
    filters,
    sort,
    editingProduct,
    isEditing,
    updateFilters,
    updateSort,
    clearFilters,
    setPage,
    setPageSize,
    refetch,
    startEditing,
    cancelEditing,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};