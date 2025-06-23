/**
 * Email validation with proper regex
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Password strength validation
 */
export const validatePassword = (
  password: string,
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (!@#$%^&*)",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Phone number validation
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\+?1?\d{9,15}$/;
  return phoneRegex.test(phoneNumber.replace(/\D/g, ""));
};

/**
 * URL validation
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Credit card validation using Luhn algorithm
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const sanitized = cardNumber.replace(/\D/g, "");
  if (!/^\d{13,19}$/.test(sanitized)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Object validation against a schema
 */
export const validateObject = <T extends Record<string, any>>(
  obj: T,
  schema: Record<keyof T, (value: any) => boolean>,
): { isValid: boolean; errors: Record<keyof T, string> } => {
  const errors = {} as Record<keyof T, string>;

  for (const key in schema) {
    if (!schema[key](obj[key])) {
      errors[key] = `Invalid value for ${String(key)}`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
