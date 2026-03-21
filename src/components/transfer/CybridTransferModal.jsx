import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/AppAuthContext';
import {
  Loader2, CheckCircle, AlertCircle, ArrowRight, Building2,
  User, CreditCard, RefreshCw, ChevronRight
} from 'lucide-react';

const STEPS = [
  { id: 'init',        label: 'Verify Identity'    },
  { id: 'recipient',   label: 'Add Recipient'       },
  { id: 'fund',        label: 'Fund Account'        },
  { id: 'trade',       label: 'Convert to USDC'     },
  { id: 'remittance',  label: 'Send Remittance'     },
  { id: 'done',        label: 'Complete'            },
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

export default function CybridTransferModal({ amount, country, onClose }) {
  const { user: appUser, jwt } = useAppAuth();
  const [step, setStep] = useState('init');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [kycRefreshKey, setKycRefreshKey] = useState(0);

  // Customer & accounts
  const [customerGuid, setCustomerGuid] = useState(null);
  const [kycStatus, setKycStatus] = useState(null);
  const [kycLoading, setKycLoading] = useState(false);
  const [personaUrl, setPersonaUrl] = useState(null);
  const [fiatAccount, setFiatAccount] = useState(null);
  const [tradingAccount, setTradingAccount] = useState(null);
  const [externalBankAccount, setExternalBankAccount] = useState(null);

  // Recipient info
  const [recipientFirst, setRecipientFirst] = useState('');
  const [recipientLast, setRecipientLast]   = useState('');
  const [counterpartyGuid, setCounterpartyGuid] = useState(null);
  const [recipientRouting, setRecipientRouting] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [counterpartyBankAccountGuid, setCounterpartyBankAccountGuid] = useState(null);

  // Results
  const [fundTransfer, setFundTransfer] = useState(null);
  const [tradeTransfer, setTradeTransfer] = useState(null);
  const [remittanceResult, setRemittanceResult] = useState(null);

  const invoke = async (action, p = {}) => {
    const res = await base44.functions.fetch('/cybridTransfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Token': jwt || '',
      },
      body: JSON.stringify({ action, ...p }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Request failed');
    return { data };
  };

  // ── Step 1: Init — create customer + check KYC + create accounts ───────────
  useEffect(() => {
    const init = async () => {
      if (!appUser || !jwt) {
        setError('You must be logged in to send money. Please log in and try again.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        // Create/find customer
        const custRes = await invoke('createCustomer', { name: appUser.full_name, email: appUser.email });
        const guid = custRes.data?.customer?.guid;
        if (!guid) throw new Error('Could not create customer profile.');
        setCustomerGuid(guid);

        // Check KYC — auto-trigger in sandbox if not yet approved
        let statusRes = await invoke('getCustomerStatus', { customerGuid: guid });
        let kyc = statusRes.data?.customer?.state;

        // If not approved, try to run KYC (sandbox auto-passes)
        const isVerified = (s) => s === 'approved' || s === 'verified';

        if (!isVerified(kyc)) {
          try {
            const kycRes = await invoke('startKYC', { customerGuid: guid });
            if (kycRes.data?.outcome === 'passed' || kycRes.data?.state === 'completed') {
              statusRes = await invoke('getCustomerStatus', { customerGuid: guid });
              kyc = statusRes.data?.customer?.state;
            }
          } catch (_) {
            // ignore, will show manual button below
          }
        }

        setKycStatus(kyc);

        if (!isVerified(kyc)) {
          // Poll a few more times with delay in case verification is processing
          for (let i = 0; i < 5; i++) {
            await new Promise(r => setTimeout(r, 2000));
            statusRes = await invoke('getCustomerStatus', { customerGuid: guid });
            kyc = statusRes.data?.customer?.state;
            if (isVerified(kyc)) break;
          }
        }

        if (!isVerified(kyc)) {
          setLoading(false);
          return;
        }

        // Create fiat & trading accounts in parallel
        const [fiatRes, tradingRes] = await Promise.all([
          invoke('getOrCreateAccount', { customerGuid: guid, asset: 'USD', accountType: 'fiat' }),
          invoke('getOrCreateAccount', { customerGuid: guid, asset: 'USDC', accountType: 'trading' }),
        ]);

        setFiatAccount(fiatRes.data?.account);
        setTradingAccount(tradingRes.data?.account);

        // Check for existing linked bank account
        const banksRes = await invoke('listExternalBankAccounts', { customerGuid: guid });
        const linked = banksRes.data?.accounts?.[0];
        if (linked) setExternalBankAccount(linked);

        setStep('recipient');
      } catch (e) {
        const msg = e.message || '';
        if (msg.toLowerCase().includes('authentication') || msg.toLowerCase().includes('logged in')) {
          setError('You must be logged in to send money. Please log in and try again.');
        } else {
          setError(msg || 'Initialization failed.');
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [kycRefreshKey]);

  // ── Step 2: Create recipient counterparty + their bank account ─────────────
  const handleAddRecipient = async () => {
    if (!recipientFirst || !recipientLast || !recipientRouting || !recipientAccount) {
      setError('Please fill in all recipient details.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const cpRes = await invoke('createCounterparty', {
        customerGuid,
        firstName: recipientFirst,
        lastName: recipientLast,
        country,
      });
      const cpGuid = cpRes.data?.counterparty?.guid;
      if (!cpGuid) throw new Error('Could not create recipient.');
      setCounterpartyGuid(cpGuid);

      const bankRes = await invoke('createCounterpartyExternalBankAccount', {
        counterpartyGuid: cpGuid,
        accountNumber: recipientAccount,
        routingNumber: recipientRouting,
        country,
      });
      const cpBankGuid = bankRes.data?.externalBankAccount?.guid;
      if (!cpBankGuid) throw new Error('Could not add recipient bank account.');
      setCounterpartyBankAccountGuid(cpBankGuid);

      setStep('fund');
    } catch (e) {
      setError(e.message || 'Failed to add recipient.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Fund fiat account via ACH ─────────────────────────────────────
  const handleFund = async () => {
    if (!externalBankAccount) {
      setError('No linked bank account found. Please link your bank first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await invoke('fundViaACH', {
        customerGuid,
        fiatAccountGuid: fiatAccount.guid,
        externalBankAccountGuid: externalBankAccount.guid,
        amountUSD: amount,
      });
      setFundTransfer(res.data?.transfer);
      setStep('trade');
    } catch (e) {
      setError(e.message || 'Funding failed.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 4: Trade USD → USDC_SOL ─────────────────────────────────────────
  const handleTrade = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await invoke('tradeUSDtoUSDC', {
        customerGuid,
        fiatAccountGuid: fiatAccount.guid,
        tradingAccountGuid: tradingAccount.guid,
        amountUSD: amount,
      });
      setTradeTransfer(res.data?.transfer);
      setStep('remittance');
    } catch (e) {
      setError(e.message || 'Trade failed.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 5: Execute remittance ────────────────────────────────────────────
  const handleRemittance = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await invoke('executeRemittance', {
        customerGuid,
        tradingAccountGuid: tradingAccount.guid,
        counterpartyExternalBankAccountGuid: counterpartyBankAccountGuid,
        amountUSD: amount,
        country,
      });
      setRemittanceResult(res.data?.remittance);
      setStep('done');
    } catch (e) {
      setError(e.message || 'Remittance failed.');
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
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Send Money</h3>
          <p className="text-sm text-slate-500">
            <strong>{fmtAmt(amount)} USD</strong> → {country}
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

      {/* ── init ── */}
      {step === 'init' && (
        <div className="flex flex-col items-center py-10 gap-4 text-center">
          {loading ? (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <p className="font-semibold text-slate-800">Setting up your account…</p>
              <p className="text-sm text-slate-500">Creating customer profile & accounts</p>
            </>
          ) : error ? null : (kycStatus === 'approved' || kycStatus === 'verified') ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500" />
              <p className="font-semibold text-slate-800">Identity Verified</p>
              <p className="text-sm text-slate-600">Your accounts are ready.</p>
              <Button onClick={() => setStep('recipient')} className="w-full" style={{ backgroundColor: '#3D7BB7' }}>
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <AlertCircle className="w-16 h-16 text-amber-500" />
              <p className="font-semibold text-slate-800">Identity Verification Required</p>
              <p className="text-sm text-slate-600 mb-2">
                Your account needs to be verified before you can send money.
              </p>
              {personaUrl ? (
                <>
                  <a href={personaUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full" style={{ backgroundColor: '#3D7BB7' }}>
                      Open Verification →
                    </Button>
                  </a>
                  <p className="text-xs text-slate-400 mt-1">After completing verification, come back and try again.</p>
                  <Button onClick={onClose} variant="outline" className="w-full mt-1">Close</Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={async () => {
                      setKycLoading(true);
                      try {
                        const res = await invoke('startKYC', { customerGuid });
                        if (res.data?.personaUrl) {
                          setPersonaUrl(res.data.personaUrl);
                        } else if (res.data?.outcome === 'passed' || res.data?.state === 'approved') {
                          // Auto-passed in sandbox, refresh KYC status
                          setTimeout(() => setKycRefreshKey(k => k + 1), 500);
                        }
                      } catch (e) {
                        setError(e.message || 'Could not start verification.');
                      } finally {
                        setKycLoading(false);
                      }
                    }}
                    disabled={kycLoading}
                    className="w-full"
                    style={{ backgroundColor: '#3D7BB7' }}
                  >
                    {kycLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Starting...</> : 'Start Identity Verification'}
                  </Button>
                  <Button 
                    onClick={() => setKycRefreshKey(k => k + 1)} 
                    variant="outline" 
                    className="w-full mt-2"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check Verification Status
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ── recipient ── */}
      {step === 'recipient' && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <User className="w-4 h-4" /> Recipient Details
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">First Name</label>
              <Input placeholder="Maria" value={recipientFirst} onChange={e => setRecipientFirst(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Last Name</label>
              <Input placeholder="Garcia" value={recipientLast} onChange={e => setRecipientLast(e.target.value)} />
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-600 pt-1">Recipient's Bank Account ({country})</p>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Routing / SWIFT</label>
            <Input placeholder="Routing or SWIFT number" value={recipientRouting} onChange={e => setRecipientRouting(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Account Number</label>
            <Input placeholder="Account number" value={recipientAccount} onChange={e => setRecipientAccount(e.target.value)} />
          </div>
          <Button
            onClick={handleAddRecipient}
            disabled={loading}
            className="w-full mt-2"
            style={{ backgroundColor: '#3D7BB7' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Recipient <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* ── fund ── */}
      {step === 'fund' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-slate-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" /> Fund via ACH Pull
            </p>
            <p className="text-slate-600">
              We'll pull <strong>{fmtAmt(amount)}</strong> from your linked US bank account into your Cybrid USD wallet.
            </p>
            {externalBankAccount ? (
              <div className="bg-white rounded-lg px-3 py-2 border border-blue-100 text-xs text-slate-700">
                ✅ Linked bank: <strong>{externalBankAccount.name || externalBankAccount.guid}</strong>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-200 text-xs text-amber-700">
                ⚠️ No bank linked yet. Please link your US bank via Plaid first.
              </div>
            )}
          </div>
          <Button
            onClick={handleFund}
            disabled={loading || !externalBankAccount}
            className="w-full"
            style={{ backgroundColor: '#3D7BB7' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Pull {fmtAmt(amount)} via ACH <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* ── trade ── */}
      {step === 'trade' && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-slate-800">💱 Convert USD → USDC on Solana</p>
            <p className="text-slate-600">
              Your USD wallet has been funded. Now we'll trade <strong>{fmtAmt(amount)} USD</strong> for USDC_SOL to power the remittance.
            </p>
            {fundTransfer && (
              <div className="text-xs text-slate-500 font-mono bg-white rounded px-2 py-1 border">
                ACH Ref: {fundTransfer.guid} · Status: {fundTransfer.state}
              </div>
            )}
          </div>
          <Button
            onClick={handleTrade}
            disabled={loading}
            className="w-full"
            style={{ backgroundColor: '#7C3AED' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Trade USD → USDC_SOL <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* ── remittance ── */}
      {step === 'remittance' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-slate-800">🚀 Execute Remittance</p>
            <p className="text-slate-600">
              USDC is ready. Send <strong>{fmtAmt(amount)}</strong> to <strong>{recipientFirst} {recipientLast}</strong> in <strong>{country}</strong> via Solana rails.
            </p>
            {tradeTransfer && (
              <div className="text-xs text-slate-500 font-mono bg-white rounded px-2 py-1 border">
                Trade Ref: {tradeTransfer.guid} · Status: {tradeTransfer.state}
              </div>
            )}
          </div>
          <Button
            onClick={handleRemittance}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Send {fmtAmt(amount)} to {country} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* ── done ── */}
      {step === 'done' && (
        <div className="flex flex-col items-center py-4 gap-4 text-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30"></div>
            <div className="relative flex items-center justify-center w-20 h-20 bg-green-50 rounded-full border-4 border-green-200">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h4 className="text-xl font-bold text-slate-900">Remittance Sent! 🎉</h4>
          <p className="text-slate-600 text-sm">
            <strong>{fmtAmt(amount)} USD</strong> is on its way to <strong>{recipientFirst} {recipientLast}</strong> in <strong>{country}</strong>.
          </p>

          <div className="w-full space-y-2 text-xs text-left">
            <div className="bg-slate-50 border rounded-lg px-3 py-2 space-y-1">
              <p className="text-slate-500 font-semibold uppercase tracking-wide text-xs">Transaction Summary</p>
              {fundTransfer?.guid   && <p className="text-slate-600 font-mono">ACH:  {fundTransfer.guid}</p>}
              {tradeTransfer?.guid  && <p className="text-slate-600 font-mono">Trade: {tradeTransfer.guid}</p>}
              {remittanceResult?.guid && <p className="text-slate-600 font-mono">Remit: {remittanceResult.guid}</p>}
              <p className="text-slate-600">Status: <span className="font-semibold capitalize text-green-700">{remittanceResult?.state || 'submitted'}</span></p>
            </div>
          </div>

          <Button onClick={onClose} className="mt-2 w-full" style={{ backgroundColor: '#3D7BB7' }}>
            Done
          </Button>
        </div>
      )}
    </div>
  );
}