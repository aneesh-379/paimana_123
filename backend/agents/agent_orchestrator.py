"""
PAIMANA AI Multi-Agent Orchestrator Engine
Coordinates the multi-agent workflow:
  RiskAssessorAgent ➔ BottleneckDiagnoserAgent ➔ ActionRecommenderAgent
Provides multi-tier risk analysis, SHAP-driven root cause diagnosis, and evidence-tagged recommendations.
"""

from typing import Dict, Any
import pandas as pd

from backend.agents.risk_assessor_agent import RiskAssessorAgent
from backend.agents.bottleneck_diagnoser_agent import BottleneckDiagnoserAgent
from backend.agents.action_recommender_agent import ActionRecommenderAgent
from ml.explainability.shap_engine import PAIMANAShapExplainer


class AgentOrchestrator:
    """Master orchestrator for PAIMANA multi-agent analysis."""

    def __init__(self, model_dir: str = "data/models"):
        self.risk_agent = RiskAssessorAgent()
        self.diagnoser_agent = BottleneckDiagnoserAgent()
        self.recommender_agent = ActionRecommenderAgent()
        self.shap_explainer = PAIMANAShapExplainer(model_dir=model_dir)

    def analyze_project(self, project_data: Dict[str, Any], predictions: Dict[str, Any]) -> Dict[str, Any]:
        """Runs multi-agent workflow on a project instance."""
        # Step 1: Risk Assessment
        risk_output = self.risk_agent.evaluate_risk(project_data, predictions)

        # Step 2: SHAP Explainability & Bottleneck Diagnosis
        df_single = pd.DataFrame([project_data])
        shap_output = self.shap_explainer.explain_project_prediction(df_single)
        diagnosis_output = self.diagnoser_agent.diagnose_bottlenecks(project_data, shap_output)

        # Step 3: Action Recommendations
        recommendation_output = self.recommender_agent.recommend_actions(risk_output, diagnosis_output)

        return {
            "project_code": project_data.get("project_code", "UNKNOWN"),
            "risk_assessment": risk_output,
            "shap_explanation": shap_output,
            "bottleneck_diagnosis": diagnosis_output,
            "action_recommendations": recommendation_output
        }


if __name__ == "__main__":
    import json
    orchestrator = AgentOrchestrator()
    sample_proj = {
        "project_code": "PAIM-619054",
        "sector": "Infrastructure & Highways",
        "implementing_agency": "Airport Authority of India",
        "original_cost": 1162.76,
        "revised_cost": 1162.76,
        "expenditure": 494.72,
        "physical_progress": 42.5,
        "progress_lag_pct": 18.6,
        "financial_physical_gap": 0.0,
        "cost_escalation_ratio": 1.0,
        "snapshot_date": "2026-01-01"
    }
    sample_preds = {
        "predicted_delay_months": {"value": 14.5},
        "predicted_cost_overrun_pct": {"value": 12.2}
    }
    result = orchestrator.analyze_project(sample_proj, sample_preds)
    print("Multi-Agent Orchestration Result:\n", json.dumps(result, indent=2))
