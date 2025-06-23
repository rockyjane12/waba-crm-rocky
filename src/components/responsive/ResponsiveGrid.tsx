"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/common/useIsMobile";
import styles from "./ResponsiveGrid.module.css";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: "sm" | "md" | "lg" | "xl";
  minItemWidth?: string;
}

const gapClasses = {
  sm: "gap-2 sm:gap-3",
  md: "gap-4 sm:gap-6",
  lg: "gap-6 sm:gap-8",
  xl: "gap-8 sm:gap-12",
};

export function ResponsiveGrid({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "md",
  minItemWidth,
}: ResponsiveGridProps) {
  const isMobile = useIsMobile();

  // Create dynamic grid template columns based on cols prop
  const gridColsClasses = {
    mobile: `grid-cols-${cols.mobile}`,
    tablet: `sm:grid-cols-${cols.tablet}`,
    desktop: `lg:grid-cols-${cols.desktop}`,
  };

  const gridClasses = cn(
    "grid",
    minItemWidth
      ? styles.autoGrid
      : cn(
          gridColsClasses.mobile,
          gridColsClasses.tablet,
          gridColsClasses.desktop,
        ),
    gapClasses[gap],
    className,
  );

  return (
    <div
      className={gridClasses}
      style={
        minItemWidth
          ? { "--min-width": minItemWidth } as React.CSSProperties
          : undefined
      }
    >
      {children}
    </div>
  );
}

export default ResponsiveGrid;