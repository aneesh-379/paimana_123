import React, { useState } from 'react';
import { AlertTriangle, Check, X, ShieldAlert, FileText, Send, Clock } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function WarningReviewModal({
  warning,
  isOpen,
  onClose,
  onApprove,
  onReject
}) {
  const [comment, setComment] = useState('Authorized pursuant to MoSPI Section 12.3 Protocol.');

  if (!isOpen || !warning) return null;

  return (
    <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-sm text-slate-900">
                MoSPI Level-2 Statutory Early Warning Docket
              </h4>
              <span className="font-mono text-[10px] text-slate-500">
                Ref: {warning.action_id || 'ACT-WARN-9041'} · Project: {warning.project_code || 'PAIM-619054'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Close warning review modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto font-sans text-xs">
          {/* Status Bar */}
          <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-mono text-[11px]">DOCKET STATUS:</span>
            <Badge variant={warning.status === 'APPROVED_DISPATCHED' ? 'success' : warning.status === 'REJECTED' ? 'critical' : 'warning'}>
              {warning.status || 'PENDING_HUMAN_APPROVAL'}
            </Badge>
          </div>

          {/* Trigger Condition */}
          <div className="space-y-1">
            <span className="text-slate-500 font-medium font-mono text-[10px] uppercase tracking-wider">
              Trigger Criteria & Threshold:
            </span>
            <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed font-mono text-[11px]">
              {warning.trigger || "Physical progress lag vs expenditure exceeding statutory 90-day threshold; ML delay forecast > 15 months."}
            </p>
          </div>

          {/* Draft Notice Body */}
          <div className="space-y-1">
            <span className="text-slate-500 font-medium font-mono text-[10px] uppercase tracking-wider">
              Formal Administrative Notice Text:
            </span>
            <div className="p-4 rounded-lg bg-purple-50/40 border border-purple-100 font-mono text-xs text-slate-800 leading-relaxed space-y-2">
              <p>{warning.body}</p>
            </div>
          </div>

          {/* Reviewer Note */}
          <div className="space-y-1">
            <label className="text-slate-500 font-medium font-mono text-[10px] uppercase tracking-wider block">
              Directorate Approval Note / Endorsement:
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-500 font-sans"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel Review
          </Button>

          <div className="flex gap-2">
            <Button
              variant="critical"
              size="sm"
              onClick={() => {
                onReject(warning.action_id || 'ACT-WARN-9041');
                onClose();
              }}
              icon={X}
            >
              Reject Action
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => {
                onApprove(warning.action_id || 'ACT-WARN-9041', comment);
                onClose();
              }}
              icon={Check}
            >
              Approve & Dispatch Directive
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
