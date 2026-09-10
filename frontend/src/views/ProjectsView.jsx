import React from 'react';
import { FolderKanban, Download, SlidersHorizontal } from 'lucide-react';
import ProjectTable from '../components/projects/ProjectTable';
import StatCard from '../components/common/StatCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { getValue } from '../data/mockProjects';

export default function ProjectsView({
  projects = [],
  onSelectProject,
  onAnalyzeProject
}) {
  const totalCost = projects.reduce((acc, p) => acc + parseFloat(getValue(p.revised_cost, 0)), 0);
  const avgProgress = (projects.reduce((acc, p) => acc + parseFloat(getValue(p.physical_progress, 0)), 0) / Math.max(1, projects.length)).toFixed(1);
  const highRiskCount = projects.filter(p => getValue(p.target_is_high_risk) == 1 || p.composite_risk_score > 70).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="font-sans font-bold text-xl text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-purple-700" />
            Infrastructure Projects Intelligence Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete database of sanctioned central sector infrastructure works under MoSPI surveillance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple">{projects.length} Monitored Projects</Badge>
        </div>
      </div>

      {/* Snapshot KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Monitored Projects"
          value={projects.length}
          subtitle="Real-time predictive tracking"
          badge="DATABASE"
          badgeVariant="neutral"
        />
        <StatCard
          title="Aggregate Revised Outlay"
          value={`₹${totalCost.toLocaleString()} Cr`}
          subtitle="Cumulative evaluated capital"
          badge="CAPITAL OUTLAY"
          badgeVariant="purple"
        />
        <StatCard
          title="Average Physical Completion"
          value={`${avgProgress}%`}
          subtitle={`${highRiskCount} projects marked high risk`}
          badge={highRiskCount > 0 ? `${highRiskCount} CRITICAL` : 'HEALTHY'}
          badgeVariant={highRiskCount > 0 ? 'critical' : 'success'}
          progress={parseFloat(avgProgress)}
        />
      </div>

      {/* Comprehensive Table Component */}
      <ProjectTable
        projects={projects}
        onSelectProject={onSelectProject}
        onAnalyzeProject={onAnalyzeProject}
      />
    </div>
  );
}
