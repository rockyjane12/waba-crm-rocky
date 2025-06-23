"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { PageContainer } from "@/components/PageContainer";
import { useCustomers } from "@/hooks/customers/useCustomers";
import { CustomerCard } from "@/components/CustomerCard";
import { Button } from "@/components/ui/button";
import { UserPlus, Download, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/DataTable";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { getCustomerColumns } from "@/components/customers/customer-table-columns";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { 
    customers, 
    isLoading, 
    error, 
    refresh, 
    setFilters 
  } = useCustomers({
    initialFilters: {
      status: statusFilter !== "all" ? statusFilter : undefined,
      search: searchTerm
    }
  });
  
  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);
  
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setFilters({ status: statusFilter !== "all" ? statusFilter : undefined, search: value });
  }, [statusFilter, setFilters]);
  
  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
    setFilters({ status: value !== "all" ? value : undefined, search: searchTerm });
  }, [searchTerm, setFilters]);
  
  // Get columns for the DataTable
  const columns = useMemo(() => getCustomerColumns(), []);

  return (
    <PageContainer
      title="Customers"
      subtitle="Manage your customer relationships"
      actions={
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <CustomerFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusChange}
          onRefresh={handleRefresh}
          isRefreshing={isLoading}
        />

        {/* Customer List */}
        <DataTable
          data={customers}
          columns={columns}
          isLoading={isLoading}
          error={error}
          emptyMessage="No customers found matching your criteria."
          loadingMessage="Loading customers..."
          renderMobileCard={(customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          )}
        />
      </div>
    </PageContainer>
  );
}