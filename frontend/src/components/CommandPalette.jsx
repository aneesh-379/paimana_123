import React, { useState, useEffect } from 'react';
import {
  Search,
  Activity,
  FolderKanban,
  MapPin,
  ShieldAlert,
  LineChart,
  BarChart2,
  Sliders,
  TrendingUp,
  BrainCircuit,
  FileText,
  AlertTriangle,
  Lock,
  Terminal,
  ArrowRight,
  X
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onSelectTab, onTriggerQuery, onSelectProject, projects = [] }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(prev => !prev);
      }
      if (e.key === 'Escape') {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const standardActions = [
    { id: 'nav_dashboard', icon: Activity, title: 'Cockpit Overview', category: 'Navigation', tab: 'dashboard' },
    { id: 'nav_projects', icon: FolderKanban, title: 'Projects Intelligence Directory', category: 'Navigation', tab: 'projects' },
    { id: 'nav_critical', icon: ShieldAlert, title: 'Critical Risk Watchlist', category: 'Navigation', tab: 'critical_watchlist' },
    { id: 'nav_predictive', icon: LineChart, title: 'Cost & Time ML Overrun Predictor', category: 'Analytics', tab: 'predictive_models' },
    { id: 'nav_simulator', icon: Sliders, title: 'Scenario What-If Simulator', category: 'Analytics', tab: 'scenario_simulator' },
    { id: 'nav_benchmarking', icon: BarChart2, title: 'Sector & Agency Benchmark Matrix', category: 'Analytics', tab: 'benchmarking' },
    { id: 'nav_drivers', icon: TrendingUp, title: 'Root Cause Overrun Drivers (Pareto)', category: 'Analytics', tab: 'driver_analysis' },
    { id: 'nav_ai', icon: BrainCircuit, title: 'Multi-Agent AI Intelligence Assistant', category: 'AI Tools', tab: 'llm_assistant' },
    { id: 'nav_warnings', icon: AlertTriangle, title: 'Early Warning Action Center', category: 'Governance', tab: 'early_warnings' },
    { id: 'nav_audit', icon: Terminal, title: 'Audit Trail & Compliance Records', category: 'Governance', tab: 'audit_trail' },
    { id: 'q_1', icon: Search, title: 'Why is PAIM-619054 flagged high risk?', category: 'Quick Query', prompt: 'Why is Greenfield Expressway Expansion (PAIM-619054) flagged high risk?' },
    { id: 'q_2', icon: Search, title: 'Evaluate GCC Clause 44.1 liquidated damages for delayed project', category: 'Quick Query', prompt: 'Evaluate GCC Clause 44.1 delay compensation and liquidated damages' },
    { id: 'q_3', icon: Search, title: 'Generate MoSPI Level-2 statutory warning notice', category: 'Quick Query', prompt: 'Generate MoSPI Level-2 warning notice for project PAIM-619054' }
  ];

  // Add project shortcuts if available
  const projectActions = (projects || []).map(p => ({
    id: `proj_${p.project_code}`,
    icon: FolderKanban,
    title: `${p.project_code} | ${p.project_name}`,
    category: 'Project Dossier',
    project: p
  }));

  const allActions = [...projectActions, ...standardActions];
  const filtered = allActions.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-sm z-[9999] px-4 cursor-pointer"
      onClick={() => onClose(false)}
    >
      <div
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden cursor-default animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, project code, or prompt (e.g. PAIM-619054, What-If, Clause 44.1)..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-sans"
            autoFocus
          />
          <button
            onClick={() => onClose(false)}
            className="text-slate-400 hover:text-slate-700 p-1 transition-colors"
            aria-label="Close palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-mono">
              No matching commands or projects found.
            </div>
          ) : (
            filtered.slice(0, 15).map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.project && onSelectProject) {
                      onSelectProject(item.project);
                    } else if (item.tab) {
                      onSelectTab(item.tab);
                    } else if (item.prompt && onTriggerQuery) {
                      onTriggerQuery(item.prompt);
                    }
                    onClose(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-purple-50/60 border border-transparent hover:border-purple-200 transition-colors text-left text-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-purple-700 group-hover:bg-purple-100/60 shrink-0">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="font-sans font-medium text-slate-800 block truncate group-hover:text-purple-950">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-700 transition-colors shrink-0 ml-2" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/80 flex justify-between items-center text-[10px] font-mono text-slate-500">
          <div className="flex gap-4">
            <span><strong>↑↓</strong> Navigate</span>
            <span><strong>↵</strong> Select</span>
            <span><strong>ESC</strong> Close</span>
          </div>
          <span>PAIMANA COMMAND BUS</span>
        </div>
      </div>
    </div>
  );
}
