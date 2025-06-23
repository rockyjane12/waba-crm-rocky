"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  variant?: "spinner" | "dots" | "pulse";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Loading({ size = "md", text, className, variant = "spinner" }: LoadingProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="text-muted-foreground">{text}</span>}
    </div>
  );
}

export function LoadingScreen({
  text = "Loading...",
  variant = "spinner",
}: {
  text?: string;
  variant?: "spinner" | "dots" | "pulse";
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Loading size="lg" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Please wait
          </h2>
          <p className="text-muted-foreground">{text}</p>
        </div>
      </div>
    </div>
  );
}

export function LoadingSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("loading-skeleton", className)} {...props} />;
}

export function LoadingSpinner({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return <Loading size={size} className={className} />;
}