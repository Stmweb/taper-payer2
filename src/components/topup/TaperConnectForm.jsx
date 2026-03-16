import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, AlertCircle, Wifi, Lock } from 'lucide-react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import MoncashPaymentForm from './MoncashPaymentForm';

const COUNTRIES = [
  { name: 'Ghana', iso: 'GH', flag: '🇬🇭', dial: '+233' },
  { name: 'Nigeria', iso: 'NG', flag: '🇳🇬', dial: '+234' },
  { name: 'Kenya', iso: 'KE', flag: '🇰🇪', dial: '+254' },
  { name: 'Senegal', iso: 'SN', flag: '🇸🇳', dial: '+221' },
  { name: 'Mexico', iso: 'MX', flag: '🇲🇽', dial: '+52' },
  { name: 'Haiti', iso: 'HT', flag: '🇭🇹', dial: '+509' },
  { name: 'Dominican Republic', iso: 'DO', flag: '🇩🇴', dial: '+1' },
  { name: 'Angola', iso: 'AO', flag: '🇦🇴', dial: '+244' },
  { name: 'Morocco', iso: 'MA', flag: '🇲🇦', dial: '+212' },
];

export default function TaperConnectForm() {
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cardError, setCardError] = useState('');
  const [success, setSuccess] = useState(false);
  const [detectedOperator, setDetectedOperator] = useState(null); // { id, name }
  const [detectingOperator, setDetectingOperator] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const detectTimeout = useRef(null);
  const stripe = useStripe();
  const elements = useElements();

  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
    setDetectedOperator(null);
    if (detectTimeout.current) clearTimeout(detectTimeout.current);
    const digits = value.replace(/\D/g, '');
    if (digits.length < 7 || !selectedCountry) return;
    detectTimeout.current = setTimeout(async () => {
      setDetectingOperator(true);
      try {
        const fullPhone = selectedCountry.dial + digits.replace(/^0/, '');
        const res = await base44.functions.invoke('dtoneTopUp', {
          action: 'lookupOperator',
          phoneNumber: fullPhone,
        });
        // DTone returns a direct array of operators
        const ops = Array.isArray(res.data) ? res.data : (res.data?.operators || []);
        const identified = ops.find(o => o.identified) || ops[0];
        if (identified) setDetectedOperator({ id: identified.id, name: identified.name });
      } catch (e) { /* silent */ } finally {
        setDetectingOperator(false);
      }
    }, 800);
  };

  const loadProducts = async (country) => {
    setSelectedCountry(country);
    setDetectedOperator(null);
    setLoading(true);
    setError('');
    setProducts([]);
    setSelectedProduct(null);
    setPaymentMethod('card');
    try {
      const res = await base44.functions.invoke('dtoneTopUp', { action: 'getProducts', countryIso: country.iso });
      const items = Array.isArray(res.data) ? res.data : (res.data?.products || res.data?.data || []);
      setProducts(items);
      setStep(2);
    } catch (e) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async () => {
    if (!phoneNumber || !selectedProduct) {
      setError('Please enter a phone number and select a product.');
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
      const { error: stripeError, paymentMethod: pm } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setCardError(stripeError.message);
        setLoading(false);
        return;
      }

      const localDigits = phoneNumber.replace(/^0/, '').replace(/\D/g, '');
      const fullPhone = selectedCountry.dial + localDigits;
      const retailAmount = selectedProduct?.prices?.retail?.amount ?? selectedProduct?.suggested_amounts?.[0] ?? selectedProduct?.face_value;

      const paymentRes = await base44.functions.invoke('processDtonePayment', {
        paymentMethodId: pm.id,
        fullPhone,
        amount: retailAmount,
        productId: selectedProduct?.id,
      });

      if (paymentRes.data?.success) {
        setSuccess(true);
      } else {
        setError(paymentRes.data?.error || 'Transaction failed. Please try again.');
      }
    } catch (e) {
      setError('Payment or top-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setSelectedCountry(null);
    setPhoneNumber('');
    setProducts([]);
    setSelectedProduct(null);
    setSuccess(false);
    setError('');
    setCardError('');
    setPaymentMethod('card');
    setDetectedOperator(null);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Top-Up Sent!</h3>
        <p className="text-slate-600 mb-6">Airtime has been sent to {selectedCountry?.dial}{phoneNumber}.</p>
        <Button onClick={reset} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          Send Another
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-cyan-400 to-blue-500 w-10 h-10 rounded-lg flex items-center justify-center">
          <Wifi className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Taper Connect</h3>
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
          <div className="grid grid-cols-3 gap-2">
            {COUNTRIES.map((c) => (
              <button
                key={c.iso}
                onClick={() => loadProducts(c)}
                disabled={loading}
                className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50 transition-all text-center disabled:opacity-50"
              >
                <span className="text-2xl">{c.flag}</span>
                <span className="text-xs text-slate-700 font-medium leading-tight">{c.name}</span>
              </button>
            ))}
          </div>
          {loading && (
            <div className="flex items-center justify-center gap-2 mt-4 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading products...
            </div>
          )}
        </div>
      )}

      {/* Step 2: Phone + Product + Payment */}
      {step === 2 && (
        <div className="space-y-4">
          <button onClick={() => setStep(1)} className="text-sm text-cyan-600 hover:underline flex items-center gap-1">
            ← {selectedCountry?.flag} {selectedCountry?.name}
          </button>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium whitespace-nowrap">
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
              <p className="text-xs text-cyan-600 mt-1 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Detecting operator...
              </p>
            )}
            {!detectingOperator && detectedOperator && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Detected: <strong>{detectedOperator.name}</strong> — showing matching plans
              </p>
            )}
            {!detectingOperator && !detectedOperator && phoneNumber.replace(/\D/g, '').length >= 7 && (
              <p className="text-xs text-amber-600 mt-1">Could not detect operator — showing all plans</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Plan {detectedOperator && <span className="text-cyan-600 font-normal">({detectedOperator.name})</span>}
            </label>
            {products.length === 0 ? (
              <p className="text-sm text-slate-500">No products available for this country.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {(detectedOperator
                  ? products.filter(p => p.operator?.id === detectedOperator.id)
                  : products
                ).map((p, idx) => {
                  const name = p.name || p.description || String(p.id);
                  const amount = p.prices?.retail?.amount ?? p.suggested_amounts?.[0] ?? p.face_value;
                  const currency = p.prices?.retail?.currency_iso_code || p.send_currency_iso || 'USD';
                  const destAmount = p.destination?.amount;
                  const destUnit = p.destination?.unit;
                  const isTooSmall = amount != null && Number(amount) < 0.50;
                  return (
                    <button
                      key={idx}
                      onClick={() => !isTooSmall && setSelectedProduct(p)}
                      disabled={isTooSmall}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                        isTooSmall
                          ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                          : selectedProduct === p
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-slate-200 hover:border-cyan-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-800">{name}</span>
                        {amount != null && <span className="text-sm font-bold text-cyan-600">{currency} {Number(amount).toFixed(2)}</span>}
                      </div>
                      {destAmount && <p className="text-xs text-slate-500 mt-0.5">Delivers: {destAmount} {destUnit}</p>}
                      {isTooSmall && <p className="text-xs text-red-400 mt-0.5">Min. $0.50 required</p>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  paymentMethod === 'card' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-slate-200 text-slate-700 hover:border-cyan-300'
                }`}
              >
                💳 Credit/Debit Card
              </button>
              {selectedCountry?.iso === 'HT' && (
                <button
                  onClick={() => setPaymentMethod('moncash')}
                  className={`flex-1 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    paymentMethod === 'moncash' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700 hover:border-blue-300'
                  }`}
                >
                  🇭🇹 MonCash
                </button>
              )}
            </div>
          </div>

          {/* Card Payment */}
          {paymentMethod === 'card' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Card Details</label>
                <div className="p-3 border border-slate-200 rounded-lg bg-white">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '14px',
                          color: '#1e293b',
                          '::placeholder': { color: '#cbd5e1' },
                        },
                        invalid: { color: '#dc2626' },
                      },
                    }}
                  />
                </div>
                {cardError && <p className="text-red-600 text-sm mt-2">{cardError}</p>}
              </div>
              <Button
                onClick={handleCardPayment}
                disabled={loading || !phoneNumber || !selectedProduct || !stripe}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
                ) : (
                  <><Lock className="w-4 h-4 mr-2" /> Pay ${selectedProduct?.prices?.retail?.amount?.toFixed(2) || '—'} & Send Airtime</>
                )}
              </Button>
            </>
          )}

          {/* MonCash (Haiti only) */}
          {paymentMethod === 'moncash' && selectedCountry?.iso === 'HT' && (() => {
            const retailAmount = selectedProduct?.prices?.retail?.amount
              || selectedProduct?.suggested_amounts?.[0]
              || selectedProduct?.face_value;
            return (
              <MoncashPaymentForm
                phoneNumber={selectedCountry.dial + phoneNumber.replace(/^0/, '')}
                amount={retailAmount?.toString() || ''}
                operatorId={selectedProduct?.operator?.id}
                countryCode={selectedCountry.iso}
                onSuccess={() => setSuccess(true)}
              />
            );
          })()}
        </div>
      )}
    </div>
  );
}