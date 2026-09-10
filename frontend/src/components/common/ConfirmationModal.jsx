import React from 'react';
import { CheckCircle, ShieldCheck, ArrowRight, X } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

export default function ConfirmationModal({
  isOpen,
  onClose,
  title = "Administrative Action Authorized",
  referenceId = "ACT-WARN-9041",
  message = "The statutory notice has been logged in the Section 23 compliance trail and dispatched to the executing agency.",
  onViewAuditTrail,
  onReturnHome
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-center space-y-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close confirmation dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
          <CheckCircle className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <Badge variant="success">AUTHORIZED &amp; RECORDED</Badge>
          <h3 id="confirmation-modal-title" className="font-sans font-bold text-lg text-slate-900">{title}</h3>
          <p className="font-mono text-xs text-purple-700 font-bold">
            Docket ID: {referenceId}
          </p>
          <p className="font-sans text-xs text-slate-600 leading-relaxed pt-1">
            {message}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600 flex items-center justify-between">
          <span>Compliance Protocol:</span>
          <span className="text-emerald-700 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Section 23 Verified
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          {onViewAuditTrail && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClose();
                onViewAuditTrail();
              }}
              className="flex-1"
            >
              View Audit Trail
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              if (onReturnHome) onReturnHome();
            }}
            className="flex-1"
          >
            Return to Command Center
          </Button>
        </div>
      </div>
    </div>
  );
}
