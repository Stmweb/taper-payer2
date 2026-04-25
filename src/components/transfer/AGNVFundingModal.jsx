import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, CreditCard } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const QUICK_AMOUNTS = [25, 50, 100, 250, 500];

export default function AGNVFundingModal({ onSuccess, onClose }) {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useDebitCard, setUseDebitCard] = useState(true);

  const handleQuickSelect = (value) => {
    setAmount(value.toString());
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!useDebitCard) {
      setError('MonCash is coming soon');
      return;
    }

    if (!cardNumber.replace(/\s/g, '') || cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid card number');
      return;
    }

    if (!expiry || expiry.length < 5) {
      setError('Please enter expiry date (MM/YY)');
      return;
    }

    if (!cvv || cvv.length < 3) {
      setError('Please enter CVV');
      return;
    }

    setLoading(true);
    try {
      const res = await base44.functions.invoke('processSquarePayment', {
        amount: parseFloat(amount),
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiry,
        cvv,
      });

      if (res.data.success) {
        onSuccess();
      } else {
        setError(res.data.error || 'Payment failed');
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-100">
          <span className="text-2xl font-bold text-blue-600">+</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Add Funds</h2>
          <p className="text-sm text-slate-500">Fund your AGNV account</p>
        </div>
      </div>

      {/* Payment Method Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setUseDebitCard(true)}
          className={`flex-1 px-4 py-3 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
            useDebitCard
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-400'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          Debit/Credit Cards
        </button>
        <button
          onClick={() => setUseDebitCard(false)}
          className={`flex-1 px-4 py-3 rounded-2xl font-semibold transition-all ${
            !useDebitCard
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-400'
          }`}
        >
          MonCash
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Select */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Quick Select</label>
          <div className="flex gap-2 flex-wrap">
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickSelect(val)}
                className={`px-4 py-2 rounded-2xl font-semibold transition-all border ${
                  amount === val.toString()
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'border-slate-600 text-slate-400 hover:border-slate-500'
                }`}
              >
                ${val}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <Input
              type="number"
              step="0.01"
              min="1"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-8 bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        {/* Card Details */}
        {useDebitCard && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Card Details</label>
            <div className="bg-white rounded-2xl p-4 space-y-3">
              <Input
                type="text"
                placeholder="Card number"
                value={formatCardNumber(cardNumber)}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength="19"
                className="text-slate-900 border-slate-300"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={formatExpiry(expiry)}
                  onChange={(e) => setExpiry(e.target.value)}
                  maxLength="5"
                  className="text-slate-900 border-slate-300"
                />
                <Input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.slice(0, 4))}
                  maxLength="4"
                  className="text-slate-900 border-slate-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-2xl p-4">
          <p className="text-sm text-blue-300">
            <CreditCard className="w-4 h-4 inline mr-2" />
            Enter your card details securely. Your wallet is credited immediately upon successful payment.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || !amount}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
          {loading ? 'Processing...' : `Pay $${parseFloat(amount || 0).toFixed(2)} With Card`}
        </Button>
      </form>
    </div>
  );
}