import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { Loader2, CheckCircle, AlertCircle, ArrowRight, Building2 } from 'lucide-react';

const TRANSFER_METHODS = [
  { id: 'ach', label: 'ACH Transfer', description: '1-3 business days · No fee', icon: '🏦' },
  { id: 'wire', label: 'Wire Transfer', description: 'Same day · $15 fee', icon: '⚡' },
  { id: 'rtp', label: 'RTP (Real-Time)', description: 'Instant · $1 fee', icon: '🚀' },
];

export default function CybridTransferModal({ amount, country, onClose }) {
  const [step, setStep] = useState('method'); // method → details → processing → done
  const [method, setMethod] = useState('ach');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transferResult, setTransferResult] = useState(null);

  const invoke = (action, params = {}) =>
    base44.functions.invoke('cybridTransfer', { action, ...params });

  const handleSubmit = async () => {
    if (!routingNumber || !accountNumber || !accountName) {
      setError('Please fill in all bank details.');
      return;
    }
    setLoading(true);
    setError('');
    setStep('processing');

    try {
      const user = await base44.auth.me();

      // 1. Create or get customer
      const custRes = await invoke('createCustomer', {
        name: user.full_name || accountName,
        email: user.email,
      });
      const customerGuid = custRes.data?.customer?.guid;
      if (!customerGuid) throw new Error('Could not create customer profile.');

      // 2. Get or create USD fiat account
      const accRes = await invoke('getOrCreateAccount', {
        customerGuid,
        asset: 'USD',
      });
      const accountGuid = accRes.data?.account?.guid;
      if (!accountGuid) throw new Error('Could not create account.');

      // 3. Create quote
      const quoteRes = await invoke('createQuote', {
        customerGuid,
        asset: 'USD',
        deliverAmount: parseFloat(amount),
      });
      const quoteGuid = quoteRes.data?.quote?.guid;
      if (!quoteGuid) throw new Error('Could not get quote.');

      // 4. Execute transfer
      const transferRes = await invoke('createTransfer', {
        quoteGuid,
        sourceAccountGuid: accountGuid,
        destinationAccountGuid: accountGuid,
      });
      const transfer = transferRes.data?.transfer;
      if (!transfer) throw new Error('Transfer failed.');

      setTransferResult(transfer);
      setStep('done');
    } catch (e) {
      setError(e.message || 'Transfer failed. Please try again.');
      setStep('details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Bank Transfer</h3>
          <p className="text-sm text-slate-500">Sending <strong>${parseFloat(amount).toFixed(2)} USD</strong> → {country}</p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Step: Select Method */}
      {step === 'method' && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Choose Transfer Method</p>
          {TRANSFER_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                method === m.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{m.label}</p>
                <p className="text-xs text-slate-500">{m.description}</p>
              </div>
            </button>
          ))}
          <Button
            onClick={() => setStep('details')}
            className="w-full mt-2"
            style={{ backgroundColor: '#3D7BB7' }}
          >
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step: Bank Details */}
      {step === 'details' && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-700">Recipient Bank Details</p>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Account Holder Name</label>
            <Input
              placeholder="Full name on account"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Routing Number (ABA)</label>
            <Input
              placeholder="9-digit routing number"
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
              maxLength={9}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Account Number</label>
            <Input
              placeholder="Bank account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" onClick={() => setStep('method')} className="flex-1">Back</Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
              style={{ backgroundColor: '#3D7BB7' }}
            >
              Send ${parseFloat(amount).toFixed(2)}
            </Button>
          </div>
        </div>
      )}

      {/* Step: Processing */}
      {step === 'processing' && (
        <div className="flex flex-col items-center py-8 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="font-semibold text-slate-800">Processing your transfer…</p>
          <p className="text-sm text-slate-500 text-center">Connecting to Cybrid — this takes just a moment.</p>
        </div>
      )}

      {/* Step: Done */}
      {step === 'done' && (
        <div className="flex flex-col items-center py-6 gap-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <h4 className="text-xl font-bold text-slate-900">Transfer Initiated!</h4>
          <p className="text-slate-600 text-sm">
            Your transfer of <strong>${parseFloat(amount).toFixed(2)} USD</strong> to <strong>{country}</strong> has been submitted via Cybrid.
          </p>
          {transferResult?.guid && (
            <p className="text-xs text-slate-400 font-mono bg-slate-50 px-3 py-1 rounded">
              Ref: {transferResult.guid}
            </p>
          )}
          <p className="text-xs text-slate-500 capitalize">Status: {transferResult?.state || 'pending'}</p>
          <Button onClick={onClose} className="mt-2 w-full" style={{ backgroundColor: '#3D7BB7' }}>
            Done
          </Button>
        </div>
      )}
    </div>
  );
}