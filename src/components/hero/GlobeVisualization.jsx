import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const HUBS = [
  { id: 'nyc',  lat: 40.7,  lon: -74.0,  label: 'New York',          currency: 'USD',  color: '#3D7BB7' },
  { id: 'lon',  lat: 51.5,  lon: -0.1,   label: 'London',            currency: 'GBP',  color: '#61AF39' },
  { id: 'par',  lat: 48.8,  lon: 2.3,    label: 'Paris',             currency: 'EUR',  color: '#5FAE2E' },
  { id: 'lag',  lat: 6.5,   lon: 3.4,    label: 'Lagos',             currency: 'NGN',  color: '#F88F2B' },
  { id: 'mum',  lat: 19.0,  lon: 72.8,   label: 'Mumbai',            currency: 'INR',  color: '#2479C2' },
  { id: 'sin',  lat: 1.3,   lon: 103.8,  label: 'Singapore',         currency: 'USDC', color: '#61AF39' },
  { id: 'dub',  lat: 25.2,  lon: 55.3,   label: 'Dubai',             currency: 'USD',  color: '#3D7BB7' },
  { id: 'sao',  lat: -23.5, lon: -46.6,  label: 'São Paulo',         currency: 'USD',  color: '#2479C2' },
];

const ROUTES = [
  ['nyc', 'lon'], ['nyc', 'par'], ['lon', 'lag'], ['par', 'mum'],
  ['lag', 'sin'], ['mum', 'sin'], ['nyc', 'dub'], ['dub', 'mum'],
  ['sao', 'nyc'], ['sao', 'lon'], ['sin', 'dub'], ['lag', 'mum'],
];

const CURRENCIES = [
  { currency: 'USD',  color: '#3D7BB7' },
  { currency: 'EUR',  color: '#61AF39' },
  { currency: 'GBP',  color: '#5FAE2E' },
  { currency: 'NGN',  color: '#F88F2B' },
  { currency: 'INR',  color: '#2479C2' },
  { currency: 'USDC', color: '#61AF39' },
  { currency: 'AGNV', color: '#F88F2B' },
];

function latLonToXY(lat, lon, rx, ry, rotation = 0) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180 + rotation) * Math.PI) / 180;
  const x = rx * Math.sin(phi) * Math.cos(theta);
  const z = ry * Math.cos(phi);
  const depth = Math.sin(phi) * Math.sin(theta);
  return { x: rx + x, y: ry + z, depth, visible: depth > -0.3 };
}

function arcPath(x1, y1, x2, y2, bulge = 45) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1; const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const cx = mx + (-dy / len) * bulge;
  const cy = my + (dx / len) * bulge;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

export default function GlobeVisualization() {
  const svgRef = useRef(null);
  const frameRef = useRef(null);
  const dotsRef = useRef([]);
  const timeRef = useRef(0);
  const RX = 140, RY = 140;

  useEffect(() => {
    dotsRef.current = ROUTES.map((route, i) => ({
      route,
      progress: i / ROUTES.length,
      speed: 0.0018 + Math.random() * 0.001,
    }));
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let rot = 0;

    const animate = () => {
      timeRef.current += 1;
      rot = (rot + 0.1) % 360;

      const positions = {};
      HUBS.forEach(hub => { positions[hub.id] = latLonToXY(hub.lat, hub.lon, RX, RY, rot); });

      ROUTES.forEach(([a, b], i) => {
        const pa = positions[a], pb = positions[b];
        const arcEl = svg.querySelector(`#arc-${i}`);
        const glowEl = svg.querySelector(`#glow-${i}`);
        if (!arcEl || !glowEl) return;
        if (pa.visible && pb.visible) {
          const path = arcPath(pa.x, pa.y, pb.x, pb.y);
          arcEl.setAttribute('d', path);
          glowEl.setAttribute('d', path);
          const op = Math.min(pa.depth + 0.9, 0.75) * Math.min(pb.depth + 0.9, 0.75);
          arcEl.style.opacity = op;
          glowEl.style.opacity = op * 0.4;
        } else {
          arcEl.style.opacity = 0;
          glowEl.style.opacity = 0;
        }
      });

      HUBS.forEach(hub => {
        const pos = positions[hub.id];
        const vis = pos.visible ? Math.min(pos.depth + 1, 1) : 0;
        ['hub', 'pulse', 'ring'].forEach(prefix => {
          const el = svg.querySelector(`#${prefix}-${hub.id}`);
          if (el) {
            el.setAttribute('cx', pos.x);
            el.setAttribute('cy', pos.y);
            if (prefix === 'ring') {
              const pf = Math.sin(timeRef.current * 0.05) * 0.5 + 0.5;
              el.setAttribute('r', 5 + pf * 7);
              el.style.opacity = pos.visible ? (1 - pf) * 0.5 : 0;
            } else {
              el.style.opacity = prefix === 'pulse' ? vis * 0.35 : vis;
            }
          }
        });
        const labelEl = svg.querySelector(`#label-${hub.id}`);
        if (labelEl) {
          labelEl.setAttribute('x', pos.x + 8);
          labelEl.setAttribute('y', pos.y - 6);
          labelEl.style.opacity = pos.depth > 0.2 ? vis : 0;
        }
      });

      dotsRef.current.forEach((dot, i) => {
        dot.progress = (dot.progress + dot.speed) % 1;
        const [a, b] = dot.route;
        const pa = positions[a], pb = positions[b];
        const dotEl = svg.querySelector(`#dot-${i}`);
        if (!dotEl) return;
        if (pa.visible && pb.visible) {
          const t = dot.progress;
          const dx = pb.x - pa.x, dy = pb.y - pa.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const cx = (pa.x + pb.x) / 2 + (-dy / len) * 45;
          const cy = (pa.y + pb.y) / 2 + (dx / len) * 45;
          dotEl.setAttribute('cx', (1-t)*(1-t)*pa.x + 2*(1-t)*t*cx + t*t*pb.x);
          dotEl.setAttribute('cy', (1-t)*(1-t)*pa.y + 2*(1-t)*t*cy + t*t*pb.y);
          dotEl.style.opacity = Math.min(pa.depth + 0.9, 1) * Math.min(pb.depth + 0.9, 1);
        } else {
          dotEl.style.opacity = 0;
        }
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-3" style={{ minHeight: 340 }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div style={{
          width: 320, height: 320,
          background: 'radial-gradient(circle, rgba(61,123,183,0.2) 0%, rgba(97,175,57,0.1) 45%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      {/* Stat cards row */}
      <div className="relative z-10 w-full flex justify-between px-4 mb-2">
        <motion.div
          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(97,175,57,0.4)',
            borderRadius: 12, padding: '8px 12px',
          }}
        >
          <div style={{ color: '#3D7BB7', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Live Transfers</div>
          <motion.div
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: '#61AF39', fontSize: 16, fontWeight: 700, fontFamily: 'monospace' }}
          >$2.4M</motion.div>
          <div style={{ color: '#3D7BB7', fontSize: 8 }}>in last 60s</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(61,123,183,0.4)',
            borderRadius: 12, padding: '8px 12px',
            textAlign: 'right',
          }}
        >
          <div style={{ color: '#3D7BB7', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Active Routes</div>
          <motion.div
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            style={{ color: '#3D7BB7', fontSize: 16, fontWeight: 700, fontFamily: 'monospace' }}
          >{ROUTES.length}</motion.div>
          <div style={{ color: '#3D7BB7', fontSize: 8 }}>global corridors</div>
        </motion.div>
      </div>

      {/* Orbiting country flags */}
      <div className="relative z-10" style={{ width: RX * 2, height: RY * 2 }}>
        {[
          { flag: '🇬🇭', name: 'Ghana',    angle: 0   },
          { flag: '🇰🇪', name: 'Kenya',    angle: 90  },
          { flag: '🇸🇳', name: 'Senegal',  angle: 180 },
          { flag: '🇩🇴', name: 'Dominican', angle: 270 },
        ].map(({ flag, name, angle }, idx) => (
          <motion.div
            key={name}
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 0 }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: RX * 2 + 60,
              height: RY * 2 + 60,
              marginTop: -(RY + 30),
              marginLeft: -(RX + 30),
              transformOrigin: 'center center',
              rotate: angle,
            }}
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 0 }}
              style={{
                position: 'absolute',
                top: 0, left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 10,
                padding: '4px 8px',
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{flag}</span>
              <span style={{ color: '#fff', fontSize: 8, fontWeight: 700 }}>{name}</span>
            </motion.div>
          </motion.div>
        ))}

        {/* Globe SVG */}
        <svg
          ref={svgRef}
          width={RX * 2}
          height={RY * 2}
          viewBox={`0 0 ${RX * 2} ${RY * 2}`}
          style={{ overflow: 'visible', position: 'absolute', top: 0, left: 0, zIndex: 2 }}
        >
        <defs>
          <radialGradient id="globeGradTP" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#e8f0f8" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#c8ddef" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="rimGlowTP" cx="50%" cy="50%" r="50%">
            <stop offset="75%" stopColor="#3D7BB7" stopOpacity="0" />
            <stop offset="100%" stopColor="#3D7BB7" stopOpacity="0.5" />
          </radialGradient>
          {[['#3D7BB7','#61AF39'],['#61AF39','#2479C2'],['#F88F2B','#3D7BB7'],['#5FAE2E','#2479C2'],['#2479C2','#61AF39']].map(([c1,c2], i) => (
            <linearGradient key={i} id={`arcTP${i}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="280" y2="0">
              <stop offset="0%" stopColor={c1} stopOpacity="0.1" />
              <stop offset="50%" stopColor={c1} stopOpacity="0.95" />
              <stop offset="100%" stopColor={c2} stopOpacity="0.1" />
            </linearGradient>
          ))}
          <filter id="tpGlow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="tpStrongGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* Globe base */}
        <circle cx={RX} cy={RY} r={RX - 2} fill="url(#globeGradTP)" />
        <circle cx={RX} cy={RY} r={RX - 2} fill="none" stroke="url(#rimGlowTP)" strokeWidth="18" />
        <circle cx={RX} cy={RY} r={RX - 2} fill="none" stroke="#3D7BB7" strokeWidth="1" strokeOpacity="0.5" />

        {/* Grid lines */}
        {[-60,-30,0,30,60].map(lat => {
          const y = RY + (RY-4) * Math.sin((lat*Math.PI)/180) * -1;
          const r = (RX-4) * Math.cos((lat*Math.PI)/180);
          return r > 0 ? <ellipse key={lat} cx={RX} cy={y} rx={r} ry={r*0.13} fill="none" stroke="#3D7BB7" strokeWidth="0.4" strokeOpacity="0.2" /> : null;
        })}
        {[0,30,60,90,120,150].map(lon => (
          <ellipse key={lon} cx={RX} cy={RY} rx={(RX-4)*Math.abs(Math.cos((lon*Math.PI)/180))} ry={RY-4}
            fill="none" stroke="#61AF39" strokeWidth="0.4" strokeOpacity="0.15" />
        ))}

        {/* Glow arcs */}
        {ROUTES.map((_, i) => (
          <path key={i} id={`glow-${i}`} fill="none" stroke="#3D7BB7" strokeWidth="5" strokeLinecap="round"
            style={{ filter:'blur(4px)', opacity: 0 }} />
        ))}
        {/* Arc lines */}
        {ROUTES.map((_, i) => (
          <path key={i} id={`arc-${i}`} fill="none"
            stroke={`url(#arcTP${i % 5})`} strokeWidth="1.2" strokeLinecap="round"
            style={{ opacity: 0 }} filter="url(#tpGlow)" />
        ))}

        {/* Pulse rings */}
        {HUBS.map(hub => (
          <circle key={hub.id} id={`ring-${hub.id}`} cx={RX} cy={RY} r={5}
            fill="none" stroke={hub.color} strokeWidth="1.2" style={{ opacity: 0 }} />
        ))}

        {/* Glow blobs */}
        {HUBS.map(hub => (
          <circle key={hub.id} id={`pulse-${hub.id}`} cx={RX} cy={RY} r={7}
            fill={hub.color} style={{ opacity: 0, filter:'blur(4px)' }} />
        ))}

        {/* Moving dots */}
        {ROUTES.map((route, i) => (
          <circle key={i} id={`dot-${i}`} cx={RX} cy={RY} r={2.5}
            fill={HUBS.find(h => h.id === route[0])?.color || '#3D7BB7'}
            style={{ opacity: 0 }} filter="url(#tpGlow)" />
        ))}

        {/* Hub dots */}
        {HUBS.map(hub => (
          <circle key={hub.id} id={`hub-${hub.id}`} cx={RX} cy={RY} r={4}
            fill={hub.color} style={{ opacity: 0 }} filter="url(#tpStrongGlow)" />
        ))}

        {/* Labels */}
        {HUBS.map(hub => (
          <text key={hub.id} id={`label-${hub.id}`} x={RX} y={RY}
            fill={hub.color} fontSize="8" fontWeight="700" fontFamily="monospace"
            style={{ opacity: 0, letterSpacing:'0.05em' }}>
            {hub.currency}
          </text>
        ))}

        {/* Shine */}
        <ellipse cx={RX*0.65} cy={RY*0.55} rx={35} ry={20} fill="white" style={{ opacity:0.04 }} />
      </svg>
      </div>

      {/* Currency pill */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="relative z-10 flex gap-3 items-center px-4 py-2 mt-1"
        style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(97,175,57,0.3)',
          borderRadius: 24,
        }}
      >
        {CURRENCIES.map(({ currency, color }, idx) => (
          <motion.div
            key={currency}
            animate={{ scale: [1, 1.15, 1], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 2 + idx * 0.3, repeat: Infinity, delay: idx * 0.2 }}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 2 }}
          >
            <div style={{ width: 7, height: 7, borderRadius:'50%', backgroundColor: color, boxShadow:`0 0 6px ${color}` }} />
            <span style={{ color, fontSize: 8, fontWeight: 700, fontFamily:'monospace', letterSpacing:'0.04em' }}>{currency}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}