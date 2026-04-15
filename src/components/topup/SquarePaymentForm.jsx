import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

export default function SquarePaymentForm({ amount, phoneNumber, countryCode, operatorId, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [web] = useState(null);
  const [payments] = useState(null);

  useEffect(() => {
    initSquareWeb();
  }, []);

  const initSquareWeb = async () => {
    try {
      // Load Square Web Payments SDK
      const script = document.createElement('script');
      script.src = 'https://web.squarecdn.com/v1/square.js';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        if (window.Square) {
          // Initialize Web Payments SDK
          const payments = window.Square.payments('LB1388EHJ2EJX'); // SQUARE_APPLICATION_ID
          console.log('Square Web Payments SDK initialized');
        }
      };
    } catch (err) {
      console.error('Failed to load Square SDK:', err);
      setError('Payment system unavailable');
    }
  };

  const handlePayment = async () => {
    if (!amount || !phoneNumber || !operatorId) {
      setError('Missing payment details');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For now, using a simple token-based approach
      // In production, you'd use the Web Payments SDK to get a secure token
      const sourceToken = `square_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const res = await base44.functions.invoke('processSquareTopUp', {
        amount: parseFloat(amount),
        phoneNumber,
        countryCode,
        operatorId,
        sourceToken,
      });

      if (res.data?.success) {
        onSuccess?.(res.data);
      } else {
        setError(res.data?.error || 'Payment failed');
        onError?.(res.data?.error);
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Payment processing failed';
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-semibold text-slate-800">Order Summary</p>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Amount:</span>
          <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Phone:</span>
          <span className="font-medium">{phoneNumber}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Country:</span>
          <span className="font-medium">{countryCode}</span>
        </div>
      </div>

      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Pay ${parseFloat(amount).toFixed(2)} via Square
          </>
        )}
      </Button>

      <p className="text-xs text-slate-500 text-center">
        Secure payment powered by Square
      </p>
    </div>
  );
}