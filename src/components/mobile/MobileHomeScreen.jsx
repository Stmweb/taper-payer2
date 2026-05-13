import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  Send, Bell, Settings, ChevronRight,
  PhoneCall, HandCoins, PhoneOutgoing, DollarSign, Users
} from 'lucide-react';
import TaperConnectFormWrapper from '@/components/topup/TaperConnectFormWrapper';
import HaitiTransferModal from '@/components/transfer/HaitiTransferModal';
import CybridTransferModal from '@/components/transfer/CybridTransferModal';
import SendAGNVModal from '@/components/transfer/SendAGNVModal';
import ComingSoonModal from '@/components/ComingSoonModal';
import RequestMoneyModal from '@/components/mobile/RequestMoneyModal';
import RequestTopUpModal from '@/components/mobile/RequestTopUpModal';
import RecentTransactions from '@/components/mobile/RecentTransactions';
import { useAppAuth } from '@/lib/AppAuthContext';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const quickActions = [
  { id: 'send',        label: 'Send Money',    icon: Send,         iconBg: '#dbeafe', iconColor: '#3D7BB7' },
  { id: 'topup',       label: 'Mobile Top-Up', icon: PhoneCall,    iconBg: '#fff3e0', iconColor: '#F88F2B' },
  { id: 'request',     label: 'Request Money', icon: HandCoins,    iconBg: '#dcfce7', iconColor: '#61AF39' },
  { id: 'requesttopup',label: 'Request Top-Up',   icon: PhoneOutgoing,iconBg: '#fce7f3', iconColor: '#e91e8c' },

];


const destinations = [
  { name: 'Haiti',             flag: '🇭🇹' },
  { name: 'USA',               flag: '🇺🇸' },
  { name: 'Ghana',             flag: '🇬🇭' },
  { name: 'Kenya',             flag: '🇰🇪' },
  { name: 'Senegal',           flag: '🇸🇳' },
  { name: 'Dominican Republic',flag: '🇩🇴' },
  { name: 'Mexico',            flag: '🇲🇽' },
  { name: 'Angola',            flag: '🇦🇴' },
];

export default function MobileHomeScreen() {
  const { user, login } = useAppAuth();
  const [showTopup, setShowTopup] = useState(false);
  const [showHaiti, setShowHaiti] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showRequestMoney, setShowRequestMoney] = useState(false);
  const [showRequestTopUp, setShowRequestTopUp] = useState(false);
  const [showSendAGNV, setShowSendAGNV] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dismissedNotifBanner, setDismissedNotifBanner] = useState(
    () => localStorage.getItem('notif_banner_dismissed') === '1'
  );
  const { permissionStatus, isSupported, requestPermission } = usePushNotifications();

  const showNotifBanner = user && isSupported && permissionStatus === 'default' && !dismissedNotifBanner;

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

  const handleAction = (id) => {
    if (id === 'topup') setShowComingSoon(true);
    else if (id === 'request') setShowRequestMoney(true);
    else if (id === 'requesttopup') setShowRequestTopUp(true);
    else if (id === 'sendagnv') setShowSendAGNV(true);
    else setShowComingSoon(true);
  };

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : null;

  return (
    <div className="min-h-screen bg-[#f1f5f9] pb-28">

      {/* ── Hero / Header Card ── */}
      <div
        className="relative overflow-hidden px-5 pt-14 pb-8"
        style={{ background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 40%, #00ACC1 75%, #26C6A0 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute top-4 -right-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between mb-7">
          <div>
            <p className="text-white/70 text-sm">
              {firstName ? `Welcome back 👋` : 'Welcome to'}
            </p>
            <h1 className="text-white text-2xl font-bold mt-0.5 tracking-tight">
              {firstName ?? 'Taper Payer'}
            </h1>
          </div>
          <div className="flex gap-2">
            {showNotifBanner && (
              <button
                onClick={async () => {
                  await requestPermission();
                  setDismissedNotifBanner(true);
                  localStorage.setItem('notif_banner_dismissed', '1');
                }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative"
              >
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
              </button>
            )}
            <Link
              to="/AccountSettings"
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              style={{ userSelect: 'none' }}
            >
              {user?.full_name ? (
                <span className="text-white font-bold text-sm">
                  {user.full_name[0].toUpperCase()}
                </span>
              ) : (
                <Settings className="w-5 h-5 text-white" />
              )}
            </Link>
          </div>
        </div>

        {/* Balance area */}
        <div className="relative z-10 mb-5">
          <p className="text-white/70 text-sm mb-1">Send Money To Your</p>
          <p className="text-white text-4xl font-extrabold leading-none mb-1">Loved Ones</p>
          <p className="text-white/70 text-sm mb-4">Fast · Secure · Low Fees</p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              🔒 Safe & Secure
            </span>
            <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              ⚡ Instant transfers
            </span>
            <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              0 Hidden Fees
            </span>
          </div>

          {/* Stats row */}
          <div className="flex gap-8">
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium mb-0.5">Live Transfers</p>
              <p className="text-white text-2xl font-extrabold leading-none">$2.4M</p>
              <p className="text-white/60 text-[10px] mt-0.5">in last 60s</p>
            </div>
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium mb-0.5">Active Routes</p>
              <p className="text-white text-2xl font-extrabold leading-none">12</p>
              <p className="text-white/60 text-[10px] mt-0.5">global corridors</p>
            </div>
          </div>
        </div>

      </div>

      {/* ── Quick Actions ── */}
      <div className="px-4 py-5">
        <h2 className="text-slate-800 font-bold text-base mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                whileTap={{ scale: 0.93 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleAction(action.id)}
                className="flex flex-col items-center gap-2"
                style={{ userSelect: 'none' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: action.iconBg || '#f1f5f9' }}
                >
                  {action.logo
                    ? <img src={action.logo} alt={action.label} className="w-10 h-10 object-cover rounded-xl" />
                    : <Icon className="w-6 h-6" style={{ color: action.iconColor || '#3D7BB7' }} />
                  }
                </div>
                <span className="text-slate-600 text-[11px] font-medium leading-tight text-center">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Send To ── */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-slate-800 font-bold text-base">Send To</h2>
          <Link to="/TaperPayerRates" className="text-[#3D7BB7] text-xs font-semibold flex items-center gap-0.5">
            All rates <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {destinations.map((dest, i) => (
            <motion.button
              key={dest.name}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setShowComingSoon(true)}
              className="flex flex-col items-center gap-1.5 bg-white rounded-2xl py-3 px-2 shadow-sm border border-slate-100 active:bg-slate-50"
              style={{ userSelect: 'none' }}
            >
              <span className="text-2xl leading-none">{dest.flag}</span>
              <span className="text-slate-700 text-[11px] font-semibold text-center leading-tight">{dest.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <RecentTransactions user={user} />

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
            <CybridTransferModal amount="100" country={selectedCountry} onClose={() => setShowTransfer(false)} />
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