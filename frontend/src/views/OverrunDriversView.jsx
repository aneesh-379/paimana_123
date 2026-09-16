import React from 'react';
import { TrendingUp, PieChart as PieIcon, Layers } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ESCALATION_DRIVERS_DATA } from '../data/mospiConstants';
import Badge from '../components/common/Badge';
import Card3D from '../components/common/Card3D';
import ParetoPillars3D from '../components/visualizers/ParetoPillars3D';

export default function OverrunDriversView() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="font-sans font-bold text-xl text-slate-900 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-purple-700" />
            Cost Escalation Root Cause Decomposition (Pareto Analysis)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Systemic attribution of cost overruns across 20+ years of historical MoSPI infrastructure data.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning">Pareto Factor Analysis</Badge>
          <Badge variant="purple">MoSPI Empirical Corpus</Badge>
        </div>
      </div>

      {/* 3D Volumetric Extruded Pareto Monoliths */}
      <ParetoPillars3D />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Donut Chart (5 cols, 3D Interactive) */}
        <Card3D
          tiltDegree={4}
          glowColor="rgba(124, 58, 237, 0.2)"
          className="lg:col-span-5 cockpit-card p-5 space-y-4 bg-white border border-slate-200 shadow-sm"
        >
          <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-sans font-semibold text-sm text-slate-900">
              Escalation Share by Primary Driver
            </h3>
            <span className="font-mono text-[10px] text-slate-500">100% Normalized</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ESCALATION_DRIVERS_DATA}
                  dataKey="impactPct"
                  nameKey="driver"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={4}
                >
                  {ESCALATION_DRIVERS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val}% Contribution`, name]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    color: '#0F172A'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {ESCALATION_DRIVERS_DATA.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-700 truncate max-w-[200px]">{d.driver}</span>
                </div>
                <strong className="font-mono text-slate-900">{d.impactPct}%</strong>
              </div>
            ))}
          </div>
        </Card3D>

        {/* Detailed Driver Cards (7 cols, 3D Interactive) */}
        <div className="lg:col-span-7 space-y-3">
          {ESCALATION_DRIVERS_DATA.map((d, idx) => (
            <Card3D
              key={idx}
              tiltDegree={4}
              glowColor={`${d.color}33`}
              className="cockpit-card p-4 flex items-center justify-between gap-4 bg-white border border-slate-200 shadow-sm"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold" style={{ color: d.color }}>
                    #{idx + 1}
                  </span>
                  <h4 className="font-sans font-semibold text-xs text-slate-900 truncate">
                    {d.driver}
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <div className="cockpit-progress-track flex-1 max-w-xs bg-slate-100">
                    <div
                      className="cockpit-progress-fill"
                      style={{ width: `${d.impactPct * 2.5}%`, backgroundColor: d.color }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold" style={{ color: d.color }}>
                    {d.impactPct}% Impact
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0 font-mono">
                <span className="text-sm font-bold block" style={{ color: d.color }}>
                  ₹{(d.croresEscalated / 1000).toFixed(0)}K Cr
                </span>
                <span className="text-[9px] text-slate-500 uppercase block tracking-wider">
                  CUMULATIVE ESCALATION
                </span>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </div>
  );
}
