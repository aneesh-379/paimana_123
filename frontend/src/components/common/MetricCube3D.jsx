import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Rotate3D, Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Database } from 'lucide-react';
import Badge from './Badge';

export default function MetricCube3D() {
  const [faceIndex, setFaceIndex] = useState(0);

  const faces = [
    {
      title: 'Cost Escalation Watch',
      tag: 'FINANCIAL RISK',
      tagVariant: 'critical',
      bigMetric: '+15.2%',
      subMetric: '+₹5.65 L Cr Net Escalation',
      detail: '342 Projects incurring severe capital escalation above approved cost estimate.',
      icon: TrendingUp,
      color: '#BE123C',
      bgGrad: 'from-rose-500/10 via-white to-rose-50/50',
      borderCol: 'border-rose-200'
    },
    {
      title: 'Active Portfolio Outlay',
      tag: 'CENTRAL SECTOR',
      tagVariant: 'purple',
      bigMetric: '₹37.13L Cr',
      subMetric: '1,981 Monitored Projects',
      detail: 'Aggregated central sector expenditure monitored across 16 major economic ministries.',
      icon: Database,
      color: '#7C3AED',
      bgGrad: 'from-purple-500/10 via-white to-purple-50/50',
      borderCol: 'border-purple-200'
    },
    {
      title: 'Schedule Deviation Queue',
      tag: 'MILESTONE SLIPPAGE',
      tagVariant: 'warning',
      bigMetric: '814 Projects',
      subMetric: 'Slippage > 90 Calendar Days',
      detail: 'Contractor pacing stalls and right-of-way encumbrances requiring statutory catch-up directives.',
      icon: AlertTriangle,
      color: '#D97706',
      bgGrad: 'from-amber-500/10 via-white to-amber-50/50',
      borderCol: 'border-amber-200'
    },
    {
      title: 'ML Prediction Grounding',
      tag: 'MODEL VERIFIED',
      tagVariant: 'success',
      bigMetric: '98.2%',
      subMetric: 'CatBoost v1.2 + TreeSHAP',
      detail: 'Ensemble feature weighting corroborating physical progress gaps against contract GCC clauses.',
      icon: ShieldCheck,
      color: '#059669',
      bgGrad: 'from-emerald-500/10 via-white to-emerald-50/50',
      borderCol: 'border-emerald-200'
    }
  ];

  const handleNext = () => {
    setFaceIndex((prev) => (prev + 1) % faces.length);
  };

  const handlePrev = () => {
    setFaceIndex((prev) => (prev - 1 + faces.length) % faces.length);
  };

  const currentFace = faces[faceIndex];
  const Icon = currentFace.icon;

  return (
    <div className="relative rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3 preserve-3d overflow-hidden">
      {/* 3D Rotating Cube Controls Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-2xs">
            <Rotate3D className="w-3.5 h-3.5" />
          </span>
          <span className="font-sans font-bold text-xs text-slate-900">
            3D National Portfolio Metric Prism
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
            title="Rotate to previous metric face"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono font-bold text-purple-700 px-1.5">
            Face 0{faceIndex + 1}/04
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
            title="Rotate to next metric face"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Face Viewport with 3D Depth Transition */}
      <div
        key={faceIndex}
        className={`p-4 rounded-xl border ${currentFace.borderCol} bg-gradient-to-br ${currentFace.bgGrad} space-y-2.5 shadow-2xs animate-fadeIn transition-all duration-300`}
        style={{ transform: 'perspective(600px) rotateY(0deg) translateZ(8px)' }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: currentFace.color }}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="font-sans font-bold text-xs text-slate-900">
              {currentFace.title}
            </span>
          </div>
          <Badge variant={currentFace.tagVariant} className="text-[9px] font-bold">
            {currentFace.tag}
          </Badge>
        </div>

        <div>
          <span
            className="font-mono text-3xl font-extrabold tracking-tight block drop-shadow-xs"
            style={{ color: currentFace.color }}
          >
            {currentFace.bigMetric}
          </span>
          <span className="text-xs font-semibold text-slate-700 block mt-0.5">
            {currentFace.subMetric}
          </span>
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed font-sans pt-1 border-t border-slate-200/60">
          {currentFace.detail}
        </p>
      </div>

      {/* Face Indicator Dots */}
      <div className="flex justify-center items-center gap-1.5 pt-1">
        {faces.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setFaceIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              faceIndex === i ? 'w-6 bg-purple-600' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
            }`}
            aria-label={`Switch to 3D face ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
