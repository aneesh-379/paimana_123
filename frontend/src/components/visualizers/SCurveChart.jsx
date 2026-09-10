import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot
} from 'recharts';
import { generateSCurveData, getValue } from '../../data/mockProjects';
import { AlertCircle, CheckCircle, TrendingDown, Info } from 'lucide-react';
import Badge from '../common/Badge';

export default function SCurveChart({ project }) {
  if (!project) return null;

  const { timeline, currentMonth, progressGap, financialGap } = generateSCurveData(project);
  const currentPoint = timeline.find(p => p.month === currentMonth) || timeline[Math.floor(timeline.length / 2)];

  const isLagging = parseFloat(progressGap) < 0;
  const absGap = Math.abs(parseFloat(progressGap));

  return (
    <div className="space-y-4">
      {/* Interpretation Alert Box */}
      <div
        className={`p-3.5 rounded-lg border flex items-start gap-3 text-xs font-sans ${
          isLagging
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}
      >
        {isLagging ? (
          <TrendingDown className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
        ) : (
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
        )}
        <div className="space-y-0.5">
          <h5 className="font-semibold text-xs text-slate-900">
            {isLagging ? 'Schedule Milestone Slippage Identified' : 'Schedule Pacing On Target'}
          </h5>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            Actual physical progress of <strong>{getValue(project.physical_progress)}%</strong> is{' '}
            <strong className={isLagging ? 'text-rose-600 font-mono' : 'text-emerald-700 font-mono'}>
              {absGap}% {isLagging ? 'behind' : 'ahead of'}
            </strong>{' '}
            the cumulative planned baseline trajectory. Financial disbursement leads physical completion by{' '}
            <strong className="font-mono text-amber-700 font-semibold">+{financialGap}%</strong>.
          </p>
        </div>
      </div>

      {/* Recharts S-Curve */}
      <div className="h-64 w-full bg-slate-50/70 p-2 rounded-xl border border-slate-200">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeline} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="month"
              stroke="#64748B"
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#64748B"
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(value, name) => [`${value}%`, name]}
              labelFormatter={(label) => `Milestone Timeline: ${label}`}
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
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-mono)', paddingTop: '6px' }} />

            {/* Planned S-Curve (Smooth Baseline) */}
            <Line
              type="monotone"
              dataKey="plannedProgress"
              name="Planned S-Curve"
              stroke="#7C3AED"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />

            {/* Actual Physical Progress */}
            <Line
              type="monotone"
              dataKey="actualProgress"
              name="Actual Physical Progress"
              stroke="#E11D48"
              strokeWidth={2.5}
              connectNulls={false}
              dot={{ r: 3, fill: '#E11D48' }}
            />

            {/* Financial Expenditure Curve */}
            <Line
              type="monotone"
              dataKey="financialExp"
              name="Financial Outflow"
              stroke="#D97706"
              strokeWidth={1.5}
              dot={false}
            />

            {/* Current Evaluation Point Indicator */}
            {currentPoint && (
              <ReferenceDot
                x={currentPoint.month}
                y={currentPoint.actualProgress || 42}
                r={6}
                fill="#E11D48"
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 px-1">
        <span>Baseline Sanction: {getValue(project.sanction_date, '2024-03-01')}</span>
        <span>Original DOC: {getValue(project.original_doc, '2027-12-31')}</span>
      </div>
    </div>
  );
}
