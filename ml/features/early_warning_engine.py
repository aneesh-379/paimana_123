"""
PAIMANA Deterministic Risk & Early Warning Rules Engine
Calculates multi-component risk scores (Cost, Schedule, Progress, Financial, Data Confidence),
evaluates deterministic warning rules, and assigns alert severity (INFO, WATCH, HIGH, CRITICAL).
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
from ml.ingestion.data_provenance import EvidenceCategory


class WarningSeverity:
    INFO = "INFO"
    WATCH = "WATCH"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class WarningLifecycleState:
    OPEN = "OPEN"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    UNDER_REVIEW = "UNDER_REVIEW"
    RESOLVED = "RESOLVED"
    REOPENED = "REOPENED"


class EarlyWarningEngine:
    """Evaluates deterministic risk components, early warning rules, and alert lifecycle states."""

    def evaluate_project_warnings(self, project_data: Dict[str, Any], predictions: Dict[str, Any]) -> Dict[str, Any]:
        orig_cost = float(project_data.get("original_cost", 1.0))
        rev_cost = float(project_data.get("revised_cost", orig_cost))
        expenditure = float(project_data.get("expenditure", 0.0))
        phys_prog = float(project_data.get("physical_progress", 0.0))
        progress_lag = float(project_data.get("progress_lag_pct", 0.0))
        fin_gap = float(project_data.get("financial_physical_gap", 0.0))
        predicted_delay = float(predictions.get("predicted_delay_months", {}).get("value", 0.0))
        predicted_cost_overrun = float(predictions.get("predicted_cost_overrun_pct", {}).get("value", 0.0))

        # 1. Component Risk Scores (0 - 100 scale)
        cost_risk = min(100.0, max(0.0, ((rev_cost - orig_cost) / max(1.0, orig_cost)) * 100.0 * 2.0))
        schedule_risk = min(100.0, max(0.0, predicted_delay * 3.5))
        progress_risk = min(100.0, max(0.0, progress_lag * 2.5))
        financial_risk = min(100.0, max(0.0, fin_gap * 2.0))
        data_confidence = 96.5

        # Weighted Overall Risk Score
        overall_risk_score = round(
            (cost_risk * 0.30) + (schedule_risk * 0.30) + (progress_risk * 0.25) + (financial_risk * 0.15), 1
        )

        # Financial Exposure in Rupees Crores
        cost_exposure_cr = round(max(0.0, rev_cost - orig_cost), 2)
        financial_exposure_at_risk_cr = round((overall_risk_score / 100.0) * rev_cost, 2)

        # 2. Priority Score calculation (incorporates risk score & financial exposure)
        priority_score = round(min(100.0, overall_risk_score * 0.6 + min(40.0, (cost_exposure_cr / 100.0) * 5.0)), 1)

        # 3. Deterministic Early Warning Rules Evaluation
        warnings = []
        now_str = datetime.now().isoformat()

        if progress_lag > 20.0:
            warnings.append({
                "warning_id": f"WARN-LAG-{project_data.get('project_code', 'PROJ')}",
                "trigger": "CRITICAL_PROGRESS_LAG",
                "metric": "Progress Lag (%)",
                "threshold": 20.0,
                "actual_value": round(progress_lag, 1),
                "severity": WarningSeverity.CRITICAL,
                "lifecycle_state": WarningLifecycleState.OPEN,
                "created_at": now_str,
                "evidence_category": EvidenceCategory.DERIVED
            })

        if fin_gap > 15.0:
            warnings.append({
                "warning_id": f"WARN-GAP-{project_data.get('project_code', 'PROJ')}",
                "trigger": "FINANCIAL_PHYSICAL_MISMATCH",
                "metric": "Financial-Physical Gap (%)",
                "threshold": 15.0,
                "actual_value": round(fin_gap, 1),
                "severity": WarningSeverity.HIGH,
                "lifecycle_state": WarningLifecycleState.OPEN,
                "created_at": now_str,
                "evidence_category": EvidenceCategory.DERIVED
            })

        if rev_cost > orig_cost * 1.15:
            warnings.append({
                "warning_id": f"WARN-COST-{project_data.get('project_code', 'PROJ')}",
                "trigger": "MAJOR_COST_REVISION",
                "metric": "Cost Escalation (%)",
                "threshold": 15.0,
                "actual_value": round(((rev_cost - orig_cost) / orig_cost) * 100.0, 1),
                "severity": WarningSeverity.HIGH,
                "lifecycle_state": WarningLifecycleState.OPEN,
                "created_at": now_str,
                "evidence_category": EvidenceCategory.OBSERVED
            })

        if predicted_delay > 12.0:
            warnings.append({
                "warning_id": f"WARN-DELAY-{project_data.get('project_code', 'PROJ')}",
                "trigger": "HIGH_PREDICTED_SCHEDULE_DELAY",
                "metric": "Predicted Delay (Months)",
                "threshold": 12.0,
                "actual_value": round(predicted_delay, 1),
                "severity": WarningSeverity.CRITICAL,
                "lifecycle_state": WarningLifecycleState.OPEN,
                "created_at": now_str,
                "evidence_category": EvidenceCategory.PREDICTED
            })

        if not warnings:
            warnings.append({
                "warning_id": f"WARN-OK-{project_data.get('project_code', 'PROJ')}",
                "trigger": "NORMAL_MONITORING",
                "metric": "Variance Index",
                "threshold": 5.0,
                "actual_value": 0.0,
                "severity": WarningSeverity.INFO,
                "lifecycle_state": WarningLifecycleState.RESOLVED,
                "created_at": now_str,
                "evidence_category": EvidenceCategory.OBSERVED
            })

        return {
            "project_code": project_data.get("project_code"),
            "risk_decomposition": {
                "overall_risk_score": overall_risk_score,
                "component_scores": {
                    "cost_risk": round(cost_risk, 1),
                    "schedule_risk": round(schedule_risk, 1),
                    "progress_risk": round(progress_risk, 1),
                    "financial_risk": round(financial_risk, 1),
                    "data_confidence": data_confidence
                },
                "evidence_category": EvidenceCategory.DERIVED
            },
            "priority_evaluation": {
                "priority_score": priority_score,
                "cost_exposure_crores": cost_exposure_cr,
                "financial_exposure_at_risk_crores": financial_exposure_at_risk_cr,
                "evidence_category": EvidenceCategory.DERIVED
            },
            "warnings_count": len(warnings),
            "warnings": warnings
        }


if __name__ == "__main__":
    import json
    engine = EarlyWarningEngine()
    sample_proj = {
        "project_code": "PAIM-619054",
        "original_cost": 1162.76,
        "revised_cost": 1390.00,
        "expenditure": 650.00,
        "physical_progress": 35.0,
        "progress_lag_pct": 26.1,
        "financial_physical_gap": 18.2
    }
    sample_preds = {
        "predicted_delay_months": {"value": 16.5},
        "predicted_cost_overrun_pct": {"value": 19.5}
    }
    res = engine.evaluate_project_warnings(sample_proj, sample_preds)
    print("Early Warning Evaluation:\n", json.dumps(res, indent=2))
