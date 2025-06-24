import { useState } from "react";
import { ProductFormData, ProductImage } from "@/types/product";
import { toast } from "sonner";

interface UseProductFormOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useProductForm(options?: UseProductFormOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<ProductImage> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      return await response.json();
    } catch (error: any) {
      toast.error(`Image upload failed: ${error.message}`);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const submitProduct = async (data: ProductFormData, catalogId?: string): Promise<any> => {
    setIsSubmitting(true);
    try {
      // In a real application, you would submit to your API:
      // const response = await fetch(`/api/catalogs/${catalogId}/products`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.error || 'Failed to create product');
      // }
      
      // const result = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = { ...data, id: Math.random().toString(36).substring(2, 9) };
      
      options?.onSuccess?.(result);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to submit product';
      toast.error(errorMessage);
      options?.onError?.(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    isUploading,
    uploadImage,
    submitProduct,
  };
}