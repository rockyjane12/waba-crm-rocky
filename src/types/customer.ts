import { BaseEntity, ContactInfo } from "./common";
import { Json } from "@/integrations/supabase/types";

// Sort types
export type CustomerSortField =
  | "created_at"
  | "name"
  | "total_orders"
  | "total_spent"
  | "last_order_at"
  | "status";

export type SortDirection = "asc" | "desc";

// Base Customer interface with nullable fields
export interface Customer {
  id: number;
  created_at: string | null;
  updated_at: string | null;
  name: string | null;
  phone_number: string;
  wa_id: string;
  profile_name: string | null;
  status: string | null;
  metadata: Json | null;
  last_message_at: string | null;
  last_message: string | null;
  conversation_status: string | null;
}

// Non-nullable version for table display
export interface CustomerTableData {
  id: number;
  wa_id: string;
  name: string;
  phone_number: string;
  profile_name: string;
  status: string;
  last_message: string;
  last_message_at: string;
  conversation_status: string;
  created_at: string;
}

export interface CustomerTableProps {
  customers: CustomerTableData[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  sortField: CustomerSortField;
  sortDirection: SortDirection;
  onSort: (field: CustomerSortField) => void;
  onPageChange: (page: number) => void;
}

export interface CustomerCardProps {
  customer: Customer;
  onView?: (customer: Customer) => void;
  onMessage?: (customer: Customer) => void;
}

export interface CustomerFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onPageChange: (page: number) => void;
}

export interface CustomerHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}
