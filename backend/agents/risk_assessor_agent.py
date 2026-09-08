"""
Risk Assessor Agent (PAIMANA AI Multi-Agent System)
Evaluates project schedule & financial features to compute overall risk score,
risk tier classification, and probability of project overrun.
"""

from typing import Dict, Any
from ml.ingestion.data_provenance import EvidenceCategory


class RiskAssessorAgent:
    """Agent responsible for computing project risk scores and risk tier classification."""

    def evaluate_risk(self, project_data: Dict[str, Any], predictions: Dict[str, Any]) -> Dict[str, Any]:
        predicted_delay = predictions.get("predicted_delay_months", {}).get("value", 0.0)
        predicted_cost_overrun = predictions.get("predicted_cost_overrun_pct", {}).get("value", 0.0)
        progress_lag = project_data.get("progress_lag_pct", 0.0)
        fin_gap = project_data.get("financial_physical_gap", 0.0)

        # Risk score calculation (0 to 100)
        raw_score = (predicted_delay * 2.5) + (predicted_cost_overrun * 1.2) + (progress_lag * 1.5) + (fin_gap * 0.8)
        risk_score = max(0.0, min(100.0, round(raw_score, 1)))

        if risk_score >= 60.0 or predicted_delay > 12 or predicted_cost_overrun > 20:
            risk_tier = "CRITICAL_HIGH_RISK"
            priority = "URGENT_INTERVENTION"
        elif risk_score >= 30.0 or predicted_delay > 6:
            risk_tier = "MODERATE_RISK"
            priority = "WATCHLIST_MONITORING"
        else:
            risk_tier = "LOW_RISK"
            priority = "NORMAL_TRACKING"

        return {
            "evidence_category": EvidenceCategory.PREDICTED,
            "agent": "RiskAssessorAgent",
            "risk_score_pct": risk_score,
            "risk_tier": risk_tier,
            "action_priority": priority,
            "evaluation_timestamp": project_data.get("snapshot_date", "2026-01-01")
        }
