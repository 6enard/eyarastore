import { ShieldCheck, Truck, RefreshCw, AlertCircle, CreditCard, Wallet, Phone, Mail } from 'lucide-react';

const sections = [
  {
    icon: AlertCircle,
    title: '1. General Policy',
    body: [
      'All sales are considered final once goods are purchased.',
      'We do not accept returns, cancellations, or refunds due to change of mind, wrong size, or personal preference.',
      'By completing a purchase, you acknowledge and agree to these terms.',
    ],
  },
  {
    icon: Truck,
    title: '2. Order Processing and Shipping',
    body: [
      'Orders are processed within 1 – 2 business days.',
      'Delivery timelines vary based on location and chosen shipping method.',
      'You will receive a confirmation email with tracking details once your order is dispatched.',
    ],
  },
  {
    icon: RefreshCw,
    title: '3. Exchanges',
    body: [
      'We allow exchange of size or color (where available) within 48 hours of delivery, provided:',
      'The item is unworn, unwashed, and in its original condition.',
      'Tags and packaging are intact.',
      'Exchanges are subject to stock availability.',
      'Customers are responsible for return shipping / delivery costs.',
    ],
  },
  {
    icon: ShieldCheck,
    title: '4. Defective or Wrong Item',
    body: [
      'If you receive a defective product or an item different from your order:',
      'You must notify us within 24 hours of delivery (with clear photos / video).',
      'We will replace the item at no extra cost, or issue a store credit if a replacement is unavailable.',
    ],
  },
  {
    icon: AlertCircle,
    title: '5. Non-Returnable Items',
    body: [
      'For hygiene and safety reasons, the following items are strictly non-returnable:',
      'Undergarments, lingerie, bodysuits, swimwear.',
      'Accessories such as earrings, masks, and hair products.',
    ],
  },
  {
    icon: CreditCard,
    title: '6. Refunds',
    body: [
      'We do not offer cash refunds.',
      'In cases where a refund is legally required (e.g., defective item with no replacement available), it will be processed as store credit or voucher.',
    ],
  },
  {
    icon: Wallet,
    title: '7. Payments',
    body: [
      'All payments must be made in full at checkout.',
      'We accept M-Pesa and Paybill.',
    ],
  },
  {
    icon: Wallet,
    title: '8. Over-Payment Policy',
    body: [
      "If you accidentally overpay for your order, don't worry — we've got you covered.",
      "Refunds for overpayments will be processed within 7 business days.",
      "Kindly ensure you provide the correct payment details so we can refund the amount promptly.",
      "Please keep a copy of your payment confirmation or receipt as proof.",
    ],
  },
  {
    icon: ShieldCheck,
    title: '9. Customer Responsibility',
    body: [
      "Sizing & Product Details: Customers are responsible for reviewing all product descriptions and sizes before purchasing. Some items may not feature care tags or specific size guides, and may only display a size label. It is the customer's responsibility to select the correct size or contact us for clarification prior to purchase.",
      "General Care & Use: Once goods are sold, the responsibility for correct use, washing, and care lies entirely with the customer. For items without care labels, we highly recommend gentle hand-washing or professional dry cleaning to prevent damage.",
    ],
  },
];

export default function ReturnsPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-cream-100 border-b border-sage-200">
        <div className="container-lux py-12 lg:py-16 text-center">
          <p className="eyebrow mb-3">Eyara Store Limited</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-ink-700 font-light">Return &amp; Refund Policy</h1>
          <p className="text-ink-500 mt-4 max-w-2xl mx-auto leading-relaxed">
            We value our customers and strive to ensure you are satisfied with every purchase. Please read our return and refund policy carefully before placing an order.
          </p>
        </div>
      </div>

      {/* Policy sections */}
      <section className="py-16 lg:py-20">
        <div className="container-lux">
          <div className="max-w-3xl mx-auto space-y-10">
            {sections.map((section, i) => (
              <div key={i} className="flex gap-5">
                <div className="w-12 h-12 flex items-center justify-center bg-cream-100 border border-sage-200 flex-shrink-0">
                  <section.icon size={22} className="text-bronze-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-ink-700 font-medium mb-3">{section.title}</h2>
                  <ul className="space-y-2">
                    {section.body.map((line, j) => (
                      <li key={j} className="text-ink-600 leading-relaxed flex gap-2">
                        <span className="text-bronze-400 mt-1.5 flex-shrink-0">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Agreement note */}
          <div className="max-w-3xl mx-auto mt-12 p-6 bg-cream-100 border border-sage-200 text-center">
            <p className="text-sm tracking-wide text-ink-600 uppercase font-medium">
              By proceeding to check-out, you confirm that you've read and agreed to the terms and conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 lg:py-20 bg-ink-700 text-cream-100">
        <div className="container-lux text-center">
          <p className="eyebrow text-cream-300 mb-3">10. Contact Us</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-light mb-8">
            For any assistance, issues, or questions
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <a href="mailto:info@eyarastore.co.ke" className="flex items-center gap-2 text-cream-200 hover:text-bronze-400 transition-colors">
              <Mail size={18} />
              info@eyarastore.co.ke
            </a>
            <a href="tel:+254700679873" className="flex items-center gap-2 text-cream-200 hover:text-bronze-400 transition-colors">
              <Phone size={18} />
              +254 700 679873
            </a>
            <a href="tel:+254755841628" className="flex items-center gap-2 text-cream-200 hover:text-bronze-400 transition-colors">
              <Phone size={18} />
              +254 755 841628
            </a>
          </div>

          {/* Payment details */}
          <div className="max-w-md mx-auto p-6 border border-ink-600/60">
            <p className="text-xs tracking-widest uppercase text-cream-300 mb-4">Payment Details</p>
            <div className="space-y-2 text-sm text-cream-200/80">
              <p><span className="text-cream-300">Paybill No:</span> 600100</p>
              <p><span className="text-cream-300">Account No:</span> 00107533B</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
