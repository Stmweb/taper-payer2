import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, FileText, Users, Eye, Ban, Phone, Download, Building2, UserCheck, CreditCard, Link2, GraduationCap, BarChart3, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import SiteFooter from '@/components/SiteFooter';
import TaperPayerLogo from '@/components/taperpayer/TaperPayerLogo';

// ── Compliance Matrix Data ───────────────────────────────────────────────────
const matrix = [
  {
    icon: Shield,
    category: 'Governance & Program Structure',
    color: 'blue',
    rows: [
      { label: 'AML/CTF Program approved annually', value: 'No', note: 'In development – to be approved post-launch' },
      { label: 'Designated Compliance Officer', value: 'Yes' },
      { label: 'Written AML policies & procedures', value: 'Yes' },
      { label: 'Independent audit (internal or third party)', value: 'No', note: 'Planned post-launch' },
    ],
  },
  {
    icon: Building2,
    category: '🏦 Banking & Shell Bank Policies',
    color: 'slate',
    rows: [
      { label: 'Prohibits relationships with shell banks', value: 'Yes' },
      { label: 'Prevents indirect use of shell banks', value: 'Yes' },
    ],
  },
  {
    icon: UserCheck,
    category: '🧑‍⚖️ Risk & Customer Controls',
    color: 'indigo',
    rows: [
      { label: 'PEP identification & monitoring', value: 'Yes' },
      { label: 'Record retention policies', value: 'Yes' },
      { label: 'AML policies applied across operations', value: 'Yes' },
      { label: 'OFAC sanctioned countries included', value: 'Yes' },
    ],
  },
  {
    icon: Link2,
    category: '🤝 Outsourcing',
    color: 'purple',
    rows: [
      { label: 'Outsource AML components', value: 'Yes', note: 'E.g. KYC/AML vendors, API providers, compliance tools' },
    ],
  },
  {
    icon: BarChart3,
    category: '📊 Risk Assessments',
    color: 'green',
    rows: [
      { label: 'Customer Risk Assessment', value: 'Yes' },
      { label: 'Enterprise AML Risk Assessment', value: 'Yes', note: 'Initial framework in place' },
      { label: 'Sanctions Risk Assessment', value: 'Yes', note: 'Initial framework in place' },
    ],
  },
  {
    icon: Search,
    category: '🔍 Screening & Monitoring',
    color: 'cyan',
    rows: [
      { label: 'Screening method', value: 'Third-party vendor' },
      { label: 'Sanctions Lists', value: '✅ UN  ✅ OFAC  ✅ EU  ✅ OFSI  ✅ G7 Lists' },
      { label: 'Additional databases', value: 'Yes', note: 'Via third-party compliance providers' },
    ],
  },
  {
    icon: UserCheck,
    category: '🧾 Customer Screening',
    color: 'orange',
    rows: [
      { label: 'PEP screening', value: 'Yes' },
      { label: 'Adverse media screening', value: 'Yes' },
      { label: 'Frequency', value: '✅ At onboarding  ✅ Ongoing monitoring' },
    ],
  },
  {
    icon: Users,
    category: '🪪 KYC / Customer Due Diligence',
    color: 'blue',
    rows: [
      { label: 'Customer identification procedures', value: 'Yes' },
      { label: 'UBO verification', value: 'Yes' },
      { label: 'Assess customer AML practices (if applicable)', value: 'Yes' },
      { label: 'Review high-risk customers', value: 'Yes' },
      { label: 'Update KYC info', value: 'Yes' },
      { label: 'Risk-based transaction profiling', value: 'Yes' },
    ],
  },
  {
    icon: CreditCard,
    category: '💳 Transactions & Reporting',
    color: 'emerald',
    rows: [
      { label: 'Fiat transactions supported', value: 'Yes' },
      { label: 'Regulatory reporting obligations', value: 'Yes' },
      { label: 'Transaction monitoring program', value: 'Yes', note: 'Rules-based / vendor-supported' },
      { label: 'Structuring detection', value: 'Yes' },
    ],
  },
  {
    icon: Link2,
    category: '🔗 Crypto / Blockchain',
    color: 'violet',
    rows: [
      { label: 'Blockchain monitoring', value: 'Yes', note: 'Via providers like Chainalysis / TRM / equivalent – planned via vendor integration' },
    ],
  },
  {
    icon: GraduationCap,
    category: '🎓 Training & Internal Controls',
    color: 'amber',
    rows: [
      { label: 'AML training program', value: 'Yes' },
      { label: 'Training records retained', value: 'Yes' },
      { label: 'Communication of AML updates', value: 'Yes' },
    ],
  },
];

// ── Policy Narrative Sections ────────────────────────────────────────────────
const sections = [
  {
    icon: Shield,
    title: '1. Introduction & Commitment',
    content: `Taper Payer LLC ("Company") is committed to the highest standards of Anti-Money Laundering (AML) and Counter-Terrorism Financing (CTF) compliance. This policy establishes the framework to detect, prevent, and report money laundering, terrorist financing, and other financial crimes. All employees, agents, and partners are required to comply with this policy and all applicable laws and regulations, including the Bank Secrecy Act (BSA) and FinCEN guidelines.`,
  },
  {
    icon: Users,
    title: '2. Customer Due Diligence (CDD)',
    content: `We apply a risk-based approach to customer due diligence:

• Identity Verification: All customers must provide a valid government-issued ID and proof of address before conducting transactions.
• Know Your Customer (KYC): We collect and verify full legal name, date of birth, address, and government ID number.
• Enhanced Due Diligence (EDD): High-risk customers, PEPs (Politically Exposed Persons), and customers from high-risk jurisdictions are subject to enhanced scrutiny.
• Ongoing Monitoring: Customer accounts and transactions are continuously monitored for suspicious activity.`,
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

Suspicious transactions are escalated to our Compliance Officer for review.`,
  },
  {
    icon: AlertTriangle,
    title: '4. Suspicious Activity Reporting (SAR)',
    content: `When suspicious activity is identified, Taper Payer is required to file a Suspicious Activity Report (SAR) with FinCEN within 30 days of detection. We maintain strict confidentiality regarding SAR filings — customers are never notified that a SAR has been filed. All staff are prohibited from "tipping off" any person who is the subject of a SAR.`,
  },
  {
    icon: Ban,
    title: '5. Sanctions Compliance (OFAC)',
    content: `Taper Payer screens all customers and transactions against the OFAC Specially Designated Nationals (SDN) list and other applicable sanctions lists. We will not process transactions involving:

• Sanctioned countries or territories
• Sanctioned individuals or entities
• Blocked or prohibited transactions under U.S. Treasury regulations

Any matches are immediately blocked and reported to the appropriate authorities.`,
  },
  {
    icon: FileText,
    title: '6. Recordkeeping',
    content: `In accordance with the Bank Secrecy Act, Taper Payer maintains the following records for a minimum of five (5) years:

• Customer identification and verification documents
• Transaction records for all transfers over $3,000
• Currency Transaction Reports (CTRs) for transactions over $10,000
• Suspicious Activity Reports (SARs)
• All AML training records and risk assessments`,
  },
  {
    icon: Users,
    title: '7. Employee Training',
    content: `All employees receive AML/CTF training upon hiring and at least annually thereafter. Training covers:

• Recognition of red flags and suspicious activity
• Customer due diligence and KYC requirements
• Reporting obligations and internal escalation procedures
• Sanctions compliance and OFAC screening
• Consequences of non-compliance`,
  },
  {
    icon: Shield,
    title: '8. Risk Assessment',
    content: `Taper Payer conducts an annual enterprise-wide AML risk assessment to identify, evaluate, and mitigate money laundering risks. Risk factors considered include customer risk, product/service risk, geographic risk, and channel risk. Results inform updates to our AML controls and procedures.`,
  },
  {
    icon: Phone,
    title: '9. Contact & Reporting',
    content: `To report suspected money laundering, fraud, or financial crimes, or for compliance inquiries, contact our Compliance Officer:

Email: compliance@taperpayer.com
Address: 254 Chapman Rd, Ste 208 #26415, Newark, Delaware 19702
Phone: 1-800-TAPER-PAY

This policy is reviewed and updated at least annually or whenever there are material changes in applicable laws, regulations, or business operations.

Last Updated: March 2026`,
  },
];

// ── PDF Generation ────────────────────────────────────────────────────────────
function generatePDF() {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const maxWidth = pageWidth - margin * 2;
  let y = 60;

  const checkPage = (needed = 20) => {
    if (y + needed > pageHeight - 50) { doc.addPage(); y = 50; }
  };

  // Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Anti-Money Laundering (AML) Policy', pageWidth / 2, y, { align: 'center' });
  y += 26;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Taper Payer LLC  |  Effective: January 1, 2026  |  Last Updated: March 2026', pageWidth / 2, y, { align: 'center' });
  y += 28;

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  // Compliance Matrix
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('AML Compliance Matrix', margin, y);
  y += 20;

  matrix.forEach((group) => {
    checkPage(30);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text(group.category.replace(/[^\x00-\x7F]/g, '').trim(), margin, y);
    y += 16;

    group.rows.forEach((row) => {
      checkPage(22);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      const labelLines = doc.splitTextToSize(row.label, maxWidth * 0.6);
      doc.text(labelLines, margin + 8, y);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(row.value === 'Yes' || row.value.startsWith('✅') ? 21 : row.value === 'No' ? 185 : 30, row.value === 'Yes' || row.value.startsWith('✅') ? 128 : 28, row.value === 'No' ? 28 : 46);
      const valLines = doc.splitTextToSize(row.value.replace(/[^\x00-\x7F]/g, '').trim(), maxWidth * 0.35);
      doc.text(valLines, margin + maxWidth * 0.62, y);

      y += Math.max(labelLines.length, valLines.length) * 12 + 2;

      if (row.note) {
        checkPage(14);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8);
        const noteLines = doc.splitTextToSize(`Note: ${row.note}`, maxWidth - 16);
        doc.text(noteLines, margin + 16, y);
        y += noteLines.length * 11 + 2;
      }
    });
    y += 8;
  });

  // Divider
  checkPage(30);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  // Narrative sections
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Policy Narrative', margin, y);
  y += 20;

  sections.forEach((section) => {
    checkPage(30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const titleLines = doc.splitTextToSize(section.title, maxWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 16 + 4;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const contentLines = doc.splitTextToSize(section.content, maxWidth);
    contentLines.forEach((line) => {
      checkPage(14);
      doc.text(line, margin, y);
      y += 14;
    });
    y += 12;
  });

  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Taper Payer LLC — AML Policy — Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
  }

  doc.save('TaperPayer_AML_Policy.pdf');
}

// ── Color helpers ─────────────────────────────────────────────────────────────
const colorMap = {
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',   icon: 'bg-blue-100 text-blue-600'   },
  slate:   { bg: 'bg-slate-50',   border: 'border-slate-200',  icon: 'bg-slate-100 text-slate-600'  },
  indigo:  { bg: 'bg-indigo-50',  border: 'border-indigo-200', icon: 'bg-indigo-100 text-indigo-600'},
  purple:  { bg: 'bg-purple-50',  border: 'border-purple-200', icon: 'bg-purple-100 text-purple-600'},
  green:   { bg: 'bg-green-50',   border: 'border-green-200',  icon: 'bg-green-100 text-green-600'  },
  cyan:    { bg: 'bg-cyan-50',    border: 'border-cyan-200',   icon: 'bg-cyan-100 text-cyan-600'    },
  orange:  { bg: 'bg-orange-50',  border: 'border-orange-200', icon: 'bg-orange-100 text-orange-600'},
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200',icon: 'bg-emerald-100 text-emerald-600'},
  violet:  { bg: 'bg-violet-50',  border: 'border-violet-200', icon: 'bg-violet-100 text-violet-600'},
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',  icon: 'bg-amber-100 text-amber-600'  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function TaperPayerAML() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/TaperPayerHome">
            <TaperPayerLogo height="h-16" />
          </Link>
          <div className="flex items-center gap-3">
            <Button onClick={generatePDF} variant="outline" className="flex items-center gap-2 text-blue-700 border-blue-300 hover:bg-blue-50">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Link to="/TaperPayerHome" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
              ← Back to Home
            </Link>
          </div>
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

        {/* Download CTA */}
        <div className="flex justify-end mb-8">
          <Button onClick={generatePDF} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white">
            <Download className="w-4 h-4" />
            Download Full AML Policy (PDF)
          </Button>
        </div>

        {/* Compliance Matrix */}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" /> AML Compliance Matrix
        </h2>
        <div className="space-y-6 mb-16">
          {matrix.map((group, gi) => {
            const Icon = group.icon;
            const c = colorMap[group.color] || colorMap.blue;
            return (
              <div key={gi} className={`rounded-2xl border ${c.border} ${c.bg} overflow-hidden shadow-sm`}>
                <div className="flex items-center gap-3 px-6 py-4 border-b border-inherit">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.icon}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{group.category}</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {group.rows.map((row, ri) => (
                    <div key={ri} className="px-6 py-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                      <div className="text-sm text-slate-700 dark:text-slate-300 flex-1">{row.label}</div>
                      <div className="flex flex-col items-start sm:items-end gap-0.5 shrink-0 sm:ml-4">
                        <span className={`text-sm font-semibold ${
                          row.value === 'Yes' ? 'text-green-600' :
                          row.value === 'No' ? 'text-red-500' :
                          'text-slate-800'
                        }`}>{row.value}</span>
                        {row.note && <span className="text-xs text-slate-400 italic">{row.note}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Policy Narrative */}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" /> Policy Narrative
        </h2>
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

        {/* Compliance CTA */}
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