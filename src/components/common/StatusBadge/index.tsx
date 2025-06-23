import React from "react";
import { Badge } from "@/components/ui/badge";
import { getStatusConfig } from "@/utils/status";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  variant = "default",
  size = "md",
  showIcon = false,
  className,
}: StatusBadgeProps) {
  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  const badgeClasses = cn(
    "status-badge",
    sizeClasses[size],
    config.bgColor,
    config.textColor,
    "font-medium border-0 inline-flex items-center gap-1",
    className,
  );

  return (
    <Badge className={badgeClasses} variant={variant}>
      {showIcon && config.icon && (
        <span className="text-xs" aria-hidden="true">
          {config.icon}
        </span>
      )}
      {config.label}
    </Badge>
  );
}