import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Copy, RefreshCw, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminMasterWallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('getMasterWallet', {});
      setWallet(res.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const copy = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="w-7 h-7 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Master Wallet</h1>
          <button onClick={load} className="ml-auto text-gray-500 hover:text-blue-600 min-h-0 min-w-0 p-1">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4 text-sm">{error}</div>
        )}

        {loading && !wallet ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : wallet ? (
          <div className="space-y-4">
            {/* Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Wallet Address (BNB Smart Chain)</p>
              <div className="flex items-center gap-2">
                <code className="text-sm text-gray-800 break-all flex-1">{wallet.address}</code>
                <button onClick={copy} className="flex-shrink-0 text-gray-400 hover:text-blue-600 min-h-0 min-w-0 p-1">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <p className="text-xs text-green-600 mt-1">Copied!</p>}
            </div>

            {/* Balances */}
            <div className="grid grid-cols-3 gap-3">
              <BalanceCard label="BNB" value={parseFloat(wallet.bnb).toFixed(4)} color="text-yellow-600" bg="bg-yellow-50" />
              <BalanceCard label="AGNV" value={parseFloat(wallet.agnv).toFixed(2)} color="text-purple-600" bg="bg-purple-50" />
              <BalanceCard label="USDC" value={parseFloat(wallet.usdc).toFixed(2)} color="text-green-600" bg="bg-green-50" />
            </div>

            <p className="text-xs text-gray-400 text-center pt-2">Live balances from BNB Smart Chain</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BalanceCard({ label, value, color, bg }) {
  return (
    <div className={`${bg} rounded-2xl p-4 text-center`}>
      <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}