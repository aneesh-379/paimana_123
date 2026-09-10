import React, { useState } from 'react';
import {
  FolderKanban,
  Eye,
  FileText,
  Sliders,
  BrainCircuit,
  BarChart2,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  ShieldAlert,
  Search,
  Upload,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ProjectTable from '../components/projects/ProjectTable';
import { MOSPI_STATS, SECTOR_METRICS_DATA, ESCALATION_DRIVERS_DATA } from '../data/mospiConstants';
import { getValue } from '../data/mockProjects';

export default function DashboardView({
  projects = [],
  onSelectProject,
  onAnalyzeProject,
  onDraftWarning,
  onTriggerQuickAI,
  chatInput,
  setChatInput,
  onOpenSimulator
}) {
  const [localQuery, setLocalQuery] = useState('');

  // Filter top critical projects requiring intervention
  const priorityProjects = projects
    .filter(p => getValue(p.target_is_high_risk) == 1 || p.composite_risk_score >= 75)
    .slice(0, 4);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onTriggerQuickAI(localQuery.trim());
    } else {
      onTriggerQuickAI("Why is Greenfield Expressway Expansion (PAIM-619054) flagged high risk?");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ============================================================
          1. HERO / COMMAND CENTER PANEL (Matching Reference Screenshot)
          ============================================================ */}
      <div className="cockpit-card bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Contextual Badges, Headline, Description & Actions */}
          <div className="lg:col-span-8 space-y-4">
            {/* Contextual Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
                National Infrastructure AI Cockpit
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-soft-pulse" />
                Live Intelligence Stream
              </span>
            </div>

            {/* Large Solid Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              National Infrastructure <br />
              <span className="text-purple-700 font-extrabold">Intelligence System</span>
            </h1>

            {/* Factual Concise Description */}
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Predictive intelligence for monitoring cost escalation, schedule deviation and statutory risk across 1,981 central sector infrastructure projects.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => onTriggerQuickAI("Why is Greenfield Expressway Expansion (PAIM-619054) flagged high risk?")}
                className="font-semibold text-xs px-4 py-2 shadow-sm"
              >
                Inspect Critical Registry
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={onOpenSimulator}
                className="btn-secondary-lavender font-semibold text-xs px-4 py-2"
              >
                Test What-If Sandbox
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => onTriggerQuickAI("Generate MoSPI Level-2 statutory warning notice for PAIM-619054")}
                className="text-xs px-3.5 py-2 font-medium"
              >
                Statutory Notice Draft
              </Button>
            </div>
          </div>

          {/* Right Column: CRITICAL RISK WATCHLIST Panel */}
          <div className="lg:col-span-4">
            <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-xl p-5 sm:p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  CRITICAL RISK WATCHLIST
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-100/80 text-rose-800 border border-rose-200">
                  TIER 1
                </span>
              </div>

              <div>
                <span className="font-mono text-5xl font-extrabold text-rose-800 tracking-tight block">
                  342
                </span>
                <span className="text-xs font-medium text-rose-600 block mt-1">
                  Projects · Cost Escalation &gt;15%
                </span>
              </div>

              <div className="pt-3 border-t border-rose-200/80 space-y-1.5 text-xs font-mono text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Delay Slippage &gt;90d:</span>
                  <strong className="text-slate-800">814 Projects</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Sanctioned Outlay:</span>
                  <strong className="text-slate-800">₹37.13 L Cr</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Net Escalation:</span>
                  <strong className="text-rose-700 font-bold">+₹5.65 L Cr (+15.2%)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          2. SYSTEM STATUS ROW (4 Horizontal Panels matching Reference)
          ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Panel 1: Data Pipeline */}
        <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-4 shadow-sm space-y-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
            DATA PIPELINE
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-soft-pulse" />
            <span className="font-sans font-bold text-sm text-emerald-900">
              OPERATIONAL
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700/80 block">
            1,981 Projects Stream Active
          </span>
        </div>

        {/* Panel 2: Prediction Engine */}
        <div className="bg-purple-50/70 border border-purple-200/70 rounded-xl p-4 shadow-sm space-y-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
            PREDICTION ENGINE
          </span>
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-sm text-purple-900">
              XGBOOST V2.4
            </span>
          </div>
          <span className="text-[11px] font-mono text-purple-700/80 block">
            Random Forest v1.8 Cohort
          </span>
        </div>

        {/* Panel 3: RAG Vector Store */}
        <div className="bg-sky-50/70 border border-sky-200/70 rounded-xl p-4 shadow-sm space-y-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-700 block">
            RAG VECTOR STORE
          </span>
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-sm text-sky-900">
              PGVECTOR ACTIVE
            </span>
          </div>
          <span className="text-[11px] font-mono text-sky-700/80 block">
            GCC & MoSPI Corpus Indexed
          </span>
        </div>

        {/* Panel 4: Governance Gate */}
        <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-4 shadow-sm space-y-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
            GOVERNANCE GATE
          </span>
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-sm text-amber-900">
              HUMAN-IN-LOOP
            </span>
          </div>
          <span className="text-[11px] font-mono text-amber-700/80 block">
            Section 23 Audit Trail
          </span>
        </div>
      </div>

      {/* ============================================================
          3. AI ASSISTANT & FILE INGESTION PANEL (Matching Reference)
          ============================================================ */}
      <div className="cockpit-card bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-sans font-bold text-base text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-purple-700" />
              PAIMANA AI Assistant &amp; File Ingestion
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Query projects or upload supported documents (.CSV project records or .PDF contract agreements) for multi-agent risk synthesis.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              XGBoost ML v2.4
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
              pgvector RAG
            </span>
          </div>
        </div>

        {/* Search Input & Action Button Group */}
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Query projects or describe an issue (e.g. Why is PAIM-619054 delayed? Evaluate GCC Clause 44.1)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs font-sans focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onTriggerQuickAI("Ingest and analyze Project Data CSV for schedule overrun indicators")}
                className="btn-cockpit btn-secondary-lavender text-xs py-1.5 px-3"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-purple-700" />
                <span>Upload CSV</span>
              </button>
              <span className="hidden sm:inline text-[11px] text-slate-400">
                Automated ML inference on CSV · Multi-agent risk synthesis
              </span>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              type="submit"
              className="text-xs font-semibold py-1.5 px-4 shadow-sm"
            >
              Run AI Query
            </Button>
          </div>
        </form>
      </div>

      {/* ============================================================
          4. ASYMMETRIC CONTROL ROOM: IMMEDIATE ATTENTION & REVIEWS (8 cols) + CHARTS (4 cols)
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Projects Requiring Immediate Attention */}
        <div className="lg:col-span-8 space-y-6">
          {/* Action Table */}
          <div className="cockpit-card bg-white p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-sans font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Projects Requiring Immediate Attention
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-risk projects flagged by XGBoost models with cost overrun &gt;15% or schedule slippage &gt;90 days.
                </p>
              </div>
              <Badge variant="critical">
                {priorityProjects.length} Critical Actions
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="cockpit-table text-xs">
                <thead>
                  <tr>
                    <th>Project ID</th>
                    <th>Project Details</th>
                    <th>Risk Score</th>
                    <th>Cost Esc.</th>
                    <th>Delay</th>
                    <th>Primary Root Driver</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {priorityProjects.map((p) => {
                    const code = getValue(p.project_code);
                    const name = getValue(p.project_name);
                    const cost = getValue(p.cost_overrun_pct);
                    const delay = getValue(p.delay_months);
                    const risk = p.composite_risk_score || 84;
                    const sector = getValue(p.sector);

                    return (
                      <tr key={code}>
                        <td className="font-mono font-bold text-purple-700 whitespace-nowrap">
                          {code}
                        </td>
                        <td className="max-w-[200px]">
                          <span className="font-medium text-slate-900 block truncate" title={name}>
                            {name}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {sector} · {getValue(p.implementing_agency)}
                          </span>
                        </td>
                        <td>
                          <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {risk} / 100
                          </span>
                        </td>
                        <td className="font-mono font-semibold text-rose-700 whitespace-nowrap">
                          +{cost}%
                        </td>
                        <td className="font-mono font-semibold text-amber-700 whitespace-nowrap">
                          +{delay} mo
                        </td>
                        <td>
                          <span className="text-slate-600 text-[11px] block max-w-[160px] truncate" title={getValue(p.risk_reason) || "Land acquisition & Right-of-Way pendency"}>
                            {getValue(p.risk_reason) || "Land RoW & Liquidity"}
                          </span>
                        </td>
                        <td className="text-right whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => onSelectProject(p)}
                            className="btn-cockpit btn-ghost text-[11px] py-1 px-2.5 shadow-sm"
                            title="Open Technical Project Dossier"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => onDraftWarning(p)}
                            className="btn-cockpit btn-critical text-[11px] py-1 px-2.5"
                            title="Generate MoSPI Level-2 Statutory Warning Notice"
                          >
                            Notice
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Full Active Surveillance Registry Table */}
          <div className="cockpit-card bg-white p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-sans font-bold text-sm text-slate-900 flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-purple-700" />
                  Active Surveillance Registry
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete searchable inventory of Central Sector Infrastructure projects with real-time audit filters.
                </p>
              </div>
              <Badge variant="cyan">{projects.length} Monitored Projects</Badge>
            </div>

            <ProjectTable
              projects={projects}
              onSelectProject={onSelectProject}
              onAnalyzeProject={onAnalyzeProject}
              onDraftWarning={onDraftWarning}
            />
          </div>
        </div>

        {/* Right Column (4 cols): Capital Allocation Bar Chart & Pareto Drivers */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sector Capital Outlay Chart */}
          <div className="cockpit-card bg-white p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-sans font-bold text-xs text-slate-900">
                  Sector Capital Outlay (₹ Cr)
                </h4>
                <span className="text-[10px] text-slate-500 font-sans">
                  Sanctioned vs Anticipated Outlay
                </span>
              </div>
              <Badge variant="neutral">Top 4 Sectors</Badge>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SECTOR_METRICS_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis
                    dataKey="sector"
                    stroke="#94A3B8"
                    tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: '#64748B' }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    tick={{ fontSize: 9, fontFamily: 'var(--font-mono)', fill: '#64748B' }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: '#0F172A',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                    }}
                    formatter={(val, name) => [`₹${val.toLocaleString()} Cr`, name === 'cost' ? 'Anticipated' : 'Sanctioned']}
                  />
                  <Bar dataKey="sanctioned" fill="#E2E8F0" radius={[4, 4, 0, 0]} name="Sanctioned" />
                  <Bar dataKey="cost" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Anticipated" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-5 text-[11px] font-mono text-slate-600 pt-1 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-300" />
                Sanctioned
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-purple-600" />
                Anticipated Outlay
              </span>
            </div>
          </div>

          {/* Root Cause Escalation Drivers (Pareto) */}
          <div className="cockpit-card bg-white p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h4 className="font-sans font-bold text-xs text-slate-900">
                Top Escalation Root Drivers
              </h4>
              <Badge variant="warning">Pareto Attribution</Badge>
            </div>

            <div className="space-y-3">
              {ESCALATION_DRIVERS_DATA.slice(0, 4).map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-slate-700 font-medium truncate max-w-[200px]">
                      {item.driver}
                    </span>
                    <strong className="font-mono text-slate-900">
                      {item.impactPct}%
                    </strong>
                  </div>
                  <div className="cockpit-progress-track">
                    <div
                      className="cockpit-progress-fill"
                      style={{
                        width: `${item.impactPct * 2.5}%`,
                        backgroundColor: idx === 0 ? '#BE123C' : idx === 1 ? '#D97706' : idx === 2 ? '#7C3AED' : '#0284C7'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex justify-between items-center">
              <span>Primary Factor:</span>
              <strong className="text-rose-700">Land RoW Clearance (34%)</strong>
            </div>
          </div>

          {/* Recent Directives Feed */}
          <div className="cockpit-card bg-white p-5 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="font-sans font-bold text-xs text-slate-900">
                Recent Directives &amp; Supervisory Findings
              </span>
              <span className="font-mono text-[10px] text-slate-400">Live Feed</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-purple-700 font-bold">PAIM-619054</span>
                  <span className="text-slate-400">14:32 Today</span>
                </div>
                <p className="text-slate-700 font-sans text-xs">
                  Critical milestone slippage of +16.5 months detected. GCC Clause 44.1 penalty assessment initiated.
                </p>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
                  <span>Level-2 Docket Ready</span>
                  <button
                    onClick={() => onTriggerQuickAI("Review statutory early warning notice for Greenfield Expressway PAIM-619054")}
                    className="text-purple-700 hover:underline font-semibold"
                  >
                    [Review Notice]
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-purple-700 font-bold">PAIM-5012</span>
                  <span className="text-slate-400">11:15 Today</span>
                </div>
                <p className="text-slate-700 font-sans text-xs">
                  Forest statutory clearance clearance pending for 180 days across 3 forest divisions.
                </p>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
                  <span>MoEF&amp;CC Escalation</span>
                  <button
                    onClick={() => onTriggerQuickAI("Investigate forest clearance bottleneck for PAIM-5012")}
                    className="text-purple-700 hover:underline font-semibold"
                  >
                    [Investigate]
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
