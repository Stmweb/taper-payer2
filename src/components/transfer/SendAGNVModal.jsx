import React, { useState, useEffect, useRef, useCallback } from 'react';
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
        <div key={s.id} className="flex items-center gap-1">
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
        </div>
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
  const [veriffUrl, setVeriffUrl] = useState(null);
  const [veriffSessionId, setVeriffSessionId] = useState(null);
  const [kycStatus, setKycStatus] = useState(null);

  // Funding & sending
  const [fundedAmount, setFundedAmount] = useState(0);
  const [fundAmount, setFundAmount] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientCountry, setRecipientCountry] = useState('');
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [squareReady, setSquareReady] = useState(false);
  const [squareLoading, setSquareLoading] = useState(false);
  const cardContainerRef = useRef(null);
  const webPaymentsRef = useRef(null);
  const cardRef = useRef(null);

  const agnvAmount = sendAmount ? (parseFloat(sendAmount) * RATES.USD_TO_AGNV).toFixed(2) : '';
  const htgEquiv = sendAmount ? (parseFloat(sendAmount) * RATES.USD_TO_HTG).toFixed(2) : '';

  // Check auth on mount
  useEffect(() => {
    if (!isOpen) return;
    // Skip auth step if user already logged in via header
    setStep(appUser ? 'kyc' : 'auth');
  }, [isOpen, appUser]);

  // Initialize Square Web Payments
  const initSquare = useCallback(async () => {
    if (!cardContainerRef.current) return;
    
    setSquareLoading(true);
    setError('');
    
    try {
      const config = await base44.functions.invoke('getSquareConfig', {});
      if (!config.data?.squareApplicationId || !config.data?.squareLocationId) {
        throw new Error('Square configuration missing');
      }

      const { squareApplicationId, squareLocationId } = config.data;
      
      if (!window.Square) {
        throw new Error('Square SDK not loaded');
      }

      const payments = await window.Square.payments(squareApplicationId, squareLocationId);
      webPaymentsRef.current = payments;

      cardContainerRef.current.innerHTML = '';
      const card = await payments.card();
      cardRef.current = card;
      await card.attach(cardContainerRef.current);
      
      setSquareReady(true);
    } catch (err) {
      console.error('Square init failed:', err);
      setError(err.message || 'Payment form unavailable. Please refresh the page and try again.');
    } finally {
      setSquareLoading(false);
    }
  }, []);

  // Load Square SDK
  const loadSquareScript = useCallback(() => {
    const existing = document.querySelector('script[src*="squarecdn.com"]');
    if (existing) {
      existing.remove();
      delete window.Square;
    }
    
    const script = document.createElement('script');
    script.src = 'https://web.squarecdn.com/v1/square.js';
    script.async = true;
    script.onload = initSquare;
    script.onerror = () => setError('Failed to load payment SDK. Please refresh and try again.');
    document.body.appendChild(script);
  }, [initSquare]);

  // Load Square SDK when funding step is active
  useEffect(() => {
    if (step !== 'fund') return;

    let cancelled = false;

    const timer = setTimeout(() => {
      if (!cancelled && cardContainerRef.current) {
        if (window.Square) {
          initSquare();
        } else {
          loadSquareScript();
        }
      }
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [step, initSquare, loadSquareScript]);



  const handleFundingSuccess = (amount) => {
    setFundedAmount(parseFloat(amount) || 0);
    setFundAmount('');
    setStep('send');
    setSendAmount('');
  };

  const handleFundingSubmit = async (e, amount) => {
    e.preventDefault();
    setError('');

    const fundValue = parseFloat(amount || fundAmount);
    if (!fundValue || fundValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!cardRef.current) {
      setError('Payment form not ready. Please refresh the page.');
      return;
    }

    setLoading(true);
    try {
      // Request tokenization
      const result = await cardRef.current.tokenize();
      if (result.status !== 'OK') {
        throw new Error(result.errors?.[0]?.message || 'Failed to tokenize card');
      }

      // Process payment
      const paymentRes = await base44.functions.invoke('processSquarePayment', {
        amount: fundValue,
        sourceToken: result.token,
      });

      if (paymentRes.data?.success) {
        handleFundingSuccess(fundValue);
      } else {
        setError(paymentRes.data?.error || 'Payment failed');
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
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
    
    if (!sendAmount || !recipientName || !recipientPhone || !recipientCountry) {
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
      
      setTxHash(res.data?.transactionId || '');
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
    setFundAmount('');
    setSendAmount('');
    setRecipientName('');
    setRecipientPhone('');
    setRecipientCountry('');
    setSuccess(false);
    setError('');
    setTxHash('');
    setVeriffUrl(null);
    setVeriffSessionId(null);
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
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto">
                    <span className="text-3xl">✓</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Identity Verification</h3>
                  <p className="text-slate-600 text-sm">We need to verify your identity for security purposes.</p>
                  <Button
                    onClick={() => setStep('fund')}
                    className="w-full"
                    style={{ backgroundColor: '#7c3aed' }}
                  >
                    Proceed to Verification
                  </Button>
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

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 items-center text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Amount (USD)</label>
                     <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                       <Input
                         type="number"
                         step="0.01"
                         min="1"
                         placeholder="0.00"
                         value={fundAmount}
                         onChange={(e) => setFundAmount(e.target.value)}
                         className="pl-8 border-slate-300"
                         disabled={loading || !squareReady}
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
                           type="button"
                           onClick={(e) => handleFundingSubmit(e, amount)}
                           disabled={loading || !squareReady}
                           className="px-3 py-2 rounded-lg text-sm font-semibold border transition-all disabled:opacity-50"
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

                   <div ref={cardContainerRef} className="border border-slate-300 rounded-lg p-4 bg-white min-h-[60px]" />

                   <Button
                     type="submit"
                     onClick={(e) => handleFundingSubmit(e, fundAmount)}
                     disabled={loading || !squareReady}
                     className="w-full py-3 text-white font-semibold"
                     style={{ backgroundColor: '#7c3aed' }}
                   >
                     {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                     {loading ? 'Processing...' : squareReady ? 'Fund Account' : 'Loading...'}
                   </Button>
                 </form>
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

                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Country <span className="text-red-500">*</span></label>
                   <Input
                     type="text"
                     placeholder="Country"
                     value={recipientCountry}
                     onChange={(e) => setRecipientCountry(e.target.value)}
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

          {/* Step 5: Complete */}
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