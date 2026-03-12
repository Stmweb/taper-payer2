import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Award, Globe, TrendingUp, Shield, Zap, Menu, X, Smartphone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TaperPayerLogo from '@/components/taperpayer/TaperPayerLogo';

export default function TaperPayerAbout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const values = [
    {
      icon: Users,
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do, ensuring their needs drive our innovation.',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your money and data are protected with the highest security standards in the industry.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We constantly innovate to make money transfers faster, easier, and more accessible.',
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    },
    {
      icon: Heart,
      title: 'Transparency',
      description: 'No hidden fees, no surprises. What you see is what you pay, always.',
      color: 'text-rose-500',
      bg: 'bg-rose-50'
    }
  ];

  const milestones = [
    { year: '2018', title: 'Founded', description: 'Taper Payer was born with a mission to revolutionize money transfers' },
    { year: '2019', title: '1M Users', description: 'Reached our first million happy customers worldwide' },
    { year: '2021', title: 'Global Expansion', description: 'Expanded to 180+ countries across 6 continents' },
    { year: '2023', title: '10M Users', description: 'Celebrating 10 million users and $50B+ transferred' },
    { year: '2025', title: 'Industry Leader', description: 'Recognized as the fastest-growing fintech company' }
    ];

    return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 md:h-20">
            <Link to={createPageUrl('TaperPayerHome')} className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 flex-shrink-0">
              <TaperPayerLogo height="h-40 md:h-24" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to={createPageUrl('TaperPayerHome')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors font-medium">Home</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors font-medium">How It Works</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="text-gray-900 dark:text-white hover:text-blue-600 transition-colors font-medium">About</Link>
              <Link to={createPageUrl('TaperPayerContact')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors font-medium">Contact</Link>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Login" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                  Login
                </Button>
              </a>
              <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Register" target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                  Sign up
                </Button>
              </a>
            </div>
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden bg-gradient-to-br from-blue-600 to-green-600 -mx-4 px-4 py-6 space-y-3 rounded-b-2xl">
              <Link to={createPageUrl('TaperPayerHome')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">Home</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">How It Works</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="block text-white font-semibold hover:text-white transition-colors py-2">About</Link>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Our Story
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Making Money Transfers
              <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Simple for Everyone
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              We believe everyone deserves access to fast, affordable, and secure money transfers. 
              That's why we're on a mission to break down barriers and connect the world financially.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                To empower individuals and businesses worldwide with seamless, instant, and affordable 
                money transfer solutions that transcend borders and break down financial barriers.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                We're building a world where sending money is as easy as sending a message, where 
                families stay connected, businesses thrive globally, and financial inclusion is a reality for all.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { icon: Globe, label: '180+ Countries', color: 'from-blue-600 to-blue-500' },
                { icon: Users, label: '10M+ Users', color: 'from-green-600 to-green-500' },
                { icon: TrendingUp, label: '$50B+ Sent', color: 'from-orange-500 to-orange-600' },
                { icon: Award, label: '4.9★ Rating', color: 'from-yellow-500 to-orange-500' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 text-center hover:shadow-xl transition-shadow"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.label.split(' ')[0]}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label.split(' ').slice(1).join(' ')}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-none transition-all duration-300"
              >
                <div className={`w-14 h-14 ${value.bg} rounded-xl flex items-center justify-center mb-5`}>
                  <value.icon className={`w-7 h-7 ${value.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for modern payment needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Same Day Remittances</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Send money and have it delivered the same day to your loved ones. Fast, reliable, and secure transfers across borders.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">SoftPOS</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                SoftPOS (Software Point of Sale), also known as Tap to Pay, Tap on Phone, or Tap to Phone, is a cutting-edge technology that transforms any NFC-enabled smartphone or tablet into a secure, contactless payment terminal—without needing extra hardware like traditional card readers or POS devices.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Excellent Customer Service</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our dedicated team is here to help you 24/7 with any questions or concerns. We're committed to your satisfaction and success.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Journey</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">Key milestones in our growth story</p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-200 to-green-200 hidden md:block" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-bold rounded-full mb-3">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{milestone.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0 w-4 h-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-full hidden md:block">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 rounded-full animate-ping opacity-75" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Join Our Journey
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8">
              Be part of the revolution in global money transfers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-10 h-14 text-lg rounded-xl font-semibold">
                Get Started Today
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 h-14 px-10 text-lg rounded-xl font-semibold">
                View Careers
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/50986bd44_ChatGPTImageJan5202603_27_37PM.png" alt="Taper Payer Logo" className="w-48 h-auto mb-4 brightness-110" />
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