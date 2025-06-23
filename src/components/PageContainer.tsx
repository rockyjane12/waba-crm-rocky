import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
  showHeader?: boolean;
}

export const PageContainer = ({
  children,
  title,
  subtitle,
  actions,
  className,
  contentClassName,
  showHeader = true,
}: PageContainerProps) => {
  return (
    <Container className={cn("space-y-6", className)}>
      {showHeader && (title || subtitle || actions) && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {(title || subtitle) && (
            <div>
              {title && (
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm md:text-base text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {actions && (
            <div className="flex flex-wrap gap-3 md:justify-end">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={cn("w-full", contentClassName)}>{children}</div>
    </Container>
  );
};

export default PageContainer;