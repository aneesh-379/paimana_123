"""
Action Recommender Agent (PAIMANA AI Multi-Agent System)
Generates actionable, policy-compliant decision-support recommendations for MoSPI/IPMD officers.
Strictly adheres to non-autonomous boundary (no auto-blacklisting or fake legal notices).
"""

from typing import Dict, List, Any
from ml.ingestion.data_provenance import EvidenceCategory


class ActionRecommenderAgent:
    """Agent responsible for generating mitigation action recommendations."""

    def recommend_actions(self, risk_assessment: Dict[str, Any], bottleneck_diagnosis: Dict[str, Any]) -> Dict[str, Any]:
        risk_tier = risk_assessment.get("risk_tier", "LOW_RISK")
        bottlenecks = bottleneck_diagnosis.get("primary_bottlenecks", [])

        recommendations = []

        for b in bottlenecks:
            b_type = b.get("bottleneck_type")
            if b_type == "LAND_ACQUISITION_&_RIGHT_OF_WAY":
                recommendations.append({
                    "action_code": "ACT_LAND_CLEARANCE",
                    "target_stakeholder": "State Nodal Officer & District Collector",
                    "recommended_step": "Convene joint Empowered Committee meeting to clear pending Right of Way (RoW) stretches.",
                    "urgency": "HIGH"
                })
            elif b_type == "CONTRACTOR_FUND_UTILIZATION_DISCREPANCY":
                recommendations.append({
                    "action_code": "ACT_EXPENDITURE_AUDIT",
                    "target_stakeholder": "Implementing Agency Finance Wing",
                    "recommended_step": "Audit stage-wise milestone billing against physical bill-of-quantities before next fund release.",
                    "urgency": "MEDIUM"
                })
            elif b_type == "SCOPE_REVISION_&_RAW_MATERIAL_INFLATION":
                recommendations.append({
                    "action_code": "ACT_REVISED_SANCTION_REVIEW",
                    "target_stakeholder": "Line Ministry Financial Adviser",
                    "recommended_step": "Review Revised Cost Estimates (RCE) and verify technical justification for material inflation.",
                    "urgency": "HIGH"
                })

        if not recommendations:
            recommendations.append({
                "action_code": "ACT_STANDARD_MONITORING",
                "target_stakeholder": "IPMD Monitoring Officer",
                "recommended_step": "Continue standard monthly milestone tracking on PAIMANA portal.",
                "urgency": "LOW"
            })

        return {
            "evidence_category": EvidenceCategory.RECOMMENDED,
            "agent": "ActionRecommenderAgent",
            "recommended_actions": recommendations,
            "governance_notice": "Decision-support recommendation for MoSPI/IPMD review. Requires manual officer authorization."
        }
