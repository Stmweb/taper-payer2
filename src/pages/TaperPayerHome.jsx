import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ArrowRight, Shield, Zap, DollarSign, Globe, Users, TrendingUp,
  RefreshCw, ChevronRight, MapPin, CreditCard, Smartphone, Menu, X, Moon, Sun, Instagram,
  Send, PhoneCall, HandCoins, PhoneOutgoing
} from 'lucide-react';
import RequestMoneyModal from '@/components/mobile/RequestMoneyModal';
import RequestTopUpModal from '@/components/mobile/RequestTopUpModal';
import SiteFooter from '@/components/SiteFooter';
import MobileHomeScreen from '@/components/mobile/MobileHomeScreen';
import { useIsMobile } from '@/hooks/use-mobile';
import { base44 } from '@/api/base44Client';
import CountryDrawer from '@/components/mobile/CountryDrawer';
import SEOHead from '@/components/SEOHead';
import StructuredData from '@/components/StructuredData';
import TpayReloadFormWrapper from '@/components/topup/TpayReloadFormWrapper';
import TaperConnectFormWrapper from '@/components/topup/TaperConnectFormWrapper';
import CybridTransferModal from '@/components/transfer/CybridTransferModal';
import SendAGNVModal from '@/components/transfer/SendAGNVModal';
import HaitiTransferModal from '@/components/transfer/HaitiTransferModal';
import ComingSoonModal from '@/components/ComingSoonModal';
import PINModal from '@/components/PINModal';
import { usePageConfig } from '@/hooks/usePageConfig';
import PromoCarousel from '@/components/topup/PromoCarousel';
import { useAuth } from '@/lib/AuthContext';
import { useAppAuth } from '@/lib/AppAuthContext';
import SignupModal from '@/components/SignupModal';

function createPageUrl(page) {
  return `/${page}`;
}

const countries = [
  { name: 'Ghana', flag: '🇬🇭', code: 'GHS' },
  { name: 'Kenya', flag: '🇰🇪', code: 'KES' },
  { name: 'Senegal', flag: '🇸🇳', code: 'XOF' },
  { name: 'Dominican Republic', flag: '🇩🇴', code: 'DOP' },
];

export default function TaperPayerHome() {
   SEOHead({
     title: 'Taper Payer - Fast Money Transfer & Mobile Top-Up Services',
     description: 'Send money globally to 150+ countries with competitive rates. Instant mobile top-ups, same-day remittances, and secure payments. Join millions trusting Taper Payer.',
     keywords: 'money transfer, remittance service, mobile top-up, send money online, international payments, airtime recharge',
     url: 'https://taperpayer.com/'
   });

   const { config, isElementHidden, isSectionHidden, getContentOverride } = usePageConfig('TaperPayerHome');
   const { isAuthenticated, navigateToLogin } = useAuth();
   const { user, login } = useAppAuth();
   const isMobile = useIsMobile();

   const [amount, setAmount] = useState('100');
   const [sendTo, setSendTo] = useState('');
   const [exchangeRate, setExchangeRate] = useState(null);
   const [loading, setLoading] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [showCountryDrawer, setShowCountryDrawer] = useState(false);
   const [isDark, setIsDark] = useState(false);
   const [showReloadForm, setShowReloadForm] = useState(false);
   const [showTaperConnect, setShowTaperConnect] = useState(false);
   const [showTransferModal, setShowTransferModal] = useState(false);
   const [showHaitiModal, setShowHaitiModal] = useState(false);
   const [showPINModal, setShowPINModal] = useState(false);
   const [showComingSoon, setShowComingSoon] = useState(false);
   const [showSignupModal, setShowSignupModal] = useState(false);
   const [showRequestMoney, setShowRequestMoney] = useState(false);
   const [showRequestTopUp, setShowRequestTopUp] = useState(false);
   const [showSendAGNV, setShowSendAGNV] = useState(false);

   const toggleDarkMode = () => {
     setIsDark(!isDark);
     if (!isDark) {
       document.documentElement.classList.add('dark');
     } else {
       document.documentElement.classList.remove('dark');
     }
   };

  const fetchExchangeRate = async () => {
    if (!sendTo) return;
    setLoading(true);
    setExchangeRate(null);
    const country = countries.find(c => c.name === sendTo);
    if (!country) { setLoading(false); return; }
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Give me the current approximate exchange rate from USD to ${country.code} (${sendTo}). Return JSON only.`,
        response_json_schema: {
          type: 'object',
          properties: {
            rate: { type: 'number' },
            currency_code: { type: 'string' },
            last_updated: { type: 'string' },
          }
        }
      });
      setExchangeRate(result);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sendTo) fetchExchangeRate();
  }, [sendTo]);

  if (isMobile) {
    return <MobileHomeScreen />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900" style={{ background: 'linear-gradient(to bottom right, #f8fafc, #dbeafe)' }}>
      <StructuredData />
      {/* Header */}
      <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative flex items-center justify-between h-14 md:h-16">
            {/* Mobile Menu Button - Left */}
            <button
              className="md:hidden text-slate-700 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo - Centered on Mobile, Left on Desktop */}
            <Link to={createPageUrl('TaperPayerHome')} className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 flex-shrink-0">
              <img 
                src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png"
                alt="Taper Payer"
                className="h-36 md:h-36 w-auto"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link to={createPageUrl('TaperPayerHome')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Home</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">About</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">How It Works</Link>
              <Link to={createPageUrl('TaperPayerRates')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Exchange Rates</Link>
              <Link to={createPageUrl('TaperPayerTopUp')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Taper Mobile</Link>
              <Link to={createPageUrl('TaperPayerContact')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Contact</Link>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-slate-700 border-slate-300 hover:bg-slate-50"
                onClick={() => window.location.href = '/TaperPayerLogin'}
              >Login</Button>
              <Button size="sm" style={{ backgroundColor: '#3D7BB7' }} className="hover:opacity-90" onClick={() => setShowSignupModal(true)}>Sign up</Button>
            </div>

            {/* Spacer for Mobile to Balance Layout */}
            <div className="md:hidden w-10"></div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-gradient-to-br from-blue-600 to-green-600 -mx-4 px-4 py-4 space-y-1 rounded-b-2xl" role="menu">
              <Link to={createPageUrl('TaperPayerHome')} role="menuitem" className="flex items-center text-white font-semibold hover:text-white transition-colors min-h-[48px] py-3">Home</Link>
              <Link to={createPageUrl('TaperPayerAbout')} role="menuitem" className="flex items-center text-white/90 font-medium hover:text-white transition-colors min-h-[48px] py-3">About</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} role="menuitem" className="flex items-center text-white/90 font-medium hover:text-white transition-colors min-h-[48px] py-3">How It Works</Link>
              <Link to={createPageUrl('TaperPayerRates')} role="menuitem" className="flex items-center text-white/90 font-medium hover:text-white transition-colors min-h-[48px] py-3">Exchange Rates</Link>
              <Link to={createPageUrl('TaperPayerTopUp')} role="menuitem" className="flex items-center text-white/90 font-medium hover:text-white transition-colors min-h-[48px] py-3">Taper Mobile</Link>
              <Link to={createPageUrl('TaperPayerContact')} role="menuitem" className="flex items-center text-white/90 font-medium hover:text-white transition-colors min-h-[48px] py-3">Contact</Link>
              <div className="pt-3 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20"
                  onClick={() => window.location.href = '/TaperPayerLogin'}
                >Login</Button>
                <Button 
                  className="w-full bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => setShowSignupModal(true)}
                >Sign up</Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20">
        <motion.img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ccf3ce18e_generated_image.png"
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0, backgroundPosition: 'center' }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1, background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.15) 50%, rgba(248, 250, 252, 0.1) 100%)' }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(36,121,194,0.25), transparent 70%)' }}
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(97,175,57,0.25), transparent 70%)' }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(248,143,43,0.1), transparent 70%)' }}
          />
        </div>

        <div className="container mx-auto relative" style={{ zIndex: 2 }}>
          <div className="grid lg:grid-cols-2 gap-12 items-center md:gap-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              <motion.h1
                className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                Send Money To Your <span style={{ color: '#5FAE2E' }}>Loved Ones</span>
              </motion.h1>
              <div className="flex flex-wrap gap-4">
                {!isElementHidden('download-app-btn') && (
                  <Button style={{ backgroundColor: '#2479C2' }} className="hover:opacity-90 text-lg px-8 py-6">
                    Download App
                  </Button>
                )}
                {!isElementHidden('tpay-mobile-btn') && (
                  <Button onClick={() => setShowTaperConnect(true)} className="text-lg px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white border-0 flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    Taper Mobile
                  </Button>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            >
              <Card className="p-8 shadow-2xl dark:bg-slate-800" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Money Transfer</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">You Send</label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg text-lg font-semibold"
                        placeholder="100"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">USD</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Send Money To</label>
                    <button
                      type="button"
                      onClick={() => setShowCountryDrawer(true)}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-between focus:ring-2 focus:ring-[#3D7BB7] focus:outline-none"
                      style={{ userSelect: 'none' }}
                    >
                      <span className={sendTo ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-400'}>
                        {sendTo
                          ? `${countries.find(c => c.name === sendTo)?.flag ?? ''} ${sendTo}`
                          : 'Select Receiving Country'}
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    </button>
                    <CountryDrawer
                      open={showCountryDrawer}
                      onOpenChange={setShowCountryDrawer}
                      countries={countries.map(c => `${c.flag} ${c.name}`)}
                      value={sendTo ? `${countries.find(c => c.name === sendTo)?.flag ?? ''} ${sendTo}` : ''}
                      onSelect={(val) => {
                        const name = val.replace(/^\S+\s/, '');
                        setSendTo(name);
                      }}
                      title="Select Receiving Country"
                    />
                  </div>

                  {exchangeRate && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4 border border-blue-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-slate-700">Exchange Rate</span>
                        </div>
                        <button
                          onClick={fetchExchangeRate}
                          disabled={loading}
                          aria-label="Refresh exchange rate"
                          className="text-blue-600 hover:text-blue-700 disabled:opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">
                        1 USD = {exchangeRate.rate?.toFixed(2)} {exchangeRate.currency_code}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        {amount && `You send: $${amount} USD → Recipient gets: ${(parseFloat(amount) * exchangeRate.rate).toFixed(2)} ${exchangeRate.currency_code}`}
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        {exchangeRate.last_updated && `Updated: ${exchangeRate.last_updated}`}
                      </div>
                    </motion.div>
                  )}

                  {loading && (
                    <div className="flex items-center justify-center py-4">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="ml-2 text-sm text-slate-600">Fetching live rates...</span>
                    </div>
                  )}

                  <Button
                    style={{ backgroundColor: '#3D7BB7' }}
                    className="w-full hover:opacity-90 text-lg py-6"
                    onClick={() => { 
                      if (sendTo && amount) { 
                        if (!user) { 
                          setShowSignupModal(true); 
                        } else { 
                          // Show PIN first for all countries
                          setShowPINModal(true);
                        } 
                      } 
                    }}
                    disabled={!sendTo || !amount}
                  >
                    Continue <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  <div className="text-center">
                    <Link to={createPageUrl('TaperPayerRates')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View All Exchange Rates →
                    </Link>
                  </div>

                  <div className="text-center text-sm text-slate-500 italic mt-1">
                    ✨ Something new is coming soon — stay tuned!
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Quick Actions */}
      <section className="container mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { id: 'send', label: 'Send Money', icon: Send, color: '#3D7BB7', bg: '#e3f2fd', desc: 'Transfer globally' },
            { id: 'topup', label: 'Mobile Top-Up', icon: PhoneCall, color: '#F88F2B', bg: '#fff3e0', desc: 'Recharge instantly' },
            { id: 'request', label: 'Request Money', icon: HandCoins, color: '#61AF39', bg: '#e8f5e9', desc: 'Ask to get paid' },
            { id: 'requesttopup', label: 'Request Top-Up', icon: PhoneOutgoing, color: '#e91e8c', bg: '#fce4ec', desc: 'Ask someone to top up' },
            { id: 'splitbills', label: 'Split Bills', icon: DollarSign, color: '#FF6B6B', bg: '#ffe0e0', desc: 'Divide expenses' },
            { id: 'favorites', label: 'Favorites', icon: Users, color: '#4ECDC4', bg: '#e0f7f6', desc: 'Quick contacts' },
            { id: 'groupwallet', label: 'Group Wallet', icon: Users, color: '#95E1D3', bg: '#e8f9f7', desc: 'Shared account' },
            { id: 'sendagnv', label: 'Send AGNV', icon: null, color: '#003DA5', bg: '#e8f2ff', desc: 'Send via AGNV', emoji: '🇭🇹' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (action.id === 'send') setShowComingSoon(true);
                  else if (action.id === 'topup') setShowTaperConnect(true);
                  else if (action.id === 'request') setShowRequestMoney(true);
                  else if (action.id === 'requesttopup') setShowRequestTopUp(true);
                  else if (action.id === 'sendagnv') setShowSendAGNV(true);
                  else setShowComingSoon(true);
                }}
                className="flex flex-col items-center gap-3 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: action.bg }}>
                  {action.emoji ? action.emoji : <Icon className="w-7 h-7" style={{ color: action.color }} />}
                </div>
                <div className="text-center">
                  <p className="text-slate-800 font-semibold text-sm">{action.label}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{action.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Promo Carousel */}
      <PromoCarousel />

      {/* Why Choose Us */}
      {!isSectionHidden('why-choose-section') && (
        <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-6 text-slate-900 dark:text-white">
          Why Choose Taper Payer?
        </h2>
        <p className="text-xl text-slate-600 dark:text-gray-300 text-center mb-16 max-w-3xl mx-auto">
          Taper Payer is a modern financial technology platform built for fast, secure, and seamless money transfers. Whether you're sending funds, making payments, or managing transactions, Taper Payer makes moving money simple, reliable, and transparent.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#e3f2fd' }}>
                <Zap className="w-10 h-10" style={{ color: '#3D7BB7' }} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">We're Fast</h3>
              <p className="text-slate-600 text-lg">From instant to next day availability.</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#e8f5e9' }}>
                <Shield className="w-10 h-10" style={{ color: '#61AF39' }} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">We're Safe</h3>
              <p className="text-slate-600 text-lg">We take every step to safeguard your data.</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#fff3e0' }}>
                <DollarSign className="w-10 h-10" style={{ color: '#F88F2B' }} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">We're Low-Cost</h3>
              <p className="text-slate-600 text-lg">Competitive prices with no hidden fees</p>
            </Card>
          </motion.div>
        </div>
        </section>
        )}

        {/* Services Section */}
        {!isSectionHidden('services-section') && (
        <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-6 text-slate-900 dark:text-white">Our Services</h2>
        <p className="text-xl text-slate-600 dark:text-gray-300 text-center mb-16 max-w-3xl mx-auto">
          They are designed to meet all your needs. Our service allows you to send money at a competitive exchange rate with fair commissions, ensuring better value for your money.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 hover:shadow-xl transition-shadow">
            <Users className="w-12 h-12 mb-4" style={{ color: '#3D7BB7' }} />
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Same Day Remittances</h3>
            <p className="text-slate-600 text-lg">
              Send money and have it delivered the same day to your loved ones. Fast, reliable, and secure transfers.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-shadow">
            <Shield className="w-12 h-12 mb-4" style={{ color: '#61AF39' }} />
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Excellent Customer Service</h3>
            <p className="text-slate-600 text-lg">
              Our dedicated team is here to help you with any questions or concerns. We're committed to your satisfaction.
            </p>
          </Card>

          <Link to={createPageUrl('TaperPayerTopUp')} className="no-underline">
            <Card className="p-8 hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col justify-between">
              <div>
                <Smartphone className="w-12 h-12 mb-4" style={{ color: '#3D7BB7' }} />
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Taper Mobile</h3>
                <p className="text-slate-600 text-lg">
                  Instant mobile top-ups and airtime recharges for any carrier worldwide.
                </p>
              </div>
              <Button className="mt-6" style={{ backgroundColor: '#3D7BB7' }}>TOP-UP NOW</Button>
            </Card>
          </Link>
        </div>
        </section>
        )}

        {/* Membership Section */}
        {!isSectionHidden('membership-section') && (
        <section className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Join Our <span style={{ color: '#3D7BB7' }}>Membership</span> Program
              </h2>
              <p className="text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto">
                Become a Taper Payer member and enjoy exclusive benefits, lower fees, and priority support
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <Card className="p-8 text-center h-full hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#e3f2fd' }}>
                    <DollarSign className="w-8 h-8" style={{ color: '#3D7BB7' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">Lower Fees</h3>
                  <p className="text-slate-600">Save up to 50% on transfer fees with our membership program</p>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <Card className="p-8 text-center h-full hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#e8f5e9' }}>
                    <Users className="w-8 h-8" style={{ color: '#61AF39' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">Priority Support</h3>
                  <p className="text-slate-600">Get dedicated support and faster response times</p>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <Card className="p-8 text-center h-full hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#fff3e0' }}>
                    <Zap className="w-8 h-8" style={{ color: '#F88F2B' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">Exclusive Perks</h3>
                  <p className="text-slate-600">Access special promotions, better rates, and rewards</p>
                </Card>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-700 dark:to-slate-600 rounded-3xl p-8 md:p-12">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Ready to Join?</h3>
                <div className="mb-6">
                  <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">$199.00</div>
                  <p className="text-lg text-slate-600 dark:text-gray-300">per year</p>
                </div>
                <p className="text-lg text-slate-600 dark:text-gray-300 mb-8">Sign up today and start enjoying member-only benefits</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" style={{ backgroundColor: '#3D7BB7' }} className="hover:opacity-90 px-8 py-6 text-lg w-full sm:w-auto" onClick={() => setShowSignupModal(true)}>
                    Become a Member
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2 w-full sm:w-auto">
                    Learn More
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        </section>
        )}

        {/* Download App Section */}
        {!isSectionHidden('app-download-section') && (
        <section style={{ background: 'linear-gradient(to right, #3D7BB7, #61AF39)' }} className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-6">Get the App</h2>
              <p className="text-xl text-blue-100 mb-8">
                Download our app for free to send money online in minutes. Track your payments and view your transfer history from anywhere.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white hover:opacity-90 px-8 py-6 text-lg" style={{ color: '#3D7BB7' }}>App Store</Button>
                <Button className="px-8 py-6 text-lg text-white hover:opacity-90" style={{ backgroundColor: '#61AF39' }}>Google Play</Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <div className="relative w-80 h-[600px] bg-slate-900 rounded-[3rem] p-4 shadow-2xl">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-10"></div>
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #3D7BB7, #61AF39)' }}>
                    <div className="p-6 text-white">
                      <div className="flex items-center justify-between mb-8">
                        <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/38da31918_ChatGPTImageJan5202603_27_37PM.png" alt="Taper Payer" className="h-24 w-auto" />
                        <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 mb-6">
                        <p className="text-sm text-white/80 mb-2">Available Balance</p>
                        <p className="text-4xl font-bold mb-4">$1,250.00</p>
                        <button className="bg-white px-6 py-3 rounded-full font-semibold w-full" style={{ color: '#3D7BB7' }}>Send Money</button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 text-center"><div className="text-2xl mb-2">💸</div><p className="text-xs">Send</p></div>
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 text-center"><div className="text-2xl mb-2">📱</div><p className="text-xs">Wallet</p></div>
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 text-center"><div className="text-2xl mb-2">🏦</div><p className="text-xs">Bank</p></div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-3">Recent</h3>
                        <div className="space-y-2">
                          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                              <div><p className="text-sm font-semibold">To Maria</p><p className="text-xs text-white/70">Jan 4</p></div>
                            </div>
                            <p className="font-semibold">$150</p>
                          </div>
                          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                              <div><p className="text-sm font-semibold">To John</p><p className="text-xs text-white/70">Jan 3</p></div>
                            </div>
                            <p className="font-semibold">$200</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>
        )}

        {/* Footer */}
      <SiteFooter />

      {/* Cybrid Transfer Modal */}
      {showTransferModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/50" onClick={() => setShowTransferModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <button onClick={() => setShowTransferModal(false)} aria-label="Close" className="absolute top-4 right-4 p-2 min-w-[44px] min-h-[44px] hover:bg-gray-100 rounded-full z-10 flex items-center justify-center">✕</button>
            <CybridTransferModal
              amount={amount}
              country={sendTo}
              onClose={() => setShowTransferModal(false)}
            />
          </motion.div>
        </div>,
        document.body
      )}

      {/* Tpay Mobile Form Modal */}
      {showReloadForm && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/50" onClick={() => setShowReloadForm(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <button onClick={() => setShowReloadForm(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10">✕</button>
            <div className="p-6 pt-12">
              <TpayReloadFormWrapper />
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Coming Soon Modal */}
      <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />

      {/* Request Money Modal */}
      <RequestMoneyModal isOpen={showRequestMoney} onClose={() => setShowRequestMoney(false)} />

      {/* Request Top-Up Modal */}
      <RequestTopUpModal isOpen={showRequestTopUp} onClose={() => setShowRequestTopUp(false)} />

      {/* Send AGNV Modal */}
      <SendAGNVModal isOpen={showSendAGNV} onClose={() => setShowSendAGNV(false)} />

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSignupSuccess={(userData) => {
          login(userData, userData.jwt, userData.cybrid_customer_id);
          setShowSignupModal(false);
          // Route Haiti to new modal, others to Cybrid
          if (sendTo === 'Haiti') {
            setShowHaitiModal(true);
          } else {
            setShowTransferModal(true);
          }
        }}
      />

      {/* Taper Connect Form Modal */}
      {showTaperConnect && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/50" onClick={() => setShowTaperConnect(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <button onClick={() => setShowTaperConnect(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10">✕</button>
            <div className="p-6 pt-12">
              <TaperConnectFormWrapper />
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* PIN Modal */}
      <PINModal
        isOpen={showPINModal}
        onSuccess={() => {
          setShowPINModal(false);
          // Route to appropriate modal based on country
          if (sendTo === 'Haiti') {
            setShowHaitiModal(true);
          } else {
            setShowTransferModal(true);
          }
        }}
        onClose={() => setShowPINModal(false)}
      />

      {/* Haiti Transfer Modal */}
      {showHaitiModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/50" onClick={() => setShowHaitiModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <button onClick={() => setShowHaitiModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10">✕</button>
            <HaitiTransferModal
              amount={amount}
              onClose={() => setShowHaitiModal(false)}
            />
          </motion.div>
        </div>,
        document.body
      )}
      </div>
      );
      }