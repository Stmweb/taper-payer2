import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, Loader2, Download, Image, Smartphone, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const BRAND_CONTEXT = `
STRICT BRAND REQUIREMENTS — apply to every element:
- Company name: "Taper Payer" — always spelled exactly this way
- Logo wordmark: "Taper" in bold primary blue (#2479C2), "Payer" in bold green (#61AF39) — render as text wordmark prominently at the top
- Primary color: #2479C2 (Taper Blue) — use for headers, buttons, key UI elements
- Secondary color: #61AF39 (Taper Green) — use for success states, CTA buttons, accents
- Accent color: #F88F2B (Taper Orange) — use sparingly for highlights and badges
- Background: white (#FFFFFF) or very dark navy (#0F172A) — no other background colors
- Text: slate-900 (#0F172A) on light, white (#FFFFFF) on dark
- Style: clean, modern, premium fintech — no clutter, no cartoon style, no gradients other than blue-to-green
- Do NOT use red, purple, pink, yellow, or any off-brand colors
- Do NOT include real people's faces
`;

const FEATURE_GRAPHIC_PROMPT = `Create a stunning Google Play Store feature graphic for "Taper Payer" fintech app. Landscape banner exactly 1024×500px.
${BRAND_CONTEXT}
Layout: Dark navy (#0F172A) background with a subtle blue-to-green gradient overlay on the right side.
Left side: Large "Taper Payer" wordmark ("Taper" in #2479C2, "Payer" in #61AF39), bold headline "Send Money Home — Fast & Secure" in white, tagline "150+ Countries · Zero Hidden Fees · Same-Day Delivery" in light grey.
Right side: Stylized globe with money transfer lines connecting continents, colored in brand blue and green. Small mobile phone mockup showing the app UI.
Bottom strip: three feature icons with labels — ⚡ Instant · 🛡 Secure · 💲 Low Fees — in white on a semi-transparent dark strip.`;

const SCREENSHOT_PROMPTS = [
  {
    label: 'Home / Send Money',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer".
${BRAND_CONTEXT}
Screen: Home / Send Money. White background.
Top header: "Taper" (#2479C2) + "Payer" (#61AF39) wordmark logo centered, with a small globe icon.
Center card (rounded, shadow): "You Send" input showing $500 USD, "Send To" dropdown showing 🇭🇹 Haiti, exchange rate badge "1 USD = 132 HTG" in green.
Large blue (#2479C2) rounded "Continue →" button below.
Bottom tab bar: Home (active, blue), Rates, Top-Up, History icons.
Overlay text at very bottom outside phone: caption "Send Money in Seconds" in white on blue bar.`,
  },
  {
    label: 'Exchange Rates',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer".
${BRAND_CONTEXT}
Screen: Live Exchange Rates. White background.
Top header: "Taper" (#2479C2) + "Payer" (#61AF39) wordmark, page title "Exchange Rates" in slate-900.
List of rate cards (rounded, light shadow), each row: country flag + name on left, rate value in bold (#2479C2) on right — show NGN 1,620, HTG 132, GHS 15.4, KES 130, XOF 620.
A small green "LIVE" badge next to the title. Refresh icon top right in #61AF39.
Bottom tab bar consistent with brand.
Overlay caption at bottom: "Live Rates — Always Transparent".`,
  },
  {
    label: 'Mobile Top-Up',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer".
${BRAND_CONTEXT}
Screen: Taper Mobile Top-Up. White background.
Top header: "Taper" (#2479C2) + "Payer" (#61AF39) wordmark, page title "Taper Mobile" with 📱 icon.
Form card: phone number field showing "+509 • • • • • • • •" with 🇭🇹 flag, amount selector buttons $5 / $10 / $25 / $50 (active $10 highlighted in #2479C2), operator row showing "Natcom" and "Digicel" logos.
Large green (#61AF39) "Top-Up Now" button.
Bottom tab bar consistent with brand.
Overlay caption at bottom: "Instant Airtime — Any Carrier".`,
  },
  {
    label: 'Transaction Complete',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer".
${BRAND_CONTEXT}
Screen: Transfer Success. White background.
Center: Large animated checkmark circle in #61AF39. Bold heading "Transfer Complete! 🎉" in slate-900.
Summary card: "$200.00 USD sent", "26,400 HTG received", "Recipient: Marie Jean", "Via: MonCash · Est. arrival: Today" — all in clean rows with small icons.
Small confetti particles in brand colors (#2479C2, #61AF39, #F88F2B) floating around.
Blue (#2479C2) "Send Again" button at bottom.
Overlay caption at very bottom: "Same-Day Delivery — Guaranteed".`,
  },
];

function downloadImage(url, filename) {
  fetch(url)
    .then(r => r.blob())
    .then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    });
}

function AssetCard({ title, subtitle, badge, prompt, filename, aspect }) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('generateFlyer', { prompt });
      setImageUrl(res.data.url);
    } catch (e) {
      setError('Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Preview Area */}
      <div
        className="relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden"
        style={{ aspectRatio: aspect === 'feature' ? '1024/500' : '9/16', maxHeight: aspect === 'feature' ? 260 : 420 }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400 p-6 text-center">
            {aspect === 'feature' ? <Image className="w-10 h-10" /> : <Smartphone className="w-8 h-8" />}
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs">{subtitle}</p>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}
      </div>

      {/* Info + Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">{title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <Badge variant="outline" className="text-xs flex-shrink-0">{badge}</Badge>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={generate}
            disabled={loading}
            className="flex-1 gap-1.5 text-xs"
            style={{ backgroundColor: '#2479C2' }}
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : imageUrl ? <RefreshCw className="w-3.5 h-3.5" /> : <Wand2 className="w-3.5 h-3.5" />}
            {loading ? 'Generating…' : imageUrl ? 'Regenerate' : 'Generate with AI'}
          </Button>
          {imageUrl && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={() => downloadImage(imageUrl, filename)}
            >
              <Download className="w-3.5 h-3.5" /> Download
            </Button>
          )}
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    </Card>
  );
}

export default function AppStoreAssets() {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl p-5">
        <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-1">App Store & Google Play Assets</h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          Generate and download required assets for publishing on the App Store and Google Play. Click "Generate with AI" on each asset, then download as PNG.
        </p>
        <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Image className="w-3.5 h-3.5" /> Feature Graphic: 1024 × 500 px · PNG/JPEG · max 15 MB</span>
          <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Screenshots: 9:16 · PNG/JPEG · 320–3840 px each side · max 8 MB</span>
        </div>
      </div>

      {/* Feature Graphic */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Image className="w-5 h-5" style={{ color: '#2479C2' }} /> Feature Graphic
          <Badge className="ml-2 text-xs" style={{ backgroundColor: '#F88F2B' }}>Required · Google Play</Badge>
        </h3>
        <AssetCard
          title="Feature Graphic"
          subtitle="1024 × 500 px · Landscape · PNG/JPEG"
          badge="1024×500"
          prompt={FEATURE_GRAPHIC_PROMPT}
          filename="taper-payer-feature-graphic.png"
          aspect="feature"
        />
      </div>

      {/* Phone Screenshots */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <Smartphone className="w-5 h-5" style={{ color: '#61AF39' }} /> Phone Screenshots
          <Badge className="ml-2 text-xs" style={{ backgroundColor: '#61AF39' }}>2–8 Required</Badge>
        </h3>
        <p className="text-slate-500 text-sm mb-5">9:16 portrait · PNG/JPEG · max 8 MB each</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SCREENSHOT_PROMPTS.map((s, i) => (
            <AssetCard
              key={i}
              title={`Screenshot ${i + 1}`}
              subtitle={s.label}
              badge="9:16"
              prompt={s.prompt}
              filename={`taper-payer-screenshot-${i + 1}.png`}
              aspect="portrait"
            />
          ))}
        </div>
      </div>
    </div>
  );
}