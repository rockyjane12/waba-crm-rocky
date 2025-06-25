"use client";

import { useState, useEffect, createContext, useContext } from 'react';

// Helper function to get cookie value
function getCookieValue(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

interface User {
  id: string;
  email: string;
  lastSignInAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // Get CSRF token from cookie
      const csrfToken = getCookieValue('csrf_token');
      
      if (!csrfToken) {
        console.log('No CSRF token found in cookie');
        setLoading(false);
        return;
      }
      
      const response = await fetch('/api/auth/session', {
        headers: {
          'x-csrf-token': csrfToken,
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } else {
        console.error('Session check failed:', response.status);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      // Get CSRF token from cookie
      const csrfToken = getCookieValue('csrf_token');
      
      if (!csrfToken) {
        throw new Error('CSRF token not found. Please refresh the page.');
      }

      // Log the CSRF token being sent
      console.log('[AUTH] Using CSRF token:', csrfToken);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include', // Include cookies in the request
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setUser(data.user);
      return data;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const csrfToken = getCookieValue('csrf_token');
      
      if (csrfToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'x-csrf-token': csrfToken,
          },
          credentials: 'include',
        });
      }
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
