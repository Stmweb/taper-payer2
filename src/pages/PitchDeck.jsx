import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Globe, Zap, DollarSign, Users, TrendingUp, Shield, Target, Rocket } from 'lucide-react';

const slides = [
  {
    id: 'cover',
    component: CoverSlide,
  },
  {
    id: 'problem',
    component: ProblemSlide,
  },
  {
    id: 'solution',
    component: SolutionSlide,
  },
  {
    id: 'product',
    component: ProductSlide,
  },
  {
    id: 'market',
    component: MarketSlide,
  },
  {
    id: 'business-model',
    component: BusinessModelSlide,
  },
  {
    id: 'traction',
    component: TractionSlide,
  },
  {
    id: 'technology',
    component: TechnologySlide,
  },
  {
    id: 'team',
    component: TeamSlide,
  },
  {
    id: 'ask',
    component: AskSlide,
  },
];

function CoverSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 bg-gradient-to-br from-[#1a2f5e] to-[#3D7BB7]">
      <img
        src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/9971a8b23_TaperPayerLogoTransparent.png"
        alt="Taper Payer"
        className="h-44 w-auto mb-4 object-contain"
      />
      <p className="text-xl md:text-2xl text-blue-100 font-light mb-2">Global Money Transfer, Reinvented</p>
      <p className="text-blue-200 text-base md:text-lg max-w-xl mt-4">
        Fast, affordable, and transparent remittances powered by blockchain rails — connecting diaspora communities with their families worldwide.
      </p>
      <div className="mt-10 flex gap-4 flex-wrap justify-center">
        <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white text-sm font-semibold">🌍 10+ Countries</div>
        <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white text-sm font-semibold">⚡ Instant Transfers</div>
        <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white text-sm font-semibold">💰 Low Fees</div>
      </div>
    </div>
  );
}

function ProblemSlide() {
  const problems = [
    { icon: '💸', title: 'High Fees', desc: 'Traditional remittance services charge 5–10% per transfer, costing families billions annually.' },
    { icon: '🐢', title: 'Slow Transfers', desc: 'Bank wires take 3–5 business days. Families in need can\'t wait that long.' },
    { icon: '🏦', title: 'Limited Access', desc: 'Over 1.4 billion adults are unbanked globally, cut off from the financial system.' },
    { icon: '🌐', title: 'No Transparency', desc: 'Hidden exchange rate markups mean senders never know the true cost until it\'s too late.' },
  ];
  return (
    <div className="flex flex-col h-full px-8 py-10 bg-slate-50">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-red-500">The Problem</span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-1">Sending Money Home Is Broken</h2>
        <p className="text-slate-500 mt-2">$860B is sent in remittances annually — yet the system is expensive, slow, and exclusionary.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {problems.map((p, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-3">{p.icon}</div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">{p.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SolutionSlide() {
  return (
    <div className="flex flex-col h-full px-8 py-10 bg-gradient-to-br from-[#1a2f5e] to-[#2a4a8a]">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-300">The Solution</span>
        <h2 className="text-3xl md:text-4xl font-black text-white mt-1">Taper Payer</h2>
        <p className="text-blue-200 mt-2">A next-generation remittance platform built on blockchain rails with a consumer-friendly experience.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1">
        {[
          { icon: <Zap className="w-6 h-6" />, title: 'Instant Settlement', desc: 'USDC on Solana enables near-instant cross-border payments with finality in seconds.' },
          { icon: <DollarSign className="w-6 h-6" />, title: 'Ultra-Low Fees', desc: 'Blockchain rails eliminate intermediaries. Transfers from as low as 1% — vs industry avg of 6.4%.' },
          { icon: <Globe className="w-6 h-6" />, title: 'Global Reach', desc: 'Send to Haiti, Nigeria, Ghana, Kenya, Senegal, Mexico and more — direct to mobile wallets or bank accounts.' },
        ].map((item, i) => (
          <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-6 text-white">
            <div className="w-12 h-12 rounded-xl bg-blue-500/30 flex items-center justify-center mb-4 text-blue-200">
              {item.icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-blue-200 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductSlide() {
  const features = [
    '💳 Card payments via Stripe & Square',
    '🏦 ACH bank transfers via Plaid / Cybrid',
    '📱 Mobile top-ups (airtime reloads) for 10+ countries',
    '🪙 USD → USDC conversion via Solana rails',
    '🔗 Payment request links (send a link, get paid)',
    '✅ KYC / Identity verification (Cybrid + Persona)',
    '📲 Native mobile app experience (iOS & Android)',
    '🔔 SMS & WhatsApp transaction notifications',
  ];
  return (
    <div className="flex flex-col h-full px-8 py-10 bg-white">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Product</span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-1">Everything in One App</h2>
        <p className="text-slate-500 mt-2">Taper Payer combines money transfer, mobile top-up, and payment requests in a single seamless platform.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <span className="text-base">{f.split(' ')[0]}</span>
            <span className="text-slate-700 text-sm font-medium">{f.split(' ').slice(1).join(' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketSlide() {
  const stats = [
    { label: 'Global Remittance Market', value: '$860B', sub: 'annual flows (World Bank 2023)', color: 'bg-blue-600' },
    { label: 'Haiti Corridor (US→HT)', value: '$4.1B', sub: 'sent annually, 23% of GDP', color: 'bg-indigo-600' },
    { label: 'African Diaspora (US)', value: '$50B+', sub: 'annual remittances to Africa', color: 'bg-purple-600' },
    { label: 'Serviceable Market', value: '$12B', sub: 'US-based diaspora corridors', color: 'bg-cyan-600' },
  ];
  return (
    <div className="flex flex-col h-full px-8 py-10 bg-slate-900">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Market Opportunity</span>
        <h2 className="text-3xl md:text-4xl font-black text-white mt-1">A Massive, Underserved Market</h2>
        <p className="text-slate-400 mt-2">Remittances to developing nations are growing 5% YoY, outpacing foreign direct investment.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 items-center">
        {stats.map((s, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 text-center">
            <div className={`${s.color} text-white text-2xl md:text-3xl font-black rounded-xl py-2 px-3 mb-3`}>{s.value}</div>
            <p className="text-white font-semibold text-sm">{s.label}</p>
            <p className="text-slate-400 text-xs mt-1">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BusinessModelSlide() {
  const streams = [
    { icon: '💱', title: 'FX Spread', desc: 'Margin on currency exchange rates (primary revenue)', pct: '~60%' },
    { icon: '📶', title: 'Mobile Top-Up', desc: 'Commission on airtime reloads via DTone, Reloadly, Ding', pct: '~20%' },
    { icon: '🏦', title: 'Transfer Fees', desc: 'Flat fee per transaction for ACH and card-funded transfers', pct: '~15%' },
    { icon: '🤝', title: 'B2B / White Label', desc: 'API access and white-label platform licensing', pct: '~5%' },
  ];
  return (
    <div className="flex flex-col h-full px-8 py-10 bg-white">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-green-600">Business Model</span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-1">Multiple Revenue Streams</h2>
        <p className="text-slate-500 mt-2">Diversified income from FX margins, fees, top-up commissions, and enterprise licensing.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {streams.map((s, i) => (
          <div key={i} className="border border-slate-200 rounded-2xl p-6 bg-slate-50">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{s.icon}</span>
              <span className="text-green-600 font-black text-xl">{s.pct}</span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">{s.title}</h3>
            <p className="text-slate-500 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TractionSlide() {
  return (
    <div className="flex flex-col h-full px-8 py-10 bg-gradient-to-br from-green-900 to-emerald-800">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-green-300">Traction</span>
        <h2 className="text-3xl md:text-4xl font-black text-white mt-1">Early Momentum</h2>
        <p className="text-green-200 mt-2">Live product with real users and active integrations across multiple payment rails.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {[
          { label: 'Payment Integrations', value: '6+', sub: 'Square, Stripe, Moncash, Cybrid, DTone, Reloadly' },
          { label: 'Countries Supported', value: '10+', sub: 'Haiti, Nigeria, Ghana, Kenya, Senegal & more' },
          { label: 'Platform Status', value: 'Live', sub: 'iOS/Android ready, KYC integrated, ACH enabled' },
        ].map((s, i) => (
          <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center text-white">
            <div className="text-4xl font-black mb-1">{s.value}</div>
            <div className="font-semibold mb-1">{s.label}</div>
            <div className="text-green-200 text-xs">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
        <p className="text-white font-semibold mb-2">✅ Key Milestones Achieved</p>
        <ul className="text-green-200 text-sm space-y-1">
          <li>• Full KYC/AML pipeline via Cybrid + Persona — live</li>
          <li>• ACH funding + USDC/Solana remittance flow — built and tested</li>
          <li>• Mobile top-up to Haiti, Nigeria, Ghana — operational</li>
          <li>• B2B white-label and marketing pages — launched</li>
        </ul>
      </div>
    </div>
  );
}

function TechnologySlide() {
  const stack = [
    { layer: 'Frontend', tech: 'React PWA / iOS / Android', color: 'bg-blue-100 text-blue-800' },
    { layer: 'Payments', tech: 'Stripe · Square · Moncash', color: 'bg-purple-100 text-purple-800' },
    { layer: 'Banking Rails', tech: 'Cybrid · Plaid · ACH', color: 'bg-indigo-100 text-indigo-800' },
    { layer: 'Blockchain', tech: 'USDC on Solana (via Cybrid)', color: 'bg-cyan-100 text-cyan-800' },
    { layer: 'Top-Up', tech: 'DTone · Reloadly · Ding · PrepayNation', color: 'bg-green-100 text-green-800' },
    { layer: 'Compliance', tech: 'KYC via Persona · AML screening', color: 'bg-orange-100 text-orange-800' },
    { layer: 'Comms', tech: 'Twilio SMS & WhatsApp · Mailgun', color: 'bg-rose-100 text-rose-800' },
    { layer: 'Infrastructure', tech: 'Base44 · Deno edge functions · Supabase', color: 'bg-slate-100 text-slate-800' },
  ];
  return (
    <div className="flex flex-col h-full px-8 py-10 bg-white">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Technology</span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-1">Built for Scale</h2>
        <p className="text-slate-500 mt-2">Enterprise-grade integrations across every layer of the fintech stack.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
        {stack.map((s, i) => (
          <div key={i} className="flex items-center gap-3 border border-slate-100 rounded-xl px-4 py-3 bg-slate-50">
            <span className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 ${s.color}`}>{s.layer}</span>
            <span className="text-slate-700 text-sm">{s.tech}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamSlide() {
  return (
    <div className="flex flex-col h-full px-8 py-10 bg-slate-900">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Team</span>
        <h2 className="text-3xl md:text-4xl font-black text-white mt-1">Built by the Community, For the Community</h2>
        <p className="text-slate-400 mt-2">Founders with deep roots in the diaspora and firsthand experience with the broken remittance system.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 items-start">
        {[
          { initials: 'SG', name: 'Stanley Gilles', role: 'Founder & CEO', desc: 'Haitian-American entrepreneur. Deep expertise in fintech and diaspora financial services.' },
          { initials: 'TBD', name: 'CTO', role: 'Chief Technology Officer', desc: 'Senior engineering role — open. Strong candidate pipeline from fintech and blockchain backgrounds.' },
          { initials: 'TBD', name: 'Compliance Officer', role: 'BSA/AML Officer', desc: 'Regulatory and compliance expertise for MSB licensing, AML programs, and KYC operations.' },
        ].map((m, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg mb-4">
              {m.initials}
            </div>
            <h3 className="text-white font-bold text-lg">{m.name}</h3>
            <p className="text-blue-400 text-sm font-semibold mb-2">{m.role}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AskSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-10 bg-gradient-to-br from-[#1a2f5e] to-[#3D7BB7] text-center">
      <Rocket className="w-16 h-16 text-blue-200 mb-6" />
      <span className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-3">The Ask</span>
      <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Raising $500K</h2>
      <p className="text-blue-100 text-lg max-w-xl mb-8">Seed round to accelerate growth, obtain MSB licenses in key states, expand corridors, and hire core team members.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
        {[
          { pct: '40%', label: 'Licensing & Compliance', sub: 'MSB licenses, legal, AML' },
          { pct: '35%', label: 'Engineering & Product', sub: 'CTO hire, mobile, scale' },
          { pct: '25%', label: 'Sales & Marketing', sub: 'Diaspora community growth' },
        ].map((u, i) => (
          <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-4 text-white">
            <div className="text-3xl font-black mb-1">{u.pct}</div>
            <div className="font-semibold text-sm">{u.label}</div>
            <div className="text-blue-200 text-xs mt-1">{u.sub}</div>
          </div>
        ))}
      </div>
      <a
        href="mailto:Info@taperpayer.com"
        className="bg-white text-[#1a2f5e] font-bold px-8 py-3 rounded-xl text-base hover:bg-blue-50 transition-colors"
      >
        Contact Us → Info@taperpayer.com
      </a>
    </div>
  );
}

export default function PitchDeck() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(slides.length - 1, c + 1));

  const SlideComponent = slides[current].component;

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col items-center justify-center p-4">
      {/* Slide container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
        <div className="w-full h-full">
          <SlideComponent />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-6">
        <button
          onClick={prev}
          disabled={current === 0}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/30'}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={current === slides.length - 1}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <p className="text-white/40 text-xs mt-3">{current + 1} / {slides.length}</p>
    </div>
  );
}