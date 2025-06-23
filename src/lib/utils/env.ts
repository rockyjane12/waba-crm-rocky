/**
 * Utility function to validate required environment variables
 * @param variables Array of required environment variable names
 * @throws Error if any required variable is missing
 */
export function validateEnvVariables(variables: readonly string[]): void {
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
  "NEXT_PUBLIC_API_URL",

  // Supabase Configuration
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",

  // WhatsApp Business API Configuration
  "NEXT_PUBLIC_WABA_API_URL",
  "NEXT_PUBLIC_WABA_API_VERSION",
  "WABA_BUSINESS_ACCOUNT_ID",
  "NEXT_PUBLIC_WABA_ACCESS_TOKEN",
  "WABA_PHONE_NUMBER_ID",
  "WABA_WEBHOOK_VERIFY_TOKEN",
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
