import React, { useState } from 'react';
import { CheckCircle, MessageSquare, Shield, Phone } from 'lucide-react';

export default function SMSOptIn() {
  const [checked, setChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checked) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">

        {/* ── Brand Header ── */}
        <div className="text-center mb-8">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/6af1701ab_GrokTaperpayer.png"
            alt="Taper Payer"
            className="h-20 w-auto mx-auto mb-3 mix-blend-multiply"
          />
          <h1 className="text-2xl font-bold text-slate-900">Taper Payer SMS Alerts</h1>
          <p className="text-slate-500 text-sm mt-1">Stay informed on every transfer, top-up & payment</p>
        </div>

        {/* ── What You'll Receive ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5 shadow-sm">
          <p className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-green-600" /> What messages will you receive?
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            {[
              '✅ Transfer confirmation & receipt',
              '✅ Mobile top-up delivery status',
              '✅ Payment request notifications',
              '✅ Account security alerts & OTP codes',
            ].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 space-y-1 border border-slate-100">
            <p><strong>Program:</strong> Taper Payer Alerts</p>
            <p><strong>Message Frequency:</strong> Varies based on account activity (typically 2–6 messages/month)</p>
            <p><strong>Cost:</strong> Message & data rates may apply</p>
            <p><strong>To Opt Out:</strong> Reply <strong>STOP</strong> at any time</p>
            <p><strong>For Help:</strong> Reply <strong>HELP</strong> or email <a href="mailto:support@taperpayer.com" className="underline text-blue-600">support@taperpayer.com</a></p>
          </div>
        </div>

        {/* ── Branded Opt-In Form (the "complete example" Twilio requires) ── */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <p className="font-semibold text-slate-800 text-sm">Sign up for SMS notifications</p>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Maria Garcia"
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Mobile Phone Number</label>
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-400">
                <div className="px-3 py-2 bg-slate-50 border-r border-slate-200 text-sm text-slate-500 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> +1
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  required
                  className="flex-1 px-3 py-2 text-sm text-slate-800 focus:outline-none bg-white"
                />
              </div>
            </div>

            {/* ── The critical unchecked opt-in checkbox ── */}
            <label className="flex items-start gap-3 cursor-pointer p-3 bg-green-50 border border-green-200 rounded-xl">
              <input
                type="checkbox"
                checked={checked}
                onChange={e => setChecked(e.target.checked)}
                className="mt-0.5 w-5 h-5 flex-shrink-0 accent-green-600 cursor-pointer"
              />
              <span className="text-slate-700 text-xs leading-relaxed select-none">
                By checking this box, I agree to receive recurring automated SMS text messages from <strong>Taper Payer</strong> (including one-time passcodes, transfer alerts, top-up updates, and payment notifications) at the phone number provided. Consent is not a condition of purchase. Message & data rates may apply. Message frequency varies. Reply <strong>STOP</strong> to unsubscribe or <strong>HELP</strong> for help. View our{' '}
                <a href="/TaperPayerPrivacy" className="text-blue-600 underline">Privacy Policy</a> and{' '}
                <a href="/TaperPayerTerms" className="text-blue-600 underline">Terms of Service</a>.
              </span>
            </label>

            <button
              type="submit"
              disabled={!checked || !phone || !name}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: checked && phone && name ? '#2479C2' : undefined, backgroundColor: '#2479C2' }}
            >
              {checked ? 'Subscribe to SMS Alerts' : 'Check the box above to continue'}
            </button>
          </form>
        ) : (
          <div className="bg-white border border-green-200 rounded-2xl p-8 text-center shadow-sm">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-900 mb-1">You're subscribed!</h2>
            <p className="text-slate-600 text-sm mb-3">
              You'll receive SMS alerts for your Taper Payer account at <strong>{phone}</strong>.
            </p>
            <p className="text-slate-400 text-xs">Reply STOP at any time to unsubscribe · Reply HELP for support</p>
          </div>
        )}

        {/* ── Opt-In Details Table (for Twilio review) ── */}
        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="text-slate-800 font-semibold text-sm mb-2">Opt-In Program Details</h2>
          {[
            { label: 'Business Name', value: 'Taper Payer INC' },
            { label: 'Program Name', value: 'Taper Payer Alerts' },
            { label: 'Opt-In Method', value: 'User-initiated web form — checkbox unchecked by default' },
            { label: 'Use Case', value: 'Transactional notifications & two-factor authentication (OTP)' },
            { label: 'Channels', value: 'SMS' },
            { label: 'Message Frequency', value: 'Varies (typically 2–6 msgs/month)' },
            { label: 'Cost Disclosure', value: 'Message & data rates may apply' },
            { label: 'Opt-Out', value: 'Reply STOP' },
            { label: 'Help', value: 'Reply HELP or support@taperpayer.com' },
            { label: 'Privacy Policy', value: 'taperpayer.com/TaperPayerPrivacy' },
            { label: 'Terms of Service', value: 'taperpayer.com/TaperPayerTerms' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start border-b border-slate-100 pb-2 last:border-0 last:pb-0">
              <span className="text-slate-500 text-xs">{label}</span>
              <span className="text-slate-800 text-xs font-medium text-right max-w-[55%]">{value}</span>
            </div>
          ))}
        </div>

        {/* ── Compliance Note ── */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl mt-5">
          <Shield className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-blue-700 text-xs leading-relaxed">
            Taper Payer collects explicit, affirmative opt-in consent in compliance with TCPA, CTIA guidelines, and WhatsApp Business Policy. The opt-in checkbox is never pre-selected. Consent is not a condition of any purchase or service.
          </p>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          © {new Date().getFullYear()} Taper Payer INC ·{' '}
          <a href="/TaperPayerPrivacy" className="underline">Privacy Policy</a> ·{' '}
          <a href="/TaperPayerTerms" className="underline">Terms</a>
        </p>
      </div>
    </div>
  );
}