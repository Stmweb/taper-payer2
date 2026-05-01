import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Loader2, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';

const MOONPAY_PK = 'pk_live_1aZShnRjeKKdaIahWOGZ5WJCuz8cvum';

const COUNTRY_CONFIG = {
  haiti: {
    flag: '🇭🇹',
    name: 'Haiti',
    currency: 'HTG',
    currencyCode: 'usdc',
    defaultAmount: 200,
    description: 'Send USDC → Delivered to Haiti',
    walletNote: 'Recipient mobile wallet or bank account',
  },
  angola: {
    flag: '🇦🇴',
    name: 'Angola',
    currency: 'AOA',
    currencyCode: 'usdc',
    defaultAmount: 200,
    description: 'Send USDC → Delivered to Angola',
    walletNote: 'Recipient mobile wallet or bank account',
  },
};

export default function MoonPayTransferModal({ isOpen, onClose, country = 'haiti' }) {
  const [step, setStep] = useState('form'); // 'form' | 'widget'
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [widgetUrl, setWidgetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const config = COUNTRY_CONFIG[country] || COUNTRY_CONFIG.haiti;

  useEffect(() => {
    if (!isOpen) {
      setStep('form');
      setRecipientName('');
      setRecipientPhone('');
      setAmount('');
      setWidgetUrl('');
      setError('');
    }
  }, [isOpen]);

  const handleLaunchWidget = async (e) => {
    e.preventDefault();
    if (!recipientName || !recipientPhone || !amount) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const baseUrl = 'https://buy.moonpay.com';
      const params = new URLSearchParams({
        apiKey: MOONPAY_PK,
        currencyCode: config.currencyCode,
        baseCurrencyAmount: amount,
        externalTransactionId: `tp-${country}-${Date.now()}`,
        redirectURL: window.location.origin + '/ThankYou',
      });

      const urlToSign = `${baseUrl}?${params.toString()}`;

      const res = await base44.functions.invoke('moonpaySign', { urlToSign });
      setWidgetUrl(res.data.signedUrl);
      setStep('widget');
    } catch (err) {
      setError('Failed to launch payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative bg-white rounded-t-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
      >
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-2" />
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10 text-slate-500">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{config.flag}</span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Send to {config.name}</h2>
              <p className="text-sm text-slate-500">{config.description}</p>
            </div>
            <img src="https://www.moonpay.com/favicon.ico" alt="MoonPay" className="w-6 h-6 ml-auto rounded" />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleLaunchWidget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Full Name <span className="text-red-500">*</span></label>
                <Input
                  type="text"
                  placeholder="e.g. Jean Pierre"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Phone <span className="text-red-500">*</span></label>
                <Input
                  type="tel"
                  placeholder={country === 'haiti' ? '+509 XXXX XXXX' : '+244 XXX XXX XXX'}
                  value={recipientPhone}
                  onChange={e => setRecipientPhone(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-400 mt-1">{config.walletNote}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (USD) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                  <Input
                    type="number"
                    min="10"
                    step="1"
                    placeholder={config.defaultAmount}
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
                {/* Quick amounts */}
                <div className="flex gap-2 mt-2">
                  {[50, 100, 200, 500].map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAmount(String(a))}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      ${a}
                    </button>
                  ))}
                </div>
              </div>

              {/* How it works */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 space-y-1">
                <p className="font-semibold mb-2">How it works:</p>
                <p>1️⃣ Pay with card or bank via MoonPay</p>
                <p>2️⃣ USDC is purchased on your behalf</p>
                <p>3️⃣ Funds delivered to {config.name} recipient</p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold text-base"
                style={{ backgroundColor: '#2479C2' }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {loading ? 'Preparing...' : `Continue to Pay →`}
              </Button>

              <p className="text-center text-xs text-slate-400">Secured by MoonPay · Bank-grade encryption</p>
            </form>
          )}

          {step === 'widget' && widgetUrl && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
                ✅ Sending <strong>${amount}</strong> to <strong>{recipientName}</strong> ({recipientPhone})
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200" style={{ height: '600px' }}>
                <iframe
                  src={widgetUrl}
                  title="MoonPay"
                  allow="accelerometer; autoplay; camera; gyroscope; payment"
                  className="w-full h-full border-0"
                />
              </div>
              <button
                onClick={() => setStep('form')}
                className="text-sm text-slate-500 hover:text-slate-700 underline w-full text-center"
              >
                ← Back to transfer details
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}