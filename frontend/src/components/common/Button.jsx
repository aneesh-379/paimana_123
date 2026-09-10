import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'ghost',
  size = 'md',
  icon: Icon = null,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const variantMap = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    secondary: 'btn-secondary-lavender',
    lavender: 'btn-secondary-lavender',
    critical: 'btn-critical',
    success: 'btn-success'
  }[variant] || 'btn-ghost';

  const sizeMap = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-xs px-3.5 py-2',
    lg: 'text-sm px-4 py-2.5'
  }[size] || 'text-xs px-3.5 py-2';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn-cockpit ${variantMap} ${sizeMap} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
