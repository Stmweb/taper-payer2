import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, ChevronRight, Building2, User, Phone, Mail, Globe, DollarSign, MessageSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const LOGO = 'https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/f99e44de6_ChatGPTImageDec29202501_48_52PM.png';

const PLAN_OPTIONS = [
  { id: 'starter', label: 'Starter', price: '$499/mo', desc: 'Up to 500 transactions/month' },
  { id: 'growth', label: 'Growth', price: '$999/mo', desc: 'Up to 2,000 transactions/month' },
  { id: 'enterprise', label: 'Enterprise', price: 'Custom', desc: 'Unlimited + dedicated support' },
];

const FEATURES = [
  'Branded mobile app (iOS & Android)',
  'Custom domain & logo',
  'Money transfer infrastructure',
  'Mobile top-up capabilities',
  'KYC/AML compliance built-in',
  'Dedicated account manager',
];

const INITIAL = {
  first_name: '', last_name: '', email: '', phone: '',
  company_name: '', website: '', country: '', business_type: '',
  expected_volume: '', plan: '', message: '',
};

export default function OrderForm() {
  const [form, setForm] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const body = `
White Label Order Form Submission

Name: ${form.first_name} ${form.last_name}
Email: ${form.email}
Phone: ${form.phone}
Company: ${form.company_name}
Website: ${form.website}
Country: ${form.country}
Business Type: ${form.business_type}
Expected Monthly Volume: ${form.expected_volume}
Plan Selected: ${form.plan}

Message:
${form.message}
      `.trim();

      await base44.integrations.Core.SendEmail({
        to: 'ficusaureallc@gmail.com',
        subject: `White Label Inquiry: ${form.company_name} (${form.plan})`,
        body,
      });
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 text-center max-w-md w-full shadow-2xl"
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #61AF39, #3D7BB7)' }}>
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">Application Received!</h2>
          <p className="text-slate-500 mb-6">Thank you, <strong>{form.first_name}</strong>! Our team will review your white label application and reach out within 1–2 business days.</p>
          <a href="/TaperPayerWhiteLabel"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>
            Back to White Label Info <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="pt-10 pb-6 px-6 text-center">
        <img src={LOGO} alt="Taper Payer" className="h-14 w-auto mx-auto mb-4" />
        <h1 className="text-3xl font-black text-white mb-2">White Label Order Form</h1>
        <p className="text-white/60 text-sm max-w-md mx-auto">Fill out the form below and our team will get in touch to set up your branded fintech solution.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16 grid md:grid-cols-3 gap-6">

        {/* Left: What's included */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">What's Included</h3>
            <div className="space-y-3">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: '#61AF39' }}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/80 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Questions?</h3>
            <p className="text-white/60 text-xs mb-2">Email us directly:</p>
            <a href="mailto:support@taperpayer.com" className="text-blue-400 text-xs font-semibold hover:underline">support@taperpayer.com</a>
          </div>
        </div>

        {/* Right: Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white rounded-2xl p-6 shadow-2xl space-y-5">

          {/* Personal Info */}
          <div>
            <h3 className="text-slate-700 font-bold text-sm mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" /> Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">First Name *</label>
                <input required value={form.first_name} onChange={e => set('first_name', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="John" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Last Name *</label>
                <input required value={form.last_name} onChange={e => set('last_name', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Smith" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block flex items-center gap-1"><Mail className="w-3 h-3" /> Email *</label>
                <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="john@company.com" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block flex items-center gap-1"><Phone className="w-3 h-3" /> Phone *</label>
                <input required value={form.phone} onChange={e => set('phone', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="+1 555 000 0000" />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Business Info */}
          <div>
            <h3 className="text-slate-700 font-bold text-sm mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-green-500" /> Business Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Company Name *</label>
                <input required value={form.company_name} onChange={e => set('company_name', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Acme Corp" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block flex items-center gap-1"><Globe className="w-3 h-3" /> Website</label>
                <input value={form.website} onChange={e => set('website', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="https://acme.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Country *</label>
                <input required value={form.country} onChange={e => set('country', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="United States" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Business Type *</label>
                <select required value={form.business_type} onChange={e => set('business_type', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                  <option value="">Select type</option>
                  <option>Fintech Startup</option>
                  <option>Money Transfer Operator</option>
                  <option>Bank / Credit Union</option>
                  <option>Telecom / Mobile Operator</option>
                  <option>Remittance Provider</option>
                  <option>E-commerce Platform</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Plan */}
          <div>
            <h3 className="text-slate-700 font-bold text-sm mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-500" /> Select a Plan *
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {PLAN_OPTIONS.map(p => (
                <button key={p.id} type="button" onClick={() => set('plan', p.label)}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${form.plan === p.label
                    ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                  <div className="font-bold text-slate-900 text-sm">{p.label}</div>
                  <div className="text-blue-600 font-semibold text-xs mt-0.5">{p.price}</div>
                  <div className="text-slate-400 text-xs mt-1 leading-tight">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Expected Monthly Transaction Volume</label>
            <select value={form.expected_volume} onChange={e => set('expected_volume', e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
              <option value="">Select volume range</option>
              <option>Under $10,000</option>
              <option>$10,000 – $50,000</option>
              <option>$50,000 – $250,000</option>
              <option>$250,000 – $1,000,000</option>
              <option>Over $1,000,000</option>
            </select>
          </div>

          <div className="border-t border-slate-100" />

          {/* Message */}
          <div>
            <h3 className="text-slate-700 font-bold text-sm mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-500" /> Additional Information
            </h3>
            <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="Tell us about your use case, target market, any specific requirements..." />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading || !form.plan}
            className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
            {loading ? 'Submitting…' : 'Submit White Label Application'}
          </button>

          <p className="text-center text-xs text-slate-400">By submitting, you agree to our <a href="/TaperPayerTerms" className="underline">Terms of Service</a> and <a href="/TaperPayerPrivacy" className="underline">Privacy Policy</a>.</p>
        </form>
      </div>
    </div>
  );
}