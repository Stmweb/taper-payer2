import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BANNER_SIZES = [
  { id: 'mobile', label: 'Mobile (9:16)', width: '540px', height: '960px', display: '540 × 960 px' },
  { id: 'tablet', label: 'Tablet (4:5)', width: '864px', height: '1080px', display: '864 × 1080 px' },
  { id: 'desktop', label: 'Desktop (16:9)', width: '1600px', height: '900px', display: '1600 × 900 px' },
  { id: 'wide', label: 'Billboard (3:1)', width: '1500px', height: '500px', display: '1500 × 500 px' },
];

export default function PromotionalBanner({ banners = [] }) {
  const [selectedSize, setSelectedSize] = useState('mobile');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Default promotional banners if none provided
  const defaultBanners = [
    {
      id: 'banner-1',
      title: 'Send Money Instantly',
      image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/2532aeec6_generated_image.png',
      cta: 'Start Transferring',
    },
    {
      id: 'banner-2',
      title: 'Top-Up at Lightning Speed',
      image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/generated_topup_banner.png',
      cta: 'Recharge Now',
    },
  ];

  const activeBanners = banners.length > 0 ? banners : defaultBanners;
  const selectedBannerSize = BANNER_SIZES.find(s => s.id === selectedSize);
  const currentBanner = activeBanners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const downloadBanner = () => {
    const link = document.createElement('a');
    link.href = currentBanner.image;
    link.download = `taper-banner-${selectedSize}.png`;
    link.click();
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Promotional Campaigns
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Download our latest promotional banners for your website, app, or marketing materials.
          </p>
        </motion.div>

        {/* Banner Preview & Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Select Banner Size
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {BANNER_SIZES.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                      selectedSize === size.id
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold">{size.label}</div>
                    <div className="text-xs opacity-70 mt-1">{size.display}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Banner Preview Container */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="relative overflow-hidden rounded-xl border-2 border-slate-200 shadow-lg bg-slate-100 flex items-center justify-center"
                style={{
                  width: selectedBannerSize.width,
                  height: selectedBannerSize.height,
                  maxWidth: '100%',
                }}
              >
                {currentBanner?.image ? (
                  <motion.img
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={currentBanner.image}
                    alt={currentBanner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-400 text-center">
                    <p className="text-sm">Banner image not available</p>
                  </div>
                )}
              </div>

              {/* Banner Info */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">{currentBanner.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{selectedBannerSize.display}</p>
              </div>
            </div>

            {/* Carousel Controls */}
            {activeBanners.length > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePrev}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
                  disabled={activeBanners.length <= 1}
                >
                  <ChevronLeft className="w-6 h-6 text-slate-600" />
                </button>

                <div className="flex gap-2">
                  {activeBanners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentIndex ? 'bg-blue-500 w-8' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
                  disabled={activeBanners.length <= 1}
                >
                  <ChevronRight className="w-6 h-6 text-slate-600" />
                </button>
              </div>
            )}

            {/* Download Button */}
            <div className="flex justify-center">
              <Button
                onClick={downloadBanner}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="w-4 h-4" />
                Download Banner ({selectedSize.toUpperCase()})
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Banner Size Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-slate-900 mb-4">📱 Mobile & App</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li>✓ Mobile (540 × 960 px) — Perfect for in-app promotions</li>
              <li>✓ Tablet (864 × 1080 px) — iPad and larger screens</li>
              <li>✓ High impact CTAs for mobile users</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-slate-900 mb-4">💻 Web & Marketing</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li>✓ Desktop (1600 × 900 px) — Website hero sections</li>
              <li>✓ Billboard (1500 × 500 px) — Wide banner ads</li>
              <li>✓ Optimized for all digital platforms</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}