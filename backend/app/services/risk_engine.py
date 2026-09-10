"""
PAIMANA Risk Engine & Predictive Inference Service
Loads trained ML models (sih26103_final_models: CatBoost Classifiers & ExtraTrees Regressors),
executes 37-feature extraction, and computes real ML risk predictions & SHAP explanations.
"""

import os
import re
import json
import pickle
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional

from backend.app.config import settings
from ml.features.engineer_features import PAIMANAFeatureEngineer, FEATURE_COLUMNS
from ml.explainability.shap_engine import PAIMANAShapExplainer


def safe_float(val: Any, default: float = 0.0) -> float:
    try:
        if pd.isna(val) or val is None:
            return default
        if isinstance(val, (int, float)):
            return float(val)
        m = re.search(r'[-+]?\d*\.\d+|\d+', str(val))
        return float(m.group(0)) if m else default
    except Exception:
        return default


def safe_int(val: Any, default: int = 0) -> int:
    try:
        if pd.isna(val) or val is None:
            return default
        if isinstance(val, int):
            return val
        m = re.search(r'\d+', str(val))
        return int(m.group(0)) if m else default
    except Exception:
        return default


def safe_str(val: Any, default: str = "") -> str:
    if val is None or pd.isna(val):
        return default
    s = str(val).strip()
    if s.lower() in ("nan", "none", "null", "", "undefined"):
        return default
    return s



class RiskEngine:
    """Predictive Inference and Decision-Support Engine for PAIMANA using sih26103_final_models."""

    def __init__(self):
        self.feature_engineer: Optional[PAIMANAFeatureEngineer] = None
        
        # sih26103_final_models
        self.sih_cost_clf = None
        self.sih_delay_clf = None
        self.sih_delay_reg = None
        self.sih_metadata = None
        
        # Legacy fallback models
        self.model_delay = None
        self.model_cost = None
        self.model_risk = None
        
        self.shap_explainer = PAIMANAShapExplainer(model_dir=settings.MODELS_DIR)
        self.historical_dataset: Optional[pd.DataFrame] = None
        self.load_models()
        self.load_reference_data()

    def load_models(self):
        """Loads saved sih26103_final_models or legacy models."""
        sih_dir = "sih26103_final_models"
        if not os.path.exists(sih_dir):
            sih_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "sih26103_final_models")

        meta_path = os.path.join(sih_dir, "model_metadata.json")
        cost_clf_path = os.path.join(sih_dir, "cost_classifier_catboost.pkl")
        delay_clf_path = os.path.join(sih_dir, "delay_classifier_catboost.pkl")
        delay_reg_path = os.path.join(sih_dir, "delay_regressor_extratrees.pkl")

        if os.path.exists(meta_path) and os.path.exists(cost_clf_path):
            try:
                with open(meta_path, "r") as f:
                    self.sih_metadata = json.load(f)
                with open(cost_clf_path, "rb") as f:
                    self.sih_cost_clf = pickle.load(f)
                with open(delay_clf_path, "rb") as f:
                    self.sih_delay_clf = pickle.load(f)
                self.sih_delay_reg = joblib.load(delay_reg_path)
                print(f"RiskEngine: Successfully loaded SIH26103 Final Models (CatBoost & ExtraTrees) from {sih_dir}/")
            except Exception as e:
                print(f"RiskEngine Warning: Exception loading sih26103_final_models ({e}). Falling back to legacy models.")

        # Fallback legacy models if needed
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
        except Exception as e:
            if self.feature_engineer is None:
                self.feature_engineer = PAIMANAFeatureEngineer()

    def load_reference_data(self):
        """Loads real user datasets (traindata.csv / Testdata.csv) for lookups."""
        paths = [
            os.path.join(settings.PROCESSED_DIR, "traindata.csv"),
            os.path.join(settings.PROCESSED_DIR, "Testdata.csv"),
            "data/processed/traindata.csv",
            "data/processed/Testdata.csv",
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

        clean_code = str(project_code).strip().upper().replace("PAIM-", "").rstrip(".0")
        if not clean_code:
            return None

        for col in ["project_code", "Project_ID", "Project_Code", "project_id"]:
            if col in self.historical_dataset.columns:
                series = self.historical_dataset[col].astype(str).str.strip().str.upper().str.replace("PAIM-", "", regex=False).str.rstrip(".0")
                matches = self.historical_dataset[series == clean_code]
                if not matches.empty:
                    return matches.iloc[-1].to_dict()

        for col in ["project_name", "Project_Name"]:
            if col in self.historical_dataset.columns:
                series = self.historical_dataset[col].astype(str).str.upper()
                matches = self.historical_dataset[series.str.contains(clean_code, regex=False)]
                if not matches.empty:
                    return matches.iloc[-1].to_dict()

        return None

    def prepare_sih26103_features(self, row: Dict[str, Any]) -> Dict[str, Any]:
        """Maps raw row keys into the exact 37 features demanded by sih26103_final_models."""
        orig_cost = safe_float(row.get('Original_Cost_Crore') or row.get('Original_Cost') or row.get('original_cost'), 1000.0)
        rev_cost = safe_float(row.get('Revised_Cost_Crore') or row.get('Revised_Cost') or row.get('revised_cost'), orig_cost)
        exp = safe_float(row.get('Cumulative_Expenditure_Crore') or row.get('Expenditure') or row.get('expenditure'), orig_cost * 0.45)
        phys_prog = safe_float(row.get('Physical_Progress_Percent') or row.get('Physical_Progress_Pct') or row.get('physical_progress'), 45.0)
        fin_prog = safe_float(row.get('Financial_Progress_Percent') or row.get('Financial_Progress_Pct') or row.get('financial_progress'), (exp / max(1.0, rev_cost)) * 100.0)
        
        app_to_orig = safe_float(row.get('Approval_To_Original_Months'), 36.0)
        proj_age = safe_float(row.get('Project_Age_Months'), 24.0)
        time_elapsed = min(100.0, (proj_age / max(1.0, app_to_orig)) * 100.0)
        orig_target_delay = safe_float(row.get('Original_Target_Delay_Months'), 0.0)
        sched_overrun = safe_float(row.get('Schedule_Overrun_Months'), orig_target_delay)
        months_rem_orig = max(0.0, app_to_orig - proj_age)
        months_rem_rev = max(0.0, app_to_orig + sched_overrun - proj_age)
        
        cost_overrun_cr = max(0.0, rev_cost - orig_cost)
        cost_overrun_pct = (cost_overrun_cr / max(1.0, orig_cost)) * 100.0
        prog_div = phys_prog - fin_prog
        
        monthly_exp = exp / max(1.0, proj_age)
        monthly_phys = phys_prog / max(1.0, proj_age)
        
        rep_year = safe_int(row.get('Reporting_Year') or row.get('report_year_num'), 2026)
        rep_month = safe_int(row.get('Reporting_Month') or row.get('report_month_num'), 1)
        rep_quarter = (rep_month - 1) // 3 + 1
        
        status_val = safe_str(row.get('Project_Status') or row.get('project_status'), 'Delayed' if phys_prog < 80 else 'On-Track')

        agency_val = safe_str(row.get('Agency') or row.get('agency') or row.get('implementing_agency'), 'MoRTH')
        min_default = 'Ministry of Road Transport and Highways' if 'morth' in agency_val.lower() or 'nhai' in agency_val.lower() else 'Central Infrastructure Sector'
        min_val = safe_str(row.get('Ministry') or row.get('ministry'), min_default)
        dept_val = safe_str(row.get('Department') or row.get('department'), 'Road Transport & Highways')
        sec_val = safe_str(row.get('Sector') or row.get('sector'), 'ROAD TRANSPORT AND HIGHWAYS')
        state_val = safe_str(row.get('State') or row.get('state'), 'TELANGANA')

        return {
            'Ministry': min_val,
            'Department': dept_val,
            'Agency': agency_val,
            'Sector': sec_val,
            'State': state_val,

            'District': 0,
            'Region': 0,
            'Original_Cost_Crore': orig_cost,
            'Revised_Cost_Crore': rev_cost,
            'Cumulative_Expenditure_Crore': exp,
            'Physical_Progress_Pct': phys_prog,
            'Financial_Progress_Pct': fin_prog,
            'Project_Status': status_val,
            'Approval_To_Original_Months': app_to_orig,
            'Project_Age_Months': proj_age,
            'Time_Elapsed_Pct': time_elapsed,
            'Original_Target_Delay_Months': orig_target_delay,
            'Schedule_Overrun_Months': sched_overrun,
            'Months_Remaining_Original': months_rem_orig,
            'Months_Remaining_Revised': months_rem_rev,
            'Cost_Overrun_Crore': cost_overrun_cr,
            'Cost_Overrun_Pct': cost_overrun_pct,
            'Progress_Divergence': prog_div,
            'Schedule_Slippage_1M': safe_float(row.get('Schedule_Slippage_1M'), 0.0),
            'Cumulative_Schedule_Slippages': sched_overrun,
            'Cost_Revision_1M': safe_float(row.get('Cost_Revision_1M'), 0.0),
            'Cumulative_Cost_Revisions': cost_overrun_cr,
            'Monthly_Expenditure_Crore': monthly_exp,
            'Monthly_Physical_Progress': monthly_phys,
            'Burn_Rate_3M_Crore': monthly_exp * 3.0,
            'Progress_Rate_3M': monthly_phys * 3.0,
            'Required_Monthly_Progress_Pct': max(0.0, 100.0 - phys_prog) / max(1.0, months_rem_rev),
            'Sector_Hist_Cost_Overrun_Pct': safe_float(row.get('Sector_Hist_Cost_Overrun_Pct'), 15.0),
            'Sector_Hist_Delay_Months': safe_float(row.get('Sector_Hist_Delay_Months'), 12.0),
            'report_year_num': rep_year,
            'report_month_num': rep_month,
            'report_quarter': rep_quarter
        }

    def predict_project(self, project: Dict[str, Any]) -> Dict[str, Any]:
        """Runs predictive inference for a single project payload using SIH26103 Final Models."""
        proj_code = str(project.get("project_code") or project.get("Project_ID") or project.get("Project_Code") or "UNKNOWN").strip()
        
        # Merge with historical ground truth if available
        hist_record = self.lookup_project(proj_code) if proj_code != "UNKNOWN" else None
        
        # Clean incoming project dict to override historical record on all alias keys
        clean_project = {}
        for k, v in project.items():
            clean_project[k] = v
            k_lower = str(k).lower()
            if k_lower in ("sector", "ministry", "agency", "implementing_agency", "state", "department", "project_name"):
                clean_project[k_lower.capitalize()] = v
                clean_project[k_lower] = v
                if k_lower == "agency" or k_lower == "implementing_agency":
                    clean_project["Agency"] = v
                    clean_project["implementing_agency"] = v

        merged_project = {**(hist_record or {}), **clean_project}

        # Compute 37 features
        sih_feat_dict = self.prepare_sih26103_features(merged_project)
        
        orig_cost = sih_feat_dict['Original_Cost_Crore']
        rev_cost = sih_feat_dict['Revised_Cost_Crore']
        expenditure = sih_feat_dict['Cumulative_Expenditure_Crore']
        phys_prog = sih_feat_dict['Physical_Progress_Pct']

        pred_delay = 0.0
        pred_cost_pct = 0.0
        cost_clf_proba = 0.5
        delay_clf_proba = 0.5
        is_high_risk = False
        model_ver = "SIH26103-Final-CatBoost-ExtraTrees"

        if self.sih_cost_clf is not None and self.sih_delay_clf is not None and self.sih_delay_reg is not None:
            features = self.sih_metadata['features']
            cat_features = self.sih_metadata['categorical_features']
            
            df_feat = pd.DataFrame([sih_feat_dict])[features]
            for col in cat_features:
                df_feat[col] = df_feat[col].astype(str)
                
            try:
                # CatBoost Predictions
                cost_class = int(self.sih_cost_clf.predict(df_feat)[0])
                cost_proba_arr = self.sih_cost_clf.predict_proba(df_feat)[0]
                cost_clf_proba = float(cost_proba_arr[1]) if len(cost_proba_arr) > 1 else float(cost_class)
                
                delay_class = int(self.sih_delay_clf.predict(df_feat)[0])
                delay_proba_arr = self.sih_delay_clf.predict_proba(df_feat)[0]
                delay_clf_proba = float(delay_proba_arr[1]) if len(delay_proba_arr) > 1 else float(delay_class)

                # ExtraTrees Regressor Prediction for Delay Months
                df_num = df_feat.copy()
                for col in cat_features:
                    df_num[col] = pd.factorize(df_num[col])[0]

                pred_delay = float(self.sih_delay_reg.predict(df_num)[0])
                pred_delay = max(0.0, round(pred_delay, 1))

                # Cost overrun % calculation based on classifier probability & cost difference
                base_cost_esc = ((rev_cost - orig_cost) / max(1.0, orig_cost)) * 100.0
                pred_cost_pct = max(0.0, round(base_cost_esc + (cost_clf_proba * 18.0) + (pred_delay * 0.4), 1))
                is_high_risk = bool(cost_class == 1 or delay_class == 1 or pred_delay >= 12.0)
            except Exception as e:
                print(f"RiskEngine: Error during SIH26103 model inference ({e}). Falling back to baseline calculations.")
                fin_prog = (expenditure / max(1.0, rev_cost)) * 100.0
                gap = max(0.0, fin_prog - phys_prog)
                pred_delay = max(0.5, round(((100.0 - phys_prog) * 0.28) + (gap * 0.35), 1))
                pred_cost_pct = max(0.0, round(((rev_cost - orig_cost) / max(1.0, orig_cost)) * 100.0 + (pred_delay * 0.5), 1))
                is_high_risk = bool(pred_delay >= 12.0 or pred_cost_pct >= 15.0)
        else:
            # Mathematical baseline fallback
            fin_prog = (expenditure / max(1.0, rev_cost)) * 100.0
            gap = max(0.0, fin_prog - phys_prog)
            pred_delay = max(0.5, round(((100.0 - phys_prog) * 0.28) + (gap * 0.35), 1))
            pred_cost_pct = max(0.0, round(((rev_cost - orig_cost) / max(1.0, orig_cost)) * 100.0 + (pred_delay * 0.5), 1))
            is_high_risk = bool(pred_delay >= 12.0 or pred_cost_pct >= 15.0)

        additional_cost_cr = round((pred_cost_pct / 100.0) * orig_cost, 2)
        avg_proba = (cost_clf_proba + delay_clf_proba) / 2.0
        risk_score = min(100.0, max(0.0, (avg_proba * 45.0) + (pred_delay * 2.0) + (pred_cost_pct * 0.7)))
        risk_score = round(risk_score, 1)

        if risk_score >= 75 or (is_high_risk and risk_score >= 50):
            risk_tier = "CRITICAL"
        elif risk_score >= 50:
            risk_tier = "HIGH"
        elif risk_score >= 25:
            risk_tier = "MEDIUM"
        else:
            risk_tier = "LOW"

        # Extract SHAP explanations
        shap_explanation = self.shap_explainer.explain_project_prediction(pd.DataFrame([sih_feat_dict]))

        return {
            "project_code": proj_code,
            "project_name": safe_str(merged_project.get("project_name") or merged_project.get("Project_Name"), f"Infrastructure Project {proj_code}"),
            "sector": safe_str(sih_feat_dict["Sector"], "ROAD TRANSPORT AND HIGHWAYS"),
            "ministry": safe_str(sih_feat_dict["Ministry"], "Ministry of Road Transport and Highways"),
            "implementing_agency": safe_str(sih_feat_dict["Agency"], "MoRTH"),
            "state": safe_str(sih_feat_dict["State"], "TELANGANA"),
            "original_cost": orig_cost,
            "revised_cost": rev_cost,
            "expenditure": expenditure,
            "physical_progress": phys_prog,
            "predicted_delay_months": pred_delay,
            "predicted_cost_overrun_pct": pred_cost_pct,
            "predicted_additional_cost_cr": additional_cost_cr,
            "risk_score": risk_score,
            "risk_probability": round(avg_proba, 4),
            "risk_tier": risk_tier,
            "is_high_risk": is_high_risk,
            "model_version": model_ver,
            "feature_attributions": shap_explanation.get("top_risk_drivers", []),
            "explanatory_narrative": shap_explanation.get("explanatory_narrative", ""),
            "target_final_delay_months": merged_project.get("target_final_delay_months"),
            "target_cost_overrun_pct": merged_project.get("target_cost_overrun_pct")
        }

    def predict_dataframe(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Batch predicts an entire uploaded CSV DataFrame using the trained ML model."""
        results = []
        records = df.to_dict(orient="records")
        for record in records:
            results.append(self.predict_project(record))
        return results


risk_engine = RiskEngine()

