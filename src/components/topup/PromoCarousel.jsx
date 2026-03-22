import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=500&fit=crop',
    title: 'Send Money Instantly',
    subtitle: 'Transfer funds to 150+ countries with the best rates',
    cta_text: 'Start Now',
    cta_link: '/TaperPayerTopUp',
    gradient: 'from-blue-900/80 to-cyan-700/60',
  },
  {
    id: 'default-2',
    image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&h=500&fit=crop',
    title: 'Top Up Any Phone',
    subtitle: 'Instant airtime recharge for any carrier, anywhere in the world',
    cta_text: 'Top Up Now',
    cta_link: '/TaperPayerTopUp',
    gradient: 'from-slate-900/80 to-orange-600/60',
  },
  {
    id: 'default-3',
    image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1600&h=500&fit=crop',
    title: 'Safe & Secure Payments',
    subtitle: 'Your transactions are protected by enterprise-grade security',
    cta_text: 'Learn More',
    cta_link: '/TaperPayerCompliance',
    gradient: 'from-green-900/80 to-teal-600/60',
  },
];

export default function PromoCarousel() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    base44.entities.PromotionalBanner.filter({ is_active: true })
      .then((result) => {
        if (result && result.length > 0) {
          const mapped = result
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
            .map((b) => ({
              id: b.id,
              image_url: b.image_url,
              title: b.title,
              subtitle: '',
              cta_text: b.cta_text || '',
              cta_link: b.cta_link || '',
              gradient: 'from-black/50 to-black/20',
            }));
          setSlides(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const goTo = useCallback((idx, dir) => {
    setDirection(dir);
    setCurrentIndex(idx);
  }, []);

  const prev = () => goTo((currentIndex - 1 + slides.length) % slides.length, -1);
  const next = useCallback(() => goTo((currentIndex + 1) % slides.length, 1), [currentIndex, slides.length, goTo]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[currentIndex];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <section className="w-full bg-slate-100 py-4 md:py-0">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
    <div className="relative overflow-hidden rounded-xl" style={{ height: '220px', maxHeight: '340px' }}>
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <img
            src={slide.image_url}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />

          {/* Text content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg md:text-5xl font-bold text-white mb-1 md:mb-3 leading-tight"
            >
              {slide.title}
            </motion.h2>
            {slide.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-white/90 text-xs md:text-xl mb-3 md:mb-6"
              >
                {slide.subtitle}
              </motion.p>
            )}
            {slide.cta_text && slide.cta_link && (
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                href={slide.cta_link}
                className="inline-block self-start bg-white text-slate-900 font-bold px-6 py-3 rounded-full hover:bg-slate-100 transition-colors text-sm md:text-base"
              >
                {slide.cta_text} →
              </motion.a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx, idx > currentIndex ? 1 : -1)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
      </div>
    </section>
  );
}