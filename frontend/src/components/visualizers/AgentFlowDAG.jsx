import React from 'react';
import {
  CheckCircle,
  Cpu,
  Database,
  FileSearch,
  ShieldCheck,
  AlertTriangle,
  ArrowDown,
  Clock
} from 'lucide-react';
import Badge from '../common/Badge';

export default function AgentFlowDAG({
  activeStep = 0,
  agentsUsed = ["OrchestratorAgent", "QuantitativeAgent", "ComplianceAgent", "BottleneckAgent", "MitigationAgent"],
  agentDetails = null,
  confidence = 0.97
}) {
  const steps = [
    {
      id: 'orchestrator',
      name: 'Chief Orchestrator Agent',
      role: 'Intent Classification & Workflow Routing',
      model: 'NVIDIA NIM Llama-3.2',
      badge: 'COORDINATOR',
      badgeVariant: 'purple',
      icon: Cpu,
      findings: agentDetails?.orchestrator?.findings || 'Synthesized multi-agent evidence bundle and groundings into executive output.',
      latency: '240ms'
    },
    {
      id: 'quantitative',
      name: 'Quantitative Risk Analyst',
      role: 'XGBoost Cost & Time Overrun Modeling',
      model: 'Scikit-Learn / XGBoost v2.4',
      badge: 'ML PREDICTOR',
      badgeVariant: 'neutral',
      icon: Database,
      findings: agentDetails?.quantitative?.findings || 'Forecasted delay months and budget escalation from physical/financial progress gap.',
      latency: '110ms'
    },
    {
      id: 'compliance',
      name: 'Statutory Compliance Officer',
      role: 'GCC Clause 44.1 & MoSPI Level-2 Rule Audit',
      model: 'pgvector RAG + Embeddings',
      badge: 'CONTRACT AUDIT',
      badgeVariant: 'warning',
      icon: ShieldCheck,
      findings: agentDetails?.compliance?.findings || 'Matched NHAI Standard GCC Clause 44.1 and statutory early warning thresholds.',
      latency: '185ms'
    },
    {
      id: 'bottleneck',
      name: 'Bottleneck Diagnostic Specialist',
      role: 'Right-of-Way & Contractor Pacing Stalls',
      model: 'Heuristic Root-Cause Tree',
      badge: 'DIAGNOSTIC',
      badgeVariant: 'critical',
      icon: AlertTriangle,
      findings: agentDetails?.bottleneck?.findings || 'Pinpointed land acquisition delay and pending utility shifting on critical path.',
      latency: '95ms'
    },
    {
      id: 'mitigation',
      name: 'Strategic Mitigation Expert',
      role: '14-Day Catch-Up Directive & Legal Notice Dispatch',
      model: 'NVIDIA NIM Structured Generator',
      badge: 'HUMAN-IN-LOOP',
      badgeVariant: 'success',
      icon: CheckCircle,
      findings: agentDetails?.mitigation?.findings || 'Drafted statutory supervisory notice with required catch-up milestones.',
      latency: '310ms'
    }
  ];

  return (
    <div className="cockpit-card p-5 space-y-4 bg-white border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
        <div>
          <h4 className="font-sans font-semibold text-sm text-slate-900">
            Specialized Multi-Agent Reasoning Architecture (DAG Pipeline)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Decoupled autonomous agents executing sequential and parallel validation tasks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple">Confidence: {(confidence * 100).toFixed(0)}%</Badge>
          <Badge variant="neutral">5 Autonomous Nodes</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {steps.map((st, i) => {
          const Icon = st.icon;

          return (
            <div
              key={st.id}
              className="p-3 rounded-lg bg-slate-50/70 border border-slate-200 flex flex-col justify-between space-y-3 transition-colors hover:border-purple-200 hover:bg-white"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <Badge variant={st.badgeVariant} className="text-[9px] px-1.5 py-0">
                    {st.badge}
                  </Badge>
                </div>

                <div>
                  <h5 className="font-sans font-semibold text-xs text-slate-900 leading-tight">
                    {st.name}
                  </h5>
                  <span className="font-mono text-[10px] text-slate-500 block mt-0.5">
                    {st.model}
                  </span>
                </div>

                <p className="font-sans text-[11px] text-slate-700 leading-relaxed bg-white p-2 rounded border border-slate-200 shadow-xs">
                  {st.findings}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {st.latency}
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> VERIFIED
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
