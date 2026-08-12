import { useMemo } from 'react';
import { useData } from '../context/DataContext';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  gallery: string[];
  category_id: string | null;
  demographic: 'men' | 'women' | 'kids';
  product_type: 'clothes' | 'shoes';
  rating: number;
  review_count: number;
  featured: boolean;
  in_stock: boolean;
  tags: string[];
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  demographic: 'men' | 'women' | 'kids';
  product_type: 'clothes' | 'shoes';
  sort_order: number;
  created_at: string;
}

export type ProductWithCategory = Product & {
  category?: Category | null;
};

export function useCategories() {
  const { categories, loading, error } = useData();
  return { categories, loading, error };
}

export function useProducts(options?: {
  demographic?: string;
  productType?: string;
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

    if (options?.featuredOnly) {
      result = result.filter((p) => p.featured);
    }

    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (options?.limit) {
      result = result.slice(0, options.limit);
    }

    return result;
  }, [products, options?.demographic, options?.productType, options?.featuredOnly, options?.limit]);

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
      .filter((p) => p.id !== product.id && p.demographic === product.demographic)
      .slice(0, limit);
  }, [products, product, limit]);

  return { products: relatedProducts, loading: false };
}
