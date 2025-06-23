"use client";

import { supabase } from "@/integrations/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import { TableFilterState } from "@/types/common";
import { useSupabaseQuery } from "@/hooks/data/useSupabase";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

// Generic type for table data
export type TableData = {
  id: number;
  created_at: string;
  [key: string]: any;
};

// Props required by the HOC
interface WithTableDataProps<T extends TableData> {
  fetchData: () => Promise<{ data: T[] | null; error: any }>;
  filterData: (data: T[], filters: TableFilterState) => T[];
  itemsPerPage?: number;
}

// State managed by the HOC
interface WithTableDataState<T extends TableData> {
  data: T[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  sortField: keyof T;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof T) => void;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}

// Function to avoid conflicts between props and state
type PropsWithoutState<P, S> = Omit<P, keyof S>;

export function withTableData<
  T extends TableData,
  P extends WithTableDataState<T>,
>(
  WrappedComponent: React.ComponentType<P>,
  { fetchData, filterData, itemsPerPage = 10 }: WithTableDataProps<T>,
) {
  return function WithTableDataComponent(
    props: PropsWithoutState<P, WithTableDataState<T>>,
  ) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<keyof T>("created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { data, isLoading, error, refetch } = useSupabaseQuery<T[]>(
      fetchData,
      [sortField, sortDirection],
    );

    const handleRefresh = async () => {
      setIsRefreshing(true);
      await refetch();
      setTimeout(() => setIsRefreshing(false), 500);
    };

    const handleSort = (field: keyof T) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    };

    const filteredData = data
      ? filterData(data, { searchTerm, statusFilter })
      : [];

    const sortedData = [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null || aValue === undefined)
        return sortDirection === "asc" ? -1 : 1;
      if (bValue === null || bValue === undefined)
        return sortDirection === "asc" ? 1 : -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : bValue > aValue
          ? 1
          : -1;
    });

    const paginatedData = sortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    if (isLoading) {
      return (
        <div className="w-full flex justify-center items-center py-16">
          <Loading message="Loading data..." />
        </div>
      );
    }

    if (error) {
      return (
        <Container>
          <div className="text-center py-12">
            <p className="text-red-600">Error loading data: {error.message}</p>
            <Button onClick={handleRefresh} className="mt-4">
              Try Again
            </Button>
          </div>
        </Container>
      );
    }

    const tableProps: WithTableDataState<T> = {
      data: paginatedData,
      currentPage,
      totalPages,
      itemsPerPage,
      sortField,
      sortDirection,
      onSort: handleSort,
      onPageChange: setCurrentPage,
      searchTerm,
      onSearchChange: setSearchTerm,
      statusFilter,
      onStatusFilterChange: setStatusFilter,
      isRefreshing,
      onRefresh: handleRefresh,
    };

    return <WrappedComponent {...(props as P)} {...tableProps} />;
  };
}
