import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, AlertCircle, Zap } from 'lucide-react';

const COUNTRIES = [
  { name: 'India', iso: 'IN', flag: '🇮🇳', dial: '+91' },
  { name: 'Angola', iso: 'AO', flag: '🇦🇴', dial: '+244' },
  { name: 'Philippines', iso: 'PH', flag: '🇵🇭', dial: '+63' },
  { name: 'Brazil', iso: 'BR', flag: '🇧🇷', dial: '+55' },
  { name: 'Chile', iso: 'CL', flag: '🇨🇱', dial: '+56' },
  { name: 'Mexico', iso: 'MX', flag: '🇲🇽', dial: '+52' },
  { name: 'Kenya', iso: 'KE', flag: '🇰🇪', dial: '+254' },
  { name: 'Nigeria', iso: 'NG', flag: '🇳🇬', dial: '+234' },
  { name: 'Ghana', iso: 'GH', flag: '🇬🇭', dial: '+233' },
  { name: 'Senegal', iso: 'SN', flag: '🇸🇳', dial: '+221' },
  { name: 'Haiti', iso: 'HT', flag: '🇭🇹', dial: '+509' },
  { name: 'Dominican Republic', iso: 'DO', flag: '🇩🇴', dial: '+1' },
];

export default function TpayReloadForm() {
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ method: '' });

  const handlePayment = async () => {
    if (!phoneNumber || !amount || !selectedCountry) {
      setError('Please fill in all fields.');
      return;
    }

    if (!paymentDetails.method) {
      setError('Please select a payment method.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fullPhone = selectedCountry.dial + phoneNumber.replace(/^0/, '');
      const res = await base44.functions.invoke('reloadlyTopUp', {
        phoneNumber: fullPhone,
        amount: parseFloat(amount),
        countryCode: selectedCountry.iso,
        paymentMethod: paymentDetails.method
      });

      if (res.data?.success) {
        setSuccess(true);
      } else {
        setError(res.data?.error || res.data?.message || 'Top-up failed. Please try again.');
      }
    } catch (e) {
      setError('Payment or top-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Top-Up Sent!</h3>
        <p className="text-slate-600 mb-2">Airtime has been sent to {selectedCountry?.dial}{phoneNumber}.</p>
        <p className="text-sm text-slate-500 mb-6">Amount: ${amount} USD</p>
        <Button onClick={() => { setSuccess(false); setStep(1); setPhoneNumber(''); setAmount(''); setPaymentDetails({ method: '' }); }}
          className="bg-teal-500 hover:bg-teal-600 text-white">
          Send Another
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-teal-400 to-teal-500 w-10 h-10 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Tpay Reload</h3>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Select Country</label>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {COUNTRIES.map((c) => (
            <button
              key={c.iso}
              onClick={() => { setSelectedCountry(c); setStep(2); }}
              disabled={loading}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all disabled:opacity-50 ${
                selectedCountry === c ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-400 hover:bg-teal-50'
              }`}
            >
              <span className="text-2xl">{c.flag}</span>
              <span className="text-xs text-slate-700 font-medium leading-tight">{c.name}</span>
            </button>
          ))}
        </div>

        {selectedCountry && step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <button onClick={() => setStep(1)} className="text-sm text-teal-600 hover:underline flex items-center gap-1 mb-4">
              ← {selectedCountry?.flag} {selectedCountry?.name}
            </button>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium">
                  {selectedCountry?.dial}
                </span>
                <Input
                  type="tel"
                  placeholder="Enter number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount (USD)</label>
              <Input
                type="number"
                placeholder="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
              <select
                value={paymentDetails.method}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, method: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="">Select payment method</option>
                <option value="card">Credit/Debit Card</option>
                <option value="wallet">Wallet Balance</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            <Button
              onClick={handlePayment}
              disabled={loading || !phoneNumber || !amount || !paymentDetails.method}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : 'Pay & Send Airtime'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}