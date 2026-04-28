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
        to: 'ficusaureallc@gmail.com',
        subject: `Taper Payer INC Order Form: ${form.partner_name}`,
        body,
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
          <img src={LOGO} alt="Taper Payer" className="h-24 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-black text-slate-900">Taper Payer INC Order Form</h1>
          <p className="text-slate-500 text-sm mt-2">Please fill out all required fields. Our team will follow up within 1–2 business days.</p>
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
                <FieldLabel>Implementation Lead</FieldLabel>
                <Input value={form.implementation_lead} onChange={set('implementation_lead')} placeholder="Full name" />
              </div>
              <div>
                <FieldLabel>Implementation Lead Email</FieldLabel>
                <Input type="email" value={form.implementation_lead_email} onChange={set('implementation_lead_email')} placeholder="lead@company.com" />
              </div>
              <div>
                <FieldLabel>Implementation Phone</FieldLabel>
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
                    <TableCell>Tier 1: USA Monthly Minimum — 1 month free after launching, then $1,500/mo for 3 months</TableCell>
                    <TableCell className="font-bold text-green-700">$1,500.00</TableCell>
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

          {/* ── 5. Jurisdictional Pricing Tiers ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <SectionHeader number="5" title="Jurisdictional Pricing Tiers" />

            {/* USA */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">🇺🇸 USA Support</span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">FBO Account Included</span>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">With Crypto Offset on a monthly minimum</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr>
                      <TableHeader> </TableHeader>
                      <TableHeader colSpan={4}>BPS Tiers</TableHeader>
                    </tr>
                    <tr>
                      <th className="bg-slate-600 text-white text-xs font-semibold px-3 py-2 text-left border border-slate-500">Min Monthly Fee</th>
                      {['$3,500','$5,000','$10,000','$13,000'].map(v => (
                        <th key={v} className="bg-slate-600 text-white text-xs font-bold px-3 py-2 text-center border border-slate-500">{v}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Stablecoin Conversion - USDC','0.25%','0.20%','0.15%','0.12%',true],
                      ['Stablecoin Conversion - USDT','0.28%','0.23%','0.18%','0.15%',true],
                      ['Crypto Conversion - Bitcoin','0.35%','0.30%','0.25%','0.22%',true],
                      ['USDC Chain Swaps','0.10%','0.10%','0.10%','0.10%',true],
                      ['Enhanced Same-Day ACH (Debit)','$0.55','$0.55','$0.55','$0.55'],
                      ['Same-Day ACH (Credit)','$0.25','$0.25','$0.25','$0.25'],
                      ['Instant RTP (Send / Receive)','$1.00','$1.00','$1.00','$1.00'],
                      ['Domestic Wires (Send / Receive)','$20.00','$20.00','$20.00','$20.00'],
                      ['AFT Pricing *Coming April 2026','$0.50 + 0.50%','$0.50 + 0.50%','$0.50 + 0.50%','$0.50 + 0.50%'],
                      ['KYC Fees (Successful Verification)','$3.00','$3.00','$3.00','$3.00'],
                      ['KYB Fees - Single Business Owner','$7.50','$7.50','$7.50','$7.50'],
                      ['KYB Fees - Multiple Business Owner','$11.50','$11.50','$11.50','$11.50'],
                      ['Domestic Third Party Payments','Included','Included','Included','Included'],
                      ['Bitcoin Lightning','Included','Included','Included','Included'],
                      ['Named ABA Routing Accounts (Set-Up + Maintenance)','$0.50 + $0.20','$0.50 + $0.20','$0.50 + $0.20','$0.50 + $0.20'],
                    ].map(([label, ...vals]) => (
                      <tr key={label}>
                        <TableCell className="font-medium">{label}</TableCell>
                        {vals.slice(0,4).map((v, i) => (
                          <TableCell key={i} className={`text-center ${vals[4] ? 'font-bold text-blue-700' : ''}`}>{v}</TableCell>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Canada */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">🇨🇦 Canada Support</span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">FBO Account Included</span>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">With Crypto Offset — Shown in Canadian Dollars</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr>
                      <TableHeader> </TableHeader>
                      <TableHeader colSpan={4}>BPS Tiers</TableHeader>
                    </tr>
                    <tr>
                      <th className="bg-slate-600 text-white text-xs font-semibold px-3 py-2 text-left border border-slate-500">Min Monthly Fee</th>
                      {['$2,000','$4,000','$6,000','$8,000'].map(v => (
                        <th key={v} className="bg-slate-600 text-white text-xs font-bold px-3 py-2 text-center border border-slate-500">{v}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Stablecoin Conversion - USDC','0.25%','0.20%','0.15%','0.10%',true],
                      ['Crypto Conversion - Bitcoin','0.35%','0.30%','0.25%','0.22%',true],
                      ['USDC Chain Swaps','0.10%','0.10%','0.10%','0.10%',true],
                      ['EFT (Debit)','$0.80','$0.80','$0.80','$0.80'],
                      ['EFT (Credit)','$0.80','$0.80','$0.80','$0.80'],
                      ['Interac E-Transfer (Send / Receive)','$1.50','$1.50','$1.50','$1.50'],
                      ['KYC Fees (Successful Verification)','$3.00','$3.00','$3.00','$3.00'],
                      ['KYB Fees - Single Business Owner','$7.50','$7.50','$7.50','$7.50'],
                      ['KYB Fees - Multiple Business Owner','$11.50','$11.50','$11.50','$11.50'],
                      ['Domestic Third Party Payments','Included','Included','Included','Included'],
                      ['Bitcoin Lightning','Included','Included','Included','Included'],
                    ].map(([label, ...vals]) => (
                      <tr key={label}>
                        <TableCell className="font-medium">{label}</TableCell>
                        {vals.slice(0,4).map((v, i) => (
                          <TableCell key={i} className={`text-center ${vals[4] ? 'font-bold text-red-700' : ''}`}>{v}</TableCell>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── 6. Terms ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <SectionHeader number="6" title="Terms Applicable To All Orders" />
            <ol className="list-decimal list-inside space-y-3 text-sm text-slate-700 leading-relaxed">
              <li>This <strong>Order Form</strong> is made and entered into as of the date of signing, by and between the partner named above ("<strong>Partner</strong>") and <strong>Taper Payer INC</strong>. This <strong>Order Form</strong> is issued under, and subject to, the <strong>Partner Terms</strong> available at: <a href="https://taperpayer.com/legal/partner-terms" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://taperpayer.com/legal/partner-terms</a>, which, altogether are the "<strong>Agreement</strong>".</li>
              <li>Initial funding of <strong>Refundable Deposit Account</strong>: <strong>Partner</strong> shall fund with $10,000 USD.</li>
              <li>Any prior <strong>Order Form</strong> entered into by the parties is superseded and replaced in its entirety by this <strong>Agreement</strong>.</li>
              <li>This <strong>Order Form</strong> is binding and effective upon signing by <strong>Partner</strong> (provided that no changes were made to the provided form of agreement), with billing to start on the <strong>Billing Start Date</strong>.</li>
            </ol>
          </div>

          {/* ── 7. Partner Signature ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <SectionHeader number="7" title="Partner Signature" />
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

          <p className="text-center text-xs text-slate-400 pb-4">
            By submitting, you agree to our <a href="/TaperPayerTerms" className="underline">Terms of Service</a> and <a href="/TaperPayerPrivacy" className="underline">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}