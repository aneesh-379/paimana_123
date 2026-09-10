import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Calendar,
  DollarSign,
  TrendingUp,
  BrainCircuit,
  FileText,
  AlertTriangle,
  Building,
  MapPin,
  Clock,
  Layers,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import SCurveChart from '../visualizers/SCurveChart';
import { getValue } from '../../data/mockProjects';

export default function ProjectDossier({
  project,
  isOpen,
  onClose,
  onRunAIAudit,
  onDraftWarning
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !project) return null;

  const origCost = parseFloat(getValue(project.original_cost, 1000));
  const revCost = parseFloat(getValue(project.revised_cost, origCost));
  const exp = parseFloat(getValue(project.expenditure, origCost * 0.45));
  const phys = parseFloat(getValue(project.physical_progress, 42.5));
  const finProg = ((exp / Math.max(1, revCost)) * 100).toFixed(1);
  const costEsc = (((revCost - origCost) / Math.max(1, origCost)) * 100).toFixed(1);
  const delayMonths = getValue(project.target_final_delay_months, 16.5);
  const isHighRisk = getValue(project.target_is_high_risk) == 1 || project.composite_risk_score > 70;
  const score = project.composite_risk_score || (isHighRisk ? 84 : 35);

  return (
    <div className="fixed inset-0 z-[9990] flex justify-end bg-black/40 animate-fadeIn" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl overflow-hidden animate-slide-up text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-start">
          <div className="space-y-1.5 min-w-0 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-sm text-purple-800">
                {getValue(project.project_code)}
              </span>
              <Badge variant={isHighRisk ? 'critical' : 'success'}>
                {isHighRisk ? 'CRITICAL RISK WATCHLIST' : 'MONITORED STABLE'}
              </Badge>
              <span className="text-[11px] font-mono text-slate-500">
                Risk Score: <strong className="text-slate-900">{score}/100</strong>
              </span>
            </div>
            <h3 className="font-sans font-bold text-base text-slate-900 leading-snug">
              {getValue(project.project_name)}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-sans">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {getValue(project.implementing_agency)} ({getValue(project.ministry, 'MoRTH')})
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {getValue(project.state)} · {getValue(project.district, 'Central Division')}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Close dossier drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High-Level Metric Tiles */}
        <div className="grid grid-cols-4 gap-2 p-4 bg-slate-50 border-b border-slate-200 font-mono text-center text-xs">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[9px] uppercase text-slate-500 block">Sanction Cost</span>
            <strong className="text-slate-900">₹{origCost} Cr</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[9px] uppercase text-slate-500 block">Revised Cost</span>
            <strong className="text-rose-700">₹{revCost} Cr</strong>
            <span className="text-[9px] text-amber-700 block">(+{costEsc}%)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[9px] uppercase text-slate-500 block">Phys vs Fin</span>
            <strong className="text-purple-700">{phys}%</strong>
            <span className="text-[9px] text-slate-500 block">/ {finProg}%</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[9px] uppercase text-slate-500 block">Delay Forecast</span>
            <strong className="text-rose-700">+{delayMonths} Mo</strong>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-4 bg-white text-xs font-sans">
          {[
            { id: 'overview', label: 'Overview & Drivers' },
            { id: 'schedule', label: 'Schedule & S-Curve' },
            { id: 'financials', label: 'Disbursements' },
            { id: 'compliance', label: 'Contracts & Legal' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2.5 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#F8F9FA]">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Primary Risk Driver */}
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5 shadow-sm">
                <span className="font-mono text-[10px] uppercase tracking-wider text-rose-800 font-bold block">
                  PRIMARY RISK VECTOR (SHAP ATTRIBUTION)
                </span>
                <p className="font-sans text-xs text-rose-900 leading-relaxed font-semibold">
                  {project.primary_risk_driver || "Right-of-Way (RoW) clearances and forest diversion delays accounting for 42.8% of total variance."}
                </p>
                {project.secondary_risk_driver && (
                  <p className="font-sans text-[11px] text-rose-700 leading-relaxed">
                    <strong>Secondary Factor:</strong> {project.secondary_risk_driver}
                  </p>
                )}
              </div>

              {/* Project Lineage Details */}
              <div className="cockpit-card bg-white p-4 space-y-3">
                <h5 className="font-sans font-bold text-xs text-slate-900 pb-2 border-b border-slate-100">
                  Administrative Project Lineage
                </h5>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Sanction Date</span>
                    <strong className="text-slate-800">{getValue(project.sanction_date, '2024-03-01')}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Original DOC</span>
                    <strong className="text-slate-800">{getValue(project.original_doc, '2027-12-31')}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Prime Contractor</span>
                    <strong className="text-slate-800">{getValue(project.contractor, 'National Concessionaire JV')}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Clearance Status</span>
                    <Badge variant={project.clearance_status === 'CLEAR' ? 'success' : 'warning'}>
                      {project.clearance_status || 'PENDING'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* SHAP Feature Attribution Breakdown */}
              <div className="cockpit-card bg-white p-4 space-y-3">
                <h5 className="font-sans font-bold text-xs text-slate-900 pb-2 border-b border-slate-100">
                  SHAP Risk Contribution Model (XGBoost v2.4)
                </h5>
                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <div className="flex justify-between mb-1 text-slate-700">
                      <span>Disbursement Gap (Financial % vs Physical %)</span>
                      <strong className="text-rose-700">+42.8% Risk Impact</strong>
                    </div>
                    <div className="cockpit-progress-track">
                      <div className="cockpit-progress-fill bg-rose-600" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-slate-700">
                      <span>Statutory Clearances (Forest &amp; RoW)</span>
                      <strong className="text-amber-700">+31.2% Risk Impact</strong>
                    </div>
                    <div className="cockpit-progress-track">
                      <div className="cockpit-progress-fill bg-amber-500" style={{ width: '62%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-slate-700">
                      <span>Contractor Mobilization &amp; Pacing Ratio</span>
                      <strong className="text-purple-700">+14.5% Risk Impact</strong>
                    </div>
                    <div className="cockpit-progress-track">
                      <div className="cockpit-progress-fill bg-purple-600" style={{ width: '30%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="cockpit-card bg-white p-4 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h5 className="font-sans font-bold text-xs text-slate-900">
                    Cumulative Physical vs Planned S-Curve Trajectory
                  </h5>
                  <Badge variant="cyan">Milestone Pacing</Badge>
                </div>
                <SCurveChart project={project} />
              </div>
            </div>
          )}

          {activeTab === 'financials' && (
            <div className="space-y-4">
              <div className="cockpit-card bg-white p-4 space-y-3">
                <h5 className="font-sans font-bold text-xs text-slate-900 pb-2 border-b border-slate-100">
                  Financial Outlay Variance &amp; Price Adjustment
                </h5>
                <div className="space-y-2 text-xs font-mono text-slate-700">
                  <div className="flex justify-between p-2.5 rounded bg-slate-50 border border-slate-200">
                    <span>Sanctioned Capital Cost:</span>
                    <span className="font-bold text-slate-900">₹{origCost} Cr</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded bg-slate-50 border border-slate-200">
                    <span>Cumulative Verified Expenditure:</span>
                    <span className="font-bold text-purple-700">₹{exp} Cr</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded bg-slate-50 border border-slate-200">
                    <span>Forecasted Final Revised Outlay:</span>
                    <span className="font-bold text-rose-700">₹{revCost} Cr</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-900">
                    <span>Anticipated Cost Escalation:</span>
                    <strong className="font-bold">+₹{(revCost - origCost).toFixed(2)} Cr (+{costEsc}%)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-3">
              <div className="cockpit-card bg-white p-4 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="font-mono text-xs font-bold text-purple-800">
                    GCC Clause 44.1: Liquidated Damages &amp; Delay Compensation
                  </span>
                  <Badge variant="warning">STATUTORY TRIGGER</Badge>
                </div>
                <p className="text-xs font-sans text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  "If the Contractor fails to achieve Key Milestones by the designated Time for Completion, liquidated damages accrue at 0.05% of the Contract Price per day of delay, capped at 10% of total Contract Value."
                </p>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
                  <span>Source: Standard NHAI Engineering Contract GCC 2024</span>
                  <span className="text-emerald-700 font-semibold">Active Audit Reference</span>
                </div>
              </div>

              <div className="cockpit-card bg-white p-4 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="font-mono text-xs font-bold text-purple-800">
                    MoSPI IPMD Section 12.3: Mandatory Early Warning Protocol
                  </span>
                  <Badge variant="cyan">MANDATORY PROTOCOL</Badge>
                </div>
                <p className="text-xs font-sans text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  "Any project experiencing schedule deviation exceeding 90 calendar days or cost escalation exceeding 15% shall automatically be placed on the Level-2 Review Docket for the Committee of Secretaries."
                </p>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
                  <span>Directive: Central Sector Monitoring Guidelines</span>
                  <span className="text-rose-700 font-semibold">Threshold Breached</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-500">
            Dossier ID: {project.project_code} · Ref: MoSPI-IPMD-2026
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                if (onRunAIAudit) onRunAIAudit(project);
              }}
              icon={BrainCircuit}
              className="flex-1 sm:flex-none shadow-sm text-xs font-semibold"
            >
              Investigate in AI Console
            </Button>
            <Button
              variant="critical"
              size="sm"
              onClick={() => {
                onClose();
                if (onDraftWarning) onDraftWarning(project);
              }}
              icon={AlertTriangle}
              className="flex-1 sm:flex-none text-xs font-semibold"
            >
              Generate Level-2 Warning
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
