import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useProducts, useCategories } from '../hooks/useData';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const { navigate } = useRouter();
  const { products, loading } = useProducts({ featuredOnly: true, limit: 8 });
  const { categories } = useCategories();

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On all orders over KES 20,000' },
    { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: Shield, title: 'Secure Payment', desc: 'Encrypted checkout' },
    { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer care' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-ink-700">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3800681/pexels-photo-3800681.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Eyarastore hero"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/80 via-ink-800/40 to-transparent" />
        </div>

        <div className="relative h-full container-lux flex items-center">
          <div className="max-w-xl">
            <p className="eyebrow text-cream-300 mb-5 animate-fade-up opacity-0" style={{ animationDelay: '200ms' }}>
              New Collection — Autumn 2025
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-cream-100 font-light leading-[1.05] mb-6 animate-fade-up opacity-0" style={{ animationDelay: '350ms' }}>
              Modern luxury,<br />
              <span className="italic text-cream-200">curated for you</span>
            </h1>
            <p className="text-cream-200/80 text-lg leading-relaxed mb-8 max-w-md animate-fade-up opacity-0" style={{ animationDelay: '500ms' }}>
              Discover a thoughtfully curated collection of premium lifestyle products, crafted by artisans and designed to elevate the everyday.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0" style={{ animationDelay: '650ms' }}>
              <button
                onClick={() => navigate('/shop')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cream-100 text-ink-700 font-medium tracking-widest text-sm uppercase transition-all duration-300 hover:bg-bronze-500 hover:text-cream-50"
              >
                Shop Collection
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

      {/* Categories */}
      <section className="py-20 lg:py-28">
        <div className="container-lux">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Browse by Category</p>
            <h2 className="section-title">Explore Our Collections</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/shop/${cat.slug}`)}
                className="group relative aspect-[3/4] overflow-hidden bg-ink-700 animate-fade-up opacity-0"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <img
                  src={cat.image_url || ''}
                  alt={cat.name}
                  className="w-full h-full object-cover opacity-70 transition-all duration-700 group-hover:opacity-50 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <h3 className="font-serif text-2xl text-cream-100 font-medium mb-2">{cat.name}</h3>
                  <span className="flex items-center gap-1.5 text-cream-200/80 text-xs tracking-widest uppercase opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    Shop Now <ArrowRight size={12} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20 lg:py-28 bg-cream-100">
        <div className="container-lux">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="eyebrow mb-3">Handpicked for You</p>
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

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="aspect-[4/5] skeleton mb-4" />
                  <div className="h-4 w-20 skeleton mb-2" />
                  <div className="h-5 w-32 skeleton mb-2" />
                  <div className="h-4 w-16 skeleton" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Editorial banner */}
      <section className="py-20 lg:py-28">
        <div className="container-lux">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative aspect-[4/3] overflow-hidden order-2 lg:order-1">
              <img
                src="https://images.pexels.com/photos/3755761/pexels-photo-3755761.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="eyebrow mb-4">Our Philosophy</p>
              <h2 className="section-title mb-6">
                Crafted with intention,<br />made to be treasured
              </h2>
              <p className="text-ink-600 leading-relaxed mb-4">
                Every piece in our collection is selected for its quality, craftsmanship, and timeless design. We partner with artisans and makers who share our commitment to materials that age beautifully and objects that last a lifetime.
              </p>
              <p className="text-ink-600 leading-relaxed mb-8">
                From handwoven textiles to small-batch ceramics, each product tells a story of skill, patience, and care.
              </p>
              <button onClick={() => navigate('/about')} className="btn-outline">
                Read Our Story
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 lg:py-28 bg-ink-700 text-cream-100">
        <div className="container-lux">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-bronze-400 text-2xl">★</span>
              ))}
            </div>
            <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light leading-relaxed italic mb-8 text-balance">
              "Eyarastore has become my go-to for thoughtful gifts and pieces for our home. The quality is exceptional, and everything arrives beautifully packaged."
            </blockquote>
            <div>
              <p className="font-medium text-cream-100">Eleanor Whitfield</p>
              <p className="text-sm text-cream-200/60 mt-1">Verified Customer</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
