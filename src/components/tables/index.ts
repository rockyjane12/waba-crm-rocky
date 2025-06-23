import type { ColumnDef, Row } from "@tanstack/react-table";

// Export data table components
export { DataTable } from "@/components/ui/table/index";
export { DataTablePagination } from "@/components/ui/table/index";
export { DataTableViewOptions } from "@/components/ui/table/index";

// Export utility components
export { TableFilters } from "./TableFilters";
export { TableHeader } from "./TableHeader";
export { TablePagination } from "./TablePagination";

// Export types
export type { ColumnDef } from "@tanstack/react-table";
export type { TableFilterState } from "@/types/common";

// Re-export types from TanStack Table for convenience
export type {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  Row,
  Table,
} from "@tanstack/react-table";

// Export our component types
export type { TableFiltersProps } from "./TableFilters";
export type { TableHeaderProps } from "./TableHeader";

// Export our custom types
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface CustomColumnDef<T> extends Omit<ColumnDef<T>, "cell"> {
  accessorKey: keyof T;
  header: string;
  cell: ({ row }: { row: Row<T> }) => React.ReactNode;
}

// Example usage documentation
/*
import { 
  DataTable, 
  TablePagination, 
  TableFilters,
  TableHeader,
  useTableData 
} from '@/components/tables';

function MyTablePage() {
  const {
    data,
    isLoading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    sortField,
    sortDirection,
    searchTerm,
    statusFilter,
    selectedItems,
    handleSort,
    setCurrentPage,
    setSearchTerm,
    setStatusFilter,
    setSelectedItems,
    handleRefresh,
    isRefreshing,
  } = useTableData({
    fetchData: async () => {
      // Your data fetching logic
      return { data: [], error: null };
    },
    filterData: (data, filters) => {
      // Your filtering logic
      return data;
    },
    itemsPerPage: 10,
  });

  const columns = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      width: '80px',
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (item) => (
        <div className="font-medium">{item.name}</div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <StatusBadge status={item.status} />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">Edit</Button>
          <Button size="sm" variant="outline">Delete</Button>
        </div>
      ),
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <TableHeader
        title="My Data"
        subtitle="Manage your data efficiently"
        totalCount={data.length}
        selectedCount={selectedItems.length}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        bulkActions={[
          {
            label: 'Delete Selected',
            variant: 'destructive',
            onClick: () => console.log('Delete selected'),
          },
        ]}
      />

      <TableFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={statusOptions}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        getItemId={(item) => item.id}
      />

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        showItemsPerPage
      />
    </div>
  );
}
*/