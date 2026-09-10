import React from 'react';
import {
  Layers,
  ShieldAlert,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FolderKanban,
  Eye
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { MOSPI_STATS } from '../data/mospiConstants';
import { getValue } from '../data/mockProjects';

export default function ExecutiveSummaryView({
  projects = [],
  warningsList = [],
  onSelectProject
}) {
  const criticalProjects = projects.filter(
    (p) => getValue(p.target_is_high_risk) == 1 || p.composite_risk_score >= 75
  );

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="font-sans font-bold text-xl text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-700" />
            Executive 30-Second Infrastructure Portfolio Briefing
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Condensed high-level briefing tailored for the Empowered Committee of Secretaries (CoS) and Ministry Leadership.
          </p>
        </div>
        <Badge variant="purple">MoSPI Flash Briefing</Badge>
      </div>

      {/* Top Level Exposure KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="Monitored Projects"
          value={MOSPI_STATS.totalProjects.toLocaleString()}
          subtitle="≥ ₹150 Cr Mandate"
          badge="PORTFOLIO"
          badgeVariant="neutral"
        />
        <StatCard
          title="Total Cost Exposure"
          value={`₹${MOSPI_STATS.costEscalationLakhCr} L Cr`}
          subtitle="Aggregate escalation"
          badge="+15.2% ESC"
          badgeVariant="critical"
          alertVariant="critical"
        />
        <StatCard
          title="Schedule Slippage"
          value={MOSPI_STATS.delayedProjectsCount.toLocaleString()}
          subtitle="Projects past DOC"
          badge="41.1% OF BASE"
          badgeVariant="warning"
          alertVariant="warning"
        />
        <StatCard
          title="Pending Early Warnings"
          value={warningsList.filter(w => w.status === 'PENDING_HUMAN_APPROVAL').length}
          subtitle="Awaiting authorization"
          badge="LEVEL-2 GATE"
          badgeVariant="warning"
        />
      </div>

      {/* Core Executive Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Critical Attention Watchlist */}
        <div className="cockpit-card p-5 space-y-3 bg-white border border-slate-200">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="font-sans font-semibold text-xs text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Highest Vulnerability Infrastructure Works
            </span>
            <Badge variant="critical">{criticalProjects.length} Projects</Badge>
          </div>

          <div className="space-y-2.5">
            {criticalProjects.slice(0, 4).map((p, idx) => (
              <div
                key={idx}
                onClick={() => onSelectProject && onSelectProject(p)}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all flex justify-between items-center cursor-pointer text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-purple-700 block">{p.project_code}</span>
                  <span className="text-slate-900 font-medium truncate max-w-[240px] block">
                    {p.project_name}
                  </span>
                  <span className="text-[10px] text-slate-500">{p.implementing_agency} · {p.state}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-rose-600 font-bold block">+{p.target_final_delay_months} Mo</span>
                  <span className="text-amber-700 text-[10px]">+{p.target_cost_overrun_pct}% Overrun</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Escalation Systemic Drivers */}
        <div className="cockpit-card p-5 space-y-3 bg-white border border-slate-200">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="font-sans font-semibold text-xs text-slate-900">
              Systemic Portfolio Bottlenecks (Pareto Weights)
            </span>
            <Badge variant="warning">Top Drivers</Badge>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span className="text-slate-700 font-medium">1. Land Acquisition & RoW Clearances</span>
                <strong className="text-rose-600 font-semibold">34% (₹1.92 L Cr)</strong>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                State administration handover stalls across highway and dedicated freight rail corridors.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="flex justify-between font-mono">
                <span className="text-slate-700 font-medium">2. Environmental & Forest Approvals</span>
                <strong className="text-amber-700 font-semibold">22% (₹1.24 L Cr)</strong>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Multi-agency forest diversion and wildlife corridor mitigations.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="flex justify-between font-mono">
                <span className="text-slate-700 font-medium">3. Contractor Financial Liquidity</span>
                <strong className="text-purple-700 font-semibold">18% (₹1.01 L Cr)</strong>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Working capital constraints slowing execution pacing despite available sanctions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
