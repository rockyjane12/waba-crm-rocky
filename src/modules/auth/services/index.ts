import { AuthError, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import type {
  AuthResponse,
  AuthService,
  BusinessData,
  OtpOptions,
} from "../types";

class SupabaseAuthService implements AuthService {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        success: true,
        data: {
          user: data.user ?? undefined,
          session: data.session ?? undefined,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Failed to sign in"),
      };
    }
  }

  async signUp(
    email: string,
    password: string,
    role: string,
    businessData?: BusinessData,
  ): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            ...businessData,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      return {
        success: true,
        data: {
          user: data.user ?? undefined,
          session: data.session ?? undefined,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Failed to sign up"),
      };
    }
  }

  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Failed to sign out"),
      };
    }
  }

  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to reset password"),
      };
    }
  }

  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      return {
        success: true,
        data: {
          // OAuth response doesn't include user/session immediately
          // They will be available after redirect
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to sign in with Google"),
      };
    }
  }

  async signInWithOtp(options: OtpOptions): Promise<AuthResponse> {
    try {
      if (options.token) {
        // Verify OTP
        const { data, error } = await supabase.auth.verifyOtp({
          phone: options.phone,
          token: options.token,
          type: "sms",
        });
        
        if (error) throw error;
        
        return {
          success: true,
          data: {
            user: data.user,
            session: data.session,
          },
        };
      } else {
        // Send OTP
        const { error } = await supabase.auth.signInWithOtp({
          phone: options.phone,
          options: options.options,
        });
        
        if (error) throw error;
        
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Failed to send OTP"),
      };
    }
  }

  async getSession(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      return {
        success: true,
        data: {
          session: data.session ?? undefined,
          user: data.session?.user ?? undefined,
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error : new Error("Failed to get session"),
      };
    }
  }

  async refreshSession(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      return {
        success: true,
        data: {
          session: data.session ?? undefined,
          user: data.session?.user ?? undefined,
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to refresh session"),
      };
    }
  }
}

export const authService = new SupabaseAuthService();