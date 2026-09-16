import React from 'react';
import { Upload, FileSpreadsheet, FileText, CheckCircle, X, Sparkles } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card3D from '../common/Card3D';

export default function IngestionZone({
  attachedFile = null,
  onFileSelect,
  onLoadDemoFile,
  onClearFile
}) {
  return (
    <Card3D
      tiltDegree={3}
      glowColor="rgba(124, 58, 237, 0.2)"
      className={`p-5 rounded-2xl border transition-all duration-300 ${
        attachedFile
          ? 'bg-gradient-to-r from-emerald-50/70 via-white to-purple-50/40 border-emerald-300 shadow-[0_8px_25px_-5px_rgba(16,185,129,0.2)]'
          : 'bg-gradient-to-r from-slate-50/90 via-white to-purple-50/30 border-dashed border-slate-300 hover:border-purple-300 shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-purple-700 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(109,40,217,0.35)] shrink-0 transition-transform group-hover:scale-105">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-sans font-bold text-xs text-slate-900 tracking-tight">
                Ingest MoSPI Project Snapshot (.CSV / Dataset)
              </h4>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100/90 text-purple-800 font-semibold border border-purple-200">
                Auto-Inference
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              CSV runs automated CatBoost &amp; ExtraTrees ML predictive inference and multi-agent risk synthesis.
            </p>
          </div>
        </div>

        {/* Upload Buttons with 3D tactile press */}
        <div className="flex flex-wrap items-center gap-2.5">
          <label className="btn-cockpit btn-ghost text-xs cursor-pointer bg-white border border-slate-200 hover:border-purple-300 text-slate-700 shadow-2xs hover:-translate-y-0.5 active:translate-y-0 transition-all">
            <FileSpreadsheet className="w-3.5 h-3.5 text-purple-700" />
            <span className="font-semibold">Select .CSV</span>
            <input type="file" accept=".csv" onChange={onFileSelect} className="hidden" />
          </label>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLoadDemoFile('csv')}
            icon={FileSpreadsheet}
            className="text-purple-700 hover:text-purple-900 bg-white border border-slate-200 shadow-2xs hover:-translate-y-0.5 active:translate-y-0 transition-all font-semibold"
          >
            Demo CSV
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLoadDemoFile('pdf')}
            icon={FileText}
            className="text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-2xs hover:-translate-y-0.5 active:translate-y-0 transition-all font-medium"
          >
            Demo PDF
          </Button>
        </div>
      </div>

      {attachedFile && (
        <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-emerald-50/90 border border-emerald-300 text-xs font-mono shadow-2xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="text-emerald-950 font-medium">
              <strong className="font-bold text-emerald-800">Ingestion Target Ready:</strong> {attachedFile.name} ({attachedFile.size})
            </span>
          </div>
          <button
            type="button"
            onClick={onClearFile}
            className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-white/80 transition-colors"
            aria-label="Remove attachment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </Card3D>
  );
}
