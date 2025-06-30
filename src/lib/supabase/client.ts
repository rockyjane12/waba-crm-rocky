import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { getServerEnvVars } from '@/lib/utils/env';

// Global variable to store the Supabase client instance
let supabaseInstance: SupabaseClient<Database> | null = null;

// Function to create a new Supabase client instance for browser usage
const createSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance;

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = getServerEnvVars();

  supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      storageKey: 'waba-auth',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 2,
      },
    },
    global: {
      headers: {
        'x-client-info': 'waba-crm',
      },
    },
  });

  return supabaseInstance;
};

// Function to get the existing Supabase client instance or create a new one
const getSupabaseClient = () => {
  if (!supabaseInstance) {
    return createSupabaseClient();
  }
  return supabaseInstance;
};

// Export a singleton instance
export const supabase = getSupabaseClient();
