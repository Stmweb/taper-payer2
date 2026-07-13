import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/AppAuthContext';
import { Wallet, Copy, RefreshCw, ExternalLink, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BalanceCard = ({ label, value, symbol, color }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-1">
    <span className="text-slate-500 text-xs font-medium">{label}</span>
    <span className="text-slate-900 text-xl font-bold">{value ?? '—'}</span>
    <span className="text-xs font-medium" style={{ color }}>{symbol}</span>
  </div>
);

export default function MyWallet() {
  const { user } = useAppAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const fetchWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('getUserWallet', {});
      if (res.data?.address) setWallet(res.data);
      else setWallet(null);
    } catch (e) {
      setError('Could not load wallet.');
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async () => {
    setCreating(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('createUserWallet', {});
      if (res.data?.address) setWallet(res.data);
    } catch (e) {
      setError('Wallet creation failed. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => { fetchWallet(); }, []);

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncate = (addr) => addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : '';

  return (
    <div className="min-h-screen bg-[#f1f5f9] pb-28">
      {/* Header */}
      <div
        className="relative overflow-hidden px-5 pt-14 pb-8"
        style={{ background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 40%, #00ACC1 75%, #26C6A0 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3 mb-6">
          <Link to="/TaperPayerHome" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-white text-xl font-bold">My Wallet</h1>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs">BNB Smart Chain</p>
            <p className="text-white font-semibold text-sm">
              {wallet?.address ? truncate(wallet.address) : 'No wallet yet'}
            </p>
          </div>
          {wallet?.address && (
            <button onClick={copyAddress} className="ml-auto w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Copy className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
        {copied && <p className="relative z-10 text-white/80 text-xs mt-2 text-center">Address copied!</p>}
      </div>

      <div className="px-4 pt-5">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-red-600 text-sm text-center">{error}</div>
        ) : !wallet ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-slate-800 font-bold text-lg mb-2">Create Your Wallet</h2>
            <p className="text-slate-500 text-sm mb-5">Get a free BNB Smart Chain wallet to send and receive AGNV tokens.</p>
            <button
              onClick={createWallet}
              disabled={creating}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm disabled:opacity-60"
            >
              {creating ? 'Creating...' : 'Create Wallet'}
            </button>
          </motion.div>
        ) : (
          <>
            {/* Full address */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-500 text-xs font-medium">Wallet Address</span>
                <div className="flex gap-2">
                  <button onClick={fetchWallet} className="flex items-center gap-1 text-xs text-slate-400">
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                  <a
                    href={`https://bscscan.com/address/${wallet.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-500"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <p className="text-slate-700 text-xs font-mono break-all">{wallet.address}</p>
            </div>

            {/* Balances */}
            <h2 className="text-slate-800 font-bold text-base mb-3">Balances</h2>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <BalanceCard label="BNB" value={parseFloat(wallet.bnb || 0).toFixed(4)} symbol="Binance Coin" color="#F0B90B" />
              <BalanceCard label="AGNV" value={parseFloat(wallet.agnv || 0).toFixed(2)} symbol="AGNV Token" color="#3D7BB7" />
              <BalanceCard label="USDT" value={parseFloat(wallet.usdt || 0).toFixed(2)} symbol="Tether USD" color="#26A17B" />
              <BalanceCard label="USDC" value={parseFloat(wallet.usdc || 0).toFixed(2)} symbol="USD Coin" color="#2775CA" />
            </div>

            {/* Fund CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-5 text-white">
              <h3 className="font-bold text-base mb-1">Fund Your Wallet</h3>
              <p className="text-white/80 text-sm mb-4">Add funds to start sending money with AGNV tokens.</p>
              <button
                onClick={() => window.open(`https://transak.com/?walletAddress=${wallet.address}&cryptoCurrencyCode=BNB`, '_blank')}
                className="w-full py-3 rounded-xl bg-white text-blue-600 font-semibold text-sm"
              >
                Buy Crypto
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}