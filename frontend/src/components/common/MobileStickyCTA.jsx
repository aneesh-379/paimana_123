import React, { useState } from 'react';
import {
  ArrowRight,
  FolderKanban,
  BrainCircuit,
  Sliders,
  AlertTriangle,
  X
} from 'lucide-react';
import Button from './Button';

export default function MobileStickyCTA({ activeTab, onSelectTab }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // View-specific actions
  const config = {
    dashboard: {
      label: 'Explore Projects Intelligence',
      target: 'projects',
      icon: FolderKanban,
      variant: 'primary'
    },
    projects: {
      label: 'Run AI Multi-Agent Audit',
      target: 'llm_assistant',
      icon: BrainCircuit,
      variant: 'primary'
    },
    predictive_models: {
      label: 'Test What-If Scenarios',
      target: 'scenario_simulator',
      icon: Sliders,
      variant: 'primary'
    },
    early_warnings: {
      label: 'Review Pending Level-2 Directives',
      target: 'early_warnings',
      icon: AlertTriangle,
      variant: 'critical'
    }
  }[activeTab];

  if (!config) return null;

  const IconComponent = config.icon;

  return (
    <div
      className="sm:hidden fixed bottom-0 left-0 right-0 z-[9980] p-3 bg-[#0A111E] border-t border-slate-800 shadow-2xl flex items-center gap-2"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <button
        onClick={() => onSelectTab(config.target)}
        className="flex-1 py-2.5 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-sans font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
      >
        <IconComponent className="w-4 h-4 shrink-0" />
        <span>{config.label}</span>
        <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1" />
      </button>

      <button
        onClick={() => setDismissed(true)}
        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        aria-label="Dismiss action bar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
