import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';
import { RISK_RADAR_DATA } from '../../data/mospiConstants';
import Badge from '../common/Badge';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export default function RiskRadarChart({
  radarData = RISK_RADAR_DATA,
  compositeScore = 87,
  tier = 'CRITICAL'
}) {
  // Sort factors by highest risk score for ranked linear bars
  const sortedFactors = [...radarData].sort((a, b) => b.score - a.score);

  return (
    <div className="cockpit-card p-5 space-y-4 bg-white border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <h3 className="font-sans font-semibold text-sm text-slate-900">
            Multi-Factor Risk Scoring Framework
          </h3>
        </div>
        <Badge variant={tier === 'CRITICAL' ? 'critical' : tier === 'HIGH' ? 'warning' : 'success'}>
          TIER 1: {tier} MONITORING
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Radar Chart (6 cols) */}
        <div className="md:col-span-6 flex flex-col items-center justify-center p-3 bg-slate-50/70 rounded-xl border border-slate-200">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-mono text-4xl font-bold text-rose-600 tracking-tight">
              {compositeScore}
            </span>
            <span className="font-mono text-xs text-slate-500">/ 100 Composite Score</span>
          </div>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#CBD5E1" />
                <PolarAngleAxis
                  dataKey="factor"
                  stroke="#64748B"
                  tick={{ fontSize: 9, fontFamily: 'var(--font-mono)', fill: '#334155' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  stroke="#E2E8F0"
                  tick={false}
                />
                <Radar
                  name="Risk Level"
                  dataKey="score"
                  stroke="#E11D48"
                  fill="#E11D48"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Tooltip
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
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranked Linear Factor Bars (6 cols) */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-500 pb-1 border-b border-slate-100">
            <span className="font-mono uppercase tracking-wider text-[10px]">Ranked Risk Factor</span>
            <span className="font-mono uppercase tracking-wider text-[10px]">Severity Index</span>
          </div>

          <div className="space-y-2.5">
            {sortedFactors.map((rf, idx) => {
              const isHigh = rf.score >= 80;
              const isMed = rf.score >= 60 && rf.score < 80;

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-sans">
                    <span className="text-slate-800 font-medium">{rf.factor}</span>
                    <span
                      className={`font-mono font-bold text-xs ${
                        isHigh ? 'text-rose-600' : isMed ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      {rf.score} / 100
                    </span>
                  </div>
                  <div className="cockpit-progress-track bg-slate-100">
                    <div
                      className="cockpit-progress-fill"
                      style={{
                        width: `${rf.score}%`,
                        backgroundColor: isHigh ? '#E11D48' : isMed ? '#D97706' : '#059669'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-100">
            <span>Primary Escalation Vector:</span>
            <strong className="text-rose-600 font-semibold">{sortedFactors[0]?.factor || 'Schedule Risk'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
