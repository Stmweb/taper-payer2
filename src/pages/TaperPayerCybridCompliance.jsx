import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, CheckCircle, AlertCircle, Lock, FileText } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';

export default function TaperPayerCybridCompliance() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-bold text-white">Compliance & Regulatory Disclosure</h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl">
            Taper Payer is committed to operating within the highest standards of financial compliance in partnership with Cybrid Technology Inc.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 py-14 space-y-12">

        {/* Cybrid Partnership */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Our Banking & Compliance Partner: Cybrid</h2>
          </div>
          <p className="text-slate-600 text-base leading-relaxed mb-4">
            Taper Payer provides money transfer and financial services in partnership with <strong>Cybrid Technology Inc.</strong>, a regulated financial technology company. Cybrid powers the core compliance infrastructure behind our platform — including KYC (Know Your Customer) identity verification, AML (Anti-Money Laundering) screening, and the management of digital asset and fiat accounts.
          </p>
          <p className="text-slate-600 text-base leading-relaxed mb-4">
            By using Taper Payer's transfer services, you acknowledge that your account and transactions may be subject to Cybrid's policies, user agreement, and regulatory obligations.
          </p>
          <a
            href="http://cybrid.app/user-agreement"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#3D7BB7' }}
          >
            <FileText className="w-5 h-5" />
            View Cybrid User Agreement
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>

        {/* KYC / Identity Verification */}
        <section className="border-t border-slate-100 pt-10">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-900">Identity Verification (KYC)</h2>
          </div>
          <p className="text-slate-600 text-base leading-relaxed mb-4">
            To comply with federal and international regulations, Taper Payer — through Cybrid — requires users to complete identity verification before initiating transfers above regulatory thresholds. This process may include:
          </p>
          <ul className="space-y-2 text-slate-600">
            {[
              'Government-issued photo identification (passport, driver\u2019s license, national ID)',
              'Proof of address (utility bill, bank statement)',
              'Date of birth and Social Security Number or equivalent national ID number',
              'Selfie or biometric verification via our secure identity partner, Persona',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* AML */}
        <section className="border-t border-slate-100 pt-10">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-slate-900">Anti-Money Laundering (AML)</h2>
          </div>
          <p className="text-slate-600 text-base leading-relaxed mb-4">
            Taper Payer maintains a robust AML program in line with FinCEN requirements and the Bank Secrecy Act (BSA). Our compliance program includes:
          </p>
          <ul className="space-y-2 text-slate-600">
            {[
              'Automated transaction monitoring for suspicious activity',
              'Real-time OFAC (Office of Foreign Assets Control) sanctions screening',
              'Mandatory reporting of suspicious activity reports (SARs) when required by law',
              'Ongoing customer due diligence (CDD) and enhanced due diligence (EDD) for high-risk users',
              'Staff training and regular internal compliance audits',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Licensing */}
        <section className="border-t border-slate-100 pt-10">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Licensing & Registration</h2>
          </div>
          <p className="text-slate-600 text-base leading-relaxed">
            Taper Payer LLC is registered as a Money Services Business (MSB) with the Financial Crimes Enforcement Network (FinCEN). Our services are facilitated in partnership with Cybrid Technology Inc., which holds the necessary regulatory licenses and compliance certifications to operate digital asset and fiat transfer infrastructure across supported jurisdictions.
          </p>
        </section>

        {/* Data Privacy */}
        <section className="border-t border-slate-100 pt-10">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Data Privacy & Security</h2>
          </div>
          <p className="text-slate-600 text-base leading-relaxed mb-3">
            All personal data collected through Taper Payer's compliance processes is handled in accordance with our <Link to="/TaperPayerPrivacy" className="text-blue-600 hover:underline">Privacy Policy</Link> and Cybrid's own data protection practices. We use bank-level encryption (AES-256) and TLS protocols to protect your information in transit and at rest.
          </p>
          <p className="text-slate-600 text-base leading-relaxed">
            You have the right to request access to, correction of, or deletion of your personal data. To submit a data request, please contact us at <a href="mailto:info@taperpayer.com" className="text-blue-600 hover:underline">info@taperpayer.com</a>.
          </p>
        </section>

        {/* Contact */}
        <section className="border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Compliance Contact</h2>
          <p className="text-slate-600 text-base leading-relaxed mb-2">
            For compliance-related inquiries, please reach out to our compliance team:
          </p>
          <div className="bg-slate-50 rounded-xl p-5 space-y-1 text-slate-700">
            <p><strong>Taper Payer LLC — Compliance Department</strong></p>
            <p>254 Chapman Rd, Ste 208 #26415, Newark, Delaware 19702</p>
            <p>Email: <a href="mailto:info@taperpayer.com" className="text-blue-600 hover:underline">info@taperpayer.com</a></p>
            <p>Phone: <a href="tel:404-994-0766" className="text-blue-600 hover:underline">404-994-0766</a></p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
            <strong>Cybrid User Agreement:</strong> By using Taper Payer's transfer services, you agree to Cybrid's terms available at{' '}
            <a href="http://cybrid.app/user-agreement" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              http://cybrid.app/user-agreement
            </a>.
          </div>
        </section>

        <p className="text-xs text-slate-400 pt-4 border-t border-slate-100">
          Last updated: April 2026. This page is subject to change as regulatory requirements evolve.
        </p>
      </div>

      <SiteFooter />
    </div>
  );
}