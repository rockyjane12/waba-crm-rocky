"use client";

import React from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

interface RootErrorBoundaryProps {
  children: React.ReactNode;
}

export function RootErrorBoundary({ children }: RootErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Something went wrong
            </h1>
            <p className="text-gray-600">
              We apologize for the inconvenience. Please try refreshing the
              page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  );
}
