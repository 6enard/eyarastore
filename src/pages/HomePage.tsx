import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useProducts } from '../hooks/useData';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const { navigate } = useRouter();
  const { categories } = useData();
  const { products: featuredProducts } = useProducts({ featuredOnly: true, limit: 8 });
  const { products: newProducts } = useProducts({ limit: 8 });

  const mainCategories = categories.filter((c) => !c.parent_id).slice(0, 4);

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On all orders over KES 10,000' },
    { icon: RefreshCw, title: '48h Exchanges', desc: 'Size & color exchanges' },
    { icon: Shield, title: 'Secure Payment', desc: 'Encrypted checkout' },
    { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer care' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-ink-700">
        <div className="absolute inset-0">
          <img
            src="https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/1.webp"
            alt="Eyarastore hero"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/80 via-ink-800/40 to-transparent" />
        </div>

        <div className="relative h-full container-lux flex items-center">
          <div className="max-w-xl">
            <p className="eyebrow text-cream-300 mb-5 animate-fade-up opacity-0" style={{ animationDelay: '200ms' }}>
              New Collection — 2026
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-cream-100 font-light leading-[1.05] mb-4 animate-fade-up opacity-0" style={{ animationDelay: '350ms' }}>
              Wear the Vibe,<br />
              <span className="italic text-cream-200">Own the Street</span>
            </h1>
            <p className="text-bronze-300 text-sm tracking-[0.25em] uppercase mb-6 animate-fade-up opacity-0" style={{ animationDelay: '480ms' }}>
              Eyarastore — Stylish, affordable fashion for every age, every vibe, every day.
            </p>
            <p className="text-cream-200/80 text-lg leading-relaxed mb-8 max-w-md animate-fade-up opacity-0" style={{ animationDelay: '600ms' }}>
              Born on the streets, styled for you. Explore curated categories and find your look.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0" style={{ animationDelay: '750ms' }}>
              <button
                onClick={() => navigate('/shop')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cream-100 text-ink-700 font-medium tracking-widest text-sm uppercase transition-all duration-300 hover:bg-bronze-500 hover:text-cream-50"
              >
                Shop Now
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-cream-200/40 text-cream-100 font-medium tracking-widest text-sm uppercase transition-all duration-300 hover:bg-cream-100/10"
              >
                Our Story
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block">
          <div className="w-px h-12 bg-cream-200/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-cream-200 animate-[fadeIn_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-cream-100 border-b border-sage-200">
        <div className="container-lux py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 justify-center lg:justify-start">
                <feature.icon size={22} className="text-bronze-500 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium text-ink-700">{feature.title}</p>
                  <p className="text-xs text-sage-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="py-20 lg:py-28">
        <div className="container-lux">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Browse</p>
            <h2 className="section-title">Shop by Category</h2>
            <p className="text-ink-500 mt-4 max-w-xl mx-auto">
              Curated collections organized so you can find exactly what you're looking for.
            </p>
          </div>

          {mainCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sage-500 text-sm">No categories yet. Add categories in the admin panel to populate this section.</p>
              <button onClick={() => navigate('/admin')} className="btn-outline mt-4">
                Go to Admin
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {mainCategories.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/shop/${cat.slug}`)}
                  className="group relative aspect-[3/4] overflow-hidden bg-ink-700 animate-fade-up opacity-0"
                  style={{ animationDelay: `${i * 100}ms`}}
                >
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-full h-full object-cover opacity-70 transition-all duration-700 group-hover:opacity-50 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-ink-800">
                      <span className="font-serif text-4xl text-cream-200/30">{cat.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h3 className="font-serif text-2xl text-cream-100 font-medium mb-2">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-sm text-cream-200/70 mb-3 line-clamp-2">{cat.description}</p>
                    )}
                    <span className="flex items-center gap-1.5 text-cream-200/80 text-xs tracking-widest uppercase opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      Shop Now <ArrowRight size={12} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 lg:py-20 bg-cream-100">
          <div className="container-lux">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
              <div>
                <p className="eyebrow mb-3">Editor's Picks</p>
                <h2 className="section-title">Featured Products</h2>
              </div>
              <button
                onClick={() => navigate('/shop')}
                className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-ink-600 hover:text-bronze-500 transition-colors group"
              >
                View All
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
              {featuredProducts.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New arrivals */}
      {newProducts.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="container-lux">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
              <div>
                <p className="eyebrow mb-3">Just In</p>
                <h2 className="section-title">New Arrivals</h2>
              </div>
              <button
                onClick={() => navigate('/shop')}
                className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-ink-600 hover:text-bronze-500 transition-colors group"
              >
                View All
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
              {newProducts.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Editorial banner */}
      <section className="py-20 lg:py-28 bg-cream-100">
        <div className="container-lux">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative aspect-[4/3] overflow-hidden order-2 lg:order-1">
              <img
                src="https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp"
                alt="Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="eyebrow mb-4">Our Philosophy</p>
              <h2 className="section-title mb-6">
                Quality you<br />can feel
              </h2>
              <p className="text-ink-600 leading-relaxed mb-4">
                Every piece in our collection is selected for its quality, craftsmanship, and timeless design. From premium men's oxford shirts to elegant women's dresses, we ensure each item meets our exacting standards.
              </p>
              <p className="text-ink-600 leading-relaxed mb-8">
                Whether you're shopping for yourself or someone special, you'll find pieces that are made to last.
              </p>
              <button onClick={() => navigate('/about')} className="btn-outline">
                Read Our Story
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-16 lg:py-20 bg-ink-700 text-cream-100">
        <div className="container-lux text-center max-w-3xl mx-auto">
          <p className="eyebrow text-cream-300 mb-4">Wear the Vibe, Own the Street</p>
          <p className="font-serif text-2xl sm:text-3xl font-light leading-relaxed text-balance mb-8">
            We are more than just an online boutique; we are a community of individuals who refuse to blend into the background. Find your look. Wear the vibe, own the street.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-bronze-500 text-cream-50 font-medium tracking-widest text-sm uppercase transition-all duration-300 hover:bg-bronze-600"
          >
            Shop the Collection
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
