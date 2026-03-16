import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, AlertCircle, Zap, Lock } from 'lucide-react';

const COUNTRIES = [
  { name: 'Haiti', iso: 'HT', flag: '🇭🇹', dial: '+509' },
  { name: 'India', iso: 'IN', flag: '🇮🇳', dial: '+91' },
  { name: 'Philippines', iso: 'PH', flag: '🇵🇭', dial: '+63' },
  { name: 'Nigeria', iso: 'NG', flag: '🇳🇬', dial: '+234' },
  { name: 'Kenya', iso: 'KE', flag: '🇰🇪', dial: '+254' },
  { name: 'Ghana', iso: 'GH', flag: '🇬🇭', dial: '+233' },
  { name: 'Mexico', iso: 'MX', flag: '🇲🇽', dial: '+52' },
  { name: 'Brazil', iso: 'BR', flag: '🇧🇷', dial: '+55' },
  { name: 'Senegal', iso: 'SN', flag: '🇸🇳', dial: '+221' },
  { name: 'Angola', iso: 'AO', flag: '🇦🇴', dial: '+244' },
  { name: 'Dominican Republic', iso: 'DO', flag: '🇩🇴', dial: '+1' },
  { name: 'Chile', iso: 'CL', flag: '🇨🇱', dial: '+56' },
];

export default function DToneTopUpForm() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const detectTimeout = useRef(null);

  const handleCountrySelect = async (country) => {
    setSelectedCountry(country);
    setProducts([]);
    setSelectedProduct(null);
    setPhoneNumber('');
    setError('');
    setLoadingProducts(true);
    setStep(2);

    try {
      const res = await base44.functions.invoke('dtoneTopUp', {
        action: 'getProducts',
        countryIso: country.iso,
      });
      const items = Array.isArray(res.data) ? res.data : [];
      setProducts(items);
    } catch (e) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
    if (detectTimeout.current) clearTimeout(detectTimeout.current);
  };

  const handleTopUp = async () => {
    if (!phoneNumber || !selectedProduct) {
      setError('Please enter a phone number and select a product.');
      return;
    }

    setProcessingPayment(true);
    setError('');

    try {
      const fullPhone = selectedCountry.dial + phoneNumber.replace(/^0/, '');
      const res = await base44.functions.invoke('dtoneTopUp', {
        action: 'sendTopUp',
        productId: selectedProduct.id,
        mobileNumber: fullPhone,
        externalId: `TPAY-${Date.now()}`,
      });

      const data = res.data;
      if (data?.status === 'COMPLETED' || data?.status === 'CONFIRMED' || data?.id) {
        setSuccess(true);
      } else {
        setError(data?.error_message || data?.message || 'Top-up failed. Please try again.');
      }
    } catch (e) {
      setError('Top-up failed. Please try again.');
    } finally {
      setProcessingPayment(false);
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
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Top-Up Sent!</h3>
        <p className="text-slate-600 mb-2">
          {selectedProduct?.destination?.amount} {selectedProduct?.destination?.unit} sent to {selectedCountry?.dial}{phoneNumber}.
        </p>
        <p className="text-sm text-slate-500 mb-6">
          Operator: {selectedProduct?.operator?.name}
        </p>
        <Button onClick={reset} className="bg-teal-500 hover:bg-teal-600 text-white">
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
        <h3 className="text-xl font-bold text-slate-900">Top Up Now</h3>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Step 1: Country */}
      {step === 1 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Select Country</label>
          <div className="grid grid-cols-3 gap-2">
            {COUNTRIES.map((c) => (
              <button
                key={c.iso}
                onClick={() => handleCountrySelect(c)}
                className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-all"
              >
                <span className="text-2xl">{c.flag}</span>
                <span className="text-xs text-slate-700 font-medium leading-tight text-center">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Phone + Product */}
      {step === 2 && (
        <div className="space-y-4">
          <button onClick={reset} className="text-sm text-teal-600 hover:underline">
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
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Product</label>
            {loadingProducts ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading products...
              </div>
            ) : products.length === 0 ? (
              <p className="text-sm text-slate-500">No products available for this country.</p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      selectedProduct?.id === p.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-800">{p.name || p.operator?.name}</span>
                      <span className="text-sm font-bold text-teal-600">
                        ${p.prices?.retail?.amount?.toFixed(2) || '—'} {p.prices?.retail?.unit}
                      </span>
                    </div>
                    {p.destination && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Delivers: {p.destination.amount} {p.destination.unit}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleTopUp}
            disabled={processingPayment || !phoneNumber || !selectedProduct}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            {processingPayment ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
            ) : (
              <><Lock className="w-4 h-4 mr-2" /> Top Up Now — ${selectedProduct?.prices?.retail?.amount?.toFixed(2) || '—'}</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}