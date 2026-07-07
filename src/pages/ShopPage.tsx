import { useState, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useProducts } from '../hooks/useData';
import { useRouter } from '../context/RouterContext';
import ProductCard from '../components/ProductCard';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating';

const demographics = [
  { slug: 'men', name: 'Men' },
  { slug: 'women', name: 'Women' },
];

const productTypes = [
  { slug: 'clothes', name: 'Clothes' },
  { slug: 'shoes', name: 'Shoes' },
];

export default function ShopPage({ demographic, productType }: { demographic?: string; productType?: string }) {
  const { navigate } = useRouter();
  const { products, loading } = useProducts({ demographic, productType });
  const [sort, setSort] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterDemographic, setFilterDemographic] = useState<string | null>(null);
  const [filterProductType, setFilterProductType] = useState<string | null>(null);

  const activeDemographic = demographics.find((d) => d.slug === demographic);
  const activeProductType = productTypes.find((p) => p.slug === productType);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.some((tag) => p.tags?.includes(tag))
      );
    }

    if (filterDemographic) {
      result = result.filter((p) => p.demographic === filterDemographic);
    }

    if (filterProductType) {
      result = result.filter((p) => p.product_type === filterProductType);
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [products, priceRange, selectedTags, filterDemographic, filterProductType, sort]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 20000]);
    setSelectedTags([]);
    setFilterDemographic(null);
    setFilterProductType(null);
  };

  const hasActiveFilters =
    priceRange[0] !== 0 ||
    priceRange[1] !== 20000 ||
    selectedTags.length > 0 ||
    filterDemographic !== null ||
    filterProductType !== null;

  const getPageTitle = () => {
    if (activeDemographic && activeProductType) {
      return `${activeDemographic.name}'s ${activeProductType.name}`;
    }
    if (activeDemographic) {
      return activeDemographic.name;
    }
    if (activeProductType) {
      return `${activeProductType.name}`;
    }
    return 'All Products';
  };

  const getPageEyebrow = () => {
    if (activeDemographic) {
      return `Shop ${activeDemographic.name}`;
    }
    return 'The Collection';
  };

  return (
    <div>
      {/* Page header */}
      <div className="bg-cream-100 border-b border-sage-200">
        <div className="container-lux py-12 lg:py-16 text-center">
          <p className="eyebrow mb-3">{getPageEyebrow()}</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-ink-700 font-light">
            {getPageTitle()}
          </h1>
          {activeDemographic?.slug && (
            <p className="text-ink-500 mt-4 max-w-xl mx-auto leading-relaxed">
              Discover our curated selection of premium {activeProductType?.name.toLowerCase() || 'products'} for {activeDemographic.name.toLowerCase()}.
            </p>
          )}
        </div>
      </div>

      {/* Demographic pills */}
      <div className="border-b border-sage-200">
        <div className="container-lux py-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => navigate('/shop')}
              className={`px-4 py-2 text-xs tracking-widest uppercase whitespace-nowrap transition-colors ${
                !demographic
                  ? 'bg-ink-700 text-cream-100'
                  : 'text-ink-500 hover:text-bronze-500'
              }`}
            >
              All
            </button>
            {demographics.map((demo) => (
              <button
                key={demo.slug}
                onClick={() => navigate(productType ? `/shop/${demo.slug}/${productType}` : `/shop/${demo.slug}`)}
                className={`px-4 py-2 text-xs tracking-widest uppercase whitespace-nowrap transition-colors ${
                  demographic === demo.slug
                    ? 'bg-ink-700 text-cream-100'
                    : 'text-ink-500 hover:text-bronze-500'
                }`}
              >
                {demo.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product type secondary nav */}
      <div className="border-b border-sage-100 bg-cream-50">
        <div className="container-lux py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-xs text-sage-500 uppercase tracking-widest mr-2">Type:</span>
            <button
              onClick={() => navigate(demographic ? `/shop/${demographic}` : '/shop')}
              className={`px-3 py-1.5 text-xs tracking-wide whitespace-nowrap transition-colors ${
                !productType
                  ? 'bg-bronze-500 text-cream-50'
                  : 'text-ink-500 hover:text-bronze-500 border border-sage-200'
              }`}
            >
              All
            </button>
            {productTypes.map((type) => (
              <button
                key={type.slug}
                onClick={() => navigate(demographic ? `/shop/${demographic}/${type.slug}` : `/shop/${type.slug}`)}
                className={`px-3 py-1.5 text-xs tracking-wide whitespace-nowrap transition-colors ${
                  productType === type.slug
                    ? 'bg-bronze-500 text-cream-50'
                    : 'text-ink-500 hover:text-bronze-500 border border-sage-200'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-lux py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-bronze-500 transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-bronze-500" />
            )}
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-sage-500 hidden sm:block">
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-cream-50 border border-sage-300 text-sm text-ink-700 focus:outline-none focus:border-bronze-400 transition-colors cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mb-8 p-6 bg-cream-100 border border-sage-200 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg text-ink-700">Refine</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-bronze-500 hover:text-bronze-600 tracking-wide uppercase"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Price range */}
              <div>
                <label className="label-lux">Price Range</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="input-lux w-24 text-sm"
                    min={0}
                  />
                  <span className="text-sage-400">—</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="input-lux w-24 text-sm"
                    min={0}
                  />
                </div>
              </div>

              {/* Demographic filter (only show on all products page) */}
              {!demographic && (
                <div>
                  <label className="label-lux">Demographic</label>
                  <div className="flex flex-wrap gap-2">
                    {demographics.map((demo) => (
                      <button
                        key={demo.slug}
                        onClick={() => setFilterDemographic(filterDemographic === demo.slug ? null : demo.slug)}
                        className={`px-3 py-1.5 text-xs tracking-wide capitalize transition-colors ${
                          filterDemographic === demo.slug
                            ? 'bg-ink-700 text-cream-100'
                            : 'bg-cream-50 text-ink-500 border border-sage-300 hover:border-bronze-400'
                        }`}
                      >
                        {demo.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product type filter (only show on all products page) */}
              {!productType && (
                <div>
                  <label className="label-lux">Product Type</label>
                  <div className="flex flex-wrap gap-2">
                    {productTypes.map((type) => (
                      <button
                        key={type.slug}
                        onClick={() => setFilterProductType(filterProductType === type.slug ? null : type.slug)}
                        className={`px-3 py-1.5 text-xs tracking-wide capitalize transition-colors ${
                          filterProductType === type.slug
                            ? 'bg-ink-700 text-cream-100'
                            : 'bg-cream-50 text-ink-500 border border-sage-300 hover:border-bronze-400'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {allTags.length > 0 && (
                <div>
                  <label className="label-lux">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 text-xs tracking-wide capitalize transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-ink-700 text-cream-100'
                            : 'bg-cream-50 text-ink-500 border border-sage-300 hover:border-bronze-400'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[4/5] skeleton mb-4" />
                <div className="h-4 w-20 skeleton mb-2" />
                <div className="h-5 w-32 skeleton mb-2" />
                <div className="h-4 w-16 skeleton" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-serif text-2xl text-ink-700 mb-2">No products found</p>
            <p className="text-sm text-sage-500 mb-6">Try adjusting your filters.</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-outline">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
