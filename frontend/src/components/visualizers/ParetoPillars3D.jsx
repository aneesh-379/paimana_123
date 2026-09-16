import React, { useState, useRef } from 'react';
import { Layers, Sparkles, TrendingUp, Info } from 'lucide-react';
import Badge from '../common/Badge';

/**
 * ParetoPillars3D - 3D Volumetric Extruded Glass Pillars Visualizer
 * Renders root-cause escalation factors as tactile 3D monolithic pillars
 * with interactive perspective tilt, specular reflection, and floating metric badges.
 */
export default function ParetoPillars3D({
  drivers = [
    { driver: 'Land Acquisition & RoW Handover', impactPct: 34.2, color: '#BE123C', tag: 'PRIMARY BOTTLENECK' },
    { driver: 'Statutory Forest Clearances', impactPct: 22.8, color: '#D97706', tag: 'ENVIRONMENTAL' },
    { driver: 'High-Tension Utility Shifting', impactPct: 18.5, color: '#7C3AED', tag: 'INTER-AGENCY' },
    { driver: 'Contractor Liquidity Deficit', impactPct: 14.1, color: '#0284C7', tag: 'FINANCIAL' },
    { driver: 'Detailed Project Report (DPR) Scope Revision', impactPct: 10.4, color: '#059669', tag: 'ENGINEERING' }
  ]
}) {
  const containerRef = useRef(null);
  const [rotX, setRotX] = useState(12);
  const [rotY, setRotY] = useState(-8);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = 12 + ((y - centerY) / centerY) * -14;
    const rY = -8 + ((x - centerX) / centerX) * 16;
    setRotX(rX);
    setRotY(rY);
  };

  const handleMouseLeave = () => {
    setRotX(12);
    setRotY(-8);
    setHoveredIdx(null);
  };

  const maxPct = Math.max(...drivers.map(d => d.impactPct), 35);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="cockpit-card bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Dynamic Background Glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{
          background: hoveredIdx !== null ? drivers[hoveredIdx].color : '#7C3AED',
          transition: 'background 0.4s ease'
        }}
      />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-15 bg-indigo-600" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-800/80 relative z-20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="font-sans font-bold text-sm text-white tracking-tight">
              3D Volumetric Escalation Drivers (Pareto Monoliths)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/60">
              Tactile 3D Tilt
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Systemic cost overrun attribution across central sector portfolios. Move cursor to tilt 3D perspective.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple">MoSPI 20-Yr Corpus</Badge>
          <Badge variant="warning">Top 5 Determinants</Badge>
        </div>
      </div>

      {/* 3D Isometric Monolith Stage */}
      <div className="relative py-8 min-h-[340px] flex items-end justify-center">
        {/* Isometric Grid Floor Plane */}
        <div
          className="absolute inset-x-8 bottom-4 h-32 rounded-xl border border-slate-700/40 opacity-40 pointer-events-none"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(0deg) translateZ(-40px)`,
            backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.15) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            boxShadow: '0 0 40px rgba(0,0,0,0.8) inset'
          }}
        />

        {/* 3D Pillars Row */}
        <div
          className="grid grid-cols-5 gap-4 sm:gap-6 w-full max-w-4xl relative z-10"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)'
          }}
        >
          {drivers.map((driver, idx) => {
            const heightPct = Math.round((driver.impactPct / maxPct) * 100);
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                className="flex flex-col items-center justify-end cursor-pointer group relative"
                style={{
                  height: '240px',
                  transform: isHovered ? 'translateZ(30px) scale(1.04)' : 'translateZ(0px)',
                  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                {/* Floating Metric Tag above Pillar */}
                <div
                  className={`mb-2 text-center transition-all duration-200 ${
                    isHovered ? 'opacity-100 -translate-y-1' : 'opacity-85'
                  }`}
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <span
                    className="font-mono font-bold text-xs sm:text-sm px-2 py-0.5 rounded shadow-lg border"
                    style={{
                      backgroundColor: `${driver.color}22`,
                      borderColor: `${driver.color}88`,
                      color: isHovered ? '#FFFFFF' : '#E2E8F0',
                      boxShadow: isHovered ? `0 0 16px ${driver.color}88` : 'none'
                    }}
                  >
                    {driver.impactPct}%
                  </span>
                </div>

                {/* 3D Extruded Pillar Box */}
                <div
                  className="w-12 sm:w-16 relative rounded-t-lg transition-all duration-300"
                  style={{
                    height: `${Math.max(28, heightPct * 2)}px`,
                    transformStyle: 'preserve-3d',
                    background: `linear-gradient(to top, rgba(15,23,42,0.9), ${driver.color}dd)`
                  }}
                >
                  {/* Front Facet */}
                  <div
                    className="absolute inset-0 rounded-t-lg border-t border-x overflow-hidden"
                    style={{
                      borderColor: `${driver.color}`,
                      background: `linear-gradient(135deg, ${driver.color}cc 0%, rgba(15,23,42,0.95) 100%)`,
                      boxShadow: isHovered ? `0 0 24px ${driver.color}aa` : `0 4px 12px ${driver.color}44`
                    }}
                  >
                    {/* Internal Specular Sheen */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
                    {/* Glowing Core Pulse */}
                    <div
                      className="absolute inset-x-1 bottom-1 h-3 rounded-full opacity-70 animate-pulse"
                      style={{ backgroundColor: driver.color }}
                    />
                  </div>

                  {/* Top Cap (3D Isometric Cap) */}
                  <div
                    className="absolute -top-3 inset-x-0 h-3 rounded-xs border"
                    style={{
                      transform: 'rotateX(60deg) translateY(-2px)',
                      backgroundColor: isHovered ? '#FFFFFF' : `${driver.color}`,
                      borderColor: '#FFFFFF',
                      boxShadow: `0 0 10px ${driver.color}`
                    }}
                  />

                  {/* Right Side Shadow Facet */}
                  <div
                    className="absolute top-0 -right-2.5 bottom-0 w-2.5 rounded-tr-lg"
                    style={{
                      transform: 'skewY(-35deg) translateY(-2px)',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      borderRight: '1px solid rgba(255,255,255,0.1)'
                    }}
                  />
                </div>

                {/* Ground Shadow Ellipse */}
                <div
                  className="w-14 h-3 rounded-full mt-2 transition-opacity"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.65)',
                    filter: 'blur(3px)',
                    opacity: isHovered ? 0.9 : 0.6
                  }}
                />

                {/* Bottom Rank Label */}
                <span className="font-mono text-[11px] font-bold text-slate-400 mt-1">
                  #{idx + 1}
                </span>
                <span className="font-sans text-[10px] text-slate-400 text-center line-clamp-2 max-w-[80px] leading-tight mt-0.5">
                  {driver.driver.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Detail Drawer for Hovered Factor */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans relative z-20">
        <div className="flex items-center gap-3">
          <span
            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: hoveredIdx !== null ? drivers[hoveredIdx].color : '#7C3AED' }}
          />
          <div>
            <strong className="text-white block font-medium">
              {hoveredIdx !== null ? drivers[hoveredIdx].driver : 'Hover or tap any 3D pillar to isolate variance driver'}
            </strong>
            <span className="text-slate-400 text-[11px] font-mono">
              {hoveredIdx !== null
                ? `Systemic Impact: ${drivers[hoveredIdx].impactPct}% of total central sector cost escalation`
                : 'Interactive 3D Pareto Attribution Matrix'}
            </span>
          </div>
        </div>

        {hoveredIdx !== null && (
          <span
            className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-md border"
            style={{
              backgroundColor: `${drivers[hoveredIdx].color}22`,
              borderColor: `${drivers[hoveredIdx].color}66`,
              color: '#FFFFFF'
            }}
          >
            {drivers[hoveredIdx].tag}
          </span>
        )}
      </div>
    </div>
  );
}
