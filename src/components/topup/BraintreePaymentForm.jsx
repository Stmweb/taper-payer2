import React, { useEffect, useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, CreditCard } from 'lucide-react';

export default function BraintreePaymentForm({ amount, phoneNumber, countryCode, operatorId, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState('');
  const [hostedFieldsInstance, setHostedFieldsInstance] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    loadBraintree();
    return () => {
      if (hostedFieldsInstance) hostedFieldsInstance.teardown();
    };
  }, []);

  const loadBraintree = async () => {
    try {
      // Load Braintree client & hosted-fields scripts
      await loadScript('https://js.braintreegateway.com/web/3.99.0/js/client.min.js');
      await loadScript('https://js.braintreegateway.com/web/3.99.0/js/hosted-fields.min.js');

      // Get client token from backend
      const res = await base44.functions.invoke('getBraintreeToken', {});
      const clientToken = res.data?.clientToken;
      if (!clientToken) throw new Error('Could not retrieve payment token');

      // Initialize Braintree client
      const clientInstance = await new Promise((resolve, reject) => {
        window.braintree.client.create({ authorization: clientToken }, (err, instance) => {
          if (err) reject(err);
          else resolve(instance);
        });
      });

      // Initialize hosted fields
      const hf = await new Promise((resolve, reject) => {
        window.braintree.hostedFields.create({
          client: clientInstance,
          styles: {
            input: { 'font-size': '16px', color: '#1e293b', 'font-family': 'sans-serif' },
            ':focus': { color: '#2479C2' },
            '.invalid': { color: '#ef4444' },
          },
          fields: {
            number: { container: '#card-number', placeholder: '4111 1111 1111 1111' },
            cvv:    { container: '#card-cvv',    placeholder: '123' },
            expirationDate: { container: '#card-expiry', placeholder: 'MM/YY' },
          },
        }, (err, instance) => {
          if (err) reject(err);
          else resolve(instance);
        });
      });

      setHostedFieldsInstance(hf);
      setInitializing(false);
    } catch (err) {
      console.error('Braintree init error:', err);
      setError('Payment system could not be loaded. Please try again.');
      setInitializing(false);
    }
  };

  const loadScript = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });

  const handlePay = async () => {
    if (!hostedFieldsInstance) return;
    setLoading(true);
    setError('');

    try {
      const { nonce } = await new Promise((resolve, reject) => {
        hostedFieldsInstance.tokenize((err, payload) => {
          if (err) reject(err);
          else resolve(payload);
        });
      });

      const res = await base44.functions.invoke('processBraintreeTopUp', {
        amount: parseFloat(amount),
        phoneNumber,
        countryCode,
        operatorId,
        paymentMethodNonce: nonce,
      });

      if (res.data?.success) {
        onSuccess?.(res.data);
      } else {
        const msg = res.data?.error || 'Payment failed';
        setError(msg);
        onError?.(msg);
      }
    } catch (err) {
      const msg = err.details?.invalidFieldKeys
        ? 'Please check your card details and try again.'
        : err.response?.data?.error || err.message || 'Payment failed';
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-semibold text-slate-800">Order Summary</p>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Top-up amount:</span>
          <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Service fee:</span>
          <span className="font-medium">$1.00</span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-slate-800 border-t border-slate-200 pt-2">
          <span>Total charged:</span>
          <span>${(parseFloat(amount) + 1).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Phone:</span>
          <span className="font-medium">{phoneNumber}</span>
        </div>
      </div>

      {/* Card Fields */}
      {initializing ? (
        <div className="flex items-center justify-center py-6 gap-2 text-slate-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading secure payment form…
        </div>
      ) : (
        <div ref={formRef} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Card Number</label>
            <div id="card-number" className="border border-slate-300 rounded-lg px-3 py-3 bg-white min-h-[44px]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Expiry Date</label>
              <div id="card-expiry" className="border border-slate-300 rounded-lg px-3 py-3 bg-white min-h-[44px]" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">CVV</label>
              <div id="card-cvv" className="border border-slate-300 rounded-lg px-3 py-3 bg-white min-h-[44px]" />
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handlePay}
        disabled={loading || initializing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing Payment…</>
        ) : (
          <><CreditCard className="w-4 h-4 mr-2" />Pay ${(parseFloat(amount) + 1).toFixed(2)} via PayPal / Card</>
        )}
      </Button>

      <p className="text-xs text-slate-500 text-center">
        Secure payment powered by PayPal Braintree
      </p>
    </div>
  );
}