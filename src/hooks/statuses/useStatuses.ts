import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';

type WhatsAppStatus = {
  id: number;
  created_at: string | null;
  updated_at: string | null;
  wa_id: string;
  status_type: string;
  status_data: any | null;
  metadata: any | null;
};

interface UseStatusesOptions {
  waId?: string;
  statusType?: string;
  limit?: number;
}

export const useStatuses = (options: UseStatusesOptions = {}) => {
  // Create a memoized fetch function
  const fetchStatuses = useCallback(async () => {
    let query = supabase.from('whatsapp_statuses').select('*');
    
    // Apply filters based on options
    if (options.waId) {
      query = query.eq('wa_id', options.waId);
    }
    
    if (options.statusType) {
      query = query.eq('status_type', options.statusType);
    }
    
    // Apply limit if provided
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    // Order by created_at
    query = query.order('created_at', { ascending: false });
    
    return query;
  }, [options.waId, options.statusType, options.limit]);

  // Use the generic useSupabaseQuery hook for data fetching
  const { 
    data: statuses = [], 
    isLoading, 
    error, 
    refetch 
  } = useSupabaseQuery<WhatsAppStatus[]>(
    fetchStatuses, 
    [options.waId, options.statusType, options.limit],
    { cacheKey: `statuses_${options.waId || options.statusType}` }
  );

  // Create a new status
  const createStatus = async (statusData: Partial<WhatsAppStatus>) => {
    try {
      // Add timestamps if not provided
      const now = new Date().toISOString();
      const data = {
        ...statusData,
        created_at: statusData.created_at || now,
        updated_at: statusData.updated_at || now,
      };
      
      const { data: newStatus, error: apiError } = await supabase
        .from('whatsapp_statuses')
        .insert(data)
        .select()
        .single();
        
      if (apiError) throw apiError;
      
      // Refresh statuses after creating a new one
      refetch();
      
      return newStatus;
    } catch (err) {
      console.error('Error creating status:', err);
      throw err;
    }
  };

  // Update a status
  const updateStatus = async (id: number, statusData: Partial<WhatsAppStatus>) => {
    try {
      const { data: updatedStatus, error: apiError } = await supabase
        .from('whatsapp_statuses')
        .update({
          ...statusData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
        
      if (apiError) throw apiError;
      
      // Refresh statuses after updating
      refetch();
      
      return updatedStatus;
    } catch (err) {
      console.error('Error updating status:', err);
      throw err;
    }
  };

  // Delete a status
  const deleteStatus = async (id: number) => {
    try {
      const { error: apiError } = await supabase
        .from('whatsapp_statuses')
        .delete()
        .eq('id', id);
        
      if (apiError) throw apiError;
      
      // Refresh statuses after deleting
      refetch();
      
      return true;
    } catch (err) {
      console.error('Error deleting status:', err);
      throw err;
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('whatsapp_statuses_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'whatsapp_statuses',
        filter: options.waId ? `wa_id=eq.${options.waId}` : undefined
      }, () => {
        // Refresh the data when changes occur
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, options.waId]);

  return {
    statuses,
    isLoading,
    error,
    createStatus,
    updateStatus,
    deleteStatus,
    refresh: refetch,
  };
};