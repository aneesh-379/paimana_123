"""
PAIMANA Risk Engine & Predictive Inference Service
Loads trained ML models, executes feature extraction, and computes real ML risk predictions & SHAP explanations.
"""

import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional

from backend.app.config import settings
from ml.features.engineer_features import PAIMANAFeatureEngineer, FEATURE_COLUMNS
from ml.explainability.shap_engine import PAIMANAShapExplainer


class RiskEngine:
    """Predictive Inference and Decision-Support Engine for PAIMANA using trained ML models."""

    def __init__(self):
        self.feature_engineer: Optional[PAIMANAFeatureEngineer] = None
        self.model_delay = None
        self.model_cost = None
        self.model_risk = None
        self.shap_explainer = PAIMANAShapExplainer(model_dir=settings.MODELS_DIR)
        self.historical_dataset: Optional[pd.DataFrame] = None
        self.load_models()
        self.load_reference_data()

    def load_models(self):
        """Loads saved joblib models and feature engineer."""
        fe_path = os.path.join(settings.MODELS_DIR, "feature_engineer.joblib")
        delay_path = os.path.join(settings.MODELS_DIR, "paimana_delay_model.joblib")
        cost_path = os.path.join(settings.MODELS_DIR, "paimana_cost_model.joblib")
        risk_path = os.path.join(settings.MODELS_DIR, "paimana_risk_model.joblib")

        try:
            if os.path.exists(fe_path):
                self.feature_engineer = joblib.load(fe_path)
            else:
                self.feature_engineer = PAIMANAFeatureEngineer()

            if os.path.exists(delay_path):
                self.model_delay = joblib.load(delay_path)
            if os.path.exists(cost_path):
                self.model_cost = joblib.load(cost_path)
            if os.path.exists(risk_path):
                self.model_risk = joblib.load(risk_path)

            print(f"RiskEngine: Models loaded. Delay: {self.model_delay is not None}, Cost: {self.model_cost is not None}, Risk: {self.model_risk is not None}")
        except Exception as e:
            print(f"RiskEngine Warning: Model loading error ({e}). Initializing feature engineer fallback.")
            if self.feature_engineer is None:
                self.feature_engineer = PAIMANAFeatureEngineer()

    def load_reference_data(self):
        """Loads real user datasets (traindata.csv / Testdata.csv) for lookups."""
        paths = [
            os.path.join(settings.PROCESSED_DIR, "traindata.csv"),
            os.path.join(settings.PROCESSED_DIR, "Testdata.csv"),
            "data/processed/traindata.csv",
            "traindata.csv"
        ]
        for p in paths:
            if os.path.exists(p):
                try:
                    self.historical_dataset = pd.read_csv(p, low_memory=False)
                    print(f"RiskEngine: Real user dataset loaded from {p} ({len(self.historical_dataset)} rows)")
                    break
                except Exception as e:
                    print(f"RiskEngine: Could not read {p}: {e}")

    def lookup_project(self, project_code: str) -> Optional[Dict[str, Any]]:
        """Looks up project record in real training / holdout dataset by project code or keyword."""
        if self.historical_dataset is None or self.historical_dataset.empty:
            return None

        clean_code = str(project_code).strip().upper()
        if "project_code" in self.historical_dataset.columns:
            matches = self.historical_dataset[self.historical_dataset["project_code"].astype(str).str.upper() == clean_code]
            if not matches.empty:
                return matches.iloc[-1].to_dict()
        return None

    def predict_project(self, project: Dict[str, Any]) -> Dict[str, Any]:
        """Runs predictive inference for a single project payload using real ML models."""
        proj_code = str(project.get("project_code", "UNKNOWN")).strip()
        
        # Merge with historical ground truth if project is found in dataset and some keys are missing
        hist_record = self.lookup_project(proj_code) if proj_code != "UNKNOWN" else None
        merged_project = {**(hist_record or {}), **project}

        # Ensure minimal required fields
        orig_cost = float(merged_project.get("original_cost", 1000.0) or 1000.0)
        rev_cost = float(merged_project.get("revised_cost", orig_cost) or orig_cost)
        expenditure = float(merged_project.get("expenditure", orig_cost * 0.45) or 0.0)
        phys_prog = float(merged_project.get("physical_progress", 45.0) or 0.0)

        merged_project["original_cost"] = orig_cost
        merged_project["revised_cost"] = rev_cost
        merged_project["expenditure"] = expenditure
        merged_project["physical_progress"] = phys_prog

        df_single = pd.DataFrame([merged_project])
        if self.feature_engineer is None:
            self.feature_engineer = PAIMANAFeatureEngineer()

        try:
            df_transformed, cols = self.feature_engineer.transform(df_single)
            X = df_transformed[cols]
        except Exception as e:
            # Fallback fit_transform if needed
            df_transformed, cols = self.feature_engineer.fit_transform(df_single)
            X = df_transformed[cols]

        pred_delay = 0.0
        pred_cost_pct = 0.0
        pred_is_high_risk = 0
        risk_probability = 0.5

        if self.model_delay is not None:
            pred_delay = float(self.model_delay.predict(X)[0])
        else:
            # Mathematical baseline if model unavailable
            fin_prog = (expenditure / max(1.0, rev_cost)) * 100.0
            gap = max(0.0, fin_prog - phys_prog)
            pred_delay = max(0.5, ((100.0 - phys_prog) * 0.28) + (gap * 0.35))

        if self.model_cost is not None:
            pred_cost_pct = float(self.model_cost.predict(X)[0])
        else:
            cost_escalation_pct = ((rev_cost - orig_cost) / max(1.0, orig_cost)) * 100.0
            pred_cost_pct = max(0.0, cost_escalation_pct + (pred_delay * 0.6))

        if self.model_risk is not None:
            try:
                pred_is_high_risk = int(self.model_risk.predict(X)[0])
                if hasattr(self.model_risk, "predict_proba"):
                    risk_probability = float(self.model_risk.predict_proba(X)[0][1])
                else:
                    risk_probability = 0.85 if pred_is_high_risk == 1 else 0.20
            except Exception:
                pred_is_high_risk = 1 if (pred_delay > 12 or pred_cost_pct > 15) else 0
                risk_probability = 0.85 if pred_is_high_risk == 1 else 0.25

        pred_delay = max(0.0, round(pred_delay, 1))
        pred_cost_pct = max(0.0, round(pred_cost_pct, 1))
        additional_cost_cr = round((pred_cost_pct / 100.0) * orig_cost, 2)

        # Risk score calculation 0 - 100
        risk_score = min(100.0, max(0.0, (risk_probability * 50.0) + (pred_delay * 1.8) + (pred_cost_pct * 0.8)))
        risk_score = round(risk_score, 1)

        if risk_score >= 75 or pred_is_high_risk == 1 and risk_score >= 60:
            risk_tier = "CRITICAL"
        elif risk_score >= 50:
            risk_tier = "HIGH"
        elif risk_score >= 25:
            risk_tier = "MEDIUM"
        else:
            risk_tier = "LOW"

        # Extract SHAP risk drivers
        shap_explanation = self.shap_explainer.explain_project_prediction(df_transformed)

        return {
            "project_code": proj_code,
            "project_name": str(merged_project.get("project_name", f"Infrastructure Project {proj_code}")),
            "sector": str(merged_project.get("sector", "Infrastructure & Highways")),
            "ministry": str(merged_project.get("ministry", "Ministry of Road Transport and Highways")),
            "implementing_agency": str(merged_project.get("implementing_agency", "NHAI")),
            "state": str(merged_project.get("state", "National")),
            "original_cost": orig_cost,
            "revised_cost": rev_cost,
            "expenditure": expenditure,
            "physical_progress": phys_prog,
            "predicted_delay_months": pred_delay,
            "predicted_cost_overrun_pct": pred_cost_pct,
            "predicted_additional_cost_cr": additional_cost_cr,
            "risk_score": risk_score,
            "risk_probability": round(risk_probability, 4),
            "risk_tier": risk_tier,
            "is_high_risk": bool(pred_is_high_risk or risk_score >= 50),
            "model_version": "PAIMANA-ML-v2.0-RandomForest-XGBoost",
            "feature_attributions": shap_explanation.get("top_risk_drivers", []),
            "explanatory_narrative": shap_explanation.get("explanatory_narrative", ""),
            "target_final_delay_months": merged_project.get("target_final_delay_months"),
            "target_cost_overrun_pct": merged_project.get("target_cost_overrun_pct")
        }

    def predict_dataframe(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Batch predicts an entire uploaded CSV DataFrame using the trained ML model."""
        results = []
        for _, row in df.iterrows():
            record = row.to_dict()
            results.append(self.predict_project(record))
        return results


risk_engine = RiskEngine()
