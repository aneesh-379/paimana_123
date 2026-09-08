"""
PAIMANA Feature Engineering Module
Computes time-aware risk indicators and ratios per snapshot date M strictly without temporal leakage.
"""

from typing import Tuple, List, Dict
import pandas as pd
import numpy as np


FEATURE_COLUMNS = [
    "original_cost",
    "revised_cost",
    "expenditure",
    "physical_progress",
    "cost_expenditure_ratio",
    "schedule_elapsed_months",
    "target_duration_months",
    "schedule_elapsed_ratio",
    "financial_progress_pct",
    "physical_vs_financial_gap",
    "schedule_variance_ratio",
    "cost_escalation_velocity",
    "sector_encoded",
    "ministry_encoded",
    "state_encoded"
]


class PAIMANAFeatureEngineer:
    """Feature extraction and encoding pipeline for PAIMANA project snapshots."""

    def __init__(self):
        self.sector_map: Dict[str, int] = {}
        self.ministry_map: Dict[str, int] = {}
        self.state_map: Dict[str, int] = {}

    def fit_transform(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str]]:
        """Fits categorical encoders and transforms dataset into feature vectors."""
        df_feats = df.copy()

        # Build categorical vocabulary
        unique_sectors = sorted(df_feats["sector"].dropna().unique().tolist())
        self.sector_map = {sec: i for i, sec in enumerate(unique_sectors)}

        unique_ministries = sorted(df_feats["ministry"].dropna().unique().tolist())
        self.ministry_map = {m: i for i, m in enumerate(unique_ministries)}

        unique_states = sorted(df_feats["state"].dropna().unique().tolist())
        self.state_map = {s: i for i, s in enumerate(unique_states)}

        return self.transform(df_feats)

    def transform(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str]]:
        """Transforms snapshot DataFrame into time-aware ML feature matrix."""
        df_feats = df.copy()

        # Parse dates safely
        sanction_dt = pd.to_datetime(df_feats["sanction_date"], errors="coerce")
        orig_doc_dt = pd.to_datetime(df_feats["original_doc"], errors="coerce")
        snapshot_dt = pd.to_datetime(df_feats["snapshot_date"], errors="coerce")

        # Time elapsed & schedule ratios
        elapsed_days = (snapshot_dt - sanction_dt).dt.days.fillna(180)
        target_days = (orig_doc_dt - sanction_dt).dt.days.fillna(1095)
        target_days = np.where(target_days <= 0, 1095, target_days)

        df_feats["schedule_elapsed_months"] = np.maximum(1.0, elapsed_days / 30.4375)
        df_feats["target_duration_months"] = np.maximum(1.0, target_days / 30.4375)
        df_feats["schedule_elapsed_ratio"] = np.clip(df_feats["schedule_elapsed_months"] / df_feats["target_duration_months"], 0.01, 3.0)

        # Financial & progress ratios
        orig_cost = np.maximum(1.0, df_feats["original_cost"].astype(float))
        rev_cost = np.maximum(1.0, df_feats["revised_cost"].astype(float))
        expenditure = np.maximum(0.0, df_feats["expenditure"].astype(float))
        phys_prog = np.clip(df_feats["physical_progress"].astype(float), 0.0, 100.0)

        df_feats["cost_expenditure_ratio"] = np.clip(expenditure / orig_cost, 0.0, 5.0)
        df_feats["financial_progress_pct"] = np.clip((expenditure / orig_cost) * 100.0, 0.0, 200.0)
        df_feats["physical_vs_financial_gap"] = phys_prog - df_feats["financial_progress_pct"]
        df_feats["schedule_variance_ratio"] = phys_prog / (df_feats["schedule_elapsed_ratio"] * 100.0 + 1e-5)
        df_feats["cost_escalation_velocity"] = (rev_cost - orig_cost) / (df_feats["schedule_elapsed_months"] + 1.0)

        # Categorical encodings with unknown fallback
        df_feats["sector_encoded"] = df_feats["sector"].map(self.sector_map).fillna(-1).astype(int)
        df_feats["ministry_encoded"] = df_feats["ministry"].map(self.ministry_map).fillna(-1).astype(int)
        df_feats["state_encoded"] = df_feats["state"].map(self.state_map).fillna(-1).astype(int)

        # Ensure numeric type for base features
        df_feats["original_cost"] = orig_cost
        df_feats["revised_cost"] = rev_cost
        df_feats["expenditure"] = expenditure
        df_feats["physical_progress"] = phys_prog

        return df_feats, FEATURE_COLUMNS


if __name__ == "__main__":
    from ml.preprocessing.historical_snapshots import generate_paimana_benchmark_dataset
    raw_df = generate_paimana_benchmark_dataset(num_projects=10, snapshots_per_project=3)
    fe = PAIMANAFeatureEngineer()
    transformed_df, cols = fe.fit_transform(raw_df)
    print("Transformed shape:", transformed_df[cols].shape)
    print(transformed_df[cols].head())
