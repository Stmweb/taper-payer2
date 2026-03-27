import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';

export default function OperatingAgreement() {
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const margin = 72;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const addText = (text, fontSize = 12, bold = false, align = 'left', color = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach(line => {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        const x = align === 'center' ? pageWidth / 2 : margin;
        doc.text(line, x, y, { align });
        y += fontSize * 1.4;
      });
    };

    const addSpace = (n = 12) => { y += n; };

    // Title
    addText('OPERATING AGREEMENT', 18, true, 'center');
    addText('TAPER PAYER LLC', 14, true, 'center');
    addSpace(6);
    addText('A Limited Liability Company', 11, false, 'center');
    addText('February 2026', 11, false, 'center');
    addSpace(20);

    // Divider
    doc.setDrawColor(180, 180, 180);
    doc.line(margin, y, pageWidth - margin, y);
    addSpace(20);

    addText('SECTION 1 — CORPORATE BYLAWS AND SHAREHOLDER AGREEMENT', 13, true);
    addSpace(6);
    addText('Article I – Name: The name of the corporation shall be Taper Payer INC., organized under the laws of the State of Delaware.', 11);
    addSpace(8);
    addText('Article II – Principal Office: The principal office shall be located at 254 Chapman Rd, Ste 208 #26415, Newark, Delaware 19702.', 11);
    addSpace(8);
    addText('Article III – Purpose: The corporation may engage in any lawful activity permitted under Delaware law.', 11);
    addSpace(8);
    addText('Article IV – Shareholders: Ownership of the corporation is divided among the shareholders according to their issued shares.', 11);
    addSpace(10);

    // Shareholder table
    const shareholderHeaders = ['Shareholder', 'Ownership %', 'Date of Birth', 'Country of Residence'];
    const shareholderRows = [
      ['Katy Lucas', '70%', '03/28/1985', 'United States'],
      ['Judith Valcin', '20%', '07/07/1963', 'United States'],
      ['David Jeanty', '10%', '08/13/1979', 'Haiti'],
    ];
    const shareholderColWidths = [140, 80, 100, 148];
    const shareholderTableX = margin;
    const rowHeight = 22;

    // Header row
    doc.setFillColor(55, 123, 183);
    doc.rect(shareholderTableX, y, contentWidth, rowHeight, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    let cxsh = shareholderTableX;
    shareholderHeaders.forEach((h, i) => {
      doc.text(h, cxsh + 8, y + 15);
      cxsh += shareholderColWidths[i];
    });
    y += rowHeight;

    // Data rows
    shareholderRows.forEach((row, ri) => {
      doc.setFillColor(ri % 2 === 0 ? 245 : 255, ri % 2 === 0 ? 247 : 255, ri % 2 === 0 ? 250 : 255);
      doc.rect(shareholderTableX, y, contentWidth, rowHeight, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      cxsh = shareholderTableX;
      row.forEach((cell, i) => {
        doc.text(cell, cxsh + 8, y + 15);
        cxsh += shareholderColWidths[i];
      });
      y += rowHeight;
    });

    addSpace(16);
    addText('Section 2 – Shareholder Agreement: This Shareholder Agreement governs the relationship between the shareholders of Taper Payer INC.', 11);
    addSpace(8);
    addText('Voting Rights: Voting power corresponds directly to each shareholder\'s ownership percentage.', 11);
    addSpace(8);
    addText('Transfer Restrictions: Shares may not be sold or transferred without approval from the majority of shareholders.', 11);
    addSpace(8);
    addText('Profit Distribution: Profits and dividends shall be distributed according to ownership percentages unless otherwise agreed in writing.', 11);
    addSpace(8);
    addText('Decision Making: Major corporate decisions require approval by shareholders representing more than 50% ownership.', 11);
    addSpace(16);

    addText('ARTICLE I — ORGANIZATION', 13, true);
    addSpace(6);
    addText('1.1 Formation. Taper Payer LLC (the "Company") is a limited liability company organized pursuant to the laws of the State of Delaware, formed for the purposes set forth herein.', 11);
    addSpace(8);
    addText('1.2 Principal Office. The principal place of business of the Company shall be at such place as the Members may determine from time to time.', 11);
    addSpace(8);
    addText('1.3 Term. The Company shall commence upon the filing of its Articles of Organization with the Secretary of State and shall continue until dissolved in accordance with this Agreement.', 11);
    addSpace(16);

    addText('ARTICLE II — MEMBERS', 13, true);
    addSpace(6);
    addText('2.1 Members. The initial Members of the Company, their titles, and roles are as follows:', 11);
    addSpace(10);

    // Members table
    const tableHeaders = ['Member Name', 'Title', 'Role'];
    const tableRows = [
      ['Katy Lucas', 'Chief Executive Officer (CEO)', 'Managing Member'],
      ['Judith Valcin', 'Chief Operating Officer (COO)', 'Managing Member'],
      ['David Jeanty', 'Treasurer', 'Managing Member'],
    ];
    const colWidths = [160, 200, 160];
    const tableX = margin;

    // Header row
    doc.setFillColor(55, 123, 183);
    doc.rect(tableX, y, contentWidth, rowHeight, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    let cx = tableX;
    tableHeaders.forEach((h, i) => {
      doc.text(h, cx + 8, y + 15);
      cx += colWidths[i];
    });
    y += rowHeight;

    // Data rows
    tableRows.forEach((row, ri) => {
      doc.setFillColor(ri % 2 === 0 ? 245 : 255, ri % 2 === 0 ? 247 : 255, ri % 2 === 0 ? 250 : 255);
      doc.rect(tableX, y, contentWidth, rowHeight, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      cx = tableX;
      row.forEach((cell, i) => {
        doc.text(cell, cx + 8, y + 15);
        cx += colWidths[i];
      });
      y += rowHeight;
    });

    addSpace(16);

    addText('ARTICLE III — MANAGEMENT', 13, true);
    addSpace(6);
    addText('3.1 Management by Members. The Company shall be managed by its Members. Each Managing Member shall have the authority to act on behalf of the Company in the ordinary course of business, subject to the limitations set forth herein.', 11);
    addSpace(8);
    addText('3.2 CEO Authority. Katy Lucas, as Chief Executive Officer, shall have overall authority for the strategic direction and general management of the Company, including the authority to execute contracts, open bank accounts, and bind the Company in transactions up to amounts approved by the Members.', 11);
    addSpace(8);
    addText('3.3 COO Authority. Judith Valcin, as Chief Operating Officer, shall oversee the day-to-day operations of the Company, including managing personnel, vendor relationships, and operational processes.', 11);
    addSpace(8);
    addText('3.4 Treasurer Authority. David Jeanty, as Treasurer, shall be responsible for the financial management of the Company, including maintaining books and records, managing accounts, preparing financial reports, and overseeing compliance with financial regulations.', 11);
    addSpace(16);

    addText('ARTICLE IV — CAPITAL CONTRIBUTIONS', 13, true);
    addSpace(6);
    addText('4.1 Initial Contributions. Each Member shall make an initial capital contribution to the Company as agreed upon by the Members. The amount and nature of contributions shall be recorded in the Company\'s books and records.', 11);
    addSpace(8);
    addText('4.2 Additional Contributions. No Member shall be required to make any additional capital contributions to the Company without their prior written consent.', 11);
    addSpace(16);

    addText('ARTICLE V — ALLOCATIONS AND DISTRIBUTIONS', 13, true);
    addSpace(6);
    addText('5.1 Profits and Losses. The net profits and net losses of the Company shall be allocated among the Members in proportion to their respective membership interests, unless otherwise unanimously agreed upon in writing.', 11);
    addSpace(8);
    addText('5.2 Distributions. Distributions of cash or other assets of the Company shall be made to the Members at such times and in such amounts as determined by a majority vote of the Members, subject to applicable law.', 11);
    addSpace(16);

    addText('ARTICLE VI — MEETINGS AND VOTING', 13, true);
    addSpace(6);
    addText('6.1 Meetings. Meetings of the Members may be held at any time and place as determined by the Members, either in person or by telephone, video conference, or other electronic means.', 11);
    addSpace(8);
    addText('6.2 Voting. Except as otherwise required by applicable law or this Agreement, all decisions of the Company shall be made by a majority vote of the Members based on their membership interests.', 11);
    addSpace(8);
    addText('6.3 Unanimous Consent Required. The following actions shall require the unanimous written consent of all Members: (a) amendment of this Agreement; (b) merger, consolidation, or dissolution of the Company; (c) admission of new members; (d) any transaction not in the ordinary course of business exceeding a material threshold as agreed by the Members.', 11);
    addSpace(16);

    addText('ARTICLE VII — TRANSFER OF MEMBERSHIP INTERESTS', 13, true);
    addSpace(6);
    addText('7.1 Restrictions on Transfer. No Member may sell, assign, transfer, pledge, or otherwise dispose of all or any part of their membership interest without the prior written consent of all other Members.', 11);
    addSpace(8);
    addText('7.2 Right of First Refusal. In the event a Member desires to transfer their interest, the remaining Members shall have a right of first refusal to purchase such interest on the same terms and conditions offered by any third party.', 11);
    addSpace(16);

    addText('ARTICLE VIII — DISSOLUTION', 13, true);
    addSpace(6);
    addText('8.1 Dissolution Events. The Company shall be dissolved upon: (a) the unanimous written consent of all Members; (b) the entry of a decree of judicial dissolution; or (c) any other event requiring dissolution under applicable law.', 11);
    addSpace(8);
    addText('8.2 Winding Up. Upon dissolution, the affairs of the Company shall be wound up, its liabilities satisfied, and remaining assets distributed to the Members in proportion to their membership interests.', 11);
    addSpace(16);

    // Organizational Chart Section
    doc.addPage();
    y = margin;
    addText('ORGANIZATIONAL CHART — OWNERSHIP & CONTROL STRUCTURE', 13, true);
    addSpace(4);
    addText('Date: March 27, 2026', 11);
    addSpace(8);
    addText('The following chart illustrates the full ownership and control structure of Taper Payer LLC, including all individuals who ultimately own or control the company, together with their respective roles and ownership percentages.', 11);
    addSpace(20);

    // Top box — Company
    const boxW = 300;
    const boxH = 50;
    const centerX = pageWidth / 2;
    const topBoxX = centerX - boxW / 2;
    doc.setFillColor(55, 123, 183);
    doc.roundedRect(topBoxX, y, boxW, boxH, 6, 6, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('TAPER PAYER LLC', centerX, y + 16, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('A Delaware Limited Liability Company', centerX, y + 28, { align: 'center' });
    doc.text('254 Chapman Rd, Ste 208 #26415, Newark, DE 19702', centerX, y + 40, { align: 'center' });
    y += boxH;

    // Vertical line down from company box
    doc.setDrawColor(150, 150, 150);
    doc.line(centerX, y, centerX, y + 20);
    y += 20;

    // Horizontal line
    const lineStartX = margin + 60;
    const lineEndX = pageWidth - margin - 60;
    doc.line(lineStartX, y, lineEndX, y);

    // Three member columns
    const memberBoxW = 140;
    const memberBoxH = 75;
    const positions = [lineStartX + 10, centerX - memberBoxW / 2, lineEndX - memberBoxW - 10];
    const members = [
      { name: 'Katy Lucas', title: 'CEO / Managing Member', pct: '70% Ownership', dob: 'DOB: 03/28/1985', country: 'United States' },
      { name: 'Judith Valcin', title: 'COO / Managing Member', pct: '20% Ownership', dob: 'DOB: 07/07/1963', country: 'United States' },
      { name: 'David Jeanty', title: 'Treasurer / Mgmt Member', pct: '10% Ownership', dob: 'DOB: 08/13/1979', country: 'Haiti' },
    ];

    positions.forEach((px, idx) => {
      const midX = px + memberBoxW / 2;
      doc.setDrawColor(150, 150, 150);
      doc.line(midX, y, midX, y + 15);
      doc.setFillColor(50, 65, 85);
      doc.roundedRect(px, y + 15, memberBoxW, memberBoxH, 5, 5, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(members[idx].name, midX, y + 28, { align: 'center' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(members[idx].title, midX, y + 40, { align: 'center' });
      doc.setTextColor(255, 220, 80);
      doc.setFont('helvetica', 'bold');
      doc.text(members[idx].pct, midX, y + 52, { align: 'center' });
      doc.setTextColor(180, 210, 255);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(members[idx].dob, midX, y + 62, { align: 'center' });
      doc.text(members[idx].country, midX, y + 71, { align: 'center' });
    });

    y += 15 + memberBoxH + 20;

    // Notes box
    doc.setFillColor(245, 247, 250);
    doc.setDrawColor(200, 200, 200);
    const notesBoxH = 70;
    doc.roundedRect(margin, y, contentWidth, notesBoxH, 5, 5, 'FD');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const notes = [
      '• No parent entities: Taper Payer LLC has no parent company or holding entity.',
      '• No subsidiaries: Taper Payer LLC does not currently own or control any subsidiary entities.',
      '• Ultimate Beneficial Owners: Katy Lucas (70%), Judith Valcin (20%), David Jeanty (10%).',
      '• Control: Decisions require majority vote (>50%). Katy Lucas holds controlling interest.',
    ];
    notes.forEach((note, i) => {
      doc.text(note, margin + 8, y + 14 + i * 14);
    });
    y += notesBoxH + 24;

    addText('ARTICLE IX — MISCELLANEOUS', 13, true);
    addSpace(6);
    addText('9.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware.', 11);
    addSpace(8);
    addText('9.2 Entire Agreement. This Agreement constitutes the entire agreement among the Members with respect to the subject matter hereof and supersedes all prior agreements and understandings.', 11);
    addSpace(8);
    addText('9.3 Amendments. This Agreement may be amended only by a written instrument signed by all Members.', 11);
    addSpace(8);
    addText('9.4 Severability. If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.', 11);
    addSpace(30);

    // Signature block
    doc.setDrawColor(180, 180, 180);
    doc.line(margin, y, pageWidth - margin, y);
    addSpace(20);

    addText('IN WITNESS WHEREOF, the Members have executed this Operating Agreement as of February 2026.', 11, false, 'center');
    addSpace(30);

    const sigY = y;
    const col1 = margin;
    const col2 = margin + (contentWidth / 3);
    const col3 = margin + (2 * contentWidth / 3);
    const lineLen = contentWidth / 3 - 20;

    // Signature lines
    doc.setDrawColor(0, 0, 0);
    doc.line(col1, sigY, col1 + lineLen, sigY);
    doc.line(col2, sigY, col2 + lineLen, sigY);
    doc.line(col3, sigY, col3 + lineLen, sigY);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Katy Lucas', col1, sigY + 14);
    doc.text('Judith Valcin', col2, sigY + 14);
    doc.text('David Jeanty', col3, sigY + 14);

    doc.setFont('helvetica', 'normal');
    doc.text('CEO', col1, sigY + 27);
    doc.text('COO', col2, sigY + 27);
    doc.text('Treasurer', col3, sigY + 27);

    doc.text('Date: _______________', col1, sigY + 42);
    doc.text('Date: _______________', col2, sigY + 42);
    doc.text('Date: _______________', col3, sigY + 42);

    doc.save('TaperPayer_Operating_Agreement_Feb2026.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Download Button */}
        <div className="flex justify-end mb-6">
          <Button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white">
            <FileDown className="w-4 h-4" />
            Download as PDF
          </Button>
        </div>

        {/* Letter of Authorization */}
        <div className="bg-white shadow-lg rounded-2xl p-12 text-slate-800 font-serif leading-relaxed mb-8">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold tracking-wide uppercase mb-6">TAPER PAYER INC.</h1>
            <p className="text-sm text-slate-600">254 Chapman Rd, Ste 208 #26415</p>
            <p className="text-sm text-slate-600">Newark, Delaware 19702</p>
          </div>

          <p className="text-sm font-bold text-slate-900 mb-8">Subject: Letter of Authorization to Open Business Account</p>

          <p className="text-sm text-slate-700 mb-4">To Whom It May Concern,</p>

          <p className="text-sm text-slate-700 mb-4">
            I, Katy Lucas, acting in my capacity as Founder, majority shareholder, and Authorized Representative of Taper Payer Inc., hereby confirm that I am fully authorized to open and manage a business account with Kraken on behalf of the company.
          </p>

          <p className="text-sm text-slate-700 mb-4">
            This request is submitted as part of our efforts to establish secure, compliant, and efficient financial infrastructure to support our digital payment and cross-border service operations.
          </p>

          <p className="text-sm text-slate-700 mb-4">
            As Founder and majority owner, I possess full authority to act on behalf of the company in all matters related to the account opening process. This includes, but is not limited to, the submission of required documentation, execution of agreements, and communication with Kraken.
          </p>

          <p className="text-sm text-slate-700 mb-4">
            This authorization is effective immediately and shall remain in full force until revoked or amended in writing.
          </p>

          <p className="text-sm text-slate-700 mb-8">
            Should you require any additional information or verification, please feel free to contact me directly.
          </p>

          <p className="text-sm text-slate-700 mb-6">Sincerely,</p>

          <div className="mt-4">
            <p className="text-sm font-bold text-slate-900">Katy Lucas</p>
            <p className="text-sm text-slate-600">Founder &amp; Authorized Representative</p>
            <p className="text-sm text-slate-600">Taper Payer Inc.</p>
            <p className="text-sm text-slate-600 mt-3">Email: support@taperpayer.com</p>
            <p className="text-sm text-slate-600">Phone: (404) 994-9648</p>
          </div>
        </div>

        {/* Document */}
        <div className="bg-white shadow-lg rounded-2xl p-12 text-slate-800 font-serif leading-relaxed">
          {/* Header */}
          <div className="text-center mb-10 border-b pb-8">
            <h1 className="text-3xl font-bold tracking-wide uppercase mb-2">Operating Agreement</h1>
            <h2 className="text-xl font-semibold mb-1">Taper Payer LLC</h2>
            <p className="text-slate-500 text-sm">A Limited Liability Company</p>
            <p className="text-slate-500 text-sm mt-1">February 2026</p>
          </div>

          {/* Corporate Bylaws & Shareholder Agreement */}
          <Section title="Section 1 — Corporate Bylaws and Shareholder Agreement">
            <P><B>Article I – Name:</B> The name of the corporation shall be Taper Payer INC., organized under the laws of the State of Delaware.</P>
            <P><B>Article II – Principal Office:</B> The principal office shall be located at 254 Chapman Rd, Ste 208 #26415, Newark, Delaware 19702.</P>
            <P><B>Article III – Purpose:</B> The corporation may engage in any lawful activity permitted under Delaware law.</P>
            <P><B>Article IV – Shareholders:</B> Ownership of the corporation is divided among the shareholders according to their issued shares.</P>
            <div className="overflow-x-auto my-4 mb-6">
              <table className="w-full border border-slate-200 text-sm rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="px-4 py-3 text-left">Shareholder</th>
                    <th className="px-4 py-3 text-left">Ownership Percentage</th>
                    <th className="px-4 py-3 text-left">Date of Birth</th>
                    <th className="px-4 py-3 text-left">Country of Residence</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Katy Lucas', '70%', '03/28/1985', 'United States'],
                    ['Judith Valcin', '20%', '07/07/1963', 'United States'],
                    ['David Jeanty', '10%', '08/13/1979', 'Haiti'],
                  ].map(([name, pct, dob, country], i) => (
                    <tr key={name} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="px-4 py-3 font-semibold">{name}</td>
                      <td className="px-4 py-3">{pct}</td>
                      <td className="px-4 py-3">{dob}</td>
                      <td className="px-4 py-3">{country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <P><B>Section 2 – Shareholder Agreement:</B> This Shareholder Agreement governs the relationship between the shareholders of Taper Payer INC.</P>
            <P><B>Voting Rights:</B> Voting power corresponds directly to each shareholder's ownership percentage.</P>
            <P><B>Transfer Restrictions:</B> Shares may not be sold or transferred without approval from the majority of shareholders.</P>
            <P><B>Profit Distribution:</B> Profits and dividends shall be distributed according to ownership percentages unless otherwise agreed in writing.</P>
            <P><B>Decision Making:</B> Major corporate decisions require approval by shareholders representing more than 50% ownership.</P>
          </Section>

          {/* Article I */}
          <Section title="Article I — Organization">
            <P><B>1.1 Formation.</B> Taper Payer LLC (the "Company") is a limited liability company organized pursuant to the laws of the State of Delaware, formed for the purposes set forth herein.</P>
            <P><B>1.2 Principal Office.</B> The principal place of business of the Company shall be at such place as the Members may determine from time to time.</P>
            <P><B>1.3 Term.</B> The Company shall commence upon the filing of its Articles of Organization with the Secretary of State and shall continue until dissolved in accordance with this Agreement.</P>
          </Section>

          {/* Article II — Members */}
          <Section title="Article II — Members">
            <P><B>2.1 Members.</B> The initial Members of the Company, their titles, and roles are as follows:</P>
            <div className="overflow-x-auto mt-4 mb-4">
              <table className="w-full border border-slate-200 text-sm rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="px-4 py-3 text-left">Member Name</th>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Katy Lucas', 'Chief Executive Officer (CEO)', 'Managing Member'],
                    ['Judith Valcin', 'Chief Operating Officer (COO)', 'Managing Member'],
                    ['David Jeanty', 'Treasurer', 'Managing Member'],
                  ].map(([name, title, role], i) => (
                    <tr key={name} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="px-4 py-3 font-semibold">{name}</td>
                      <td className="px-4 py-3">{title}</td>
                      <td className="px-4 py-3">{role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Article III */}
          <Section title="Article III — Management">
            <P><B>3.1 Management by Members.</B> The Company shall be managed by its Members. Each Managing Member shall have the authority to act on behalf of the Company in the ordinary course of business, subject to the limitations set forth herein.</P>
            <P><B>3.2 CEO Authority.</B> Katy Lucas, as Chief Executive Officer, shall have overall authority for the strategic direction and general management of the Company, including the authority to execute contracts, open bank accounts, and bind the Company in transactions up to amounts approved by the Members.</P>
            <P><B>3.3 COO Authority.</B> Judith Valcin, as Chief Operating Officer, shall oversee the day-to-day operations of the Company, including managing personnel, vendor relationships, and operational processes.</P>
            <P><B>3.4 Treasurer Authority.</B> David Jeanty, as Treasurer, shall be responsible for the financial management of the Company, including maintaining books and records, managing accounts, preparing financial reports, and overseeing compliance with financial regulations.</P>
          </Section>

          {/* Article IV */}
          <Section title="Article IV — Capital Contributions">
            <P><B>4.1 Initial Contributions.</B> Each Member shall make an initial capital contribution to the Company as agreed upon by the Members. The amount and nature of contributions shall be recorded in the Company's books and records.</P>
            <P><B>4.2 Additional Contributions.</B> No Member shall be required to make any additional capital contributions to the Company without their prior written consent.</P>
          </Section>

          {/* Article V */}
          <Section title="Article V — Allocations and Distributions">
            <P><B>5.1 Profits and Losses.</B> The net profits and net losses of the Company shall be allocated among the Members in proportion to their respective membership interests, unless otherwise unanimously agreed upon in writing.</P>
            <P><B>5.2 Distributions.</B> Distributions of cash or other assets of the Company shall be made to the Members at such times and in such amounts as determined by a majority vote of the Members, subject to applicable law.</P>
          </Section>

          {/* Article VI */}
          <Section title="Article VI — Meetings and Voting">
            <P><B>6.1 Meetings.</B> Meetings of the Members may be held at any time and place as determined by the Members, either in person or by telephone, video conference, or other electronic means.</P>
            <P><B>6.2 Voting.</B> Except as otherwise required by applicable law or this Agreement, all decisions of the Company shall be made by a majority vote of the Members based on their membership interests.</P>
            <P><B>6.3 Unanimous Consent Required.</B> The following actions shall require the unanimous written consent of all Members: (a) amendment of this Agreement; (b) merger, consolidation, or dissolution of the Company; (c) admission of new members; (d) any transaction not in the ordinary course of business exceeding a material threshold as agreed by the Members.</P>
          </Section>

          {/* Article VII */}
          <Section title="Article VII — Transfer of Membership Interests">
            <P><B>7.1 Restrictions on Transfer.</B> No Member may sell, assign, transfer, pledge, or otherwise dispose of all or any part of their membership interest without the prior written consent of all other Members.</P>
            <P><B>7.2 Right of First Refusal.</B> In the event a Member desires to transfer their interest, the remaining Members shall have a right of first refusal to purchase such interest on the same terms and conditions offered by any third party.</P>
          </Section>

          {/* Article VIII */}
          <Section title="Article VIII — Dissolution">
            <P><B>8.1 Dissolution Events.</B> The Company shall be dissolved upon: (a) the unanimous written consent of all Members; (b) the entry of a decree of judicial dissolution; or (c) any other event requiring dissolution under applicable law.</P>
            <P><B>8.2 Winding Up.</B> Upon dissolution, the affairs of the Company shall be wound up, its liabilities satisfied, and remaining assets distributed to the Members in proportion to their membership interests.</P>
          </Section>

          {/* Article IX */}
          <Section title="Article IX — Miscellaneous">
            <P><B>9.1 Governing Law.</B> This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware.</P>
            <P><B>9.2 Entire Agreement.</B> This Agreement constitutes the entire agreement among the Members with respect to the subject matter hereof and supersedes all prior agreements and understandings.</P>
            <P><B>9.3 Amendments.</B> This Agreement may be amended only by a written instrument signed by all Members.</P>
            <P><B>9.4 Severability.</B> If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.</P>
          </Section>

          {/* Organizational Chart */}
          <Section title="Organizational Chart — Ownership & Control Structure">
            <P>Date: March 27, 2026</P>
            <P>The following chart illustrates the full ownership and control structure of Taper Payer LLC, including all individuals who ultimately own or control the company, together with their respective roles and ownership percentages.</P>
            <div className="mt-6 flex flex-col items-center gap-0 text-sm font-sans">
              {/* Top Entity */}
              <div className="bg-blue-700 text-white rounded-xl px-8 py-4 text-center shadow-md w-72">
                <p className="font-bold text-base">TAPER PAYER LLC</p>
                <p className="text-xs text-blue-100 mt-1">A Delaware Limited Liability Company</p>
                <p className="text-xs text-blue-100">254 Chapman Rd, Ste 208 #26415, Newark, DE 19702</p>
              </div>

              {/* Connector */}
              <div className="w-px h-8 bg-slate-400"></div>
              <div className="w-64 h-px bg-slate-400"></div>
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-px h-6 bg-slate-400"></div>
                  <div className="bg-slate-800 text-white rounded-xl px-5 py-3 text-center shadow w-52">
                   <p className="font-bold">Katy Lucas</p>
                   <p className="text-xs text-slate-300 mt-1">CEO / Managing Member</p>
                   <p className="text-xs font-semibold text-yellow-300 mt-1">70% Ownership</p>
                   <p className="text-xs text-slate-400 mt-1">DOB: 03/28/1985</p>
                   <p className="text-xs text-slate-400">United States</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-px h-6 bg-slate-400"></div>
                  <div className="bg-slate-700 text-white rounded-xl px-5 py-3 text-center shadow w-52">
                    <p className="font-bold">Judith Valcin</p>
                    <p className="text-xs text-slate-300 mt-1">COO / Managing Member</p>
                    <p className="text-xs font-semibold text-yellow-300 mt-1">20% Ownership</p>
                    <p className="text-xs text-slate-400 mt-1">DOB: 07/07/1963</p>
                    <p className="text-xs text-slate-400">United States</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-px h-6 bg-slate-400"></div>
                  <div className="bg-slate-600 text-white rounded-xl px-5 py-3 text-center shadow w-52">
                    <p className="font-bold">David Jeanty</p>
                    <p className="text-xs text-slate-300 mt-1">COO / Managing Member</p>
                    <p className="text-xs font-semibold text-yellow-300 mt-1">10% Ownership</p>
                    <p className="text-xs text-slate-400 mt-1">DOB: 08/13/1979</p>
                    <p className="text-xs text-slate-400">Haiti</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-8 w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1">
                <p>• <strong>No parent entities:</strong> Taper Payer LLC has no parent company or holding entity.</p>
                <p>• <strong>No subsidiaries:</strong> Taper Payer LLC does not currently own or control any subsidiary entities.</p>
                <p>• <strong>Ultimate Beneficial Owners:</strong> Katy Lucas (70%), Judith Valcin (20%), and David Jeanty (10%) are the sole and ultimate beneficial owners of the company.</p>
                <p>• <strong>Control:</strong> Decisions require majority vote (&gt;50%). Katy Lucas, as 70% owner, holds controlling interest.</p>
              </div>
            </div>
          </Section>

          {/* Signature Block */}
          <div className="mt-12 border-t pt-10">
            <p className="text-center text-sm text-slate-600 mb-10">
              IN WITNESS WHEREOF, the Members have executed this Operating Agreement as of <strong>February 2026</strong>.
            </p>
            <div className="grid grid-cols-3 gap-6 text-sm">
              {[
                { name: 'Katy Lucas', title: 'CEO' },
                { name: 'Judith Valcin', title: 'COO' },
                { name: 'David Jeanty', title: 'Treasurer' },
              ].map(({ name, title }) => (
                <div key={name} className="flex flex-col gap-2">
                  <p className="font-bold">{name}</p>
                  <p className="text-slate-500">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold uppercase tracking-wide text-slate-900 mb-4 border-b pb-2">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function P({ children }) {
  return <p className="text-sm text-slate-700 leading-7">{children}</p>;
}

function B({ children }) {
  return <span className="font-semibold text-slate-900">{children}</span>;
}