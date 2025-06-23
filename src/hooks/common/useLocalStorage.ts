// Custom hook for localStorage with TypeScript support and error handling

import { useState, useEffect, useCallback } from "react";

type SetValue<T> = T | ((val: T) => T);

/**
 * Custom hook for localStorage with automatic JSON serialization/deserialization
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: SetValue<T>) => void, () => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for managing user preferences in localStorage
 */
export function useUserPreferences() {
  const [preferences, setPreferences, clearPreferences] = useLocalStorage(
    "userPreferences",
    {
      theme: "light" as "light" | "dark" | "system",
      language: "en",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      dashboard: {
        defaultView: "grid" as "grid" | "list",
        itemsPerPage: 10,
      },
    },
  );

  const updatePreference = useCallback(
    <K extends keyof typeof preferences>(
      key: K,
      value: (typeof preferences)[K],
    ) => {
      setPreferences((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setPreferences],
  );

  return {
    preferences,
    updatePreference,
    clearPreferences,
  };
}

/**
 * Hook for managing recent searches
 */
export function useRecentSearches(maxItems: number = 10) {
  const [searches, setSearches, clearSearches] = useLocalStorage<string[]>(
    "recentSearches",
    [],
  );

  const addSearch = useCallback(
    (search: string) => {
      if (!search.trim()) return;

      setSearches((prev) => {
        const filtered = prev.filter((item) => item !== search);
        return [search, ...filtered].slice(0, maxItems);
      });
    },
    [setSearches, maxItems],
  );

  const removeSearch = useCallback(
    (search: string) => {
      setSearches((prev) => prev.filter((item) => item !== search));
    },
    [setSearches],
  );

  return {
    searches,
    addSearch,
    removeSearch,
    clearSearches,
  };
}
