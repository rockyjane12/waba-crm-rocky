export type Status = 'active' | 'inactive' | 'pending' | 'blocked';

export type BaseEntity = {
  id: string;
  created_at: string;
  updated_at: string;
};

export type WhatsAppStatus = BaseEntity & {
  customer_id: string;
  status: Status;
  last_message_at: string | null;
  last_message_status: 'delivered' | 'read' | 'sent' | 'failed';
};

export type WhatsAppMessage = BaseEntity & {
  customer_id: string;
  message: string;
  direction: 'inbound' | 'outbound';
  status: 'delivered' | 'read' | 'sent' | 'failed';
  message_type: 'text' | 'image' | 'video' | 'document' | 'location';
  metadata: Record<string, any>;
};

export type Customer = BaseEntity & {
  name: string;
  phone: string;
  email: string | null;
  business_name: string;
  business_category: string;
  profile_image?: string;
  status: Status;
  // WhatsApp specific fields
  wa_id: string;
  phone_number: string;
  last_message?: string;
  last_message_at?: string;
  conversation_status?: 'active' | 'inactive';
};

export type CustomerWithRelations = Customer & {
  whatsapp_messages?: WhatsAppMessage[];
  whatsapp_status?: WhatsAppStatus;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type SortParams = {
  field: string;
  direction: 'asc' | 'desc';
};

export type FilterParams = {
  field: string;
  value: any;
  operator?: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike';
};

export interface ContactInfo {
  phone_number: string;
  display_phone_number?: string | null;
  email?: string | null;
}

export interface StatusInfo {
  status: string;
}

export interface MonetaryInfo {
  total_amount: number;
  currency: string;
}

export type TableFilterState = {
  searchTerm: string;
  statusFilter: string;
};

export interface TableProps<T> {
  data: T[];
  isLoading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  filters?: TableFilterState;
  onFiltersChange?: (filters: TableFilterState) => void;
}
