export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  gallery: string[];
  category_id: string | null;
  rating: number;
  review_count: number;
  featured: boolean;
  in_stock: boolean;
  tags: string[];
  created_at: string;
}

export interface ProductWithCategory extends Product {
  category?: Category | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
