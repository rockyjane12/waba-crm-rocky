"use client";

import React, { useState } from "react";
import { ProductForm } from "@/components/product";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { useProductForm } from "@/hooks/product/useProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProductFormPageProps {
  catalogId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
  isEdit?: boolean;
}

export function ProductFormPage({
  catalogId,
  onSuccess,
  onCancel,
  initialData,
  isEdit = false,
}: ProductFormPageProps) {
  const { isSubmitting, isUploading, submitProduct } = useProductForm({
    onSuccess: (data) => {
      toast.success(isEdit ? "Product updated successfully!" : "Product created successfully!");
      onSuccess?.();
    },
  });

  const handleSubmit = async (data: any) => {
    try {
      await submitProduct(data, catalogId);
    } catch (error) {
      // Error is already handled in useProductForm
    }
  };

  return (
    <Container className="py-6">
      <div className="mb-6">
        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Product" : "Create New Product"}</CardTitle>
          <CardDescription>
            {isEdit 
              ? "Update your product information below" 
              : "Fill in the details to add a new product to your catalog"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm 
            onSubmit={handleSubmit}
            initialData={initialData}
            isSubmitting={isSubmitting || isUploading}
          />
        </CardContent>
      </Card>
    </Container>
  );
}

export default ProductFormPage;