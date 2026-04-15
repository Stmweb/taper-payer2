import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SquarePaymentForm from './SquarePaymentForm';

const COUNTRIES = [
  { name: 'Nigeria', code: 'NG', dial: '+234' },
  { name: 'Ghana', code: 'GH', dial: '+233' },
  { name: 'Kenya', code: 'KE', dial: '+254' },
  { name: 'Senegal', code: 'SN', dial: '+221' },
];

export default function TopUpForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [countryCode, setCountryCode] = useState('NG');
  const [operatorId, setOperatorId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber || !amount || !operatorId) {
      setError('Please fill in all required fields');
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = (data) => {
    setSuccess(true);
    setPaymentId(data.paymentId);
    setPhoneNumber('');
    setAmount('');
    setOperatorId('');
    setShowPayment(false);
    setTimeout(() => setSuccess(false), 5000);
  };

  const handlePaymentError = (err) => {
    setError(err || 'Payment failed');
    setShowPayment(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Top Up Your Mobile</h2>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-900">Top-up successful!</p>
            <p className="text-sm text-green-700">Payment ID: {paymentId}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {showPayment ? (
        <SquarePaymentForm
          amount={amount}
          phoneNumber={phoneNumber}
          countryCode={countryCode}
          operatorId={operatorId}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+234 8012345678"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Amount (USD)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name} ({c.dial})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Operator</label>
            <Input
              type="text"
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
              placeholder="e.g., MTN, Airtel, Vodafone"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2"
          >
            Continue to Payment
          </Button>
        </form>
      )}
    </Card>
  );
}