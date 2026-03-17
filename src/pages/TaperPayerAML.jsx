import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, FileText, Users, Eye, Ban, Phone, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import SiteFooter from '@/components/SiteFooter';
import TaperPayerLogo from '@/components/taperpayer/TaperPayerLogo';

const sections = [
  {
    icon: Shield,
    title: '1. Introduction & Commitment',
    content: `Taper Payer LLC ("Company") is committed to the highest standards of Anti-Money Laundering (AML) and Counter-Terrorism Financing (CTF) compliance. This policy establishes the framework to detect, prevent, and report money laundering, terrorist financing, and other financial crimes. All employees, agents, and partners are required to comply with this policy and all applicable laws and regulations, including the Bank Secrecy Act (BSA) and FinCEN guidelines.`
  },
  {
    icon: Users,
    title: '2. Customer Due Diligence (CDD)',
    content: `We apply a risk-based approach to customer due diligence:
    
• Identity Verification: All customers must provide a valid government-issued ID and proof of address before conducting transactions.
• Know Your Customer (KYC): We collect and verify full legal name, date of birth, address, and government ID number.
• Enhanced Due Diligence (EDD): High-risk customers, PEPs (Politically Exposed Persons), and customers from high-risk jurisdictions are subject to enhanced scrutiny.
• Ongoing Monitoring: Customer accounts and transactions are continuously monitored for suspicious activity.`
  },
  {
    icon: Eye,
    title: '3. Transaction Monitoring',
    content: `Taper Payer employs automated and manual transaction monitoring to identify unusual or suspicious activity, including:

• Transactions structured to avoid reporting thresholds (structuring/smurfing)
• Unusually large or frequent transactions inconsistent with customer profile
• Transactions involving high-risk countries or sanctioned entities
• Rapid movement of funds with no apparent business purpose
• Transactions to/from anonymous or unverified sources

Suspicious transactions are escalated to our Compliance Officer for review.`
  },
  {
    icon: AlertTriangle,
    title: '4. Suspicious Activity Reporting (SAR)',
    content: `When suspicious activity is identified, Taper Payer is required to file a Suspicious Activity Report (SAR) with FinCEN within 30 days of detection. We maintain strict confidentiality regarding SAR filings — customers are never notified that a SAR has been filed. All staff are prohibited from "tipping off" any person who is the subject of a SAR.`
  },
  {
    icon: Ban,
    title: '5. Sanctions Compliance (OFAC)',
    content: `Taper Payer screens all customers and transactions against the OFAC Specially Designated Nationals (SDN) list and other applicable sanctions lists. We will not process transactions involving:

• Sanctioned countries or territories
• Sanctioned individuals or entities
• Blocked or prohibited transactions under U.S. Treasury regulations

Any matches are immediately blocked and reported to the appropriate authorities.`
  },
  {
    icon: FileText,
    title: '6. Recordkeeping',
    content: `In accordance with the Bank Secrecy Act, Taper Payer maintains the following records for a minimum of five (5) years:

• Customer identification and verification documents
• Transaction records for all transfers over $3,000
• Currency Transaction Reports (CTRs) for transactions over $10,000
• Suspicious Activity Reports (SARs)
• All AML training records and risk assessments`
  },
  {
    icon: Users,
    title: '7. Employee Training',
    content: `All employees receive AML/CTF training upon hiring and at least annually thereafter. Training covers:

• Recognition of red flags and suspicious activity
• Customer due diligence and KYC requirements
• Reporting obligations and internal escalation procedures
• Sanctions compliance and OFAC screening
• Consequences of non-compliance`
  },
  {
    icon: Shield,
    title: '8. Risk Assessment',
    content: `Taper Payer conducts an annual enterprise-wide AML risk assessment to identify, evaluate, and mitigate money laundering risks. Risk factors considered include customer risk, product/service risk, geographic risk, and channel risk. Results inform updates to our AML controls and procedures.`
  },
  {
    icon: Phone,
    title: '9. Contact & Reporting',
    content: `To report suspected money laundering, fraud, or financial crimes, or for compliance inquiries, contact our Compliance Officer:

Email: compliance@taperpayer.com
Address: 254 Chapman Rd, Ste 208 #26415, Newark, Delaware 19702
Phone: 1-800-TAPER-PAY

This policy is reviewed and updated at least annually or whenever there are material changes in applicable laws, regulations, or business operations.

Last Updated: March 2026`
  }
];

function generatePDF() {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;
  const maxWidth = pageWidth - margin * 2;
  let y = 60;

  // Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Anti-Money Laundering (AML) Policy', pageWidth / 2, y, { align: 'center' });
  y += 28;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Taper Payer LLC  |  Effective: January 1, 2026  |  Last Updated: March 2026', pageWidth / 2, y, { align: 'center' });
  y += 30;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  sections.forEach((section) => {
    // Section title
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const titleLines = doc.splitTextToSize(section.title, maxWidth);
    if (y + titleLines.length * 18 > 720) { doc.addPage(); y = 50; }
    doc.text(titleLines, margin, y);
    y += titleLines.length * 18 + 6;

    // Section content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const contentLines = doc.splitTextToSize(section.content, maxWidth);
    contentLines.forEach((line) => {
      if (y + 14 > 720) { doc.addPage(); y = 50; }
      doc.text(line, margin, y);
      y += 14;
    });
    y += 14;
  });

  // Footer on each page
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Taper Payer LLC — AML Policy — Page ${i} of ${totalPages}`, pageWidth / 2, 750, { align: 'center' });
  }

  doc.save('TaperPayer_AML_Policy.pdf');
}

export default function TaperPayerAML() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/TaperPayerHome">
            <TaperPayerLogo height="h-16" />
          </Link>
          <Link to="/TaperPayerHome" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-slate-800 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Anti-Money Laundering Policy</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Taper Payer LLC is committed to preventing financial crimes and maintaining the integrity of the global financial system.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
            <FileText className="w-4 h-4" />
            Effective Date: January 1, 2026 · Last Updated: March 2026
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="space-y-10">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                </div>
                <p className="text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            );
          })}
        </div>

        {/* Compliance Verification CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Submit Your Compliance Documents</h3>
          <p className="text-blue-100 mb-6">Upload your identity verification documents to maintain compliance and continue using our services.</p>
          <Link
            to="/TaperPayerCompliance"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Upload Documents →
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}