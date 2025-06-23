import * as z from "zod";

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessCategory: z.string().min(2, "Please select a business category"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile Schemas
export const wabaProfileSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessDescription: z.string().optional(),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  businessAddress: z.record(z.any()).optional(),
  settings: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

// Customer Schemas
export const customerSchema = z.object({
  email: z.string().email("Invalid email address").optional().nullable(),
  display_phone_number: z.string().min(10, "Invalid phone number").optional().nullable(),
  wa_id: z.string().min(10, "Invalid WhatsApp ID"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  status: z.string(),
  billing_address: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

// Order Schemas
export const orderSchema = z.object({
  customer_id: z.number(),
  customer_wa_id: z.string(),
  status: z.string(),
  total_amount: z.number().min(0),
  currency: z.string(),
  billing_address: z.record(z.any()),
  shipping_address: z.record(z.any()),
  product_items: z.array(z.record(z.any())),
  metadata: z.record(z.any()).optional(),
  contact_phone: z.string().optional(),
  delivery_charge: z.number().min(0).optional(),
});

// Message Schemas
export const messageSchema = z.object({
  conversation_id: z.string(),
  sender_id: z.string(),
  content: z.string(),
  message_type: z.enum(["text", "image", "video", "document"]),
  metadata: z.record(z.any()).optional(),
  timestamp: z.string(),
  wa_id: z.string(),
  status: z.enum(["sent", "delivered", "read", "failed"]),
});

// Export types generated from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type WABAProfileFormData = z.infer<typeof wabaProfileSchema>;
export type CustomerFormData = z.infer<typeof customerSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;

// WABA Settings Schema
export const wabaSettingsSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  businessDescription: z.string().optional(),
  businessWebsite: z.string().url("Please enter a valid URL").optional(),
  businessCategory: z.string().min(2, "Please select a business category"),
  autoReply: z.boolean(),
  notifications: z.boolean(),
  orderConfirmations: z.boolean(),
  businessHours: z.object({
    enabled: z.boolean(),
    start: z.string(),
    end: z.string(),
  }),
});

export type WABASettingsFormData = z.infer<typeof wabaSettingsSchema>;
