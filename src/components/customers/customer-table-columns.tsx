import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatRelativeTime } from "@/lib/utils/format/date";

export interface Customer {
  id: number;
  wa_id: string;
  name: string | null;
  phone_number: string;
  display_phone_number: string | null;
  email: string | null;
  status: string | null;
  last_message: string | null;
  last_message_at: string | null;
  conversation_status: string | null;
}

export const getCustomerColumns = () => [
  {
    key: "customer",
    header: "Customer",
    mobileLabel: "Customer",
    render: (customer: Customer) => (
      <div>
        <p className="font-medium">{customer.name || "Unknown"}</p>
        <p className="text-sm text-gray-500">ID: {customer.wa_id}</p>
      </div>
    ),
  },
  {
    key: "contact",
    header: "Contact",
    mobileLabel: "Contact",
    render: (customer: Customer) => (
      <div className="text-sm">
        <p>{customer.display_phone_number || customer.phone_number}</p>
        {customer.email && <p className="text-gray-500">{customer.email}</p>}
        }
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    mobileLabel: "Status",
    render: (customer: Customer) => (
      <StatusBadge status={customer.status || "PENDING"} />
    ),
  },
  {
    key: "last_message",
    header: "Last Message",
    mobileLabel: "Last Message",
    render: (customer: Customer) => (
      <div className="text-sm">
        <p className="truncate max-w-[200px]">{customer.last_message || "No messages"}</p>
        {customer.last_message_at && (
          <p className="text-gray-500 text-xs">
            {formatRelativeTime(new Date(customer.last_message_at))}
          </p>
        )}
      </div>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    mobileLabel: "Actions",
    render: () => (
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

export default getCustomerColumns;