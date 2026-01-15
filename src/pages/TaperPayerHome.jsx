import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, DollarSign, Users, Globe, MapPin, ChevronDown, Menu, X, Send, CreditCard, Smartphone } from 'lucide-react';
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

            {/* Logo - Centered on Mobile, Left on Desktop */}
            <Link to={createPageUrl('TaperPayerHome')} className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 flex-shrink-0">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png"
                alt="Taper Payer"
                className="h-32 md:h-16 w-auto"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link to={createPageUrl('TaperPayerHome')} className="text-slate-700 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">Home</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="text-slate-700 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">About</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="text-slate-700 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">How It Works</Link>
              <Link to={createPageUrl('TaperPayerContact')} className="text-slate-700 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">Contact</Link>
              <Link to={createPageUrl('TaperPayerLogin')}>
                <Button variant="outline" size="sm" className="text-slate-700 border-slate-300 hover:bg-slate-50">Login</Button>
              </Link>
              <Link to={createPageUrl('TaperPayerSignup')}>
                <Button size="sm" style={{ backgroundColor: '#2479C2' }} className="hover:opacity-90">Sign up</Button>
              </Link>
            </div>

            {/* Spacer for Mobile to Balance Layout */}
            <div className="md:hidden w-10"></div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t py-4 space-y-3">
              <Link to={createPageUrl('TaperPayerHome')} className="block text-slate-700 font-medium hover:text-[#2479C2] transition-colors py-2">Home</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="block text-slate-700 font-medium hover:text-[#2479C2] transition-colors py-2">About</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="block text-slate-700 font-medium hover:text-[#2479C2] transition-colors py-2">How It Works</Link>
              <Link to={createPageUrl('TaperPayerContact')} className="block text-slate-700 font-medium hover:text-[#2479C2] transition-colors py-2">Contact</Link>
              <div className="pt-3 space-y-3">
                <Link to={createPageUrl('TaperPayerLogin')}>
                  <Button variant="outline" className="text-slate-700 border-slate-300 hover:bg-slate-50 w-full">Login</Button>
                </Link>
                <Link to={createPageUrl('TaperPayerSignup')}>
                  <Button style={{ backgroundColor: '#2479C2' }} className="hover:opacity-90 w-full">Sign up</Button>
                </Link>
              </div>
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
              Taper Payer is a modern financial technology platform built for fast, secure, and seamless money transfers. Whether you're sending funds, making payments, or managing transactions, Taper Payer makes moving money simple, reliable, and transparent.
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

      {/* Tap to Pay Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Tap to Pay - It's That Easy</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
              Send money in just a few taps with our simple and secure payment process
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">SoftPOS</h3>
              <p className="text-lg text-slate-700 leading-relaxed">
                SoftPOS (Software Point of Sale), also known as Tap to Pay, Tap on Phone, or Tap to Phone, is a cutting-edge technology that transforms any NFC-enabled smartphone or tablet into a secure, contactless payment terminal—without needing extra hardware like traditional card readers or POS devices.
              </p>
            </div>
          </div>

          <div className="relative flex items-center justify-center max-w-6xl mx-auto py-8 overflow-x-auto md:overflow-visible px-4">
            <div className="flex items-center justify-center min-w-[700px] md:min-w-0">
              {/* Connection Animation - Center */}
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute z-20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(circle, rgba(97, 175, 57, 0.8), transparent)' }}
              >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center">
                  <Zap className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#61AF39' }} />
                </div>
              </motion.div>

              {/* Left Phone - Taper (Landscape) */}
              <motion.div
                initial={{ opacity: 0, x: -150 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative"
              >
                <div className="relative w-[280px] h-[160px] md:w-[500px] md:h-[280px] bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-2 md:p-4 shadow-2xl">
                  {/* Notch on side */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-16 md:h-32 bg-slate-900 rounded-r-2xl z-10"></div>

                  <div className="w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2479C2, #1a5a8f)' }}>
                    <div className="text-center px-3 md:px-6">
                      <motion.h2 
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-3xl md:text-7xl font-black text-white mb-2 md:mb-4" 
                        style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
                      >
                        Taper
                      </motion.h2>
                      <div className="inline-flex items-center gap-2 md:gap-3 bg-white/20 backdrop-blur-md rounded-full px-3 md:px-6 py-1.5 md:py-3">
                        <Send className="w-5 h-5 md:w-8 md:h-8 text-white" />
                        <span className="text-white text-sm md:text-lg font-semibold">Send Money</span>
                      </div>
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="absolute right-1.5 md:right-2 top-1/2 transform -translate-y-1/2 w-0.5 md:w-1 h-16 md:h-32 bg-white rounded-full"></div>
                </div>
              </motion.div>

              {/* Right Phone - Payer (Landscape) */}
              <motion.div
                initial={{ opacity: 0, x: 150 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="relative -ml-6 md:-ml-12"
              >
                <div className="relative w-[280px] h-[160px] md:w-[500px] md:h-[280px] bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-2 md:p-4 shadow-2xl">
                  {/* Notch on side */}
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-16 md:h-32 bg-slate-900 rounded-l-2xl z-10"></div>

                  <div className="w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #61AF39, #4a8c2a)' }}>
                    <div className="text-center px-3 md:px-6">
                      <motion.h2 
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="text-3xl md:text-7xl font-black text-white mb-2 md:mb-4" 
                        style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
                      >
                        Payer
                      </motion.h2>
                      <div className="inline-flex items-center gap-2 md:gap-3 bg-white/20 backdrop-blur-md rounded-full px-3 md:px-6 py-1.5 md:py-3">
                        <DollarSign className="w-5 h-5 md:w-8 md:h-8 text-white" />
                        <span className="text-white text-sm md:text-lg font-semibold">Receive Payment</span>
                      </div>
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="absolute left-1.5 md:left-2 top-1/2 transform -translate-y-1/2 w-0.5 md:w-1 h-16 md:h-32 bg-white rounded-full"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-6 text-slate-900">Our Services</h2>
        <p className="text-xl text-slate-600 text-center mb-16 max-w-3xl mx-auto">
          They are designed to meet all your needs. Our service allows you to send money at a competitive exchange rate with fair commissions, ensuring better value for your money.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 hover:shadow-xl transition-shadow">
            <Users className="w-12 h-12 mb-4" style={{ color: '#2479C2' }} />
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Same Day Remittances</h3>
            <p className="text-slate-600 text-lg">
              Send money and have it delivered the same day to your loved ones. Fast, reliable, and secure transfers.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-shadow">
            <Shield className="w-12 h-12 mb-4" style={{ color: '#61AF39' }} />
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Excellent Customer Service</h3>
            <p className="text-slate-600 text-lg">
              Our dedicated team is here to help you with any questions or concerns. We're committed to your satisfaction.
            </p>
          </Card>
        </div>
      </section>

      {/* Card Issuance Section */}
      <section className="container mx-auto px-6 py-20 relative overflow-hidden">
        {/* Animated Background Cards */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <motion.div
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
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
          <h2 className="text-4xl font-bold mb-6 text-slate-900">Card Issuance</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Brand And Issue Physical And Virtual Cards
          </p>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mt-4">
            Design your unique branded cards to create a consistent identity for physical and virtual cards. Our team will handle card production and fulfillment.
          </p>

          {/* Animated Card Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mt-12 mb-8"
          >
            <motion.div
              animate={{ 
                rotateY: [0, 15, 0, -15, 0],
                y: [0, -10, 0, -10, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-96 h-60 rounded-3xl shadow-2xl overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, #2479C2 0%, #61AF39 100%)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Card shine effect */}
              <motion.div
                animate={{ 
                  x: ['-100%', '200%']
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 2
                }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />

              {/* Card content */}
              <div className="relative h-full p-8 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/38da31918_ChatGPTImageJan5202603_27_37PM.png"
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

                  <div className="font-mono text-2xl mb-4 tracking-wider">
                    •••• •••• •••• 4242
                  </div>

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

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 hover:shadow-xl transition-shadow h-full">
              <motion.div
                animate={{ rotateY: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <CreditCard className="w-12 h-12 mb-4" style={{ color: '#2479C2' }} />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Physical Cards</h3>
              <p className="text-slate-600 text-lg">
                Custom Or Ready Made Designs, Metal Or Plastic, With The Option For Cardholder Names To Be Imprinted Or For Nameless Cards That Can Be Assigned A Later Time.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 hover:shadow-xl transition-shadow h-full">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Smartphone className="w-12 h-12 mb-4" style={{ color: '#61AF39' }} />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Virtual Cards</h3>
              <p className="text-slate-600 text-lg">
                Fast Issuance Of Digital Only Cards In The App Platform With Your Custom Or Our Ready Made Designs.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 hover:shadow-xl transition-shadow h-full">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Zap className="w-12 h-12 mb-4" style={{ color: '#F88F2B' }} />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Digital Wallet Support</h3>
              <p className="text-slate-600 text-lg">
                Cardholders Can Load Physical And Virtual Cards Into Their Apple Pay Or Android Pay Wallets For Touchless Payments With Tokenized Security.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Download App Section */}
      <section style={{ background: 'linear-gradient(to right, #2479C2, #61AF39)' }} className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-6">Get the App</h2>
              <p className="text-xl text-blue-100 mb-8">
                Download our app for free to send money online in minutes. Track your payments and view your transfer history from anywhere.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white hover:opacity-90 px-8 py-6 text-lg" style={{ color: '#2479C2' }}>
                  App Store
                </Button>
                <Button className="px-8 py-6 text-lg text-white hover:opacity-90" style={{ backgroundColor: '#61AF39' }}>
                  Google Play
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                {/* Phone mockup */}
                <div className="relative w-80 h-[600px] bg-slate-900 rounded-[3rem] p-4 shadow-2xl">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-10"></div>
                  
                  {/* Screen */}
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #2479C2, #61AF39)' }}>
                    {/* App UI */}
                    <div className="p-6 text-white">
                      <div className="flex items-center justify-between mb-8">
                        <img 
                          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/38da31918_ChatGPTImageJan5202603_27_37PM.png"
                          alt="Taper Payer"
                          className="h-24 w-auto"
                        />
                        <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                      </div>
                      
                      {/* Balance Card */}
                      <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 mb-6">
                        <p className="text-sm text-white/80 mb-2">Available Balance</p>
                        <p className="text-4xl font-bold mb-4">$1,250.00</p>
                        <button className="bg-white px-6 py-3 rounded-full font-semibold w-full" style={{ color: '#2479C2' }}>
                          Send Money
                        </button>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 text-center">
                          <div className="text-2xl mb-2">💸</div>
                          <p className="text-xs">Send</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 text-center">
                          <div className="text-2xl mb-2">📱</div>
                          <p className="text-xs">Wallet</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 text-center">
                          <div className="text-2xl mb-2">🏦</div>
                          <p className="text-xs">Bank</p>
                        </div>
                      </div>
                      
                      {/* Recent Transactions */}
                      <div>
                        <h3 className="text-sm font-semibold mb-3">Recent</h3>
                        <div className="space-y-2">
                          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                              <div>
                                <p className="text-sm font-semibold">To Maria</p>
                                <p className="text-xs text-white/70">Jan 4</p>
                              </div>
                            </div>
                            <p className="font-semibold">$150</p>
                          </div>
                          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                              <div>
                                <p className="text-sm font-semibold">To John</p>
                                <p className="text-xs text-white/70">Jan 3</p>
                              </div>
                            </div>
                            <p className="font-semibold">$200</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Home button */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/50986bd44_ChatGPTImageJan5202603_27_37PM.png" 
                alt="Taper Payer Logo" 
                className="w-48 h-auto mb-4 brightness-110" 
              />
              <p className="text-slate-300 text-lg mb-4">Trusted global money transfer service with over 20 years of excellence.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: '#2479C2' }}>
                  <span className="text-white text-lg">f</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: '#61AF39' }}>
                  <span className="text-white text-lg">𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: '#F88F2B' }}>
                  <span className="text-white text-lg">in</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-xl">Quick Links</h4>
              <ul className="space-y-3 text-slate-300">
                <li><Link to={createPageUrl('TaperPayerHome')} className="hover:text-white transition-colors flex items-center gap-2"><span style={{ color: '#61AF39' }}>›</span> Home</Link></li>
                <li><a href="https://taperpayer.com/TaperPayerLogin" className="hover:text-white transition-colors flex items-center gap-2"><span style={{ color: '#61AF39' }}>›</span> About Us</a></li>
                <li><a href="https://taperpayer.com/TaperPayerLogin" className="hover:text-white transition-colors flex items-center gap-2"><span style={{ color: '#61AF39' }}>›</span> How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span style={{ color: '#61AF39' }}>›</span> Agent Locations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-xl">Contact Us</h4>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#2479C2' }} />
                  <span>123 Main Street<br />New York, NY 10001</span>
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-5 h-5 flex-shrink-0" style={{ color: '#61AF39' }} />
                  <a href="mailto:info@taperpayer.com" className="hover:text-white transition-colors">info@taperpayer.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg" style={{ color: '#F88F2B' }}>☎</span>
                  <a href="tel:1-800-827-3772" className="hover:text-white transition-colors">1-800-TAPER-PAY</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-xl">Resources</h4>
              <ul className="space-y-3 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Transfer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
              <p>&copy; 2026 Taper Payer LLC. All rights reserved. Licensed in 20+ US states.</p>
              <p className="text-sm">Regulated by state financial authorities</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}