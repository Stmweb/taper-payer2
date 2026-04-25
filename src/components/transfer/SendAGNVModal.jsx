import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react';

const RATES = {
  USD_TO_AGNV: 10,   // 1 USD = 10 AGNV
  AGNV_TO_USD: 0.10, // 1 AGNV = 0.10 USD
  USD_TO_HTG: 131.08,
};

export default function SendAGNVModal({ isOpen, onClose }) {
  const [amountUSD, setAmountUSD] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const agnvAmount = amountUSD ? (parseFloat(amountUSD) * RATES.USD_TO_AGNV).toFixed(2) : '';
  const htgEquiv = amountUSD ? (parseFloat(amountUSD) * RATES.USD_TO_HTG).toFixed(2) : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!amountUSD || !recipientPhone) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    // Placeholder — wire up actual AGNV transfer logic here
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  const handleClose = () => {
    setAmountUSD('');
    setRecipientPhone('');
    setSuccess(false);
    setError('');
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
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Transfer Initiated!</h3>
              <p className="text-slate-500 text-sm">Your AGNV transfer of {agnvAmount} AGNV (${amountUSD} USD) has been submitted.</p>
              <Button onClick={handleClose} className="mt-6 w-full" style={{ backgroundColor: '#7c3aed' }}>Done</Button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#ede9fe' }}>
                  <span className="text-2xl font-bold" style={{ color: '#7c3aed' }}>A</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Send AGNV</h2>
                  <p className="text-slate-500 text-sm">Transfer AGNV tokens instantly</p>
                </div>
              </div>

              {/* Exchange Rate Card */}
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-5">
                <div className="flex items-center gap-1 mb-3">
                  <Info className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-700">Exchange Rates</span>
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount (USD) <span className="text-red-500">*</span></label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amountUSD}
                    onChange={(e) => setAmountUSD(e.target.value)}
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Phone / Wallet <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    placeholder="Phone number or wallet address"
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
        </div>
      </motion.div>
    </div>,
    document.body
  );
}