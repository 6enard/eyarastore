import { ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export default function AboutPage() {
  const { navigate } = useRouter();

  const values = [
    { title: 'Quality First', desc: 'We source materials and partner with makers who meet our exacting standards for craftsmanship and durability.' },
    { title: 'Timeless Design', desc: 'We believe in objects that transcend trends — pieces designed to be used, loved, and passed down.' },
    { title: 'Responsible Sourcing', desc: 'From organic fibers to recycled metals, we prioritize materials that are kind to the planet and the people who make them.' },
    { title: 'Artisan Partnerships', desc: 'We work directly with small workshops and independent makers, ensuring fair wages and preserving traditional crafts.' },
  ];

  const stats = [
    { number: '500+', label: 'Products Curated' },
    { number: '12k+', label: 'Happy Customers' },
    { number: '40+', label: 'Artisan Partners' },
    { number: '4.8', label: 'Average Rating' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden bg-ink-700">
        <div className="absolute inset-0">
          <img
            src="https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/1.webp"
            alt="About Eyarastore"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-ink-800/30" />
        </div>
        <div className="relative h-full container-lux flex items-center">
          <div className="max-w-2xl">
            <p className="eyebrow text-cream-300 mb-4">Our Story</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream-100 font-light leading-tight">
              A passion for beautiful, lasting things
            </h1>
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="py-20 lg:py-28">
        <div className="container-lux">
          <div className="max-w-3xl mx-auto">
            <p className="font-serif text-2xl sm:text-3xl text-ink-700 font-light leading-relaxed mb-8 text-balance">
              Eyarastore began with a simple belief: that the objects we surround ourselves with should be beautiful, well-made, and built to last.
            </p>
            <div className="space-y-5 text-ink-600 leading-relaxed">
              <p>
                Founded in 2019, we set out to create a curated marketplace that celebrates craftsmanship and thoughtful design. We travel the world to find makers who share our obsession with quality — from handwoven textiles in Morocco to small-batch ceramics in Japan.
              </p>
              <p>
                Every product in our collection is chosen for its materials, its construction, and its story. We believe in fewer, better things — objects that earn their place in your home and your life, and that age gracefully with use.
              </p>
              <p>
                We're proud to partner with artisans who practice traditional techniques passed down through generations. By supporting these crafts, we help preserve skills that might otherwise be lost, and we bring you products with a soul that mass-produced goods simply can't match.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-cream-100 py-16 lg:py-20">
        <div className="container-lux">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-serif text-4xl lg:text-5xl text-bronze-500 font-light mb-2">{stat.number}</p>
                <p className="text-sm tracking-widest uppercase text-ink-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28">
        <div className="container-lux">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">What We Believe</p>
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-14">
            {values.map((value, i) => (
              <div key={i} className="border-l-2 border-bronze-400 pl-6">
                <h3 className="font-serif text-2xl text-ink-700 font-medium mb-3">{value.title}</h3>
                <p className="text-ink-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-ink-700 text-cream-100">
        <div className="container-lux text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-light mb-6">
            Discover something you'll treasure
          </h2>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cream-100 text-ink-700 font-medium tracking-widest text-sm uppercase transition-all duration-300 hover:bg-bronze-500 hover:text-cream-50"
          >
            Shop the Collection
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
