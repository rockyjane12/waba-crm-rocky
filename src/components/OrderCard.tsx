import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  MessageCircle,
  Check,
  ArrowRight,
  Hash,
  User,
  Package,
  CreditCard,
  Calendar,
  Clock,
  Phone,
} from "lucide-react";

interface Order {
  id: number;
  order_id: string;
  customer_wa_id: string;
  contact_phone: string | null;
  product_items: any;
  total_amount: number;
  order_status: string;
  payment_status: string | null;
  created_at: string;
  currency: string;
}

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, status: string) => void;
}

export const OrderCard = ({ order, onStatusUpdate }: OrderCardProps) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending:
        "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-800 border-yellow-200",
      confirmed:
        "bg-gradient-to-r from-blue-50 to-sky-50 text-blue-800 border-blue-200",
      preparing:
        "bg-gradient-to-r from-orange-50 to-red-50 text-orange-800 border-orange-200",
      ready:
        "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200",
      delivered:
        "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border-gray-200",
      cancelled:
        "bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-50 text-gray-800 border-gray-200";
  };

  const getPaymentStatusColor = (status: string | null) => {
    if (status === "paid")
      return "bg-green-100 text-green-800 border-green-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const formatCurrency = (amount: number, currency: string = "GBP") => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getProductItemsCount = (productItems: any) => {
    if (!productItems) return 0;
    if (Array.isArray(productItems)) return productItems.length;
    if (typeof productItems === "object")
      return Object.keys(productItems).length;
    return 0;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="h-4 w-4" />,
      confirmed: <Check className="h-4 w-4" />,
      preparing: <Package className="h-4 w-4" />,
      ready: <Check className="h-4 w-4" />,
      delivered: <Check className="h-4 w-4" />,
      cancelled: <Clock className="h-4 w-4" />,
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  const getNextStatusButton = () => {
    if (order.order_status === "pending") {
      return (
        <Button
          size="sm"
          onClick={() => onStatusUpdate(order.order_id, "confirmed")}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md flex-1 transition-all duration-200"
        >
          <Check className="h-4 w-4 mr-1" />
          Confirm
        </Button>
      );
    }
    if (order.order_status === "confirmed") {
      return (
        <Button
          size="sm"
          onClick={() => onStatusUpdate(order.order_id, "preparing")}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md flex-1 transition-all duration-200"
        >
          <ArrowRight className="h-4 w-4 mr-1" />
          Prepare
        </Button>
      );
    }
    if (order.order_status === "preparing") {
      return (
        <Button
          size="sm"
          onClick={() => onStatusUpdate(order.order_id, "ready")}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md flex-1 transition-all duration-200"
        >
          <Check className="h-4 w-4 mr-1" />
          Ready
        </Button>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
      <div className="p-6 space-y-5">
        {/* Header with gradient background */}
        <div className="relative -m-6 mb-4 p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Hash className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-mono font-bold text-lg text-gray-900">
                  {order.order_id}
                </p>
                <p className="text-sm text-gray-500">Order ID</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(order.total_amount || 0, order.currency)}
              </p>
              <p className="text-sm text-gray-500">Total Amount</p>
            </div>
          </div>
        </div>

        {/* Customer Info with enhanced styling */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 truncate">
                {order.customer_wa_id}
              </p>
              {order.contact_phone && (
                <div className="flex items-center gap-1 mt-1">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <p className="text-sm text-gray-600 truncate">
                    {order.contact_phone}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Items</p>
                <p className="text-lg font-bold text-purple-900">
                  {getProductItemsCount(order.product_items)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Payment</p>
                <Badge
                  className={`${getPaymentStatusColor(order.payment_status)} text-xs border`}
                >
                  {order.payment_status || "pending"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Current Status
            </span>
            <Badge
              className={`${getStatusColor(order.order_status || "pending")} border flex items-center gap-1 px-3 py-1`}
            >
              {getStatusIcon(order.order_status || "pending")}
              {(order.order_status || "pending").charAt(0).toUpperCase() +
                (order.order_status || "pending").slice(1)}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {new Date(order.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              at{" "}
              {new Date(order.created_at).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
          {getNextStatusButton()}
        </div>
      </div>
    </Card>
  );
};
