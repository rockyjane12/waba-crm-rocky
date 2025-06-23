import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Hook to handle async operations with loading and error states
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  dependencies: any[] = [],
) {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setStatus("pending");
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus("success");
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
      setStatus("error");
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
}

/**
 * Hook to handle infinite scrolling
 */
export function useInfiniteScroll<T>(
  loadMore: () => Promise<T[]>,
  options = { threshold: 100 },
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: Element | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLoading(true);
          try {
            const newItems = await loadMore();
            setItems((prev) => [...prev, ...newItems]);
            setHasMore(newItems.length > 0);
          } catch (error) {
            console.error("Error loading more items:", error);
          }
          setLoading(false);
        }
      }, options);

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore, options],
  );

  return { items, loading, hasMore, lastElementRef };
}

/**
 * Hook to handle local storage with type safety
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue] as const;
}

/**
 * Hook to handle click outside detection
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void,
  initialValue = false,
) {
  const [isOpen, setIsOpen] = useState(initialValue);
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return { ref, isOpen, setIsOpen };
}

/**
 * Hook to handle media queries
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatch = (e: MediaQueryListEvent) => setMatches(e.matches);

    setMatches(media.matches);
    media.addEventListener("change", updateMatch);

    return () => media.removeEventListener("change", updateMatch);
  }, [query]);

  return matches;
}
