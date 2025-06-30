import { BaseEntity } from "./common";

export type ProductStatus = 'active' | 'inactive' | 'out_of_stock' | 'archived';

export type ProductCategory = 
  | 'appetizers'
  | 'main_courses'
  | 'desserts'
  | 'beverages'
  | 'sides'
  | 'specials'
  | 'other';

export interface Product extends BaseEntity {
  id: string;
  catalogId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  status: ProductStatus;
  category: ProductCategory;
  availability: boolean;
  variants?: ProductVariant[];
  metadata?: Record<string, any>;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  availability: boolean;
}

export interface Catalog extends BaseEntity {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  productCount: number;
  status: 'active' | 'inactive' | 'draft';
  isDefault: boolean;
  metadata?: Record<string, any>;
}

export interface ProductFilters {
  category?: ProductCategory;
  availability?: boolean;
  status?: ProductStatus;
  search?: string;
}

export interface ProductSort {
  field: keyof Product;
  direction: 'asc' | 'desc';
}

export interface CatalogState {
  isLoading: boolean;
  error: Error | null;
  data: Catalog[];
  selectedCatalog: string | null;
}

export interface ProductsState {
  isLoading: boolean;
  error: Error | null;
  data: Product[];
  filters: ProductFilters;
  sort: ProductSort;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}