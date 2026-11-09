'use client';

import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Loader2, CheckCircle } from 'lucide-react';
import { PageHero, headingClass } from '@/components/shop/Service';

const CONTACT_TOPICS = [
  'Order Enquiry', 'Returns & Refunds', 'Product Information', 'Virtual Try-On Help',
  'Store Consultation Booking', 'Wholesale / B2B', 'Media & PR', 'Other',
];

const label = 'block text-[0.9375rem] font-medium text-ink mb-1.5';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // The service pages link here as /contact?service=hair-bonding: start that visitor on a consultation.
  useEffect(() => {
    const service = new URLSearchParams(window.location.search).get('service');
    if (!service) return;
    const name = service.replace(/-/g, ' ');
    setForm((f) => ({
      ...f,
      topic: f.topic || 'Store Consultation Booking',
      message: f.message || `I'd like to book a consultation for ${name}.`,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((res) => setTimeout(res, 1800));
    setSent(true);
    setSending(false);
  };

  return (
    <div>
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }]}
        title="Get in touch"
        lead="Our certified hair specialists are here to help, seven days a week, 9 AM to 9 PM."
      />

      <div className="container-custom section-md grid gap-14 lg:grid-cols-12">
        {/* Contact form */}
        <section aria-labelledby="contact-form-h" className="lg:col-span-7 min-w-0">
          <h2 id="contact-form-h" className={headingClass}>Send us a message</h2>

          {sent ? (
            <div role="status" className="mt-8 border-t border-ink pt-8">
              <CheckCircle className="w-10 h-10 text-accent" strokeWidth={1.75} aria-hidden />
              <h3 className="font-display text-[length:var(--text-2xl)] text-ink mt-4">Message received</h3>
              <p className="text-ink-soft leading-[1.7] mt-2 max-w-[48ch]">
                Thank you for reaching out. Our team will respond to your message within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', topic: '', message: '' }); }}
                className="btn-secondary mt-6"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className={label}>Full name *</label>
                  <input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Priya Sharma"
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className={label}>Email address *</label>
                  <input
                    id="contact-email"
                    name="email"
                    autoComplete="email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-phone" className={label}>Phone number</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    autoComplete="tel"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="9876543210"
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="contact-topic" className={label}>Topic *</label>
                  <select
                    id="contact-topic"
                    name="topic"
                    required
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select a topic</option>
                    {CONTACT_TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className={label}>Your message *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={6}
                  placeholder="Tell us how we can help you..."
                  className="input-field resize-y"
                />
              </div>

              <div>
                <button type="submit" disabled={sending} aria-busy={sending} className="btn-primary inline-flex items-center gap-2">
                  {sending
                    ? <><Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden /> Sending…</>
                    : <><Send className="w-4 h-4" aria-hidden /> Send message</>}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Ways to reach the studio */}
        <aside aria-label="Contact details" className="lg:col-span-4 lg:col-start-9 min-w-0 grid gap-10 content-start">
          <dl className="border-t border-ink">
            <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 py-5 border-b border-rule">
              <Phone className="w-[1.125rem] h-[1.125rem] text-accent mt-0.5" aria-hidden />
              <div>
                <dt className="font-semibold text-ink">Phone / WhatsApp</dt>
                <dd className="mt-1 grid gap-1 text-[0.9375rem]">
                  <a href="tel:+919027396563" className="link-quiet w-fit">+91 90273 96563</a>
                  <a href="https://wa.me/918976543210" className="link-quiet w-fit">WhatsApp Chat</a>
                </dd>
              </div>
            </div>
            <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 py-5 border-b border-rule">
              <Mail className="w-[1.125rem] h-[1.125rem] text-accent mt-0.5" aria-hidden />
              <div>
                <dt className="font-semibold text-ink">Email</dt>
                <dd className="mt-1 grid gap-1 text-[0.9375rem]">
                  <a href="mailto:hello@hairsup.com" className="link-quiet w-fit">hello@hairsup.com</a>
                  <a href="mailto:help@hairsup.com" className="link-quiet w-fit">help@hairsup.com (Support)</a>
                </dd>
              </div>
            </div>
            <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 py-5 border-b border-rule">
              <MapPin className="w-[1.125rem] h-[1.125rem] text-accent mt-0.5" aria-hidden />
              <div>
                <dt className="font-semibold text-ink">Head Office</dt>
                <dd className="mt-1 text-[0.9375rem] text-ink-soft leading-[1.6]">
                  Glamour Hair Studios Pvt. Ltd.<br />
                  Bandra Kurla Complex<br />
                  Mumbai, Maharashtra 400051
                </dd>
              </div>
            </div>
            <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 py-5 border-b border-rule">
              <Clock className="w-[1.125rem] h-[1.125rem] text-accent mt-0.5" aria-hidden />
              <div>
                <dt className="font-semibold text-ink">Support Hours</dt>
                <dd className="mt-1 text-[0.9375rem] text-ink-soft leading-[1.6]">
                  Monday to Friday: 9:00 AM to 9:00 PM<br />
                  Saturday and Sunday: 10:00 AM to 7:00 PM
                </dd>
              </div>
            </div>
          </dl>

          <div>
            <h3 className="flex items-center gap-2.5 font-semibold text-ink">
              <MessageCircle className="w-[1.125rem] h-[1.125rem] text-accent" aria-hidden />
              Live chat available
            </h3>
            <p className="text-[0.9375rem] text-ink-soft mt-2">Connect instantly with a hair specialist.</p>
          </div>

          <div className="bg-paper-2 rounded-card p-6">
            <h3 className="font-display text-[length:var(--text-xl)] text-ink leading-tight">Book a free consultation</h3>
            <p className="text-[0.9375rem] text-ink-soft leading-[1.6] mt-2">
              Get a personalised consultation with our certified hair specialists to find your ideal wig or hair system.
            </p>
            <a href="tel:+919027396563" className="btn-secondary mt-5 w-full justify-center whitespace-nowrap">Call to book</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
