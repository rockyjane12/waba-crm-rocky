// Generate a CSRF token using browser-compatible crypto
export function generateCSRFToken(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    // Browser environment
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  } else {
    // Fallback for non-browser environments
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
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
  // First check if we have a CSRF token from the cookie
  if (typeof window !== 'undefined' && document.cookie) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrf_token' && value) {
        // Store the cookie token in localStorage for consistency
        storeCSRFToken(value);
        return value;
      }
    }
  }
  
  // If no cookie token, generate a new one
  const token = generateCSRFToken();
  storeCSRFToken(token);
  return token;
}
