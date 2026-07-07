import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import { useRouter } from '../context/RouterContext';

const WHATSAPP_NUMBER = '+254722456252';

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EYA-${timestamp}-${random}`;
}

function generateWhatsAppMessage(items: { product: { name: string; price: number }; quantity: number }[], subtotal: number): string {
  const orderId = generateOrderId();
  const date = new Date();
  const dateStr = date.toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const lines = [
    `🛒 *EYARASTORE*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    '',
    `📋 *ORDER RECEIPT*`,
    '',
    `*Order ID:* ${orderId}`,
    `*Date:* ${dateStr}`,
    `*Time:* ${timeStr}`,
    '',
    `━━━━━━━━━━━━━━━━━━━━`,
    `📦 *ORDER DETAILS*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    '',
  ];

  items.forEach((item, index) => {
    lines.push(`*${index + 1}.* ${item.product.name}`);
    lines.push(`    Qty: ${item.quantity} × ${formatPrice(item.product.price)}`);
    lines.push(`    Line Total: ${formatPrice(item.product.price * item.quantity)}`);
    lines.push('');
  });

  lines.push(`━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`💰 *ORDER SUMMARY*`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━`);
  lines.push('');
  lines.push(`Items (${totalItems}): ${formatPrice(subtotal)}`);
  lines.push(`*TOTAL: ${formatPrice(subtotal)}*`);
  lines.push('');
  lines.push(`━━━━━━━━━━━━━━━━━━━━`);
  lines.push('');
  lines.push(`📞 *NEXT STEPS*`);
  lines.push('');
  lines.push(`Our team will contact you shortly to confirm:`);
  lines.push(`• Shipping method & delivery address`);
  lines.push(`• Payment options (M-Pesa, Bank Transfer)`);
  lines.push(`• Estimated delivery time`);
  lines.push('');
  lines.push(`Thank you for shopping with Eyarastore! 🙏`);

  return lines.join('\n');
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount, clearCart } = useCart();
  const { navigate } = useRouter();

  const handleCheckout = () => {
    const message = generateWhatsAppMessage(items, subtotal);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    closeCart();
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
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-4">
                  <button
                    onClick={() => {
                      closeCart();
                      navigate(`/product/${item.product.slug}`);
                    }}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover bg-cream-100"
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base text-ink-700 font-medium leading-snug truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-sage-500 mt-0.5">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-sage-300">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-ink-600 hover:bg-cream-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm text-ink-700">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-ink-600 hover:bg-cream-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-sage-400 hover:text-bronze-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-ink-700">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-sage-200 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm tracking-wide text-ink-500 uppercase">Subtotal</span>
              <span className="font-serif text-2xl text-ink-700 font-medium">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-sage-500">Shipping & payment details discussed via WhatsApp.</p>
            <button onClick={handleCheckout} className="btn-bronze w-full">
              <MessageCircle size={18} />
              Order via WhatsApp
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
