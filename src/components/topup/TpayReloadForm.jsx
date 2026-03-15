import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, AlertCircle, Zap, Lock, Search } from 'lucide-react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import MoncashPaymentForm from './MoncashPaymentForm';

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
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [detectingOperator, setDetectingOperator] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cardError, setCardError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'moncash', or 'rsa'
  const detectTimeout = useRef(null);
  const stripe = useStripe();
  const elements = useElements();

  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
    setSelectedOperator(null);

    // Only auto-detect when we have enough digits
    const digits = value.replace(/\D/g, '');
    if (digits.length < 7 || !selectedCountry) return;

    if (detectTimeout.current) clearTimeout(detectTimeout.current);
    detectTimeout.current = setTimeout(async () => {
      setDetectingOperator(true);
      try {
        const fullPhone = selectedCountry.dial + digits.replace(/^0/, '');
        const res = await base44.functions.invoke('detectOperator', {
          phoneNumber: fullPhone,
          countryIso: selectedCountry.iso
        });
        if (res.data?.operator) {
          setSelectedOperator(res.data.operator);
        }
      } catch (e) {
        // Silent fail — user can still manually pick
      } finally {
        setDetectingOperator(false);
      }
    }, 800);
  };

  const loadOperators = async (country) => {
    setSelectedCountry(country);
    setLoading(true);
    setError('');
    setOperators([]);
    setSelectedOperator(null);
    try {
      const res = await base44.functions.invoke('getReloadlyProducts', { countryIso: country.iso });
      setOperators(res.data?.data || res.data?.operators || []);
      setStep(2);
    } catch (e) {
      setError('Failed to load operators. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!phoneNumber || !amount || !selectedCountry || !selectedOperator) {
      setError('Please fill in all fields.');
      return;
    }

    if (!stripe || !elements) {
      setError('Payment system is loading. Please wait and try again.');
      return;
    }

    setLoading(true);
    setError('');
    setCardError('');

    try {
      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement
      });

      if (error) {
        setCardError(error.message);
        setLoading(false);
        return;
      }

      // Process payment and topup
      const fullPhone = selectedCountry.dial + phoneNumber.replace(/^0/, '');
      const res = await base44.functions.invoke('processReloadlyPayment', {
        paymentMethodId: paymentMethod.id,
        phoneNumber: fullPhone,
        amount: parseFloat(amount),
        countryCode: selectedCountry.iso,
        operatorId: selectedOperator?.operatorId || selectedOperator?.id
      });

      if (res.data?.success) {
        setSuccess(true);
      } else {
        setError(res.data?.error || 'Transaction failed. Please try again.');
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
        <Button onClick={() => { setSuccess(false); setStep(1); setPhoneNumber(''); setAmount(''); setPaymentMethod('card'); }}
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
          <h3 className="text-xl font-bold text-slate-900">Tpay Mobile</h3>
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
              onClick={() => loadOperators(c)}
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
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="flex-1"
                />
              </div>
              {detectingOperator && (
                <p className="text-xs text-teal-600 mt-1 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Detecting operator...
                </p>
              )}
              {!detectingOperator && selectedOperator && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Detected: <strong>{selectedOperator.name || selectedOperator.operatorName}</strong>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Operator {selectedOperator ? <span className="text-teal-600 font-normal">(auto-detected — change if needed)</span> : ''}
              </label>
              {operators.length === 0 ? (
                <p className="text-sm text-slate-500">No operators available for this country.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {operators.map((op, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedOperator(op)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                        selectedOperator?.operatorId === op.operatorId || selectedOperator?.id === op.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-800">{op.name || op.operatorName}</span>
                    </button>
                  ))}
                </div>
              )}
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



            {paymentMethod === 'card' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Card Details</label>
                <div className="p-3 border border-slate-200 rounded-lg bg-white">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '14px',
                          color: '#1e293b',
                          '::placeholder': {
                            color: '#cbd5e1'
                          }
                        },
                        invalid: {
                          color: '#dc2626'
                        }
                      }
                    }}
                  />
                </div>
                {cardError && (
                  <p className="text-red-600 text-sm mt-2">{cardError}</p>
                )}
              </div>
            )}

            {paymentMethod === 'moncash' && selectedCountry?.iso === 'HT' && (
              <MoncashPaymentForm
                phoneNumber={`${selectedCountry?.dial}${phoneNumber}`}
                amount={amount}
                operatorId={selectedOperator?.operatorId || selectedOperator?.id}
                countryCode={selectedCountry?.iso}
                onSuccess={() => setSuccess(true)}
              />
            )}



            {paymentMethod === 'card' && (
              <Button
                onClick={handlePayment}
                disabled={loading || !phoneNumber || !amount || !selectedOperator || !stripe}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
                ) : (
                  <><Lock className="w-4 h-4 mr-2" /> Pay ${parseFloat(amount || 0).toFixed(2)} & Send Airtime</>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}