import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, AlertCircle, Wifi, Lock, Search, X } from 'lucide-react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import MoncashPaymentForm from './MoncashPaymentForm';

const COUNTRIES = [
  { name: 'Nigeria', iso: 'NG', flag: '🇳🇬', dial: '+234' },
  { name: 'Ghana', iso: 'GH', flag: '🇬🇭', dial: '+233' },
  { name: 'Kenya', iso: 'KE', flag: '🇰🇪', dial: '+254' },
  { name: 'Tanzania', iso: 'TZ', flag: '🇹🇿', dial: '+255' },
  { name: 'Uganda', iso: 'UG', flag: '🇺🇬', dial: '+256' },
  { name: 'Ethiopia', iso: 'ET', flag: '🇪🇹', dial: '+251' },
  { name: 'Rwanda', iso: 'RW', flag: '🇷🇼', dial: '+250' },
  { name: 'Senegal', iso: 'SN', flag: '🇸🇳', dial: '+221' },
  { name: 'Ivory Coast', iso: 'CI', flag: '🇨🇮', dial: '+225' },
  { name: 'Mali', iso: 'ML', flag: '🇲🇱', dial: '+223' },
  { name: 'Burkina Faso', iso: 'BF', flag: '🇧🇫', dial: '+226' },
  { name: 'Angola', iso: 'AO', flag: '🇦🇴', dial: '+244' },
  { name: 'Cameroon', iso: 'CM', flag: '🇨🇲', dial: '+237' },
  { name: 'Benin', iso: 'BJ', flag: '🇧🇯', dial: '+229' },
  { name: 'Chad', iso: 'TD', flag: '🇹🇩', dial: '+235' },
  { name: 'Congo', iso: 'CG', flag: '🇨🇬', dial: '+242' },
  { name: 'Gabon', iso: 'GA', flag: '🇬🇦', dial: '+241' },
  { name: 'South Africa', iso: 'ZA', flag: '🇿🇦', dial: '+27' },
  { name: 'Zimbabwe', iso: 'ZW', flag: '🇿🇼', dial: '+263' },
  { name: 'Zambia', iso: 'ZM', flag: '🇿🇲', dial: '+260' },
  { name: 'Botswana', iso: 'BW', flag: '🇧🇼', dial: '+267' },
  { name: 'Namibia', iso: 'NA', flag: '🇳🇦', dial: '+264' },
  { name: 'Mauritius', iso: 'MU', flag: '🇲🇺', dial: '+230' },
  { name: 'Morocco', iso: 'MA', flag: '🇲🇦', dial: '+212' },
  { name: 'Tunisia', iso: 'TN', flag: '🇹🇳', dial: '+216' },
  { name: 'Algeria', iso: 'DZ', flag: '🇩🇿', dial: '+213' },
  { name: 'Egypt', iso: 'EG', flag: '🇪🇬', dial: '+20' },
  { name: 'India', iso: 'IN', flag: '🇮🇳', dial: '+91' },
  { name: 'Pakistan', iso: 'PK', flag: '🇵🇰', dial: '+92' },
  { name: 'Bangladesh', iso: 'BD', flag: '🇧🇩', dial: '+880' },
  { name: 'Sri Lanka', iso: 'LK', flag: '🇱🇰', dial: '+94' },
  { name: 'Philippines', iso: 'PH', flag: '🇵🇭', dial: '+63' },
  { name: 'Indonesia', iso: 'ID', flag: '🇮🇩', dial: '+62' },
  { name: 'Thailand', iso: 'TH', flag: '🇹🇭', dial: '+66' },
  { name: 'Vietnam', iso: 'VN', flag: '🇻🇳', dial: '+84' },
  { name: 'Malaysia', iso: 'MY', flag: '🇲🇾', dial: '+60' },
  { name: 'Singapore', iso: 'SG', flag: '🇸🇬', dial: '+65' },
  { name: 'Saudi Arabia', iso: 'SA', flag: '🇸🇦', dial: '+966' },
  { name: 'United Arab Emirates', iso: 'AE', flag: '🇦🇪', dial: '+971' },
  { name: 'Qatar', iso: 'QA', flag: '🇶🇦', dial: '+974' },
  { name: 'Kuwait', iso: 'KW', flag: '🇰🇼', dial: '+965' },
  { name: 'Bahrain', iso: 'BH', flag: '🇧🇭', dial: '+973' },
  { name: 'Oman', iso: 'OM', flag: '🇴🇲', dial: '+968' },
  { name: 'Jamaica', iso: 'JM', flag: '🇯🇲', dial: '+1876' },
  { name: 'Dominican Republic', iso: 'DO', flag: '🇩🇴', dial: '+1' },
  { name: 'Haiti', iso: 'HT', flag: '🇭🇹', dial: '+509' },
  { name: 'Trinidad and Tobago', iso: 'TT', flag: '🇹🇹', dial: '+1868' },
  { name: 'Barbados', iso: 'BB', flag: '🇧🇧', dial: '+1246' },
  { name: 'Honduras', iso: 'HN', flag: '🇭🇳', dial: '+504' },
  { name: 'El Salvador', iso: 'SV', flag: '🇸🇻', dial: '+503' },
  { name: 'Guatemala', iso: 'GT', flag: '🇬🇹', dial: '+502' },
  { name: 'Nicaragua', iso: 'NI', flag: '🇳🇮', dial: '+505' },
  { name: 'Costa Rica', iso: 'CR', flag: '🇨🇷', dial: '+506' },
  { name: 'Panama', iso: 'PA', flag: '🇵🇦', dial: '+507' },
  { name: 'Colombia', iso: 'CO', flag: '🇨🇴', dial: '+57' },
  { name: 'Venezuela', iso: 'VE', flag: '🇻🇪', dial: '+58' },
  { name: 'Peru', iso: 'PE', flag: '🇵🇪', dial: '+51' },
  { name: 'Ecuador', iso: 'EC', flag: '🇪🇨', dial: '+593' },
  { name: 'Bolivia', iso: 'BO', flag: '🇧🇴', dial: '+591' },
  { name: 'Chile', iso: 'CL', flag: '🇨🇱', dial: '+56' },
  { name: 'Argentina', iso: 'AR', flag: '🇦🇷', dial: '+54' },
  { name: 'Brazil', iso: 'BR', flag: '🇧🇷', dial: '+55' },
  { name: 'Paraguay', iso: 'PY', flag: '🇵🇾', dial: '+595' },
  { name: 'Uruguay', iso: 'UY', flag: '🇺🇾', dial: '+598' },
  { name: 'Mexico', iso: 'MX', flag: '🇲🇽', dial: '+52' },
  { name: 'Canada', iso: 'CA', flag: '🇨🇦', dial: '+1' },
  { name: 'United States', iso: 'US', flag: '🇺🇸', dial: '+1' },
];

export default function TaperConnectForm({ initialCountry }) {
  const [step, setStep] = useState(initialCountry ? 2 : 1);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry || null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(initialCountry ? true : false);
  const [error, setError] = useState('');
  const [cardError, setCardError] = useState('');
  const [success, setSuccess] = useState(false);
  const [detectedOperator, setDetectedOperator] = useState(null); // { id, name }
  const [detectingOperator, setDetectingOperator] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [countrySearch, setCountrySearch] = useState('');
  const detectTimeout = useRef(null);
  const stripe = useStripe();
  const elements = useElements();

  React.useEffect(() => {
    if (initialCountry && step === 2) {
      loadProducts(initialCountry);
    }
  }, []);

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
        // For Haiti, detect Natcom (which maps to Ding)
        if (selectedCountry.iso === 'HT') {
          const res = await base44.functions.invoke('dingTopUp', {
            action: 'detectOperator',
            phoneNumber: fullPhone,
          });
          const opData = res.data;
          if (opData?.name) {
            setDetectedOperator({ id: opData.id, name: opData.name, provider: 'ding' });
            setSelectedProduct(null);
          }
        } else {
          // DTone for other countries
          const res = await base44.functions.invoke('dtoneTopUp', {
            action: 'lookupOperator',
            phoneNumber: fullPhone,
          });
          const ops = Array.isArray(res.data) ? res.data : (res.data?.operators || []);
          const identified = ops.find(o => o.identified) || ops[0];
          if (identified) {
            setDetectedOperator({ id: identified.id, name: identified.name, provider: 'dtone' });
            setSelectedProduct(null);
          }
        }
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
    setStep(2); // Move to step 2 immediately

    try {
      let res;
      // Use Ding for Haiti, DTone for others
      if (country.iso === 'HT') {
        res = await base44.functions.invoke('dingTopUp', { action: 'getProducts', countryIso: country.iso });
      } else {
        res = await base44.functions.invoke('dtoneTopUp', { action: 'getProducts', countryIso: country.iso });
      }
      const items = Array.isArray(res.data) ? res.data : (res.data?.Items || res.data?.products || []);
      if (items.length === 0) {
        setError(`No products available for ${country.name}. Please try another country.`);
        setProducts([]);
        return;
      }
      setProducts(items);
    } catch (e) {
      setError(`Failed to load products for ${country.name}. Please try again.`);
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

      // Handle Ding for Haiti
      if (selectedCountry.iso === 'HT') {
        const sendAmount = selectedProduct?.Maximum?.SendValue;
        const paymentRes = await base44.functions.invoke('processDingPayment', {
          paymentMethodId: pm.id,
          fullPhone,
          amount: sendAmount,
          skuCode: selectedProduct?.SkuCode,
          countryCode: selectedCountry.iso,
        });

        if (paymentRes.data?.success) {
          setSuccess(true);
        } else {
          setError(paymentRes.data?.error || 'Transaction failed. Please try again.');
        }
      } else {
        // DTone for other countries
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
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search countries..."
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
            />
            {countrySearch && (
              <button
                onClick={() => setCountrySearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
            {COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map((c) => (
              <button
                key={c.iso}
                onClick={() => {
                  loadProducts(c);
                  setCountrySearch('');
                }}
                disabled={loading}
                className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50 transition-all text-center disabled:opacity-50"
              >
                <span className="text-2xl">{c.flag}</span>
                <span className="text-xs text-slate-700 font-medium leading-tight">{c.name}</span>
              </button>
            ))}
          </div>
          
          {countrySearch && COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">No countries found</p>
          )}
          
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
              </div>
            ) : products.length === 0 ? (
              <p className="text-sm text-slate-500">No products available for this country.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {products
                  .filter(p => {
                    // For DTone countries, filter by detected operator
                    if (detectedOperator && selectedCountry?.iso !== 'HT') {
                      return p.operator?.id === detectedOperator.id;
                    }
                    // For Haiti (Ding), show all products (they're all Natcom)
                    return true;
                  })
                .map((p, idx) => {
                  // Handle both Ding and DTone product formats
                  const isFromDing = p.SkuCode !== undefined;
                  const name = isFromDing 
                    ? p.DefaultDisplayText || `${p.Description || p.Operator || 'Plan'}`
                    : (p.name || p.description || String(p.id));
                  const amount = isFromDing
                    ? p.SendValue ?? p.Maximum?.SendValue
                    : (p.prices?.retail?.amount ?? p.suggested_amounts?.[0] ?? p.face_value);
                  const currency = isFromDing ? 'USD' : (p.prices?.retail?.currency_iso_code || p.send_currency_iso || 'USD');
                  return (
                    <button
                       key={idx}
                       onClick={() => setSelectedProduct(p)}
                       className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                         selectedProduct === p
                           ? 'border-cyan-500 bg-cyan-50'
                           : 'border-slate-200 hover:border-cyan-300'
                       }`}
                     >
                       <div className="flex justify-between items-center">
                         <span className="text-sm font-medium text-slate-800">{name}</span>
                         {amount != null && <span className="text-sm font-bold text-cyan-600">{currency} {Number(amount).toFixed(2)}</span>}
                       </div>
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
              {selectedProduct && (() => {
                const topupAmt = selectedProduct?.prices?.retail?.amount ?? selectedProduct?.suggested_amounts?.[0] ?? selectedProduct?.face_value;
                const total = topupAmt != null ? (parseFloat(topupAmt) + 1).toFixed(2) : null;
                return (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-600 space-y-1">
                    <div className="flex justify-between"><span>Top-up amount</span><span>${parseFloat(topupAmt).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Service fee</span><span>$1.00</span></div>
                    <div className="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-1 mt-1"><span>Total charged</span><span>${total}</span></div>
                  </div>
                );
              })()}
              <Button
                onClick={handleCardPayment}
                disabled={loading || !phoneNumber || !selectedProduct || !stripe}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
                ) : (() => {
                  const topupAmt = selectedProduct?.prices?.retail?.amount ?? selectedProduct?.suggested_amounts?.[0] ?? selectedProduct?.face_value;
                  const total = topupAmt != null ? (parseFloat(topupAmt) + 1).toFixed(2) : '—';
                  return <><Lock className="w-4 h-4 mr-2" /> Pay ${total} & Send Airtime</>;
                })()}
              </Button>
            </>
          )}

          {/* MonCash (Haiti only) */}
          {paymentMethod === 'moncash' && selectedCountry?.iso === 'HT' && (() => {
            const isFromDing = selectedProduct?.SkuCode !== undefined;
            const amount = isFromDing
              ? selectedProduct?.Maximum?.SendValue
              : (selectedProduct?.prices?.retail?.amount
                || selectedProduct?.suggested_amounts?.[0]
                || selectedProduct?.face_value);
            const opId = detectedOperator?.id || (isFromDing ? '00C45BPA' : selectedProduct?.operator?.id) || selectedProduct?.operatorId;
            return (
              <MoncashPaymentForm
                phoneNumber={selectedCountry.dial + phoneNumber.replace(/^0/, '')}
                amount={amount?.toString() || ''}
                operatorId={opId}
                productId={selectedProduct?.SkuCode || selectedProduct?.id}
                countryCode={selectedCountry.iso}
                isFromDing={isFromDing}
                onSuccess={() => setSuccess(true)}
              />
            );
          })()}
        </div>
      )}
    </div>
  );
}