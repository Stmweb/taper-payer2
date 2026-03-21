import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const BANNER_SIZES = {
  mobile: { width: '540px', height: '960px', display: '540 × 960 px' },
  tablet: { width: '864px', height: '1080px', display: '864 × 1080 px' },
  desktop: { width: '1600px', height: '900px', display: '1600 × 900 px' },
  wide: { width: '1500px', height: '500px', display: '1500 × 500 px' },
};

export default function PromoCarousel() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const result = await base44.entities.PromotionalBanner.filter({ is_active: true });
        if (result && result.length > 0) {
          setBanners(result.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
        }
      } catch (e) {
        console.error('Failed to load banners:', e);
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      </section>
    );
  }

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];
  const sizeKey = currentBanner.target_size || 'desktop';
  const sizeConfig = BANNER_SIZES[sizeKey];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const downloadBanner = () => {
    const link = document.createElement('a');
    link.href = currentBanner.image_url;
    link.download = `taper-banner-${sizeKey}.png`;
    link.click();
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Promotional Campaigns
          </h2>
          <p className="text-slate-600 text-lg">Check out our latest offers and promotions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 space-y-6 max-w-4xl mx-auto"
        >
          {/* Banner Preview */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative overflow-hidden rounded-xl border-2 border-slate-200 shadow-lg bg-slate-100 flex items-center justify-center"
              style={{
                width: sizeConfig.width,
                height: sizeConfig.height,
                maxWidth: '100%',
              }}
            >
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={currentBanner.image_url}
                alt={currentBanner.title}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                onClick={() => currentBanner.cta_link && window.open(currentBanner.cta_link, '_blank')}
              />
            </div>

            {/* Banner Info */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">{currentBanner.title}</h3>
              <p className="text-slate-500 text-sm mt-1">{sizeConfig.display}</p>
            </div>
          </div>

          {/* Carousel Controls */}
          {banners.length > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePrev}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-slate-600" />
              </button>

              <div className="flex gap-2">
                {banners.map((_, idx) => (
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
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-slate-600" />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={downloadBanner}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4" />
              Download Banner
            </Button>
            {currentBanner.cta_link && (
              <Button
                onClick={() => window.open(currentBanner.cta_link, '_blank')}
                className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
              >
                {currentBanner.cta_text || 'Learn More'}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}