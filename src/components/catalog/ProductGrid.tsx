import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
  isDeleting: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onEdit,
  onDelete,
  onView,
  isDeleting,
}) => {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
          <div className="relative h-48 w-full bg-gray-100">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=No+Image";
              }}
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <Badge
                className={cn(
                  "capitalize",
                  getAvailabilityColor(product.availability)
                )}
              >
                {product.availability}
              </Badge>
              {product.visibility && (
                <Badge
                  className={cn(
                    "capitalize",
                    getVisibilityColor(product.visibility)
                  )}
                >
                  {product.visibility}
                </Badge>
              )}
            </div>
          </div>
          <CardContent className="p-4 flex-1">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {product.description || "No description available"}
            </p>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{product.price}</p>
                {product.sale_price && (
                  <p className="text-sm text-red-500">{product.sale_price}</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                ID: {product.retailer_id}
              </p>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(product)}
            >
              <Eye className="h-4 w-4 mr-1" /> View
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(product)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the product &quot;{product.name}&quot;.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(product.id)}
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
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
