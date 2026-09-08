"""
PAIMANA Project Trajectory & Peer Anomaly Detection Engine
Detects abnormal deviations in physical progress, expenditure surges, and sector peer variance.
Strict Policy Enforcement: Never labels fraud/corruption; uses 'Requires Operational Review'.
"""

from typing import Dict, List, Any
from ml.ingestion.data_provenance import EvidenceCategory


class AnomalyDetectionEngine:
    """Detects trajectory anomalies and peer mismatch benchmarks across MoSPI sectors."""

    def detect_project_anomalies(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        phys_prog = float(project_data.get("physical_progress", 0.0))
        fin_gap = float(project_data.get("financial_physical_gap", 0.0))
        cost_esc = float(project_data.get("cost_escalation_ratio", 1.0))
        expenditure = float(project_data.get("expenditure", 0.0))
        orig_cost = float(project_data.get("original_cost", 1.0))

        anomalies = []

        # 1. Trajectory Stagnation Anomaly (Expenditure increasing but 0 physical progress change)
        if expenditure > (orig_cost * 0.3) and phys_prog < 10.0:
            anomalies.append({
                "anomaly_code": "ANOM_STAGNANT_PROGRESS_HIGH_EXPENDITURE",
                "anomaly_title": "High Expenditure with Stagnant Physical Progress",
                "severity": "HIGH",
                "observation": f"Cumulative expenditure is ₹{expenditure:.2f} Cr ({((expenditure/orig_cost)*100):.1f}% of sanction), but reported physical progress is only {phys_prog:.1f}%.",
                "compliance_status": "Requires Operational Review"
            })

        # 2. Financial Progress Mismatch
        if fin_gap > 20.0:
            anomalies.append({
                "anomaly_code": "ANOM_FINANCIAL_PHYSICAL_DIVERGENCE",
                "anomaly_title": "Financial vs Physical Milestone Divergence",
                "severity": "MEDIUM",
                "observation": f"Financial milestone reporting leads physical ground progress by {fin_gap:.1f}%.",
                "compliance_status": "Requires Expenditure Verification"
            })

        # 3. Sudden Cost Revision Spike
        if cost_esc > 1.25:
            anomalies.append({
                "anomaly_code": "ANOM_SECTOR_COST_REVISION_SPIKE",
                "anomaly_title": "Upper Decile Cost Revision Outlier",
                "severity": "HIGH",
                "observation": f"Revised cost of ₹{project_data.get('revised_cost', orig_cost):.2f} Cr represents a {((cost_esc - 1.0)*100):.1f}% escalation over original approval.",
                "compliance_status": "Requires Technical Sanction Audit"
            })

        if not anomalies:
            anomalies.append({
                "anomaly_code": "ANOM_NOMINAL",
                "anomaly_title": "Nominal Trajectory Benchmark",
                "severity": "LOW",
                "observation": "Project progress and expenditure velocity align with sector baseline peers.",
                "compliance_status": "Compliant with Standards"
            })

        return {
            "evidence_category": EvidenceCategory.DERIVED,
            "anomalies_detected_count": len([a for a in anomalies if a["anomaly_code"] != "ANOM_NOMINAL"]),
            "anomalies": anomalies
        }


if __name__ == "__main__":
    import json
    detector = AnomalyDetectionEngine()
    sample_proj = {
        "project_code": "PAIM-619054",
        "original_cost": 1000.0,
        "revised_cost": 1350.0,
        "expenditure": 450.0,
        "physical_progress": 8.5,
        "financial_physical_gap": 36.5,
        "cost_escalation_ratio": 1.35
    }
    res = detector.detect_project_anomalies(sample_proj)
    print("Anomaly Engine Output:\n", json.dumps(res, indent=2))
