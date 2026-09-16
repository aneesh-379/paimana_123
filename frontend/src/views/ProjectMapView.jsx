import React, { useState } from 'react';
import { MapPin, Globe, Compass, ShieldAlert, Layers, Orbit } from 'lucide-react';
import IndiaProjectMap from '../components/visualizers/IndiaProjectMap';
import SpatialRadar3D from '../components/visualizers/SpatialRadar3D';
import Card3D from '../components/common/Card3D';
import Badge from '../components/common/Badge';

export default function ProjectMapView({
  projects = [],
  onSelectProject,
  selectedProject
}) {
  const [mapMode, setMapMode] = useState('2d'); // '2d' | '3d'

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
            Geospatial project distribution across States and Union Territories. Switch between 2D Topo and 3D Holographic Sphere.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* 2D / 3D Mode Switcher */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setMapMode('2d')}
              className={`text-xs px-3 py-1.5 rounded-md font-sans transition-all ${
                mapMode === '2d'
                  ? 'bg-purple-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              2D Vector Topo Map
            </button>
            <button
              type="button"
              onClick={() => setMapMode('3d')}
              className={`text-xs px-3 py-1.5 rounded-md font-sans transition-all flex items-center gap-1.5 ${
                mapMode === '3d'
                  ? 'bg-purple-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              3D Holographic Globe
            </button>
          </div>
          <Badge variant="purple">Corridor Surveillance</Badge>
        </div>
      </div>

      {/* Main Map Visualizer (2D Vector Topo or 3D Holographic Sphere) */}
      {mapMode === '3d' ? (
        <div className="animate-fadeIn">
          <SpatialRadar3D
            projects={projects}
            onSelectProject={onSelectProject}
          />
        </div>
      ) : (
        <div className="animate-fadeIn">
          <IndiaProjectMap
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={onSelectProject}
          />
        </div>
      )}

      {/* Corridor Insights (3D Tactile Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card3D
          tiltDegree={5}
          glowColor="rgba(124, 58, 237, 0.2)"
          className="p-4 space-y-2 bg-white border border-slate-200 shadow-sm"
        >
          <span className="font-mono text-xs font-bold text-purple-800 uppercase tracking-wider block">
            Western Freight &amp; Expressway Corridor
          </span>
          <p className="text-xs text-slate-600 leading-relaxed">
            High capital density across Maharashtra and Gujarat corridors (NHAI &amp; Railways). Primary execution risk focuses on urban peripheral land acquisition and environmental clearances.
          </p>
        </Card3D>

        <Card3D
          tiltDegree={5}
          glowColor="rgba(245, 158, 11, 0.2)"
          className="p-4 space-y-2 bg-white border border-slate-200 shadow-sm"
        >
          <span className="font-mono text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Eastern Industrial &amp; Freight Trunk (DFCCIL)
          </span>
          <p className="text-xs text-slate-600 leading-relaxed">
            Heavy logistical coordination required in Uttar Pradesh and Bihar sections. Electrification contractor liquidity and signaling re-tendering are key bottleneck drivers.
          </p>
        </Card3D>

        <Card3D
          tiltDegree={5}
          glowColor="rgba(16, 185, 129, 0.2)"
          className="p-4 space-y-2 bg-white border border-slate-200 shadow-sm"
        >
          <span className="font-mono text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            Western Renewable &amp; Solar Grid (NTPC)
          </span>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rajasthan and Gujarat ultra-mega solar parks show strong milestone pacing (68%+ physical completion), with minimal land acquisition stalls relative to civil highways.
          </p>
        </Card3D>
      </div>
    </div>
  );
}
