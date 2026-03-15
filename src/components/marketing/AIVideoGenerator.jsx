import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Wand2, Play, Pause, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';

const VIDEO_TOPICS = [
  { id: 'remittance', label: '💸 Send Money Home', desc: 'Highlight fast, low-fee international transfers' },
  { id: 'tpay', label: '📱 TPAY Mobile Top-Up', desc: 'Showcase instant airtime recharges worldwide' },
  { id: 'security', label: '🔒 Security & Trust', desc: 'Emphasize bank-level security and reliability' },
  { id: 'rates', label: '📈 Live Exchange Rates', desc: 'Promote competitive, transparent exchange rates' },
  { id: 'membership', label: '⭐ Membership Benefits', desc: 'Advertise the Taper Payer membership program' },
  { id: 'app', label: '📲 Download the App', desc: 'Drive app downloads with a compelling pitch' },
];

const VIDEO_STYLES = [
  { id: 'professional', label: 'Professional' },
  { id: 'energetic', label: 'Energetic' },
  { id: 'warm', label: 'Warm & Friendly' },
  { id: 'minimal', label: 'Minimal & Clean' },
];

const DURATIONS = [
  { id: '15', label: '15s (Story/Reel)' },
  { id: '30', label: '30s (Standard Ad)' },
  { id: '60', label: '60s (Explainer)' },
];

// Animated video preview using canvas
function AnimatedVideoPreview({ frames, isPlaying, onTogglePlay, onReset, title }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const intervalRef = useRef(null);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${title || 'taper-payer-video'}-frame.png`;
    a.click();
  };

  useEffect(() => {
    if (!frames || frames.length === 0) return;
    drawFrame(frames[frameRef.current]);

    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        frameRef.current = (frameRef.current + 1) % frames.length;
        drawFrame(frames[frameRef.current]);
      }, 2000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, frames]);

  const drawFrame = (frame) => {
    const canvas = canvasRef.current;
    if (!canvas || !frame) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = frame.bg || '#0F172A';
    ctx.fillRect(0, 0, w, h);

    // Gradient overlay
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, frame.gradFrom || 'rgba(36,121,194,0.6)');
    grad.addColorStop(1, frame.gradTo || 'rgba(97,175,57,0.6)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Emoji / icon
    ctx.font = '64px serif';
    ctx.textAlign = 'center';
    ctx.fillText(frame.emoji || '💸', w / 2, h * 0.28);

    // Headline
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    wrapText(ctx, frame.headline || '', w / 2, h * 0.48, w - 40, 28);

    // Sub-text
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '14px sans-serif';
    wrapText(ctx, frame.body || '', w / 2, h * 0.68, w - 60, 20);

    // CTA
    if (frame.cta) {
      const ctaY = h * 0.82;
      ctx.fillStyle = frame.ctaColor || '#F88F2B';
      const ctaW = 180;
      const ctaH = 36;
      roundRect(ctx, w / 2 - ctaW / 2, ctaY - ctaH / 2, ctaW, ctaH, 18);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(frame.cta, w / 2, ctaY + 5);
    }

    // Frame indicator
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    frames.forEach((_, i) => {
      ctx.beginPath();
      ctx.arc(w / 2 - ((frames.length - 1) * 12) / 2 + i * 12, h - 16, 4, 0, Math.PI * 2);
      ctx.fillStyle = i === frameRef.current ? '#FFFFFF' : 'rgba(255,255,255,0.4)';
      ctx.fill();
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-700">
        <canvas ref={canvasRef} width={320} height={568} className="block" />
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        <Button variant="outline" size="sm" onClick={onTogglePlay} className="gap-2">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
          <RotateCcw className="w-4 h-4" /> Restart
        </Button>
        <Button size="sm" onClick={handleDownload} className="gap-2 text-white" style={{ backgroundColor: '#2479C2' }}>
          <Download className="w-4 h-4" /> Download Frame
        </Button>
      </div>
    </div>
  );
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

export default function AIVideoGenerator() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('professional');
  const [selectedDuration, setSelectedDuration] = useState('30');
  const [customScript, setCustomScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState(null);
  const [videoFrames, setVideoFrames] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('setup'); // setup | preview

  const handleGenerate = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    setError(null);

    const topic = VIDEO_TOPICS.find(t => t.id === selectedTopic);
    const prompt = `You are a video scriptwriter for Taper Payer, a fintech money transfer brand.

Create a ${selectedDuration}-second marketing video script for: "${topic.label} — ${topic.desc}".
Style: ${selectedStyle}.
${customScript ? `Additional instructions: ${customScript}` : ''}

Brand colors: Blue #2479C2, Green #61AF39, Orange #F88F2B.
Brand values: fast, safe, low-cost, global.

Return a JSON object with:
{
  "title": "Video title",
  "duration": "${selectedDuration}",
  "voiceover": "Full voiceover script text",
  "frames": [
    {
      "time": "0s",
      "emoji": "💸",
      "headline": "Short punchy headline (max 6 words)",
      "body": "Supporting text (max 12 words)",
      "cta": "Action button text (optional)",
      "ctaColor": "#F88F2B",
      "bg": "#0F172A",
      "gradFrom": "rgba(36,121,194,0.7)",
      "gradTo": "rgba(97,175,57,0.7)"
    }
  ],
  "hashtags": "#TaperPayer #MoneyTransfer ..."
}

Generate ${Math.max(3, Math.floor(parseInt(selectedDuration) / 10))} frames that tell a visual story. Vary the emoji and colors per frame.`;

    try {
      const raw = await base44.integrations.Core.InvokeLLM({ prompt });
      // Strip markdown code fences if present
      const cleaned = typeof raw === 'string'
        ? raw.replace(/```json|```/g, '').trim()
        : JSON.stringify(raw);
      const result = JSON.parse(cleaned);

      setGeneratedScript(result);
      setVideoFrames(result.frames);
      setStep('preview');
      setIsPlaying(true);
    } catch (e) {
      setError('Failed to generate video script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStep('setup');
    setGeneratedScript(null);
    setVideoFrames(null);
    setCustomScript('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {step === 'setup' && (
        <Card className="p-6 space-y-6">
          {/* Topic */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">1. Choose a Topic</label>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {VIDEO_TOPICS.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    selectedTopic === topic.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="font-semibold text-slate-900 text-sm mb-1">{topic.label}</div>
                  <div className="text-slate-500 text-xs leading-tight">{topic.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">2. Select Style</label>
            <div className="flex flex-wrap gap-2">
              {VIDEO_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    selectedStyle === style.id
                      ? 'text-white border-transparent'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-green-400'
                  }`}
                  style={selectedStyle === style.id ? { backgroundColor: '#61AF39' } : {}}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">3. Video Duration</label>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDuration(d.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    selectedDuration === d.id
                      ? 'text-white border-transparent'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-orange-400'
                  }`}
                  style={selectedDuration === d.id ? { backgroundColor: '#F88F2B' } : {}}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom script */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">4. Custom Instructions <span className="font-normal text-slate-400">(optional)</span></label>
            <textarea
              value={customScript}
              onChange={e => setCustomScript(e.target.value)}
              placeholder="E.g. Focus on Nigerian diaspora in the US. Include a discount offer. Use an upbeat tone."
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            onClick={handleGenerate}
            disabled={!selectedTopic || loading}
            className="w-full py-5 text-base font-semibold gap-2"
            style={{ backgroundColor: '#2479C2' }}
          >
            {loading
              ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating Video Script & Preview...</>
              : <><Wand2 className="w-5 h-5" /> Generate AI Video</>
            }
          </Button>
        </Card>
      )}

      {step === 'preview' && generatedScript && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{generatedScript.title}</h3>
              <p className="text-slate-500 text-sm">{generatedScript.duration}s · {VIDEO_STYLES.find(s => s.id === selectedStyle)?.label} style</p>
            </div>
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" /> New Video
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Animated preview */}
            <div className="flex flex-col items-center">
              <p className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Video Preview</p>
              <AnimatedVideoPreview
                frames={videoFrames}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(p => !p)}
                onReset={() => { setIsPlaying(false); setTimeout(() => setIsPlaying(true), 100); }}
              />
            </div>

            {/* Script & details */}
            <div className="space-y-4">
              <Card className="p-5">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">🎙️ Voiceover Script</h4>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{generatedScript.voiceover}</p>
              </Card>

              <Card className="p-5">
                <h4 className="font-semibold text-slate-900 mb-3">🎬 Scene Breakdown</h4>
                <div className="space-y-3">
                  {videoFrames?.map((frame, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded flex-shrink-0">{frame.time}</span>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{frame.emoji} {frame.headline}</p>
                        <p className="text-xs text-slate-500">{frame.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h4 className="font-semibold text-slate-900 mb-2">🏷️ Hashtags</h4>
                <p className="text-sm text-blue-600 leading-relaxed">{generatedScript.hashtags}</p>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}