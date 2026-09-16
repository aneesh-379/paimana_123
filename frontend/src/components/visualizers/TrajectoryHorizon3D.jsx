import React, { useState, useRef } from 'react';
import { TrendingUp, Clock, AlertTriangle, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import Badge from '../common/Badge';

/**
 * TrajectoryHorizon3D - 3D Project Trajectory Horizon (S-Curve & Milestone Horizon)
 * Renders an interactive 3D perspective stage showing Planned vs Actual vs Forecasted
 * completion curves with extruded milestone monoliths and dynamic mouse tilt physics.
 */
export default function TrajectoryHorizon3D({
  projectCode = 'PAIM-619054',
  projectName = 'Greenfield Expressway Expansion',
  baselineCost = 1162.76,
  simulatedCost = 1390.00,
  baselineDelay = 16.5,
  simulatedDelay = 19.5,
  physicalProgress = 42.1
}) {
  const containerRef = useRef(null);
  const [rotX, setRotX] = useState(14);
  const [rotY, setRotY] = useState(-6);
  const [activeMilestone, setActiveMilestone] = useState(1);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = 14 + ((y - centerY) / centerY) * -12;
    const rY = -6 + ((x - centerX) / centerX) * 14;
    setRotX(rX);
    setRotY(rY);
  };

  const handleMouseLeave = () => {
    setRotX(14);
    setRotY(-6);
  };

  const milestones = [
    { id: 0, month: 'M06', label: 'Land & RoW Clearances', plannedPct: 25, actualPct: 22, status: 'DONE', delay: '+1.5 mo' },
    { id: 1, month: 'M14', label: 'Package IV Earthwork & Drainage', plannedPct: 50, actualPct: 42, status: 'ACTIVE', delay: '+4.2 mo' },
    { id: 2, month: 'M24', label: 'Major Bridge Piers & Viaducts', plannedPct: 75, actualPct: 54, status: 'BOTTLENECK', delay: '+7.8 mo' },
    { id: 3, month: 'M36', label: 'Pavement & MoSPI Commissioning', plannedPct: 100, actualPct: 78, status: 'FORECAST', delay: `+${simulatedDelay} mo` }
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="cockpit-card bg-gradient-to-b from-slate-900 via-[#0D1527] to-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden select-none"
      style={{ perspective: '1100px' }}
    >
      {/* Ambient Lighting Gradients */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-20 bg-purple-600" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-20 bg-emerald-600" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-800 relative z-20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-sans font-bold text-sm text-white tracking-tight">
              3D Dynamic Trajectory Horizon (S-Curve Monoliths)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700/60">
              Real-Time 3D Projection
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulated capital-schedule trajectory vs contractual baseline. Hover across milestone monoliths.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple">Physical Progress: {physicalProgress}%</Badge>
          <Badge variant="warning">Slippage: +{simulatedDelay} Mo</Badge>
        </div>
      </div>

      {/* 3D Perspective Stage */}
      <div className="relative py-6 min-h-[300px] flex items-center justify-center">
        {/* Isometric Grid Surface */}
        <div
          className="absolute inset-x-6 inset-y-4 rounded-2xl border border-slate-700/30 opacity-30 pointer-events-none"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(-50px)`,
            backgroundImage: 'linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* 3D Milestone Monoliths & Ribbons */}
        <div
          className="w-full max-w-4xl relative z-10 space-y-6"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)'
          }}
        >
          {/* Milestone Columns Grid */}
          <div className="grid grid-cols-4 gap-3 sm:gap-6 items-end h-52">
            {milestones.map((m) => {
              const isSelected = activeMilestone === m.id;
              const barHeight = m.actualPct * 1.8;

              return (
                <div
                  key={m.id}
                  onClick={() => setActiveMilestone(m.id)}
                  className="flex flex-col items-center justify-end cursor-pointer group relative"
                  style={{
                    transform: isSelected ? 'translateZ(32px)' : 'translateZ(0px)',
                    transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  {/* Floating Tag */}
                  <div
                    className="mb-2 text-center transition-transform"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    <span
                      className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded shadow-lg border ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-400 ring-2 ring-purple-500/30'
                          : 'bg-slate-800/90 text-slate-300 border-slate-700'
                      }`}
                    >
                      {m.actualPct}%
                    </span>
                  </div>

                  {/* 3D Extruded Monolith Pillar */}
                  <div
                    className="w-14 sm:w-20 relative rounded-t-lg transition-all duration-300"
                    style={{
                      height: `${Math.max(40, barHeight)}px`,
                      transformStyle: 'preserve-3d',
                      background: isSelected
                        ? 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)'
                        : 'linear-gradient(135deg, #334155 0%, #1E293B 100%)',
                      boxShadow: isSelected
                        ? '0 0 30px rgba(124, 58, 237, 0.6)'
                        : '0 8px 16px rgba(0,0,0,0.4)'
                    }}
                  >
                    {/* Front Face Glass Reflection */}
                    <div className="absolute inset-0 rounded-t-lg border-t border-x border-white/20 overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
                      {/* Pulse beacon for active milestone */}
                      {m.status === 'ACTIVE' && (
                        <div className="absolute bottom-2 inset-x-2 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>

                    {/* Top 3D Cap */}
                    <div
                      className="absolute -top-3 inset-x-0 h-3 rounded-xs border border-white/40"
                      style={{
                        transform: 'rotateX(60deg) translateY(-2px)',
                        backgroundColor: isSelected ? '#A78BFA' : '#64748B'
                      }}
                    />

                    {/* Right Facet Shadow */}
                    <div
                      className="absolute top-0 -right-2.5 bottom-0 w-2.5 rounded-tr-lg"
                      style={{
                        transform: 'skewY(-35deg) translateY(-2px)',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRight: '1px solid rgba(255,255,255,0.1)'
                      }}
                    />
                  </div>

                  {/* Baseline Target Marker (Ghost line) */}
                  <div
                    className="absolute w-16 sm:w-22 border-t-2 border-dashed border-amber-400/80 z-20 pointer-events-none"
                    style={{
                      bottom: `${m.plannedPct * 1.8}px`
                    }}
                  >
                    <span className="absolute -top-3.5 right-0 text-[9px] font-mono text-amber-300">
                      Planned {m.plannedPct}%
                    </span>
                  </div>

                  {/* Bottom Milestone Info */}
                  <div className="text-center mt-2.5">
                    <span className="font-mono text-[11px] font-bold text-slate-300 block">
                      {m.month}
                    </span>
                    <span className="font-sans text-[10px] text-slate-400 line-clamp-1 max-w-[90px]">
                      {m.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trajectory Horizon Metrics Bar */}
      <div className="mt-2 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono relative z-20">
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 block uppercase">Inspected Milestone</span>
          <strong className="text-white block font-sans">
            {milestones[activeMilestone].label}
          </strong>
          <span className="text-purple-400 text-[11px]">
            Variance: {milestones[activeMilestone].delay} schedule slippage
          </span>
        </div>

        <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-700/80 sm:pl-3">
          <span className="text-[10px] text-slate-400 block uppercase">Financial Trajectory</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-300">₹{baselineCost} Cr</span>
            <span className="text-slate-500">→</span>
            <strong className="text-rose-400">₹{simulatedCost} Cr</strong>
          </div>
          <span className="text-rose-400 text-[11px]">
            +₹{(simulatedCost - baselineCost).toFixed(2)} Cr (+{(((simulatedCost - baselineCost) / baselineCost) * 100).toFixed(1)}%)
          </span>
        </div>

        <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-700/80 sm:pl-3">
          <span className="text-[10px] text-slate-400 block uppercase">Critical Path Remediation</span>
          <strong className="text-emerald-400 block">14-Day Statutory Directive</strong>
          <span className="text-slate-400 text-[11px]">
            GCC Clause 14.1 Resource Mobilization
          </span>
        </div>
      </div>
    </div>
  );
}
