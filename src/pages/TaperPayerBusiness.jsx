import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard, Smartphone, Zap, Menu, X, MapPin, Globe } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function TaperPayerBusiness() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button - Left */}
            <button
              className="md:hidden text-slate-700 p-2 z-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link to={createPageUrl('TaperPayerHome')} className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 flex-shrink-0">
              <img 
                src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/1bfa6df02_TaperPayerVeryGood.png"
                alt="Taper Payer"
                className="h-40 md:h-24 w-auto mix-blend-multiply"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link to={createPageUrl('TaperPayerHome')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">Home</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">About</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">How It Works</Link>
              <Link to={createPageUrl('TaperPayerRates')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">Exchange Rates</Link>
              <Link to={createPageUrl('TaperPayerTopUp')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">TPAY Mobile</Link>
              <Link to={createPageUrl('TaperPayerContact')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">Contact</Link>
              <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Login" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="text-slate-700 border-slate-300 hover:bg-slate-50">Login</Button>
              </a>
              <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Register" target="_blank" rel="noopener noreferrer">
                <Button size="sm" style={{ backgroundColor: '#2479C2' }} className="hover:opacity-90">Sign up</Button>
              </a>
            </div>

            {/* Spacer for Mobile */}
            <div className="md:hidden w-10"></div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-gradient-to-br from-blue-600 to-green-600 -mx-4 px-4 py-6 space-y-3 rounded-b-2xl">
              <Link to={createPageUrl('TaperPayerHome')} className="block text-white font-semibold hover:text-white transition-colors py-2">Home</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">About</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">How It Works</Link>
              <Link to={createPageUrl('TaperPayerRates')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">Exchange Rates</Link>
              <Link to={createPageUrl('TaperPayerTopUp')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">TPAY Mobile</Link>
              <Link to={createPageUrl('TaperPayerContact')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">Contact</Link>
              <div className="pt-3 space-y-3">
                <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Login" target="_blank" rel="noopener noreferrer">
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

      {/* Tap to Pay Section */}
      <section className="bg-white dark:bg-slate-800 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Tap to Pay - It's That Easy</h2>
            <p className="text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              Send money in just a few taps with our simple and secure payment process
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-6 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">SoftPOS</h3>
              <p className="text-lg text-slate-700 dark:text-gray-300 leading-relaxed">
                SoftPOS (Software Point of Sale), also known as Tap to Pay, Tap on Phone, or Tap to Phone, is a cutting-edge technology that transforms any NFC-enabled smartphone or tablet into a secure, contactless payment terminal—without needing extra hardware like traditional card readers or POS devices.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-12"
          >
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/b27e6372d_E8D7929C-E4A8-4138-97F5-F98758F7E75E.jpg"
              alt="Tap to Pay in action"
              className="w-full max-w-2xl rounded-3xl shadow-2xl"
            />
          </motion.div>

          <div className="relative flex items-center justify-center max-w-6xl mx-auto py-8 px-4">
            <div className="flex items-center justify-center scale-75 md:scale-100">
              {/* Connection Animation - Center */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute z-20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(circle, rgba(97, 175, 57, 0.8), transparent)' }}
              >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center">
                  <Zap className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#61AF39' }} />
                </div>
              </motion.div>

              {/* Left Phone - Taper */}
              <motion.div
                initial={{ opacity: 0, x: -150 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative"
              >
                <div className="relative w-[280px] h-[160px] md:w-[500px] md:h-[280px] bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-2 md:p-4 shadow-2xl">
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-16 md:h-32 bg-slate-900 rounded-r-2xl z-10"></div>
                  <div className="w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2479C2, #1a5a8f)' }}>
                    <div className="text-center px-3 md:px-6">
                      <motion.h2 
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-3xl md:text-7xl font-black text-white" 
                        style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
                      >
                        Taper
                      </motion.h2>
                    </div>
                  </div>
                  <div className="absolute right-1.5 md:right-2 top-1/2 transform -translate-y-1/2 w-0.5 md:w-1 h-16 md:h-32 bg-white rounded-full"></div>
                </div>
              </motion.div>

              {/* Right Phone - Payer */}
              <motion.div
                initial={{ opacity: 0, x: 150 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="relative -ml-6 md:-ml-12"
              >
                <div className="relative w-[280px] h-[160px] md:w-[500px] md:h-[280px] bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-2 md:p-4 shadow-2xl">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-16 md:h-32 bg-slate-900 rounded-l-2xl z-10"></div>
                  <div className="w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #61AF39, #4a8c2a)' }}>
                    <div className="text-center px-3 md:px-6">
                      <motion.h2 
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="text-3xl md:text-7xl font-black text-white" 
                        style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
                      >
                        Payer
                      </motion.h2>
                    </div>
                  </div>
                  <div className="absolute left-1.5 md:left-2 top-1/2 transform -translate-y-1/2 w-0.5 md:w-1 h-16 md:h-32 bg-white rounded-full"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Card Issuance Section */}
      <section className="container mx-auto px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <motion.div
            animate={{ rotateY: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-96 h-60 rounded-3xl"
            style={{ background: 'linear-gradient(135deg, #2479C2, #61AF39)' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative z-10"
        >
          <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Card Issuance</h2>
          <p className="text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto">
            Brand And Issue Physical And Virtual Cards
          </p>
          <p className="text-lg text-slate-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
            Design your unique branded cards to create a consistent identity for physical and virtual cards. Our team will handle card production and fulfillment.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mt-12 mb-8"
          >
            <motion.div
              animate={{ rotateY: [0, 15, 0, -15, 0], y: [0, -10, 0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-96 h-60 rounded-3xl shadow-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #2479C2 0%, #61AF39 100%)', transformStyle: 'preserve-3d' }}
            >
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
              <div className="relative h-full p-8 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <img 
                    src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/1bfa6df02_TaperPayerVeryGood.png"
                    alt="Taper Payer"
                    className="h-20 brightness-0 invert"
                  />
                  <CreditCard className="w-10 h-10" />
                </div>
                <div>
                  <div className="flex gap-3 mb-6">
                    <div className="w-12 h-10 rounded bg-white/20 backdrop-blur-sm" />
                    <div className="w-12 h-10 rounded bg-white/10" />
                  </div>
                  <div className="font-mono text-2xl mb-4 tracking-wider">•••• •••• •••• 4242</div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-70 mb-1">CARDHOLDER</div>
                      <div className="font-semibold">JOHN DOE</div>
                    </div>
                    <div>
                      <div className="text-xs opacity-70 mb-1">EXPIRES</div>
                      <div className="font-semibold">12/28</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <Card className="p-8 hover:shadow-xl transition-shadow h-full">
              <motion.div animate={{ rotateY: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <CreditCard className="w-12 h-12 mb-4" style={{ color: '#2479C2' }} />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Physical Cards</h3>
              <p className="text-slate-600 text-lg">Custom Or Ready Made Designs, Metal Or Plastic, With The Option For Cardholder Names To Be Imprinted Or For Nameless Cards That Can Be Assigned A Later Time.</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
            <Card className="p-8 hover:shadow-xl transition-shadow h-full">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                <Smartphone className="w-12 h-12 mb-4" style={{ color: '#61AF39' }} />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Virtual Cards</h3>
              <p className="text-slate-600 text-lg">Fast Issuance Of Digital Only Cards In The App Platform With Your Custom Or Our Ready Made Designs.</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
            <Card className="p-8 hover:shadow-xl transition-shadow h-full">
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                <Zap className="w-12 h-12 mb-4" style={{ color: '#F88F2B' }} />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Digital Wallet Support</h3>
              <p className="text-slate-600 text-lg">Cardholders Can Load Physical And Virtual Cards Into Their Apple Pay Or Android Pay Wallets For Touchless Payments With Tokenized Security.</p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <img src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/1bfa6df02_TaperPayerVeryGood.png" alt="Taper Payer Logo" className="w-48 h-auto mb-4 brightness-0 invert" />
              <p className="text-slate-300 text-lg">Trusted global money transfer service with over 20 years of excellence.</p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-xl">Quick Links</h4>
              <ul className="space-y-3 text-slate-300">
                <li><Link to={createPageUrl('TaperPayerHome')} className="hover:text-white transition-colors flex items-center gap-2"><span style={{ color: '#61AF39' }}>›</span> Home</Link></li>
                <li><Link to={createPageUrl('TaperPayerAbout')} className="hover:text-white transition-colors flex items-center gap-2"><span style={{ color: '#61AF39' }}>›</span> About Us</Link></li>
                <li><Link to={createPageUrl('TaperPayerHowItWorks')} className="hover:text-white transition-colors flex items-center gap-2"><span style={{ color: '#61AF39' }}>›</span> How It Works</Link></li>
                <li><Link to={createPageUrl('TaperPayerRates')} className="hover:text-white transition-colors flex items-center gap-2"><span style={{ color: '#61AF39' }}>›</span> Exchange Rates</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-xl">Resources</h4>
              <ul className="space-y-3 text-slate-300">
                <li><Link to={createPageUrl('TaperPayerFAQ')} className="hover:text-white transition-colors">FAQs</Link></li>
                <li><Link to={createPageUrl('TaperPayerTerms')} className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to={createPageUrl('TaperPayerPrivacy')} className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to={createPageUrl('TaperPayerCookies')} className="hover:text-white transition-colors">Cookies Policy</Link></li>
                <li><Link to={createPageUrl('TaperPayerWhiteLabel')} className="hover:text-white transition-colors">White Label</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-xl">Contact</h4>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#2479C2' }} />
                  <span>254 Chapman Rd, Ste 208 #26415<br />Newark, Delaware 19702</span>
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-5 h-5 flex-shrink-0" style={{ color: '#61AF39' }} />
                  <a href="mailto:Support@taperpayer.com" className="hover:text-white transition-colors">Support@taperpayer.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg" style={{ color: '#F88F2B' }}>☎</span>
                  <a href="tel:1-800-827-3772" className="hover:text-white transition-colors">1-800-TAPER-PAY</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
              <p>&copy; 2026 Taper Payer LLC. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}