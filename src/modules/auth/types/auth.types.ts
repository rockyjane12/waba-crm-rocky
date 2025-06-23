import { User, AuthError, Session } from "@supabase/supabase-js";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  role?: string;
  businessData?: {
    businessName?: string;
    businessCategory?: string;
  };
}

export interface EmailOtpOptions {
  email: string;
  options?: {
    shouldCreateUser?: boolean;
    data?: object;
    captchaToken?: string;
    emailRedirectTo?: string;
  };
}

export interface PhoneOtpOptions {
  phone: string;
  options?: {
    shouldCreateUser?: boolean;
    data?: object;
    captchaToken?: string;
    channel?: "sms" | "whatsapp";
  };
}

export type OtpOptions = EmailOtpOptions | PhoneOtpOptions;

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

export interface BusinessData {
  businessName?: string;
  businessCategory?: string;
  name?: string;
  type?: string;
  size?: string;
  industry?: string;
}

export interface ExtendedAuthResponse extends AuthResponse {
  data?: {
    user?: User;
    session?: Session;
    signupSuccess?: boolean;
  };
}

export interface AuthResponse {
  success: boolean;
  error?: Error;
  data?: {
    user?: User;
    session?: Session;
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
  getSession: () => Promise<AuthResponse>;
  refreshSession: () => Promise<AuthResponse>;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    role: string,
    businessData?: BusinessData,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithOtp: (options: OtpOptions) => Promise<void>;
}
