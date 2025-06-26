import React from "react";
import { DataTable } from "@/components/tables/DataTable";
import OrderCard from "./OrderCard";
import { useIsMobile } from "@/hooks";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { Order } from '@/types/order';

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  error: Error | null;
  onStatusUpdate: (orderId: string, status: string) => Promise<void>;
}

const OrderList = ({ orders, isLoading, error, onStatusUpdate }: OrderListProps) => {
  const isMobile = useIsMobile();

  // Define columns for the DataTable
  const columns = [
    {
      key: "order_id",
      header: "Order ID",
      mobileLabel: "Order ID",
      render: (order: Order) => <span className="font-medium">{order.order_id}</span>,
    },
    {
      key: "customer",
      header: "Customer",
      mobileLabel: "Customer",
      render: (order: Order) => (
        <div>
          <p className="font-medium">{order.customer_wa_id}</p>
          {order.contact_phone && (
            <p className="text-sm text-gray-500">{order.contact_phone}</p>
          )}
        </div>
      ),
    },
    {
      key: "product_items",
      header: "Items",
      mobileLabel: "Items",
      render: (order: Order) => {
        const getProductItemsCount = (productItems: Order['product_items']) => {
          if (!productItems) return 0;
          return productItems.length;
        };

        return <span>{getProductItemsCount(order.product_items)} item(s)</span>;
      },
    },
    {
      key: "total_amount",
      header: "Total",
      mobileLabel: "Total",
      render: (order: Order) => {
        const formatCurrency = (amount: number | null, currency: string | null = "GBP") => {
          return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: currency || "GBP",
          }).format(amount || 0);
        };

        return (
          <span className="font-medium">
            {formatCurrency(order.total_amount, order.currency)}
          </span>
        );
      },
    },
    {
      key: "order_status",
      header: "Status",
      mobileLabel: "Status",
      render: (order: Order) => <StatusBadge status={order.order_status || "pending"} />,
    },
    {
      key: "payment_status",
      header: "Payment",
      mobileLabel: "Payment",
      render: (order: Order) => (
        <StatusBadge
          status={order.payment_status || "pending"}
          variant="secondary"
        />
      ),
    },
    {
      key: "created_at",
      header: "Date",
      mobileLabel: "Date",
      render: (order: Order) => (
        <div className="text-sm">
          {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
          <br />
          <span className="text-gray-500">
            {order.created_at ? new Date(order.created_at).toLocaleTimeString() : ''}
          </span>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      isLoading={isLoading}
      error={error}
      emptyMessage="No orders found matching your criteria."
      loadingMessage="Loading orders..."
      renderMobileCard={(order, index) => (
        <OrderCard
          key={order.id || index}
          order={order}
          onStatusUpdate={onStatusUpdate}
        />
      )}
    />
  );
};

export default OrderList;