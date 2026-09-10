import React, { useEffect } from 'react';
import {
  Activity,
  Layers,
  FolderKanban,
  MapPin,
  LineChart,
  Sliders,
  BarChart2,
  TrendingUp,
  BrainCircuit,
  AlertTriangle,
  Terminal,
  X,
  Search,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import Badge from '../common/Badge';

export default function Sidebar({
  activeTab = 'dashboard',
  onSelectTab,
  isCollapsed = false,
  onToggleCollapse = () => {},
  criticalCount = 342,
  pendingWarningsCount = 2,
  systemStatus = { status: 'ONLINE', llm: { status: 'ACTIVE' } },
  isMobileMenuOpen = false,
  onCloseMobileMenu = null,
  onOpenCmd = null
}) {
  // Handle keyboard shortcut (Escape closes mobile menu; Ctrl+[ toggles sidebar)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen && onCloseMobileMenu) {
        onCloseMobileMenu();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '[') {
        e.preventDefault();
        onToggleCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, onCloseMobileMenu, onToggleCollapse]);

  // The primary navigation items requested by the user
  const primaryNavItems = [
    { id: 'dashboard', label: 'Cockpit Overview', icon: Activity },
    { id: 'executive_summary', label: 'Executive Brief', icon: Layers },
    { id: 'projects', label: 'Project Directory', icon: FolderKanban },
    { id: 'predictive_models', label: 'Cost & Time ML', icon: LineChart },
    { id: 'scenario_simulator', label: 'What-If Sandbox', icon: Sliders },
    { id: 'benchmarking', label: 'Sector Benchmarks', icon: BarChart2 },
    { id: 'driver_analysis', label: 'Overrun Drivers', icon: TrendingUp },
    { id: 'llm_assistant', label: 'Multi-Agent AI', icon: BrainCircuit, badge: '5 Agents', badgeVariant: 'purple' }
  ];

  // Secondary Governance & Audit items to preserve full functionality
  const governanceNavItems = [
    {
      id: 'early_warnings',
      label: 'Governance & Warnings',
      icon: AlertTriangle,
      badge: pendingWarningsCount > 0 ? `${pendingWarningsCount} Action` : null,
      badgeVariant: 'warning'
    },
    { id: 'audit_trail', label: 'Section 23 Audit Trail', icon: Terminal }
  ];

  const handleItemClick = (id) => {
    onSelectTab(id);
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="cockpit-sidebar"
        aria-label="Main Navigation Sidebar"
        aria-expanded={!isCollapsed}
        className={`fixed lg:sticky top-16 inset-y-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-4rem)] select-none transition-all duration-200 ease-in-out motion-reduce:transition-none ${
          // Mobile state: full width drawer overlay
          isMobileMenuOpen
            ? 'translate-x-0 w-64 shadow-2xl !top-0 !h-screen z-50'
            : '-translate-x-full lg:translate-x-0'
        } ${
          // Desktop state: collapsed or expanded width
          isCollapsed ? 'lg:w-[72px]' : 'lg:w-64'
        }`}
      >
        {/* Top Control Bar of Sidebar */}
        <div className={`h-12 border-b border-slate-100 flex items-center bg-slate-50/60 transition-all ${
          isCollapsed ? 'px-2 justify-center' : 'px-3.5 justify-between'
        }`}>
          {/* Expanded State Header */}
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              <span className="font-mono text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Intelligence Console
              </span>
            </div>
          ) : null}

          {/* Toggle Button */}
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand navigation sidebar" : "Collapse navigation sidebar"}
            aria-expanded={!isCollapsed}
            aria-controls="cockpit-sidebar"
            className="hidden lg:flex items-center justify-center p-1.5 rounded-md text-slate-400 hover:text-purple-700 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
            title={isCollapsed ? "Expand sidebar (Ctrl+[)" : "Collapse sidebar (Ctrl+[)"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-purple-700" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Drawer Close Button */}
          {onCloseMobileMenu && isMobileMenuOpen && (
            <div className="lg:hidden flex items-center justify-between w-full">
              <span className="font-sans font-bold text-xs text-slate-900">Menu</span>
              <button
                onClick={onCloseMobileMenu}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                aria-label="Close navigation sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Quick Search Shortcut Bar */}
        {onOpenCmd && (
          <div className={`border-b border-slate-100 bg-white ${isCollapsed ? 'p-2 flex justify-center' : 'p-3'}`}>
            {!isCollapsed ? (
              <button
                onClick={onOpenCmd}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-purple-50/40 border border-slate-200 hover:border-purple-200 text-xs text-slate-500 hover:text-slate-800 transition-all shadow-xs"
                aria-label="Search database (Ctrl + K)"
              >
                <span className="flex items-center gap-2 truncate">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">Search Cockpit...</span>
                </span>
                <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white border border-slate-200 text-slate-600 shadow-xs">
                  ⌘K
                </kbd>
              </button>
            ) : (
              <button
                onClick={onOpenCmd}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-purple-700 hover:bg-purple-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors group relative"
                aria-label="Search Cockpit (Ctrl + K)"
                title="Search Cockpit (⌘K)"
              >
                <Search className="w-4 h-4" />
                {/* Collapsed Tooltip */}
                <div
                  role="tooltip"
                  className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-sans rounded-md shadow-xl whitespace-nowrap pointer-events-none z-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center gap-1.5"
                >
                  <span>Search</span>
                  <span className="font-mono text-[10px] text-slate-400">⌘K</span>
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                </div>
              </button>
            )}
          </div>
        )}

        {/* Navigation Items List */}
        <div className={`flex-1 overflow-y-auto space-y-4 ${isCollapsed ? 'p-2' : 'p-3'}`}>
          {/* Main Requested Intelligence Modules */}
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="px-3 font-mono text-[9px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Infrastructure Intelligence
              </span>
            )}
            <div className="space-y-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => handleItemClick(item.id)}
                      aria-label={item.label}
                      className={`w-full flex items-center rounded-lg text-xs transition-all text-left focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                        isCollapsed
                          ? 'h-10 w-10 mx-auto justify-center'
                          : 'px-3 py-2 justify-between'
                      } ${
                        isActive
                          ? 'bg-purple-100/90 text-purple-950 font-semibold border border-purple-200/90 shadow-xs'
                          : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-transparent font-medium'
                      }`}
                    >
                      <div className={`flex items-center gap-2.5 truncate ${isCollapsed ? 'justify-center' : ''}`}>
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-purple-700' : 'text-slate-400 group-hover:text-purple-600'
                          }`}
                        />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                            isActive
                              ? 'bg-purple-200 text-purple-900 border border-purple-300'
                              : 'bg-purple-50 text-purple-700 border border-purple-200 group-hover:bg-purple-100'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>

                    {/* Floating Tooltip in Collapsed State */}
                    {isCollapsed && (
                      <div
                        role="tooltip"
                        className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-sans rounded-md shadow-xl whitespace-nowrap pointer-events-none z-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center gap-2"
                      >
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-purple-500/40 text-purple-200 border border-purple-400/40 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Governance & Compliance Section */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            {!isCollapsed && (
              <span className="px-3 font-mono text-[9px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Governance & Oversight
              </span>
            )}
            <div className="space-y-1">
              {governanceNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => handleItemClick(item.id)}
                      aria-label={item.label}
                      className={`w-full flex items-center rounded-lg text-xs transition-all text-left focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                        isCollapsed
                          ? 'h-10 w-10 mx-auto justify-center'
                          : 'px-3 py-2 justify-between'
                      } ${
                        isActive
                          ? 'bg-purple-100/90 text-purple-950 font-semibold border border-purple-200/90 shadow-xs'
                          : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-transparent font-medium'
                      }`}
                    >
                      <div className={`flex items-center gap-2.5 truncate ${isCollapsed ? 'justify-center' : ''}`}>
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-purple-700' : 'text-slate-400 group-hover:text-purple-600'
                          }`}
                        />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 bg-amber-50 text-amber-700 border border-amber-200">
                          {item.badge}
                        </span>
                      )}
                    </button>

                    {/* Floating Tooltip in Collapsed State */}
                    {isCollapsed && (
                      <div
                        role="tooltip"
                        className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-sans rounded-md shadow-xl whitespace-nowrap pointer-events-none z-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center gap-2"
                      >
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-amber-500/40 text-amber-200 border border-amber-400/40 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Institutional Status Bar */}
        {!isCollapsed ? (
          <div className="p-3 border-t border-slate-100 bg-slate-50/70 text-[10px] font-mono text-slate-500 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-soft-pulse shrink-0" />
                MoSPI Live Stream
              </span>
              <span className="text-purple-700 font-bold">1,981 Works</span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-400">
              <span>XGBoost ML v2.4</span>
              <span>pgvector Active</span>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-center relative group">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-soft-pulse cursor-pointer" />
            <div
              role="tooltip"
              className="absolute bottom-2 left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-sans rounded-md shadow-xl whitespace-nowrap pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity font-mono"
            >
              <span>MoSPI Live Telemetry · 1,981 Works</span>
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
