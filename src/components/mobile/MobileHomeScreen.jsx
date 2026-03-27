import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  Send, Smartphone, Globe, ChevronRight, Bell, Settings,
  TrendingUp, ArrowUpRight, Zap, Shield, RefreshCw
} from 'lucide-react';
import TaperConnectFormWrapper from '@/components/topup/TaperConnectFormWrapper';
import HaitiTransferModal from '@/components/transfer/HaitiTransferModal';
import CybridTransferModal from '@/components/transfer/CybridTransferModal';
import ComingSoonModal from '@/components/ComingSoonModal';
import { useAppAuth } from '@/lib/AppAuthContext';

const quickActions = [
  {
    id: 'send',
    label: 'Send Money',
    icon: Send,
    color: '#3D7BB7',
    bg: '#e3f2fd',
    description: 'Transfer globally',
  },
  {
    id: 'topup',
    label: 'Top-Up',
    icon: Smartphone,
    color: '#F88F2B',
    bg: '#fff3e0',
    description: 'Mobile airtime',
  },
  {
    id: 'rates',
    label: 'Rates',
    icon: TrendingUp,
    color: '#61AF39',
    bg: '#e8f5e9',
    description: 'Live exchange',
    link: '/TaperPayerRates',
  },
  {
    id: 'how',
    label: 'How It Works',
    icon: Zap,
    color: '#9c27b0',
    bg: '#f3e5f5',
    description: 'Learn more',
    link: '/TaperPayerHowItWorks',
  },
];

const destinations = [
  { name: 'Haiti', flag: '🇭🇹', code: 'HTG' },
  { name: 'Nigeria', flag: '🇳🇬', code: 'NGN' },
  { name: 'Ghana', flag: '🇬🇭', code: 'GHS' },
  { name: 'Jamaica', flag: '🇯🇲', code: 'JMD' },
  { name: 'Kenya', flag: '🇰🇪', code: 'KES' },
  { name: 'Brazil', flag: '🇧🇷', code: 'BRL' },
  { name: 'Mexico', flag: '🇲🇽', code: 'MXN' },
  { name: 'Chile', flag: '🇨🇱', code: 'CLP' },
];

const features = [
  { icon: Shield, label: 'Bank-grade security', color: '#61AF39' },
  { icon: Zap, label: 'Instant transfers', color: '#F88F2B' },
  { icon: Globe, label: '150+ countries', color: '#3D7BB7' },
];

export default function MobileHomeScreen() {
  const { user } = useAppAuth();
  const [showTopup, setShowTopup] = useState(false);
  const [showHaiti, setShowHaiti] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleAction = (id) => {
    if (id === 'topup') setShowTopup(true);
    else if (id === 'send') setShowComingSoon(true);
  };

  const handleCountryTap = (country) => {
    setSelectedCountry(country.name);
    if (country.name === 'Haiti') setShowHaiti(true);
    else setShowTransfer(true);
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">

      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-slate-500 text-sm font-medium">Welcome back 👋</p>
          {user?.full_name ? (
            <h1 className="text-3xl font-bold" style={{ color: '#3D7BB7' }}>
              {user.full_name.split(' ')[0]}
            </h1>
          ) : (
            <img
              src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png"
              alt="Taper Payer"
              className="h-16 w-auto"
            />
          )}
        </div>
        <Link to="/AccountSettings" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Settings className="w-5 h-5 text-slate-600" />
        </Link>
      </div>

      {/* Balance Card */}
      <div className="mx-5 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}
        >
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/10" />
          <p className="text-white/70 text-sm font-medium mb-1 relative z-10">Send Money To Your</p>
          <p className="text-white text-3xl font-bold relative z-10">Loved Ones</p>
          <p className="text-white/80 text-sm mt-2 relative z-10">Fast · Secure · Low Fees</p>
          <div className="flex gap-2 mt-4 relative z-10">
            {features.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                <Icon className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-6">
        <h2 className="text-slate-800 font-semibold text-base mb-3">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            if (action.link) {
              return (
                <Link key={action.id} to={action.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: action.bg }}>
                      <Icon className="w-6 h-6" style={{ color: action.color }} />
                    </div>
                    <span className="text-slate-700 text-xs font-medium text-center leading-tight">{action.label}</span>
                  </motion.div>
                </Link>
              );
            }
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleAction(action.id)}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: action.bg }}>
                  <Icon className="w-6 h-6" style={{ color: action.color }} />
                </div>
                <span className="text-slate-700 text-xs font-medium text-center leading-tight">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Send To Section */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-slate-800 font-semibold text-base">Send To</h2>
          <Link to="/TaperPayerRates" className="text-blue-400 text-xs font-medium flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {destinations.map((dest, i) => (
            <motion.button
              key={dest.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              onClick={() => handleCountryTap(dest)}
              className="flex flex-col items-center gap-1.5 bg-white rounded-2xl py-3 px-2 active:bg-slate-100 transition-colors shadow-sm border border-slate-100"
            >
              <span className="text-2xl">{dest.flag}</span>
              <span className="text-slate-700 text-xs font-medium text-center leading-tight">{dest.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Why Us */}
      <div className="px-5 mb-6">
        <h2 className="text-slate-800 font-semibold text-base mb-3">Why Taper Payer?</h2>
        <div className="space-y-3">
          {[
            { icon: Zap, title: "We're Fast", desc: "From instant to next-day delivery", color: '#F88F2B', bg: '#fff3e0' },
            { icon: Shield, title: "We're Safe", desc: "Bank-grade encryption & compliance", color: '#61AF39', bg: '#e8f5e9' },
            { icon: TrendingUp, title: "Low Cost", desc: "Competitive rates, no hidden fees", color: '#3D7BB7', bg: '#e3f2fd' },
          ].map(({ icon: Icon, title, desc, color, bg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div>
                <p className="text-slate-800 font-semibold text-sm">{title}</p>
                <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 ml-auto" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Taper Mobile CTA */}
      <div className="px-5 mb-6">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => setShowTopup(true)}
          className="w-full rounded-3xl p-5 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #F88F2B, #e67e22)' }}
        >
          <div>
            <p className="text-white font-bold text-lg">Taper Mobile</p>
            <p className="text-white/80 text-sm mt-0.5">Instant airtime top-ups worldwide</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
        </motion.button>
      </div>

      {/* Modals */}
      {showTopup && createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowTopup(false)} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-2" />
            <button onClick={() => setShowTopup(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10">✕</button>
            <div className="p-6 pt-4">
              <TaperConnectFormWrapper />
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {showHaiti && createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowHaiti(false)} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-2" />
            <button onClick={() => setShowHaiti(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10">✕</button>
            <HaitiTransferModal amount="100" onClose={() => setShowHaiti(false)} />
          </motion.div>
        </div>,
        document.body
      )}

      {showTransfer && createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowTransfer(false)} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-2" />
            <button onClick={() => setShowTransfer(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10">✕</button>
            <CybridTransferModal amount="100" country={selectedCountry} onClose={() => setShowTransfer(false)} />
          </motion.div>
        </div>,
        document.body
      )}

      <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />
    </div>
  );
}