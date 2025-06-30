export interface Catalog {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  productCount: number;
  status: 'active' | 'inactive';
  isDefault: boolean;
  created_at: string;
  updated_at: string;
}

export interface CatalogListResponse {
  data: Catalog[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
    previous?: string;
  };
}

export interface CatalogFilters {
  search?: string;
  status?: 'active' | 'inactive';
  sortBy?: 'name' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCatalogInput {
  name: string;
  description?: string;
  thumbnailUrl?: string;
  isDefault?: boolean;
}

export interface UpdateCatalogInput {
  name?: string;
  description?: string;
  thumbnailUrl?: string;
  status?: 'active' | 'inactive';
  isDefault?: boolean;
}

export type CatalogId = string;

// Error types
export interface CatalogError extends Error {
  code: string;
  status: number;
  details?: unknown;
}

// Event types
export interface CatalogCreatedEvent {
  type: 'catalog.created';
  payload: Catalog;
}

export interface CatalogUpdatedEvent {
  type: 'catalog.updated';
  payload: {
    id: CatalogId;
    changes: Partial<Catalog>;
  };
}

export interface CatalogDeletedEvent {
  type: 'catalog.deleted';
  payload: {
    id: CatalogId;
  };
}

export type CatalogEvent = 
  | CatalogCreatedEvent 
  | CatalogUpdatedEvent 
  | CatalogDeletedEvent;

// State types
export interface CatalogState {
  selectedId: CatalogId | null;
  filters: CatalogFilters;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
  };
}
