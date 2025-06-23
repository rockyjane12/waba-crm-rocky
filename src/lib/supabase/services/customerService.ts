import { BaseService } from './baseService';
import type { Customer, CustomerWithRelations, FilterParams, PaginationParams, SortParams } from '@/types/common';
import { Database } from "../types";
import { supabase } from "../../../integrations/supabase/client";

// Define ServiceResponse type
type ServiceResponse<T> = {
  data: T | null;
  error: Error | null;
};

// Type for WhatsApp customer from the database
export type WhatsAppCustomer = Database["public"]["Tables"]["whatsapp_customers"]["Row"];
export type WhatsAppCustomerInsert = Database["public"]["Tables"]["whatsapp_customers"]["Insert"];
export type WhatsAppCustomerUpdate = Database["public"]["Tables"]["whatsapp_customers"]["Update"];

type CustomerResponse = Omit<WhatsAppCustomer, 'id'> & { id: number };


// Create base service instance
const baseService = new BaseService('whatsapp_customers');

// Type for WhatsApp customer from the database
export type WhatsAppCustomer = Database["public"]["Tables"]["whatsapp_customers"]["Row"];
export type WhatsAppCustomerInsert = Database["public"]["Tables"]["whatsapp_customers"]["Insert"];
export type WhatsAppCustomerUpdate = Database["public"]["Tables"]["whatsapp_customers"]["Update"];

export class CustomerService extends BaseService {
  constructor() {
    super('whatsapp_customers');
  }

  async getAllCustomers(options: {
    includeMessages?: boolean;
    includeStatus?: boolean;
    filters?: FilterParams[];
    sort?: SortParams;
    pagination?: PaginationParams;
  } = {}) {
    try {
      let query = this.supabase.from(this.table).select('*');

      // Apply filters
      if (options.filters?.length) {
        options.filters.forEach((filter) => {
          if (filter.value !== undefined && filter.value !== null) {
            query = query.eq(filter.field, filter.value);
          }
        });
      }

      // Apply sorting
      if (options.sort?.field) {
        query = query.order(options.sort.field, {
          ascending: options.sort.direction === 'asc',
          nullsFirst: false,
        });
      } else {
        // Default sorting by created_at desc
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      if (options.pagination) {
        const { page = 1, pageSize = 10 } = options.pagination;
        const start = (page - 1) * pageSize;
        query = query.range(start, start + pageSize - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data as CustomerWithRelations[];
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async getCustomerById(
    id: string,
    options: {
      includeMessages?: boolean;
      includeStatus?: boolean;
    } = {}
  ) {
    const relationships = [
      ...(options.includeMessages ? ['whatsapp_messages(*)'] : []),
      ...(options.includeStatus ? ['whatsapp_status(*)'] : []),
    ];

    return this.getById<CustomerWithRelations>(id, { relationships });
  }

  async createCustomer(customer: Partial<Customer>) {
    return this.create<Customer>(customer);
  }

  async updateCustomer(id: string, customer: Partial<Customer>) {
    return this.update<Customer>(id, customer);
  }

  async deleteCustomer(id: string) {
    return this.delete(id);
  }

  subscribeToCustomers(
    callback: (customer: Customer, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
  ) {
    const channel = this.supabase
      .channel('whatsapp_customers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: this.table,
        },
        (payload) => {
          callback(
            payload.new as Customer,
            payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE'
          );
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }
}

/**
 * Get customers by conversation status
 */
const getByConversationStatus = async (status: string): Promise<ServiceResponse<WhatsAppCustomer[]>> => {
  try {
    const { data, error } = await supabase
      .from("whatsapp_customers")
      .select("*")
      .eq("conversation_status", status)
      .order("last_message_at", { ascending: false });

    return { data: data as WhatsAppCustomer[], error };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error("Unknown error") 
    };
  }
};

/**
 * Search customers by name, phone number, or WhatsApp ID
 */
const searchCustomers = async (query: string): Promise<ServiceResponse<WhatsAppCustomer[]>> => {
  try {
    const { data, error } = await supabase
      .from("whatsapp_customers")
      .select("*")
      .or(`name.ilike.%${query}%,phone_number.ilike.%${query}%,wa_id.ilike.%${query}%`)
      .order("last_message_at", { ascending: false });

    return { data: data as WhatsAppCustomer[], error };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error("Unknown error") 
    };
  }
};

/**
 * Update customer conversation status
 */
const updateConversationStatus = async (id: number, status: string): Promise<ServiceResponse<CustomerResponse>> => {
  try {
    const { data, error } = await supabase
      .from("whatsapp_customers")
      .update({ 
        conversation_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .single();

    return { data: data as WhatsAppCustomer, error: error as Error | null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Unknown error")
    };
  }
};

/**
 * Update customer last message
 */
const updateLastMessage = async (id: number, message: string): Promise<ServiceResponse<CustomerResponse>> => {
  try {
    const { data, error } = await supabase
      .from("whatsapp_customers")
      .update({
        last_message: message,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .single();

    return { data: data as WhatsAppCustomer, error: error as Error | null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Unknown error")
    };
  }
};

/**
 * Get customer by WhatsApp ID
 */
const getByWaId = async (waId: string): Promise<ServiceResponse<CustomerResponse>> => {
  try {
    const { data, error } = await supabase
      .from("whatsapp_customers")
      .select("*")
      .eq("wa_id", waId)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }
    return { data: data as CustomerResponse, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error("Unknown error") 
    };
  }
};

// Create customer service instance
const customerServiceInstance = new CustomerService();

// Export the customer service with all methods
export const customerService = {
  ...customerServiceInstance,
  getByConversationStatus,
  searchCustomers,
  updateConversationStatus,
  updateLastMessage,
  getByWaId
};
