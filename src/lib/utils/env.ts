import { z } from 'zod';

// Server-side only environment variables schema
const serverEnvSchema = z.object({
  WABA_API_URL: z.string().min(1, 'API URL is required'),
  WABA_API_VERSION: z.string().min(1, 'API version is required'),
  WABA_ACCESS_TOKEN: z.string().min(1, 'Access token is required'),
  BUSINESS_ID: z.string().min(1, 'Business ID is required'),
  SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
});

// Client-side safe environment variables schema (using Next.js public env vars)
const clientEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_API_DEBUG: z.coerce.boolean().default(false),
  NEXT_PUBLIC_CACHE_STALE_TIME: z.coerce.number().positive().default(300000),
  NEXT_PUBLIC_CACHE_MAX_AGE: z.coerce.number().positive().default(1800000),
  NEXT_PUBLIC_API_RATE_LIMIT: z.coerce.number().positive().default(100),
  NEXT_PUBLIC_API_RATE_LIMIT_WINDOW: z.coerce.number().positive().default(60000),
  NEXT_PUBLIC_API_TIMEOUT: z.coerce.number().positive().default(5000),
  NEXT_PUBLIC_API_MAX_RETRIES: z.coerce.number().positive().default(3),
});

// Development defaults
const DEV_DEFAULTS = {
  WABA_API_URL: 'https://graph.facebook.com',
  WABA_API_VERSION: 'v17.0',
  WABA_ACCESS_TOKEN: 'dev_token',
  BUSINESS_ID: 'dev_business_id',
  SUPABASE_URL: 'http://localhost:54321',
  SUPABASE_ANON_KEY: 'dev_anon_key',
  SUPABASE_SERVICE_ROLE_KEY: 'dev_service_role_key',
  API_RATE_LIMIT_WINDOW: '60000',
  API_TIMEOUT: '30000',
  CACHE_STALE_TIME: '300000',
  CACHE_MAX_AGE: '3600000',
  WABA_BUSINESS_ACCOUNT_ID: 'dev_account_id',
};

// Function to validate and get server environment variables (server-side only)
export const getServerEnvVars = () => {
  // Only run on server-side
  if (typeof window !== 'undefined') {
    throw new Error('Server environment variables cannot be accessed on the client side');
  }
  
  try {
    const isDev = process.env.NODE_ENV === 'development';
    return serverEnvSchema.parse({
      WABA_API_URL: process.env.WABA_API_URL || (isDev && DEV_DEFAULTS.WABA_API_URL),
      WABA_API_VERSION: process.env.WABA_API_VERSION || (isDev && DEV_DEFAULTS.WABA_API_VERSION),
      WABA_ACCESS_TOKEN: process.env.WABA_ACCESS_TOKEN || (isDev && DEV_DEFAULTS.WABA_ACCESS_TOKEN),
      BUSINESS_ID: process.env.BUSINESS_ID || (isDev && DEV_DEFAULTS.BUSINESS_ID),
      SUPABASE_URL: process.env.SUPABASE_URL || (isDev && DEV_DEFAULTS.SUPABASE_URL),
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || (isDev && DEV_DEFAULTS.SUPABASE_ANON_KEY),
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || (isDev && DEV_DEFAULTS.SUPABASE_SERVICE_ROLE_KEY),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(`Missing or invalid server environment variables: ${missingVars}`);
    }
    throw error;
  }
};

// Function to validate and get client environment variables
const getClientEnvVars = () => {
  try {
    const isDev = process.env.NODE_ENV === 'development';
    return clientEnvSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_DEBUG: process.env.NEXT_PUBLIC_API_DEBUG || isDev,
      NEXT_PUBLIC_CACHE_STALE_TIME: process.env.NEXT_PUBLIC_CACHE_STALE_TIME || DEV_DEFAULTS.CACHE_STALE_TIME,
      NEXT_PUBLIC_CACHE_MAX_AGE: process.env.NEXT_PUBLIC_CACHE_MAX_AGE || DEV_DEFAULTS.CACHE_MAX_AGE,
      NEXT_PUBLIC_API_RATE_LIMIT: process.env.NEXT_PUBLIC_API_RATE_LIMIT || '100',
      NEXT_PUBLIC_API_RATE_LIMIT_WINDOW: process.env.NEXT_PUBLIC_API_RATE_LIMIT_WINDOW || DEV_DEFAULTS.API_RATE_LIMIT_WINDOW,
      NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT || DEV_DEFAULTS.API_TIMEOUT,
      NEXT_PUBLIC_API_MAX_RETRIES: process.env.NEXT_PUBLIC_API_MAX_RETRIES || '3',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(`Missing or invalid client environment variables: ${missingVars}`);
    }
    throw error;
  }
};

// Export client-side environment variables (safe for client use)
export const env = getClientEnvVars();

// Type for server environment variables
export type ServerEnv = z.infer<typeof serverEnvSchema>;

// Type for client environment variables
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Utility function to validate required environment variables
 * @param variables Array of required environment variable names
 * @throws Error if any required variable is missing
 */
export function validateEnvVariables(variables: readonly string[]): void {
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) return; // Skip validation in development

  const missing = variables.filter((variable) => !process.env[variable]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

/**
 * Required environment variables for the application
 */
export const REQUIRED_ENV_VARS = [
  // API Configuration
  // "API_URL",

  // Supabase Configuration
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",

  // WhatsApp Business API Configuration
  "WABA_API_URL",
  "WABA_API_VERSION",
  "WABA_BUSINESS_ACCOUNT_ID",
  "BUSINESS_ID",
  "WABA_ACCESS_TOKEN",
  // "WABA_PHONE_NUMBER_ID",
  // "WABA_WEBHOOK_VERIFY_TOKEN",
  "API_RATE_LIMIT_WINDOW", 
  "API_TIMEOUT", 
  "CACHE_STALE_TIME",
  "CACHE_MAX_AGE"
] as const;

/**
 * Optional environment variables for the application
 */
export const OPTIONAL_ENV_VARS = [
  // Database Configuration
  "DATABASE_URL",

  // Authentication Configuration
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",

  // External Services
  "STRIPE_PUBLIC_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",

  // Email Service
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "EMAIL_FROM",

  // Monitoring and Analytics
  "NEXT_PUBLIC_ANALYTICS_ID",
  "SENTRY_DSN",

  // Feature Flags
  "NEXT_PUBLIC_ENABLE_BETA_FEATURES",
  "NEXT_PUBLIC_MAINTENANCE_MODE",

  // Cache Configuration
  "REDIS_URL",

  // API Rate Limiting
  "RATE_LIMIT_MAX",
  "RATE_LIMIT_WINDOW_MS",
] as const;

// Validate required environment variables in development
if (process.env.NODE_ENV === "development") {
  validateEnvVariables(REQUIRED_ENV_VARS);
}