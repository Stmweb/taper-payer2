import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Logo with bounce-in + pulse */}
      <motion.img
        src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png"
        alt="Taper Payer"
        className="w-80"
        initial={{ scale: 0, opacity: 0, rotate: -10 }}
        animate={{
          scale: [0, 1.15, 0.95, 1.05, 1],
          opacity: [0, 1, 1, 1, 1],
          rotate: [-10, 5, -3, 2, 0],
        }}
        transition={{
          duration: 1.0,
          ease: 'easeOut',
          times: [0, 0.4, 0.6, 0.8, 1],
        }}
      />

      {/* Tagline fades in after logo */}
      <motion.p
        className="text-slate-500 text-base font-medium mt-4 tracking-wide"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        Fast · Secure · Low Fees
      </motion.p>

      {/* Pulsing dots */}
      <motion.div
        className="flex gap-2 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#3D7BB7' }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
}