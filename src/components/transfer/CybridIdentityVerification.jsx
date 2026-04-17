import React, { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SDK_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/@cybrid/cybrid-sdk-ui-js@0.0.486/cybrid-sdk-ui.min.js';

function loadCybridScript() {
  return new Promise((resolve, reject) => {
    if (customElements.get('cybrid-app')) return resolve();
    const existing = document.querySelector(`script[src="${SDK_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', resolve);
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = SDK_SCRIPT_URL;
    script.type = 'module';
    script.onload = () => {
      // Give the custom element time to register
      setTimeout(resolve, 800);
    };
    script.onerror = () => reject(new Error('Failed to load Cybrid SDK.'));
    document.head.appendChild(script);
  });
}

export default function CybridIdentityVerification({ customerGuid, jwt, onVerified, onError }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const invoke = async (action, p = {}) => {
    const res = await base44.functions.invoke('cybridTransfer', { action, _jwt: jwt || '', ...p });
    if (res.data?.error) throw new Error(res.data.error);
    return res;
  };

  useEffect(() => {
    if (!customerGuid) return;
    mountSDK();
  }, [customerGuid]);

  const mountSDK = async () => {
    setLoading(true);
    setError('');
    setMounted(false);
    try {
      // 1. Get customer-scoped JWT
      const tokenRes = await invoke('getCustomerToken', { customerGuid });
      const customerToken = tokenRes.data?.customerToken;
      if (!customerToken) throw new Error('Could not get customer token.');

      // 2. Load SDK script
      await loadCybridScript();

      // 3. Mount element using DOM property assignment (not setAttribute)
      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';

      const el = document.createElement('cybrid-app');

      el.auth = customerToken;
      el.component = 'identity-verification';
      el.config = {
        refreshInterval: 5000,
        routing: false,
        locale: 'en-US',
        theme: 'LIGHT',
        customer: customerGuid,
        fiat: 'USD',
        features: ['kyc_identity_verifications'],
        environment: 'sandbox',
      };

      el.addEventListener('eventLog', (event) => {
        const detail = event.detail;
        console.log('Cybrid eventLog:', detail);
        if (
          detail?.code === 'identity-verification:verified' ||
          detail?.code === 'customer:verified' ||
          detail?.outcome === 'passed'
        ) {
          onVerified?.();
        }
      });

      el.addEventListener('errorLog', (event) => {
        console.error('Cybrid errorLog:', event.detail);
      });

      containerRef.current.appendChild(el);
      setMounted(true);

      // Fallback: if the widget stays blank after 5s, show manual link
      setTimeout(() => {
        if (containerRef.current) {
          const cybridEl = containerRef.current.querySelector('cybrid-app');
          if (cybridEl && cybridEl.shadowRoot === null && !cybridEl.innerHTML) {
            setError('widget_blank');
          }
        }
      }, 5000);

    } catch (e) {
      setError(e.message || 'Failed to load identity verification.');
      onError?.(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      {loading && (
        <div className="flex flex-col items-center py-8 gap-3 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-sm text-slate-600">Loading identity verification…</p>
        </div>
      )}

      {error && error !== 'widget_blank' && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{error}</p>
            <Button size="sm" variant="outline" className="mt-2" onClick={mountSDK}>
              <RefreshCw className="w-3 h-3 mr-1" /> Retry
            </Button>
          </div>
        </div>
      )}

      {error === 'widget_blank' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-center space-y-3">
          <p className="text-slate-700 font-medium">Identity verification widget could not load in this browser.</p>
          <p className="text-slate-500 text-xs">This can happen in embedded or restricted environments. Please complete verification in the full app.</p>
          <Button size="sm" variant="outline" className="mt-1" onClick={mountSDK}>
            <RefreshCw className="w-3 h-3 mr-1" /> Try Again
          </Button>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden border border-blue-200"
        style={{ minHeight: mounted ? '500px' : '0' }}
      />

      {mounted && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 text-center">
            Complete the ID + selfie verification above, then click below.
          </p>
          <Button onClick={onVerified} className="w-full" style={{ backgroundColor: '#3D7BB7' }}>
            <CheckCircle className="w-4 h-4 mr-2" /> I've Completed Verification
          </Button>
        </div>
      )}
    </div>
  );
}