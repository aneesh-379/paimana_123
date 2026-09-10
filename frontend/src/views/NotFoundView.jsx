import React from 'react';
import { AlertCircle, ArrowLeft, Activity, ShieldAlert } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function NotFoundView({ onNavigateHome }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fadeIn">
      <div className="w-16 h-16 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4 shadow-sm">
        <ShieldAlert className="w-8 h-8 text-amber-600" />
      </div>

      <div className="space-y-2 max-w-md">
        <Badge variant="warning">404 NOT FOUND</Badge>
        <h2 className="font-sans font-bold text-2xl text-slate-900 tracking-tight">
          Page or Dossier Not Located
        </h2>
        <p className="font-sans text-xs text-slate-500 leading-relaxed">
          The requested infrastructure surveillance page, report parameter, or project code could not be verified in the active MoSPI registry.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <Button
          variant="primary"
          size="md"
          icon={Activity}
          onClick={onNavigateHome}
        >
          Back to Command Center
        </Button>
      </div>

      <div className="mt-8 text-[11px] font-mono text-slate-400">
        PAIMANA National Infrastructure Cockpit · Error Code: HTTP_404_NOT_FOUND
      </div>
    </div>
  );
}
