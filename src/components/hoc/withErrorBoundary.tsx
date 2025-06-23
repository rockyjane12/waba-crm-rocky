import React, { ComponentType } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback?: React.ReactNode,
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}
