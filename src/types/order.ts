import { BaseEntity, MonetaryInfo } from "./common";
import type { Json } from '@/integrations/supabase/types';

export type OrderSortField =
  | "created_at"
  | "order_id"
  | "total_amount"
  | "order_status"
  | "payment_status";

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Base Order interface with nullable fields
export interface Order {
  id: number;
  order_id: string;
  customer_wa_id: string;
  contact_phone: string | null;
  product_items: Json[];
  total_amount: number | null;
  order_status: string | null;
  payment_status: string | null;
  created_at: string | null;
  currency: string | null;
  billing_address: Json;
  customer_id: number | null;
  delivery_charge: number | null;
  updated_at: string | null;
}

// Non-nullable version for table display
export interface OrderTableData {
  id: number;
  order_id: string;
  customer_wa_id: string;
  contact_phone: string;
  product_items: Json;
  total_amount: number;
  currency: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: string;
}

export interface OrderTableProps {
  orders: OrderTableData[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  sortField: OrderSortField;
  sortDirection: "asc" | "desc";
  onSort: (field: OrderSortField) => void;
  onPageChange: (page: number) => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

export interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  onView?: (order: Order) => void;
  onMessage?: (order: Order) => void;
}

export interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: OrderStatus | "all";
  onStatusFilterChange: (status: OrderStatus | "all") => void;
  onPageChange: (page: number) => void;
}

export interface OrderHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}
