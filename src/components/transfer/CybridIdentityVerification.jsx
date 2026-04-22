import React, { useEffect, useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CybridIdentityVerification({ customerGuid, jwt, onVerified, onError }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [personaUrl, setPersonaUrl] = useState('');
  const [verifying, setVerifying] = useState(false);
  const pollRef = useRef(null);

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

  const openPersonaPopup = () => {
    if (!personaUrl) return;
    setVerifying(true);
    const popup = window.open(personaUrl, 'persona_verify', 'width=600,height=700,left=200,top=100');
    pollRef.current = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(pollRef.current);
        // Popup closed — auto-proceed to KYC status check
        onVerified?.();
      }
    }, 500);
  };

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

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
            onClick={openPersonaPopup}
            disabled={verifying}
          >
            {verifying ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Waiting for verification…</>
            ) : (
              <><ExternalLink className="w-4 h-4 mr-2" /> Start Verification →</>
            )}
          </Button>
        ) : null}
      </div>
    </div>
  );
}