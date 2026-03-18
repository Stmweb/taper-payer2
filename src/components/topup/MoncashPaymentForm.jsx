import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function MoncashPaymentForm({ phoneNumber, amount, operatorId, countryCode, productId, isFromDing, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(130);
  const [loadingRate, setLoadingRate] = useState(true);

  // Use DTone for Haiti (no separate exchange rate needed)
  useEffect(() => {
    setLoadingRate(false);
  }, []);



  const handleMoncashPayment = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await base44.functions.invoke('initiateMoncashPayment', {
        amount: parseFloat(amount),
        phoneNumber: phoneNumber,
        countryCode: countryCode,
        operatorId: operatorId,
        productId: productId,
        exchangeRate: exchangeRate,
      });

      if (res.data?.redirectUrl) {
        // Redirect to Moncash payment gateway
        window.location.href = res.data.redirectUrl;
      } else {
        setError(res.data?.error || 'Failed to initiate payment');
        setLoading(false);
      }
    } catch (e) {
      setError('Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
        <p className="text-slate-600 mb-2">Airtime has been sent to {phoneNumber}.</p>
        <p className="text-sm text-slate-500">Amount: ${amount} USD = {(parseFloat(amount) * exchangeRate).toFixed(2)} HTG</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-1">
        <p className="text-sm text-slate-700">
          <strong>Plan Amount:</strong> ${parseFloat(amount).toFixed(2)} USD
        </p>
        {loadingRate ? (
          <p className="text-xs text-slate-500">Fetching current exchange rate...</p>
        ) : (
          <p className="text-sm text-slate-700">
            <strong>Equivalent:</strong> {(parseFloat(amount) * exchangeRate).toFixed(2)} HTG
            <span className="text-xs text-slate-400 ml-1">(rate: {exchangeRate} HTG/USD)</span>
          </p>
        )}
        <p className="text-sm text-slate-700"><strong>To:</strong> {phoneNumber}</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <Button
        onClick={handleMoncashPayment}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Redirecting to MonCash...</>
        ) : (
          <img src="https://moncashbutton.digicelgroup.com/Moncash-middleware/resources/assets/images/MC_button.png" alt="Pay with MonCash" className="h-8 w-auto" />
        )}
      </Button>
    </div>
  );
}