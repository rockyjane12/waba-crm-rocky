"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/common/useIsMobile";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

const paddingClasses = {
  none: "px-0",
  sm: "px-3 sm:px-4",
  md: "px-4 sm:px-6 lg:px-8",
  lg: "px-4 sm:px-8 lg:px-12",
};

export function ResponsiveContainer({
  children,
  className,
  mobileClassName,
  desktopClassName,
  maxWidth = "xl",
  padding = "md",
}: ResponsiveContainerProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "w-full mx-auto",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className,
        isMobile ? mobileClassName : desktopClassName,
      )}
    >
      {children}
    </div>
  );
}

export default ResponsiveContainer;
