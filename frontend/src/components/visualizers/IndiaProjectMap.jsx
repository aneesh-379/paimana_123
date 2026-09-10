import React, { useState } from 'react';
import { INDIA_STATES, INDIA_OUTLINE_PATH } from '../../data/indiaStatesGeo';
import Badge from '../common/Badge';
import { MapPin, AlertCircle, CheckCircle, Eye, Info } from 'lucide-react';
import { getValue } from '../../data/mockProjects';

export default function IndiaProjectMap({
  projects = [],
  selectedProject = null,
  onSelectProject = null,
  onFilterByState = null
}) {
  const [hoveredState, setHoveredState] = useState(null);
  const [activeStateFilter, setActiveStateFilter] = useState(null);

  // Group projects by state
  const stateProjectsMap = {};
  projects.forEach(p => {
    const s = getValue(p.state);
    if (!stateProjectsMap[s]) stateProjectsMap[s] = [];
    stateProjectsMap[s].push(p);
  });

  const handleStateClick = (st) => {
    const nextState = activeStateFilter === st.name ? null : st.name;
    setActiveStateFilter(nextState);
    if (onFilterByState) onFilterByState(nextState);
  };

  const filteredProjects = activeStateFilter
    ? projects.filter(p => getValue(p.state) === activeStateFilter)
    : projects;

  return (
    <div className="cockpit-card p-5 space-y-4 bg-white border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-sans font-semibold text-sm text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-700" />
            National Geographic Infrastructure Distribution (GIS)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Geospatial concentration of central sector capital works and delay vulnerability zones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeStateFilter && (
            <button
              onClick={() => handleStateClick({ name: activeStateFilter })}
              className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200"
            >
              Clear State: <strong className="text-purple-700">{activeStateFilter}</strong> [×]
            </button>
          )}
          <Badge variant="purple">{projects.length} Monitored Projects</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* SVG India Map Display (7 cols) */}
        <div className="lg:col-span-7 relative flex justify-center bg-slate-50/70 p-4 rounded-xl border border-slate-200 min-h-[380px]">
          <svg viewBox="0 0 600 680" className="w-full h-auto max-h-[460px] select-none">
            {/* National Outline Backdrop */}
            <path
              d={INDIA_OUTLINE_PATH}
              fill="#E2E8F0"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* State Grid Markers */}
            {INDIA_STATES.map((st) => {
              const stateProjs = stateProjectsMap[st.name] || [];
              const hasProjects = stateProjs.length > 0;
              const hasCritical = stateProjs.some(p => getValue(p.target_is_high_risk) == 1 || p.composite_risk_score > 70);
              const isSelected = activeStateFilter === st.name;

              const pinColor = hasCritical ? '#E11D48' : hasProjects ? '#10B981' : '#94A3B8';

              return (
                <g
                  key={st.id}
                  className="cursor-pointer group"
                  onClick={() => handleStateClick(st)}
                  onMouseEnter={() => setHoveredState({ ...st, projects: stateProjs })}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  {/* Subtle state zone circle */}
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={hasProjects ? 18 : 10}
                    fill={isSelected ? 'rgba(124, 58, 237, 0.15)' : hasProjects ? 'rgba(0, 0, 0, 0.03)' : 'transparent'}
                    stroke={isSelected ? '#7C3AED' : hasProjects ? pinColor : 'transparent'}
                    strokeWidth={isSelected ? 2 : 1}
                    className="transition-all duration-200"
                  />

                  {/* Marker Pin */}
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={hasProjects ? 6 : 3}
                    fill={pinColor}
                    className={hasCritical ? 'animate-soft-pulse' : ''}
                  />

                  {/* State abbreviation */}
                  <text
                    x={st.x}
                    y={st.y + 16}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                    fill={isSelected ? '#7C3AED' : hasProjects ? '#0F172A' : '#64748B'}
                    fontWeight={hasProjects ? 'bold' : 'normal'}
                  >
                    {st.id}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredState && (
            <div
              className="absolute pointer-events-none p-2.5 rounded-lg bg-white border border-slate-200 shadow-xl text-xs font-sans space-y-1 z-20"
              style={{ bottom: 15, left: 15 }}
            >
              <div className="font-semibold text-slate-900 flex items-center justify-between gap-3">
                <span>{hoveredState.name}</span>
                <span className="font-mono text-[10px] text-purple-700 font-bold">{hoveredState.id}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-600">
                <span>Projects Located: <strong>{hoveredState.projects?.length || 0}</strong></span>
              </div>
              {hoveredState.projects?.length > 0 && (
                <div className="text-[10px] text-slate-500 font-mono">
                  Click to filter project list
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 p-2 rounded-lg bg-white/95 border border-slate-200 shadow-sm text-[10px] font-mono text-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              <span>High Risk / Slippage</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Monitored / Stable</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Centroid Anchor</span>
            </div>
          </div>
        </div>

        {/* Selected State / Project List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-sans font-medium text-xs text-slate-900">
              {activeStateFilter ? `Projects in ${activeStateFilter}` : 'Regional Projects Overview'}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {filteredProjects.length} projects
            </span>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredProjects.map((p, idx) => {
              const isHighRisk = getValue(p.target_is_high_risk) == 1 || p.composite_risk_score > 70;
              const isSelected = selectedProject?.project_code === p.project_code;

              return (
                <div
                  key={idx}
                  onClick={() => onSelectProject && onSelectProject(p)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-purple-50 border-purple-300 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 hover:border-purple-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-700">
                      {getValue(p.project_code)}
                    </span>
                    <Badge variant={isHighRisk ? 'critical' : 'success'}>
                      {isHighRisk ? 'HIGH RISK' : 'ON TRACK'}
                    </Badge>
                  </div>

                  <h5 className="font-sans font-medium text-slate-900 text-xs truncate">
                    {getValue(p.project_name)}
                  </h5>

                  <div className="flex justify-between items-center text-[11px] font-mono text-slate-500">
                    <span>{getValue(p.state)} · {getValue(p.implementing_agency)}</span>
                    <span className="text-slate-800 font-semibold">{getValue(p.physical_progress)}% Phys</span>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-100">
                    <span>Cost: ₹{getValue(p.original_cost)} → ₹{getValue(p.revised_cost)} Cr</span>
                    <span className="text-purple-700 flex items-center gap-1 group-hover:underline font-semibold">
                      <Eye className="w-3 h-3" /> Dossier
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
