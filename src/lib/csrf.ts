import { randomBytes } from 'crypto';

// Generate a CSRF token
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

// Store the CSRF token in localStorage
export function storeCSRFToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('csrf_token', token);
  }
}

// Get the stored CSRF token
export function getStoredCSRFToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('csrf_token');
  }
  return null;
}

// Generate and store a new CSRF token
export function setupCSRFToken(): string {
  const token = generateCSRFToken();
  storeCSRFToken(token);
  return token;
}