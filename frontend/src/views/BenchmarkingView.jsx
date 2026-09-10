import React from 'react';
import {
  BarChart2,
  TrendingUp,
  Building,
  Layers,
  Award,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { AGENCY_BENCHMARK_DATA, SCATTER_OVERRUN_DATA } from '../data/mospiConstants';
import Badge from '../components/common/Badge';

export default function BenchmarkingView() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="font-sans font-bold text-xl text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-purple-700" />
            Sector & Implementing Agency Benchmarking Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Comparative performance metrics, historical cost overruns, and schedule delay vectors across Central Public Sector Undertakings (CPSUs).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple">MoSPI Peer Indexing</Badge>
          <Badge variant="neutral">5 Major Agencies</Badge>
        </div>
      </div>

      {/* Visualizers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Agency Overrun Bar Chart (6 cols) */}
        <div className="lg:col-span-6 cockpit-card p-5 space-y-4 bg-white border border-slate-200">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-sans font-semibold text-sm text-slate-900">
              Agency Average Cost Overrun (%)
            </h3>
            <Badge variant="neutral">Historical Average</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AGENCY_BENCHMARK_DATA} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="agency" stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} width={85} />
                <Tooltip
                  formatter={(v) => [`${v}% Average Overrun`, 'Cost Escalation']}
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
                <Bar dataKey="avgOverrunPct" name="Average Cost Overrun" fill="#7C3AED" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delay vs Overrun Scatter Matrix (6 cols) */}
        <div className="lg:col-span-6 cockpit-card p-5 space-y-4 bg-white border border-slate-200">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-sans font-semibold text-sm text-slate-900">
              Matrix: Schedule Delay (Months) vs. Cost Escalation (%)
            </h3>
            <Badge variant="purple">Holdout Cohort</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Delay (Months)"
                  stroke="#64748B"
                  tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
                  label={{ value: 'Delay (Months)', position: 'insideBottom', offset: -10, fill: '#64748B', fontSize: 10 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Cost Overrun (%)"
                  stroke="#64748B"
                  tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
                  label={{ value: 'Cost Overrun (%)', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 10 }}
                />
                <ZAxis type="number" dataKey="z" range={[80, 260]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
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
                <Scatter name="Projects" data={SCATTER_OVERRUN_DATA} fill="#6366F1" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Agency Benchmark Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {AGENCY_BENCHMARK_DATA.map((ag, idx) => (
          <div key={idx} className="cockpit-card p-4 space-y-2 text-center bg-white border border-slate-200 hover:border-purple-200 transition-colors">
            <span className="font-sans font-bold text-base text-slate-900 block">
              {ag.agency}
            </span>
            <span className="text-[10px] text-slate-500 block truncate">{ag.sector}</span>

            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-slate-500">Overrun:</span>
                <strong className="text-rose-600 font-semibold">+{ag.avgOverrunPct}%</strong>
              </div>
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-slate-500">Avg Delay:</span>
                <strong className="text-amber-700 font-semibold">{ag.avgDelayMonths} Mo</strong>
              </div>
            </div>

            <div className="pt-1">
              <Badge variant="neutral" className="text-[10px] w-full justify-center">
                {ag.count} Projects Tracked
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Comparative Interpretation */}
      <div className="p-4 rounded-lg bg-purple-50/60 border border-purple-100 text-xs font-sans text-slate-700 leading-relaxed">
        <strong className="text-purple-950 font-semibold block mb-1">
          Agency Benchmark Synthesis:
        </strong>
        Historically across MoSPI records, linear infrastructure executing agencies (<strong>DFCCIL</strong> and <strong>RVNL</strong>) experience higher average schedule delays (22–24.5 months) and cost escalations (~21–24%) due to multi-state contiguous land corridor acquisition challenges, whereas standalone point-infrastructure agencies (<strong>POWERGRID</strong>) maintain the lowest overrun rates (6.2% cost escalation, 5.8 months delay).
      </div>
    </div>
  );
}
