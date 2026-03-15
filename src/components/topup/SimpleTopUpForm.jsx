import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, AlertCircle, Phone } from 'lucide-react';

const AMOUNTS = [5, 10, 20, 50, 100];

export default function SimpleTopUpForm() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('10');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [detectedOperator, setDetectedOperator] = useState(null);
  const detectTimeout = useRef(null);

  const handlePhoneChange = (value) => {
    setPhone(value);
    setDetectedOperator(null);

    if (detectTimeout.current) clearTimeout(detectTimeout.current);
    
    // Auto-detect operator when phone has enough digits
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 7) {
      detectTimeout.current = setTimeout(async () => {
        try {
          const res = await base44.functions.invoke('detectOperator', {
            phoneNumber: '+509' + digits.slice(-8),
            countryIso: 'HT'
          });
          if (res.data?.operator) {
            setDetectedOperator(res.data.operator);
          }
        } catch (e) {
          // Silent fail
        }
      }, 800);
    }
  };

  const handleSubmit = async () => {
    if (!phone || !amount || !detectedOperator) {
      setError('Please fill in all fields and wait for operator detection.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (paymentMethod === 'moncash') {
        // Store payment details in sessionStorage for callback handling
        const paymentInfo = {
          phone: phone.replace(/\D/g, ''),
          amount: parseFloat(amount),
          operatorId: detectedOperator.operatorId || detectedOperator.id,
          timestamp: Date.now(),
        };
        sessionStorage.setItem('pendingTopupPayment', JSON.stringify(paymentInfo));

        // Initiate Moncash payment
        const res = await base44.functions.invoke('initiateMoncashPayment', {
          amount: parseFloat(amount),
          phoneNumber: '+509' + phone.replace(/\D/g, '').slice(-8),
          countryCode: 'HT',
          operatorId: detectedOperator.operatorId || detectedOperator.id,
          exchangeRate: 130,
        });

        if (res.data?.redirectUrl) {
          window.location.href = res.data.redirectUrl;
        } else {
          setError(res.data?.error || 'Failed to initiate payment');
          setLoading(false);
        }
      } else {
        setError('Card payment coming soon');
        setLoading(false);
      }
    } catch (e) {
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Recharge Sent!</h3>
        <p className="text-slate-600 mb-6">Your ${amount} topup is being processed.</p>
        <Button onClick={() => { setSuccess(false); setStep(1); setPhone(''); setAmount('10'); }}
          className="bg-teal-500 hover:bg-teal-600 text-white">
          Send Another
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Step 1: Phone Number */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Enter Phone Number</h3>
          <Input
            type="tel"
            placeholder="+509 XXXX XXXX"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className="text-lg"
          />
          {detectedOperator && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                ✓ Operator detected: <strong>{detectedOperator.name || detectedOperator.operatorName}</strong>
              </p>
            </div>
          )}
          <Button
            onClick={() => setStep(2)}
            disabled={!phone || !detectedOperator}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 2: Amount Selection */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>← Back</Button>
            <h3 className="text-lg font-bold text-slate-900">Select Amount</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className={`p-3 rounded-lg border font-medium transition-all ${
                  amount === amt.toString()
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-slate-200 text-slate-700 hover:border-teal-300'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
          <Button
            onClick={() => setStep(3)}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 3: Payment Method */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={() => setStep(2)}>← Back</Button>
            <h3 className="text-lg font-bold text-slate-900">Choose Payment</h3>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setPaymentMethod('moncash')}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                paymentMethod === 'moncash'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <p className="font-bold text-slate-900">💳 MonCash</p>
              <p className="text-sm text-slate-600">Fast & secure mobile wallet</p>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              disabled
              className="w-full p-4 rounded-lg border-2 border-slate-100 text-left opacity-50 cursor-not-allowed"
            >
              <p className="font-bold text-slate-900">💳 Cards</p>
              <p className="text-sm text-slate-600">Coming soon</p>
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
            ) : (
              <>Pay ${amount} for {phone}</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}