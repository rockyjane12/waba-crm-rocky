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
import { PriceInput } from "@/components/product/PriceInput";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { nanoid } from "nanoid";

// Form validation schema
const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200, "Product name must be less than 200 characters"),
  description: z.string().max(9999, "Description must be less than 9999 characters").optional(),
  price: z.string().min(1, "Price is required").refine(
    (val) => !isNaN(parseFloat(val.replace(/[^0-9.]/g, ""))) && parseFloat(val.replace(/[^0-9.]/g, "")) > 0,
    "Price must be greater than 0"
  ),
  currency: z.string().min(1, "Currency is required"),
  retailer_id: z.string().min(1, "Retailer ID is required"),
  availability: z.enum(["in stock", "out of stock"]),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  sale_price: z.string().refine(
    (val) => val === "" || (!isNaN(parseFloat(val.replace(/[^0-9.]/g, ""))) && parseFloat(val.replace(/[^0-9.]/g, "")) > 0),
    "Sale price must be greater than 0"
  ).optional().or(z.literal("")).refine(
    (val, ctx) => {
      if (!val) return true;
      const price = parseFloat(ctx.parent.price.replace(/[^0-9.]/g, ""));
      const salePrice = parseFloat(val.replace(/[^0-9.]/g, ""));
      return !price || !salePrice || salePrice < price;
    },
    "Sale price must be less than regular price"
  ),
  image: z.instanceof(File).optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: Partial<ProductFormValues>;
  isSubmitting?: boolean;
}

export function ProductForm({ onSubmit, initialData, isSubmitting = false }: ProductFormProps) {
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

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    setImageUploading(true);
    try {
      // Validate file size (8MB max)
      if (file.size > 8 * 1024 * 1024) {
        throw new Error("Image size must be less than 8MB");
      }

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${nanoid()}.${fileExt}`;
      const filePath = `cat_images/${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('cat_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('cat_images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error: any) {
      toast.error(`Image upload failed: ${error.message}`);
      throw error;
    } finally {
      setImageUploading(false);
    }
  }, []);

  const handleFormSubmit = async (values: ProductFormValues) => {
    try {
      let imageUrl = values.imageUrl;

      // If there's a new image file, upload it
      if (values.image) {
        imageUrl = await handleImageUpload(values.image);
      }

      // Prepare the final data for submission
      const productData = {
        name: values.name,
        description: values.description || "",
        price: values.price,
        currency: values.currency,
        retailer_id: values.retailer_id,
        availability: values.availability,
        url: values.url || "",
        sale_price: values.sale_price || "",
        image_url: imageUrl,
      };

      await onSubmit(productData);
    } catch (error: any) {
      toast.error(`Failed to submit product: ${error.message}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter product description" 
                      className="min-h-[120px]" 
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price*</FormLabel>
                    <FormControl>
                      <PriceInput 
                        value={field.value} 
                        onChange={field.onChange}
                        currency={form.watch("currency")}
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
                    <FormLabel>Currency*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                  <FormLabel>Sale Price</FormLabel>
                  <FormControl>
                    <PriceInput 
                      value={field.value} 
                      onChange={field.onChange}
                      currency={form.watch("currency")}
                      placeholder="Enter sale price (optional)"
                    />
                  </FormControl>
                  <FormDescription>
                    Must be less than regular price
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/product" {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional external link to the product
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Product Image*</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onChange={(file) => {
                        onChange(file);
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setImagePreview(url);
                        }
                      }}
                      value={value as File}
                      previewUrl={imagePreview}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormDescription>
                    500x500px minimum, 8MB maximum
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="retailer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retailer ID*</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="Unique identifier" {...field} />
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Availability</FormLabel>
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
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || imageUploading}
          >
            {(isSubmitting || imageUploading) ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                {imageUploading ? 'Uploading Image...' : 'Saving...'}
              </>
            ) : (
              'Save Product'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ProductForm;