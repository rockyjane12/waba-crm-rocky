import { useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BusinessData } from "../types/auth.types";
import { toast } from "sonner";

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Add enhanced signIn method with error handling
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Sign in error:", error.message);
      throw error;
    }
  }, []);
  
  // Add enhanced signUp method with business data
  const signUp = useCallback(async (
    email: string, 
    password: string, 
    role: string,
    businessData?: BusinessData
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            businessName: businessData?.businessName || email.split("@")[0],
            businessCategory: businessData?.businessCategory || "",
            email: email,
            email_verified: false,
            phone_verified: false,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      
      if (error) throw error;
      
      // If signup successful, create WABA profile
      if (data.user) {
        try {
          await setupUserWabaProfile(
            data.user.id,
            businessData?.businessName || email.split("@")[0],
            businessData?.businessCategory || "",
          );
        } catch (profileError) {
          console.error("Failed to create WABA profile:", profileError);
          // Don't throw here - user is created but profile setup failed
        }
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Sign up error:", error.message);
      return { data: null, error };
    }
  }, []);
  
  // Add signOut method
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error("Sign out error:", error.message);
      toast.error("Failed to sign out: " + error.message);
      throw error;
    }
  }, []);
  
  // Helper function to set up WABA profile
  const setupUserWabaProfile = async (
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
  
  return {
    ...context,
    signIn,
    signUp,
    signOut
  };
}