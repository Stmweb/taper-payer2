import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function MoncashPaymentForm({ phoneNumber, amount, operatorId, countryCode, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [moncashToken, setMoncashToken] = useState('');
  const [success, setSuccess] = useState(false);

  // Initialize Moncash when component mounts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sandbox.moncash.ht/js/moncash-sdk.js'; // Use sandbox for testing
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleMoncashPayment = async () => {
    if (!moncashToken) {
      setError('Please complete Moncash payment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await base44.functions.invoke('processMoncashPayment', {
        amount: parseFloat(amount),
        phoneNumber: phoneNumber,
        countryCode: countryCode,
        operatorId: operatorId,
        moncashToken: moncashToken,
      });

      if (res.data?.success) {
        setSuccess(true);
        onSuccess?.();
      } else {
        setError(res.data?.error || 'Payment failed');
      }
    } catch (e) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
        <p className="text-slate-600 mb-2">Airtime has been sent to {phoneNumber}.</p>
        <p className="text-sm text-slate-500">Amount: {amount} HTG</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-slate-700">
          <strong>Amount:</strong> {amount} HTG to {phoneNumber}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Moncash iframe will be injected here */}
      <div id="moncash-container" className="border border-slate-200 rounded-lg p-4 bg-slate-50">
        <p className="text-sm text-slate-500 text-center py-8">Loading Moncash payment...</p>
      </div>

      <Button
        onClick={handleMoncashPayment}
        disabled={loading || !moncashToken}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
        ) : (
          'Complete Payment'
        )}
      </Button>
    </div>
  );
}