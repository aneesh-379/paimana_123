import React from 'react';
import {
  Search,
  Menu,
  BrainCircuit,
  Eye
} from 'lucide-react';
import Badge from '../common/Badge';

export default function Header({
  activeTab = 'dashboard',
  onSelectTab,
  onOpenCmd,
  onToggleMobileMenu = null,
  selectedProject = null,
  onOpenDossier = null,
  systemStatus = { status: 'ONLINE', llm: { status: 'ACTIVE' }, database: { connected: true } }
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: National Emblem + Institutional Branding */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Menu Button (< lg) */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Official National Emblem of India - Dignified & Stationary */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img
              src="/national-emblem.png"
              alt="National Emblem of India"
              className="h-10 w-auto object-contain shrink-0 select-none"
              style={{ maxHeight: '40px' }}
            />
            <div className="h-8 w-px bg-slate-200 shrink-0" />
          </div>

          {/* Institutional Product Branding */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-sans font-extrabold text-base tracking-tight text-slate-900 leading-tight">
                PAIMANA <span className="text-purple-600 font-bold">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold uppercase">
                Cockpit
              </span>
            </div>
            <p className="font-sans text-[11px] text-slate-500 truncate leading-tight">
              MoSPI | SIH26103 · National Infrastructure Intelligence
            </p>
          </div>
        </div>

        {/* Center: Search / Cmd Palette Input */}
        <button
          onClick={onOpenCmd}
          className="hidden md:flex items-center justify-between w-64 lg:w-72 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:border-purple-300 hover:text-slate-800 hover:bg-white transition-all text-xs shadow-xs"
          aria-label="Open search palette (Ctrl + K)"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate text-slate-500">Search projects, clauses, metrics...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white border border-slate-200 text-slate-600 shrink-0 ml-1 shadow-xs">
            ⌘K
          </kbd>
        </button>

        {/* Right Controls: Search Mobile, Active Project & Telemetry */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenCmd}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Open search palette"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Active Selected Project Pill */}
          {selectedProject && (
            <button
              onClick={() => onOpenDossier && onOpenDossier(selectedProject)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50/60 border border-purple-200 text-[11px] font-mono hover:border-purple-300 hover:bg-purple-100/60 transition-colors text-purple-900 shadow-xs"
              title="Inspect Selected Project Dossier"
            >
              <span className="text-slate-500 font-sans text-[10px]">Active:</span>
              <span className="font-bold">{selectedProject.project_code}</span>
              <Eye className="w-3 h-3 text-purple-600 ml-0.5" />
            </button>
          )}

          {/* Operational Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] sm:text-[11px] font-mono text-emerald-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-soft-pulse shrink-0" />
            <span className="font-bold tracking-wider">OPERATIONAL</span>
          </div>
        </div>
      </div>
    </header>
  );
}
