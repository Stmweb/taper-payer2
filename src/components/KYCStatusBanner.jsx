import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, X, Loader2, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function KYCStatusBanner({ user }) {
  const [launching, setLaunching] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!user || dismissed) return null;

  // Verified if cybrid_customer_id starts with "veriff_"
  const isVerified = user.cybrid_customer_id?.startsWith('veriff_');

  const handleStartKYC = async () => {
    setLaunching(true);
    try {
      const res = await base44.functions.invoke('veriffKYC', { action: 'createSession' });
      if (res.data?.url) {
        window.open(res.data.url, '_blank');
      }
    } catch (e) {
      console.error('KYC launch error:', e);
    } finally {
      setLaunching(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
          isVerified
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}
      >
        {isVerified ? (
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
        )}

        <span className="flex-1">
          {isVerified ? (
            <>
              <span className="font-semibold">Identity Verified</span>
              <span className="text-green-600 ml-1">— You're fully verified and ready to send money.</span>
            </>
          ) : (
            <>
              <span className="font-semibold">Verification Required</span>
              <span className="ml-1">— Complete identity verification to unlock transfers.</span>
            </>
          )}
        </span>

        {!isVerified && (
          <button
            onClick={handleStartKYC}
            disabled={launching}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 disabled:opacity-60"
          >
            {launching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ExternalLink className="w-3.5 h-3.5" />
            )}
            {launching ? 'Opening…' : 'Verify Now'}
          </button>
        )}

        <button
          onClick={() => setDismissed(true)}
          className="text-current opacity-50 hover:opacity-80 flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}