// Application-wide constants for better maintainability
export const APP_CONFIG = {
  name: "WABA Admin Portal",
  version: "1.0.0",
  description: "WhatsApp Business API Admin Portal",
  author: "WABA Team",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  RESET_PASSWORD: "/reset-password",
  CATALOG: "/dashboard/catalog",
  ORDERS: "/dashboard/orders",
  MESSAGES: "/dashboard/messages",
  CALLS: "/dashboard/calls",
  WABA: "/dashboard/waba",
  CUSTOMERS: "/dashboard/customers",
} as const;

// API endpoints configuration
export const API_ENDPOINTS = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  WABA_API_URL: process.env.NEXT_PUBLIC_WABA_API_URL,
  WABA_API_VERSION: process.env.NEXT_PUBLIC_WABA_API_VERSION,
} as const;

// Validate required environment variables
if (!API_ENDPOINTS.SUPABASE_URL || !API_ENDPOINTS.SUPABASE_ANON_KEY) {
  throw new Error("Missing required Supabase environment variables");
}

if (!API_ENDPOINTS.WABA_API_URL || !API_ENDPOINTS.WABA_API_VERSION) {
  throw new Error(
    "Missing required WhatsApp Business API environment variables",
  );
}

export const BUSINESS_CATEGORIES = [
  { value: "retail", label: "Retail & Consumer Goods" },
  { value: "food", label: "Food & Beverage" },
  { value: "healthcare", label: "Healthcare & Medicine" },
  { value: "education", label: "Education & Training" },
  { value: "technology", label: "Technology & IT" },
  { value: "finance", label: "Finance & Insurance" },
  { value: "professional", label: "Professional Services" },
  { value: "hospitality", label: "Hospitality & Travel" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "real_estate", label: "Real Estate & Construction" },
  { value: "media", label: "Media & Entertainment" },
  { value: "beauty", label: "Beauty & Wellness" },
  { value: "automotive", label: "Automotive" },
  { value: "nonprofit", label: "Non-profit & Charity" },
  { value: "other", label: "Other" },
] as const;

export const ORDER_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const CUSTOMER_STATUSES = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;
