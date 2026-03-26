import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, Loader2, Download, Image, Smartphone, RefreshCw, LayoutGrid, Tablet } from 'lucide-react';
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

const APP_ICON_PROMPT = `Create a professional mobile app icon for "Taper Payer" fintech app. Perfectly square 512×512px.
${BRAND_CONTEXT}
CRITICAL DESIGN INSTRUCTION: The reference image provided shows the Taper Payer logo which features TWO GREEN DOLLAR BILLS fanned out. Reproduce those exact two dollar bills as the dominant centerpiece of this icon — faithfully copied from the reference image, same angle, same fanned layout, same green color.
Background: Deep navy (#0F172A) or a strong blue-to-green diagonal gradient (#2479C2 → #61AF39).
Center: The two fanned dollar bills from the logo, large and prominent, filling most of the icon space.
Optionally add a subtle globe or arrow element behind the bills to hint at global transfer.
No full company name text — keep it iconic and bold.
Corners: Slightly rounded for iOS.
Style: Premium fintech, clean, minimal. Looks great at all sizes.
Do NOT add shadows, borders, or outer glows.`;

const FEATURE_GRAPHIC_PROMPT = `Create a stunning Google Play Store feature graphic for "Taper Payer" fintech app. Landscape banner exactly 1024×500px.
${BRAND_CONTEXT}
Layout: Clean WHITE (#FFFFFF) background.
Left side: The exact Taper Payer logo from the reference image (do NOT also add a "Taper Payer" text wordmark — the logo is sufficient), bold headline "Send Money Home — Fast & Secure" in slate-900 (#0F172A), tagline "Zero Hidden Fees · Same-Day Delivery" in slate-600 (#475569).
Right side: A stylized globe centered on Africa and the Americas, with glowing money transfer route lines connecting origin points to destination cities in Nigeria, Ghana, Kenya, Senegal, Angola, Cameroon, Morocco, Dominican Republic, Haiti, and Mexico. The globe and lines are rendered in brand blue (#2479C2) and green (#61AF39) on a white background.
Bottom strip: three feature icons with labels — ⚡ Instant · 🛡 Secure · 💲 Low Fees — in white text on a #2479C2 blue strip.`;

const SCREENSHOT_PROMPTS = [
  {
    label: '🇳🇬 Nigeria — Urgent Transfer',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer". All text must be fully visible and contained within the phone screen — no text clipped or cut off at edges. Use compact font sizes that fit comfortably.
${BRAND_CONTEXT}
Screen: Sending money to Nigeria. White background. Urgency theme.
Top header: Taper Payer logo. Compact notification banner: "⚡ Limited-Time Rate — Expires 00:14:32"
Center card: "You Send" $300 USD · "Recipient gets" 486,000 NGN in bold green · exchange rate "1 USD = 1,620 NGN"
Badge: "🔥 Rate valid 15 min only!" in #F88F2B
Large blue "Send to Nigeria Now" button.
Footer label: "Don't Miss Today's Best Naira Rate"`,
  },
  {
    label: '🇭🇹 Haiti — Same Day',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer". All text must be fully visible and contained within the phone screen — no text clipped or cut off at edges. Use compact font sizes that fit comfortably.
${BRAND_CONTEXT}
Screen: Sending money to Haiti. White background. Same-day urgency theme.
Top header: Taper Payer logo. Compact green banner: "✅ Send Before 3PM — Arrives TODAY via MonCash"
Center card: "You Send" $200 USD · "Recipient gets" 26,400 HTG in bold green · "Via MonCash · Today by 5PM"
Badge: "⏰ 2h 14m left for same-day delivery" in #F88F2B
Large blue "Send to Haiti Now" button.
Footer label: "Your Family Gets It TODAY"`,
  },
  {
    label: '🇬🇭 Ghana — Best Rate',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer". All text must be fully visible and contained within the phone screen — no text clipped or cut off at edges. Use compact font sizes that fit comfortably.
${BRAND_CONTEXT}
Screen: Sending money to Ghana. White background. Best-rate urgency.
Top header: Taper Payer logo. Compact blue banner: "📈 Rate Just Increased — Lock It In!"
Center card: "You Send" $250 USD · "Recipient gets" 3,850 GHS in bold green · "1 USD = 15.40 GHS"
Badge: "⭐ Best GHS Rate in 30 Days" in #61AF39
Large blue "Send to Ghana Now" button.
Footer label: "Best Ghana Rate Today — Act Fast"`,
  },
  {
    label: '🇰🇪 Kenya — Instant M-Pesa',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer". All text must be fully visible and contained within the phone screen — no text clipped or cut off at edges. Use compact font sizes that fit comfortably.
${BRAND_CONTEXT}
Screen: Sending money to Kenya. White background. Instant delivery urgency.
Top header: Taper Payer logo. Compact green banner: "⚡ Instant M-Pesa — Seconds Not Hours"
Center card: "You Send" $150 USD · "Recipient gets" 19,500 KES in bold green · "Via M-Pesa · Instant"
Badge: "🚀 Avg delivery: 8 seconds" in #2479C2
Large green "Send to Kenya Instantly" button.
Footer label: "M-Pesa in Seconds — Send Now"`,
  },
  {
    label: '🇸🇳 Senegal — Low Fees',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer". All text must be fully visible and contained within the phone screen — no text clipped or cut off at edges. Use compact font sizes that fit comfortably.
${BRAND_CONTEXT}
Screen: Sending money to Senegal. White background. Low-fee urgency.
Top header: Taper Payer logo. Compact orange banner: "💸 Zero Hidden Fees"
Center card: "You Send" $200 USD · "Recipient gets" 124,000 XOF in bold green · "Fee: $0.00 · 1 USD = 620 XOF"
Badge: "You save $8 vs. competitors" in #61AF39
Large blue "Send to Senegal Now" button.
Footer label: "Zero Fees to Senegal — Limited Offer"`,
  },
  {
    label: '🇦🇴 Angola — Flash Deal',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer". All text must be fully visible and contained within the phone screen — no text clipped or cut off at edges. Use compact font sizes that fit comfortably.
${BRAND_CONTEXT}
Screen: Sending money to Angola. White background. Flash deal urgency.
Top header: Taper Payer logo. Compact orange banner: "🔥 FLASH DEAL — Extra 2% on AOA"
Center card: "You Send" $300 USD · "Recipient gets" 255,000 AOA in bold green · "Bonus rate: +2% today"
Countdown: "Ends in 03:44:12" in red-orange bold
Large blue "Claim Flash Rate" button.
Footer label: "Flash Deal — Extra Kwanza Ends Tonight"`,
  },
  {
    label: '🇨🇲 Cameroon — No Fees',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer". All text must be fully visible and contained within the phone screen — no text clipped or cut off at edges. Use compact font sizes that fit comfortably.
${BRAND_CONTEXT}
Screen: Sending money to Cameroon. White background. No-fee urgency.
Top header: Taper Payer logo. Compact green banner: "🎁 FREE Transfer to Cameroon — Today Only"
Center card: "You Send" $200 USD · "Recipient gets" 124,000 XAF in bold green · "Fee: FREE (normally $4.99)"
Badge: "First transfer FREE — New users" in #F88F2B
Large green "Send Free to Cameroon" button.
Footer label: "Free Transfer — Today Only"`,
  },
  {
    label: '🇲🇦 Morocco — Fast & Safe',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer". All text must be fully visible and contained within the phone screen — no text clipped or cut off at edges. Use compact font sizes that fit comfortably.
${BRAND_CONTEXT}
Screen: Sending money to Morocco. White background. Trust + speed urgency.
Top header: Taper Payer logo. Compact blue banner: "🛡 Bank-Grade Security · 50,000+ Transfers"
Center card: "You Send" $400 USD · "Recipient gets" 4,000 MAD in bold green · "Under 1 hour · Encrypted"
Badge: "⭐⭐⭐⭐⭐ Rated #1 for Morocco" in #2479C2
Large blue "Send to Morocco Securely" button.
Footer label: "Trusted by Thousands"`,
  },
  {
    label: '🇩🇴 Dominican Republic — Party',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer". All text must be fully visible and contained within the phone screen — no text clipped or cut off at edges. Use compact font sizes that fit comfortably.
${BRAND_CONTEXT}
Screen: Sending money to Dominican Republic. White background. Celebration urgency.
Top header: Taper Payer logo. Compact festive banner: "🎉 Arrives Before Friday!"
Center card: "You Send" $250 USD · "Recipient gets" 14,750 DOP in bold green · "Friday by 6PM"
Badge: "⏰ Order by 5PM for Friday delivery" in #F88F2B
Large blue "Send to DR Now" button.
Footer label: "Weekend Money Ready — Send Now"`,
  },
  {
    label: '🇲🇽 Mexico — Instant SPEI',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer". All text must be fully visible and contained within the phone screen — no text clipped or cut off at edges. Use compact font sizes that fit comfortably.
${BRAND_CONTEXT}
Screen: Sending money to Mexico. White background. Instant delivery urgency.
Top header: Taper Payer logo. Compact green banner: "⚡ Instant SPEI Transfer"
Center card: "You Send" $500 USD · "Recipient gets" 9,500 MXN in bold green · "Via SPEI · Instant to any Mexican bank"
Badge: "🚀 Faster than Western Union by 4h" in #2479C2
Large blue "Send to Mexico Instantly" button.
Footer label: "Instant SPEI — No Delays"`,
  },
  {
    label: '🌍 All Countries — Global Coverage',
    prompt: `Create a phone app screenshot in 9:16 portrait for "Taper Payer". All text must be fully visible and contained within the phone screen — no text clipped or cut off at edges. Use compact font sizes that fit comfortably.
${BRAND_CONTEXT}
Screen: Global coverage showcase. White background.
Top header: Taper Payer logo. Compact blue banner: "🌍 Send Money Worldwide"
Main content: A large, beautifully rendered stylized globe centered on the Atlantic, showing Africa and the Americas. Glowing money transfer route lines connect origin cities in the USA to destination cities in Nigeria, Ghana, Kenya, Haiti, Senegal, Angola, Cameroon, Morocco, Dominican Republic, and Mexico. The globe and route lines are rendered in brand blue (#2479C2) and green (#61AF39) on a white background. Small pulsing destination dots at each country.
Below globe: A compact single row of 5 destination flags: 🇳🇬 🇬🇭 🇰🇪 🇭🇹 🇸🇳 with "+5 more" label.
Sticky bottom CTA: Large green "Choose Your Destination" button.
Footer label: "One App — Endless Connections"`,
  },
];

const TABLET_7_PROMPTS = [
  {
    label: '🇳🇬 Nigeria — Send Money',
    prompt: `Create a 7-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text must be fully visible and contained within the screen — no clipping. Use larger font sizes suited for a tablet display.
${BRAND_CONTEXT}
Screen: Sending money to Nigeria. White background.
Left panel: Taper Payer logo top-left. Transfer form — "You Send" $300 USD · "Recipient gets" 486,000 NGN in bold green · "1 USD = 1,620 NGN". Large blue "Send to Nigeria Now" button.
Right panel: Map/globe graphic showing USA → Nigeria transfer route in brand blue and green.
Badge: "🔥 Best Naira Rate Today" in #F88F2B.`,
  },
  {
    label: '🇭🇹 Haiti — MonCash',
    prompt: `Create a 7-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text fully visible, no clipping. Tablet-appropriate font sizes.
${BRAND_CONTEXT}
Screen: Sending money to Haiti via MonCash. White background.
Left panel: Taper Payer logo top-left. Transfer card — "You Send" $200 USD · "Recipient gets" 26,400 HTG in bold green · "Via MonCash · Today by 5PM". Large blue "Send to Haiti Now" button.
Right panel: MonCash delivery visual with countdown "⏰ 2h 14m left for same-day delivery" in #F88F2B.`,
  },
  {
    label: '🇬🇭 Ghana — Best Rate',
    prompt: `Create a 7-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text fully visible, no clipping. Tablet-appropriate font sizes.
${BRAND_CONTEXT}
Screen: Sending money to Ghana. White background.
Left panel: Taper Payer logo top-left. Transfer card — "You Send" $250 USD · "Recipient gets" 3,850 GHS in bold green · "1 USD = 15.40 GHS". Large blue "Send to Ghana Now" button.
Right panel: Rate trend chart in brand blue showing GHS rate rising. Badge "⭐ Best Rate in 30 Days" in #61AF39.`,
  },
  {
    label: '🌍 Global Coverage',
    prompt: `Create a 7-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text fully visible, no clipping. Tablet-appropriate font sizes.
${BRAND_CONTEXT}
Screen: Destination country selector. White background.
Left panel: Taper Payer logo top-left. Heading "Where do you want to send?" in slate-900. 3-column country grid: 🇳🇬 Nigeria · 🇬🇭 Ghana · 🇰🇪 Kenya · 🇭🇹 Haiti · 🇸🇳 Senegal · 🇦🇴 Angola · 🇨🇲 Cameroon · 🇲🇦 Morocco · 🇩🇴 DR · 🇲🇽 Mexico. Large green "Choose Destination" button.
Right panel: Globe showing transfer routes in brand blue and green.`,
  },
  {
    label: '🇰🇪 Kenya — M-Pesa',
    prompt: `Create a 7-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text fully visible, no clipping. Tablet-appropriate font sizes.
${BRAND_CONTEXT}
Screen: Sending money to Kenya. White background.
Left panel: Taper Payer logo top-left. Transfer card — "You Send" $150 USD · "Recipient gets" 19,500 KES in bold green · "Via M-Pesa · Instant". Large green "Send to Kenya Instantly" button.
Right panel: Speed visual — "🚀 Avg delivery: 8 seconds" in large bold #2479C2 with lightning bolt graphic.`,
  },
  {
    label: '🇲🇽 Mexico — SPEI',
    prompt: `Create a 7-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text fully visible, no clipping. Tablet-appropriate font sizes.
${BRAND_CONTEXT}
Screen: Sending money to Mexico. White background.
Left panel: Taper Payer logo top-left. Transfer card — "You Send" $500 USD · "Recipient gets" 9,500 MXN in bold green · "Via SPEI · Instant". Large blue "Send to Mexico Instantly" button.
Right panel: Speed badge "⚡ Instant SPEI Transfer" with Mexico map highlight in brand colors.`,
  },
  {
    label: '🛡 Security & Trust',
    prompt: `Create a 7-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text fully visible, no clipping. Tablet-appropriate font sizes.
${BRAND_CONTEXT}
Screen: Trust & security features page. White background.
Left panel: Taper Payer logo top-left. Three feature rows with icons: 🛡 Bank-Grade Encryption · ⚡ Instant Transfers · 💲 Zero Hidden Fees. Each with a short description. Large blue "Get Started" button.
Right panel: Shield graphic in #2479C2 with "50,000+ Transfers Secured" stat in bold green.`,
  },
  {
    label: '📱 App Overview',
    prompt: `Create a 7-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text fully visible, no clipping. Tablet-appropriate font sizes.
${BRAND_CONTEXT}
Screen: App home/dashboard overview. White background.
Left panel: Taper Payer logo top-left. Welcome message "Send Money Home — Fast & Secure". Quick action buttons: "Send Money" (blue) · "Top-Up Mobile" (green) · "View Rates" (outline).
Right panel: Transfer summary card showing recent destinations: 🇳🇬 Nigeria · 🇭🇹 Haiti · 🇬🇭 Ghana with status "Delivered" in green.`,
  },
];

const TABLET_10_PROMPTS = [
  {
    label: '🇳🇬 Nigeria — Send Money',
    prompt: `Create a 10-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text must be fully visible and contained within the screen — no clipping. Use large, bold fonts suited for a 10-inch tablet display with generous spacing.
${BRAND_CONTEXT}
Screen: Sending money to Nigeria. White background.
Left panel (40%): Taper Payer logo prominently top-left. Transfer form — "You Send" $300 USD · "Recipient gets" 486,000 NGN in large bold green · "1 USD = 1,620 NGN — Best Rate Today". Large blue "Send to Nigeria Now" button. Badge "🔥 Rate valid 15 min only!" in #F88F2B.
Right panel (60%): Large globe graphic centered on West Africa with glowing transfer route USA → Nigeria in brand blue (#2479C2) and green (#61AF39). Subtle city labels at destination.`,
  },
  {
    label: '🇭🇹 Haiti — Same Day',
    prompt: `Create a 10-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text fully visible, no clipping. Large tablet fonts with generous spacing.
${BRAND_CONTEXT}
Screen: Sending money to Haiti. White background.
Left panel (40%): Taper Payer logo top-left. Transfer card — "You Send" $200 USD · "Recipient gets" 26,400 HTG in large bold green · "Via MonCash · Today by 5PM". Countdown "⏰ 2h 14m left" in #F88F2B. Large blue "Send to Haiti Now" button.
Right panel (60%): Illustration of MonCash mobile wallet receipt on a phone, with "✅ Delivered Today" in large bold green.`,
  },
  {
    label: '🌍 Destination Picker',
    prompt: `Create a 10-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text fully visible, no clipping. Large tablet fonts with generous spacing.
${BRAND_CONTEXT}
Screen: Country destination picker. White background.
Top: Taper Payer logo center-top. Heading "Where would you like to send money?" in large slate-900 bold.
Main: 5-column country grid with large flags and country names below — 🇳🇬 Nigeria · 🇬🇭 Ghana · 🇰🇪 Kenya · 🇭🇹 Haiti · 🇸🇳 Senegal · 🇦🇴 Angola · 🇨🇲 Cameroon · 🇲🇦 Morocco · 🇩🇴 Dom. Rep. · 🇲🇽 Mexico. Each card with subtle border and hover state in #2479C2.
Bottom: Large green "Continue" button centered.`,
  },
  {
    label: '🇬🇭 Ghana — Best Rate',
    prompt: `Create a 10-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text fully visible, no clipping. Large tablet fonts with generous spacing.
${BRAND_CONTEXT}
Screen: Sending money to Ghana. White background.
Left panel (40%): Taper Payer logo top-left. Transfer card — "You Send" $250 USD · "Recipient gets" 3,850 GHS in large bold green · "1 USD = 15.40 GHS". Star badge "⭐ Best GHS Rate in 30 Days" in #61AF39. Large blue "Send to Ghana Now" button.
Right panel (60%): Large rate trend chart in brand blue showing GHS exchange rate climbing upward over 30 days, with today's value highlighted in green.`,
  },
  {
    label: '🇰🇪 Kenya — Instant',
    prompt: `Create a 10-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text fully visible, no clipping. Large tablet fonts with generous spacing.
${BRAND_CONTEXT}
Screen: Sending money to Kenya. White background.
Left panel (40%): Taper Payer logo top-left. Transfer card — "You Send" $150 USD · "Recipient gets" 19,500 KES in large bold green · "Via M-Pesa · Instant". Large green "Send to Kenya Instantly" button.
Right panel (60%): Large speed stat "🚀 8 Seconds" in massive bold #2479C2 typography, with subtitle "Average M-Pesa delivery time" and a lightning bolt graphic.`,
  },
  {
    label: '🛡 Security Features',
    prompt: `Create a 10-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text fully visible, no clipping. Large tablet fonts with generous spacing.
${BRAND_CONTEXT}
Screen: Security & trust features. White background.
Left panel (40%): Taper Payer logo top-left. Three large feature blocks with icons and descriptions: 🛡 Bank-Grade Encryption · ⚡ Instant Transfers · 💲 Zero Hidden Fees. Large blue "Start Sending Securely" button.
Right panel (60%): Large shield graphic in gradient blue-to-green with "50,000+ Secure Transfers" in bold and 5-star rating display.`,
  },
  {
    label: '📊 Exchange Rates',
    prompt: `Create a 10-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text fully visible, no clipping. Large tablet fonts with generous spacing.
${BRAND_CONTEXT}
Screen: Live exchange rates dashboard. White background.
Top: Taper Payer logo top-left. Heading "Live Exchange Rates" in slate-900 bold.
Main: Grid of rate cards for: 🇳🇬 NGN · 🇬🇭 GHS · 🇰🇪 KES · 🇭🇹 HTG · 🇸🇳 XOF · 🇦🇴 AOA · 🇨🇲 XAF · 🇲🇦 MAD · 🇩🇴 DOP · 🇲🇽 MXN. Each card shows flag, currency code, rate from 1 USD, and a small trend arrow in green.
Bottom: "Rates updated live" label in slate-500 and large blue "Send Money Now" button.`,
  },
  {
    label: '📱 App Dashboard',
    prompt: `Create a 10-inch tablet app screenshot in 16:9 landscape for "Taper Payer". All text fully visible, no clipping. Large tablet fonts with generous spacing.
${BRAND_CONTEXT}
Screen: Main app dashboard. White background.
Left sidebar (25%): Taper Payer logo at top. Navigation menu items: Home · Send Money · Exchange Rates · Top-Up · History · Settings — each with an icon in #2479C2.
Main content (75%): Hero welcome card "Welcome back! Ready to send?" with large blue "Send Money" CTA. Below: recent transfers list showing 🇳🇬 Nigeria $300 · 🇭🇹 Haiti $200 · 🇬🇭 Ghana $250 — each with "✅ Delivered" in green.`,
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
        style={{ aspectRatio: aspect === 'feature' ? '1024/500' : aspect === 'icon' ? '1/1' : aspect === 'landscape' ? '16/9' : '9/16', maxHeight: aspect === 'feature' ? 260 : aspect === 'icon' ? 280 : aspect === 'landscape' ? 200 : 420 }}
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
          <span className="flex items-center gap-1"><LayoutGrid className="w-3.5 h-3.5" /> App Icon: 512 × 512 px · PNG/JPEG · max 1 MB · Google Play</span>
          <span className="flex items-center gap-1"><Image className="w-3.5 h-3.5" /> Feature Graphic: 1024 × 500 px · PNG/JPEG · max 15 MB</span>
          <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Phone Screenshots: 9:16 · PNG/JPEG · 320–3840 px · max 8 MB</span>
          <span className="flex items-center gap-1"><Tablet className="w-3.5 h-3.5" /> 7-inch Tablet: 16:9 · PNG/JPEG · 320–3840 px · max 8 MB</span>
          <span className="flex items-center gap-1"><Tablet className="w-3.5 h-3.5" /> 10-inch Tablet: 16:9 · PNG/JPEG · 1080–7680 px · max 8 MB</span>
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
            subtitle="512 × 512 px · Square · PNG · max 1 MB"
            badge="512×512"
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

      {/* 7-inch Tablet Screenshots */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <Tablet className="w-5 h-5" style={{ color: '#2479C2' }} /> 7-inch Tablet Screenshots
          <Badge className="ml-2 text-xs" style={{ backgroundColor: '#2479C2' }}>Up to 8 · Google Play</Badge>
        </h3>
        <p className="text-slate-500 text-sm mb-5">16:9 landscape · PNG/JPEG · 320–3840 px each side · max 8 MB each</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TABLET_7_PROMPTS.map((s, i) => (
            <AssetCard
              key={i}
              title={`7" Tablet ${i + 1}`}
              subtitle={s.label}
              badge="16:9"
              prompt={s.prompt}
              filename={`taper-payer-tablet7-${i + 1}.png`}
              aspect="landscape"
            />
          ))}
        </div>
      </div>

      {/* 10-inch Tablet Screenshots */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <Tablet className="w-5 h-5" style={{ color: '#F88F2B' }} /> 10-inch Tablet Screenshots
          <Badge className="ml-2 text-xs" style={{ backgroundColor: '#F88F2B' }}>Up to 8 · Google Play</Badge>
        </h3>
        <p className="text-slate-500 text-sm mb-5">16:9 landscape · PNG/JPEG · 1080–7680 px each side · max 8 MB each</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TABLET_10_PROMPTS.map((s, i) => (
            <AssetCard
              key={i}
              title={`10" Tablet ${i + 1}`}
              subtitle={s.label}
              badge="16:9"
              prompt={s.prompt}
              filename={`taper-payer-tablet10-${i + 1}.png`}
              aspect="landscape"
            />
          ))}
        </div>
      </div>
    </div>
  );
}