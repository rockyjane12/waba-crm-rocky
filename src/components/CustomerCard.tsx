import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Eye,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  Coins,
} from "lucide-react";

interface Customer {
  id: number;
  wa_id: string;
  name: string | null;
  phone_number: string;
  display_phone_number: string | null;
  email: string | null;
  status: string;
  total_orders: number;
  total_spent: number;
  last_order_at: string | null;
  created_at: string;
}

interface CustomerCardProps {
  customer: Customer;
}

export const CustomerCard = ({ customer }: CustomerCardProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {customer.name || "Unknown Customer"}
            </h3>
            <p className="text-sm text-gray-500">ID: {customer.wa_id}</p>
          </div>
          <StatusBadge status={customer.status || "PENDING"} />
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {customer.display_phone_number || customer.phone_number}
            </span>
          </div>
          {customer.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Orders</p>
              <p className="font-semibold">{customer.total_orders || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="font-semibold">
                £{(customer.total_spent || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Last Order */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div>
            <span className="text-gray-500">Last order: </span>
            {customer.last_order_at ? (
              <span>
                {new Date(customer.last_order_at).toLocaleDateString()}
              </span>
            ) : (
              <span className="text-gray-500">No orders</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      </div>
    </Card>
  );
};
