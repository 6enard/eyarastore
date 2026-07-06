import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, Category, ProductWithCategory } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (cancelled) return;
      if (error) setError(error.message);
      else setCategories(data || []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { categories, loading, error };
}

export function useProducts(options?: {
  categorySlug?: string;
  featuredOnly?: boolean;
  limit?: number;
}) {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false });

      if (options?.featuredOnly) {
        query = query.eq('featured', true);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (cancelled) return;

      if (error) {
        setError(error.message);
        setProducts([]);
      } else {
        let results = (data || []) as ProductWithCategory[];
        if (options?.categorySlug) {
          results = results.filter(
            (p) => p.category?.slug === options.categorySlug
          );
        }
        setProducts(results);
        setError(null);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [options?.categorySlug, options?.featuredOnly, options?.limit]);

  return { products, loading, error };
}

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .maybeSingle();
      if (cancelled) return;
      if (error) setError(error.message);
      else setProduct(data as ProductWithCategory | null);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  return { product, loading, error };
}

export function useRelatedProducts(product: Product | null, limit = 4) {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .neq('id', product.id)
        .eq('category_id', product.category_id || '')
        .limit(limit);
      if (cancelled) return;
      setProducts((data || []) as ProductWithCategory[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [product?.id, limit]);

  return { products, loading };
}
