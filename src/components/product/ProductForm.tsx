import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/product/ImageUpload";
import { RetailerIdGenerator } from "@/components/product/RetailerIdGenerator";
import { toast } from "sonner";

// Form validation schema
const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200, "Product name must be less than 200 characters"),
  description: z.string().max(9999, "Description must be less than 9999 characters").optional(),
  price: z.string().min(1, "Price is required"),
  currency: z.string().min(1, "Currency is required"),
  retailer_id: z.string().min(1, "Retailer ID is required"),
  availability: z.enum(["in stock", "out of stock"]),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  sale_price: z.string().optional().or(z.literal("")),
  image: z.instanceof(File).optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: Partial<ProductFormValues>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  showHeader?: boolean;
  renderFooter?: boolean;
}

export function ProductForm({ onSubmit, initialData, isSubmitting = false, onCancel, showHeader = true, renderFooter = true }: ProductFormProps) {
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || "",
      currency: initialData?.currency || "GBP",
      retailer_id: initialData?.retailer_id || "",
      availability: initialData?.availability as "in stock" | "out of stock" || "in stock",
      url: initialData?.url || "",
      sale_price: initialData?.sale_price || "",
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const handleImageUpload = useCallback(async (file: File) => {
    setImageUploading(true);
    try {
      // Create FormData for the API request
      const formData = new FormData();
      formData.append('image', file);

      // Upload via API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Important for sending auth cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      
      // Set the image URL in the form
      form.setValue('imageUrl', data.url);
      setImagePreview(data.url);
      
      return data.url;
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast.error(`Image upload failed: ${error.message}`);
      throw error;
    } finally {
      setImageUploading(false);
    }
  }, [form]);

  const handleFormSubmit = async (values: ProductFormValues) => {
    try {
      // Only use imageUrl, not file
      const productData = {
        name: values.name,
        description: values.description || "",
        price: values.price,
        currency: values.currency,
        retailer_id: values.retailer_id,
        availability: values.availability,
        url: values.url || "",
        sale_price: values.sale_price || "",
        image_url: values.imageUrl,
      };
      await onSubmit(productData);
    } catch (error: any) {
      toast.error(`Failed to submit product: ${error.message}`);
    }
  };

  return (
    <Form {...form}>
      <form id="add-product-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {showHeader && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Add New Product</h2>
            <p className="text-muted-foreground">Fill in the details to add a new product to your catalog.</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg-muted/5 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-primary">Basic Info</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Product Name*</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter product name" 
                        {...field} 
                        className="bg-background" 
                      />
                    </FormControl>
                    <FormDescription>
                      1-200 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter product description" 
                        className="min-h-[120px] bg-background resize-y" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Optional, up to 9999 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="bg-muted/5 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-primary">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Price*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="£0.00" 
                          {...field} 
                          className="bg-background" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Currency*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="sale_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Sale Price</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="£0.00" 
                        {...field} 
                        className="bg-background" 
                      />
                    </FormControl>
                    <FormDescription>
                      Must be less than regular price
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-muted/5 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-primary">Product Image</h3>
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        onChange={async (file) => {
                          onChange(file);
                          if (file) {
                            try {
                              await handleImageUpload(file);
                            } catch (error) {
                              // Error is already handled in handleImageUpload
                              onChange(null);
                            }
                          } else {
                            form.setValue('imageUrl', '');
                            setImagePreview(null);
                          }
                        }}
                        value={value}
                        previewUrl={imagePreview}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a high-quality product image (min 500x500px, max 8MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="bg-muted/5 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-primary">Additional Info</h3>
              <FormField
                control={form.control}
                name="retailer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Retailer ID*</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          placeholder="Unique identifier" 
                          {...field} 
                          className="bg-background" 
                        />
                      </FormControl>
                      <RetailerIdGenerator
                        onGenerate={(id) => form.setValue("retailer_id", id)}
                      />
                    </div>
                    <FormDescription>
                      Unique identifier for this product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">Availability</FormLabel>
                      <FormDescription>
                        Is this product currently in stock?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === "in stock"}
                        onCheckedChange={(checked) => 
                          field.onChange(checked ? "in stock" : "out of stock")
                        }
                        aria-label="Toggle product availability"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Product URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/product" 
                        {...field} 
                        className="bg-background" 
                      />
                    </FormControl>
                    <FormDescription>
                      Optional external link to the product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {renderFooter && (
          <div className="sticky bottom-0 left-0 right-0 w-full z-30">
            <div className="flex flex-col sm:flex-row sm:justify-end items-center gap-2 px-4 py-4 bg-background/95 border-t shadow-lg">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                aria-label="Cancel add product"
                className="rounded-full px-6 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || imageUploading}
                aria-label="Save product"
                className="rounded-full px-6 py-2 shadow-md"
              >
                {(isSubmitting || imageUploading) ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    {imageUploading ? 'Uploading Image...' : 'Save Product'}
                  </>
                ) : (
                  'Save Product'
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}

export default ProductForm;