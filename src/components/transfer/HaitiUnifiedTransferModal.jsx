import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/AppAuthContext';
import {
  Loader2, CheckCircle, AlertCircle, ArrowRight,
  DollarSign, CreditCard, RefreshCw, ExternalLink, Users
} from 'lucide-react';

const STEPS = [
  { id: 'kyc',       label: 'Verify Identity' },
  { id: 'bank',      label: 'Link Bank'       },
  { id: 'recipient', label: 'Recipient'       },
  { id: 'quote',     label: 'Get Quote'       },
  { id: 'send',      label: 'Send'            },
  { id: 'done',      label: 'Complete'        },
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

export default function HaitiUnifiedTransferModal({ amount, onClose }) {
  const { user: appUser, jwt } = useAppAuth();
  const [step, setStep] = useState('kyc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [kycRefreshKey, setKycRefreshKey] = useState(0);

  // ── Cybrid sender-side state ──────────────────────────────────────────────
  const [customerGuid, setCustomerGuid] = useState(null);
  const [kycStatus, setKycStatus] = useState(null);
  const [personaUrl, setPersonaUrl] = useState(null);
  const [fiatAccount, setFiatAccount] = useState(null);
  const [tradingAccount, setTradingAccount] = useState(null);
  const [externalBankAccount, setExternalBankAccount] = useState(null);
  const [linkingBank, setLinkingBank] = useState(false);
  const [cybridWalletAddress, setCybridWalletAddress] = useState(null);
  const [fundTransfer, setFundTransfer] = useState(null);
  const [tradeTransfer, setTradeTransfer] = useState(null);

  // ── Blindpay receiver-side state ──────────────────────────────────────────
  const [receivers, setReceivers] = useState([]);
  const [loadingReceivers, setLoadingReceivers] = useState(false);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState('');
  const [selectedReceiverName, setSelectedReceiverName] = useState('');
  const [quote, setQuote] = useState(null);
  const [payoutResult, setPayoutResult] = useState(null);

  const cybrid = async (action, p = {}) => {
    const res = await base44.functions.invoke('cybridTransfer', { action, ...p });
    if (res.data?.error) throw new Error(res.data.error);
    return res.data;
  };

  const bp = async (action, p = {}) => {
    const res = await base44.functions.invoke('haitiTransfer', { action, ...p });
    if (res.data?.error) throw new Error(res.data.error);
    return res.data;
  };

  // ── Step 1: Cybrid KYC init ───────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      if (!appUser || !jwt) {
        setError('You must be logged in to send money.');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const custRes = await cybrid('createCustomer', { name: appUser.full_name, email: appUser.email });
        const guid = custRes.customer?.guid;
        if (!guid) throw new Error('Could not create customer profile.');
        setCustomerGuid(guid);

        const kycRes = await cybrid('startKYC', { customerGuid: guid });
        const { alreadyVerified, personaUrl: pUrl, state: kycState } = kycRes || {};

        if (pUrl) {
          setPersonaUrl(pUrl);
          setKycStatus(kycState || 'unverified');
          setLoading(false);
          return;
        }
        if (!alreadyVerified) {
          setKycStatus(kycState || 'unverified');
          setLoading(false);
          return;
        }

        setKycStatus('verified');

        // Load accounts
        const [fiatRes, tradingRes] = await Promise.all([
          cybrid('getOrCreateAccount', { customerGuid: guid, asset: 'USD', accountType: 'fiat' }),
          cybrid('getOrCreateAccount', { customerGuid: guid, asset: 'USDC_SOL', accountType: 'trading' }),
        ]);
        setFiatAccount(fiatRes.account);
        setTradingAccount(tradingRes.account);

        // Check existing linked bank
        const banksRes = await cybrid('listExternalBankAccounts', { customerGuid: guid });
        const linked = banksRes.accounts?.[0];
        if (linked) {
          setExternalBankAccount(linked);
          setStep('recipient');
        } else {
          setStep('bank');
        }
      } catch (e) {
        setError(e.message || 'Initialization failed.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [kycRefreshKey]);

  // Load Blindpay receivers when entering recipient step
  useEffect(() => {
    if (step !== 'recipient' || receivers.length > 0) return;
    (async () => {
      setLoadingReceivers(true);
      try {
        const data = await bp('getReceivers');
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
  }, [step]);

  // ── Link bank via Plaid ───────────────────────────────────────────────────
  const handleOpenPlaid = async () => {
    setLinkingBank(true);
    setError('');
    try {
      const wfRes = await cybrid('createPlaidWorkflow', { customerGuid });
      const plaidLinkToken = wfRes.plaidLinkToken;
      if (!plaidLinkToken) throw new Error('Could not get Plaid link token.');

      await new Promise((resolve, reject) => {
        if (window.Plaid) return resolve();
        const script = document.createElement('script');
        script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load Plaid SDK.'));
        document.head.appendChild(script);
      });

      const handler = window.Plaid.create({
        token: plaidLinkToken,
        onSuccess: async (publicToken, metadata) => {
          const accountId = metadata?.accounts?.[0]?.id;
          try {
            const res = await cybrid('createExternalBankAccount', {
              customerGuid,
              plaidPublicToken: publicToken,
              plaidAccountId: accountId,
            });
            setExternalBankAccount(res.externalBankAccount);
            setStep('recipient');
          } catch (e) {
            setError(e.message || 'Failed to save bank account.');
          } finally {
            setLinkingBank(false);
          }
        },
        onExit: () => setLinkingBank(false),
      });
      handler.open();
    } catch (e) {
      setError(e.message || 'Failed to open Plaid.');
      setLinkingBank(false);
    }
  };

  // ── Get Blindpay quote ────────────────────────────────────────────────────
  const handleGetQuote = async () => {
    if (!selectedBankAccountId) { setError('Please select a recipient.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await bp('createPayoutQuote', {
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

  // ── Execute: ACH pull → trade USD→USDC → Blindpay payout ─────────────────
  const handleSend = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fund via ACH
      const fundRes = await cybrid('fundViaACH', {
        customerGuid,
        fiatAccountGuid: fiatAccount.guid,
        externalBankAccountGuid: externalBankAccount.guid,
        amountUSD: amount,
      });
      setFundTransfer(fundRes.transfer);

      // 2. Trade USD → USDC
      const tradeRes = await cybrid('tradeUSDtoUSDC', {
        customerGuid,
        fiatAccountGuid: fiatAccount.guid,
        tradingAccountGuid: tradingAccount.guid,
        amountUSD: amount,
      });
      setTradeTransfer(tradeRes.transfer);

      // Get Cybrid USDC wallet address to use as sender for Blindpay
      const walletRes = await cybrid('getOrCreateAccount', {
        customerGuid,
        asset: 'USDC_SOL',
        accountType: 'trading',
      });
      const walletAddr = walletRes.account?.platform_address || walletRes.account?.guid;
      setCybridWalletAddress(walletAddr);

      // 3. Execute Blindpay payout using the Cybrid USDC wallet as sender
      const payoutRes = await bp('executePayout', {
        quote_id: quote.id,
        sender_wallet_address: walletAddr || '0x0000000000000000000000000000000000000000',
        network: 'base',
      });
      setPayoutResult(payoutRes.payout);
      setStep('done');
    } catch (e) {
      setError(e.message || 'Transfer failed.');
    } finally {
      setLoading(false);
    }
  };

  const fmtAmt = (v) => `$${parseFloat(v || amount).toFixed(2)}`;

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center shrink-0">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Send to Haiti 🇭🇹</h3>
          <p className="text-sm text-slate-500"><strong>{fmtAmt(amount)} USD</strong> via Cybrid + Blindpay</p>
        </div>
      </div>

      <StepIndicator currentStep={step} />

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* ── KYC ── */}
      {step === 'kyc' && (
        <div className="flex flex-col items-center py-6 gap-4 w-full">
          {loading ? (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <p className="font-semibold text-slate-800">Setting up your account…</p>
            </>
          ) : kycStatus === 'verified' ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500" />
              <p className="font-semibold text-slate-800">Identity Verified ✅</p>
              <Button onClick={() => setStep(externalBankAccount ? 'recipient' : 'bank')} className="w-full" style={{ backgroundColor: '#3D7BB7' }}>
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </>
          ) : customerGuid ? (
            <div className="w-full space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center space-y-3">
                <div className="text-3xl">🪪</div>
                <p className="font-semibold text-slate-800">Identity Verification Required</p>
                <p className="text-sm text-slate-600">One-time process — takes about 2 minutes.</p>
                {personaUrl ? (
                  <Button className="w-full" style={{ backgroundColor: '#3D7BB7' }} onClick={() => window.open(personaUrl, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" /> Start Verification →
                  </Button>
                ) : (
                  <Button className="w-full" style={{ backgroundColor: '#3D7BB7' }} onClick={() => setKycRefreshKey(k => k + 1)}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Check Status
                  </Button>
                )}
              </div>
              {personaUrl && (
                <Button onClick={() => setKycRefreshKey(k => k + 1)} className="w-full" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" /> I've Completed Verification
                </Button>
              )}
              <Button onClick={onClose} variant="outline" className="w-full">Cancel</Button>
            </div>
          ) : null}
        </div>
      )}

      {/* ── Bank Link ── */}
      {step === 'bank' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-slate-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" /> Link Your US Bank Account
            </p>
            <p className="text-slate-600">Connect your bank via Plaid to fund the transfer.</p>
          </div>
          <Button onClick={handleOpenPlaid} disabled={linkingBank} className="w-full" style={{ backgroundColor: '#3D7BB7' }}>
            {linkingBank ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : '🔗 '}
            {linkingBank ? 'Opening Plaid…' : 'Connect Bank with Plaid'}
          </Button>
        </div>
      )}

      {/* ── Recipient selection ── */}
      {step === 'recipient' && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Users className="w-4 h-4" /> Select Haiti Recipient
          </p>
          {loadingReceivers ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm py-4 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading recipients…
            </div>
          ) : receivers.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
              No Haiti recipients found in Blindpay.
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
          <Button onClick={handleGetQuote} disabled={loading || !selectedBankAccountId} className="w-full" style={{ backgroundColor: '#3D7BB7' }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Get Quote <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* ── Quote confirmation ── */}
      {step === 'quote' && quote && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-slate-800">📋 Transfer Summary</p>
            <div className="space-y-1 text-slate-700">
              <p>You send: <strong>{fmtAmt(amount)} USD</strong> (via ACH from your US bank)</p>
              <p>Recipient: <strong>{selectedReceiverName}</strong></p>
              {quote.receiver_amount && (
                <p>They receive: <strong>{(quote.receiver_amount / 100).toFixed(2)} {quote.receive_currency || 'HTG'}</strong></p>
              )}
              {quote.exchange_rate && (
                <p>Rate: <strong>1 USD = {quote.exchange_rate} {quote.receive_currency || 'HTG'}</strong></p>
              )}
              <div className="mt-2 pt-2 border-t border-blue-200 text-xs text-slate-500 space-y-0.5">
                <p>Step 1: ACH pull from your US bank → Cybrid USD wallet</p>
                <p>Step 2: Cybrid converts USD → USDC (Base network)</p>
                <p>Step 3: Blindpay delivers HTG to recipient's Haiti bank</p>
              </div>
            </div>
          </div>
          <Button onClick={handleSend} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Processing…' : `Confirm & Send ${fmtAmt(amount)}`}
            {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
          </Button>
          {loading && (
            <p className="text-xs text-center text-slate-500 animate-pulse">
              Processing ACH → USDC → HTG payout… please wait.
            </p>
          )}
        </div>
      )}

      {/* ── Done ── */}
      {step === 'done' && (
        <div className="flex flex-col items-center py-4 gap-4 text-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
            <div className="relative flex items-center justify-center w-20 h-20 bg-green-50 rounded-full border-4 border-green-200">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h4 className="text-xl font-bold text-slate-900">Transfer Initiated! 🎉</h4>
          <p className="text-slate-600 text-sm">
            <strong>{fmtAmt(amount)}</strong> is on its way to <strong>{selectedReceiverName}</strong> in Haiti.
          </p>
          <div className="w-full text-xs text-left bg-slate-50 border rounded-lg px-3 py-2 space-y-1">
            <p className="text-slate-500 font-semibold uppercase tracking-wide">Transaction Details</p>
            {fundTransfer?.guid  && <p className="text-slate-600 font-mono">ACH: {fundTransfer.guid}</p>}
            {tradeTransfer?.guid && <p className="text-slate-600 font-mono">Trade: {tradeTransfer.guid}</p>}
            {payoutResult?.id    && <p className="text-slate-600 font-mono">Payout: {payoutResult.id}</p>}
            <p className="text-slate-600">Status: <span className="font-semibold text-green-700">{payoutResult?.status || 'pending'}</span></p>
          </div>
          <Button onClick={onClose} className="mt-2 w-full" style={{ backgroundColor: '#3D7BB7' }}>Done</Button>
        </div>
      )}
    </div>
  );
}