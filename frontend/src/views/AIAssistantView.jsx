import React, { useState } from 'react';
import {
  BrainCircuit,
  Send,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import IngestionZone from '../components/ai/IngestionZone';
import AgentFlowDAG from '../components/visualizers/AgentFlowDAG';
import MarkdownRenderer from '../components/ai/MarkdownRenderer';
import CitationDrawer from '../components/ai/CitationDrawer';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import { getValue } from '../data/mockProjects';

export default function AIAssistantView({
  chatInput,
  setChatInput,
  onRunQuery,
  chatLoading,
  pipelineStep,
  orchestrationResult,
  selectedProject,
  attachedFile,
  onFileSelect,
  onLoadDemoFile,
  onClearFile,
  ragResults = [],
  onApproveAction
}) {
  const toast = useToast();

  const inputCodeMatch = chatInput && chatInput.match(/([A-Z]{2,6}-\d+)/i);
  const targetName = attachedFile 
    ? attachedFile.name 
    : (inputCodeMatch 
        ? inputCodeMatch[1].toUpperCase() 
        : (selectedProject && selectedProject.project_code !== "PAIM-619054" ? getValue(selectedProject.project_code) : 'active project'));

  const getDynamicTargetDisplay = () => {
    if (attachedFile) {
      return `INGESTED FILE (${attachedFile.name})`;
    }
    if (inputCodeMatch) {
      return inputCodeMatch[1].toUpperCase();
    }
    if (orchestrationResult?.project_code && orchestrationResult.project_code !== "PAIM-619054") {
      return orchestrationResult.project_code;
    }
    if (selectedProject && selectedProject.project_code && selectedProject.project_code !== "PAIM-619054") {
      return getValue(selectedProject.project_code);
    }
    return "ACTIVE PORTFOLIO";
  };

  const quickPrompts = [
    `Why is ${targetName} flagged high risk?`,
    "Evaluate GCC Clause 44.1 liquidated damages and delay compensation",
    `Should MoSPI authorize advance capital disbursement for ${targetName}?`,
    "Generate statutory Level-2 warning notice with 14-day catch-up directive"
  ];

  const handleApproveNotice = (noticeId) => {
    if (onApproveAction) {
      onApproveAction(noticeId, true);
      toast.success(
        "Warning Notice Approved",
        `Statutory directive ${noticeId} authorized and queued for IPMD dispatch.`
      );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="font-sans font-bold text-xl text-slate-900">
            Multi-Agent Decision Support &amp; Evidence Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Query project risks or ingest CSV datasets for automated ML predictive inference and multi-agent risk synthesis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple">NVIDIA NIM Active</Badge>
          <Badge variant="cyan">pgvector RAG</Badge>
        </div>
      </div>

      {/* Ingestion Zone */}
      <IngestionZone
        attachedFile={attachedFile}
        onFileSelect={onFileSelect}
        onLoadDemoFile={onLoadDemoFile}
        onClearFile={onClearFile}
      />

      {/* Query Bar Card */}
      <div className="cockpit-card bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-1">
          <span className="font-mono text-[11px] text-slate-600 uppercase tracking-wider">
            Investigation Target: <strong className="text-purple-800">{getDynamicTargetDisplay()}</strong>
          </span>
          <span className="text-[10px] font-mono text-slate-400">Press Enter ↵ to submit</span>
        </div>

        <div className="flex gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !chatLoading && chatInput.trim()) {
                  onRunQuery(chatInput);
                }
              }}
              placeholder={
                attachedFile
                  ? `Investigate ingested file ${attachedFile.name}...`
                  : "Investigate project risk, delay drivers, or GCC Clause 44.1..."
              }
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-sans shadow-sm"
            />
          </div>
          <Button
            variant="primary"
            size="md"
            loading={chatLoading}
            onClick={() => onRunQuery(chatInput)}
            icon={Send}
            disabled={!chatInput.trim() && !attachedFile}
            className="shadow-sm font-semibold"
          >
            {chatLoading ? 'Analyzing...' : 'Run Investigation'}
          </Button>
        </div>

        {/* Quick Inquiries */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="font-mono text-[10px] text-slate-500 font-semibold">Suggested Inquiries:</span>
          {quickPrompts.map((pt, i) => (
            <button
              key={i}
              onClick={() => {
                setChatInput(pt);
                onRunQuery(pt);
              }}
              className="text-[11px] font-sans text-purple-900 hover:text-purple-950 px-2.5 py-1 rounded bg-purple-50/70 border border-purple-200/80 hover:bg-purple-100 transition-colors"
            >
              "{pt}"
            </button>
          ))}
        </div>
      </div>

      {/* Live Stepper Indicator */}
      {chatLoading && (
        <div className="cockpit-card bg-white p-5 space-y-3 shadow-sm border border-purple-200">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-purple-700 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
              Live Autonomous Pipeline Execution
            </span>
            <span className="text-slate-500">Step {pipelineStep} of 4</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {[
              { num: 1, label: 'Feature Ingestion', sub: 'Parsing snapshots' },
              { num: 2, label: 'ML Inference', sub: 'XGBoost v2.4 Engine' },
              { num: 3, label: 'Vector RAG Search', sub: 'pgvector GCC Clauses' },
              { num: 4, label: 'Multi-Agent Synthesis', sub: 'Grounded Output' }
            ].map((st) => {
              const isActive = pipelineStep >= st.num;
              return (
                <div
                  key={st.num}
                  className={`p-2.5 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-purple-50 border-purple-300 text-purple-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <strong className="block text-[11px]">Step {st.num}: {st.label}</strong>
                  <span className="text-[10px] opacity-80">{st.sub}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Orchestration Results Display */}
      {orchestrationResult && (
        <div className="space-y-5 animate-slide-up">
          {/* User Query Echo */}
          {orchestrationResult.original_query && (
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-sans flex items-start gap-2.5">
              <span className="font-mono text-purple-700 font-bold shrink-0">OPERATOR QUERY:</span>
              <span className="text-purple-950 font-medium">{orchestrationResult.original_query}</span>
            </div>
          )}

          {/* Autonomous Multi-Agent DAG Flow */}
          <AgentFlowDAG
            confidence={orchestrationResult.confidence || 0.97}
            agentDetails={orchestrationResult.agent_details}
            agentsUsed={orchestrationResult.agents_used}
          />

          {/* AI Synthesis Box with Structured Markdown Rendering */}
          <div className="cockpit-card bg-white p-6 space-y-4 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h4 className="font-sans font-bold text-sm text-slate-900">
                Project Risk Diagnosis &amp; Evidence Analysis
              </h4>
              <Badge variant="purple">GROUNDED REASONING</Badge>
            </div>

            <MarkdownRenderer content={orchestrationResult.answer} />
          </div>

          {/* Human-in-the-Loop Statutory Draft Notice */}
          {orchestrationResult.mitigation?.draft_notice && (
            <div className="cockpit-card bg-[#FFFBEB] p-5 space-y-3.5 border border-[#FDE68A] shadow-sm">
              <div className="flex justify-between items-center pb-2 border-b border-amber-200/80">
                <span className="font-mono text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  STATUTORY ACTION NOTICE (HUMAN-IN-THE-LOOP APPROVAL REQUIRED)
                </span>
                <Badge variant="warning">AWAITING DIRECTOR AUTHORIZATION</Badge>
              </div>

              <div className="p-4 rounded-lg bg-white border border-amber-200 font-mono text-xs text-slate-800 leading-relaxed shadow-sm">
                {orchestrationResult.mitigation.draft_notice.body}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleApproveNotice(orchestrationResult.mitigation.draft_notice.notice_id)}
                  icon={CheckCircle}
                  className="font-semibold shadow-sm"
                >
                  Authorize &amp; Dispatch Notice
                </Button>
              </div>
            </div>
          )}

          {/* Auditable Legal & GCC Contract Citations Docket */}
          <CitationDrawer
            citations={orchestrationResult.citations || []}
            ragResults={ragResults}
          />
        </div>
      )}
    </div>
  );
}
