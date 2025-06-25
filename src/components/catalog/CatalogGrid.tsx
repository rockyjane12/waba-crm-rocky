import React, { useState } from "react";
import { useCatalogs } from "@/hooks/catalog/useCatalogs";
import ProductManager from "./ProductManager";
import CatalogCard from "./CatalogCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CatalogGrid: React.FC = () => {
  const {
    catalogs,
    isLoading: catalogsLoading,
    error: catalogsError,
    selectedCatalogId,
    selectCatalog,
    clearSelectedCatalog,
    refetch: refetchCatalogs,
  } = useCatalogs();

  const [activeCatalogId, setActiveCatalogId] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchCatalogs();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Show error
  if (catalogsError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Error loading catalogs</h3>
        <p>{catalogsError.message}</p>
        <Button variant="outline" className="mt-4" onClick={() => refetchCatalogs()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Always render both, but only show one
  return (
    <div>
      {/* Catalog grid */}
      <div style={{ display: activeCatalogId ? 'none' : 'block' }}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Product Catalogs</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRefresh()}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Catalog
              </Button>
            </div>
          </div>

          {catalogsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : catalogs.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No Catalogs Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  You don't have any product catalogs yet.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Catalog
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {catalogs.map((catalog) => (
                <CatalogCard
                  key={catalog.id}
                  catalog={catalog}
                  isSelected={catalog.id === activeCatalogId}
                  onClick={() => setActiveCatalogId(catalog.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* ProductManager */}
      <div style={{ display: activeCatalogId ? 'block' : 'none' }}>
        {activeCatalogId && (
          <ProductManager
            catalogId={activeCatalogId}
            onBack={() => setActiveCatalogId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default CatalogGrid;