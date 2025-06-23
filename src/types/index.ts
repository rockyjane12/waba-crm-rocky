// Centralized type definitions for better type safety and reusability

import { Json } from "@/integrations/supabase/types";
import { BaseEntity, ContactInfo } from "./common";
import { Customer as WhatsAppCustomer } from "./customer";

// Base entity interface
export interface BaseEntity {
  id: number;
  created_at: string | null;
  updated_at: string | null;
}

// Contact information interface
export interface ContactInfo {
  name: string | null;
  email: string | null;
  phone_number: string;
  display_phone_number: string | null;
}

// Base Customer interface with nullable fields
export interface Customer extends BaseEntity, ContactInfo {
  phone_number_id: string | null;
  wa_id: string;
  status: string | null;
  billing_address: Json | null;
  shipping_address: Json | null;
  metadata: Json | null;
  order_history: Json | null;
  last_order_at: string | null;
  total_orders: number | null;
  total_spent: number | null;
  preferred_payment_method: string | null;
  stripe_customer_id: string | null;
}

// Base Order interface with nullable fields
export interface Order extends BaseEntity {
  order_id: string;
  customer_id: number | null;
  customer_wa_id: string;
  contact_phone: string | null;
  items: Json | null;
  product_items: Json | null;
  subtotal: number | null;
  total_amount: number | null;
  currency: string | null;
  order_status: string | null;
  payment_status: string | null;
  payment_method: string | null;
  payment_id: string | null;
  delivery_charge: number | null;
  billing_address: Json | null;
  shipping_address: Json | null;
  metadata: Json | null;
}

// Message status type
export type MessageStatus = "delivered" | "failed" | "sent" | "read";

// Base Message interface
export interface Message extends BaseEntity {
  message_id: string;
  conversation_id: string;
  customer_id: number;
  customer_wa_id: string;
  sender_id: string;
  content: string;
  type: string;
  status: MessageStatus;
  timestamp: string;
  metadata: Json | null;
}

// Base Conversation interface
export interface Conversation extends BaseEntity {
  conversation_id: string;
  customer_id: number;
  customer_wa_id: string;
  last_message: string | null;
  last_message_at: string | null;
  status: string;
  metadata: Json | null;
}

// Base Product interface
export interface Product extends BaseEntity {
  product_id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  status: string;
  metadata: Json | null;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: {
    businessName?: string;
    businessCategory?: string;
    role?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface WABAProfile {
  id: string;
  user_id: string;
  business_name: string | null;
  business_description: string | null;
  phone_number: string | null;
  display_phone_number: string | null;
  waba_id: string | null;
  phone_number_id: string | null;
  status: string | null;
  verification_status: string | null;
  profile_picture_url: string | null;
  business_address?: Record<string, any> | null;
  settings?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T | null;
  error: Error | null;
  loading?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form types
export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  businessCategory: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface BusinessData {
  businessName: string;
  businessCategory: string;
}

// Component prop types
export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  mobileLabel?: string;
}

export interface FilterOptions {
  searchTerm: string;
  statusFilter: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

// Utility types
export type SortDirection = "asc" | "desc";
export type ViewMode = "table" | "grid" | "list";
export type Theme = "light" | "dark" | "system";

// Event handler types
export type EventHandler<T = any> = (event: T) => void;
export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

// Status types
export type OrderStatus =
  (typeof import("../lib/constants").ORDER_STATUSES)[keyof typeof import("../lib/constants").ORDER_STATUSES];
export type CustomerStatus =
  (typeof import("../lib/constants").CUSTOMER_STATUSES)[keyof typeof import("../lib/constants").CUSTOMER_STATUSES];

// Re-export all types
export * from "../modules/auth/types/auth.types";
export * from "./customer";
export * from "./order";

export type { WhatsAppCustomer };
