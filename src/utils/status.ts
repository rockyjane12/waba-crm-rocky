import { OrderStatus, PaymentStatus } from "@/types/order";

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon?: string;
}

type StatusConfigMap = {
  [key in OrderStatus | PaymentStatus]: StatusConfig;
};

export const ORDER_STATUS_CONFIG: StatusConfigMap = {
  pending: {
    label: "Pending",
    color: "yellow",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    icon: "⏳",
  },
  confirmed: {
    label: "Confirmed",
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    icon: "✓",
  },
  preparing: {
    label: "Preparing",
    color: "orange",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
    icon: "🔧",
  },
  ready: {
    label: "Ready",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    icon: "✅",
  },
  delivered: {
    label: "Delivered",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    icon: "📦",
  },
  cancelled: {
    label: "Cancelled",
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    icon: "❌",
  },
  paid: {
    label: "Paid",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    icon: "💰",
  },
  failed: {
    label: "Failed",
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    icon: "❌",
  },
  refunded: {
    label: "Refunded",
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    icon: "↩️",
  },
};

export const getStatusConfig = (
  status: OrderStatus | PaymentStatus,
): StatusConfig => {
  return ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending;
};

export const getStatusLabel = (status: OrderStatus | PaymentStatus): string => {
  return ORDER_STATUS_CONFIG[status]?.label || status;
};

export const getStatusColor = (status: OrderStatus | PaymentStatus): string => {
  return ORDER_STATUS_CONFIG[status]?.color || "gray";
};

export const getStatusBgColor = (
  status: OrderStatus | PaymentStatus,
): string => {
  return ORDER_STATUS_CONFIG[status]?.bgColor || "bg-gray-100";
};

export const getStatusTextColor = (
  status: OrderStatus | PaymentStatus,
): string => {
  return ORDER_STATUS_CONFIG[status]?.textColor || "text-gray-800";
};

export const getStatusIcon = (status: OrderStatus | PaymentStatus): string => {
  return ORDER_STATUS_CONFIG[status]?.icon || "•";
};

export const isValidOrderStatus = (status: string): status is OrderStatus => {
  return (
    status in ORDER_STATUS_CONFIG &&
    [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
      "cancelled",
    ].includes(status)
  );
};

export const isValidPaymentStatus = (
  status: string,
): status is PaymentStatus => {
  return (
    status in ORDER_STATUS_CONFIG &&
    ["pending", "paid", "failed", "refunded"].includes(status)
  );
};

export const getNextOrderStatus = (currentStatus: OrderStatus): OrderStatus => {
  const statusFlow: OrderStatus[] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "delivered",
  ];
  const currentIndex = statusFlow.indexOf(currentStatus);

  if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
    return currentStatus;
  }

  return statusFlow[currentIndex + 1];
};

export const getPreviousOrderStatus = (
  currentStatus: OrderStatus,
): OrderStatus => {
  const statusFlow: OrderStatus[] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "delivered",
  ];
  const currentIndex = statusFlow.indexOf(currentStatus);

  if (currentIndex <= 0) {
    return currentStatus;
  }

  return statusFlow[currentIndex - 1];
};
