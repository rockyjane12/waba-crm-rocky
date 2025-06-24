import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import ProductModal from "@/components/product/ProductModal";
import { ProductFormData } from "@/types/product";
import { toast } from "sonner";

interface AddProductButtonProps {
  catalogId: string;
  onProductAdded: () => void;
}

export function AddProductButton({ catalogId, onProductAdded }: AddProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // In a real application, you would submit to your API
      console.log("Submitting product data:", data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Product added successfully!");
      
      // Close modal and refresh products
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
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <ProductModal
            onSubmit={handleSubmit}
            onCancel={() => setIsOpen(false)}
            isSubmitting={isSubmitting}
            catalogId={catalogId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddProductButton;