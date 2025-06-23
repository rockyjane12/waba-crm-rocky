import { useState, useEffect, useCallback, useRef } from 'react';
import { useWhatsAppCustomers } from '../supabase/useWhatsAppCustomers';
import { Database } from '@/integrations/supabase/types';

type WhatsAppCustomer = Database['public']['Tables']['whatsapp_customers']['Row'];

interface UseCustomersOptions {
  initialFilters?: {
    status?: string;
    search?: string;
  };
  orderBy?: {
    column: keyof WhatsAppCustomer;
    ascending?: boolean;
  };
}

// Global state management
const globalState = {
  customers: [] as WhatsAppCustomer[],
  error: null as Error | null,
  isLoading: false,
  isInitialLoadStarted: false,
  lastLoadTime: 0,
  loadPromise: null as Promise<void> | null,
  subscribers: new Set<() => void>(),
  unsubscribeFromRealtime: null as (() => void) | null,
  currentFilters: {} as Record<string, any>,
};

const CACHE_TTL = 30000; // 30 seconds
const FILTER_DEBOUNCE_TIME = 1000; // 1 second for filter debouncing

const notifySubscribers = () => {
  globalState.subscribers.forEach(sub => sub());
};

export const useCustomers = (options: UseCustomersOptions = {}) => {
  const [customers, setCustomers] = useState<WhatsAppCustomer[]>(globalState.customers);
  const [filteredCustomers, setFilteredCustomers] = useState<WhatsAppCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(globalState.isLoading);
  const [error, setError] = useState<Error | null>(globalState.error);
  const [filters, setFilters] = useState(options.initialFilters || {});
  const whatsAppCustomers = useWhatsAppCustomers();
  const mountedRef = useRef(true);
  const lastFilterUpdateRef = useRef(Date.now());
  const filterTimeoutRef = useRef<NodeJS.Timeout>();
  const initialLoadRef = useRef(false);

  const loadCustomers = useCallback(async (force = false) => {
    const now = Date.now();
    
    // If there's an ongoing load, wait for it
    if (globalState.loadPromise) {
      await globalState.loadPromise;
      return;
    }
    
    // Check if we need to reload based on cache and force flag
    if (!force) {
      // Check if filters have changed
      const filtersChanged = JSON.stringify(filters) !== JSON.stringify(globalState.currentFilters);
      
      // If filters haven't changed and we're within cache time, don't reload
      if (!filtersChanged && now - globalState.lastLoadTime < CACHE_TTL) {
        return;
      }
      
      // If filters have changed but we're within debounce time, don't reload
      if (filtersChanged && now - lastFilterUpdateRef.current < FILTER_DEBOUNCE_TIME) {
        return;
      }
    }

    // Update current filters
    globalState.currentFilters = { ...filters };
    lastFilterUpdateRef.current = now;

    globalState.isLoading = true;
    globalState.error = null;
    notifySubscribers();

    const loadOperation = async () => {
      try {
        const { data, error } = await whatsAppCustomers.getAll({
          orderBy: options.orderBy || { column: 'last_message_at', ascending: false },
          filters: {
            status: filters.status,
            search: filters.search
          }
        });
        
        if (error) throw error;
        
        globalState.customers = data || [];
        globalState.lastLoadTime = now;
      } catch (err) {
        globalState.error = err instanceof Error ? err : new Error('Failed to load customers');
      } finally {
        globalState.isLoading = false;
        globalState.loadPromise = null;
        notifySubscribers();
      }
    };

    globalState.loadPromise = loadOperation();
    await globalState.loadPromise;
  }, [whatsAppCustomers, options.orderBy, filters]);

  // Set up subscription and initial load
  useEffect(() => {
    mountedRef.current = true;
    
    const updateLocalState = () => {
      if (mountedRef.current) {
        setCustomers(globalState.customers);
        setIsLoading(globalState.isLoading);
        setError(globalState.error);
      }
    };

    // Add subscriber
    globalState.subscribers.add(updateLocalState);
    updateLocalState();

    // Set up realtime subscription only once
    if (!globalState.unsubscribeFromRealtime) {
      globalState.unsubscribeFromRealtime = whatsAppCustomers.subscribe((customer, eventType) => {
        const now = Date.now();
        
        // If we recently loaded data, skip immediate updates
        if (now - globalState.lastLoadTime < FILTER_DEBOUNCE_TIME) {
          return;
        }

        // Update the customers list based on the event type
        switch (eventType) {
          case 'INSERT':
            globalState.customers = [customer, ...globalState.customers];
            break;
          case 'UPDATE':
            globalState.customers = globalState.customers.map(c => 
              c.id === customer.id ? customer : c
            );
            break;
          case 'DELETE':
            globalState.customers = globalState.customers.filter(c => 
              c.id !== customer.id
            );
            break;
        }
        notifySubscribers();
      });
    }

    // Load initial data if needed
    if (!globalState.isInitialLoadStarted && !initialLoadRef.current) {
      globalState.isInitialLoadStarted = true;
      initialLoadRef.current = true;
      loadCustomers();
    }

    return () => {
      mountedRef.current = false;
      globalState.subscribers.delete(updateLocalState);
      
      // Clean up if no more subscribers
      if (globalState.subscribers.size === 0) {
        if (globalState.unsubscribeFromRealtime) {
          globalState.unsubscribeFromRealtime();
          globalState.unsubscribeFromRealtime = null;
        }
        globalState.isLoading = false;
        globalState.isInitialLoadStarted = false;
        globalState.loadPromise = null;
      }

      // Clear any pending filter timeout
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [loadCustomers, whatsAppCustomers]);

  // Apply filters with debouncing
  useEffect(() => {
    if (!mountedRef.current) return;

    // Clear any existing timeout
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    // Set a new timeout for filter changes
    filterTimeoutRef.current = setTimeout(() => {
      loadCustomers(true);
    }, FILTER_DEBOUNCE_TIME);

    // Apply client-side filtering for immediate feedback
    let result = [...customers];

    if (filters.status && filters.status !== 'all') {
      result = result.filter(customer =>
        customer.conversation_status === filters.status
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(customer =>
        customer.name?.toLowerCase().includes(searchLower) ||
        customer.profile_name?.toLowerCase().includes(searchLower) ||
        customer.phone_number.toLowerCase().includes(searchLower) ||
        customer.wa_id.toLowerCase().includes(searchLower)
      );
    }

    setFilteredCustomers(result);

    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [customers, filters, loadCustomers]);

  return {
    customers: filteredCustomers,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: () => loadCustomers(true),
  };
};