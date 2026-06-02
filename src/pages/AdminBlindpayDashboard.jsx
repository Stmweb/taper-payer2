import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { RefreshCw, XCircle, ArrowDownLeft, ArrowUpRight, Users, Wallet, Building2, Bell, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const statusColor = (status) => {
  if (!status) return 'bg-slate-100 text-slate-600';
  if (['completed', 'paid', 'settled', 'success'].includes(status)) return 'bg-green-100 text-green-700';
  if (['failed', 'rejected', 'canceled'].includes(status)) return 'bg-red-100 text-red-700';
  if (['on_hold', 'verifying', 'pending'].includes(status)) return 'bg-yellow-100 text-yellow-700';
  return 'bg-blue-100 text-blue-700';
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(status)}`}>
    {status || '—'}
  </span>
);

const fmt = (amount, currency = 'USD') => {
  if (amount == null) return '—';
  const num = typeof amount === 'number' ? amount / 100 : parseFloat(amount);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num);
};

export default function AdminBlindpayDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('payins');
  const [alertSending, setAlertSending] = useState(false);
  const [alertResult, setAlertResult] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const res = await base44.functions.invoke('blindpayGetTransactions', {});
    if (res.data?.error) {
      setError(res.data.error);
    } else {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const sendTestAlert = async () => {
    setAlertSending(true);
    setAlertResult(null);
    const res = await base44.functions.invoke('blindpayStatusAlert', {});
    if (res.data?.success) {
      setAlertResult({ ok: true, msg: `Alert sent — ${res.data.changed_payins} payin(s), ${res.data.changed_payouts} payout(s) with status changes.` });
    } else {
      setAlertResult({ ok: false, msg: res.data?.error || 'Unknown error' });
    }
    setAlertSending(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
        <p className="text-slate-600">Loading Blindpay data…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="p-8 text-center max-w-md">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Failed to Load</h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={load}>Retry</Button>
      </Card>
    </div>
  );

  const { payins = [], payouts = [], receivers = [], wallets = [], bankAccounts = [] } = data || {};

  const tabs = [
    { key: 'payins', label: `Payins (${payins.length})`, icon: ArrowDownLeft },
    { key: 'payouts', label: `Payouts (${payouts.length})`, icon: ArrowUpRight },
    { key: 'receivers', label: `Receivers (${receivers.length})`, icon: Users },
    { key: 'wallets', label: `Wallets (${wallets.length})`, icon: Wallet },
    { key: 'bankAccounts', label: `Bank Accounts (${bankAccounts.length})`, icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Blindpay Dashboard</h1>
            <p className="text-slate-500 mt-1">Stablecoin payins &amp; fiat payouts via Blindpay</p>
          </div>
          <div className="flex items-center gap-3">
            {alertResult && (
              <span className={`text-sm flex items-center gap-1 ${alertResult.ok ? 'text-green-600' : 'text-red-600'}`}>
                <CheckCircle className="w-4 h-4" /> {alertResult.msg}
              </span>
            )}
            <Button variant="outline" onClick={sendTestAlert} disabled={alertSending} className="gap-2">
              <Bell className="w-4 h-4" /> {alertSending ? 'Checking…' : 'Run Alert Check'}
            </Button>
            <Button variant="outline" onClick={load} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <Card className="p-6 text-center">
            <ArrowDownLeft className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{payins.length}</p>
            <p className="text-sm text-slate-500">Total Payins</p>
          </Card>
          <Card className="p-6 text-center">
            <ArrowUpRight className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{payouts.length}</p>
            <p className="text-sm text-slate-500">Total Payouts</p>
          </Card>
          <Card className="p-6 text-center">
            <Users className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{receivers.length}</p>
            <p className="text-sm text-slate-500">Receivers</p>
          </Card>
          <Card className="p-6 text-center">
            <Wallet className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{wallets.length}</p>
            <p className="text-sm text-slate-500">Wallets</p>
          </Card>
          <Card className="p-6 text-center">
            <Building2 className="w-6 h-6 text-teal-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{bankAccounts.length}</p>
            <p className="text-sm text-slate-500">Bank Accounts</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition-colors ${tab === t.key ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border'}`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Payins Table */}
        {tab === 'payins' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    {['ID', 'Amount', 'Currency', 'Method', 'Status', 'Created'].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payins.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-slate-400">No payins yet</td></tr>
                  ) : payins.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.id}</td>
                      <td className="px-6 py-4 font-semibold">{fmt(p.request_amount, p.request_currency)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{p.request_currency}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{p.payment_method || '—'}</td>
                      <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                      <td className="px-6 py-4 text-sm text-slate-500">{p.created_at ? format(new Date(p.created_at), 'MMM d, yyyy') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Payouts Table */}
        {tab === 'payouts' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    {['ID', 'Send Amount', 'Receive Amount', 'Currency', 'Status', 'Created'].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payouts.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-slate-400">No payouts yet</td></tr>
                  ) : payouts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.id}</td>
                      <td className="px-6 py-4 font-semibold">{fmt(p.request_amount, 'USD')} USDC</td>
                      <td className="px-6 py-4 font-semibold text-emerald-700">{fmt(p.receive_amount, p.receive_currency)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{p.receive_currency || '—'}</td>
                      <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                      <td className="px-6 py-4 text-sm text-slate-500">{p.created_at ? format(new Date(p.created_at), 'MMM d, yyyy') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Receivers Table */}
        {tab === 'receivers' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    {['ID', 'Name', 'Email', 'Type', 'Country', 'KYC Status'].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receivers.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-slate-400">No receivers yet</td></tr>
                  ) : receivers.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{r.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {r.legal_name || `${r.first_name || ''} ${r.last_name || ''}`.trim() || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{r.email || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">{r.type || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{r.country || '—'}</td>
                      <td className="px-6 py-4"><StatusBadge status={r.kyc_status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Wallets Table */}
        {tab === 'wallets' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    {['ID', 'Name', 'Network', 'Address', 'Receiver'].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {wallets.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-slate-400">No wallets yet</td></tr>
                  ) : wallets.map(w => (
                    <tr key={w.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{w.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{w.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">{w.network || '—'}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 max-w-xs truncate">{w.address || '—'}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{w.receiver_id || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Bank Accounts Table */}
        {tab === 'bankAccounts' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    {['ID', 'Name', 'Type', 'Beneficiary', 'Routing', 'Account', 'Country'].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bankAccounts.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-slate-400">No bank accounts yet</td></tr>
                  ) : bankAccounts.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{b.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{b.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 uppercase">{b.type || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{b.beneficiary_name || '—'}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{b.routing_number || '—'}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{b.account_number || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{b.country || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}