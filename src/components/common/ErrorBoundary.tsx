"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component with modern error handling and recovery
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by error boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-8 border-destructive/50 bg-destructive/5">
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-destructive text-xl">⚠</span>
            </div>
            <h2 className="text-destructive font-medium mb-2">
              Something went wrong
            </h2>
            <p className="text-destructive/80 text-sm mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button
              variant="outline"
              className="border-destructive/50 hover:bg-destructive/10"
              onClick={this.handleReset}
            >
              Try again
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode,
  onReset?: () => void,
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onReset={onReset}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * Hook for error boundary functionality in functional components
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

export default ErrorBoundary;
