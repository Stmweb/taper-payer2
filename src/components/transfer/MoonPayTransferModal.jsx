import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Loader2, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import SignupModal from '@/components/SignupModal';
import { useAppAuth } from '@/lib/AppAuthContext';

// Load Veriff SDK from CDN
const loadVeriffSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.veriffSDK) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.veriff.me/incontext/js/v2.5.0/veriff.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (err) => {
      console.error('Veriff SDK load error:', err);
      reject(new Error('Failed to load identity verification. Please try again.'));
    };
    script.onabort = () => reject(new Error('Veriff SDK load cancelled'));
    document.head.appendChild(script);
  });
};

// Load MoonPay SDK script
const loadMoonPaySDK = () => {
  return new Promise((resolve, reject) => {
    if (window.MoonPay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://buy.moonpay.com/webSdk.bundle.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load MoonPay SDK'));
    document.head.appendChild(script);
  });
};



const COUNTRY_CONFIG = {
  haiti: {
    flag: '🇭🇹',
    name: 'Haiti',
    currency: 'HTG',
    currencyCode: 'usdc',
    defaultAmount: 200,
    description: 'Send USDC → Delivered to Haiti',
    walletNote: 'Recipient mobile wallet or bank account',
  },
  angola: {
    flag: '🇦🇴',
    name: 'Angola',
    currency: 'AOA',
    currencyCode: 'usdc',
    defaultAmount: 200,
    description: 'Send USDC → Delivered to Angola',
    walletNote: 'Recipient mobile wallet or bank account',
  },
};

const STEPS = [
  { id: 'auth', label: 'Login/Sign Up' },
  { id: 'kyc', label: 'Verify Identity' },
  { id: 'form', label: 'Send Money' },
  { id: 'widget', label: 'Complete' },
];

function StepIndicator({ currentStep }) {
  const idx = STEPS.findIndex(s => s.id === currentStep);
  return (
    <div className="flex items-center w-full mb-5 gap-2">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center flex-1 gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 flex-shrink-0 ${
            i < idx ? 'bg-green-500 text-white' :
            i === idx ? 'bg-blue-500 text-white' :
            'bg-slate-200 text-slate-400'
          }`}>
            {i < idx ? '✓' : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 ${i < idx ? 'bg-green-400' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function MoonPayTransferModal({ isOpen, onClose, country = 'haiti' }) {
  const { user: appUser, login } = useAppAuth();
  const [step, setStep] = useState('auth');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [widgetUrl, setWidgetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [moonpayKey, setMoonpayKey] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const [veriffSessionId, setVeriffSessionId] = useState(null);
  const veriffFrameRef = useRef(null);

  const config = COUNTRY_CONFIG[country] || COUNTRY_CONFIG.haiti;

  useEffect(() => {
    if (!isOpen) {
      setStep('auth');
      setRecipientName('');
      setRecipientPhone('');
      setAmount('');
      setWidgetUrl('');
      setError('');
      setVeriffSessionId(null);
      setKycStatus(null);
      setShowSignup(false);
      if (veriffFrameRef.current) veriffFrameRef.current.close();
    } else {
      // If logged in, check if already verified
      if (appUser?.email) {
        // Check Veriff status
        base44.functions.invoke('veriffKYC', {
          action: 'checkStatus',
          sessionId: appUser.veriff_session_id || '',
        }).then(res => {
          if (res.data?.isVerified) {
            setStep('form'); // Skip KYC, go straight to form
            setKycStatus('approved');
          } else {
            setStep('kyc'); // Need to verify
          }
        }).catch(() => {
          setStep('kyc'); // Default to kyc if check fails
        });
      } else {
        setStep('auth');
      }

      if (!moonpayKey) {
        base44.functions.invoke('getMoonPayKey', {}).then(res => {
          setMoonpayKey(res.data.key);
        }).catch(err => {
          setError('Failed to load payment system.');
        });
      }
    }
  }, [isOpen, appUser, moonpayKey]);

  const handleLaunchWidget = async (e) => {
    e.preventDefault();
    if (!recipientName || !recipientPhone || !amount) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Load Helio SDK
      if (!window.Helio) {
        const script = document.createElement('script');
        script.src = 'https://js.hel.io/v1';
        script.async = true;
        script.onload = () => {
          initializeHelioPayment();
        };
        script.onerror = () => {
          setError('Failed to load payment widget. Please try again.');
          setLoading(false);
        };
        document.head.appendChild(script);
      } else {
        initializeHelioPayment();
      }
    } catch (err) {
      setError('Failed to launch payment. Please try again.');
      setLoading(false);
    }
  };

  const initializeHelioPayment = () => {
    setStep('widget');
    setLoading(false);
    
    // Initialize Helio.Pay with the payment ID
    if (window.Helio) {
      window.Helio.Pay({
        paymentId: '69f50b1536f1aaacf43960f8',
        amount: parseFloat(amount),
      });
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative bg-white rounded-t-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
      >
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-2" />
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10 text-slate-500">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{config.flag}</span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Send to {config.name}</h2>
            </div>
          </div>

          <StepIndicator currentStep={step} />

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'auth' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto">
                <span className="text-3xl">🔐</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Login Required</h3>
              <p className="text-slate-600 text-sm">Sign in or create an account to send money</p>
              <Button
                onClick={() => setShowSignup(true)}
                className="w-full"
                style={{ backgroundColor: '#2479C2' }}
              >
                Login / Sign Up
              </Button>
            </div>
          )}

          {step === 'kyc' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto">
                <span className="text-3xl">🪪</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Identity Verification</h3>
              <p className="text-slate-600 text-sm">We need to verify your identity before sending money.</p>

              {kycStatus === 'approved' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                  ✅ Identity verified! You can proceed.
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={async () => {
                    setLoading(true);
                    setError('');
                    try {
                      // Load Veriff SDK
                      await loadVeriffSDK();

                      const res = await base44.functions.invoke('veriffKYC', {
                        action: 'createSession',
                        userId: appUser?.email,
                      });
                      if (res.data?.error) throw new Error(res.data.error);
                      const { sessionId, url } = res.data;
                      setVeriffSessionId(sessionId);

                      // Initialize InContext SDK using the global veriffSDK object
                      if (window.veriffSDK) {
                        veriffFrameRef.current = window.veriffSDK.createVeriffFrame({
                          url,
                          onEvent: (msg) => {
                            if (msg === 'FINISHED') {
                              // Close the frame and move to form step (verification was completed)
                              if (veriffFrameRef.current?.close) {
                                veriffFrameRef.current.close();
                              }
                              setVeriffSessionId(null);
                              setStep('form');
                            }
                          },
                        });
                      }
                    } catch (err) {
                      setError(err.message || 'Failed to start verification');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="w-full"
                  style={{ backgroundColor: '#2479C2' }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Start Verification
                </Button>
              </div>
              <button
                onClick={() => {
                  setStep('auth');
                  setVeriffSessionId(null);
                  setKycStatus(null);
                  setError('');
                }}
                className="text-sm text-slate-500 hover:text-slate-700 underline w-full text-center mt-6"
              >
                ← Back to login
              </button>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleLaunchWidget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Full Name <span className="text-red-500">*</span></label>
                <Input
                  type="text"
                  placeholder="e.g. Jean Pierre"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Phone <span className="text-red-500">*</span></label>
                <Input
                  type="tel"
                  placeholder={country === 'haiti' ? '+509 XXXX XXXX' : '+244 XXX XXX XXX'}
                  value={recipientPhone}
                  onChange={e => setRecipientPhone(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-400 mt-1">{config.walletNote}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (USD) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                  <Input
                    type="number"
                    min="10"
                    step="1"
                    placeholder={config.defaultAmount}
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
                {/* Quick amounts */}
                <div className="flex gap-2 mt-2">
                  {[50, 100, 200, 500].map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAmount(String(a))}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      ${a}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold text-base"
                style={{ backgroundColor: '#2479C2' }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {loading ? 'Preparing...' : `Continue to Pay →`}
              </Button>

              <p className="text-center text-xs text-slate-400">Secured by MoonPay · Bank-grade encryption</p>
            </form>
          )}

          {step === 'widget' && (
            <div className="py-4 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Complete Payment</h3>
              <p className="text-slate-600 text-sm">
                Sending <strong>${amount}</strong> to <strong>{recipientName}</strong>
              </p>
              <div id="helio-pay" className="w-full" />
              <button
                onClick={() => setStep('form')}
                className="text-sm text-slate-500 hover:text-slate-700 underline w-full text-center pt-4"
              >
                ← Cancel & go back
              </button>
            </div>
          )}
        </div>

        {showSignup && (
          <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} onSignupSuccess={() => {
            setShowSignup(false);
            setStep('kyc');
          }} />
        )}
      </motion.div>
    </div>,
    document.body
  );
}