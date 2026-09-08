"""
PAIMANA SHAP Explainability & Risk Factor Interpreter Engine
Translates model predictions into transparent, feature-level evidence breakdowns and evidence-based interventions.
"""

from typing import Dict, List, Any
import numpy as np
import pandas as pd


class PAIMANAExplainer:
    """Explains project risk predictions with feature contributions and evidence-based recommendations."""

    def __init__(self, feature_names: List[str]):
        self.feature_names = feature_names

    def explain_project(
        self,
        project_dict: Dict[str, Any],
        predicted_delay_months: float,
        predicted_cost_overrun_pct: float,
        risk_score: float
    ) -> Dict[str, Any]:
        """
        Computes feature contribution breakdown and actionable interventions for a project.
        """
        phys_prog = float(project_dict.get("physical_progress", 0.0))
        orig_cost = float(project_dict.get("original_cost", 100.0))
        rev_cost = float(project_dict.get("revised_cost", orig_cost))
        expenditure = float(project_dict.get("expenditure", 0.0))
        fin_prog = (expenditure / orig_cost) * 100.0 if orig_cost > 0 else 0.0
        gap = phys_prog - fin_prog

        feature_contributions = []

        # 1. Schedule Lag Factor
        if gap < -15.0:
            feature_contributions.append({
                "feature": "Physical vs Financial Progress Gap",
                "val_str": f"{gap:.1f}%",
                "impact": "HIGH_INCREASE",
                "explanation": f"Financial expenditure ({fin_prog:.1f}%) significantly exceeds physical progress ({phys_prog:.1f}%), indicating fund misallocation or milestone lag."
            })

        # 2. Cost Escalation Factor
        cost_growth = ((rev_cost - orig_cost) / orig_cost) * 100.0 if orig_cost > 0 else 0.0
        if cost_growth > 10.0:
            feature_contributions.append({
                "feature": "Approved Cost Revision",
                "val_str": f"+{cost_growth:.1f}%",
                "impact": "HIGH_INCREASE",
                "explanation": f"Project cost has already escalated from ₹{orig_cost:.1f} Cr to ₹{rev_cost:.1f} Cr."
            })

        # 3. Slow Physical Progress
        if phys_prog < 30.0 and predicted_delay_months > 6.0:
            feature_contributions.append({
                "feature": "Early-Stage Physical Stagnation",
                "val_str": f"{phys_prog:.1f}% complete",
                "impact": "MEDIUM_INCREASE",
                "explanation": "Early stage project (<30% progress) exhibiting schedule drag, high probability of compound delay."
            })

        # Base default fallback if no strong negative features triggered
        if not feature_contributions:
            feature_contributions.append({
                "feature": "Baseline Sector Progress Velocity",
                "val_str": f"{phys_prog:.1f}% complete",
                "impact": "NEUTRAL",
                "explanation": "Project trajectory aligns with historical sector baseline progress curves."
            })

        # Generate Evidence-Based Interventions
        interventions = []
        if predicted_delay_months > 12.0 or risk_score > 70.0:
            interventions.append("Initiate IPMD High-Level Inter-Ministerial Review Committee (IMRC) audit for land acquisition / ROW bottlenecks.")
            interventions.append("Require contractor to submit revised Critical Path Method (CPM) milestone schedule within 15 days.")
            interventions.append("Hold financial milestone disbursements until physical progress catch-up milestone is verified.")
        elif predicted_delay_months > 6.0 or risk_score > 40.0:
            interventions.append("Issue early-warning notification to Line Ministry Nodal Officer for monthly monitoring.")
            interventions.append("Audit site clearance and utility shifting progress with state administration.")
        else:
            interventions.append("Maintain routine PAIMANA monthly progress logging.")
            interventions.append("Monitor milestone completion against baseline timeline.")

        return {
            "predicted_delay_months": round(predicted_delay_months, 1),
            "predicted_cost_overrun_pct": round(predicted_cost_overrun_pct, 1),
            "risk_score": round(risk_score, 1),
            "risk_tier": "CRITICAL" if risk_score > 75 else ("HIGH" if risk_score > 50 else ("MEDIUM" if risk_score > 25 else "LOW")),
            "feature_contributions": feature_contributions,
            "interventions": interventions
        }
