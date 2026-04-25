import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, CreditCard } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const QUICK_AMOUNTS = [25, 50, 100, 250, 500];

export default function AGNVFundingModal({ onSuccess, onClose }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [squareReady, setSquareReady] = useState(false);
  const [web, setWeb] = useState(null);
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    const loadSquare = async () => {
      try {
        const appId = await base44.functions.invoke('getSquareConfig', {});
        const squareAppId = appId.data.squareApplicationId;
        
        if (window.Square) {
          const payments = window.Square.payments(squareAppId);
          setPaymentRequest(payments);
          setWeb(payments);
          setSquareReady(true);
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://web.squarecdn.com/v1/square.js';
        script.onload = async () => {
          const payments = window.Square.payments(squareAppId);
          setPaymentRequest(payments);
          setWeb(payments);
          setSquareReady(true);
        };
        document.head.appendChild(script);
      } catch (err) {
        setError('Failed to load payment processor');
      }
    };
    loadSquare();
  }, []);

  const handleQuickSelect = (value) => {
    setAmount(value.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!paymentRequest) {
      setError('Payment processor not ready');
      return;
    }

    setLoading(true);
    try {
      // Create card payment method
      const cardPayments = await paymentRequest.cardPayments();
      const result = await cardPayments.requestCardDetails({
        billingContact: {
          addressLines: [''],
          city: '',
          state: '',
          postalCode: '',
          countryCode: 'US',
        },
      });

      if (result.status === 'OK') {
        const { token } = result.details;
        
        // Send token to backend
        const res = await base44.functions.invoke('processSquarePayment', {
          amount: parseFloat(amount),
          sourceToken: token,
        });

        if (res.data.success) {
          onSuccess(parseFloat(amount));
        } else {
          setError(res.data.error || 'Payment failed');
        }
      } else {
        setError('Card details collection cancelled');
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 w-full max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e3f2fd' }}>
          <span className="text-2xl font-bold" style={{ color: '#3D7BB7' }}>+</span>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">Add Funds</h2>
          <p className="text-sm text-slate-500">Fund your AGNV account</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        {/* Quick Select */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Quick Select</label>
          <div className="grid grid-cols-3 gap-2 md:flex md:gap-2 md:flex-wrap">
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickSelect(val)}
                className={`px-3 md:px-4 py-2 rounded-lg font-semibold transition-all border text-sm md:text-base ${
                  amount === val.toString()
                    ? 'text-white border-transparent'
                    : 'border-slate-300 text-slate-600 hover:border-slate-400'
                }`}
                style={amount === val.toString() ? { backgroundColor: '#3D7BB7', borderColor: '#3D7BB7' } : {}}
              >
                ${val}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
            <Input
              type="number"
              step="0.01"
              min="1"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-8 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="rounded-2xl p-4 border" style={{ backgroundColor: '#e3f2fd', borderColor: '#3D7BB7' }}>
          <p className="text-sm flex items-start gap-2" style={{ color: '#3D7BB7' }}>
            <CreditCard className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Click Pay to securely enter card details. Your wallet is credited immediately upon successful payment.</span>
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || !amount || !squareReady}
          className="w-full text-white py-3 md:py-4 text-base md:text-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: '#3D7BB7' }}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
          {loading ? 'Processing...' : `Pay $${parseFloat(amount || 0).toFixed(2)}`}
        </Button>
      </form>
    </div>
  );
}