import React, { useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types/common";
import { useTableData } from "@/hooks/data/useTableData";
import {
  DataTable,
  DataTablePagination,
  DataTableViewOptions,
  Column,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  formatCurrency,
  formatDateTime,
} from "@/utils/formatting";
import { filterCustomers } from "@/utils/table";
import { Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export function CustomersTable() {
  // Memoize the fetch function to ensure it's stable across renders
  const fetchCustomers = useCallback(async () => {
    return supabase
      .from("customers")
      .select("*");
  }, []);

  const {
    paginatedData,
    isLoading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    sortField,
    sortDirection,
    searchTerm,
    statusFilter,
    handleSort,
    setCurrentPage,
    setSearchTerm,
    setStatusFilter,
    handleRefresh,
    isRefreshing,
  } = useTableData({
    fetchData: fetchCustomers,
    filterData: filterCustomers,
    itemsPerPage: 10,
    cacheKey: "customers_table"
  });

  const columns: Column<Customer>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.profile_image && (
            <img
              src={row.profile_image}
              alt={row.name}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-muted-foreground">{row.phone}</div>
          </div>
        </div>
      ),
    },
    {
      id: "business",
      header: "Business",
      cell: (row) => (
        <div>
          <div className="font-medium">{row.business_name}</div>
          <div className="text-sm text-muted-foreground">
            {row.business_category}
          </div>
        </div>
      ),
    },
    {
      id: "last_message_at",
      header: "Last Message",
      cell: (row) =>
        row.last_message_at ? (
          <div className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(row.last_message_at), {
              addSuffix: true,
            })}
          </div>
        ) : (
          "-"
        ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const statuses = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
    { value: "blocked", label: "Blocked" },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        data={paginatedData}
        columns={columns}
        isLoading={isLoading}
      />
      <div className="flex items-center justify-between">
        <DataTablePagination />
        <DataTableViewOptions />
      </div>
    </div>
  );
}

export default CustomersTable;