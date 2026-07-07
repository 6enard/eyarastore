import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import type { TransformedProduct, TransformedCategory } from '../lib/dummyjson';

export type { TransformedProduct as Product, TransformedCategory as Category };

export type ProductWithCategory = TransformedProduct & {
  category?: TransformedCategory | null;
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

export function useRelatedProducts(product: TransformedProduct | null, limit = 4) {
  const { products } = useData();

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && p.demographic === product.demographic)
      .slice(0, limit);
  }, [products, product, limit]);

  return { products: relatedProducts, loading: false };
}
