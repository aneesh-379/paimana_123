import React from 'react';
import { AlertTriangle, ChevronRight, Eye, ArrowUpRight, ShieldAlert } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { getValue } from '../../data/mockProjects';

export default function PriorityActionPanel({
  projects = [],
  onOpenDossier = null,
  onDraftWarning = null
}) {
  // Filter critical or high risk projects
  const criticalProjects = projects.filter(
    (p) => getValue(p.target_is_high_risk) == 1 || p.composite_risk_score >= 75
  );

  const displayList = criticalProjects.length > 0 ? criticalProjects.slice(0, 3) : projects.slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <h3 className="font-sans font-semibold text-sm text-slate-900 uppercase tracking-wider">
            Requires Immediate Administrative Action
          </h3>
        </div>
        <span className="font-mono text-xs text-rose-600 font-bold">
          {criticalProjects.length} Projects in Critical Escrow
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayList.map((p, idx) => {
          const costEsc = (
            ((parseFloat(getValue(p.revised_cost, 1000)) - parseFloat(getValue(p.original_cost, 1000))) /
              Math.max(1, parseFloat(getValue(p.original_cost, 1000)))) *
            100
          ).toFixed(1);

          const delay = getValue(p.target_final_delay_months, 16.5);
          const score = p.composite_risk_score || 84;
          const driver = p.primary_risk_driver || "Right-of-Way (RoW) Clearance and Land Acquisition Deficit";

          return (
            <div
              key={idx}
              className="cockpit-card p-4 flex flex-col justify-between space-y-3.5 border border-slate-200 bg-white transition-colors hover:border-purple-200 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="critical">CRITICAL ACTION</Badge>
                  <span className="font-mono font-bold text-xs text-purple-700">
                    {getValue(p.project_code)}
                  </span>
                </div>

                <div>
                  <h4 className="font-sans font-semibold text-sm text-slate-900 leading-snug line-clamp-2">
                    {getValue(p.project_name)}
                  </h4>
                  <span className="font-mono text-[11px] text-slate-500">
                    {getValue(p.implementing_agency)} · {getValue(p.state)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center font-mono">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Risk</span>
                    <strong className="text-xs text-rose-600">{score}/100</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Cost</span>
                    <strong className="text-xs text-amber-700">+{costEsc}%</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Delay</span>
                    <strong className="text-xs text-rose-600">+{delay} Mo</strong>
                  </div>
                </div>

                <div className="text-[11px] font-sans text-slate-600">
                  <span className="text-slate-500 font-medium block text-[10px] uppercase font-mono">Primary Driver:</span>
                  <p className="line-clamp-2 leading-relaxed text-slate-800 mt-0.5">
                    {driver}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenDossier && onOpenDossier(p)}
                  icon={Eye}
                  className="w-full text-slate-700 hover:text-purple-900 bg-slate-50 hover:bg-purple-50"
                >
                  Open Dossier
                </Button>
                {onDraftWarning && (
                  <Button
                    variant="critical"
                    size="sm"
                    onClick={() => onDraftWarning(p)}
                    className="shrink-0"
                    title="Generate Statutory Catch-up Directive"
                  >
                    Draft Notice
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
