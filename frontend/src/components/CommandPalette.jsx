import React, { useState, useEffect } from 'react';
import { Search, Activity, LineChart, ShieldAlert, BarChart2, Flame, MessageSquare, Lock, ArrowRight, X } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onSelectTab, onTriggerQuery }) {
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

  const actions = [
    { id: 'dashboard', icon: Activity, title: 'AI Infrastructure Dashboard Overview', category: 'Navigation', tab: 'dashboard' },
    { id: 'predictive_models', icon: LineChart, title: 'Cost & Time ML Overrun Simulator', category: 'Navigation', tab: 'predictive_models' },
    { id: 'risk_warnings', icon: ShieldAlert, title: 'Multi-Factor Risk & Early Warning System', category: 'Navigation', tab: 'risk_warnings' },
    { id: 'benchmarking', icon: BarChart2, title: 'Sector & Agency Benchmarking Matrix', category: 'Navigation', tab: 'benchmarking' },
    { id: 'driver_analysis', icon: Flame, title: 'Systemic Overrun Drivers Analysis', category: 'Navigation', tab: 'driver_analysis' },
    { id: 'llm_assistant', icon: MessageSquare, title: 'LLM Intelligence Assistant & Contract RAG', category: 'Navigation', tab: 'llm_assistant' },
    { id: 'governance_docs', icon: Lock, title: 'Governance Gate & Audit Log Trail', category: 'Navigation', tab: 'governance_docs' },
    { id: 'query_1', icon: Search, title: 'Why is Greenfield Expressway Phase I flagged high risk?', category: 'AI Quick Query', prompt: 'Why is Greenfield Expressway Phase I flagged high risk?' },
    { id: 'query_2', icon: Search, title: 'Generate Clause 44.1 delay warning notice', category: 'AI Quick Query', prompt: 'Generate Clause 44.1 delay warning notice for project PAIM-619054' },
    { id: 'query_3', icon: Search, title: 'Compare Transport vs Energy sector overrun trends', category: 'AI Quick Query', prompt: 'Compare Transport vs Energy sector overrun trends' }
  ];

  const filtered = actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div
      className="fixed inset-0 flex items-start justify-center pt-24 bg-[#0F172A]/80 backdrop-blur-md animate-fadeIn cursor-pointer"
      style={{ zIndex: 99999 }}
      onClick={() => onClose(false)}
    >
      <div
        className="w-full max-w-xl bg-[#0F172A] border-2 border-[#00D9FF] rounded-2xl shadow-[0_0_80px_rgba(0,217,255,0.4),0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden font-sans relative cursor-default"
        style={{ zIndex: 100000, backgroundColor: '#0F172A', opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Header */}
        <div className="flex items-center px-5 py-4 border-b border-[#00D9FF]/30 bg-[#2D1B69]/60">
          <Search className="w-5 h-5 text-[#00D9FF] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or ask PAIMANA Intelligence (Ctrl + K)..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none font-sans"
            autoFocus
          />
          <button onClick={() => onClose(false)} className="text-[#00D9FF] hover:text-[#ECFF00] p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-1.5 bg-[#0F172A]">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 font-mono">No matching commands found.</div>
          ) : (
            filtered.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.tab) {
                      onSelectTab(item.tab);
                    } else if (item.prompt) {
                      onTriggerQuery(item.prompt);
                    }
                    onClose(false);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1E293B] hover:bg-[#2D1B69] border border-[#334155] hover:border-[#00D9FF] transition-all duration-200 text-left text-xs group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-8.5 h-8.5 rounded-xl bg-[#6D28D9]/30 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] group-hover:scale-105 transition-transform shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-white block group-hover:text-[#ECFF00] transition-colors text-sm">{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{item.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#00D9FF] group-hover:text-[#ECFF00] transition-colors shrink-0" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-5 py-3 bg-[#2D1B69]/60 border-t border-[#00D9FF]/30 flex justify-between items-center text-[10px] font-mono text-slate-300">
          <div className="flex space-x-4">
            <span><strong className="text-[#ECFF00]">↑↓</strong> Navigate</span>
            <span><strong className="text-[#ECFF00]">↵</strong> Select</span>
            <span><strong className="text-[#ECFF00]">ESC</strong> Close</span>
          </div>
          <span className="text-[#00D9FF] font-bold tracking-wider">PAIMANA AI COMMAND CORE</span>
        </div>

      </div>
    </div>
  );
}
