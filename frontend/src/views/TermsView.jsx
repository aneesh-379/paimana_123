import React from 'react';
import { FileText, Shield, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function TermsView({ onNavigateHome }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 animate-fadeIn font-sans text-xs">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-700" />
            <h2 className="font-sans font-bold text-xl text-slate-900">
              Platform Terms of Use & Advisory Framework
            </h2>
          </div>
          <span className="font-mono text-[10px] text-slate-500">
            Applicable to: PAIMANA AI Surveillance Cockpit · SIH 26103
          </span>
        </div>
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onNavigateHome}>
          Back to Cockpit
        </Button>
      </div>

      <div className="cockpit-card p-6 space-y-5 bg-white border border-slate-200 text-slate-700 leading-relaxed shadow-sm">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">1. Acceptance of Terms</h3>
          <p>
            By accessing PAIMANA AI, designated infrastructure officers and monitoring directors agree to comply with authorized surveillance protocols governed by{' '}
            <strong className="text-purple-800">[OFFICIAL ORGANIZATION: Ministry of Statistics and Programme Implementation (MoSPI), Government of India]</strong>.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">2. Nature of Artificial Intelligence Outputs</h3>
          <p>
            Forecasted schedule slippages (months) and cost overruns (%) are mathematical estimates derived from historical MoSPI datasets and machine learning regressors. <strong>Human-in-the-loop validation is strictly required</strong> prior to dispatching statutory directives, Level-2 advisory notices, or liquidated damages assessments under GCC Clause 44.1.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">3. Tamper-Evident Accountability</h3>
          <p>
            All administrative decisions, notice dispatches, and parameter modifications are permanently logged into the immutable Section 23 Audit Trail with operator authentication metadata.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">4. Limitation of Operational Liability</h3>
          <p>
            PAIMANA AI provides predictive intelligence and decision support. Actual project outcomes depend on ground-level contractor execution, state land handovers, and macroeconomic factors.
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">5. Administration & Inquiries</h3>
          <p>
            For administrative escalation or terms clarification:{' '}
            <span className="font-mono text-purple-700 font-semibold">[OFFICIAL CONTACT EMAIL: ipmd-support@mospi.gov.in]</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
