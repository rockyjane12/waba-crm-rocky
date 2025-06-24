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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your catalog.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddProductButton;