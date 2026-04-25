import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, Loader2, Info, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AGNVFundingModal from './AGNVFundingModal';

const RATES = {
  USD_TO_AGNV: 10,   // 1 USD = 10 AGNV
  AGNV_TO_USD: 0.10, // 1 AGNV = 0.10 USD
  USD_TO_HTG: 131.08,
};

export default function SendAGNVModal({ isOpen, onClose }) {
  const [step, setStep] = useState('fund'); // 'fund' or 'send'
  const [fundedAmount, setFundedAmount] = useState(0);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [fundingComplete, setFundingComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingKYC, setCheckingKYC] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    
    const checkUserKYC = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (!currentUser) {
          setError('Please login to send AGNV');
          setUser(null);
        } else {
          setUser(currentUser);
          setError('');
        }
      } catch (err) {
        setError('Failed to verify user. Please login.');
        setUser(null);
      } finally {
        setCheckingKYC(false);
      }
    };

    checkUserKYC();
  }, [isOpen]);

  const agnvAmount = sendAmount ? (parseFloat(sendAmount) * RATES.USD_TO_AGNV).toFixed(2) : '';
  const htgEquiv = sendAmount ? (parseFloat(sendAmount) * RATES.USD_TO_HTG).toFixed(2) : '';

  const handleFundingSuccess = (amount) => {
    setFundingComplete(true);
    setStep('send');
    setFundedAmount(parseFloat(amount) || 0);
    setSendAmount('');
  };

  const handleAmountChange = (value) => {
    const numValue = parseFloat(value);
    
    // Only allow amounts up to funded amount
    if (numValue <= fundedAmount || value === '') {
      setSendAmount(value);
    }
  };

  const handleSendSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const amount = parseFloat(sendAmount);
    
    if (!user) {
      setError('You must be logged in to send AGNV.');
      return;
    }

    if (!user.cybrid_customer_id) {
      setError('You must complete KYC verification before sending AGNV.');
      return;
    }
    
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
      const res = await fetch('/api/sendAGNV', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountUSD: parseFloat(sendAmount),
          recipientName,
          recipientPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Transfer failed');
      setTxHash(data.txHash);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('fund');
    setFundedAmount(0);
    setSendAmount('');
    setRecipientName('');
    setRecipientPhone('');
    setSuccess(false);
    setError('');
    setTxHash('');
    setFundingComplete(false);
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
          {checkingKYC ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
              <p className="text-slate-600">Verifying your account...</p>
            </div>
          ) : !user ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Login Required</h3>
              <p className="text-slate-600 text-sm mb-4">You must be logged in to send AGNV.</p>
              <Button onClick={onClose} className="w-full" style={{ backgroundColor: '#7c3aed' }}>Close</Button>
            </div>
          ) : !user.cybrid_customer_id ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">KYC Verification Required</h3>
              <p className="text-slate-600 text-sm mb-4">Complete identity verification to send AGNV.</p>
              <Button onClick={onClose} className="w-full" style={{ backgroundColor: '#7c3aed' }}>Close</Button>
            </div>
          ) : success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Transfer Successful!</h3>
              <p className="text-slate-500 text-sm mb-4">Your AGNV transfer of {agnvAmount} AGNV (${sendAmount} USD) to {recipientName} has been completed.</p>
              {txHash && <p className="text-xs text-slate-400 break-all mb-4">TX: {txHash}</p>}
              <Button onClick={handleClose} className="mt-6 w-full" style={{ backgroundColor: '#7c3aed' }}>Done</Button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                {fundingComplete && (
                  <button
                    onClick={() => setStep('fund')}
                    className="p-1 hover:bg-gray-100 rounded-full text-slate-500 flex-shrink-0"
                    aria-label="Back"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#ede9fe' }}>
                  <span className="text-2xl font-bold" style={{ color: '#7c3aed' }}>A</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Send AGNV</h2>
                  <p className="text-slate-500 text-sm">{step === 'fund' ? 'Fund your account' : 'Transfer AGNV tokens'}</p>
                </div>
              </div>

              {step === 'fund' ? (
                <AGNVFundingModal
                  onSuccess={(amount) => handleFundingSuccess(amount)}
                  onClose={onClose}
                />
              ) : (
                <>
                  {/* Send AGNV Step */}
                  <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-5">
                    <div className="flex items-center gap-1 mb-3">
                      <Info className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-semibold text-purple-700">Step 2: Send AGNV</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
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
                    <p className="text-xs text-slate-400 mt-2 text-center italic">Rates are indicative and may vary based on daily market fluctuations and applicable fees.</p>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2 text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      {error}
                    </div>
                  )}

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
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : 'Send AGNV'}
                    </Button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}