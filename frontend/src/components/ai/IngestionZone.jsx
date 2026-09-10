import React from 'react';
import { Upload, FileSpreadsheet, FileText, CheckCircle, X } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function IngestionZone({
  attachedFile = null,
  onFileSelect,
  onLoadDemoFile,
  onClearFile
}) {
  return (
    <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-sans font-semibold text-xs text-slate-900">
              Ingest MoSPI Project Snapshot (.CSV)
            </h4>
            <p className="text-[11px] text-slate-500">
              CSV runs automated CatBoost & ExtraTrees ML predictive inference and multi-agent risk synthesis.
            </p>
          </div>
        </div>

        {/* Upload Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="btn-cockpit btn-ghost text-xs cursor-pointer bg-white border border-slate-200 hover:border-purple-200 text-slate-700">
            <FileSpreadsheet className="w-3.5 h-3.5 text-purple-700" />
            <span>Select .CSV</span>
            <input type="file" accept=".csv" onChange={onFileSelect} className="hidden" />
          </label>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLoadDemoFile('csv')}
            icon={FileSpreadsheet}
            className="text-purple-700 hover:text-purple-900 bg-white border border-slate-200"
          >
            Demo CSV
          </Button>
        </div>
      </div>

      {attachedFile && (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-900">
              <strong>Ingestion Target Ready:</strong> {attachedFile.name} ({attachedFile.size})
            </span>
          </div>
          <button
            onClick={onClearFile}
            className="text-slate-400 hover:text-slate-700 p-1 transition-colors"
            aria-label="Remove attachment"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
