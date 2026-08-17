import type { Product } from '../hooks/useData';
import { useRouter } from '../context/RouterContext';
import { productPricing } from '../lib/pricing';
import { formatPrice } from '../lib/format';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { navigate } = useRouter();
  const { price, compareAt, onSale, discountPercent } = productPricing(product);

  return (
    <article
      className="group cursor-pointer animate-fade-up opacity-0"
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      <div className="relative overflow-hidden bg-cream-100 aspect-[4/5] mb-3">
        <img
          src={product.image_url || ''}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Sale / out-of-stock badge only */}
        {onSale && discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-bronze-500 text-cream-50 text-[10px] font-medium tracking-widest uppercase px-2.5 py-1">
            -{discountPercent}%
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute top-3 left-3 bg-ink-700 text-cream-100 text-[10px] font-medium tracking-widest uppercase px-2.5 py-1">
            Sold Out
          </span>
        )}
      </div>

      <h3 className="font-serif text-base sm:text-lg text-ink-700 font-medium leading-snug group-hover:text-bronze-600 transition-colors line-clamp-2">
        {product.name}
      </h3>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-sm text-ink-700 font-medium">{formatPrice(price)}</span>
        {onSale && compareAt != null && (
          <span className="text-xs text-sage-400 line-through">{formatPrice(compareAt)}</span>
        )}
      </div>
    </article>
  );
}
