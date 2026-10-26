import { useState, type FormEvent } from 'react';
import { Phone, MessageCircle, Mail, HelpCircle, Siren, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { Modal } from '@/components/Modal';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { triggerWebhook } from '@/lib/webhook';
import { faqData } from '@/data/mockData';
import type { SupportRequest } from '@/types';

export function SupportPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState<SupportRequest>({
    name: '', phone: '', issue: '', description: '', preferredContact: 'Call',
  });

  const supportOptions = [
    { icon: Phone, label: 'Call Event Manager', value: '+91 98765 00000', color: 'bg-burgundy-600', href: 'tel:+919876500000' },
    { icon: MessageCircle, label: 'WhatsApp Support', value: 'Chat with us', color: 'bg-green-600', href: 'https://wa.me/919876500000' },
    { icon: Mail, label: 'Contact Support', value: 'support@weddingmanager.com', color: 'bg-blue-600', href: 'mailto:support@weddingmanager.com' },
    { icon: Siren, label: 'Emergency Help', value: '+91 98765 91111', color: 'bg-red-600', href: 'tel:+919876591111' },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    showToast('Support request submitted! We will contact you soon.');
    triggerWebhook('support_request', { name: form.name, phone: form.phone, issue: form.issue });
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ name: '', phone: '', issue: '', description: '', preferredContact: 'Call' });
  };

  return (
    <Layout title={t('support')} subtitle="We're here to help">
      <PageHeader
        title="Support & Help"
        description="Get help with any aspect of your wedding planning"
      />

      {/* Support options */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {supportOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <a
              key={opt.label}
              href={opt.href}
              target={opt.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="card group flex flex-col items-center p-5 text-center transition-all hover:shadow-md"
            >
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${opt.color} text-white transition-transform group-hover:scale-110`}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-burgundy-900">{opt.label}</p>
              <p className="mt-1 text-xs text-charcoal/50">{opt.value}</p>
            </a>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Support form */}
        <div className="card p-6">
          <h3 className="mb-4 text-base font-semibold text-burgundy-900">Submit a Support Request</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-field">Your Name *</label>
              <input type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field" placeholder="Enter your name" />
            </div>
            <div>
              <label className="label-field">Phone Number *</label>
              <input type="tel" required value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-field" placeholder="+91 ..." />
            </div>
            <div>
              <label className="label-field">Issue Type *</label>
              <select required value={form.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
                className="input-field">
                <option value="">Select an issue</option>
                <option value="Booking Issue">Booking Issue</option>
                <option value="Rental Issue">Rental Issue</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Technical Problem">Technical Problem</option>
                <option value="Event Coordination">Event Coordination</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label-field">Description *</label>
              <textarea required value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field min-h-[90px] resize-none" placeholder="Describe your issue..." />
            </div>
            <div>
              <label className="label-field">Preferred Contact Method</label>
              <select value={form.preferredContact}
                onChange={(e) => setForm({ ...form, preferredContact: e.target.value as SupportRequest['preferredContact'] })}
                className="input-field">
                <option value="Call">Call</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full">
              <Send className="h-4 w-4" /> Submit Request
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-burgundy-900">
            <HelpCircle className="h-5 w-5 text-burgundy-500" /> Frequently Asked Questions
          </h3>
          <div className="space-y-2">
            {faqData.map((faq, i) => (
              <div key={i} className="rounded-lg border border-burgundy-50">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
                >
                  <span className="text-sm font-medium text-charcoal">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 flex-shrink-0 text-charcoal/40 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3 text-sm text-charcoal/60">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success modal */}
      <Modal isOpen={submitted} onClose={handleClose} title="Request Submitted" size="sm">
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-9 w-9 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-burgundy-900">Thank You!</h4>
          <p className="mt-2 text-sm text-charcoal/60">
            Your support request has been received. Our team will contact you via {form.preferredContact} within 24 hours.
          </p>
          <button onClick={handleClose} className="btn-primary mt-6 w-full">{t('close')}</button>
        </div>
      </Modal>
    </Layout>
  );
}
