"""
PAIMANA What-If Scenario Simulation Engine (Phase 163-165)
Simulates policy interventions (physical progress acceleration, expenditure caps, schedule adjustment).
Strict Safety Guarantee: All outputs explicitly tagged as 'Model scenario simulation'.
"""

from typing import Dict, List, Any
import pandas as pd
import numpy as np
from ml.ingestion.data_provenance import EvidenceCategory
from ml.features.engineer_features import PAIMANAFeatureEngineer


class PAIMANAWhatIfEngine:
    """Simulates counterfactual intervention scenarios and measures risk delta."""

    def __init__(self, feature_engineer: PAIMANAFeatureEngineer = None):
        self.fe = feature_engineer if feature_engineer is not None else PAIMANAFeatureEngineer()

    def simulate_scenario(
        self,
        project_data: Dict[str, Any],
        progress_delta_pct: float = 10.0,
        expenditure_reduction_pct: float = 0.0,
        cost_freeze: bool = False
    ) -> Dict[str, Any]:
        """Runs what-if scenario simulation on project baseline and computes risk reduction delta."""
        orig_cost = float(project_data.get("original_cost", 1.0))
        rev_cost = float(project_data.get("revised_cost", orig_cost))
        expenditure = float(project_data.get("expenditure", 0.0))
        phys_prog = float(project_data.get("physical_progress", 0.0))

        # Baseline metrics calculation
        baseline_lag = max(0.0, 75.0 - phys_prog)  # assuming ~75% expected progress
        baseline_fin_gap = max(0.0, ((expenditure / orig_cost) * 100.0) - phys_prog)
        baseline_risk_score = round(min(100.0, (baseline_lag * 0.4) + (baseline_fin_gap * 0.4) + (((rev_cost - orig_cost)/orig_cost) * 100.0 * 0.2)), 1)
        baseline_risk_tier = "CRITICAL" if baseline_risk_score > 70.0 else ("HIGH" if baseline_risk_score > 40.0 else "LOW")

        # Scenario modification
        simulated_phys_prog = min(100.0, phys_prog + progress_delta_pct)
        simulated_expenditure = max(0.0, expenditure * (1.0 - (expenditure_reduction_pct / 100.0)))
        simulated_rev_cost = orig_cost if cost_freeze else rev_cost

        # Simulated metrics calculation
        simulated_lag = max(0.0, 75.0 - simulated_phys_prog)
        simulated_fin_gap = max(0.0, ((simulated_expenditure / orig_cost) * 100.0) - simulated_phys_prog)
        simulated_risk_score = round(min(100.0, (simulated_lag * 0.4) + (simulated_fin_gap * 0.4) + (((simulated_rev_cost - orig_cost)/orig_cost) * 100.0 * 0.2)), 1)
        simulated_risk_tier = "CRITICAL" if simulated_risk_score > 70.0 else ("HIGH" if simulated_risk_score > 40.0 else "LOW")

        risk_reduction_delta = round(baseline_risk_score - simulated_risk_score, 1)

        return {
            "project_code": project_data.get("project_code"),
            "disclaimer": "Model scenario simulation. Results represent predictive estimations, not guaranteed real-world outcomes.",
            "scenario_parameters": {
                "progress_delta_pct": progress_delta_pct,
                "expenditure_reduction_pct": expenditure_reduction_pct,
                "cost_freeze_applied": cost_freeze
            },
            "baseline_state": {
                "physical_progress_pct": phys_prog,
                "expenditure_crores": expenditure,
                "revised_cost_crores": rev_cost,
                "risk_score_pct": baseline_risk_score,
                "risk_tier": baseline_risk_tier,
                "evidence_category": EvidenceCategory.OBSERVED
            },
            "simulated_scenario_state": {
                "physical_progress_pct": round(simulated_phys_prog, 1),
                "expenditure_crores": round(simulated_expenditure, 2),
                "revised_cost_crores": round(simulated_rev_cost, 2),
                "risk_score_pct": simulated_risk_score,
                "risk_tier": simulated_risk_tier,
                "evidence_category": EvidenceCategory.PREDICTED
            },
            "impact_analysis": {
                "risk_score_reduction_points": risk_reduction_delta,
                "financial_gap_reduction_pct": round(baseline_fin_gap - simulated_fin_gap, 1),
                "primary_impact_driver": "Physical Progress Acceleration (+10%)" if progress_delta_pct > 0 else "Expenditure Control",
                "evidence_category": EvidenceCategory.DERIVED
            },
            "scenario_recommendation": {
                "value": f"Accelerating physical completion by {progress_delta_pct:.1f}% reduces overall project risk score by {risk_reduction_delta} points ({baseline_risk_score}% ➔ {simulated_risk_score}%).",
                "evidence_category": EvidenceCategory.RECOMMENDED
            }
        }


if __name__ == "__main__":
    import json
    sim = PAIMANAWhatIfEngine()
    test_proj = {
        "project_code": "PAIM-619054",
        "original_cost": 1162.76,
        "revised_cost": 1390.00,
        "expenditure": 494.72,
        "physical_progress": 42.5
    }
    res = sim.simulate_scenario(test_proj, progress_delta_pct=10.0, expenditure_reduction_pct=5.0)
    print("What-If Engine Output:\n", json.dumps(res, indent=2))
