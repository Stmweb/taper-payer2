import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TaperPayerLogo from '@/components/taperpayer/TaperPayerLogo';
import MobileHeader from '@/components/mobile/MobileHeader';

export default function TaperPayerContact() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-900">
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

            {/* Logo - Centered on Mobile, Left on Desktop */}
            <Link to={createPageUrl('TaperPayerHome')} className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 flex-shrink-0">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png"
                alt="Taper Payer"
                className="h-40 md:h-24 w-auto"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link to={createPageUrl('TaperPayerHome')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">Home</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">About</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">How It Works</Link>
              <Link to={createPageUrl('TaperPayerRates')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">Exchange Rates</Link>
              <Link to={createPageUrl('TaperPayerContact')} className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#2479C2] transition-colors">Contact</Link>
              <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Login" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="text-slate-700 border-slate-300 hover:bg-slate-50">Login</Button>
              </a>
              <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Register" target="_blank" rel="noopener noreferrer">
                <Button size="sm" style={{ backgroundColor: '#2479C2' }} className="hover:opacity-90">Sign up</Button>
              </a>
            </div>

            {/* Spacer for Mobile to Balance Layout */}
            <div className="md:hidden w-10"></div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-gradient-to-br from-blue-600 to-green-600 -mx-4 px-4 py-6 space-y-3 rounded-b-2xl">
              <Link to={createPageUrl('TaperPayerHome')} className="block text-white font-semibold hover:text-white transition-colors py-2">Home</Link>
              <Link to={createPageUrl('TaperPayerAbout')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">About</Link>
              <Link to={createPageUrl('TaperPayerHowItWorks')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">How It Works</Link>
              <Link to={createPageUrl('TaperPayerRates')} className="block text-white/90 font-medium hover:text-white transition-colors py-2">Exchange Rates</Link>
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

      {/* Content */}
      <div className="flex flex-1 dark:bg-slate-900">
      <MobileHeader title="Contact Us" showBack={true} />
      {/* Left Side - Contact Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-700 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-xl"
        >
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600 dark:text-gray-300 mb-12">
            Have questions? We're here to help! Our customer support team is available 24/7 to assist you with any inquiries.
          </p>

          {/* Contact Details */}
          <div className="space-y-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2479C2' }}>
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Call Us</h3>
                  <p className="text-slate-600">1-800-TAPER-PAY</p>
                  <p className="text-sm text-slate-500 mt-1">Mon-Sun, 24/7</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#61AF39' }}>
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Email Us</h3>
                  <p className="text-slate-600">Support@taperpayer.com</p>
                  <p className="text-sm text-slate-500 mt-1">Response within 24 hours</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F88F2B' }}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Visit Us</h3>
                  <p className="text-slate-600">254 Chapman Rd, Ste 208 #26415</p>
                  <p className="text-slate-600">Newark, Delaware 19702</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center bg-white rounded-xl p-4 shadow-md">
              <div className="text-3xl font-bold text-slate-900 mb-1">24/7</div>
              <div className="text-sm text-slate-600">Customer Support</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 shadow-md">
              <div className="text-3xl font-bold text-slate-900 mb-1">&lt;2hr</div>
              <div className="text-sm text-slate-600">Avg Response Time</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Contact Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-900 pt-20 md:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to={createPageUrl('TaperPayerHome')}>
              <TaperPayerLogo height="h-32 md:h-16" className="mx-auto mb-6" />
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Send Us a Message
            </h2>
            <p className="text-slate-600 dark:text-gray-400">
              Fill out the form below and we'll get back to you soon
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
                className="h-12"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
                className="h-12"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1 (555) 123-4567"
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="How can we help you?"
                className="min-h-32"
                required
              />
            </div>

            {submitStatus === 'success' && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-green-700 dark:text-green-400 text-sm text-center">
                ✓ Message sent! We'll get back to you soon.
              </div>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-lg font-semibold disabled:opacity-70"
              style={{ backgroundColor: '#2479C2', userSelect: 'none' }}
            >
              {isSubmitting ? 'Sending…' : <><Send className="w-5 h-5 mr-2" />Send Message</>}
            </Button>

            <div className="text-center">
              <Link
                to={createPageUrl('TaperPayerHome')}
                className="text-sm text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Back To Home
              </Link>
            </div>
          </form>

          {/* Additional Help */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  Need Immediate Help?
                </p>
                <p className="text-sm text-slate-600 dark:text-gray-400">
                  Check out our{' '}
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Help Center</a>
                  {' '}or chat with us live!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}