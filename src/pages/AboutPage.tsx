import { ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export default function AboutPage() {
  const { navigate } = useRouter();

  const beliefs = [
    { title: 'Every Age', desc: 'Timeless classics mixed with fresh, modern trends.' },
    { title: 'Every Vibe', desc: 'From sleek office professionalism to effortless street casual.' },
    { title: 'Every Day', desc: 'Comfortable, durable fabrics made for real life.' },
  ];

  const stats = [
    { number: '500+', label: 'Products Curated' },
    { number: '12k+', label: 'Happy Customers' },
    { number: '4.8', label: 'Average Rating' },
    { number: '48h', label: 'Exchange Window' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden bg-ink-700">
        <div className="absolute inset-0">
          <img
            src="https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/1.webp"
            alt="The Eyara Story"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 to-ink-800/30" />
        </div>
        <div className="relative h-full container-lux flex items-center">
          <div className="max-w-2xl">
            <p className="eyebrow text-cream-300 mb-4">Our Story</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream-100 font-light leading-tight">
              Born on the Streets,<br />
              <span className="italic text-cream-200">Styled for Your Vibe</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="py-20 lg:py-28">
        <div className="container-lux">
          <div className="max-w-3xl mx-auto">
            <p className="font-serif text-2xl sm:text-3xl text-ink-700 font-light leading-relaxed mb-8 text-balance">
              The street isn't just a pathway from point A to point B — it's a runway, a canvas, and a reflection of who you are.
            </p>
            <div className="space-y-5 text-ink-600 leading-relaxed">
              <p>
                Eyara Store Limited started with a simple observation: fashion is too often divided. On one side, you have high-end streetwear that costs a fortune. On the other, you have affordable everyday wear that lacks personality. We wondered: <em>Why should you have to choose between your budget and your vibe?</em>
              </p>
              <p>
                We set out to bridge that gap. We wanted to build a space where fashion meets reality. Whether you are stepping into a high-stakes board meeting, crushing a workout at the gym, chilling in premium loungewear on a Sunday, or stepping out for a night in the city — your outfit should tell your story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote band */}
      <section className="bg-cream-100 py-16 lg:py-20">
        <div className="container-lux">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-serif text-2xl sm:text-3xl text-ink-700 font-light italic leading-relaxed text-balance">
              "Fashion isn't just about what you wear. It's about how you feel when you step out the door."
            </p>
          </div>
        </div>
      </section>

      {/* What We Believe */}
      <section className="py-20 lg:py-28">
        <div className="container-lux">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">What We Believe</p>
            <h2 className="section-title">Versatility Without Limits</h2>
            <p className="text-ink-500 mt-4 max-w-xl mx-auto">
              At Eyara, we don't believe in limiting your style. We believe in versatility. Our collections are carefully curated to fit:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-14">
            {beliefs.map((belief, i) => (
              <div key={i} className="border-l-2 border-bronze-400 pl-6">
                <h3 className="font-serif text-2xl text-ink-700 font-medium mb-3">{belief.title}</h3>
                <p className="text-ink-600 leading-relaxed">{belief.desc}</p>
              </div>
            ))}
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

      {/* Wear the Vibe, Own the Street */}
      <section className="py-20 lg:py-28">
        <div className="container-lux">
          <div className="max-w-3xl mx-auto">
            <p className="eyebrow mb-3">Wear the Vibe, Own the Street</p>
            <h2 className="section-title mb-6">More Than a Boutique</h2>
            <div className="space-y-5 text-ink-600 leading-relaxed">
              <p>
                We are more than just an online boutique; we are a community of individuals who refuse to blend into the background. When you shop with us, you aren't just buying clothes — you are claiming your confidence.
              </p>
              <p>
                We've made the shopping experience seamless, affordable, and exciting, so you can spend less time scrolling and more time turning heads.
              </p>
              <p className="font-serif text-xl text-ink-700 italic">
                So, go ahead. Find your look. Wear the vibe, own the street.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 lg:py-20 bg-ink-700 text-cream-100">
        <div className="container-lux text-center max-w-3xl mx-auto">
          <p className="eyebrow text-cream-300 mb-4">Our Mission</p>
          <p className="font-serif text-2xl sm:text-3xl font-light leading-relaxed text-balance">
            "To be the go-to online store for stylish, affordable fashion that fits every age, every vibe, and every day, while delivering a seamless and enjoyable online shopping experience."
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-cream-100">
        <div className="container-lux text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-700 font-light mb-6">
            Find your look
          </h2>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink-700 text-cream-100 font-medium tracking-widest text-sm uppercase transition-all duration-300 hover:bg-bronze-500 hover:text-cream-50"
          >
            Shop the Collection
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
