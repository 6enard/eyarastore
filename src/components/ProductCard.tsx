import { ShoppingBag, Eye } from 'lucide-react';
import type { ProductWithCategory } from '../types';
import { formatPrice } from '../lib/format';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import StarRating from './StarRating';

interface ProductCardProps {
  product: ProductWithCategory;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { navigate } = useRouter();

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / (product.compare_at_price as number)) * 100)
    : 0;

  return (
    <article
      className="group cursor-pointer animate-fade-up opacity-0"
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      <div className="relative overflow-hidden bg-cream-100 aspect-[4/5] mb-4">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-bronze-500 text-cream-50 text-[10px] font-medium tracking-widest uppercase px-2.5 py-1">
              -{discountPercent}%
            </span>
          )}
          {!product.in_stock && (
            <span className="bg-ink-700 text-cream-100 text-[10px] font-medium tracking-widest uppercase px-2.5 py-1">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 translate-y-[calc(100%+0.75rem)] opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.in_stock) addItem(product);
            }}
            disabled={!product.in_stock}
            className="flex-1 flex items-center justify-center gap-2 bg-ink-700/95 text-cream-100 py-3 text-xs font-medium tracking-widest uppercase backdrop-blur-sm transition-colors hover:bg-ink-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={14} />
            Add to Cart
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.slug}`);
            }}
            className="flex items-center justify-center w-12 bg-cream-50/95 text-ink-700 backdrop-blur-sm transition-colors hover:bg-cream-50"
            aria-label="Quick view"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-bronze-500">
            {product.demographic}'s
          </p>
          <span className="text-sage-300">|</span>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-sage-500">
            {product.product_type}
          </p>
        </div>
        <h3 className="font-serif text-lg text-ink-700 font-medium leading-snug group-hover:text-bronze-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} size={12} />
          <span className="text-xs text-sage-500">({product.review_count})</span>
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-ink-700 font-medium">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-sm text-sage-400 line-through">
              {formatPrice(product.compare_at_price as number)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
