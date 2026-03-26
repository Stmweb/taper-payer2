import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, Loader2, Download, Image, Smartphone, RefreshCw, LayoutGrid } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const LOGO_URL = 'https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png';

const BRAND_CONTEXT = `
STRICT BRAND REQUIREMENTS — apply to every element:
- Company name: "Taper Payer" — always spelled exactly this way
- LOGO: Use the EXACT Taper Payer logo from this URL as reference: ${LOGO_URL} — reproduce it faithfully in the design, placed prominently (top-left or top-center). Do not alter the logo colors or proportions.
- Primary color: #2479C2 (Taper Blue) — use for headers, buttons, key UI elements
- Secondary color: #61AF39 (Taper Green) — use for success states, CTA buttons, accents
- Accent color: #F88F2B (Taper Orange) — use sparingly for highlights and badges
- Background: white (#FFFFFF) or very dark navy (#0F172A) — no other background colors
- Text: slate-900 (#0F172A) on light, white (#FFFFFF) on dark
- Style: clean, modern, premium fintech — no clutter, no cartoon style, no gradients other than blue-to-green
- Do NOT use red, purple, pink, yellow, or any off-brand colors
- Do NOT include real people's faces
`;

const APP_ICON_PROMPT = `Create a professional mobile app icon for "Taper Payer" fintech app. Perfectly square 1024×1024px.
${BRAND_CONTEXT}
Design: Clean, bold, modern app icon suitable for both iOS App Store and Google Play.
Background: Deep navy (#0F172A) or a strong blue-to-green diagonal gradient (#2479C2 → #61AF39) — one solid look, no noise.
Center symbol: A stylized bold letter "T" or a globe/arrow icon representing global money transfer, rendered in white or light color on the dark background. Alternatively, show "TP" as a monogram in white bold sans-serif.
No text other than possibly "TP" monogram — app icons should NOT spell out full names.
Corners: Rounded for iOS (the OS clips them automatically, but design with slight rounding).
Style: Premium fintech, minimal, bold — looks great at small sizes (60×60) and large sizes (1024×1024).
Do NOT add shadows, borders, or outer glows. Keep it flat or very subtly elevated.`;

const FEATURE_GRAPHIC_PROMPT = `Create a stunning Google Play Store feature graphic for "Taper Payer" fintech app. Landscape banner exactly 1024×500px.
${BRAND_CONTEXT}
Layout: Dark navy (#0F172A) background with a subtle blue-to-green gradient overlay on the right side.
Left side: Large "Taper Payer" wordmark ("Taper" in #2479C2, "Payer" in #61AF39), bold headline "Send Money Home — Fast & Secure" in white, tagline "150+ Countries · Zero Hidden Fees · Same-Day Delivery" in light grey.
Right side: Stylized globe with money transfer lines connecting continents, colored in brand blue and green. Small mobile phone mockup showing the app UI.
Bottom strip: three feature icons with labels — ⚡ Instant · 🛡 Secure · 💲 Low Fees — in white on a semi-transparent dark strip.`;

const SCREENSHOT_PROMPTS = [
  {
    label: '🇳🇬 Nigeria — Urgent Transfer',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer".
${BRAND_CONTEXT}
Screen: Sending money to Nigeria. White background. Urgency theme.
Top header: "Taper" (#2479C2) + "Payer" (#61AF39) wordmark. Urgent red-orange notification banner at top: "⚡ Limited-Time Rate — Expires in 00:14:32"
Center card: "You Send" $300 USD, "Recipient gets" 486,000 NGN in large bold green text, 🇳🇬 Nigerian flag, exchange rate "1 USD = 1,620 NGN — Best Rate Today".
Urgency badge in #F88F2B: "🔥 Rate valid for 15 min only!"
Large blue "Send to Nigeria Now →" button.
Caption bar at bottom: "Don't Miss Today's Best Naira Rate!"`,
  },
  {
    label: '🇭🇹 Haiti — Same Day',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer".
${BRAND_CONTEXT}
Screen: Sending money to Haiti. White background. Same-day urgency theme.
Top header: "Taper" (#2479C2) + "Payer" (#61AF39) wordmark. Green banner: "✅ Send Before 3PM — Arrives TODAY via MonCash"
Center card: "You Send" $200 USD, "Recipient gets" 26,400 HTG in large bold green, 🇭🇹 flag, "Via MonCash · Delivery: Today by 5PM".
Timer countdown badge: "⏰ 2h 14m left for same-day delivery" in #F88F2B.
Large blue "Send to Haiti Now →" button.
Caption bar at bottom: "Your Family Gets It TODAY — Send Now!"`,
  },
  {
    label: '🇬🇭 Ghana — Best Rate',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer".
${BRAND_CONTEXT}
Screen: Sending money to Ghana. White background. Best-rate urgency.
Top header: "Taper" (#2479C2) + "Payer" (#61AF39) wordmark. Blue banner: "📈 Rate Just Increased — Lock It In Now!"
Center card: "You Send" $250 USD, "Recipient gets" 3,850 GHS in large bold green, 🇬🇭 flag, exchange rate "1 USD = 15.40 GHS".
Star badge: "⭐ Best GHS Rate in 30 Days" in #61AF39. Small graph arrow trending up.
Large blue "Send to Ghana Now →" button.
Caption bar at bottom: "Best Ghana Rate Today — Act Fast!"`,
  },
  {
    label: '🇰🇪 Kenya — Instant M-Pesa',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer".
${BRAND_CONTEXT}
Screen: Sending money to Kenya. White background. Instant delivery urgency.
Top header: "Taper" (#2479C2) + "Payer" (#61AF39) wordmark. Green banner: "⚡ Instant M-Pesa Delivery — Seconds Not Hours"
Center card: "You Send" $150 USD, "Recipient gets" 19,500 KES in large bold green, 🇰🇪 flag, "Via M-Pesa · Delivered: Instantly".
Speed badge in #2479C2: "🚀 Average delivery: 8 seconds".
Large green (#61AF39) "Send to Kenya Instantly →" button.
Caption bar at bottom: "M-Pesa Money in Seconds — Send Now!"`,
  },
  {
    label: '🇸🇳 Senegal — Low Fees',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer".
${BRAND_CONTEXT}
Screen: Sending money to Senegal. White background. Low-fee urgency.
Top header: "Taper" (#2479C2) + "Payer" (#61AF39) wordmark. Orange banner: "💸 Zero Hidden Fees — What You See Is What They Get"
Center card: "You Send" $200 USD, "Recipient gets" 124,000 XOF in large bold green, 🇸🇳 flag, "Fee: $0.00 · Exchange: 1 USD = 620 XOF".
Savings badge in #61AF39: "You save $8 vs. competitors today".
Large blue "Send to Senegal Now →" button.
Caption bar at bottom: "Zero Fees to Senegal — Limited Offer!"`,
  },
  {
    label: '🇦🇴 Angola — Flash Deal',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer".
${BRAND_CONTEXT}
Screen: Sending money to Angola. White background. Flash deal urgency.
Top header: "Taper" (#2479C2) + "Payer" (#61AF39) wordmark. Orange flash banner: "🔥 FLASH DEAL — Extra 2% on AOA · Ends Tonight"
Center card: "You Send" $300 USD, "Recipient gets" 255,000 AOA in large bold green, 🇦🇴 flag, "Bonus rate applied! +2% extra today only".
Countdown: "Deal ends in 03:44:12" in red-orange bold.
Large blue "Claim Flash Rate →" button.
Caption bar at bottom: "Flash Deal — Extra Kwanza Ends Tonight!"`,
  },
  {
    label: '🇨🇲 Cameroon — No Fees',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer".
${BRAND_CONTEXT}
Screen: Sending money to Cameroon. White background. No-fee urgency.
Top header: "Taper" (#2479C2) + "Payer" (#61AF39) wordmark. Green banner: "🎁 FREE Transfer to Cameroon — Today Only!"
Center card: "You Send" $200 USD, "Recipient gets" 124,000 XAF in large bold green, 🇨🇲 flag, "Transfer Fee: FREE (normally $4.99)".
Promo badge in #F88F2B: "🎁 First transfer FREE — New users only".
Large green "Send Free to Cameroon →" button.
Caption bar at bottom: "Free Transfer to Cameroon — Today Only!"`,
  },
  {
    label: '🇲🇦 Morocco — Fast & Safe',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer".
${BRAND_CONTEXT}
Screen: Sending money to Morocco. White background. Trust + speed urgency.
Top header: "Taper" (#2479C2) + "Payer" (#61AF39) wordmark. Blue trust banner: "🛡 Bank-Grade Security · 50,000+ Transfers Completed"
Center card: "You Send" $400 USD, "Recipient gets" 4,000 MAD in large bold green, 🇲🇦 flag, "Delivered in under 1 hour · Fully encrypted".
Trust badge in #2479C2: "⭐⭐⭐⭐⭐ Rated #1 for Morocco transfers".
Large blue "Send to Morocco Securely →" button.
Caption bar at bottom: "Trusted by Thousands — Send to Morocco!"`,
  },
  {
    label: '🇩🇴 Dominican Republic — Party',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer".
${BRAND_CONTEXT}
Screen: Sending money to Dominican Republic. White background. Celebration urgency.
Top header: "Taper" (#2479C2) + "Payer" (#61AF39) wordmark. Festive orange-green banner: "🎉 Send for the Weekend — Arrives Before Friday!"
Center card: "You Send" $250 USD, "Recipient gets" 14,750 DOP in large bold green, 🇩🇴 flag, "Arrives: Friday by 6PM · Perfect for the weekend".
Urgency badge: "⏰ Order by 5PM today to guarantee Friday delivery" in #F88F2B.
Large blue "Send to DR Before Friday →" button.
Caption bar at bottom: "Weekend Money Ready — Send to DR Now!"`,
  },
  {
    label: '🇲🇽 Mexico — Instant SPEI',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer".
${BRAND_CONTEXT}
Screen: Sending money to Mexico. White background. Instant delivery urgency.
Top header: "Taper" (#2479C2) + "Payer" (#61AF39) wordmark. Green speed banner: "⚡ Instant SPEI Transfer · No Bank Visit Needed"
Center card: "You Send" $500 USD, "Recipient gets" 9,500 MXN in large bold green, 🇲🇽 flag, "Via SPEI · Delivered: Instantly to any Mexican bank".
Speed badge: "🚀 Faster than Western Union by 4 hours" in #2479C2.
Large blue "Send to Mexico Instantly →" button.
Caption bar at bottom: "Instant SPEI to Mexico — No Delays!"`,
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
      const res = await base44.functions.invoke('generateFlyer', { prompt, existing_image_urls: [LOGO_URL] });
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
        style={{ aspectRatio: aspect === 'feature' ? '1024/500' : aspect === 'icon' ? '1/1' : '9/16', maxHeight: aspect === 'feature' ? 260 : aspect === 'icon' ? 280 : 420 }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400 p-6 text-center">
            {aspect === 'feature' ? <Image className="w-10 h-10" /> : aspect === 'icon' ? <LayoutGrid className="w-10 h-10" /> : <Smartphone className="w-8 h-8" />}
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
          <span className="flex items-center gap-1"><LayoutGrid className="w-3.5 h-3.5" /> App Icon: 1024 × 1024 px · PNG · iOS & Android</span>
          <span className="flex items-center gap-1"><Image className="w-3.5 h-3.5" /> Feature Graphic: 1024 × 500 px · PNG/JPEG · max 15 MB</span>
          <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Screenshots: 9:16 · PNG/JPEG · 320–3840 px each side · max 8 MB</span>
        </div>
      </div>

      {/* App Icon */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <LayoutGrid className="w-5 h-5" style={{ color: '#F88F2B' }} /> App Icon
          <Badge className="ml-2 text-xs" style={{ backgroundColor: '#2479C2' }}>Required · iOS & Android</Badge>
        </h3>
        <div className="max-w-xs">
          <AssetCard
            title="App Icon"
            subtitle="1024 × 1024 px · Square · PNG"
            badge="1024×1024"
            prompt={APP_ICON_PROMPT}
            filename="taper-payer-app-icon.png"
            aspect="icon"
          />
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