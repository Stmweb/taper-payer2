import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Award, Globe, TrendingUp, Shield, Zap, Menu, X, Smartphone } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 md:h-20">
            <Link to={createPageUrl('TaperPayerHome')} className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 flex-shrink-0">
              <TaperPayerLogo height="h-32 md:h-16" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to={createPageUrl('TaperPayerHome')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                How It Works
              </Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="text-gray-900 hover:text-blue-600 transition-colors font-medium">
                About
              </Link>
              <Link to={createPageUrl('TaperPayerContact')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Contact
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <a href="https://bluepaycard.wwcnyotm.com/Account/login?returnUrl=%2FHome%2FIndex" target="_blank" rel="noopener noreferrer">
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
            <div className="md:hidden py-4 space-y-4">
              <Link to={createPageUrl('TaperPayerHome')} className="block text-gray-600 font-medium hover:text-blue-600 transition-colors">Home</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="block text-gray-600 font-medium hover:text-blue-600 transition-colors">How It Works</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="block text-gray-900 font-medium hover:text-blue-600 transition-colors">About</Link>
              <Link to={createPageUrl('TaperPayerContact')} className="block text-gray-600 font-medium hover:text-blue-600 transition-colors">Contact</Link>
              <a href="https://bluepaycard.wwcnyotm.com/Account/login?returnUrl=%2FHome%2FIndex" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full text-gray-600 border-gray-300 hover:bg-gray-50">Login</Button>
              </a>
              <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Register" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">Sign up</Button>
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 lg:py-32">
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Making Money Transfers
              <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Simple for Everyone
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              We believe everyone deserves access to fast, affordable, and secure money transfers. 
              That's why we're on a mission to break down barriers and connect the world financially.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
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
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To empower individuals and businesses worldwide with seamless, instant, and affordable 
                money transfer solutions that transcend borders and break down financial barriers.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
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
                  className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-xl transition-shadow"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.label.split(' ')[0]}</p>
                  <p className="text-gray-600 text-sm">{stat.label.split(' ').slice(1).join(' ')}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
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
                className="bg-white rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${value.bg} rounded-xl flex items-center justify-center mb-5`}>
                  <value.icon className={`w-7 h-7 ${value.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
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
              className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Same Day Remittances</h3>
              <p className="text-gray-600 leading-relaxed">
                Send money and have it delivered the same day to your loved ones. Fast, reliable, and secure transfers across borders.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">SoftPOS</h3>
              <p className="text-gray-600 leading-relaxed">
                SoftPOS (Software Point of Sale), also known as Tap to Pay, Tap on Phone, or Tap to Phone, is a cutting-edge technology that transforms any NFC-enabled smartphone or tablet into a secure, contactless payment terminal—without needing extra hardware like traditional card readers or POS devices.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Excellent Customer Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Our dedicated team is here to help you 24/7 with any questions or concerns. We're committed to your satisfaction and success.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg sm:text-xl text-gray-600">Key milestones in our growth story</p>
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
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-bold rounded-full mb-3">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
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
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <TaperPayerLogo className="mb-4" height="h-20" />
              <p className="text-sm">Fast, secure, and affordable global money transfers.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={createPageUrl('TaperPayerHowItWorks')} className="hover:text-white transition-colors">How It Works</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Countries</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={createPageUrl('TaperPayerAbout')} className="hover:text-white transition-colors">About Us</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2025 Taper Payer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}