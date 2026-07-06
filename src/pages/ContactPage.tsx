import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 4000);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@eyarastore.com', href: 'mailto:hello@eyarastore.com' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 234-5678', href: 'tel:+15552345678' },
    { icon: MapPin, label: 'Studio', value: '123 Maker Street, Portland, OR 97201', href: null },
  ];

  return (
    <div>
      {/* Header */}
      <div className="bg-cream-100 border-b border-sage-200">
        <div className="container-lux py-12 lg:py-16 text-center">
          <p className="eyebrow mb-3">Get in Touch</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-ink-700 font-light">We'd Love to Hear From You</h1>
          <p className="text-ink-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Whether you have a question about a product, an order, or just want to say hello, our team is here to help.
          </p>
        </div>
      </div>

      <div className="container-lux py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact info */}
          <div>
            <h2 className="font-serif text-2xl text-ink-700 font-medium mb-8">Contact Information</h2>
            <div className="space-y-6">
              {contactInfo.map((info, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-cream-100 border border-sage-200 flex-shrink-0">
                    <info.icon size={20} className="text-bronze-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-sage-500 mb-1">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-ink-700 hover:text-bronze-500 transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-ink-700">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-cream-100 border border-sage-200">
              <h3 className="font-serif text-lg text-ink-700 font-medium mb-2">Customer Support Hours</h3>
              <p className="text-sm text-ink-600 mb-1">Monday — Friday: 9am to 6pm PST</p>
              <p className="text-sm text-ink-600 mb-1">Saturday: 10am to 4pm PST</p>
              <p className="text-sm text-ink-600">Sunday: Closed</p>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-serif text-2xl text-ink-700 font-medium mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label-lux" htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-lux"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="label-lux" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-lux"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="label-lux" htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="input-lux"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="label-lux" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-lux resize-none"
                  placeholder="Tell us more..."
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={sent}
              >
                {sent ? (
                  <>
                    <Check size={18} />
                    Message Sent
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
