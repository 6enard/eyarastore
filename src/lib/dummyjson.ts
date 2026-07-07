const API_BASE = 'https://dummyjson.com';

export interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

export interface DummyJsonProductsResponse {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface DummyJsonCategory {
  slug: string;
  name: string;
  url: string;
}

export interface TransformedProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  gallery: string[];
  category_id: string | null;
  demographic: 'men' | 'women' | 'kids' | 'unisex';
  product_type: 'clothes' | 'shoes' | 'accessories';
  rating: number;
  review_count: number;
  featured: boolean;
  in_stock: boolean;
  tags: string[];
  created_at: string;
}

export interface TransformedCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

const CATEGORY_MAPPINGS: Record<string, { demographic: TransformedProduct['demographic']; product_type: TransformedProduct['product_type'] }> = {
  // Men's categories
  'mens-shirts': { demographic: 'men', product_type: 'clothes' },
  'mens-watches': { demographic: 'men', product_type: 'accessories' },
  'mens-shoes': { demographic: 'men', product_type: 'shoes' },
  // Women's categories
  'womens-dresses': { demographic: 'women', product_type: 'clothes' },
  'womens-bags': { demographic: 'women', product_type: 'accessories' },
  'womens-jewellery': { demographic: 'women', product_type: 'accessories' },
  'womens-shoes': { demographic: 'women', product_type: 'shoes' },
  'tops': { demographic: 'women', product_type: 'clothes' },
  // Kids/Unisex categories
  'skin-care': { demographic: 'unisex', product_type: 'accessories' },
  'fragrances': { demographic: 'unisex', product_type: 'accessories' },
  'beauty': { demographic: 'women', product_type: 'accessories' },
  // Accessories and other
  'sunglasses': { demographic: 'unisex', product_type: 'accessories' },
  'smartphones': { demographic: 'unisex', product_type: 'accessories' },
  'laptops': { demographic: 'unisex', product_type: 'accessories' },
  'tablets': { demographic: 'unisex', product_type: 'accessories' },
  'mobile-accessories': { demographic: 'unisex', product_type: 'accessories' },
  'groceries': { demographic: 'unisex', product_type: 'accessories' },
  'home-decoration': { demographic: 'unisex', product_type: 'accessories' },
  'furniture': { demographic: 'unisex', product_type: 'accessories' },
  'kitchen-accessories': { demographic: 'unisex', product_type: 'accessories' },
  'vehicle': { demographic: 'unisex', product_type: 'accessories' },
  'motorcycle': { demographic: 'unisex', product_type: 'accessories' },
  'sports-accessories': { demographic: 'unisex', product_type: 'accessories' },
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

function getCategoryMapping(category: string): { demographic: TransformedProduct['demographic']; product_type: TransformedProduct['product_type'] } {
  return CATEGORY_MAPPINGS[category] || { demographic: 'unisex', product_type: 'accessories' };
}

export function transformProduct(product: DummyJsonProduct): TransformedProduct {
  const category = product.category || 'other';
  const { demographic, product_type } = getCategoryMapping(category);
  const hasDiscount = product.discountPercentage > 0;
  const comparePrice = hasDiscount ? Math.round(product.price / (1 - product.discountPercentage / 100)) : null;

  return {
    id: product.id.toString(),
    name: product.title,
    slug: slugify(product.title) + '-' + product.id,
    description: product.description,
    price: Math.round(product.price),
    compare_at_price: comparePrice,
    image_url: product.thumbnail || product.images[0] || '',
    gallery: product.images.slice(0, 4),
    category_id: category,
    demographic,
    product_type,
    rating: Math.min(5, Math.max(0, product.rating)),
    review_count: product.reviews?.length || 0,
    featured: product.rating >= 4.5,
    in_stock: product.stock > 0 && product.availabilityStatus !== 'out-of-stock',
    tags: product.tags || [],
    created_at: product.meta?.createdAt || new Date().toISOString(),
  };
}

export async function fetchAllProducts(): Promise<TransformedProduct[]> {
  const limit = 100;
  let skip = 0;
  let allProducts: DummyJsonProduct[] = [];
  let total = 0;

  do {
    const response = await fetch(`${API_BASE}/products?limit=${limit}&skip=${skip}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data: DummyJsonProductsResponse = await response.json();
    allProducts = allProducts.concat(data.products);
    total = data.total;
    skip += limit;
  } while (skip < total);

  return allProducts.map(transformProduct);
}

export async function fetchProductById(id: number): Promise<TransformedProduct | null> {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }
  const product: DummyJsonProduct = await response.json();
  return transformProduct(product);
}

export async function fetchProductsByCategory(category: string): Promise<TransformedProduct[]> {
  const response = await fetch(`${API_BASE}/products/category/${category}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products by category: ${response.statusText}`);
  }
  const data: DummyJsonProductsResponse = await response.json();
  return data.products.map(transformProduct);
}

export async function fetchCategories(): Promise<TransformedCategory[]> {
  const response = await fetch(`${API_BASE}/products/categories`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  const categories: DummyJsonCategory[] = await response.json();
  return categories.map((cat, index) => ({
    id: cat.slug,
    name: cat.name || cat.slug,
    slug: cat.slug,
    description: null,
    image_url: null,
    sort_order: index,
    created_at: new Date().toISOString(),
  }));
}

export async function searchProducts(query: string): Promise<TransformedProduct[]> {
  const response = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(`Failed to search products: ${response.statusText}`);
  }
  const data: DummyJsonProductsResponse = await response.json();
  return data.products.map(transformProduct);
}
