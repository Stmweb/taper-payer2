import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TrendingUp, RefreshCw, ArrowRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TaperPayerLogo from '@/components/taperpayer/TaperPayerLogo';
import { base44 } from '@/api/base44Client';

export default function TaperPayerRates() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);

  const currencies = [
    { name: 'Angola', flag: '🇦🇴', currency: 'AOA', code: 'AOA' },
    { name: 'Dominican Republic', flag: '🇩🇴', currency: 'DOP', code: 'DOP' },
    { name: 'Ghana', flag: '🇬🇭', currency: 'GHS', code: 'GHS' },
    { name: 'Haiti', flag: '🇭🇹', currency: 'HTG', code: 'HTG' },
    { name: 'Mexico', flag: '🇲🇽', currency: 'MXN', code: 'MXN' },
    { name: 'Morocco', flag: '🇲🇦', currency: 'MAD', code: 'MAD' },
    { name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', code: 'NGN' },
    { name: 'Senegal', flag: '🇸🇳', currency: 'XOF', code: 'XOF' }
  ];

  const fetchAllRates = async () => {
    setLoading(true);
    try {
      const currencyCodes = currencies.map(c => c.code).join(', ');
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Get the current exchange rates from USD to these currencies: ${currencyCodes}. Return the rates as an array of objects with currency_code and rate properties. Use real-time data.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            rates: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  currency_code: { type: "string" },
                  rate: { type: "number" },
                  trend: { type: "string" }
                }
              }
            },
            last_updated: { type: "string" }
          }
        }
      });

      if (result.rates) {
        const enrichedRates = result.rates.map(rate => {
          const currencyInfo = currencies.find(c => c.code === rate.currency_code);
          return {
            ...rate,
            ...currencyInfo
          };
        });
        setRates(enrichedRates);
        setLastUpdated(result.last_updated || new Date().toLocaleString());
      }
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRates();
  }, []);

  // Pull-to-refresh handlers
  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (window.scrollY === 0 && !loading) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - touchStartY.current;
      
      if (distance > 0 && distance < 150) {
        e.preventDefault();
        setIsPulling(true);
        setPullDistance(distance);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isPulling && pullDistance > 80) {
      fetchAllRates();
    }
    setIsPulling(false);
    setPullDistance(0);
  };

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, loading]);

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Pull-to-refresh indicator */}
      {isPulling && (
        <div 
          className="fixed top-0 left-0 right-0 flex justify-center items-center z-50 transition-all"
          style={{ 
            transform: `translateY(${Math.min(pullDistance - 40, 60)}px)`,
            opacity: Math.min(pullDistance / 80, 1)
          }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-full p-3 shadow-lg">
            <RefreshCw className={`w-6 h-6 text-blue-600 dark:text-blue-400 ${pullDistance > 80 ? 'animate-spin' : ''}`} />
          </div>
        </div>
      )}
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 dark:border-gray-800 border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative flex items-center justify-between h-16 md:h-20">
            <button
              className="md:hidden text-slate-700 p-2 z-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to={createPageUrl('TaperPayerHome')} className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 flex-shrink-0">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png"
                alt="Taper Payer"
                className="h-40 md:h-24 w-auto"
              />
            </Link>
            
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link to={createPageUrl('TaperPayerHome')} className="text-slate-700 dark:text-gray-300 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors" style={{ userSelect: 'none' }}>Home</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="text-slate-700 dark:text-gray-300 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors" style={{ userSelect: 'none' }}>About</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="text-slate-700 dark:text-gray-300 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors" style={{ userSelect: 'none' }}>How It Works</Link>
              <Link to={createPageUrl('TaperPayerRates')} className="text-slate-900 dark:text-white text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors" style={{ userSelect: 'none' }}>Exchange Rates</Link>
              <Link to={createPageUrl('TaperPayerContact')} className="text-slate-700 dark:text-gray-300 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors" style={{ userSelect: 'none' }}>Contact</Link>
              <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Login" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="text-slate-700 dark:text-gray-300 dark:border-gray-600 border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800" style={{ userSelect: 'none' }}>Login</Button>
              </a>
              <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Register" target="_blank" rel="noopener noreferrer">
                <Button size="sm" style={{ backgroundColor: '#2479C2', userSelect: 'none' }} className="hover:opacity-90">Sign up</Button>
              </a>
            </div>

            <div className="md:hidden w-10"></div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden bg-gradient-to-br from-blue-600 to-green-600 -mx-4 px-4 py-6 space-y-3 rounded-b-2xl">
              <Link to={createPageUrl('TaperPayerHome')} className="block text-white/90 font-medium hover:text-white transition-colors py-2" style={{ userSelect: 'none' }}>Home</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="block text-white/90 font-medium hover:text-white transition-colors py-2" style={{ userSelect: 'none' }}>About</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="block text-white/90 font-medium hover:text-white transition-colors py-2" style={{ userSelect: 'none' }}>How It Works</Link>
              <Link to={createPageUrl('TaperPayerRates')} className="block text-white font-semibold hover:text-white transition-colors py-2" style={{ userSelect: 'none' }}>Exchange Rates</Link>
              <Link to={createPageUrl('TaperPayerContact')} className="block text-white/90 font-medium hover:text-white transition-colors py-2" style={{ userSelect: 'none' }}>Contact</Link>
              <div className="pt-3 space-y-3">
                <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Login" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20" style={{ userSelect: 'none' }}>Login</Button>
                </a>
                <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Register" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100" style={{ userSelect: 'none' }}>Sign up</Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Live Exchange Rates
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Real-Time <span style={{ color: '#2479C2' }}>Currency</span> Exchange Rates
          </h1>
          <p className="text-xl text-slate-600 dark:text-gray-400 leading-relaxed mb-6">
            Stay informed with our live exchange rates. We update our rates constantly to ensure you get the best value for your money.
          </p>
          <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <span>Last Updated: {lastUpdated || 'Loading...'}</span>
              <button
                onClick={fetchAllRates}
                disabled={loading}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 disabled:opacity-50"
                style={{ userSelect: 'none' }}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="md:hidden text-xs">Pull down to refresh rates</p>
          </div>
        </motion.div>

        {/* Rates Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
            <p className="text-lg text-slate-600 dark:text-gray-400">Fetching live exchange rates...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {rates.map((rate, index) => (
              <motion.div
                key={rate.currency_code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 dark:bg-slate-800 dark:border-gray-700 dark:hover:border-blue-600">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{rate.flag}</span>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{rate.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400">{rate.currency_code}</p>
                      </div>
                    </div>
                    {rate.trend && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rate.trend === 'up' ? 'bg-green-100 text-green-700' : 
                        rate.trend === 'down' ? 'bg-red-100 text-red-700' : 
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {rate.trend === 'up' ? '↑' : rate.trend === 'down' ? '↓' : '→'}
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-4 mb-4">
                    <div className="text-sm text-slate-600 dark:text-gray-400 mb-1">1 USD =</div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {rate.rate?.toFixed(2)} <span className="text-xl text-slate-600 dark:text-gray-400">{rate.currency_code}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>$100 USD</span>
                      <span className="font-semibold">{(100 * rate.rate).toFixed(2)} {rate.currency_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>$500 USD</span>
                      <span className="font-semibold">{(500 * rate.rate).toFixed(2)} {rate.currency_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>$1,000 USD</span>
                      <span className="font-semibold">{(1000 * rate.rate).toFixed(2)} {rate.currency_code}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <Card className="p-8 bg-gradient-to-br from-blue-600 to-green-600 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Send Money?</h3>
              <p className="text-lg text-blue-100 mb-6">
                Lock in these great rates and send money to your loved ones today
              </p>
              <Link to={createPageUrl('TaperPayerHome')}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg" style={{ userSelect: 'none' }}>
                  Start Transfer <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Disclaimer */}
        <div className="mt-12 text-center max-w-3xl mx-auto">
          <p className="text-sm text-slate-500 dark:text-gray-400">
            <strong>Note:</strong> Exchange rates are updated in real-time and may vary. The final rate will be confirmed at the time of your transaction. Additional fees may apply.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/50986bd44_ChatGPTImageJan5202603_27_37PM.png" 
                alt="Taper Payer Logo" 
                className="w-48 h-auto mb-4" 
              />
              <p className="text-slate-300">Fast, secure, and affordable global money transfers.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link to={createPageUrl('TaperPayerHowItWorks')} className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to={createPageUrl('TaperPayerRates')} className="hover:text-white transition-colors">Exchange Rates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link to={createPageUrl('TaperPayerAbout')} className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to={createPageUrl('TaperPayerContact')} className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center text-slate-400">
            <p>&copy; 2026 Taper Payer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}