import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/common/useIsMobile";

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
  maxWidth?: keyof typeof maxWidthClasses;
  padding?: keyof typeof paddingClasses;
  spacing?: keyof typeof spacingClasses;
  center?: boolean;
  fullHeight?: boolean;
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

const spacingClasses = {
  none: "space-y-0",
  sm: "space-y-2 sm:space-y-3",
  md: "space-y-4 sm:space-y-6",
  lg: "space-y-6 sm:space-y-8",
  xl: "space-y-8 sm:space-y-12",
};

export function Container({
  children,
  className,
  mobileClassName,
  desktopClassName,
  maxWidth = "xl",
  padding = "md",
  spacing = "md",
  center = false,
  fullHeight = false,
}: ContainerProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "w-full mx-auto",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        spacingClasses[spacing],
        center && "flex flex-col items-center",
        fullHeight && "min-h-[calc(100vh-4rem)]",
        className,
        isMobile ? mobileClassName : desktopClassName,
      )}
    >
      {children}
    </div>
  );
}