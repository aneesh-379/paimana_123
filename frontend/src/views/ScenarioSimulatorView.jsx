import React, { useState } from 'react';
import { Sliders, RotateCcw, Play, CheckCircle, TrendingUp, TrendingDown, ArrowRight, Zap, Sparkles } from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Card3D from '../components/common/Card3D';
import TrajectoryHorizon3D from '../components/visualizers/TrajectoryHorizon3D';

export default function ScenarioSimulatorView() {
  // Baseline Parameters
  const BASELINE = {
    origCost: 1162.76,
    costOverrunPct: 19.5,
    delayMonths: 16.5,
    riskScore: 84,
    finalCost: 1390.00
  };

  // Scenario Adjusters
  const [materialInflation, setMaterialInflation] = useState(0); // 0 to 25%
  const [landClearanceSpeed, setLandClearanceSpeed] = useState(0); // -6 (expedite) to +12 (delayed)
  const [contractorSupport, setContractorSupport] = useState(false); // boolean
  const [weatherBufferDays, setWeatherBufferDays] = useState(0); // 0 to 60 days

  // Scenario Calculation
  const calcScenarioCostOverrun = () => {
    let esc = BASELINE.costOverrunPct + materialInflation * 0.65;
    if (landClearanceSpeed > 0) esc += landClearanceSpeed * 0.8;
    if (contractorSupport) esc -= 2.5;
    return Math.max(2.0, parseFloat(esc.toFixed(1)));
  };

  const calcScenarioDelay = () => {
    let delay = BASELINE.delayMonths + landClearanceSpeed * 0.75 + (weatherBufferDays / 30) * 1.0;
    if (contractorSupport) delay -= 3.0;
    return Math.max(1.0, parseFloat(delay.toFixed(1)));
  };

  const scenarioCostOverrun = calcScenarioCostOverrun();
  const scenarioDelay = calcScenarioDelay();
  const scenarioFinalCost = (BASELINE.origCost * (1 + scenarioCostOverrun / 100)).toFixed(2);
  const scenarioRiskScore = Math.min(99, Math.max(10, Math.round(scenarioCostOverrun * 1.5 + scenarioDelay * 1.2)));

  const costDelta = (scenarioCostOverrun - BASELINE.costOverrunPct).toFixed(1);
  const delayDelta = (scenarioDelay - BASELINE.delayMonths).toFixed(1);
  const riskDelta = scenarioRiskScore - BASELINE.riskScore;

  const handleReset = () => {
    setMaterialInflation(0);
    setLandClearanceSpeed(0);
    setContractorSupport(false);
    setWeatherBufferDays(0);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="font-sans font-bold text-xl text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-700" />
            Infrastructure Scenario Simulation Sandbox (What-If)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Simulate policy interventions, supply-chain shocks, and Right-of-Way acceleration on capital outlay and completion dates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={RotateCcw} onClick={handleReset} className="shadow-2xs bg-white border border-slate-200">
            Reset to Baseline
          </Button>
          <Badge variant="purple" className="shadow-2xs">Target: Active Infrastructure Simulation</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Scenario Controls (5 cols, 3D Interactive) */}
        <Card3D
          tiltDegree={4}
          glowColor="rgba(124, 58, 237, 0.2)"
          className="lg:col-span-5 cockpit-card bg-white p-5 space-y-4 border border-slate-200 shadow-sm"
        >
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-900">
                Simulation Shock &amp; Policy Lever Controls
              </h3>
              <p className="text-[11px] text-slate-500">
                Adjust variables in real-time to test project sensitivity.
              </p>
            </div>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>

          <div className="space-y-4 text-xs font-sans">
            {/* Raw Material Inflation */}
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 shadow-2xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-700 font-semibold">Steel &amp; Cement Inflation Shock</span>
                <strong className={materialInflation > 0 ? 'text-rose-700 font-bold' : 'text-slate-700'}>
                  +{materialInflation}%
                </strong>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={materialInflation}
                onChange={(e) => setMaterialInflation(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Land Handover Adjustment */}
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 shadow-2xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-700 font-semibold">Land &amp; RoW Handover Shift</span>
                <strong className={landClearanceSpeed < 0 ? 'text-emerald-700 font-bold' : landClearanceSpeed > 0 ? 'text-rose-700 font-bold' : 'text-slate-700'}>
                  {landClearanceSpeed < 0 ? `${landClearanceSpeed} Mo (Expedited)` : landClearanceSpeed > 0 ? `+${landClearanceSpeed} Mo (Delayed)` : '0 Mo (Baseline)'}
                </strong>
              </div>
              <input
                type="range"
                min="-6"
                max="12"
                step="1"
                value={landClearanceSpeed}
                onChange={(e) => setLandClearanceSpeed(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Weather Delay Buffer */}
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 shadow-2xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-700 font-semibold">Monsoon Weather Stoppage Buffer</span>
                <strong className="text-amber-700 font-bold">+{weatherBufferDays} Days</strong>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={weatherBufferDays}
                onChange={(e) => setWeatherBufferDays(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Contractor Liquidity Intervention */}
            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/60 border border-purple-200/70 cursor-pointer select-none hover:bg-purple-50 transition-colors shadow-2xs">
                <input
                  type="checkbox"
                  checked={contractorSupport}
                  onChange={(e) => setContractorSupport(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <div>
                  <span className="text-slate-900 font-bold block text-xs">
                    Deploy MoSPI Fast-Track Mobilization Advance
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Provides upfront contractor liquidity to eliminate pacing stalls (-3.0 Mo delay reduction).
                  </span>
                </div>
              </label>
            </div>
          </div>
        </Card3D>

        {/* Baseline vs Scenario Comparison (7 cols, 3D Interactive) */}
        <Card3D
          tiltDegree={4}
          glowColor="rgba(124, 58, 237, 0.2)"
          className="lg:col-span-7 cockpit-card bg-white p-5 space-y-4 border border-slate-200 shadow-sm"
        >
          <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-900">
                Comparative Impact Analysis: Baseline vs. Scenario
              </h3>
              <p className="text-[11px] text-slate-500">Live predictive calculations updated dynamically.</p>
            </div>
            <Badge variant="purple" className="shadow-2xs">Real-Time Simulation</Badge>
          </div>

          {/* 4 Quick 3D Live Outcome Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1 shadow-2xs">
              <span className="font-mono text-[9px] font-bold uppercase text-rose-700 block">Simulated Overrun</span>
              <strong className="font-mono text-base font-extrabold text-rose-900 block">+{scenarioCostOverrun}%</strong>
              <span className="text-[10px] font-mono text-rose-700">{parseFloat(costDelta) >= 0 ? `+${costDelta}%` : `${costDelta}%`} var</span>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1 shadow-2xs">
              <span className="font-mono text-[9px] font-bold uppercase text-purple-700 block">Simulated Delay</span>
              <strong className="font-mono text-base font-extrabold text-purple-900 block">+{scenarioDelay} Mo</strong>
              <span className="text-[10px] font-mono text-purple-700">{parseFloat(delayDelta) >= 0 ? `+${delayDelta} mo` : `${delayDelta} mo`}</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1 shadow-2xs">
              <span className="font-mono text-[9px] font-bold uppercase text-amber-700 block">Risk Score</span>
              <strong className="font-mono text-base font-extrabold text-amber-900 block">{scenarioRiskScore}/100</strong>
              <span className="text-[10px] font-mono text-amber-700">{riskDelta >= 0 ? `+${riskDelta} pts` : `${riskDelta} pts`}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200 space-y-1 shadow-2xs">
              <span className="font-mono text-[9px] font-bold uppercase text-slate-600 block">Projected Outlay</span>
              <strong className="font-mono text-base font-extrabold text-slate-900 block">₹{scenarioFinalCost} Cr</strong>
              <span className="text-[10px] font-mono text-slate-600 truncate block">Δ ₹{(parseFloat(scenarioFinalCost) - BASELINE.finalCost).toFixed(1)} Cr</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="cockpit-table text-xs">
              <thead>
                <tr>
                  <th>Performance Metric</th>
                  <th>Baseline Value</th>
                  <th>Simulated Scenario</th>
                  <th>Net Variance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium text-slate-800">Cost Escalation (%)</td>
                  <td className="font-mono text-slate-600">+{BASELINE.costOverrunPct}%</td>
                  <td className="font-mono font-bold text-rose-700">+{scenarioCostOverrun}%</td>
                  <td>
                    <Badge variant={parseFloat(costDelta) > 0 ? 'critical' : parseFloat(costDelta) < 0 ? 'success' : 'neutral'}>
                      {parseFloat(costDelta) > 0 ? `+${costDelta}%` : `${costDelta}%`}
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium text-slate-800">Completion Delay (Months)</td>
                  <td className="font-mono text-slate-600">+{BASELINE.delayMonths} Mo</td>
                  <td className="font-mono font-bold text-purple-700">+{scenarioDelay} Mo</td>
                  <td>
                    <Badge variant={parseFloat(delayDelta) > 0 ? 'critical' : parseFloat(delayDelta) < 0 ? 'success' : 'neutral'}>
                      {parseFloat(delayDelta) > 0 ? `+${delayDelta} Mo` : `${delayDelta} Mo`}
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium text-slate-800">Composite Risk Score</td>
                  <td className="font-mono text-slate-600">{BASELINE.riskScore} / 100</td>
                  <td className="font-mono font-bold text-amber-700">{scenarioRiskScore} / 100</td>
                  <td>
                    <Badge variant={riskDelta > 0 ? 'critical' : riskDelta < 0 ? 'success' : 'neutral'}>
                      {riskDelta > 0 ? `+${riskDelta} pts` : `${riskDelta} pts`}
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td className="font-medium text-slate-800">Final Anticipated Outlay</td>
                  <td className="font-mono text-slate-600">₹{BASELINE.finalCost.toFixed(2)} Cr</td>
                  <td className="font-mono font-bold text-slate-900">₹{scenarioFinalCost} Cr</td>
                  <td>
                    <span className="font-mono text-[11px] text-slate-600 font-semibold">
                      Δ ₹{(parseFloat(scenarioFinalCost) - BASELINE.finalCost).toFixed(2)} Cr
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Scenario Takeaway Directive */}
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-1.5 text-xs font-sans text-purple-950 shadow-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-purple-700 font-bold block">
              Decision Support Synthesis:
            </span>
            <p className="text-slate-800 leading-relaxed">
              {contractorSupport && landClearanceSpeed <= 0 ? (
                <span className="text-emerald-900">
                  <strong className="text-emerald-700 font-mono">[FAVORABLE]</strong> Combining contractor mobilization support with expedited land clearance offsets up to <strong>3.0 months of delay</strong> and contains cost escalation to manageable parameters.
                </span>
              ) : materialInflation > 10 ? (
                <span className="text-rose-900">
                  <strong className="text-rose-700 font-mono">[VULNERABILITY]</strong> A +{materialInflation}% materials shock adds an estimated <strong>₹{(parseFloat(scenarioFinalCost) - BASELINE.finalCost).toFixed(2)} Cr</strong> to project outlay, requiring immediate Price Adjustment Clause audit under GCC Section 10.
                </span>
              ) : (
                <span className="text-slate-700">
                  Baseline delay remains at +{scenarioDelay} months. Expediting state Right-of-Way handovers delivers the highest leverage reduction in completion risk.
                </span>
              )}
            </p>
          </div>
        </Card3D>
      </div>

      {/* 3D Dynamic Trajectory Horizon Visualizer */}
      <div className="pt-2">
        <TrajectoryHorizon3D
          projectCode="PAIM-619054"
          projectName="Greenfield Expressway Expansion Package IV"
          baselineCost={BASELINE.origCost}
          simulatedCost={parseFloat(scenarioFinalCost)}
          baselineDelay={BASELINE.delayMonths}
          simulatedDelay={scenarioDelay}
          physicalProgress={42.1}
        />
      </div>
    </div>
  );
}
