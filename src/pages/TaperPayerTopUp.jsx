import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Smartphone, DollarSign, Lock, Zap, Globe, CreditCard, Users, Menu, X } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';
import { Button } from '@/components/ui/button';
import TopUpForm from '@/components/topup/TopUpForm';
import TaperConnectFormWrapper from '@/components/topup/TaperConnectFormWrapper';
import TpayReloadFormWrapper from '@/components/topup/TpayReloadFormWrapper';
import { usePageConfig } from '@/hooks/usePageConfig';
import SEOHead from '@/components/SEOHead';

export default function TaperPayerTopUp() {
  SEOHead({
    title: 'Taper Mobile - Instant Mobile Top-Up & Airtime Recharge | Taper Payer',
    description: 'Top up any mobile phone instantly with Taper Mobile. Send airtime and data to 150+ countries. Fast, secure, and affordable mobile recharges for Nigeria, Ghana, Haiti, and more.',
    keywords: 'mobile top-up, airtime recharge, send airtime, international top-up, mobile recharge, taper mobile, phone top-up online, send credit abroad, recharge phone internationally',
    url: 'https://taperpayer.com/TaperPayerTopUp',
  });

  const { isElementHidden, isSectionHidden } = usePageConfig('TaperPayerTopUp');
  const [moncashStatus, setMoncashStatus] = useState(null); // 'success' | 'error' | 'paid_but_topup_failed'
  const [moncashPhone, setMoncashPhone] = useState('');
  const bannerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.reloadly.com/widget/v2/reloadly-widget.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Handle Moncash return redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const moncash = params.get('moncash');
    const phone = params.get('phone');
    if (moncash) {
      setMoncashStatus(moncash);
      if (phone) setMoncashPhone(phone);
      // Clean URL without reload
      window.history.replaceState({}, '', '/TaperPayerTopUp');
      // Scroll to banner
      setTimeout(() => bannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopUpForm, setShowTopUpForm] = useState(false);
  const [showTaperConnect, setShowTaperConnect] = useState(false);
  const [showReloadForm, setShowReloadForm] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const bgSettings = {
    posX: 'center',
    posY: 'center',
    size: 'cover',
    height: 480,
    opacity: 40,
  };

  const steps = [
    { icon: Smartphone, title: 'Select Your Mobile Number', desc: 'Enter your phone number or select from your contacts.' },
    { icon: DollarSign, title: 'Choose Amount', desc: 'Pick the top-up amount that fits your needs.' },
    { icon: Lock, title: 'Pay Instantly', desc: 'Fund your top-up securely via TaperPayer wallet, bank transfer, or card.' },
    { icon: Zap, title: 'Recharge Delivered', desc: 'Your mobile balance is updated instantly — no delays, no hassle.' },
  ];

  const benefits = [
    { icon: Zap, title: 'Instant Delivery', desc: 'Your airtime or data is topped up immediately.' },
    { icon: Lock, title: 'Secure Payments', desc: 'Powered by TaperPayer\'s trusted payment infrastructure.' },
    { icon: Globe, title: 'Anywhere, Anytime', desc: 'Works for multiple carriers and international mobile numbers.' },
    { icon: CreditCard, title: 'Flexible Payment Options', desc: 'Fund your top-up with wallet balance, credit/debit cards, or bank transfer.' },
    { icon: Smartphone, title: 'User-Friendly', desc: 'Simple, fast, and optimized for mobile.' },
  ];

  const useeCases = [
    { title: 'Individuals', desc: 'Recharge your own phone or family members\' numbers.' },
    { title: 'Expats & Travelers', desc: 'Send airtime to friends and family abroad.' },
    { title: 'Frequent Users', desc: 'Save time with quick, one-click top-ups.' },
  ];

  const countries = [
    { name: 'Nigeria', flag: '🇳🇬', code: 'NGN' },
    { name: 'Ghana', flag: '🇬🇭', code: 'GHS' },
    { name: 'Kenya', flag: '🇰🇪', code: 'KES' },
    { name: 'Tanzania', flag: '🇹🇿', code: 'TZS' },
    { name: 'Uganda', flag: '🇺🇬', code: 'UGX' },
    { name: 'Ethiopia', flag: '🇪🇹', code: 'ETB' },
    { name: 'Rwanda', flag: '🇷🇼', code: 'RWF' },
    { name: 'Senegal', flag: '🇸🇳', code: 'XOF' },
    { name: 'Ivory Coast', flag: '🇨🇮', code: 'XOF' },
    { name: 'Mali', flag: '🇲🇱', code: 'XOF' },
    { name: 'Burkina Faso', flag: '🇧🇫', code: 'XOF' },
    { name: 'Angola', flag: '🇦🇴', code: 'AOA' },
    { name: 'Cameroon', flag: '🇨🇲', code: 'XAF' },
    { name: 'Benin', flag: '🇧🇯', code: 'XOF' },
    { name: 'Chad', flag: '🇹🇩', code: 'XAF' },
    { name: 'Congo', flag: '🇨🇬', code: 'XAF' },
    { name: 'Gabon', flag: '🇬🇦', code: 'XAF' },
    { name: 'South Africa', flag: '🇿🇦', code: 'ZAR' },
    { name: 'Zimbabwe', flag: '🇿🇼', code: 'ZWL' },
    { name: 'Zambia', flag: '🇿🇲', code: 'ZMW' },
    { name: 'Botswana', flag: '🇧🇼', code: 'BWP' },
    { name: 'Namibia', flag: '🇳🇦', code: 'NAD' },
    { name: 'Mauritius', flag: '🇲🇺', code: 'MUR' },
    { name: 'Morocco', flag: '🇲🇦', code: 'MAD' },
    { name: 'Tunisia', flag: '🇹🇳', code: 'TND' },
    { name: 'Algeria', flag: '🇩🇿', code: 'DZD' },
    { name: 'Egypt', flag: '🇪🇬', code: 'EGP' },
    { name: 'India', flag: '🇮🇳', code: 'INR' },
    { name: 'Pakistan', flag: '🇵🇰', code: 'PKR' },
    { name: 'Bangladesh', flag: '🇧🇩', code: 'BDT' },
    { name: 'Sri Lanka', flag: '🇱🇰', code: 'LKR' },
    { name: 'Philippines', flag: '🇵🇭', code: 'PHP' },
    { name: 'Indonesia', flag: '🇮🇩', code: 'IDR' },
    { name: 'Thailand', flag: '🇹🇭', code: 'THB' },
    { name: 'Vietnam', flag: '🇻🇳', code: 'VND' },
    { name: 'Malaysia', flag: '🇲🇾', code: 'MYR' },
    { name: 'Singapore', flag: '🇸🇬', code: 'SGD' },
    { name: 'Saudi Arabia', flag: '🇸🇦', code: 'SAR' },
    { name: 'United Arab Emirates', flag: '🇦🇪', code: 'AED' },
    { name: 'Qatar', flag: '🇶🇦', code: 'QAR' },
    { name: 'Kuwait', flag: '🇰🇼', code: 'KWD' },
    { name: 'Bahrain', flag: '🇧🇭', code: 'BHD' },
    { name: 'Oman', flag: '🇴🇲', code: 'OMR' },
    { name: 'Jamaica', flag: '🇯🇲', code: 'JMD' },
    { name: 'Dominican Republic', flag: '🇩🇴', code: 'DOP' },
    { name: 'Haiti', flag: '🇭🇹', code: 'HTG' },
    { name: 'Trinidad and Tobago', flag: '🇹🇹', code: 'TTD' },
    { name: 'Barbados', flag: '🇧🇧', code: 'BBD' },
    { name: 'Honduras', flag: '🇭🇳', code: 'HNL' },
    { name: 'El Salvador', flag: '🇸🇻', code: 'SVC' },
    { name: 'Guatemala', flag: '🇬🇹', code: 'GTQ' },
    { name: 'Nicaragua', flag: '🇳🇮', code: 'NIO' },
    { name: 'Costa Rica', flag: '🇨🇷', code: 'CRC' },
    { name: 'Panama', flag: '🇵🇦', code: 'PAB' },
    { name: 'Colombia', flag: '🇨🇴', code: 'COP' },
    { name: 'Venezuela', flag: '🇻🇪', code: 'VEF' },
    { name: 'Peru', flag: '🇵🇪', code: 'PEN' },
    { name: 'Ecuador', flag: '🇪🇨', code: 'USD' },
    { name: 'Bolivia', flag: '🇧🇴', code: 'BOB' },
    { name: 'Chile', flag: '🇨🇱', code: 'CLP' },
    { name: 'Argentina', flag: '🇦🇷', code: 'ARS' },
    { name: 'Brazil', flag: '🇧🇷', code: 'BRL' },
    { name: 'Paraguay', flag: '🇵🇾', code: 'PYG' },
    { name: 'Uruguay', flag: '🇺🇾', code: 'UYU' },
    { name: 'Mexico', flag: '🇲🇽', code: 'MXN' },
    { name: 'Canada', flag: '🇨🇦', code: 'CAD' },
    { name: 'United States', flag: '🇺🇸', code: 'USD' },
  ];

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative flex items-center justify-between h-16 md:h-20">
            <button
              className="md:hidden text-slate-700 p-2 z-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <a href="/TaperPayerHome" className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 flex-shrink-0">
              <img 
                src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png"
                alt="Taper Payer"
                className="h-36 md:h-28 w-auto"
              />
            </a>
            
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="/TaperPayerHome" className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Home</a>
              <a href="/TaperPayerAbout" className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">About</a>
              <a href="/TaperPayerHowItWorks" className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">How It Works</a>
              <a href="/TaperPayerRates" className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Exchange Rates</a>
              <a href="/TaperPayerTopUp" className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Taper Mobile</a>
              <a href="/TaperPayerContact" className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Contact</a>
              <a href="https://bluepaycard.wwcnyotm.com/UnitedStates/en-US/Ghana/MTS/Account/Login" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="text-slate-700 border-slate-300 hover:bg-slate-50">Login</Button>
              </a>
              <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Register" target="_blank" rel="noopener noreferrer">
                <Button size="sm" style={{ backgroundColor: '#3D7BB7' }} className="hover:opacity-90">Sign up</Button>
              </a>
            </div>

            <div className="md:hidden w-10"></div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-gradient-to-br from-blue-600 to-green-600 -mx-4 px-4 py-6 space-y-3 rounded-b-2xl">
              <a href="/TaperPayerHome" className="block text-white font-semibold hover:text-white transition-colors py-2">Home</a>
              <a href="/TaperPayerAbout" className="block text-white/90 font-medium hover:text-white transition-colors py-2">About</a>
              <a href="/TaperPayerHowItWorks" className="block text-white/90 font-medium hover:text-white transition-colors py-2">How It Works</a>
              <a href="/TaperPayerRates" className="block text-white/90 font-medium hover:text-white transition-colors py-2">Exchange Rates</a>
              <a href="/TaperPayerTopUp" className="block text-white/90 font-medium hover:text-white transition-colors py-2">Taper Mobile</a>
              <a href="/TaperPayerContact" className="block text-white/90 font-medium hover:text-white transition-colors py-2">Contact</a>
              <div className="pt-3 space-y-3">
                <a href="https://bluepaycard.wwcnyotm.com/UnitedStates/en-US/Ghana/MTS/Account/Login" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20">Login</Button>
                </a>
                <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Register" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">Sign up</Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{
        backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/2532aeec6_generated_image.png)',
        backgroundSize: bgSettings.size,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `${bgSettings.posX} ${bgSettings.posY}`,
        height: `${bgSettings.height}px`,
      }}>
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${bgSettings.opacity / 100})` }}></div>


        <div className="container mx-auto px-4 relative z-10 py-12 md:py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl mt-16 md:mt-24">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Recharge Your Phone in <span className="text-cyan-400">Seconds</span>
            </h1>
            <p className="text-xl text-slate-200 mb-8">Fast, secure, and convenient mobile top-ups anywhere, anytime.</p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <div className="flex justify-start gap-4 flex-wrap">
              {!isElementHidden('top-up-now-btn') && (
                <div className="relative inline-block">
                  <Button onClick={() => setShowTaperConnect(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-bold border-0">Top Up Now</Button>
                  <motion.span
                    className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-2xl pointer-events-none select-none"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    👆
                  </motion.span>
                </div>
              )}

              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Moncash Return Banner */}
      {moncashStatus && (
        <div ref={bannerRef} className={`mx-4 mt-6 rounded-2xl p-6 text-center shadow-lg border ${
          moncashStatus === 'success'
            ? 'bg-green-50 border-green-200'
            : moncashStatus === 'paid_but_topup_failed'
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-red-50 border-red-200'
        }`}>
          {moncashStatus === 'success' && (
            <>
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-xl font-bold text-green-800 mb-1">Top-Up Successful!</h3>
              <p className="text-green-700">
                {moncashPhone ? `Airtime has been sent to ${moncashPhone}.` : 'Your phone has been credited successfully.'}
              </p>
            </>
          )}
          {moncashStatus === 'paid_but_topup_failed' && (
            <>
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-yellow-800 mb-1">Payment received, but top-up failed</h3>
              <p className="text-yellow-700">Your payment was collected but we could not credit the phone. Please contact support at Support@taperpayer.com with your order details.</p>
            </>
          )}
          {moncashStatus === 'error' && (
            <>
              <div className="text-4xl mb-3">❌</div>
              <h3 className="text-xl font-bold text-red-800 mb-1">Payment Not Completed</h3>
              <p className="text-red-700">Your payment was not completed. Please try again or contact support.</p>
            </>
          )}
          <button onClick={() => setMoncashStatus(null)} className="mt-4 text-sm underline opacity-60 hover:opacity-100">Dismiss</button>
        </div>
      )}

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-900">
            How Taper Mobile Works
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="bg-gradient-to-br from-cyan-400 to-blue-500 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-900">
            Why Choose Taper Mobile?
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-xl border border-cyan-200 hover:border-cyan-400 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                      <p className="text-slate-600">{benefit.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Perfect For Everyone */}
      <section className="py-20 md:py-28 bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            Perfect for Everyone
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {useeCases.map((useCase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx === 0 ? -30 : idx === 2 ? 30 : 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-gradient-to-br from-cyan-500 to-blue-600 p-8 rounded-xl text-white"
              >
                <Users className="w-10 h-10 mb-4" />
                <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>
                <p className="text-cyan-50">{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-cyan-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto bg-white p-12 rounded-2xl shadow-lg border-l-4 border-cyan-500 text-center"
          >
            <p className="text-xl text-slate-700 mb-6 italic">
              "TPAY Mobile makes topping up my phone easier than ever — it's instant and reliable!"
            </p>
            <p className="text-slate-600 font-semibold">— Happy User</p>
          </motion.div>
        </div>
      </section>



      {/* Get Started CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-cyan-500 via-blue-500 to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Get Started with Taper Mobile Today</h2>
            <div className="space-y-4 mb-8 text-white text-lg">
              <p>✓ Log in to your TaperPayer account</p>
              <p>✓ Open the Taper Mobile section</p>
              <p>✓ Follow the quick steps to recharge your mobile</p>
            </div>
            <Button className="bg-white text-cyan-600 hover:bg-cyan-50 px-10 py-3 text-lg font-bold">Get Started</Button>
          </motion.div>
        </div>
      </section>

      {/* Taper Connect Sheet */}
      {showTaperConnect && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowTaperConnect(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setShowTaperConnect(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10"
            >✕</button>
            <div className="p-6 pt-12">
              <TaperConnectFormWrapper initialCountry={selectedCountry} />
            </div>
          </motion.div>
        </div>,
        document.body
      )}



      {/* Reload Form Sheet - HIDDEN (Using DTone only) */}

      {/* Top Up Sheet */}
      {showTopUpForm && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowTopUpForm(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setShowTopUpForm(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10"
            >
              ✕
            </button>
            <div className="p-6 pt-12">
              <TopUpForm />
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      <SiteFooter />
    </div>
  );
}