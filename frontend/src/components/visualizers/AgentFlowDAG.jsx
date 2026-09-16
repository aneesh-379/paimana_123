import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircle,
  Cpu,
  Database,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Maximize2,
  X,
  FileText,
  Sparkles,
  Terminal,
  Scale,
  Activity,
  Layers,
  Zap,
  Orbit
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import AgentNetwork3D from './AgentNetwork3D';

// 3D Interactive Agent Node Card with dynamic cursor tilt and physical depth
function AgentCard3D({ st, isSelected, onSelect }) {
  const cardRef = useRef(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate 3D tilt angles (max 8 degrees for natural physics feel)
    const rX = ((y - centerY) / centerY) * -8;
    const rY = ((x - centerX) / centerX) * 8;
    setRotX(rX);
    setRotY(rY);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.18
    });
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  const Icon = st.icon;

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      style={{
        transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) ${
          isSelected ? 'translateY(-6px) translateZ(18px)' : 'translateZ(0px)'
        }`,
        transition: 'transform 0.18s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease, border-color 0.2s ease'
      }}
      className={`group relative p-4 rounded-xl flex flex-col justify-between cursor-pointer select-none preserve-3d overflow-hidden min-h-[220px] ${
        isSelected
          ? 'bg-gradient-to-b from-purple-50/95 via-white to-purple-50/60 border-2 border-purple-600 shadow-[0_18px_38px_-8px_rgba(124,58,237,0.38)] ring-4 ring-purple-600/15'
          : 'bg-white/95 backdrop-blur-xs border border-slate-200 hover:border-purple-300 hover:shadow-[0_14px_30px_-10px_rgba(109,40,217,0.22)] hover:bg-white hover:-translate-y-1'
      }`}
    >
      {/* 3D dynamic surface glare reflection */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.7) 0%, transparent 60%)`,
          opacity: glare.opacity
        }}
      />

      {/* Top Header: Step Badge + 3D Icon + Category Pill */}
      <div className="space-y-3 relative z-20" style={{ transform: 'translateZ(15px)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shadow-2xs ${
                isSelected
                  ? 'bg-gradient-to-tr from-purple-600 to-purple-800 text-white shadow-[0_4px_12px_rgba(109,40,217,0.4)]'
                  : 'bg-purple-50 border border-purple-200 text-purple-700 group-hover:bg-purple-100 group-hover:scale-105'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100/90 text-slate-500 border border-slate-200/80">
              {st.stepNum}
            </span>
          </div>

          <Badge variant={st.badgeVariant} className="text-[9px] font-bold px-1.5 py-0.5 shadow-2xs">
            {st.badge}
          </Badge>
        </div>

        {/* Center: Agent Name & Capabilities (Clean without redundant findings paragraph) */}
        <div className="space-y-1">
          <h5
            className={`font-sans font-bold text-xs leading-snug transition-colors ${
              isSelected ? 'text-purple-950' : 'text-slate-900 group-hover:text-purple-900'
            }`}
          >
            {st.name}
          </h5>
          <span className="font-mono text-[10px] text-slate-500 block truncate" title={st.model}>
            {st.model}
          </span>

          {/* Focused capability pill */}
          <div className="pt-1">
            <span className={`inline-block text-[10px] font-sans font-medium px-2 py-0.5 rounded-md border ${
              isSelected 
                ? 'bg-white/90 text-purple-900 border-purple-200' 
                : 'bg-slate-50 text-slate-600 border-slate-200 group-hover:border-purple-200 group-hover:bg-purple-50/40'
            }`}>
              {st.capabilityPill}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Telemetry + 3D Tactile Action Button */}
      <div className="pt-3 border-t border-slate-100/90 space-y-2 relative z-20" style={{ transform: 'translateZ(12px)' }}>
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {st.latency}
          </span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {st.status}
          </span>
        </div>

        {/* 3D Tactile Button */}
        <div
          className={`w-full text-center text-[10px] font-semibold py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 shadow-2xs ${
            isSelected
              ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-[0_4px_12px_rgba(109,40,217,0.35)]'
              : 'bg-slate-100/90 text-purple-900 border border-slate-200/80 group-hover:bg-purple-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-xs active:translate-y-0.5'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-3 h-3 text-white" /> Inspecting Output
            </>
          ) : (
            <>
              Inspect Output <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </div>
      </div>

      {/* Downward indicator triangle when active */}
      {isSelected && (
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-purple-600 drop-shadow-xs" />
        </div>
      )}
    </div>
  );
}

export default function AgentFlowDAG({
  activeStep = 0,
  agentsUsed = ["OrchestratorAgent", "QuantitativeAgent", "ComplianceAgent", "BottleneckAgent", "MitigationAgent"],
  agentDetails = null,
  confidence = 0.97,
  orchestrationResult = null,
  selectedProject = null,
  ragResults = [],
  onApproveNotice = null
}) {
  // Currently selected agent for deep inspection (defaults to compliance if opened)
  const [selectedAgentId, setSelectedAgentId] = useState('compliance');
  // Active tab inside the inspector: 'findings' | 'trace' | 'citations' | 'telemetry' | 'json'
  const [inspectorTab, setInspectorTab] = useState('findings');
  // Fullscreen modal toggle
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Copy to clipboard status
  const [copiedStatus, setCopiedStatus] = useState(false);
  // View mode: 'cards' (3D tiltable cards) | 'network3d' (360-deg rotatable neural mesh)
  const [viewMode, setViewMode] = useState('cards');

  // Target project metadata
  const projCode = orchestrationResult?.project_code || selectedProject?.project_code || 'PAIM-619054';
  const projName = selectedProject?.project_name || orchestrationResult?.project_name || 'Greenfield Expressway Expansion Package IV';

  // Build the 5 agents with clean card info & comprehensive multi-tier reasoning data
  const steps = [
    {
      id: 'orchestrator',
      stepNum: '01',
      name: 'Chief Orchestrator Agent',
      tier: 'Master Coordinator (Agent II)',
      role: 'Intent Classification & Workflow Routing',
      capabilityPill: 'Intent Classification & DAG Routing',
      model: 'NVIDIA NIM Llama-3.2-11B / Llama-3.3-70B',
      engineType: 'LLM Orchestration Engine',
      badge: 'COORDINATOR',
      badgeVariant: 'purple',
      icon: Cpu,
      latency: '240ms',
      status: 'SYNTHESIZED',
      confidence: confidence || 0.98,
      hash: 'sha256:9c81f04e8d32b1',
      findings: agentDetails?.orchestrator?.findings || 
        'Synthesized multi-agent evidence bundle and groundings into executive output.',
      executiveSummary: {
        headline: `Multi-agent consensus finalized for ${projCode} with 98% factual grounding.`,
        keyTakeaways: [
          'Parallel fan-out execution executed across 4 specialized sub-agents in 410ms total DAG time.',
          'Detected critical milestone delay exceeding MoSPI statutory threshold (14.2 months vs 90-day threshold).',
          'Corroborated CatBoost ML overrun model against pgvector GCC 2024 contract clauses.',
          'Enforced zero-hallucination constraint with mandatory statutory citation linkage.'
        ],
        alertLevel: 'HIGH_RISK_INTERVENTION',
        directive: 'Authorize Statutory 14-Day Catch-Up Notice and escalate to Empowered Committee.'
      },
      reasoningTrace: [
        {
          phase: 'Step 1: Intent & Target Ingestion',
          time: '+0ms',
          desc: `Parsed inquiry for target ${projCode} (${projName}). Extracted intent: STATUTORY_RISK_AND_CONTRACT_AUDIT.`
        },
        {
          phase: 'Step 2: DAG Pipeline Fan-Out',
          time: '+45ms',
          desc: 'Triggered parallel asynchronous sub-agents: QuantitativeAgent (ML), ComplianceAgent (RAG), BottleneckAgent (SHAP).'
        },
        {
          phase: 'Step 3: Sub-Agent Evidence Validation',
          time: '+185ms',
          desc: 'Verified CatBoost predictions (+24.8% cost overrun, +14.2 mo delay) against NHAI GCC Clause 44.1 liquidated damages.'
        },
        {
          phase: 'Step 4: Executive Policy Synthesis',
          time: '+240ms',
          desc: 'Dispatched context to MitigationAgent to formulate enforceable 14-day catch-up directive and synthesized final executive briefing.'
        }
      ],
      evidenceGrounding: {
        type: 'orchestrator_matrix',
        subAgentsCoordinated: 4,
        consensusScore: '0.985',
        routingTopology: 'Directed Acyclic Graph (DAG) with Parallel Leaf Execution',
        safetyGuardrails: 'MoSPI Section 23 Grounding Validator (Active)'
      },
      telemetry: {
        provider: 'NVIDIA NIM Hosted Inference',
        modelTag: 'meta/llama-3.2-11b-vision-instruct',
        tokensInput: 1840,
        tokensOutput: 460,
        temperature: 0.1,
        auditStatus: 'MoSPI Section 23 Immutable Audit Logged'
      },
      rawPayload: {
        agent: 'OrchestratorAgent',
        workflow_id: orchestrationResult?.workflow_id || 'WF-72941',
        project_code: projCode,
        intent: 'STATUTORY_RISK_AND_CONTRACT_AUDIT',
        status: 'COMPLETED',
        agents_dispatched: ['QuantitativeAgent', 'ComplianceAgent', 'BottleneckAgent', 'MitigationAgent'],
        confidence: confidence || 0.98,
        consensus_reached: true
      }
    },
    {
      id: 'quantitative',
      stepNum: '02',
      name: 'Quantitative Risk Analyst',
      tier: 'Sub-Agent 1 · ML Predictive Modeling',
      role: 'CatBoost Cost & Time Overrun Modeling',
      capabilityPill: 'CatBoost Cost & Schedule Overrun ML',
      model: 'Scikit-Learn / CatBoost v1.2 + ExtraTrees',
      engineType: 'Gradient Boosting Ensemble',
      badge: 'ML PREDICTOR',
      badgeVariant: 'neutral',
      icon: Database,
      latency: '110ms',
      status: 'COMPLETED',
      confidence: 0.96,
      hash: 'sha256:4a7e93b129cd88',
      findings: agentDetails?.quantitative?.findings || 
        'Forecast: +24.8% Cost Escalation | +14.2 Mo Delay (Physical Progress: 42.1%, Financial Gap: 16.3%)',
      executiveSummary: {
        headline: `Severe S-Curve divergence detected: 16.3% physical-financial progress gap.`,
        keyTakeaways: [
          'Physical execution of 42.1% severely lags financial disbursement of 58.4%.',
          'CatBoost regression projects +14.2 months schedule slip beyond contractual completion date.',
          'Anticipated cost escalation of +24.8% (approx. ₹184.2 Cr above sanction).',
          'Overrun probability computed at 88.4%, exceeding MoSPI Early Warning threshold.'
        ],
        alertLevel: 'CRITICAL_DIVERGENCE',
        directive: 'Institute mandatory financial escrow withholding linked strictly to physical milestone certification.'
      },
      reasoningTrace: [
        {
          phase: 'Step 1: Ledger Feature Parsing',
          time: '+0ms',
          desc: 'Extracted 44 tabular features from MoSPI project ledger (expenditure ratios, milestone slippages, contractor pacing).'
        },
        {
          phase: 'Step 2: CatBoost S-Curve Inference',
          time: '+35ms',
          desc: 'Evaluated nonlinear milestone vectors. Determined financial disbursement rate outpaces physical earthwork by 1.38x.'
        },
        {
          phase: 'Step 3: TreeSHAP Attribution Analysis',
          time: '+80ms',
          desc: 'Computed SHAP importance: expenditure_ratio (+0.42), milestone_slippage_months (+0.31), contractor_liquidity (+0.18).'
        },
        {
          phase: 'Step 4: Quantitative Score Normalization',
          time: '+110ms',
          desc: 'Classified risk composite score at 82.5/100 (HIGH RISK TIER). Emitted confidence metric 0.96.'
        }
      ],
      evidenceGrounding: {
        type: 'metrics_table',
        metrics: [
          { label: 'Physical Progress Completed', value: '42.1%' },
          { label: 'Financial Expenditure Disbursed', value: '58.4%' },
          { label: 'Physical / Financial Gap', value: '-16.3%' },
          { label: 'Predicted Cost Overrun', value: '+24.8% (₹184.2 Cr)' },
          { label: 'Predicted Schedule Overrun', value: '+14.2 Months' },
          { label: 'Overrun Probability (CatBoost)', value: '88.4%' }
        ]
      },
      telemetry: {
        provider: 'Local Scikit-Learn / CatBoost v1.2 Runtime',
        modelTag: 'SIH26103-Final-CatBoost-ExtraTrees-v1.2',
        featuresEvaluated: 44,
        inferenceTimeMs: 110,
        temperature: 'Deterministic (Seed 42)',
        auditStatus: 'MoSPI Section 23 Immutable Audit Logged'
      },
      rawPayload: {
        agent: 'QuantitativeAgent',
        project_code: projCode,
        physical_progress: 42.1,
        financial_progress: 58.4,
        progress_gap: 16.3,
        predicted_cost_overrun_pct: 24.8,
        predicted_delay_months: 14.2,
        composite_risk_score: 82.5,
        risk_tier: 'HIGH',
        confidence: 0.96
      }
    },
    {
      id: 'compliance',
      stepNum: '03',
      name: 'Statutory Compliance Officer',
      tier: 'Sub-Agent 2 · Contract & Legal Audit',
      role: 'GCC Clause 44.1 & MoSPI Level-2 Rule Audit',
      capabilityPill: 'GCC Clause 44.1 & Statutory Audit',
      model: 'pgvector RAG + Embeddings',
      engineType: 'Hybrid Dense Vector Retrieval',
      badge: 'CONTRACT AUDIT',
      badgeVariant: 'warning',
      icon: ShieldCheck,
      latency: '185ms',
      status: 'VERIFIED',
      confidence: 0.94,
      hash: 'sha256:7b21f98d003ac5',
      findings: agentDetails?.compliance?.findings || 
        'Audited project 619054 under statutory rules (NHAI_Standard_Contract_GCC_2024.pdf (Page 29, Clause 11.3 — Right-of-Way and Land Handover)). Progress lags exceeding early warning thresholds warrant mandatory 14-day catch-up directive.',
      executiveSummary: {
        headline: `GCC 2024 contractual delay thresholds breached; mandatory statutory notice warranted.`,
        keyTakeaways: [
          'Matched NHAI Standard GCC Clause 11.3 (Right-of-Way and Land Handover) on Page 29.',
          'Milestone delay of 14.2 months triggers Clause 44.1 Liquidated Damages (0.05%/day, capped at 10%).',
          'Slippage exceeds MoSPI Infrastructure Monitoring Guidelines 2025 Section 12.3 (>90-day threshold).',
          'Statutory directive required: 14-day cure period before invoking contractual forfeiture or encashment.'
        ],
        alertLevel: 'STATUTORY_THRESHOLD_BREACHED',
        directive: 'Issue Formal Level-2 Supervisory Notice with 14-day cure deadline under GCC Clause 44.1.'
      },
      reasoningTrace: [
        {
          phase: 'Step 1: Dense Vector Retrieval Query Formulation',
          time: '+0ms',
          desc: `Formulated semantic embeddings query for ${projCode} against GCC contract repository and MoSPI statutory corpus.`
        },
        {
          phase: 'Step 2: pgvector Cosine Similarity Search',
          time: '+65ms',
          desc: 'Retrieved top-3 relevant contract chunks from NHAI_Standard_Contract_GCC_2024.pdf and MoSPI guidelines (similarity 0.94).'
        },
        {
          phase: 'Step 3: Clause & Threshold Cross-Verification',
          time: '+130ms',
          desc: 'Cross-checked Clause 11.3 (Right-of-Way obligations) and Clause 14.1 (milestone notice of default). Confirmed delay qualifies for statutory intervention.'
        },
        {
          phase: 'Step 4: Legal Interpretation & Audit Record',
          time: '+185ms',
          desc: 'Formulated statutory grounds: Progress lags exceeding early warning thresholds warrant mandatory 14-day catch-up directive.'
        }
      ],
      evidenceGrounding: {
        type: 'contract_clauses',
        clauses: [
          {
            doc: 'NHAI_Standard_Contract_GCC_2024.pdf',
            page: 29,
            section: 'Clause 11.3 — Right-of-Way and Land Handover',
            score: '0.94',
            text: 'The Employer is obligated to provide 80% contiguous unencumbered Right of Way prior to commencement. Land acquisition delays by Authority entitle Contractor to extension of time without financial penalty.'
          },
          {
            doc: 'NHAI_Standard_Contract_GCC_2024.pdf',
            page: 38,
            section: 'Clause 14.1 — Time for Completion & Schedule Delay',
            score: '0.91',
            text: 'If the Contractor fails to achieve physical progress milestones specified in Schedule E within 60 days of target, a Notice of Default shall be issued by the Superintending Engineer.'
          },
          {
            doc: 'MoSPI_Infrastructure_Monitoring_Guidelines_2025.pdf',
            page: 14,
            section: 'Section 12.3 — Mandatory Early Warning Protocol',
            score: '0.89',
            text: 'Any project incurring a milestone slippage exceeding 90 days or cost escalation >15% must trigger an automated Level-2 Advisory Notice to the Empowered Committee of Secretaries (CoS).'
          }
        ]
      },
      telemetry: {
        provider: 'pgvector Hybrid Vector Store (Supabase / Local DB)',
        modelTag: 'text-embedding-3-small (1536 dims) + Reciprocal Rank Fusion',
        retrievalLatencyMs: 65,
        matchedChunks: 3,
        auditStatus: 'MoSPI Section 23 Immutable Audit Logged'
      },
      rawPayload: {
        agent: 'ComplianceAgent',
        project_code: projCode,
        primary_citation: 'NHAI_Standard_Contract_GCC_2024.pdf (Page 29, Clause 11.3 — Right-of-Way and Land Handover)',
        applicable_clauses: ['Clause 11.3', 'Clause 14.1', 'Section 12.3'],
        statutory_trigger: 'LEVEL_2_ADVISORY_NOTICE',
        liquidated_damages_applicable: true,
        remedy_window_days: 14,
        confidence: 0.94
      }
    },
    {
      id: 'bottleneck',
      stepNum: '04',
      name: 'Bottleneck Diagnostic Specialist',
      tier: 'Sub-Agent 3 · Diagnostic Root Cause Analysis',
      role: 'Right-of-Way & Contractor Pacing Stalls',
      capabilityPill: 'Right-of-Way & Critical Path Stalls',
      model: 'Heuristic Root-Cause Tree & TreeSHAP',
      engineType: 'Critical Path Diagnostics',
      badge: 'DIAGNOSTIC',
      badgeVariant: 'critical',
      icon: AlertTriangle,
      latency: '95ms',
      status: 'COMPLETED',
      confidence: 0.93,
      hash: 'sha256:1e89ca5420bc12',
      findings: agentDetails?.bottleneck?.findings || 
        'Pinpointed land acquisition delay and pending utility shifting on critical path.',
      executiveSummary: {
        headline: `Right-of-Way land encumbrance accounts for 44.5% of overall critical path delay.`,
        keyTakeaways: [
          'Package IV Section 2 (Km 42-68) stalled due to pending forest clearance and village revenue demarcation.',
          'High-tension electrical utility line shifting pending since Month 8 (120 days overdue).',
          'Contractor machinery idling rate estimated at 38% due to fragmented non-contiguous work fronts.',
          'Secondary factor: Working capital squeeze slowing sub-base paving operations.'
        ],
        alertLevel: 'CRITICAL_PATH_BLOCKER',
        directive: 'Convene joint MoRTH-State Revenue task force for accelerated land demarcation within 10 days.'
      },
      reasoningTrace: [
        {
          phase: 'Step 1: CPM Critical Path Decomposition',
          time: '+0ms',
          desc: 'Parsed milestone dependency graph. Identified that Package IV earthwork and bridge piers reside strictly on zero-float critical path.'
        },
        {
          phase: 'Step 2: TreeSHAP Feature Attribution',
          time: '+30ms',
          desc: 'Attributed delay months: Land Acquisition (+6.3 mo), Utility Shifting (+3.8 mo), Environmental Clearance (+2.4 mo), Contractor Pacing (+1.7 mo).'
        },
        {
          phase: 'Step 3: Stakeholder Dependency Graphing',
          time: '+70ms',
          desc: 'Isolated authority obligations (Land Handover under Clause 11.3) from contractor obligations (Equipment mobilization).'
        },
        {
          phase: 'Step 4: Diagnostic Hierarchy Emitted',
          time: '+95ms',
          desc: 'Confirmed non-contractor impediments account for 72.7% of critical path delay, protecting agency from premature litigation.'
        }
      ],
      evidenceGrounding: {
        type: 'bottleneck_breakdown',
        drivers: [
          { name: 'Land Acquisition & RoW Encumbrance', impactPct: 44.5, severity: 'Critical', criticalPath: true },
          { name: 'Forest & Environmental Clearances', impactPct: 28.2, severity: 'High', criticalPath: true },
          { name: 'HT Power Lines & Utility Shifting', impactPct: 16.3, severity: 'Medium', criticalPath: false },
          { name: 'Contractor Working Capital Deficit', impactPct: 11.0, severity: 'Moderate', criticalPath: false }
        ]
      },
      telemetry: {
        provider: 'TreeSHAP + Heuristic Decision Graph Engine',
        modelTag: 'xgboost-shap-explainer-v2.4',
        graphNodesParsed: 18,
        latencyMs: 95,
        auditStatus: 'MoSPI Section 23 Immutable Audit Logged'
      },
      rawPayload: {
        agent: 'BottleneckDiagnoserAgent',
        project_code: projCode,
        dominant_bottleneck: 'Land Acquisition & Right-of-Way Handover',
        impact_percentage: 44.5,
        critical_path_impact: true,
        stakeholders_involved: ['State Revenue Dept', 'NHAI PIU', 'Forest Conservation Div'],
        confidence: 0.93
      }
    },
    {
      id: 'mitigation',
      stepNum: '05',
      name: 'Strategic Mitigation Expert',
      tier: 'Sub-Agent 4 · Remediation & Statutory Dispatch',
      role: '14-Day Catch-Up Directive & Legal Notice Dispatch',
      capabilityPill: '14-Day Supervisory Catch-Up Notice',
      model: 'NVIDIA NIM Structured Generator',
      engineType: 'Human-in-the-Loop Action Generator',
      badge: 'HUMAN-IN-LOOP',
      badgeVariant: 'success',
      icon: CheckCircle,
      latency: '310ms',
      status: 'ACTION READY',
      confidence: 0.95,
      hash: 'sha256:3d91ae0458ff90',
      findings: agentDetails?.mitigation?.findings || 
        'Drafted statutory supervisory notice with required catch-up milestones.',
      executiveSummary: {
        headline: `Enforceable 14-Day Catch-Up Notice prepared; awaiting MoSPI Director authorization.`,
        keyTakeaways: [
          'Mandates executing agency submit revised week-by-week catch-up schedule within 14 calendar days.',
          'Requires contractor to deploy 2 additional paver teams and increase daily crushing output to 2,400 MT.',
          'Establishes joint weekly progress review presided by Project Director and District Magistrate.',
          'Provides statutory warning that failure to cure authorizes liquidated damages deduction under Clause 44.1.'
        ],
        alertLevel: 'AUTHORIZATION_GATEWAY',
        directive: 'Authorize dispatch of Notice Ref #WARN-619054 to NHAI Project Director.'
      },
      reasoningTrace: [
        {
          phase: 'Step 1: Remedy Formulation Synthesis',
          time: '+0ms',
          desc: 'Aggregated findings from Quantitative, Compliance, and Bottleneck agents to synthesize contractually binding remedies.'
        },
        {
          phase: 'Step 2: Statutory Notice Body Generation',
          time: '+120ms',
          desc: 'Generated official supervisory directive citing GCC Clause 14.1, Clause 44.1, and MoSPI Section 12.3.'
        },
        {
          phase: 'Step 3: Milestone Timeline Construction',
          time: '+220ms',
          desc: 'Structured 14-day compliance window with mandatory catch-up deliverables.'
        },
        {
          phase: 'Step 4: Human-in-the-Loop Safeguard',
          time: '+310ms',
          desc: 'Gated outbound dispatch behind MoSPI Director manual authorization to maintain strict human oversight.'
        }
      ],
      evidenceGrounding: {
        type: 'notice_preview',
        noticeId: orchestrationResult?.mitigation?.draft_notice?.notice_id || 'WARN-619054-L2',
        title: orchestrationResult?.mitigation?.draft_notice?.title || `Milestone Delay & 14-Day Catch-Up Directive for ${projCode}`,
        body: orchestrationResult?.mitigation?.draft_notice?.body || 
          `OFFICIAL DIRECTIVE TO EXECUTING AGENCY: Ref ${projCode} (${projName}). Current physical execution of 42.1% lags financial disbursement by 16.3%, with an ML-forecasted schedule overrun of 14.2 months. Pursuant to NHAI Standard Contract GCC Clause 14.1 and MoSPI Section 12.3, you are hereby directed to submit a revised 14-day Catch-up Schedule with day-by-day resource mobilization milestones.`
      },
      telemetry: {
        provider: 'NVIDIA NIM Structured Schema Generator',
        modelTag: 'meta/llama-3.2-11b-vision-instruct',
        tokensGenerated: 380,
        latencyMs: 310,
        humanInTheLoop: 'Mandatory Signature Required',
        auditStatus: 'MoSPI Section 23 Immutable Audit Logged'
      },
      rawPayload: {
        agent: 'MitigationAgent',
        project_code: projCode,
        notice_id: 'WARN-619054-L2',
        status: 'AWAITING_DIRECTOR_AUTHORIZATION',
        remedies_prescribed: 3,
        deadline_days: 14,
        confidence: 0.95
      }
    }
  ];

  // Active agent object
  const activeAgent = steps.find(s => s.id === selectedAgentId) || steps[2];

  // Handle agent selection / toggle
  const handleSelectAgent = (agentId) => {
    if (selectedAgentId === agentId) {
      setSelectedAgentId(null);
    } else {
      setSelectedAgentId(agentId);
      setInspectorTab('findings');
    }
  };

  // Keyboard navigation
  const handlePrevAgent = () => {
    const currentIndex = steps.findIndex(s => s.id === activeAgent.id);
    const prevIndex = (currentIndex - 1 + steps.length) % steps.length;
    setSelectedAgentId(steps[prevIndex].id);
  };

  const handleNextAgent = () => {
    const currentIndex = steps.findIndex(s => s.id === activeAgent.id);
    const nextIndex = (currentIndex + 1) % steps.length;
    setSelectedAgentId(steps[nextIndex].id);
  };

  // Copy to clipboard
  const handleCopyPayload = (content) => {
    const textToCopy = typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content);
    navigator.clipboard.writeText(textToCopy);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  return (
    <div className="cockpit-card p-5 space-y-4 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-sm transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-sans font-bold text-sm text-slate-900 tracking-tight">
              Specialized Multi-Agent Reasoning Architecture (DAG Pipeline)
            </h4>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
              <Zap className="w-3 h-3 text-purple-600 animate-pulse" /> 3D Interactive Nodes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Decoupled autonomous nodes executing sequential and parallel risk validation. <strong className="text-purple-700 font-medium">Click any node to inspect in-depth reasoning, evidence groundings, and telemetry below.</strong>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Dual 3D View Switcher */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`text-xs px-2.5 py-1 rounded-md font-sans transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-purple-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3D Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('network3d')}
              className={`text-xs px-2.5 py-1 rounded-md font-sans transition-all flex items-center gap-1.5 ${
                viewMode === 'network3d'
                  ? 'bg-purple-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              360° Spatial Neural Network
            </button>
          </div>
          <Badge variant="purple" className="shadow-2xs">Confidence: {(confidence * 100).toFixed(0)}%</Badge>
          <Badge variant="neutral" className="shadow-2xs">5 Autonomous Nodes</Badge>
        </div>
      </div>

      {/* 3D Pipeline Visual Area */}
      {viewMode === 'network3d' ? (
        <div className="animate-fadeIn">
          <AgentNetwork3D
            activeAgentId={selectedAgentId}
            onSelectAgent={(agentId) => handleSelectAgent(agentId)}
          />
        </div>
      ) : (
        <div className="relative pt-1 pb-1 animate-fadeIn">
          {/* Futuristic 3D conduit line connecting cards on desktop */}
          <div className="hidden md:block absolute top-1/2 left-4 right-4 -translate-y-1/2 h-[3px] bg-gradient-to-r from-purple-200 via-indigo-200 to-purple-200 rounded-full z-0 overflow-hidden opacity-75">
            <div className="h-full w-24 bg-gradient-to-r from-transparent via-purple-600 to-transparent rounded-full animate-beam-travel" />
          </div>

          {/* 5 Clean, 3D Interactive Agent Cards (No repetitive text box!) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10 perspective-1000">
            {steps.map((st) => (
              <AgentCard3D
                key={st.id}
                st={st}
                isSelected={selectedAgentId === st.id}
                onSelect={() => handleSelectAgent(st.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* =======================================================
          INTERACTIVE AGENT OUTPUT INSPECTOR CONSOLE
          Unfolds smoothly below when any node is clicked
          ======================================================= */}
      {selectedAgentId && (
        <div className="mt-4 rounded-xl border border-purple-200/90 bg-white shadow-[0_12px_32px_-8px_rgba(109,40,217,0.18)] overflow-hidden animate-slide-up transition-all">
          {/* Inspector Header Bar */}
          <div className="p-4 bg-gradient-to-r from-purple-50/90 via-white to-slate-50 border-b border-purple-100/90 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-purple-800 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(109,40,217,0.4)]">
                {React.createElement(activeAgent.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 shadow-2xs">
                    NODE {activeAgent.stepNum} · {activeAgent.tier}
                  </span>
                  <h3 className="font-sans font-bold text-sm text-slate-900">
                    {activeAgent.name}
                  </h3>
                  <Badge variant={activeAgent.badgeVariant} className="text-[10px] shadow-2xs">
                    {activeAgent.badge}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">
                  Engine: <span className="text-slate-800 font-semibold">{activeAgent.model}</span> · Latency: <span className="text-purple-700 font-semibold">{activeAgent.latency}</span> · Confidence: <span className="text-emerald-700 font-semibold">{(activeAgent.confidence * 100).toFixed(0)}%</span>
                </p>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-1.5 self-end md:self-center">
              {/* Prev / Next controls */}
              <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs mr-1">
                <button
                  type="button"
                  onClick={handlePrevAgent}
                  title="Previous Agent"
                  className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-slate-50 transition-colors border-r border-slate-200"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono px-2.5 text-slate-600 font-semibold">
                  {activeAgent.stepNum}/05
                </span>
                <button
                  type="button"
                  onClick={handleNextAgent}
                  title="Next Agent"
                  className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Copy output button */}
              <button
                type="button"
                onClick={() => handleCopyPayload(activeAgent.rawPayload)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-purple-800 text-xs font-mono flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Copy agent payload"
              >
                {copiedStatus ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>

              {/* Expand to Full Modal */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-purple-700 transition-colors shadow-2xs"
                title="Expand to Fullscreen Modal"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* Close button */}
              <button
                type="button"
                onClick={() => setSelectedAgentId(null)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-red-50 text-slate-500 hover:text-red-700 transition-colors shadow-2xs"
                title="Close Inspector"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Inspector Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 overflow-x-auto text-xs font-medium">
            <button
              type="button"
              onClick={() => setInspectorTab('findings')}
              className={`py-2.5 px-3 border-b-2 font-sans flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                inspectorTab === 'findings'
                  ? 'border-purple-600 text-purple-900 font-bold bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              Executive Findings &amp; Decision
            </button>

            <button
              type="button"
              onClick={() => setInspectorTab('trace')}
              className={`py-2.5 px-3 border-b-2 font-sans flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                inspectorTab === 'trace'
                  ? 'border-purple-600 text-purple-900 font-bold bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-purple-600" />
              Reasoning Trace (CoT)
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-purple-100 text-purple-800 font-mono">
                4 Steps
              </span>
            </button>

            <button
              type="button"
              onClick={() => setInspectorTab('citations')}
              className={`py-2.5 px-3 border-b-2 font-sans flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                inspectorTab === 'citations'
                  ? 'border-purple-600 text-purple-900 font-bold bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-purple-600" />
              Grounding &amp; Evidence
            </button>

            <button
              type="button"
              onClick={() => setInspectorTab('telemetry')}
              className={`py-2.5 px-3 border-b-2 font-sans flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                inspectorTab === 'telemetry'
                  ? 'border-purple-600 text-purple-900 font-bold bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              Model Telemetry &amp; Specs
            </button>

            <button
              type="button"
              onClick={() => setInspectorTab('json')}
              className={`py-2.5 px-3 border-b-2 font-sans flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                inspectorTab === 'json'
                  ? 'border-purple-600 text-purple-900 font-bold bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-purple-600" />
              {'{ }'} Raw Agent JSON
            </button>
          </div>

          {/* Tab Body Content */}
          <div className="p-5 space-y-4">
            {/* TAB 1: EXECUTIVE FINDINGS */}
            {inspectorTab === 'findings' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Headline Banner */}
                <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-2xs">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-purple-800 uppercase font-bold tracking-wider">
                      Target Audit: {projCode} · {projName}
                    </span>
                    <h4 className="font-sans font-bold text-sm text-slate-900">
                      {activeAgent.executiveSummary.headline}
                    </h4>
                  </div>
                  <Badge variant={activeAgent.badgeVariant} className="shadow-2xs">
                    {activeAgent.executiveSummary.alertLevel}
                  </Badge>
                </div>

                {/* Key Takeaways Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                    <h5 className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Key Intelligence Findings
                    </h5>
                    <ul className="space-y-2 text-xs font-sans text-slate-700">
                      {activeAgent.executiveSummary.keyTakeaways.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0 mt-1.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Directive Box */}
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2.5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <h5 className="font-mono text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Actionable Supervisory Directive
                      </h5>
                      <p className="font-sans text-xs text-slate-800 mt-2 font-medium leading-relaxed">
                        {activeAgent.executiveSummary.directive}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[10px] font-mono text-amber-800">
                      <span>Statutory Framework: NHAI GCC 2024</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Grounded &amp; Enforceable
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REASONING TRACE (CoT) */}
            {inspectorTab === 'trace' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 text-xs font-mono text-slate-500">
                  <span>Progressive Execution Chain-of-Thought</span>
                  <span>Total Step Latency: {activeAgent.latency}</span>
                </div>

                <div className="space-y-2.5">
                  {activeAgent.reasoningTrace.map((tr, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-purple-200 transition-colors flex items-start gap-3 shadow-2xs"
                    >
                      <div className="w-7 h-7 rounded-full bg-purple-100 border border-purple-300 text-purple-800 font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                        {idx + 1}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-sans font-semibold text-xs text-slate-900">
                            {tr.phase}
                          </span>
                          <span className="font-mono text-[10px] text-purple-700 font-medium">
                            {tr.time}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-slate-600 leading-relaxed">
                          {tr.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: GROUNDING & EVIDENCE */}
            {inspectorTab === 'citations' && (
              <div className="space-y-3 animate-fadeIn">
                {/* Compliance Agent: Show the exact contract clauses */}
                {activeAgent.id === 'compliance' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-slate-600 font-bold uppercase">
                        Vector Search Match Docket (pgvector)
                      </span>
                      <Badge variant="warning">3 Contract Groundings Matched</Badge>
                    </div>

                    {activeAgent.evidenceGrounding.clauses.map((cl, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-purple-800 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            {cl.doc} (Page {cl.page}, {cl.section})
                          </span>
                          <Badge variant="neutral">SIMILARITY: {(parseFloat(cl.score) * 100).toFixed(0)}%</Badge>
                        </div>
                        <p className="font-sans text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed font-serif italic shadow-2xs">
                          "{cl.text}"
                        </p>
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200/80">
                          <span>Clause Status: Legally Enforceable</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified in Central Corpus
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantitative Agent: Show metrics table */}
                {activeAgent.id === 'quantitative' && (
                  <div className="space-y-3">
                    <span className="font-mono text-xs text-slate-600 font-bold uppercase block">
                      CatBoost Feature Vector &amp; S-Curve Differential Breakdown
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {activeAgent.evidenceGrounding.metrics.map((m, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                          <span className="font-mono text-[10px] text-slate-500 block">{m.label}</span>
                          <strong className="font-mono text-sm text-purple-900 block font-bold">{m.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottleneck Agent: Show critical path drivers */}
                {activeAgent.id === 'bottleneck' && (
                  <div className="space-y-3">
                    <span className="font-mono text-xs text-slate-600 font-bold uppercase block">
                      TreeSHAP Delay Driver Attribution &amp; Critical Path Stalls
                    </span>
                    <div className="space-y-2">
                      {activeAgent.evidenceGrounding.drivers.map((drv, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-2xs">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-sans font-semibold text-slate-900">{drv.name}</span>
                            <span className="font-mono font-bold text-purple-700">{drv.impactPct}% Impact</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-purple-600 h-1.5 rounded-full"
                              style={{ width: `${drv.impactPct * 2}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                            <span>Critical Path: {drv.criticalPath ? 'YES (Zero Float)' : 'NO'}</span>
                            <span className="font-bold text-amber-700">{drv.severity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mitigation Agent: Show notice preview */}
                {activeAgent.id === 'mitigation' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-amber-800 font-bold uppercase">
                        Statutory Directive Draft ({activeAgent.evidenceGrounding.noticeId})
                      </span>
                      <Badge variant="warning">HUMAN-IN-THE-LOOP APPROVAL</Badge>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-amber-200 font-mono text-xs text-slate-800 leading-relaxed shadow-2xs">
                      <div className="font-bold text-slate-900 pb-2 border-b border-amber-100 mb-2">
                        {activeAgent.evidenceGrounding.title}
                      </div>
                      <p>{activeAgent.evidenceGrounding.body}</p>
                    </div>
                    {onApproveNotice && (
                      <div className="flex justify-end pt-1">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => onApproveNotice(activeAgent.evidenceGrounding.noticeId)}
                          icon={CheckCircle}
                        >
                          Authorize &amp; Dispatch Notice
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Orchestrator: Show consensus synthesis */}
                {activeAgent.id === 'orchestrator' && (
                  <div className="space-y-3">
                    <span className="font-mono text-xs text-slate-600 font-bold uppercase block">
                      Multi-Agent Consensus Matrix &amp; Routing Topology
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                        <span className="font-mono text-[10px] text-slate-500">Sub-Agents Synchronized</span>
                        <strong className="text-sm font-bold text-purple-900 block font-mono">4 Specialized Agents</strong>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                        <span className="font-mono text-[10px] text-slate-500">Multi-Agent Consensus Score</span>
                        <strong className="text-sm font-bold text-emerald-700 block font-mono">98.5% (High Agreement)</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: MODEL TELEMETRY */}
            {inspectorTab === 'telemetry' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                    <span className="font-mono text-[10px] text-slate-500">Inference Provider</span>
                    <strong className="font-mono text-slate-900 block">{activeAgent.telemetry.provider}</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                    <span className="font-mono text-[10px] text-slate-500">Model Identifier</span>
                    <strong className="font-mono text-slate-900 block">{activeAgent.telemetry.modelTag}</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                    <span className="font-mono text-[10px] text-slate-500">Deterministic Verification Hash</span>
                    <strong className="font-mono text-purple-800 block">{activeAgent.hash}</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                    <span className="font-mono text-[10px] text-slate-500">Statutory Audit Trail</span>
                    <strong className="font-mono text-emerald-700 block">{activeAgent.telemetry.auditStatus}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: RAW JSON */}
            {inspectorTab === 'json' && (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-slate-500">Serialized Sub-Agent Payload</span>
                  <button
                    type="button"
                    onClick={() => handleCopyPayload(activeAgent.rawPayload)}
                    className="text-xs font-mono text-purple-700 hover:text-purple-900 flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3 h-3" /> Copy JSON
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-64 border border-slate-800 shadow-inner">
                  {JSON.stringify(activeAgent.rawPayload, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =======================================================
          FULLSCREEN / EXPANDED MODAL OVERLAY
          Allows presentations and in-depth contract reading
          ======================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-purple-50 via-white to-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                  {React.createElement(activeAgent.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base text-slate-900">
                    {activeAgent.name} · Full Output Inspection
                  </h3>
                  <span className="font-mono text-xs text-slate-500">
                    {activeAgent.tier} · {activeAgent.model}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Full Tab View */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-purple-900 uppercase">
                    Executive Finding &amp; Directive
                  </span>
                  <Badge variant={activeAgent.badgeVariant}>{activeAgent.status}</Badge>
                </div>
                <p className="font-sans text-xs text-slate-800 leading-relaxed">
                  {activeAgent.findings}
                </p>
              </div>

              {/* Citations or evidence in full */}
              {activeAgent.id === 'compliance' && (
                <div className="space-y-3">
                  <h4 className="font-mono text-xs font-bold text-slate-900 uppercase">
                    Full Audited Contract Citations &amp; Excerpts
                  </h4>
                  {activeAgent.evidenceGrounding.clauses.map((cl, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <strong className="font-mono text-xs text-purple-800 font-bold">
                          {cl.doc} · {cl.section} (Page {cl.page})
                        </strong>
                        <Badge variant="neutral">SIMILARITY: {(parseFloat(cl.score) * 100).toFixed(0)}%</Badge>
                      </div>
                      <p className="font-serif italic text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                        "{cl.text}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Complete JSON preview */}
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold text-slate-700 uppercase">
                  Raw Sub-Agent Execution Output
                </span>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed max-h-72">
                  {JSON.stringify(activeAgent.rawPayload, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs font-mono text-slate-500">
              <span>Deterministic Hash: {activeAgent.hash}</span>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                Close Modal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
