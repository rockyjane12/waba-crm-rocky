"use client";

import React, { Suspense, lazy, ComponentType } from "react";
import { Loading } from "@/components/ui/loading";
import ErrorBoundary from "./ErrorBoundary";

interface LazyWrapperProps {
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

/**
 * Higher-order component for lazy loading with error boundaries and loading states
 */
export function withLazyLoading<P>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: LazyWrapperProps = {},
) {
  const LazyComponent = lazy(importFunc);

  return function LazyWrapper(props: P) {
    const { fallback = <Loading />, errorFallback } = options;

    return (
      <ErrorBoundary fallback={errorFallback}>
        <Suspense fallback={fallback}>
          <LazyComponent {...(props as any)} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

/**
 * Generic lazy wrapper component
 */
export function LazyWrapper({
  children,
  fallback = <Loading />,
  errorFallback,
}: LazyWrapperProps & { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

/**
 * Lazy load pages with consistent loading and error handling
 */
export const LazyPages = {
  Dashboard: withLazyLoading(() => import("@/pages/Dashboard")),
  CatalogPage: withLazyLoading(() => import("@/pages/dashboard/CatalogPage")),
  OrdersPage: withLazyLoading(() => import("@/pages/dashboard/OrdersPage")),
  MessagesPage: withLazyLoading(() => import("@/pages/dashboard/MessagesPage")),
  CustomersPage: withLazyLoading(
    () => import("@/pages/dashboard/CustomersPage"),
  ),
  WABASettingsPage: withLazyLoading(
    () => import("@/pages/dashboard/WABASettingsPage"),
  ),
};

export default LazyWrapper;
