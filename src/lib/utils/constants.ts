/**
 * API endpoints and configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * Common HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Media breakpoints for responsive design
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/**
 * Common media queries
 */
export const MEDIA_QUERIES = {
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  "2xl": `(min-width: ${BREAKPOINTS["2xl"]}px)`,
  dark: "(prefers-color-scheme: dark)",
} as const;

/**
 * Date format patterns
 */
export const DATE_FORMATS = {
  SHORT: "MM/DD/YYYY",
  LONG: "MMMM D, YYYY",
  WITH_TIME: "MMMM D, YYYY h:mm A",
  ISO: "YYYY-MM-DD",
} as const;

/**
 * Common regex patterns
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^\+?1?\d{9,15}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
} as const;

/**
 * Common error messages
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  INVALID_URL: "Please enter a valid URL",
  INVALID_PASSWORD:
    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
  NETWORK_ERROR: "Network error occurred. Please try again",
  SERVER_ERROR: "Server error occurred. Please try again later",
} as const;

/**
 * Common animation variants for Framer Motion
 */
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
} as const;
