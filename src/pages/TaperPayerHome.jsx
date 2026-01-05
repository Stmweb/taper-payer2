import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, DollarSign, Users, Globe, MapPin, ChevronDown, Menu, X, Send } from 'lucide-react';
import TaperPayerLogo from '../components/taperpayer/TaperPayerLogo';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function TaperPayerHome() {
  const [sendFrom, setSendFrom] = useState('United States');
  const [sendTo, setSendTo] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const countries = [
    { name: 'Angola', flag: '🇦🇴' },
    { name: 'Ghana', flag: '🇬🇭' },
    { name: 'Haiti', flag: '🇭🇹' },
    { name: 'Mexico', flag: '🇲🇽' },
    { name: 'Nigeria', flag: '🇳🇬' },
    { name: 'Senegal', flag: '🇸🇳' }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #f8fafc, #dbeafe)' }}>
      {/* Header */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <TaperPayerLogo className="w-40 h-auto" />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to={createPageUrl('TaperPayerHome')} className="text-slate-700 font-medium hover:text-[#2479C2] transition-colors">Home</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="text-slate-700 font-medium hover:text-[#2479C2] transition-colors">About</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="text-slate-700 font-medium hover:text-[#2479C2] transition-colors">How It Works</Link>
              <a href="#contact" className="text-slate-700 font-medium hover:text-[#2479C2] transition-colors">Contact</a>
              <Button style={{ backgroundColor: '#2479C2' }} className="hover:opacity-90">Get Started</Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <Link to={createPageUrl('TaperPayerHome')} className="block text-slate-700 font-medium hover:text-[#2479C2] transition-colors">Home</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="block text-slate-700 font-medium hover:text-[#2479C2] transition-colors">About</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="block text-slate-700 font-medium hover:text-[#2479C2] transition-colors">How It Works</Link>
              <a href="#contact" className="block text-slate-700 font-medium hover:text-[#2479C2] transition-colors">Contact</a>
              <Button style={{ backgroundColor: '#2479C2' }} className="hover:opacity-90 w-full">Get Started</Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Send Money To Your <span style={{ color: '#2479C2' }}>Loved Ones</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Our service allows you to send money internationally at competitive exchange rates with low fees, ensuring better value for your money. We specialize in sending same day remittances and providing excellent customer service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button style={{ backgroundColor: '#61AF39' }} className="hover:opacity-90 text-lg px-8 py-6">
                Download App
              </Button>
              <Button variant="outline" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 bg-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">Money Transfer</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Send Money From</label>
                  <div className="relative">
                    <select 
                      value={sendFrom}
                      onChange={(e) => setSendFrom(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-[#2479C2] focus:border-transparent"
                    >
                      <option>United States</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Send Money To</label>
                  <div className="relative">
                    <select 
                      value={sendTo}
                      onChange={(e) => setSendTo(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-[#2479C2] focus:border-transparent"
                    >
                      <option value="">Select Receiving Country</option>
                      {countries.map(country => (
                        <option key={country.name} value={country.name}>{country.flag} {country.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <Button style={{ backgroundColor: '#2479C2' }} className="w-full hover:opacity-90 text-lg py-6">
                  Continue <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: 'linear-gradient(to right, #2479C2, #61AF39)' }} className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">87,950+</div>
              <p className="text-xl text-blue-100">Satisfied Customers</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">28,885+</div>
              <p className="text-xl text-blue-100">Transactions</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">5,416+</div>
              <p className="text-xl text-blue-100">Locations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">
          Why Choose Taper Payer?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#e3f2fd' }}>
                <Zap className="w-10 h-10" style={{ color: '#2479C2' }} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">We're Fast</h3>
              <p className="text-slate-600 text-lg">From instant to next day availability.</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#e8f5e9' }}>
                <Shield className="w-10 h-10" style={{ color: '#61AF39' }} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">We're Safe</h3>
              <p className="text-slate-600 text-lg">We take every step to safeguard your data.</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#fff3e0' }}>
                <DollarSign className="w-10 h-10" style={{ color: '#F88F2B' }} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">We're Low-Cost</h3>
              <p className="text-slate-600 text-lg">Competitive prices with no hidden fees</p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <TaperPayerLogo className="mb-4" height="h-7" />
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