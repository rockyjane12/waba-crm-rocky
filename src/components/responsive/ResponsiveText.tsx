"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/common/useIsMobile";

interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "heading" | "subheading" | "body" | "caption";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  responsive?: boolean;
}

const variantClasses = {
  heading: {
    mobile: "text-2xl sm:text-3xl lg:text-4xl font-bold",
    desktop: "text-4xl lg:text-5xl xl:text-6xl font-bold",
  },
  subheading: {
    mobile: "text-lg sm:text-xl font-semibold",
    desktop: "text-xl lg:text-2xl font-semibold",
  },
  body: {
    mobile: "text-sm sm:text-base",
    desktop: "text-base lg:text-lg",
  },
  caption: {
    mobile: "text-xs sm:text-sm",
    desktop: "text-sm",
  },
};

export function ResponsiveText({
  children,
  className,
  variant = "body",
  as = "p",
  responsive = true,
}: ResponsiveTextProps) {
  const isMobile = useIsMobile();
  const Component = as;

  const textClasses = responsive
    ? isMobile
      ? variantClasses[variant].mobile
      : variantClasses[variant].desktop
    : variantClasses[variant].desktop;

  return (
    <Component className={cn(textClasses, className)}>{children}</Component>
  );
}

export default ResponsiveText;