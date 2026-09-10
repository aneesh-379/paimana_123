import React from 'react';
import Badge from './Badge';

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
  badge,
  badgeVariant = 'neutral',
  icon: Icon = null,
  progress,
  alertVariant = 'default',
  className = ''
}) {
  const valueColor = {
    critical: 'text-rose-700',
    warning: 'text-amber-700',
    success: 'text-emerald-700',
    cyan: 'text-sky-700',
    purple: 'text-purple-700',
    default: 'text-slate-900'
  }[alertVariant] || 'text-slate-900';

  return (
    <div className={`cockpit-card p-4 space-y-2 bg-white border border-slate-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-slate-400" />}
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
        </div>
        {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className={`font-mono font-bold text-2xl tracking-tight ${valueColor}`}>
          {value}
        </span>
        {trend && (
          <span className={`font-mono text-xs font-semibold ${trendPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="font-sans text-[11px] text-slate-500 leading-snug">
          {subtitle}
        </p>
      )}

      {progress !== undefined && (
        <div className="space-y-1 pt-1.5 border-t border-slate-100">
          <div className="cockpit-progress-track">
            <div
              className="cockpit-progress-fill"
              style={{
                width: `${Math.min(100, Math.max(0, progress))}%`,
                backgroundColor: alertVariant === 'critical' ? '#BE123C' : alertVariant === 'warning' ? '#D97706' : '#7C3AED'
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Progress: {progress}%</span>
            <span>Target: 100%</span>
          </div>
        </div>
      )}
    </div>
  );
}
