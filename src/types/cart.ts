export interface ProductVariant {
  id: string;
  product_id: string;
  size: string | null;
  color: string | null;
  sku: string;
  price_override: number | null;
  stock: number;
  sale_price: number | null;
  sale_start_at: string | null;
  sale_end_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
  in_stock: boolean;
  category_id: string | null;
}

export interface CartItemVariant {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  price: number;
  stock: number;
}

export interface CartItem {
  product: CartItemProduct;
  variant: CartItemVariant | null;
  quantity: number;
}
