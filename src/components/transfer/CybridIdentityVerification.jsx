import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, AlertCircle, ExternalLink, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CybridIdentityVerification({ customerGuid, jwt, onVerified, onError }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [personaUrl, setPersonaUrl] = useState('');
  const [opened, setOpened] = useState(false);

  const invoke = async (action, p = {}) => {
    const res = await base44.functions.invoke('cybridTransfer', { action, _jwt: jwt || '', ...p });
    if (res.data?.error) throw new Error(res.data.error);
    return res;
  };

  const loadVerification = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await invoke('startKYC', { customerGuid });
      const { personaUrl: url, alreadyVerified } = res.data || {};

      if (alreadyVerified) {
        onVerified?.();
        return;
      }

      if (url) {
        setPersonaUrl(url);
      } else {
        // No Persona URL means sandbox auto-passed — treat as verified
        onVerified?.();
      }
    } catch (e) {
      setError(e.message || 'Failed to start identity verification.');
      onError?.(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!customerGuid) return;
    loadVerification();
  }, [customerGuid]);

  if (loading) {
    return (
      <div className="flex flex-col items-center py-8 gap-3 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-sm text-slate-600">Setting up identity verification…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p>{error}</p>
          <Button size="sm" variant="outline" className="mt-2" onClick={loadVerification}>
            <RefreshCw className="w-3 h-3 mr-1" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center space-y-3">
        <div className="text-3xl">🪪</div>
        <p className="font-semibold text-slate-800">Identity Verification Required</p>
        <p className="text-sm text-slate-600">
          We need to verify your identity before you can send money. This is a one-time process that takes about 2 minutes.
        </p>
        {personaUrl ? (
          <Button
            className="w-full"
            style={{ backgroundColor: '#3D7BB7' }}
            onClick={() => {
              window.open(personaUrl, '_blank');
              setOpened(true);
            }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Start Verification →
          </Button>
        ) : null}
      </div>

      {opened && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 text-center">
            Completed the verification? Click below to continue.
          </p>
          <Button onClick={onVerified} className="w-full" style={{ backgroundColor: '#3D7BB7' }}>
            <CheckCircle className="w-4 h-4 mr-2" /> I've Completed Verification
          </Button>
        </div>
      )}
    </div>
  );
}