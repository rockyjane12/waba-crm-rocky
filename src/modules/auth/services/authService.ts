import { supabase } from "@/integrations/supabase/client";
import { ExtendedAuthResponse, BusinessData } from "../types/auth.types";

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      console.error("Authentication failed:", result.error.message);
      throw result.error;
    }
    return result;
  } catch (error) {
    console.error("Unexpected authentication error:", error);
    throw error;
  }
};

/**
 * Sign up with email, password, and optional business data
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  role: string,
  businessData?: BusinessData,
): Promise<ExtendedAuthResponse> => {
  try {
    // First create the auth user with business metadata
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          businessName: businessData?.businessName || email.split("@")[0],
          businessCategory: businessData?.businessCategory || "",
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (result.error) {
      console.error("Signup failed:", result.error.message);
      throw result.error;
    }

    // If signup successful, create WABA profile
    if (result.data.user) {
      try {
        await setupUserWabaProfile(
          result.data.user.id,
          businessData?.businessName || email.split("@")[0],
          businessData?.businessCategory || "",
        );
      } catch (profileError) {
        console.error("Failed to create WABA profile:", profileError);
        // Don't throw here - user is created but profile setup failed
        // We should handle this case in the UI
      }

      // Add signupSuccess flag to indicate email verification needed
      return {
        success: true,
        data: {
          user: result.data.user || undefined,
          session: result.data.session || undefined,
          signupSuccess: true,
        },
      };
    }

    return {
      success: true,
      data: {
        user: result.data.user || undefined,
        session: result.data.session || undefined,
      },
    };
  } catch (error) {
    console.error("Signup process failed:", error);
    throw error;
  }
};

/**
 * Reset password for email
 */
export const resetPassword = async (email: string) => {
  try {
    const result = await supabase.auth.resetPasswordForEmail(email);
    if (result.error) {
      console.error("Password reset failed:", result.error.message);
      throw result.error;
    }
    return result;
  } catch (error) {
    console.error("Unexpected password reset error:", error);
    throw error;
  }
};

/**
 * Sign in with OTP (one-time password)
 */
export const signInWithOtp = async (options: {
  phone?: string;
  email?: string;
  token?: string;
  options?: { data?: { [key: string]: any } };
}) => {
  try {
    if (options.token) {
      // Verify OTP
      if (options.phone) {
        return supabase.auth.verifyOtp({
          phone: options.phone,
          token: options.token,
          type: "sms",
        });
      } else if (options.email) {
        return supabase.auth.verifyOtp({
          email: options.email,
          token: options.token,
          type: "magiclink",
        });
      }
    } else {
      // Send OTP
      if (options.phone) {
        return supabase.auth.signInWithOtp({
          phone: options.phone,
          options: options.options,
        });
      } else if (options.email) {
        return supabase.auth.signInWithOtp({
          email: options.email,
          options: options.options,
        });
      }
    }

    return { data: null, error: { message: "Invalid options provided" } };
  } catch (error) {
    console.error("OTP error:", error);
    return { data: null, error };
  }
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async () => {
  try {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  } catch (error) {
    console.error("Google sign in error:", error);
    return { data: null, error };
  }
};

/**
 * Sign out the current user and clear all auth state
 */
export const signOut = async () => {
  try {
    // First, sign out from Supabase
    const result = await supabase.auth.signOut();
    if (result.error) {
      console.error("Sign out failed:", result.error.message);
      throw result.error;
    }

    // Clear any stored auth data
    localStorage.removeItem("supabase.auth.token");
    sessionStorage.clear();

    // Clear any other auth-related storage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("auth.") || key.includes("token")) {
        localStorage.removeItem(key);
      }
    });

    return result;
  } catch (error) {
    console.error("Unexpected sign out error:", error);
    throw error;
  }
};

/**
 * Create or update WABA profile for a user
 */
export const setupUserWabaProfile = async (
  userId: string,
  businessName: string = "",
  businessCategory: string = "",
) => {
  try {
    // Check if user already has a WABA profile
    const { data: existingProfile, error: checkError } = await supabase
      .from("waba_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking WABA profile:", checkError);
    }

    // Only create a profile if one doesn't exist
    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from("waba_profiles")
        .insert({
          user_id: userId,
          business_name: businessName || "New Business",
          status: "PENDING",
          metadata: {
            role: "WABA_ADMIN",
            businessCategory: businessCategory,
          },
        });

      if (profileError) {
        console.error("Error creating WABA profile:", profileError);
        return { success: false, error: profileError };
      } else {
        console.log("WABA profile created successfully");
        return { success: true };
      }
    }

    return { success: true, existing: true };
  } catch (error) {
    console.error("Unexpected error during profile setup:", error);
    return { success: false, error };
  }
};
