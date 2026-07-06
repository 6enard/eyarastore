import { Instagram, Facebook, Twitter, Mail, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useCategories } from '../hooks/useData';

export default function Footer() {
  const { navigate } = useRouter();
  const { categories } = useCategories();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-ink-700 text-cream-100 mt-24">
      {/* Newsletter */}
      <div className="border-b border-ink-600/50">
        <div className="container-lux py-16">
          <div className="max-w-2xl mx-auto text-center">
            <p className="eyebrow text-cream-300 mb-3">Join the list</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light mb-4">
              Receive 10% off your first order
            </h2>
            <p className="text-cream-200/70 text-sm mb-8 leading-relaxed">
              Be the first to know about new arrivals, exclusive offers, and stories from our makers.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="flex-1 px-4 py-3.5 bg-transparent border border-ink-500 text-cream-100 placeholder-cream-200/40 focus:outline-none focus:border-bronze-400 transition-colors text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-bronze-500 text-cream-50 font-medium tracking-widest text-xs uppercase transition-colors hover:bg-bronze-600"
              >
                {subscribed ? 'Thank You' : 'Subscribe'}
                {!subscribed && <ArrowRight size={14} />}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container-lux py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <button
              onClick={() => navigate('/')}
              className="font-serif text-2xl text-cream-100 font-medium tracking-tight mb-4 block"
            >
              Eyara<span className="text-bronze-400">store</span>
            </button>
            <p className="text-cream-200/60 text-sm leading-relaxed max-w-xs">
              A curated collection of premium lifestyle products, thoughtfully designed and crafted to last.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-cream-300 mb-5">Shop</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => navigate('/shop')} className="text-sm text-cream-200/70 hover:text-bronze-400 transition-colors">
                  All Products
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate(`/shop/${cat.slug}`)}
                    className="text-sm text-cream-200/70 hover:text-bronze-400 transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-cream-300 mb-5">Company</h3>
            <ul className="space-y-3">
              <li><button onClick={() => navigate('/about')} className="text-sm text-cream-200/70 hover:text-bronze-400 transition-colors">About Us</button></li>
              <li><button onClick={() => navigate('/contact')} className="text-sm text-cream-200/70 hover:text-bronze-400 transition-colors">Contact</button></li>
              <li><button className="text-sm text-cream-200/70 hover:text-bronze-400 transition-colors">Shipping & Returns</button></li>
              <li><button className="text-sm text-cream-200/70 hover:text-bronze-400 transition-colors">Privacy Policy</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-cream-300 mb-5">Follow Us</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-ink-500 hover:border-bronze-400 hover:text-bronze-400 transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-ink-500 hover:border-bronze-400 hover:text-bronze-400 transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-ink-500 hover:border-bronze-400 hover:text-bronze-400 transition-colors" aria-label="Twitter">
                <Twitter size={16} />
              </a>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm text-cream-200/70">
              <Mail size={14} />
              <a href="mailto:hello@eyarastore.com" className="hover:text-bronze-400 transition-colors">
                hello@eyarastore.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-600/50">
        <div className="container-lux py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream-200/50 tracking-wide">
            © {new Date().getFullYear()} Eyarastore. All rights reserved.
          </p>
          <p className="text-xs text-cream-200/50 tracking-wide">
            Crafted with care for the discerning.
          </p>
        </div>
      </div>
    </footer>
  );
}
