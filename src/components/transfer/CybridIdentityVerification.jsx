import React, { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CybridIdentityVerification({ customerGuid, jwt, onVerified, onError }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sdkLoaded, setSdkLoaded] = useState(false);

  const invoke = async (action, p = {}) => {
    const res = await base44.functions.invoke('cybridTransfer', { action, _jwt: jwt || '', ...p });
    if (res.data?.error) throw new Error(res.data.error);
    return res;
  };

  useEffect(() => {
    if (!customerGuid) return;
    loadSdkAndMount();
  }, [customerGuid]);

  const loadSdkAndMount = async () => {
    setLoading(true);
    setError('');
    try {
      // Get customer-scoped JWT from backend
      const tokenRes = await invoke('getCustomerToken', { customerGuid });
      const customerToken = tokenRes.data?.customerToken;
      if (!customerToken) throw new Error('Could not get customer token.');

      // Load Cybrid SDK script if not already loaded
      if (!document.querySelector('script[data-cybrid-sdk]')) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@cybrid/cybrid-sdk-ui-js@latest/cybrid-sdk-ui.min.js';
          script.type = 'module';
          script.setAttribute('data-cybrid-sdk', 'true');
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Cybrid SDK.'));
          document.head.appendChild(script);
        });
      }

      // Wait a tick for custom element to register
      await new Promise(r => setTimeout(r, 500));

      // Clear container and mount cybrid-app element
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        const el = document.createElement('cybrid-app');
        el.setAttribute('auth', customerToken);
        el.setAttribute('component', 'identity-verification');

        const config = {
          refreshInterval: 5000,
          routing: false,
          locale: 'en-US',
          theme: 'LIGHT',
          customer: customerGuid,
          fiat: 'USD',
          features: ['kyc_identity_verifications'],
          environment: 'sandbox',
        };
        el.setAttribute('hostConfig', JSON.stringify(config));

        // Listen for completion events
        el.addEventListener('eventLog', (event) => {
          const detail = event.detail;
          console.log('Cybrid eventLog:', detail);
          if (detail?.code === 'identity-verification:verified' || detail?.code === 'customer:verified') {
            onVerified?.();
          }
        });

        el.addEventListener('errorLog', (event) => {
          console.error('Cybrid errorLog:', event.detail);
        });

        containerRef.current.appendChild(el);
        setSdkLoaded(true);
      }
    } catch (e) {
      setError(e.message || 'Failed to load identity verification.');
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

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{error}</p>
            <Button size="sm" variant="outline" className="mt-2" onClick={loadSdkAndMount}>
              <RefreshCw className="w-3 h-3 mr-1" /> Retry
            </Button>
          </div>
        </div>
      )}

      {/* Cybrid SDK mounts here */}
      <div
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden border border-blue-200"
        style={{ minHeight: sdkLoaded ? '500px' : '0' }}
      />

      {sdkLoaded && (
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