import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function RSAPaymentForm({ phoneNumber, amount, operatorId, countryCode, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rsaToken, setRsaToken] = useState('');
  const [exchangeRate, setExchangeRate] = useState(130);
  const [loadingRate, setLoadingRate] = useState(true);

  // Fetch exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setLoadingRate(true);
        const res = await base44.functions.invoke('getExchangeRate', { from: 'USD', to: 'HTG' });
        if (res.data?.rate && res.data.rate > 0) {
          setExchangeRate(res.data.rate);
        }
      } catch (e) {
        // Silently fall back to default rate
      } finally {
        setLoadingRate(false);
      }
    };

    fetchExchangeRate();
  }, []);

  useEffect(() => {
    // Initialize RSA SDK
    const script = document.createElement('script');
    script.src = 'https://api.rsapay.com/sdk/rsa-sdk.js';
    script.async = true;
    script.onload = () => {
      console.log('RSA SDK loaded');
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleRSAPayment = async () => {
    if (!amount || !phoneNumber) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Initialize RSA payment
      if (window.RSA) {
        window.RSA.checkout({
          amount: parseFloat(amount),
          currency: 'USD',
          description: `Airtime top-up for ${phoneNumber}`,
          onSuccess: async (token) => {
            setRsaToken(token);
            
            // Process payment
            const res = await base44.functions.invoke('processRSAPayment', {
              amount: parseFloat(amount),
              phoneNumber: phoneNumber,
              countryCode: countryCode,
              operatorId: operatorId,
              rsaToken: token,
            });

            if (res.data?.success) {
              onSuccess();
            } else {
              setError(res.data?.error || 'Payment failed');
            }
            setLoading(false);
          },
          onError: (err) => {
            setError(err.message || 'RSA payment failed');
            setLoading(false);
          },
        });
      } else {
        setError('RSA SDK not loaded. Please try again.');
        setLoading(false);
      }
    } catch (e) {
      setError(e.message || 'Payment processing failed');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-slate-700 mb-3">
          <strong>Amount:</strong> ${parseFloat(amount || 0).toFixed(2)}<br />
          <strong>Phone:</strong> {phoneNumber}
        </p>
        <Button
          onClick={handleRSAPayment}
          disabled={loading || !amount || !phoneNumber}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing with RSA...</>
          ) : (
            <>💳 Pay with RSA</>
          )}
        </Button>
      </div>
    </div>
  );
}