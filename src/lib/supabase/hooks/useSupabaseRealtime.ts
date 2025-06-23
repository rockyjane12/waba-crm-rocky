import { useEffect, useRef, useState, useCallback } from "react";
import { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from "../client";

type SupabaseRealtimeEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

interface UseSupabaseRealtimeOptions {
  schema?: string;
  event?: SupabaseRealtimeEvent;
  filter?: string;
}

/**
 * A hook for subscribing to Supabase Realtime changes
 * @param table The table to subscribe to
 * @param callback Function to call when changes occur
 * @param options Configuration options
 */
export function useSupabaseRealtime<T = any>(
  table: string,
  callback: (payload: RealtimePostgresChangesPayload<T>, eventType: SupabaseRealtimeEvent) => void,
  options: UseSupabaseRealtimeOptions = {}
): { isConnected: boolean; unsubscribe: () => void } {
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const { schema = "public", event = "*", filter } = options;

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    // Create a unique channel name
    const channelName = `realtime:${schema}:${table}:${event}${filter ? `:${filter}` : ""}`;
    
    // Set up the channel
    const channel = supabase.channel(channelName);
    
    // Configure the subscription
    const subscription = channel
      .on(
        "postgres_changes",
        {
          event,
          schema,
          table,
          ...(filter && { filter }),
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          callback(payload, payload.eventType as SupabaseRealtimeEvent);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });
    
    channelRef.current = subscription;

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [table, callback, schema, event, filter, unsubscribe]);

  return { isConnected, unsubscribe };
}