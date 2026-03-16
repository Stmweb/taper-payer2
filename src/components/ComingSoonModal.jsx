import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center pointer-events-auto"
        >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10"
        >
          ✕
        </button>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="inline-block mb-6"
        >
          <Sparkles className="w-16 h-16 text-cyan-500" />
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          A Smarter Way to Move Money
        </h2>
        <p className="text-xl text-slate-600 mb-8">Is Coming</p>

        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 mb-8">
          <p className="text-sm text-slate-600 mb-4 font-medium">Official Launch</p>
          <p className="text-2xl font-bold text-slate-900 mb-6">May 18, 2026</p>

          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-cyan-600">{timeLeft.days}</div>
              <div className="text-xs text-slate-600 mt-1">Days</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-cyan-600">{timeLeft.hours}</div>
              <div className="text-xs text-slate-600 mt-1">Hours</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-cyan-600">{timeLeft.minutes}</div>
              <div className="text-xs text-slate-600 mt-1">Mins</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-cyan-600">{timeLeft.seconds}</div>
              <div className="text-xs text-slate-600 mt-1">Secs</div>
            </div>
          </div>
        </div>

        <p className="text-slate-600 mb-6">
          Stay tuned for the fastest, safest, and easiest way to send money globally.
        </p>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
        >
          Got It
        </button>
        </div>
      </motion.div>
    </>,
    document.body
  );
}