import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, CreditCard } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const QUICK_AMOUNTS = [25, 50, 100, 250, 500];

export default function AGNVFundingModal({ onSuccess, onClose }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [card, setCard] = useState(null);

  useEffect(() => {
    loadSquareSDK();
  }, []);

  const loadSquareSDK = async () => {
    try {
      // Check if Square is already loaded
      if (window.Square) {
        await initializeCard();
        return;
      }

      // Load Square SDK script
      const script = document.createElement('script');
      script.src = 'https://web.squarecdn.com/v1/square.js';
      script.async = true;
      script.onload = initializeCard;
      script.onerror = () => setError('Failed to load Square SDK');
      document.head.appendChild(script);
    } catch (err) {
      setError('Failed to initialize: ' + err.message);
    }
  };

  const initializeCard = async () => {
    try {
      // Get Square app configuration
      const config = await base44.functions.invoke('getSquareConfig', {});
      
      if (config.data.error) {
        setError(config.data.error);
        return;
      }

      const appId = config.data.squareApplicationId;
      if (!appId) {
        setError('Square configuration missing');
        return;
      }

      // Initialize Square payments
      const payments = window.Square.payments(appId);
      
      // Create and attach card element
      const cardPaymentMethod = await payments.card();
      await cardPaymentMethod.attach('#card-container');
      setCard(cardPaymentMethod);
    } catch (err) {
      setError('Payment setup failed: ' + (err.message || err));
    }
  };

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

    if (!card) {
      setError('Payment processor not ready. Please refresh and try again.');
      return;
    }

    setLoading(true);
    try {
      // Tokenize the card
      const result = await card.tokenize();

      if (result.status !== 'OK') {
        setError(result.errors?.[0]?.message || 'Card validation failed');
        setLoading(false);
        return;
      }

      // Send token to backend for payment
      const paymentRes = await base44.functions.invoke('processSquarePayment', {
        amount: parseFloat(amount),
        sourceToken: result.token,
      });

      if (paymentRes.data.success) {
        onSuccess(parseFloat(amount));
      } else {
        setError(paymentRes.data.error || 'Payment failed');
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

        {/* Card Input Container */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Card Details</label>
          <div id="card-container" className="border border-slate-300 rounded-lg p-4 bg-white min-h-[60px]"></div>
        </div>

        {/* Info Box */}
        <div className="rounded-2xl p-4 border" style={{ backgroundColor: '#e3f2fd', borderColor: '#3D7BB7' }}>
          <p className="text-sm flex items-start gap-2" style={{ color: '#3D7BB7' }}>
            <CreditCard className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Your card details are securely tokenized. Your wallet is credited immediately upon successful payment.</span>
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || !amount || !card}
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