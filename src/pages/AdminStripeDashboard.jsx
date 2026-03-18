import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { DollarSign, TrendingUp, CreditCard, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const formatCurrency = (amount, currency = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

const statusColor = {
  succeeded: 'bg-green-100 text-green-700',
  requires_payment_method: 'bg-yellow-100 text-yellow-700',
  requires_confirmation: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  canceled: 'bg-red-100 text-red-700',
  active: 'bg-green-100 text-green-700',
  past_due: 'bg-orange-100 text-orange-700',
  canceled: 'bg-red-100 text-red-700',
  trialing: 'bg-blue-100 text-blue-700',
  incomplete: 'bg-yellow-100 text-yellow-700',
};

const StatusIcon = ({ status }) => {
  if (status === 'succeeded' || status === 'active') return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === 'canceled') return <XCircle className="w-4 h-4 text-red-500" />;
  if (status === 'processing') return <Clock className="w-4 h-4 text-blue-500" />;
  return <AlertCircle className="w-4 h-4 text-yellow-500" />;
};

export default function AdminStripeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('transactions');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const res = await base44.functions.invoke('getStripeDashboard', {});
    if (res.data?.error) {
      setError(res.data.error);
    } else {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-slate-600">Loading Stripe data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="p-8 text-center max-w-md">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Failed to Load</h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </Card>
    </div>
  );

  const { stats, transactions, subscriptions, moncash_topups = [] } = data;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Stripe Dashboard</h1>
            <p className="text-slate-500 mt-1">Payment activity and subscription overview</p>
          </div>
          <Button variant="outline" onClick={fetchData} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-slate-500 font-medium">Total Volume</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.total_volume)}</p>
            <p className="text-xs text-slate-400 mt-1">All time</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-slate-500 font-medium">Monthly Volume</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.monthly_volume)}</p>
            <p className="text-xs text-slate-400 mt-1">Last 30 days</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-slate-500 font-medium">Transactions</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.successful_charges}</p>
            <p className="text-xs text-slate-400 mt-1">Successful charges</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm text-slate-500 font-medium">Subscriptions</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.active_subscriptions}</p>
            <p className="text-xs text-slate-400 mt-1">Active of {stats.total_subscriptions} total</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'transactions' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border'}`}
          >
            Transactions ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'subscriptions' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border'}`}
          >
            Subscriptions ({subscriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('moncash')}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'moncash' ? 'bg-orange-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border'}`}
          >
            Moncash Top-Ups ({moncash_topups.length})
          </button>
        </div>

        {/* Transactions Table */}
        {activeTab === 'transactions' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">ID</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Description</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-slate-400">No transactions found</td></tr>
                  ) : transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{tx.id.slice(0, 20)}...</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(tx.amount, tx.currency)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[tx.status] || 'bg-slate-100 text-slate-600'}`}>
                          <StatusIcon status={tx.status} />
                          {tx.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{tx.description || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{format(new Date(tx.created * 1000), 'MMM d, yyyy HH:mm')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Subscriptions Table */}
        {activeTab === 'subscriptions' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">ID</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Plan</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Period End</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscriptions.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-slate-400">No subscriptions found</td></tr>
                  ) : subscriptions.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{sub.id.slice(0, 20)}...</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{sub.plan || '—'}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{sub.amount ? formatCurrency(sub.amount, sub.currency) : '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[sub.status] || 'bg-slate-100 text-slate-600'}`}>
                          <StatusIcon status={sub.status} />
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {sub.current_period_end ? format(new Date(sub.current_period_end * 1000), 'MMM d, yyyy') : '—'}
                      </td>
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