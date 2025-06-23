// Centralized API service with modern fetch patterns and error handling

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type {
  Customer,
  Order,
  WABAProfile,
  Product,
  Message,
  Conversation,
} from "@/types";
import { API_CONFIG, HTTP_STATUS } from "@/lib/utils/constants";

// Base API configuration
const API_CONFIG_LOCAL = {
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
} as const;

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Type for database responses
type DbCustomer = Database["public"]["Tables"]["customers"]["Row"];
type DbOrder = Database["public"]["Tables"]["orders"]["Row"];

// Retry wrapper for API calls
async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = API_CONFIG_LOCAL.retries,
  delay: number = API_CONFIG_LOCAL.retryDelay
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (
      retries > 0 &&
      error instanceof ApiError &&
      error.status &&
      error.status >= 500
    ) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay);
    }
    throw error;
  }
}

// Convert database types to application types
function mapDbCustomerToCustomer(dbCustomer: DbCustomer): Customer {
  return {
    id: dbCustomer.id,
    created_at: dbCustomer.created_at,
    updated_at: dbCustomer.updated_at,
    name: dbCustomer.name,
    email: dbCustomer.email,
    phone_number: dbCustomer.phone_number,
    display_phone_number: dbCustomer.display_phone_number,
    phone_number_id: dbCustomer.phone_number_id,
    wa_id: dbCustomer.wa_id,
    status: dbCustomer.status,
    billing_address: dbCustomer.billing_address,
    shipping_address: dbCustomer.shipping_address,
    metadata: dbCustomer.metadata,
    order_history: dbCustomer.order_history,
    last_order_at: dbCustomer.last_order_at,
    total_orders: dbCustomer.total_orders,
    total_spent: dbCustomer.total_spent,
    preferred_payment_method: dbCustomer.preferred_payment_method,
    stripe_customer_id: dbCustomer.stripe_customer_id,
  };
}

function mapDbOrderToOrder(dbOrder: DbOrder): Order {
  return {
    id: dbOrder.id,
    created_at: dbOrder.created_at,
    updated_at: dbOrder.updated_at,
    order_id: dbOrder.order_id,
    customer_id: dbOrder.customer_id,
    customer_wa_id: dbOrder.customer_wa_id,
    contact_phone: dbOrder.contact_phone,
    items: dbOrder.items,
    product_items: dbOrder.product_items,
    subtotal: dbOrder.subtotal,
    delivery_charge: dbOrder.delivery_charge,
    total_amount: dbOrder.total_amount,
    currency: dbOrder.currency,
    billing_address: dbOrder.billing_address,
    shipping_address: dbOrder.shipping_address,
    payment_method: dbOrder.payment_method,
    payment_id: dbOrder.payment_id,
    payment_status: dbOrder.payment_status,
    order_status: dbOrder.order_status,
    metadata: dbOrder.metadata,
  };
}

// Customer API
const customerApi = {
  async list(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
  }): Promise<{ data: Customer[]; count: number }> {
    return withRetry(async () => {
      const { count } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order(params?.sort || "created_at", {
          ascending: params?.order === "asc",
        })
        .range(
          ((params?.page || 1) - 1) * (params?.limit || 10),
          (params?.page || 1) * (params?.limit || 10) - 1
        );

      if (error) throw new ApiError(error.message, Number(error.code) || 500);

      return {
        data: (data || []).map(mapDbCustomerToCustomer),
        count: count || 0,
      };
    });
  },

  async get(id: number): Promise<Customer> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw new ApiError(error.message, Number(error.code) || 500);
      if (!data) throw new ApiError("Customer not found", 404);

      return mapDbCustomerToCustomer(data);
    });
  },

  async create(customerData: Omit<Customer, "id" | "created_at">): Promise<Customer> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("customers")
        .insert({
          ...customerData,
          created_at: new Date().toISOString(),
        } as DbCustomer)
        .select()
        .single();

      if (error) throw new ApiError(error.message, Number(error.code) || 500);
      if (!data) throw new ApiError("Failed to create customer", 500);

      return mapDbCustomerToCustomer(data);
    });
  },

  async update(
    id: number,
    customerData: Partial<Omit<Customer, "id" | "created_at">>
  ): Promise<Customer> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("customers")
        .update({
          ...customerData,
          updated_at: new Date().toISOString(),
        } as Partial<DbCustomer>)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new ApiError(error.message, Number(error.code) || 500);
      if (!data) throw new ApiError("Customer not found", 404);

      return mapDbCustomerToCustomer(data);
    });
  },
};

// Order API
const orderApi = {
  async list(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
  }): Promise<{ data: Order[]; count: number }> {
    return withRetry(async () => {
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order(params?.sort || "created_at", {
          ascending: params?.order === "asc",
        })
        .range(
          ((params?.page || 1) - 1) * (params?.limit || 10),
          (params?.page || 1) * (params?.limit || 10) - 1
        );

      if (error) throw new ApiError(error.message, Number(error.code) || 500);

      return {
        data: (data || []).map(mapDbOrderToOrder),
        count: count || 0,
      };
    });
  },

  async get(id: number): Promise<Order> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw new ApiError(error.message, Number(error.code) || 500);
      if (!data) throw new ApiError("Order not found", 404);

      return mapDbOrderToOrder(data);
    });
  },

  async create(orderData: Omit<Order, "id" | "created_at">): Promise<Order> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          ...orderData,
          created_at: new Date().toISOString(),
        } as DbOrder)
        .select()
        .single();

      if (error) throw new ApiError(error.message, Number(error.code) || 500);
      if (!data) throw new ApiError("Failed to create order", 500);

      return mapDbOrderToOrder(data);
    });
  },

  async update(
    id: number,
    orderData: Partial<Omit<Order, "id" | "created_at">>
  ): Promise<Order> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("orders")
        .update({
          ...orderData,
          updated_at: new Date().toISOString(),
        } as Partial<DbOrder>)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new ApiError(error.message, Number(error.code) || 500);
      if (!data) throw new ApiError("Order not found", 404);

      return mapDbOrderToOrder(data);
    });
  },
};

// Export the API
export const api = {
  customers: customerApi,
  orders: orderApi,
};
