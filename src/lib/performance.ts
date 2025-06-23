// Performance optimization utilities
import { useState, useEffect, useRef } from 'react';

/**
 * Memoization utility for expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string,
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): () => void {
    const start = performance.now();

    return () => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration);
    };
  }

  recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(value);
  }

  getMetrics(label: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    total: number;
  } | null {
    const values = this.metrics.get(label);
    if (!values || values.length === 0) return null;

    return {
      count: values.length,
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      total: values.reduce((sum, val) => sum + val, 0),
    };
  }

  getAllMetrics(): Record<
    string,
    ReturnType<PerformanceMonitor["getMetrics"]>
  > {
    const result: Record<
      string,
      ReturnType<PerformanceMonitor["getMetrics"]>
    > = {};

    for (const [label] of this.metrics) {
      result[label] = this.getMetrics(label);
    }

    return result;
  }

  clearMetrics(label?: string): void {
    if (label) {
      this.metrics.delete(label);
    } else {
      this.metrics.clear();
    }
  }
}

/**
 * Performance timing decorator
 */
export function withTiming<T extends (...args: any[]) => any>(
  fn: T,
  label?: string,
): T {
  const monitor = PerformanceMonitor.getInstance();
  const metricLabel = label || fn.name || "anonymous";

  return ((...args: Parameters<T>): ReturnType<T> => {
    const endTiming = monitor.startTiming(metricLabel);

    try {
      const result = fn(...args);

      // Handle async functions
      if (result instanceof Promise) {
        return result.finally(endTiming) as ReturnType<T>;
      }

      endTiming();
      return result;
    } catch (error) {
      endTiming();
      throw error;
    }
  }) as T;
}

/**
 * Virtual scrolling utility for large lists
 */
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5,
) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan,
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    setScrollTop,
  };
}

/**
 * Image lazy loading utility
 */
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || "");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
          };
          img.onerror = () => {
            setIsError(true);
          };
          img.src = src;
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return { imageSrc, isLoaded, isError, imgRef };
}

export default PerformanceMonitor;
