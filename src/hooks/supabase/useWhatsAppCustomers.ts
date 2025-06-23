import { useCallback, useEffect, useRef } from 'react';
import { useSupabaseClient } from './useSupabaseClient';
import { PostgrestError, RealtimeChannel } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type WhatsAppCustomer = Database['public']['Tables']['whatsapp_customers']['Row'];
type WhatsAppCustomerInsert = Database['public']['Tables']['whatsapp_customers']['Insert'];
type WhatsAppCustomerUpdate = Database['public']['Tables']['whatsapp_customers']['Update'];
type EventType = 'INSERT' | 'UPDATE' | 'DELETE';

interface DatabaseResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

// Global state for subscriptions and cache
const globalState = {
  subscribers: new Set<(customer: WhatsAppCustomer, eventType: EventType) => void>(),
  channel: null as RealtimeChannel | null,
  subscription: null as { unsubscribe: () => void } | null,
  cache: new Map<string, { data: WhatsAppCustomer[]; timestamp: number }>(),
  lastFetchTime: 0,
  pendingFetch: null as Promise<DatabaseResponse<WhatsAppCustomer[]>> | null,
};

const CACHE_TTL = 30000; // 30 seconds
const FETCH_DEBOUNCE = 1000; // 1 second

// Helper to create a stable cache key
const createCacheKey = (options?: {
  orderBy?: { column: keyof WhatsAppCustomer; ascending?: boolean };
  filters?: {
    status?: string;
    search?: string;
  };
}) => {
  if (!options) return 'default';
  
  const parts = [];
  
  if (options.orderBy) {
    parts.push(`order:${options.orderBy.column}:${options.orderBy.ascending ? 'asc' : 'desc'}`);
  }
  
  if (options.filters) {
    const filterParts = Object.entries(options.filters)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}:${value}`)
      .sort()
      .join(',');
    if (filterParts) parts.push(`filters:${filterParts}`);
  }
  
  return parts.join('|') || 'default';
};

interface GetAllOptions {
  orderBy?: {
    column: keyof WhatsAppCustomer;
    ascending?: boolean;
  };
  filters?: {
    status?: string;
    search?: string;
  };
}

export const useWhatsAppCustomers = () => {
  const supabase = useSupabaseClient();
  const mountedRef = useRef(true);
  const lastFetchRef = useRef<number>(0);

  // Set up subscription only once per client
  useEffect(() => {
    mountedRef.current = true;

    // Only set up subscription if it doesn't exist
    if (!globalState.channel) {
      globalState.channel = supabase.channel('whatsapp_customers_changes');
      globalState.subscription = globalState.channel
        .on(
          'postgres_changes' as any,
          {
            event: '*',
            schema: 'public',
            table: 'whatsapp_customers',
          },
          (payload: any) => {
            const customer = payload.new as WhatsAppCustomer;
            const eventType = payload.eventType as EventType;

            // Skip updates if we recently fetched data
            const now = Date.now();
            if (now - globalState.lastFetchTime < FETCH_DEBOUNCE) {
              return;
            }

            // Update cache with the new data
            globalState.cache.forEach((cacheEntry, cacheKey) => {
              let updatedData = [...cacheEntry.data];
              
              switch (eventType) {
                case 'INSERT':
                  updatedData = [customer, ...updatedData];
                  break;
                case 'UPDATE':
                  updatedData = updatedData.map(c => 
                    c.id === customer.id ? customer : c
                  );
                  break;
                case 'DELETE':
                  updatedData = updatedData.filter(c => 
                    c.id !== customer.id
                  );
                  break;
              }
              
              globalState.cache.set(cacheKey, {
                data: updatedData,
                timestamp: now
              });
            });

            // Notify all subscribers
            globalState.subscribers.forEach(callback => {
              callback(customer, eventType);
            });
          }
        )
        .subscribe();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [supabase]);

  const getAll = useCallback(async ({ orderBy, filters }: GetAllOptions = {}) => {
    try {
      const cacheKey = createCacheKey({ orderBy, filters });
      const now = Date.now();
      const cached = globalState.cache.get(cacheKey);

      // Return cached data if valid
      if (cached && now - cached.timestamp < CACHE_TTL) {
        return { data: cached.data, error: null };
      }

      // If there's a pending fetch, wait for it
      if (globalState.pendingFetch) {
        return globalState.pendingFetch;
      }

      // Debounce fetches
      if (now - lastFetchRef.current < FETCH_DEBOUNCE) {
        await new Promise(resolve => setTimeout(resolve, FETCH_DEBOUNCE));
      }

      let query = supabase
        .from('whatsapp_customers')
        .select('*');

      // Apply filters
      if (filters?.status) {
        query = query.eq('conversation_status', filters.status);
      }

      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,` +
          `profile_name.ilike.%${filters.search}%,` +
          `phone_number.ilike.%${filters.search}%,` +
          `wa_id.ilike.%${filters.search}%`
        );
      }

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, {
          ascending: orderBy.ascending ?? false
        });
      } else {
        query = query.order('last_message_at', { ascending: false });
      }

      // Store the promise to prevent duplicate fetches
      const promise = Promise.resolve(query).then(({ data, error }) => ({ data, error } as DatabaseResponse<WhatsAppCustomer[]>));
      globalState.pendingFetch = promise;
      const result = await promise;
      globalState.pendingFetch = null;

      // Update cache and timestamps
      if (result.data && !result.error) {
        globalState.cache.set(cacheKey, { data: result.data, timestamp: now });
        globalState.lastFetchTime = now;
        lastFetchRef.current = now;
      }

      return result;
    } catch (error) {
      console.error('Error fetching WhatsApp customers:', error);
      return { data: null, error };
    }
  }, [supabase]);

  const getById = useCallback(async (id: number): Promise<DatabaseResponse<WhatsAppCustomer>> => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_customers')
        .select('*')
        .eq('id', id)
        .single();

      return { data: data as WhatsAppCustomer, error };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  }, [supabase]);

  const create = useCallback(async (data: WhatsAppCustomerInsert): Promise<DatabaseResponse<WhatsAppCustomer>> => {
    try {
      const { data: created, error } = await supabase
        .from('whatsapp_customers')
        .insert(data)
        .select()
        .single();

      return { data: created as WhatsAppCustomer, error };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  }, [supabase]);

  const update = useCallback(async (
    id: number,
    data: WhatsAppCustomerUpdate
  ): Promise<DatabaseResponse<WhatsAppCustomer>> => {
    try {
      const { data: updated, error } = await supabase
        .from('whatsapp_customers')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      return { data: updated as WhatsAppCustomer, error };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  }, [supabase]);

  const remove = useCallback(async (id: number): Promise<{ error: PostgrestError | null }> => {
    try {
      const { error } = await supabase
        .from('whatsapp_customers')
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      return { error: error as PostgrestError };
    }
  }, [supabase]);

  const subscribe = useCallback((callback: (customer: WhatsAppCustomer, eventType: EventType) => void) => {
    globalState.subscribers.add(callback);

    return () => {
      globalState.subscribers.delete(callback);

      // Clean up global subscription if no more subscribers
      if (globalState.subscribers.size === 0 && globalState.subscription) {
        globalState.subscription.unsubscribe();
        globalState.channel = null;
        globalState.subscription = null;
        globalState.cache.clear();
      }
    };
  }, []);

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    subscribe,
  };
}; 