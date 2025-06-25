import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ProductForm from "@/components/product/ProductForm";
import { toast } from "sonner";
import { createProductApi } from "@/services/api/productApi";
import { API_ENDPOINTS } from "@/lib/constants";

interface AddProductButtonProps {
  catalogId: string;
  onProductAdded: () => void;
}

export function AddProductButton({ catalogId, onProductAdded }: AddProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const productApi = createProductApi({
        baseUrl: (API_ENDPOINTS.WABA_API_URL as string) || "https://graph.facebook.com",
        accessToken: process.env.NEXT_PUBLIC_WABA_ACCESS_TOKEN || "",
        version: (API_ENDPOINTS.WABA_API_VERSION as string) || "v23.0",
      });
      await productApi.createProduct(catalogId, data);
      toast.success("Product added successfully!");
      setIsOpen(false);
      onProductAdded();
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast.error(`Failed to add product: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Product
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!isSubmitting) setIsOpen(open);
      }}>
        <DialogContent className="max-w-4xl w-[95vw] h-[95vh] max-h-[800px] flex flex-col p-0 gap-0">
          <div className="flex-shrink-0 bg-background border-b px-6 py-4">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-semibold">Add New Product</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Fill in the details to add a new product to your catalog.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="px-6 py-4">
              <ProductForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={() => setIsOpen(false)}
                showHeader={false}
                renderFooter={false}
              />
            </div>
          </div>
          <div className="flex-shrink-0 bg-background border-t px-6 py-4">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="add-product-form"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Saving Product...
                  </>
                ) : (
                  'Save Product'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddProductButton;
