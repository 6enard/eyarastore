import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, Category, Order, OrderItem, ProductVariant } from '../hooks/useData';

interface DataContextValue {
  products: Product[];
  categories: Category[];
  orders: Order[];
  orderItems: OrderItem[];
  variants: ProductVariant[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes, ordersRes, orderItemsRes, variantsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('order_items').select('*').order('created_at', { ascending: false }),
        supabase.from('product_variants').select('*').order('sort_order', { ascending: true }),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (ordersRes.error) throw ordersRes.error;
      if (orderItemsRes.error) throw orderItemsRes.error;
      if (variantsRes.error) throw variantsRes.error;

      setProducts((productsRes.data || []) as Product[]);
      setCategories((categoriesRes.data || []) as Category[]);
      setOrders((ordersRes.data || []) as Order[]);
      setOrderItems((orderItemsRes.data || []) as OrderItem[]);
      setVariants((variantsRes.data || []) as ProductVariant[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DataContext.Provider
      value={{ products, categories, orders, orderItems, variants, loading, error, refetch: loadData }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
