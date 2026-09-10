import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  BrainCircuit,
  SlidersHorizontal,
  X
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import { getValue } from '../../data/mockProjects';

export default function ProjectTable({
  projects = [],
  onSelectProject = null,
  onAnalyzeProject = null,
  selectedProject = null
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [agencyFilter, setAgencyFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sortField, setSortField] = useState('risk');
  const [sortOrder, setSortOrder] = useState('desc');

  // Extract unique sectors & agencies
  const sectors = useMemo(() => {
    const sSet = new Set(projects.map(p => getValue(p.sector)).filter(Boolean));
    return Array.from(sSet);
  }, [projects]);

  const agencies = useMemo(() => {
    const aSet = new Set(projects.map(p => getValue(p.implementing_agency)).filter(Boolean));
    return Array.from(aSet);
  }, [projects]);

  // Handle Sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter and Sort logic
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const code = getValue(p.project_code).toLowerCase();
        const name = getValue(p.project_name).toLowerCase();
        const state = getValue(p.state).toLowerCase();
        const agency = getValue(p.implementing_agency);
        const sector = getValue(p.sector);
        const isHigh = getValue(p.target_is_high_risk) == 1 || p.composite_risk_score > 70;

        const matchesSearch =
          !searchTerm ||
          code.includes(searchTerm.toLowerCase()) ||
          name.includes(searchTerm.toLowerCase()) ||
          state.includes(searchTerm.toLowerCase());

        const matchesSector = sectorFilter === 'ALL' || sector === sectorFilter;
        const matchesAgency = agencyFilter === 'ALL' || agency === agencyFilter;
        const matchesRisk =
          riskFilter === 'ALL' ||
          (riskFilter === 'HIGH' && isHigh) ||
          (riskFilter === 'NORMAL' && !isHigh);

        return matchesSearch && matchesSector && matchesAgency && matchesRisk;
      })
      .sort((a, b) => {
        let valA, valB;
        if (sortField === 'risk') {
          valA = a.composite_risk_score || (getValue(a.target_is_high_risk) ? 80 : 20);
          valB = b.composite_risk_score || (getValue(b.target_is_high_risk) ? 80 : 20);
        } else if (sortField === 'progress') {
          valA = parseFloat(getValue(a.physical_progress, 0));
          valB = parseFloat(getValue(b.physical_progress, 0));
        } else if (sortField === 'cost') {
          valA = parseFloat(getValue(a.revised_cost, 0));
          valB = parseFloat(getValue(b.revised_cost, 0));
        } else if (sortField === 'delay') {
          valA = parseFloat(getValue(a.target_final_delay_months, 0));
          valB = parseFloat(getValue(b.target_final_delay_months, 0));
        } else {
          valA = getValue(a.project_code);
          valB = getValue(b.project_code);
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [projects, searchTerm, sectorFilter, agencyFilter, riskFilter, sortField, sortOrder]);

  const hasActiveFilters = searchTerm || sectorFilter !== 'ALL' || agencyFilter !== 'ALL' || riskFilter !== 'ALL';

  const clearFilters = () => {
    setSearchTerm('');
    setSectorFilter('ALL');
    setAgencyFilter('ALL');
    setRiskFilter('ALL');
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-slate-400 inline ml-1" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-purple-700 inline ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-purple-700 inline ml-1" />
    );
  };

  return (
    <div className="cockpit-card bg-white border border-slate-200 shadow-sm overflow-hidden space-y-3">
      {/* Table Header & Controls Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 bg-slate-50/70">
        <div className="flex flex-wrap items-center gap-2 flex-1 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search code, name, state..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-sans shadow-sm"
            />
          </div>

          {/* Sector Filter */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-sans shadow-sm"
          >
            <option value="ALL">All Sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Agency Filter */}
          <select
            value={agencyFilter}
            onChange={(e) => setAgencyFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-sans shadow-sm"
          >
            <option value="ALL">All Agencies</option>
            {agencies.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-sans shadow-sm"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="HIGH">Critical / High Risk</option>
            <option value="NORMAL">Normal / Monitored</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 font-medium"
              title="Reset all filters"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
          <span>Showing <strong>{filteredProjects.length}</strong> of {projects.length}</span>
        </div>
      </div>

      {/* Table Data View */}
      {filteredProjects.length === 0 ? (
        <div className="p-8">
          <EmptyState
            title="No infrastructure projects match your criteria"
            description="Try adjusting your search query, sector, or risk status filter to view available projects."
            actionText="Clear All Filters"
            onAction={clearFilters}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="cockpit-table text-xs">
            <thead>
              <tr>
                <th onClick={() => handleSort('code')} className="cursor-pointer">
                  Project Code {getSortIcon('code')}
                </th>
                <th>Project Details</th>
                <th>Agency / State</th>
                <th onClick={() => handleSort('progress')} className="cursor-pointer">
                  Physical Progress {getSortIcon('progress')}
                </th>
                <th onClick={() => handleSort('cost')} className="cursor-pointer">
                  Cost (Orig → Rev) {getSortIcon('cost')}
                </th>
                <th onClick={() => handleSort('delay')} className="cursor-pointer">
                  Delay {getSortIcon('delay')}
                </th>
                <th onClick={() => handleSort('risk')} className="cursor-pointer">
                  Risk Tier {getSortIcon('risk')}
                </th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p, idx) => {
                const isSelected = selectedProject?.project_code === p.project_code;
                const isHighRisk = getValue(p.target_is_high_risk) == 1 || p.composite_risk_score > 70;
                const phys = parseFloat(getValue(p.physical_progress, 0));
                const orig = parseFloat(getValue(p.original_cost, 0));
                const rev = parseFloat(getValue(p.revised_cost, orig));
                const costOverrun = (((rev - orig) / Math.max(1, orig)) * 100).toFixed(1);
                const delay = getValue(p.target_final_delay_months, 0);

                return (
                  <tr
                    key={idx}
                    className={`cursor-pointer ${isSelected ? 'bg-purple-50/70 border-l-2 border-l-purple-600' : 'hover:bg-slate-50/80'}`}
                    onClick={() => onSelectProject && onSelectProject(p)}
                  >
                    <td>
                      <span className="font-mono text-xs font-bold text-purple-700">
                        {getValue(p.project_code)}
                      </span>
                    </td>
                    <td>
                      <span className="font-sans font-medium text-xs text-slate-900 max-w-[230px] block truncate" title={getValue(p.project_name)}>
                        {getValue(p.project_name)}
                      </span>
                      <span className="font-sans text-[10px] text-slate-500">
                        {getValue(p.sector)}
                      </span>
                    </td>
                    <td>
                      <span className="font-sans text-xs text-slate-700 font-medium block">
                        {getValue(p.implementing_agency)}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {getValue(p.state)}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="cockpit-progress-track w-20">
                          <div
                            className="cockpit-progress-fill"
                            style={{
                              width: `${phys}%`,
                              backgroundColor: phys > 60 ? '#047857' : phys > 35 ? '#D97706' : '#BE123C'
                            }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {phys}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="font-mono text-xs">
                        <span className="text-slate-500">₹{orig}</span>
                        <span className="text-slate-400 mx-1">→</span>
                        <strong className="text-rose-700">₹{rev} Cr</strong>
                        <span className="text-[10px] text-amber-700 block">
                          (+{costOverrun}%)
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-xs font-semibold text-rose-700">
                        +{delay} Mo
                      </span>
                    </td>
                    <td>
                      <Badge variant={isHighRisk ? 'critical' : 'success'}>
                        {isHighRisk ? 'CRITICAL' : 'ON TRACK'}
                      </Badge>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectProject && onSelectProject(p)}
                          icon={Eye}
                          className="shadow-sm text-[11px]"
                        >
                          Dossier
                        </Button>
                        {onAnalyzeProject && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onAnalyzeProject(p)}
                            icon={BrainCircuit}
                            className="text-[11px]"
                          >
                            AI Audit
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
