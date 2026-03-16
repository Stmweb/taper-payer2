import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function ComingSoonModal({ isOpen, onClose }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!isOpen) return;

    const calculateTimeLeft = () => {
      const launchDate = new Date('2026-05-18').getTime();
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh] pointer-events-auto">
          {/* Header Gradient */}
          <div className="h-24 sm:h-32 bg-gradient-to-br from-[#3D7BB7] via-cyan-500 to-[#61AF39] relative overflow-hidden flex-shrink-0">
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full z-10 text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 text-center relative -mt-8 sm:-mt-12">
            <motion.div
              animate={{ rotate: 360, y: [0, -8, 0] }}
              transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, y: { duration: 3, repeat: Infinity } }}
              className="inline-block mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-[#3D7BB7] to-cyan-400 rounded-2xl shadow-lg"
            >
              <Sparkles className="w-10 sm:w-12 h-10 sm:h-12 text-white" />
            </motion.div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Coming Soon
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 font-medium">Global Money Transfers Reimagined</p>

            {/* Countdown */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-slate-100">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2 sm:mb-3 font-bold">Official Launch</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#3D7BB7] mb-4 sm:mb-6">May 18, 2026</p>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Mins' },
                  { value: timeLeft.seconds, label: 'Secs' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white rounded-xl p-2 sm:p-3 shadow-sm border border-slate-100"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-xl sm:text-2xl font-bold text-[#3D7BB7]">{String(item.value).padStart(2, '0')}</div>
                    <div className="text-xs text-slate-500 mt-1 font-medium">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 leading-relaxed">
              The fastest, safest, and easiest way to send money globally—launching very soon.
            </p>

            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-[#3D7BB7] to-cyan-500 hover:shadow-lg text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base flex-shrink-0"
            >
              Notify Me <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>,
    document.body
  );
}