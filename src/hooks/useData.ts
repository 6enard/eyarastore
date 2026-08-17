import { useMemo } from 'react';
import { useData } from '../context/DataContext';

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

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  description_paragraph: string | null;
  description_features: string[];
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  gallery: string[];
  category_id: string | null;
  demographic: 'men' | 'women' | 'kids' | null;
  product_type: 'clothes' | 'shoes' | null;
  rating: number;
  review_count: number;
  featured: boolean;
  in_stock: boolean;
  tags: string[];
  sale_price: number | null;
  sale_start_at: string | null;
  sale_end_at: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  demographic: 'men' | 'women' | 'kids' | null;
  product_type: 'clothes' | 'shoes' | null;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
  line_total: number;
  size: string | null;
  color: string | null;
  sku: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string | null;
  city: string | null;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductWithCategory = Product & {
  category?: Category | null;
  variants?: ProductVariant[];
};

export function useCategories() {
  const { categories, loading, error } = useData();
  return { categories, loading, error };
}

export function useProducts(options?: {
  demographic?: string;
  productType?: string;
  categoryId?: string;
  featuredOnly?: boolean;
  limit?: number;
}) {
  const { products, loading, error } = useData();

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (options?.demographic) {
      result = result.filter((p) => p.demographic === options.demographic);
    }

    if (options?.productType) {
      result = result.filter((p) => p.product_type === options.productType);
    }

    if (options?.categoryId) {
      result = result.filter((p) => p.category_id === options.categoryId);
    }

    if (options?.featuredOnly) {
      result = result.filter((p) => p.featured);
    }

    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (options?.limit) {
      result = result.slice(0, options.limit);
    }

    return result;
  }, [products, options?.demographic, options?.productType, options?.categoryId, options?.featuredOnly, options?.limit]);

  return { products: filteredProducts, loading, error };
}

export function useProduct(slug: string | undefined) {
  const { products, loading, error } = useData();

  const product = useMemo(() => {
    if (!slug) return null;
    return products.find((p) => p.slug === slug) || null;
  }, [products, slug]);

  return { product, loading, error };
}

export function useRelatedProducts(product: Product | null, limit = 4) {
  const { products } = useData();

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && p.category_id === product.category_id)
      .slice(0, limit);
  }, [products, product, limit]);

  return { products: relatedProducts, loading: false };
}
