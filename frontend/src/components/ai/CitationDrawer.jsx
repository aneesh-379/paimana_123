import React from 'react';
import { FileText, ShieldCheck, ExternalLink, Bookmark, Scale } from 'lucide-react';
import Badge from '../common/Badge';

export default function CitationDrawer({
  citations = [],
  ragResults = []
}) {
  return (
    <div className="cockpit-card p-5 space-y-4 bg-white border border-slate-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-purple-700" />
          <h4 className="font-sans font-semibold text-sm text-slate-900">
            Statutory Evidence & Contract Citation Docket
          </h4>
        </div>
        <Badge variant="purple">{citations.length + ragResults.length} Auditable Sources</Badge>
      </div>

      <div className="space-y-3">
        {/* Dynamic Citations */}
        {citations.map((cite, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-purple-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Citation Ref #{idx + 1}
              </span>
              <Badge variant="neutral">VERIFIED CITATION</Badge>
            </div>
            <p className="font-sans text-xs text-slate-800 font-medium">
              {cite}
            </p>
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200/80">
              <span>Repository: MoSPI Statutory Document Index</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Grounded in Corpus
              </span>
            </div>
          </div>
        ))}

        {/* Vector RAG Matched Clauses */}
        {ragResults.map((r, idx) => (
          <div
            key={`rag_${idx}`}
            className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-700">
                {r.document} · {r.clause}
              </span>
              <Badge variant="warning">RAG MATCH: {(r.score * 100).toFixed(0)}%</Badge>
            </div>
            <p className="font-sans text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
              "{r.text}"
            </p>
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200/80">
              <span>Clause Extraction Engine: Supabase pgvector</span>
              <span className="text-purple-700 font-medium">Active Legal Reference</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
