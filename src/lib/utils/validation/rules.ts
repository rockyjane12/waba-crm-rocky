export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidDate = (date: string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const isPositiveNumber = (value: number): boolean => {
  return typeof value === "number" && value > 0;
};

export const isNonEmptyString = (value: string): boolean => {
  return typeof value === "string" && value.trim().length > 0;
};

export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

// Additional functions from validators.ts
export const isRequired = (value: any): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const isNumeric = (value: string): boolean => {
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
};

export const isFutureDate = (date: string | Date): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return isValidDate(dateObj.toISOString()) && dateObj.getTime() > Date.now();
};

export const isValidFileType = (
  file: File,
  allowedTypes: string[],
): boolean => {
  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

export const validatePassword = (
  password: string,
): {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
} => {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  } else {
    score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  } else {
    score += 1;
  }

  // Number check
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  } else {
    score += 1;
  }

  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  } else {
    score += 1;
  }

  const strength = score <= 2 ? "weak" : score <= 4 ? "medium" : "strong";

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

export const validationRules = {
  required:
    (message = "This field is required") =>
    (value: any) =>
      isRequired(value) ? null : message,

  email:
    (message = "Please enter a valid email address") =>
    (value: string) =>
      isValidEmail(value) ? null : message,

  phone:
    (message = "Please enter a valid phone number") =>
    (value: string) =>
      isValidPhoneNumber(value) ? null : message,

  minLength: (min: number, message?: string) => (value: string) =>
    value.length >= min
      ? null
      : message || `Must be at least ${min} characters`,

  maxLength: (max: number, message?: string) => (value: string) =>
    value.length <= max
      ? null
      : message || `Must be no more than ${max} characters`,

  numeric:
    (message = "Must be a valid number") =>
    (value: string) =>
      isNumeric(value) ? null : message,

  positive:
    (message = "Must be a positive number") =>
    (value: number) =>
      isPositiveNumber(value) ? null : message,
};