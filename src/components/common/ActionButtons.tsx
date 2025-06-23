import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

export interface Action {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
  className?: string;
}

export interface ActionButtonsProps {
  actions: Action[];
  size?: "sm" | "lg" | "default" | "icon";
  alignment?: "left" | "center" | "right";
  spacing?: "sm" | "md" | "lg";
  direction?: "row" | "column";
  className?: string;
  fullWidth?: boolean;
  equalWidth?: boolean;
}

const spacingClasses = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

const alignmentClasses = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export function ActionButtons({
  actions,
  size = "default",
  alignment = "left",
  spacing = "md",
  direction = "row",
  className,
  fullWidth = false,
  equalWidth = false,
}: ActionButtonsProps) {
  if (!actions?.length) return null;

  return (
    <div
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        spacingClasses[spacing],
        alignmentClasses[alignment],
        fullWidth && "w-full",
        className,
      )}
    >
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant}
          size={size}
          onClick={action.onClick}
          disabled={action.disabled || action.loading}
          className={cn(
            "transition-all duration-200",
            fullWidth && "w-full",
            equalWidth && "flex-1",
            action.className,
          )}
          {...(action.tooltip && {
            "aria-label": action.tooltip,
            "data-tooltip": true,
          })}
        >
          {action.loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Loading...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </div>
          )}
        </Button>
      ))}
    </div>
  );
}
