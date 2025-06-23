"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, RefreshCw, X, Download, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface TableFiltersProps {
  // Search
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchPlaceholder?: string;

  // Status filter
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  statusOptions: FilterOption[];

  // Additional filters
  additionalFilters?: Array<{
    key: string;
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }>;

  // Actions
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onExport?: () => void;
  onAdd?: () => void;
  addButtonLabel?: string;

  // Active filters
  activeFilters?: Array<{
    key: string;
    label: string;
    value: string;
    onRemove: () => void;
  }>;
  onClearAllFilters?: () => void;

  // Customization
  className?: string;
  showSearch?: boolean;
  showStatusFilter?: boolean;
  showRefresh?: boolean;
  showExport?: boolean;
  showAdd?: boolean;
}

export function TableFilters({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  additionalFilters = [],
  onRefresh,
  isRefreshing,
  onExport,
  onAdd,
  addButtonLabel = "Add New",
  activeFilters = [],
  onClearAllFilters,
  className,
  showSearch = true,
  showStatusFilter = true,
  showRefresh = true,
  showExport = false,
  showAdd = false,
}: TableFiltersProps) {
  const hasActiveFilters =
    activeFilters.length > 0 ||
    (statusFilter !== "all" && statusFilter !== "") ||
    searchTerm.trim() !== "";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main filter row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSearchChange("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          {/* Status Filter */}
          {showStatusFilter && (
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      {option.count !== undefined && (
                        <Badge variant="secondary" className="ml-2">
                          {option.count}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Additional Filters */}
          {additionalFilters.map((filter) => (
            <Select
              key={filter.key}
              value={filter.value}
              onValueChange={filter.onChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      {option.count !== undefined && (
                        <Badge variant="secondary" className="ml-2">
                          {option.count}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {showRefresh && onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
              />
              Refresh
            </Button>
          )}

          {showExport && onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}

          {showAdd && onAdd && (
            <Button size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              {addButtonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: &quot;{searchTerm}&quot;
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearchChange("")}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {statusFilter !== "all" && statusFilter !== "" && (
            <Badge variant="secondary" className="gap-1">
              Status:{" "}
              {statusOptions.find((opt) => opt.value === statusFilter)?.label ||
                statusFilter}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStatusFilterChange("all")}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {activeFilters.map((filter) => (
            <Badge key={filter.key} variant="secondary" className="gap-1">
              {filter.label}: {filter.value}
              <Button
                variant="ghost"
                size="sm"
                onClick={filter.onRemove}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {onClearAllFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
