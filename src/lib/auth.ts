import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface UserSession {
  user: {
    id: string;
    waba_id: string;
    email: string;
  } | null;
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = cookies();
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }

    // Get user's WABA ID from the user_metadata or a separate table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('waba_id')
      .eq('id', session.user.id)
      .single();

    if (userError || !userData) {
      return null;
    }

    return {
      user: {
        id: session.user.id,
        waba_id: userData.waba_id,
        email: session.user.email!,
      }
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
} 