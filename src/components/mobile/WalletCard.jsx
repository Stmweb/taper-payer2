import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Wallet, Copy, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WalletCard({ user }) {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    base44.functions.invoke('getUserWallet', {})
      .then(res => { if (res.data?.address) setWallet(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const copy = () => {
    if (!wallet?.address) return;
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncate = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (loading) return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mx-4 mb-4 h-20 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  if (!wallet) return (
    <Link to="/MyWallet" className="block mx-4 mb-4">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">Create Your Wallet</p>
          <p className="text-white/70 text-xs">Tap to get your free BNB wallet</p>
        </div>
        <ChevronRight className="w-5 h-5 text-white/70" />
      </div>
    </Link>
  );

  return (
    <div className="mx-4 mb-4">
      <div
        className="rounded-2xl p-4"
        style={{ background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-white/80" />
            <span className="text-white/80 text-xs font-medium">My Wallet · BNB Chain</span>
          </div>
          <Link to="/MyWallet" className="text-white/70 text-xs flex items-center gap-0.5">
            Details <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-white font-mono text-sm">{truncate(wallet.address)}</span>
          <button onClick={copy} className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Copy className="w-3 h-3 text-white" />
          </button>
          {copied && <span className="text-white/70 text-xs">Copied!</span>}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'BNB', value: parseFloat(wallet.bnb || 0).toFixed(4), color: '#F0B90B' },
            { label: 'AGNV', value: parseFloat(wallet.agnv || 0).toFixed(2), color: '#7dd3fc' },
            { label: 'USDT', value: parseFloat(wallet.usdt || 0).toFixed(2), color: '#86efac' },
          ].map(b => (
            <div key={b.label} className="bg-white/10 rounded-xl p-2 text-center">
              <p className="text-xs font-bold" style={{ color: b.color }}>{b.label}</p>
              <p className="text-white font-semibold text-sm">{b.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}