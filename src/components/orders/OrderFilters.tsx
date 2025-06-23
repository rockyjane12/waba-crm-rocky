import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

const OrderFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  isRefreshing,
}: OrderFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default OrderFilters;