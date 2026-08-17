import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { CartItem, CartItemProduct, CartItemVariant } from '../types/cart';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (product: CartItemProduct, variant: CartItemVariant | null, quantity?: number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'eyarastore-cart-v2';

/** Unique cart line key — product + variant combo. */
export function cartItemKey(productId: string, variantId: string | null): string {
  return variantId ? `${productId}::${variantId}` : productId;
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items]);

  const addItem = useCallback(
    (product: CartItemProduct, variant: CartItemVariant | null, quantity = 1) => {
      const key = cartItemKey(product.id, variant?.id ?? null);
      setItems((prev) => {
        const existing = prev.find((item) => cartItemKey(item.product.id, item.variant?.id ?? null) === key);
        if (existing) {
          return prev.map((item) =>
            cartItemKey(item.product.id, item.variant?.id ?? null) === key
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [...prev, { product, variant, quantity }];
      });
      setIsOpen(true);
    },
    [],
  );

  const removeItem = useCallback((key: string) => {
    setItems((prev) =>
      prev.filter((item) => cartItemKey(item.product.id, item.variant?.id ?? null) !== key),
    );
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) =>
        prev.filter((item) => cartItemKey(item.product.id, item.variant?.id ?? null) !== key),
      );
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        cartItemKey(item.product.id, item.variant?.id ?? null) === key
          ? { ...item, quantity }
          : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const unit = item.variant ? item.variant.price : item.product.price;
    return sum + unit * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
