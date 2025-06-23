import { User, Session } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

export interface BusinessData {
  businessName?: string;
  businessCategory?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: Error;
  data?: {
    user?: User;
    session?: Session;
    signupSuccess?: boolean;
  };
}

export interface AuthService {
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (
    email: string,
    password: string,
    role: string,
    businessData?: BusinessData,
  ) => Promise<AuthResponse>;
  signOut: () => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<AuthResponse>;
  signInWithOtp: (options: OtpOptions) => Promise<AuthResponse>;
}

export interface OtpOptions {
  phone?: string;
  email?: string;
  token?: string;
  options?: {
    data?: Record<string, any>;
  };
}

export interface WabaProfile {
  user_id: string;
  business_name: string;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  metadata: {
    role: string;
    businessCategory?: string;
  };
}
