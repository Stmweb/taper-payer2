import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Shield, Globe, DollarSign, Smartphone, Star,
  ArrowRight, Check, Users, TrendingUp, Lock, PhoneCall
} from 'lucide-react';

const LOGO = 'https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/f99e44de6_ChatGPTImageDec29202501_48_52PM.png';

const features = [
  { icon: Zap, title: 'Instant Transfers', desc: 'Send money in seconds to family and friends worldwide with real-time delivery.', color: '#F88F2B', bg: '#fff3e0' },
  { icon: Shield, title: 'Bank-Grade Security', desc: 'Your money and data are protected with 256-bit encryption and full KYC/AML compliance.', color: '#61AF39', bg: '#e8f5e9' },
  { icon: DollarSign, title: 'Zero Hidden Fees', desc: 'We show you exactly what you pay — no surprises. What you see is what you get.', color: '#3D7BB7', bg: '#e3f2fd' },
  { icon: Globe, title: '150+ Countries', desc: 'Send money or top-up mobiles across Africa, the Caribbean, Latin America, and beyond.', color: '#9c27b0', bg: '#f3e5f5' },
  { icon: Smartphone, title: 'Mobile Top-Up', desc: 'Instantly recharge any phone worldwide — any carrier, any country, any amount.', color: '#F88F2B', bg: '#fff3e0' },
  { icon: TrendingUp, title: 'Live Exchange Rates', desc: 'Get competitive, real-time exchange rates with full transparency before you confirm.', color: '#61AF39', bg: '#e8f5e9' },
];

const destinations = [
  { name: 'Ghana', flag: '🇬🇭', currency: 'GHS' },
  { name: 'Kenya', flag: '🇰🇪', currency: 'KES' },
  { name: 'Senegal', flag: '🇸🇳', currency: 'XOF' },
  { name: 'Dominican Republic', flag: '🇩🇴', currency: 'DOP' },
  { name: 'Nigeria', flag: '🇳🇬', currency: 'NGN' },
  { name: 'Haiti', flag: '🇭🇹', currency: 'HTG' },
  { name: 'Morocco', flag: '🇲🇦', currency: 'MAD' },
  { name: 'Mexico', flag: '🇲🇽', currency: 'MXN' },
];

const steps = [
  { num: '01', title: 'Create your free account', desc: 'Sign up in under 2 minutes with just your email and phone number.' },
  { num: '02', title: 'Choose your destination', desc: 'Select the country and recipient — bank, mobile wallet, or cash pickup.' },
  { num: '03', title: 'Enter the amount', desc: 'See the live rate and exact fee before you confirm anything.' },
  { num: '04', title: 'Money delivered!', desc: 'Your recipient gets the funds instantly or within 1 business day.' },
];

const testimonials = [
  { name: 'Marcus T.', location: 'New York, USA', text: 'Taper Payer is the fastest way I\'ve found to send money to my family in Ghana. No hidden fees, always on time.', stars: 5 },
  { name: 'Isabelle M.', location: 'Miami, USA', text: 'I use it every week to top up my mom\'s phone in Haiti. Works instantly every single time!', stars: 5 },
  { name: 'David O.', location: 'Atlanta, USA', text: 'Best exchange rate for sending to Nigeria. Switched from Western Union and never looked back.', stars: 5 },
];

const stats = [
  { value: '150+', label: 'Countries Supported' },
  { value: '$0', label: 'Hidden Fees' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '4.9★', label: 'App Store Rating' },
];

export default function TaperPayerAppStoreLanding() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Hero */}
      <section className="pt-16 pb-20 px-6 text-center bg-white border-b border-slate-100">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <img src={LOGO} alt="Taper Payer" className="h-20 w-auto mx-auto mb-8" />
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6 max-w-4xl mx-auto">
            Send Money Home.<br />
            <span style={{ color: '#61AF39' }}>Fast.</span> <span style={{ color: '#F88F2B' }}>Safe.</span> <span style={{ color: '#3D7BB7' }}>Simple.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            Taper Payer is the global money transfer app built for the diaspora. Send money, top up mobiles, and support your family — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" id="download">
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black text-white px-6 py-4 rounded-2xl font-semibold text-base shadow-lg hover:bg-gray-900 transition"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div className="text-left">
                <div className="text-xs text-white/60">Download on the</div>
                <div className="text-lg font-bold">App Store</div>
              </div>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white text-slate-900 px-6 py-4 rounded-2xl font-semibold text-base shadow-lg hover:bg-slate-50 transition"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none"><path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l16 8.5-16 8.5c-.5.33-1.5.33-1.5-.5z" fill="#34A853"/><path d="M3 3.5l9.5 9.5L3 20.5V3.5z" fill="#4285F4"/><path d="M12.5 13l4 4L3 20.5l9.5-7.5z" fill="#FBBC05"/><path d="M12.5 11L3 3.5l13.5 7.5-4 .5V11z" fill="#EA4335"/></svg>
              <div className="text-left">
                <div className="text-xs text-slate-500">Get it on</div>
                <div className="text-lg font-bold">Google Play</div>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl font-black" style={{ color: '#3D7BB7' }}>{value}</p>
              <p className="text-slate-500 text-sm mt-1 font-medium">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Everything You Need to Send Money</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">One powerful app for transfers, mobile top-ups, and live rates — built for the diaspora.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: bg }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Send to Your Country</h2>
          <p className="text-white/60 text-lg mb-12">Competitive rates to the most popular remittance destinations.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {destinations.map(({ name, flag, currency }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl py-5 px-3 flex flex-col items-center gap-2 transition"
              >
                <span className="text-4xl">{flag}</span>
                <p className="text-white font-semibold text-sm">{name}</p>
                <p className="text-white/50 text-xs font-mono">{currency}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-white/40 text-sm mt-8">+ 140 more countries available</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 text-lg">Sending money has never been this simple.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black mb-4" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>
                  {num}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Everything in One App</h2>
          <p className="text-slate-500 text-lg mb-10">No extra apps, no extra fees — everything you need is inside Taper Payer.</p>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {[
              'International money transfers',
              'Mobile airtime top-up (150+ countries)',
              'Live exchange rates dashboard',
              'Request money from friends & family',
              'AGNV token transfers',
              'Send to bank, mobile wallet, or cash',
              'Transaction history & receipts',
              'KYC-compliant & AML-monitored',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e8f5e9' }}>
                  <Check className="w-3.5 h-3.5" style={{ color: '#61AF39' }} />
                </div>
                <span className="text-slate-700 font-medium text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Loved by Thousands</h2>
            <p className="text-slate-500 text-lg">Real people, real stories, real results.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map(({ name, location, text, stars }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">"{text}"</p>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{name}</p>
                  <p className="text-slate-400 text-xs">{location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Send Money?</h2>
          <p className="text-white/80 text-lg mb-10">Download Taper Payer free today and join thousands of families staying connected.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black text-white px-6 py-4 rounded-2xl font-semibold text-base shadow-lg hover:bg-gray-900 transition"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div className="text-left">
                <div className="text-xs text-white/60">Download on the</div>
                <div className="text-lg font-bold">App Store</div>
              </div>
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white text-slate-900 px-6 py-4 rounded-2xl font-semibold text-base shadow-lg hover:bg-slate-50 transition"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none"><path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l16 8.5-16 8.5c-.5.33-1.5.33-1.5-.5z" fill="#34A853"/><path d="M3 3.5l9.5 9.5L3 20.5V3.5z" fill="#4285F4"/><path d="M12.5 13l4 4L3 20.5l9.5-7.5z" fill="#FBBC05"/><path d="M12.5 11L3 3.5l13.5 7.5-4 .5V11z" fill="#EA4335"/></svg>
              <div className="text-left">
                <div className="text-xs text-slate-500">Get it on</div>
                <div className="text-lg font-bold">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-slate-900 text-center">
        <img src={LOGO} alt="Taper Payer" className="h-10 w-auto mx-auto mb-4" />
        <p className="text-slate-400 text-sm mb-4">Global Money Transfers · Mobile Top-Up · Zero Hidden Fees</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm mb-6">
          <Link to="/TaperPayerPrivacy" className="text-slate-400 hover:text-white transition">Privacy Policy</Link>
          <Link to="/TaperPayerTerms" className="text-slate-400 hover:text-white transition">Terms of Service</Link>
          <Link to="/support" className="text-slate-400 hover:text-white transition">Support</Link>
          <Link to="/TaperPayerAML" className="text-slate-400 hover:text-white transition">AML Policy</Link>
          <a href="mailto:support@taperpayer.com" className="text-slate-400 hover:text-white transition">support@taperpayer.com</a>
        </div>
        <p className="text-slate-600 text-xs">© {new Date().getFullYear()} Taper Payer LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}