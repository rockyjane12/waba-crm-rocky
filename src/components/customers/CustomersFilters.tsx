import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CustomersFiltersProps {
  filters: {
    search?: string;
    status?: string;
  };
  onFiltersChange: (filters: CustomersFiltersProps["filters"]) => void;
}

export function CustomersFilters({
  filters,
  onFiltersChange,
}: CustomersFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search and Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers by name, email, phone..."
            value={filters.search || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select
            value={filters.status || ""}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, status: value })
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.status === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            onFiltersChange({ ...filters, status: "all" });
          }}
        >
          All
        </Button>
        <Button
          variant={filters.status === "ACTIVE" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            onFiltersChange({ ...filters, status: "ACTIVE" });
          }}
        >
          Active
        </Button>
        <Button
          variant={filters.status === "PENDING" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            onFiltersChange({ ...filters, status: "PENDING" });
          }}
        >
          Pending
        </Button>
      </div>
    </div>
  );
}
