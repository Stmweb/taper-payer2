import React, { useState } from 'react';
import { Download, Copy, Check, Image, FileText, Smartphone, Monitor, Instagram, Facebook, Twitter, Youtube, Linkedin, Wand2, Loader2, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import AIVideoGenerator from '@/components/marketing/AIVideoGenerator';

const BRAND = {
  blue: '#2479C2',
  green: '#61AF39',
  orange: '#F88F2B',
  logoLight: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png',
  logoDark: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/50986bd44_ChatGPTImageJan5202603_27_37PM.png',
};

const socialPlatforms = [
  {
    name: 'Instagram',
    icon: Instagram,
    color: '#E1306C',
    formats: [
      { label: 'Feed Post (Square)', size: '1080 × 1080 px', ratio: '1:1', use: 'Feed' },
      { label: 'Feed Post (Portrait)', size: '1080 × 1350 px', ratio: '4:5', use: 'Feed' },
      { label: 'Story / Reel', size: '1080 × 1920 px', ratio: '9:16', use: 'Story' },
      { label: 'Profile Picture', size: '320 × 320 px', ratio: '1:1', use: 'Profile' },
      { label: 'Carousel Card', size: '1080 × 1080 px', ratio: '1:1', use: 'Carousel' },
    ]
  },
  {
    name: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
    formats: [
      { label: 'Feed Post', size: '1200 × 630 px', ratio: '1.91:1', use: 'Feed' },
      { label: 'Cover Photo', size: '820 × 312 px', ratio: '2.63:1', use: 'Cover' },
      { label: 'Profile Picture', size: '170 × 170 px', ratio: '1:1', use: 'Profile' },
      { label: 'Story', size: '1080 × 1920 px', ratio: '9:16', use: 'Story' },
      { label: 'Event Banner', size: '1920 × 1080 px', ratio: '16:9', use: 'Event' },
      { label: 'Ad (Single Image)', size: '1200 × 628 px', ratio: '1.91:1', use: 'Ad' },
    ]
  },
  {
    name: 'X (Twitter)',
    icon: Twitter,
    color: '#000000',
    formats: [
      { label: 'Post Image', size: '1600 × 900 px', ratio: '16:9', use: 'Post' },
      { label: 'Header / Banner', size: '1500 × 500 px', ratio: '3:1', use: 'Banner' },
      { label: 'Profile Picture', size: '400 × 400 px', ratio: '1:1', use: 'Profile' },
      { label: 'Card (Summary Large)', size: '1200 × 628 px', ratio: '1.91:1', use: 'Card' },
    ]
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: '#0A66C2',
    formats: [
      { label: 'Feed Post / Shared Image', size: '1200 × 627 px', ratio: '1.91:1', use: 'Feed' },
      { label: 'Company Logo', size: '300 × 300 px', ratio: '1:1', use: 'Logo' },
      { label: 'Company Cover', size: '1128 × 191 px', ratio: '5.9:1', use: 'Cover' },
      { label: 'Personal Banner', size: '1584 × 396 px', ratio: '4:1', use: 'Banner' },
      { label: 'Story', size: '1080 × 1920 px', ratio: '9:16', use: 'Story' },
      { label: 'Sponsored Ad', size: '1200 × 627 px', ratio: '1.91:1', use: 'Ad' },
    ]
  },
  {
    name: 'YouTube',
    icon: Youtube,
    color: '#FF0000',
    formats: [
      { label: 'Thumbnail', size: '1280 × 720 px', ratio: '16:9', use: 'Thumbnail' },
      { label: 'Channel Art / Banner', size: '2560 × 1440 px', ratio: '16:9', use: 'Banner' },
      { label: 'Profile Picture', size: '800 × 800 px', ratio: '1:1', use: 'Profile' },
      { label: 'Community Post Image', size: '1080 × 1080 px', ratio: '1:1', use: 'Post' },
      { label: 'End Screen (Safe Zone)', size: '1920 × 1080 px', ratio: '16:9', use: 'End Screen' },
    ]
  },
];

const printFormats = [
  { label: 'Business Card', size: '3.5 × 2 in', px: '1050 × 600 px', category: 'Print' },
  { label: 'Flyer (Letter)', size: '8.5 × 11 in', px: '2550 × 3300 px', category: 'Print' },
  { label: 'Flyer (A4)', size: '210 × 297 mm', px: '2480 × 3508 px', category: 'Print' },
  { label: 'Postcard (4×6)', size: '4 × 6 in', px: '1200 × 1800 px', category: 'Print' },
  { label: 'Banner (6×2 ft)', size: '72 × 24 in', px: '2160 × 720 px', category: 'Print' },
  { label: 'Billboard', size: '14 × 48 ft', px: '4200 × 14400 px', category: 'Print' },
];

const digitalFormats = [
  { label: 'Email Header', size: '600 × 200 px', ratio: '3:1', category: 'Email' },
  { label: 'Email Banner (Full)', size: '600 × 400 px', ratio: '3:2', category: 'Email' },
  { label: 'Web Banner (Leaderboard)', size: '728 × 90 px', ratio: '8:1', category: 'Web Ad' },
  { label: 'Web Banner (Rectangle)', size: '300 × 250 px', ratio: '6:5', category: 'Web Ad' },
  { label: 'Web Banner (Skyscraper)', size: '160 × 600 px', ratio: '4:15', category: 'Web Ad' },
  { label: 'App Icon', size: '1024 × 1024 px', ratio: '1:1', category: 'App' },
  { label: 'App Splash Screen', size: '1242 × 2688 px', ratio: '9:19.5', category: 'App' },
  { label: 'Favicon', size: '32 × 32 px', ratio: '1:1', category: 'Web' },
];

const brandColors = [
  { name: 'Taper Blue', hex: '#2479C2', usage: 'Primary CTA, Links, Headers' },
  { name: 'Taper Green', hex: '#61AF39', usage: 'Success, Growth, CTA Secondary' },
  { name: 'Taper Orange', hex: '#F88F2B', usage: 'Accents, Highlights, Warnings' },
  { name: 'White', hex: '#FFFFFF', usage: 'Backgrounds, Text on Dark' },
  { name: 'Slate 900', hex: '#0F172A', usage: 'Body Text, Dark Backgrounds' },
  { name: 'Slate 600', hex: '#475569', usage: 'Secondary Text, Descriptions' },
];

const copyTemplates = [
  {
    platform: 'Instagram',
    type: 'Launch Post',
    copy: '🚀 Send money home — faster, safer, and cheaper. Taper Payer makes international transfers seamless. Download the app today! 💸\n\n#TaperPayer #MoneyTransfer #Remittance #SendMoney #Fintech'
  },
  {
    platform: 'Facebook',
    type: 'Promotional',
    copy: 'Sending money abroad has never been easier. With Taper Payer, your transfers arrive the same day — with no hidden fees and live exchange rates. Join thousands of satisfied customers today.\n\n👉 Sign up at taperpayer.com'
  },
  {
    platform: 'X (Twitter)',
    type: 'Brand Awareness',
    copy: 'Your family deserves the best. Send money home instantly with @TaperPayer — fast, secure, and always transparent. 💙💚 #TaperPayer #Remittance'
  },
  {
    platform: 'LinkedIn',
    type: 'Corporate',
    copy: 'At Taper Payer, we believe financial inclusion starts with accessibility. Our platform enables fast, secure international transfers to 9 countries — empowering families and communities worldwide.\n\nLearn more: taperpayer.com'
  },
  {
    platform: 'SMS / WhatsApp',
    type: 'Promotion',
    copy: 'Hi! Send money home today with Taper Payer — same-day delivery, low fees, live rates. Sign up free at taperpayer.com or call 1-800-TAPER-PAY 💙'
  },
  {
    platform: 'Email',
    type: 'Subject Line',
    copy: 'Send Money Home Today — Fast, Safe & Fee-Transparent | Taper Payer'
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors flex-shrink-0">
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

const allSizes = [
  { platform: 'Instagram', label: 'Feed Post (Square)', size: '1080 × 1080 px', ratio: '1:1' },
  { platform: 'Instagram', label: 'Feed Post (Portrait)', size: '1080 × 1350 px', ratio: '4:5' },
  { platform: 'Instagram', label: 'Story / Reel', size: '1080 × 1920 px', ratio: '9:16' },
  { platform: 'Facebook', label: 'Feed Post', size: '1200 × 630 px', ratio: '1.91:1' },
  { platform: 'Facebook', label: 'Cover Photo', size: '820 × 312 px', ratio: '2.63:1' },
  { platform: 'Facebook', label: 'Story', size: '1080 × 1920 px', ratio: '9:16' },
  { platform: 'X (Twitter)', label: 'Post Image', size: '1600 × 900 px', ratio: '16:9' },
  { platform: 'X (Twitter)', label: 'Header / Banner', size: '1500 × 500 px', ratio: '3:1' },
  { platform: 'LinkedIn', label: 'Feed Post', size: '1200 × 627 px', ratio: '1.91:1' },
  { platform: 'LinkedIn', label: 'Company Cover', size: '1128 × 191 px', ratio: '5.9:1' },
  { platform: 'YouTube', label: 'Thumbnail', size: '1280 × 720 px', ratio: '16:9' },
  { platform: 'YouTube', label: 'Channel Banner', size: '2560 × 1440 px', ratio: '16:9' },
];

const focusPages = [
  {
    id: 'home',
    label: 'Home Page',
    description: 'Money transfers, exchange rates, global remittance',
    context: 'international money transfers, same-day remittances, live exchange rates, send money to Africa, Caribbean, and Latin America',
  },
  {
    id: 'topup',
    label: 'Top-Up Page',
    description: 'Mobile airtime & data recharges worldwide',
    context: 'mobile top-up and airtime recharge service, instantly recharge any phone worldwide, Taper Mobile top-up, send airtime to family abroad',
  },
];

function FlyerGenerator() {
  const [platform, setPlatform] = useState('');
  const [sizeLabel, setSizeLabel] = useState('');
  const [focusPage, setFocusPage] = useState('home');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [caption, setCaption] = useState(null);
  const [captionLoading, setCaptionLoading] = useState(false);
  const [error, setError] = useState(null);

  const platforms = [...new Set(allSizes.map(s => s.platform))];
  const sizesForPlatform = allSizes.filter(s => s.platform === platform);
  const selectedSize = allSizes.find(s => s.platform === platform && s.label === sizeLabel);

  const handleGenerate = async () => {
    if (!platform || !sizeLabel || !prompt.trim()) return;
    setLoading(true);
    setError(null);
    setImageUrl(null);
    setCaption(null);

    const selectedFocus = focusPages.find(f => f.id === focusPage);
    const fullPrompt = `Create a professional marketing flyer for "Taper Payer", a modern fintech brand.
Page focus: ${selectedFocus?.label} — ${selectedFocus?.context}.
Format: ${platform} ${sizeLabel} (${selectedSize?.ratio} aspect ratio).
Brand colors: primary blue #2479C2, green #61AF39, orange #F88F2B, white background or dark navy.
Include the Taper Payer logo prominently (wordmark: "Taper" in blue and "Payer" in green, bold modern font).
Design brief: ${prompt.trim()}.
Style: clean, modern, professional fintech aesthetic. No low-quality or cluttered design.`;

    try {
      const response = await base44.functions.invoke('generateFlyer', { prompt: fullPrompt });
      setImageUrl(response.data.url);
      
      // Generate caption after image is created
      setCaptionLoading(true);
      const captionResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a compelling social media caption for a Taper Payer marketing flyer. The flyer is for ${platform} and has this brief: "${prompt.trim()}". 
Generate a catchy, professional caption that's 1-2 sentences, followed by relevant hashtags. Format: Caption text first, then hashtags on a new line. Use hashtags like #TaperPayer #MoneyTransfer #Remittance #FinTech #SendMoney etc.`,
      });
      setCaption(captionResponse);
    } catch (e) {
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
      setCaptionLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">1. Focus Page</label>
          <div className="flex flex-wrap gap-3">
            {focusPages.map(fp => (
              <button
                key={fp.id}
                onClick={() => setFocusPage(fp.id)}
                className={`px-4 py-3 rounded-xl text-sm font-medium border transition-colors text-left ${
                  focusPage === fp.id ? 'text-white border-transparent' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-orange-400'
                }`}
                style={focusPage === fp.id ? { backgroundColor: '#F88F2B' } : {}}
              >
                <div className="font-semibold">{fp.label}</div>
                <div className={`text-xs mt-0.5 ${focusPage === fp.id ? 'text-white/80' : 'text-slate-400'}`}>{fp.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">2. Select Platform</label>
          <div className="flex flex-wrap gap-2">
            {platforms.map(p => (
              <button
                key={p}
                onClick={() => { setPlatform(p); setSizeLabel(''); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  platform === p ? 'text-white border-transparent' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-400'
                }`}
                style={platform === p ? { backgroundColor: '#2479C2' } : {}}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {platform && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">2. Select Size</label>
            <div className="flex flex-wrap gap-2">
              {sizesForPlatform.map(s => (
                <button
                  key={s.label}
                  onClick={() => setSizeLabel(s.label)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    sizeLabel === s.label ? 'text-white border-transparent' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-green-400'
                  }`}
                  style={sizeLabel === s.label ? { backgroundColor: '#61AF39' } : {}}
                >
                  {s.label} <span className="opacity-70 text-xs">({s.ratio})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">3. Describe your flyer</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="E.g. Promote same-day money transfers to Nigeria and Ghana. Highlight zero hidden fees. Include a bold call-to-action: 'Send Now'."
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!platform || !sizeLabel || !prompt.trim() || loading}
          className="w-full py-5 text-base font-semibold gap-2"
          style={{ backgroundColor: '#2479C2' }}
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating Flyer...</> : <><Wand2 className="w-5 h-5" /> Generate Flyer with AI</>}
        </Button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </Card>

      {imageUrl && (
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Generated Flyer</h3>
              <p className="text-slate-500 text-sm">{platform} · {sizeLabel} · {selectedSize?.size}</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={async () => {
              const res = await fetch(imageUrl);
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'taper-payer-flyer.png';
              a.click();
              URL.revokeObjectURL(url);
            }}>
              <Download className="w-4 h-4" /> Download
            </Button>
          </div>
          <img src={imageUrl} alt="Generated Flyer" className="w-full rounded-xl shadow-lg" />
          
          {captionLoading ? (
            <div className="flex items-center justify-center py-4 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Generating caption with hashtags...
            </div>
          ) : caption ? (
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-slate-900 dark:text-white">Social Media Caption</h4>
                <CopyButton text={caption} />
              </div>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line text-sm leading-relaxed">{caption}</p>
            </div>
          ) : null}
        </Card>
      )}
    </div>
  );
}

export default function TaperPayerMarketing() {
  const [activeTab, setActiveTab] = useState('flyer');

  const tabs = [
    { id: 'flyer', label: 'AI Flyer Generator', icon: Wand2 },
    { id: 'video', label: 'AI Video Creator', icon: Video },
    { id: 'social', label: 'Social Media Sizes', icon: Smartphone },
    { id: 'digital', label: 'Digital & Ads', icon: Monitor },
    { id: 'print', label: 'Print Formats', icon: FileText },
    { id: 'brand', label: 'Brand Assets', icon: Image },
    { id: 'copy', label: 'Copy Templates', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div style={{ background: 'linear-gradient(to right, #2479C2, #61AF39)' }} className="py-14">
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Marketing Toolkit</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">Everything you need to promote Taper Payer across all channels.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-2 min-w-max">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  style={activeTab === tab.id ? { backgroundColor: '#2479C2' } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">

        {/* AI Flyer Generator */}
        {activeTab === 'flyer' && <FlyerGenerator />}

        {/* AI Video Creator */}
        {activeTab === 'video' && <AIVideoGenerator />}

        {/* Social Media Sizes */}
        {activeTab === 'social' && (
          <div className="space-y-10">
            {socialPlatforms.map(platform => {
              const Icon = platform.icon;
              return (
                <div key={platform.name}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: platform.color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{platform.name}</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {platform.formats.map(fmt => (
                      <Card key={fmt.label} className="p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{fmt.label}</h3>
                          <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">{fmt.use}</Badge>
                        </div>
                        <p className="text-2xl font-bold mt-1" style={{ color: platform.color }}>{fmt.size}</p>
                        <p className="text-slate-500 text-sm mt-1">Ratio: {fmt.ratio}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Digital & Ads */}
        {activeTab === 'digital' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Digital & Ad Formats</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {digitalFormats.map(fmt => (
                <Card key={fmt.label} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{fmt.label}</h3>
                    <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">{fmt.category}</Badge>
                  </div>
                  <p className="text-2xl font-bold mt-1" style={{ color: BRAND.blue }}>{fmt.size}</p>
                  {fmt.ratio && <p className="text-slate-500 text-sm mt-1">Ratio: {fmt.ratio}</p>}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Print Formats */}
        {activeTab === 'print' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Print Formats</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {printFormats.map(fmt => (
                <Card key={fmt.label} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{fmt.label}</h3>
                    <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">{fmt.category}</Badge>
                  </div>
                  <p className="text-2xl font-bold mt-1" style={{ color: BRAND.green }}>{fmt.size}</p>
                  <p className="text-slate-500 text-sm mt-1">At 300 DPI: {fmt.px}</p>
                </Card>
              ))}
            </div>
            <p className="mt-6 text-slate-500 text-sm">* Print sizes listed at 300 DPI (standard print quality). For billboards, 72 DPI is acceptable.</p>
          </div>
        )}

        {/* Brand Assets */}
        {activeTab === 'brand' && (
          <div className="space-y-10">
            {/* Logos */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Logo Variants</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-8 flex flex-col items-center justify-center bg-white">
                  <img src={BRAND.logoLight} alt="Logo Light" className="h-24 w-auto mb-4" />
                  <p className="text-slate-600 font-medium">Light Background</p>
                </Card>
                <Card className="p-8 flex flex-col items-center justify-center bg-slate-900">
                  <img src={BRAND.logoDark} alt="Logo Dark" className="h-24 w-auto mb-4" />
                  <p className="text-slate-300 font-medium">Dark Background</p>
                </Card>
              </div>
            </div>

            {/* Colors */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Brand Colors</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {brandColors.map(color => (
                  <Card key={color.name} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-20 w-full" style={{ backgroundColor: color.hex, border: color.hex === '#FFFFFF' ? '1px solid #e2e8f0' : 'none' }} />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{color.name}</h3>
                        <CopyButton text={color.hex} />
                      </div>
                      <p className="font-mono text-slate-500 text-sm">{color.hex}</p>
                      <p className="text-slate-400 text-xs mt-1">{color.usage}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Typography</h2>
              <Card className="p-8 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Primary Font</p>
                  <p className="text-4xl font-black text-slate-900 dark:text-white">Inter / System UI</p>
                  <p className="text-slate-500 text-sm mt-1">Black (900) for headings — use for hero titles and major CTAs.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Body Font</p>
                  <p className="text-xl font-semibold text-slate-800 dark:text-slate-200">SemiBold (600) for subheadings</p>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1">Regular (400) for body copy and descriptions.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Minimum Sizes</p>
                  <ul className="text-slate-600 dark:text-slate-300 space-y-1 text-sm">
                    <li>• Print: 8pt minimum body, 10pt recommended</li>
                    <li>• Digital: 14px minimum body, 16px recommended</li>
                    <li>• Mobile: 16px minimum to avoid zoom on iOS</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Copy Templates */}
        {activeTab === 'copy' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Copy Templates</h2>
            <div className="space-y-4">
              {copyTemplates.map((tmpl, i) => (
                <Card key={i} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge className="mr-2" style={{ backgroundColor: BRAND.blue }}>{tmpl.platform}</Badge>
                      <Badge variant="outline">{tmpl.type}</Badge>
                    </div>
                    <CopyButton text={tmpl.copy} />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">{tmpl.copy}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}