import React from 'react';

const sections = [
  {
    title: '1. Information We Collect',
    content: 'We collect personal information you provide when registering or using our services, including your full name, date of birth, government-issued ID, address, email address, phone number, and financial information. We also collect transaction data and device/usage information automatically.'
  },
  {
    title: '2. How We Use Your Information',
    content: 'We use your information to: process and verify money transfers; comply with legal and regulatory requirements (including KYC and AML obligations); communicate with you about your account and transactions; improve our products and services; and detect and prevent fraud.'
  },
  {
    title: '3. Sharing Your Information',
    content: 'We do not sell your personal data. We may share your information with: banking partners and payment processors to complete your transactions; regulatory and law enforcement authorities as required by law; third-party service providers who assist in our operations under strict confidentiality agreements.'
  },
  {
    title: '4. Data Security',
    content: 'We implement industry-standard security measures, including AES-256 encryption for data at rest, TLS encryption for data in transit, multi-factor authentication, and regular security audits. Despite these measures, no system is completely secure and we cannot guarantee absolute security.'
  },
  {
    title: '5. Data Retention',
    content: 'We retain your personal information for as long as your account is active or as required by applicable laws and regulations. Financial records may be retained for up to 7 years in compliance with anti-money laundering regulations.'
  },
  {
    title: '6. Your Rights',
    content: 'Depending on your jurisdiction, you may have the right to: access the personal information we hold about you; request correction of inaccurate data; request deletion of your data (subject to legal obligations); opt out of marketing communications. To exercise these rights, contact us at Support@taperpayer.com.'
  },
  {
    title: '7. International Transfers',
    content: 'Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.'
  },
  {
    title: '8. Children\'s Privacy',
    content: 'Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a minor has provided us with personal information, we will delete it promptly.'
  },
  {
    title: '9. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through our app. Your continued use of our services after changes are posted constitutes your acceptance of the updated policy.'
  },
  {
    title: '10. Contact Us',
    content: 'If you have questions or concerns about this Privacy Policy, please contact us at Support@taperpayer.com or write to: Taper Payer LLC, 254 Chapman Rd, Ste 208 #26415, Newark, Delaware 19702.'
  },
];

import SiteFooter from '@/components/SiteFooter';

export default function TaperPayerPrivacy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div style={{ background: 'linear-gradient(to right, #2479C2, #61AF39)' }} className="py-16">
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
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
    </div>
  );
}