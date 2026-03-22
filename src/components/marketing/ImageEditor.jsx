import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, ZoomIn, ZoomOut, RotateCcw, Check, X, Sun, Contrast, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * ImageEditor — canvas-based image adjuster.
 * Props:
 *   imageUrl  : string — URL of the uploaded image
 *   onSave    : (blob: Blob) => void — called with the adjusted image as a Blob
 *   onCancel  : () => void
 */
export default function ImageEditor({ imageUrl, onSave, onCancel }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [saving, setSaving] = useState(false);

  // Adjustments
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  // Pan drag
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    const scaledW = img.naturalWidth * zoom;
    const scaledH = img.naturalHeight * zoom;
    const x = (canvas.width - scaledW) / 2 + offsetX;
    const y = (canvas.height - scaledH) / 2 + offsetY;

    ctx.drawImage(img, x, y, scaledW, scaledH);
    ctx.filter = 'none';
  }, [zoom, brightness, contrast, offsetX, offsetY]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      // Size canvas to fit a max 700px wide preview
      const canvas = canvasRef.current;
      const maxW = 700;
      const ratio = img.naturalHeight / img.naturalWidth;
      canvas.width = Math.min(img.naturalWidth, maxW);
      canvas.height = canvas.width * ratio;
      draw();
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    draw();
  }, [draw]);

  const reset = () => {
    setZoom(1);
    setBrightness(100);
    setContrast(100);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleMouseDown = (e) => {
    dragging.current = true;
    dragging.startX = e.clientX;
    dragging.startY = e.clientY;
    dragging.ox = offsetX;
    dragging.oy = offsetY;
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    setOffsetX(dragging.ox + (e.clientX - dragging.startX));
    setOffsetY(dragging.oy + (e.clientY - dragging.startY));
  };

  const handleMouseUp = () => { dragging.current = false; };

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    dragging.current = true;
    dragging.startX = t.clientX;
    dragging.startY = t.clientY;
    dragging.ox = offsetX;
    dragging.oy = offsetY;
  };

  const handleTouchMove = (e) => {
    if (!dragging.current) return;
    const t = e.touches[0];
    setOffsetX(dragging.ox + (t.clientX - dragging.startX));
    setOffsetY(dragging.oy + (t.clientY - dragging.startY));
  };

  const handleSave = async () => {
    setSaving(true);
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      setSaving(false);
      onSave(blob);
    }, 'image/jpeg', 0.92);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Adjust Image</h4>
        <button onClick={onCancel} className="p-1 hover:bg-slate-100 rounded-full">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Canvas preview */}
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-slate-900 flex justify-center cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          style={{ maxWidth: '100%', display: 'block', touchAction: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        />
      </div>

      <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
        <Move className="w-3 h-3" /> Drag to reposition
      </p>

      {/* Controls */}
      <div className="space-y-4 bg-slate-50 dark:bg-slate-800 rounded-xl p-5">
        {/* Zoom */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <ZoomIn className="w-4 h-4" /> Zoom
            </label>
            <span className="text-xs text-slate-500">{Math.round(zoom * 100)}%</span>
          </div>
          <input
            type="range" min="0.5" max="3" step="0.05"
            value={zoom}
            onChange={e => setZoom(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>

        {/* Brightness */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Sun className="w-4 h-4" /> Brightness
            </label>
            <span className="text-xs text-slate-500">{brightness}%</span>
          </div>
          <input
            type="range" min="30" max="200" step="1"
            value={brightness}
            onChange={e => setBrightness(parseInt(e.target.value))}
            className="w-full accent-yellow-500"
          />
        </div>

        {/* Contrast */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Contrast className="w-4 h-4" /> Contrast
            </label>
            <span className="text-xs text-slate-500">{contrast}%</span>
          </div>
          <input
            type="range" min="30" max="200" step="1"
            value={contrast}
            onChange={e => setContrast(parseInt(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={reset} className="gap-2">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
        <Button onClick={handleSave} disabled={saving} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Apply & Use Image
        </Button>
      </div>
    </div>
  );
}