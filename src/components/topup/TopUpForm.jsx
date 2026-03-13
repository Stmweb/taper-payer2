import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function TopUpForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [countryCode, setCountryCode] = useState('NG');
  const [operatorId, setOperatorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!phoneNumber || !amount || !operatorId) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await base44.functions.invoke('processTopUp', {
        phoneNumber,
        amount: parseFloat(amount),
        countryCode,
        operatorId,
      });

      if (response.data.success) {
        setSuccess(true);
        setTransactionId(response.data.transaction.id);
        setPhoneNumber('');
        setAmount('');
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(response.data.error || 'Transaction failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to process topup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Top Up Your Mobile</h2>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-900">Top-up successful!</p>
            <p className="text-sm text-green-700">Transaction ID: {transactionId}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+234 8012345678"
            disabled={loading}
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
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Country Code</label>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="NG">Nigeria (NG)</option>
            <option value="GH">Ghana (GH)</option>
            <option value="KE">Kenya (KE)</option>
            <option value="SN">Senegal (SN)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Operator</label>
          <Input
            type="text"
            value={operatorId}
            onChange={(e) => setOperatorId(e.target.value)}
            placeholder="e.g., MTN, Airtel, Vodafone"
            disabled={loading}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Top Up Now'
          )}
        </Button>
      </form>
    </Card>
  );
}