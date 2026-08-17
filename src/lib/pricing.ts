import type { Product, ProductVariant } from '../hooks/useData';

/**
 * Returns true if a scheduled sale is currently active given the sale fields.
 * A sale is active when sale_price is set and now is within [start, end]
 * (a NULL bound means unbounded on that side).
 */
export function isSaleActive(
  salePrice: number | null | undefined,
  saleStartAt: string | null | undefined,
  saleEndAt: string | null | undefined,
): boolean {
  if (salePrice == null || salePrice < 0) return false;
  const now = Date.now();
  if (saleStartAt && now < new Date(saleStartAt).getTime()) return false;
  if (saleEndAt && now > new Date(saleEndAt).getTime()) return false;
  return true;
}

/** Effective price for a product, honouring scheduled product-level sales. */
export function effectiveProductPrice(
  product: Pick<Product, 'price' | 'sale_price' | 'sale_start_at' | 'sale_end_at'>,
): number {
  return isSaleActive(product.sale_price, product.sale_start_at, product.sale_end_at)
    ? (product.sale_price as number)
    : product.price;
}

/** Effective price for a variant, honouring scheduled variant-level sales + price override. */
export function effectiveVariantPrice(
  variant: Pick<ProductVariant, 'price_override' | 'sale_price' | 'sale_start_at' | 'sale_end_at'>,
  fallbackPrice: number,
): number {
  const base = variant.price_override != null ? variant.price_override : fallbackPrice;
  return isSaleActive(variant.sale_price, variant.sale_start_at, variant.sale_end_at)
    ? (variant.sale_price as number)
    : base;
}

/**
 * Returns the effective price + the original (compare) price to show struck-through.
 * Only shows a compare price when a sale is actually live (so sale badges/struck
 * prices disappear automatically once the sale window ends).
 */
export function productPricing(product: Product): {
  price: number;
  compareAt: number | null;
  onSale: boolean;
  discountPercent: number;
} {
  const onSale = isSaleActive(product.sale_price, product.sale_start_at, product.sale_end_at);
  const price = onSale ? (product.sale_price as number) : product.price;
  // Show the regular price as the compare-at when a sale is live; otherwise
  // honour an explicit compare_at_price set by the admin.
  const compareAt = onSale ? product.price : product.compare_at_price ?? null;
  const discountPercent =
    compareAt != null && compareAt > price
      ? Math.round((1 - price / compareAt) * 100)
      : 0;
  return { price, compareAt, onSale, discountPercent };
}

export function variantPricing(
  variant: ProductVariant,
  product: Product,
): {
  price: number;
  compareAt: number | null;
  onSale: boolean;
  discountPercent: number;
} {
  const base = variant.price_override != null ? variant.price_override : product.price;
  const onSale = isSaleActive(variant.sale_price, variant.sale_start_at, variant.sale_end_at);
  const price = onSale ? (variant.sale_price as number) : base;
  const compareAt = onSale ? base : product.compare_at_price ?? null;
  const discountPercent =
    compareAt != null && compareAt > price
      ? Math.round((1 - price / compareAt) * 100)
      : 0;
  return { price, compareAt, onSale, discountPercent };
}
