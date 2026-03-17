import React from 'react';

const sections = [
  {
    title: '1. What Are Cookies?',
    content: 'Cookies are small text files stored on your device when you visit a website or use an app. They help us recognize your device, remember your preferences, and improve your overall experience with Taper Payer.'
  },
  {
    title: '2. Types of Cookies We Use',
    content: 'We use the following types of cookies:\n\n• Essential Cookies: Required for our services to function properly, including maintaining your session and enabling secure login.\n\n• Functional Cookies: Remember your preferences such as language settings and previously selected countries for transfers.\n\n• Analytics Cookies: Help us understand how users interact with our platform so we can improve performance and usability.\n\n• Security Cookies: Used to detect and prevent fraud and unauthorized access to your account.'
  },
  {
    title: '3. Third-Party Cookies',
    content: 'Some cookies on our platform are set by third-party services such as analytics providers and payment processors. These third parties have their own privacy policies and we recommend reviewing them. We do not control third-party cookies.'
  },
  {
    title: '4. How Long Do Cookies Last?',
    content: 'Session cookies are temporary and are deleted when you close your browser. Persistent cookies remain on your device for a set period (typically between 30 days and 2 years) or until you delete them manually.'
  },
  {
    title: '5. Managing Cookies',
    content: 'You can control and manage cookies through your browser settings. Most browsers allow you to refuse, delete, or be notified when cookies are set. Note that disabling essential cookies may affect the functionality of our services. For more information, refer to your browser\'s help documentation.'
  },
  {
    title: '6. Do Not Track',
    content: 'Some browsers include a "Do Not Track" feature. Our platform currently does not respond to Do Not Track signals, but we respect your privacy choices through our cookie management options.'
  },
  {
    title: '7. Updates to This Policy',
    content: 'We may update this Cookies Policy from time to time to reflect changes in technology or legislation. We will notify you of significant changes. Your continued use of our services after changes are posted constitutes your acceptance of the updated policy.'
  },
  {
    title: '8. Contact Us',
    content: 'If you have any questions about our use of cookies, please contact us at Support@taperpayer.com or write to: Taper Payer LLC, 254 Chapman Rd, Ste 208 #26415, Newark, Delaware 19702.'
  },
];

import SiteFooter from '@/components/SiteFooter';

export default function TaperPayerCookies() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div style={{ background: 'linear-gradient(to right, #2479C2, #61AF39)' }} className="py-16">
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookies Policy</h1>
          <p className="text-blue-100">Last updated: March 12, 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 md:p-12 space-y-8">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{section.title}</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}