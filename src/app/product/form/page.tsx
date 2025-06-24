"use client";

import React, { useState } from "react";
import { ProductForm } from "@/components/product";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export default function ProductFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      console.log("Submitting product data:", data);
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      toast.success("Product created successfully!");
      
      // In a real application, you would submit to your API:
      // const response = await fetch('/api/products', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // if (!response.ok) throw new Error('Failed to create product');
    } catch (error: any) {
      toast.error(`Failed to create product: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </Container>
  );
}