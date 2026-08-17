import { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, Loader2 } from 'lucide-react';
import { useCart, cartItemKey } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import { useRouter } from '../context/RouterContext';
import { supabase } from '../lib/supabase';

const WHATSAPP_NUMBER = '+254722456252';

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EYA-${timestamp}-${random}`;
}

function generateWhatsAppMessage(
  items: { product: { name: string }; variant: { size: string | null; color: string | null; sku: string } | null; quantity: number; unitPrice: number }[],
  subtotal: number,
  orderNumber?: string,
): string {
  const date = new Date();
  const dateStr = date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

  const lines = [
    `EYARASTORE`,
    `Order Receipt`,
    orderNumber ? `Order ID: ${orderNumber}` : `Order ID: ${generateOrderId()}`,
    `Date: ${dateStr}`,
    `──────────────────`,
  ];

  items.forEach((item) => {
    lines.push(item.product.name);
    const variantInfo: string[] = [];
    if (item.variant?.size) variantInfo.push(`Size: ${item.variant.size}`);
    if (item.variant?.color) variantInfo.push(`Color: ${item.variant.color}`);
    if (item.variant?.sku) variantInfo.push(`SKU: ${item.variant.sku}`);
    if (variantInfo.length) lines.push(`  ${variantInfo.join(' · ')}`);
    lines.push(`${item.quantity} × Ksh ${item.unitPrice.toLocaleString('en-KE')}`);
  });

  lines.push(`──────────────────`);
  lines.push(`Total: Ksh ${subtotal.toLocaleString('en-KE')}`);
  lines.push(`We'll contact you to confirm delivery and payment.`);
  lines.push(`Thank you for your order!`);

  return lines.join('\n');
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount, clearCart } = useCart();
  const { navigate } = useRouter();
  const [placing, setPlacing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setPlacing(true);
    setCheckoutError(null);

    try {
      // Build the payload for the place_order RPC.
      const rpcItems = items.map((item) => ({
        product_id: item.product.id,
        variant_id: item.variant?.id ?? null,
        size: item.variant?.size ?? null,
        color: item.variant?.color ?? null,
        sku: item.variant?.sku ?? null,
        price: item.variant ? item.variant.price : item.product.price,
        quantity: item.quantity,
        name: item.product.name,
        image: item.product.image_url,
      }));

      // Minimal customer object — the real customer details are collected
      // over WhatsApp when the store confirms the order.
      const customer = {
        name: 'WhatsApp Customer',
        email: 'pending@eyarastore.co.ke',
        phone: '',
        shipping_address: '',
        city: '',
        notes: 'Order placed via WhatsApp checkout.',
      };

      const { data, error } = await supabase.rpc('place_order', {
        p_items: rpcItems,
        p_customer: customer,
      });

      if (error) throw error;

      const orderNumber = (data as { order_number?: string })?.order_number;

      const message = generateWhatsAppMessage(
        items.map((item) => ({
          product: { name: item.product.name },
          variant: item.variant
            ? { size: item.variant.size, color: item.variant.color, sku: item.variant.sku }
            : null,
          quantity: item.quantity,
          unitPrice: item.variant ? item.variant.price : item.product.price,
        })),
        subtotal,
        orderNumber,
      );
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      clearCart();
      closeCart();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to place order.';
      setCheckoutError(message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-cream-50 shadow-2xl transition-transform duration-400 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sage-200">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-ink-700" strokeWidth={1.5} />
            <h2 className="font-serif text-xl text-ink-700 font-medium">
              Your Cart {itemCount > 0 && `(${itemCount})`}
            </h2>
          </div>
          <button onClick={closeCart} className="text-ink-500 hover:text-ink-700 transition-colors" aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center">
                <ShoppingBag size={28} className="text-sage-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-serif text-lg text-ink-700 mb-1">Your cart is empty</p>
                <p className="text-sm text-sage-500">Discover something you'll love.</p>
              </div>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
                className="btn-outline mt-2"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => {
                const key = cartItemKey(item.product.id, item.variant?.id ?? null);
                const unitPrice = item.variant ? item.variant.price : item.product.price;
                return (
                  <li key={key} className="flex gap-4">
                    <button
                      onClick={() => {
                        closeCart();
                        navigate(`/product/${item.product.slug}`);
                      }}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.product.image_url || ''}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover bg-cream-100"
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-base text-ink-700 font-medium leading-snug truncate">
                        {item.product.name}
                      </h3>
                      {(item.variant?.size || item.variant?.color) && (
                        <p className="text-xs text-sage-500 mt-0.5">
                          {[item.variant?.size, item.variant?.color].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      {item.variant?.sku && (
                        <p className="text-[10px] text-sage-400 mt-0.5">SKU: {item.variant.sku}</p>
                      )}
                      <p className="text-sm text-sage-500 mt-0.5">{formatPrice(unitPrice)}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-sage-300">
                          <button
                            onClick={() => updateQuantity(key, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-ink-600 hover:bg-cream-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm text-ink-700">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(key, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-ink-600 hover:bg-cream-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(key)}
                          className="text-sage-400 hover:text-bronze-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-ink-700">
                        {formatPrice(unitPrice * item.quantity)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-sage-200 px-6 py-5 space-y-4">
            {checkoutError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">
                {checkoutError}
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm tracking-wide text-ink-500 uppercase">Subtotal</span>
              <span className="font-serif text-2xl text-ink-700 font-medium">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-sage-500">Shipping & payment details discussed via WhatsApp.</p>
            <button onClick={handleCheckout} disabled={placing} className="btn-bronze w-full disabled:opacity-50">
              {placing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <MessageCircle size={18} />
                  Order via WhatsApp
                </>
              )}
            </button>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-ink-500 hover:text-bronze-500 transition-colors tracking-wide"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
