import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/AppAuthContext';
import {
  Loader2, CheckCircle, AlertCircle, ArrowRight, Phone,
  DollarSign, RefreshCw
} from 'lucide-react';

const STEPS = [
  { id: 'deposit', label: 'Deposit USD' },
  { id: 'convert', label: 'Get USDC' },
  { id: 'pin', label: 'Verify PIN' },
  { id: 'recipient', label: 'Add Recipient' },
  { id: 'payout', label: 'Send to MonCash' },
  { id: 'done', label: 'Complete' },
];

const CORRECT_PIN = '28272017';

function StepIndicator({ currentStep }) {
  const idx = STEPS.findIndex(s => s.id === currentStep);
  return (
    <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className={`flex flex-col items-center min-w-0 ${i <= idx ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              i < idx ? 'bg-green-500 text-white' :
              i === idx ? 'bg-blue-600 text-white' :
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

export default function HaitiTransferModal({ amount, onClose }) {
  const { user: appUser, jwt } = useAppAuth();
  const [step, setStep] = useState('deposit');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Recipient info
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');

  // Exchange rate
  const [exchangeRate, setExchangeRate] = useState(null);
  const [haitianAmount, setHaitianAmount] = useState('');

  // Results
  const [transactionId, setTransactionId] = useState(null);
  const [payoutResult, setPayoutResult] = useState(null);

  const invoke = async (action, p = {}) => {
    try {
      const res = await base44.functions.invoke('haitiTransfer', { action, _jwt: jwt || '', ...p });
      if (res.data?.error) throw new Error(res.data.error);
      return res;
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || 'Request failed';
      throw new Error(msg);
    }
  };

  // Step 1: Deposit → Transak
  const handleDeposit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await invoke('initiateTransak', { amountUSD: amount });
      setTransactionId(res.data?.transakTransactionId);
      
      // Fetch exchange rate while user completes deposit
      const rateRes = await invoke('getExchangeRate', { amountUSD: amount });
      setExchangeRate(rateRes.data?.rate);
      setHaitianAmount(rateRes.data?.haitianAmount);

      setStep('convert');
    } catch (e) {
      setError(e.message || 'Deposit initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Convert to USDC (auto after deposit verified)
  const handleConvert = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await invoke('convertToUSDC', { 
        transakTransactionId: transactionId,
        amountUSD: amount 
      });
      if (!res.data?.success) throw new Error('Conversion failed');
      setStep('recipient');
    } catch (e) {
      setError(e.message || 'Conversion failed.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Add recipient
  const handleAddRecipient = async () => {
    if (!recipientPhone || !recipientName) {
      setError('Please enter recipient phone and name.');
      return;
    }
    // Phone should be international format +509XXXXXXXXX
    if (!/^\+509\d{8}$/.test(recipientPhone)) {
      setError('Phone must be in format +509XXXXXXXX (Haiti)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Detect operator and validate with DTone
      const res = await invoke('validateRecipient', { 
        phone: recipientPhone,
        name: recipientName 
      });
      if (!res.data?.valid) throw new Error('Receiver validation failed');
      
      // Check if receiver has MonCash support
      const operator = res.data?.operator || '';
      if (!operator.toLowerCase().includes('moncash') && !res.data?.supportsMoneytransfer) {
        throw new Error(`This receiver's operator (${operator}) does not support MonCash transfers. Please check the phone number.`);
      }
      
      setStep('payout');
    } catch (e) {
      setError(e.message || 'Receiver validation failed.');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Execute payout via DTone
  const handlePayout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await invoke('executeMonCashPayout', {
        transakTransactionId: transactionId,
        amountUSD: amount,
        recipientPhone: recipientPhone,
        recipientName: recipientName
      });
      setPayoutResult(res.data?.payoutResult);
      setStep('done');
    } catch (e) {
      setError(e.message || 'Payout failed.');
    } finally {
      setLoading(false);
    }
  };

  const fmtAmt = (v) => `$${parseFloat(v || amount).toFixed(2)}`;

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shrink-0">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Send to Haiti</h3>
          <p className="text-sm text-slate-500">
            <strong>{fmtAmt(amount)} USD</strong> via MonCash
          </p>
        </div>
      </div>

      <StepIndicator currentStep={step} />

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Step: Deposit */}
      {step === 'deposit' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-slate-800">💳 Deposit USD</p>
            <p className="text-slate-600">
              Securely deposit {fmtAmt(amount)} USD to get started with your transfer.
            </p>
          </div>
          <Button
            onClick={handleDeposit}
            disabled={loading}
            className="w-full"
            style={{ backgroundColor: '#3D7BB7' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Start Deposit <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step: Convert */}
      {step === 'convert' && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-slate-800">💱 Ready to Send</p>
            <p className="text-slate-600">
              {fmtAmt(amount)} USD is ready to be sent to Haiti.
            </p>
            {exchangeRate && haitianAmount && (
              <div className="bg-white rounded px-2 py-1 border border-purple-100 text-xs">
                <p className="text-slate-700">
                  Exchange: 1 USD = {exchangeRate.toFixed(2)} HTG
                </p>
                <p className="text-slate-600">
                  Recipient will receive: {parseFloat(haitianAmount).toFixed(2)} HTG
                </p>
              </div>
            )}
          </div>
          <Button
            onClick={handleConvert}
            disabled={loading}
            className="w-full"
            style={{ backgroundColor: '#7C3AED' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step: Recipient */}
      {step === 'recipient' && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Phone className="w-4 h-4" /> Recipient Details
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
            <Input 
              placeholder="Jean Duval" 
              value={recipientName} 
              onChange={e => setRecipientName(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number</label>
            <div className="flex items-center border rounded-md overflow-hidden">
              <span className="bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">+509</span>
              <Input 
                placeholder="12345678" 
                value={recipientPhone.replace('+509', '')}
                onChange={e => setRecipientPhone(`+509${e.target.value}`)}
                className="border-0 rounded-none focus:ring-0"
              />
            </div>
          </div>
          <Button
            onClick={handleAddRecipient}
            disabled={loading}
            className="w-full"
            style={{ backgroundColor: '#3D7BB7' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Verify Receiver <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step: Payout */}
      {step === 'payout' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-slate-800">🚀 Send to MonCash</p>
            <p className="text-slate-600">
              Sending {haitianAmount ? parseFloat(haitianAmount).toFixed(2) : 'loading...'} HTG to {recipientName}
            </p>
          </div>
          <Button
            onClick={handlePayout}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Send via MonCash <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step: Done */}
      {step === 'done' && (
        <div className="flex flex-col items-center py-4 gap-4 text-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30"></div>
            <div className="relative flex items-center justify-center w-20 h-20 bg-green-50 rounded-full border-4 border-green-200">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h4 className="text-xl font-bold text-slate-900">Transfer Complete! 🎉</h4>
          <p className="text-slate-600 text-sm">
            <strong>{haitianAmount ? parseFloat(haitianAmount).toFixed(2) : ''} HTG</strong> is on its way to <strong>{recipientName}</strong> via MonCash.
          </p>

          {payoutResult && (
            <div className="w-full space-y-2 text-xs text-left">
              <div className="bg-slate-50 border rounded-lg px-3 py-2 space-y-1">
                <p className="text-slate-500 font-semibold uppercase tracking-wide text-xs">Transaction Details</p>
                <p className="text-slate-600 font-mono">ID: {payoutResult.transakId || 'N/A'}</p>
                <p className="text-slate-600">Status: <span className="font-semibold text-green-700">{payoutResult.status || 'pending'}</span></p>
              </div>
            </div>
          )}

          <Button onClick={onClose} className="mt-2 w-full" style={{ backgroundColor: '#3D7BB7' }}>
            Done
          </Button>
        </div>
      )}
    </div>
  );
}