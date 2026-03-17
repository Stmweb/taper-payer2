import React from 'react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using Taper Payer\'s services, website, or mobile application, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services. Taper Payer LLC ("Taper Payer," "we," "our," or "us") reserves the right to update these terms at any time, with notice provided via email or in-app notification.'
  },
  {
    title: '2. Eligibility',
    content: 'You must be at least 18 years of age and a legal resident of a state where Taper Payer is licensed to operate. By creating an account, you represent and warrant that all information you provide is accurate, current, and complete.'
  },
  {
    title: '3. Account Registration & Security',
    content: 'You are responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately of any unauthorized use of your account. Taper Payer will not be liable for any loss arising from unauthorized access resulting from your failure to protect your credentials.'
  },
  {
    title: '4. Money Transfer Services',
    content: 'Taper Payer provides international money transfer services subject to applicable laws and regulations. All transactions are subject to identity verification and compliance checks. We reserve the right to decline, delay, or reverse any transaction we believe may violate applicable laws or our policies.'
  },
  {
    title: '5. Fees & Exchange Rates',
    content: 'Transfer fees and exchange rates are displayed before you confirm a transaction. Rates are subject to change. Once a transaction is confirmed, the stated rate and fee apply. Taper Payer earns revenue through the exchange rate margin and applicable service fees.'
  },
  {
    title: '6. Cancellations & Refunds',
    content: 'You may cancel a transfer before it is processed. Once funds have been sent or delivered, cancellation may not be possible. Refunds, if applicable, will be credited to your original payment method within 5–10 business days. Contact Support@taperpayer.com for cancellation requests.'
  },
  {
    title: '7. Prohibited Activities',
    content: 'You agree not to use Taper Payer for any unlawful purpose, including but not limited to: money laundering, financing of terrorism, fraud, or any activity that violates local, state, national, or international law. Violation of this provision may result in immediate account termination and reporting to relevant authorities.'
  },
  {
    title: '8. Limitation of Liability',
    content: 'To the fullest extent permitted by law, Taper Payer shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability to you for any claim shall not exceed the amount of the transaction in question.'
  },
  {
    title: '9. Governing Law',
    content: 'These Terms & Conditions shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.'
  },
  {
    title: '10. Contact',
    content: 'For questions regarding these Terms & Conditions, please contact us at Support@taperpayer.com or write to: Taper Payer LLC, 254 Chapman Rd, Ste 208 #26415, Newark, Delaware 19702.'
  },
];

import SiteFooter from '@/components/SiteFooter';

export default function TaperPayerTerms() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div style={{ background: 'linear-gradient(to right, #2479C2, #61AF39)' }} className="py-16">
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-blue-100">Last updated: March 12, 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 md:p-12 space-y-8">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{section.title}</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}