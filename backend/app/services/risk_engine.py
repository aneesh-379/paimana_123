"""
PAIMANA Risk Engine & Predictive Inference Service
Loads trained ML models, executes feature extraction, and computes risk predictions & SHAP explanations.
"""

import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List

from backend.app.config import settings
from ml.features.engineer_features import PAIMANAFeatureEngineer, FEATURE_COLUMNS
from ml.explainability.shap_explainer import PAIMANAExplainer


class RiskEngine:
    """Predictive Inference and Decision-Support Engine for PAIMANA."""

    def __init__(self):
        self.feature_engineer: PAIMANAFeatureEngineer = None
        self.model_delay = None
        self.model_cost = None
        self.model_risk = None
        self.explainer = PAIMANAExplainer(FEATURE_COLUMNS)
        self.load_models()

    def load_models(self):
        """Loads saved joblib models and feature engineer if available."""
        fe_path = os.path.join(settings.MODELS_DIR, "feature_engineer.joblib")
        delay_path = os.path.join(settings.MODELS_DIR, "paimana_delay_model.joblib")
        cost_path = os.path.join(settings.MODELS_DIR, "paimana_cost_model.joblib")
        risk_path = os.path.join(settings.MODELS_DIR, "paimana_risk_model.joblib")

        try:
            if os.path.exists(fe_path) and os.path.exists(delay_path):
                self.feature_engineer = joblib.load(fe_path)
                self.model_delay = joblib.load(delay_path)
                self.model_cost = joblib.load(cost_path)
                self.model_risk = joblib.load(risk_path)
                print("RiskEngine: Loaded trained ML model artifacts successfully.")
            else:
                print("RiskEngine: Model artifacts not found. Initializing fallback feature engineer.")
                self.feature_engineer = PAIMANAFeatureEngineer()
        except Exception as e:
            print(f"RiskEngine Warning: Failed to load models ({e}). Operating in heuristic mode.")
            self.feature_engineer = PAIMANAFeatureEngineer()

    def predict_project(self, project: Dict[str, Any]) -> Dict[str, Any]:
        """Runs predictive inference for a single project payload."""
        df_single = pd.DataFrame([project])
        df_transformed, cols = self.feature_engineer.transform(df_single)
        X = df_transformed[cols]

        if self.model_delay is not None:
            pred_delay = float(self.model_delay.predict(X)[0])
            pred_cost_pct = float(self.model_cost.predict(X)[0])
        else:
            # Fallback heuristic calculation
            phys_prog = float(project.get("physical_progress", 50.0))
            orig_cost = float(project.get("original_cost", 100.0))
            exp = float(project.get("expenditure", 0.0))
            fin_prog = (exp / orig_cost) * 100.0 if orig_cost > 0 else 0.0
            gap = phys_prog - fin_prog
            pred_delay = max(0.0, (100.0 - phys_prog) * 0.15 + max(0.0, -gap * 0.4))
            pred_cost_pct = max(0.0, (pred_delay * 0.8) + max(0.0, -gap * 0.3))

        pred_delay = max(0.0, round(pred_delay, 1))
        pred_cost_pct = max(0.0, round(pred_cost_pct, 1))

        orig_cost = float(project.get("original_cost", 100.0))
        additional_cost_cr = round((pred_cost_pct / 100.0) * orig_cost, 2)

        # Risk score calculation normalized 0 - 100
        risk_score = min(100.0, max(0.0, (pred_delay * 3.5) + (pred_cost_pct * 1.8)))

        risk_tier = "CRITICAL" if risk_score > 75 else ("HIGH" if risk_score > 50 else ("MEDIUM" if risk_score > 25 else "LOW"))

        return {
            "project_code": str(project.get("project_code", "N/A")),
            "project_name": str(project.get("project_name", "N/A")),
            "sector": str(project.get("sector", "N/A")),
            "ministry": str(project.get("ministry", "N/A")),
            "state": str(project.get("state", "N/A")),
            "original_cost": orig_cost,
            "revised_cost": float(project.get("revised_cost", orig_cost)),
            "expenditure": float(project.get("expenditure", 0.0)),
            "physical_progress": float(project.get("physical_progress", 0.0)),
            "predicted_delay_months": pred_delay,
            "predicted_cost_overrun_pct": pred_cost_pct,
            "predicted_additional_cost_cr": additional_cost_cr,
            "risk_score": round(risk_score, 1),
            "risk_tier": risk_tier,
            "target_final_delay_months": project.get("target_final_delay_months"),
            "target_cost_overrun_pct": project.get("target_cost_overrun_pct")
        }

    def explain_project(self, project: Dict[str, Any]) -> Dict[str, Any]:
        """Provides detailed feature importance breakdown and recommendations."""
        pred = self.predict_project(project)
        explanation = self.explainer.explain_project(
            project_dict=project,
            predicted_delay_months=pred["predicted_delay_months"],
            predicted_cost_overrun_pct=pred["predicted_cost_overrun_pct"],
            risk_score=pred["risk_score"]
        )
        explanation["project_code"] = pred["project_code"]
        return explanation


risk_engine = RiskEngine()
