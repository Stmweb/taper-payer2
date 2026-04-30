import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, ArrowLeft, Pencil, Check, X, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

const DEFAULT_SECTIONS = [
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
      { fn: 'processMoncashPayment', apis: 'MonCash' },
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
  const [editMode, setEditMode] = useState(false);
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [draft, setDraft] = useState(null);

  const enterEdit = () => {
    setDraft(JSON.parse(JSON.stringify(sections)));
    setEditMode(true);
  };

  const cancelEdit = () => {
    setDraft(null);
    setEditMode(false);
  };

  const saveEdit = () => {
    setSections(draft);
    setDraft(null);
    setEditMode(false);
  };

  const data = editMode ? draft : sections;

  // Draft helpers
  const updateSectionTitle = (si, val) => {
    const d = [...draft];
    d[si] = { ...d[si], title: val };
    setDraft(d);
  };

  const updateSectionColor = (si, val) => {
    const d = [...draft];
    d[si] = { ...d[si], color: val };
    setDraft(d);
  };

  const updateRow = (si, ri, field, val) => {
    const d = [...draft];
    d[si].rows[ri] = { ...d[si].rows[ri], [field]: val };
    setDraft(d);
  };

  const addRow = (si) => {
    const d = [...draft];
    d[si].rows = [...d[si].rows, { fn: 'newFunction', apis: 'API description' }];
    setDraft(d);
  };

  const deleteRow = (si, ri) => {
    const d = [...draft];
    d[si].rows = d[si].rows.filter((_, i) => i !== ri);
    setDraft(d);
  };

  const deleteSection = (si) => {
    setDraft(draft.filter((_, i) => i !== si));
  };

  const addSection = () => {
    setDraft([...draft, { title: '📦 New Section', color: '#475569', rows: [{ fn: 'newFunction', apis: 'API description' }] }]);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    const checkPage = (needed = 10) => {
      if (y + needed > pageHeight - 15) { doc.addPage(); y = 20; }
    };

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
      const [r, g, b] = hexToRgb(section.color);
      doc.setFillColor(r, g, b);
      doc.roundedRect(margin, y, contentWidth, 8, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(section.title, margin + 4, y + 5.5);
      y += 12;

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
        if (i % 2 === 0) { doc.setFillColor(249, 250, 251); doc.rect(margin, y, contentWidth, rowH, 'F'); }
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
          <div className="flex items-center gap-2">
            {!editMode ? (
              <>
                <Button onClick={enterEdit} variant="outline" className="gap-2 border-slate-300">
                  <Pencil className="w-4 h-4" /> Edit
                </Button>
                <Button onClick={handleDownloadPDF} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
              </>
            ) : (
              <>
                <Button onClick={cancelEdit} variant="outline" className="gap-2 border-red-300 text-red-600 hover:bg-red-50">
                  <X className="w-4 h-4" /> Cancel
                </Button>
                <Button onClick={saveEdit} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                  <Check className="w-4 h-4" /> Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {editMode && (
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-amber-700 text-sm">
            ✏️ Edit mode active — modify any section title, color, function names, or API descriptions below. Click <strong>Save Changes</strong> when done.
          </div>
        </div>
      )}

      {/* Content */}
      <div ref={contentRef} className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {data.map((section, si) => (
          <Card key={si} className="overflow-hidden shadow-sm">
            {/* Section header */}
            <div className="px-6 py-3 text-white font-bold text-base flex items-center justify-between" style={{ backgroundColor: section.color }}>
              {editMode ? (
                <div className="flex items-center gap-3 flex-1">
                  <Input
                    value={section.title}
                    onChange={(e) => updateSectionTitle(si, e.target.value)}
                    className="bg-white/20 border-white/40 text-white placeholder:text-white/60 h-8 text-sm font-bold flex-1"
                  />
                  <input
                    type="color"
                    value={section.color}
                    onChange={(e) => updateSectionColor(si, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-2 border-white/50"
                    title="Change section color"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteSection(si)}
                    className="text-white hover:bg-red-500/40 h-8 w-8 p-0"
                    title="Delete section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                section.title
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wide">
                    <th className="text-left px-6 py-2 w-48 font-semibold">Function</th>
                    <th className="text-left px-6 py-2 font-semibold">APIs / Integrations</th>
                    {editMode && <th className="w-16"></th>}
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-6 py-2 font-mono font-semibold text-blue-700 text-xs whitespace-nowrap">
                        {editMode ? (
                          <Input
                            value={row.fn}
                            onChange={(e) => updateRow(si, ri, 'fn', e.target.value)}
                            className="h-7 text-xs font-mono font-semibold text-blue-700 border-slate-300 px-2"
                          />
                        ) : row.fn}
                      </td>
                      <td className="px-6 py-2 text-slate-700">
                        {editMode ? (
                          <Input
                            value={row.apis}
                            onChange={(e) => updateRow(si, ri, 'apis', e.target.value)}
                            className="h-7 text-xs border-slate-300 px-2"
                          />
                        ) : row.apis}
                      </td>
                      {editMode && (
                        <td className="px-2 py-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteRow(si, ri)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 h-7 w-7 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {editMode && (
              <div className="px-6 py-3 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addRow(si)}
                  className="gap-1 text-xs text-slate-600 border-dashed border-slate-300 hover:bg-slate-50"
                >
                  <Plus className="w-3 h-3" /> Add Row
                </Button>
              </div>
            )}
          </Card>
        ))}

        {editMode && (
          <Button
            onClick={addSection}
            variant="outline"
            className="w-full gap-2 border-dashed border-slate-300 text-slate-500 hover:bg-slate-50 py-6"
          >
            <Plus className="w-4 h-4" /> Add New Section
          </Button>
        )}

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