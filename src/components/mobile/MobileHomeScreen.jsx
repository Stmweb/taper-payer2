import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  Bell, Send, DollarSign, MessageSquare, Users, HelpCircle,
  ChevronRight, Settings, ArrowUpRight, ArrowDownLeft, RefreshCw
} from 'lucide-react';
import HaitiTransferModal from '@/components/transfer/HaitiTransferModal';
import CybridTransferModal from '@/components/transfer/CybridTransferModal';
import SendAGNVModal from '@/components/transfer/SendAGNVModal';
import ComingSoonModal from '@/components/ComingSoonModal';
import RequestMoneyModal from '@/components/mobile/RequestMoneyModal';
import RequestTopUpModal from '@/components/mobile/RequestTopUpModal';
import TaperConnectFormWrapper from '@/components/topup/TaperConnectFormWrapper';
import { useAppAuth } from '@/lib/AppAuthContext';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const quickActions = [
  { id: 'send',        label: 'Send',        icon: Send,          color: '#3D7BB7' },
  { id: 'rates',       label: 'Rates',       icon: DollarSign,    color: '#3D7BB7', link: '/TaperPayerRates' },
  { id: 'request',     label: 'Request',     icon: MessageSquare, color: '#3D7BB7' },
  { id: 'refer',       label: 'Refer',       icon: Users,         color: '#3D7BB7' },
  { id: 'howitworks',  label: 'How it works',icon: HelpCircle,    color: '#3D7BB7', link: '/TaperPayerHowItWorks' },
];

const FILTER_TABS = ['All', 'Sent', 'Received', 'Pending'];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function MobileHomeScreen() {
  const { user, login } = useAppAuth();
  const [showTopup, setShowTopup] = useState(false);
  const [showHaiti, setShowHaiti] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showRequestMoney, setShowRequestMoney] = useState(false);
  const [showRequestTopUp, setShowRequestTopUp] = useState(false);
  const [showSendAGNV, setShowSendAGNV] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);

  const { permissionStatus, isSupported, requestPermission } = usePushNotifications();
  const [dismissedNotifBanner, setDismissedNotifBanner] = useState(
    () => localStorage.getItem('notif_banner_dismissed') === '1'
  );
  const showNotifBanner = user && isSupported && permissionStatus === 'default' && !dismissedNotifBanner;

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : null;
  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        try {
          const freshUser = await base44.auth.me();
          if (freshUser) login(freshUser, null, freshUser.cybrid_customer_id);
        } catch (e) {}
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [login]);

  // Load recent transactions
  useEffect(() => {
    const fetchTx = async () => {
      try {
        setLoadingTx(true);
        const [topups, agnv] = await Promise.all([
          user ? base44.entities.PendingTopup.filter({ created_by: user.email }, '-created_date', 10) : [],
          user ? base44.entities.AgnvTransaction.filter({ sender_id: user.email }, '-created_date', 10) : [],
        ]);

        const combined = [
          ...topups.map(t => ({
            id: t.id,
            name: t.operator_name || 'Mobile Top-Up',
            detail: (t.country_code || '') + ' · ' + new Date(t.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: `-$${t.amount?.toFixed(2)}`,
            status: t.status === 'completed' ? 'Delivered' : t.status === 'failed' ? 'Failed' : 'Pending',
            type: 'sent',
            color: '#3D7BB7',
          })),
          ...agnv.map(a => ({
            id: a.id,
            name: a.recipient_name || 'AGNV Transfer',
            detail: 'AGNV · ' + new Date(a.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: `-$${a.amount_usd?.toFixed(2)}`,
            status: a.status === 'completed' ? 'Delivered' : a.status === 'failed' ? 'Failed' : 'Pending',
            type: 'sent',
            color: '#7c3aed',
          })),
        ].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 8);

        setTransactions(combined);
      } catch (e) {
        setTransactions([]);
      } finally {
        setLoadingTx(false);
      }
    };
    fetchTx();
  }, [user]);

  const handleAction = (id) => {
    if (id === 'send') setShowComingSoon(true);
    else if (id === 'topup') setShowTopup(true);
    else if (id === 'request') setShowRequestMoney(true);
    else if (id === 'requesttopup') setShowRequestTopUp(true);
    else if (id === 'sendagnv') setShowSendAGNV(true);
    else setShowComingSoon(true);
  };

  const filteredTx = transactions.filter(t => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Sent') return t.type === 'sent';
    if (activeFilter === 'Received') return t.type === 'received';
    if (activeFilter === 'Pending') return t.status === 'Pending';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f3f6fa] pb-28">

      {/* ── Top Header ── */}
      <div className="bg-white px-5 pt-14 pb-4 flex items-center justify-between border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#3D7BB7] font-bold text-lg">Taper</span>
            <span className="text-[#61AF39] font-bold text-lg">Payer</span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            {getGreeting()} 👋
          </p>
          <p className="text-slate-900 font-bold text-base leading-tight">
            {user?.full_name || 'Welcome'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showNotifBanner && (
            <button
              onClick={async () => {
                await requestPermission();
                setDismissedNotifBanner(true);
                localStorage.setItem('notif_banner_dismissed', '1');
              }}
              className="relative w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
            </button>
          )}
          {!showNotifBanner && (
            <button className="relative w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <Link to="/AccountSettings">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: '#3D7BB7' }}>
              {initials}
            </div>
          </Link>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* ── Promo Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
        >
          <span className="text-3xl">🎉</span>
          <div className="flex-1">
            <p className="text-green-800 font-bold text-sm">First transfer FREE</p>
            <p className="text-green-700 text-xs leading-tight">Zero fees on your first international transfer.</p>
          </div>
          <button
            onClick={() => setShowComingSoon(true)}
            className="bg-[#61AF39] text-white text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap"
          >
            Use now
          </button>
        </motion.div>

        {/* ── Balance Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #3D7BB7 0%, #2563a8 60%, #1a4d8f 100%)' }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute top-6 -right-2 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

          <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-1">Available Balance</p>
          <p className="text-white text-4xl font-extrabold mb-0.5">$0.00</p>
          <p className="text-white/60 text-xs mb-5">USD · Updated just now</p>

          <div className="flex gap-3">
            <button
              onClick={() => setShowComingSoon(true)}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-4 h-4" /> Send
            </button>
            <button
              onClick={() => setShowTopup(true)}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              + Top Up
            </button>
            <button
              onClick={() => setShowComingSoon(true)}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> History
            </button>
          </div>
        </motion.div>

        {/* ── Quick Actions ── */}
        <div>
          <h2 className="text-slate-800 font-bold text-base mb-3">Quick Actions</h2>
          <div className="flex gap-4 justify-between">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              const content = (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <span className="text-slate-500 text-[10px] font-medium text-center leading-tight">{action.label}</span>
                </motion.div>
              );

              if (action.link) {
                return <Link key={action.id} to={action.link} className="flex-1">{content}</Link>;
              }
              return (
                <button key={action.id} className="flex-1" onClick={() => handleAction(action.id)}>
                  {content}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Recent Transfers ── */}
        <div>
          <h2 className="text-slate-800 font-bold text-base mb-3">Recent Transfers</h2>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-3">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  activeFilter === tab
                    ? 'text-white'
                    : 'bg-white text-slate-500 border border-slate-200'
                }`}
                style={activeFilter === tab ? { backgroundColor: '#3D7BB7' } : {}}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Transaction list */}
          <div className="bg-white rounded-2xl overflow-hidden divide-y divide-slate-50">
            {loadingTx ? (
              <div className="py-8 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-[#3D7BB7] rounded-full animate-spin" />
              </div>
            ) : filteredTx.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-slate-400 text-sm">No transactions yet</p>
                <button
                  onClick={() => setShowComingSoon(true)}
                  className="mt-3 text-xs font-semibold px-4 py-2 rounded-xl text-white"
                  style={{ backgroundColor: '#3D7BB7' }}
                >
                  Send Money
                </button>
              </div>
            ) : (
              filteredTx.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: tx.color + '18' }}
                  >
                    {tx.type === 'received'
                      ? <ArrowDownLeft className="w-4 h-4" style={{ color: '#61AF39' }} />
                      : <ArrowUpRight className="w-4 h-4" style={{ color: tx.color }} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-semibold text-sm truncate">{tx.name}</p>
                    <p className="text-slate-400 text-xs truncate">{tx.detail}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-bold text-sm ${tx.type === 'received' ? 'text-green-600' : 'text-slate-800'}`}>
                      {tx.amount}
                    </p>
                    <p className="text-xs text-slate-400">
                      {tx.status === 'Delivered' ? '✓ ' : tx.status === 'Failed' ? '✗ ' : '⏳ '}
                      {tx.status}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showTopup && createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowTopup(false)} />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative bg-white rounded-t-3xl w-full max-h-[92vh] overflow-y-auto"
          >
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-2" />
            <button onClick={() => setShowTopup(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10 text-slate-500">✕</button>
            <div className="p-6 pt-4"><TaperConnectFormWrapper /></div>
          </motion.div>
        </div>,
        document.body
      )}

      {showHaiti && createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowHaiti(false)} />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative bg-white rounded-t-3xl w-full max-h-[92vh] overflow-y-auto"
          >
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-2" />
            <button onClick={() => setShowHaiti(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10 text-slate-500">✕</button>
            <HaitiTransferModal amount="100" onClose={() => setShowHaiti(false)} />
          </motion.div>
        </div>,
        document.body
      )}

      {showTransfer && createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowTransfer(false)} />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative bg-white rounded-t-3xl w-full max-h-[92vh] overflow-y-auto"
          >
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-2" />
            <button onClick={() => setShowTransfer(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10 text-slate-500">✕</button>
            <CybridTransferModal amount="100" onClose={() => setShowTransfer(false)} />
          </motion.div>
        </div>,
        document.body
      )}

      {showSendAGNV && createPortal(
        <SendAGNVModal isOpen={showSendAGNV} onClose={() => setShowSendAGNV(false)} />,
        document.body
      )}

      <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />
      <RequestMoneyModal isOpen={showRequestMoney} onClose={() => setShowRequestMoney(false)} />
      <RequestTopUpModal isOpen={showRequestTopUp} onClose={() => setShowRequestTopUp(false)} />
    </div>
  );
}