import { z } from "zod";

/**
 * Dev-only default values for local development.
 */
const DEV_DEFAULTS = {
  WABA_API_URL: "https://graph.facebook.com",
  WABA_API_VERSION: "v23.0",
  WABA_ACCESS_TOKEN: "dev_token",
  BUSINESS_ID: "dev_business_id",
  SUPABASE_URL: "http://localhost:54321",
  SUPABASE_ANON_KEY: "dev_anon_key",
  SUPABASE_SERVICE_ROLE_KEY: "dev_service_role_key",
  API_RATE_LIMIT_WINDOW: "60000",
  API_TIMEOUT: "30000",
  CACHE_STALE_TIME: "300000",
  CACHE_MAX_AGE: "3600000",
  WABA_BUSINESS_ACCOUNT_ID: "dev_account_id",
};

/**
 * Server-side environment variables schema
 */
const serverEnvSchema = z.object({
  WABA_API_URL: z.string().min(1).default(DEV_DEFAULTS.WABA_API_URL),
  WABA_API_VERSION: z.string().min(1).default(DEV_DEFAULTS.WABA_API_VERSION),
  WABA_ACCESS_TOKEN: z.string().min(1).default(DEV_DEFAULTS.WABA_ACCESS_TOKEN),
  BUSINESS_ID: z.string().min(1).default(DEV_DEFAULTS.BUSINESS_ID),
  SUPABASE_URL: z.string().url().default(DEV_DEFAULTS.SUPABASE_URL),
  SUPABASE_ANON_KEY: z.string().min(1).default(DEV_DEFAULTS.SUPABASE_ANON_KEY),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1)
    .default(DEV_DEFAULTS.SUPABASE_SERVICE_ROLE_KEY),
});

/**
 * Client-side environment variables schema
 */
const clientEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_API_DEBUG: z.coerce.boolean().default(false),
  NEXT_PUBLIC_CACHE_STALE_TIME: z.coerce
    .number()
    .positive()
    .default(Number(DEV_DEFAULTS.CACHE_STALE_TIME)),
  NEXT_PUBLIC_CACHE_MAX_AGE: z.coerce
    .number()
    .positive()
    .default(Number(DEV_DEFAULTS.CACHE_MAX_AGE)),
  NEXT_PUBLIC_API_RATE_LIMIT: z.coerce.number().positive().default(100),
  NEXT_PUBLIC_API_RATE_LIMIT_WINDOW: z.coerce
    .number()
    .positive()
    .default(Number(DEV_DEFAULTS.API_RATE_LIMIT_WINDOW)),
  NEXT_PUBLIC_API_TIMEOUT: z.coerce
    .number()
    .positive()
    .default(Number(DEV_DEFAULTS.API_TIMEOUT)),
  NEXT_PUBLIC_API_MAX_RETRIES: z.coerce.number().positive().default(3),
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_WABA_API_URL: z
    .string()
    .url()
    .default("https://graph.facebook.com"),
  NEXT_PUBLIC_WABA_API_VERSION: z.string().default("v23.0"),
  NEXT_PUBLIC_WABA_ACCESS_TOKEN: z.string().default(""),
});

/**
 * Load and validate server env variables (server-side only)
 */
export const getServerEnvVars = () => {
  if (typeof window !== "undefined") {
    throw new Error(
      "Server environment variables cannot be accessed on the client side"
    );
  }

  try {
    return serverEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => err.path.join("."))
        .join(", ");
      throw new Error(
        `Missing or invalid server environment variables: ${missingVars}`
      );
    }
    throw error;
  }
};

/**
 * Load and validate client env variables (safe for browser)
 */
export const env = (() => {
  try {
    return clientEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => err.path.join("."))
        .join(", ");
      throw new Error(
        `Missing or invalid client environment variables: ${missingVars}`
      );
    }
    throw error;
  }
})();

/**
 * Types
 */
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Required env vars for validation
 */
export const REQUIRED_ENV_VARS = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "WABA_API_URL",
  "WABA_API_VERSION",
  "WABA_BUSINESS_ACCOUNT_ID",
  "BUSINESS_ID",
  "WABA_ACCESS_TOKEN",
  "API_RATE_LIMIT_WINDOW",
  "API_TIMEOUT",
  "CACHE_STALE_TIME",
  "CACHE_MAX_AGE",
] as const;

export const OPTIONAL_ENV_VARS = [
  "DATABASE_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "STRIPE_PUBLIC_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "EMAIL_FROM",
  "NEXT_PUBLIC_ANALYTICS_ID",
  "SENTRY_DSN",
  "NEXT_PUBLIC_ENABLE_BETA_FEATURES",
  "NEXT_PUBLIC_MAINTENANCE_MODE",
  "REDIS_URL",
  "RATE_LIMIT_MAX",
  "RATE_LIMIT_WINDOW_MS",
] as const;

/**
 * Validate required environment variables (optional in dev)
 */
export function validateEnvVariables(variables: readonly string[]): void {
  if (process.env.NODE_ENV === "development") return;

  const missing = variables.filter((variable) => !process.env[variable]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Run validation on startup
if (process.env.NODE_ENV === "development") {
  validateEnvVariables(REQUIRED_ENV_VARS);
}
