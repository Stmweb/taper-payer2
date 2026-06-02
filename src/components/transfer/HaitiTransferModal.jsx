import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/AppAuthContext';
import {
  Loader2, CheckCircle, AlertCircle, ArrowRight,
  DollarSign, Users
} from 'lucide-react';

const STEPS = [
  { id: 'recipient', label: 'Recipient' },
  { id: 'quote', label: 'Get Quote' },
  { id: 'payout', label: 'Send' },
  { id: 'done', label: 'Complete' },
];

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
  const { user: appUser } = useAppAuth();
  const [step, setStep] = useState('recipient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Receivers list from Blindpay
  const [receivers, setReceivers] = useState([]);
  const [loadingReceivers, setLoadingReceivers] = useState(true);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState('');
  const [selectedReceiverName, setSelectedReceiverName] = useState('');

  // Quote
  const [quote, setQuote] = useState(null);

  // Sender wallet (for payout execution)
  const [senderWallet, setSenderWallet] = useState('');

  // Payout result
  const [payoutResult, setPayoutResult] = useState(null);

  const invoke = async (action, p = {}) => {
    const res = await base44.functions.invoke('haitiTransfer', { action, ...p });
    if (res.data?.error) throw new Error(res.data.error);
    return res.data;
  };

  // Load Haiti receivers from Blindpay on mount
  useEffect(() => {
    (async () => {
      setLoadingReceivers(true);
      try {
        const data = await invoke('getReceivers');
        // receivers have bank_accounts nested
        const allBankAccounts = [];
        (data.receivers || []).forEach(r => {
          const name = r.legal_name || `${r.first_name || ''} ${r.last_name || ''}`.trim();
          (r.bank_accounts || []).forEach(ba => {
            allBankAccounts.push({ id: ba.id, label: `${name} — ${ba.account_number || ba.id}`, receiverName: name });
          });
        });
        setReceivers(allBankAccounts);
      } catch (e) {
        setError('Could not load receivers: ' + e.message);
      } finally {
        setLoadingReceivers(false);
      }
    })();
  }, []);

  // Step 1: Select receiver → get quote
  const handleGetQuote = async () => {
    if (!selectedBankAccountId) {
      setError('Please select a receiver.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await invoke('createPayoutQuote', {
        bank_account_id: selectedBankAccountId,
        amountUSD: amount,
        token: 'USDC',
        network: 'base',
      });
      setQuote(data.quote);
      setStep('quote');
    } catch (e) {
      setError(e.message || 'Failed to get quote.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm quote → execute payout
  const handleExecutePayout = async () => {
    if (!senderWallet) {
      setError('Please enter your USDC wallet address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await invoke('executePayout', {
        quote_id: quote.id,
        sender_wallet_address: senderWallet,
        network: 'base',
      });
      setPayoutResult(data.payout);
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
            <strong>{fmtAmt(amount)} USD</strong> via Blindpay
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

      {/* Step: Recipient */}
      {step === 'recipient' && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Users className="w-4 h-4" /> Select Recipient
          </p>

          {loadingReceivers ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm py-4 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading receivers…
            </div>
          ) : receivers.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
              No Haiti receivers found. Please add a receiver in the Blindpay dashboard first.
            </div>
          ) : (
            <div className="space-y-2">
              {receivers.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setSelectedBankAccountId(r.id); setSelectedReceiverName(r.receiverName); }}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                    selectedBankAccountId === r.id
                      ? 'border-blue-500 bg-blue-50 text-blue-900 font-medium'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          <Button
            onClick={handleGetQuote}
            disabled={loading || !selectedBankAccountId}
            className="w-full"
            style={{ backgroundColor: '#3D7BB7' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Get Quote <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step: Quote */}
      {step === 'quote' && quote && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-slate-800">📋 Payout Quote</p>
            <div className="space-y-1 text-slate-700">
              <p>Sending: <strong>{fmtAmt(amount)} USD</strong></p>
              {quote.receive_amount && (
                <p>Recipient receives: <strong>{quote.receive_amount} {quote.receive_currency || 'HTG'}</strong></p>
              )}
              {quote.exchange_rate && (
                <p>Rate: <strong>1 USD = {quote.exchange_rate} {quote.receive_currency || 'HTG'}</strong></p>
              )}
              <p>To: <strong>{selectedReceiverName}</strong></p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Your USDC Wallet Address (Base network)</label>
            <Input
              placeholder="0x..."
              value={senderWallet}
              onChange={e => setSenderWallet(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-1">This is the wallet that will send the USDC to complete the transfer.</p>
          </div>

          <Button
            onClick={handleExecutePayout}
            disabled={loading || !senderWallet}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Confirm &amp; Send <ArrowRight className="ml-2 w-4 h-4" />
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
          <h4 className="text-xl font-bold text-slate-900">Transfer Initiated! 🎉</h4>
          <p className="text-slate-600 text-sm">
            Your transfer to <strong>{selectedReceiverName}</strong> is being processed via Blindpay.
          </p>

          {payoutResult && (
            <div className="w-full space-y-2 text-xs text-left">
              <div className="bg-slate-50 border rounded-lg px-3 py-2 space-y-1">
                <p className="text-slate-500 font-semibold uppercase tracking-wide text-xs">Transaction Details</p>
                <p className="text-slate-600 font-mono">ID: {payoutResult.id || 'N/A'}</p>
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