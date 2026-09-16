import React, { useRef, useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import Badge from '../common/Badge';

export default function RiskGauge3D({
  score = 84,
  maxScore = 100,
  label = 'National Composite Risk Index',
  subLabel = 'MoSPI Early Warning Benchmark',
  size = 'md'
}) {
  const containerRef = useRef(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    setRotX(((y - cy) / cy) * -10);
    setRotY(((x - cx) / cx) * 10);
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.25 });
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  // Calculate needle angle (-90deg to +90deg)
  const normalizedScore = Math.max(0, Math.min(maxScore, score));
  const angleDeg = -90 + (normalizedScore / maxScore) * 180;

  // Determine tier & theme
  const isHighRisk = score >= 70;
  const isMediumRisk = score >= 40 && score < 70;
  const themeColor = isHighRisk ? '#BE123C' : isMediumRisk ? '#D97706' : '#059669';
  const tierBadge = isHighRisk ? 'TIER 1 · CRITICAL' : isMediumRisk ? 'TIER 2 · MONITOR' : 'TIER 3 · STABLE';
  const badgeVariant = isHighRisk ? 'critical' : isMediumRisk ? 'warning' : 'success';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        transition: 'transform 0.16s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.25s ease'
      }}
      className="group relative p-5 rounded-2xl bg-gradient-to-b from-white via-slate-50 to-slate-100/80 border border-slate-200/90 shadow-[0_12px_28px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_36px_-6px_rgba(190,18,60,0.18)] preserve-3d cursor-pointer select-none overflow-hidden"
    >
      {/* Dynamic surface glare */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.7) 0%, transparent 60%)`,
          opacity: glare.opacity
        }}
      />

      {/* Top Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-200/70" style={{ transform: 'translateZ(12px)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-rose-100/80 text-rose-700 flex items-center justify-center font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <span className="font-sans font-bold text-xs text-slate-900 tracking-tight">
            {label}
          </span>
        </div>
        <Badge variant={badgeVariant} className="text-[9px] shadow-2xs font-bold">
          {tierBadge}
        </Badge>
      </div>

      {/* 3D Volumetric Semi-Circular Gauge Visual */}
      <div className="relative flex flex-col items-center justify-center pt-4 pb-2" style={{ transform: 'translateZ(20px)' }}>
        <svg viewBox="0 0 220 130" className="w-48 h-28 overflow-visible">
          <defs>
            {/* 3D Arc Gradient */}
            <linearGradient id="gaugeArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="75%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>

            {/* Needle metallic 3D gradient */}
            <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Drop shadow */}
            <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" floodColor="#0F172A" />
            </filter>
          </defs>

          {/* Background Outer Arc */}
          <path
            d="M 25 110 A 85 85 0 0 1 195 110"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <path
            d="M 25 110 A 85 85 0 0 1 195 110"
            fill="none"
            stroke="url(#gaugeArcGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="267"
            strokeDashoffset={267 - (267 * (normalizedScore / maxScore))}
            filter="url(#gaugeShadow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Volumetric Tick Marks */}
          {[0, 25, 50, 75, 100].map((tickVal) => {
            const rad = (-180 + (tickVal / 100) * 180) * (Math.PI / 180);
            const x1 = 110 + 98 * Math.cos(rad);
            const y1 = 110 + 98 * Math.sin(rad);
            const x2 = 110 + 106 * Math.cos(rad);
            const y2 = 110 + 106 * Math.sin(rad);
            return (
              <line
                key={tickVal}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#64748B"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {/* 3D Rotating Needle */}
          <g
            transform={`translate(110, 110) rotate(${angleDeg})`}
            className="transition-transform duration-700 ease-out"
            filter="url(#gaugeShadow)"
          >
            {/* Needle blade */}
            <polygon
              points="0,-78 -4,-12 4,-12"
              fill={themeColor}
            />
            {/* Pivot cap */}
            <circle cx="0" cy="0" r="10" fill="url(#needleGrad)" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
          </g>
        </svg>

        {/* Center Volumetric Score Badge */}
        <div className="-mt-3 text-center" style={{ transform: 'translateZ(25px)' }}>
          <div className="flex items-baseline justify-center gap-1">
            <span
              className="font-mono text-4xl font-extrabold tracking-tight drop-shadow-sm"
              style={{ color: themeColor }}
            >
              {score}
            </span>
            <span className="font-mono text-xs text-slate-400 font-bold">/ 100</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 block -mt-0.5">
            {subLabel}
          </span>
        </div>
      </div>

      {/* Footer Benchmark Comparison */}
      <div className="pt-2 border-t border-slate-200/70 flex justify-between items-center text-[10px] font-mono text-slate-500" style={{ transform: 'translateZ(10px)' }}>
        <span>Sanction Limit: 60/100</span>
        <strong className="text-rose-700 font-bold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-rose-600" /> +24 Pts Above Threshold
        </strong>
      </div>
    </div>
  );
}
