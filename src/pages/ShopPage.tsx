import { useState, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronRight } from 'lucide-react';
import { useProducts } from '../hooks/useData';
import { useData } from '../context/DataContext';
import { useRouter } from '../context/RouterContext';
import ProductCard from '../components/ProductCard';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating';

export default function ShopPage({ categorySlug, subSlug }: { categorySlug?: string; subSlug?: string }) {
  const { navigate } = useRouter();
  const { categories } = useData();

  // Resolve the active category/sub from slugs
  const mainCategories = useMemo(() => categories.filter((c) => !c.parent_id), [categories]);
  const activeMain = useMemo(
    () => mainCategories.find((c) => c.slug === categorySlug) || null,
    [mainCategories, categorySlug],
  );
  const activeSub = useMemo(() => {
    if (!activeMain || !subSlug) return null;
    return categories.find((c) => c.parent_id === activeMain.id && c.slug === subSlug) || null;
  }, [categories, activeMain, subSlug]);

  // When a main category is selected, also include products in its sub-categories.
  const mainAndSubIds = useMemo(() => {
    if (!activeMain) return [];
    const ids = [activeMain.id];
    categories.forEach((c) => {
      if (c.parent_id === activeMain.id) ids.push(c.id);
    });
    return ids;
  }, [activeMain, categories]);

  const { products, loading } = useProducts(
    activeSub ? { categoryId: activeSub.id } : activeMain ? {} : {},
  );

  const [sort, setSort] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // All products scoped to this view (main + its subs when only main is selected)
  const scopedProducts = useMemo(() => {
    if (activeSub) return products.filter((p) => p.category_id === activeSub.id);
    if (activeMain) return products.filter((p) => mainAndSubIds.includes(p.category_id || ''));
    return products;
  }, [products, activeSub, activeMain, mainAndSubIds]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    scopedProducts.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [scopedProducts]);

  const filtered = useMemo(() => {
    let result = scopedProducts.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    if (selectedTags.length > 0) {
      result = result.filter((p) => selectedTags.some((tag) => p.tags?.includes(tag)));
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
  }, [scopedProducts, priceRange, selectedTags, sort]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 50000]);
    setSelectedTags([]);
  };

  const hasActiveFilters = priceRange[0] !== 0 || priceRange[1] !== 50000 || selectedTags.length > 0;

  const subsOfActive = activeMain ? categories.filter((c) => c.parent_id === activeMain.id) : [];

  const getPageTitle = () => {
    if (activeSub) return activeSub.name;
    if (activeMain) return activeMain.name;
    return 'All Products';
  };

  const getPageEyebrow = () => {
    if (activeMain) return `Shop ${activeMain.name}`;
    return 'The Collection';
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-sage-200 bg-cream-50">
        <div className="container-lux py-4">
          <nav className="flex items-center gap-2 text-xs tracking-wide text-sage-500">
            <button onClick={() => navigate('/')} className="hover:text-bronze-500 transition-colors">Home</button>
            <ChevronRight size={12} />
            <button onClick={() => navigate('/shop')} className="hover:text-bronze-500 transition-colors">Shop</button>
            {activeMain && (
              <>
                <ChevronRight size={12} />
                <button
                  onClick={() => navigate(`/shop/${activeMain.slug}`)}
                  className="hover:text-bronze-500 transition-colors"
                >
                  {activeMain.name}
                </button>
              </>
            )}
            {activeSub && (
              <>
                <ChevronRight size={12} />
                <span className="text-ink-600 truncate">{activeSub.name}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Page header */}
      <div className="bg-cream-100 border-b border-sage-200">
        <div className="container-lux py-12 lg:py-16 text-center">
          <p className="eyebrow mb-3">{getPageEyebrow()}</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-ink-700 font-light">
            {getPageTitle()}
          </h1>
          {activeMain?.description && (
            <p className="text-ink-500 mt-4 max-w-xl mx-auto leading-relaxed">
              {activeMain.description}
            </p>
          )}
        </div>
      </div>

      {/* Main category pills */}
      <div className="border-b border-sage-200">
        <div className="container-lux py-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => navigate('/shop')}
              className={`px-4 py-2 text-xs tracking-widest uppercase whitespace-nowrap transition-colors ${
                !categorySlug ? 'bg-ink-700 text-cream-100' : 'text-ink-500 hover:text-bronze-500'
              }`}
            >
              All
            </button>
            {mainCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/shop/${cat.slug}`)}
                className={`px-4 py-2 text-xs tracking-widest uppercase whitespace-nowrap transition-colors ${
                  categorySlug === cat.slug && !subSlug
                    ? 'bg-ink-700 text-cream-100'
                    : categorySlug === cat.slug
                      ? 'text-bronze-500 border border-bronze-400'
                      : 'text-ink-500 hover:text-bronze-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-category secondary nav (only when a main category is selected) */}
      {activeMain && subsOfActive.length > 0 && (
        <div className="border-b border-sage-100 bg-cream-50">
          <div className="container-lux py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <span className="text-xs text-sage-500 uppercase tracking-widest mr-2">Sub:</span>
              <button
                onClick={() => navigate(`/shop/${activeMain.slug}`)}
                className={`px-3 py-1.5 text-xs tracking-wide whitespace-nowrap transition-colors ${
                  !subSlug
                    ? 'bg-bronze-500 text-cream-50'
                    : 'text-ink-500 hover:text-bronze-500 border border-sage-200'
                }`}
              >
                All {activeMain.name}
              </button>
              {subsOfActive.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => navigate(`/shop/${activeMain.slug}/${sub.slug}`)}
                  className={`px-3 py-1.5 text-xs tracking-wide whitespace-nowrap transition-colors ${
                    subSlug === sub.slug
                      ? 'bg-bronze-500 text-cream-50'
                      : 'text-ink-500 hover:text-bronze-500 border border-sage-200'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container-lux py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-bronze-500 transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-bronze-500" />}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
                <div className="h-4 w-32 skeleton mb-2" />
                <div className="h-4 w-16 skeleton" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-serif text-2xl text-ink-700 mb-2">No products found</p>
            <p className="text-sm text-sage-500 mb-6">
              {activeMain
                ? 'There are no products in this category yet.'
                : 'Try adjusting your filters.'}
            </p>
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
