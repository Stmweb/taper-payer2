import React, { useState } from 'react';
import { CheckCircle, MessageSquare, Shield } from 'lucide-react';

export default function SMSOptIn() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8f5e9' }}>
            <MessageSquare className="w-8 h-8" style={{ color: '#61AF39' }} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">SMS & WhatsApp Opt-In</h1>
          <p className="text-slate-500 text-sm">Proof of Consent — Taper Payer</p>
        </div>

        {/* Consent Card */}
        <div className="border border-slate-200 rounded-2xl p-6 mb-6 bg-slate-50">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#61AF39' }} />
            <div>
              <p className="text-slate-800 font-semibold text-sm mb-1">User-Initiated In-App Opt-In</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                During account registration and before enabling notifications, users explicitly check a box agreeing to receive communications:
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={e => setChecked(e.target.checked)}
                className="mt-0.5 w-5 h-5 flex-shrink-0 accent-green-600 cursor-pointer"
              />
              <p className="text-slate-700 text-sm leading-relaxed select-none">
                I agree to receive SMS and WhatsApp notifications about payments, top-ups, and account activity from <strong>Taper Payer</strong>. Message & data rates may apply. Reply STOP to unsubscribe at any time.
              </p>
            </label>
            {checked && (
              <p className="mt-3 text-green-700 text-xs font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Consent recorded
              </p>
            )}
          </div>
        </div>

        {/* Opt-In Details */}
        <div className="space-y-4 mb-6">
          <h2 className="text-slate-800 font-semibold text-base">Opt-In Details</h2>

          {[
            { label: 'Opt-In Type', value: 'User-initiated — checkbox is NOT pre-selected; user must actively check to consent' },
            { label: 'Channels', value: 'SMS and WhatsApp' },
            { label: 'Message Types', value: 'Payment requests, top-up requests, account activity alerts' },
            { label: 'Business Name', value: 'Taper Payer' },
            { label: 'Opt-Out Instructions', value: 'Reply STOP to unsubscribe at any time' },
            { label: 'Support Contact', value: 'support@taperpayer.com' },
            { label: 'Privacy Policy', value: 'taperpayer.com/TaperPayerPrivacy' },
            { label: 'Terms of Service', value: 'taperpayer.com/TaperPayerTerms' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start border-b border-slate-100 pb-3">
              <span className="text-slate-500 text-sm">{label}</span>
              <span className="text-slate-800 text-sm font-medium text-right max-w-[55%]">{value}</span>
            </div>
          ))}
        </div>

        {/* Compliance Note */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-blue-700 text-xs leading-relaxed">
            Taper Payer collects explicit opt-in consent in compliance with TCPA, CTIA guidelines, and WhatsApp Business Policy. Consent is collected prior to sending any marketing or transactional messages.
          </p>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          © {new Date().getFullYear()} Taper Payer · <a href="/TaperPayerPrivacy" className="underline">Privacy Policy</a> · <a href="/TaperPayerTerms" className="underline">Terms</a>
        </p>
      </div>
    </div>
  );
}