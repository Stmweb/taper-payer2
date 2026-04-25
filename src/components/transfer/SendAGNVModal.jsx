import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, Loader2, Info, ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SignupModal from '@/components/SignupModal';
import { useAppAuth } from '@/lib/AppAuthContext';

const STEPS = [
  { id: 'auth',    label: 'Login/Sign Up'   },
  { id: 'kyc',     label: 'Verify Identity' },
  { id: 'fund',    label: 'Fund Account'    },
  { id: 'send',    label: 'Send AGNV'       },
  { id: 'done',    label: 'Complete'        },
];

const RATES = {
  USD_TO_AGNV: 10,
  AGNV_TO_USD: 0.10,
  USD_TO_HTG: 131.08,
};

function StepIndicator({ currentStep }) {
  const idx = STEPS.findIndex(s => s.id === currentStep);
  return (
    <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className={`flex flex-col items-center min-w-0 ${i <= idx ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              i < idx ? 'bg-green-500 text-white' :
              i === idx ? 'bg-purple-600 text-white' :
              'bg-slate-200 text-slate-500'
            }`}>
              {i < idx ? '✓' : i + 1}
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 min-w-[8px] ${i < idx ? 'bg-green-400' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function SendAGNVModal({ isOpen, onClose }) {
  const { user: appUser, login } = useAppAuth();
  const [step, setStep] = useState('auth');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [kycRefreshKey, setKycRefreshKey] = useState(0);
  const [showSignup, setShowSignup] = useState(false);
  const [personaUrl, setPersonaUrl] = useState(null);
  const [kycStatus, setKycStatus] = useState(null);

  // Funding & sending
  const [fundedAmount, setFundedAmount] = useState(0);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  const agnvAmount = sendAmount ? (parseFloat(sendAmount) * RATES.USD_TO_AGNV).toFixed(2) : '';
  const htgEquiv = sendAmount ? (parseFloat(sendAmount) * RATES.USD_TO_HTG).toFixed(2) : '';

  // Check auth on mount
  useEffect(() => {
    if (!isOpen) return;
    
    if (appUser) {
      setStep('kyc');
    } else {
      setStep('auth');
    }
  }, [isOpen, appUser]);

  // KYC check
  useEffect(() => {
    if (step !== 'kyc' || !appUser) return;
    
    const checkKYC = async () => {
      setLoading(true);
      setError('');
      try {
        const freshUser = await base44.auth.me();
        
        if (freshUser?.cybrid_customer_id) {
          setKycStatus('verified');
          setLoading(false);
          return;
        }

        // Start KYC
        const res = await base44.functions.invoke('cybridTransfer', {
          action: 'startKYC',
          customerGuid: freshUser?.id,
          _jwt: '',
          appUserId: freshUser?.id,
        });

        const { personaUrl: pUrl, state: kycState } = res.data || {};
        if (pUrl) {
          setPersonaUrl(pUrl);
          setKycStatus(kycState || 'unverified');
        } else {
          setKycStatus(kycState || 'pending');
        }
      } catch (err) {
        setError(err.message || 'Failed to check KYC status');
      } finally {
        setLoading(false);
      }
    };

    checkKYC();
  }, [step, kycRefreshKey, appUser]);

  const handleFundingSuccess = (amount) => {
    setFundedAmount(parseFloat(amount) || 0);
    setStep('send');
    setSendAmount('');
  };

  const handleAmountChange = (value) => {
    const numValue = parseFloat(value);
    if (numValue <= fundedAmount || value === '') {
      setSendAmount(value);
    }
  };

  const handleSendSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const amount = parseFloat(sendAmount);
    
    if (!sendAmount || !recipientName || !recipientPhone) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (amount > fundedAmount) {
      setError(`Cannot send more than $${fundedAmount} (your funded amount).`);
      return;
    }

    setLoading(true);
    try {
      const res = await base44.functions.invoke('sendAGNV', {
        amountUSD: amount,
        recipientName,
        recipientPhone,
      });
      
      if (res.data?.error) throw new Error(res.data.error);
      
      setTxHash(res.data?.txHash || '');
      setSuccess(true);
      setStep('done');
    } catch (err) {
      setError(err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('auth');
    setFundedAmount(0);
    setSendAmount('');
    setRecipientName('');
    setRecipientPhone('');
    setSuccess(false);
    setError('');
    setTxHash('');
    setPersonaUrl(null);
    setKycStatus(null);
    setShowSignup(false);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-2" />
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10 text-slate-500">✕</button>

        <div className="p-6 pt-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#ede9fe' }}>
              <span className="text-2xl font-bold" style={{ color: '#7c3aed' }}>A</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Send AGNV</h2>
              <p className="text-slate-500 text-sm">Global token transfers</p>
            </div>
          </div>

          <StepIndicator currentStep={step} />

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Auth */}
          {step === 'auth' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto">
                <span className="text-3xl">🔐</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Login Required</h3>
              <p className="text-slate-600 text-sm">Sign in or create an account to send AGNV</p>
              <Button
                onClick={() => setShowSignup(true)}
                className="w-full"
                style={{ backgroundColor: '#7c3aed' }}
              >
                Login / Sign Up
              </Button>
            </div>
          )}

          {/* Step 2: KYC */}
          {step === 'kyc' && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center py-8 gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                  <p className="font-semibold text-slate-800">Checking KYC status…</p>
                </div>
              ) : kycStatus === 'verified' ? (
                <div className="flex flex-col items-center py-8 gap-4 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                  <p className="font-semibold text-slate-800">Identity Verified</p>
                  <p className="text-sm text-slate-600">You're ready to send AGNV</p>
                  <Button
                    onClick={() => setStep('fund')}
                    className="w-full"
                    style={{ backgroundColor: '#7c3aed' }}
                  >
                    Continue to Funding
                  </Button>
                </div>
              ) : personaUrl ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center space-y-3">
                  <div className="text-3xl">🪪</div>
                  <p className="font-semibold text-slate-800">Identity Verification Required</p>
                  <p className="text-sm text-slate-600">
                    We need to verify your identity. This is a one-time process that takes about 2 minutes.
                  </p>
                  <Button
                    className="w-full"
                    style={{ backgroundColor: '#7c3aed' }}
                    onClick={() => window.open(personaUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Start Verification →
                  </Button>
                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-slate-500">Completed the verification?</p>
                    <Button
                      onClick={() => setKycRefreshKey(k => k + 1)}
                      className="w-full"
                      variant="outline"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" /> I've Completed Verification
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Step 3: Fund */}
          {step === 'fund' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-700">Step 3: Fund Your Account</span>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Add funds to your account using Square. This amount will be available to send as AGNV.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="1"
                        placeholder="0.00"
                        className="pl-8 border-slate-300"
                      />
                    </div>
                  </div>

                  {/* Quick amounts */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">Quick Select</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[25, 50, 100, 250].map(amount => (
                        <button
                          key={amount}
                          className="px-3 py-2 rounded-lg text-sm font-semibold border transition-all"
                          style={{ 
                            backgroundColor: '#7c3aed',
                            color: 'white',
                            borderColor: '#7c3aed'
                          }}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div id="card-container" className="border border-slate-300 rounded-lg p-4 bg-white min-h-[60px]"></div>

                  <Button
                    onClick={() => handleFundingSuccess(100)}
                    className="w-full py-3 text-white font-semibold"
                    style={{ backgroundColor: '#7c3aed' }}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    {loading ? 'Processing...' : 'Fund Account'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Send */}
          {step === 'send' && !success && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-5">
                <div className="flex items-center gap-1 mb-3">
                  <Info className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-700">Step 4: Send AGNV</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm mb-3">
                  <div className="bg-white rounded-xl p-2 shadow-sm">
                    <p className="text-xs text-slate-400 mb-1">1 USD =</p>
                    <p className="font-bold text-slate-800">10 AGNV</p>
                  </div>
                  <div className="bg-white rounded-xl p-2 shadow-sm">
                    <p className="text-xs text-slate-400 mb-1">1 AGNV =</p>
                    <p className="font-bold text-slate-800">$0.10 USD</p>
                  </div>
                  <div className="bg-white rounded-xl p-2 shadow-sm">
                    <p className="text-xs text-slate-400 mb-1">1 USD =</p>
                    <p className="font-bold text-slate-800">131.08 HTG</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSendSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Amount (USD) <span className="text-red-500">*</span>
                    <span className="text-xs text-slate-500 font-normal"> Max: ${fundedAmount}</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    max={fundedAmount}
                    step="0.01"
                    required
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  />
                  {agnvAmount && (
                    <p className="text-xs text-purple-600 mt-1 font-medium">
                      ≈ {agnvAmount} AGNV &nbsp;|&nbsp; ≈ {htgEquiv} HTG
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Name <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Phone <span className="text-red-500">*</span></label>
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    required
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-white"
                  style={{ backgroundColor: '#7c3aed' }}
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {loading ? 'Processing...' : 'Send AGNV'}
                </Button>
              </form>
            </div>
          )}

          {/* Step 5: Done */}
          {step === 'done' && success && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">Transfer Successful!</h3>
              <p className="text-slate-500 text-sm">
                Your AGNV transfer of {agnvAmount} AGNV (${sendAmount} USD) to {recipientName} has been completed.
              </p>
              {txHash && <p className="text-xs text-slate-400 break-all">TX: {txHash}</p>}
              <Button onClick={handleClose} className="w-full" style={{ backgroundColor: '#7c3aed' }}>Done</Button>
            </div>
          )}
        </div>

        {/* Signup Modal */}
        {showSignup && (
          <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} onSuccess={() => {
            setShowSignup(false);
            setStep('kyc');
          }} />
        )}
      </motion.div>
    </div>,
    document.body
  );
}