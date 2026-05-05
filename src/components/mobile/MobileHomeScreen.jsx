import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  Send, Smartphone, Bell, Settings, ChevronRight,
  PhoneCall, HandCoins, PhoneOutgoing, DollarSign, Users, Plus, Scan
} from 'lucide-react';
import TaperConnectFormWrapper from '@/components/topup/TaperConnectFormWrapper';
import HaitiTransferModal from '@/components/transfer/HaitiTransferModal';
import CybridTransferModal from '@/components/transfer/CybridTransferModal';
import SendAGNVModal from '@/components/transfer/SendAGNVModal';
import ComingSoonModal from '@/components/ComingSoonModal';
import RequestMoneyModal from '@/components/mobile/RequestMoneyModal';
import RequestTopUpModal from '@/components/mobile/RequestTopUpModal';
import { useAppAuth } from '@/lib/AppAuthContext';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const quickActions = [
  { id: 'send',        label: 'Send',       icon: Send,         color: '#fff', bg: 'rgba(255,255,255,0.18)' },
  { id: 'topup',       label: 'Top-Up',     icon: PhoneCall,    color: '#fff', bg: 'rgba(255,255,255,0.18)' },
  { id: 'request',     label: 'Request',    icon: HandCoins,    color: '#fff', bg: 'rgba(255,255,255,0.18)' },
  { id: 'requesttopup',label: 'Req. Top-Up',icon: PhoneOutgoing,color: '#fff', bg: 'rgba(255,255,255,0.18)' },
];

const serviceCards = [
  {
    id: 'send',
    label: 'Send Money',
    desc: 'Transfer to 150+ countries',
    icon: Send,
    gradient: 'linear-gradient(135deg, #3D7BB7, #2563eb)',
  },
  {
    id: 'topup',
    label: 'Mobile Top-Up',
    desc: 'Recharge any number instantly',
    icon: PhoneCall,
    gradient: 'linear-gradient(135deg, #F88F2B, #f97316)',
  },
  {
    id: 'request',
    label: 'Request Money',
    desc: 'Ask contacts to pay you',
    icon: HandCoins,
    gradient: 'linear-gradient(135deg, #61AF39, #16a34a)',
  },
  {
    id: 'sendagnv',
    label: 'Send AGNV',
    desc: 'Transfer AGNV tokens',
    logo: 'https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/2049da728_AGNVNEWLogo.jpeg',
    gradient: 'linear-gradient(135deg, #003DA5, #1e40af)',
  },
];

const destinations = [
  { name: 'Haiti',    flag: '🇭🇹' },
  { name: 'Ghana',    flag: '🇬🇭' },
  { name: 'Kenya',    flag: '🇰🇪' },
  { name: 'Senegal',  flag: '🇸🇳' },
  { name: 'Dom. Rep.',flag: '🇩🇴' },
  { name: 'Mexico',   flag: '🇲🇽' },
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
    if (id === 'topup') setShowTopup(true);
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
        style={{ background: 'linear-gradient(160deg, #1a3a5c 0%, #2479C2 55%, #3fa847 100%)' }}
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
        <div className="relative z-10 mb-7">
          <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">Send Money To</p>
          <p className="text-white text-4xl font-extrabold leading-none mb-1">Loved Ones</p>
          <p className="text-white/70 text-sm">Fast · Secure · Low Fees</p>
        </div>

        {/* Quick action pills inside hero */}
        <div className="relative z-10 grid grid-cols-4 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                whileTap={{ scale: 0.93 }}
                onClick={() => handleAction(action.id)}
                className="flex flex-col items-center gap-2"
                style={{ userSelect: 'none' }}
              >
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center"
                  style={{ width: 52, height: 52, backgroundColor: action.bg, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/90 text-xs font-medium leading-tight text-center">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Promo / CTA strip ── */}
      <div className="px-4 -mt-3 mb-5">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowTopup(true)}
          className="w-full rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg"
          style={{ background: 'linear-gradient(135deg, #F88F2B, #ef6c00)', userSelect: 'none' }}
        >
          <div>
            <p className="text-white font-bold text-base">📱 Mobile Top-Up</p>
            <p className="text-white/80 text-xs mt-0.5">Recharge any number instantly</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </motion.button>
      </div>

      {/* ── Send To ── */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-slate-800 font-bold text-base">Send To</h2>
          <Link to="/TaperPayerRates" className="text-[#3D7BB7] text-xs font-semibold flex items-center gap-0.5">
            All rates <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
          {destinations.map((dest, i) => (
            <motion.button
              key={dest.name}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => { setSelectedCountry(dest.name); setShowTransfer(true); }}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 bg-white rounded-2xl py-3 px-4 shadow-sm border border-slate-100 active:bg-slate-50"
              style={{ minWidth: 72, userSelect: 'none' }}
            >
              <span className="text-3xl leading-none">{dest.flag}</span>
              <span className="text-slate-700 text-xs font-semibold text-center leading-tight">{dest.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Services Grid ── */}
      <div className="px-4 mb-5">
        <h2 className="text-slate-800 font-bold text-base mb-3">Services</h2>
        <div className="grid grid-cols-2 gap-3">
          {serviceCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.id}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                onClick={() => handleAction(card.id)}
                className="rounded-2xl p-4 flex flex-col items-start gap-2 shadow-md relative overflow-hidden"
                style={{ background: card.gradient, userSelect: 'none' }}
              >
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  {card.logo
                    ? <img src={card.logo} alt={card.label} className="w-8 h-8 object-cover rounded-lg" />
                    : <Icon className="w-5 h-5 text-white" />
                  }
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-sm leading-tight">{card.label}</p>
                  <p className="text-white/70 text-xs mt-0.5 leading-tight">{card.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Why Taper Payer ── */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
          {[
            { emoji: '⚡', title: "Lightning Fast", desc: "Instant to next-day delivery" },
            { emoji: '🔒', title: "Bank-Grade Security", desc: "Your money is always protected" },
            { emoji: '💸', title: "No Hidden Fees", desc: "Competitive rates, transparent pricing" },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="flex items-center gap-3 px-4 py-3.5">
              <span className="text-2xl w-8 text-center flex-shrink-0">{emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 font-semibold text-sm">{title}</p>
                <p className="text-slate-400 text-xs">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
            </div>
          ))}
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