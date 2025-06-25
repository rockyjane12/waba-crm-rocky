// Helper function to get cookie value
export function getCookieValue(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

// Store the CSRF token in localStorage
export function storeCSRFToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('csrf_token', token);
  }
}

// Get the stored CSRF token
export function getStoredCSRFToken(): string | null {
  // First try to get from cookie directly
  const cookieToken = getCookieValue('csrf_token');
  if (cookieToken) return cookieToken;
  
  // Fall back to localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('csrf_token');
  }
  return null;
}

// Generate and store a new CSRF token
export function setupCSRFToken(): string {
  // First check if we have a CSRF token from the cookie
  const cookieToken = getCookieValue('csrf_token');
  
  if (cookieToken) {
    // Store the cookie token in localStorage for consistency
    storeCSRFToken(cookieToken);
    return cookieToken;
  }
  
  // If no cookie token, use the one from localStorage or return empty
  const localToken = getStoredCSRFToken();
  return localToken || '';
}