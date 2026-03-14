import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function TpayReloadForm() {
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    base44.functions.invoke('reloadlyTopUp', { action: 'getCountries' })
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : [];
        setCountries(list.slice(0, 60));
      })
      .catch(() => setError('Failed to load countries.'))
      .finally(() => setLoading(false));
  }, []);

  const loadOperators = async (country) => {
    setSelectedCountry(country);
    setLoading(true);
    setError('');
    setOperators([]);
    setSelectedOperator(null);
    try {
      const res = await base44.functions.invoke('reloadlyTopUp', {
        action: 'getOperators',
        countryIsoCode: country.isoName
      });
      const list = Array.isArray(res.data) ? res.data : [];
      setOperators(list);
      setStep(2);
    } catch {
      setError('Failed to load operators.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!phoneNumber || !amount || !selectedOperator) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('reloadlyTopUp', {
        action: 'sendTopUp',
        operatorId: selectedOperator.id,
        amount: parseFloat(amount),
        phoneNumber: phoneNumber.replace(/^0/, ''),
        countryCode: selectedCountry.isoName
      });
      if (res.data?.errorCode || res.data?.status === 'FAILED') {
        setError(res.data.message || 'Top-up failed.');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Top-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSuccess(false);
    setStep(1);
    setSelectedCountry(null);
    setSelectedOperator(null);
    setPhoneNumber('');
    setAmount('');
    setError('');
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Top-Up Sent!</h3>
        <p className="text-slate-600 mb-6">Airtime sent to {selectedCountry?.name} +{phoneNumber}.</p>
        <Button onClick={reset} className="bg-cyan-500 hover:bg-cyan-600 text-white">Send Another</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-green-400 to-teal-500 w-10 h-10 rounded-lg flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Tpay Reload</h3>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Step 1: Select Country */}
      {step === 1 && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Select Country</p>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading countries...
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
              {countries.map((c) => (
                <button
                  key={c.isoName}
                  onClick={() => loadOperators(c)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-all text-center"
                >
                  <span className="text-xl">{c.flag || '🌐'}</span>
                  <span className="text-xs text-slate-700 font-medium leading-tight">{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Operator, Phone & Amount */}
      {step === 2 && (
        <div className="space-y-4">
          <button onClick={() => setStep(1)} className="text-sm text-teal-600 hover:underline">
            ← {selectedCountry?.name}
          </button>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Operator</label>
            {operators.length === 0 ? (
              <p className="text-sm text-slate-500">No operators available.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {operators.map((op) => (
                  <button
                    key={op.id}
                    onClick={() => { setSelectedOperator(op); setAmount(''); }}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      selectedOperator?.id === op.id ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    <span className="text-sm font-medium text-slate-800">{op.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedOperator && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount (USD)</label>
              {selectedOperator.suggestedAmounts?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedOperator.suggestedAmounts.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(String(a))}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        amount === String(a) ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      ${a}
                    </button>
                  ))}
                </div>
              ) : (
                <Input
                  type="number"
                  placeholder="Enter amount in USD"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              )}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedOperator || !phoneNumber || !amount}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Processing...</> : 'Send Reload'}
          </Button>
        </div>
      )}
    </div>
  );
}