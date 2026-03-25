import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Menu, X, CheckCircle2, Globe, Zap, Shield, Users, BarChart3, ChevronRight } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';

function createPageUrl(page) {
  return `/${page}`;
}

export default function TaperPayerWhiteLabel() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    { icon: Globe, title: 'Your Brand, Your Business', description: 'Launch under your own brand with full customization. Keep 100% of customer relationships.' },
    { icon: Shield, title: 'No Licenses Required', description: 'We handle all compliance, regulations, and licensing. Focus on growing your business.' },
    { icon: Zap, title: 'Fast Deployment', description: 'Go live in weeks, not months. Leverage our proven infrastructure.' },
    { icon: Users, title: 'Dedicated Support', description: 'Your success is our success. Get priority support and strategic guidance.' },
    { icon: BarChart3, title: 'Real-Time Analytics', description: 'Monitor transactions, revenue, and customer insights through your dashboard.' },
    { icon: CheckCircle2, title: 'Complete Control', description: 'Set your own pricing, fees, and business rules while we handle operations.' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header — matches TaperPayerHome */}
      <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative flex items-center justify-between h-14 md:h-16">
            {/* Mobile Menu Button */}
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
                src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png"
                alt="Taper Payer"
                className="h-36 md:h-36 w-auto"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link to={createPageUrl('TaperPayerHome')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Home</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">About</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">How It Works</Link>
              <Link to={createPageUrl('TaperPayerRates')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Exchange Rates</Link>
              <Link to={createPageUrl('TaperPayerTopUp')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Taper Mobile</Link>
              <Link to={createPageUrl('TaperPayerContact')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Contact</Link>
              <a href="https://bluepaycard.wwcnyotm.com/UnitedStates/en-US/Ghana/MTS/Account/Login" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="text-slate-700 border-slate-300 hover:bg-slate-50">Login</Button>
              </a>
              <a href="https://bluepaycard.wwcnyotm.com/UnitedStates/en-US/Ghana/MTS/Account/Register" target="_blank" rel="noopener noreferrer">
                <Button size="sm" style={{ backgroundColor: '#3D7BB7' }} className="hover:opacity-90">Sign up</Button>
              </a>
            </div>

            <div className="md:hidden w-10"></div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-gradient-to-br from-blue-600 to-green-600 -mx-4 px-4 py-6 space-y-3 rounded-b-2xl">
              <Link to={createPageUrl('TaperPayerHome')} className="block text-white font-semibold hover:text-white transition-colors py-2">Home</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">About</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">How It Works</Link>
              <Link to={createPageUrl('TaperPayerRates')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">Exchange Rates</Link>
              <Link to={createPageUrl('TaperPayerTopUp')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">Taper Mobile</Link>
              <Link to={createPageUrl('TaperPayerContact')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">Contact</Link>
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
      <section className="relative overflow-hidden px-6 py-20 md:py-32" style={{ background: 'linear-gradient(135deg, #2479C2 0%, #61AF39 100%)' }}>
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              White Label Money Transfer Solution
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              No licenses required. Your app. Your brand. Your business. We handle the rest.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
              Start Your Journey
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 3-Phone Flow Section */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #f0fdf4 100%)' }}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Your App. Powered by Us.</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              See exactly how your branded app will work — from identity to payout in seconds.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
            {/* Phone 1 — KYC */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="relative w-52 rounded-[2.5rem] p-3 shadow-2xl" style={{ background: 'linear-gradient(145deg, #1a3a5c, #2d5f8f)' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-xl z-10" style={{ background: '#1a3a5c' }}></div>
                <div className="rounded-[2rem] overflow-hidden bg-white" style={{ minHeight: 380 }}>
                  {/* Status bar */}
                  <div className="px-4 pt-5 pb-2 flex items-center justify-between text-xs font-medium" style={{ background: 'linear-gradient(90deg, #3D7BB7, #61AF39)', color: 'white' }}>
                    <span>9:41</span>
                    <span className="text-xs">▲ ◼ ◼</span>
                  </div>
                  {/* Taper Payer Logo Header */}
                  <div className="flex justify-center py-2 border-b border-slate-100" style={{ background: 'linear-gradient(90deg, #3D7BB7, #61AF39)' }}>
                    <img src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png" alt="Taper Payer" className="h-10 w-auto" />
                  </div>
                  {/* Content */}
                  <div className="px-4 pt-4 pb-2">
                    <p className="text-xs font-bold text-slate-800 mb-1">Upload US or Canadian photo ID</p>
                    <p className="text-[10px] text-slate-500 mb-3 leading-snug">We require a photo of a valid government ID to verify your identity.</p>
                    <p className="text-[10px] font-semibold mb-2" style={{ color: '#3D7BB7' }}>Choose 1 of the following options:</p>
                    {['Driver License', 'State ID', 'Passport'].map((doc) => (
                      <div key={doc} className="flex items-center justify-between rounded-lg px-3 py-2 mb-2" style={{ border: '1px solid #3D7BB7', background: '#f0f7ff' }}>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>
                            <span className="text-white text-[8px]">✓</span>
                          </div>
                          <span className="text-[10px] font-medium text-slate-700">{doc}</span>
                        </div>
                        <ChevronRight className="w-3 h-3" style={{ color: '#3D7BB7' }} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Bottom Banner */}
                <div className="mt-2 rounded-2xl px-4 py-3 text-center" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>
                  <p className="text-white font-bold text-sm leading-tight">KYC Approval<br />In 60 seconds</p>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/30 rounded-full"></div>
              </div>
              <div className="mt-4 text-center">
                <div className="w-8 h-8 rounded-full text-white font-bold text-sm flex items-center justify-center mx-auto mb-2" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>01</div>
              </div>
            </motion.div>

            {/* Arrow */}
            <div className="hidden md:flex items-center mb-16 text-3xl" style={{ color: '#3D7BB7' }}>→</div>
            <div className="md:hidden text-3xl rotate-90 my-2" style={{ color: '#3D7BB7' }}>→</div>

            {/* Phone 2 — Plaid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="relative w-52 rounded-[2.5rem] p-3 shadow-2xl" style={{ background: 'linear-gradient(145deg, #1a3a5c, #2d5f8f)' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-xl z-10" style={{ background: '#1a3a5c' }}></div>
                <div className="rounded-[2rem] overflow-hidden bg-white" style={{ minHeight: 380 }}>
                  <div className="px-4 pt-5 pb-2 flex items-center justify-between text-xs font-medium" style={{ background: 'linear-gradient(90deg, #3D7BB7, #61AF39)', color: 'white' }}>
                    <span>9:41</span>
                    <span className="text-xs">▲ ◼ ◼</span>
                  </div>
                  <div className="flex justify-center py-2 border-b border-slate-100" style={{ background: 'linear-gradient(90deg, #3D7BB7, #61AF39)' }}>
                    <img src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png" alt="Taper Payer" className="h-10 w-auto" />
                  </div>
                  <div className="px-4 pt-4 pb-2">
                    <p className="text-xs font-bold text-slate-800 mb-3">Select your bank</p>
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3" style={{ border: '1px solid #3D7BB7', background: '#f0f7ff' }}>
                      <span className="text-xs" style={{ color: '#3D7BB7' }}>🔍</span>
                      <span className="text-[10px] text-slate-400">Search</span>
                    </div>
                    {[
                      { name: 'Chase', url: 'www.chase.com', color: '#117ACA' },
                      { name: 'Wells Fargo', url: 'www.wellsfargo.com', color: '#CF2A2A' },
                      { name: 'Bank of America', url: 'www.bankofamerica.com', color: '#E31837' },
                    ].map((bank) => (
                      <div key={bank.name} className="flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2 mb-2 bg-white">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0" style={{ backgroundColor: bank.color }}>
                          {bank.name[0]}
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-slate-800">{bank.name}</p>
                          <p className="text-[8px] text-slate-400">{bank.url}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-2 rounded-2xl px-4 py-3 text-center" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>
                  <p className="text-white font-bold text-sm leading-tight">Plaid Connect<br />ACH Pull In your app!</p>
                  <p className="text-white/80 text-[10px] mt-1 underline">Also Utilize:</p>
                  <p className="text-white text-[10px] font-semibold">RTP, FEDNOW<br />DOMESTIC WIRE</p>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/30 rounded-full"></div>
              </div>
              <div className="mt-4 text-center">
                <div className="w-8 h-8 rounded-full text-white font-bold text-sm flex items-center justify-center mx-auto mb-2" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>02</div>
              </div>
            </motion.div>

            {/* Arrow */}
            <div className="hidden md:flex items-center mb-16 text-3xl" style={{ color: '#3D7BB7' }}>→</div>
            <div className="md:hidden text-3xl rotate-90 my-2" style={{ color: '#3D7BB7' }}>→</div>

            {/* Phone 3 — Quote & Execute */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="relative w-52 rounded-[2.5rem] p-3 shadow-2xl" style={{ background: 'linear-gradient(145deg, #1a3a5c, #2d5f8f)' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-xl z-10" style={{ background: '#1a3a5c' }}></div>
                <div className="rounded-[2rem] overflow-hidden bg-white" style={{ minHeight: 380 }}>
                  <div className="px-4 pt-5 pb-2 flex items-center justify-between text-xs font-medium" style={{ background: 'linear-gradient(90deg, #3D7BB7, #61AF39)', color: 'white' }}>
                    <span>9:41</span>
                    <span className="text-xs">▲ ◼ ◼</span>
                  </div>
                  <div className="flex justify-center py-2 border-b border-slate-100" style={{ background: 'linear-gradient(90deg, #3D7BB7, #61AF39)' }}>
                    <img src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png" alt="Taper Payer" className="h-10 w-auto" />
                  </div>
                  <div className="px-4 pt-4 pb-2 space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] text-slate-500">Send using</p>
                      <div className="flex items-center gap-1 rounded px-2 py-0.5" style={{ border: '1px solid #3D7BB7', background: '#f0f7ff' }}>
                        <span className="text-[9px] font-semibold" style={{ color: '#3D7BB7' }}>Bank transfer ▾</span>
                        <span className="text-[9px] text-slate-400 ml-1">✕</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 mb-0.5">You send</p>
                      <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ border: '1px solid #3D7BB7' }}>
                        <span className="text-lg font-bold text-slate-800">1,000</span>
                        <span className="text-[10px] font-semibold rounded px-2 py-0.5" style={{ border: '1px solid #61AF39', color: '#3D7BB7' }}>🇺🇸 USD ▾</span>
                      </div>
                    </div>
                    <div className="rounded-lg px-3 py-2 space-y-1 text-[9px]" style={{ background: '#f0f7ff', border: '1px solid #dbeafe' }}>
                      <div className="flex justify-between" style={{ color: '#3D7BB7' }}><span>⊙ Fees*</span><span className="font-semibold">6 USD</span></div>
                      <div className="flex justify-between text-slate-400 pl-3"><span>Transaction fee</span><span>6 USD</span></div>
                      <div className="flex justify-between text-slate-400 pl-3"><span>Bank transfer fee</span><span>0 USD</span></div>
                      <div className="flex justify-between border-t pt-1" style={{ color: '#3D7BB7', borderColor: '#93c5fd' }}><span>⊙ Amount to convert</span><span className="font-semibold">994 USD</span></div>
                      <div className="flex justify-between" style={{ color: '#61AF39' }}><span>⊙ Exchange rate</span><span className="font-semibold">83.266 INR</span></div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 rounded-2xl px-4 py-3 text-center" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>
                  <p className="text-white font-bold text-sm leading-tight">Pull a Quote,<br />execute, and deliver<br />to offramp Partners<br />via stablecoins all<br />through Cybrid</p>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/30 rounded-full"></div>
              </div>
              <div className="mt-4 text-center">
                <div className="w-8 h-8 rounded-full text-white font-bold text-sm flex items-center justify-center mx-auto mb-2" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>03</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Why Choose Our White Label Solution?
          </h2>
          <p className="text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto">
            Become a fintech leader without the operational complexity. Launch your own branded money transfer platform in weeks.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#e3f2fd' }}>
                    <Icon className="w-8 h-8" style={{ color: '#2479C2' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-gray-300 text-lg">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-16">
            Simple Partnership Process
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Apply', description: 'Tell us about your vision and business goals.' },
              { step: 2, title: 'Review', description: 'Our team evaluates your application and potential.' },
              { step: 3, title: 'Deploy', description: 'We customize and launch your branded platform.' },
              { step: 4, title: 'Grow', description: 'Start acquiring customers and scaling revenue.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#2479C2' }}>
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Handle */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-16">
          We Handle Everything So You Can Focus on Growth
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">What We Provide</h3>
            <ul className="space-y-4">
              {[
                'Complete payment infrastructure',
                'Compliance and regulatory management',
                'Multi-currency support',
                'Real-time transaction processing',
                '24/7 customer support infrastructure',
                'Fraud detection and security',
                'API and dashboard access',
                'Regular platform updates',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-slate-700 dark:text-gray-300 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">You Control</h3>
            <ul className="space-y-4">
              {[
                'Branding and user interface',
                'Pricing and commission structure',
                'Marketing and customer acquisition',
                'Customer service and support',
                'Product features and roadmap',
                'Geographic markets and currencies',
                'Partner ecosystem',
                'Revenue optimization strategy',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span className="text-slate-700 dark:text-gray-300 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-700 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to Launch Your Platform?
          </h2>
          <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join leading fintech companies who've already scaled with our white label solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" style={{ backgroundColor: '#2479C2' }} className="hover:opacity-90 px-8 py-6 text-lg">
              Request a Demo
            </Button>
            <Link to={createPageUrl('TaperPayerContact')}>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}