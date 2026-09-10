import React from 'react';
import {
  Activity,
  LineChart as LineChartIcon,
  ShieldAlert,
  BarChart2,
  Flame,
  BrainCircuit,
  Lock
} from 'lucide-react';

// Navigation tabs (must stay in sync with App.jsx)
const NAV_TABS = [
  { id: 'dashboard',        icon: Activity,      label: 'Cockpit Overview',      sub: '(g)' },
  { id: 'predictive_models',icon: LineChartIcon,  label: 'Cost & Time ML',         sub: '(a,b)' },
  { id: 'risk_warnings',    icon: ShieldAlert,    label: 'Risk & Early Warning',   sub: '(c,d)' },
  { id: 'benchmarking',     icon: BarChart2,      label: 'Sector Benchmarks',      sub: '(e)' },
  { id: 'driver_analysis',  icon: Flame,          label: 'Overrun Drivers',        sub: '(f)' },
  { id: 'llm_assistant',    icon: BrainCircuit,   label: 'Multi-Agent AI',         sub: '(h)' },
  { id: 'governance_docs',  icon: Lock,           label: 'Governance & Audit',     sub: '(i)' }
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <nav className="sidebar" aria-label="Main navigation">
      {NAV_TABS.map(tab => {
        const TabIcon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <TabIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{tab.label}</span>
            <span className="hide-mobile font-mono text-[9px] opacity-50">{tab.sub}</span>
          </button>
        );
      })}
    </nav>
  );
}
