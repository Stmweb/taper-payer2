import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How do I send money with Taper Payer?',
    answer: 'Simply create an account, verify your identity, select the destination country, enter the amount, and confirm your transfer. Funds are typically delivered within minutes to the same business day.'
  },
  {
    question: 'What countries can I send money to?',
    answer: 'Taper Payer currently supports transfers to Angola, Dominican Republic, Ghana, Haiti, Kenya, Mexico, Morocco, Nigeria, and Senegal. We are continuously expanding our network.'
  },
  {
    question: 'How long does a transfer take?',
    answer: 'Most transfers are completed within minutes. In some cases, depending on the destination country and delivery method, it may take up to one business day.'
  },
  {
    question: 'What are the fees for sending money?',
    answer: 'We offer competitive, transparent fees with no hidden charges. The exact fee depends on the destination country and transfer amount. You will always see the full cost before confirming your transfer.'
  },
  {
    question: 'Is Taper Payer safe and secure?',
    answer: 'Yes. Taper Payer uses bank-level encryption, two-factor authentication, and rigorous identity verification to protect your account and transactions. We are licensed and regulated by state financial authorities.'
  },
  {
    question: 'How do I track my transfer?',
    answer: 'Once your transfer is initiated, you will receive a confirmation email with a tracking number. You can use this number on our website or mobile app to monitor the status of your transfer in real time.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept debit cards, credit cards, and bank account transfers. Available payment methods may vary depending on your location.'
  },
  {
    question: 'Can I cancel a transfer?',
    answer: 'You may cancel a transfer before it is processed. Once a transfer is in progress or completed, cancellation may not be possible. Please contact our support team immediately at Support@taperpayer.com if you need assistance.'
  },
  {
    question: 'What is the maximum amount I can send?',
    answer: 'Transfer limits vary based on your account verification level and destination country. Fully verified accounts enjoy higher limits. Contact our support team for details on your specific limit.'
  },
  {
    question: 'How do I become a Taper Payer member?',
    answer: 'Our membership program costs $2,999 per year and offers benefits such as lower fees, priority support, and exclusive rates. You can sign up via our website or mobile app.'
  },
];

export default function TaperPayerFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div style={{ background: 'linear-gradient(to right, #2479C2, #61AF39)' }} className="py-16">
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">Find answers to the most common questions about Taper Payer.</p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-semibold text-slate-900 dark:text-white text-lg">{faq.question}</span>
                {openIndex === i
                  ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Still have questions?</p>
          <Link to={createPageUrl('TaperPayerContact')} className="inline-block px-8 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: '#2479C2' }}>
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}