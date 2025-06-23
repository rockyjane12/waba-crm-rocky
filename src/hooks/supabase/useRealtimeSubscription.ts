import { useEffect, useCallback } from 'react';
import { useSupabaseClient } from './useSupabaseClient';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type SubscriptionCallback<T extends Record<string, any>> = (
  data: T,
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
) => void;

interface UseRealtimeSubscriptionOptions {
  table: string;
  schema?: string;
  event?: '*' | 'INSERT' | 'UPDATE' | 'DELETE';
}

export const useRealtimeSubscription = <T extends Record<string, any>>(
  callback: SubscriptionCallback<T>,
  { table, schema = 'public', event = '*' }: UseRealtimeSubscriptionOptions
) => {
  const supabase = useSupabaseClient();

  useEffect(() => {
    const channel = supabase.channel(`${table}_changes`);

    const subscription = channel
      .on(
        'postgres_changes' as any,
        {
          event,
          schema,
          table,
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          callback(
            payload.new as T,
            payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE'
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, table, schema, event, callback]);
}; 