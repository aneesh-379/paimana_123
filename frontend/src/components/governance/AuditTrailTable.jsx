import React from 'react';
import { Terminal, ShieldCheck, Clock } from 'lucide-react';
import Badge from '../common/Badge';

export default function AuditTrailTable({ auditLogs = [] }) {
  return (
    <div className="cockpit-card overflow-hidden bg-white border border-slate-200">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-700" />
          <h4 className="font-sans font-semibold text-sm text-slate-900">
            Immutable Governance Audit Trail (Section 23 Compliance)
          </h4>
        </div>
        <Badge variant="purple">{auditLogs.length} Logged Events</Badge>
      </div>

      <div className="overflow-x-auto max-h-72 overflow-y-auto">
        <table className="cockpit-table">
          <thead>
            <tr>
              <th>Log Event ID</th>
              <th>Action Trigger</th>
              <th>Operator / Principal</th>
              <th>Target Resource</th>
              <th>Timestamp (UTC)</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                <td>
                  <span className="font-mono text-xs font-bold text-purple-700">
                    {log.id}
                  </span>
                </td>
                <td>
                  <span className="font-mono text-xs font-semibold text-slate-800">
                    {log.action}
                  </span>
                </td>
                <td>
                  <span className="font-sans text-xs text-slate-700">
                    {log.user}
                  </span>
                </td>
                <td>
                  <span className="font-mono text-[11px] text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {log.resource}
                  </span>
                </td>
                <td>
                  <span className="font-mono text-[11px] text-slate-500">
                    {log.timestamp}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
