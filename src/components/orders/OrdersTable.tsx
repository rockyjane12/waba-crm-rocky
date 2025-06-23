import React, { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { useTableData } from "@/hooks/useTableData";
import {
  DataTable,
  TableFilters,
  TablePagination,
} from "@/components/tables";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  formatCurrency,
  formatDateTime,
  formatProductItemsCount,
} from "@/utils/formatting";
import { filterOrders } from "@/utils/table";
import { Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function OrdersTable() {
  // Memoize the fetch function to ensure it's stable across renders
  const fetchOrders = useCallback(async () => {
    return supabase.from("orders").select("*");
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
    fetchData: fetchOrders,
    filterData: filterOrders,
    itemsPerPage: 10,
    cacheKey: "orders_table"
  });

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    const { error } = await supabase
      .from("orders")
      .update({ order_status: newStatus })
      .eq("order_id", orderId);

    if (error) {
      toast.error(`Failed to update order status: ${error.message}`);
    } else {
      toast.success(`Order ${orderId} status updated to ${newStatus}`);
      handleRefresh();
    }
  };

  const columns = [
    {
      key: "order_id",
      header: "Order ID",
      sortable: true,
      render: (order: Order) => (
        <div>
          <p className="font-medium">{order.order_id}</p>
          <p className="text-sm text-gray-500">{order.customer_wa_id}</p>
        </div>
      ),
    },
    {
      key: "product_items",
      header: "Items",
      render: (order: Order) => (
        <span className="font-medium">
          {formatProductItemsCount(order.product_items)} item(s)
        </span>
      ),
    },
    {
      key: "total_amount",
      header: "Total",
      sortable: true,
      render: (order: Order) => (
        <span className="font-medium">
          {order.total_amount && order.currency
            ? formatCurrency(order.total_amount, order.currency)
            : formatCurrency(0, "GBP")}
        </span>
      ),
    },
    {
      key: "order_status",
      header: "Status",
      sortable: true,
      render: (order: Order) => (
        <StatusBadge
          status={order.order_status || ("pending" as OrderStatus)}
          showIcon
        />
      ),
    },
    {
      key: "payment_status",
      header: "Payment",
      sortable: true,
      render: (order: Order) => (
        <StatusBadge
          status={order.payment_status || ("pending" as PaymentStatus)}
          variant="secondary"
          showIcon
        />
      ),
    },
    {
      key: "created_at",
      header: "Date",
      sortable: true,
      render: (order: Order) => (
        <div className="text-sm">
          {order.created_at ? formatDateTime(order.created_at) : "N/A"}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-[100px]",
      render: (order: Order) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const statuses = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "preparing", label: "Preparing" },
    { value: "ready", label: "Ready" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-4">
      <TableFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search orders..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statuses={statuses}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <DataTable
        data={paginatedData}
        columns={columns}
        isLoading={isLoading}
        error={error}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        showItemsPerPage
      />
    </div>
  );
}

export default OrdersTable;