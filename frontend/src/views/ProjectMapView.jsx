import React from 'react';
import { MapPin, Globe, Compass, ShieldAlert, Layers } from 'lucide-react';
import IndiaProjectMap from '../components/visualizers/IndiaProjectMap';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';

export default function ProjectMapView({
  projects = [],
  onSelectProject,
  selectedProject
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="font-sans font-bold text-xl text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-700" />
            National Geographic Infrastructure Surveillance Map (GIS)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Geospatial project distribution across States and Union Territories. Click states or markers to inspect project dossiers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple">Interactive Vector Topo</Badge>
          <Badge variant="warning">Corridor Surveillance</Badge>
        </div>
      </div>

      {/* Main Map Component */}
      <IndiaProjectMap
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={onSelectProject}
      />

      {/* Corridor Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="cockpit-card p-4 space-y-2 bg-white border border-slate-200">
          <span className="font-mono text-xs font-bold text-purple-800 uppercase tracking-wider block">
            Western Freight & Expressway Corridor
          </span>
          <p className="text-xs text-slate-600 leading-relaxed">
            High capital density across Maharashtra and Gujarat corridors (NHAI & Railways). Primary execution risk focuses on urban peripheral land acquisition and environmental clearances.
          </p>
        </div>

        <div className="cockpit-card p-4 space-y-2 bg-white border border-slate-200">
          <span className="font-mono text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Eastern Industrial & Freight Trunk (DFCCIL)
          </span>
          <p className="text-xs text-slate-600 leading-relaxed">
            Heavy logistical coordination required in Uttar Pradesh and Bihar sections. Electrification contractor liquidity and signaling re-tendering are key bottleneck drivers.
          </p>
        </div>

        <div className="cockpit-card p-4 space-y-2 bg-white border border-slate-200">
          <span className="font-mono text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            Western Renewable & Solar Grid (NTPC)
          </span>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rajasthan and Gujarat ultra-mega solar parks show strong milestone pacing (68%+ physical completion), with minimal land acquisition stalls relative to civil highways.
          </p>
        </div>
      </div>
    </div>
  );
}
