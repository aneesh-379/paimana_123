import React from 'react';

export default function Badge({ children, variant = 'neutral', className = '', icon: Icon = null }) {
  const variantClasses = {
    critical: 'badge-critical',
    warning: 'badge-warning',
    success: 'badge-success',
    cyan: 'badge-cyan',
    purple: 'badge-purple',
    neutral: 'badge-neutral'
  }[variant] || 'badge-neutral';

  return (
    <span className={`badge-pill ${variantClasses} ${className}`}>
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
