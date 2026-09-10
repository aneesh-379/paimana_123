import React, { useState } from 'react';
import {
  Lock,
  AlertTriangle,
  CheckSquare,
  Shield,
  CheckCircle,
  AlertCircle,
  Eye,
  Check,
  X,
  FileText
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import AuditTrailTable from '../components/governance/AuditTrailTable';
import WarningReviewModal from '../components/governance/WarningReviewModal';
import { useToast } from '../context/ToastContext';

export default function GovernanceView({
  warningsList = [],
  auditLogs = [],
  onApproveAction
}) {
  const [selectedWarning, setSelectedWarning] = useState(null);
  const toast = useToast();

  const handleApprove = (actionId, note) => {
    if (onApproveAction) {
      onApproveAction(actionId, true, note);
      toast.success(
        "Statutory Notice Dispatched",
        `Action ${actionId} approved and logged in Section 23 compliance trail.`
      );
    }
  };

  const handleReject = (actionId) => {
    if (onApproveAction) {
      onApproveAction(actionId, false, "Rejected by Monitoring Director.");
      toast.warning(
        "Notice Rejected",
        `Action ${actionId} marked as rejected by human governance gate.`
      );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="font-sans font-bold text-xl text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-700" />
            Governance Gate, Early Warnings & Open Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enforces strict human-in-the-loop review before issuing administrative notices; maintains Section 23 immutable audit logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning">Human-in-the-Loop Active</Badge>
          <Badge variant="purple">Section 23 Compliance</Badge>
        </div>
      </div>

      {/* Warning Approval Queue */}
      <div className="cockpit-card overflow-hidden bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h4 className="font-sans font-semibold text-sm text-slate-900">
              Pending Statutory Warning Notices (Human Approval Queue)
            </h4>
          </div>
          <Badge variant="warning">
            {warningsList.filter(w => w.status === 'PENDING_HUMAN_APPROVAL').length} Pending Review
          </Badge>
        </div>

        <div className="p-5 space-y-4">
          {warningsList.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs font-mono">
              <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              All generated warning directives have been reviewed.
            </div>
          ) : (
            warningsList.map((item, idx) => {
              const isPending = item.status === 'PENDING_HUMAN_APPROVAL';

              return (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-slate-50/60 border border-slate-200 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-700">
                        {item.action_id}
                      </span>
                      <span className="text-slate-400">·</span>
                      <strong className="font-mono text-xs text-slate-800">
                        {item.project_code}
                      </strong>
                    </div>
                    <Badge variant={item.status === 'APPROVED_DISPATCHED' ? 'success' : item.status === 'REJECTED' ? 'critical' : 'warning'}>
                      {item.status}
                    </Badge>
                  </div>

                  <p className="font-mono text-xs text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-200 shadow-sm">
                    {item.body}
                  </p>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] font-mono text-slate-500">
                      Authority: MoSPI IPMD Section 12.3 Directive
                    </span>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedWarning(item)}
                        icon={Eye}
                      >
                        Review Docket
                      </Button>
                      {isPending && (
                        <>
                          <Button
                            variant="critical"
                            size="sm"
                            onClick={() => handleReject(item.action_id)}
                            icon={X}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleApprove(item.action_id, "Approved by Monitoring Director.")}
                            icon={Check}
                          >
                            Approve
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="cockpit-card overflow-hidden bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <h4 className="font-sans font-semibold text-sm text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-700" />
            Statutory Monitoring Compliance Checklist
          </h4>
        </div>
        <div className="divide-y divide-slate-100 font-sans text-xs">
          {[
            { label: 'XGBoost ML v2.4 Model Trained on MoSPI Central Sector Data', status: true, date: '2026-09-06' },
            { label: 'pgvector Hybrid RAG Contract Vector Store Active', status: true, date: '2026-09-07' },
            { label: 'Section 23 Immutable Audit Trail Logging Active', status: true, date: '2026-09-07' },
            { label: 'MoSPI Level-2 Advisory Threshold Trigger Configured (>90 days slippage)', status: true, date: '2026-09-07' },
            { label: 'Human-in-the-Loop Governance Gate Active (Zero Unchecked Dispatches)', status: true, date: '2026-09-07' },
            { label: 'PAIM-619054 GCC Clause 44.1 Advisory Issued', status: true, date: '2026-09-08' }
          ].map((c, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 px-5">
              <div className="flex items-center gap-3">
                {c.status ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span className="text-slate-700">{c.label}</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">{c.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail Table */}
      <AuditTrailTable auditLogs={auditLogs} />

      {/* Review Modal */}
      <WarningReviewModal
        warning={selectedWarning}
        isOpen={Boolean(selectedWarning)}
        onClose={() => setSelectedWarning(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
