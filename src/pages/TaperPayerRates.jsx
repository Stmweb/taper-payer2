import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Search, ArrowLeft, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

export default function TaperPayerRates() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);

  const [search, setSearch] = useState('');

  const currencies = [
    { name: 'Haiti',              flag: '🇭🇹', code: 'HTG', method: 'MonCash' },
    { name: 'Nigeria',            flag: '🇳🇬', code: 'NGN', method: 'Bank / OPay' },
    { name: 'Ghana',              flag: '🇬🇭', code: 'GHS', method: 'MTN MoMo' },
    { name: 'Jamaica',            flag: '🇯🇲', code: 'JMD', method: 'Bank' },
    { name: 'Kenya',              flag: '🇰🇪', code: 'KES', method: 'M-Pesa' },
    { name: 'Senegal',            flag: '🇸🇳', code: 'XOF', method: 'Wave / Orange' },
    { name: 'Dominican Republic', flag: '🇩🇴', code: 'DOP', method: 'Bank' },
    { name: 'Mexico',             flag: '🇲🇽', code: 'MXN', method: 'Bank / OXXO' },
    { name: 'Angola',             flag: '🇦🇴', code: 'AOA', method: 'Bank' },
  ];

  const fetchAllRates = async () => {
    setLoading(true);
    try {
      const currencyCodes = currencies.map(c => c.code).join(', ');
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Get the current exchange rates from USD to these currencies: ${currencyCodes}. For each, provide the rate (number), trend ("up" or "down"), and approximate 24h change percentage (positive number). Use real-time data.`,
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
                  trend: { type: "string" },
                  change: { type: "number" }
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
          return { ...rate, ...currencyInfo };
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

  const filteredRates = rates.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 bg-[#eef2f9]">
      {/* Pull-to-refresh indicator */}
      {isPulling && (
        <div
          className="fixed top-0 left-0 right-0 flex justify-center items-center z-50 transition-all"
          style={{
            transform: `translateY(${Math.min(pullDistance - 40, 60)}px)`,
            opacity: Math.min(pullDistance / 80, 1)
          }}
        >
          <div className="bg-white rounded-full p-3 shadow-lg">
            <RefreshCw className={`w-6 h-6 text-blue-600 ${pullDistance > 80 ? 'animate-spin' : ''}`} />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-4">
        <Link to="/TaperPayerHome" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 flex-shrink-0">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <h1 className="text-2xl font-bold">
          <span style={{ color: '#3D7BB7' }}>Live </span>
          <span style={{ color: '#61AF39' }}>Rates</span>
        </h1>
        <button
          onClick={fetchAllRates}
          disabled={loading}
          className="ml-auto w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100"
        >
          <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search */}
      <div className="px-5 mb-5">
        <div className="bg-white rounded-2xl border border-blue-100 flex items-center gap-3 px-4 py-3 shadow-sm">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search country or currency..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm text-slate-700 bg-transparent outline-none placeholder-slate-400"
          />
        </div>
      </div>

      {/* Rates List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-slate-500 text-sm">Fetching live rates…</p>
        </div>
      ) : (
        <div className="px-5 space-y-3">
          {filteredRates.map((rate, i) => {
            const isUp = rate.trend === 'up';
            const isDown = rate.trend === 'down';
            const changeText = rate.change ? `${isUp ? '+' : ''}${rate.change}%` : null;
            return (
              <motion.div
                key={rate.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-slate-100 flex items-center gap-4"
              >
                {/* Flag */}
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-3xl">
                  {rate.flag}
                </div>

                {/* Country info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-base">{rate.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{rate.code} · {rate.method}</p>
                </div>

                {/* Rate */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-base" style={{ color: '#2479C2' }}>
                    1 USD = {rate.rate?.toFixed(1)}
                  </p>
                  {changeText && (
                    <div className={`flex items-center justify-end gap-0.5 text-xs font-semibold mt-0.5 ${isUp ? 'text-green-500' : isDown ? 'text-red-500' : 'text-slate-400'}`}>
                      {isUp ? <TrendingUp className="w-3 h-3" /> : isDown ? <TrendingDown className="w-3 h-3" /> : null}
                      {changeText}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-xs text-slate-400 px-8 mt-6">
        Rates are indicative and may vary at time of transaction.
      </p>
    </div>
  );
}