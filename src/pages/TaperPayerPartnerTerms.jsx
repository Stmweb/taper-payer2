import React from 'react';
import SiteFooter from '@/components/SiteFooter';

const sections = [
  {
    title: '1. Definitions',
    content: '"Partner" means the partner entity named in the Order Form. "Agreement" means this Partner Terms document together with the executed Order Form. "White Label Platform" means the fully branded Taper Payer technology platform, including web and mobile applications. "Services" means the operation and support of the White Label Platform. "Confidential Information" means any non-public information shared between parties related to this Agreement.'
  },
  {
    title: '2. Grant of License',
    content: 'Taper Payer INC grants Partner a non-exclusive, non-transferable license to operate the White Label Platform under Partner\'s own branding during the Term. Partner shall maintain full ownership of its branding and customer relationships. This license is conditioned upon Partner\'s compliance with all terms of this Agreement.'
  },
  {
    title: '3. Partner Obligations',
    content: 'Partner shall: (a) operate the White Label Platform in compliance with all applicable laws, regulations, and licensing requirements in Partner\'s jurisdiction; (b) implement and maintain robust KYC/AML procedures; (c) maintain comprehensive transaction monitoring and suspicious activity reporting; (d) obtain and maintain all required licenses and registrations to offer money transfer and related services; (e) maintain adequate capital reserves as required by law; (f) provide responsive customer support to end-users; (g) not misrepresent or sublicense the Platform without written consent; (h) implement industry-standard security measures and data protection protocols.'
  },
  {
    title: '4. Payment Terms',
    content: 'Partner shall pay the one-time White Label Platform fee of $25,000 USD according to the payment schedule specified in the Order Form. Monthly platform fees and transaction fees shall be due on the dates specified in the Order Form. All fees are exclusive of applicable taxes and VAT. Late payments may result in service suspension after 15 days written notice. Partner is responsible for all charges incurred on the White Label Platform, including transaction processing fees.'
  },
  {
    title: '5. Intellectual Property',
    content: 'Taper Payer INC retains all right, title, and interest in the White Label Platform technology, codebase, underlying systems, and any improvements or modifications. Partner retains ownership of its branding, logos, and customer data. Partner grants Taper Payer INC a limited license to use Partner\'s branding solely to identify Partner as a licensee of the Platform. Partner shall not reverse engineer, disassemble, or attempt to derive the source code or trade secrets of the Platform.'
  },
  {
    title: '6. Regulatory Compliance',
    content: 'Partner acknowledges sole responsibility for obtaining and maintaining all necessary licenses, registrations, and approvals to offer money transfer services in Partner\'s jurisdiction. Partner shall comply with all AML/CFT regulations, KYC requirements, sanctions screening, and transaction reporting obligations. Taper Payer INC may provide technical assistance and reporting tools, but Partner remains solely responsible for regulatory compliance. Partner shall promptly notify Taper Payer INC of any regulatory inquiries or enforcement actions.'
  },
  {
    title: '7. Confidentiality',
    content: 'Both parties shall maintain the confidentiality of Confidential Information received from the other party and use it solely for performing obligations under this Agreement. Confidential Information does not include information: (a) publicly available; (b) independently developed; (c) rightfully received from third parties; or (d) required to be disclosed by law. Confidentiality obligations survive for 3 years after Agreement termination.'
  },
  {
    title: '8. Data Protection and Privacy',
    content: 'Partner shall implement and maintain GDPR-compliant data protection practices. Partner shall not share customer personal data with Taper Payer INC except as necessary for Platform operations. Partner is the data controller; Taper Payer INC acts as a processor. Partner shall promptly notify users of security breaches and comply with all privacy laws in Partner\'s jurisdiction. Partner shall execute a Data Processing Agreement with Taper Payer INC upon request.'
  },
  {
    title: '9. Service Availability and Support',
    content: 'Taper Payer INC shall use commercially reasonable efforts to maintain 99% monthly Platform uptime (excluding scheduled maintenance). Taper Payer INC shall provide technical support during business hours (9 AM–5 PM EST, Monday–Friday). Major outages will be reported to Partner within 1 hour. Critical bugs affecting transaction processing will be addressed within 24 hours. Partner is responsible for support to end-users.'
  },
  {
    title: '10. Fees and Billing',
    content: 'All fees are in USD unless otherwise specified. Transaction fees are calculated at the rates specified in the Order Form and are due monthly in arrears. Monthly minimum platform fees shall apply as specified. Overages above the monthly minimum are billed at tiered rates. Invoices are due within 15 days of receipt. Disputed charges must be reported within 30 days. Taper Payer INC reserves the right to adjust fees upon 60 days written notice.'
  },
  {
    title: '11. Term and Termination',
    content: 'This Agreement commences on the date of signing and continues for an initial term as specified in the Order Form, renewing automatically unless either party provides 60 days written notice of non-renewal. Either party may terminate immediately if the other materially breaches this Agreement and fails to cure within 30 days of written notice. Taper Payer INC may terminate immediately if Partner violates laws, engages in prohibited activities, or threatens the integrity of the Platform. Upon termination, Partner\'s Platform access ceases immediately; Partner shall retrieve all customer data within 30 days.'
  },
  {
    title: '12. Prohibited Activities',
    content: 'Partner shall not: (a) use the Platform for money laundering, sanctions evasion, or terrorist financing; (b) facilitate transactions involving illegal goods or services; (c) engage in fraud or misrepresentation; (d) violate export control or sanctions laws; (e) compete with Taper Payer INC\'s core business without written consent; (f) disclose Platform technical details to third parties; (g) interfere with Platform security or systems; (h) exceed usage limits or engage in abusive practices. Violation of these terms may result in immediate termination.'
  },
  {
    title: '13. Limitation of Liability',
    content: 'NEITHER PARTY SHALL BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM THIS AGREEMENT, EVEN IF ADVISED OF THE POSSIBILITY. TAPER PAYER INC\'S TOTAL LIABILITY IS LIMITED TO THE GREATER OF: (A) FEES PAID IN THE 12 MONTHS PRECEDING THE CLAIM; OR (B) $10,000 USD. THIS LIMITATION DOES NOT APPLY TO: (I) INDEMNIFICATION OBLIGATIONS; (II) BREACH OF CONFIDENTIALITY; OR (III) VIOLATION OF IP RIGHTS. Partner assumes all risk of loss from end-user transactions and disputes.'
  },
  {
    title: '14. Indemnification',
    content: 'Partner shall indemnify, defend, and hold harmless Taper Payer INC from any claims, damages, and costs (including attorney fees) arising from: (a) Partner\'s violation of laws or regulations; (b) Partner\'s breach of this Agreement; (c) Partner\'s use of the Platform in violation of the terms; (d) claims by end-users or third parties related to Partner\'s services; (e) Partner\'s alleged infringement of IP rights; or (f) Partner\'s negligence or misconduct. Taper Payer INC shall indemnify Partner from claims that the unmodified Platform infringes third-party IP rights.'
  },
  {
    title: '15. Dispute Resolution',
    content: 'Disputes shall first be addressed through good-faith negotiations between senior executives of both parties within 30 days of notice. If unresolved, disputes shall be submitted to binding arbitration under UNCITRAL Rules, administered by the American Arbitration Association, seated in Wilmington, Delaware. The arbitration shall be conducted in English and decided by a single arbitrator. Each party bears its own attorney fees unless the arbitrator awards fees to the prevailing party. Class action waivers apply.'
  },
  {
    title: '16. Governing Law',
    content: 'This Agreement is governed by and construed in accordance with the laws of the State of Delaware, USA, without regard to conflict of law principles. The United Nations Convention on Contracts for the International Sale of Goods shall not apply. Both parties consent to the exclusive jurisdiction of arbitration as specified in Section 15.'
  },
  {
    title: '17. Entire Agreement',
    content: 'This Agreement, including the Order Form, constitutes the entire agreement between the parties regarding the subject matter and supersedes all prior negotiations, understandings, and agreements. No amendment, waiver, or modification is valid unless in writing and signed by both parties. If any provision is found invalid or unenforceable, the remaining provisions shall continue in full force.'
  },
  {
    title: '18. Notices',
    content: 'All notices must be in writing and delivered by email, certified mail, or courier to the addresses specified in the Order Form. Notices are effective upon receipt. Partner may not change its notice address without written consent.'
  },
  {
    title: '19. Relationship of Parties',
    content: 'Partner is an independent contractor and not an agent, employee, or representative of Taper Payer INC. Neither party has authority to bind the other, except as expressly granted herein. Partner may not represent itself as authorized to negotiate on behalf of Taper Payer INC without written consent.'
  },
  {
    title: '20. Survival',
    content: 'Sections covering Confidentiality, Data Protection, Intellectual Property, Indemnification, Limitation of Liability, Dispute Resolution, and Governing Law shall survive termination or expiration of this Agreement.'
  },
];

export default function TaperPayerPartnerTerms() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div style={{ background: 'linear-gradient(to right, #2479C2, #61AF39)' }} className="py-16">
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Partner Terms</h1>
          <p className="text-blue-100">Last updated: January 28, 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-4xl">
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