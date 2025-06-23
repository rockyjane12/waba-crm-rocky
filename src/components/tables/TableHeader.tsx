import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Download,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Columns,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TableHeaderProps {
  title: string;
  subtitle?: string;
  totalCount?: number;
  selectedCount?: number;

  // Actions
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onExport?: () => void;
  onSettings?: () => void;

  // Bulk actions
  bulkActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "destructive";
  }>;

  // Column visibility
  columns?: Array<{
    key: string;
    label: string;
    visible: boolean;
  }>;
  onColumnVisibilityChange?: (key: string, visible: boolean) => void;

  // Custom actions
  customActions?: React.ReactNode;

  className?: string;
}

export function TableHeader({
  title,
  subtitle,
  totalCount,
  selectedCount = 0,
  onRefresh,
  isRefreshing,
  onExport,
  onSettings,
  bulkActions = [],
  columns = [],
  onColumnVisibilityChange,
  customActions,
  className,
}: TableHeaderProps) {
  const hasSelection = selectedCount > 0;
  const hasBulkActions = bulkActions.length > 0;
  const hasColumnControls = columns.length > 0 && onColumnVisibilityChange;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {totalCount !== undefined && (
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {totalCount} total
              </span>
            )}
          </div>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {customActions}

          {/* Standard actions */}
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={cn("h-4 w-4", isRefreshing && "animate-spin")}
                />
              </Button>
            )}

            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4" />
              </Button>
            )}

            {/* More actions dropdown */}
            {(onSettings || hasColumnControls) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Table Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {onSettings && (
                    <DropdownMenuItem onClick={onSettings}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  )}

                  {hasColumnControls && (
                    <>
                      <DropdownMenuLabel className="flex items-center gap-2">
                        <Columns className="h-4 w-4" />
                        Columns
                      </DropdownMenuLabel>
                      {columns.map((column) => (
                        <DropdownMenuItem
                          key={column.key}
                          onClick={() =>
                            onColumnVisibilityChange!(
                              column.key,
                              !column.visible,
                            )
                          }
                        >
                          {column.visible ? (
                            <Eye className="h-4 w-4 mr-2" />
                          ) : (
                            <EyeOff className="h-4 w-4 mr-2" />
                          )}
                          {column.label}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Selection and bulk actions */}
      {hasSelection && (
        <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <span className="text-sm font-medium">
            {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
          </span>

          {hasBulkActions && (
            <div className="flex items-center gap-2">
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant={
                    action.variant === "destructive" ? "destructive" : "outline"
                  }
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
