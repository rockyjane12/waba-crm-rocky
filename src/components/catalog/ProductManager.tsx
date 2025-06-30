import React, { useState } from "react";
import { useProducts } from "@/hooks/catalog/useProducts";
import ProductTable from "./ProductTable";
import ProductGrid from "./ProductGrid";
import ProductFilterBar from "./ProductFilters";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Grid, List } from "lucide-react";
import { Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddProductButton from "./AddProductButton";
import Image from "next/image";

interface ProductManagerProps {
  catalogId: string;
  onBack: () => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  catalogId,
  onBack,
}) => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewProductData, setViewProductData] = useState<Product | null>(null);

  const {
    products,
    isLoading,
    error,
    filters,
    sort,
    pagination,
    updateFilters,
    updateSort,
    clearFilters,
    setPage,
    setPageSize,
    refetch,
    editingProduct,
    isEditing,
    startEditing,
    cancelEditing,
    updateProduct,
    deleteProduct,
    isUpdating,
    isDeleting,
  } = useProducts(catalogId);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleEditProduct = (product: Product) => {
    startEditing(product.id);
  };

  const handleViewProduct = (product: Product) => {
    setViewProductData(product);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Error loading products</h3>
        <p>{error.message}</p>
        <Button variant="outline" className="mt-4" onClick={refetch}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Catalogs
          </Button>
          <h2 className="text-xl font-semibold">
            Catalog Products
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-muted rounded-md p-1">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="px-3"
            >
              <List className="h-4 w-4 mr-1" />
              Table
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="px-3"
            >
              <Grid className="h-4 w-4 mr-1" />
              Grid
            </Button>
          </div>
          <AddProductButton 
            catalogId={catalogId} 
            onProductAdded={handleRefresh}
          />
        </div>
      </div>

      <ProductFilterBar
        filters={filters}
        onUpdateFilters={updateFilters}
        onClearFilters={clearFilters}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {viewMode === "table" ? (
        <ProductTable
          products={products}
          isLoading={isLoading}
          error={error}
          sort={sort}
          onSort={updateSort}
          pagination={pagination}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          editingProduct={editingProduct}
          isEditing={isEditing}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      ) : (
        <ProductGrid
          products={products}
          onEdit={handleEditProduct}
          onDelete={deleteProduct}
          onView={handleViewProduct}
          isDeleting={isDeleting}
        />
      )}

      {/* View Product Dialog */}
      <Dialog open={!!viewProductData} onOpenChange={() => setViewProductData(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {viewProductData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative h-64 rounded-md overflow-hidden">
                <Image
                  src={viewProductData.image_url}
                  alt={viewProductData.name}
                  fill
                  className="object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src = "https://via.placeholder.com/300?text=No+Image";
                  }}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold">{viewProductData.name}</h3>
                  <p className="text-muted-foreground">{viewProductData.description || "No description available"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Price:</span>
                    <span>{viewProductData.price}</span>
                  </div>
                  {viewProductData.sale_price && (
                    <div className="flex justify-between">
                      <span className="font-medium">Sale Price:</span>
                      <span className="text-red-500">{viewProductData.sale_price}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Currency:</span>
                    <span>{viewProductData.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Retailer ID:</span>
                    <span className="font-mono">{viewProductData.retailer_id}</span>
                  </div>
                  {viewProductData.url && (
                    <div className="flex justify-between">
                      <span className="font-medium">URL:</span>
                      <a
                        href={viewProductData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate max-w-[200px]"
                      >
                        {viewProductData.url}
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setViewProductData(null);
                      handleEditProduct(viewProductData);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => setViewProductData(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

