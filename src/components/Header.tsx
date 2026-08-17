import { useEffect, useState, useRef } from 'react';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

export default function Header() {
  const { route, navigate } = useRouter();
  const { itemCount, openCart } = useCart();
  const { categories } = useData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Main categories = those without a parent_id. Sub categories grouped by parent.
  const mainCategories = categories.filter((c) => !c.parent_id);
  const subCategoriesOf = (parentId: string) => categories.filter((c) => c.parent_id === parentId);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [route]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCategoryActive = (slug: string, subSlug?: string) => {
    if (route.name !== 'shop') return false;
    if (subSlug) return route.categorySlug === slug && route.subSlug === subSlug;
    return route.categorySlug === slug && !route.subSlug;
  };

  const isShopActive = route.name === 'shop';

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink-700 text-cream-100 text-center py-2.5 text-xs tracking-widest uppercase">
        Complimentary shipping on orders over KES 10,000
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-cream-50/95 backdrop-blur-md shadow-sm'
            : 'bg-cream-50'
        }`}
      >
        <div className="container-lux">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <button
              className="lg:hidden text-ink-700"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo + slogan */}
            <button
              onClick={() => navigate('/')}
              className="flex flex-col items-center text-center leading-none"
            >
              <span className="font-serif text-2xl sm:text-3xl text-ink-700 font-medium tracking-tight">
                Eyara<span className="text-bronze-500">store</span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-bronze-500 mt-0.5">
                Wear the Vibe, Own the Street
              </span>
            </button>

            {/* Desktop nav — dynamic main categories with sub dropdowns */}
            <nav className="hidden lg:flex items-center gap-7" ref={dropdownRef}>
              <button
                onClick={() => navigate('/shop')}
                className={`text-sm tracking-wide transition-colors relative py-1 ${
                  isShopActive && !route.categorySlug
                    ? 'text-bronze-500'
                    : 'text-ink-600 hover:text-bronze-500'
                }`}
              >
                All Products
                <span
                  className={`absolute -bottom-0.5 left-0 right-0 h-px bg-bronze-500 transition-transform duration-300 origin-left ${
                    isShopActive && !route.categorySlug ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>

              {mainCategories.map((cat) => {
                const subs = subCategoriesOf(cat.id);
                const hasSubs = subs.length > 0;
                return (
                  <div
                    key={cat.id}
                    className="relative"
                    onMouseEnter={() => hasSubs && setActiveDropdown(cat.slug)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      onClick={() => navigate(`/shop/${cat.slug}`)}
                      className={`text-sm tracking-wide transition-colors relative py-1 flex items-center gap-1 ${
                        isCategoryActive(cat.slug)
                          ? 'text-bronze-500'
                          : 'text-ink-600 hover:text-bronze-500'
                      }`}
                    >
                      {cat.name}
                      {hasSubs && (
                        <ChevronDown
                          size={12}
                          className={`transition-transform duration-200 ${
                            activeDropdown === cat.slug ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                      <span
                        className={`absolute -bottom-0.5 left-0 right-0 h-px bg-bronze-500 transition-transform duration-300 origin-left ${
                          isCategoryActive(cat.slug) ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </button>

                    {hasSubs && (
                      <div
                        className={`absolute top-full left-0 mt-2 min-w-[180px] bg-cream-50 border border-sage-200 shadow-lg transition-all duration-200 ${
                          activeDropdown === cat.slug
                            ? 'opacity-100 translate-y-0 visible'
                            : 'opacity-0 -translate-y-2 invisible'
                        }`}
                      >
                        <button
                          onClick={() => navigate(`/shop/${cat.slug}`)}
                          className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            isCategoryActive(cat.slug)
                              ? 'text-bronze-500 bg-cream-100'
                              : 'text-ink-600 hover:bg-cream-100 hover:text-bronze-500'
                          }`}
                        >
                          All {cat.name}
                        </button>
                        <div className="border-t border-sage-100" />
                        {subs.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => navigate(`/shop/${cat.slug}/${sub.slug}`)}
                            className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                              isCategoryActive(cat.slug, sub.slug)
                                ? 'text-bronze-500 bg-cream-100'
                                : 'text-ink-600 hover:bg-cream-100 hover:text-bronze-500'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={openCart}
                className="relative text-ink-600 hover:text-bronze-500 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-bronze-500 text-cream-50 text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-sage-200 bg-cream-50 animate-fade-in">
            <div className="container-lux py-4">
              <button
                onClick={() => navigate('/shop')}
                className={`w-full text-left py-3 text-sm font-medium tracking-wide border-b border-sage-100 transition-colors ${
                  isShopActive && !route.categorySlug ? 'text-bronze-500' : 'text-ink-600'
                }`}
              >
                All Products
              </button>

              {mainCategories.map((cat) => {
                const subs = subCategoriesOf(cat.id);
                return (
                  <div key={cat.id} className="border-b border-sage-100">
                    <button
                      onClick={() => navigate(`/shop/${cat.slug}`)}
                      className={`w-full text-left py-3 text-sm font-medium tracking-wide transition-colors ${
                        isCategoryActive(cat.slug) ? 'text-bronze-500' : 'text-ink-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                    {subs.length > 0 && (
                      <div className="pb-3 pl-4 flex flex-col gap-2">
                        {subs.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => navigate(`/shop/${cat.slug}/${sub.slug}`)}
                            className={`text-left text-xs tracking-wide transition-colors ${
                              isCategoryActive(cat.slug, sub.slug)
                                ? 'text-bronze-500'
                                : 'text-sage-500 hover:text-bronze-500'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
