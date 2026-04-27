import React, { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const HUBS = [
  { id: 'nyc',    lat: 40.7,  lon: -74.0,  label: 'New York',   currency: 'USD',  color: '#60a5fa' },
  { id: 'lon',    lat: 51.5,  lon: -0.1,   label: 'London',     currency: 'GBP',  color: '#a78bfa' },
  { id: 'par',    lat: 48.8,  lon: 2.3,    label: 'Paris',      currency: 'EUR',  color: '#818cf8' },
  { id: 'lag',    lat: 6.5,   lon: 3.4,    label: 'Lagos',      currency: 'NGN',  color: '#34d399' },
  { id: 'mum',    lat: 19.0,  lon: 72.8,   label: 'Mumbai',     currency: 'INR',  color: '#f97316' },
  { id: 'sin',    lat: 1.3,   lon: 103.8,  label: 'Singapore',  currency: 'USDC', color: '#22d3ee' },
  { id: 'dub',    lat: 25.2,  lon: 55.3,   label: 'Dubai',      currency: 'USD',  color: '#60a5fa' },
  { id: 'sao',    lat: -23.5, lon: -46.6,  label: 'São Paulo',  currency: 'USD',  color: '#60a5fa' },
];

const ROUTES = [
  ['nyc', 'lon'], ['nyc', 'par'], ['lon', 'lag'], ['par', 'mum'],
  ['lag', 'sin'], ['mum', 'sin'], ['nyc', 'dub'], ['dub', 'mum'],
  ['sao', 'nyc'], ['sao', 'lon'], ['sin', 'dub'], ['lag', 'mum'],
];

function latLonToXY(lat, lon, rx, ry, rotation = 0) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180 + rotation) * Math.PI) / 180;
  const x = rx * Math.sin(phi) * Math.cos(theta);
  const z = ry * Math.cos(phi);
  const screenX = rx + x;
  const screenY = ry + z;
  const depth = Math.sin(phi) * Math.sin(theta);
  return { x: screenX, y: screenY, depth, visible: depth > -0.3 };
}

function arcPath(x1, y1, x2, y2, bulge = 60) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * bulge;
  const cy = my + ny * bulge;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

export default function GlobeVisualization() {
  const svgRef = useRef(null);
  const rotRef = useRef(0);
  const frameRef = useRef(null);
  const dotsRef = useRef([]);
  const timeRef = useRef(0);

  const RX = 180, RY = 180;

  // Initialize animated dots on routes
  useEffect(() => {
    dotsRef.current = ROUTES.map((route, i) => ({
      route,
      progress: (i / ROUTES.length),
      speed: 0.0015 + Math.random() * 0.001,
    }));
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const animate = () => {
      timeRef.current += 1;
      rotRef.current = (rotRef.current + 0.12) % 360;
      const rot = rotRef.current;

      // Update hub positions
      const positions = {};
      HUBS.forEach(hub => {
        positions[hub.id] = latLonToXY(hub.lat, hub.lon, RX, RY, rot);
      });

      // Update arc paths
      ROUTES.forEach(([a, b], i) => {
        const pa = positions[a];
        const pb = positions[b];
        const arcEl = svg.querySelector(`#arc-${i}`);
        const glowEl = svg.querySelector(`#glow-${i}`);
        if (!arcEl || !glowEl) return;
        if (pa.visible && pb.visible) {
          const path = arcPath(pa.x, pa.y, pb.x, pb.y, 50);
          arcEl.setAttribute('d', path);
          glowEl.setAttribute('d', path);
          arcEl.style.opacity = Math.min(pa.depth + 0.9, 0.7) * Math.min(pb.depth + 0.9, 0.7);
          glowEl.style.opacity = arcEl.style.opacity * 0.5;
        } else {
          arcEl.style.opacity = 0;
          glowEl.style.opacity = 0;
        }
      });

      // Update hub circles
      HUBS.forEach(hub => {
        const pos = positions[hub.id];
        const circEl = svg.querySelector(`#hub-${hub.id}`);
        const pulseEl = svg.querySelector(`#pulse-${hub.id}`);
        const labelEl = svg.querySelector(`#label-${hub.id}`);
        if (!circEl) return;
        circEl.setAttribute('cx', pos.x);
        circEl.setAttribute('cy', pos.y);
        if (pulseEl) { pulseEl.setAttribute('cx', pos.x); pulseEl.setAttribute('cy', pos.y); }
        if (labelEl) { labelEl.setAttribute('x', pos.x + 10); labelEl.setAttribute('y', pos.y - 8); }
        const vis = pos.visible ? Math.min(pos.depth + 1, 1) : 0;
        circEl.style.opacity = vis;
        if (pulseEl) pulseEl.style.opacity = vis * 0.4;
        if (labelEl) labelEl.style.opacity = pos.depth > 0.2 ? vis : 0;
      });

      // Update moving dots
      dotsRef.current.forEach((dot, i) => {
        dot.progress = (dot.progress + dot.speed) % 1;
        const [a, b] = dot.route;
        const pa = positions[a];
        const pb = positions[b];
        const dotEl = svg.querySelector(`#dot-${i}`);
        if (!dotEl) return;
        if (pa.visible && pb.visible) {
          const t = dot.progress;
          // Quadratic bezier point
          const mx = (pa.x + pb.x) / 2;
          const my = (pa.y + pb.y) / 2;
          const dx = pb.x - pa.x; const dy = pb.y - pa.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const cx = mx + (-dy / len) * 50;
          const cy = my + (dx / len) * 50;
          const bx = (1 - t) * (1 - t) * pa.x + 2 * (1 - t) * t * cx + t * t * pb.x;
          const by = (1 - t) * (1 - t) * pa.y + 2 * (1 - t) * t * cy + t * t * pb.y;
          dotEl.setAttribute('cx', bx);
          dotEl.setAttribute('cy', by);
          dotEl.style.opacity = Math.min(pa.depth + 0.9, 0.9) * Math.min(pb.depth + 0.9, 0.9);
        } else {
          dotEl.style.opacity = 0;
        }
      });

      // Pulse animation for hub rings
      const pulseFactor = Math.sin(timeRef.current * 0.04) * 0.5 + 0.5;
      HUBS.forEach(hub => {
        const ringEl = svg.querySelector(`#ring-${hub.id}`);
        if (ringEl) {
          const pos = positions[hub.id];
          ringEl.setAttribute('cx', pos.x);
          ringEl.setAttribute('cy', pos.y);
          const r = 6 + pulseFactor * 8;
          ringEl.setAttribute('r', r);
          ringEl.style.opacity = pos.visible ? (1 - pulseFactor) * 0.5 : 0;
        }
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const gradientLines = useMemo(() => ROUTES.map((_, i) => i), []);

  return (
    <div className="relative w-full flex items-center justify-center" style={{ height: 420 }}>
      {/* Ambient glow bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%,-50%)',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(34,211,238,0.08) 50%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      {/* SVG Globe */}
      <svg
        ref={svgRef}
        width={RX * 2}
        height={RY * 2}
        viewBox={`0 0 ${RX * 2} ${RY * 2}`}
        style={{ overflow: 'visible', position: 'relative', zIndex: 2 }}
      >
        <defs>
          {/* Globe gradient */}
          <radialGradient id="globeGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#0f172a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="80%" stopColor="#6366f1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.35" />
          </radialGradient>
          {/* Arc gradients */}
          {['#60a5fa', '#a78bfa', '#22d3ee', '#34d399', '#f97316'].map((c, i) => (
            <linearGradient key={i} id={`arcGrad${i}`} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={c} stopOpacity="0.1" />
              <stop offset="50%" stopColor={c} stopOpacity="0.9" />
              <stop offset="100%" stopColor={c} stopOpacity="0.1" />
            </linearGradient>
          ))}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Globe base */}
        <circle cx={RX} cy={RY} r={RX - 2} fill="url(#globeGrad)" />
        {/* Globe rim glow */}
        <circle cx={RX} cy={RY} r={RX - 2} fill="none" stroke="url(#globeGlow)" strokeWidth="20" />
        <circle cx={RX} cy={RY} r={RX - 2} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Latitude lines */}
        {[-60, -30, 0, 30, 60].map(lat => {
          const y = RY + (RY - 4) * Math.sin((lat * Math.PI) / 180) * -1;
          const r = (RX - 4) * Math.cos((lat * Math.PI) / 180);
          return r > 0 ? (
            <ellipse key={lat} cx={RX} cy={y} rx={r} ry={r * 0.15}
              fill="none" stroke="#6366f1" strokeWidth="0.4" strokeOpacity="0.25" />
          ) : null;
        })}
        {/* Longitude lines */}
        {[0, 30, 60, 90, 120, 150].map(lon => (
          <ellipse key={lon} cx={RX} cy={RY} rx={(RX - 4) * Math.abs(Math.cos((lon * Math.PI) / 180))}
            ry={RY - 4} fill="none" stroke="#818cf8" strokeWidth="0.4" strokeOpacity="0.2" />
        ))}

        {/* Glow arc underlays */}
        {gradientLines.map(i => (
          <path key={i} id={`glow-${i}`} fill="none"
            stroke="#818cf8" strokeWidth="6" strokeLinecap="round"
            style={{ filter: 'blur(4px)', opacity: 0, transition: 'opacity 0.3s' }} />
        ))}
        {/* Arc lines */}
        {gradientLines.map(i => (
          <path key={i} id={`arc-${i}`} fill="none"
            stroke={`url(#arcGrad${i % 5})`} strokeWidth="1.5" strokeLinecap="round"
            style={{ opacity: 0, transition: 'opacity 0.3s' }} filter="url(#glow)" />
        ))}

        {/* Hub pulse rings */}
        {HUBS.map(hub => (
          <circle key={hub.id} id={`ring-${hub.id}`} cx={RX} cy={RY} r={6}
            fill="none" stroke={hub.color} strokeWidth="1.5" style={{ opacity: 0 }} />
        ))}

        {/* Hub glow circles */}
        {HUBS.map(hub => (
          <circle key={hub.id} id={`pulse-${hub.id}`} cx={RX} cy={RY} r={8}
            fill={hub.color} style={{ opacity: 0, filter: 'blur(5px)' }} />
        ))}

        {/* Moving transaction dots */}
        {ROUTES.map((_, i) => (
          <circle key={i} id={`dot-${i}`} cx={RX} cy={RY} r={3}
            fill={HUBS.find(h => h.id === ROUTES[i][0])?.color || '#60a5fa'}
            style={{ opacity: 0, filter: 'url(#glow)' }} />
        ))}

        {/* Hub dots */}
        {HUBS.map(hub => (
          <circle key={hub.id} id={`hub-${hub.id}`} cx={RX} cy={RY} r={4.5}
            fill={hub.color} style={{ opacity: 0 }} filter="url(#strongGlow)" />
        ))}

        {/* Currency labels */}
        {HUBS.map(hub => (
          <text key={hub.id} id={`label-${hub.id}`} x={RX} y={RY}
            fill={hub.color} fontSize="9" fontWeight="700" fontFamily="monospace"
            style={{ opacity: 0, letterSpacing: '0.05em' }}>
            {hub.currency}
          </text>
        ))}

        {/* Globe shine */}
        <circle cx={RX * 0.7} cy={RY * 0.6} r={RX * 0.35}
          fill="radial-gradient(circle, white 0%, transparent 70%)"
          style={{ opacity: 0.04 }} />
        <ellipse cx={RX * 0.65} cy={RY * 0.55} rx={40} ry={25}
          fill="white" style={{ opacity: 0.04 }} />
      </svg>

      {/* Glassmorphism overlay cards */}
      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{
          position: 'absolute', left: 0, top: '20%',
          background: 'rgba(15,23,42,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 12, padding: '10px 14px',
          zIndex: 10, minWidth: 130,
        }}
      >
        <div style={{ color: '#94a3b8', fontSize: 10, marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Transfers</div>
        <motion.div
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ color: '#22d3ee', fontSize: 18, fontWeight: 700, fontFamily: 'monospace' }}
        >
          $2.4M
        </motion.div>
        <div style={{ color: '#64748b', fontSize: 9, marginTop: 2 }}>in last 60s</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          position: 'absolute', right: 0, top: '20%',
          background: 'rgba(15,23,42,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 12, padding: '10px 14px',
          zIndex: 10, minWidth: 130,
        }}
      >
        <div style={{ color: '#94a3b8', fontSize: 10, marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Active Routes</div>
        <motion.div
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          style={{ color: '#a78bfa', fontSize: 18, fontWeight: 700, fontFamily: 'monospace' }}
        >
          {ROUTES.length}
        </motion.div>
        <div style={{ color: '#64748b', fontSize: 9, marginTop: 2 }}>global corridors</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        style={{
          position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(15,23,42,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(34,211,238,0.25)',
          borderRadius: 24, padding: '8px 20px',
          zIndex: 10, display: 'flex', gap: 16, alignItems: 'center',
        }}
      >
        {[
          { currency: 'USD', color: '#60a5fa' },
          { currency: 'EUR', color: '#818cf8' },
          { currency: 'GBP', color: '#a78bfa' },
          { currency: 'NGN', color: '#34d399' },
          { currency: 'INR', color: '#f97316' },
          { currency: 'USDC', color: '#22d3ee' },
        ].map(({ currency, color }) => (
          <motion.div
            key={currency}
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
          >
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
            }} />
            <span style={{ color, fontSize: 9, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{currency}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}