import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

const sections = [
  {
    title: '🔐 Authentication',
    color: '#3D7BB7',
    rows: [
      { fn: 'login', apis: 'bcryptjs (password verify), custom JWT' },
      { fn: 'signup', apis: 'bcryptjs, Cybrid API (create customer), custom JWT' },
      { fn: 'signupWithOTP', apis: 'Mailgun (send OTP), Cybrid (sandbox), custom JWT' },
      { fn: 'forgotPassword', apis: 'Mailgun, bcryptjs' },
      { fn: 'updateUserProfile', apis: 'Base44 entities' },
    ],
  },
  {
    title: '💸 Money Transfer',
    color: '#61AF39',
    rows: [
      { fn: 'cybridTransfer', apis: 'Cybrid API (full production) — customer KYC, accounts, Plaid, ACH, trades, remittances' },
      { fn: 'haitiTransfer', apis: 'DTone' },
    ],
  },
  {
    title: '📱 Mobile Top-Up',
    color: '#F88F2B',
    rows: [
      { fn: 'dtoneTopUp', apis: 'DTone DVS API' },
      { fn: 'dingTopUp', apis: 'Ding Connect API' },
      { fn: 'processTopUp', apis: 'DTone + Twilio (confirmation SMS)' },
      { fn: 'processDtonePayment', apis: 'DTone' },
      { fn: 'processDingPayment', apis: 'Ding Connect' },
      { fn: 'processRSAPayment', apis: 'RSA Pay API' },
      { fn: 'prepayNation', apis: 'PrepayNation / ValueTopUp API' },
    ],
  },
  {
    title: '💳 Payments',
    color: '#7C3AED',
    rows: [
      { fn: 'squarePayments', apis: 'Square API (payments, refunds, links, customers, cards)' },
      { fn: 'processSquarePayment', apis: 'Square API' },
      { fn: 'processSquareTopUp', apis: 'Square + DTone' },
      { fn: 'getSquareConfig', apis: 'Square (returns app ID / location ID)' },
      { fn: 'initiateMoncashPayment', apis: 'MonCash API + DTone (via PendingTopup)' },
      { fn: 'moncashCallback', apis: 'MonCash API + DTone' },
      { fn: 'processMoncashPayment', apis: 'MonCash + Reloadly' },
      { fn: 'processAGNVFunding', apis: 'Square (payment links)' },
    ],
  },
  {
    title: '🇭🇹 AGNV (Blockchain)',
    color: '#003DA5',
    rows: [
      { fn: 'sendAGNV', apis: 'Mailgun (receipt email)' },
      { fn: 'logAGNVTransaction', apis: 'Base44 entities' },
      { fn: 'getAGNVTransactions', apis: 'Base44 entities' },
      { fn: 'approveAGNVTransaction', apis: 'Twilio WhatsApp + Mailgun' },
      { fn: 'shareAGNVReceipt', apis: 'Base44 integrations (email)' },
    ],
  },
  {
    title: '📧 Email & Notifications',
    color: '#E91E8C',
    rows: [
      { fn: 'sendEmail', apis: 'Mailgun (contact, transactional, marketing)' },
      { fn: 'sendInquiryEmail', apis: 'Mailgun' },
      { fn: 'sendNotification', apis: 'Mailgun + Twilio (SMS + WhatsApp templates)' },
      { fn: 'sendEmailBlast', apis: 'Mailgun' },
      { fn: 'scheduleEmailCampaign', apis: 'Base44 entities' },
      { fn: 'processScheduledCampaigns', apis: 'Mailgun' },
      { fn: 'bulkImportSubscribers', apis: 'Base44 entities' },
      { fn: 'deduplicateSubscribers', apis: 'Base44 entities' },
      { fn: 'sendTestEmail', apis: 'Mailgun' },
    ],
  },
  {
    title: '📞 Twilio Webhooks',
    color: '#E53E3E',
    rows: [
      { fn: 'incomingSMS', apis: 'Handle inbound SMS (TwiML response)' },
      { fn: 'twilioVoiceHandler', apis: 'Incoming calls (TwiML response)' },
      { fn: 'twilioVoiceFallback', apis: 'Fallback voice handler' },
      { fn: 'twilioStatusCallback', apis: 'Delivery status callback' },
    ],
  },
  {
    title: '🔧 Misc / Admin',
    color: '#475569',
    rows: [
      { fn: 'veriffKYC', apis: 'Veriff API (identity verification)' },

      { fn: 'generateFlyer', apis: 'Base44 GenerateImage AI' },
      { fn: 'getExchangeRate', apis: 'open.er-api.com (free, no auth)' },
      { fn: 'createPaymentRequest', apis: 'Base44 entities + Twilio' },
      { fn: 'testReloadlyAuth', apis: 'Reloadly (debug)' },
    ],
  },
];

export default function BackendAPIDocs() {
  const contentRef = useRef(null);

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    const checkPage = (needed = 10) => {
      if (y + needed > pageHeight - 15) {
        doc.addPage();
        y = 20;
      }
    };

    // Title
    doc.setFontSize(20);
    doc.setTextColor(61, 123, 183);
    doc.setFont('helvetica', 'bold');
    doc.text('Taper Payer — Backend API Documentation', margin, y);
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    y += 10;

    sections.forEach((section) => {
      checkPage(20);

      // Section header
      const [r, g, b] = hexToRgb(section.color);
      doc.setFillColor(r, g, b);
      doc.roundedRect(margin, y, contentWidth, 8, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(section.title, margin + 4, y + 5.5);
      y += 12;

      // Table header
      doc.setFillColor(240, 244, 248);
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Function', margin + 2, y + 4);
      doc.text('APIs / Integrations', margin + 60, y + 4);
      y += 7;

      section.rows.forEach((row, i) => {
        const rowH = 7;
        checkPage(rowH + 2);

        if (i % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(margin, y, contentWidth, rowH, 'F');
        }

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 58, 138);
        doc.text(row.fn, margin + 2, y + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        const lines = doc.splitTextToSize(row.apis, contentWidth - 62);
        doc.text(lines, margin + 60, y + 4.5);
        y += Math.max(rowH, lines.length * 4.5);
      });

      y += 6;
    });

    // Footer on last page
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('© 2026 Taper Payer LLC · taperpayer.com · support@taperpayer.com', margin, pageHeight - 8);

    doc.save('TaperPayer_Backend_API_Docs.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/TaperPayerHome">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Backend API Documentation</h1>
              <p className="text-xs text-slate-500">All Taper Payer backend functions & integrations</p>
            </div>
          </div>
          <Button onClick={handleDownloadPDF} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {sections.map((section) => (
          <Card key={section.title} className="overflow-hidden shadow-sm">
            {/* Section header */}
            <div className="px-6 py-3 text-white font-bold text-base" style={{ backgroundColor: section.color }}>
              {section.title}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wide">
                    <th className="text-left px-6 py-2 w-48 font-semibold">Function</th>
                    <th className="text-left px-6 py-2 font-semibold">APIs / Integrations</th>
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row, i) => (
                    <tr key={row.fn} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-6 py-3 font-mono font-semibold text-blue-700 text-xs whitespace-nowrap">{row.fn}</td>
                      <td className="px-6 py-3 text-slate-700">{row.apis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}

        <div className="text-center text-xs text-slate-400 pt-4">
          © 2026 Taper Payer LLC · taperpayer.com · support@taperpayer.com
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
}