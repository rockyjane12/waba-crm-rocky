import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, ProductSort } from "@/types/product";
import { ChevronUp, ChevronDown, Edit, Trash, Eye, Save, X, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  sort: ProductSort;
  onSort: (field: keyof Product, direction: "asc" | "desc") => void;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  editingProduct: string | null;
  isEditing: boolean;
  startEditing: (productId: string) => void;
  cancelEditing: () => void;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  error,
  sort,
  onSort,
  pagination,
  onPageChange,
  onPageSizeChange,
  editingProduct,
  isEditing,
  startEditing,
  cancelEditing,
  updateProduct,
  deleteProduct,
  isUpdating,
  isDeleting,
}) => {
  const [editedValues, setEditedValues] = useState<Partial<Product>>({});
  const [isZoomed, setIsZoomed] = useState<string | null>(null);

  const handleSort = (field: keyof Product) => {
    const direction = sort.field === field && sort.direction === "asc" ? "desc" : "asc";
    onSort(field, direction);
  };

  const renderSortIcon = (field: keyof Product) => {
    if (sort.field !== field) return null;
    return sort.direction === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  const handleEdit = (product: Product) => {
    startEditing(product.id);
    setEditedValues({});
  };

  const handleCancelEdit = () => {
    cancelEditing();
    setEditedValues({});
  };

  const handleSaveEdit = async (product: Product) => {
    if (Object.keys(editedValues).length === 0) {
      cancelEditing();
      return;
    }
    
    try {
      await updateProduct(product.id, editedValues);
      setEditedValues({});
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleInputChange = (field: keyof Product, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPrice = (price: string) => {
    return price;
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "in stock":
        return "bg-green-100 text-green-800 border-green-200";
      case "out of stock":
        return "bg-red-100 text-red-800 border-red-200";
      case "preorder":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "hidden":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Error loading products</h3>
        <p>{error.message}</p>
        {error.message.includes("access token") && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Access Token Issue:</strong> Your Facebook Graph API access token has expired. 
              Please update the <code>NEXT_PUBLIC_WABA_ACCESS_TOKEN</code> environment variable 
              with a new valid token and restart the development server.
            </p>
          </div>
        )}
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="border rounded-md">
          <div className="h-12 border-b px-4 bg-muted/40" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center p-4 border-b last:border-0">
              <Skeleton className="h-12 w-12 rounded-md mr-4" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-16 ml-4" />
              <Skeleton className="h-8 w-24 ml-4" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 border rounded-md">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Name {renderSortIcon("name")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center">
                  Price {renderSortIcon("price")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("availability")}
              >
                <div className="flex items-center">
                  Availability {renderSortIcon("availability")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("visibility")}
              >
                <div className="flex items-center">
                  Visibility {renderSortIcon("visibility")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("retailer_id")}
              >
                <div className="flex items-center">
                  Retailer ID {renderSortIcon("retailer_id")}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className={cn(
                "hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100",
                editingProduct === product.id && "bg-blue-50/30"
              )}>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className="relative h-12 w-12 rounded-md overflow-hidden cursor-pointer"
                          onMouseEnter={() => setIsZoomed(product.id)}
                          onMouseLeave={() => setIsZoomed(null)}
                        >
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=No+Image";
                            }}
                          />
                          {isZoomed === product.id && (
                            <div className="absolute -top-32 -left-16 z-50">
                              <div className="h-40 w-40 rounded-md overflow-hidden border-2 border-white shadow-xl">
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=No+Image";
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Hover to zoom</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  {editingProduct === product.id ? (
                    <Input
                      value={editedValues.name ?? product.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {product.description || "No description"}
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingProduct === product.id ? (
                    <Input
                      value={editedValues.price ?? product.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <span className="font-medium">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingProduct === product.id ? (
                    <select
                      value={editedValues.availability ?? product.availability}
                      onChange={(e) => handleInputChange("availability", e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="in stock">In Stock</option>
                      <option value="out of stock">Out of Stock</option>
                      <option value="preorder">Preorder</option>
                    </select>
                  ) : (
                    <Badge
                      className={cn(
                        "capitalize",
                        getAvailabilityColor(product.availability)
                      )}
                    >
                      {product.availability}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingProduct === product.id ? (
                    <select
                      value={editedValues.visibility ?? product.visibility}
                      onChange={(e) => handleInputChange("visibility", e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="published">Published</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  ) : (
                    <Badge
                      className={cn(
                        "capitalize",
                        getVisibilityColor(product.visibility)
                      )}
                    >
                      {product.visibility}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingProduct === product.id ? (
                    <Input
                      value={editedValues.retailer_id ?? product.retailer_id}
                      onChange={(e) => handleInputChange("retailer_id", e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <span className="font-mono text-sm">{product.retailer_id}</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {editingProduct === product.id ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSaveEdit(product)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(product)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Delete"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the product "{product.name}". 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteProduct(product.id)}
                                className="bg-red-500 hover:bg-red-600"
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                ) : null}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
          {Math.min(
            pagination.page * pagination.pageSize,
            pagination.totalItems
          )}{" "}
          of {pagination.totalItems} products
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === pagination.totalPages ||
                Math.abs(p - pagination.page) <= 1
            )
            .map((p, i, arr) => (
              <React.Fragment key={p}>
                {i > 0 && arr[i - 1] !== p - 1 && (
                  <Button variant="outline" size="sm" disabled>
                    ...
                  </Button>
                )}
                <Button
                  variant={pagination.page === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </Button>
              </React.Fragment>
            ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;