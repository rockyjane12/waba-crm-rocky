export interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  currency: string;
  retailer_id: string;
  availability: "in stock" | "out of stock";
  image_url: string;
  url?: string;
  sale_price?: string;
  visibility?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: string;
  currency: string;
  retailer_id: string;
  availability: "in stock" | "out of stock";
  image_url?: string;
  url?: string;
  sale_price?: string;
}

export interface ProductImage {
  url: string;
  path: string;
  size: number;
  type: string;
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