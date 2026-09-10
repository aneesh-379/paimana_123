import React from 'react';

export default function Skeleton({ className = '', height = 'h-4', width = 'w-full' }) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-800/80 ${height} ${width} ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.7) 50%, rgba(30, 41, 59, 0.6) 100%)',
        backgroundSize: '200% 100%'
      }}
    />
  );
}
