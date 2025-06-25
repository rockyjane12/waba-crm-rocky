import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductFormData } from "@/types/product";
import { ImageUpload } from "./ImageUpload";
import { PriceInput } from "./PriceInput";
import { RetailerIdGenerator } from "./RetailerIdGenerator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase/client";
import { X, Save, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ProductModalProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  initialData?: Partial<ProductFormData>;
  catalogId: string;
}

export function ProductModal({
  onSubmit,
  onCancel,
  isSubmitting,
  initialData,
  catalogId,
}: ProductModalProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<Partial<ProductFormData>>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    currency: initialData?.currency || "GBP",
    retailer_id: initialData?.retailer_id || "",
    availability: initialData?.availability || "in stock",
    url: initialData?.url || "",
    sale_price: initialData?.sale_price || "",
    image_url: initialData?.image_url || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    } else {
      setImagePreview(null);
    }
    
    // Clear image error
    if (errors.image_url) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.image_url;
        return newErrors;
      });
    }
  };

  const generateRetailerId = () => {
    const id = nanoid(10);
    handleInputChange("retailer_id", id);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.retailer_id) newErrors.retailer_id = "Retailer ID is required";
    if (!imageFile && !formData.image_url) newErrors.image_url = "Product image is required";
    
    // Validate name length
    if (formData.name && (formData.name.length < 1 || formData.name.length > 200)) {
      newErrors.name = "Product name must be between 1 and 200 characters";
    }
    
    // Validate price
    if (formData.price) {
      const numericPrice = parseFloat(formData.price.replace(/[^0-9.]/g, ""));
      if (isNaN(numericPrice) || numericPrice <= 0) {
        newErrors.price = "Price must be greater than 0";
      }
    }
    
    // Validate sale price
    if (formData.sale_price) {
      const numericPrice = parseFloat(formData.price?.replace(/[^0-9.]/g, "") || "0");
      const numericSalePrice = parseFloat(formData.sale_price.replace(/[^0-9.]/g, ""));
      
      if (isNaN(numericSalePrice) || numericSalePrice <= 0) {
        newErrors.sale_price = "Sale price must be greater than 0";
      } else if (numericSalePrice >= numericPrice) {
        newErrors.sale_price = "Sale price must be less than regular price";
      }
    }
    
    // Validate URL
    if (formData.url && !/^https?:\/\/.+/.test(formData.url)) {
      newErrors.url = "Must be a valid URL starting with http:// or https://";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (file: File): Promise<string> => {
    setImageUploading(true);
    try {
      // Validate file size (8MB max)
      if (file.size > 8 * 1024 * 1024) {
        throw new Error("Image size must be less than 8MB");
      }

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${nanoid()}.${fileExt}`;
      const filePath = `catalog-item-images/${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('catalog-item-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('catalog-item-images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error: any) {
      toast.error(`Image upload failed: ${error.message}`);
      throw error;
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Show error toast if validation fails
      toast.error("Please fix the errors in the form");
      return;
    }
    
    try {
      let imageUrl = formData.image_url;
      
      // If there's a new image file, upload it
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      // Prepare the final data for submission
      const productData: ProductFormData = {
        name: formData.name!,
        description: formData.description,
        price: formData.price!,
        currency: formData.currency!,
        retailer_id: formData.retailer_id!,
        availability: formData.availability as "in stock" | "out of stock",
        image_url: imageUrl,
        url: formData.url,
        sale_price: formData.sale_price,
      };
      
      await onSubmit(productData);
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] max-h-[90vh]">
      {/* Header */}
      <DialogHeader className="px-6 pt-6 pb-4 border-b">
        <DialogTitle className="text-xl">Add New Product</DialogTitle>
        <DialogDescription>
          Fill in the details to add a new product to your catalog.
        </DialogDescription>
      </DialogHeader>

      {/* Tabs */}
      <div className="px-6 pt-4 border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="additional">Additional Info</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="basic" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  1-200 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter product description"
                  className="min-h-[120px]"
                />
                <p className="text-sm text-muted-foreground">
                  Optional, up to 9999 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retailer_id">Retailer ID <span className="text-red-500">*</span></Label>
                <div className="flex gap-2">
                  <Input
                    id="retailer_id"
                    value={formData.retailer_id || ""}
                    onChange={(e) => handleInputChange("retailer_id", e.target.value)}
                    placeholder="Unique identifier"
                    className={errors.retailer_id ? "border-red-500" : ""}
                  />
                  <RetailerIdGenerator onGenerate={generateRetailerId} />
                </div>
                {errors.retailer_id && (
                  <p className="text-sm text-red-500">{errors.retailer_id}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Unique identifier for this product
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Switch
                    id="availability"
                    checked={formData.availability === "in stock"}
                    onCheckedChange={(checked) => 
                      handleInputChange("availability", checked ? "in stock" : "out of stock")
                    }
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {formData.availability === "in stock" ? "Product is in stock" : "Product is out of stock"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Product Image <span className="text-red-500">*</span></Label>
                <ImageUpload
                  onChange={handleImageChange}
                  value={imageFile}
                  previewUrl={imagePreview}
                />
                {errors.image_url && (
                  <p className="text-sm text-red-500">{errors.image_url}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  500x500px minimum, 8MB maximum
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
                  <PriceInput
                    value={formData.price || ""}
                    onChange={(value) => handleInputChange("price", value)}
                    currency={formData.currency || "GBP"}
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.currency || "GBP"}
                    onValueChange={(value) => handleInputChange("currency", value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale_price">Sale Price</Label>
                <PriceInput
                  value={formData.sale_price || ""}
                  onChange={(value) => handleInputChange("sale_price", value)}
                  currency={formData.currency || "GBP"}
                  placeholder="Enter sale price (optional)"
                  className={errors.sale_price ? "border-red-500" : ""}
                />
                {errors.sale_price && (
                  <p className="text-sm text-red-500">{errors.sale_price}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Optional. Must be less than regular price.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="additional" className="space-y-6 mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Product URL</Label>
                <Input
                  id="url"
                  value={formData.url || ""}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  placeholder="https://example.com/product"
                  className={errors.url ? "border-red-500" : ""}
                />
                {errors.url && (
                  <p className="text-sm text-red-500">{errors.url}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Optional external link to the product
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
        <div>
          {Object.keys(errors).length > 0 && (
            <p className="text-sm text-red-500">Please fix the errors before submitting</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || imageUploading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || imageUploading}
          >
            {isSubmitting || imageUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {imageUploading ? "Uploading..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Product
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;