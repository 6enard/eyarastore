import { useEffect, useState } from 'react';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { useCategories } from '../hooks/useData';

export default function Header() {
  const { route, navigate } = useRouter();
  const { itemCount, openCart } = useCart();
  const { categories } = useCategories();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [route]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    ...categories.map((c) => ({ label: c.name, path: `/shop/${c.slug}` })),
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return route.name === 'home';
    if (path === '/shop') return route.name === 'shop' && !route.category;
    if (path.startsWith('/shop/')) return route.name === 'shop' && route.category === path.split('/')[2];
    if (path === '/about') return route.name === 'about';
    if (path === '/contact') return route.name === 'contact';
    return false;
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
            <div className="container-lux py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`text-left py-3 text-sm tracking-wide border-b border-sage-100 last:border-0 transition-colors ${
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
