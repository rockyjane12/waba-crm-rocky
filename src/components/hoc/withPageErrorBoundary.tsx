"use client";

import React, { ComponentType } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

interface WithPageErrorBoundaryProps {
  title?: string;
  showHomeLink?: boolean;
}

export function withPageErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithPageErrorBoundaryProps = {},
) {
  const { title = "Page Error", showHomeLink = true } = options;

  return function WithPageErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary
        fallback={
          <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl text-red-700">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">
                  We apologize, but something went wrong while loading this
                  page.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                  >
                    Try Again
                  </Button>
                  {showHomeLink && (
                    <Button asChild>
                      <Link href="/">
                        <Home className="w-4 h-4 mr-2" />
                        Go Home
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        }
      >
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}
