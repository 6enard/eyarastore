import { useEffect, useState, useRef } from 'react';
import { ShoppingBag, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';

const demographics = [
  { slug: 'men', name: 'Men' },
  { slug: 'women', name: 'Women' },
];

const productTypes = [
  { slug: 'clothes', name: 'Clothes' },
  { slug: 'shoes', name: 'Shoes' },
];

export default function Header() {
  const { route, navigate } = useRouter();
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return route.name === 'home';
    if (path === '/shop') return route.name === 'shop' && !route.demographic;
    if (path.startsWith('/shop/')) {
      const parts = path.split('/').filter(Boolean);
      if (parts.length === 2) {
        return route.name === 'shop' && route.demographic === parts[1] && !route.productType;
      }
      if (parts.length === 3) {
        return (
          route.name === 'shop' &&
          route.demographic === parts[1] &&
          route.productType === parts[2]
        );
      }
    }
    if (path === '/about') return route.name === 'about';
    if (path === '/contact') return route.name === 'contact';
    return false;
  };

  const isDemographicActive = (slug: string) => {
    return route.name === 'shop' && route.demographic === slug;
  };

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

            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="font-serif text-2xl sm:text-3xl text-ink-700 font-medium tracking-tight"
            >
              Eyara<span className="text-bronze-500">store</span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {/* Demographics with dropdown */}
              {demographics.map((demo) => (
                <div
                  key={demo.slug}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(demo.slug)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => navigate(`/shop/${demo.slug}`)}
                    className={`text-sm tracking-wide transition-colors relative py-1 flex items-center gap-1 ${
                      isDemographicActive(demo.slug)
                        ? 'text-bronze-500'
                        : 'text-ink-600 hover:text-bronze-500'
                    }`}
                  >
                    {demo.name}
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        activeDropdown === demo.slug ? 'rotate-180' : ''
                      }`}
                    />
                    <span
                      className={`absolute -bottom-0.5 left-0 right-0 h-px bg-bronze-500 transition-transform duration-300 origin-left ${
                        isDemographicActive(demo.slug) ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </button>

                  {/* Dropdown menu */}
                  <div
                    className={`absolute top-full left-0 mt-2 min-w-[160px] bg-cream-50 border border-sage-200 shadow-lg transition-all duration-200 ${
                      activeDropdown === demo.slug
                        ? 'opacity-100 translate-y-0 visible'
                        : 'opacity-0 -translate-y-2 invisible'
                    }`}
                  >
                    <button
                      onClick={() => navigate(`/shop/${demo.slug}`)}
                      className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        isActive(`/shop/${demo.slug}`)
                          ? 'text-bronze-500 bg-cream-100'
                          : 'text-ink-600 hover:bg-cream-100 hover:text-bronze-500'
                      }`}
                    >
                      All {demo.name}
                    </button>
                    <div className="border-t border-sage-100" />
                    {productTypes.map((type) => (
                      <button
                        key={type.slug}
                        onClick={() => navigate(`/shop/${demo.slug}/${type.slug}`)}
                        className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          isActive(`/shop/${demo.slug}/${type.slug}`)
                            ? 'text-bronze-500 bg-cream-100'
                            : 'text-ink-600 hover:bg-cream-100 hover:text-bronze-500'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Static nav links */}
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`text-sm tracking-wide transition-colors relative py-1 ${
                    isActive(link.path)
                      ? 'text-bronze-500'
                      : 'text-ink-600 hover:text-bronze-500'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 right-0 h-px bg-bronze-500 transition-transform duration-300 origin-left ${
                      isActive(link.path) ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                className="text-ink-600 hover:text-bronze-500 transition-colors hidden sm:block"
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
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
              {/* Demographics */}
              {demographics.map((demo) => (
                <div key={demo.slug} className="border-b border-sage-100">
                  <button
                    onClick={() => navigate(`/shop/${demo.slug}`)}
                    className={`w-full text-left py-3 text-sm font-medium tracking-wide transition-colors ${
                      isDemographicActive(demo.slug)
                        ? 'text-bronze-500'
                        : 'text-ink-600'
                    }`}
                  >
                    {demo.name}
                  </button>
                  <div className="pb-3 pl-4 flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/shop/${demo.slug}`)}
                      className={`text-left text-xs tracking-wide transition-colors ${
                        isActive(`/shop/${demo.slug}`)
                          ? 'text-bronze-500'
                          : 'text-sage-500 hover:text-bronze-500'
                      }`}
                    >
                      All {demo.name}
                    </button>
                    {productTypes.map((type) => (
                      <button
                        key={type.slug}
                        onClick={() => navigate(`/shop/${demo.slug}/${type.slug}`)}
                        className={`text-left text-xs tracking-wide transition-colors ${
                          isActive(`/shop/${demo.slug}/${type.slug}`)
                            ? 'text-bronze-500'
                            : 'text-sage-500 hover:text-bronze-500'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Static nav links */}
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`w-full text-left py-3 text-sm tracking-wide border-b border-sage-100 last:border-0 transition-colors ${
                    isActive(link.path)
                      ? 'text-bronze-500'
                      : 'text-ink-600 hover:text-bronze-500'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
