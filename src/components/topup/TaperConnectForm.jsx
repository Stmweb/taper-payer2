import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, AlertCircle, Wifi } from 'lucide-react';

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
  const [success, setSuccess] = useState(false);

  const loadProducts = async (country) => {
    setSelectedCountry(country);
    setLoading(true);
    setError('');
    setProducts([]);
    setSelectedProduct(null);
    try {
      const res = await base44.functions.invoke('dingTopUp', { action: 'getProducts', countryIso: country.iso });
      const items = res.data?.Products || res.data?.products || [];
      setProducts(items.slice(0, 20));
      setStep(2);
    } catch (e) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!phoneNumber || !selectedProduct) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fullPhone = selectedCountry.dial + phoneNumber.replace(/^0/, '');
      const res = await base44.functions.invoke('dingTopUp', {
        action: 'sendTopUp',
        phoneNumber: fullPhone,
        skuCode: selectedProduct.SkuCode || selectedProduct.skuCode,
        sendingAmount: selectedProduct.SendingAmounts?.[0]?.SendingAmount || selectedProduct.sendingAmount,
        sendingCurrencyIso: 'USD',
      });
      if (res.data?.Errors?.length > 0 || res.data?.errors?.length > 0) {
        setError(res.data.Errors?.[0]?.ErrorMessage || res.data.errors?.[0]?.message || 'Top-up failed.');
      } else if (res.data?.success === false) {
        setError(res.data?.error || 'Top-up failed. Please try again.');
      } else {
        setSuccess(true);
      }
    } catch (e) {
      setError('Top-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Top-Up Sent!</h3>
        <p className="text-slate-600 mb-6">Airtime has been sent to {selectedCountry?.dial}{phoneNumber}.</p>
        <Button onClick={() => { setSuccess(false); setStep(1); setPhoneNumber(''); setSelectedProduct(null); }}
          className="bg-cyan-500 hover:bg-cyan-600 text-white">
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
        <div>
          <h3 className="text-xl font-bold text-slate-900">Taper Connect</h3>
          
        </div>
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

      {/* Step 2: Select Product & Enter Phone */}
      {step === 2 && (
        <div className="space-y-4">
          <button onClick={() => setStep(1)} className="text-sm text-cyan-600 hover:underline flex items-center gap-1">
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
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Plan</label>
            {products.length === 0 ? (
              <p className="text-sm text-slate-500">No products available for this country.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {products.map((p, idx) => {
                  const skuCode = p.SkuCode || p.skuCode;
                  const name = p.Name || p.name || skuCode;
                  const amount = p.SendingAmounts?.[0]?.SendingAmount || p.sendingAmount;
                  const currency = p.SendingAmounts?.[0]?.SendingCurrencyIso || 'USD';
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
                        {amount && <span className="text-sm font-bold text-cyan-600">{currency} {amount}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedProduct || !phoneNumber}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : 'Send Airtime'}
          </Button>
        </div>
      )}
    </div>
  );
}