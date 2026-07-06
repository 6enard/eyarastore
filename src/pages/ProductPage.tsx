import { useState } from 'react';
import { ShoppingBag, Minus, Plus, ChevronRight, Check, Truck, RefreshCw, Shield } from 'lucide-react';
import { useProduct, useRelatedProducts } from '../hooks/useData';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import { formatPrice } from '../lib/format';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';

export default function ProductPage({ slug }: { slug: string }) {
  const { product, loading, error } = useProduct(slug);
  const { products: related, loading: relatedLoading } = useRelatedProducts(product);
  const { addItem } = useCart();
  const { navigate } = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (loading) {
    return (
      <div className="container-lux py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-[4/5] skeleton" />
          <div className="space-y-4">
            <div className="h-4 w-24 skeleton" />
            <div className="h-8 w-3/4 skeleton" />
            <div className="h-4 w-32 skeleton" />
            <div className="h-6 w-24 skeleton" />
            <div className="h-24 w-full skeleton" />
            <div className="h-12 w-full skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-lux py-20 text-center">
        <p className="font-serif text-2xl text-ink-700 mb-2">Product not found</p>
        <p className="text-sm text-sage-500 mb-6">The item you're looking for may have been removed.</p>
        <button onClick={() => navigate('/shop')} className="btn-outline">
          Back to Shop
        </button>
      </div>
    );
  }

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const galleryImages = [product.image_url, ...(product.gallery || [])];

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-sage-200">
        <div className="container-lux py-4">
          <nav className="flex items-center gap-2 text-xs tracking-wide text-sage-500">
            <button onClick={() => navigate('/')} className="hover:text-bronze-500 transition-colors">Home</button>
            <ChevronRight size={12} />
            <button onClick={() => navigate('/shop')} className="hover:text-bronze-500 transition-colors">Shop</button>
            {product.category && (
              <>
                <ChevronRight size={12} />
                <button
                  onClick={() => navigate(`/shop/${product.category!.slug}`)}
                  className="hover:text-bronze-500 transition-colors"
                >
                  {product.category.name}
                </button>
              </>
            )}
            <ChevronRight size={12} />
            <span className="text-ink-600 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product detail */}
      <div className="container-lux py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="aspect-[4/5] overflow-hidden bg-cream-100 mb-4">
              <img
                src={galleryImages[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover animate-fade-in"
                key={activeImage}
              />
            </div>
            {galleryImages.length > 1 && (
              <div className="flex gap-3">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-24 overflow-hidden bg-cream-100 transition-all ${
                      activeImage === i
                        ? 'ring-2 ring-bronze-500 ring-offset-2 ring-offset-cream-50'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:pt-4">
            {product.category && (
              <p className="eyebrow mb-3">{product.category.name}</p>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink-700 font-light mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={product.rating} size={16} />
              <span className="text-sm text-sage-500">
                {product.rating} ({product.review_count} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl text-ink-700 font-medium">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-sage-400 line-through">
                    {formatPrice(product.compare_at_price as number)}
                  </span>
                  <span className="bg-bronze-500 text-cream-50 text-xs font-medium tracking-widest uppercase px-2.5 py-1">
                    Save {formatPrice((product.compare_at_price as number) - product.price)}
                  </span>
                </>
              )}
            </div>

            <p className="text-ink-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-6">
              {product.in_stock ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-600" />
                  <span className="text-sm text-ink-600">In Stock</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-ink-600">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-sage-300 self-start">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-ink-600 hover:bg-cream-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-ink-700 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-ink-600 hover:bg-cream-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {added ? (
                  <>
                    <Check size={18} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-sage-200">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={20} className="text-bronze-500" strokeWidth={1.5} />
                <p className="text-xs text-ink-600">Free shipping over KES 20,000</p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw size={20} className="text-bronze-500" strokeWidth={1.5} />
                <p className="text-xs text-ink-600">30-day returns</p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield size={20} className="text-bronze-500" strokeWidth={1.5} />
                <p className="text-xs text-ink-600">Secure checkout</p>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-6">
                <p className="text-xs tracking-widest uppercase text-sage-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 text-xs tracking-wide capitalize bg-cream-100 text-ink-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {!relatedLoading && related.length > 0 && (
        <section className="py-16 lg:py-20 bg-cream-100">
          <div className="container-lux">
            <div className="text-center mb-10">
              <p className="eyebrow mb-3">You May Also Like</p>
              <h2 className="section-title">Complete the Look</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
