import { useState, useEffect, useCallback } from 'react';
import { useWhatsAppCustomers } from '../supabase/useWhatsAppCustomers';
import { Database } from '@/integrations/supabase/types';

type WhatsAppCustomer = Database['public']['Tables']['whatsapp_customers']['Row'];

interface UseCustomersStateOptions {
  initialFilters?: {
    status?: string;
    search?: string;
  };
  orderBy?: {
    column: keyof WhatsAppCustomer;
    ascending?: boolean;
  };
}

export const useCustomersState = (options: UseCustomersStateOptions = {}) => {
  const [customers, setCustomers] = useState<WhatsAppCustomer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<WhatsAppCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState(options.initialFilters || {});
  const whatsAppCustomers = useWhatsAppCustomers();

  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await whatsAppCustomers.getAll({
        orderBy: options.orderBy || { column: 'created_at', ascending: false }
      });
      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load customers'));
    } finally {
      setIsLoading(false);
    }
  }, [whatsAppCustomers, options.orderBy]);

  // Apply filters
  useEffect(() => {
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
  }, [customers, filters]);

  // Initial load
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Set up real-time subscription
  useEffect(() => {
    whatsAppCustomers.subscribe((customer, eventType) => {
      setCustomers(prev => {
        switch (eventType) {
          case 'INSERT':
            return [customer, ...prev];
          case 'UPDATE':
            return prev.map(c => c.id === customer.id ? customer : c);
          case 'DELETE':
            return prev.filter(c => c.id !== customer.id);
          default:
            return prev;
        }
      });
    });
  }, [whatsAppCustomers]);

  return {
    customers: filteredCustomers,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: loadCustomers,
  };
}; 