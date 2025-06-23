import { BaseEntity } from "./common";

export interface Product {
  id: string;
  name: string;
  currency: string;
  availability: string;
  description?: string;
  image_url: string;
  price: string;
  retailer_id: string;
  visibility: string;
  url?: string;
  sale_price?: string;
}

export interface ProductResponse {
  data: Product[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
    previous?: string;
  };
}

export interface ProductFilters {
  search?: string;
  availability?: string;
  visibility?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface ProductSort {
  field: keyof Product;
  direction: 'asc' | 'desc';
}

export interface ProductFormData extends Omit<Product, 'id'> {
  id?: string;
}

export interface ProductTableColumn {
  key: keyof Product;
  label: string;
  sortable?: boolean;
  editable?: boolean;
  width?: string;
  render?: (value: any, product: Product) => React.ReactNode;
}