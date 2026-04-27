import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, MessageCircle, ChevronDown, ChevronUp,
  Shield, Clock, Globe, Smartphone, DollarSign, Lock, RefreshCw, AlertCircle
} from 'lucide-react';

const faqs = [
  {
    question: 'How do I send money with Taper Payer?',
    answer: 'Open the app, tap "Send Money", enter the recipient\'s details, choose your amount and destination country, then confirm with your PIN. Transfers are typically instant to next business day depending on the destination.'
  },
  {
    question: 'How do I top up a mobile phone?',
    answer: 'Tap "Mobile Top-Up" on the home screen, enter the recipient\'s phone number, select your country and carrier, choose an amount, and complete payment. The top-up is delivered instantly in most countries.'
  },
  {
    question: 'What countries does Taper Payer support?',
    answer: 'Taper Payer supports money transfers and mobile top-ups to 150+ countries including Haiti, Ghana, Nigeria, Kenya, Senegal, Dominican Republic, and many more. Check our Exchange Rates page for the full list.'
  },
  {
    question: 'How do I reset my password?',
    answer: 'On the login screen, tap "Forgot Password", enter your registered email address, and we\'ll send you a reset link. If you don\'t receive it within a few minutes, check your spam folder or contact support.'
  },
  {
    question: 'Is my money and data safe?',
    answer: 'Yes. Taper Payer uses bank-grade encryption and is fully AML/KYC compliant. All transactions are monitored 24/7 for fraud. Your personal data is never sold to third parties.'
  },
  {
    question: 'How long do transfers take?',
    answer: 'Transfer times vary by destination: instant transfers are available to select countries, while others may take 1–3 business days. Mobile top-ups are typically delivered within minutes.'
  },
  {
    question: 'What are the fees?',
    answer: 'Taper Payer offers competitive, transparent pricing with no hidden fees. The exact fee is shown before you confirm any transaction. Members enjoy reduced fees — see our membership plan for details.'
  },
  {
    question: 'How do I delete my account?',
    answer: 'Go to Settings → Delete Account & Data. You can submit a deletion request directly from the app. We will process your request within 30 days in compliance with applicable data protection laws.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept debit cards, credit cards (Visa, Mastercard), and bank transfers. Additional payment options may be available depending on your region.'
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach us by email at support@taperpayer.com, by phone at 404-994-0766 (Mon–Fri, 9am–6pm ET), or via WhatsApp. We typically respond within 1 business day.'
  },
];

const topics = [
  { icon: DollarSign, label: 'Money Transfers', color: '#3D7BB7', bg: '#e3f2fd' },
  { icon: Smartphone, label: 'Mobile Top-Up', color: '#F88F2B', bg: '#fff3e0' },
  { icon: Lock, label: 'Account & Security', color: '#61AF39', bg: '#e8f5e9' },
  { icon: RefreshCw, label: 'Refunds & Issues', color: '#e91e8c', bg: '#fce4ec' },
  { icon: Globe, label: 'Supported Countries', color: '#9c27b0', bg: '#f3e5f5' },
  { icon: AlertCircle, label: 'Report a Problem', color: '#FF6B6B', bg: '#ffe0e0' },
];

export default function TaperPayerSupport() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }} className="px-6 py-16 text-center">
        <Link to="/" className="inline-block mb-8">
          <img
            src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png"
            alt="Taper Payer"
            className="h-36 w-auto mx-auto"
            style={{ imageRendering: 'crisp-edges', WebkitFontSmoothing: 'antialiased' }}
          />
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-4"
        >
          How can we help?
        </motion.h1>
        <p className="text-white/80 text-lg max-w-xl mx-auto">
          Find answers, get support, and learn how to get the most out of Taper Payer.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Mail,
              label: 'Email Support',
              value: 'support@taperpayer.com',
              sub: 'Response within 1 business day',
              color: '#3D7BB7',
              bg: '#e3f2fd',
              href: 'mailto:support@taperpayer.com'
            },
            {
              icon: Phone,
              label: 'Phone Support',
              value: '404-994-0766',
              sub: 'Mon–Fri, 9am–6pm ET',
              color: '#61AF39',
              bg: '#e8f5e9',
              href: 'tel:+14049940766'
            },
            {
              icon: MessageCircle,
              label: 'WhatsApp',
              value: 'Chat with us',
              sub: 'Quick responses via WhatsApp',
              color: '#25D366',
              bg: '#e8f9e8',
              href: 'https://wa.me/14049940766'
            },
          ].map(({ icon: Icon, label, value, sub, color, bg, href }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center text-center gap-3 no-underline"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{label}</p>
                <p className="text-sm font-medium mt-0.5" style={{ color }}>{value}</p>
                <p className="text-xs text-slate-400 mt-1">{sub}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Support Topics */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Browse by Topic</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {topics.map(({ icon: Icon, label, color, bg }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className="text-slate-700 font-medium text-sm">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 mb-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
              >
                <span className="font-semibold text-slate-800 text-sm">{faq.question}</span>
                {openFaq === i
                  ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                }
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Address & Legal */}
      <div className="max-w-4xl mx-auto px-6 mb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e3f2fd' }}>
              <MapPin className="w-5 h-5" style={{ color: '#3D7BB7' }} />
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-1">Taper Payer INC</p>
              <p className="text-slate-500 text-sm">United States</p>
              <p className="text-slate-500 text-sm">support@taperpayer.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e8f5e9' }}>
              <Clock className="w-5 h-5" style={{ color: '#61AF39' }} />
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-1">Support Hours</p>
              <p className="text-slate-500 text-sm">Monday – Friday: 9:00 AM – 6:00 PM ET</p>
              <p className="text-slate-500 text-sm">Weekend: Email only</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fff3e0' }}>
              <Shield className="w-5 h-5" style={{ color: '#F88F2B' }} />
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-1">Legal & Privacy</p>
              <Link to="/TaperPayerPrivacy" className="text-blue-500 text-sm block hover:underline">Privacy Policy</Link>
              <Link to="/TaperPayerTerms" className="text-blue-500 text-sm block hover:underline">Terms of Service</Link>
              <Link to="/DeleteDataAndAccount" className="text-blue-500 text-sm block hover:underline">Delete My Data</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-10 text-slate-400 text-sm">
        © {new Date().getFullYear()} Taper Payer INC. All rights reserved.
      </div>
    </div>
  );
}