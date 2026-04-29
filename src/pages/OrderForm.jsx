import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const LOGO = 'https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png';

const INITIAL = {
  // 1. Partner Info
  partner_name: '',
  billing_address: '',
  country: '',
  project_sponsor: '',
  sponsor_email: '',
  billing_contact_name: '',
  billing_contact_email: '',
  billing_contact_phone: '',
  implementation_lead: '',
  implementation_lead_email: '',
  implementation_phone: '',
  // Order Details
  implementation_billing_start_date: '',
  monthly_minimum_platform_fee_start_date: '',
  monthly_minimum_tier: '',
  // 7. Signature
  signatory_name: '',
  signature: '',
  email_address: '',
  date_signed: '',
};

function SectionHeader({ number, title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>
        {number}
      </div>
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-slate-500 mb-1">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function Input({ value, onChange, placeholder, required, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
    />
  );
}

function TableHeader({ children }) {
  return <th className="bg-slate-700 text-white text-xs font-semibold px-3 py-2 text-left border border-slate-600">{children}</th>;
}
function TableCell({ children, className = '' }) {
  return <td className={`px-3 py-2 text-xs text-slate-700 border border-slate-200 ${className}`}>{children}</td>;
}
function TableCellBold({ children }) {
  return <td className="px-3 py-2 text-xs font-bold text-slate-800 border border-slate-200 bg-slate-50">{children}</td>;
}

export default function OrderForm() {
  const [form, setForm] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const body = `
Taper Payer INC Order Form Submission
======================================

PARTNER INFORMATION
-------------------
Partner Name: ${form.partner_name}
Billing Address: ${form.billing_address}
Country: ${form.country}
Project Sponsor: ${form.project_sponsor}
Sponsor Email: ${form.sponsor_email}
Billing Contact Name: ${form.billing_contact_name}
Billing Contact Email: ${form.billing_contact_email}
Billing Contact Phone: ${form.billing_contact_phone}
Implementation Lead: ${form.implementation_lead}
Implementation Lead Email: ${form.implementation_lead_email}
Implementation Phone: ${form.implementation_phone}

ORDER DETAILS
-------------
Implementation Billing Start Date: ${form.implementation_billing_start_date}
Monthly Minimum Platform Fee Start Date: ${form.monthly_minimum_platform_fee_start_date}
Monthly Minimum Tier & Jurisdiction: ${form.monthly_minimum_tier}

SIGNATURE
---------
Authorised Signatory Name: ${form.signatory_name}
Email Address: ${form.email_address}
Date Signed: ${form.date_signed}
      `.trim();

      await base44.integrations.Core.SendEmail({
        to: 'support@taperpayer.com',
        subject: `Taper Payer INC Order Form: ${form.partner_name}`,
        body,
      });

      // Save to database
      await base44.entities.OrderFormSubmission.create({
        partner_name: form.partner_name,
        billing_address: form.billing_address,
        country: form.country,
        project_sponsor: form.project_sponsor,
        sponsor_email: form.sponsor_email,
        billing_contact_name: form.billing_contact_name,
        billing_contact_email: form.billing_contact_email,
        billing_contact_phone: form.billing_contact_phone,
        implementation_lead: form.implementation_lead,
        implementation_lead_email: form.implementation_lead_email,
        implementation_phone: form.implementation_phone,
        implementation_billing_start_date: form.implementation_billing_start_date,
        monthly_minimum_platform_fee_start_date: form.monthly_minimum_platform_fee_start_date,
        monthly_minimum_tier: form.monthly_minimum_tier,
        signatory_name: form.signatory_name,
        email_address: form.email_address,
        date_signed: form.date_signed,
        status: 'new',
      });

      // Confirmation email to the partner
      const confirmationBody = `
Dear ${form.partner_name},

Thank you for submitting your Order Form to Taper Payer INC! We have received your information and our team will review it and reach out within 1–2 business days.

Here is a summary of your submission:

Partner Name: ${form.partner_name}
Billing Address: ${form.billing_address}
Country: ${form.country}
Project Sponsor: ${form.project_sponsor}
Sponsor Email: ${form.sponsor_email}
Billing Contact: ${form.billing_contact_name} (${form.billing_contact_email})
Implementation Billing Start Date: ${form.implementation_billing_start_date}
Monthly Minimum Platform Fee Start Date: ${form.monthly_minimum_platform_fee_start_date}
Monthly Minimum Tier & Jurisdiction: ${form.monthly_minimum_tier}
Signed By: ${form.signatory_name}
Date Signed: ${form.date_signed}

If you have any questions in the meantime, please contact us at support@taperpayer.com or call 404-994-0766.

Welcome to the Taper Payer family!

Best regards,
The Taper Payer INC Team
https://taperpayer.com
      `.trim();

      await base44.integrations.Core.SendEmail({
        to: form.sponsor_email,
        subject: `Your Taper Payer INC Order Form Has Been Received`,
        body: confirmationBody,
      });

      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 text-center max-w-md w-full shadow-xl border border-slate-100">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #61AF39, #3D7BB7)' }}>
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">Order Form Submitted!</h2>
          <p className="text-slate-500 mb-6">Thank you, <strong>{form.partner_name}</strong>. Our team at Taper Payer INC will review your order form and reach out shortly.</p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>
            Back to Home <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <img src={LOGO} alt="Taper Payer" className="h-40 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-black text-slate-900">Taper Payer INC Order Form</h1>
          <p className="text-slate-500 text-sm mt-2">Please fill out all required fields. Our team will follow up within 1–2 business days.</p>
        </div>

        {/* ── WHY NOW: Urgency + Profit Projections ── */}
        <div className="mb-8 rounded-2xl overflow-hidden border-2" style={{ borderColor: '#3D7BB7' }}>
          {/* Urgency Header */}
          <div className="px-6 py-5 text-white" style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🚀</span>
              <h2 className="text-xl font-black">Why Start a Money Remittance Business NOW?</h2>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">The global remittance market is a <strong className="text-white">$900 Billion+</strong> industry — and it's growing every year. Millions of diaspora families send money home monthly. The window to capture your share is <strong className="text-yellow-300">open today</strong>.</p>
          </div>

          {/* Urgency Points */}
          <div className="px-6 py-5 bg-white grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100">
            {[
              { icon: '🌍', title: '$900B+ Market', body: 'Global remittance flows hit record highs every year. Demand isn\'t slowing — it\'s accelerating.' },
              { icon: '📈', title: 'Diaspora is Growing', body: 'Over 270 million migrants worldwide send money home every month. Your customers already exist.' },
              { icon: '⚡', title: 'First-Mover Advantage', body: 'In your community, being first means building brand loyalty that is nearly impossible to displace.' },
            ].map(({ icon, title, body }) => (
              <div key={title} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  <span className="font-bold text-slate-900 text-sm">{title}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* Profit Projections */}
          <div className="px-6 py-5 bg-slate-50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">💰</span>
              <h3 className="text-base font-black text-slate-900">Projected Partner Profit — Year 1 to Year 3</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Based on conservative assumptions: avg. transaction $300 USD, 2.5% markup on FX spread, growing customer base month over month.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  year: 'Year 1',
                  color: '#3D7BB7',
                  bg: '#e3f2fd',
                  txVol: '$1.2M – $2.4M',
                  revenue: '$60,000 – $120,000',
                  platformCost: '$25,000 (White Label)',
                  netProfit: '+$35,000 – +$95,000',
                  note: 'Build your brand, acquire your first 500–1,000 customers.',
                },
                {
                  year: 'Year 2',
                  color: '#61AF39',
                  bg: '#e8f5e9',
                  txVol: '$3M – $6M',
                  revenue: '$150,000 – $300,000',
                  platformCost: '$25,000 (White Label)',
                  netProfit: '+$125,000 – +$275,000',
                  note: 'Word of mouth kicks in. Repeat customers drive volume.',
                },
                {
                  year: 'Year 3',
                  color: '#F88F2B',
                  bg: '#fff3e0',
                  txVol: '$6M – $15M',
                  revenue: '$300,000 – $750,000',
                  platformCost: '$25,000 (White Label)',
                  netProfit: '+$275,000 – +$725,000',
                  note: 'Scale to multiple corridors, mobile top-ups, and B2B.',
                },
              ].map(({ year, color, bg, txVol, revenue, platformCost, netProfit, note }) => (
                <div key={year} className="rounded-xl border overflow-hidden" style={{ borderColor: color }}>
                  <div className="px-4 py-2 text-white font-black text-sm" style={{ backgroundColor: color }}>{year}</div>
                  <div className="px-4 py-3 space-y-2" style={{ backgroundColor: bg }}>
                    <div>
                      <p className="text-xs text-slate-500">Transaction Volume (below-average)</p>
                      <p className="text-sm font-bold text-slate-800">{txVol}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Gross Revenue (FX Markup)</p>
                      <p className="text-sm font-bold text-slate-800">{revenue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Platform Cost</p>
                      <p className="text-sm font-semibold text-slate-600">{platformCost}</p>
                    </div>
                    <div className="border-t pt-2" style={{ borderColor: color + '40' }}>
                      <p className="text-xs text-slate-500">Estimated Net Profit</p>
                      <p className="text-base font-black" style={{ color }}>{netProfit}</p>
                    </div>
                    <p className="text-xs text-slate-400 italic">{note}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">* Projections are illustrative estimates based on industry averages. Actual results depend on marketing, customer acquisition, and transaction volumes. Not financial advice.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── 1. Partner Information ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <SectionHeader number="1" title="Partner Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FieldLabel required>Partner Name</FieldLabel>
                <Input value={form.partner_name} onChange={set('partner_name')} placeholder="Company / Partner name" required />
              </div>
              <div className="md:col-span-2">
                <FieldLabel required>Billing Address</FieldLabel>
                <Input value={form.billing_address} onChange={set('billing_address')} placeholder="Street, City, State, ZIP" required />
              </div>
              <div>
                <FieldLabel required>Country</FieldLabel>
                <Input value={form.country} onChange={set('country')} placeholder="e.g. United States" required />
              </div>
              <div>
                <FieldLabel required>Project Sponsor</FieldLabel>
                <Input value={form.project_sponsor} onChange={set('project_sponsor')} placeholder="Full name" required />
              </div>
              <div>
                <FieldLabel required>Sponsor Email</FieldLabel>
                <Input type="email" value={form.sponsor_email} onChange={set('sponsor_email')} placeholder="sponsor@company.com" required />
              </div>
              <div>
                <FieldLabel required>Billing Contact Name</FieldLabel>
                <Input value={form.billing_contact_name} onChange={set('billing_contact_name')} placeholder="Full name" required />
              </div>
              <div>
                <FieldLabel required>Billing Contact Email</FieldLabel>
                <Input type="email" value={form.billing_contact_email} onChange={set('billing_contact_email')} placeholder="billing@company.com" required />
              </div>
              <div>
                <FieldLabel required>Billing Contact Phone</FieldLabel>
                <Input value={form.billing_contact_phone} onChange={set('billing_contact_phone')} placeholder="+1 555 000 0000" required />
              </div>
              <div>
                <FieldLabel>Partner Lead</FieldLabel>
                <Input value={form.implementation_lead} onChange={set('implementation_lead')} placeholder="Full name" />
              </div>
              <div>
                <FieldLabel>Partner Lead Email</FieldLabel>
                <Input type="email" value={form.implementation_lead_email} onChange={set('implementation_lead_email')} placeholder="lead@company.com" />
              </div>
              <div>
                <FieldLabel>Partner Lead Phone</FieldLabel>
                <Input value={form.implementation_phone} onChange={set('implementation_phone')} placeholder="+1 555 000 0000" />
              </div>
            </div>

            {/* Order Details sub-section */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-700 mb-4">Order Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs mb-4">
                  <tbody>
                    <tr>
                      <TableCellBold>Quote Date</TableCellBold>
                      <TableCell>March 10, 2026 — valid for 30 days</TableCell>
                    </tr>
                    <tr>
                      <TableCellBold>Payment Terms</TableCellBold>
                      <TableCell>Monthly</TableCell>
                    </tr>
                    <tr>
                      <TableCellBold>Monthly Minimum Tier &amp; Jurisdiction</TableCellBold>
                      <TableCell>USA: $3,500 Tier 1 — Ramp Pricing: Month 1–3: 50% off monthly minimum</TableCell>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <FieldLabel required>Implementation Billing Start Date</FieldLabel>
                  <Input type="date" value={form.implementation_billing_start_date} onChange={set('implementation_billing_start_date')} required />
                </div>
                <div>
                  <FieldLabel required>Monthly Minimum Platform Fee Start Date</FieldLabel>
                  <Input type="date" value={form.monthly_minimum_platform_fee_start_date} onChange={set('monthly_minimum_platform_fee_start_date')} required />
                </div>
                <div>
                  <FieldLabel>Monthly Minimum Tier &amp; Jurisdiction</FieldLabel>
                  <select value={form.monthly_minimum_tier} onChange={set('monthly_minimum_tier')}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                    <option value="">Select tier</option>
                    <option>USA Tier 1 — $3,500/mo</option>
                    <option>USA Tier 2 — $5,000/mo</option>
                    <option>USA Tier 3 — $10,000/mo</option>
                    <option>USA Tier 4 — $13,000/mo</option>
                    <option>Canada Tier 1 — $2,000/mo CAD</option>
                    <option>Canada Tier 2 — $4,000/mo CAD</option>
                    <option>Canada Tier 3 — $6,000/mo CAD</option>
                    <option>Canada Tier 4 — $8,000/mo CAD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── NEW: White Label Fee Breakdown ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <SectionHeader number="★" title="White Label Fee Breakdown — $25,000.00" />
            <p className="text-sm text-slate-500 mb-5">Your one-time white label investment covers everything you need to launch a fully branded Money Remittance Company — with no ongoing license fees.</p>

            <div className="space-y-5">
              {/* Item 1 */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-black flex-shrink-0">1</span>
                  <h4 className="text-sm font-bold text-white">Full Front End / Back End Web &amp; App Application</h4>
                </div>
                <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Custom web application',
                    'Mobile app development',
                    'Custom integrations & API',
                    'Database design',
                    'User authentication system',
                    'Payment gateway integration',
                    '1 year priority support',
                    'Dedicated project manager',
                    'Advanced security features',
                    'Performance monitoring',
                    '1 domain name for 1 year (if needed)',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e8f5e9' }}>
                        <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#61AF39" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Item 2 */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-black flex-shrink-0">2</span>
                  <h4 className="text-sm font-bold text-white">No License Fees to Operate</h4>
                </div>
                <div className="px-4 py-4">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>Zero ongoing license fees</strong> to operate your own fully branded Money Remittance Company. Own your platform outright with no recurring royalty or licensing costs eating into your margins.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-black flex-shrink-0">3</span>
                  <h4 className="text-sm font-bold text-white">Platform Features (Quick Actions)</h4>
                </div>
                <div className="px-4 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Send Money', sub: 'Transfer globally' },
                    { label: 'Mobile Top-Up', sub: 'Recharge instantly' },
                    { label: 'Request Money', sub: 'Ask to get paid' },
                    { label: 'Request Top-Up', sub: 'Ask someone to top up' },
                    { label: 'Split Bills', sub: 'Divide expenses' },
                    { label: 'Favorites', sub: 'Quick contacts' },
                    { label: 'Group Wallet', sub: 'Shared account' },
                    { label: 'Send AGNV', sub: 'Send via AGNV' },
                  ].map(({ label, sub }) => (
                    <div key={label} className="flex flex-col items-center text-center bg-slate-50 rounded-xl py-3 px-2 border border-slate-100">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mb-2" style={{ backgroundColor: '#e8f5e9' }}>
                        <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#61AF39" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <p className="text-xs font-bold text-slate-800">{label}</p>
                      <p className="text-xs text-slate-400">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="rounded-xl border-2 overflow-hidden" style={{ borderColor: '#61AF39' }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ background: '#f0faf0' }}>
                  <span className="text-sm font-bold text-slate-800">White Label One-Time Fee</span>
                  <span className="text-2xl font-black" style={{ color: '#61AF39' }}>$25,000.00</span>
                </div>
                <div className="px-5 py-4 bg-white border-t space-y-3" style={{ borderColor: '#c8edb5' }}>
                  <p className="text-xs font-semibold text-slate-800">Payment flexibility — your choice on how you want to proceed:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>1</span>
                      <p className="text-xs text-slate-700"><span className="font-bold">Pay in Full</span> — $25,000.00 upfront, fast launching 30 days.</p>
                    </div>
                    <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>2</span>
                      <p className="text-xs text-slate-700"><span className="font-bold">50/50</span> — 50% ($12,500) to start, then 50% ($12,500) at launch.</p>
                    </div>
                    <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>3</span>
                      <p className="text-xs text-slate-700"><span className="font-bold">30/30/30</span> — 30% ($7,500) to start, 30% ($7,500) mid-project, 30% ($7,500) at launch.</p>
                    </div>
                    <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>4</span>
                      <p className="text-xs text-slate-700"><span className="font-bold">20% Instalments</span> — 20% ($5,000) every 20 months × 5 payments.</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Minimum deposit of <span className="font-bold" style={{ color: '#61AF39' }}>20% ($5,000.00)</span> required to get started.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. Taper Payer INC Monthly Fees ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <SectionHeader number="2" title="Taper Payer INC Monthly Fees" />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <TableHeader>Item</TableHeader>
                    <TableHeader>Description</TableHeader>
                    <TableHeader>Monthly Fee</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <TableCell className="font-semibold">Implementation support</TableCell>
                    <TableCell>Live support through implementation, onboarding with compliance team, project management, bank approval. Payment is due upfront in order to book your first implementation kick-off call.</TableCell>
                    <TableCell>N/A - not utilizing this service</TableCell>
                  </tr>
                  <tr><td colSpan={3} className="bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200">United States</td></tr>
                  <tr>
                    <TableCell className="font-semibold">Platform fee</TableCell>
                    <TableCell>Tier 1: USA Monthly Minimum — 1 month free after launching, then $1,500/mo for 3 months, then $3,500/mo</TableCell>
                    <TableCell className="font-bold text-green-700">$3,500.00</TableCell>
                  </tr>
                  <tr><td colSpan={3} className="bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200">Canada</td></tr>
                  <tr>
                    <TableCell className="font-semibold">Platform fee</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>N/A</TableCell>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── 3. Base Fees ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <SectionHeader number="3" title="Base Fees" />
            <div className="overflow-x-auto space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">FX Conversion Fees</h4>
                <table className="w-full border-collapse text-xs">
                  <tbody>
                    <tr>
                      <TableCell>
                        <ul className="list-disc list-inside space-y-1">
                          <li>USDT: 25 BPS + "variable fee"</li>
                          <li>USDC: 25 BPS</li>
                          <li>USDC Chain Swaps: 10 BPS</li>
                          <li>Bitcoin: 35 BPS</li>
                        </ul>
                        <p className="mt-2 font-semibold text-slate-600">"Variable fee" definition: Market cost to source USDT from Liquidity Providers</p>
                      </TableCell>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Transaction Costs</h4>
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr>
                      <TableHeader>United States ($USD)</TableHeader>
                      <TableHeader>Canada ($CAD)</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <TableCell>
                        <ul className="space-y-1">
                          <li>Same-Day ACH Debit (Pull): $0.55</li>
                          <li>Same-Day ACH Credit (Push): $0.25</li>
                          <li>Instant RTP: $1.00</li>
                          <li>Domestic Wire: $20</li>
                          <li>AFT: $0.50 + 50 BPS</li>
                          <li>KYC Fees (successful verification): $3.00</li>
                          <li>KYB Fees - Single Business Owner: $7.50</li>
                          <li>KYB Fees - Multiple Business Owner: $11.50</li>
                          <li>Named ABA Routing Accounts Set up Fee: $0.50</li>
                          <li>Named ABA Routing Accounts Monthly Maintenance Fee: $0.20</li>
                        </ul>
                      </TableCell>
                      <TableCell>
                        <ul className="space-y-1">
                          <li>EFT Debit: $0.80</li>
                          <li>EFT Credit: $0.80</li>
                          <li>Interac e-Transfer (Send/Receive): $1.50</li>
                          <li>KYC Fees (successful verification): $3.00</li>
                          <li>KYB Fees - Single Business Owner: $7.50</li>
                          <li>KYB Fees - Multiple Business Owner: $11.50</li>
                        </ul>
                      </TableCell>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── 4. Other Fees ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <SectionHeader number="4" title="Other Fees" />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <tbody>
                  <tr>
                    <TableCellBold>USA Transaction Fees (per transaction)</TableCellBold>
                    <TableCell>
                      <ul className="space-y-1">
                        <li><strong>ACH Returns:</strong> $6.00</li>
                        <li><strong>ACH Chargeback Return:</strong> $25.00</li>
                        <li><strong>ACH Notification of Change:</strong> $4.00</li>
                      </ul>
                    </TableCell>
                  </tr>
                  <tr>
                    <TableCellBold>USA AFT</TableCellBold>
                    <TableCell>
                      <ul className="space-y-1">
                        <li><strong>AFT Chargeback:</strong> $10.00</li>
                        <li><strong>AFT Recall/Reversal:</strong> $25.00</li>
                      </ul>
                    </TableCell>
                  </tr>
                  <tr>
                    <TableCellBold>Canada Transaction Fees (per transaction)</TableCellBold>
                    <TableCell>
                      <ul className="space-y-1">
                        <li><strong>EFT Returns:</strong> $4.00</li>
                        <li><strong>EFT Trace/Recall:</strong> $25.00</li>
                      </ul>
                    </TableCell>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── 6. Terms ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <SectionHeader number="5" title="Terms Applicable To All Orders" />
            <ol className="list-decimal list-inside space-y-3 text-sm text-slate-700 leading-relaxed">
              <li>This <strong>Order Form</strong> is made and entered into as of the date of signing, by and between the partner named above ("<strong>Partner</strong>") and <strong>Taper Payer INC</strong>. This <strong>Order Form</strong> is issued under, and subject to, the <strong>Partner Terms</strong> available at: <a href="https://taperpayer.com/legal/partner-terms" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://taperpayer.com/legal/partner-terms</a>, which, altogether are the "<strong>Agreement</strong>".</li>
              <li>Initial funding of <strong>Refundable Deposit Account</strong>: <strong>Partner</strong> shall fund with $10,000 USD <span className="text-slate-500 font-normal">(optional: $5,000 – $10,000)</span>.</li>
              <li>Any prior <strong>Order Form</strong> entered into by the parties is superseded and replaced in its entirety by this <strong>Agreement</strong>.</li>
              <li>This <strong>Order Form</strong> is binding and effective upon signing by <strong>Partner</strong> (provided that no changes were made to the provided form of agreement), with billing to start on the <strong>Billing Start Date</strong>.</li>
            </ol>
          </div>

          {/* ── 7. Partner Signature ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <SectionHeader number="6" title="Partner Signature" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Name of Authorised Signatory</FieldLabel>
                <Input value={form.signatory_name} onChange={set('signatory_name')} placeholder="Full legal name" required />
              </div>
              <div>
                <FieldLabel required>Email Address</FieldLabel>
                <Input type="email" value={form.email_address} onChange={set('email_address')} placeholder="signatory@company.com" required />
              </div>
              <div>
                <FieldLabel required>Signature (Type full name to sign)</FieldLabel>
                <Input value={form.signature} onChange={set('signature')} placeholder="Type full name as signature" required />
              </div>
              <div>
                <FieldLabel required>Date Signed</FieldLabel>
                <Input type="date" value={form.date_signed} onChange={set('date_signed')} required />
              </div>
            </div>

            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              By submitting this form, the Partner acknowledges agreement to the Taper Payer INC Partner Terms and confirms the accuracy of all information provided.
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2 transition-opacity disabled:opacity-60 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            {loading ? 'Submitting Order Form…' : 'Submit Order Form to Taper Payer INC'}
          </button>


        </form>
      </div>
    </div>
  );
}